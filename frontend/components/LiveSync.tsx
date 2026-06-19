"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveSync, SyncStatus } from "@/hooks/useLiveSync";

// ── Status dot config ─────────────────────────────────────────
const STATUS_CONFIG: Record<
  SyncStatus,
  { color: string; pulse: boolean; label: string }
> = {
  connecting:   { color: "#fbbf24", pulse: true,  label: "Connecting..."  },
  connected:    { color: "#4ade80", pulse: true,  label: "Live"           },
  reconnecting: { color: "#fbbf24", pulse: true,  label: "Reconnecting..."  },
  failed:       { color: "#f87171", pulse: false, label: "Offline"         },
};

export default function LiveSync() {
  const [status, setStatus]   = useState<SyncStatus>("connecting");
  const [visible, setVisible] = useState(false);

  const handleStatusChange = useCallback((s: SyncStatus) => {
    setStatus(s);
    // Show indicator while not in "connected" steady state
    setVisible(s !== "connected");
    // Once connected, hide after 3s
    if (s === "connected") {
      setTimeout(() => setVisible(false), 3000);
    }
  }, []);

  useLiveSync({ onStatusChange: handleStatusChange });

  const cfg = STATUS_CONFIG[status];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0,  scale: 1   }}
          exit={{    opacity: 0, y: 8,  scale: 0.9  }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position:       "fixed",
            bottom:         "20px",
            left:           "20px",
            zIndex:         9999,
            display:        "flex",
            alignItems:     "center",
            gap:            "6px",
            padding:        "5px 10px 5px 7px",
            background:     "rgba(2,6,23,0.85)",
            border:         `1px solid ${cfg.color}30`,
            borderRadius:   "20px",
            backdropFilter: "blur(12px)",
            pointerEvents:  "none",
            userSelect:     "none",
          }}
        >
          {/* Status dot */}
          <div style={{ position: "relative", width: "8px", height: "8px", flexShrink: 0 }}>
            <div
              style={{
                width:        "8px",
                height:       "8px",
                borderRadius: "50%",
                background:   cfg.color,
                position:     "absolute",
              }}
            />
            {cfg.pulse && (
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                style={{
                  width:        "8px",
                  height:       "8px",
                  borderRadius: "50%",
                  background:   cfg.color,
                  position:     "absolute",
                  top:          0,
                  left:         0,
                }}
              />
            )}
          </div>

          {/* Label */}
          <span
            style={{
              fontSize:   "10px",
              fontWeight: 600,
              color:      cfg.color,
              letterSpacing: "0.04em",
            }}
          >
            {cfg.label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}