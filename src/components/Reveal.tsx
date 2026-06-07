"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade-up on scroll — fast & smooth */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.42, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children animate in sequence */
export function Stagger({
  children,
  className,
  stagger = 0.055,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -4% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  slideFrom = "up",
}: {
  children: ReactNode;
  className?: string;
  slideFrom?: "up" | "left" | "right";
}) {
  const x = slideFrom === "left" ? -28 : slideFrom === "right" ? 28 : 0;
  const y = slideFrom === "up" ? 20 : 0;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, x, y },
        show: {
          opacity: 1, x: 0, y: 0,
          transition: { duration: 0.42, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Slides in one item when it enters viewport (individual scroll trigger) */
export function SlideIn({
  children,
  className,
  direction = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const x = direction === "left" ? -30 : direction === "right" ? 30 : 0;
  const y = direction === "up" ? 24 : 0;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.44, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
