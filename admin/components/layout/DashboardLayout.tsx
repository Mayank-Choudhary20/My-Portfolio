"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Menu,
  Search,
  Command,
  LayoutDashboard,
  User,
  Briefcase,
  Cpu,
  GraduationCap,
  Award,
  ImageIcon,
  FileText,
  Brain,
  Users,
  Mail,
  Settings,
  ShieldCheck,
  LogOut,
  X,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { useAuthStore, useSidebarStore, useCommandStore } from "@/lib/store";
import { ToastContainer } from "@/components/ui/Toast";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Projects", icon: Briefcase, href: "/projects" },
  { label: "Skills", icon: Cpu, href: "/skills" },
  { label: "Experience", icon: TrendingUp, href: "/experience" },
  { label: "Education", icon: GraduationCap, href: "/education" },
  { label: "Certificates", icon: Award, href: "/certificates" },
  { label: "Showcase", icon: ImageIcon, href: "/showcase" },
  { label: "Resume", icon: FileText, href: "/resume" },
  { label: "AI Knowledge", icon: Brain, href: "/ai" },
  { label: "Visitors", icon: Users, href: "/visitors" },
  { label: "Contacts", icon: Mail, href: "/contacts" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Admins", icon: ShieldCheck, href: "/admins" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, admin, logout } = useAuthStore();
  const sidebarOpen = useSidebarStore((s) => s.isOpen);
  const openSidebar = useSidebarStore((s) => s.open);
  const closeSidebar = useSidebarStore((s) => s.close);
  const toggleSidebar = useSidebarStore((s) => s.toggle);
  const toggleCommand = useCommandStore((s) => s.toggle);

  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);

  // Mount + resize
  useEffect(() => {
    setMounted(true);
    const check = () => setMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auth guard
  useEffect(() => {
    if (mounted && !isAuthenticated) router.push("/login");
  }, [mounted, isAuthenticated, router]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommand();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleCommand]);

  // Loading
  if (!mounted || !isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            border: "2px solid rgba(255,255,255,0.1)",
            borderTopColor: "rgba(255,255,255,0.6)",
            borderRadius: "50%",
            animation: "dspin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes dspin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const currentPage = NAV.find((n) => n.href === pathname)?.label || "";

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      {/* ── Backdrop ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeSidebar}
            style={{
              position: "fixed",
              inset: 0,
              background: mobile
                ? "rgba(0,0,0,0.7)"
                : "rgba(0,0,0,0.35)",
              backdropFilter: "blur(3px)",
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar Drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              width: mobile ? "280px" : "240px",
              background: "#0a0a0a",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              zIndex: 50,
            }}
          >
            {/* Header */}
            <div
              style={{
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 14px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    background: "#fff",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#000", fontWeight: 900, fontSize: "11px" }}>
                    A
                  </span>
                </div>
                <span style={{ fontWeight: 700, fontSize: "13px" }}>Admin</span>
              </div>
              <button
                onClick={closeSidebar}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px 6px",
                display: "flex",
                flexDirection: "column",
                gap: "1px",
              }}
            >
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        background: active ? "#fff" : "transparent",
                        color: active ? "#000" : "rgba(255,255,255,0.35)",
                        transition: "all 0.12s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                        }
                      }}
                    >
                      <item.icon size={15} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "12.5px", fontWeight: active ? 600 : 500 }}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "8px 6px",
                flexShrink: 0,
              }}
            >
              {admin && (
                <div
                  style={{
                    padding: "6px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <User size={10} style={{ color: "rgba(255,255,255,0.4)" }} />
                  </div>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.4)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {admin.email}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  closeSidebar();
                  logout();
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  background: "none",
                  border: "none",
                  color: "#f87171",
                  cursor: "pointer",
                  fontSize: "12.5px",
                  fontWeight: 500,
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main ───────────────────────────────────────────────────── */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header
          style={{
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            position: "sticky",
            top: 0,
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={toggleSidebar}
              style={{
                padding: "6px",
                background: "none",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.45)",
                cursor: "pointer",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Menu size={18} />
            </button>

            <button
              onClick={toggleCommand}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "8px",
                color: "rgba(255,255,255,0.25)",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              <Search size={13} />
              <span className="hide-sm">Search...</span>
              <span
                className="hide-sm"
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  padding: "1px 5px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "4px",
                  color: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                <Command size={9} />K
              </span>
            </button>

            <span
              className="hide-sm"
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.2)",
                fontWeight: 500,
              }}
            >
              {currentPage}
            </span>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 6px rgba(34,197,94,0.4)",
              }}
            />
            <span className="hide-sm">Portfolio</span>
            <ExternalLink size={10} />
          </a>
        </header>

        {/* Content */}
        <main
          style={{
            flex: 1,
            padding: mobile ? "14px" : "20px 24px",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>

      <ToastContainer />

      <style>{`
        @media(max-width:640px){.hide-sm{display:none!important}}
      `}</style>
    </div>
  );
}