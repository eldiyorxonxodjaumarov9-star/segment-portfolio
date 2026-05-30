"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/format";
import { useMounted } from "@/hooks/useMounted";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  /** Sekin count-up — kartochkalar ketma-ket boshlanadi */
  delay?: number;
};

export function AnimatedCounter({ value, suffix = "", prefix = "", delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const mounted = useMounted();
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const hasAnimated = useRef(false);
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!mounted || !inView || hasAnimated.current) return;

    hasAnimated.current = true;
    setDisplay(0);
    setDone(false);

    const controls = animate(0, value, {
      duration: 2.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
      onComplete: () => setDone(true),
    });

    return () => controls.stop();
  }, [mounted, inView, value, delay]);

  const shown = mounted && inView ? display : 0;

  return (
    <span
      ref={ref}
      className={`inline-block tabular-nums tracking-tight transition-[filter] duration-700 ${
        done ? "animate-hud-digit-pulse" : ""
      }`}
      style={done ? { animationDelay: `${delay * 0.4}s`, animationDuration: `${3.4 + (delay % 3) * 0.35}s` } : undefined}
      suppressHydrationWarning
    >
      {prefix}
      {formatNumber(shown)}
      {suffix}
    </span>
  );
}
