"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { resumeApi, uploadApi } from "@/lib/api";
import { useQuery } from "@/hooks/useApi";
import { useToastStore, useActivityStore } from "@/lib/store";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  FileText, Save, Loader2, ExternalLink, Trash2,
  Plus, Eye, Pencil, Upload, Crop, RotateCw, ZoomIn, X, ImageIcon,
} from "lucide-react";

interface Resume {
  id: string;
  title: string;
  fileUrl: string;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

const PAGE_SIZES = [
  { label: "A4",     ratio: 1 / 1.4142 as number | undefined, w: 595,  h: 842,  desc: "210×297mm" },
  { label: "Letter", ratio: 1 / 1.2941 as number | undefined, w: 612,  h: 792,  desc: "8.5×11in"  },
  { label: "Custom", ratio: undefined,                         w: 800,  h: 800,  desc: "Free crop" },
] as const;
type PageSizeKey = "A4" | "Letter" | "Custom";

async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  outW: number,
  outH: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, outW, outH);
      canvas.toBlob(
        (blob) => { if (blob) resolve(blob); else reject(new Error("toBlob failed")); },
        "image/jpeg", 0.93,
      );
    };
    image.onerror = () => reject(new Error("Image load failed"));
    image.src = imageSrc;
  });
}

async function getPreviewDataUrl(
  imageSrc: string,
  pixelCrop: Area,
  outW: number,
  outH: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, outW, outH);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    image.onerror = () => reject(new Error("Image load failed"));
    image.src = imageSrc;
  });
}

export default function ResumePage() {
  const fetchResume = useCallback(async () => {
    try { return await resumeApi.get(); } catch { return null; }
  }, []);

  const { data: resume, loading, refetch } = useQuery<Resume | null>(fetchResume);
  const { addToast }    = useToastStore();
  const { addActivity } = useActivityStore();
  const thumbInputRef   = useRef<HTMLInputElement>(null);

  const [title, setTitle]           = useState("");
  const [fileUrl, setFileUrl]       = useState("");
  const [thumbUrl, setThumbUrl]     = useState("");
  const [saving, setSaving]         = useState(false);
  const [editMode, setEditMode]     = useState(false);
  const [createMode, setCreateMode] = useState(false);

  // Crop state
  const [cropOpen, setCropOpen]             = useState(false);
  const [cropSrc, setCropSrc]               = useState<string | null>(null);
  const [crop, setCrop]                     = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                     = useState(1);
  const [rotation, setRotation]             = useState(0);
  const [croppedArea, setCroppedArea]       = useState<Area | null>(null);
  const [cropping, setCropping]             = useState(false);
  const [pageSize, setPageSize]             = useState<PageSizeKey>("A4");
  const [previewUrl, setPreviewUrl]         = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isMobile, setIsMobile]             = useState(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState(false);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSize = PAGE_SIZES.find((s) => s.label === pageSize)!;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const onCropComplete = useCallback((_: Area, px: Area) => {
    setCroppedArea(px);
  }, []);

  // Live preview with debounce
  useEffect(() => {
    if (!cropSrc || !croppedArea) { setPreviewUrl(null); return; }
    if (previewTimer.current) clearTimeout(previewTimer.current);
    setPreviewLoading(true);

    // For custom, use actual pixel dimensions from crop
    const outW = pageSize === "Custom" ? Math.round(croppedArea.width)  : currentSize.w;
    const outH = pageSize === "Custom" ? Math.round(croppedArea.height) : currentSize.h;
    const safeW = Math.max(outW, 1);
    const safeH = Math.max(outH, 1);

    previewTimer.current = setTimeout(async () => {
      try {
        const url = await getPreviewDataUrl(cropSrc, croppedArea, safeW, safeH);
        setPreviewUrl(url);
      } catch {
        setPreviewUrl(null);
      } finally {
        setPreviewLoading(false);
      }
    }, 300);

    return () => { if (previewTimer.current) clearTimeout(previewTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedArea, cropSrc, pageSize]);

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (!ok.includes(file.type)) {
      addToast({ type: "error", title: "Invalid type", message: "PNG, JPG or WebP only" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCroppedArea(null);
      setPreviewUrl(null);
      setPageSize("A4");
      setShowPreviewPanel(false);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const handleCropUpload = async () => {
    if (!cropSrc || !croppedArea) return;
    setCropping(true);
    try {
      const outW = pageSize === "Custom" ? Math.max(Math.round(croppedArea.width), 100)  : currentSize.w;
      const outH = pageSize === "Custom" ? Math.max(Math.round(croppedArea.height), 100) : currentSize.h;
      const blob = await getCroppedBlob(cropSrc, croppedArea, outW, outH);
      const file = new File([blob], "resume-thumb.jpg", { type: "image/jpeg" });
      const { url } = await uploadApi.uploadImage(file);
      setThumbUrl(url);
      setCropOpen(false);
      setCropSrc(null);
      setPreviewUrl(null);
      addToast({ type: "success", title: "Thumbnail uploaded" });
    } catch {
      addToast({ type: "error", title: "Failed to upload" });
    } finally { setCropping(false); }
  };

  const handleEdit = () => {
    if (!resume) return;
    setTitle(resume.title);
    setFileUrl(resume.fileUrl);
    setThumbUrl(resume.thumbnailUrl ?? "");
    setEditMode(true);
    setCreateMode(false);
  };

  const handleCreate = () => {
    setTitle(""); setFileUrl(""); setThumbUrl("");
    setCreateMode(true); setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false); setCreateMode(false);
    setTitle(""); setFileUrl(""); setThumbUrl("");
  };

  const handleSave = async () => {
    if (!title.trim() || !fileUrl.trim()) {
      addToast({ type: "error", title: "Title and URL are required" }); return;
    }
    setSaving(true);
    try {
      const payload = { title, fileUrl, thumbnailUrl: thumbUrl || null };
      if (createMode) {
        await resumeApi.create(payload as never);
        addActivity({ action: "created", resource: "Resume", label: title });
        addToast({ type: "success", title: "Resume created" });
        setCreateMode(false);
      } else if (editMode && resume) {
        await resumeApi.update(resume.id, payload);
        addActivity({ action: "updated", resource: "Resume", label: title });
        addToast({ type: "success", title: "Resume updated" });
        setEditMode(false);
      }
      refetch();
    } catch (err) {
      addToast({ type: "error", title: err instanceof Error ? err.message : "Failed" });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!resume || !window.confirm(`Delete "${resume.title}"?`)) return;
    try {
      await resumeApi.delete(resume.id);
      addActivity({ action: "deleted", resource: "Resume", label: resume.title });
      addToast({ type: "success", title: "Deleted" });
      setEditMode(false); refetch();
    } catch { addToast({ type: "error", title: "Failed to delete" }); }
  };

  const getPreviewIframeUrl = (url: string) => {
    if (url.includes("drive.google.com")) {
      const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    }
    return url;
  };

  // Shared styles
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
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px", padding: "16px",
  };
  const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.25)"; };
  const blur  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; };

  const ThumbField = () => (
    <div>
      <label style={lbl}>Thumbnail (optional)</label>
      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", margin: "0 0 6px" }}>
        Upload a screenshot of your resume first page.
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <label
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            padding: "8px 12px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px",
            cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)"; e.currentTarget.style.background = "rgba(96,165,250,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        >
          <Crop size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Upload & Crop</span>
          <input
            ref={thumbInputRef} type="file" hidden
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleThumbSelect}
          />
        </label>
        <input
          placeholder="Or paste image URL..."
          style={{ ...inp, flex: 1 }}
          value={thumbUrl}
          onChange={(e) => setThumbUrl(e.target.value)}
          onFocus={focus} onBlur={blur}
        />
      </div>

      {thumbUrl && (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginTop: "8px", padding: "8px 10px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px",
        }}>
          <div style={{ width: "44px", height: "58px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", flexShrink: 0 }}>
            <img src={thumbUrl} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: "0 0 2px" }}>Thumbnail uploaded ✓</p>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{thumbUrl}</p>
          </div>
          <button
            onClick={() => setThumbUrl("")}
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "6px", color: "#f87171", cursor: "pointer", padding: "4px 8px", fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}
          >
            <X size={10} /> Clear
          </button>
        </div>
      )}
    </div>
  );

  // Preview panel content (shared between mobile bottom sheet and desktop sidebar)
  const PreviewPanelContent = () => (
    <>
      <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
        Live Preview
      </p>

      {/* Portfolio card */}
      <div style={{ marginBottom: "12px" }}>
        <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", margin: "0 0 6px" }}>Portfolio card:</p>
        <div style={{
          width: "100%", maxWidth: isMobile ? "160px" : "100%",
          margin: isMobile ? "0 auto" : "0",
          aspectRatio: "220 / 300", borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(15,23,42,0.95)",
          position: "relative", overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          <div style={{ position: "absolute", inset: "3px", borderRadius: "9px", overflow: "hidden", background: "#f8fafc" }}>
            {previewLoading ? (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1e293b" }}>
                <Loader2 size={18} style={{ color: "#60a5fa", animation: "spin 1s linear infinite" }} />
              </div>
            ) : previewUrl ? (
              <img src={previewUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", padding: "8px", boxSizing: "border-box" }}>
                <span style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>Adjust crop to see preview</span>
              </div>
            )}
          </div>
          <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 18px 18px 0", borderColor: "transparent rgba(15,23,42,0.95) transparent transparent", zIndex: 10 }} />
        </div>
      </div>

      {/* Size info */}
      <div style={{ padding: "8px 10px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.1)", borderRadius: "6px", marginBottom: "10px" }}>
        <p style={{ fontSize: "9px", color: "rgba(96,165,250,0.8)", margin: 0, lineHeight: 1.6 }}>
          <strong>{currentSize.label}</strong> — {currentSize.desc}<br />
          {pageSize === "Custom"
            ? "Output: matches crop selection"
            : `Output: ${currentSize.w} × ${currentSize.h}px JPEG`
          }
        </p>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={18} style={{ color: "rgba(255,255,255,0.3)" }} /> Resume
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
              Manage your resume link &amp; preview thumbnail
            </p>
          </div>
          {!resume && !createMode && !loading && (
            <button onClick={handleCreate} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> Add Resume
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={card}>
            {["180px", "14px", "300px"].map((h, i) => (
              <div key={i} className="skeleton" style={{ height: h, borderRadius: "8px", marginBottom: "10px", width: i === 1 ? "60%" : "100%" }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !resume && !createMode && (
          <div style={{ ...card, textAlign: "center", padding: "40px 20px" }}>
            <FileText size={32} style={{ color: "rgba(255,255,255,0.08)", marginBottom: "12px" }} />
            <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>No resume added yet</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", marginBottom: "20px" }}>Add your resume link to display it on your portfolio.</p>
            <button onClick={handleCreate} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 20px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> Add Resume Link
            </button>
          </div>
        )}

        {/* Create form */}
        {createMode && (
          <div style={{ ...card, display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Add Resume</h3>
            <div>
              <label style={lbl}>Title *</label>
              <input placeholder="My Resume" style={inp} value={title} onChange={(e) => setTitle(e.target.value)} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={lbl}>File URL *</label>
              <input placeholder="https://drive.google.com/file/d/..." style={inp} value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} onFocus={focus} onBlur={blur} />
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)", marginTop: "4px" }}>Google Drive, Dropbox, or any public file URL</p>
            </div>
            <ThumbField />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={handleCancel} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !title.trim() || !fileUrl.trim()} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving || !title.trim() || !fileUrl.trim() ? 0.4 : 1 }}>
                {saving ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={12} />} Save
              </button>
            </div>
          </div>
        )}

        {/* Resume view + edit */}
        {!loading && resume && !createMode && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                <h3 style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Resume Details</h3>
                {!editMode && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={handleEdit} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                      <Pencil size={10} /> Edit
                    </button>
                    <button onClick={handleDelete} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                )}
              </div>

              {!editMode && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <label style={lbl}>Title</label>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", margin: 0, wordBreak: "break-word" }}>{resume.title}</p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <label style={lbl}>Thumbnail</label>
                      <div style={{ width: "55px", height: "72px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                        {resume.thumbnailUrl ? (
                          <img src={resume.thumbnailUrl} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px" }}>
                            <ImageIcon size={12} style={{ color: "rgba(255,255,255,0.1)" }} />
                            <span style={{ fontSize: "6px", color: "rgba(255,255,255,0.15)" }}>No thumb</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>File URL</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", flex: 1, margin: 0, wordBreak: "break-all" }}>{resume.fileUrl}</p>
                      <a href={resume.fileUrl} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.25)", display: "flex", flexShrink: 0 }}><ExternalLink size={12} /></a>
                    </div>
                  </div>
                  <a href={resume.fileUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#fff", color: "#000", borderRadius: "8px", fontSize: "12px", fontWeight: 600, textDecoration: "none", width: "fit-content" }}>
                    <ExternalLink size={12} /> Open Resume
                  </a>
                </div>
              )}

              {editMode && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={lbl}>Title *</label>
                    <input placeholder="Resume title..." style={inp} value={title} onChange={(e) => setTitle(e.target.value)} onFocus={focus} onBlur={blur} />
                  </div>
                  <div>
                    <label style={lbl}>File URL *</label>
                    <input placeholder="https://drive.google.com/..." style={inp} value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} onFocus={focus} onBlur={blur} />
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)", marginTop: "4px" }}>Google Drive, Dropbox, or any direct PDF URL</p>
                  </div>
                  <ThumbField />
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={handleCancel} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving || !title.trim() || !fileUrl.trim()} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving || !title.trim() || !fileUrl.trim() ? 0.4 : 1 }}>
                      {saving ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={12} />} Update
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!editMode && resume.fileUrl && (
              <div style={card}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <Eye size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Preview</span>
                </div>
                <div className="resume-preview-container">
                  <iframe src={getPreviewIframeUrl(resume.fileUrl)} className="resume-preview-iframe" allow="autoplay" title="Resume Preview" />
                </div>
                <div className="resume-mobile-link">
                  <a href={resume.fileUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "12px" }}>
                    <ExternalLink size={12} /> Open in new tab
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Crop Modal ──────────────────────────────────────────────────── */}
      {cropOpen && cropSrc && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "stretch", justifyContent: "center" }}>

          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(6px)" }}
            onClick={() => { setCropOpen(false); setCropSrc(null); setPreviewUrl(null); }}
          />

          {/* Modal panel — full screen on mobile, centered on desktop */}
          <div style={{
            position: "relative", zIndex: 1,
            width: "100%",
            maxWidth: isMobile ? "100%" : "960px",
            margin: isMobile ? "0" : "auto",
            background: "rgba(8,12,24,0.99)",
            border: isMobile ? "none" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: isMobile ? "0" : "16px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxHeight: isMobile ? "100%" : "calc(100vh - 32px)",
            alignSelf: isMobile ? "stretch" : "center",
          }}>

            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: isMobile ? "12px 14px" : "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}>
              <div style={{ minWidth: 0, flex: 1, paddingRight: "10px" }}>
                <h2 style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: 700, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Crop Resume Thumbnail
                </h2>
                {!isMobile && (
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: "3px 0 0" }}>
                    Drag to reposition · Scroll/slider to zoom · Choose page size
                  </p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                {/* Mobile: toggle preview button */}
                {isMobile && (
                  <button
                    onClick={() => setShowPreviewPanel(!showPreviewPanel)}
                    style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      padding: "6px 10px",
                      background: showPreviewPanel ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.06)",
                      border: showPreviewPanel ? "1px solid rgba(96,165,250,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px", color: showPreviewPanel ? "#60a5fa" : "rgba(255,255,255,0.5)",
                      cursor: "pointer", fontSize: "11px", fontWeight: 600,
                    }}
                  >
                    <Eye size={12} /> Preview
                  </button>
                )}
                <button
                  onClick={() => { setCropOpen(false); setCropSrc(null); setPreviewUrl(null); }}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "6px", display: "flex" }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Page size selector */}
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: isMobile ? "8px 12px" : "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              flexShrink: 0,
              overflowX: "auto",
            }}>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0, marginRight: "2px" }}>Size:</span>
              {PAGE_SIZES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setPageSize(s.label as PageSizeKey);
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                  }}
                  style={{
                    padding: isMobile ? "5px 10px" : "4px 12px",
                    borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                    cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
                    border: pageSize === s.label ? "1px solid rgba(96,165,250,0.6)" : "1px solid rgba(255,255,255,0.08)",
                    background: pageSize === s.label ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.03)",
                    color: pageSize === s.label ? "#60a5fa" : "rgba(255,255,255,0.4)",
                    transition: "all 0.15s",
                  }}
                >
                  {s.label}
                  {!isMobile && <span style={{ fontSize: "9px", opacity: 0.6, marginLeft: "4px" }}>({s.desc})</span>}
                </button>
              ))}
              {/* Custom mode indicator */}
              {pageSize === "Custom" && (
                <span style={{ fontSize: "10px", color: "rgba(167,139,250,0.8)", flexShrink: 0, marginLeft: "4px" }}>
                  ✦ Drag handles to resize freely
                </span>
              )}
            </div>

            {/* Body */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0, flexDirection: isMobile ? "column" : "row" }}>

              {/* Mobile preview overlay (slides down) */}
              {isMobile && showPreviewPanel && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 10, background: "rgba(8,12,24,0.98)",
                  display: "flex", flexDirection: "column",
                  padding: "16px",
                  overflowY: "auto",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>Preview</h3>
                    <button
                      onClick={() => setShowPreviewPanel(false)}
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "6px", display: "flex" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <PreviewPanelContent />
                  <button
                    onClick={() => setShowPreviewPanel(false)}
                    style={{ marginTop: "auto", padding: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                  >
                    Back to crop
                  </button>
                </div>
              )}

              {/* Crop area */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
                {/* Crop canvas */}
                <div style={{
                  position: "relative",
                  flex: 1,
                  minHeight: isMobile ? "280px" : "400px",
                  background: "#000",
                  overflow: "hidden",
                  touchAction: "none",
                }}>
                  <Cropper
                    image={cropSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={currentSize.ratio}
                    showGrid={true}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    style={{
                      containerStyle: { position: "absolute", inset: 0, background: "#000" },
                      cropAreaStyle: {
                        border: "2px solid rgba(96,165,250,0.85)",
                        borderRadius: pageSize === "Custom" ? "0px" : "6px",
                        boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
                      },
                    }}
                  />
                </div>

                {/* Sliders */}
                <div style={{
                  padding: isMobile ? "10px 12px" : "12px 16px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: isMobile ? "10px" : "12px",
                  flexShrink: 0,
                }}>
                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                      <ZoomIn size={10} /> {isMobile ? "Zoom" : `Zoom ${zoom.toFixed(2)}x`}
                    </label>
                    <input type="range" min="0.5" max="5" step="0.02" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: "100%", accentColor: "#60a5fa", cursor: "pointer" }} />
                    {!isMobile && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>0.5x</span>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>5x</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                      <RotateCw size={10} /> {isMobile ? "Rotate" : `Rotate ${rotation}°`}
                    </label>
                    <input type="range" min="-180" max="180" step="1" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} style={{ width: "100%", accentColor: "#a855f7", cursor: "pointer" }} />
                    {!isMobile && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>-180°</span>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>+180°</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile action bar */}
                {isMobile && (
                  <div style={{
                    padding: "10px 12px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    display: "flex", gap: "8px", flexShrink: 0,
                  }}>
                    <button
                      onClick={() => { setCropOpen(false); setCropSrc(null); setPreviewUrl(null); }}
                      style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCropUpload}
                      disabled={cropping || !croppedArea}
                      style={{
                        flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        padding: "10px",
                        background: cropping ? "rgba(96,165,250,0.15)" : "#fff",
                        color: cropping ? "#60a5fa" : "#000",
                        border: cropping ? "1px solid rgba(96,165,250,0.3)" : "none",
                        borderRadius: "8px", fontSize: "13px", fontWeight: 700,
                        cursor: cropping || !croppedArea ? "not-allowed" : "pointer",
                        opacity: !croppedArea ? 0.5 : 1,
                      }}
                    >
                      {cropping ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
                      {cropping ? "Uploading..." : "Crop & Upload"}
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop right panel */}
              {!isMobile && (
                <div style={{
                  width: "220px", flexShrink: 0,
                  borderLeft: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", flexDirection: "column",
                  padding: "16px 14px", gap: "0",
                  background: "rgba(255,255,255,0.01)",
                  overflowY: "auto",
                }}>
                  <PreviewPanelContent />
                  <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <button
                      onClick={handleCropUpload}
                      disabled={cropping || !croppedArea}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        padding: "9px 0", width: "100%",
                        background: cropping ? "rgba(96,165,250,0.15)" : "#fff",
                        color: cropping ? "#60a5fa" : "#000",
                        border: cropping ? "1px solid rgba(96,165,250,0.3)" : "none",
                        borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                        cursor: cropping || !croppedArea ? "not-allowed" : "pointer",
                        opacity: !croppedArea ? 0.5 : 1,
                      }}
                    >
                      {cropping ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={13} />}
                      {cropping ? "Uploading..." : "Crop & Upload"}
                    </button>
                    <button
                      onClick={() => { setCropOpen(false); setCropSrc(null); setPreviewUrl(null); }}
                      style={{ padding: "7px 0", width: "100%", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "11px", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .resume-preview-container {
          position: relative; width: 100%; border-radius: 8px;
          overflow: hidden; border: 1px solid rgba(255,255,255,0.06); background: #111;
        }
        .resume-preview-iframe {
          width: 100%; height: 70vh; min-height: 400px; max-height: 700px; border: none; display: block;
        }
        .resume-mobile-link { display: none; margin-top: 10px; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.1); outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; border: 2px solid #0a0f1e; }
        input[type=range][style*="60a5fa"]::-webkit-slider-thumb { background: #60a5fa; }
        input[type=range][style*="a855f7"]::-webkit-slider-thumb { background: #a855f7; }
        @media (max-width: 640px) {
          .resume-preview-iframe { height: 50vh; min-height: 280px; max-height: 400px; }
          .resume-mobile-link { display: block; }
        }
      `}</style>
    </DashboardLayout>
  );
}