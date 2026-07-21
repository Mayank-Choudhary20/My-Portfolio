"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  User,
  BookOpen,
  Briefcase,
  Code2,
  FolderOpen,
  Monitor,
  Award,
  Cpu,
  FileText,
  Bot,
  Mail,
  Sparkles,
  GitBranch,
} from "lucide-react";
import type { Profile, Setting } from "@/types/portfolio";

interface NavbarProps {
  profile?: Profile | null;
  settings?: Setting | null;
}

// ── Section icons ─────────────────────────────────────────────
const SECTION_ICONS: Record<string, React.ElementType> = {
  "#about":           User,
  "#education":       BookOpen,
  "#experience":      Briefcase,
  "#projects":        FolderOpen,
  "#showcase":        Monitor,
  "#certificates":    Award,
  "#skills":          Cpu,
  "#coding-profiles": GitBranch,
  "#resume":          FileText,
  "#ai":              Bot,
  "#contact":         Mail,
};

// ── Nav structure ─────────────────────────────────────────────
interface NavChild {
  label: string;
  href: string;
  desc: string;
}

interface NavGroupDef {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  children: NavChild[];
}

const NAV_GROUPS: NavGroupDef[] = [
  {
    id:    "about",
    label: "About",
    href:  "#about",
    icon:  User,
    children: [
      { label: "About Me",   href: "#about",      desc: "Who I am"           },
      { label: "Education",  href: "#education",   desc: "Academic background" },
      { label: "Experience", href: "#experience",  desc: "Work history"        },
    ],
  },
  {
    id:    "work",
    label: "Work",
    href:  "#projects",
    icon:  FolderOpen,
    children: [
      { label: "Projects",     href: "#projects",     desc: "What I've built" },
      { label: "Showcase",     href: "#showcase",     desc: "Live demos"      },
      { label: "Certificates", href: "#certificates", desc: "My credentials"  },
    ],
  },
  {
    id:    "skills",
    label: "Skills",
    href:  "#skills",
    icon:  Code2,
    children: [
      { label: "Tech Skills",     href: "#skills",          desc: "Technologies I use" },
      { label: "Coding Profiles", href: "#coding-profiles", desc: "GitHub, LeetCode…"  },
    ],
  },
  {
    id:       "resume",
    label:    "Resume",
    href:     "#resume",
    icon:     FileText,
    children: [],
  },
  {
    id:       "ai",
    label:    "Ask AI",
    href:     "#ai",
    icon:     Bot,
    children: [],
  },
  {
    id:       "contact",
    label:    "Contact",
    href:     "#contact",
    icon:     Mail,
    children: [],
  },
];

// Section → Group ID (explicit mapping)
const SECTION_TO_GROUP: Record<string, string> = {
  "hero":            "",
  "about":           "about",
  "education":       "about",
  "experience":      "about",
  "projects":        "work",
  "certificates":    "work",
  "showcase":        "work",
  "skills":          "skills",
  "coding-profiles": "skills",
  "resume":          "resume",
  "ai":              "ai",
  "contact":         "contact",
};

// Sections in EXACT page order (must match page.tsx)
const PAGE_SECTIONS = [
  "hero",
  "about",
  "education",
  "skills",
  "experience",
  "projects",
  "certificates",
  "showcase",
  "coding-profiles",
  "resume",
  "ai",
  "contact",
];

// Mobile flat links
const MOBILE_LINKS = [
  { label: "About Me",        href: "#about",           icon: User       },
  { label: "Education",       href: "#education",       icon: BookOpen   },
  { label: "Experience",      href: "#experience",      icon: Briefcase  },
  { label: "Projects",        href: "#projects",        icon: FolderOpen },
  { label: "Showcase",        href: "#showcase",        icon: Monitor    },
  { label: "Certificates",    href: "#certificates",    icon: Award      },
  { label: "Tech Skills",     href: "#skills",          icon: Cpu        },
  { label: "Coding Profiles", href: "#coding-profiles", icon: GitBranch  },
  { label: "Resume",          href: "#resume",          icon: FileText   },
  { label: "Ask AI",          href: "#ai",              icon: Bot        },
  { label: "Contact",         href: "#contact",         icon: Mail       },
];

// ── Detect active section from scroll position ────────────────
function detectActiveSection(): string {
  const scrollY = window.scrollY;
  const viewportH = window.innerHeight;
  const detectionLine = scrollY + viewportH * 0.3;

  let bestId = "hero";

  for (const id of PAGE_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;

    const elTop = el.offsetTop;

    if (elTop <= detectionLine) {
      bestId = id;
    } else {
      break;
    }
  }

  if (scrollY + viewportH >= document.documentElement.scrollHeight - 50) {
    bestId = "contact";
  }

  return bestId;
}

// ── Dropdown panel ────────────────────────────────────────────
function DropdownPanel({
  group,
  activeSection,
  onNavigate,
  onClose,
}: {
  group: NavGroupDef;
  activeSection: string;
  onNavigate: (href: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[60]"
      style={{ minWidth: "210px" }}
    >
      <div
        className="rounded-2xl overflow-hidden p-1.5"
        style={{
          background: "rgba(6,10,24,0.98)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,229,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
          backdropFilter: "blur(32px)",
        }}
      >
        {group.children.map((child, i) => {
          const childId  = child.href.replace("#", "");
          const isActive = activeSection === childId;
          const Icon     = SECTION_ICONS[child.href] ?? Sparkles;

          return (
            <motion.button
              key={child.href}
              onClick={() => {
                onClose();
                onNavigate(child.href);
              }}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.18 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
              style={{
                background: isActive
                  ? "linear-gradient(135deg,rgba(0,229,255,0.1),rgba(59,130,246,0.06))"
                  : "transparent",
                transition: "background 0.15s ease",
              }}
              whileHover={{
                background:
                  "linear-gradient(135deg,rgba(0,229,255,0.07),rgba(59,130,246,0.04))",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: isActive
                    ? "rgba(0,229,255,0.15)"
                    : "rgba(255,255,255,0.05)",
                  border: isActive
                    ? "1px solid rgba(0,229,255,0.25)"
                    : "1px solid rgba(255,255,255,0.07)",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={13} style={{ color: isActive ? "#00e5ff" : "#64748b" }} />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-medium leading-tight"
                  style={{ color: isActive ? "#00e5ff" : "#cbd5e1" }}
                >
                  {child.label}
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5 leading-none">
                  {child.desc}
                </div>
              </div>

              {isActive && (
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#00e5ff" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Nav Group button ──────────────────────────────────────────
function NavGroupButton({
  group,
  isGroupActive,
  activeSection,
  onNavigate,
  variant = "default",
}: {
  group: NavGroupDef;
  isGroupActive: boolean;
  activeSection: string;
  onNavigate: (href: string) => void;
  variant?: "default" | "resume" | "ai" | "contact";
}) {
  const [open, setOpen] = useState(false);
  const hasChildren     = group.children.length > 0;
  const closeTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => () => cancelClose(), []);

  // ── Variant styles ────────────────────────────────────────
  const getVariantStyle = () => {
    if (variant === "resume") {
      return {
        base: "relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap select-none outline-none transition-all duration-150",
        idle: {
          color: isGroupActive ? "#ffffff" : "#e2e8f0",
          background: isGroupActive
            ? "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.1))"
            : "rgba(255,255,255,0.06)",
          border: isGroupActive
            ? "1px solid rgba(0,229,255,0.3)"
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: isGroupActive ? "0 0 12px rgba(0,229,255,0.1)" : "none",
        },
      };
    }

    if (variant === "ai") {
      return {
        base: "relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap select-none outline-none transition-all duration-150",
        idle: {
          color: isGroupActive ? "#ffffff" : "#e2e8f0",
          background: isGroupActive
            ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.12))"
            : "rgba(124,58,237,0.08)",
          border: isGroupActive
            ? "1px solid rgba(124,58,237,0.4)"
            : "1px solid rgba(124,58,237,0.18)",
          boxShadow: isGroupActive ? "0 0 12px rgba(124,58,237,0.15)" : "none",
        },
      };
    }

    if (variant === "contact") {
      return {
        base: "relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap select-none outline-none transition-all duration-150",
        idle: {
          color: "#020617",
          background: isGroupActive
            ? "linear-gradient(135deg, #00e5ff, #3b82f6)"
            : "linear-gradient(135deg, #00e5ff, #3b82f6)",
          border: "1px solid transparent",
          boxShadow: isGroupActive
            ? "0 0 20px rgba(0,229,255,0.4)"
            : "0 0 12px rgba(0,229,255,0.25)",
        },
      };
    }

    // default (grouped items: About, Work, Skills)
    return {
      base: "relative flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap select-none outline-none",
      idle: {
        color: isGroupActive ? "#ffffff" : "#94a3b8",
      },
    };
  };

  const variantStyle = getVariantStyle();
  const Icon = group.icon;

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        if (hasChildren) setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <motion.button
        onClick={() => {
          if (!hasChildren) {
            onNavigate(group.href);
          } else {
            onNavigate(group.href);
          }
        }}
        className={variantStyle.base}
        style={variantStyle.idle}
        whileHover={
          variant === "contact"
            ? { boxShadow: "0 0 28px rgba(0,229,255,0.5)", scale: 1.03 }
            : variant === "ai"
            ? { background: "rgba(124,58,237,0.15)", scale: 1.02 }
            : variant === "resume"
            ? { background: "rgba(255,255,255,0.09)", scale: 1.02 }
            : { color: "#ffffff" }
        }
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12 }}
      >
        {/* Active pill — only for default grouped items */}
        {variant === "default" && (
          <AnimatePresence>
            {isGroupActive && (
              <motion.span
                key={`pill-${group.id}`}
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                style={{
                  background:
                    "linear-gradient(135deg,rgba(0,229,255,0.13),rgba(59,130,246,0.08))",
                  border: "1px solid rgba(0,229,255,0.22)",
                  boxShadow: "0 0 14px rgba(0,229,255,0.07)",
                }}
              />
            )}
          </AnimatePresence>
        )}

        <span className="relative z-10 flex items-center gap-1.5">
          {/* Show icon for standalone items */}
          {variant !== "default" && (
            <Icon
              size={13}
              style={{
                color:
                  variant === "contact"
                    ? "#020617"
                    : variant === "ai"
                    ? isGroupActive
                      ? "#a78bfa"
                      : "#8b5cf6"
                    : isGroupActive
                    ? "#00e5ff"
                    : "#94a3b8",
              }}
            />
          )}
          {group.label}
          {hasChildren && (
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <ChevronDown
                size={12}
                style={{ color: isGroupActive ? "#00e5ff" : "#475569" }}
              />
            </motion.span>
          )}
        </span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {hasChildren && open && (
          <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
            <DropdownPanel
              group={group}
              activeSection={activeSection}
              onNavigate={onNavigate}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Separator ─────────────────────────────────────────────────
function NavSeparator() {
  return (
    <div
      className="w-px h-4 flex-shrink-0 self-center"
      style={{ background: "rgba(255,255,255,0.1)" }}
    />
  );
}

// ── Main Navbar ───────────────────────────────────────────────
export default function Navbar({ profile, settings }: NavbarProps) {
  const [scrolled,      setScrolled     ] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen,    setMobileOpen   ] = useState(false);

  const portfolioName =
    settings?.portfolioName || profile?.name || "Mayank Choudhary";
  const isAvailable = profile?.available ?? true;
  const nameFirst   = portfolioName.split(" ")[0] ?? "";
  const nameLast    = portfolioName.split(" ").slice(1).join(" ");

  // ── Scroll tracking ────────────────────────────────────────
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 24);
    const detected = detectActiveSection();
    setActiveSection(detected);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  // ── Body lock ──────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Navigate ───────────────────────────────────────────────
  const navigate = useCallback(
    (href: string) => {
      setMobileOpen(false);
      if (href === "#hero" || href === "") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const delay = mobileOpen ? 320 : 0;
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, delay);
    },
    [mobileOpen]
  );

  const activeGroupId = SECTION_TO_GROUP[activeSection] ?? "";

  const groupedNavs    = NAV_GROUPS.filter((g) => g.children.length > 0);
  const standaloneNavs = NAV_GROUPS.filter((g) => g.children.length === 0);

  // Map standalone IDs to their visual variant
  const standaloneVariantMap: Record<string, "resume" | "ai" | "contact"> = {
    resume:  "resume",
    ai:      "ai",
    contact: "contact",
  };

  return (
    <>
      {/* ══════════════════════════════════
          DESKTOP NAVBAR
      ══════════════════════════════════ */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: 2.2 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          padding: scrolled ? "8px 0" : "16px 0",
          background: scrolled ? "rgba(2,6,23,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 40px rgba(0,0,0,0.6)" : "none",
          transition:
            "padding 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="section-container">
          <div className="flex items-center justify-between">

            {/* ── Logo ── */}
            <motion.button
              onClick={() => navigate("#hero")}
              className="flex items-center gap-3 flex-shrink-0"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Scroll to top"
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, #00e5ff 0%, #3b82f6 60%, #7c3aed 100%)",
                    boxShadow: "0 0 18px rgba(0,229,255,0.35)",
                  }}
                >
                  {nameFirst[0] || "M"}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    background: isAvailable ? "#10b981" : "#ef4444",
                    borderColor: "#020617",
                    boxShadow: isAvailable
                      ? "0 0 6px rgba(16,185,129,0.8)"
                      : "0 0 6px rgba(239,68,68,0.8)",
                  }}
                />
              </div>
              <div className="hidden sm:block leading-none">
                <div className="text-sm font-bold text-white">
                  {nameFirst}{" "}
                  <span className="gradient-text">{nameLast}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {profile?.title || "AI & Full Stack Developer"}
                </div>
              </div>
            </motion.button>

            {/* ── Desktop nav ── */}
            <nav
              className="hidden lg:flex items-center gap-3"
              aria-label="Desktop navigation"
            >
              {/* Grouped items: About ▾  Work ▾  Skills ▾ */}
              <div className="flex items-center gap-1">
                {groupedNavs.map((group) => (
                  <NavGroupButton
                    key={group.id}
                    group={group}
                    isGroupActive={activeGroupId === group.id}
                    activeSection={activeSection}
                    onNavigate={navigate}
                    variant="default"
                  />
                ))}
              </div>

              {/* Divider */}
              <NavSeparator />

              {/* Standalone items: Resume  Ask AI  Contact */}
              <div className="flex items-center gap-2">
                {standaloneNavs.map((group) => (
                  <NavGroupButton
                    key={group.id}
                    group={group}
                    isGroupActive={activeGroupId === group.id}
                    activeSection={activeSection}
                    onNavigate={navigate}
                    variant={standaloneVariantMap[group.id] ?? "default"}
                  />
                ))}
              </div>
            </nav>

            {/* ── Right ── */}
            <div className="flex items-center gap-2.5 flex-shrink-0">

              {/* Availability badge */}
              <motion.div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: isAvailable
                    ? "rgba(16,185,129,0.08)"
                    : "rgba(239,68,68,0.08)",
                  border: isAvailable
                    ? "1px solid rgba(16,185,129,0.22)"
                    : "1px solid rgba(239,68,68,0.22)",
                }}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.8, duration: 0.4 }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: isAvailable ? "#10b981" : "#ef4444" }}
                  animate={{
                    boxShadow: isAvailable
                      ? [
                          "0 0 0 0 rgba(16,185,129,0)",
                          "0 0 0 4px rgba(16,185,129,0.2)",
                          "0 0 0 0 rgba(16,185,129,0)",
                        ]
                      : [
                          "0 0 0 0 rgba(239,68,68,0)",
                          "0 0 0 4px rgba(239,68,68,0.2)",
                          "0 0 0 0 rgba(239,68,68,0)",
                        ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="text-xs font-semibold whitespace-nowrap"
                  style={{ color: isAvailable ? "#10b981" : "#ef4444" }}
                >
                  {isAvailable ? "Available" : "Occupied"}
                </span>
              </motion.div>

              {/* Hamburger */}
              <motion.button
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "#94a3b8",
                }}
                onClick={() => setMobileOpen((v) => !v)}
                whileHover={{
                  background: "rgba(255,255,255,0.09)",
                  color: "#ffffff",
                }}
                whileTap={{ scale: 0.9 }}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.span key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0,   opacity: 1 }}
                      exit={{   rotate:  90,  opacity: 0 }}
                      transition={{ duration: 0.16 }}
                    ><X size={17} /></motion.span>
                  ) : (
                    <motion.span key="m"
                      initial={{ rotate:  90, opacity: 0 }}
                      animate={{ rotate:  0,  opacity: 1 }}
                      exit={{   rotate: -90,  opacity: 0 }}
                      transition={{ duration: 0.16 }}
                    ><Menu size={17} /></motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════
          MOBILE MENU
      ══════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mob-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="mob-panel"
              initial={{ x: "100%", opacity: 0.6 }}
              animate={{ x: 0,      opacity: 1   }}
              exit={{    x: "100%", opacity: 0   }}
              transition={{ type: "spring", damping: 30, stiffness: 300, opacity: { duration: 0.2 } }}
              className="fixed top-0 right-0 bottom-0 z-50 flex flex-col lg:hidden"
              style={{
                width: "min(300px, 88vw)",
                background: "rgba(5,8,20,0.99)",
                borderLeft: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(40px)",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                    style={{
                      background: "linear-gradient(135deg, #00e5ff, #3b82f6, #7c3aed)",
                      boxShadow: "0 0 14px rgba(0,229,255,0.3)",
                    }}
                  >
                    {nameFirst[0] || "M"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">
                      {nameFirst}{" "}
                      <span className="gradient-text">{nameLast}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 leading-none mt-0.5">
                      {profile?.title || "AI & Full Stack Developer"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  aria-label="Close menu"
                ><X size={14} /></button>
              </div>

              {/* Availability */}
              <div className="px-4 pt-3 flex-shrink-0">
                <div
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                  style={{
                    background: isAvailable ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
                    border: isAvailable ? "1px solid rgba(16,185,129,0.18)" : "1px solid rgba(239,68,68,0.18)",
                  }}
                >
                  <motion.span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: isAvailable ? "#10b981" : "#ef4444" }}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span className="text-xs font-medium" style={{ color: isAvailable ? "#10b981" : "#ef4444" }}>
                    {isAvailable ? "Open to opportunities" : "Currently occupied"}
                  </span>
                </div>
              </div>

              {/* Links */}
              <nav className="flex-1 px-3 py-3 overflow-y-auto" aria-label="Mobile navigation">
                <div className="px-3 pb-2 pt-1">
                  <span className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Navigate</span>
                </div>
                {MOBILE_LINKS.map((link, i) => {
                  const sectionId = link.href.replace("#", "");
                  const isActive  = activeSection === sectionId;
                  const Icon      = link.icon;

                  // Special styling for Resume, Ask AI, Contact in mobile
                  const isResume  = link.href === "#resume";
                  const isAI      = link.href === "#ai";
                  const isContact = link.href === "#contact";
                  const isSpecial = isResume || isAI || isContact;

                  return (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0  }}
                      transition={{ delay: i * 0.03, duration: 0.22, ease: "easeOut" }}
                      onClick={() => navigate(link.href)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left"
                      style={{
                        background: isActive
                          ? isContact
                            ? "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.1))"
                            : isAI
                            ? "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))"
                            : "linear-gradient(135deg,rgba(0,229,255,0.1),rgba(59,130,246,0.06))"
                          : isSpecial && !isActive
                          ? isContact
                            ? "rgba(0,229,255,0.04)"
                            : isAI
                            ? "rgba(124,58,237,0.05)"
                            : "rgba(255,255,255,0.03)"
                          : "transparent",
                        border: isActive
                          ? isContact
                            ? "1px solid rgba(0,229,255,0.3)"
                            : isAI
                            ? "1px solid rgba(124,58,237,0.35)"
                            : "1px solid rgba(0,229,255,0.18)"
                          : isSpecial
                          ? isContact
                            ? "1px solid rgba(0,229,255,0.1)"
                            : isAI
                            ? "1px solid rgba(124,58,237,0.12)"
                            : "1px solid rgba(255,255,255,0.07)"
                          : "1px solid transparent",
                        transition: "background 0.15s ease, border 0.15s ease",
                      }}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isActive
                            ? isContact
                              ? "rgba(0,229,255,0.2)"
                              : isAI
                              ? "rgba(124,58,237,0.2)"
                              : "rgba(0,229,255,0.15)"
                            : isSpecial
                            ? isContact
                              ? "rgba(0,229,255,0.08)"
                              : isAI
                              ? "rgba(124,58,237,0.1)"
                              : "rgba(255,255,255,0.06)"
                            : "rgba(255,255,255,0.05)",
                          border: isActive
                            ? isContact
                              ? "1px solid rgba(0,229,255,0.35)"
                              : isAI
                              ? "1px solid rgba(124,58,237,0.4)"
                              : "1px solid rgba(0,229,255,0.25)"
                            : isSpecial
                            ? isContact
                              ? "1px solid rgba(0,229,255,0.15)"
                              : isAI
                              ? "1px solid rgba(124,58,237,0.2)"
                              : "1px solid rgba(255,255,255,0.09)"
                            : "1px solid rgba(255,255,255,0.07)",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Icon
                          size={13}
                          style={{
                            color: isActive
                              ? isContact
                                ? "#00e5ff"
                                : isAI
                                ? "#a78bfa"
                                : "#00e5ff"
                              : isSpecial
                              ? isContact
                                ? "#22d3ee"
                                : isAI
                                ? "#8b5cf6"
                                : "#94a3b8"
                              : "#475569",
                          }}
                        />
                      </div>
                      <span
                        className="text-sm font-medium flex-1"
                        style={{
                          color: isActive
                            ? "#e2e8f0"
                            : isSpecial
                            ? "#cbd5e1"
                            : "#94a3b8",
                        }}
                      >
                        {link.label}
                      </span>
                      {isActive && (
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background: isContact
                              ? "#00e5ff"
                              : isAI
                              ? "#a78bfa"
                              : "#00e5ff",
                          }}
                          layoutId="mob-dot"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div
                className="px-5 py-4 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-slate-700">
                    © {new Date().getFullYear()} {nameFirst} {nameLast}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-700">
                    <Sparkles size={9} />Portfolio
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}