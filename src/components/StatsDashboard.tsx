"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { AnimatedCounter } from "./AnimatedCounter";

export function StatsDashboard() {
  const { content } = useSiteContent();
  const dashboardStats = content.config.stats;

  return (
    <section id="stats" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-300/80">04 — HUD</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Statistika dashboard
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/50">
            Futuristik HUD — animatsiyali counterlar va neon kontur.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(2,6,23,0.65))] p-1 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(192,132,252,0.14),transparent_40%)]" />
          <div className="relative rounded-[24px] border border-white/[0.06] bg-[#030712]/80 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/50 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_16px_#22d3ee]" />
                </span>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-cyan-200/80">Live stack</p>
                  <p className="text-sm text-white/55">AI pipeline + montaj oqimi</p>
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/45">
                encrypted metrics
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dashboardStats.map((s, idx) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.45 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl transition-opacity group-hover:opacity-100" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-2xl opacity-70" />
                  <p className="text-[11px] font-mono uppercase tracking-widest text-white/45">{s.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                    <AnimatedCounter value={s.value} suffix={s.suffix} prefix={s.prefix} delay={idx * 0.15} />
                  </p>
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-1 flex-1 rounded-full bg-gradient-to-r from-cyan-400/25 to-violet-500/25"
                        style={{ opacity: 0.25 + (i % 5) * 0.12 }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
