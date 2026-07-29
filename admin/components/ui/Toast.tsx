"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle, Trash2 } from "lucide-react";
import { useToastStore } from "@/lib/store";

// ── Per-type config ───────────────────────────────────────────
const TOAST_CONFIG = {
  success: {
    icon:       CheckCircle,
    iconColor:  "#4ade80",
    borderColor:"rgba(74,222,128,0.25)",
    bgGlow:     "rgba(74,222,128,0.06)",
    barColor:   "#4ade80",
    label:      "Success",
  },
  error: {
    icon:       AlertCircle,
    iconColor:  "#f87171",
    borderColor:"rgba(248,113,113,0.25)",
    bgGlow:     "rgba(248,113,113,0.06)",
    barColor:   "#f87171",
    label:      "Error",
  },
  warning: {
    icon:       AlertTriangle,
    iconColor:  "#fbbf24",
    borderColor:"rgba(251,191,36,0.25)",
    bgGlow:     "rgba(251,191,36,0.06)",
    barColor:   "#fbbf24",
    label:      "Warning",
  },
  info: {
    icon:       Info,
    iconColor:  "#60a5fa",
    borderColor:"rgba(96,165,250,0.25)",
    bgGlow:     "rgba(96,165,250,0.06)",
    barColor:   "#60a5fa",
    label:      "Info",
  },
};

// ── Special config for delete toasts ─────────────────────────
// Detected by title containing "delet" (case-insensitive)
function isDeleteToast(title: string): boolean {
  return title.toLowerCase().includes("delet");
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      style={{
        position:      "fixed",
        bottom:        "24px",
        right:         "24px",
        zIndex:        1000,
        display:       "flex",
        flexDirection: "column",
        gap:           "10px",
        width:         "100%",
        maxWidth:      "360px",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const cfg    = TOAST_CONFIG[toast.type];
          const Icon   = isDeleteToast(toast.title) ? Trash2 : cfg.icon;
          const isDel  = isDeleteToast(toast.title);

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.85 }}
              animate={{ opacity: 1, x: 0,  scale: 1    }}
              exit={{    opacity: 0, x: 60,  scale: 0.9  }}
              transition={{
                type:      "spring",
                stiffness: 400,
                damping:   30,
              }}
              style={{
                pointerEvents:  "all",
                position:       "relative",
                overflow:       "hidden",
                borderRadius:   "14px",
                background:     `rgba(10,12,20,0.92)`,
                border:         `1px solid ${cfg.borderColor}`,
                backdropFilter: "blur(20px)",
                boxShadow:      `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              {/* Top accent glow */}
              <div
                style={{
                  position:   "absolute",
                  top:        0,
                  left:       0,
                  right:      0,
                  height:     "1px",
                  background: `linear-gradient(90deg, transparent, ${cfg.iconColor}, transparent)`,
                  opacity:    0.6,
                }}
              />

              {/* Left accent bar */}
              <div
                style={{
                  position:     "absolute",
                  top:          "12px",
                  bottom:       "12px",
                  left:         0,
                  width:        "3px",
                  borderRadius: "0 2px 2px 0",
                  background:   cfg.iconColor,
                  opacity:      0.8,
                }}
              />

              {/* Subtle background glow */}
              <div
                style={{
                  position:   "absolute",
                  inset:      0,
                  background: `radial-gradient(ellipse at 0% 50%, ${cfg.bgGlow}, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Content */}
              <div
                style={{
                  display:    "flex",
                  alignItems: "flex-start",
                  gap:        "10px",
                  padding:    "14px 14px 16px 18px",
                  position:   "relative",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width:          "32px",
                    height:         "32px",
                    borderRadius:   "8px",
                    background:     `${cfg.iconColor}12`,
                    border:         `1px solid ${cfg.iconColor}25`,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                    marginTop:      "1px",
                  }}
                >
                  <Icon
                    size={15}
                    style={{
                      color: cfg.iconColor,
                      ...(isDel ? { strokeWidth: 2.5 } : {}),
                    }}
                  />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display:       "flex",
                      alignItems:    "center",
                      gap:           "6px",
                      marginBottom:  toast.message ? "3px" : 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize:      "9px",
                        fontWeight:    700,
                        color:         cfg.iconColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        opacity:       0.7,
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize:   "13px",
                      fontWeight: 600,
                      color:      "#fff",
                      margin:     0,
                      lineHeight: "1.4",
                    }}
                  >
                    {toast.title}
                  </p>
                  {toast.message && (
                    <p
                      style={{
                        fontSize:   "11px",
                        color:      "rgba(255,255,255,0.4)",
                        margin:     "4px 0 0",
                        lineHeight: "1.5",
                      }}
                    >
                      {toast.message}
                    </p>
                  )}
                </div>

                {/* Close button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    background:   "rgba(255,255,255,0.04)",
                    border:       "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "6px",
                    color:        "rgba(255,255,255,0.3)",
                    cursor:       "pointer",
                    padding:      "3px",
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "center",
                    flexShrink:   0,
                    transition:   "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <X size={12} />
                </button>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                style={{
                  position:     "absolute",
                  bottom:       0,
                  left:         0,
                  height:       "2px",
                  background:   `linear-gradient(90deg, ${cfg.iconColor}, ${cfg.iconColor}44)`,
                  borderRadius: "0 0 0 14px",
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}