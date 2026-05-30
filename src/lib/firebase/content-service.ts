import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  writeBatch,
  deleteDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { isFirebaseConfigured, getFirebaseDb, getFirebaseStorage, initializeFirebase } from "./config";
import { COLLECTIONS, DOC_IDS } from "./paths";
import {
  defaultAnalytics,
  defaultBrands,
  defaultComments,
  defaultConfig,
  defaultVideos,
} from "./defaults";
import { isSameSiteContent, siteContentSignature } from "./content-equality";
import { isWriteGuardActive } from "./write-guard";
import type {
  AnalyticsData,
  BrandItem,
  CommentItem,
  MediaItem,
  SiteConfigDoc,
  SiteContent,
  StatItem,
  VideoItem,
} from "./types";

function requireDb() {
  if (!isFirebaseConfigured() || !initializeFirebase()) {
    throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to web/.env.local and restart.");
  }
  return getFirebaseDb();
}

function requireStorage() {
  if (!isFirebaseConfigured() || !initializeFirebase()) {
    throw new Error("Firebase Storage is not configured.");
  }
  return getFirebaseStorage();
}

export async function seedSiteIfEmpty(): Promise<void> {
  const firestore = requireDb();
  const configRef = doc(firestore, COLLECTIONS.config, DOC_IDS.main);
  const snap = await getDoc(configRef);
  if (snap.exists()) return;

  const batch = writeBatch(firestore);
  batch.set(configRef, defaultConfig);
  batch.set(doc(firestore, COLLECTIONS.analytics, DOC_IDS.summary), defaultAnalytics);

  defaultVideos.forEach((v) => {
    batch.set(doc(firestore, COLLECTIONS.videos, v.id), v);
  });
  defaultBrands.forEach((b) => {
    batch.set(doc(firestore, COLLECTIONS.brands, b.id), b);
  });
  defaultComments.forEach((c) => {
    batch.set(doc(firestore, COLLECTIONS.comments, c.id), c);
  });

  await batch.commit();
}

async function fetchVideos(): Promise<VideoItem[]> {
  const firestore = requireDb();
  const q = query(collection(firestore, COLLECTIONS.videos), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as VideoItem);
}

async function fetchBrands(): Promise<BrandItem[]> {
  const firestore = requireDb();
  const q = query(collection(firestore, COLLECTIONS.brands), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as BrandItem);
}

async function fetchComments(): Promise<CommentItem[]> {
  const firestore = requireDb();
  const snap = await getDocs(collection(firestore, COLLECTIONS.comments));
  return snap.docs.map((d) => d.data() as CommentItem);
}

export async function fetchSiteContent(): Promise<SiteContent> {
  const firestore = requireDb();
  const [configSnap, analyticsSnap, videos, brands, comments] = await Promise.all([
    getDoc(doc(firestore, COLLECTIONS.config, DOC_IDS.main)),
    getDoc(doc(firestore, COLLECTIONS.analytics, DOC_IDS.summary)),
    fetchVideos(),
    fetchBrands(),
    fetchComments(),
  ]);

  return {
    config: configSnap.exists() ? (configSnap.data() as SiteConfigDoc) : defaultConfig,
    analytics: analyticsSnap.exists() ? (analyticsSnap.data() as AnalyticsData) : defaultAnalytics,
    videos,
    brands,
    comments,
  };
}

function needsBrandReseed(items: BrandItem[]): boolean {
  if (items.length !== defaultBrands.length) return true;
  return defaultBrands.some((expected) => {
    const found = items.find((b) => b.id === expected.id);
    return !found || found.logoUrl !== expected.logoUrl || found.name !== expected.name;
  });
}

async function migrateLegacyBrands(items: BrandItem[]): Promise<BrandItem[]> {
  if (!needsBrandReseed(items)) return items;

  try {
    const firestore = requireDb();
    const batch = writeBatch(firestore);
    const existing = await getDocs(collection(firestore, COLLECTIONS.brands));
    existing.docs.forEach((d) => batch.delete(d.ref));
    defaultBrands.forEach((b) => {
      batch.set(doc(firestore, COLLECTIONS.brands, b.id), b);
    });
    await batch.commit();
  } catch {
    /* offline — render bundled defaults locally */
  }

  return defaultBrands;
}

function needsVideoReseed(items: VideoItem[]): boolean {
  if (items.length !== defaultVideos.length) return true;
  return defaultVideos.some((expected) => {
    const found = items.find((v) => v.id === expected.id);
    return !found || found.videoUrl !== expected.videoUrl || found.views !== expected.views;
  });
}

async function migrateLegacyVideos(items: VideoItem[]): Promise<VideoItem[]> {
  if (!needsVideoReseed(items)) return items;

  try {
    const firestore = requireDb();
    const batch = writeBatch(firestore);
    const existing = await getDocs(collection(firestore, COLLECTIONS.videos));
    existing.docs.forEach((d) => batch.delete(d.ref));
    defaultVideos.forEach((v) => {
      batch.set(doc(firestore, COLLECTIONS.videos, v.id), v);
    });
    await batch.commit();
  } catch {
    /* offline — render bundled defaults locally */
  }

  return defaultVideos;
}

function needsStatsMigration(stats: StatItem[]): boolean {
  const expected = defaultConfig.stats;
  if (stats.length !== expected.length) return true;
  return expected.some((item) => {
    const found = stats.find((s) => s.key === item.key);
    return !found || found.value !== item.value || found.suffix !== item.suffix || found.label !== item.label;
  });
}

async function migrateLegacyStats(stats: StatItem[]): Promise<StatItem[]> {
  if (!needsStatsMigration(stats)) return stats;

  try {
    const firestore = requireDb();
    const configRef = doc(firestore, COLLECTIONS.config, DOC_IDS.main);
    const snap = await getDoc(configRef);
    if (snap.exists()) {
      const config = snap.data() as SiteConfigDoc;
      await setDoc(configRef, {
        ...config,
        stats: defaultConfig.stats,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch {
    /* offline — render bundled defaults locally */
  }

  return defaultConfig.stats;
}

export function subscribeSiteContent(onData: (content: SiteContent) => void): Unsubscribe {
  if (!isFirebaseConfigured() || !initializeFirebase()) {
    onData({
      config: defaultConfig,
      analytics: defaultAnalytics,
      videos: defaultVideos,
      brands: defaultBrands,
      comments: defaultComments,
    });
    return () => {};
  }

  const firestore = requireDb();
  let config: SiteConfigDoc = defaultConfig;
  let analytics: AnalyticsData = defaultAnalytics;
  let videos: VideoItem[] = defaultVideos;
  let brands: BrandItem[] = defaultBrands;
  let comments: CommentItem[] = defaultComments;

  let lastSig = "";
  let emitTimer: ReturnType<typeof setTimeout> | undefined;

  const emit = () => {
    if (isWriteGuardActive()) return;

    const payload: SiteContent = { config, analytics, videos, brands, comments };
    const sig = siteContentSignature(payload);
    if (sig === lastSig) return;
    lastSig = sig;

    if (emitTimer) clearTimeout(emitTimer);
    emitTimer = setTimeout(() => onData(payload), 150);
  };

  const unsubConfig = onSnapshot(doc(firestore, COLLECTIONS.config, DOC_IDS.main), async (snap) => {
    if (snap.exists()) {
      const loaded = snap.data() as SiteConfigDoc;
      const stats = await migrateLegacyStats(loaded.stats);
      config = { ...loaded, stats };
    }
    emit();
  });

  const unsubAnalytics = onSnapshot(doc(firestore, COLLECTIONS.analytics, DOC_IDS.summary), (snap) => {
    if (snap.exists()) analytics = snap.data() as AnalyticsData;
    emit();
  });

  const unsubVideos = onSnapshot(
    query(collection(firestore, COLLECTIONS.videos), orderBy("order", "asc")),
    async (snap) => {
      const loaded = snap.docs.map((d) => d.data() as VideoItem);
      videos = await migrateLegacyVideos(loaded);
      emit();
    },
  );

  const unsubBrands = onSnapshot(
    query(collection(firestore, COLLECTIONS.brands), orderBy("order", "asc")),
    async (snap) => {
      const loaded = snap.docs.map((d) => d.data() as BrandItem);
      brands = await migrateLegacyBrands(loaded);
      emit();
    },
  );

  const unsubComments = onSnapshot(collection(firestore, COLLECTIONS.comments), (snap) => {
    comments = snap.docs.map((d) => d.data() as CommentItem);
    emit();
  });

  return () => {
    if (emitTimer) clearTimeout(emitTimer);
    unsubConfig();
    unsubAnalytics();
    unsubVideos();
    unsubBrands();
    unsubComments();
  };
}

function stripUpdatedAt(doc: SiteConfigDoc): Omit<SiteConfigDoc, "updatedAt"> {
  const { updatedAt: _, ...rest } = doc;
  return rest;
}

export async function saveSiteConfig(
  config: SiteConfigDoc,
  options?: { skipIfUnchanged?: boolean },
): Promise<void> {
  const firestore = requireDb();
  const ref = doc(firestore, COLLECTIONS.config, DOC_IDS.main);

  if (options?.skipIfUnchanged) {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const existing = snap.data() as SiteConfigDoc;
      if (JSON.stringify(stripUpdatedAt(existing)) === JSON.stringify(stripUpdatedAt(config))) {
        return;
      }
    }
  }

  await setDoc(ref, {
    ...config,
    updatedAt: new Date().toISOString(),
  });
}

export async function saveAnalytics(data: AnalyticsData): Promise<void> {
  const firestore = requireDb();
  await setDoc(doc(firestore, COLLECTIONS.analytics, DOC_IDS.summary), data);
}

export async function saveVideo(video: VideoItem): Promise<void> {
  const firestore = requireDb();
  await setDoc(doc(firestore, COLLECTIONS.videos, video.id), video);
}

export async function deleteVideo(id: string): Promise<void> {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, COLLECTIONS.videos, id));
}

export async function reorderVideos(items: VideoItem[]): Promise<void> {
  const firestore = requireDb();
  const batch = writeBatch(firestore);
  items.forEach((item, index) => {
    batch.set(doc(firestore, COLLECTIONS.videos, item.id), { ...item, order: index });
  });
  await batch.commit();
}

export async function saveBrand(brand: BrandItem): Promise<void> {
  const firestore = requireDb();
  await setDoc(doc(firestore, COLLECTIONS.brands, brand.id), brand);
}

export async function deleteBrand(id: string): Promise<void> {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, COLLECTIONS.brands, id));
}

export async function reorderBrands(items: BrandItem[]): Promise<void> {
  const firestore = requireDb();
  const batch = writeBatch(firestore);
  items.forEach((item, index) => {
    batch.set(doc(firestore, COLLECTIONS.brands, item.id), { ...item, order: index });
  });
  await batch.commit();
}

export async function saveComment(comment: CommentItem): Promise<void> {
  const firestore = requireDb();
  await setDoc(doc(firestore, COLLECTIONS.comments, comment.id), comment);
}

export async function deleteComment(id: string): Promise<void> {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, COLLECTIONS.comments, id));
}

export async function fetchMedia(): Promise<MediaItem[]> {
  const firestore = requireDb();
  const snap = await getDocs(collection(firestore, COLLECTIONS.media));
  return snap.docs
    .map((d) => d.data() as MediaItem)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function subscribeMedia(onData: (items: MediaItem[]) => void): Unsubscribe {
  if (!initializeFirebase()) return () => {};
  const firestore = requireDb();
  return onSnapshot(collection(firestore, COLLECTIONS.media), (snap) => {
    const items = snap.docs
      .map((d) => d.data() as MediaItem)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    onData(items);
  });
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  const firestore = requireDb();
  await setDoc(doc(firestore, COLLECTIONS.media, item.id), item);
}

export async function deleteMediaItem(item: MediaItem): Promise<void> {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, COLLECTIONS.media, item.id));
  if (item.storagePath) {
    try {
      await deleteObject(ref(requireStorage(), item.storagePath));
    } catch {
      /* file may already be removed */
    }
  }
}

export function uploadFile(
  path: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  const bucket = requireStorage();
  const storageRef = ref(bucket, path);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        const pct = snap.totalBytes ? (snap.bytesTransferred / snap.totalBytes) * 100 : 0;
        onProgress(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      },
    );
  });
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
