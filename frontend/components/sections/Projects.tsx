"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ExternalLink,
  X,
  Star,
  Layers,
  ChevronRight,
  Code2,
  Eye,
  GitBranch,
  Calendar,
  Zap,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Project } from "@/types/portfolio";

interface ProjectsProps {
  projects: Project[];
}

// Safe image component that handles any URL
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
      <div className={`flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 ${className ?? ""}`}>
        <Layers size={32} className="text-slate-600" />
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

// ── Project Modal ──────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 40 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
        style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(40px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <X size={17} />
        </button>

        {/* Hero image */}
        <div className="relative h-52 overflow-hidden rounded-t-3xl bg-slate-900">
          {project.imageUrl ? (
            <SafeImage
              src={project.imageUrl}
              alt={project.title}
              fill
              className="transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Layers size={48} className="text-slate-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/20 to-transparent" />

          {project.featured && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24" }}>
              <Star size={11} fill="currentColor" />
              Featured
            </div>
          )}
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-black text-white mb-3">
            {project.title}
          </h2>
          <p className="text-slate-400 leading-relaxed text-sm mb-6">
            {project.description}
          </p>

          {/* Tech stack */}
          {project.technologies?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                <Code2 size={12} className="text-cyan-500" />
                Tech Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{
                      background: "rgba(0,229,255,0.08)",
                      border: "1px solid rgba(0,229,255,0.2)",
                      color: "#00e5ff",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <FaGithub size={15} />
                View Source
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
                }}
              >
                <ExternalLink size={15} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Project Card ───────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
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
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: hovered ? "1px solid rgba(0,229,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,229,255,0.1)" : "none",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-900 flex-shrink-0">
        {project.imageUrl ? (
          <SafeImage
            src={project.imageUrl}
            alt={project.title}
            fill
            className={`transition-transform duration-600 ${hovered ? "scale-105" : "scale-100"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Layers size={36} className="text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-transparent" />

        {/* Featured */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-semibold"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" }}>
            <Star size={9} fill="currentColor" />
            Featured
          </div>
        )}

        {/* View overlay */}
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
                  background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.15))",
                  border: "1px solid rgba(0,229,255,0.3)",
                }}
              >
                <Eye size={15} />
                View Details
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="font-bold text-white text-base mb-2 line-clamp-1 transition-colors duration-200"
          style={{ color: hovered ? "#00e5ff" : "white" }}
        >
          {project.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech pills */}
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-1 rounded-md font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span
                className="text-[10px] px-2 py-1 rounded-md"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#64748b",
                }}
              >
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bottom links */}
        <div className="flex items-center gap-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-white transition-colors"
            >
              <FaGithub size={12} />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-cyan-400 transition-colors"
            >
              <ExternalLink size={12} />
              Live
            </a>
          )}
          <div className="ml-auto flex items-center gap-1 text-xs text-slate-700 group-hover:text-cyan-400 transition-colors">
            Details <ChevronRight size={11} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Export ────────────────────────────────────────────────
export default function Projects({ projects }: ProjectsProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const filtered =
    filter === "featured" ? projects.filter((p) => p.featured) : projects;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <section className="relative py-32 overflow-hidden bg-[#020617]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px]" />
        <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="relative section-container">
        <SectionTitle
          label="Projects"
          title="What I've"
          highlight="Built"
          description="A curated selection of projects demonstrating my technical range and engineering depth."
        />

        {/* ── Filter tabs ── */}
        <div className="flex gap-3 justify-center mb-12">
          {[
            { key: "all" as const, label: "All Projects", count: projects.length, icon: Layers },
            { key: "featured" as const, label: "Featured", count: featuredCount, icon: Star },
          ].map((f) => (
            <motion.button
              key={f.key}
              onClick={() => setFilter(f.key)}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: filter === f.key
                  ? "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.15))"
                  : "rgba(255,255,255,0.03)",
                border: filter === f.key
                  ? "1px solid rgba(0,229,255,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                color: filter === f.key ? "#fff" : "#64748b",
                boxShadow: filter === f.key ? "0 0 20px rgba(0,229,255,0.1)" : "none",
              }}
            >
              <f.icon size={13} />
              {f.label}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                style={{
                  background: filter === f.key ? "rgba(0,229,255,0.15)" : "rgba(255,255,255,0.05)",
                  color: filter === f.key ? "#00e5ff" : "#64748b",
                }}
              >
                {f.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onClick={() => setSelected(project)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Layers size={28} className="text-slate-600" />
            </div>
            <p className="text-slate-600 text-sm">No projects to display.</p>
          </motion.div>
        )}

        {/* ── Stats row ── */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-16 flex flex-wrap justify-center gap-6"
          >
            {[
              { label: "Total Projects", value: projects.length, icon: Layers, color: "text-blue-400" },
              { label: "Featured", value: featuredCount, icon: Star, color: "text-amber-400" },
              { label: "With Live Demo", value: projects.filter(p => p.liveUrl).length, icon: Zap, color: "text-emerald-400" },
              { label: "Open Source", value: projects.filter(p => p.githubUrl).length, icon: GitBranch, color: "text-purple-400" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <s.icon size={16} className={s.color} />
                <div>
                  <div className="text-lg font-black text-white leading-none">{s.value}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}