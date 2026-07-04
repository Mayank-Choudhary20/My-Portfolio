"use client";

import { useEffect } from "react";

/**
 * Client-side scroll reset — runs after hydration as a
 * secondary safety net. The primary reset is the inline
 * script in layout.tsx <head> which fires before paint.
 */
export default function ScrollToTop() {
  useEffect(() => {
    // Disable browser scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Secondary scroll reset after hydration
    // Use requestAnimationFrame to run after first paint
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}