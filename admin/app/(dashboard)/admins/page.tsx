"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { adminApi } from "@/lib/api";
import { useQuery, useApi } from "@/hooks/useApi";
import { useConfirm } from "@/hooks/useConfirm";
import { useAuthStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import {
  Plus,
  Trash2,
  ShieldCheck,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  Save,
  KeyRound,
} from "lucide-react";
import type { Admin } from "@/types";

export default function AdminsPage() {
  const { admin: currentAdmin } = useAuthStore();
  const { data, loading, refetch } = useQuery(() => adminApi.getAll());
  const { execute: createAdmin, loading: creating } = useApi(adminApi.create, {
    successMessage: "Admin created",
  });
  const { execute: deleteAdmin } = useApi(adminApi.delete, {
    successMessage: "Admin removed",
  });
  const { execute: changePassword, loading: changingPwd } = useApi(
    adminApi.changePassword,
    { successMessage: "Password changed successfully" }
  );

  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [createOpen, setCreateOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [updatedPwd, setUpdatedPwd] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showUpdatedPwd, setShowUpdatedPwd] = useState(false);

  const handleCreate = async () => {
    if (!newEmail || !newPassword) return;
    await createAdmin({ email: newEmail, password: newPassword });
    setCreateOpen(false);
    setNewEmail("");
    setNewPassword("");
    refetch();
  };

  const handleDelete = async (admin: Admin) => {
    if (admin.id === currentAdmin?.id) return;
    const ok = await confirm({
      title: "Remove Administrator",
      message: `Remove ${admin.email} from admin access? This is irreversible.`,
      variant: "danger",
    });
    if (!ok) return;
    await deleteAdmin(admin.id);
    refetch();
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !updatedPwd) return;
    await changePassword({
      currentPassword: currentPwd,
      newPassword: updatedPwd,
    });
    setPwdOpen(false);
    setCurrentPwd("");
    setUpdatedPwd("");
  };

  // ── Shared styles (matching profile page) ─────────────────────────────────
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

  const inpWithRight: React.CSSProperties = {
    ...inp,
    paddingRight: "36px",
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

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "0",
  };

  const cardPadded: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "16px",
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.25)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.09)";
  };

  const getStrengthColor = (len: number): string => {
    if (len >= 12) return "#22c55e";
    if (len >= 8) return "#f59e0b";
    return "#ef4444";
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            className="skeleton"
            style={{ height: "24px", width: "160px", borderRadius: "6px", marginBottom: "20px" }}
          />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: "64px",
                borderRadius: i === 0 ? "12px 12px 0 0" : i === 2 ? "0 0 12px 12px" : "0",
                marginBottom: "1px",
              }}
            />
          ))}
          <div
            className="skeleton"
            style={{ height: "60px", borderRadius: "12px", marginTop: "10px" }}
          />
        </div>
      </DashboardLayout>
    );
  }

  const admins = (data ?? []) as Admin[];

  return (
    <DashboardLayout>
      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Administrators</h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
              Manage admin accounts & access
            </p>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              onClick={() => setPwdOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              }}
            >
              <KeyRound size={13} />
              Password
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                background: "#fff",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={13} />
              Add Admin
            </button>
          </div>
        </div>

        {/* ── Admin list ──────────────────────────────────────────────── */}
        <div style={card}>
          {admins.length === 0 ? (
            <div
              style={{
                padding: "32px",
                textAlign: "center",
                color: "rgba(255,255,255,0.2)",
                fontSize: "13px",
              }}
            >
              No administrators found.
            </div>
          ) : (
            admins.map((admin, idx) => {
              const isCurrent = admin.id === currentAdmin?.id;
              const isLast = idx === admins.length - 1;

              return (
                <div
                  key={admin.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                    transition: "background 0.15s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ShieldCheck size={14} style={{ color: "rgba(255,255,255,0.25)" }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#fff",
                        }}
                      >
                        <Mail size={11} style={{ color: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {admin.email}
                        </span>
                      </p>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            color: "#22c55e",
                            background: "rgba(34,197,94,0.1)",
                            border: "1px solid rgba(34,197,94,0.15)",
                            padding: "1px 6px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            flexShrink: 0,
                          }}
                        >
                          You
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.2)",
                        margin: "3px 0 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <Calendar size={9} />
                      Joined {formatDate(admin.createdAt)}
                    </p>
                  </div>

                  {/* Delete button */}
                  {!isCurrent && (
                    <button
                      onClick={() => handleDelete(admin)}
                      style={{
                        padding: "6px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "6px",
                        color: "rgba(255,255,255,0.15)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ef4444";
                        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.15)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Security notice ─────────────────────────────────────────── */}
        <div
          style={{
            ...cardPadded,
            marginTop: "10px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <ShieldCheck
            size={14}
            style={{ color: "rgba(255,255,255,0.2)", marginTop: "1px", flexShrink: 0 }}
          />
          <p
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Admin accounts have full access to all content. Passwords are hashed
            and never stored in plain text. Use strong, unique passwords for each
            account.
          </p>
        </div>
      </div>

      {/* ── Create Admin Modal ────────────────────────────────────────── */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Administrator"
        description="The new admin will have full access to this dashboard."
        size="sm"
      >
        <div style={{ display: "grid", gap: "12px" }}>
          <div>
            <label style={lbl}>Email Address *</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={inp}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          <div>
            <label style={lbl}>Password *</label>
            <div style={{ position: "relative" }}>
              <input
                type={showNewPwd ? "text" : "password"}
                placeholder="Min 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inpWithRight}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <button
                type="button"
                onClick={() => setShowNewPwd((p) => !p)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  padding: "2px",
                }}
              >
                {showNewPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {/* Strength bars */}
            {newPassword && (
              <div style={{ display: "flex", gap: "3px", marginTop: "6px" }}>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: "3px",
                      flex: 1,
                      borderRadius: "2px",
                      background:
                        newPassword.length > i * 3
                          ? getStrengthColor(newPassword.length)
                          : "rgba(255,255,255,0.06)",
                      transition: "background 0.2s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              paddingTop: "4px",
            }}
          >
            <button
              onClick={() => setCreateOpen(false)}
              style={{
                padding: "7px 14px",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !newEmail || newPassword.length < 8}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                background: "#fff",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: creating || !newEmail || newPassword.length < 8 ? "not-allowed" : "pointer",
                opacity: creating || !newEmail || newPassword.length < 8 ? 0.4 : 1,
              }}
            >
              {creating ? (
                <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Save size={13} />
              )}
              Create Admin
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Change Password Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={pwdOpen}
        onClose={() => setPwdOpen(false)}
        title="Change Password"
        description="Enter your current password and choose a new one."
        size="sm"
      >
        <div style={{ display: "grid", gap: "12px" }}>
          <div>
            <label style={lbl}>Current Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrentPwd ? "text" : "password"}
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="••••••••"
                style={inpWithRight}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPwd((p) => !p)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  padding: "2px",
                }}
              >
                {showCurrentPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label style={lbl}>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showUpdatedPwd ? "text" : "password"}
                placeholder="Min 8 characters"
                value={updatedPwd}
                onChange={(e) => setUpdatedPwd(e.target.value)}
                style={inpWithRight}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <button
                type="button"
                onClick={() => setShowUpdatedPwd((p) => !p)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  padding: "2px",
                }}
              >
                {showUpdatedPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {/* Strength bars */}
            {updatedPwd && (
              <div style={{ display: "flex", gap: "3px", marginTop: "6px" }}>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: "3px",
                      flex: 1,
                      borderRadius: "2px",
                      background:
                        updatedPwd.length > i * 3
                          ? getStrengthColor(updatedPwd.length)
                          : "rgba(255,255,255,0.06)",
                      transition: "background 0.2s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              paddingTop: "4px",
            }}
          >
            <button
              onClick={() => setPwdOpen(false)}
              style={{
                padding: "7px 14px",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              disabled={changingPwd || !currentPwd || updatedPwd.length < 8}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                background: "#fff",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor:
                  changingPwd || !currentPwd || updatedPwd.length < 8
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  changingPwd || !currentPwd || updatedPwd.length < 8 ? 0.4 : 1,
              }}
            >
              {changingPwd ? (
                <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <KeyRound size={13} />
              )}
              Change Password
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
      `}</style>
    </DashboardLayout>
  );
}