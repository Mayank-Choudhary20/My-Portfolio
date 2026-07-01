"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Building2, ChevronDown, Calendar, Briefcase, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Experience as ExperienceType } from "@/types/portfolio";

interface ExperienceProps {
  experience: ExperienceType[];
}

function ExperienceCard({ exp, index }: { exp: ExperienceType; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-8 sm:pl-16"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 ring-4 ring-[#020617] z-10" />

      {/* Card */}
      <div
        className={`glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
          expanded ? "border-cyan-500/20" : ""
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Company logo */}
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {exp.companyLogo ? (
                <Image
                  src={exp.companyLogo}
                  alt={exp.company}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <Building2 size={20} className="text-slate-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 size={13} className="text-cyan-400 flex-shrink-0" />
                    <span className="text-sm text-cyan-400 font-medium">{exp.company}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(exp as ExperienceType & { current?: boolean }).current && (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-medium">
                      Current
                    </span>
                  )}
                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={18} className="text-slate-500" />
                  </motion.div>
                </div>
              </div>

              {/* Dates */}
              {((exp as ExperienceType & { startDate?: string }).startDate) && (
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <Calendar size={11} />
                  <span>
                    {new Date((exp as ExperienceType & { startDate: string }).startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                    {" — "}
                    {(exp as ExperienceType & { current?: boolean; endDate?: string }).current
                      ? "Present"
                      : (exp as ExperienceType & { endDate?: string }).endDate
                      ? new Date((exp as ExperienceType & { endDate: string }).endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-white/5 pt-4">
                {/* Description */}
                <div className="space-y-2 mb-5">
                  {exp.description
                    .split(". ")
                    .filter(Boolean)
                    .map((sentence, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ChevronRight size={14} className="text-cyan-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {sentence}{sentence.endsWith(".") ? "" : "."}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Technologies */}
                {exp.technologies?.length > 0 && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">
                      Technologies Used
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section className="relative py-28 overflow-hidden bg-[#020617]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-600/4 blur-[100px]" />
      </div>

      <div className="relative section-container">
        <SectionTitle
          label="Work Experience"
          title="My Professional"
          highlight="Journey"
          description="A timeline of roles where I've shipped impactful products and led engineering initiatives."
        />

        {experience.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-600">No experience entries yet.</p>
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical timeline line */}
            <div className="absolute left-[7px] sm:left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700/50 to-transparent" />

            <div className="space-y-8">
              {experience.map((exp, i) => (
                <ExperienceCard key={exp.id} exp={exp} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}