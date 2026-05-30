import { NextResponse } from "next/server";
import { fetchInstagramReelMeta } from "@/lib/instagram-reel-meta";
import { parseVideoUrl } from "@/lib/video-url";

/** @deprecated Use /api/instagram-reel — kept for older clients */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  if (parseVideoUrl(rawUrl)?.provider !== "instagram") {
    return NextResponse.json({ error: "instagram url required" }, { status: 400 });
  }

  try {
    const meta = await fetchInstagramReelMeta(rawUrl);
    if (!meta) {
      return NextResponse.json({ error: "metadata unavailable" }, { status: 502 });
    }

    return NextResponse.json({
      thumbnailUrl: meta.thumbnailUrl,
      title: meta.title,
      authorName: meta.authorName,
      likes: meta.likes,
      views: meta.views,
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
