"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, LayoutDashboard, User, Briefcase, Cpu, GraduationCap,
  Award, ImageIcon, FileText, Brain, Users, Mail, Settings,
  ShieldCheck, TrendingUp, X, ArrowRight,
} from "lucide-react";
import { useCommandStore } from "@/lib/store";

// ── All searchable commands ───────────────────────────────────────────────────
const ALL_COMMANDS = [
  // General
  { group: "General",  label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard, keywords: ["home", "overview", "analytics"] },
  { group: "General",  label: "Settings",     href: "/settings",     icon: Settings,        keywords: ["config", "preferences", "seo"] },
  { group: "General",  label: "Admins",       href: "/admins",       icon: ShieldCheck,     keywords: ["admin", "users", "password", "security"] },

  // Content
  { group: "Content",  label: "Profile",      href: "/profile",      icon: User,            keywords: ["about", "bio", "name", "photo", "avatar"] },
  { group: "Content",  label: "Projects",     href: "/projects",     icon: Briefcase,       keywords: ["portfolio", "work", "github", "live"] },
  { group: "Content",  label: "Skills",       href: "/skills",       icon: Cpu,             keywords: ["tech", "technology", "stack", "expertise"] },
  { group: "Content",  label: "Experience",   href: "/experience",   icon: TrendingUp,      keywords: ["work", "job", "company", "career"] },
  { group: "Content",  label: "Education",    href: "/education",    icon: GraduationCap,   keywords: ["degree", "college", "university", "school"] },
  { group: "Content",  label: "Certificates", href: "/certificates", icon: Award,           keywords: ["award", "certification", "course"] },
  { group: "Content",  label: "Showcase",     href: "/showcase",     icon: ImageIcon,       keywords: ["gallery", "demo", "media", "image"] },
  { group: "Content",  label: "Resume",       href: "/resume",       icon: FileText,        keywords: ["cv", "pdf", "download", "document"] },
  { group: "Content",  label: "AI Knowledge", href: "/ai",           icon: Brain,           keywords: ["ai", "knowledge", "faq", "questions", "answers"] },

  // Analytics
  { group: "Analytics",label: "Visitors",     href: "/visitors",     icon: Users,           keywords: ["traffic", "analytics", "geo", "country", "city"] },
  { group: "Analytics",label: "Contacts",     href: "/contacts",     icon: Mail,            keywords: ["messages", "inbox", "email", "inquiries"] },
];

export function CommandPalette() {
  const { isOpen, close } = useCommandStore();
  const router             = useRouter();
  const [query, setQuery]  = useState("");
  const inputRef           = useRef<HTMLInputElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // ── Filter commands based on query ───────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show all groups when no query
      const groups: { group: string; items: typeof ALL_COMMANDS }[] = [];
      for (const cmd of ALL_COMMANDS) {
        const existing = groups.find((g) => g.group === cmd.group);
        if (existing) existing.items.push(cmd);
        else groups.push({ group: cmd.group, items: [cmd] });
      }
      return groups;
    }

    // Search label + keywords
    const matched = ALL_COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.group.toLowerCase().includes(q) ||
        cmd.keywords.some((k) => k.includes(q))
    );

    // Group results
    const groups: { group: string; items: typeof ALL_COMMANDS }[] = [];
    for (const cmd of matched) {
      const existing = groups.find((g) => g.group === cmd.group);
      if (existing) existing.items.push(cmd);
      else groups.push({ group: cmd.group, items: [cmd] });
    }
    return groups;
  }, [query]);

  // Flat list for keyboard nav
  const flatItems = useMemo(
    () => filtered.flatMap((g) => g.items),
    [filtered]
  );

  // Reset active index when results change
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = flatItems[activeIdx];
        if (item) {
          router.push(item.href);
          close();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close, flatItems, activeIdx, router]);

  const handleSelect = (href: string) => {
    router.push(href);
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position:       "fixed",
            inset:          0,
            zIndex:         100,
            display:        "flex",
            alignItems:     "flex-start",
            justifyContent: "center",
            paddingTop:     "15vh",
            paddingLeft:    "16px",
            paddingRight:   "16px",
          }}
        >
          {/* Backdrop */}
          <motion.div
            key="cp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            style={{
              position:       "fixed",
              inset:          0,
              background:     "rgba(0,0,0,0.8)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Panel */}
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1,    y: 0    }}
            exit={{   opacity: 0, scale: 0.96, y: -12   }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position:        "relative",
              zIndex:          101,
              width:           "100%",
              maxWidth:        "560px",
              background:      "#111",
              border:          "1px solid rgba(255,255,255,0.1)",
              borderRadius:    "14px",
              overflow:        "hidden",
              boxShadow:       "0 24px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Search input */}
            <div
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "10px",
                padding:      "14px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Search size={16} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, settings, content..."
                style={{
                  flex:        1,
                  background:  "transparent",
                  border:      "none",
                  outline:     "none",
                  color:       "#fff",
                  fontSize:    "14px",
                  lineHeight:  1,
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", padding: "2px", display: "flex" }}
                >
                  <X size={15} />
                </button>
              )}
              <button
                onClick={close}
                style={{
                  padding:      "4px 8px",
                  background:   "rgba(255,255,255,0.05)",
                  border:       "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "5px",
                  color:        "rgba(255,255,255,0.3)",
                  fontSize:     "10px",
                  cursor:       "pointer",
                  flexShrink:   0,
                }}
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div style={{ maxHeight: "420px", overflowY: "auto", padding: "6px" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
                    No results for &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                filtered.map((group) => (
                  <div key={group.group} style={{ marginBottom: "4px" }}>
                    {/* Group label */}
                    <p
                      style={{
                        fontSize:      "9px",
                        fontWeight:    700,
                        color:         "rgba(255,255,255,0.2)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        padding:       "6px 10px 4px",
                        margin:        0,
                      }}
                    >
                      {group.group}
                    </p>

                    {/* Items */}
                    {group.items.map((item) => {
                      const globalIdx = flatItems.indexOf(item);
                      const isActive  = globalIdx === activeIdx;

                      return (
                        <button
                          key={item.href}
                          onClick={() => handleSelect(item.href)}
                          onMouseEnter={() => setActiveIdx(globalIdx)}
                          style={{
                            width:          "100%",
                            display:        "flex",
                            alignItems:     "center",
                            gap:            "10px",
                            padding:        "9px 10px",
                            borderRadius:   "8px",
                            border:         "none",
                            background:     isActive ? "rgba(255,255,255,0.08)" : "transparent",
                            color:          isActive ? "#fff" : "rgba(255,255,255,0.5)",
                            cursor:         "pointer",
                            textAlign:      "left",
                            transition:     "background 0.1s ease, color 0.1s ease",
                            marginBottom:   "1px",
                          }}
                        >
                          {/* Icon */}
                          <div
                            style={{
                              width:           "28px",
                              height:          "28px",
                              borderRadius:    "7px",
                              background:      isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                              display:         "flex",
                              alignItems:      "center",
                              justifyContent:  "center",
                              flexShrink:      0,
                              transition:      "background 0.1s ease",
                            }}
                          >
                            <item.icon size={14} style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.3)" }} />
                          </div>

                          {/* Label */}
                          <span style={{ flex: 1, fontSize: "13px", fontWeight: isActive ? 600 : 400 }}>
                            {item.label}
                          </span>

                          {/* Arrow shown when active */}
                          {isActive && (
                            <ArrowRight size={13} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div
              style={{
                padding:      "10px 16px",
                borderTop:    "1px solid rgba(255,255,255,0.05)",
                background:   "rgba(255,255,255,0.01)",
                display:      "flex",
                alignItems:   "center",
                gap:          "16px",
              }}
            >
              {[
                { keys: ["↑", "↓"], label: "Navigate" },
                { keys: ["↵"],      label: "Open"     },
                { keys: ["ESC"],    label: "Close"    },
              ].map((hint) => (
                <div key={hint.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {hint.keys.map((k) => (
                      <kbd
                        key={k}
                        style={{
                          padding:      "2px 5px",
                          background:   "rgba(255,255,255,0.06)",
                          border:       "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "4px",
                          fontSize:     "10px",
                          color:        "rgba(255,255,255,0.35)",
                          fontFamily:   "monospace",
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
                    {hint.label}
                  </span>
                </div>
              ))}

              {/* Result count */}
              <span style={{ marginLeft: "auto", fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>
                {flatItems.length} result{flatItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}