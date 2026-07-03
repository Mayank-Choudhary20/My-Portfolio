"use client";

import { useState, useRef, type RefObject } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  ChevronDown,
  Calendar,
  Briefcase,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Experience as ExperienceType } from "@/types/portfolio";

interface ExperienceProps {
  experience: ExperienceType[];
}

/* ─── Constants ─────────────────────────────────────────────────────────── */
const CENTER_COL_WIDTH = 72;
const CARD_MAX_WIDTH = 520;
const CARD_GUTTER = 12;

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function formatDate(dateStr?: string): string {
  if (!dateStr) return "Present";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getDuration(start: string, end?: string, current?: boolean): string {
  const s = new Date(start);
  const e = end && !current ? new Date(end) : new Date();
  const m =
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const y = Math.floor(m / 12);
  const r = m % 12;
  if (y === 0) return `${r}mo`;
  if (r === 0) return `${y}yr`;
  return `${y}yr ${r}mo`;
}

/* ─── Scroll-driven vertical line ───────────────────────────────────────── */
function AnimatedVerticalLine({
  containerRef,
  left,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  left: string | number;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left,
        transform: "translateX(-50%)",
        width: "2px",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Base dim line */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "999px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,229,255,0.08) 10%, rgba(59,130,246,0.08) 90%, transparent 100%)",
        }}
      />
      {/* Base glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "-4px",
          right: "-4px",
          borderRadius: "999px",
          filter: "blur(8px)",
          opacity: 0.4,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,229,255,0.12) 15%, rgba(59,130,246,0.12) 85%, transparent 100%)",
        }}
      />
      {/* Animated fill */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "999px",
          scaleY,
          transformOrigin: "top center",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,229,255,0.6) 15%, rgba(59,130,246,0.6) 85%, transparent 100%)",
          boxShadow: "0 0 12px rgba(0,229,255,0.3)",
        }}
      />
      {/* Animated outer glow */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "-3px",
          right: "-3px",
          borderRadius: "999px",
          scaleY,
          transformOrigin: "top center",
          filter: "blur(10px)",
          opacity: 0.75,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,229,255,0.35) 15%, rgba(59,130,246,0.35) 85%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ─── Timeline dot ──────────────────────────────────────────────────────── */
function TimelineDot({
  index,
  inView,
  isCurrent,
}: {
  index: number;
  inView: boolean;
  isCurrent?: boolean;
}) {
  const gradientColors = isCurrent
    ? "linear-gradient(135deg, #10b981, #06b6d4)"
    : "linear-gradient(135deg, #00e5ff, #3b82f6)";

  const glowColor = isCurrent
    ? "rgba(16,185,129,0.7)"
    : "rgba(0,229,255,0.7)";

  const pulseColor = isCurrent
    ? "rgba(16,185,129,0.15)"
    : "rgba(0,229,255,0.12)";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{
        delay: index * 0.1 + 0.2,
        type: "spring",
        stiffness: 260,
        damping: 18,
      }}
      style={{
        position: "relative",
        width: "20px",
        height: "20px",
        zIndex: 2,
      }}
    >
      {/* Outer pulse */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "999px",
          background: pulseColor,
        }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{
          duration: isCurrent ? 2 : 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2,
        }}
      />
      {/* Inner pulse */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-2px",
          borderRadius: "999px",
          background: pulseColor,
        }}
        animate={{ scale: [1, 1.45, 1], opacity: [0.75, 0, 0.75] }}
        transition={{
          duration: isCurrent ? 2 : 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2 + 0.4,
        }}
      />
      {/* Dot */}
      <div
        style={{
          position: "relative",
          width: "20px",
          height: "20px",
          borderRadius: "999px",
          background: gradientColors,
          boxShadow: `0 0 0 3px #020617, 0 0 16px ${glowColor}, 0 0 28px ${glowColor.replace("0.7", "0.25")}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "999px",
            background: "#020617",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Connector ─────────────────────────────────────────────────────────── */
function Connector({
  isLeft,
  inView,
}: {
  isLeft: boolean;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={inView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: 0.25,
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{
        position: "absolute",
        top: "41px",
        width: `${CARD_GUTTER}px`,
        height: "2px",
        borderRadius: "999px",
        boxShadow: "0 0 8px rgba(0,229,255,0.35)",
        ...(isLeft
          ? {
              right: 0,
              transformOrigin: "right center",
              background:
                "linear-gradient(90deg, rgba(0,229,255,0.15), rgba(0,229,255,0.75))",
            }
          : {
              left: 0,
              transformOrigin: "left center",
              background:
                "linear-gradient(90deg, rgba(0,229,255,0.75), rgba(0,229,255,0.15))",
            }),
      }}
    />
  );
}

/* ─── Desktop card content ──────────────────────────────────────────────── */
function DesktopExperienceCard({
  exp,
  index,
  isLeft,
  inView,
}: {
  exp: ExperienceType;
  index: number;
  isLeft: boolean;
  inView: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -48 : 48 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.75,
        delay: index * 0.08,
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{
        width: "100%",
        maxWidth: `${CARD_MAX_WIDTH}px`,
      }}
    >
      <motion.div
        className="group relative overflow-hidden rounded-2xl cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{
          y: -6,
          borderColor: "rgba(0,229,255,0.25)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,229,255,0.08), 0 0 40px rgba(0,229,255,0.08)",
        }}
        transition={{ duration: 0.28 }}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: expanded
            ? "1px solid rgba(0,229,255,0.2)"
            : "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Top gradient border */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,229,255,0.45), rgba(59,130,246,0.45), transparent)",
          }}
        />
        {/* Corner glow */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-28 w-28 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(0,229,255,0.12), transparent 70%)",
          }}
        />

        {/* Header */}
        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            {/* Company logo */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ duration: 0.25 }}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {exp.companyLogo ? (
                <Image
                  src={exp.companyLogo}
                  alt={exp.company}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-1"
                  unoptimized
                />
              ) : (
                <Building2 size={20} className="text-slate-500" />
              )}
            </motion.div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#ffffff",
                      lineHeight: 1.35,
                      margin: 0,
                      marginBottom: "4px",
                    }}
                  >
                    {exp.role}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Building2 size={12} color="#00e5ff" />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#00e5ff",
                      }}
                    >
                      {exp.company}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                >
                  {exp.current && (
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "999px",
                        fontWeight: 600,
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        color: "#10b981",
                      }}
                    >
                      Current
                    </span>
                  )}
                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-slate-500" />
                  </motion.div>
                </div>
              </div>

              {/* Date + duration */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "12px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    color: "#93c5fd",
                  }}
                >
                  <Calendar size={10} />
                  {formatDate(exp.startDate)} —{" "}
                  {exp.current ? "Present" : formatDate(exp.endDate)}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94a3b8",
                  }}
                >
                  <Clock size={10} />
                  {getDuration(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable section */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "16px 24px 24px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* Description bullets */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: exp.technologies?.length ? "20px" : 0,
                  }}
                >
                  {exp.description
                    .split(". ")
                    .filter(Boolean)
                    .map((sentence, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <ChevronRight
                          size={13}
                          color="#06b6d4"
                          style={{ marginTop: "2px", flexShrink: 0 }}
                        />
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#94a3b8",
                            lineHeight: 1.6,
                            margin: 0,
                          }}
                        >
                          {sentence}
                          {sentence.endsWith(".") ? "" : "."}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Tech stack */}
                {exp.technologies?.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "10px",
                        fontWeight: 500,
                      }}
                    >
                      Technologies Used
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {exp.technologies.map((tech) => (
                        <motion.span
                          key={tech}
                          whileHover={{
                            borderColor: "rgba(0,229,255,0.3)",
                            color: "#00e5ff",
                            background: "rgba(0,229,255,0.05)",
                          }}
                          style={{
                            fontSize: "11px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontWeight: 500,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#94a3b8",
                            cursor: "default",
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─── Desktop timeline row ──────────────────────────────────────────────── */
function DesktopTimelineItem({
  exp,
  index,
  isLeft,
  isLast,
}: {
  exp: ExperienceType;
  index: number;
  isLeft: boolean;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const bottomSpacing = isLast ? "0px" : "44px";

  return (
    <>
      {/* Left column */}
      <div
        style={{
          gridColumn: "1 / 2",
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: `${CARD_GUTTER}px`,
          paddingBottom: bottomSpacing,
          position: "relative",
        }}
      >
        {isLeft ? (
          <>
            <Connector isLeft={true} inView={inView} />
            <DesktopExperienceCard
              exp={exp}
              index={index}
              isLeft={true}
              inView={inView}
            />
          </>
        ) : (
          <div style={{ width: "100%", minHeight: 1 }} />
        )}
      </div>

      {/* Center dot column */}
      <div
        ref={ref}
        style={{
          gridColumn: "2 / 3",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ paddingTop: "32px" }}>
          <TimelineDot
            index={index}
            inView={inView}
            isCurrent={exp.current}
          />
        </div>
      </div>

      {/* Right column */}
      <div
        style={{
          gridColumn: "3 / 4",
          display: "flex",
          justifyContent: "flex-start",
          paddingLeft: `${CARD_GUTTER}px`,
          paddingBottom: bottomSpacing,
          position: "relative",
        }}
      >
        {!isLeft ? (
          <>
            <Connector isLeft={false} inView={inView} />
            <DesktopExperienceCard
              exp={exp}
              index={index}
              isLeft={false}
              inView={inView}
            />
          </>
        ) : (
          <div style={{ width: "100%", minHeight: 1 }} />
        )}
      </div>
    </>
  );
}

/* ─── Desktop grid ──────────────────────────────────────────────────────── */
function DesktopTimeline({
  experience,
}: {
  experience: ExperienceType[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `minmax(0, 1fr) ${CENTER_COL_WIDTH}px minmax(0, 1fr)`,
        alignItems: "start",
        width: "100%",
      }}
    >
      <AnimatedVerticalLine containerRef={containerRef} left="50%" />
      {experience.map((exp, index) => (
        <DesktopTimelineItem
          key={exp.id}
          exp={exp}
          index={index}
          isLeft={index % 2 === 0}
          isLast={index === experience.length - 1}
        />
      ))}
    </div>
  );
}

/* ─── Mobile card ───────────────────────────────────────────────────────── */
function MobileExperienceCard({
  exp,
  index,
}: {
  exp: ExperienceType;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{ position: "relative", paddingLeft: "40px" }}
    >
      {/* Connector */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.45, delay: 0.18 }}
        style={{
          position: "absolute",
          left: "10px",
          top: "33px",
          width: "20px",
          height: "2px",
          borderRadius: "999px",
          transformOrigin: "left center",
          background:
            "linear-gradient(90deg, rgba(0,229,255,0.75), rgba(0,229,255,0.15))",
          boxShadow: "0 0 8px rgba(0,229,255,0.35)",
        }}
      />

      {/* Dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{
          delay: index * 0.08 + 0.1,
          type: "spring",
          stiffness: 250,
          damping: 18,
        }}
        style={{
          position: "absolute",
          left: 0,
          top: "24px",
          width: "20px",
          height: "20px",
          borderRadius: "999px",
          background: exp.current
            ? "linear-gradient(135deg, #10b981, #06b6d4)"
            : "linear-gradient(135deg, #00e5ff, #3b82f6)",
          boxShadow: exp.current
            ? "0 0 0 3px #020617, 0 0 14px rgba(16,185,129,0.6)"
            : "0 0 0 3px #020617, 0 0 14px rgba(0,229,255,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "999px",
            background: "#020617",
          }}
        />
      </motion.div>

      {/* Card */}
      <motion.div
        className="group relative overflow-hidden rounded-2xl cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{
          y: -4,
          borderColor: "rgba(0,229,255,0.2)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
        }}
        transition={{ duration: 0.25 }}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: expanded
            ? "1px solid rgba(0,229,255,0.2)"
            : "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,229,255,0.4), rgba(59,130,246,0.4), transparent)",
          }}
        />

        <div style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {exp.companyLogo ? (
                <Image
                  src={exp.companyLogo}
                  alt={exp.company}
                  width={40}
                  height={40}
                  className="h-full w-full object-contain p-1"
                  unoptimized
                />
              ) : (
                <Building2 size={18} className="text-slate-500" />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#ffffff",
                      lineHeight: 1.35,
                      margin: 0,
                      marginBottom: "3px",
                    }}
                  >
                    {exp.role}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Building2 size={11} color="#00e5ff" />
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#00e5ff",
                      }}
                    >
                      {exp.company}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                  }}
                >
                  {exp.current && (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "999px",
                        fontWeight: 600,
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        color: "#10b981",
                      }}
                    >
                      Current
                    </span>
                  )}
                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} className="text-slate-500" />
                  </motion.div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "10px",
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    color: "#93c5fd",
                  }}
                >
                  <Calendar size={9} />
                  {formatDate(exp.startDate)} —{" "}
                  {exp.current ? "Present" : formatDate(exp.endDate)}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "10px",
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94a3b8",
                  }}
                >
                  <Clock size={9} />
                  {getDuration(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "14px 20px 20px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: exp.technologies?.length ? "16px" : 0,
                  }}
                >
                  {exp.description
                    .split(". ")
                    .filter(Boolean)
                    .map((sentence, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <ChevronRight
                          size={12}
                          color="#06b6d4"
                          style={{ marginTop: "2px", flexShrink: 0 }}
                        />
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#94a3b8",
                            lineHeight: 1.6,
                            margin: 0,
                          }}
                        >
                          {sentence}
                          {sentence.endsWith(".") ? "" : "."}
                        </p>
                      </div>
                    ))}
                </div>

                {exp.technologies?.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Technologies Used
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: "10px",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontWeight: 500,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#94a3b8",
                          }}
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
      </motion.div>
    </motion.div>
  );
}

/* ─── Mobile timeline ───────────────────────────────────────────────────── */
function MobileTimeline({
  experience,
}: {
  experience: ExperienceType[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="md:hidden"
      style={{ position: "relative" }}
    >
      <AnimatedVerticalLine containerRef={containerRef} left={10} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {experience.map((exp, index) => (
          <MobileExperienceCard key={exp.id} exp={exp} index={index} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────────────── */
export default function Experience({ experience }: ExperienceProps) {
  const currentJobs = experience.filter((e) => e.current);
  const pastJobs = experience.filter((e) => !e.current);

  const statItems = [
    {
      label: "Total Roles",
      value: experience.length,
      icon: Briefcase,
      color: "#60a5fa",
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.15)",
    },
    {
      label: "Current",
      value: currentJobs.length,
      icon: Building2,
      color: "#34d399",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.15)",
    },
    {
      label: "Previous",
      value: pastJobs.length,
      icon: Calendar,
      color: "#a78bfa",
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.15)",
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "#020617" }}
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute left-[-10%] top-[18%] h-[560px] w-[560px] rounded-full bg-cyan-500/[0.035] blur-[130px]" />
        <div className="absolute bottom-[18%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.035] blur-[130px]" />

        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-20 opacity-[0.04]"
        >
          <Briefcase size={90} className="text-cyan-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-24 left-[8%] opacity-[0.04]"
        >
          <Building2 size={80} className="text-blue-400" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        >
          <SectionTitle
            label="Work Experience"
            title="My Professional"
            highlight="Journey"
            description="A timeline of roles where I've shipped impactful products and led engineering initiatives."
          />
        </motion.div>

        {experience.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: "center",
              padding: "80px 0",
            }}
          >
            <Briefcase
              size={48}
              style={{ color: "#334155", margin: "0 auto 16px" }}
            />
            <p style={{ color: "#475569", fontSize: "14px" }}>
              No experience entries yet.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block w-full">
              <DesktopTimeline experience={experience} />
            </div>

            {/* Mobile */}
            <MobileTimeline experience={experience} />
          </>
        )}

        {/* Stats */}
        {experience.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-20 flex flex-wrap justify-center gap-4"
          >
            {statItems.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ duration: 0.25 }}
                className="flex cursor-default items-center gap-4 rounded-2xl px-6 py-4"
                style={{
                  background: stat.bg,
                  border: `1px solid ${stat.border}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: stat.bg,
                    border: `1px solid ${stat.border}`,
                  }}
                >
                  <stat.icon size={18} color={stat.color} />
                </div>
                <div>
                  <div className="text-2xl font-black leading-none text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-500">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}