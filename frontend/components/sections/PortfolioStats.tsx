"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Users,
  Globe2,
  Repeat2,
  CalendarDays,
  TrendingUp,
  Wifi,
  LucideProps,
} from "lucide-react";
import type { VisitorStats } from "@/types/portfolio";

// ── Lucide-specific icon type ─────────────────────────────────
type LucideIcon = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

// ── Numeric-only keys of VisitorStats ─────────────────────────
// keyof VisitorStats includes array fields like topCountries which
// are not numbers. This mapped type extracts ONLY the keys whose
// value is number, so stats[cfg.key] is always safely a number.
type NumericVisitorKey = {
  [K in keyof VisitorStats]-?: VisitorStats[K] extends number ? K : never;
}[keyof VisitorStats];

// ── Animated counter ──────────────────────────────────────────
function useCounter(target: number, duration = 2000, active = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || target === 0) {
      setValue(target);
      return;
    }
    const startTime  = performance.now();
    const startValue = 0;

    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startValue + (target - startValue) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration, active]);

  return value;
}

// ── Floating particle ─────────────────────────────────────────
function Particle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-cyan-400/30 pointer-events-none"
      style={{ left: x, top: y }}
      animate={{
        y:       [0, -20, 0],
        opacity: [0, 0.6, 0],
        scale:   [0.5, 1, 0.5],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat:   Infinity,
        delay,
        ease:     "easeInOut",
      }}
    />
  );
}

// ── Stat card config ──────────────────────────────────────────
interface StatConfig {
  key:      NumericVisitorKey;
  label:    string;
  suffix:   string;
  icon:     LucideIcon;
  gradient: string;
  glow:     string;
  border:   string;
  desc:     string;
}

const STATS: StatConfig[] = [
  {
    key:      "totalVisitors",
    label:    "Total Visitors",
    suffix:   "",
    icon:     Users,
    gradient: "from-cyan-500 to-blue-500",
    glow:     "rgba(0,229,255,0.2)",
    border:   "rgba(0,229,255,0.3)",
    desc:     "All-time portfolio visits",
  },
  {
    key:      "countries",
    label:    "Countries",
    suffix:   "",
    icon:     Globe2,
    gradient: "from-blue-500 to-violet-500",
    glow:     "rgba(59,130,246,0.2)",
    border:   "rgba(59,130,246,0.3)",
    desc:     "Unique countries reached",
  },
  {
    key:      "returningPercentage",
    label:    "Returning Visitors",
    suffix:   "%",
    icon:     Repeat2,
    gradient: "from-violet-500 to-purple-500",
    glow:     "rgba(139,92,246,0.2)",
    border:   "rgba(139,92,246,0.3)",
    desc:     "Visitors who came back",
  },
  {
    key:      "todayVisitors",
    label:    "Today's Visitors",
    suffix:   "",
    icon:     CalendarDays,
    gradient: "from-emerald-500 to-cyan-500",
    glow:     "rgba(16,185,129,0.2)",
    border:   "rgba(16,185,129,0.3)",
    desc:     "Visits since midnight",
  },
];

// ── Single stat card ──────────────────────────────────────────
function StatCard({
  config,
  value,
  index,
  active,
}: {
  config: StatConfig;
  value:  number;
  index:  number;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const counted = useCounter(value, 2000 + index * 200, active);
  const Icon    = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay:    index * 0.1,
        duration: 0.6,
        ease:     [0.23, 1, 0.32, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
        style={{
          background: `linear-gradient(135deg, ${config.glow}, transparent)`,
        }}
      />

      {/* Card */}
      <motion.div
        className="relative rounded-2xl p-6 h-full flex flex-col gap-4 overflow-hidden"
        style={{
          background:     hovered
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.03)",
          border:         hovered
            ? `1px solid ${config.border}`
            : "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          transition:     "background 0.3s, border 0.3s, box-shadow 0.3s",
          boxShadow:      hovered
            ? `0 20px 60px ${config.glow}`
            : "none",
        }}
        animate={hovered ? { y: -6 } : { y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
            animate={hovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              boxShadow: hovered ? `0 8px 24px ${config.glow}` : undefined,
            }}
          >
            <Icon size={22} className="text-white" />
          </motion.div>

          {/* Live indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(16,185,129,0.08)",
              border:     "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[9px] text-emerald-400 font-semibold tracking-wide">
              LIVE
            </span>
          </div>
        </div>

        {/* Number */}
        <div>
          <div className="flex items-end gap-1">
            <span
              className="text-4xl font-black tabular-nums leading-none"
              style={{
                background:           "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:  "transparent",
                backgroundClip:       "text",
              }}
            >
              {counted.toLocaleString()}
            </span>
            {config.suffix && (
              <span
                className="text-2xl font-black mb-0.5"
                style={{
                  background:           `linear-gradient(135deg, ${config.glow.replace("0.2", "1")}, #fff)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                }}
              >
                {config.suffix}
              </span>
            )}
          </div>

          <p className="text-sm font-bold text-white mt-1">{config.label}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{config.desc}</p>
        </div>

        {/* Bottom gradient bar */}
        <div className="mt-auto">
          <div className="h-0.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
              initial={{ width: 0 }}
              animate={active ? { width: "100%" } : { width: 0 }}
              transition={{
                delay:    index * 0.15 + 0.5,
                duration: 1.5,
                ease:     "easeOut",
              }}
            />
          </div>
        </div>

        {/* Shimmer on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "200%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-20 h-20 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at top right, ${config.glow}, transparent 70%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────
interface PortfolioStatsProps {
  stats: VisitorStats;
}

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id:    i,
  delay: i * 0.4,
  x:     `${(i * 8.5) % 100}%`,
  y:     `${(i * 13 + 20) % 80}%`,
}));

export default function PortfolioStats({ stats }: PortfolioStatsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-[#020617]"
      aria-label="Portfolio Statistics"
    >
      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-600/5 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/5 blur-[120px]" />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,1) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(0,229,255,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {PARTICLES.map((p) => (
          <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} />
        ))}
      </div>

      <div className="relative section-container">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{
              background: "rgba(0,229,255,0.06)",
              border:     "1px solid rgba(0,229,255,0.15)",
            }}
          >
            <TrendingUp size={12} className="text-cyan-400" />
            <span
              className="text-cyan-400 font-semibold"
              style={{
                fontSize:      "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Live Analytics
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="text-white">Portfolio</span>{" "}
            <span
              style={{
                background:           "linear-gradient(135deg,#00e5ff 0%,#3b82f6 50%,#8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:  "transparent",
                backgroundClip:       "text",
              }}
            >
              Statistics
            </span>
          </h2>

          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Real-time insights from visitors around the world — updated live.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Wifi size={12} className="text-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">
              Live Data
            </span>
            <motion.span
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* ── Stats grid ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          role="list"
          aria-label="Visitor statistics"
        >
          {STATS.map((cfg, i) => (
            <div key={cfg.key} role="listitem">
              <StatCard
                config={cfg}
                value={stats[cfg.key] as number}
                index={i}
                active={inView}
              />
            </div>
          ))}
        </div>

        {/* ── Bottom note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex items-center justify-center gap-2 mt-10"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[10px] text-slate-600 font-mono tracking-wider">
            Analytics powered by real visitor data
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/10" />
        </motion.div>
      </div>
    </section>
  );
}