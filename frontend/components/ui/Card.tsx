"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover3d?: boolean;
  glowColor?: "blue" | "cyan" | "purple" | "none";
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  hover3d = false,
  glowColor = "none",
  onClick,
}: CardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const glowClasses = {
    blue: "hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
    cyan: "hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]",
    purple: "hover:shadow-[0_0_40px_rgba(124,58,237,0.2)]",
    none: "",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3d) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={`glass-card rounded-2xl ${glowClasses[glowColor]} ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        transform: hover3d
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
          : undefined,
        transition: "transform 0.1s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}