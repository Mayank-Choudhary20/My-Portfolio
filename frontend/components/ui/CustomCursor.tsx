"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide on mobile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    let animFrame: number;

    const moveDot = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const smoothRing = () => {
      const ease = 0.12;
      ringX += (dotX - ringX) * ease;
      ringY += (dotY - ringY) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      }
      animFrame = requestAnimationFrame(smoothRing);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor='pointer']"
      );
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", moveDot);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    animFrame = requestAnimationFrame(smoothRing);

    return () => {
      document.removeEventListener("mousemove", moveDot);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animFrame);
    };
  }, [isVisible]);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isClicking ? "scale(0.5)" : "scale(1)",
          background: isHovering ? "#8b5cf6" : "#00e5ff",
          width: isHovering ? "12px" : "8px",
          height: isHovering ? "12px" : "8px",
          transition: "opacity 0.2s, background 0.2s, width 0.2s, height 0.2s",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          opacity: isVisible ? 1 : 0,
          width: isHovering ? "52px" : "36px",
          height: isHovering ? "52px" : "36px",
          borderColor: isHovering
            ? "rgba(139,92,246,0.6)"
            : "rgba(0,229,255,0.6)",
          transform: isClicking ? "scale(0.8)" : undefined,
          transition:
            "opacity 0.2s, width 0.3s, height 0.3s, border-color 0.3s",
        }}
      />
    </>
  );
}