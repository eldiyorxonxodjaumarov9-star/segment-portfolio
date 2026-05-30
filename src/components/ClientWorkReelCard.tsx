"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { canEmbedVideo } from "@/lib/video-url";
import { VideoPlayerModal } from "./VideoPlayerModal";

type ReelMeta = {
  thumbnailUrl?: string;
  title?: string;
  authorName?: string;
};

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function ClientWorkReelCard({ videoUrl, client }: { videoUrl: string; client: string }) {
  const [meta, setMeta] = useState<ReelMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);

  const playable = canEmbedVideo(videoUrl);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);

    fetch(`/api/instagram-reel?url=${encodeURIComponent(videoUrl)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("fetch failed"))))
      .then((data: ReelMeta) => {
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
  }, [videoUrl]);

  return (
    <>
      <button
        type="button"
        disabled={!playable}
        onClick={() => playable && setOpen(true)}
        className={`group relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a10] text-left shadow-[0_24px_60px_rgba(168,85,247,0.12)] ${playable ? "cursor-pointer" : "cursor-default"}`}
        aria-label={`${client} — videoni ko‘rish`}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-pulse rounded-full border border-violet-400/30 bg-violet-400/10" />
          </div>
        ) : failed || !meta?.thumbnailUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
            <PlayIcon className="h-10 w-10 opacity-50" />
            <p className="text-xs">Oblojka yuklanmoqda</p>
          </div>
        ) : (
          <Image
            src={meta.thumbnailUrl}
            alt={client}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 384px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030308] via-transparent to-transparent opacity-80" />

        {playable && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/50 shadow-[0_0_40px_rgba(168,85,247,0.35)] backdrop-blur-md">
              <PlayIcon className="ml-1 h-8 w-8 text-white" />
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-white/80 backdrop-blur-md">
          {client}
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-center backdrop-blur-md">
          <p className="text-xs text-white/70">Bosing — video ochiladi</p>
        </div>
      </button>

      {playable && (
        <VideoPlayerModal
          open={open}
          videoUrl={videoUrl}
          title={meta?.title || client}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
