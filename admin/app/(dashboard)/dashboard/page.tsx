"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users, Briefcase, Cpu, Award, Mail, Brain,
  MousePointer2, TrendingUp, History, ExternalLink,
  GraduationCap, ImageIcon, ArrowUpRight, Zap, Globe,
} from "lucide-react";
import { useQuery } from "@/hooks/useApi";
import { dashboardApi, visitorsApi } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { formatRelativeTime } from "@/lib/utils";
import { useActivityStore } from "@/lib/store";
import Link from "next/link";

function StatCard({
  title, value, icon: Icon, loading, href, accent,
}: {
  title: string; value: number | string; icon: React.ElementType;
  loading?: boolean; href?: string; accent?: string;
}) {
  if (loading) {
    return (
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div className="skeleton" style={{ height: "12px", width: "80px", borderRadius: "4px" }} />
          <div className="skeleton" style={{ height: "32px", width: "32px", borderRadius: "8px" }} />
        </div>
        <div className="skeleton" style={{ height: "30px", width: "60px", borderRadius: "6px" }} />
      </div>
    );
  }

  const inner = (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        padding: "20px",
        cursor: href ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        minHeight: "110px",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      {accent && (
        <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: `radial-gradient(circle at top right, ${accent}12, transparent)`, borderRadius: "0 14px 0 0" }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</span>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={15} style={{ color: accent || "rgba(255,255,255,0.4)" }} />
        </div>
      </div>
      <p style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", margin: 0, lineHeight: 1 }}>{value}</p>
      {href && (
        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "10px", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
          View <ArrowUpRight size={10} />
        </div>
      )}
    </motion.div>
  );

  if (href) return <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>{inner}</Link>;
  return inner;
}

export default function DashboardPage() {
  const statsQ = useCallback(() => dashboardApi.getStats(), []);
  const visitorQ = useCallback(() => visitorsApi.getStats(), []);
  const { data: stats, loading: sL } = useQuery(statsQ);
  const { data: vStats, loading: vL } = useQuery(visitorQ);
  const { activities } = useActivityStore();

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Zap size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
            <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>Dashboard</h1>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Portfolio overview and analytics</p>
        </div>

        {/* Primary Stats */}
        <div style={{ display: "grid", gap: "12px", marginBottom: "14px" }} className="dash-primary">
          <StatCard title="Visitors" value={vStats?.totalVisitors ?? 0} icon={Users} loading={vL} href="/visitors" accent="#22c55e" />
          <StatCard title="Unread" value={stats?.unreadContacts ?? 0} icon={Mail} loading={sL} href="/contacts" accent="#f59e0b" />
          <StatCard title="Projects" value={stats?.totalProjects ?? 0} icon={Briefcase} loading={sL} href="/projects" accent="#3b82f6" />
          <StatCard title="AI Knowledge" value={stats?.totalAiKnowledge ?? 0} icon={Brain} loading={sL} href="/ai" accent="#a855f7" />
        </div>

        {/* Secondary Stats */}
        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }} className="dash-secondary">
          {[
            { label: "Skills", count: stats?.totalSkills, icon: Cpu, href: "/skills" },
            { label: "Experience", count: stats?.totalExperience, icon: TrendingUp, href: "/experience" },
            { label: "Certificates", count: stats?.totalCertificates, icon: Award, href: "/certificates" },
            { label: "Showcase", count: stats?.totalShowcase, icon: ImageIcon, href: "/showcase" },
            { label: "Education", count: stats?.totalEducation, icon: GraduationCap, href: "/education" },
            { label: "Contacts", count: stats?.totalContacts, icon: MousePointer2, href: "/contacts" },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
              <div
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "14px", cursor: "pointer", height: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
                  <item.icon size={11} style={{ color: "rgba(255,255,255,0.2)" }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</span>
                </div>
                {sL ? (
                  <div className="skeleton" style={{ height: "20px", width: "28px", borderRadius: "4px" }} />
                ) : (
                  <p style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>{item.count ?? 0}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Grid */}
        <div style={{ display: "grid", gap: "14px" }} className="dash-bottom">
          {/* Activity */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <History size={13} style={{ color: "rgba(255,255,255,0.25)" }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.35)" }}>Recent Activity</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", overflow: "hidden" }}>
              {activities.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center" }}>
                  <History size={22} style={{ color: "rgba(255,255,255,0.06)", marginBottom: "8px" }} />
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.15)", margin: 0 }}>No activity yet</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.08)", marginTop: "4px" }}>Actions will appear here</p>
                </div>
              ) : (
                activities.slice(0, 8).map((a, idx) => (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderBottom: idx < Math.min(activities.length, 8) - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, background: a.action === "created" ? "#4ade80" : a.action === "updated" ? "#60a5fa" : "#f87171" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "rgba(255,255,255,0.55)" }}>
                        <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{a.action.charAt(0).toUpperCase() + a.action.slice(1)}</span>{" "}
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>{a.resource}:</span>{" "}{a.label}
                      </p>
                    </div>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)", flexShrink: 0 }}>{formatRelativeTime(a.timestamp)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Globe size={13} style={{ color: "rgba(255,255,255,0.25)" }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.35)" }}>Status</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "8px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#4ade80" }}>Portfolio Live</span>
                </div>
                <a href="my-portfolio-admin-uw-e-services.vercel.app" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.2)", display: "flex" }}><ExternalLink size={12} /></a>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.35)" }}>Backend API</span>
                </div>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>https://my-portfolio-backend-jsv6.onrender.com</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "10px" }}>
                <p style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Today</p>
                {[
                  { l: "Visitors", v: vStats?.todayVisitors ?? 0 },
                  { l: "Countries", v: vStats?.countries ?? 0 },
                  { l: "Cities", v: vStats?.cities ?? 0 },
                ].map((r) => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "rgba(255,255,255,0.3)" }}>{r.l}</span>
                    <span style={{ fontWeight: 600 }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "10px" }}>
                <p style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Quick Actions</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {[
                    { label: "Add Project", href: "/projects" },
                    { label: "Add Skill", href: "/skills" },
                    { label: "Messages", href: "/contacts" },
                    { label: "Settings", href: "/settings" },
                  ].map((a) => (
                    <Link key={a.label} href={a.href} style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 500, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}>{a.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dash-primary { grid-template-columns: 1fr 1fr; }
        .dash-secondary { grid-template-columns: repeat(3, 1fr); }
        .dash-bottom { grid-template-columns: 1fr; }

        @media (min-width: 768px) {
          .dash-primary { grid-template-columns: repeat(4, 1fr); }
          .dash-secondary { grid-template-columns: repeat(6, 1fr); }
          .dash-bottom { grid-template-columns: 1fr 300px; }
        }
      `}</style>
    </DashboardLayout>
  );
}