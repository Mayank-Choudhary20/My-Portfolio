"use client";

import { useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { experienceApi, uploadApi } from "@/lib/api";
import { useQuery } from "@/hooks/useApi";
import { useConfirm } from "@/hooks/useConfirm";
import { useActivityStore, useToastStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import {
  Plus,
  Save,
  Loader2,
  Upload,
  Pencil,
  Trash2,
  Briefcase,
  Calendar,
  Star,
} from "lucide-react";

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  companyLogo?: string | null;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

const EMPTY: Partial<Experience> = {
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
  companyLogo: "",
  technologies: [],
};

export default function ExperiencePage() {
  const fetchExperience = useCallback(() => experienceApi.getAll(), []);
  const { data, loading, refetch } = useQuery<Experience[]>(fetchExperience);
  const { addToast } = useToastStore();
  const { addActivity } = useActivityStore();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Partial<Experience>>(EMPTY);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const items = data || [];
  const currentCount = items.filter((e) => e.current).length;

  const filtered = searchQuery
    ? items.filter(
        (e) =>
          e.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.technologies.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : items;

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY, startDate: new Date().toISOString().split("T")[0] });
    setTechInput("");
    setModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      company: exp.company,
      role: exp.role,
      description: exp.description,
      startDate: exp.startDate?.split("T")[0] ?? "",
      endDate: exp.endDate?.split("T")[0] ?? "",
      current: exp.current,
      companyLogo: exp.companyLogo ?? "",
      technologies: exp.technologies,
    });
    setTechInput(exp.technologies.join(", "));
    setModalOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLogoUploading(true);
    try {
      const { url } = await uploadApi.uploadImage(e.target.files[0]);
      setForm((p) => ({ ...p, companyLogo: url }));
      addToast({ type: "success", title: "Logo uploaded" });
    } catch {
      addToast({ type: "error", title: "Upload failed" });
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.company || !form.role || !form.startDate) {
      addToast({ type: "error", title: "Company, Role, and Start Date are required" });
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        company: form.company,
        role: form.role,
        description: form.description || "",
        startDate: form.startDate,
        current: Boolean(form.current),
        companyLogo: form.companyLogo || null,
        technologies: techInput.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (!form.current && form.endDate && form.endDate !== "") {
        payload.endDate = form.endDate;
      } else {
        payload.endDate = null;
      }

      if (editing) {
        await experienceApi.update(editing.id, payload);
        addActivity({ action: "updated", resource: "Experience", label: `${form.role} at ${form.company}` });
        addToast({ type: "success", title: "Experience updated" });
      } else {
        await experienceApi.create(payload);
        addActivity({ action: "created", resource: "Experience", label: `${form.role} at ${form.company}` });
        addToast({ type: "success", title: "Experience added" });
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      addToast({ type: "error", title: err instanceof Error ? err.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exp: Experience) => {
    const ok = await confirm({
      title: "Delete Experience",
      message: `Delete "${exp.role} at ${exp.company}"?`,
      variant: "danger",
    });
    if (!ok) return;
    try {
      await experienceApi.delete(exp.id);
      addActivity({ action: "deleted", resource: "Experience", label: exp.role });
      addToast({ type: "success", title: "Deleted" });
      refetch();
    } catch {
      addToast({ type: "error", title: "Failed to delete" });
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "8px 10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "8px", color: "#fff", fontSize: "13px",
    outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    display: "block", fontSize: "10px", fontWeight: 600,
    color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: "4px",
  };

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <Briefcase size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
              Experience
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Professional work history</p>
          </div>
          <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            <Plus size={13} /> Add Experience
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {[
            { l: "Total", v: items.length },
            { l: "Current", v: currentCount },
            { l: "Past", v: items.length - currentCount },
          ].map((x) => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 14px", flex: 1, minWidth: "80px" }}>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{x.l}</p>
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{x.v}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: "14px" }}>
          <input
            placeholder="Search by company, role, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inp, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "grid", gap: "10px" }} className="exp-grid">
            {[1, 2, 3, 4].map((i) => (<div key={i} className="skeleton" style={{ height: "200px", borderRadius: "10px" }} />))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
            <Briefcase size={30} style={{ color: "rgba(255,255,255,0.08)", marginBottom: "10px" }} />
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px", marginBottom: "12px" }}>No experience added yet</p>
            <button onClick={openNew} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 16px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> Add First Experience
            </button>
          </div>
        )}

        {/* No search results */}
        {!loading && items.length > 0 && filtered.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "30px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>No experience matches &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}

        {/* Experience Cards */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gap: "10px" }} className="exp-grid">
            {filtered.map((exp) => (
              <div key={exp.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                {/* Top bar */}
                <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {exp.current ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontSize: "10px", fontWeight: 600, color: "#4ade80" }}>
                      <Star size={8} /> Current
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                      Past
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                    <Calendar size={8} />
                    {formatDate(exp.startDate, { year: "numeric", month: "short" })} → {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate, { year: "numeric", month: "short" }) : "—"}
                  </div>
                  <div style={{ flex: 1 }} />
                </div>

                {/* Body */}
                <div style={{ padding: "12px" }}>
                  {/* Company + Logo */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    {exp.companyLogo ? (
                      <img src={exp.companyLogo} alt={exp.company} style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "contain", background: "rgba(255,255,255,0.05)", padding: "4px", border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.06)" }}>
                        <Briefcase size={14} style={{ color: "rgba(255,255,255,0.15)" }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.role}</h3>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{exp.company}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  {exp.technologies.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "10px" }}>
                      {exp.technologies.map((t) => (
                        <span key={t} style={{ padding: "1px 6px", borderRadius: "999px", fontSize: "10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "6px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <button onClick={() => openEdit(exp)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                      <Pencil size={10} /> Edit
                    </button>
                    <button onClick={() => handleDelete(exp)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit: ${editing.role}` : "Add Experience"} size="md">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Company + Role */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Company *</label>
              <input placeholder="Google" style={inp} value={form.company ?? ""} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Role *</label>
              <input placeholder="Software Engineer" style={inp} value={form.role ?? ""} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={lbl}>Description</label>
            <textarea
              placeholder="Responsibilities and achievements..."
              rows={3}
              style={{ ...inp, resize: "vertical", minHeight: "60px", lineHeight: "1.5", fontFamily: "inherit", display: "block", overflow: "hidden" }}
              value={form.description ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Start Date *</label>
              <input type="date" style={inp} value={form.startDate ?? ""} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
            </div>
            {!form.current && (
              <div>
                <label style={lbl}>End Date</label>
                <input type="date" style={inp} value={form.endDate ?? ""} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
              </div>
            )}
          </div>

          {/* Current */}
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input type="checkbox" checked={Boolean(form.current)} onChange={(e) => setForm((p) => ({ ...p, current: e.target.checked }))} style={{ width: "14px", height: "14px", accentColor: "#fff" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Currently working here</span>
          </label>

          {/* Technologies */}
          <div>
            <label style={lbl}>Technologies (comma separated)</label>
            <input placeholder="React, Node.js, PostgreSQL" style={inp} value={techInput} onChange={(e) => setTechInput(e.target.value)} />
            {techInput && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "4px" }}>
                {techInput.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                  <span key={t} style={{ padding: "1px 6px", borderRadius: "999px", fontSize: "10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}>{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Company Logo */}
          <div>
            <label style={lbl}>Company Logo URL</label>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input placeholder="https://..." style={{ ...inp, flex: 1 }} value={form.companyLogo ?? ""} onChange={(e) => setForm((p) => ({ ...p, companyLogo: e.target.value }))} />
              <label style={{ display: "flex", alignItems: "center", gap: "3px", padding: "7px 10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "11px", cursor: "pointer", flexShrink: 0 }}>
                {logoUploading ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={11} />}
                <input type="file" hidden accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} />
              </label>
              {form.companyLogo && (
                <img src={form.companyLogo} alt="" style={{ width: "28px", height: "28px", borderRadius: "6px", objectFit: "contain", background: "rgba(255,255,255,0.04)", padding: "2px", flexShrink: 0 }} />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "4px" }}>
            <button onClick={() => setModalOpen(false)} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.company || !form.role || !form.startDate}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving || !form.company || !form.role || !form.startDate ? 0.4 : 1 }}
            >
              {saving ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={12} />}
              {editing ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} variant={confirmState.variant} onConfirm={handleConfirm} onCancel={handleCancel} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .exp-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        @media (max-width: 640px) { .exp-grid { grid-template-columns: 1fr; } }
      `}</style>
    </DashboardLayout>
  );
}