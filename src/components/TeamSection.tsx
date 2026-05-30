"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const perks = [
  { label: "Kunlik output", value: "20+", accent: "text-cyan-300" },
  { label: "AI pipeline", value: "7+", accent: "text-violet-300" },
  { label: "Tez yetkazish", value: "24s", accent: "text-fuchsia-300" },
];

function HudCorner({ className }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute h-5 w-5 border-cyan-400/50 ${className ?? ""}`}
      aria-hidden
    />
  );
}

export function TeamSection() {
  return (
    <section id="team" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_15%_50%,rgba(34,211,238,0.1),transparent),radial-gradient(ellipse_45%_40%_at_90%_30%,rgba(192,132,252,0.12),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/35 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-fuchsia-300/80">05 — Jamoa</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">SEGMENT TEAM</h2>
          </div>
          <p className="max-w-md text-sm text-white/45">AI + montaj jamoasi — kunlik viral kontent oqimi.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(2,6,23,0.75))] p-1 shadow-[0_0_80px_rgba(168,85,247,0.1)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_200deg_at_30%_20%,rgba(34,211,238,0.14),transparent_35%,rgba(232,121,249,0.12),transparent_70%)]" />

          <div className="relative grid gap-8 rounded-[24px] border border-white/[0.06] bg-[#030712]/75 p-6 sm:p-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-center lg:gap-12 lg:p-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="relative mx-auto w-full max-w-[340px] lg:mx-0"
            >
              <div className="pointer-events-none absolute -inset-4 rounded-[22px] bg-gradient-to-br from-cyan-400/20 via-transparent to-violet-500/25 blur-2xl" />

              <div className="relative rotate-[-1.5deg] transition-transform duration-500 hover:rotate-0">
                <div className="relative overflow-hidden rounded-[20px] border border-cyan-400/20 bg-[#0a0a14] p-2 shadow-[0_24px_70px_rgba(34,211,238,0.12)]">
                  <HudCorner className="left-2 top-2 border-l-2 border-t-2" />
                  <HudCorner className="right-2 top-2 border-r-2 border-t-2" />
                  <HudCorner className="bottom-2 left-2 border-b-2 border-l-2" />
                  <HudCorner className="bottom-2 right-2 border-b-2 border-r-2" />

                  <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,#111827_0%,#030712_100%)]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.12),transparent_55%)]" />
                    <Image
                      src="/team/segment-team.png"
                      alt="SEGMENT TEAM"
                      fill
                      sizes="(max-width: 1024px) 340px, 340px"
                      className="object-contain object-center p-2"
                      quality={95}
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#030712] to-transparent" />
                    <motion.div
                      className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
                      animate={{ y: ["0%", "420%", "0%"] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">Live crew</span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-300/80">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-70" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      online
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="relative space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">Production unit</span>
                <span className="h-1 w-1 rounded-full bg-cyan-300" />
                <span className="text-[11px] font-medium text-cyan-200/90">SEGMENT TEAM</span>
              </div>

              <h3 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                Komanda ishlaydi — kuniga{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                    20+
                  </span>
                  <motion.span
                    className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-lg bg-cyan-400/10 blur-md"
                    animate={{ opacity: [0.35, 0.7, 0.35] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>{" "}
                video qila olamiz
              </h3>

              <p className="max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
                AI montaj, viral format va tez yetkazish — brendingiz uchun doimiy kontent oqimi. Har bir loyiha tez,
                sifatli va platformaga mos tayyorlanadi.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {perks.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
                  >
                    <p className={`text-xl font-semibold tabular-nums ${item.accent}`}>{item.value}</p>
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-white/40">{item.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {["Runway", "After Effects", "DaVinci", "Midjourney", "CapCut Pro"].map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-violet-400/15 bg-violet-500/5 px-3 py-1 text-[11px] text-violet-100/75"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
