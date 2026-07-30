"use client";

import { useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { aiApi } from "@/lib/api";
import { useQuery } from "@/hooks/useApi";
import { useConfirm } from "@/hooks/useConfirm";
import { useActivityStore, useToastStore } from "@/lib/store";
import { exportToCsv, formatRelativeTime } from "@/lib/utils";
import {
  Plus,
  Save,
  Loader2,
  Download,
  Upload,
  Brain,
  Pencil,
  Trash2,
  Search,
  Tag,
} from "lucide-react";

interface AiKnowledge {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
}

const EMPTY: Partial<AiKnowledge> = {
  question: "",
  answer: "",
  category: "",
};

export default function AiPage() {
  const fetchAi = useCallback(() => aiApi.getAll(), []);
  const { data, loading, refetch } = useQuery<AiKnowledge[]>(fetchAi);
  const { addToast } = useToastStore();
  const { addActivity } = useActivityStore();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AiKnowledge | null>(null);
  const [form, setForm] = useState<Partial<AiKnowledge>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [importError, setImportError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const items = data || [];

  // Derived categories
  const categories = Array.from(
    new Set(items.map((d) => d.category).filter(Boolean))
  ) as string[];

  // Filter by search + category
  const filtered = items.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = !selectedCategory || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setModalOpen(true);
  };

  const openEdit = (row: AiKnowledge) => {
    setEditing(row);
    setForm({ question: row.question, answer: row.answer, category: row.category ?? "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.question || !form.answer) {
      addToast({ type: "error", title: "Question and Answer are required" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        question: form.question,
        answer: form.answer,
        category: form.category || null,
      };
      if (editing) {
        await aiApi.update(editing.id, payload);
        addActivity({ action: "updated", resource: "AI Knowledge", label: form.question! });
        addToast({ type: "success", title: "Entry updated" });
      } else {
        await aiApi.create(payload);
        addActivity({ action: "created", resource: "AI Knowledge", label: form.question! });
        addToast({ type: "success", title: "Entry created" });
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      addToast({ type: "error", title: err instanceof Error ? err.message : "Failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: AiKnowledge) => {
    const ok = await confirm({
      title: "Delete Entry",
      message: `Delete this Q&A entry?`,
      variant: "danger",
    });
    if (!ok) return;
    try {
      await aiApi.delete(row.id);
      addActivity({ action: "deleted", resource: "AI Knowledge", label: row.question });
      addToast({ type: "success", title: "Deleted" });
      refetch();
    } catch {
      addToast({ type: "error", title: "Failed to delete" });
    }
  };

  const handleExport = () => {
    exportToCsv(
      items.map((d) => ({ question: d.question, answer: d.answer, category: d.category ?? "" })),
      "ai-knowledge"
    );
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Array<{ question: string; answer: string; category?: string }>;
      if (!Array.isArray(parsed)) throw new Error("File must be a JSON array.");
      for (const item of parsed) {
        await aiApi.create({ question: item.question, answer: item.answer, category: item.category });
      }
      addToast({ type: "success", title: `Imported ${parsed.length} entries` });
      refetch();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed.");
    }
    e.target.value = "";
  };

  // ── Styles ─────────────────────────────────────────────────────────
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
  const ta: React.CSSProperties = {
    ...inp, resize: "vertical", minHeight: "60px",
    lineHeight: "1.5", fontFamily: "inherit",
    display: "block", overflow: "hidden",
  };

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <Brain size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
              AI Knowledge Base
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
              Q&amp;A pairs for the portfolio AI assistant
            </p>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "11px", cursor: "pointer" }}>
              <Upload size={11} /> Import
              <input type="file" hidden accept=".json" onChange={handleImport} />
            </label>
            <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "11px", cursor: "pointer" }}>
              <Download size={11} /> Export
            </button>
            <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> Add Entry
            </button>
          </div>
        </div>

        {/* Import error */}
        {importError && (
          <div style={{ padding: "8px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", color: "#f87171", fontSize: "12px", marginBottom: "12px" }}>
            {importError}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {[
            { l: "Total", v: items.length },
            { l: "Categories", v: categories.length },
            { l: "Filtered", v: filtered.length },
          ].map((x) => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 14px", flex: 1, minWidth: "80px" }}>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{x.l}</p>
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{x.v}</p>
            </div>
          ))}
        </div>

        {/* Category filter tags */}
        {categories.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
            <button
              onClick={() => setSelectedCategory("")}
              style={{ padding: "2px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: !selectedCategory ? "#fff" : "rgba(255,255,255,0.04)", color: !selectedCategory ? "#000" : "rgba(255,255,255,0.4)", borderColor: !selectedCategory ? "#fff" : "rgba(255,255,255,0.08)" }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                style={{ padding: "2px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: selectedCategory === cat ? "#fff" : "rgba(255,255,255,0.04)", color: selectedCategory === cat ? "#000" : "rgba(255,255,255,0.4)", borderColor: selectedCategory === cat ? "#fff" : "rgba(255,255,255,0.08)" }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: "14px", position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)", pointerEvents: "none" }} />
          <input
            placeholder="Search questions, answers, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inp, paddingLeft: "30px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="skeleton" style={{ height: "80px", borderRadius: "10px" }} />))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
            <Brain size={30} style={{ color: "rgba(255,255,255,0.08)", marginBottom: "10px" }} />
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px", marginBottom: "12px" }}>No Q&amp;A entries yet</p>
            <button onClick={openNew} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 16px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> Add First Entry
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && items.length > 0 && filtered.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "30px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>No entries match your search</p>
          </div>
        )}

        {/* Q&A List */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {filtered.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  {/* Question row — clickable to expand */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <Brain size={13} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    <p style={{ flex: 1, fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0, overflow: "hidden", textOverflow: isExpanded ? "unset" : "ellipsis", whiteSpace: isExpanded ? "normal" : "nowrap" }}>
                      {item.question}
                    </p>
                    {item.category && (
                      <span style={{ padding: "2px 7px", borderRadius: "999px", fontSize: "9px", fontWeight: 600, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0, display: "flex", alignItems: "center", gap: "3px" }}>
                        <Tag size={8} />{item.category}
                      </span>
                    )}
                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)", flexShrink: 0, whiteSpace: "nowrap" }}>
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </button>

                  {/* Expanded: Answer + Actions */}
                  {isExpanded && (
                    <div style={{ padding: "0 14px 12px 14px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: "1.6", marginBottom: "10px", paddingTop: "10px", whiteSpace: "pre-wrap" }}>
                        {item.answer}
                      </p>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => { openEdit(item); setExpandedId(null); }}
                          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                        >
                          <Pencil size={10} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                        >
                          <Trash2 size={10} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Entry" : "New AI Entry"} description="Q&A pair for the portfolio AI assistant" size="md">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label style={lbl}>Question *</label>
            <input
              placeholder="What tech stack do you use?"
              style={inp}
              value={form.question ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
            />
          </div>
          <div>
            <label style={lbl}>Answer *</label>
            <textarea
              placeholder="Detailed answer..."
              rows={5}
              style={ta}
              value={form.answer ?? ""}
              onChange={(e) => {
                setForm((p) => ({ ...p, answer: e.target.value }));
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>
          <div>
            <label style={lbl}>Category</label>
            <input
              placeholder="Technical, Personal, Projects..."
              style={inp}
              value={form.category ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              list="ai-cats"
            />
            <datalist id="ai-cats">
              {categories.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "4px" }}>
            <button onClick={() => setModalOpen(false)} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving || !form.question || !form.answer}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving || !form.question || !form.answer ? 0.4 : 1 }}
            >
              {saving ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={12} />}
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} variant={confirmState.variant} onConfirm={handleConfirm} onCancel={handleCancel} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}