"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  Shield,
  Loader2,
  FileImage,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Resume } from "@/types/portfolio";

interface ResumeSectionProps {
  resume: Resume | null;
}

function getGoogleDriveFileId(url: string): string | null {
  const fileMatch = url.match(/\/d\/([^/]+)/);
  const idMatch   = url.match(/[?&]id=([^&]+)/);
  return fileMatch?.[1] || idMatch?.[1] || null;
}

function isGoogleDriveUrl(url: string): boolean {
  return url.includes("drive.google.com");
}

function getDirectDownloadUrl(url: string): string {
  if (isGoogleDriveUrl(url)) {
    const fileId = getGoogleDriveFileId(url);
    if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

// ── Mobile-safe download ──────────────────────────────────────
// Problem: On mobile browsers, <a download> is ignored for
// cross-origin URLs (like Google Drive). The file opens instead
// of downloading.
//
// Fix: Fetch the file as a blob, create a local blob:// URL,
// then use <a download> on that local URL. Since blob:// URLs
// are same-origin, the download attribute is always respected
// on both desktop and mobile.
async function triggerDownload(
  fileUrl:   string,
  fileName = "resume.pdf",
  onLoading: (v: boolean) => void,
): Promise<void> {
  onLoading(true);
  const downloadUrl = getDirectDownloadUrl(fileUrl);

  try {
    const res = await fetch(downloadUrl, { mode: "cors" });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const blob    = await res.blob();

    // Ensure the blob has a PDF MIME type so mobile browsers
    // treat it as a PDF file rather than an unknown binary
    const pdfBlob = new Blob([blob], {
      type: blob.type || "application/pdf",
    });

    const blobUrl = URL.createObjectURL(pdfBlob);

    const a       = document.createElement("a");
    a.href        = blobUrl;
    a.download    = fileName;
    // Do NOT set target="_blank" on blob URLs — some mobile
    // browsers open a new tab instead of downloading when both
    // download and target="_blank" are set together
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Keep the URL alive long enough for the download to start
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
  } catch {
    // Fallback for CORS errors or network failures:
    // open directly in a new tab — user can then long-press
    // on mobile to save, or use browser menu to download
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  } finally {
    onLoading(false);
  }
}

// ─── Document Preview Card ─────────────────────────────────────────────────────
interface DocumentPreviewCardProps {
  thumbnailUrl?: string | null;
  title: string;
}

function DocumentPreviewCard({ thumbnailUrl, title }: DocumentPreviewCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasImage = !!thumbnailUrl && !imgError;

  return (
    <motion.div
      className="relative mx-auto"
      style={{ width: 220 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        style={{
          width:        220,
          height:       300,
          borderRadius: 16,
          border:       "1px solid rgba(255,255,255,0.12)",
          boxShadow:    "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(0,229,255,0.07)",
          background:   "rgba(15,23,42,0.95)",
          position:     "relative",
          overflow:     "hidden",
        }}
      >
        <div
          style={{
            position:     "absolute",
            inset:        6,
            borderRadius: 10,
            overflow:     "hidden",
            background:   "#f8fafc",
            boxShadow:    "inset 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl!}
              alt={`${title} preview`}
              onError={() => setImgError(true)}
              style={{
                width:          "100%",
                height:         "100%",
                objectFit:      "cover",
                objectPosition: "center top",
                display:        "block",
                borderRadius:   10,
              }}
            />
          ) : (
            <div
              style={{
                width:          "100%",
                height:         "100%",
                display:        "flex",
                flexDirection:  "column",
                padding:        "16px 14px",
                gap:            8,
                background:     "linear-gradient(145deg,#f8fafc 0%,#f1f5f9 100%)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div
                  style={{
                    width:          24,
                    height:         24,
                    borderRadius:   4,
                    background:     "linear-gradient(135deg,#3b82f6,#7c3aed)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                  }}
                >
                  <FileText size={12} style={{ color: "#fff" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 5, borderRadius: 3, background: "#334155", width: "80%", marginBottom: 3 }} />
                  <div style={{ height: 3, borderRadius: 2, background: "#94a3b8", width: "55%" }} />
                </div>
              </div>
              <div style={{ height: 1, background: "#e2e8f0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ height: 7, borderRadius: 3, background: "#1e293b", width: "70%" }} />
                <div style={{ height: 4, borderRadius: 2, background: "#64748b", width: "45%" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
                {[90, 75, 85, 60, 95].map((w, i) => (
                  <div key={i} style={{ height: 3, borderRadius: 2, background: "#cbd5e1", width: `${w}%` }} />
                ))}
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "#3b82f6", width: "40%", marginTop: 6 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[95, 80, 88, 65].map((w, i) => (
                  <div key={i} style={{ height: 3, borderRadius: 2, background: "#cbd5e1", width: `${w}%` }} />
                ))}
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "#7c3aed", width: "35%", marginTop: 6 }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 2 }}>
                {["React", "Node.js", "AI/ML"].map((s) => (
                  <div
                    key={s}
                    style={{
                      padding:      "2px 6px",
                      borderRadius: 3,
                      background:   "rgba(59,130,246,0.1)",
                      border:       "1px solid rgba(59,130,246,0.2)",
                      fontSize:     7,
                      color:        "#3b82f6",
                      fontWeight:   600,
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "auto", textAlign: "center" }}>
                <FileImage size={14} style={{ color: "#94a3b8", margin: "0 auto 4px" }} />
                <span style={{ fontSize: 8, color: "#94a3b8", fontWeight: 600 }}>{title || "Resume"}</span>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            position:      "absolute",
            top: 0, left: 0, right: 0,
            height:        1,
            background:    "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)",
            pointerEvents: "none",
            zIndex:        10,
          }}
        />
        <div
          style={{
            position:      "absolute",
            top: 0, right: 0,
            width: 0, height: 0,
            borderStyle:   "solid",
            borderWidth:   "0 28px 28px 0",
            borderColor:   `transparent rgba(15,23,42,0.95) transparent transparent`,
            zIndex:        20,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position:      "absolute",
            top: 0, right: 0,
            width:         28, height: 28,
            background:    "linear-gradient(135deg,rgba(0,229,255,0.15) 0%,rgba(59,130,246,0.1) 100%)",
            clipPath:      "polygon(100% 0,100% 100%,0 0)",
            zIndex:        21,
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        style={{
          position:      "absolute",
          bottom:        -20, left: "50%",
          transform:     "translateX(-50%)",
          width:         160, height: 40,
          borderRadius:  "50%",
          background:    "rgba(0,229,255,0.12)",
          filter:        "blur(20px)",
          pointerEvents: "none",
          zIndex:        -1,
        }}
      />
      <div
        style={{
          position:      "absolute",
          inset:         -20,
          borderRadius:  32,
          opacity:       0.15,
          filter:        "blur(32px)",
          background:    "radial-gradient(ellipse at 30% 50%,rgba(0,229,255,0.4) 0%,transparent 60%)",
          pointerEvents: "none",
          zIndex:        -1,
        }}
      />
    </motion.div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────
export default function ResumeSection({ resume }: ResumeSectionProps) {
  const sectionRef  = useRef<HTMLElement>(null);
  const inView      = useInView(sectionRef, { once: true, margin: "-80px" });
  const [downloading, setDownloading] = useState(false);

  if (!resume) return null;

  const lastUpdated = resume.updatedAt
    ? new Date(resume.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day:   "numeric",
        year:  "numeric",
      })
    : null;

  const features = [
    { icon: FileText,    text: "Full work history & education"              },
    { icon: Shield,      text: "Verified credentials"                       },
    { icon: CheckCircle, text: "Skills & certifications"                    },
    { icon: Clock,       text: `Last updated: ${lastUpdated || "Recently"}` },
  ];

  const fileName = resume.title
    ? `${resume.title.replace(/\s+/g, "_")}.pdf`
    : "resume.pdf";

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden bg-[#020617]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/[0.04] blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/[0.04] blur-[120px]" />
      </div>

      <div className="relative section-container">
        <SectionTitle
          label="Resume"
          title="My"
          highlight="Resume"
          description="A comprehensive overview of my experience, skills, and achievements."
        />

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Left: document preview */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center"
            >
              <DocumentPreviewCard
                thumbnailUrl={resume.thumbnailUrl}
                title={resume.title || "Resume"}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center"
              >
                <div className="text-sm font-semibold text-white mb-1">
                  {resume.title || "Resume"}
                </div>
                {lastUpdated && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                    <Clock size={10} />
                    Updated {lastUpdated}
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Right: info & actions */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Download My{" "}
                  <span className="gradient-text">Resume</span>
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Get a complete view of my professional journey, technical
                  skills, projects, and achievements in one document.
                </p>
              </div>

              <div className="space-y-3">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(0,229,255,0.08)",
                        border:     "1px solid rgba(0,229,255,0.15)",
                      }}
                    >
                      <f.icon size={13} className="text-cyan-400" />
                    </div>
                    <span className="text-sm text-slate-400">{f.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <motion.button
                  onClick={() => triggerDownload(resume.fileUrl, fileName, setDownloading)}
                  disabled={downloading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
                    boxShadow:  "0 4px 20px rgba(59,130,246,0.3)",
                  }}
                  whileHover={!downloading ? { scale: 1.04, y: -2 } : {}}
                  whileTap={!downloading ? { scale: 0.97 } : {}}
                >
                  {downloading
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Download size={15} />}
                  {downloading ? "Downloading…" : "Download PDF"}
                </motion.button>

                <motion.a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border:     "1px solid rgba(255,255,255,0.1)",
                  }}
                  whileHover={{
                    scale:       1.04,
                    y:           -2,
                    borderColor: "rgba(0,229,255,0.3)",
                    color:       "#00e5ff",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalLink size={15} />
                  Open Resume
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}