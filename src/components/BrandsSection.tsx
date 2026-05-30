"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/contexts/SiteContentContext";
import Image from "next/image";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function formatHandle(name: string): string {
  const trimmed = name.trim();
  if (trimmed.startsWith("@")) return trimmed;
  return `@${trimmed.replace(/\s+/g, "")}`;
}

function InstagramCard({
  brand,
}: {
  brand: { id: string; name: string; tone: string; logoUrl: string; instagramUrl?: string };
}) {
  const handle = formatHandle(brand.name);
  const Wrapper = brand.instagramUrl ? "a" : "div";
  const linkProps = brand.instagramUrl
    ? { href: brand.instagramUrl, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group shrink-0"
    >
      <Wrapper
        {...linkProps}
        className="relative block w-[min(78vw,280px)] cursor-pointer sm:w-[300px] lg:w-[320px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030308]"
        aria-label={brand.instagramUrl ? `${handle} Instagram profili` : handle}
      >
        <div
          className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${brand.tone} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60`}
        />

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c0c14] shadow-[0_16px_48px_rgba(0,0,0,0.5)] transition-[border-color,box-shadow,transform] duration-500 group-hover:border-cyan-400/25 group-hover:shadow-[0_20px_56px_rgba(34,211,238,0.1)]">
          <div className="relative overflow-hidden bg-[#f4f4f5]">
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={`${handle} Instagram profili`}
                width={640}
                height={960}
                sizes="(min-width: 1024px) 320px, 280px"
                className="block h-auto w-full"
                unoptimized={brand.logoUrl.startsWith("http")}
              />
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 bg-[#0a0a10] px-6 py-12">
                <InstagramIcon className="h-7 w-7 text-cyan-400/60" />
                <p className="text-xs text-white/40">Screenshot yuklanadi</p>
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#030308]/90 via-[#030308]/50 to-transparent px-4 pb-3.5 pt-16">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <InstagramIcon className="h-3.5 w-3.5 text-cyan-200" />
                </span>
                <span className="truncate text-sm font-medium tracking-tight text-white">{handle}</span>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}

export function BrandsSection() {
  const { content } = useSiteContent();
  const brands = [...content.brands].sort((a, b) => a.order - b.order);
  const row = brands.length ? [...brands, ...brands, ...brands] : [];
  const carouselDuration = Math.max(brands.length * 12, 180);

  return (
    <section id="brands" className="relative overflow-hidden border-y border-white/[0.06] bg-[#030308] py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(34,211,238,0.07),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-300/75">01 — Instagram</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Ishlangan Instagram akkauntlar
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/45">
            Haqiqiy profil screenshotlari — bosib Instagram’ga o‘ting.
          </p>
        </div>

        {brands.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center text-sm text-white/40">
            Rasmlarni <code className="text-cyan-300/70">web/public/brands/</code> ga qo‘ying.
          </div>
        ) : (
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#030308] to-transparent sm:w-20 lg:w-32"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#030308] to-transparent sm:w-20 lg:w-32"
              aria-hidden
            />

            <div className="overflow-hidden py-2">
              <motion.div
                className="flex w-max gap-5 px-4 sm:gap-6 sm:px-6 lg:gap-7 lg:px-8"
                animate={{ x: ["0%", "-33.333%"] }}
                transition={{ repeat: Infinity, duration: carouselDuration, ease: "linear" }}
              >
                {row.map((b, i) => (
                  <InstagramCard key={`${b.id}-${i}`} brand={b} />
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
