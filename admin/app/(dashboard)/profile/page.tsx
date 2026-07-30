"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@/hooks/useApi";
import { profileApi, uploadApi } from "@/lib/api";
import { Save, Loader2, Upload, MapPin, Mail, Phone } from "lucide-react";
import { useToastStore } from "@/lib/store";

export default function ProfilePage() {
  const { data: profile, loading: fetchLoading } = useQuery(() => profileApi.get());
  const { addToast } = useToastStore();
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const aboutRef = useRef<HTMLTextAreaElement>(null);
  const missionRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize a textarea to fit its content
  const autoResize = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, []);

  // Load profile into form
  useEffect(() => {
    if (profile) {
      setForm(profile as unknown as Record<string, unknown>);
    }
  }, [profile]);

  // Auto-resize textareas once data loads
  useEffect(() => {
    if (Object.keys(form).length > 0) {
      setTimeout(() => {
        autoResize(aboutRef.current);
        autoResize(missionRef.current);
      }, 50);
    }
  }, [form, autoResize]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleChange(e);
    autoResize(e.target);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const { url } = await uploadApi.uploadImage(e.target.files[0]);
      setForm((p) => ({ ...p, profileImage: url }));
      addToast({ type: "success", title: "Image uploaded" });
    } catch {
      addToast({ type: "error", title: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileApi.update(form as never);
      addToast({ type: "success", title: "Profile updated" });
    } catch {
      addToast({ type: "error", title: "Failed to update" });
    } finally {
      setSaving(false);
    }
  };

  // ── Shared styles ──────────────────────────────────────────────────────────
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
  };

  const ta: React.CSSProperties = {
    ...inp,
    resize: "none",
    overflow: "hidden",
    lineHeight: "1.6",
    fontFamily: "inherit",
    display: "block",
    minHeight: "100px",
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

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (fetchLoading || Object.keys(form).length === 0) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            className="skeleton"
            style={{ height: "24px", width: "100px", borderRadius: "6px", marginBottom: "20px" }}
          />
          <div
            className="skeleton"
            style={{ height: "100px", borderRadius: "12px", marginBottom: "10px" }}
          />
          <div style={{ display: "grid", gap: "10px" }} className="profile-grid">
            <div className="skeleton" style={{ height: "300px", borderRadius: "12px" }} />
            <div className="skeleton" style={{ height: "200px", borderRadius: "12px" }} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Profile</h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
              Manage your public identity
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}
          >
            {saving
              ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
              : <Save size={13} />}
            Save
          </button>
        </div>

        {/* ── Avatar row ──────────────────────────────────────────────── */}
        <div style={{ ...card, marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            {/* Avatar image + upload overlay */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img
                src={String(form.profileImage || "")}
                alt="Profile"
                style={{ width: "72px", height: "72px", borderRadius: "12px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)", display: "block" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/72x72/111/fff?text=?";
                }}
              />
              <label
                style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; }}
              >
                {uploading
                  ? <Loader2 size={14} style={{ color: "#fff", animation: "spin 1s linear infinite" }} />
                  : <Upload size={14} style={{ color: "#fff" }} />}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Name / title / contact info */}
            <div style={{ flex: 1, minWidth: "140px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 2px" }}>
                {String(form.name || "—")}
              </h3>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {String(form.title || "")}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[
                  { icon: Mail,  val: String(form.email    || "") },
                  { icon: Phone, val: String(form.phone    || "") },
                  { icon: MapPin,val: String(form.location || "") },
                ].map(({ icon: Icon, val }) =>
                  val ? (
                    <div key={val} style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                      <Icon size={9} />{val}
                    </div>
                  ) : null
                )}
              </div>
            </div>

            {/* Available toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", flexShrink: 0 }}>
              <input
                type="checkbox"
                name="available"
                checked={Boolean(form.available)}
                onChange={handleChange}
                style={{ width: "14px", height: "14px", accentColor: "#fff" }}
              />
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Available</span>
            </label>
          </div>
        </div>

        {/* ── Form grid ───────────────────────────────────────────────── */}
        <div style={{ display: "grid", gap: "10px" }} className="profile-grid">

          {/* Basic Info card */}
          <div style={card}>
            <h3 style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", marginTop: 0 }}>
              Basic Info
            </h3>

            <div style={{ display: "grid", gap: "8px" }} className="form-grid-2col">
              {[
                { name: "name",            label: "Name",      ph: "Mayank Choudhary" },
                { name: "title",           label: "Title",     ph: "Full Stack Developer" },
                { name: "email",           label: "Email",     ph: "hello@example.com" },
                { name: "phone",           label: "Phone",     ph: "+91 XXXXXXXXXX" },
                { name: "location",        label: "Location",  ph: "City, Country" },
                { name: "yearsExperience", label: "Years Exp", ph: "3" },
              ].map((f) => (
                <div key={f.name}>
                  <label style={lbl}>{f.label}</label>
                  <input
                    name={f.name}
                    value={String(form[f.name] ?? "")}
                    onChange={handleChange}
                    placeholder={f.ph}
                    style={inp}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
              ))}
            </div>

            {/* Tagline */}
            <div style={{ marginTop: "8px" }}>
              <label style={lbl}>Tagline</label>
              <input
                name="tagline"
                value={String(form.tagline ?? "")}
                onChange={handleChange}
                placeholder="Your professional tagline"
                style={inp}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            {/* About */}
            <div style={{ marginTop: "8px" }}>
              <label style={lbl}>About</label>
              <textarea
                ref={aboutRef}
                name="about"
                value={String(form.about ?? "")}
                onChange={handleTextareaChange}
                placeholder="Tell your story..."
                style={ta}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            {/* Mission */}
            <div style={{ marginTop: "8px" }}>
              <label style={lbl}>Mission</label>
              <textarea
                ref={missionRef}
                name="mission"
                value={String(form.mission ?? "")}
                onChange={handleTextareaChange}
                placeholder="Your professional mission..."
                style={ta}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
          </div>

          {/* Social Links card */}
          <div style={card}>
            <h3 style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", marginTop: 0 }}>
              Social Links
            </h3>
            <div style={{ display: "grid", gap: "8px" }} className="form-grid-2col">
              {[
                { name: "github",     label: "GitHub" },
                { name: "linkedin",   label: "LinkedIn" },
                { name: "twitter",    label: "Twitter" },
                { name: "instagram",  label: "Instagram" },
                { name: "leetcode",   label: "LeetCode" },
                { name: "codechef",   label: "CodeChef" },
                { name: "codeforces", label: "Codeforces" },
              ].map((f) => (
                <div key={f.name}>
                  <label style={lbl}>{f.label}</label>
                  <input
                    name={f.name}
                    value={String(form[f.name] ?? "")}
                    onChange={handleChange}
                    placeholder="https://..."
                    style={inp}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .profile-grid      { grid-template-columns: 1fr; }
        .form-grid-2col    { grid-template-columns: 1fr; }

        @media (min-width: 640px) {
          .profile-grid   { grid-template-columns: 1fr 1fr; }
          .form-grid-2col { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </DashboardLayout>
  );
}