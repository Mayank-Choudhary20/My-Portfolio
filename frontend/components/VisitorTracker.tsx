"use client";

import { useEffect } from "react";
import { trackVisitor } from "@/lib/api";

export default function VisitorTracker() {
  useEffect(() => {
    // Only track once per browser session
    // Prevents strict mode double-invoke and page re-renders
    const SESSION_KEY = "portfolio_tracked";

    if (sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    // Mark as tracked immediately to prevent race conditions
    sessionStorage.setItem(SESSION_KEY, "1");

    // Fire and forget — completely silent
    void trackVisitor();
  }, []);

  return null;
}