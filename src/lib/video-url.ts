export type VideoProvider = "youtube" | "instagram" | "unknown";

export type ParsedVideoLink = {
  provider: VideoProvider;
  id: string;
  embedUrl: string;
  thumbnailUrl: string;
  watchUrl: string;
};

function youtubeIdFromUrl(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "shorts" && parts[1]) return parts[1];
    if (parts[0] === "embed" && parts[1]) return parts[1];
    if (parts[0] === "live" && parts[1]) return parts[1];
    return url.searchParams.get("v");
  }

  return null;
}

function instagramShortcodeFromUrl(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (!host.includes("instagram.com")) return null;

  const match = url.pathname.match(/\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  return match?.[1] ?? null;
}

export function parseVideoUrl(raw: string): ParsedVideoLink | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const ytId = youtubeIdFromUrl(url);

    if (ytId) {
      return {
        provider: "youtube",
        id: ytId,
        embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
        thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        watchUrl: `https://www.youtube.com/watch?v=${ytId}`,
      };
    }

    const igId = instagramShortcodeFromUrl(url);
    if (igId) {
      const watchUrl = `https://www.instagram.com/reel/${igId}/`;
      return {
        provider: "instagram",
        id: igId,
        embedUrl: `${watchUrl}embed/`,
        thumbnailUrl: "",
        watchUrl,
      };
    }

    return {
      provider: "unknown",
      id: "",
      embedUrl: "",
      thumbnailUrl: "",
      watchUrl: url.toString(),
    };
  } catch {
    return null;
  }
}

export function getVideoThumbnailUrl(video: {
  thumbUrl?: string;
  videoUrl?: string;
  id: string;
}): string {
  if (video.thumbUrl?.trim()) return video.thumbUrl.trim();

  const parsed = video.videoUrl ? parseVideoUrl(video.videoUrl) : null;
  if (parsed?.thumbnailUrl) return parsed.thumbnailUrl;

  return `/videos/${video.id}.png`;
}

export function canEmbedVideo(videoUrl?: string): boolean {
  const parsed = videoUrl ? parseVideoUrl(videoUrl) : null;
  return parsed?.provider === "youtube" || parsed?.provider === "instagram";
}

export function normalizeInstagramWatchUrl(raw: string): string {
  const parsed = parseVideoUrl(raw);
  if (parsed?.provider === "instagram") return parsed.watchUrl;
  return raw.trim();
}
