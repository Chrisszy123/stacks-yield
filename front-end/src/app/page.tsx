import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-orange-400 text-sm font-medium">
            Built on Stacks · Secured by Bitcoin
          </span>
        </div>

        <h1 className="text-6xl font-black text-white mb-6 leading-tight tracking-tight">
          Stack<span className="text-orange-500">Yield</span>
        </h1>
        <p className="text-zinc-400 text-xl mb-10 leading-relaxed">
          Maximize your sBTC yield across the Stacks DeFi ecosystem.
          <br />
          One vault. Multiple protocols. Fully non-custodial.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-orange-500 hover:bg-orange-400 rounded-xl 
                       text-white font-bold text-lg transition-all duration-200 
                       shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
          >
            Launch App →
          </Link>
          <a
            href="https://github.com/your-repo/stackyield"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl 
                       text-zinc-300 hover:text-white font-bold text-lg transition-all duration-200"
          >
            View Code
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { label: "Protocols Supported", value: "3" },
          { label: "Max APY", value: "~100%" },
          { label: "Asset", value: "sBTC" },
          { label: "Network", value: "Stacks" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-3xl font-black text-orange-400 font-mono">{s.value}</p>
            <p className="text-zinc-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Protocol badges */}
      <div className="mt-16 flex items-center gap-3 flex-wrap justify-center">
        <span className="text-zinc-600 text-sm mr-2">Powered by</span>
        {["Zest Protocol", "Bitflow", "ALEX"].map((name) => (
          <span
            key={name}
            className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm"
          >
            {name}
          </span>
        ))}
      </div>
    </main>
  );
}
