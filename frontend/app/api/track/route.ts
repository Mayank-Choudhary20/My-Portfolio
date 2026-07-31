import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // ── These headers ARE present here because this runs on Vercel ──
    const country  = req.headers.get("x-vercel-ip-country")  ?? null;
    const city     = req.headers.get("x-vercel-ip-city")     ?? null;
    const ip       = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
                  ?? req.headers.get("x-real-ip")
                  ?? null;

    // ── User-agent for browser/OS/device parsing on the backend ──
    const userAgent = req.headers.get("user-agent") ?? "";

    // ── Forward everything to Render backend in the body ──────────
    await fetch(`${BACKEND}/visitor`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, city, ip, userAgent }),
      // Give it 5 seconds — fire and forget
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Never let tracking errors affect the user
  }

  return NextResponse.json({ ok: true });
}