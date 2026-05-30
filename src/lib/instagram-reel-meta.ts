import { parseVideoUrl } from "@/lib/video-url";

export type InstagramReelMeta = {
  thumbnailUrl: string;
  likes: number | null;
  views: number | null;
  comments: number | null;
  authorName: string;
  title: string;
};

const IG_APP_ID = "936619743392459";
const IG_GRAPHQL_DOC_ID = "24368985919464652";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function readSetCookies(response: Response): string[] {
  if (typeof response.headers.getSetCookie === "function") {
    return response.headers.getSetCookie();
  }

  const raw = response.headers.get("set-cookie");
  if (!raw) return [];
  return raw.split(/,(?=[^;]+?=)/);
}

function cookieHeaderFromResponse(response: Response): { cookieHeader: string; csrf: string; lsd: string } {
  const setCookie = readSetCookies(response);
  const cookieHeader = setCookie.map((c) => c.split(";")[0]).join("; ");
  const csrf = setCookie.find((c) => c.startsWith("csrftoken="))?.split(";")[0]?.split("=")[1] ?? "";
  return { cookieHeader, csrf, lsd: "" };
}

function extractLsd(html: string): string {
  return (
    html.match(/"LSD",\[\],\{"token":"([^"]+)"/)?.[1] ??
    html.match(/name="lsd" value="([^"]+)"/)?.[1] ??
    ""
  );
}

type IgGraphItem = {
  like_count?: number;
  comment_count?: number;
  view_count?: number | null;
  play_count?: number | null;
  ig_play_count?: number | null;
  video_view_count?: number | null;
  display_uri?: string;
  image_versions2?: { candidates?: { url?: string }[] };
  user?: { username?: string; full_name?: string };
  caption?: { text?: string } | null;
};

function shortcodeFromUrl(rawUrl: string): string | null {
  const parsed = parseVideoUrl(rawUrl);
  if (parsed?.provider !== "instagram") return null;
  return parsed.id;
}

function pickViews(item: IgGraphItem): number | null {
  for (const value of [item.play_count, item.ig_play_count, item.video_view_count, item.view_count]) {
    if (typeof value === "number" && value > 0) return value;
  }
  return null;
}

function pickThumbnail(item: IgGraphItem): string {
  return item.image_versions2?.candidates?.[0]?.url ?? item.display_uri ?? "";
}

async function fetchViaGraphQl(shortcode: string): Promise<InstagramReelMeta | null> {
  const watchUrl = `https://www.instagram.com/reel/${shortcode}/`;
  const pageRes = await fetch(watchUrl, {
    headers: { "User-Agent": USER_AGENT },
    cache: "no-store",
  });

  if (!pageRes.ok) return null;

  const html = await pageRes.text();
  const { cookieHeader, csrf } = cookieHeaderFromResponse(pageRes);
  const lsd = extractLsd(html);

  const gqlRes = await fetch("https://www.instagram.com/graphql/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
      "X-IG-App-ID": IG_APP_ID,
      "X-CSRFToken": csrf,
      "X-FB-LSD": lsd,
      Cookie: cookieHeader,
      Referer: watchUrl,
      Origin: "https://www.instagram.com",
    },
    body: new URLSearchParams({
      variables: JSON.stringify({ shortcode }),
      doc_id: IG_GRAPHQL_DOC_ID,
      ...(lsd ? { lsd } : {}),
    }).toString(),
    cache: "no-store",
  });

  if (!gqlRes.ok) return null;

  const payload = (await gqlRes.json()) as {
    data?: { xdt_api__v1__media__shortcode__web_info?: { items?: IgGraphItem[] } };
  };
  const item = payload.data?.xdt_api__v1__media__shortcode__web_info?.items?.[0];
  if (!item) return null;

  const author = item.user?.full_name || item.user?.username || "";
  const caption = item.caption?.text?.trim() ?? "";

  return {
    thumbnailUrl: pickThumbnail(item),
    likes: typeof item.like_count === "number" ? item.like_count : null,
    views: pickViews(item),
    comments: typeof item.comment_count === "number" ? item.comment_count : null,
    authorName: author,
    title: caption ? caption.slice(0, 120) : author,
  };
}

async function fetchViaMicrolink(watchUrl: string): Promise<Partial<InstagramReelMeta>> {
  try {
    const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(watchUrl)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};

    const payload = (await res.json()) as {
      data?: {
        image?: { url?: string };
        title?: string;
        author?: string;
        description?: string;
      };
    };
    const data = payload.data;
    if (!data) return {};

    const description = data.description ?? "";
    const likesMatch = description.match(/([\d,.]+[KMB]?)\s+likes/i)?.[1];

    return {
      thumbnailUrl: data.image?.url ?? "",
      authorName: data.author ?? "",
      title: data.title ?? "",
      likes: likesMatch ? parseCompactCount(likesMatch) : null,
    };
  } catch {
    return {};
  }
}

async function fetchViaMetaOembed(watchUrl: string): Promise<Partial<InstagramReelMeta>> {
  const appId = process.env.META_APP_ID?.trim();
  const appSecret = process.env.META_APP_SECRET?.trim();
  if (!appId || !appSecret) return {};

  try {
    const token = `${appId}|${appSecret}`;
    const url = new URL("https://graph.facebook.com/v21.0/instagram_oembed");
    url.searchParams.set("url", watchUrl);
    url.searchParams.set("access_token", token);
    url.searchParams.set("fields", "thumbnail_url,author_name,title");

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return {};

    const data = (await res.json()) as {
      thumbnail_url?: string;
      author_name?: string;
      title?: string;
    };

    return {
      thumbnailUrl: data.thumbnail_url ?? "",
      authorName: data.author_name ?? "",
      title: data.title ?? "",
    };
  } catch {
    return {};
  }
}

async function fetchViewsViaInsights(shortcode: string): Promise<number | null> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const userId = process.env.INSTAGRAM_USER_ID?.trim();
  if (!accessToken || !userId) return null;

  try {
    const url = new URL(`https://graph.facebook.com/v21.0/${userId}/media`);
    url.searchParams.set(
      "fields",
      "id,permalink,like_count,insights.metric(plays,reach,total_interactions)",
    );
    url.searchParams.set("limit", "50");
    url.searchParams.set("access_token", accessToken);

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      data?: {
        permalink?: string;
        insights?: { data?: { name?: string; values?: { value?: number }[] }[] };
      }[];
    };

    const match = data.data?.find((item) => item.permalink?.includes(shortcode));
    const plays = match?.insights?.data?.find((row) => row.name === "plays")?.values?.[0]?.value;
    if (typeof plays === "number" && plays > 0) return plays;

    const reach = match?.insights?.data?.find((row) => row.name === "reach")?.values?.[0]?.value;
    if (typeof reach === "number" && reach > 0) return reach;

    return null;
  } catch {
    return null;
  }
}

export function parseCompactCount(raw: string): number | null {
  const cleaned = raw.replace(/,/g, "").trim();
  const match = cleaned.match(/^([\d.]+)([KMB])?$/i);
  if (!match) return null;

  const base = Number.parseFloat(match[1]);
  if (!Number.isFinite(base)) return null;

  const suffix = match[2]?.toUpperCase();
  if (suffix === "K") return Math.round(base * 1_000);
  if (suffix === "M") return Math.round(base * 1_000_000);
  if (suffix === "B") return Math.round(base * 1_000_000_000);
  return Math.round(base);
}

export async function fetchInstagramReelMeta(rawUrl: string): Promise<InstagramReelMeta | null> {
  const shortcode = shortcodeFromUrl(rawUrl);
  if (!shortcode) return null;

  const watchUrl = `https://www.instagram.com/reel/${shortcode}/`;
  const primary = await fetchViaGraphQl(shortcode);
  const fallback = primary?.thumbnailUrl ? {} : await fetchViaMetaOembed(watchUrl);
  const microlink =
    primary?.thumbnailUrl && primary.likes != null
      ? {}
      : await fetchViaMicrolink(watchUrl);

  const merged: InstagramReelMeta = {
    thumbnailUrl: primary?.thumbnailUrl || fallback.thumbnailUrl || microlink.thumbnailUrl || "",
    likes: primary?.likes ?? microlink.likes ?? null,
    views: primary?.views ?? null,
    comments: primary?.comments ?? null,
    authorName: primary?.authorName || fallback.authorName || microlink.authorName || "",
    title: primary?.title || fallback.title || microlink.title || "",
  };

  if (merged.views == null) {
    merged.views = await fetchViewsViaInsights(shortcode);
  }

  if (!merged.thumbnailUrl && merged.likes == null && merged.views == null) {
    return null;
  }

  return merged;
}
