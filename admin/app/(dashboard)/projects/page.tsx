"use client";

import { useCallback, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { projectsApi, uploadApi } from "@/lib/api";
import { useQuery } from "@/hooks/useApi";
import { useConfirm } from "@/hooks/useConfirm";
import { useActivityStore, useToastStore } from "@/lib/store";
import { formatDate, slugify } from "@/lib/utils";
import {
  Plus,
  Briefcase,
  Star,
  Pencil,
  Trash2,
  ExternalLink,
  GitBranch,
  Calendar,
  Save,
  Loader2,
  Upload,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  technologies: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const EMPTY: Partial<Project> = {
  title: "",
  description: "",
  slug: "",
  imageUrl: "",
  githubUrl: "",
  liveUrl: "",
  technologies: [],
  featured: false,
};

// ── Shared styles ────────────────────────────────────────────────────────────
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

// ── Inner component — uses useSearchParams so MUST be inside Suspense ────────
function ProjectsInner() {
  const router       = useRouter();
  const searchParams = useSearchParams(); // ← safe here because of Suspense wrapper below

  const fetchProjects                          = useCallback(() => projectsApi.getAll(), []);
  const { data, loading, refetch }             = useQuery<Project[]>(fetchProjects);
  const { addToast }                           = useToastStore();
  const { addActivity }                        = useActivityStore();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editing,     setEditing]     = useState<Project | null>(null);
  const [form,        setForm]        = useState<Partial<Project>>(EMPTY);
  const [techInput,   setTechInput]   = useState("");
  const [saving,      setSaving]      = useState(false);
  const [uploading,   setUploading]   = useState(false);

  const projects      = data || [];
  const featuredCount = projects.filter((p) => p.featured).length;

  const filtered = searchQuery
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.technologies.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : projects;

  // Handle edit redirect from [id] page
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && editId !== "new" && projects.length > 0) {
      const project = projects.find((p) => p.id === editId);
      if (project) {
        openEdit(project);
        router.replace("/projects", { scroll: false });
      }
    } else if (editId === "new") {
      openNew();
      router.replace("/projects", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, projects]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setTechInput("");
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title:        project.title,
      description:  project.description,
      slug:         project.slug,
      imageUrl:     project.imageUrl  ?? "",
      githubUrl:    project.githubUrl ?? "",
      liveUrl:      project.liveUrl   ?? "",
      technologies: project.technologies,
      featured:     project.featured,
    });
    setTechInput(project.technologies.join(", "));
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
    if (!form.title || !form.description) {
      addToast({ type: "error", title: "Title and Description are required" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title:        form.title,
        description:  form.description,
        slug:         form.slug || slugify(form.title),
        imageUrl:     form.imageUrl  || null,
        githubUrl:    form.githubUrl || null,
        liveUrl:      form.liveUrl   || null,
        featured:     Boolean(form.featured),
        technologies: techInput.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (editing) {
        await projectsApi.update(editing.id, payload);
        addActivity({ action: "updated", resource: "Project", label: form.title! });
        addToast({ type: "success", title: "Project updated" });
      } else {
        await projectsApi.create(payload);
        addActivity({ action: "created", resource: "Project", label: form.title! });
        addToast({ type: "success", title: "Project created" });
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      addToast({ type: "error", title: err instanceof Error ? err.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    const ok = await confirm({
      title:   "Delete Project",
      message: `Delete "${project.title}"? This cannot be undone.`,
      variant: "danger",
    });
    if (!ok) return;
    try {
      await projectsApi.delete(project.id);
      addActivity({ action: "deleted", resource: "Project", label: project.title });
      addToast({ type: "success", title: "Project deleted" });
      refetch();
    } catch {
      addToast({ type: "error", title: "Failed to delete" });
    }
  };

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Header ──────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <Briefcase size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
              Projects
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
              Manage your portfolio projects
            </p>
          </div>
          <button
            onClick={openNew}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={13} /> New Project
          </button>
        </div>

        {/* ── Stats ───────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {[
            { l: "Total",    v: projects.length },
            { l: "Featured", v: featuredCount },
            { l: "Regular",  v: projects.length - featuredCount },
          ].map((x) => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 14px", flex: 1, minWidth: "80px" }}>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{x.l}</p>
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{x.v}</p>
            </div>
          ))}
        </div>

        {/* ── Search ──────────────────────────────────────────── */}
        <div style={{ marginBottom: "14px" }}>
          <input
            placeholder="Search by title, slug, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inp, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
        </div>

        {/* ── Loading ─────────────────────────────────────────── */}
        {loading && (
          <div style={{ display: "grid", gap: "10px" }} className="project-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ height: "200px", borderRadius: "10px" }} />
            ))}
          </div>
        )}

        {/* ── Empty ──────────────────────────────────────────── */}
        {!loading && projects.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
            <Briefcase size={30} style={{ color: "rgba(255,255,255,0.08)", marginBottom: "10px" }} />
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px", marginBottom: "12px" }}>No projects yet</p>
            <button
              onClick={openNew}
              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 16px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
            >
              <Plus size={13} /> Create First Project
            </button>
          </div>
        )}

        {/* ── No search results ──────────────────────────────── */}
        {!loading && projects.length > 0 && filtered.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "30px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
              No projects match &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        {/* ── Project Cards ──────────────────────────────────── */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gap: "10px" }} className="project-grid">
            {filtered.map((project) => (
              <div
                key={project.id}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {project.featured && (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontSize: "10px", fontWeight: 600, color: "#4ade80" }}>
                      <Star size={8} /> Featured
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                    <Calendar size={8} />{formatDate(project.createdAt)}
                  </div>
                  <div style={{ flex: 1 }} />
                  {project.liveUrl   && <a href={project.liveUrl}   target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.2)", display: "flex" }}><ExternalLink size={12} /></a>}
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.2)", display: "flex" }}><GitBranch size={12} /></a>}
                </div>

                <div style={{ padding: "12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}>{project.title}</h3>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginBottom: "8px", fontFamily: "monospace" }}>/{project.slug}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {project.description}
                  </p>
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "10px" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  {project.technologies.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "10px" }}>
                      {project.technologies.map((t) => (
                        <span key={t} style={{ padding: "1px 6px", borderRadius: "999px", fontSize: "10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "6px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <button
                      onClick={() => openEdit(project)}
                      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                    >
                      <Pencil size={10} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                    >
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit: ${editing.title}` : "New Project"}
        size="md"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Title */}
          <div>
            <label style={lbl}>Title *</label>
            <input
              placeholder="My Awesome Project"
              style={inp}
              value={form.title ?? ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  title: e.target.value,
                  slug:  editing ? p.slug : slugify(e.target.value),
                }))
              }
            />
          </div>

          {/* Slug */}
          <div>
            <label style={lbl}>Slug</label>
            <input
              placeholder="my-awesome-project"
              style={{ ...inp, fontFamily: "monospace", fontSize: "12px" }}
              value={form.slug ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div>
            <label style={lbl}>Description *</label>
            <textarea
              placeholder="Describe your project..."
              rows={3}
              style={{ ...inp, resize: "vertical", minHeight: "60px", lineHeight: "1.5", fontFamily: "inherit", display: "block", overflow: "hidden" }}
              value={form.description ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          {/* Technologies */}
          <div>
            <label style={lbl}>Technologies (comma separated)</label>
            <input
              placeholder="React, Node.js, PostgreSQL"
              style={inp}
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
            />
            {techInput && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "4px" }}>
                {techInput.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                  <span key={t} style={{ padding: "1px 6px", borderRadius: "999px", fontSize: "10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image URL + Upload */}
          <div>
            <label style={lbl}>Image URL</label>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                placeholder="https://..."
                style={{ ...inp, flex: 1 }}
                value={form.imageUrl ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "3px", padding: "7px 10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "11px", cursor: "pointer", flexShrink: 0 }}>
                {uploading
                  ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} />
                  : <Upload size={11} />
                }
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* GitHub + Live URL */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>GitHub URL</label>
              <input
                placeholder="https://github.com/..."
                style={inp}
                value={form.githubUrl ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
              />
            </div>
            <div>
              <label style={lbl}>Live URL</label>
              <input
                placeholder="https://..."
                style={inp}
                value={form.liveUrl ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))}
              />
            </div>
          </div>

          {/* Featured */}
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              style={{ width: "14px", height: "14px", accentColor: "#fff" }}
            />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Featured Project</span>
          </label>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "4px" }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ padding: "7px 14px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.description}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving || !form.title || !form.description ? 0.4 : 1 }}
            >
              {saving
                ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                : <Save size={12} />
              }
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        variant={confirmState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .project-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        @media (max-width: 640px) { .project-grid { grid-template-columns: 1fr; } }
      `}</style>
    </DashboardLayout>
  );
}

// ── Public export — wraps inner component in Suspense ────────────────────────
// Required because useSearchParams() needs a Suspense boundary in Next.js 13+
export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsInner />
    </Suspense>
  );
}