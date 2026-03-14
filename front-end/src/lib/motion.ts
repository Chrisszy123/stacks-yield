import type { Variants } from "framer-motion";

/* ─── New canonical variants (per design spec) ─────────────────────── */

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } },
};

export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const tabPanel: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

export const modal: Variants = {
  hidden:  { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 26 } },
  exit:    { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18 } },
};

export const slideExpand: Variants = {
  hidden:  { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit:    { height: 0, opacity: 0, transition: { duration: 0.2 } },
};

export const cardHover = {
  whileHover: { y: -3, transition: { duration: 0.2 } },
  whileTap:   { scale: 0.98 },
};

export const btnTap = {
  whileTap: { scale: 0.97 },
};

/* ─── Legacy aliases (kept for backward compat) ────────────────────── */

export const pageVariants: Variants = stagger;

export const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
};

export const tabVariants: Variants = tabPanel;

export const modalVariants: Variants = modal;

export const backdropVariants: Variants = {
  hidden:  { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(16px)",
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

export const cardSelectVariants: Variants = {
  idle:     { y: 0, scale: 1 },
  selected: {
    y: -4,
    scale: 1.02,
    transition: { type: "spring", stiffness: 380, damping: 24 },
  },
};

export const progressVariants = {
  hidden:  { width: "0%" },
  visible: (value: number) => ({
    width: `${value}%`,
    transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
  }),
};
