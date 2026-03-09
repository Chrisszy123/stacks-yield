import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "StackYield — sBTC Yield Aggregator",
  description:
    "Maximize your sBTC yield across the Stacks DeFi ecosystem. One vault. Multiple protocols. Fully non-custodial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        {/* Background atmosphere — two barely-visible radial glows */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-120px",
              right: "-80px",
              width: "480px",
              height: "480px",
              borderRadius: "50%",
              background: "rgba(247,147,26,0.04)",
              filter: "blur(90px)",
              animation: "driftA 22s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              left: "-60px",
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              background: "rgba(61,214,140,0.025)",
              filter: "blur(70px)",
              animation: "driftB 28s ease-in-out infinite alternate-reverse",
            }}
          />
        </div>

        {/* Noise grain overlay */}
        <svg
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0.022,
          }}
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        <div style={{ position: "relative", zIndex: 1 }}>
          <AppProviders>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderLeft: "3px solid var(--green)",
                  color: "var(--text)",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                },
              }}
            />
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
