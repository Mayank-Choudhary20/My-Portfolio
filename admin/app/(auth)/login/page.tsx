"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Loader2, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore, useAuthHydrated } from "@/lib/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── Floating Particles ─────────────────────────────────────────────────────
function Particles() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number }[]
  >([]);

  useEffect(() => {
    const items = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.3 + 0.05,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="login-particles">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="login-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 15, -15, 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Glowing Orbs Background ─────────────────────────────────────────────────
function GlowingOrbs() {
  return (
    <div className="login-orbs">
      <motion.div
        className="login-orb login-orb-1"
        animate={{
          x: [0, 50, -30, 40, 0],
          y: [0, -40, 30, -20, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="login-orb login-orb-2"
        animate={{
          x: [0, -40, 20, -50, 0],
          y: [0, 30, -40, 20, 0],
          scale: [1, 0.9, 1.15, 0.95, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="login-orb login-orb-3"
        animate={{
          x: [0, 30, -20, 40, 0],
          y: [0, -20, 40, -30, 0],
          scale: [1, 1.1, 0.85, 1.05, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Main Login Page ─────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!email || !password) {
        setError("Please enter your email and password.");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Login failed");
        if (!data.access_token) throw new Error("No token received");

        setSuccess(true);
        login(data.access_token, data.admin);

        setTimeout(() => {
          router.push("/dashboard");
        }, 600);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, router]
  );

  // Spinner states
  if (!hydrated || isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-spinner">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={24} style={{ color: "rgba(255,255,255,0.5)" }} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <GlowingOrbs />
      <Particles />

      {/* Grid overlay */}
      <div className="login-grid" />

      {/* Main card */}
      <motion.div
        className="login-wrapper"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo + Title */}
        <motion.div
          className="login-header"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <motion.div
            className="login-logo"
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="login-logo-inner">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            <div className="login-logo-ring" />
          </motion.div>

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your admin dashboard</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Success overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="login-success-overlay"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="login-success-icon"
                >
                  <Sparkles size={28} />
                </motion.div>
                <p>Signing you in...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="login-error"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="login-error-inner">
                    <div className="login-error-dot" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="login-field-group">
              <label className="login-label">Email Address</label>
              <motion.div
                className={`login-input-wrap ${focusedField === "email" ? "focused" : ""}`}
                animate={{
                  borderColor:
                    focusedField === "email"
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(255,255,255,0.08)",
                }}
                transition={{ duration: 0.2 }}
              >
                <Mail
                  size={16}
                  className="login-input-icon"
                  style={{
                    color:
                      focusedField === "email"
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(255,255,255,0.2)",
                    transition: "color 0.2s",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={loading || success}
                  className="login-input"
                />
              </motion.div>
            </div>

            {/* Password */}
            <div className="login-field-group">
              <label className="login-label">Password</label>
              <motion.div
                className={`login-input-wrap ${focusedField === "password" ? "focused" : ""}`}
                animate={{
                  borderColor:
                    focusedField === "password"
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(255,255,255,0.08)",
                }}
                transition={{ duration: 0.2 }}
              >
                <Lock
                  size={16}
                  className="login-input-icon"
                  style={{
                    color:
                      focusedField === "password"
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(255,255,255,0.2)",
                    transition: "color 0.2s",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading || success}
                  className="login-input"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="login-eye-btn"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </motion.div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || success}
              className="login-submit"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <motion.div
                  className="login-submit-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 size={18} className="login-spin" />
                  <span>Signing in...</span>
                </motion.div>
              ) : (
                <motion.div
                  className="login-submit-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </motion.div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="login-footer-dot" />
          <span>Secure Admin Portal</span>
          <span className="login-footer-sep">·</span>
          <span className="login-footer-url">{API_URL.replace(/^https?:\/\//, "")}</span>
        </motion.div>
      </motion.div>

      {/* ─── STYLES ──────────────────────────────────────────────────────── */}
      <style>{`
        /* ── Page ── */
        .login-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          position: relative;
          overflow: hidden;
          font-family: var(--font-geist-sans), -apple-system, sans-serif;
        }

        .login-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Grid ── */
        .login-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
        }

        /* ── Particles ── */
        .login-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .login-particle {
          position: absolute;
          border-radius: 50%;
          background: white;
        }

        /* ── Orbs ── */
        .login-orbs {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        .login-orb-1 {
          width: 350px;
          height: 350px;
          top: -10%;
          right: -5%;
          background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%);
        }
        .login-orb-2 {
          width: 300px;
          height: 300px;
          bottom: -8%;
          left: -5%;
          background: radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%);
        }
        .login-orb-3 {
          width: 250px;
          height: 250px;
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%);
        }

        /* ── Wrapper ── */
        .login-wrapper {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 10;
        }

        /* ── Header ── */
        .login-header {
          text-align: center;
          margin-bottom: 28px;
        }

        /* ── Logo ── */
        .login-logo {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .login-logo-inner {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          position: relative;
          z-index: 2;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.1),
            0 8px 32px rgba(0,0,0,0.4),
            0 0 60px rgba(255,255,255,0.05);
        }
        .login-logo-ring {
          position: absolute;
          inset: -6px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          z-index: 1;
          animation: login-ring-pulse 3s ease-in-out infinite;
        }
        @keyframes login-ring-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        /* ── Title ── */
        .login-title {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0 0 6px 0;
          color: #fff;
          line-height: 1.2;
        }
        .login-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.3);
          margin: 0;
          font-weight: 400;
        }

        /* ── Card ── */
        .login-card {
          position: relative;
          padding: 28px 24px;
          border-radius: 20px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 4px 24px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.04);
          overflow: hidden;
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }

        /* ── Success Overlay ── */
        .login-success-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          z-index: 20;
          border-radius: 20px;
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          font-weight: 500;
        }
        .login-success-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05));
          border: 1px solid rgba(34,197,94,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4ade80;
        }

        /* ── Form ── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* ── Error ── */
        .login-error {
          overflow: hidden;
        }
        .login-error-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.15);
          font-size: 13px;
          color: #f87171;
          line-height: 1.4;
        }
        .login-error-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f87171;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(248,113,113,0.5);
        }

        /* ── Field ── */
        .login-field-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .login-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── Input Wrapper ── */
        .login-input-wrap {
          display: flex;
          align-items: center;
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .login-input-wrap.focused {
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
        }

        /* ── Input Icon ── */
        .login-input-icon {
          position: absolute;
          left: 14px;
          flex-shrink: 0;
          pointer-events: none;
        }

        /* ── Input ── */
        .login-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14px;
          font-family: inherit;
          line-height: 1.5;
        }
        .login-input::placeholder {
          color: rgba(255,255,255,0.18);
        }
        .login-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── Eye Button ── */
        .login-eye-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.2);
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s, background 0.15s;
        }
        .login-eye-btn:hover {
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.05);
        }

        /* ── Submit ── */
        .login-submit {
          width: 100%;
          padding: 14px 20px;
          margin-top: 4px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(255,255,255,0.08);
        }
        .login-submit:hover:not(:disabled) {
          box-shadow: 0 4px 24px rgba(255,255,255,0.15);
        }
        .login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-submit-text,
        .login-submit-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-spin {
          animation: login-spin-anim 1s linear infinite;
        }
        @keyframes login-spin-anim {
          to { transform: rotate(360deg); }
        }

        /* ── Footer ── */
        .login-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          font-size: 11px;
          color: rgba(255,255,255,0.15);
          flex-wrap: wrap;
        }
        .login-footer-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(34,197,94,0.5);
          box-shadow: 0 0 6px rgba(34,197,94,0.3);
        }
        .login-footer-sep {
          color: rgba(255,255,255,0.08);
        }
        .login-footer-url {
          font-family: var(--font-geist-mono), monospace;
          color: rgba(255,255,255,0.12);
          font-size: 10px;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .login-page {
            padding: 12px;
            align-items: flex-start;
            padding-top: max(60px, 12vh);
          }
          .login-wrapper {
            max-width: 100%;
          }
          .login-title {
            font-size: 22px;
          }
          .login-subtitle {
            font-size: 13px;
          }
          .login-card {
            padding: 22px 18px;
            border-radius: 16px;
          }
          .login-logo-inner {
            width: 48px;
            height: 48px;
            border-radius: 14px;
          }
          .login-logo-inner svg {
            width: 18px;
            height: 18px;
          }
          .login-logo-ring {
            inset: -5px;
            border-radius: 18px;
          }
          .login-header {
            margin-bottom: 22px;
          }
          .login-orb-1 {
            width: 200px;
            height: 200px;
          }
          .login-orb-2 {
            width: 180px;
            height: 180px;
          }
          .login-orb-3 {
            width: 150px;
            height: 150px;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .login-page {
            padding: 20px;
          }
          .login-wrapper {
            max-width: 380px;
          }
        }

        @media (min-width: 769px) {
          .login-wrapper {
            max-width: 400px;
          }
        }

        /* ── Tall screens ── */
        @media (min-height: 800px) {
          .login-page {
            align-items: center;
            padding-top: 16px;
          }
        }

        /* ── Short screens ── */
        @media (max-height: 650px) {
          .login-page {
            align-items: flex-start;
            padding-top: 20px;
          }
          .login-header {
            margin-bottom: 16px;
          }
          .login-logo-inner {
            width: 44px;
            height: 44px;
          }
          .login-logo {
            margin-bottom: 14px;
          }
          .login-title {
            font-size: 20px;
          }
        }

        /* ── Landscape mobile ── */
        @media (max-height: 500px) and (orientation: landscape) {
          .login-page {
            padding: 12px;
            align-items: center;
          }
          .login-header {
            margin-bottom: 12px;
          }
          .login-logo {
            margin-bottom: 10px;
          }
          .login-logo-inner {
            width: 36px;
            height: 36px;
            border-radius: 10px;
          }
          .login-logo-inner svg {
            width: 16px;
            height: 16px;
          }
          .login-title {
            font-size: 18px;
            margin-bottom: 2px;
          }
          .login-subtitle {
            font-size: 11px;
          }
          .login-card {
            padding: 16px;
          }
          .login-form {
            gap: 12px;
          }
          .login-input {
            padding-top: 10px;
            padding-bottom: 10px;
          }
          .login-submit {
            padding: 10px 16px;
          }
          .login-footer {
            margin-top: 14px;
          }
        }

        /* ── Focus visible for accessibility ── */
        .login-input:focus-visible {
          outline: none;
        }
        .login-submit:focus-visible {
          outline: 2px solid rgba(255,255,255,0.5);
          outline-offset: 2px;
        }
        .login-eye-btn:focus-visible {
          outline: 2px solid rgba(255,255,255,0.3);
          outline-offset: 1px;
        }

        /* ── Autofill fix for dark theme ── */
        .login-input:-webkit-autofill,
        .login-input:-webkit-autofill:hover,
        .login-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff;
          -webkit-box-shadow: 0 0 0px 1000px rgba(0,0,0,0.95) inset;
          transition: background-color 5000s ease-in-out 0s;
          caret-color: #fff;
        }
      `}</style>
    </div>
  );
}