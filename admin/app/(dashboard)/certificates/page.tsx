"use client";

import { useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { certificatesApi, uploadApi } from "@/lib/api";
import { useQuery } from "@/hooks/useApi";
import { useConfirm } from "@/hooks/useConfirm";
import { useActivityStore, useToastStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import {
  Plus,
  Save,
  Loader2,
  Upload,
  Award,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  Calendar,
} from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const EMPTY: Partial<Certificate> = {
  title: "",
  organization: "",
  imageUrl: "",
  credentialUrl: "",
  featured: false,
};

export default function CertificatesPage() {
  const fetchCerts = useCallback(() => certificatesApi.getAll(), []);
  const { data, loading, refetch } = useQuery<Certificate[]>(fetchCerts);
  const { addToast } = useToastStore();
  const { addActivity } = useActivityStore();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState<Partial<Certificate>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const items = data || [];
  const featuredCount = items.filter((c) => c.featured).length;

  const filtered = searchQuery
    ? items.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.organization.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY, issueDate: new Date().toISOString().split("T")[0] });
    setModalOpen(true);
  };

  const openEdit = (cert: Certificate) => {
    setEditing(cert);
    setForm({
      title: cert.title,
      organization: cert.organization,
      imageUrl: cert.imageUrl,
      credentialUrl: cert.credentialUrl ?? "",
      featured: cert.featured,
      issueDate: cert.issueDate?.split("T")[0] ?? "",
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const { url } = await uploadApi.uploadImage(e.target.files[0]);
      setForm((p) => ({ ...p, imageUrl: url }));
      addToast({ type: "success", title: "Image uploaded" });
    } catch {
      addToast({ type: "error", title: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.organization || !form.issueDate) {
      addToast({ type: "error", title: "Title, Organization, and Issue Date are required" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        organization: form.organization,
        issueDate: form.issueDate,
        credentialUrl: form.credentialUrl || null,
        imageUrl: form.imageUrl || "",
        featured: Boolean(form.featured),
      };
      if (editing) {
        await certificatesApi.update(editing.id, payload);
        addActivity({ action: "updated", resource: "Certificate", label: form.title! });
        addToast({ type: "success", title: "Updated" });
      } else {
        await certificatesApi.create(payload);
        addActivity({ action: "created", resource: "Certificate", label: form.title! });
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

  const handleDelete = async (cert: Certificate) => {
    const ok = await confirm({
      title: "Delete Certificate",
      message: `Delete "${cert.title}"? This cannot be undone.`,
      variant: "danger",
    });
    if (!ok) return;
    try {
      await certificatesApi.delete(cert.id);
      addActivity({ action: "deleted", resource: "Certificate", label: cert.title });
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
              <Award size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
              Certificates
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Professional certifications</p>
          </div>
          <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            <Plus size={13} /> Add Certificate
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {[
            { l: "Total", v: items.length },
            { l: "Featured", v: featuredCount },
            { l: "Regular", v: items.length - featuredCount },
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
            placeholder="Search by title or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inp, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "grid", gap: "10px" }} className="cert-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="skeleton" style={{ height: "240px", borderRadius: "10px" }} />))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
            <Award size={30} style={{ color: "rgba(255,255,255,0.08)", marginBottom: "10px" }} />
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px", marginBottom: "12px" }}>No certificates yet</p>
            <button onClick={openNew} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 16px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> Add First Certificate
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && items.length > 0 && filtered.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "30px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>No certificates match &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}

        {/* Certificate Cards */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gap: "10px" }} className="cert-grid">
            {filtered.map((cert) => (
              <div key={cert.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                {/* Certificate image preview */}
                {cert.imageUrl ? (
                  <button
                    onClick={() => setPreviewUrl(cert.imageUrl)}
                    style={{ display: "block", width: "100%", padding: 0, border: "none", background: "none", cursor: "pointer" }}
                  >
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      style={{ width: "100%", height: "140px", objectFit: "cover", display: "block", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </button>
                ) : (
                  <div style={{ width: "100%", height: "140px", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <Award size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
                  </div>
                )}

                {/* Top badges row */}
                <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {cert.featured && (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontSize: "10px", fontWeight: 600, color: "#4ade80" }}>
                      <Star size={8} /> Featured
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                    <Calendar size={8} />
                    {formatDate(cert.issueDate)}
                  </div>
                  <div style={{ flex: 1 }} />
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.2)", display: "flex" }}>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: "10px 12px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cert.title}</h3>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {cert.organization}
                  </p>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => openEdit(cert)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                      <Pencil size={10} /> Edit
                    </button>
                    <button onClick={() => handleDelete(cert)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Full image preview ─────────────────────────────────── */}
      {previewUrl && (
        <Modal isOpen={!!previewUrl} onClose={() => setPreviewUrl("")} hideHeader size="xl">
          <img src={previewUrl} alt="Certificate Preview" style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }} />
        </Modal>
      )}

      {/* ── Create / Edit Modal ─────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit: ${editing.title}` : "Add Certificate"} size="md">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Title + Organization */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Title *</label>
              <input placeholder="AWS Cloud Practitioner" style={inp} value={form.title ?? ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Organization *</label>
              <input placeholder="Amazon Web Services" style={inp} value={form.organization ?? ""} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))} />
            </div>
          </div>

          {/* Issue Date + Credential URL */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Issue Date *</label>
              <input type="date" style={inp} value={form.issueDate ?? ""} onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Credential URL</label>
              <input placeholder="https://..." style={inp} value={form.credentialUrl ?? ""} onChange={(e) => setForm((p) => ({ ...p, credentialUrl: e.target.value }))} />
            </div>
          </div>

          {/* Image URL + Upload */}
          <div>
            <label style={lbl}>Certificate Image</label>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                placeholder="https://... or upload below"
                style={{ ...inp, flex: 1 }}
                value={form.imageUrl ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "3px", padding: "7px 10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "11px", cursor: "pointer", flexShrink: 0 }}>
                {uploading ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={11} />}
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            {/* Image preview */}
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="preview"
                style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", marginTop: "6px" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>

          {/* Featured */}
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} style={{ width: "14px", height: "14px", accentColor: "#fff" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Mark as Featured</span>
          </label>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "4px" }}>
            <button onClick={() => setModalOpen(false)} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.organization || !form.issueDate}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving || !form.title || !form.organization || !form.issueDate ? 0.4 : 1 }}
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
        .cert-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
        @media (max-width: 640px) { .cert-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 400px) { .cert-grid { grid-template-columns: 1fr; } }
      `}</style>
    </DashboardLayout>
  );
}