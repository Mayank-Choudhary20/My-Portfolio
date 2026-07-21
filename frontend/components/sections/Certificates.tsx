"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ExternalLink,
  Search,
  X,
  Building2,
  Shield,
  Calendar,
  Star,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Certificate } from "@/types/portfolio";

interface CertificatesProps {
  certificates: Certificate[];
}

/* ─── Safe Image ──────────────────────────────────────────── */
function SafeImg({
  src,
  alt,
  className,
  style,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const [err, setErr] = useState(false);
  if (err || !src) return null;
  /* eslint-disable @next/next/no-img-element */
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onClick={onClick}
      onError={() => setErr(true)}
    />
  );
}

/* ─── Fullscreen Lightbox ─────────────────────────────────── */
function Lightbox({
  certificates,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  certificates: Certificate[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const cert = certificates[currentIndex];
  const scrollYRef = useRef(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    /*
      Save scroll position ONCE on mount.
      We use a ref so it doesn't change on re-renders.
    */
    scrollYRef.current = window.scrollY;
    const savedScroll = scrollYRef.current;

    /*
      Lock body scroll by adding overflow hidden
      to BOTH html and body. We do NOT use
      position:fixed because that causes the
      scroll-to-top bug on close.
    */
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      /*
        Restore original styles first, then
        restore scroll position.
      */
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;

      /*
        Use requestAnimationFrame to ensure the browser
        has re-enabled scrolling before we set the position.
        This prevents the scroll-to-top bug.
      */
      requestAnimationFrame(() => {
        window.scrollTo(0, savedScroll);
      });

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!cert) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      onClick={onClose}
    >
      {/* ── Sticky top bar ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#000000",
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: counter */}
        {certificates.length > 1 ? (
          <div
            style={{
              padding: "4px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#94a3b8",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {currentIndex + 1} of {certificates.length}
          </div>
        ) : (
          <div />
        )}

        {/* Right: nav + close */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {certificates.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "#fff";
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "#94a3b8";
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                }}
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "#fff";
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "#94a3b8";
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                }}
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "#fff";
              (e.target as HTMLElement).style.background = "rgba(239,68,68,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "#94a3b8";
              (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            }}
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "24px 16px 40px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: "rgba(0,229,255,0.12)",
                border: "1px solid rgba(0,229,255,0.2)",
              }}
            >
              <Award size={18} className="text-cyan-400" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.3,
                  marginBottom: "4px",
                }}
              >
                {cert.title}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Building2 size={12} className="text-slate-500" />
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {cert.organization}
                  </span>
                </div>
                {cert.issueDate && (
                  <>
                    <span style={{ fontSize: "12px", color: "#334155" }}>·</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Calendar size={11} className="text-slate-600" />
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {new Date(cert.issueDate).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Certificate Image */}
          <div
            style={{
              width: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "24px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {cert.imageUrl ? (
              <SafeImg
                src={cert.imageUrl}
                alt={cert.title}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  maxHeight: "65vh",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "96px 0",
                }}
              >
                <Award size={56} className="text-slate-700" />
                <span style={{ fontSize: "14px", color: "#475569" }}>
                  No image available
                </span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            {cert.featured && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontWeight: 600,
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  color: "#fbbf24",
                }}
              >
                <Star size={10} fill="currentColor" />
                Featured
              </div>
            )}
            {cert.credentialUrl && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontWeight: 600,
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  color: "#34d399",
                }}
              >
                <Shield size={10} />
                Verified Credential
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
                  textDecoration: "none",
                  transition: "transform 0.2s ease",
                }}
              >
                <Shield size={14} />
                Verify Credential
                <ExternalLink size={12} />
              </a>
            )}
            {cert.imageUrl && (
              <a
                href={cert.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#cbd5e1",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  transition: "transform 0.2s ease",
                }}
              >
                <ExternalLink size={14} />
                Open Image
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Certificate Card ────────────────────────────────────── */
function CertCard({
  cert,
  index,
  onImageClick,
}: {
  cert: Certificate;
  index: number;
  onImageClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.23, 1, 0.32, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: hovered
          ? "1px solid rgba(0,229,255,0.2)"
          : "1px solid rgba(255,255,255,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.4)" : "none",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
      }}
    >
      {/* Image area */}
      <div
        className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 flex-shrink-0 cursor-pointer group"
        onClick={onImageClick}
      >
        {cert.imageUrl ? (
          <SafeImg
            src={cert.imageUrl}
            alt={cert.title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award size={36} className="text-slate-700" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <ZoomIn size={18} className="text-white" />
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/30 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {cert.featured && (
            <div
              className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.3)",
                color: "#fbbf24",
              }}
            >
              <Star size={7} fill="currentColor" />
              Featured
            </div>
          )}
        </div>

        {cert.credentialUrl && (
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <Shield size={13} className="text-emerald-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3
          className="font-bold text-sm leading-snug mb-2 line-clamp-2 transition-colors duration-200 cursor-pointer"
          style={{ color: hovered ? "#00e5ff" : "white" }}
          onClick={onImageClick}
        >
          {cert.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <Building2 size={12} className="text-slate-600 flex-shrink-0" />
          <span className="text-xs text-slate-500 truncate">
            {cert.organization}
          </span>
        </div>

        {cert.issueDate && (
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={12} className="text-slate-700 flex-shrink-0" />
            <span className="text-[11px] text-slate-600">
              {new Date(cert.issueDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        <div className="mt-auto">
          {cert.credentialUrl ? (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink size={11} />
              Verify Credential
            </a>
          ) : (
            <span className="text-[11px] text-slate-700">
              No credential link
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function Certificates({ certificates }: CertificatesProps) {
  const [search, setSearch] = useState("");
  const [activeOrg, setActiveOrg] = useState("All");
  const [showFeatured, setShowFeatured] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allOrgs = Array.from(
    new Set(certificates.map((c) => c.organization))
  ).sort();
  const featuredCount = certificates.filter((c) => c.featured).length;

  const filtered = certificates.filter((c) => {
    const matchOrg = activeOrg === "All" || c.organization === activeOrg;
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.organization.toLowerCase().includes(search.toLowerCase());
    const matchFeatured = !showFeatured || c.featured;
    return matchOrg && matchSearch && matchFeatured;
  });

  const openLightbox = (filteredIndex: number) =>
    setLightboxIndex(filteredIndex);

  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = () => {
    if (lightboxIndex !== null)
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
  };

  const prevImage = () => {
    if (lightboxIndex !== null)
      setLightboxIndex(
        (lightboxIndex - 1 + filtered.length) % filtered.length
      );
  };

  return (
    <>
      <section className="relative py-32 overflow-hidden bg-[#020617]">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-amber-600/4 blur-[120px]" />
          <div className="absolute bottom-1/3 -left-32 w-96 h-96 rounded-full bg-blue-600/4 blur-[120px]" />
        </div>

        <div className="relative section-container">
          <SectionTitle
            label="Certifications"
            title="My"
            highlight="Credentials"
            description="Professional certifications from globally recognized technology leaders."
          />

          {/* ═══ Controls ═══ */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <div
                className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none"
                style={{ zIndex: 2 }}
              >
                <Search size={14} className="text-slate-500" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search certificates…"
                className="w-full py-2.5 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none transition-colors"
                style={{
                  paddingLeft: "40px",
                  paddingRight: search ? "38px" : "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(0,229,255,0.3)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-0 top-0 bottom-0 w-9 flex items-center justify-center text-slate-600 hover:text-white transition-colors"
                  style={{ zIndex: 2 }}
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 items-center">
              {featuredCount > 0 && (
                <motion.button
                  onClick={() => setShowFeatured(!showFeatured)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: showFeatured
                      ? "rgba(245,158,11,0.12)"
                      : "rgba(255,255,255,0.03)",
                    border: showFeatured
                      ? "1px solid rgba(245,158,11,0.3)"
                      : "1px solid rgba(255,255,255,0.06)",
                    color: showFeatured ? "#fbbf24" : "#64748b",
                  }}
                >
                  <Star
                    size={10}
                    fill={showFeatured ? "currentColor" : "none"}
                  />
                  Featured
                </motion.button>
              )}
              {["All", ...allOrgs.slice(0, 4)].map((org) => (
                <motion.button
                  key={org}
                  onClick={() => setActiveOrg(org)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background:
                      activeOrg === org
                        ? "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.15))"
                        : "rgba(255,255,255,0.03)",
                    border:
                      activeOrg === org
                        ? "1px solid rgba(0,229,255,0.3)"
                        : "1px solid rgba(255,255,255,0.06)",
                    color: activeOrg === org ? "#fff" : "#64748b",
                  }}
                >
                  {org}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ═══ Stats bar ═══ */}
          <div className="flex items-center gap-6 mb-10 flex-wrap">
            {[
              {
                icon: Award,
                value: filtered.length,
                label: "certificates",
                color: "text-cyan-500",
              },
              {
                icon: Building2,
                value: allOrgs.length,
                label: "issuers",
                color: "text-purple-500",
              },
              {
                icon: Shield,
                value: certificates.filter((c) => c.credentialUrl).length,
                label: "verified",
                color: "text-emerald-500",
              },
              {
                icon: Star,
                value: featuredCount,
                label: "featured",
                color: "text-amber-500",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                <s.icon size={14} className={s.color} />
                <span className="text-white font-bold">{s.value}</span>{" "}
                {s.label}
              </div>
            ))}
          </div>

          {/* ═══ Grid ═══ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeOrg}-${search}-${showFeatured}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {filtered.map((cert, i) => (
                <CertCard
                  key={cert.id}
                  cert={cert}
                  index={i}
                  onImageClick={() => openLightbox(i)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Award size={28} className="text-slate-700" />
              </div>
              <p className="text-slate-600 text-sm">
                No certificates match your search.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveOrg("All");
                  setShowFeatured(false);
                }}
                className="mt-3 text-xs text-cyan-500 hover:text-cyan-400 transition-colors font-medium"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ Lightbox ═══ */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered.length > 0 && (
          <Lightbox
            certificates={filtered}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </>
  );
}