"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate toward end
        const increment = prev < 70 ? Math.random() * 15 : Math.random() * 5;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020617] overflow-hidden"
        >
          {/* Animated grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Glowing orbs */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />

          {/* Logo / Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10 text-center mb-12"
          >
            {/* Scanning circle */}
            <div className="relative mx-auto mb-8 w-24 h-24 flex items-center justify-center">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: "#00e5ff",
                  borderRightColor: "#3b82f6",
                }}
              />
              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: "#7c3aed",
                  borderLeftColor: "#00e5ff",
                }}
              />
              {/* Inner */}
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                <span className="text-white font-black text-lg">M</span>
              </div>
            </div>

            <motion.h1
              className="text-2xl font-bold tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="gradient-text">MAYANK CHOUDHARY</span>
            </motion.h1>

            <motion.p
              className="text-sm text-slate-500 tracking-[0.3em] uppercase mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              AI & Full Stack Developer
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 w-64"
          >
            <div className="flex justify-between text-xs text-slate-600 mb-2 font-mono">
              <span>Initializing</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #3b82f6, #00e5ff, #7c3aed)",
                  boxShadow: "0 0 10px rgba(0,229,255,0.6)",
                  transition: "width 0.1s ease",
                }}
              />
            </div>

            {/* Status text */}
            <motion.div
              className="mt-3 text-center font-mono text-xs text-slate-600"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {progress < 30
                ? "Loading assets..."
                : progress < 60
                ? "Initializing 3D scene..."
                : progress < 85
                ? "Preparing portfolio..."
                : "Almost ready..."}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}