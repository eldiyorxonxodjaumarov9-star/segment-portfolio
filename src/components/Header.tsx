"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "./Logo";
import {
  AnimatedSocialLink,
  IconInstagramOfficial,
  IconTelegramOfficial,
  IconYoutubeOfficial,
} from "./SocialIcons";
import { useSiteContent } from "@/contexts/SiteContentContext";

const nav = [
  { href: "#brands", label: "Brendlar" },
  { href: "#videos", label: "Top videolar" },
  { href: "#works", label: "Zakazlar" },
  { href: "#stats", label: "Statistika" },
  { href: "#team", label: "Jamoa" },
  { href: "#about", label: "Men haqimda" },
  { href: "#contact", label: "Bog‘lanish" },
];

export function Header() {
  const { content } = useSiteContent();
  const socialLinks = content.config.social;

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#030308]/40 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#hero" className="group flex items-center gap-1 outline-none">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] p-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-1.5 py-1 sm:px-2">
            <AnimatedSocialLink href={socialLinks.telegram} label="Telegram: AI SEGMENT | PROYEKTLAR">
              <IconTelegramOfficial />
            </AnimatedSocialLink>
            <AnimatedSocialLink href={socialLinks.instagram} label="Instagram: @ai_segment">
              <IconInstagramOfficial />
            </AnimatedSocialLink>
            <AnimatedSocialLink href={socialLinks.youtube} label="YouTube: @ai_segment Shorts">
              <IconYoutubeOfficial />
            </AnimatedSocialLink>
          </div>

          <Link
            href="#contact"
            className="hidden rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-black shadow-[0_0_24px_rgba(34,211,238,0.35)] sm:inline-flex"
          >
            Hamkorlik
          </Link>
        </div>
      </div>

      <div className="flex border-t border-white/[0.04] px-2 py-2 lg:hidden">
        <div className="scrollbar-none flex w-full gap-1 overflow-x-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-white/65"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
