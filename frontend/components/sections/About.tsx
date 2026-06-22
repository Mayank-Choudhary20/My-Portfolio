"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  User,
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Zap,
  Code2,
} from "lucide-react";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Profile, Project, Skill, Certificate } from "@/types/portfolio";

interface AboutProps {
  profile: Profile | null;
  projects?: Project[];
  skills?: Skill[];
  certificates?: Certificate[];
}

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
    >
      <motion.span
        initial={{ innerText: 0 } as never}
        animate={inView ? ({ innerText: target } as never) : {}}
        transition={{ duration, ease: "easeOut" }}
        onUpdate={(latest: Record<string, number>) => {
          if (ref.current) {
            ref.current.textContent = `${Math.round(
              latest.innerText || 0
            )}${suffix}`;
          }
        }}
      >
        {target}
        {suffix}
      </motion.span>
    </motion.span>
  );
}

export default function About({
  profile,
  projects = [],
  skills = [],
  certificates = [],
}: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    {
      value:     profile?.yearsExperience ?? 0,
      suffix:    "+",
      label:     "Years Experience",
      icon:      Calendar,
      color:     "rgba(0,229,255,0.12)",
      border:    "rgba(0,229,255,0.2)",
      iconColor: "text-cyan-400",
      glow:      "rgba(0,229,255,0.04)",
    },
    {
      value:     projects.length || 0,
      suffix:    "+",
      label:     "Projects Built",
      icon:      Briefcase,
      color:     "rgba(59,130,246,0.12)",
      border:    "rgba(59,130,246,0.2)",
      iconColor: "text-blue-400",
      glow:      "rgba(59,130,246,0.04)",
    },
    {
      value:     certificates.length || 0,
      suffix:    "+",
      label:     "Certificates",
      icon:      GraduationCap,
      color:     "rgba(124,58,237,0.12)",
      border:    "rgba(124,58,237,0.2)",
      iconColor: "text-purple-400",
      glow:      "rgba(124,58,237,0.04)",
    },
    {
      value:     skills.length || 0,
      suffix:    "+",
      label:     "Technologies",
      icon:      Code2,
      color:     "rgba(16,185,129,0.12)",
      border:    "rgba(16,185,129,0.2)",
      iconColor: "text-emerald-400",
      glow:      "rgba(16,185,129,0.04)",
    },
  ];

  const aboutText =
    profile?.about ||
    "Full Stack Developer skilled in NestJS, Next.js, Prisma and AI technologies. Passionate about building intelligent systems that solve real-world problems.";

  const sentences = aboutText
    .replace(/\.\s+/g, ".|")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);

  // ── Mission text — from backend, fallback to default ──────
  const missionText =
    profile?.mission ||
    "I believe in building technology that doesn't just work — it delights. Every line of code is an opportunity to create something meaningful.";

  const infoItems = [
    {
      icon:      Mail,
      label:     "Email",
      value:     profile?.email || "—",
      bg:        "rgba(0,229,255,0.1)",
      iconColor: "text-cyan-400",
    },
    {
      icon:      MapPin,
      label:     "Location",
      value:     profile?.location || "—",
      bg:        "rgba(59,130,246,0.1)",
      iconColor: "text-blue-400",
    },
    {
      icon:      Briefcase,
      label:     "Role",
      value:     profile?.title || "Developer",
      bg:        "rgba(124,58,237,0.1)",
      iconColor: "text-purple-400",
    },
    {
      icon:      Calendar,
      label:     "Experience",
      value:     `${profile?.yearsExperience ?? 0}+ years`,
      bg:        "rgba(16,185,129,0.1)",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-[#020617]"
    >
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(0,229,255,0.18),transparent)",
        }}
      />

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      <div className="relative section-container">
        <SectionTitle
          label="About Me"
          title="The Person"
          highlight="Behind The Code"
          description="Passionate about building systems that are both technically excellent and genuinely useful."
        />

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-12 items-start mb-14">

          {/* ── LEFT: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative w-full">
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 blur-2xl" />

              {/* Image card */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/5]">
                {profile?.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    style={{ objectPosition: "top center" }}
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <User size={72} className="text-slate-600" />
                  </div>
                )}

                {/* Bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/85 via-[#020617]/15 to-transparent pointer-events-none" />

                {/* Name + availability */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div
                    className="rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3"
                    style={{
                      background:     "rgba(2,6,23,0.88)",
                      backdropFilter: "blur(16px)",
                      border:         "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {profile?.name || "Mayank Choudhary"}
                      </div>
                      <div className="text-[11px] text-cyan-400 mt-0.5 truncate">
                        {profile?.title || "AI & Full Stack Developer"}
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{
                        background: profile?.available
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(239,68,68,0.12)",
                        border: profile?.available
                          ? "1px solid rgba(16,185,129,0.28)"
                          : "1px solid rgba(239,68,68,0.28)",
                      }}
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: profile?.available ? "#10b981" : "#ef4444",
                        }}
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                      <span
                        className="text-[10px] font-semibold whitespace-nowrap"
                        style={{
                          color: profile?.available ? "#10b981" : "#ef4444",
                        }}
                      >
                        {profile?.available ? "Available" : "Busy"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating — Location */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 z-10"
                style={{
                  background:     "rgba(2,6,23,0.92)",
                  backdropFilter: "blur(16px)",
                  border:         "1px solid rgba(0,229,255,0.15)",
                  borderRadius:   "10px",
                  padding:        "7px 12px",
                  boxShadow:      "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-md flex items-center justify-center"
                    style={{ background: "rgba(0,229,255,0.12)" }}
                  >
                    <MapPin size={10} className="text-cyan-400" />
                  </div>
                  <span className="text-[7px] font-medium text-slate-200">
                    {profile?.location || "India"}
                  </span>
                </div>
              </motion.div>

              {/* Floating — Open to work */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-3 -left-3 z-10"
                style={{
                  background:     "rgba(2,6,23,0.92)",
                  backdropFilter: "blur(16px)",
                  border:         "1px solid rgba(124,58,237,0.15)",
                  borderRadius:   "10px",
                  padding:        "7px 12px",
                  boxShadow:      "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-md flex items-center justify-center"
                    style={{ background: "rgba(124,58,237,0.12)" }}
                  >
                    <Mail size={10} className="text-purple-400" />
                  </div>
                  <span className="text-[9px] font-medium text-slate-200">
                    {profile?.available ? "Open to Work" : "In a Role"}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── RIGHT: Text Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {/* Heading + description */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                Building the{" "}
                <span className="gradient-text">Future</span> with AI
              </h3>
              <div
                className="h-px w-8 mt-2.5 mb-3"
                style={{
                  background: "linear-gradient(90deg,#00e5ff,transparent)",
                }}
              />
              {sentences.map((sentence, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="text-slate-400 leading-relaxed text-sm mb-1.5 last:mb-0"
                >
                  {sentence}
                  {sentence.endsWith(".") ? "" : "."}
                </motion.p>
              ))}
            </div>

            {/* Info grid 2×2 */}
            <div className="grid grid-cols-2 gap-2">
              {infoItems.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.35 }}
                  className="rounded-lg p-3 cursor-default transition-colors duration-200"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border:     "1px solid rgba(255,255,255,0.055)",
                  }}
                  whileHover={{
                    borderColor: "rgba(0,229,255,0.16)",
                    background:  "rgba(0,229,255,0.025)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className="w-4.5 h-4.5 w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: info.bg }}
                    >
                      <info.icon size={10} className={info.iconColor} />
                    </div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">
                      {info.label}
                    </span>
                  </div>
                  <div
                    className="text-[13px] text-slate-200 font-semibold truncate pl-0.5"
                    title={info.value}
                  >
                    {info.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Mission box — from backend ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="rounded-lg p-3.5"
              style={{
                background:
                  "linear-gradient(135deg,rgba(0,229,255,0.03),rgba(59,130,246,0.02))",
                border: "1px solid rgba(0,229,255,0.09)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(0,229,255,0.15),rgba(59,130,246,0.15))",
                    border: "1px solid rgba(0,229,255,0.15)",
                  }}
                >
                  <Zap size={14} className="text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] font-bold text-white mb-1 tracking-widest uppercase">
                    My Mission
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {missionText}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ═══ STATS ROW ═══ */}
        <div
          className="pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="relative rounded-xl overflow-hidden cursor-default group"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border:     "1px solid rgba(255,255,255,0.05)",
                }}
                whileHover={{
                  borderColor: stat.border,
                  background:  stat.glow,
                }}
              >
                <div className="p-5 flex flex-col items-center text-center">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5"
                    style={{
                      background: stat.color,
                      border:     `1px solid ${stat.border}`,
                    }}
                  >
                    <stat.icon size={16} className={stat.iconColor} />
                  </div>

                  <div className="text-2xl font-black text-white mb-0.5 tabular-nums leading-none">
                    {inView ? (
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                        duration={2}
                      />
                    ) : (
                      <span>0{stat.suffix}</span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500">
                    {stat.label}
                  </div>
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg,transparent,${stat.border},transparent)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(59,130,246,0.12),transparent)",
        }}
      />
    </section>
  );
}