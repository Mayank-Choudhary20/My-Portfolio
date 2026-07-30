"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery, useApi } from "@/hooks/useApi";
import { settingsApi } from "@/lib/api";
import { Save, Loader2, Link, Info } from "lucide-react";
import type { Setting } from "@/types";
import { useToastStore } from "@/lib/store";

// ── Section definitions — every DB field mapped ───────────────
const SECTIONS = ["General", "Hero", "SEO", "Contact", "Social"] as const;
type SectionName = (typeof SECTIONS)[number];

interface FieldDef {
  key: keyof Setting;
  label: string;
  type?: string;
  placeholder?: string;
  isTextarea?: boolean;
  hint?: string; // tooltip/helper text shown below field
}

const SECTION_FIELDS: Record<SectionName, FieldDef[]> = {
  General: [
    {
      key: "portfolioName",
      label: "Portfolio Name",
      placeholder: "Mayank Choudhary",
      hint: "Shown in browser tab, footer, and navbar",
    },
    {
      key: "primaryColor",
      label: "Primary Color",
      placeholder: "#3B82F6",
      hint: "Hex color code for accent elements",
    },
  ],
  Hero: [
    {
      key: "heroGreeting",
      label: "Greeting Text",
      placeholder: "Hello, I'm",
      hint: 'Small text above name — e.g. "Hello, I\'m" or "Hi there, I\'m"',
    },
    {
      key: "heroTypingTexts",
      label: "Typing Roles",
      placeholder: "AI / ML Engineer, Full Stack Developer, System Architect",
      hint: "Comma-separated list — each one types out one by one on the hero",
      isTextarea: true,
    },
    {
      key: "heroSubtitle",
      label: "Hero Subtitle",
      placeholder: "Building intelligent systems at the intersection of AI...",
      hint: "Paragraph shown below the typing animation",
      isTextarea: true,
    },
    {
      key: "heroAvailableText",
      label: "Available Badge Text",
      placeholder: "Available for Opportunities",
      hint: 'Shown when profile "Available" is ON (green badge)',
    },
    {
      key: "heroBusyText",
      label: "Busy Badge Text",
      placeholder: "Currently Occupied",
      hint: 'Shown when profile "Available" is OFF (red badge)',
    },
  ],
  SEO: [
    {
      key: "seoTitle",
      label: "SEO Title",
      placeholder: "Mayank Choudhary | AI & Full Stack Developer",
      hint: "Browser tab title and Google search result title",
    },
    {
      key: "seoDescription",
      label: "SEO Description",
      placeholder: "Portfolio of Mayank Choudhary...",
      hint: "Google search result description (150–160 chars ideal)",
      isTextarea: true,
    },
  ],
  Contact: [
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "hello@example.com",
      hint: "Shown in footer and contact section",
    },
    {
      key: "phone",
      label: "Phone",
      placeholder: "+91 XXXX XXXXXX",
      hint: "Shown in footer",
    },
    {
      key: "location",
      label: "Location",
      placeholder: "Bhopal, India",
      hint: "Shown in footer",
    },
    {
      key: "resumeUrl",
      label: "Resume URL",
      placeholder: "https://drive.google.com/file/d/...",
      hint: "Google Drive share link or direct PDF URL — download button uses this",
    },
  ],
  Social: [
    {
      key: "githubUrl",
      label: "GitHub",
      placeholder: "https://github.com/username",
    },
    {
      key: "linkedinUrl",
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/username",
    },
    {
      key: "twitterUrl",
      label: "Twitter / X",
      placeholder: "https://x.com/username",
    },
    {
      key: "instagramUrl",
      label: "Instagram",
      placeholder: "https://instagram.com/username",
    },
    {
      key: "youtubeUrl",
      label: "YouTube",
      placeholder: "https://youtube.com/@channel",
    },
    {
      key: "leetcodeUrl",
      label: "LeetCode",
      placeholder: "https://leetcode.com/username",
    },
    {
      key: "codechefUrl",
      label: "CodeChef",
      placeholder: "https://codechef.com/users/username",
    },
  ],
};

// ── Section accent colors ─────────────────────────────────────
const SECTION_COLORS: Record<SectionName, { color: string; bg: string; border: string }> = {
  General: { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.15)" },
  Hero:    { color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.15)"  },
  SEO:     { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.15)"  },
  Contact: { color: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.15)" },
  Social:  { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.15)"  },
};

export default function SettingsPage() {
  const { data, loading } = useQuery(() => settingsApi.get());
  const { execute: saveSettings, loading: saving } = useApi(settingsApi.update, {
    successMessage: "Settings saved successfully",
  });
  const { addToast } = useToastStore();

  const [form, setForm] = useState<Partial<Setting>>({});
  const [dirty, setDirty] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionName>("General");

  // Refs map for auto-resize textareas
  const taRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());

  const autoResize = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (data) {
      setForm(data);
      setDirty(false);
    }
  }, [data]);

  // Auto-resize all textareas when section changes or data loads
  useEffect(() => {
    if (Object.keys(form).length === 0) return;
    setTimeout(() => {
      taRefs.current.forEach((el) => autoResize(el));
    }, 30);
  }, [activeSection, form, autoResize]);

  const handleChange = (key: keyof Setting, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      await saveSettings(form);
      setDirty(false);
    } catch {
      addToast({ type: "error", title: "Failed to save settings" });
    }
  };

  // ── Shared styles ─────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
  };

  const inpWithIcon: React.CSSProperties = { ...inp, paddingLeft: "32px" };

  const ta: React.CSSProperties = {
    ...inp,
    resize: "none",
    overflow: "hidden",
    lineHeight: "1.6",
    fontFamily: "inherit",
    display: "block",
    minHeight: "72px",
  };

  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: "10px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "4px",
  };

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "16px",
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.25)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.09)";
  };

  const accent = SECTION_COLORS[activeSection];
  const fields = SECTION_FIELDS[activeSection];
  const regularFields = fields.filter((f) => !f.isTextarea);
  const textareaFields = fields.filter((f) => f.isTextarea);
  const isUrl = (key: string) =>
    key.toLowerCase().includes("url") || key === "resumeUrl";

  // ── Skeleton ──────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="skeleton" style={{ height: "24px", width: "140px", borderRadius: "6px", marginBottom: "20px" }} />
          <div className="skeleton" style={{ height: "52px", borderRadius: "12px", marginBottom: "10px" }} />
          <div className="skeleton" style={{ height: "320px", borderRadius: "12px", marginBottom: "10px" }} />
          <div className="skeleton" style={{ height: "80px", borderRadius: "12px" }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>

        {/* ── Page header ───────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Settings</h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
              Control every aspect of your portfolio
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {dirty && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#fbbf24" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} />
                Unsaved
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                background: dirty ? "#fff" : "rgba(255,255,255,0.06)",
                color: dirty ? "#000" : "rgba(255,255,255,0.2)",
                border: dirty ? "none" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: saving || !dirty ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
                transition: "all 0.15s ease",
              }}
            >
              {saving
                ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                : <Save size={13} />}
              Save
            </button>
          </div>
        </div>

        {/* ── Section tabs ──────────────────────────────────────── */}
        <div style={{ ...card, padding: "4px", marginBottom: "10px", display: "flex", gap: "2px" }}>
          {SECTIONS.map((section) => {
            const sc = SECTION_COLORS[section];
            const isActive = activeSection === section;
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: "11px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: isActive ? sc.bg : "transparent",
                  color: isActive ? sc.color : "rgba(255,255,255,0.3)",
                  outline: isActive ? `1px solid ${sc.border}` : "none",
                }}
              >
                {section}
              </button>
            );
          })}
        </div>

        {/* ── Active section header ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            padding: "10px 14px",
            background: accent.bg,
            border: `1px solid ${accent.border}`,
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: accent.color,
              flexShrink: 0,
            }}
          />
          <p style={{ fontSize: "11px", fontWeight: 600, color: accent.color, margin: 0 }}>
            {activeSection === "Hero" &&
              "These fields control the text shown in your portfolio hero section"}
            {activeSection === "General" &&
              "Portfolio name and primary accent color"}
            {activeSection === "SEO" &&
              "Control how your portfolio appears in Google search results"}
            {activeSection === "Contact" &&
              "Contact details shown in the footer and contact section"}
            {activeSection === "Social" &&
              "Social profile links shown in footer and hero"}
          </p>
        </div>

        {/* ── Fields card ───────────────────────────────────────── */}
        <div style={card}>

          {/* Regular (non-textarea) fields — 2 col grid */}
          {regularFields.length > 0 && (
            <div style={{ display: "grid", gap: "10px", marginBottom: textareaFields.length > 0 ? "10px" : 0 }} className="settings-grid-2col">
              {regularFields.map((field) => {
                const hasIcon = isUrl(String(field.key));
                return (
                  <div key={String(field.key)}>
                    <label style={lbl}>{field.label}</label>
                    <div style={{ position: "relative" }}>
                      {hasIcon && (
                        <Link
                          size={12}
                          style={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "rgba(255,255,255,0.15)",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      <input
                        type={field.type ?? "text"}
                        value={String(form[field.key] ?? "")}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        style={hasIcon ? inpWithIcon : inp}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </div>
                    {field.hint && (
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.18)", margin: "3px 0 0", display: "flex", alignItems: "center", gap: "3px" }}>
                        <Info size={8} style={{ flexShrink: 0 }} />
                        {field.hint}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Textarea fields — full width, auto-resize */}
          {textareaFields.map((field) => (
            <div key={String(field.key)} style={{ marginTop: regularFields.length > 0 ? "0" : "0" }}>
              <label style={{ ...lbl, marginTop: "8px" }}>{field.label}</label>
              <textarea
                ref={(el) => {
                  if (el) {
                    taRefs.current.set(String(field.key), el);
                    autoResize(el);
                  }
                }}
                value={String(form[field.key] ?? "")}
                onChange={(e) => {
                  handleChange(field.key, e.target.value);
                  autoResize(e.target);
                }}
                placeholder={field.placeholder}
                style={ta}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              {field.hint && (
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.18)", margin: "3px 0 0", display: "flex", alignItems: "center", gap: "3px" }}>
                  <Info size={8} style={{ flexShrink: 0 }} />
                  {field.hint}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── Color picker (General only) ───────────────────────── */}
        {activeSection === "General" && (
          <div style={{ ...card, marginTop: "10px" }}>
            <h3 style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", marginTop: 0 }}>
              Appearance
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="color"
                value={String(form.primaryColor ?? "#3B82F6")}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.09)",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "2px",
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 2px", color: String(form.primaryColor ?? "#3B82F6") }}>
                  {String(form.primaryColor ?? "#3B82F6")}
                </p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
                  Primary accent color used across your portfolio
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Hero live preview card ────────────────────────────── */}
        {activeSection === "Hero" && (
          <div
            style={{
              ...card,
              marginTop: "10px",
              background: "rgba(96,165,250,0.04)",
              border: "1px solid rgba(96,165,250,0.1)",
            }}
          >
            <h3 style={{ fontSize: "10px", fontWeight: 700, color: "rgba(96,165,250,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", marginTop: 0 }}>
              Preview — how it appears in the hero
            </h3>
            <div style={{ padding: "14px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
              {/* Available badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 10px", borderRadius: "20px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: "8px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                <span style={{ fontSize: "9px", color: "#34d399", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {String(form.heroAvailableText || "Available for Opportunities")}
                </span>
              </div>
              {/* Greeting */}
              <p style={{ fontSize: "9px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 2px", fontWeight: 600 }}>
                {String(form.heroGreeting || "Hello, I'm")}
              </p>
              {/* Name placeholder */}
              <p style={{ fontSize: "25px", fontWeight: 900, color: "#f1f5f9", margin: "0 0 4px", lineHeight: 1 }}>
                Mayank Choudhary
              </p>
              {/* Typing roles */}
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "monospace" }}>
                {String(form.heroTypingTexts || "AI / ML Engineer, Full Stack Developer, ...")
                  .split(",")[0]?.trim() || "AI / ML Engineer"}
                <span style={{ display: "inline-block", width: "1px", height: "12px", background: "#00e5ff", marginLeft: "2px", verticalAlign: "middle" }} />
              </p>
              {/* Subtitle */}
              <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0, lineHeight: 1.5, maxWidth: "320px" }}>
                {String(form.heroSubtitle || "Your subtitle will appear here...")}
              </p>
            </div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)", margin: "8px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
              <Info size={9} />
              This is a simplified preview — actual hero has animations and your real name from Profile
            </p>
          </div>
        )}

        {/* ── Social quick view (Social only) ──────────────────── */}
        {activeSection === "Social" && (
          <div style={{ ...card, marginTop: "10px" }}>
            <h3 style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", marginTop: 0 }}>
              Active Links
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {SECTION_FIELDS.Social.map((f) => {
                const val = String(form[f.key] ?? "");
                const active = val.startsWith("http");
                return (
                  <div
                    key={String(f.key)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: 600,
                      background: active ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
                      border: active ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,255,255,0.06)",
                      color: active ? "#4ade80" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {f.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .settings-grid-2col { grid-template-columns: 1fr; }
        @media (min-width: 640px) {
          .settings-grid-2col { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </DashboardLayout>
  );
}