"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export type RevealDirection = "left" | "right" | "top" | "bottom";

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
  top: { x: 0, y: -48 },
  bottom: { x: 0, y: 56 },
};

type Props = {
  children: ReactNode;
  from?: RevealDirection;
  delay?: number;
  className?: string;
};

export function ScrollRevealSection({ children, from = "bottom", delay = 0, className }: Props) {
  const off = offsets[from];

  const variants: Variants = {
    hidden: { opacity: 0, x: off.x, y: off.y },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -4% 0px" }}
      variants={variants}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
