"use client";

import { useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { educationApi } from "@/lib/api";
import { useQuery } from "@/hooks/useApi";
import { useConfirm } from "@/hooks/useConfirm";
import { useActivityStore, useToastStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import {
  Plus,
  Save,
  Loader2,
  Pencil,
  Trash2,
  GraduationCap,
  Calendar,
  Award,
  ExternalLink,
} from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  field?: string | null;
  startDate: string;
  endDate?: string | null;
  grade?: string | null;
  description?: string | null;
  certificateUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

const EMPTY: Partial<Education> = {
  degree: "",
  institution: "",
  field: "",
  grade: "",
  description: "",
  certificateUrl: "",
  startDate: "",
  endDate: "",
};

export default function EducationPage() {
  const fetchEducation = useCallback(() => educationApi.getAll(), []);
  const { data, loading, refetch } = useQuery<Education[]>(fetchEducation);
  const { addToast } = useToastStore();
  const { addActivity } = useActivityStore();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<Partial<Education>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const items = data || [];

  const filtered = searchQuery
    ? items.filter(
        (e) =>
          e.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.field ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setModalOpen(true);
  };

  const openEdit = (edu: Education) => {
    setEditing(edu);
    setForm({
      degree: edu.degree,
      institution: edu.institution,
      field: edu.field ?? "",
      grade: edu.grade ?? "",
      description: edu.description ?? "",
      certificateUrl: edu.certificateUrl ?? "",
      startDate: edu.startDate?.split("T")[0] ?? "",
      endDate: edu.endDate?.split("T")[0] ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.degree || !form.institution || !form.startDate) {
      addToast({ type: "error", title: "Degree, Institution, and Start Date are required" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        degree: form.degree,
        institution: form.institution,
        field: form.field || null,
        grade: form.grade || null,
        description: form.description || null,
        certificateUrl: form.certificateUrl || null,
        startDate: form.startDate,
        endDate: form.endDate || null,
      };
      if (editing) {
        await educationApi.update(editing.id, payload);
        addActivity({ action: "updated", resource: "Education", label: form.degree! });
        addToast({ type: "success", title: "Updated" });
      } else {
        await educationApi.create(payload);
        addActivity({ action: "created", resource: "Education", label: form.degree! });
        addToast({ type: "success", title: "Added" });
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      addToast({ type: "error", title: err instanceof Error ? err.message : "Failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (edu: Education) => {
    const ok = await confirm({
      title: "Delete Education",
      message: `Delete "${edu.degree}" from ${edu.institution}?`,
      variant: "danger",
    });
    if (!ok) return;
    try {
      await educationApi.delete(edu.id);
      addActivity({ action: "deleted", resource: "Education", label: edu.degree });
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
              <GraduationCap size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
              Education
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Academic background</p>
          </div>
          <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            <Plus size={13} /> Add Education
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {[
            { l: "Total", v: items.length },
            { l: "Ongoing", v: items.filter((e) => !e.endDate).length },
            { l: "Completed", v: items.filter((e) => !!e.endDate).length },
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
            placeholder="Search by degree, institution, or field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inp, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "grid", gap: "10px" }} className="edu-grid">
            {[1, 2, 3, 4].map((i) => (<div key={i} className="skeleton" style={{ height: "180px", borderRadius: "10px" }} />))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
            <GraduationCap size={30} style={{ color: "rgba(255,255,255,0.08)", marginBottom: "10px" }} />
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px", marginBottom: "12px" }}>No education added yet</p>
            <button onClick={openNew} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 16px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> Add First
            </button>
          </div>
        )}

        {/* No search results */}
        {!loading && items.length > 0 && filtered.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "30px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>No education matches &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}

        {/* Education Cards */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gap: "10px" }} className="edu-grid">
            {filtered.map((edu) => (
              <div key={edu.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                {/* Top bar */}
                <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.04)", flexWrap: "wrap" }}>
                  {!edu.endDate ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontSize: "10px", fontWeight: 600, color: "#4ade80" }}>
                      Ongoing
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                      Completed
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                    <Calendar size={8} />
                    {formatDate(edu.startDate, { year: "numeric", month: "short" })} → {edu.endDate ? formatDate(edu.endDate, { year: "numeric", month: "short" }) : "Present"}
                  </div>
                  <div style={{ flex: 1 }} />
                  {edu.certificateUrl && (
                    <a href={edu.certificateUrl} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.2)", display: "flex" }}>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: "12px" }}>
                  {/* Degree + Institution */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <GraduationCap size={14} style={{ color: "rgba(255,255,255,0.15)" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{edu.degree}</h3>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{edu.institution}</span>
                    </div>
                  </div>

                  {/* Tags: field + grade */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                    {edu.field && (
                      <span style={{ padding: "2px 7px", borderRadius: "999px", fontSize: "10px", fontWeight: 500, color: "#60a5fa", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)" }}>
                        {edu.field}
                      </span>
                    )}
                    {edu.grade && (
                      <span style={{ padding: "2px 7px", borderRadius: "999px", fontSize: "10px", fontWeight: 600, color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", display: "flex", alignItems: "center", gap: "3px" }}>
                        <Award size={8} /> {edu.grade}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {edu.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "6px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <button onClick={() => openEdit(edu)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                      <Pencil size={10} /> Edit
                    </button>
                    <button onClick={() => handleDelete(edu)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit: ${editing.degree}` : "Add Education"} size="md">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Degree + Institution */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Degree *</label>
              <input placeholder="B.Tech Computer Science" style={inp} value={form.degree ?? ""} onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Institution *</label>
              <input placeholder="MIT" style={inp} value={form.institution ?? ""} onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))} />
            </div>
          </div>

          {/* Field + Grade */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Field of Study</label>
              <input placeholder="Computer Science" style={inp} value={form.field ?? ""} onChange={(e) => setForm((p) => ({ ...p, field: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Grade / GPA</label>
              <input placeholder="9.2 CGPA" style={inp} value={form.grade ?? ""} onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))} />
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Start Date *</label>
              <input type="date" style={inp} value={form.startDate ?? ""} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>End Date</label>
              <input type="date" style={inp} value={form.endDate ?? ""} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={lbl}>Description</label>
            <textarea
              placeholder="Achievements, activities..."
              rows={2}
              style={{ ...inp, resize: "vertical", minHeight: "50px", lineHeight: "1.5", fontFamily: "inherit", display: "block", overflow: "hidden" }}
              value={form.description ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          {/* Certificate URL */}
          <div>
            <label style={lbl}>Certificate URL</label>
            <input placeholder="https://..." style={inp} value={form.certificateUrl ?? ""} onChange={(e) => setForm((p) => ({ ...p, certificateUrl: e.target.value }))} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "4px" }}>
            <button onClick={() => setModalOpen(false)} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.degree || !form.institution || !form.startDate}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving || !form.degree || !form.institution || !form.startDate ? 0.4 : 1 }}
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
        .edu-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        @media (max-width: 640px) { .edu-grid { grid-template-columns: 1fr; } }
      `}</style>
    </DashboardLayout>
  );
}