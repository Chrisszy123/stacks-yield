import type { Variants } from "framer-motion";

export const pageVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const tabVariants: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.28, ease: "easeIn" },
  },
};

export const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

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
    transition: {
      duration: 0.9,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
};
