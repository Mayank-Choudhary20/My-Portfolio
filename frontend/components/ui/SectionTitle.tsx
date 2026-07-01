"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  label: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionTitle({
  label,
  title,
  highlight,
  description,
  align = "center",
}: SectionTitleProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`mb-16 ${isCenter ? "text-center" : "text-left"}`}
    >
      {/* Label */}
      <div className={`flex ${isCenter ? "justify-center" : "justify-start"} mb-5`}>
        <span className="section-label">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
          {label}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
        {title}{" "}
        {highlight && (
          <span className="gradient-text">{highlight}</span>
        )}
      </h2>

      {/* Description */}
      {description && (
        <p className={`mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed ${isCenter ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}

      {/* Decorative line */}
      <div className={`flex ${isCenter ? "justify-center" : "justify-start"} mt-8`}>
        <div className="h-px w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
        <div className="h-px w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-2" />
        <div className="h-px w-4 bg-purple-500 rounded-full" />
      </div>
    </motion.div>
  );
}