"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { formatCompact, formatFull } from "@/lib/format";
import { canEmbedVideo, getVideoThumbnailUrl, parseVideoUrl } from "@/lib/video-url";
import { VideoPlayerModal } from "./VideoPlayerModal";
import type { VideoItem } from "@/lib/firebase/types";

type InstagramReelStats = {
  thumbnailUrl?: string;
  likes?: number | null;
  views?: number | null;
};

function ViewIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function useInstagramReelMeta(videoUrl?: string) {
  const parsed = videoUrl ? parseVideoUrl(videoUrl) : null;
  const isInstagram = parsed?.provider === "instagram";

  const [meta, setMeta] = useState<InstagramReelStats | null>(null);
  const [loading, setLoading] = useState(isInstagram);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isInstagram || !videoUrl) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setFailed(false);

    fetch(`/api/instagram-reel?url=${encodeURIComponent(videoUrl)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("fetch failed"))))
      .then((data: InstagramReelStats) => {
        if (!cancelled) setMeta(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [videoUrl, isInstagram]);

  return { isInstagram, meta, loading, failed };
}

function VideoThumbnail({
  video,
  alt,
  priority,
  meta,
  loading,
  failed,
}: {
  video: VideoItem;
  alt: string;
  priority?: boolean;
  meta: InstagramReelStats | null;
  loading: boolean;
  failed: boolean;
}) {
  const parsed = video.videoUrl ? parseVideoUrl(video.videoUrl) : null;
  const isInstagram = parsed?.provider === "instagram";
  const [src, setSrc] = useState(() => getVideoThumbnailUrl(video));
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (meta?.thumbnailUrl) setSrc(meta.thumbnailUrl);
  }, [meta?.thumbnailUrl]);

  if (loading && isInstagram) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a10]">
        <div className="h-10 w-10 animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10" />
      </div>
    );
  }

  if (imageFailed || failed || !src || src.startsWith("/videos/")) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#12121a] to-[#0a0a10] text-white/40">
        <PlayIcon className="h-10 w-10 opacity-50" />
        <p className="text-xs">{failed ? "Instagram ma’lumoti topilmadi" : "Oblojka yuklanmoqda"}</p>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover object-center transition-transform duration-700 group-hover/thumb:scale-[1.03]"
      priority={priority}
      onError={() => setImageFailed(true)}
    />
  );
}

function VideoCard({
  video,
  index,
  onPlay,
}: {
  video: VideoItem;
  index: number;
  onPlay: (video: VideoItem) => void;
}) {
  const hasLink = Boolean(video.videoUrl?.trim());
  const parsed = video.videoUrl ? parseVideoUrl(video.videoUrl) : null;
  const playable = hasLink && canEmbedVideo(video.videoUrl);
  const { isInstagram, meta, loading: metaLoading, failed: metaFailed } = useInstagramReelMeta(video.videoUrl);

  const views = video.views > 0 ? video.views : isInstagram ? (meta?.views ?? null) : null;
  const showLikes = video.views <= 0 && (isInstagram ? meta?.likes != null : video.likes > 0);
  const likes = showLikes ? (isInstagram ? meta?.likes ?? null : video.likes) : null;
  const statsLoading = isInstagram && metaLoading && video.views <= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-[border-color,box-shadow] duration-500 hover:border-cyan-400/20 hover:shadow-[0_20px_50px_rgba(34,211,238,0.08)]"
    >
      <button
        type="button"
        disabled={!playable}
        onClick={() => playable && onPlay(video)}
        className={`group/thumb relative block w-full aspect-[9/16] overflow-hidden bg-[#0a0a10] text-left ${playable ? "cursor-pointer" : "cursor-default"}`}
        aria-label={playable ? `${video.title} — videoni ko‘rish` : video.title}
      >
        <VideoThumbnail
          video={video}
          alt={video.title}
          priority={index < 3}
          meta={meta}
          loading={metaLoading}
          failed={metaFailed}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030308] via-[#030308]/25 to-transparent" />

        {playable && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/50 shadow-[0_0_40px_rgba(34,211,238,0.35)] backdrop-blur-md">
              <PlayIcon className="ml-1 h-8 w-8 text-white" />
            </div>
          </div>
        )}

        {(video.pinned || video.featured) && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md">
            {video.pinned ? "Pinned" : "Top"}
          </div>
        )}

        {(statsLoading || views != null || likes != null) && (
          <div
            className={`pointer-events-none absolute bottom-3 left-3 right-3 flex items-end gap-2 ${views != null || statsLoading ? "justify-between" : "justify-end"}`}
          >
            {(statsLoading || views != null) && (
              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-black/55 px-3 py-2.5 backdrop-blur-md">
                <ViewIcon className="h-4 w-4 shrink-0 text-cyan-300" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-white/50">Ko‘rildi</p>
                  {statsLoading ? (
                    <div className="mt-1 h-5 w-20 animate-pulse rounded bg-white/10" />
                  ) : views != null ? (
                    <p className="truncate text-base font-semibold tabular-nums text-white">
                      {formatCompact(views)}
                      <span className="ml-1.5 text-xs font-normal text-white/45">({formatFull(views)})</span>
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            {(statsLoading || likes != null) && (
              <div
                className={`flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-black/55 px-2.5 py-2 backdrop-blur-md ${views == null && !statsLoading ? "min-w-[8.5rem] justify-center px-3 py-2.5" : ""}`}
              >
                <HeartIcon className="h-3.5 w-3.5 text-fuchsia-300" />
                {statsLoading ? (
                  <div className="h-4 w-10 animate-pulse rounded bg-white/10" />
                ) : likes != null ? (
                  <span className={`font-medium tabular-nums text-white/90 ${views == null ? "text-base" : "text-sm"}`}>
                    {formatCompact(likes)}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        )}
      </button>

      <div className="space-y-2 border-t border-white/[0.06] p-4 sm:p-5">
        <h3 className="text-base font-semibold leading-snug tracking-tight text-white">{video.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-white/50">{video.description}</p>
        {hasLink && (
          <p className="text-xs text-cyan-300/70">
            {parsed?.provider === "instagram"
              ? "Instagram — oblojka va statistika avtomatik"
              : playable
                ? "Bosing — video ochiladi"
                : "Video linki qo‘yilgan"}
          </p>
        )}
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">{video.uploadedAt}</p>
      </div>
    </motion.article>
  );
}

export function TopVideos() {
  const { content } = useSiteContent();
  const topVideos = [...content.videos].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState<VideoItem | null>(null);

  const handlePlay = (video: VideoItem) => {
    if (!video.videoUrl?.trim()) return;
    const parsed = parseVideoUrl(video.videoUrl);
    if (parsed?.provider === "youtube" || parsed?.provider === "instagram") {
      setActive(video);
      return;
    }
    window.open(parsed?.watchUrl ?? video.videoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section id="videos" className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(168,85,247,0.1),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-fuchsia-300/80">02 — Top</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Eng ko‘p ko‘rilgan videolar
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/45">
              Instagram link — oblojka va layklar avtomatik. Bosing — video ochiladi.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topVideos.map((v, idx) => (
              <VideoCard key={v.id} video={v} index={idx} onPlay={handlePlay} />
            ))}
          </div>
        </div>
      </section>

      {active?.videoUrl && (
        <VideoPlayerModal
          open={Boolean(active)}
          videoUrl={active.videoUrl}
          title={active.title}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
