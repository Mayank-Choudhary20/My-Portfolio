"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Trash2,
  Download,
  Check,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn, exportToCsv } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];   // ← supports multiple search keys
  searchKey?: keyof T;        // ← kept for backward compat
  onDelete?: (row: T) => void;
  onBulkDelete?: (ids: string[]) => void;
  actions?: (row: T) => React.ReactNode;
  exportFilename?: string;
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchKeys,
  searchKey,
  onDelete,
  onBulkDelete,
  actions,
  exportFilename = "export",
  loading = false,
  emptyMessage = "Nothing here yet",
  emptyDescription = "Create your first entry to get started.",
}: DataTableProps<T>) {
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Combine searchKeys and legacy searchKey into one list
  const effectiveSearchKeys: (keyof T)[] = useMemo(() => {
    const keys = new Set<keyof T>();
    if (searchKey)  keys.add(searchKey);
    if (searchKeys) searchKeys.forEach((k) => keys.add(k));
    return Array.from(keys);
  }, [searchKey, searchKeys]);

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim() || effectiveSearchKeys.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      effectiveSearchKeys.some((key) =>
        String(item[key] ?? "").toLowerCase().includes(q)
      )
    );
  }, [data, search, effectiveSearchKeys]);

  // ── Sort ─────────────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = String((a as Record<string, unknown>)[sortKey as string] ?? "");
      const bv = String((b as Record<string, unknown>)[sortKey as string] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  // ── Paginate ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Sort toggle ───────────────────────────────────────────────────────────
  const toggleSort = (key: keyof T | string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc");  return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortKey(null); setSortDir(null);
  };

  // ── Selection ─────────────────────────────────────────────────────────────
  const allSelected =
    paginated.length > 0 &&
    paginated.every((r) => selected.has(r.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = () => {
    exportToCsv(
      sorted as unknown as Record<string, unknown>[],
      exportFilename
    );
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-3">
          <div className="skeleton h-9 w-64 rounded-full" />
          <div className="skeleton h-9 w-24" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-white/[0.03]">
            <div className="skeleton h-4 w-4 rounded" />
            {columns.map((c) => (
              <div key={String(c.key)} className="skeleton h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">

        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={
              effectiveSearchKeys.length > 0
                ? `Search by ${effectiveSearchKeys.join(", ")}...`
                : "Search..."
            }
            className="admin-input pl-9 pr-8 h-9 text-sm"
          />
          {/* Clear button */}
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              style={{
                position:   "absolute",
                right:      "8px",
                top:        "50%",
                transform:  "translateY(-50%)",
                background: "none",
                border:     "none",
                color:      "rgba(255,255,255,0.3)",
                cursor:     "pointer",
                padding:    "2px",
                display:    "flex",
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Bulk delete */}
          <AnimatePresence>
            {selected.size > 0 && onBulkDelete && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1   }}
                exit={{   opacity: 0, scale: 0.9  }}
                onClick={() => {
                  onBulkDelete(Array.from(selected));
                  setSelected(new Set());
                }}
                className="btn-danger flex items-center gap-2 h-9 px-3 text-sm"
              >
                <Trash2 size={13} />
                Delete ({selected.size})
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={handleExport}
            className="btn-secondary h-9 px-3 flex items-center gap-2 text-sm"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button className="btn-secondary h-9 px-3 flex items-center gap-2 text-sm">
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Search result count */}
      {search && (
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", margin: "-8px 0 0" }}>
          {sorted.length === 0
            ? `No results for "${search}"`
            : `${sorted.length} result${sorted.length !== 1 ? "s" : ""} for "${search}"`
          }
        </p>
      )}

      {/* ── Desktop Table ─────────────────────────────────────────────────── */}
      <div className="hidden lg:block glass-card overflow-hidden">
        {sorted.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/20 text-lg font-semibold">
              {search ? `No results for "${search}"` : emptyMessage}
            </p>
            <p className="text-white/10 text-sm mt-2">
              {search ? "Try a different search term" : emptyDescription}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    {/* Checkbox */}
                    <th className="w-10">
                      <button
                        onClick={toggleAll}
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          allSelected
                            ? "bg-white border-white"
                            : "border-white/20 hover:border-white/40"
                        )}
                      >
                        {allSelected && <Check size={10} className="text-black" />}
                      </button>
                    </th>
                    {columns.map((col) => (
                      <th key={String(col.key)} className={cn(col.className)}>
                        {col.sortable ? (
                          <button
                            onClick={() => toggleSort(col.key)}
                            className="flex items-center gap-1 hover:text-white transition-colors"
                          >
                            {col.label}
                            <span className="flex flex-col">
                              <ChevronUp
                                size={10}
                                className={cn(
                                  sortKey === col.key && sortDir === "asc"
                                    ? "text-white"
                                    : "text-white/20"
                                )}
                              />
                              <ChevronDown
                                size={10}
                                className={cn(
                                  sortKey === col.key && sortDir === "desc"
                                    ? "text-white"
                                    : "text-white/20"
                                )}
                              />
                            </span>
                          </button>
                        ) : (
                          col.label
                        )}
                      </th>
                    ))}
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(selected.has(row.id) && "bg-white/[0.03]")}
                    >
                      <td>
                        <button
                          onClick={() => toggleRow(row.id)}
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            selected.has(row.id)
                              ? "bg-white border-white"
                              : "border-white/20 hover:border-white/40"
                          )}
                        >
                          {selected.has(row.id) && <Check size={10} className="text-black" />}
                        </button>
                      </td>
                      {columns.map((col) => (
                        <td key={String(col.key)} className={col.className}>
                          {col.render
                            ? col.render(row)
                            : String((row as Record<string, unknown>)[col.key as string] ?? "")}
                        </td>
                      ))}
                      <td>
                        <div className="flex justify-end items-center gap-2">
                          {actions && actions(row)}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="p-1.5 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-md transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/20">
                  {sorted.length} results · Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="btn-secondary h-8 px-3 text-xs disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn-secondary h-8 px-3 text-xs disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Mobile Cards ──────────────────────────────────────────────────── */}
      <div className="lg:hidden space-y-3">
        {paginated.length === 0 && (
          <div className="glass-card py-16 text-center">
            <p className="text-white/20 text-sm font-semibold">
              {search ? `No results for "${search}"` : emptyMessage}
            </p>
            <p className="text-white/10 text-xs mt-1">
              {search ? "Try a different search term" : emptyDescription}
            </p>
          </div>
        )}

        {paginated.map((row) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "glass-card p-4 space-y-3 transition-colors",
              selected.has(row.id) && "border-white/20"
            )}
          >
            {/* Mobile select + actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleRow(row.id)}
                className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                  selected.has(row.id) ? "bg-white border-white" : "border-white/20"
                )}
              >
                {selected.has(row.id) && <Check size={11} className="text-black" />}
              </button>

              <div className="flex items-center gap-2">
                {actions && actions(row)}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row)}
                    className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            {columns.map((col) => (
              <div
                key={String(col.key)}
                className="flex justify-between items-start gap-4 text-sm"
              >
                <span className="text-white/30 font-medium shrink-0 text-xs uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-right text-white/70">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key as string] ?? "")}
                </span>
              </div>
            ))}
          </motion.div>
        ))}

        {/* Mobile pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-white/20">
              Page {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary h-8 px-3 text-xs disabled:opacity-30"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary h-8 px-3 text-xs disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}