"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ExternalLink,
  Search,
  X,
  Building2,
  Shield,
  Calendar,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Certificate } from "@/types/portfolio";

interface CertificatesProps {
  certificates: Certificate[];
}

interface ExtendedCertificate extends Certificate {
  issueDate?: string;
  featured?: boolean;
}

// Safe image component
function SafeImg({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  if (err || !src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErr(true)}
    />
  );
}

function CertCard({
  cert,
  index,
}: {
  cert: ExtendedCertificate;
  index: number;
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
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.4)"
          : "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
      }}
    >
      {/* Certificate image */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 flex-shrink-0">
        {cert.imageUrl ? (
          <SafeImg
            src={cert.imageUrl}
            alt={cert.title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award size={36} className="text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/30 to-transparent" />

        {/* Verified badge */}
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
          className="font-bold text-sm leading-snug mb-2 line-clamp-2 transition-colors duration-200"
          style={{ color: hovered ? "#00e5ff" : "white" }}
        >
          {cert.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <Building2 size={11} className="text-slate-600 flex-shrink-0" />
          <span className="text-[11px] text-slate-500 truncate">
            {cert.organization}
          </span>
        </div>

        {cert.issueDate && (
          <div className="flex items-center gap-1.5 mb-4">
            <Calendar size={11} className="text-slate-700 flex-shrink-0" />
            <span className="text-[10px] text-slate-600">
              {new Date(cert.issueDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Verify link */}
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

export default function Certificates({ certificates }: CertificatesProps) {
  const [search, setSearch] = useState("");
  const [activeOrg, setActiveOrg] = useState("All");

  const allOrgs = Array.from(
    new Set(certificates.map((c) => c.organization))
  ).sort();

  const filtered = certificates.filter((c) => {
    const cert = c as ExtendedCertificate;
    const matchOrg = activeOrg === "All" || cert.organization === activeOrg;
    const matchSearch =
      !search ||
      cert.title.toLowerCase().includes(search.toLowerCase()) ||
      cert.organization.toLowerCase().includes(search.toLowerCase());
    return matchOrg && matchSearch;
  });

  return (
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

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search certificates…"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none transition-colors"
              style={{
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Org filters */}
          <div className="flex flex-wrap gap-2">
            {["All", ...allOrgs.slice(0, 5)].map((org) => (
              <motion.button
                key={org}
                onClick={() => setActiveOrg(org)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
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

        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Award size={14} className="text-cyan-500" />
            <span className="text-white font-bold">{filtered.length}</span>{" "}
            certificates
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Building2 size={14} className="text-purple-500" />
            <span className="text-white font-bold">{allOrgs.length}</span>{" "}
            issuers
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield size={14} className="text-emerald-500" />
            <span className="text-white font-bold">
              {certificates.filter((c) => c.credentialUrl).length}
            </span>{" "}
            verified
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeOrg}-${search}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {filtered.map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert as ExtendedCertificate}
                index={i}
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
          </motion.div>
        )}
      </div>
    </section>
  );
}