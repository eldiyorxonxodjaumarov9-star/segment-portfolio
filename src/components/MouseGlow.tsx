"use client";

import { useEffect, useRef } from "react";

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[5]" aria-hidden>
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),rgba(168,85,247,0.05)_40%,transparent_68%)] blur-2xl will-change-transform"
      />
    </div>
  );
}
