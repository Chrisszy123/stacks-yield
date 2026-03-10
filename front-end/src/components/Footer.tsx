"use client";
import Link from "next/link";

const protocols = ["Zest Protocol", "Bitflow", "ALEX"];

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(4,4,10,0.95)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4 select-none">
              <span className="font-syne font-[800] text-[18px]" style={{ color: "var(--text)" }}>
                Stack
              </span>
              <span className="font-syne font-[800] text-[18px]" style={{ color: "#f7931a" }}>
                Yield
              </span>
            </div>
            <p
              className="font-sans text-[13px] leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              The first sBTC yield aggregator built on Stacks, secured by Bitcoin.
            </p>
          </div>

          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4"
              style={{ color: "var(--text-2)" }}
            >
              Product
            </p>
            <ul className="space-y-3">
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/dashboard">Deposit</FooterLink>
              <FooterLink href="/dashboard">Withdraw</FooterLink>
              <FooterLink href="/#strategies">Strategies</FooterLink>
            </ul>
          </div>

          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4"
              style={{ color: "var(--text-2)" }}
            >
              Resources
            </p>
            <ul className="space-y-3">
              <FooterLink href="https://docs.stacks.co" external>Stacks Docs</FooterLink>
              <FooterLink href="https://explorer.hiro.so/?chain=testnet" external>Block Explorer</FooterLink>
              <FooterLink href="/#faq">FAQ</FooterLink>
              <FooterLink href="https://github.com/your-repo/stackyield" external>GitHub</FooterLink>
            </ul>
          </div>

          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4"
              style={{ color: "var(--text-2)" }}
            >
              Community
            </p>
            <ul className="space-y-3">
              <FooterLink href="https://discord.gg/stacks" external>Discord</FooterLink>
              <FooterLink href="https://twitter.com/staborstacks" external>Twitter / X</FooterLink>
              <FooterLink href="https://forum.stacks.org" external>Forum</FooterLink>
              <FooterLink href="https://github.com/your-repo/stackyield" external>Contribute</FooterLink>
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} StackYield. Built for the Stacks ecosystem.
          </p>
          <div className="flex items-center gap-4">
            {protocols.map((name) => (
              <span key={name} className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const props = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const Tag = external ? "a" : Link;

  return (
    <li>
      <Tag
        href={href}
        className="font-sans text-[13px] block"
        style={{ color: "var(--text-muted)", transition: "color 0.18s ease" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
        {...props}
      >
        {children}
        {external && <span className="ml-1 opacity-40">↗</span>}
      </Tag>
    </li>
  );
}
