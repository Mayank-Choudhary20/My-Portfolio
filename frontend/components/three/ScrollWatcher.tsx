"use client";

import { useEffect } from "react";
import { useSceneStore, SectionName } from "@/lib/sceneStore";

const SECTIONS: SectionName[] = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "certificates",
  "showcase",
  "contact",
  "footer",
];

export default function ScrollWatcher() {
  const { setSection, setMouse, setScrollY } = useSceneStore();

  useEffect(() => {
    // Mouse tracking
    const handleMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = -((e.clientY / window.innerHeight) - 0.5) * 2;
      setMouse(
        Math.max(-1, Math.min(1, nx)),
        Math.max(-1, Math.min(1, ny))
      );
    };

    // Scroll tracking + section detection
    const handleScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);

      // Find current section
      let current: SectionName = "hero";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5) {
            current = id;
          }
        }
      }
      setSection(current);
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setSection, setMouse, setScrollY]);

  return null;
}