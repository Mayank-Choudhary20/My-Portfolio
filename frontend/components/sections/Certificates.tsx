"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Award,
  ExternalLink,
  Search,
  X,
  Building2,
  Shield,
  Calendar,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Certificate } from "@/types/portfolio";

interface CertificatesProps {
  certificates: Certificate[];
}

/* ─── Safe Image ──────────────────────────────────────────── */
function SafeImage({
  src,
  alt,
  className,
  fill,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 ${className ?? ""}`}
      >
        <Award size={32} className="text-slate-600" />
      </div>
    );
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className ?? ""}`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

/* ─── Certificate Modal (contained within section) ────────── */
function CertModal({
  certificates,
  index,
  onClose,
  onNext,
  onPrev,
  containerRef,
}: {
  certificates: Certificate[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const cert = certificates[index];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  if (!cert) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
      style={{
        zIndex: 50,
        overflow: "hidden",
        isolation: "isolate",
        borderRadius: "inherit",
      }}
      onClick={onClose}
    >
      {/* ── Backdrop — 100% opaque, contained within section ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "#020617",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
        }}
      />

      {/* ── Panel ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 40 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
        style={{
          background: "rgba(10,15,30,0.98)",
          backdropFilter: "blur(40px)",
          overscrollBehavior: "contain",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          aria-label="Close"
        >
          <X size={17} />
        </button>

        {/* Nav buttons */}
        {certificates.length > 1 && (
          <div className="absolute top-4 right-16 z-20 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              aria-label="Previous certificate"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              aria-label="Next certificate"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Hero image */}
        <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-3xl bg-slate-900 flex-shrink-0">
          {cert.imageUrl ? (
            <SafeImage
              src={cert.imageUrl}
              alt={cert.title}
              fill
              className="transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Award size={48} className="text-slate-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/20 to-transparent" />

          {certificates.length > 1 && (
            <div
              className="absolute bottom-4 left-4 text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#94a3b8",
                backdropFilter: "blur(8px)",
              }}
            >
              {index + 1} / {certificates.length}
            </div>
          )}

          {cert.featured && (
            <div
              className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.3)",
                color: "#fbbf24",
              }}
            >
              <Star size={11} fill="currentColor" />
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2 leading-snug">
            {cert.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Building2 size={13} className="text-slate-500" />
              {cert.organization}
            </div>
            {cert.issueDate && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar size={12} className="text-slate-600" />
                {new Date(cert.issueDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {cert.featured && (
              <span
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  color: "#fbbf24",
                }}
              >
                <Star size={9} fill="currentColor" />
                Featured
              </span>
            )}
            {cert.credentialUrl && (
              <span
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  color: "#34d399",
                }}
              >
                <Shield size={9} />
                Verified Credential
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <ExternalLink size={14} />
                Open Full Image
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Certificate Card ────────────────────────────────────── */
function CertCard({
  cert,
  index,
  onClick,
}: {
  cert: Certificate;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.23, 1, 0.32, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: hovered
          ? "1px solid rgba(0,229,255,0.2)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,229,255,0.1)"
          : "none",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
      }}
    >
      {/* ── Thumbnail ── */}
      <div className="relative h-40 overflow-hidden bg-slate-900 flex-shrink-0">
        {cert.imageUrl ? (
          <SafeImage
            src={cert.imageUrl}
            alt={cert.title}
            fill
            className={`transition-transform duration-500 ${
              hovered ? "scale-105" : "scale-100"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Award size={36} className="text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-transparent" />

        {cert.featured && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: "rgba(245,158,11,0.15)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#fbbf24",
            }}
          >
            <Star size={9} fill="currentColor" />
            Featured
          </div>
        )}

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

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(2,6,23,0.7)" }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.15))",
                  border: "1px solid rgba(0,229,255,0.3)",
                }}
              >
                <Eye size={15} />
                View Certificate
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4">
        <h3
          className="font-bold text-sm leading-snug mb-2 line-clamp-2 transition-colors duration-200"
          style={{ color: hovered ? "#00e5ff" : "white" }}
        >
          {cert.title}
        </h3>

        <div className="flex items-center gap-2 mb-1.5">
          <Building2 size={12} className="text-slate-600 flex-shrink-0" />
          <span className="text-xs text-slate-500 truncate">
            {cert.organization}
          </span>
        </div>

        {cert.issueDate && (
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={11} className="text-slate-700 flex-shrink-0" />
            <span className="text-[11px] text-slate-600">
              {new Date(cert.issueDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* ── Bottom action buttons ── */}
        <div
          className="mt-auto flex flex-col gap-2 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(59,130,246,0.12))",
              border: "1px solid rgba(0,229,255,0.25)",
              color: "#22d3ee",
              boxShadow: "0 2px 8px rgba(0,229,255,0.08)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background =
                "linear-gradient(135deg, rgba(0,229,255,0.22), rgba(59,130,246,0.22))";
              el.style.borderColor = "rgba(0,229,255,0.45)";
              el.style.color = "#00e5ff";
              el.style.boxShadow = "0 4px 16px rgba(0,229,255,0.15)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background =
                "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(59,130,246,0.12))";
              el.style.borderColor = "rgba(0,229,255,0.25)";
              el.style.color = "#22d3ee";
              el.style.boxShadow = "0 2px 8px rgba(0,229,255,0.08)";
            }}
            aria-label={`Open image for ${cert.title}`}
          >
            <Maximize2 size={12} />
            Open Image
          </button>

          {cert.credentialUrl ? (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 no-underline"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.08))",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "#34d399",
                boxShadow: "0 2px 8px rgba(16,185,129,0.08)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background =
                  "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(52,211,153,0.18))";
                el.style.borderColor = "rgba(16,185,129,0.45)";
                el.style.color = "#6ee7b7";
                el.style.boxShadow = "0 4px 16px rgba(16,185,129,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background =
                  "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.08))";
                el.style.borderColor = "rgba(16,185,129,0.25)";
                el.style.color = "#34d399";
                el.style.boxShadow = "0 2px 8px rgba(16,185,129,0.08)";
              }}
            >
              <ExternalLink size={12} />
              Verify Credential
            </a>
          ) : (
            <div
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                color: "#334155",
              }}
            >
              <Shield size={10} />
              No credential link
            </div>
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
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const savedScrollRef = useRef(0);

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

  const openModal = useCallback(
    (i: number) => {
      savedScrollRef.current = window.scrollY;

      /*
        Always scroll the certificates section into view first,
        so the modal appears inside the section boundaries —
        even if triggered from Showcase or elsewhere.
      */
      if (sectionRef.current) {
        const sectionTop =
          sectionRef.current.getBoundingClientRect().top + window.scrollY;
        const sectionHeight = sectionRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;

        /* Center the section vertically in the viewport */
        const scrollTarget = sectionTop - (viewportHeight - sectionHeight) / 2;

        window.scrollTo({
          top: Math.max(0, scrollTarget),
          behavior: "instant",
        });
      }

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setModalIndex(i);
    },
    []
  );

  const closeModal = useCallback(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    setModalIndex(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollRef.current, behavior: "instant" });
      });
    });
  }, []);

  const nextCert = useCallback(() => {
    setModalIndex((prev) =>
      prev !== null ? (prev + 1) % filtered.length : null
    );
  }, [filtered.length]);

  const prevCert = useCallback(() => {
    setModalIndex((prev) =>
      prev !== null ? (prev - 1 + filtered.length) % filtered.length : null
    );
  }, [filtered.length]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-[#020617]"
      style={{
        /* Section becomes the positioning parent for the absolute modal */
        position: "relative",
        isolation: "isolate",
      }}
      id="certificates"
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-amber-600/4 blur-[120px]" />
        <div className="absolute bottom-1/3 -left-32 w-96 h-96 rounded-full bg-blue-600/4 blur-[120px]" />
      </div>

      <div className="relative section-container" style={{ zIndex: 1 }}>
        <SectionTitle
          label="Certifications"
          title="My"
          highlight="Credentials"
          description="Professional certifications from globally recognized technology leaders."
        />

        {/* ═══ Controls ═══ */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                onClick={() => openModal(i)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

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

      {/* ═══ Modal — positioned absolutely within the section ═══ */}
      <AnimatePresence>
        {modalIndex !== null && filtered.length > 0 && (
          <CertModal
            certificates={filtered}
            index={modalIndex}
            onClose={closeModal}
            onNext={nextCert}
            onPrev={prevCert}
            containerRef={sectionRef}
          />
        )}
      </AnimatePresence>
    </section>
  );
}