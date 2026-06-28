"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Boot lines ───────────────────────────────────────────────
const BOOT_LINES = [
  { text: "> Initializing neural interface...", delay: 0    },
  { text: "> Loading 3D environment...",        delay: 350  },
  { text: "> Fetching portfolio data...",       delay: 700  },
  { text: "> Calibrating AI systems...",        delay: 1050 },
  { text: "> Rendering experience...",          delay: 1400 },
  { text: "✓ All systems operational",         delay: 1750 },
];

// ── Data stream positions — fixed, no random ────────────────
const DATA_STREAM_POSITIONS = [
  { x: "6%",  delay: 0    },
  { x: "14%", delay: 0.4  },
  { x: "80%", delay: 0.2  },
  { x: "92%", delay: 0.7  },
];

// ── Particle config — fixed, no random ──────────────────────
const PARTICLE_CONFIG = [
  { id: 0,  x: 10, y: 55, size: 2,   delay: 0.1, dur: 2.8, color: "rgba(0,229,255,0.8)"   },
  { id: 1,  x: 22, y: 70, size: 1.5, delay: 0.5, dur: 3.2, color: "rgba(139,92,246,0.8)"  },
  { id: 2,  x: 35, y: 60, size: 2,   delay: 0.9, dur: 2.5, color: "rgba(59,130,246,0.8)"  },
  { id: 3,  x: 48, y: 75, size: 1,   delay: 0.3, dur: 3.5, color: "rgba(0,229,255,0.8)"   },
  { id: 4,  x: 58, y: 65, size: 2,   delay: 0.7, dur: 2.9, color: "rgba(139,92,246,0.8)"  },
  { id: 5,  x: 70, y: 55, size: 1.5, delay: 0.2, dur: 3.1, color: "rgba(59,130,246,0.8)"  },
  { id: 6,  x: 82, y: 72, size: 2,   delay: 0.6, dur: 2.6, color: "rgba(0,229,255,0.8)"   },
  { id: 7,  x: 90, y: 62, size: 1,   delay: 1.0, dur: 3.4, color: "rgba(139,92,246,0.8)"  },
  { id: 8,  x: 15, y: 42, size: 1.5, delay: 0.4, dur: 2.7, color: "rgba(59,130,246,0.8)"  },
  { id: 9,  x: 28, y: 80, size: 2,   delay: 0.8, dur: 3.0, color: "rgba(0,229,255,0.8)"   },
  { id: 10, x: 42, y: 50, size: 1,   delay: 0.15, dur: 3.3, color: "rgba(139,92,246,0.8)" },
  { id: 11, x: 55, y: 85, size: 2,   delay: 0.55, dur: 2.4, color: "rgba(59,130,246,0.8)" },
  { id: 12, x: 65, y: 45, size: 1.5, delay: 0.35, dur: 3.6, color: "rgba(0,229,255,0.8)"  },
  { id: 13, x: 75, y: 78, size: 1,   delay: 0.75, dur: 2.2, color: "rgba(139,92,246,0.8)" },
  { id: 14, x: 88, y: 48, size: 2,   delay: 0.95, dur: 3.8, color: "rgba(59,130,246,0.8)" },
];

// ── Data stream chars — fixed, no random ────────────────────
const STREAM_CHARS = ["0", "1", "ア", "イ", "∆", "∑", "π", "∞"];
const STREAM_LINES = [
  [0, 4, 1, 6, 2, 7],
  [3, 1, 5, 0, 4, 2],
  [6, 2, 0, 3, 7, 1],
  [1, 5, 3, 7, 0, 4],
];

// ── Holographic ring ─────────────────────────────────────────
function HoloRing({
  size, duration, reverse, color,
}: {
  size: number; duration: number;
  reverse?: boolean; color: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width:       size,
        height:      size,
        top:         "50%",
        left:        "50%",
        marginTop:   -size / 2,
        marginLeft:  -size / 2,
        border:      `1px dashed ${color}`,
        boxShadow:   `0 0 8px ${color}`,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ── Boot terminal line ────────────────────────────────────────
function BootLine({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const [chars,   setChars]   = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!visible || chars >= text.length) return;
    const t = setTimeout(() => setChars((c) => c + 1), 18);
    return () => clearTimeout(t);
  }, [visible, chars, text]);

  if (!visible) return null;

  const isSuccess = text.startsWith("✓");

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      className="font-mono text-[11px] leading-relaxed"
    >
      <span style={{ color: isSuccess ? "#10b981" : "#00e5ff" }}>
        {text.slice(0, chars)}
      </span>
      {chars < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-1 h-3 bg-cyan-400 ml-0.5 align-middle"
        />
      )}
    </motion.div>
  );
}

// ── Main PageLoader ───────────────────────────────────────────
export default function PageLoader() {
  const [mounted,  setMounted]  = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting,  setExiting]  = useState(false);
  const rafRef   = useRef<number>(0);
  const startRef = useRef<number>(0);

  // Mount guard — prevents SSR/hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    startRef.current = performance.now();
    const TOTAL_MS   = 2200;

    const tick = (now: number) => {
      const elapsed  = now - startRef.current;
      const raw      = elapsed / TOTAL_MS;
      const eased    = 1 - Math.pow(1 - Math.min(raw, 1), 2.5);
      setProgress(Math.min(eased * 100, 100));

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => setLoading(false), 700);
        }, 200);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]);

  // Don't render anything on server
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale:   1.04,
            filter:  "blur(12px)",
          }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020617] overflow-hidden"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,229,255,1) 1px,transparent 1px)," +
                "linear-gradient(90deg,rgba(0,229,255,1) 1px,transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Radial vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 50%,transparent 40%,#020617 100%)",
            }}
          />

          {/* Ambient glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/[0.06] blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/[0.06] blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-600/[0.04] blur-[100px] pointer-events-none" />

          {/* Data streams — fixed chars, no random */}
          {DATA_STREAM_POSITIONS.map((s, si) => (
            <div
              key={si}
              className="absolute top-0 flex flex-col gap-1 pointer-events-none select-none"
              style={{ left: s.x, opacity: 0.07 }}
            >
              {STREAM_LINES[si].map((charIdx, i) => (
                <motion.span
                  key={i}
                  className="text-[10px] font-mono text-cyan-400"
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{
                    duration: 1.2,
                    delay:    s.delay + i * 0.15,
                    repeat:   Infinity,
                    ease:     "easeInOut",
                  }}
                >
                  {STREAM_CHARS[charIdx]}
                </motion.span>
              ))}
            </div>
          ))}

          {/* Floating particles — fixed positions, no random */}
          {PARTICLE_CONFIG.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left:       `${p.x}%`,
                top:        `${p.y}%`,
                width:      p.size,
                height:     p.size,
                background: p.color,
              }}
              animate={{
                opacity: [0, 0.7, 0],
                scale:   [0, 1, 0],
                y:       [0, -70],
              }}
              transition={{
                duration: p.dur,
                delay:    p.delay,
                repeat:   Infinity,
                ease:     "easeOut",
              }}
            />
          ))}

          {/* Centre content */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Holographic rings + core */}
            <div
              className="relative flex items-center justify-center mb-10"
              style={{ width: 160, height: 160 }}
            >
              {/* Outermost pulse ring */}
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width:  160, height: 160,
                  border: "1px solid rgba(0,229,255,0.1)",
                }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              <HoloRing size={130} duration={8}  color="rgba(0,229,255,0.2)"   />
              <HoloRing size={108} duration={6}  color="rgba(139,92,246,0.25)" reverse />
              <HoloRing size={86}  duration={4}  color="rgba(59,130,246,0.3)"  />

              {/* Orbiting dot — outer */}
              <motion.div
                className="absolute pointer-events-none"
                style={{ width: 130, height: 130, top: 15, left: 15 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute w-2 h-2 rounded-full bg-cyan-400"
                  style={{
                    top:       "50%",
                    left:      "100%",
                    marginTop: -4,
                    marginLeft: -4,
                    boxShadow: "0 0 8px #00e5ff, 0 0 16px #00e5ff",
                  }}
                />
              </motion.div>

              {/* Orbiting dot — inner */}
              <motion.div
                className="absolute pointer-events-none"
                style={{ width: 108, height: 108, top: 26, left: 26 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute w-1.5 h-1.5 rounded-full bg-purple-400"
                  style={{
                    top:       "50%",
                    left:      "100%",
                    marginTop: -3,
                    marginLeft: -3,
                    boxShadow: "0 0 6px #8b5cf6, 0 0 12px #8b5cf6",
                  }}
                />
              </motion.div>

              {/* Core */}
              <motion.div
                className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(0,229,255,0.15),rgba(139,92,246,0.15))",
                  border:    "1px solid rgba(0,229,255,0.3)",
                  boxShadow: "0 0 30px rgba(0,229,255,0.3),inset 0 0 20px rgba(0,229,255,0.05)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(0,229,255,0.3),inset 0 0 20px rgba(0,229,255,0.05)",
                    "0 0 50px rgba(0,229,255,0.5),inset 0 0 30px rgba(0,229,255,0.1)",
                    "0 0 20px rgba(0,229,255,0.3),inset 0 0 20px rgba(0,229,255,0.05)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Scan line */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <motion.div
                    className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    animate={{ y: ["-100%", "400%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                <span
                  className="relative z-10 text-2xl font-black"
                  style={{
                    background:           "linear-gradient(135deg,#00e5ff,#8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor:  "transparent",
                    backgroundClip:       "text",
                  }}
                >
                  M
                </span>
              </motion.div>
            </div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1
                className="text-xl font-black tracking-[0.25em] mb-1"
                style={{
                  background:           "linear-gradient(135deg,#00e5ff 0%,#3b82f6 50%,#8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                }}
              >
                MAYANK CHOUDHARY
              </h1>
              <p
                className="text-[10px] font-semibold tracking-[0.35em] uppercase"
                style={{ color: "rgba(148,163,184,0.5)" }}
              >
                AI &amp; Full Stack Developer
              </p>
            </motion.div>

            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-72 mb-6 rounded-xl overflow-hidden"
              style={{
                background:     "rgba(255,255,255,0.02)",
                border:         "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Terminal header */}
              <div
                className="flex items-center gap-1.5 px-3 py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500/60"    />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60"  />
                <span
                  className="ml-2 text-[9px] font-mono"
                  style={{ color: "rgba(148,163,184,0.3)" }}
                >
                  portfolio.init
                </span>
              </div>

              {/* Boot lines */}
              <div className="p-3 space-y-1 min-h-[110px]">
                {BOOT_LINES.map((line, i) => (
                  <BootLine key={i} text={line.text} delay={line.delay} />
                ))}
              </div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="w-72"
            >
              <div
                className="relative h-0.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width:      `${progress}%`,
                    background: "linear-gradient(90deg,#3b82f6,#00e5ff,#8b5cf6)",
                    boxShadow:  "0 0 8px rgba(0,229,255,0.6)",
                    transition: "width 0.05s linear",
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span
                  className="text-[9px] font-mono"
                  style={{ color: "rgba(148,163,184,0.3)" }}
                >
                  {exiting ? "Ready" : "Loading"}
                </span>
                <span
                  className="text-[10px] font-mono font-bold"
                  style={{ color: "rgba(0,229,255,0.6)" }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-10 h-10 pointer-events-none"
            style={{ borderTop: "1px solid rgba(0,229,255,0.15)", borderLeft: "1px solid rgba(0,229,255,0.15)" }} />
          <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none"
            style={{ borderTop: "1px solid rgba(139,92,246,0.15)", borderRight: "1px solid rgba(139,92,246,0.15)" }} />
          <div className="absolute bottom-0 left-0 w-10 h-10 pointer-events-none"
            style={{ borderBottom: "1px solid rgba(59,130,246,0.15)", borderLeft: "1px solid rgba(59,130,246,0.15)" }} />
          <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none"
            style={{ borderBottom: "1px solid rgba(0,229,255,0.15)", borderRight: "1px solid rgba(0,229,255,0.15)" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}