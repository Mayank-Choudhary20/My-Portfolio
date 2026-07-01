"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { User, MapPin, Mail, Calendar, Briefcase, GraduationCap, Zap } from "lucide-react";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Profile } from "@/types/portfolio";

interface AboutProps {
  profile: Profile | null;
}

function AnimatedCounter({ target, suffix = "", duration = 2 }: {
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
        animate={inView ? { innerText: target } as never : {}}
        transition={{ duration, ease: "easeOut" }}
        onUpdate={(latest: Record<string, number>) => {
          if (ref.current) {
            ref.current.textContent = `${Math.round(latest.innerText || 0)}${suffix}`;
          }
        }}
      >
        0{suffix}
      </motion.span>
    </motion.span>
  );
}

const timelineItems = [
  {
    icon: GraduationCap,
    title: "Started Learning",
    description: "Began coding journey with C/C++ and web basics",
    color: "from-blue-500 to-cyan-500",
    year: "2020",
  },
  {
    icon: Code,
    title: "Full Stack Development",
    description: "Mastered React, Node.js, and cloud platforms",
    color: "from-purple-500 to-blue-500",
    year: "2022",
  },
  {
    icon: Zap,
    title: "AI/ML Focus",
    description: "Dove deep into LLMs, RAG, and AI agent systems",
    color: "from-cyan-500 to-purple-500",
    year: "2023",
  },
  {
    icon: Briefcase,
    title: "Professional Work",
    description: "Building production-grade AI-powered applications",
    color: "from-emerald-500 to-cyan-500",
    year: "2024",
  },
];

// Import Code icon separately
import { Code } from "lucide-react";

const stats = [
  { value: 3, suffix: "+", label: "Years Experience", icon: Calendar },
  { value: 50, suffix: "+", label: "Projects Built", icon: Briefcase },
  { value: 20, suffix: "+", label: "Certificates", icon: GraduationCap },
  { value: 10, suffix: "+", label: "Technologies", icon: Zap },
];

export default function About({ profile }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden bg-[#020617]"
    >
      {/* Background decoration */}
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

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">

          {/* Left — Profile image + cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            {/* Image */}
            <div className="relative mx-auto max-w-sm">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {profile?.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile.name}
                    width={400}
                    height={500}
                    className="w-full h-[400px] object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-[400px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <User size={80} className="text-slate-600" />
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />

                {/* Name overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass rounded-xl px-4 py-3">
                    <div className="font-bold text-white">{profile?.name || "Mayank Choudhary"}</div>
                    <div className="text-xs text-cyan-400 mt-0.5">{profile?.title || "AI & Full Stack Developer"}</div>
                  </div>
                </div>
              </div>

              {/* Floating info cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 glass rounded-xl px-4 py-3 border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-cyan-400" />
                  <span className="text-sm text-slate-300">{profile?.location || "India"}</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-purple-400" />
                  <span className="text-sm text-slate-300">Open to Work</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="space-y-8"
          >
            {/* About text */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Building the{" "}
                <span className="gradient-text">Future</span> with AI
              </h3>
              <div className="space-y-4">
                {(profile?.about || "I'm a passionate developer who loves building intelligent systems.")
                  .split(". ")
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((sentence, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="text-slate-400 leading-relaxed"
                    >
                      {sentence}{sentence.endsWith(".") ? "" : "."}
                    </motion.p>
                  ))}
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Mail, label: "Email", value: profile?.email || "—" },
                { icon: MapPin, label: "Location", value: profile?.location || "—" },
                { icon: Briefcase, label: "Role", value: profile?.title || "Developer" },
                { icon: Calendar, label: "Experience", value: `${profile?.yearsExperience || 3}+ years` },
              ].map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                  className="glass-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <info.icon size={14} className="text-cyan-400" />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{info.label}</span>
                  </div>
                  <div className="text-sm text-slate-300 font-medium truncate">{info.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Mission statement */}
            <div className="glass-card rounded-2xl p-6 border border-cyan-500/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap size={15} className="text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">Mission</div>
                  <div className="text-sm text-slate-400 leading-relaxed">
                    I believe in building technology that doesn&apos;t just work — it delights. Every line of code is an opportunity to create something meaningful.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <stat.icon size={18} className="text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {inView ? (
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    duration={2}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            My <span className="gradient-text">Journey</span>
          </h3>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden md:block" />

            <div className="space-y-8">
              {timelineItems.map((item, i) => {
                const Icon = item.icon;
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`flex items-center gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className={`glass-card rounded-2xl p-6 inline-block w-full`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={15} className="text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{item.title}</div>
                            <div className="text-xs text-cyan-400">{item.year}</div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400">{item.description}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex w-0 items-center justify-center relative">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 ring-4 ring-[#020617] relative z-10" />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}