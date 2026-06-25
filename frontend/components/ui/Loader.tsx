"use client";

import { motion } from "framer-motion";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function Loader({ size = "md", text }: LoaderProps) {
  const sizes = {
    sm: { outer: 32, stroke: 2   },
    md: { outer: 48, stroke: 2.5 },
    lg: { outer: 72, stroke: 3   },
  };

  const { outer, stroke } = sizes[size];
  const radius       = (outer - stroke * 2) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: outer, height: outer }}>
        {/* Track */}
        <svg
          width={outer}
          height={outer}
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            strokeWidth={stroke}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
          />
        </svg>

        {/* Spinning arc */}
        <motion.svg
          width={outer}
          height={outer}
          className="absolute inset-0"
          style={{ rotate: -90 }}
          animate={{ rotate: 270 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id={`lg-${size}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            strokeWidth={stroke}
            fill="none"
            stroke={`url(#lg-${size})`}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.72}
          />
        </motion.svg>

        {/* Centre dot */}
        <motion.div
          className="absolute rounded-full bg-cyan-400"
          style={{
            width:      stroke * 2.5,
            height:     stroke * 2.5,
            top:        "50%",
            left:       "50%",
            transform:  "translate(-50%, -50%)",
            boxShadow:  "0 0 8px rgba(0,229,255,0.8)",
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {text && (
        <motion.p
          className="text-xs font-mono"
          style={{ color: "rgba(148,163,184,0.6)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}