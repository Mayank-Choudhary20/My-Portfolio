"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAuthHydrated } from "@/lib/store";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();

  useEffect(() => {
    // Wait for Zustand to hydrate before deciding where to redirect.
    // Without this, isAuthenticated is always false on first render
    // and all users get sent to /login even when they are logged in.
    if (!hydrated) return;

    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  // Always show spinner on the root page — it only exists to redirect
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
    </div>
  );
}