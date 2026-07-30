"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Mail,
  Download,
  ChevronDown,
  Terminal,
  Brain,
  Code2,
  GraduationCap,
  LucideProps,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import HeroBackground from "@/components/Hero/Background";
import type { Profile, Resume, Project, Certificate, Setting } from "@/types/portfolio";

type HeroProps = {
  profile:      Profile      | null;
  resume:       Resume       | null;
  projects:     Project[];
  certificates: Certificate[];
  settings:     Setting      | null;
};

// ── Lucide-specific icon type ─────────────────────────────────
type LucideIcon = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

function toDirectDownloadUrl(url: string): string {
  if (!url) return url;
  const driveMatch = url.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );
  if (driveMatch) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  }
  const docsMatch = url.match(
    /docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/
  );
  if (docsMatch) {
    return `https://docs.google.com/document/d/${docsMatch[1]}/export?format=pdf`;
  }
  return url;
}

function downloadResume(rawUrl: string, filename: string) {
  const url = toDirectDownloadUrl(rawUrl);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.target   = "_blank";
  a.rel      = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function parseTypingTexts(
  raw:           string | null | undefined,
  fallbackTitle: string | null | undefined
): string[] {
  if (raw && raw.trim()) {
    if (raw.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t: string) => t.trim()).filter(Boolean);
        }
      } catch {
        // fall through
      }
    }
    const parts = raw.split(",").map((t) => t.trim()).filter(Boolean);
    if (parts.length > 0) return parts;
  }
  return [
    fallbackTitle || "Full Stack Developer",
    "AI / ML Engineer",
    "System Architect",
    "Open Source Builder",
    "Problem Solver",
  ];
}

function useTypingEffect(texts: string[], speed = 80, pause = 2200) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting,  setDeleting ] = useState(false);

  useEffect(() => {
    const current = texts[textIndex] ?? "";
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timer = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timer = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }

    setDisplayed(current.slice(0, charIndex));
    return () => clearTimeout(timer);
  }, [texts, textIndex, charIndex, deleting, speed, pause]);

  return displayed;
}

// ── Stat Card ─────────────────────────────────────────────────
// FIXED: icon typed as LucideIcon instead of React.ElementType
function StatCard({
  value,
  label,
  icon,
  delay,
}: {
  value: string;
  label: string;
  icon:  LucideIcon;
  delay: number;
}) {
  // Extract to capitalized const
  const Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        background:     "rgba(2,6,23,0.7)",
        border:         "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg,rgba(0,229,255,0.15),rgba(59,130,246,0.15))",
        }}
      >
        <Icon size={14} className="text-cyan-400" />
      </div>
      <div>
        <div className="text-base font-black text-white leading-none">{value}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

function formatCount(count: number): string {
  return count > 0 ? `${count}+` : "0";
}

export default function Hero({
  profile,
  resume,
  projects,
  certificates,
  settings,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end start"],
  });
  const contentY       = useTransform(scrollYProgress, [0, 1],   [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const greeting       = settings?.heroGreeting ?? "Hello, I'm";
  const availableText  = settings?.heroAvailableText ?? "Available for Opportunities";
  const busyText       = settings?.heroBusyText      ?? "Currently Occupied";
  const badgeText      = profile?.available !== false ? availableText : busyText;
  const heroSubtitle   =
    settings?.heroSubtitle ||
    profile?.tagline ||
    "Building intelligent systems at the intersection of AI and exceptional user experiences.";

  const typingTexts = parseTypingTexts(
    settings?.heroTypingTexts,
    settings?.heroTitle || profile?.title
  );
  const typedText   = useTypingEffect(typingTexts, 75, 2200);
  const resumeUrl   = settings?.resumeUrl || resume?.fileUrl || null;

  const firstName   = profile?.name?.split(" ")[0]                || "Mayank";
  const lastName    = profile?.name?.split(" ").slice(1).join(" ") || "Choudhary";

  const githubUrl   = settings?.githubUrl   || profile?.github   || null;
  const linkedinUrl = settings?.linkedinUrl || profile?.linkedin || null;
  const emailAddr   = settings?.email       || profile?.email    || null;

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.07, delayChildren: 2.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show:   {
      opacity: 1,
      y:       0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const },
    },
  };

  const yearsExp      = profile?.yearsExperience ?? 3;
  const projectsCount = projects.length;
  const certsCount    = certificates.length;

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      style={{
        position:   "relative",
        minHeight:  "100vh",
        background: "transparent",
        overflow:   "hidden",
      }}
    >
      <HeroBackground />

      {/* Decorative blobs */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            top: "-10%", left: "-10%",
            width: "55vw", height: "55vw",
            maxWidth: 700, maxHeight: 700,
            background:
              "radial-gradient(circle,rgba(29,78,216,0.08) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "30%", right: "-10%",
            width: "45vw", height: "45vw",
            maxWidth: 600, maxHeight: 600,
            background:
              "radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-5%", left: "30%",
            width: "35vw", height: "35vw",
            maxWidth: 450, maxHeight: 450,
            background:
              "radial-gradient(circle,rgba(0,229,255,0.04) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.015) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(0,229,255,0.015) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{
          y:        contentY,
          opacity:  contentOpacity,
          position: "relative",
          zIndex:   10,
        }}
      >
        <div
          className="section-container"
          style={{
            paddingTop:    "96px",
            paddingBottom: "80px",
            minHeight:     "100vh",
            display:       "flex",
            alignItems:    "center",
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{
              width:    "100%",
              maxWidth: "clamp(320px, 52%, 680px)",
              zIndex:   20,
            }}
          >
            {/* Available badge */}
            <motion.div variants={item} style={{ marginBottom: "1.5rem" }}>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: profile?.available !== false
                    ? "rgba(16,185,129,0.08)"
                    : "rgba(239,68,68,0.08)",
                  border: profile?.available !== false
                    ? "1px solid rgba(16,185,129,0.25)"
                    : "1px solid rgba(239,68,68,0.25)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                  style={{
                    background: profile?.available !== false ? "#34d399" : "#f87171",
                  }}
                />
                <span
                  style={{
                    color:         profile?.available !== false ? "#34d399" : "#f87171",
                    fontSize:      "0.7rem",
                    fontWeight:    600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {badgeText}
                </span>
              </div>
            </motion.div>

            {/* Greeting */}
            <motion.p
              variants={item}
              style={{
                color:         "#64748b",
                fontSize:      "0.75rem",
                fontWeight:    600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom:  "0.5rem",
              }}
            >
              {greeting}
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={item}
              style={{
                fontSize:      "clamp(2.6rem,5.5vw,4.5rem)",
                fontWeight:    900,
                lineHeight:    0.95,
                marginBottom:  "1.25rem",
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: "#f1f5f9", display: "block" }}>
                {firstName}
              </span>
              <span
                style={{
                  display:              "block",
                  background:           "linear-gradient(135deg,#00e5ff 0%,#3b82f6 50%,#8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                }}
              >
                {lastName}
              </span>
            </motion.h1>

            {/* Typing role */}
            <motion.div
              variants={item}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width:        32,
                  height:       32,
                  borderRadius: 8,
                  background:   "rgba(0,229,255,0.1)",
                  border:       "1px solid rgba(0,229,255,0.2)",
                }}
              >
                <Terminal size={14} className="text-cyan-400" />
              </div>
              <div
                className="flex items-center"
                style={{ fontFamily: "monospace" }}
              >
                <span
                  style={{
                    fontSize:             "clamp(1rem,2vw,1.25rem)",
                    fontWeight:           700,
                    background:           "linear-gradient(135deg,#00e5ff,#3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor:  "transparent",
                    backgroundClip:       "text",
                    minWidth:             "1ch",
                  }}
                >
                  {typedText}
                </span>
                <span
                  className="animate-pulse"
                  style={{
                    display:      "inline-block",
                    width:        2,
                    height:       20,
                    background:   "#00e5ff",
                    borderRadius: 1,
                    marginLeft:   3,
                  }}
                />
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={item}
              style={{
                color:        "#94a3b8",
                lineHeight:   1.7,
                maxWidth:     460,
                marginBottom: "2rem",
                fontSize:     "clamp(0.875rem,1.6vw,1rem)",
              }}
            >
              {heroSubtitle}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={item}
              style={{
                display:      "flex",
                flexWrap:     "wrap",
                gap:          "0.75rem",
                marginBottom: "1.75rem",
              }}
            >
              {resumeUrl && (
                <motion.button
                  onClick={() =>
                    downloadResume(
                      resumeUrl,
                      `${profile?.name?.replace(/\s+/g, "_") || "Resume"}.pdf`
                    )
                  }
                  className="flex items-center gap-2 font-semibold text-white rounded-xl"
                  style={{
                    padding:    "0.7rem 1.5rem",
                    fontSize:   "0.875rem",
                    background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
                    boxShadow:  "0 4px 18px rgba(59,130,246,0.3)",
                    border:     "none",
                    cursor:     "pointer",
                  }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Download size={15} />
                  Download Resume
                </motion.button>
              )}
              <motion.a
                href="#contact"
                className="flex items-center gap-2 font-semibold rounded-xl"
                style={{
                  padding:        "0.7rem 1.5rem",
                  fontSize:       "0.875rem",
                  color:          "#cbd5e1",
                  background:     "rgba(2,6,23,0.7)",
                  border:         "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail size={15} />
                Get In Touch
              </motion.a>
            </motion.div>

            {/* Socials */}
            <motion.div
              variants={item}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "0.75rem",
                marginBottom: "2rem",
              }}
            >
              <span
                style={{
                  fontSize:      "0.65rem",
                  color:         "#334155",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight:    600,
                }}
              >
                Follow
              </span>
              <div
                style={{
                  height:     1,
                  width:      24,
                  background: "rgba(255,255,255,0.08)",
                }}
              />
              {[
                { icon: FaGithub,   href: githubUrl,   label: "GitHub"   },
                { icon: FaLinkedin, href: linkedinUrl, label: "LinkedIn" },
              ]
                .filter((s) => s.href)
                .map((s) => {
                  const SocialIcon = s.icon;
                  return (
                    <motion.a
                      key={s.label}
                      href={s.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                      style={{
                        width:          38,
                        height:         38,
                        borderRadius:   10,
                        background:     "rgba(2,6,23,0.7)",
                        border:         "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(12px)",
                      }}
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <SocialIcon size={16} />
                    </motion.a>
                  );
                })}
              {emailAddr && (
                <motion.a
                  href={`mailto:${emailAddr}`}
                  aria-label="Email"
                  className="flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-colors"
                  style={{
                    width:          38,
                    height:         38,
                    borderRadius:   10,
                    background:     "rgba(2,6,23,0.7)",
                    border:         "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                  }}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail size={16} />
                </motion.a>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}
            >
              <StatCard
                value={`${yearsExp}+`}
                label="Years Exp."
                icon={Code2}
                delay={2.7}
              />
              <StatCard
                value={formatCount(projectsCount)}
                label="Projects"
                icon={Brain}
                delay={2.8}
              />
              <StatCard
                value={formatCount(certsCount)}
                label="Certificates"
                icon={GraduationCap}
                delay={2.9}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute flex flex-col items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors"
        style={{
          bottom:     24,
          left:       "50%",
          transform:  "translateX(-50%)",
          zIndex:     20,
          background: "none",
          border:     "none",
          cursor:     "pointer",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.0, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        aria-label="Scroll down"
      >
        <span
          style={{
            fontSize:      "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight:    600,
          }}
        >
          Explore
        </span>
        <motion.div
          animate={{ y: [0, 5, 6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </motion.button>
    </section>
  );
}