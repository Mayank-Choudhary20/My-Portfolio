"use client";

import { useRef, type RefObject } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  ExternalLink,
  MapPin,
  Star,
  Clock,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Education as EducationType } from "@/types/portfolio";

interface EducationProps {
  education: EducationType[];
}

const CENTER_COL_WIDTH = 72;
const CARD_MAX_WIDTH = 520;
const CARD_GUTTER = 12;

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Present";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getDuration(start: string, end?: string): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const m =
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const y = Math.floor(m / 12);
  const r = m % 12;
  if (y === 0) return `${r}mo`;
  if (r === 0) return `${y}yr`;
  return `${y}yr ${r}mo`;
}

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
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "999px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,229,255,0.08) 10%, rgba(59,130,246,0.08) 90%, transparent 100%)",
        }}
      />
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

function TimelineDot({
  index,
  inView,
}: {
  index: number;
  inView: boolean;
}) {
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
      <motion.div
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "999px",
          background: "rgba(0,229,255,0.12)",
        }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2,
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          inset: "-2px",
          borderRadius: "999px",
          background: "rgba(0,229,255,0.18)",
        }}
        animate={{ scale: [1, 1.45, 1], opacity: [0.75, 0, 0.75] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2 + 0.4,
        }}
      />
      <div
        style={{
          position: "relative",
          width: "20px",
          height: "20px",
          borderRadius: "999px",
          background: "linear-gradient(135deg, #00e5ff, #3b82f6)",
          boxShadow:
            "0 0 0 3px #020617, 0 0 16px rgba(0,229,255,0.7), 0 0 28px rgba(0,229,255,0.25)",
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

function DesktopEducationCard({
  edu,
  index,
  isLeft,
  inView,
}: {
  edu: EducationType;
  index: number;
  isLeft: boolean;
  inView: boolean;
}) {
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
        className="group relative overflow-hidden rounded-2xl"
        whileHover={{
          y: -6,
          borderColor: "rgba(0,229,255,0.25)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,229,255,0.08), 0 0 40px rgba(0,229,255,0.08)",
        }}
        transition={{ duration: 0.28 }}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,229,255,0.45), rgba(59,130,246,0.45), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-28 w-28 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(0,229,255,0.12), transparent 70%)",
          }}
        />

        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
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
                background:
                  "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.15))",
                border: "1px solid rgba(0,229,255,0.25)",
                boxShadow: "0 0 20px rgba(0,229,255,0.08)",
              }}
            >
              <GraduationCap size={22} className="text-cyan-400" />
            </motion.div>

            <div style={{ flex: 1, minWidth: 0 }}>
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
                {edu.institution}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#00e5ff",
                  margin: 0,
                }}
              >
                {edu.degree}
                {edu.field && (
                  <span
                    style={{
                      color: "#64748b",
                      fontWeight: 400,
                    }}
                  >
                    {" "}
                    — {edu.field}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "20px",
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
              {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
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
              {getDuration(edu.startDate, edu.endDate)}
            </span>

            {edu.grade && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  color: "#fbbf24",
                  fontWeight: 600,
                }}
              >
                <Star size={9} fill="currentColor" />
                {edu.grade}
              </span>
            )}
          </div>

          {edu.description && (
            <p
              style={{
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: 1.65,
                margin: 0,
                marginBottom: edu.certificateUrl ? "20px" : 0,
              }}
            >
              {edu.description}
            </p>
          )}

          {edu.certificateUrl && (
            <motion.a
              href={edu.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                y: -2,
                background: "rgba(0,229,255,0.14)",
                boxShadow: "0 8px 24px rgba(0,229,255,0.14)",
              }}
              transition={{ duration: 0.2 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: "12px",
                background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.25)",
                color: "#00e5ff",
                textDecoration: "none",
              }}
            >
              <Award size={12} />
              View Certificate
              <ExternalLink size={10} />
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DesktopTimelineItem({
  edu,
  index,
  isLeft,
  isLast,
}: {
  edu: EducationType;
  index: number;
  isLeft: boolean;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const bottomSpacing = isLast ? "0px" : "44px";

  return (
    <>
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
            <DesktopEducationCard
              edu={edu}
              index={index}
              isLeft={true}
              inView={inView}
            />
          </>
        ) : (
          <div style={{ width: "100%", minHeight: 1 }} />
        )}
      </div>

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
          <TimelineDot index={index} inView={inView} />
        </div>
      </div>

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
            <DesktopEducationCard
              edu={edu}
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

function DesktopTimeline({ education }: { education: EducationType[] }) {
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
      {education.map((edu, index) => (
        <DesktopTimelineItem
          key={edu.id}
          edu={edu}
          index={index}
          isLeft={index % 2 === 0}
          isLast={index === education.length - 1}
        />
      ))}
    </div>
  );
}

function MobileEducationCard({
  edu,
  index,
}: {
  edu: EducationType;
  index: number;
}) {
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
      style={{
        position: "relative",
        paddingLeft: "40px",
      }}
    >
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
          background: "linear-gradient(135deg, #00e5ff, #3b82f6)",
          boxShadow:
            "0 0 0 3px #020617, 0 0 14px rgba(0,229,255,0.6), 0 0 24px rgba(0,229,255,0.2)",
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

      <motion.div
        className="group relative overflow-hidden rounded-2xl"
        whileHover={{
          y: -4,
          borderColor: "rgba(0,229,255,0.2)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
        }}
        transition={{ duration: 0.25 }}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
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
              marginBottom: "16px",
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
                background:
                  "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.15))",
                border: "1px solid rgba(0,229,255,0.2)",
              }}
            >
              <GraduationCap size={18} className="text-cyan-400" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
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
                {edu.institution}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#00e5ff",
                  margin: 0,
                }}
              >
                {edu.degree}
                {edu.field && (
                  <span style={{ color: "#64748b", fontWeight: 400 }}>
                    {" "}
                    — {edu.field}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "16px",
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
              {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
            </span>

            {edu.grade && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "10px",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "#fbbf24",
                  fontWeight: 600,
                }}
              >
                <Star size={8} fill="currentColor" />
                {edu.grade}
              </span>
            )}
          </div>

          {edu.description && (
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                lineHeight: 1.6,
                margin: 0,
                marginBottom: edu.certificateUrl ? "14px" : 0,
              }}
            >
              {edu.description}
            </p>
          )}

          {edu.certificateUrl && (
            <a
              href={edu.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "10px",
                background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.2)",
                color: "#00e5ff",
                textDecoration: "none",
              }}
            >
              <Award size={10} />
              View Certificate
              <ExternalLink size={9} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function MobileTimeline({ education }: { education: EducationType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="md:hidden" style={{ position: "relative" }}>
      <AnimatedVerticalLine containerRef={containerRef} left={10} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {education.map((edu, index) => (
          <MobileEducationCard key={edu.id} edu={edu} index={index} />
        ))}
      </div>
    </div>
  );
}

export default function Education({ education }: EducationProps) {
  if (!education || education.length === 0) return null;

  const statItems = [
    {
      label: "Institutions",
      value: education.length,
      icon: MapPin,
      color: "#00e5ff",
      bg: "rgba(0,229,255,0.08)",
      border: "rgba(0,229,255,0.15)",
    },
    {
      label: "Degrees",
      value: education.filter((e) => e.degree).length,
      icon: GraduationCap,
      color: "#60a5fa",
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.15)",
    },
    {
      label: "Certificates",
      value: education.filter((e) => e.certificateUrl).length,
      icon: Award,
      color: "#fbbf24",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.15)",
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "#020617" }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute left-[-10%] top-[18%] h-[560px] w-[560px] rounded-full bg-cyan-500/[0.035] blur-[130px]" />
        <div className="absolute bottom-[18%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.035] blur-[130px]" />

        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-20 opacity-[0.04]"
        >
          <GraduationCap size={100} className="text-cyan-400" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -8, 0] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-24 left-[8%] opacity-[0.04]"
        >
          <BookOpen size={80} className="text-blue-400" />
        </motion.div>
      </div>

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        >
          <SectionTitle
            label="Education"
            title="Academic"
            highlight="Journey"
            description="My educational background and the foundations that shaped my technical expertise."
            accent="cyan"
          />
        </motion.div>

        <div className="hidden md:block w-full">
          <DesktopTimeline education={education} />
        </div>

        <MobileTimeline education={education} />

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
      </div>
    </section>
  );
}