import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import PageLoader from "@/components/ui/PageLoader";
import GlobalScene from "@/components/three/GlobalScene";
import ScrollWatcher from "@/components/three/ScrollWatcher";

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

export const metadata: Metadata = {
  title: {
    default: "Mayank Choudhary — AI & Full Stack Developer",
    template: "%s | Mayank Choudhary",
  },
  description:
    "Senior Full Stack & AI Developer specializing in building intelligent, scalable systems. Expert in React, Next.js, NestJS, Python, and cutting-edge AI technologies.",
  keywords: [
    "Mayank Choudhary",
    "Full Stack Developer",
    "AI Developer",
    "React Developer",
    "Next.js",
    "NestJS",
    "Machine Learning",
    "LangChain",
    "OpenAI",
    "Portfolio",
  ],
  authors: [{ name: "Mayank Choudhary" }],
  creator: "Mayank Choudhary",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Mayank Choudhary — AI & Full Stack Developer",
    description:
      "Senior Full Stack & AI Developer building intelligent, scalable systems.",
    siteName: "Mayank Choudhary Portfolio",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Mayank Choudhary Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayank Choudhary — AI & Full Stack Developer",
    description:
      "Senior Full Stack & AI Developer building intelligent, scalable systems.",
    images: ["/profile.jpg"],
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

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#020617] text-white overflow-x-hidden">
        {/* ── Layer 0: Fixed fullscreen 3D scene ── */}
        <GlobalScene />

        {/* ── Scroll + mouse watcher ── */}
        <ScrollWatcher />

        {/* ── UI overlays ── */}
        <PageLoader />
        <CustomCursor />

        {/* ── HTML content scrolls over scene ── */}
        {children}
      </body>
    </html>
  );
}