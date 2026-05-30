"use client";

import { useMemo } from "react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useMounted } from "@/hooks/useMounted";

type Planet = {
  id: string;
  variant: "earth" | "mars" | "moon" | "gas";
  size: number;
  left: string;
  top: string;
  orbit: "a" | "b" | "c" | "d";
  spinDuration: number;
  opacity: number;
};

const PLANETS: Planet[] = [
  { id: "earth", variant: "earth", size: 240, left: "4%", top: "14%", orbit: "a", spinDuration: 16, opacity: 0.88 },
  { id: "gas", variant: "gas", size: 175, left: "76%", top: "8%", orbit: "b", spinDuration: 20, opacity: 0.78 },
  { id: "mars", variant: "mars", size: 105, left: "68%", top: "52%", orbit: "c", spinDuration: 14, opacity: 0.82 },
  { id: "moon", variant: "moon", size: 68, left: "18%", top: "60%", orbit: "d", spinDuration: 12, opacity: 0.75 },
  { id: "earth-far", variant: "earth", size: 130, left: "86%", top: "68%", orbit: "a", spinDuration: 18, opacity: 0.55 },
];

export function PremiumBackground() {
  const mounted = useMounted();
  const { content } = useSiteContent();
  const { theme } = content.config;

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: (i * 19 + 7) % 98,
        top: (i * 27 + 11) % 96,
        size: 1 + (i % 3) * 0.5,
        delay: (i * 0.25) % 5,
        duration: 3.5 + (i % 5) * 0.4,
      })),
    [],
  );

  if (!mounted) {
    return <div className="pointer-events-none fixed inset-0 z-0 bg-[#030308]" aria-hidden />;
  }

  return (
    <div className="premium-bg-layer pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ backgroundColor: theme.backgroundColor }} />
      <div className="absolute inset-0" style={{ background: theme.gradientOverlay }} />

      <div className="cosmic-starfield absolute inset-0" />

      {PLANETS.map((planet) => (
        <div
          key={planet.id}
          className={`cosmic-orbit-${planet.orbit} absolute`}
          style={{ left: planet.left, top: planet.top, opacity: planet.opacity }}
        >
          <div
            className={`cosmic-planet cosmic-planet--${planet.variant} animate-cosmic-spin cosmic-planet-glow`}
            style={{ width: planet.size, height: planet.size, animationDuration: `${planet.spinDuration}s` }}
          />
          {planet.variant === "gas" && (
            <div
              className="cosmic-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: planet.size * 1.55, height: planet.size * 0.35 }}
              aria-hidden
            />
          )}
        </div>
      ))}

      <div
        className="animate-premium-mesh-spin absolute inset-[-60%] opacity-[0.06]"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${theme.neonPrimary}45 55deg, transparent 110deg, ${theme.neonSecondary}35 180deg, transparent 240deg, rgba(232,121,249,0.25) 300deg, transparent 360deg)`,
        }}
      />

      <div
        className="absolute -left-[18%] top-[6%] h-[min(480px,65vw)] w-[min(480px,65vw)] rounded-full blur-[80px] animate-premium-drift-a"
        style={{ background: `radial-gradient(circle, ${theme.neonPrimary}18 0%, transparent 68%)` }}
      />
      <div
        className="absolute -right-[10%] top-[32%] h-[min(400px,55vw)] w-[min(400px,55vw)] rounded-full blur-[70px] animate-premium-drift-b"
        style={{ background: `radial-gradient(circle, ${theme.neonSecondary}16 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-[12%] left-[30%] h-[min(320px,42vw)] w-[min(320px,42vw)] rounded-full blur-[60px] animate-premium-drift-c"
        style={{ background: `radial-gradient(circle, ${theme.neonPrimary}10 0%, transparent 72%)` }}
      />

      {particles.map((p, i) => (
        <span
          key={i}
          className="animate-premium-particle absolute rounded-full bg-white/70"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      <div className="premium-grid absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_85%_at_50%_45%,transparent_48%,rgba(3,3,8,0.28)_80%,rgba(3,3,8,0.72)_100%)]" />
    </div>
  );
}
