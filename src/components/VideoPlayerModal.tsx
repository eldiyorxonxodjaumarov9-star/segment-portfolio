"use client";

import { AnimatePresence, motion } from "framer-motion";
import { parseVideoUrl } from "@/lib/video-url";

export function VideoPlayerModal({
  videoUrl,
  title,
  open,
  onClose,
}: {
  videoUrl: string;
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  const parsed = parseVideoUrl(videoUrl);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Yopish"
          />

          <motion.div
            className="relative z-[1] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12] shadow-[0_0_80px_rgba(34,211,238,0.15)]"
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-5">
              <p className="truncate pr-4 text-sm font-medium text-white/90">{title}</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/20 hover:text-white"
              >
                Yopish ✕
              </button>
            </div>

            {parsed?.provider === "youtube" && parsed.embedUrl ? (
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={parsed.embedUrl}
                  title={title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : parsed?.provider === "instagram" && parsed.embedUrl ? (
              <div className="relative mx-auto aspect-[9/16] w-full max-w-sm bg-black">
                <iframe
                  src={parsed.embedUrl}
                  title={title}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
                <p className="text-sm text-white/55">Video brauzerda ochiladi.</p>
                <a
                  href={parsed?.watchUrl ?? videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2.5 text-sm font-semibold text-black"
                >
                  Videoni ko‘rish
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
