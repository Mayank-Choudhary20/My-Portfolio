import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor  from "@/components/ui/CustomCursor";
import PageLoader    from "@/components/ui/PageLoader";
import GlobalScene   from "@/components/three/GlobalScene";
import ScrollWatcher from "@/components/three/ScrollWatcher";
import LiveSync      from "@/components/LiveSync";
import type { Setting, Profile } from "@/types/portfolio";

// ── Safe fetch with 3-second timeout ─────────────────────────
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function apiFetchSafe<T>(path: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000); // 3 s timeout

    const res = await fetch(`${BASE_URL}${path}`, {
      cache:   "no-store",
      headers: { "Content-Type": "application/json" },
      signal:  controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    // Backend unreachable, timed-out, or returned an error → fail gracefully
    return null;
  }
}

// ── Fonts ─────────────────────────────────────────────────────
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets:  ["latin"],
  display:  "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets:  ["latin"],
  display:  "swap",
});

// ── Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Both calls run in parallel; neither can hang longer than 3 seconds
    const [s, p] = await Promise.all([
      apiFetchSafe<Setting>("/settings"),
      apiFetchSafe<Profile>("/profile"),
    ]);

    const title =
      s?.seoTitle ||
      `${p?.name || "Mayank Choudhary"} — AI & Full Stack Developer`;

    const description =
      s?.seoDescription ||
      "Senior Full Stack & AI Developer specializing in building intelligent, scalable systems.";

    const name = p?.name || s?.portfolioName || "Mayank Choudhary";

    return {
      title:       { default: title, template: `%s | ${name}` },
      description,
      keywords:    [
        name,
        "Full Stack Developer",
        "AI Developer",
        "React Developer",
        "Next.js",
        "NestJS",
        "Machine Learning",
        "Portfolio",
      ],
      authors:     [{ name }],
      creator:     name,
      openGraph:   {
        type:      "website",
        locale:    "en_US",
        title,
        description,
        siteName:  `${name} Portfolio`,
        images:    [
          {
            url:    p?.profileImage || "/profile.jpg",
            width:  1200,
            height: 630,
            alt:    `${name} Portfolio`,
          },
        ],
      },
      twitter:     {
        card:        "summary_large_image",
        title,
        description,
        images:      [p?.profileImage || "/profile.jpg"],
      },
      robots:      {
        index:     true,
        follow:    true,
        googleBot: {
          index:                true,
          follow:               true,
          "max-video-preview":  -1,
          "max-image-preview":  "large",
          "max-snippet":        -1,
        },
      },
    };
  } catch {
    // Last-resort fallback — page will still render normally
    return {
      title:       "Mayank Choudhary — AI & Full Stack Developer",
      description: "Senior Full Stack & AI Developer building intelligent, scalable systems.",
    };
  }
}

// ── Viewport ──────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor:   "#020617",
  width:        "device-width",
  initialScale: 1,
};

// ── Root Layout ───────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                  document.body && (document.body.scrollTop = 0);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#020617] text-white overflow-x-hidden">
        <GlobalScene />
        <ScrollWatcher />
        <PageLoader />
        <CustomCursor />
        <LiveSync />
        {children}
      </body>
    </html>
  );
}