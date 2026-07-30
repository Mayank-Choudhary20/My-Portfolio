"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { SiLeetcode, SiCodechef } from "react-icons/si";
import {
  Mail,
  Download,
  ArrowUp,
  MapPin,
  Phone,
  Users,
  Globe2,
  Repeat2,
  CalendarDays,
  Building2,
  LucideProps,
} from "lucide-react";
import type { Profile, Resume, Setting, VisitorStats } from "@/types/portfolio";

interface FooterProps {
  profile?:      Profile      | null;
  resume?:       Resume       | null;
  settings?:     Setting      | null;
  visitorStats?: VisitorStats | null;
}

function toDirectDownloadUrl(url: string): string {
  if (!url) return url;
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  }
  const docsMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
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

// ── Animated counter ──────────────────────────────────────────
function useCounter(target: number, duration = 1400, active = false) {
  const [value, setValue]    = useState(0);
  const prevTarget           = useRef(0);
  const rafRef               = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const startValue       = prevTarget.current;
    const endValue         = target;
    prevTarget.current     = target;

    if (startValue === endValue) {
      setValue(endValue);
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(startValue + (endValue - startValue) * eased);
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(endValue);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, duration, active]);

  return value;
}

// ── FIXED: Use lucide-specific icon type instead of React.ElementType ──
// React.ElementType is too broad and causes 'size' prop to be typed
// as 'never' because react-icons components don't share the same
// prop interface as lucide-react icons.
type LucideIcon = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

interface StatConfig {
  key:      keyof VisitorStats;
  label:    string;
  suffix:   string;
  icon:     LucideIcon;        // ← was React.ElementType, now LucideIcon
  gradient: string;
  glow:     string;
  border:   string;
}

const STATS_CONFIG: StatConfig[] = [
  {
    key: "totalVisitors", label: "Total Visitors", suffix: "",
    icon: Users,
    gradient: "from-cyan-500 to-blue-500",
    glow: "rgba(0,229,255,0.2)", border: "rgba(0,229,255,0.3)",
  },
  {
    key: "countries", label: "Countries", suffix: "",
    icon: Globe2,
    gradient: "from-blue-500 to-violet-500",
    glow: "rgba(59,130,246,0.2)", border: "rgba(59,130,246,0.3)",
  },
  {
    key: "cities", label: "Cities", suffix: "",
    icon: Building2,
    gradient: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.3)",
  },
  {
    key: "returningPercentage", label: "Returning", suffix: "%",
    icon: Repeat2,
    gradient: "from-violet-500 to-purple-500",
    glow: "rgba(139,92,246,0.2)", border: "rgba(139,92,246,0.3)",
  },
  {
    key: "todayVisitors", label: "Today", suffix: "",
    icon: CalendarDays,
    gradient: "from-emerald-500 to-cyan-500",
    glow: "rgba(16,185,129,0.2)", border: "rgba(16,185,129,0.3)",
  },
];

function MiniStatCard({
  config,
  value,
  index,
  active,
}: {
  config: StatConfig;
  value:  number;
  index:  number;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const counted = useCounter(value, 1200, active);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={active ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      <div
        className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-sm"
        style={{ background: `linear-gradient(135deg, ${config.glow}, transparent)` }}
      />
      <motion.div
        className="relative rounded-xl p-4 flex items-center gap-3 h-full overflow-hidden"
        style={{
          background:     hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
          border:         hovered ? `1px solid ${config.border}` : "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          transition:     "background 0.3s, border 0.3s, box-shadow 0.3s",
          boxShadow:      hovered ? `0 12px 40px ${config.glow}` : "none",
        }}
        animate={hovered ? { y: -3 } : { y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* ── Icon: extracted to const + typed correctly ── */}
        <motion.div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
          animate={hovered ? { scale: 1.1, rotate: 4 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.2 }}
          style={{ boxShadow: hovered ? `0 6px 20px ${config.glow}` : undefined }}
        >
          {/* Using extracted const 'Icon' fixes the TypeScript error.
              config.icon inline was ambiguous — now TypeScript knows
              exactly which type it is rendering. */}
          <Icon size={18} className="text-white" />
        </motion.div>

        <div className="min-w-0">
          <div className="flex items-end gap-0.5">
            <span className="text-xl font-black text-white leading-none tabular-nums">
              {counted.toLocaleString()}
            </span>
            {config.suffix && (
              <span className="text-sm font-bold text-slate-400 mb-px">
                {config.suffix}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-semibold tracking-wide uppercase">
            {config.label}
          </p>
        </div>

        <motion.div
          className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "200%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function Footer({
  profile,
  resume,
  settings,
  visitorStats,
}: FooterProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const statsRef    = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: false, margin: "-60px" });

  const portfolioName = settings?.portfolioName || profile?.name        || "Mayank Choudhary";
  const tagline       = profile?.tagline        || settings?.heroSubtitle || "Building intelligent, scalable systems.";
  const location      = settings?.location      || profile?.location    || null;
  const email         = settings?.email         || profile?.email       || null;
  const phone         = settings?.phone         || profile?.phone       || null;
  const resumeUrl     = settings?.resumeUrl     || resume?.fileUrl      || null;
  const profileTitle  = profile?.title          || "AI & Full Stack Developer";

  const github    = settings?.githubUrl    || profile?.github    || null;
  const linkedin  = settings?.linkedinUrl  || profile?.linkedin  || null;
  const twitter   = settings?.twitterUrl   || profile?.twitter   || null;
  const instagram = settings?.instagramUrl || profile?.instagram || null;
  const leetcode  = settings?.leetcodeUrl  || profile?.leetcode  || null;
  const codechef  = settings?.codechefUrl  || profile?.codechef  || null;

  const socials = [
    { icon: FaGithub,    href: github,    label: "GitHub",    color: "#ffffff" },
    { icon: FaLinkedin,  href: linkedin,  label: "LinkedIn",  color: "#0ea5e9" },
    { icon: FaTwitter,   href: twitter,   label: "Twitter",   color: "#1da1f2" },
    { icon: FaInstagram, href: instagram, label: "Instagram", color: "#e1306c" },
    { icon: SiLeetcode,  href: leetcode,  label: "LeetCode",  color: "#ffa116" },
    { icon: SiCodechef,  href: codechef,  label: "CodeChef",  color: "#a9733c" },
  ].filter((s) => s.href);

  const navSections = [
    { label: "About",        href: "#about"           },
    { label: "Education",    href: "#education"       },
    { label: "Skills",       href: "#skills"          },
    { label: "Experience",   href: "#experience"      },
    { label: "Projects",     href: "#projects"        },
    { label: "Certificates", href: "#certificates"    },
    { label: "Showcase",     href: "#showcase"        },
    { label: "Profiles",     href: "#coding-profiles" },
    { label: "Resume",       href: "#resume"          },
    { label: "Ask AI",       href: "#ai"              },
    { label: "Contact",      href: "#contact"         },
  ];

  const stats: VisitorStats = visitorStats ?? {
    totalVisitors: 0, countries: 0, cities: 0,
    returningPercentage: 0, todayVisitors: 0,
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "rgba(2,6,23,0.95)",
        borderTop:  "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/4 blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-purple-600/4 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-cyan-600/3 blur-[120px]" />
      </div>

      <div className="relative section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white"
                style={{ background: "linear-gradient(135deg, #00e5ff, #3b82f6)" }}
              >
                {portfolioName[0]}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{portfolioName}</div>
                <div className="text-xs text-slate-500">{profileTitle}</div>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-xs">
              {tagline}
            </p>
            {location && (
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                <MapPin size={11} /><span>{location}</span>
              </div>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-cyan-400 transition-colors mb-2"
              >
                <Mail size={11} /><span>{email}</span>
              </a>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={11} /><span>{phone}</span>
              </div>
            )}
          </div>

          {/* ── Nav col 1 ── */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 tracking-widest uppercase">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navSections.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-cyan-400 text-xs">
                      ›
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Nav col 2 ── */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 tracking-widest uppercase">
              More
            </h4>
            <ul className="space-y-2">
              {navSections.slice(6).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-cyan-400 text-xs">
                      ›
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Connect ── */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 tracking-widest uppercase">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2 mb-5">
              {socials.map((s) => {
                const SocialIcon = s.icon;
                return (
                  <motion.a
                    key={s.label}
                    href={s.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border:     "1px solid rgba(255,255,255,0.07)",
                    }}
                    whileHover={{
                      y: -3,
                      scale: 1.1,
                      color: s.color,
                      borderColor: `${s.color}40`,
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SocialIcon size={15} />
                  </motion.a>
                );
              })}
            </div>
            {resumeUrl && (
              <button
                onClick={() =>
                  downloadResume(
                    resumeUrl,
                    `${profile?.name?.replace(/\s+/g, "_") || "Resume"}.pdf`
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(124,58,237,0.2))",
                  border:     "1px solid rgba(59,130,246,0.3)",
                  outline:    "none",
                }}
              >
                <Download size={14} />
                Download Resume
              </button>
            )}
          </div>
        </div>

        {/* ── Live analytics ── */}
        <div
          ref={statsRef}
          className="mb-8"
          style={{
            borderTop:     "1px solid rgba(255,255,255,0.05)",
            borderBottom:  "1px solid rgba(255,255,255,0.05)",
            paddingTop:    "2rem",
            paddingBottom: "2rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-white/10" />
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(0,229,255,0.05)",
                border:     "1px solid rgba(0,229,255,0.12)",
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="text-cyan-400 font-semibold"
                style={{
                  fontSize:      "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Live Analytics
              </span>
            </div>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-white/10" />
          </motion.div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            role="list"
            aria-label="Portfolio visitor statistics"
          >
            {STATS_CONFIG.map((cfg, i) => (
              <div key={cfg.key} role="listitem">
                <MiniStatCard
                  config={cfg}
                  value={stats[cfg.key] as number}
                  index={i}
                  active={statsInView}
                />
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={statsInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <span className="text-[9px] text-slate-700 font-mono tracking-wider">
              Real-time visitor data • Auto-updated
            </span>
          </motion.div>
        </div>

        {/* ── Copyright ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} {portfolioName}. All rights reserved.
          </div>
          <motion.button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border:     "1px solid rgba(255,255,255,0.07)",
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}