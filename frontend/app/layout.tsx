import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import PageLoader from "@/components/ui/PageLoader";
import GlobalScene from "@/components/three/GlobalScene";
import ScrollWatcher from "@/components/three/ScrollWatcher";
import { getSettings, getProfile } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [settings, profile] = await Promise.allSettled([
      getSettings(),
      getProfile(),
    ]);

    const s = settings.status === "fulfilled" ? settings.value : null;
    const p = profile.status === "fulfilled" ? profile.value : null;

    const title =
      s?.seoTitle ||
      `${p?.name || "Mayank Choudhary"} — AI & Full Stack Developer`;
    const description =
      s?.seoDescription ||
      "Senior Full Stack & AI Developer specializing in building intelligent, scalable systems.";
    const name = p?.name || s?.portfolioName || "Mayank Choudhary";

    return {
      title: {
        default: title,
        template: `%s | ${name}`,
      },
      description,
      keywords: [
        name,
        "Full Stack Developer",
        "AI Developer",
        "React Developer",
        "Next.js",
        "NestJS",
        "Machine Learning",
        "Portfolio",
      ],
      authors: [{ name }],
      creator: name,
      openGraph: {
        type: "website",
        locale: "en_US",
        title,
        description,
        siteName: `${name} Portfolio`,
        images: [
          {
            url: p?.profileImage || "/profile.jpg",
            width: 1200,
            height: 630,
            alt: `${name} Portfolio`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [p?.profileImage || "/profile.jpg"],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch {
    return {
      title: "Mayank Choudhary — AI & Full Stack Developer",
      description:
        "Senior Full Stack & AI Developer building intelligent, scalable systems.",
    };
  }
}

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

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
        {/*
          This inline script runs SYNCHRONOUSLY before any HTML
          is painted — before React hydrates, before useEffect,
          before the browser can restore scroll position.
          It disables scroll restoration and forces the page to
          start at the very top on every load/reload.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                  }
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
        {children}
      </body>
    </html>
  );
}