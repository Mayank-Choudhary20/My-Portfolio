"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  Download,
  ExternalLink,
  Clock,
  Eye,
  CheckCircle,
  Shield,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Resume } from "@/types/portfolio";

interface ResumeSectionProps {
  resume: Resume | null;
}

function AnimatedDocumentIcon() {
  return (
    <motion.div
      className="relative mx-auto w-32 h-40"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Document body */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: "linear-gradient(145deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,229,255,0.06)",
        }}
      />
      {/* Corner fold */}
      <div
        className="absolute top-0 right-0 w-8 h-8"
        style={{
          background: "linear-gradient(135deg, transparent 50%, rgba(0,229,255,0.15) 50%)",
          borderRadius: "0 8px 0 0",
        }}
      />
      {/* Lines */}
      <div className="absolute inset-x-5 top-10 space-y-2">
        {[100, 80, 90, 70, 85, 60].map((w, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full"
            style={{
              width: `${w}%`,
              background:
                i === 0
                  ? "linear-gradient(90deg, #00e5ff, #3b82f6)"
                  : "rgba(255,255,255,0.06)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
          />
        ))}
      </div>
      {/* Glow */}
      <div
        className="absolute -inset-3 rounded-2xl opacity-30 blur-xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,229,255,0.2) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

export default function ResumeSection({ resume }: ResumeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [previewing, setPreviewing] = useState(false);

  if (!resume) return null;

  const lastUpdated = resume.updatedAt
    ? new Date(resume.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const features = [
    { icon: FileText, text: "Full work history & education" },
    { icon: Shield, text: "Verified credentials" },
    { icon: CheckCircle, text: "Skills & certifications" },
    { icon: Clock, text: `Last updated: ${lastUpdated || "Recently"}` },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden bg-[#020617]"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/4 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/4 blur-[120px]" />
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
            {/* Left — Document preview */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center"
            >
              <AnimatedDocumentIcon />

              {/* Title below doc */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
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

            {/* Right — Info & actions */}
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

              {/* Feature list */}
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
                        background:
                          "rgba(0,229,255,0.08)",
                        border: "1px solid rgba(0,229,255,0.15)",
                      }}
                    >
                      <f.icon size={13} className="text-cyan-400" />
                    </div>
                    <span className="text-sm text-slate-400">{f.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6, #7c3aed)",
                    boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
                  }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Download size={15} />
                  Download PDF
                </motion.a>

                <motion.a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  whileHover={{
                    scale: 1.04,
                    y: -2,
                    borderColor: "rgba(0,229,255,0.3)",
                    color: "#00e5ff",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalLink size={15} />
                  Open Resume
                </motion.a>
              </div>

              {/* Preview toggle */}
              {resume.fileUrl.endsWith(".pdf") && (
                <div>
                  <button
                    onClick={() => setPreviewing(!previewing)}
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    <Eye size={12} />
                    {previewing ? "Hide preview" : "Quick preview"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* PDF Preview */}
          {previewing && resume.fileUrl.endsWith(".pdf") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-10 rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span className="text-xs text-slate-500 font-mono">
                  {resume.title}
                </span>
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <ExternalLink size={10} />
                  Open fullscreen
                </a>
              </div>
              <iframe
                src={`${resume.fileUrl}#view=fitH`}
                title="Resume Preview"
                className="w-full"
                style={{ height: "600px", border: "none" }}
                loading="lazy"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}