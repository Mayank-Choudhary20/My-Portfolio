"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiNestjs, SiPostgresql, SiMongodb,
  SiPrisma, SiPython, SiTensorflow, SiDocker, SiGit,
  SiRedis, SiGraphql, SiJavascript, SiHtml5, SiFigma,
  SiVuedotjs, SiAngular, SiKubernetes, SiGooglecloud,
  SiMysql, SiRust, SiGo, SiFlutter, SiDart, SiFirebase,
  SiSupabase, SiVercel, SiNetlify, SiNginx, SiLinux as SiLinuxIcon,
} from "react-icons/si";
import { FaAws, FaBrain, FaJava, FaPhp, FaSwift, FaDatabase, FaServer } from "react-icons/fa";
import { Layers, Server, Database, Cloud, Code2, Cpu, Sparkles, Box, Star, Clock } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Skill } from "@/types/portfolio";

interface SkillsProps {
  skills: Skill[];
}

const ICON_REGISTRY: Array<[string[], React.ElementType]> = [
  [["react", "reactjs", "react.js"], SiReact],
  [["nextjs", "next.js", "next", "nextdotjs"], SiNextdotjs],
  [["typescript", "ts"], SiTypescript],
  [["tailwind", "tailwindcss", "tailwind css"], SiTailwindcss],
  [["nodejs", "node.js", "node", "express", "expressjs"], SiNodedotjs],
  [["nestjs", "nest", "nest.js"], SiNestjs],
  [["postgresql", "postgres", "pg"], SiPostgresql],
  [["mongodb", "mongo"], SiMongodb],
  [["mysql", "mariadb"], SiMysql],
  [["prisma"], SiPrisma],
  [["python"], SiPython],
  [["tensorflow", "tf"], SiTensorflow],
  [["docker"], SiDocker],
  [["git", "github", "gitlab"], SiGit],
  [["redis"], SiRedis],
  [["graphql", "gql"], SiGraphql],
  [["javascript", "js", "es6"], SiJavascript],
  [["html", "html5"], SiHtml5],
  [["figma"], SiFigma],
  [["vue", "vuejs", "vue.js"], SiVuedotjs],
  [["angular"], SiAngular],
  [["kubernetes", "k8s"], SiKubernetes],
  [["gcp", "google cloud", "googlecloud"], SiGooglecloud],
  [["aws", "amazon", "amazon web services", "s3", "ec2", "lambda"], FaAws],
  [["java", "spring", "springboot"], FaJava],
  [["php", "laravel"], FaPhp],
  [["swift", "ios", "xcode"], FaSwift],
  [["rust"], SiRust],
  [["go", "golang"], SiGo],
  [["flutter"], SiFlutter],
  [["dart"], SiDart],
  [["firebase"], SiFirebase],
  [["supabase"], SiSupabase],
  [["vercel"], SiVercel],
  [["netlify"], SiNetlify],
  [["nginx"], SiNginx],
  [["linux", "ubuntu", "debian"], SiLinuxIcon],
  [["openai", "chatgpt", "gpt", "llm", "langchain", "rag", "ai", "ml", "machine learning", "huggingface"], FaBrain],
  [["database", "db", "sql"], FaDatabase],
  [["server", "backend", "api"], FaServer],
];

function resolveIcon(skillName: string): React.ElementType {
  const normalized = skillName.toLowerCase().trim().replace(/[\s\-_.]/g, "");
  const original = skillName.toLowerCase().trim();
  for (const [keys, Icon] of ICON_REGISTRY) {
    for (const key of keys) {
      const keyNorm = key.replace(/[\s\-_.]/g, "");
      if (normalized === keyNorm || original === key || normalized.includes(keyNorm) || keyNorm.includes(normalized)) {
        return Icon;
      }
    }
  }
  return Code2;
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ElementType; gradient: string; glow: string; border: string }> = {
  Frontend:    { label: "Frontend",    icon: Layers,   gradient: "from-blue-500 to-cyan-400",    glow: "rgba(59,130,246,0.25)",   border: "rgba(59,130,246,0.3)" },
  Backend:     { label: "Backend",     icon: Server,   gradient: "from-emerald-500 to-teal-400", glow: "rgba(16,185,129,0.25)",   border: "rgba(16,185,129,0.3)" },
  Database:    { label: "Database",    icon: Database, gradient: "from-orange-500 to-amber-400", glow: "rgba(249,115,22,0.25)",   border: "rgba(249,115,22,0.3)" },
  Cloud:       { label: "Cloud",       icon: Cloud,    gradient: "from-sky-500 to-blue-400",      glow: "rgba(14,165,233,0.25)",   border: "rgba(14,165,233,0.3)" },
  AI:          { label: "AI / ML",     icon: Cpu,      gradient: "from-purple-500 to-pink-400",  glow: "rgba(168,85,247,0.25)",   border: "rgba(168,85,247,0.3)" },
  DevOps:      { label: "DevOps",      icon: Box,      gradient: "from-red-500 to-orange-400",   glow: "rgba(239,68,68,0.25)",    border: "rgba(239,68,68,0.3)" },
  Programming: { label: "Programming", icon: Code2,    gradient: "from-violet-500 to-purple-400",glow: "rgba(139,92,246,0.25)",   border: "rgba(139,92,246,0.3)" },
  Other:       { label: "Other",       icon: Sparkles, gradient: "from-slate-500 to-slate-400",  glow: "rgba(148,163,184,0.2)",   border: "rgba(148,163,184,0.2)" },
};

const getCategory = (cat: string) => CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG.Other;

const LEVEL_DATA: Record<string, { percent: number; label: string; color: string }> = {
  BEGINNER:     { percent: 25, label: "Beginner",     color: "from-slate-400 to-slate-500" },
  INTERMEDIATE: { percent: 55, label: "Intermediate", color: "from-blue-400 to-cyan-400"   },
  ADVANCED:     { percent: 80, label: "Advanced",     color: "from-cyan-400 to-blue-500"   },
  EXPERT:       { percent: 95, label: "Expert",       color: "from-cyan-400 to-purple-500" },
  beginner:     { percent: 25, label: "Beginner",     color: "from-slate-400 to-slate-500" },
  intermediate: { percent: 55, label: "Intermediate", color: "from-blue-400 to-cyan-400"   },
  advanced:     { percent: 80, label: "Advanced",     color: "from-cyan-400 to-blue-500"   },
  expert:       { percent: 95, label: "Expert",       color: "from-cyan-400 to-purple-500" },
};

const getLevel = (level: string) => LEVEL_DATA[level] ?? { percent: 50, label: level, color: "from-blue-400 to-cyan-400" };

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-30px" });

  const Icon = resolveIcon(skill.name);
  const cat = getCategory(skill.category);
  const lvl = getLevel(skill.level);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTiltX(((e.clientY - r.top) / r.height - 0.5) * -12);
    setTiltY(((e.clientX - r.left) / r.width - 0.5) * 12);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTiltX(0); setTiltY(0); }}
      onMouseMove={onMouseMove}
      style={{
        transform: hovered
          ? `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(12px)`
          : "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
        transition: hovered ? "transform 0.08s ease" : "transform 0.5s ease",
      }}
      className="relative group cursor-default select-none"
    >
      {/* Glow backdrop */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
        style={{ background: `linear-gradient(135deg, ${cat.glow}, transparent)` }}
      />

      <div
        className="relative rounded-2xl p-5 flex flex-col gap-3 h-full"
        style={{
          background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          border: hovered ? `1px solid ${cat.border}` : "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          transition: "background 0.3s, border 0.3s",
        }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
            animate={hovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
            style={{ boxShadow: hovered ? `0 8px 25px ${cat.glow}` : undefined }}
          >
            <Icon size={22} className="text-white drop-shadow" />
          </motion.div>

          <div className="flex flex-col items-end gap-1">
            {/* Featured badge */}
            {skill.featured && (
              <div
                className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  color: "#fbbf24",
                }}
              >
                <Star size={7} fill="currentColor" />
                Top
              </div>
            )}
            {/* Level badge */}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide border ${
                lvl.percent >= 80
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  : lvl.percent >= 55
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-slate-500/10 text-slate-400 border-slate-500/20"
              }`}
            >
              {lvl.label}
            </span>
          </div>
        </div>

        {/* Name */}
        <div>
          <p className="text-sm font-bold text-white leading-tight">{skill.name}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{skill.category}</p>
          {/* Years */}
          {skill.years && skill.years > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Clock size={9} className="text-slate-700" />
              <span className="text-[10px] text-slate-600">
                {skill.years}yr experience
              </span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-slate-600">Proficiency</span>
            <span className="text-[10px] text-slate-400 font-mono">{lvl.percent}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${lvl.color}`}
              initial={{ width: 0 }}
              animate={inView ? { width: `${lvl.percent}%` } : { width: 0 }}
              transition={{ delay: index * 0.04 + 0.4, duration: 1.2, ease: "easeOut" }}
              style={{ boxShadow: hovered ? `0 0 8px ${cat.glow}` : undefined }}
            />
          </div>
        </div>

        {/* Shimmer */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "200%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Skills({ skills }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const rawCategories = Array.from(new Set(skills.map((s) => s.category)));
  const categories = ["All", ...rawCategories];
  const featuredCount = skills.filter((s) => s.featured).length;

  const filtered = skills.filter((s) => {
    const catMatch = activeCategory === "All" || s.category === activeCategory;
    const featuredMatch = !showFeaturedOnly || s.featured;
    return catMatch && featuredMatch;
  });

  return (
    <section className="relative py-32 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-cyan-600/5 blur-[120px]" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-purple-600/5 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative section-container">
        <SectionTitle
          label="Technical Skills"
          title="My Tech"
          highlight="Arsenal"
          description="Technologies I use to craft exceptional digital experiences — from pixels to infrastructure."
        />

        {/* Featured toggle */}
        {featuredCount > 0 && (
          <div className="flex justify-center mb-6">
            <motion.button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: showFeaturedOnly
                  ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.08))"
                  : "rgba(255,255,255,0.03)",
                border: showFeaturedOnly
                  ? "1px solid rgba(245,158,11,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                color: showFeaturedOnly ? "#fbbf24" : "#64748b",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Star size={13} fill={showFeaturedOnly ? "currentColor" : "none"} />
              Featured Skills
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                style={{
                  background: showFeaturedOnly ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)",
                  color: showFeaturedOnly ? "#fbbf24" : "#64748b",
                }}
              >
                {featuredCount}
              </span>
            </motion.button>
          </div>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const isActive = activeCategory === cat;
            const count = cat === "All" ? skills.length : skills.filter((s) => s.category === cat).length;
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  background: isActive ? "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.15))" : "rgba(255,255,255,0.03)",
                  border: isActive ? "1px solid rgba(0,229,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  color: isActive ? "#fff" : "#64748b",
                  boxShadow: isActive ? "0 0 20px rgba(0,229,255,0.15)" : "none",
                }}
              >
                {cfg && <cfg.icon size={13} className={isActive ? "text-cyan-400" : "text-slate-600"} />}
                <span>{cfg?.label ?? cat}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                  style={{
                    background: isActive ? "rgba(0,229,255,0.2)" : "rgba(255,255,255,0.05)",
                    color: isActive ? "#00e5ff" : "#64748b",
                  }}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Count line */}
        <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <span className="text-xs text-slate-600 font-mono">
            {filtered.length} skill{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${showFeaturedOnly}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {filtered.map((skill, i) => (
              <SkillCard key={skill.id} skill={skill} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-slate-600" />
            </div>
            <p className="text-slate-600 text-sm">No skills in this category.</p>
          </motion.div>
        )}

        {/* Summary stats */}
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Total Skills",  value: skills.length,                                                           icon: Sparkles, color: "text-cyan-400"   },
              { label: "Categories",    value: rawCategories.length,                                                    icon: Layers,   color: "text-blue-400"   },
              { label: "Expert Level",  value: skills.filter((s) => s.level.toUpperCase() === "EXPERT").length,         icon: Cpu,      color: "text-purple-400" },
              { label: "Featured",      value: featuredCount,                                                           icon: Star,     color: "text-amber-400"  },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}