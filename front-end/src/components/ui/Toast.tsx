"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id:      string;
  variant: ToastVariant;
  title:   string;
  txHash?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const BORDER_COLORS: Record<ToastVariant, string> = {
  success: "#3dd68c",
  error:   "#f16a6a",
  info:    "#f7931a",
};

const ICONS: Record<ToastVariant, string> = {
  success: "✓",
  error:   "✕",
  info:    "ⓘ",
};

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(onRemove, 4000);
    return () => clearTimeout(t);
  }, [onRemove]);

  async function copyHash() {
    if (!item.txHash) return;
    await navigator.clipboard.writeText(item.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{    opacity: 0, y: 10, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={{
        background:    "#0d0d15",
        border:        `1px solid rgba(255,255,255,0.09)`,
        borderLeft:    `3px solid ${BORDER_COLORS[item.variant]}`,
        borderRadius:  "12px",
        padding:       "14px 18px",
        boxShadow:     "0 8px 32px rgba(0,0,0,0.4)",
        minWidth:      "280px",
        maxWidth:      "360px",
        pointerEvents: "all",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="font-mono text-[13px] shrink-0 mt-[1px]"
          style={{ color: BORDER_COLORS[item.variant] }}
        >
          {ICONS[item.variant]}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-body font-medium text-[14px]" style={{ color: "var(--text)" }}>
            {item.title}
          </p>
          {item.txHash && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className="font-mono text-[11px] truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {item.txHash.slice(0, 6)}...{item.txHash.slice(-4)}
              </span>
              <button
                onClick={copyHash}
                className="font-mono text-[10px] px-[7px] py-[2px] rounded-[5px] shrink-0"
                style={{
                  background:  "rgba(247,147,26,0.09)",
                  border:      "1px solid rgba(247,147,26,0.2)",
                  color:       "#f7931a",
                  cursor:      "pointer",
                }}
              >
                {copied ? "✓" : "copy"}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onRemove}
          className="font-mono text-[14px] shrink-0 leading-none"
          style={{ color: "var(--text-muted)", cursor: "pointer" }}
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((opts: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev.slice(-2), { ...opts, id }]);
  }, []);

  function remove(id: string) {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-5 right-5 flex flex-col gap-2 z-[99999]"
        style={{ pointerEvents: "none" }}
      >
        <AnimatePresence mode="sync">
          {items.map((item) => (
            <ToastCard key={item.id} item={item} onRemove={() => remove(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
