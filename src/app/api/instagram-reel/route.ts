import { NextResponse } from "next/server";
import { fetchInstagramReelMeta } from "@/lib/instagram-reel-meta";
import { parseVideoUrl } from "@/lib/video-url";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  const parsed = parseVideoUrl(rawUrl);
  if (parsed?.provider !== "instagram") {
    return NextResponse.json({ error: "instagram url required" }, { status: 400 });
  }

  try {
    const meta = await fetchInstagramReelMeta(rawUrl);
    if (!meta) {
      return NextResponse.json({ error: "metadata unavailable" }, { status: 502 });
    }

    return NextResponse.json({
      thumbnailUrl: meta.thumbnailUrl,
      likes: meta.likes,
      views: meta.views,
      comments: meta.comments,
      authorName: meta.authorName,
      title: meta.title,
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
