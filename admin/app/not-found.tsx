"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center p-6">
      <div>
        <p
          className="text-8xl font-black mb-4"
          style={{ color: "rgba(255,255,255,0.04)" }}
        >
          404
        </p>
        <h1 className="text-2xl font-bold mb-2 text-white">Page not found</h1>
        <p className="mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
          This page does not exist in the admin dashboard.
        </p>
        <Link
          href="/dashboard"
          className="btn-primary inline-flex items-center gap-2"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}