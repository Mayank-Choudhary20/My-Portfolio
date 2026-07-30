"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { skillsApi, uploadApi } from "@/lib/api";
import { useQuery } from "@/hooks/useApi";
import { useConfirm } from "@/hooks/useConfirm";
import { useActivityStore, useToastStore } from "@/lib/store";
import {
  Plus,
  Save,
  Loader2,
  Pencil,
  Trash2,
  Cpu,
  Star,
  BarChart3,
  X,
  Upload,
  ImageIcon,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  proficiency?: string | null;
  percentage?: number | null;
  icon?: string | null;
  years?: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Mobile", "AI/ML", "Tools", "Languages"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const DEFAULT_PROFICIENCY = ["Low", "Medium", "High", "Very High"];
const OTHER_VALUE = "__other__";
const EMPTY: Partial<Skill> = {
  name: "", category: "Frontend", level: "Intermediate",
  proficiency: "Medium", percentage: 50, icon: "", years: 1, featured: false,
};

export default function SkillsPage() {
  const fetchSkills = useCallback(() => skillsApi.getAll(), []);
  const { data, loading, refetch } = useQuery<Skill[]>(fetchSkills);
  const { addToast } = useToastStore();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const { addActivity } = useActivityStore();

  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Skill | null>(null);
  const [form, setForm]             = useState<Partial<Skill>>(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom category/proficiency
  const [categorySelect, setCategorySelect]       = useState("Frontend");
  const [customCategory, setCustomCategory]       = useState("");
  const [proficiencySelect, setProficiencySelect] = useState("Medium");
  const [customProficiency, setCustomProficiency] = useState("");

  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("custom-skill-categories") || "[]"); }
    catch { return []; }
  });
  const [customProficiencies, setCustomProficiencies] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("custom-skill-proficiencies") || "[]"); }
    catch { return []; }
  });

  const allCategories = useMemo(() => {
    const fromData = (data || []).map((s) => s.category).filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...customCategories, ...fromData])).sort();
  }, [data, customCategories]);

  const allProficiencies = useMemo(() => {
    const fromData = (data || []).map((s) => s.proficiency).filter(Boolean) as string[];
    return Array.from(new Set([...DEFAULT_PROFICIENCY, ...customProficiencies, ...fromData]));
  }, [data, customProficiencies]);

  const skills = data || [];
  const categoryMap: Record<string, number> = {};
  skills.forEach((s) => { categoryMap[s.category] = (categoryMap[s.category] || 0) + 1; });

  const filtered = searchQuery
    ? skills.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.level.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : skills;

  // ── Helpers ────────────────────────────────────────────────
  const saveCustomCategories = (list: string[]) => {
    setCustomCategories(list);
    localStorage.setItem("custom-skill-categories", JSON.stringify(list));
  };
  const saveCustomProficiencies = (list: string[]) => {
    setCustomProficiencies(list);
    localStorage.setItem("custom-skill-proficiencies", JSON.stringify(list));
  };

  const addCustomCategory = () => {
    const val = customCategory.trim();
    if (!val) return;
    if (!allCategories.includes(val)) saveCustomCategories([...customCategories, val]);
    setCategorySelect(val);
    setForm((p) => ({ ...p, category: val }));
    setCustomCategory("");
  };
  const removeCustomCategory = (cat: string) => {
    saveCustomCategories(customCategories.filter((c) => c !== cat));
    if (categorySelect === cat) { setCategorySelect("Frontend"); setForm((p) => ({ ...p, category: "Frontend" })); }
  };
  const addCustomProficiency = () => {
    const val = customProficiency.trim();
    if (!val) return;
    if (!allProficiencies.includes(val)) saveCustomProficiencies([...customProficiencies, val]);
    setProficiencySelect(val);
    setForm((p) => ({ ...p, proficiency: val }));
    setCustomProficiency("");
  };
  const removeCustomProficiency = (prof: string) => {
    saveCustomProficiencies(customProficiencies.filter((p) => p !== prof));
    if (proficiencySelect === prof) { setProficiencySelect("Medium"); setForm((p) => ({ ...p, proficiency: "Medium" })); }
  };

  // ── Image upload ───────────────────────────────────────────
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      addToast({ type: "error", title: "Invalid file type", message: "Use PNG, JPG, SVG, or WebP" });
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadApi.uploadImage(file);
      setForm((p) => ({ ...p, icon: url }));
      addToast({ type: "success", title: "Icon uploaded to Cloudinary" });
    } catch {
      addToast({ type: "error", title: "Upload failed", message: "Could not upload icon" });
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Open/Edit ──────────────────────────────────────────────
  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setCategorySelect("Frontend");
    setProficiencySelect("Medium");
    setCustomCategory("");
    setCustomProficiency("");
    setModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({
      name:        skill.name,
      category:    skill.category,
      level:       skill.level,
      proficiency: skill.proficiency ?? "",
      percentage:  skill.percentage ?? 50,
      icon:        skill.icon ?? "",
      years:       skill.years ?? 1,
      featured:    skill.featured,
    });
    setCategorySelect(allCategories.includes(skill.category) ? skill.category : OTHER_VALUE);
    if (!allCategories.includes(skill.category)) setCustomCategory(skill.category);
    const prof = skill.proficiency ?? "";
    if (allProficiencies.includes(prof)) setProficiencySelect(prof);
    else if (prof) { setProficiencySelect(OTHER_VALUE); setCustomProficiency(prof); }
    else setProficiencySelect("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { addToast({ type: "error", title: "Name is required" }); return; }

    let finalCategory = form.category || "Frontend";
    if (categorySelect === OTHER_VALUE && customCategory.trim()) {
      finalCategory = customCategory.trim();
      if (!allCategories.includes(finalCategory)) saveCustomCategories([...customCategories, finalCategory]);
    }

    let finalProficiency: string | null = form.proficiency || null;
    if (proficiencySelect === OTHER_VALUE && customProficiency.trim()) {
      finalProficiency = customProficiency.trim();
      if (!allProficiencies.includes(finalProficiency)) saveCustomProficiencies([...customProficiencies, finalProficiency]);
    }

    setSaving(true);
    try {
      const payload = {
        name:        form.name,
        category:    finalCategory,
        level:       form.level || "Intermediate",
        proficiency: finalProficiency,
        percentage:  form.percentage != null ? Number(form.percentage) : null,
        icon:        form.icon || null,
        years:       form.years != null ? Number(form.years) : null,
        featured:    Boolean(form.featured),
      };
      if (editing) {
        await skillsApi.update(editing.id, payload);
        addActivity({ action: "updated", resource: "Skill", label: form.name! });
        addToast({ type: "success", title: `"${form.name}" updated` });
      } else {
        await skillsApi.create(payload);
        addActivity({ action: "created", resource: "Skill", label: form.name! });
        addToast({ type: "success", title: `"${form.name}" added` });
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      addToast({ type: "error", title: err instanceof Error ? err.message : "Failed to save" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (skill: Skill) => {
    const ok = await confirm({
      title:   "Delete Skill",
      message: `Delete "${skill.name}"? This cannot be undone.`,
      variant: "danger",
    });
    if (!ok) return;
    try {
      await skillsApi.delete(skill.id);
      addActivity({ action: "deleted", resource: "Skill", label: skill.name });
      // More descriptive delete toast
      addToast({
        type:    "success",
        title:   `"${skill.name}" deleted`,
        message: "Skill has been permanently removed",
      });
      refetch();
    } catch {
      addToast({ type: "error", title: "Delete failed", message: "Could not remove skill" });
    }
  };

  // ── Styles ─────────────────────────────────────────────────
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
  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.25)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.09)";
  };

  const levelColor = (l: string) => {
    const m: Record<string, string> = { Expert: "#4ade80", Advanced: "#60a5fa", Intermediate: "#fbbf24", Beginner: "#f87171" };
    return m[l] || "rgba(255,255,255,0.4)";
  };
  const profColor = (p: string) => {
    const m: Record<string, string> = { "Very High": "#4ade80", High: "#60a5fa", Medium: "#fbbf24", Low: "#f87171" };
    return m[p] || "rgba(255,255,255,0.4)";
  };
  const isCustomCat  = (cat: string)  => customCategories.includes(cat)   && !DEFAULT_CATEGORIES.includes(cat);

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Header ──────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <Cpu size={18} style={{ color: "rgba(255,255,255,0.3)" }} /> Skills
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Technical skills &amp; proficiency</p>
          </div>
          <button
            onClick={openNew}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={13} /> Add Skill
          </button>
        </div>

        {/* ── Stats ───────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {[
            { l: "Total",      v: skills.length,                            i: Cpu      },
            { l: "Featured",   v: skills.filter((s) => s.featured).length,  i: Star     },
            { l: "Categories", v: Object.keys(categoryMap).length,          i: BarChart3 },
          ].map((x) => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 14px", flex: 1, minWidth: "80px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                <x.i size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{x.l}</span>
              </div>
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{x.v}</p>
            </div>
          ))}
        </div>

        {/* ── Category tags ────────────────────────────────────── */}
        {Object.keys(categoryMap).length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
            {Object.entries(categoryMap).map(([cat, count]) => (
              <span key={cat} style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 500, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                {cat} ({count})
                {isCustomCat(cat) && (
                  <button onClick={() => removeCustomCategory(cat)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", padding: 0, display: "flex" }}>
                    <X size={8} />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {/* ── Search ──────────────────────────────────────────── */}
        <div style={{ marginBottom: "14px" }}>
          <input
            placeholder="Search by name, category, or level..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inp, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
        </div>

        {/* ── Loading ─────────────────────────────────────────── */}
        {loading && (
          <div style={{ display: "grid", gap: "10px" }} className="skill-grid">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="skeleton" style={{ height: "180px", borderRadius: "10px" }} />
            ))}
          </div>
        )}

        {/* ── Empty ───────────────────────────────────────────── */}
        {!loading && skills.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
            <Cpu size={30} style={{ color: "rgba(255,255,255,0.08)", marginBottom: "10px" }} />
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px", marginBottom: "12px" }}>No skills yet</p>
            <button onClick={openNew} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 16px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> Add First Skill
            </button>
          </div>
        )}

        {/* ── No results ──────────────────────────────────────── */}
        {!loading && skills.length > 0 && filtered.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "30px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>No skills match &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}

        {/* ── Skill cards ─────────────────────────────────────── */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gap: "10px" }} className="skill-grid">
            {filtered.map((skill) => (
              <div
                key={skill.id}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    {skill.icon ? (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "contain", background: "rgba(255,255,255,0.05)", padding: "4px", border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.06)" }}>
                        <Cpu size={14} style={{ color: "rgba(255,255,255,0.15)" }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{skill.name}</h3>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{skill.category}</span>
                    </div>
                    {skill.featured && <Star size={12} style={{ color: "#fbbf24", flexShrink: 0 }} />}
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>Progress</span>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>{skill.percentage ?? 0}%</span>
                    </div>
                    <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${skill.percentage ?? 0}%`, height: "100%", background: "#fff", borderRadius: "999px", transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
                    <span style={{ padding: "2px 7px", borderRadius: "999px", fontSize: "10px", fontWeight: 600, color: levelColor(skill.level), background: `${levelColor(skill.level)}15`, border: `1px solid ${levelColor(skill.level)}30` }}>
                      {skill.level}
                    </span>
                    {skill.proficiency && (
                      <span style={{ padding: "2px 7px", borderRadius: "999px", fontSize: "10px", fontWeight: 600, color: profColor(skill.proficiency), background: `${profColor(skill.proficiency)}15`, border: `1px solid ${profColor(skill.proficiency)}30` }}>
                        {skill.proficiency}
                      </span>
                    )}
                    {skill.years != null && skill.years > 0 && (
                      <span style={{ padding: "2px 7px", borderRadius: "999px", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        {skill.years}y exp
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "6px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <button
                      onClick={() => openEdit(skill)}
                      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                    >
                      <Pencil size={10} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill)}
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

      {/* ── Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit: ${editing.name}` : "Add Skill"}
        size="md"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

          {/* Name + Level */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Name *</label>
              <input
                placeholder="React"
                style={inp}
                value={form.name ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <div>
              <label style={lbl}>Level</label>
              <select
                style={{ ...inp, cursor: "pointer" }}
                value={form.level ?? "Intermediate"}
                onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l} style={{ background: "#111" }}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={lbl}>Category</label>
            <select
              style={{ ...inp, cursor: "pointer" }}
              value={categorySelect}
              onChange={(e) => {
                const val = e.target.value;
                setCategorySelect(val);
                if (val !== OTHER_VALUE) { setForm((p) => ({ ...p, category: val })); setCustomCategory(""); }
              }}
            >
              {allCategories.map((c) => (
                <option key={c} value={c} style={{ background: "#111" }}>{c}</option>
              ))}
              <option value={OTHER_VALUE} style={{ background: "#111", fontStyle: "italic" }}>+ Add Custom...</option>
            </select>

            {categorySelect === OTHER_VALUE && (
              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <input
                  placeholder="Type new category..."
                  style={{ ...inp, flex: 1 }}
                  value={customCategory}
                  onChange={(e) => { setCustomCategory(e.target.value); setForm((p) => ({ ...p, category: e.target.value })); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomCategory(); } }}
                />
                <button
                  onClick={addCustomCategory}
                  disabled={!customCategory.trim()}
                  style={{ padding: "6px 12px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "11px", fontWeight: 600, cursor: customCategory.trim() ? "pointer" : "not-allowed", opacity: customCategory.trim() ? 1 : 0.4, flexShrink: 0 }}
                >
                  Add
                </button>
              </div>
            )}

            {customCategories.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                {customCategories.map((cat) => (
                  <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px", borderRadius: "999px", fontSize: "10px", background: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
                    {cat}
                    <button onClick={() => removeCustomCategory(cat)} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", padding: 0, display: "flex" }}>
                      <X size={8} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Proficiency */}
          <div>
            <label style={lbl}>Proficiency</label>
            <select
              style={{ ...inp, cursor: "pointer" }}
              value={proficiencySelect}
              onChange={(e) => {
                const val = e.target.value;
                setProficiencySelect(val);
                if (val !== OTHER_VALUE) { setForm((p) => ({ ...p, proficiency: val })); setCustomProficiency(""); }
              }}
            >
              <option value="" style={{ background: "#111" }}>None</option>
              {allProficiencies.map((p) => (
                <option key={p} value={p} style={{ background: "#111" }}>{p}</option>
              ))}
              <option value={OTHER_VALUE} style={{ background: "#111", fontStyle: "italic" }}>+ Add Custom...</option>
            </select>

            {proficiencySelect === OTHER_VALUE && (
              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <input
                  placeholder="Type new proficiency level..."
                  style={{ ...inp, flex: 1 }}
                  value={customProficiency}
                  onChange={(e) => { setCustomProficiency(e.target.value); setForm((p) => ({ ...p, proficiency: e.target.value })); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomProficiency(); } }}
                />
                <button
                  onClick={addCustomProficiency}
                  disabled={!customProficiency.trim()}
                  style={{ padding: "6px 12px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "11px", fontWeight: 600, cursor: customProficiency.trim() ? "pointer" : "not-allowed", opacity: customProficiency.trim() ? 1 : 0.4, flexShrink: 0 }}
                >
                  Add
                </button>
              </div>
            )}

            {customProficiencies.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                {customProficiencies.map((prof) => (
                  <span key={prof} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px", borderRadius: "999px", fontSize: "10px", background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
                    {prof}
                    <button onClick={() => removeCustomProficiency(prof)} style={{ background: "none", border: "none", color: "#a855f7", cursor: "pointer", padding: 0, display: "flex" }}>
                      <X size={8} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Percentage + Years */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={lbl}>Percentage: {form.percentage ?? 50}%</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="range" min="0" max="100" step="5"
                  value={form.percentage ?? 50}
                  onChange={(e) => setForm((p) => ({ ...p, percentage: Number(e.target.value) }))}
                  style={{ flex: 1, accentColor: "#fff", height: "4px", cursor: "pointer" }}
                />
                <div style={{ width: "40px", height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${form.percentage ?? 50}%`, height: "100%", background: "#fff", borderRadius: "999px" }} />
                </div>
              </div>
            </div>
            <div>
              <label style={lbl}>Years</label>
              <input
                type="number" min="0" max="30" placeholder="2"
                style={inp}
                value={form.years ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, years: e.target.value ? Number(e.target.value) : null }))}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
          </div>

          {/* ── Icon — upload OR paste URL ──────────────────────── */}
          <div>
            <label style={lbl}>Icon (optional)</label>

            {/* Upload + URL row */}
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
              {/* Upload button */}
              <label
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            "5px",
                  padding:        "8px 12px",
                  background:     uploading ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.04)",
                  border:         uploading ? "1px solid rgba(96,165,250,0.3)" : "1px solid rgba(255,255,255,0.09)",
                  borderRadius:   "8px",
                  cursor:         uploading ? "not-allowed" : "pointer",
                  flexShrink:     0,
                  transition:     "all 0.15s ease",
                  whiteSpace:     "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)";
                    e.currentTarget.style.background  = "rgba(96,165,250,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.background  = "rgba(255,255,255,0.04)";
                  }
                }}
              >
                {uploading
                  ? <Loader2 size={12} style={{ color: "#60a5fa", animation: "spin 1s linear infinite" }} />
                  : <Upload size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
                }
                <span style={{ fontSize: "11px", color: uploading ? "#60a5fa" : "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                  {uploading ? "Uploading..." : "Upload"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
                  disabled={uploading}
                  onChange={handleIconUpload}
                />
              </label>

              {/* URL input */}
              <input
                placeholder="Or paste URL: https://cdn.simpleicons.org/react"
                style={{ ...inp, flex: 1 }}
                value={form.icon ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                onFocus={focusStyle}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
              />
            </div>

            {/* Preview + clear */}
            {form.icon && (
              <div
                style={{
                  display:       "flex",
                  alignItems:    "center",
                  gap:           "10px",
                  marginTop:     "8px",
                  padding:       "8px 10px",
                  background:    "rgba(255,255,255,0.02)",
                  border:        "1px solid rgba(255,255,255,0.06)",
                  borderRadius:  "8px",
                }}
              >
                <div
                  style={{
                    width:          "32px",
                    height:         "32px",
                    borderRadius:   "6px",
                    background:     "rgba(255,255,255,0.05)",
                    border:         "1px solid rgba(255,255,255,0.08)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                    overflow:       "hidden",
                    padding:        "3px",
                  }}
                >
                  <img
                    src={form.icon}
                    alt="Icon preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).nextElementSibling?.setAttribute("style", "display:flex");
                    }}
                  />
                  <ImageIcon size={14} style={{ color: "rgba(255,255,255,0.2)", display: "none" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                    Icon preview
                  </p>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {form.icon}
                  </p>
                </div>
                <button
                  onClick={() => setForm((p) => ({ ...p, icon: "" }))}
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "6px", color: "#f87171", cursor: "pointer", padding: "4px 8px", fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}
                >
                  <X size={10} /> Clear
                </button>
              </div>
            )}

            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)", margin: "5px 0 0" }}>
              Upload PNG/JPG/SVG/WebP to Cloudinary, or paste any image URL. Leave empty to use auto-detected icon.
            </p>
          </div>

          {/* Featured */}
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              style={{ width: "14px", height: "14px", accentColor: "#fff" }}
            />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Featured</span>
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
              disabled={saving || !form.name}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving || !form.name ? 0.4 : 1 }}
            >
              {saving
                ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                : <Save size={12} />}
              {editing ? "Update" : "Add"}
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
        .skill-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        @media (max-width: 640px) { .skill-grid { grid-template-columns: 1fr; } }
      `}</style>
    </DashboardLayout>
  );
}