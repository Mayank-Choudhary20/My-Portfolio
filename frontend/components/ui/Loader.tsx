"use client";

import { motion } from "framer-motion";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function Loader({ size = "md", text }: LoaderProps) {
  const sizes = {
    sm: { outer: 32, inner: 20, stroke: 2 },
    md: { outer: 48, inner: 32, stroke: 2.5 },
    lg: { outer: 72, inner: 48, stroke: 3 },
  };

  const { outer, inner, stroke } = sizes[size];
  const radius = (outer - stroke * 2) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: outer, height: outer }}>
        {/* Background circle */}
        <svg width={outer} height={outer} className="absolute inset-0">
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            strokeWidth={stroke}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
          />
        </svg>
        {/* Animated ring */}
        <motion.svg
          width={outer}
          height={outer}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            strokeWidth={stroke}
            fill="none"
            stroke="url(#loaderGrad)"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
          />
          <defs>
            <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </motion.svg>
        {/* Inner dot */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"
          style={{
            width: inner - 16,
            height: inner - 16,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      {text && (
        <p className="text-sm text-slate-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}