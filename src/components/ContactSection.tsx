"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { CopyrightYear } from "./CopyrightYear";
import { IconInstagramOfficial, IconTelegramOfficial, IconYoutubeOfficial } from "./SocialIcons";

const rel = "noopener noreferrer";

export function ContactSection() {
  const { content } = useSiteContent();
  const social = content.config.social;

  const items = [
    { label: "Telegram — loyiha kanali", sub: social.telegram.replace(/https?:\/\/(t\.me\/)?/, "@"), href: social.telegram, Icon: IconTelegramOfficial },
    { label: "Instagram", sub: social.instagram.replace(/https?:\/\/(www\.)?instagram\.com\//, "@"), href: social.instagram, Icon: IconInstagramOfficial },
    { label: "YouTube — Shorts", sub: "@ai_segment", href: social.youtube, Icon: IconYoutubeOfficial },
    { label: "Telegram — hamkorlik", sub: social.telegramPartner.replace(/https?:\/\/(t\.me\/)?/, "@"), href: social.telegramPartner, Icon: IconTelegramOfficial },
  ].filter((i) => i.href);

  return (
    <section id="contact" className="relative pb-24 pt-12 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[32px] border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(2,6,23,0.85))] p-[1px] shadow-[0_0_90px_rgba(34,211,238,0.18)]"
        >
          <div className="relative rounded-[31px] bg-[#030712]/90 px-6 py-10 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(192,132,252,0.2),transparent_45%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-300/80">07 — Contact</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                  Hamkorlik uchun bog‘laning
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/55">
                  Reklama, brend hikoya, viral seriya yoki investor pitch — qisqa brif yuboring, 24 soat ichida
                  yo‘nalish va timeline qaytaman.
                </p>
                <motion.a
                  href={social.telegramPartner}
                  target="_blank"
                  rel={rel}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-500 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-black shadow-[0_0_40px_rgba(34,211,238,0.35)]"
                >
                  @segment_admin — yozish
                </motion.a>
              </div>

              <div className="relative space-y-3 rounded-2xl border border-white/[0.08] bg-black/40 p-4 backdrop-blur-xl sm:p-5">
                {items.map((it) => {
                  const Icon = it.Icon;
                  return (
                    <motion.a
                      key={it.label}
                      href={it.href}
                      target="_blank"
                      rel={rel}
                      whileHover={{ x: 6, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white/80 shadow-[0_0_0_0_rgba(34,211,238,0)] transition-[border-color,box-shadow] duration-300 hover:border-cyan-400/40 hover:text-white hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-black/50 transition-transform duration-300 group-hover:scale-110 group-hover:border-cyan-400/25">
                          <Icon className="h-[22px] w-[22px]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium text-white">{it.label}</span>
                          <span className="block truncate text-xs text-white/45">{it.sub}</span>
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-white/35 transition-colors group-hover:text-cyan-300/90">
                        ↗
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <p className="mt-10 text-center text-[11px] text-white/35">
          © <CopyrightYear /> AI SEGMENT — Premium Portfolio
          <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] text-cyan-300/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        </p>
      </div>
    </section>
  );
}
