"use client";
import { motion } from "framer-motion";

// Rising chart path: bottom-left → top-right across a 1440×480 viewport
const MAIN_PATH =
  "M 0,460 C 160,440 320,390 480,330 C 640,268 800,195 960,142 C 1120,90 1300,52 1440,35";

// Shadow path: identical, offset +8px vertically
const SHADOW_PATH =
  "M 0,468 C 160,448 320,398 480,338 C 640,276 800,203 960,150 C 1120,98 1300,60 1440,43";

// Thin projection line — slightly above main path
const PROJ_PATH =
  "M 0,442 C 160,421 320,368 480,306 C 640,243 800,170 960,116 C 1120,64 1300,28 1440,14";

// Candle bar data: {x, height} — evenly spaced, heights follow the curve loosely
const BARS = Array.from({ length: 20 }, (_, i) => {
  const x = 36 + i * 72;
  const t = x / 1440;
  const curveY = 460 - t * 425;
  const jitter = [18, -12, 24, -8, 15, -20, 10, -5, 22, 8, -14, 20, -10, 6, 18, -8, 12, -16, 9, 14][i] ?? 0;
  return { x, height: Math.max(20, 480 - curveY + jitter) };
});

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* ── Layer 3 — Horizontal grid lines ───────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 56px)",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 60%)",
          maskImage:       "linear-gradient(to top, transparent 0%, black 60%)",
        }}
      />

      {/* ── Layer 1 — SVG chart ────────────────────────────────────────── */}
      <svg
        viewBox="0 0 1440 480"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "72%" }}
      >
        <defs>
          {/* Blur filter for the shadow line */}
          <filter id="line-blur" x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          {/* Glow filter for the traveling dot */}
          <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Candle bars */}
        {BARS.map((bar, i) => (
          <rect
            key={i}
            x={bar.x - 4}
            y={480 - bar.height}
            width={8}
            height={bar.height}
            fill="rgba(247,147,26,0.05)"
            rx="2"
          />
        ))}

        {/* Shadow / glow line (blurred, behind main) */}
        <path
          d={SHADOW_PATH}
          fill="none"
          stroke="rgba(247,147,26,0.12)"
          strokeWidth="8"
          filter="url(#line-blur)"
        />

        {/* Dashed projection line */}
        <motion.path
          d={PROJ_PATH}
          fill="none"
          stroke="rgba(247,147,26,0.18)"
          strokeWidth="1.2"
          strokeDasharray="5 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.6, ease: "easeInOut", delay: 0.6 }}
        />

        {/* Main rising line */}
        <motion.path
          d={MAIN_PATH}
          fill="none"
          stroke="rgba(247,147,26,0.45)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
        />

        {/* Traveling dot along the main path */}
        <motion.circle
          r="4"
          fill="#f7931a"
          filter="url(#dot-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.4 }}
        >
          <animateMotion
            path={MAIN_PATH}
            dur="5s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        </motion.circle>

        {/* Pulsing halo at the dot's final resting position (end of path) */}
        <motion.circle
          cx={1440}
          cy={35}
          r="4"
          fill="rgba(247,147,26,0.6)"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
          style={{ transformOrigin: "1440px 35px" }}
        />
      </svg>

      {/* ── Layer 2 — Radial vignette ─────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 110%, transparent 30%, #04040a 75%)",
        }}
      />
    </div>
  );
}
