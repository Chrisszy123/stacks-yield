"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "@/components/WalletButton";
import { useCurrentBtcBlock } from "@/hooks/chainQueries";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Protocol", href: "/#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Docs", href: "#", external: false },
];

export function Navbar() {
  const { data: blockHeight } = useCurrentBtcBlock();
  const [flash, setFlash] = useState(false);
  const prevBlock = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (
      blockHeight !== undefined &&
      prevBlock.current !== null &&
      blockHeight !== prevBlock.current
    ) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 280);
      return () => clearTimeout(t);
    }
    prevBlock.current = blockHeight ?? null;
  }, [blockHeight]);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-16"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background:  "rgba(4,4,10,0.82)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center select-none"
        style={{ letterSpacing: "-0.02em" }}
      >
        <span className="font-display font-black text-[20px]" style={{ color: "var(--text)" }}>
          Stack
        </span>
        <span className="font-display font-black text-[20px]" style={{ color: "#f7931a" }}>
          Yield
        </span>
      </Link>

      {/* Center nav links */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href.split("#")[0]));
          return (
            <Link
              key={link.label}
              href={link.href}
              className="font-body font-medium text-[14px] transition-colors duration-[180ms]"
              style={{ color: isActive ? "var(--text)" : "var(--text-2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? "var(--text)" : "var(--text-2)")}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {blockHeight !== undefined && (
          <div
            className={cn(
              "font-mono text-[11px] px-[8px] py-[3px] rounded-[6px] transition-colors duration-[180ms]",
              flash ? "block-flash" : ""
            )}
            style={{
              color:      flash ? "#f7931a" : "var(--text-muted)",
              background: "#12121c",
              border:     "1px solid var(--border)",
            }}
          >
            #{blockHeight.toLocaleString()}
          </div>
        )}
        <WalletButton />
      </div>
    </nav>
  );
}
