"use client";

import { useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { showcaseApi } from "@/lib/api";
import { useQuery } from "@/hooks/useApi";
import { useConfirm } from "@/hooks/useConfirm";
import { useActivityStore, useToastStore } from "@/lib/store";
import {
  Plus,
  Save,
  Loader2,
  Pencil,
  Trash2,
  ExternalLink,
  GitBranch,
  Smartphone,
  Monitor,
  Star,
} from "lucide-react";

interface Showcase {
  id: string;
  title: string;
  type: string;
  description: string;
  imageUrl: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  technologies: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const TYPES = ["PHONE", "LAPTOP"];

const EMPTY: Partial<Showcase> = {
  title: "",
  type: "PHONE",
  description: "",
  imageUrl: "",
  liveUrl: "",
  githubUrl: "",
  technologies: [],
  featured: false,
};

export default function ShowcasePage() {
  const fetchShowcase = useCallback(() => showcaseApi.getAll(), []);
  const { data, loading, refetch } = useQuery<Showcase[]>(fetchShowcase);
  const { addToast } = useToastStore();
  const { addActivity } = useActivityStore();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Showcase | null>(null);
  const [form, setForm] = useState<Partial<Showcase>>(EMPTY);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);

  const items = data || [];

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setTechInput("");
    setModalOpen(true);
  };

  const openEdit = (item: Showcase) => {
    setEditing(item);
    setForm({
      title: item.title,
      type: item.type,
      description: item.description,
      imageUrl: item.imageUrl ?? "",
      liveUrl: item.liveUrl ?? "",
      githubUrl: item.githubUrl ?? "",
      technologies: item.technologies,
      featured: item.featured,
    });
    setTechInput(item.technologies.join(", "));
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      addToast({ type: "error", title: "Title and Description are required" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        type: form.type || "PHONE",
        description: form.description,
        imageUrl: form.imageUrl || "",
        liveUrl: form.liveUrl || null,
        githubUrl: form.githubUrl || null,
        technologies: techInput.split(",").map((t) => t.trim()).filter(Boolean),
        featured: Boolean(form.featured),
      };
      if (editing) {
        await showcaseApi.update(editing.id, payload);
        addActivity({ action: "updated", resource: "Showcase", label: form.title! });
        addToast({ type: "success", title: "Updated" });
      } else {
        await showcaseApi.create(payload);
        addActivity({ action: "created", resource: "Showcase", label: form.title! });
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

  const handleDelete = async (item: Showcase) => {
    const ok = await confirm({
      title: "Delete Item",
      message: `Delete "${item.title}"?`,
      variant: "danger",
    });
    if (!ok) return;
    try {
      await showcaseApi.delete(item.id);
      addActivity({ action: "deleted", resource: "Showcase", label: item.title });
      addToast({ type: "success", title: "Deleted" });
      refetch();
    } catch {
      addToast({ type: "error", title: "Failed to delete" });
    }
  };

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
  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: "10px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "4px",
  };

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>Showcase</h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Phone &amp; Laptop projects</p>
          </div>
          <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            <Plus size={13} /> Add
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {[
            { l: "Total", v: items.length },
            { l: "Phone", v: items.filter((i) => i.type === "PHONE").length },
            { l: "Laptop", v: items.filter((i) => i.type === "LAPTOP").length },
            { l: "Featured", v: items.filter((i) => i.featured).length },
          ].map((x) => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 14px", flex: 1, minWidth: "80px" }}>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{x.l}</p>
              <p style={{ fontSize: "18px", fontWeight: 700 }}>{x.v}</p>
            </div>
          ))}
        </div>

        {loading && (
          <div style={{ display: "grid", gap: "10px" }} className="showcase-grid">            {[1, 2, 3, 4].map((i) => (<div key={i} className="skeleton" style={{ height: "180px", borderRadius: "10px" }} />))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px", marginBottom: "12px" }}>No items yet</p>
            <button onClick={openNew} style={{ padding: "7px 16px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={12} /> Add First
            </button>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div style={{ display: "grid", gap: "10px" }} className="showcase-grid">
            {items.map((item) => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 7px", borderRadius: "999px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
                    {item.type === "PHONE" ? <Smartphone size={9} /> : <Monitor size={9} />}
                    {item.type}
                  </div>
                  {item.featured && (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontSize: "10px", fontWeight: 600, color: "#4ade80" }}>
                      <Star size={8} /> Featured
                    </div>
                  )}
                  <div style={{ flex: 1 }} />
                  {item.liveUrl && (<a href={item.liveUrl} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.2)", display: "flex" }}><ExternalLink size={12} /></a>)}
                  {item.githubUrl && (<a href={item.githubUrl} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.2)", display: "flex" }}><GitBranch size={12} /></a>)}
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "3px" }}>{item.title}</h3>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.description}</p>
                  {item.technologies.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "8px" }}>
                      {item.technologies.map((t) => (
                        <span key={t} style={{ padding: "1px 6px", borderRadius: "999px", fontSize: "10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => openEdit(item)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                      <Pencil size={10} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit: ${editing.title}` : "Add Showcase Item"} size="md">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: "8px" }}>
            <div>
              <label style={lbl}>Title *</label>
              <input placeholder="Uwe Service" style={inp} value={form.title ?? ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Type *</label>
              <select style={{ ...inp, cursor: "pointer" }} value={form.type ?? "PHONE"} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                {TYPES.map((t) => (<option key={t} value={t} style={{ background: "#111" }}>{t}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label style={lbl}>Description *</label>
            <input placeholder="Service booking app" style={inp} value={form.description ?? ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Live URL</label>
              <input placeholder="https://..." style={inp} value={form.liveUrl ?? ""} onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>GitHub URL</label>
              <input placeholder="https://github.com/..." style={inp} value={form.githubUrl ?? ""} onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))} />
            </div>
          </div>
          <div>
            <label style={lbl}>Technologies (comma separated)</label>
            <input placeholder="React Native, Firebase, AI" style={inp} value={techInput} onChange={(e) => setTechInput(e.target.value)} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} style={{ width: "14px", height: "14px", accentColor: "#fff" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Featured</span>
          </label>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "4px" }}>
            <button onClick={() => setModalOpen(false)} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.title || !form.description} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving || !form.title || !form.description ? 0.4 : 1 }}>
              {saving ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={12} />}
              {editing ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} variant={confirmState.variant} onConfirm={handleConfirm} onCancel={handleCancel} />
      <style>{`
  @keyframes spin { to { transform: rotate(360deg); } }
  .showcase-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
  @media (max-width: 640px) { .showcase-grid { grid-template-columns: 1fr; } }
`}</style>    </DashboardLayout>
  );
}