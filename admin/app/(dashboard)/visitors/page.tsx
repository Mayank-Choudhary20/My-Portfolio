"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@/hooks/useApi";
import { visitorsApi } from "@/lib/api";
import {
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  Eye,
  Network,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Users,
  Activity,
  TrendingUp,
  BarChart3,
  Percent,
  Map,
} from "lucide-react";
import type { Visitor, VisitorStats } from "@/types";

export default function VisitorsPage() {
  const { data: stats, loading: statsLoading } = useQuery(() => visitorsApi.getStats());
  const { data: visitors, loading: visitorsLoading } = useQuery(() => visitorsApi.getAll());

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"table" | "insights">("table");
  const perPage = 12;

  const loading = statsLoading || visitorsLoading;
  const allVisitors = (visitors ?? []) as Visitor[];
  const statsData = stats as VisitorStats | null;

  const totalPages = Math.max(1, Math.ceil(allVisitors.length / perPage));
  const paginated = allVisitors.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      return `${day}-${month}-${year} ${hh}:${mm}:${ss}`;
    } catch {
      return dateStr;
    }
  };

  const getDeviceIcon = (device?: string | null) => {
    const d = (device ?? "").toLowerCase();
    if (d.includes("mobile") || d.includes("phone")) return Smartphone;
    if (d.includes("tablet")) return Tablet;
    return Monitor;
  };

  const getTimeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      if (isNaN(diff)) return "";
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 30) return `${days}d ago`;
      return `${Math.floor(days / 30)}mo ago`;
    } catch {
      return "";
    }
  };

  const getTimeBadgeColor = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const hrs = diff / 3600000;
      if (hrs < 1) return { bg: "rgba(34,197,94,0.12)", color: "#4ade80", border: "rgba(34,197,94,0.2)" };
      if (hrs < 24) return { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "rgba(59,130,246,0.2)" };
      if (hrs < 168) return { bg: "rgba(168,85,247,0.12)", color: "#c084fc", border: "rgba(168,85,247,0.2)" };
      return { bg: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "rgba(255,255,255,0.08)" };
    } catch {
      return { bg: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "rgba(255,255,255,0.08)" };
    }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "16px",
  };

  const cardNoPad: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "0",
    overflow: "hidden",
  };

  const lbl: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: 0,
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="skeleton" style={{ height: "24px", width: "160px", borderRadius: "6px", marginBottom: "16px" }} />
          <div style={{ display: "grid", gap: "10px", marginBottom: "10px" }} className="visitors-stat-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "88px", borderRadius: "12px" }} />
            ))}
          </div>
          <div className="skeleton" style={{ height: "48px", borderRadius: "12px", marginBottom: "10px" }} />
          <div className="skeleton" style={{ height: "400px", borderRadius: "12px" }} />
        </div>
      </DashboardLayout>
    );
  }

  // ── Insights bar helper ───────────────────────────────────────────────────
  const InsightBar = ({
    label,
    count,
    max,
    color,
  }: {
    label: string;
    count: number;
    max: number;
    color: string;
  }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
      <span
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.6)",
          width: "80px",
          flexShrink: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.04)", borderRadius: "3px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${max > 0 ? (count / max) * 100 : 0}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: "3px",
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)", width: "30px", textAlign: "right", flexShrink: 0 }}>
        {count}
      </span>
    </div>
  );

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "16px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Visitor Analytics</h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
            Track who&apos;s visiting your portfolio
          </p>
        </div>

        {/* ── Stats row ───────────────────────────────────────────────── */}
        <div style={{ display: "grid", gap: "10px", marginBottom: "10px" }} className="visitors-stat-grid">
          {[
            { icon: Users, label: "Total", value: statsData?.totalVisitors ?? allVisitors.length, color: "#a78bfa", gradient: "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(167,139,250,0.03))" },
            { icon: Activity, label: "Today", value: statsData?.todayVisitors ?? 0, color: "#4ade80", gradient: "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(74,222,128,0.03))" },
            { icon: TrendingUp, label: "This Week", value: statsData?.thisWeekVisitors ?? 0, color: "#60a5fa", gradient: "linear-gradient(135deg, rgba(96,165,250,0.12), rgba(96,165,250,0.03))" },
            { icon: Percent, label: "Returning", value: `${statsData?.returningPercentage ?? 0}%`, color: "#f472b6", gradient: "linear-gradient(135deg, rgba(244,114,182,0.12), rgba(244,114,182,0.03))" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: s.gradient,
                border: `1px solid ${s.color}18`,
                borderRadius: "12px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${s.color}35`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${s.color}18`; }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: `${s.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <div>
                <p style={{ ...lbl, color: `${s.color}99` }}>{s.label}</p>
                <p style={{ fontSize: "22px", fontWeight: 700, margin: "2px 0 0", color: "#fff" }}>
                  {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div
          style={{
            ...card,
            padding: "4px",
            marginBottom: "10px",
            display: "flex",
            gap: "2px",
          }}
        >
          {[
            { key: "table" as const, label: "Visitor Log", icon: Eye },
            { key: "insights" as const, label: "Insights", icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: "11px",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                background: activeTab === tab.key ? "#fff" : "transparent",
                color: activeTab === tab.key ? "#000" : "rgba(255,255,255,0.3)",
              }}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Insights view ───────────────────────────────────────────── */}
        {activeTab === "insights" && (
          <div style={{ display: "grid", gap: "10px" }} className="insights-grid">
            {/* Top Countries */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                <Globe size={13} style={{ color: "#60a5fa" }} />
                <h3 style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: "rgba(255,255,255,0.7)" }}>Top Countries</h3>
              </div>
              {(statsData?.topCountries ?? []).length === 0 ? (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>No data yet</p>
              ) : (
                (statsData?.topCountries ?? []).map((c) => (
                  <InsightBar
                    key={c.country}
                    label={c.country}
                    count={c.count}
                    max={statsData?.topCountries?.[0]?.count ?? 1}
                    color="#60a5fa"
                  />
                ))
              )}
            </div>

            {/* Top Cities */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                <Map size={13} style={{ color: "#a78bfa" }} />
                <h3 style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: "rgba(255,255,255,0.7)" }}>Top Cities</h3>
              </div>
              {(statsData?.topCities ?? []).length === 0 ? (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>No data yet</p>
              ) : (
                (statsData?.topCities ?? []).map((c) => (
                  <InsightBar
                    key={c.city}
                    label={c.city}
                    count={c.count}
                    max={statsData?.topCities?.[0]?.count ?? 1}
                    color="#a78bfa"
                  />
                ))
              )}
            </div>

            {/* Top Browsers */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                <Eye size={13} style={{ color: "#4ade80" }} />
                <h3 style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: "rgba(255,255,255,0.7)" }}>Top Browsers</h3>
              </div>
              {(statsData?.topBrowsers ?? []).length === 0 ? (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>No data yet</p>
              ) : (
                (statsData?.topBrowsers ?? []).map((b) => (
                  <InsightBar
                    key={b.browser}
                    label={b.browser}
                    count={b.count}
                    max={statsData?.topBrowsers?.[0]?.count ?? 1}
                    color="#4ade80"
                  />
                ))
              )}
            </div>

            {/* Top Devices */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                <Monitor size={13} style={{ color: "#f472b6" }} />
                <h3 style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: "rgba(255,255,255,0.7)" }}>Top Devices</h3>
              </div>
              {(statsData?.topDevices ?? []).length === 0 ? (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>No data yet</p>
              ) : (
                (statsData?.topDevices ?? []).map((d) => (
                  <InsightBar
                    key={d.device}
                    label={d.device}
                    count={d.count}
                    max={statsData?.topDevices?.[0]?.count ?? 1}
                    color="#f472b6"
                  />
                ))
              )}
            </div>

            {/* Top OS */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                <Laptop size={13} style={{ color: "#fbbf24" }} />
                <h3 style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: "rgba(255,255,255,0.7)" }}>Operating Systems</h3>
              </div>
              {(statsData?.topOs ?? []).length === 0 ? (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>No data yet</p>
              ) : (
                (statsData?.topOs ?? []).map((o) => (
                  <InsightBar
                    key={o.os}
                    label={o.os}
                    count={o.count}
                    max={statsData?.topOs?.[0]?.count ?? 1}
                    color="#fbbf24"
                  />
                ))
              )}
            </div>

            {/* Quick summary */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                <BarChart3 size={13} style={{ color: "#60a5fa" }} />
                <h3 style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: "rgba(255,255,255,0.7)" }}>Summary</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Countries", value: statsData?.countries ?? 0, color: "#60a5fa" },
                  { label: "Cities", value: statsData?.cities ?? 0, color: "#a78bfa" },
                  { label: "Returning", value: `${statsData?.returningPercentage ?? 0}%`, color: "#f472b6" },
                  { label: "Total Logs", value: allVisitors.length, color: "#4ade80" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      padding: "10px",
                      background: `${s.color}08`,
                      border: `1px solid ${s.color}12`,
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: s.color }}>
                      {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
                    </p>
                    <p style={{ fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "2px 0 0" }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Table view ──────────────────────────────────────────────── */}
        {activeTab === "table" && (
          <>
            {/* Desktop table */}
            <div className="visitors-desktop-table">
              <div style={cardNoPad}>
                {/* Header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.3fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1.2fr",
                    gap: "8px",
                    padding: "10px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {["IP Address", "Country", "City", "Device", "Browser", "OS", "Visited At"].map((h) => (
                    <p key={h} style={{ ...lbl, margin: 0 }}>{h}</p>
                  ))}
                </div>

                {paginated.length === 0 ? (
                  <div style={{ padding: "50px 16px", textAlign: "center" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(167,139,250,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Eye size={20} style={{ color: "rgba(167,139,250,0.4)" }} />
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: "0 0 4px", fontWeight: 600 }}>No visitors yet</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", margin: 0 }}>Visitors will appear here once someone views your portfolio</p>
                  </div>
                ) : (
                  paginated.map((v, idx) => {
                    const DeviceIcon = getDeviceIcon(v.device);
                    const isLast = idx === paginated.length - 1;
                    const timeBadge = getTimeBadgeColor(v.visitedAt);

                    return (
                      <div
                        key={v.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.3fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1.2fr",
                          gap: "8px",
                          padding: "10px 16px",
                          borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.03)",
                          alignItems: "center",
                          transition: "background 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        {/* IP */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Network size={11} style={{ color: "#a78bfa" }} />
                          </div>
                          <span style={{ fontSize: "12px", fontFamily: "monospace", color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                            {v.ip || "—"}
                          </span>
                        </div>

                        {/* Country */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                          <Globe size={11} style={{ color: "#60a5fa", flexShrink: 0 }} />
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.country || "—"}
                          </span>
                        </div>

                        {/* City */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                          <MapPin size={11} style={{ color: "#a78bfa", flexShrink: 0 }} />
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.city || "—"}
                          </span>
                        </div>

                        {/* Device */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                          <DeviceIcon size={11} style={{ color: "#f472b6", flexShrink: 0 }} />
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.device || "—"}
                          </span>
                        </div>

                        {/* Browser */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                          <Eye size={11} style={{ color: "#4ade80", flexShrink: 0 }} />
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.browser || "—"}
                          </span>
                        </div>

                        {/* OS */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                          <Laptop size={11} style={{ color: "#fbbf24", flexShrink: 0 }} />
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.os || "—"}
                          </span>
                        </div>

                        {/* visitedAt */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ fontSize: "11px", fontFamily: "monospace", color: "rgba(255,255,255,0.55)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {formatDateTime(v.visitedAt)}
                            </p>
                          </div>
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: 600,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: timeBadge.bg,
                              color: timeBadge.color,
                              border: `1px solid ${timeBadge.border}`,
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}
                          >
                            {getTimeAgo(v.visitedAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Pagination */}
                {allVisitors.length > perPage && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
                      Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, allVisitors.length)} of {allVisitors.length}
                    </p>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: currentPage === 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)", cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <ChevronLeft size={13} />
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page: number;
                        if (totalPages <= 5) page = i + 1;
                        else if (currentPage <= 3) page = i + 1;
                        else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                        else page = currentPage - 2 + i;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{ width: "28px", height: "28px", borderRadius: "6px", border: currentPage === page ? "none" : "1px solid rgba(255,255,255,0.06)", background: currentPage === page ? "#fff" : "rgba(255,255,255,0.02)", color: currentPage === page ? "#000" : "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "11px", fontWeight: currentPage === page ? 700 : 500, display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: currentPage === totalPages ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)", cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile cards */}
            <div className="visitors-mobile-list">
              {paginated.length === 0 ? (
                <div style={{ ...card, textAlign: "center", padding: "40px 16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(167,139,250,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Eye size={20} style={{ color: "rgba(167,139,250,0.4)" }} />
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: "0 0 4px", fontWeight: 600 }}>No visitors yet</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", margin: 0 }}>Visitors will appear once someone views your portfolio</p>
                </div>
              ) : (
                paginated.map((v, idx) => {
                  const DeviceIcon = getDeviceIcon(v.device);
                  const timeBadge = getTimeBadgeColor(v.visitedAt);
                  return (
                    <div
                      key={v.id}
                      style={{
                        ...card,
                        marginBottom: idx === paginated.length - 1 ? "0" : "6px",
                        border: `1px solid rgba(255,255,255,0.06)`,
                      }}
                    >
                      {/* Header: IP + time badge */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Network size={11} style={{ color: "#a78bfa" }} />
                          </div>
                          <span style={{ fontSize: "12px", fontWeight: 600, fontFamily: "monospace", color: "#fff" }}>
                            {v.ip || "Unknown"}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: timeBadge.bg,
                            color: timeBadge.color,
                            border: `1px solid ${timeBadge.border}`,
                          }}
                        >
                          {getTimeAgo(v.visitedAt)}
                        </span>
                      </div>

                      {/* Detail grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {[
                          { icon: Globe, label: "Country", value: v.country || "—", color: "#60a5fa" },
                          { icon: MapPin, label: "City", value: v.city || "—", color: "#a78bfa" },
                          { icon: DeviceIcon, label: "Device", value: v.device || "—", color: "#f472b6" },
                          { icon: Eye, label: "Browser", value: v.browser || "—", color: "#4ade80" },
                          { icon: Laptop, label: "OS", value: v.os || "—", color: "#fbbf24" },
                        ].map((item) => (
                          <div key={item.label}>
                            <p style={{ ...lbl, marginBottom: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                              <item.icon size={9} style={{ color: item.color }} />
                              {item.label}
                            </p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Timestamp */}
                      <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "5px" }}>
                        <Clock size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", margin: 0, fontFamily: "monospace" }}>
                          {formatDateTime(v.visitedAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Mobile pagination */}
              {allVisitors.length > perPage && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
                    {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, allVisitors.length)} of {allVisitors.length}
                  </p>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: currentPage === 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)", cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", padding: "0 6px" }}>
                      {currentPage}/{totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: currentPage === totalPages ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)", cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        .visitors-stat-grid { grid-template-columns: 1fr 1fr; }
        .insights-grid { grid-template-columns: 1fr; }

        @media (min-width: 640px) {
          .visitors-stat-grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
          .insights-grid { grid-template-columns: 1fr 1fr; }
        }

        .visitors-desktop-table { display: block; }
        .visitors-mobile-list { display: none; }

        @media (max-width: 768px) {
          .visitors-desktop-table { display: none; }
          .visitors-mobile-list { display: block; }
        }
      `}</style>
    </DashboardLayout>
  );
}