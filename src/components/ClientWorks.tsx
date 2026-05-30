"use client";

import { motion } from "framer-motion";
import { clientWorks } from "@/data/content";
import { ClientWorkReelCard } from "./ClientWorkReelCard";

export function ClientWorks() {
  const work = clientWorks[0];

  return (
    <section id="works" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-violet-300/80">03 — Zakazlar</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Eng viral zakaz videolar
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/50">
            Instagram Reels — bosing va to‘liq videoni ko‘ring.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-center gap-8 lg:grid-cols-2"
        >
          <ClientWorkReelCard videoUrl={work.videoUrl} client={work.client} />

          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-white sm:text-2xl">{work.client}</h3>
            <p className="text-sm leading-relaxed text-white/55">{work.caption}</p>
            <a
              href={work.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition-colors hover:border-violet-400/50 hover:bg-violet-500/15"
            >
              Instagram’da ochish
              <span aria-hidden>↗</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
