"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { modal, backdropVariants } from "@/lib/motion";

interface ModalProps {
  open:         boolean;
  onClose:      () => void;
  children:     React.ReactNode;
  title?:       string;
  maxWidth?:    string;
}

export function Modal({ open, onClose, children, title, maxWidth = "480px" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[1000]"
            style={{ background: "rgba(4,4,10,0.85)" }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            <motion.div
              key="panel"
              variants={modal}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width:         "100%",
                maxWidth,
                background:    "rgba(255,255,255,0.04)",
                backdropFilter:"blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border:        "1px solid rgba(255,255,255,0.09)",
                borderRadius:  "16px",
                boxShadow:     "0 4px 8px rgba(0,0,0,0.35), 0 16px 40px rgba(0,0,0,0.25)",
              }}
            >
              {title && (
                <div
                  className="flex items-center justify-between px-6 py-5"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <h2
                    className="font-display font-black text-[16px] tracking-tight"
                    style={{ color: "var(--text)" }}
                  >
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="font-mono text-[18px] leading-none w-7 h-7 flex items-center justify-center rounded-[6px]"
                    style={{ color: "var(--text-muted)", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    ×
                  </button>
                </div>
              )}
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
