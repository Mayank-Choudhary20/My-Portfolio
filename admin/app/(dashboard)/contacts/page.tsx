"use client";

import { useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@/hooks/useApi";
import { contactsApi } from "@/lib/api";
import { exportToCsv, formatDate, formatRelativeTime } from "@/lib/utils";
import { useToastStore } from "@/lib/store";
import { useConfirm } from "@/hooks/useConfirm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Mail,
  Trash2,
  Download,
  Search,
  Circle,
  CheckCircle,
  User,
  Clock,
  ArrowLeft,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactsPage() {
  const fetchContacts = useCallback(() => contactsApi.getAll(), []);
  const { data, loading, refetch } = useQuery<Contact[]>(fetchContacts);
  const { addToast } = useToastStore();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [selected, setSelected] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [showDetail, setShowDetail] = useState(false);

  const items = data || [];
  const unreadCount = items.filter((m) => !m.isRead).length;

  const filtered = items.filter((msg) => {
    const matchSearch =
      !searchQuery ||
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      filterRead === "all" ||
      (filterRead === "unread" && !msg.isRead) ||
      (filterRead === "read" && msg.isRead);
    return matchSearch && matchFilter;
  });

  const handleSelect = async (msg: Contact) => {
    setSelected(msg);
    setShowDetail(true);
    if (!msg.isRead) {
      try {
        await contactsApi.markRead(msg.id);
        refetch();
      } catch {
        // silent
      }
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Message",
      message: "Delete this message? This cannot be undone.",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await contactsApi.delete(id);
      addToast({ type: "success", title: "Message deleted" });
      if (selected?.id === id) {
        setSelected(null);
        setShowDetail(false);
      }
      refetch();
    } catch {
      addToast({ type: "error", title: "Failed to delete" });
    }
  };

  const handleExport = () => {
    exportToCsv(
      items.map((m) => ({
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        isRead: m.isRead,
        date: formatDate(m.createdAt),
      })),
      "contacts"
    );
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "8px 10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "8px", color: "#fff", fontSize: "13px",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
              Inbox
              {unreadCount > 0 && (
                <span style={{ padding: "1px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, background: "#fff", color: "#000" }}>
                  {unreadCount}
                </span>
              )}
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Contact messages from your portfolio</p>
          </div>
          <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>
            <Download size={12} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {[
            { l: "Total", v: items.length },
            { l: "Unread", v: unreadCount },
            { l: "Read", v: items.length - unreadCount },
          ].map((x) => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 14px", flex: 1, minWidth: "80px" }}>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{x.l}</p>
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{x.v}</p>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
            <Search size={12} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)", pointerEvents: "none" }} />
            <input
              placeholder="Search by name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inp, paddingLeft: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
            />
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {(["all", "unread", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterRead(f)}
                style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: filterRead === f ? "#fff" : "rgba(255,255,255,0.03)", color: filterRead === f ? "#000" : "rgba(255,255,255,0.4)", borderColor: filterRead === f ? "#fff" : "rgba(255,255,255,0.08)" }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="inbox-layout">
          {/* Message list */}
          <div className={`inbox-list ${showDetail ? "inbox-list-hidden" : ""}`} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton" style={{ height: "72px", borderRadius: 0 }} />
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <Mail size={24} style={{ color: "rgba(255,255,255,0.06)", marginBottom: "8px" }} />
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.15)" }}>
                  {items.length === 0 ? "No messages yet" : "No messages match your search"}
                </p>
              </div>
            )}

            {!loading && filtered.map((msg, idx) => (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg)}
                style={{
                  padding: "12px 14px",
                  cursor: "pointer",
                  borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: selected?.id === msg.id
                    ? "rgba(255,255,255,0.05)"
                    : !msg.isRead
                    ? "rgba(255,255,255,0.02)"
                    : "transparent",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (selected?.id !== msg.id) e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                }}
                onMouseLeave={(e) => {
                  if (selected?.id !== msg.id) e.currentTarget.style.background = !msg.isRead ? "rgba(255,255,255,0.02)" : "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  {/* Unread dot */}
                  <div style={{ marginTop: "4px", flexShrink: 0 }}>
                    {!msg.isRead ? (
                      <Circle size={7} style={{ color: "#fff", fill: "#fff" }} />
                    ) : (
                      <Circle size={7} style={{ color: "rgba(255,255,255,0.1)", fill: "transparent" }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      <p style={{ fontSize: "12px", fontWeight: msg.isRead ? 500 : 700, color: msg.isRead ? "rgba(255,255,255,0.6)" : "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                        {msg.name}
                      </p>
                      <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)", flexShrink: 0, whiteSpace: "nowrap" }}>
                        {formatRelativeTime(msg.createdAt)}
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                      {msg.subject}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message detail */}
          <div className={`inbox-detail ${!showDetail ? "inbox-detail-hidden" : ""}`} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
            {!selected ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "300px", padding: "40px" }}>
                <Mail size={28} style={{ color: "rgba(255,255,255,0.06)", marginBottom: "10px" }} />
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.15)", textAlign: "center" }}>
                  Select a message to read
                </p>
              </div>
            ) : (
              <div style={{ padding: "16px", height: "100%" }}>
                {/* Mobile back button */}
                <button
                  onClick={() => setShowDetail(false)}
                  className="inbox-back-btn"
                  style={{ display: "none", alignItems: "center", gap: "5px", padding: "5px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", color: "rgba(255,255,255,0.5)", fontSize: "11px", cursor: "pointer", marginBottom: "14px" }}
                >
                  <ArrowLeft size={11} /> Back to inbox
                </button>

                {/* Subject */}
                <h2 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 12px", lineHeight: "1.4" }}>{selected.subject}</h2>

                {/* Sender info */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "14px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={13} style={{ color: "rgba(255,255,255,0.35)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, margin: 0, color: "#fff" }}>{selected.name}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{selected.email}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
                    <Clock size={10} />
                    {formatDate(selected.createdAt)}
                  </div>
                </div>

                {/* Message body */}
                <div style={{ padding: "12px", background: "rgba(255,255,255,0.01)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)", marginBottom: "14px", minHeight: "100px" }}>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.7", whiteSpace: "pre-line", margin: 0 }}>
                    {selected.message}
                  </p>
                </div>

                {/* Status + actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: selected.isRead ? "#4ade80" : "rgba(255,255,255,0.25)" }}>
                    <CheckCircle size={11} />
                    {selected.isRead ? "Read" : "Unread"}
                  </div>
                  <div style={{ flex: 1 }} />
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", fontSize: "11px", textDecoration: "none" }}
                  >
                    <Mail size={11} /> Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "rgba(239,68,68,0.05)", color: "#f87171", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "8px", fontSize: "11px", cursor: "pointer" }}
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} variant={confirmState.variant} onConfirm={handleConfirm} onCancel={handleCancel} />

      <style>{`
        .inbox-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 10px;
          min-height: 500px;
        }
        .inbox-list { overflow-y: auto; max-height: 600px; }
        .inbox-detail { overflow-y: auto; max-height: 600px; }

        @media (max-width: 768px) {
          .inbox-layout { grid-template-columns: 1fr; }
          .inbox-list-hidden { display: none; }
          .inbox-detail-hidden { display: none; }
          .inbox-back-btn { display: flex !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}