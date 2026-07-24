"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  hideHeader?: boolean;
}

const sizeMap: Record<string, string> = {
  sm: "420px",
  md: "520px",
  lg: "640px",
  xl: "780px",
  full: "1000px",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  hideHeader = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handle);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handle);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "24px 16px",
            overflowY: "auto",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: sizeMap[size],
              background: "rgba(10,10,10,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              marginTop: "20px",
              marginBottom: "40px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            {!hideHeader && (title || description) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div>
                  {title && (
                    <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#fff", margin: 0 }}>
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  style={{
                    padding: "4px",
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.25)",
                    cursor: "pointer",
                    borderRadius: "6px",
                    marginLeft: "12px",
                    flexShrink: 0,
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {hideHeader && (
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  zIndex: 10,
                  padding: "4px",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.25)",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                <X size={16} />
              </button>
            )}

            {/* Body */}
            <div style={{ padding: "16px 20px" }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}