"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  label: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  /** Optional accent colour token for the label pill and decorative line */
  accent?: "cyan" | "blue" | "purple" | "amber" | "green" | "pink";
}

const ACCENT_MAP = {
  cyan:   { pill: "rgba(0,229,255,0.08)",   border: "rgba(0,229,255,0.2)",   dot: "#00e5ff", line: ["#00e5ff", "#3b82f6", "#8b5cf6"] },
  blue:   { pill: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.2)",  dot: "#3b82f6", line: ["#3b82f6", "#6366f1", "#8b5cf6"] },
  purple: { pill: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.2)",  dot: "#7c3aed", line: ["#7c3aed", "#8b5cf6", "#c084fc"] },
  amber:  { pill: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  dot: "#f59e0b", line: ["#f59e0b", "#f97316", "#ec4899"] },
  green:  { pill: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)",  dot: "#10b981", line: ["#10b981", "#06b6d4", "#3b82f6"] },
  pink:   { pill: "rgba(236,72,153,0.08)",  border: "rgba(236,72,153,0.2)",  dot: "#ec4899", line: ["#ec4899", "#a855f7", "#6366f1"] },
};

export default function SectionTitle({
  label,
  title,
  highlight,
  description,
  align = "center",
  accent = "cyan",
}: SectionTitleProps) {
  const isCenter = align === "center";
  const a = ACCENT_MAP[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`mb-16 ${isCenter ? "text-center flex flex-col items-center" : "text-left"}`}
    >
      {/* ── Label pill ── */}
      <div
        className={`flex ${isCenter ? "justify-center" : "justify-start"} mb-5`}
      >
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{
            background: a.pill,
            border: `1px solid ${a.border}`,
            color: a.dot,
            letterSpacing: "0.15em",
          }}
        >
          {/* Animated dot */}
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: a.dot }}
            animate={{
              opacity: [1, 0.4, 1],
              scale:   [1, 1.3, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {label}
        </span>
      </div>

      {/* ── Headline ── */}
      <h2
        className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] ${
          isCenter ? "text-center" : "text-left"
        }`}
      >
        <span className="text-white">{title} </span>
        {highlight && (
          <span className="gradient-text">{highlight}</span>
        )}
      </h2>

      {/* ── Description ── */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className={`mt-5 text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed ${
            isCenter ? "text-center mx-auto" : "text-left"
          }`}
        >
          {description}
        </motion.p>
      )}

      {/* ── Decorative line ── */}
      <div
        className={`flex items-center ${isCenter ? "justify-center" : "justify-start"} mt-8 gap-1.5`}
      >
        <div
          className="h-0.5 w-24 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${a.line[0]}, ${a.line[1]})`,
          }}
        />
        <div
          className="h-0.5 w-8 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${a.line[1]}, ${a.line[2]})`,
          }}
        />
        <div
          className="h-0.5 w-3 rounded-full"
          style={{ background: a.line[2] }}
        />
        {/* Animated trailing dot */}
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: a.dot }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale:   [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}