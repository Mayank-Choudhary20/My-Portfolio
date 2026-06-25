"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Smartphone,
  ExternalLink,
  X,
  Maximize2,
  Layers,
  Globe,
  RefreshCw,
  Info,
  Code2,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { FaGithub, FaAndroid } from "react-icons/fa";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Showcase as ShowcaseType } from "@/types/portfolio";

interface ShowcaseProps {
  showcase: ShowcaseType[];
}

interface ExtendedShowcase extends ShowcaseType {
  githubUrl?: string;
}

/* ── Safe image ──────────────────────────────────────────────── */
function SafeImg({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [err, setErr] = useState(false);
  if (err || !src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setErr(true)}
    />
  );
}

function isAppetize(url?: string) {
  return !!url && url.includes("appetize.io");
}

function isWebUrl(url?: string) {
  return (
    !!url &&
    !isAppetize(url) &&
    (url.startsWith("http://") || url.startsWith("https://"))
  );
}

/* ── Premium iPhone Frame ────────────────────────────────────── */
function PremiumPhoneFrame({
  url,
  title,
  imageUrl,
  interactive = true,
  size = "compact",
}: {
  url?: string;
  title: string;
  imageUrl?: string;
  interactive?: boolean;
  size?: "compact" | "modal";
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const hasLive = !!url;

  const cfg =
    size === "modal"
      ? {
          width: "220px",
          borderRadius: "40px",
          bezel: "4px",
          islandW: "76px",
          islandH: "22px",
          islandTop: "12px",
          statusH: "32px",
          timeFontSize: "10px",
          homeW: "60px",
          homeH: "4px",
          homeBottom: "7px",
          btnW: "3px",
          powerH: "36px",
          volH: "24px",
          silentH: "12px",
          camSize: "7px",
        }
      : {
          width: "130px",
          borderRadius: "28px",
          bezel: "3px",
          islandW: "50px",
          islandH: "14px",
          islandTop: "8px",
          statusH: "20px",
          timeFontSize: "7px",
          homeW: "38px",
          homeH: "3px",
          homeBottom: "4px",
          btnW: "2px",
          powerH: "22px",
          volH: "16px",
          silentH: "8px",
          camSize: "4px",
        };

  return (
    <div style={{ width: cfg.width }} className="mx-auto select-none">
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: cfg.borderRadius,
          background: "linear-gradient(145deg, #2e2e32, #1c1c1f, #0e0e10)",
          padding: cfg.bezel,
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.09),
            0 2px 4px rgba(255,255,255,0.04) inset,
            0 -2px 4px rgba(0,0,0,0.4) inset,
            0 30px 70px rgba(0,0,0,0.65),
            0 8px 25px rgba(0,0,0,0.45),
            0 0 40px rgba(0,229,255,0.04)
          `,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            borderRadius: cfg.borderRadius,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.03) 100%)",
          }}
        />
        <div
          className="relative overflow-hidden bg-black"
          style={{
            borderRadius: `calc(${cfg.borderRadius} - ${cfg.bezel})`,
            paddingTop: "216%",
          }}
        >
          <div
            className="absolute z-40 left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{
              top: cfg.islandTop,
              width: cfg.islandW,
              height: cfg.islandH,
              background: "#000",
              borderRadius: "100px",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                right: size === "modal" ? "10px" : "6px",
                width: cfg.camSize,
                height: cfg.camSize,
                background:
                  "radial-gradient(circle, #1e2030 30%, #0a0a14 70%)",
                boxShadow: "inset 0 0 2px rgba(0,229,255,0.12)",
              }}
            />
          </div>
          <div
            className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between"
            style={{
              height: cfg.statusH,
              paddingLeft: size === "modal" ? "18px" : "10px",
              paddingRight: size === "modal" ? "14px" : "8px",
            }}
          >
            <span
              className="font-semibold text-white tabular-nums"
              style={{ fontSize: cfg.timeFontSize }}
            >
              9:41
            </span>
            <div className="flex items-center gap-1">
              <div className="flex items-end gap-px">
                {[3, 5, 7, 9].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-sm bg-white"
                    style={{
                      width: size === "modal" ? "2px" : "1.5px",
                      height:
                        size === "modal"
                          ? `${h}px`
                          : `${Math.round(h * 0.55)}px`,
                    }}
                  />
                ))}
              </div>
              <div
                className="flex flex-col items-center justify-end"
                style={{
                  width: size === "modal" ? "12px" : "8px",
                  height: size === "modal" ? "9px" : "6px",
                }}
              >
                {[100, 65, 35].map((w, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-full mb-px"
                    style={{
                      width: `${w}%`,
                      height: size === "modal" ? "1.5px" : "1px",
                    }}
                  />
                ))}
              </div>
              <div
                className="relative rounded-sm border border-white/40 flex items-center overflow-hidden"
                style={{
                  width: size === "modal" ? "20px" : "13px",
                  height: size === "modal" ? "10px" : "6px",
                  padding: "1px",
                }}
              >
                <div
                  className="h-full rounded-sm bg-green-400"
                  style={{ width: "75%" }}
                />
                <div
                  className="absolute -right-[2px] top-1/2 -translate-y-1/2 rounded-r-sm bg-white/40"
                  style={{
                    width: "2px",
                    height: size === "modal" ? "5px" : "3px",
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className="absolute inset-0"
            style={{
              paddingTop: cfg.statusH,
              pointerEvents: interactive ? "auto" : "none",
            }}
          >
            {hasLive ? (
              <div className="relative w-full h-full">
                {!loaded && !error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 gap-2">
                    <motion.div
                      className="rounded-full border-2 border-cyan-500/30 border-t-cyan-400"
                      style={{
                        width: size === "modal" ? "28px" : "18px",
                        height: size === "modal" ? "28px" : "18px",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    {size === "modal" && (
                      <p className="text-[10px] text-slate-600">Loading…</p>
                    )}
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 p-3 gap-2">
                    {imageUrl ? (
                      <SafeImg
                        src={imageUrl}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                    ) : (
                      <>
                        <Smartphone
                          size={size === "modal" ? 28 : 18}
                          className="text-slate-700"
                        />
                        <p
                          className="text-slate-600 text-center"
                          style={{
                            fontSize: size === "modal" ? "10px" : "8px",
                          }}
                        >
                          Preview unavailable
                        </p>
                      </>
                    )}
                  </div>
                )}
                <iframe
                  src={url}
                  title={title}
                  className="w-full h-full border-0 bg-black"
                  onLoad={() => setLoaded(true)}
                  onError={() => setError(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  style={{ display: error ? "none" : "block" }}
                />
              </div>
            ) : imageUrl ? (
              <div className="relative w-full h-full bg-black">
                <SafeImg
                  src={imageUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <Smartphone
                  size={size === "modal" ? 32 : 20}
                  className="text-slate-700"
                />
              </div>
            )}
          </div>
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.04) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.01) 100%)",
              borderRadius: `calc(${cfg.borderRadius} - ${cfg.bezel})`,
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full z-40 pointer-events-none"
            style={{
              bottom: cfg.homeBottom,
              width: cfg.homeW,
              height: cfg.homeH,
              background: "rgba(255,255,255,0.28)",
            }}
          />
        </div>
        <div
          className="absolute rounded-l-full pointer-events-none"
          style={{
            right: `-${cfg.btnW}`,
            top: "28%",
            width: `calc(${cfg.btnW} + 1px)`,
            height: cfg.powerH,
            background:
              "linear-gradient(to bottom, #3a3a3e, #2a2a2e, #3a3a3e)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        <div
          className="absolute rounded-r-full pointer-events-none"
          style={{
            left: `-${cfg.btnW}`,
            top: "16%",
            width: `calc(${cfg.btnW} + 1px)`,
            height: cfg.silentH,
            background:
              "linear-gradient(to bottom, #3a3a3e, #2a2a2e, #3a3a3e)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        <div
          className="absolute rounded-r-full pointer-events-none"
          style={{
            left: `-${cfg.btnW}`,
            top: "25%",
            width: `calc(${cfg.btnW} + 1px)`,
            height: cfg.volH,
            background:
              "linear-gradient(to bottom, #3a3a3e, #2a2a2e, #3a3a3e)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        <div
          className="absolute rounded-r-full pointer-events-none"
          style={{
            left: `-${cfg.btnW}`,
            top: "35%",
            width: `calc(${cfg.btnW} + 1px)`,
            height: cfg.volH,
            background:
              "linear-gradient(to bottom, #3a3a3e, #2a2a2e, #3a3a3e)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
      </div>
    </div>
  );
}

/* ── Inline Laptop preview (card) ────────────────────────────── */
function LaptopPreview({
  url,
  title,
  imageUrl,
  compact = false,
}: {
  url?: string;
  title: string;
  imageUrl?: string;
  compact?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);
  const hasLive = isWebUrl(url);
  const screenH = compact ? "56%" : "60%";

  return (
    <div className="w-full px-2 pt-2 pb-1 select-none">
      <div
        className="relative rounded-t-xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg,#1e293b,#0f172a)",
          border: "2px solid #334155",
          paddingTop: screenH,
          boxShadow:
            "0 0 20px rgba(0,229,255,0.06), inset 0 0 10px rgba(0,0,0,0.4)",
        }}
      >
        <div className="absolute inset-0 flex flex-col">
          <div
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1"
            style={{
              background: "#1e293b",
              borderBottom: "1px solid #334155",
            }}
          >
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <div
              className="flex-1 flex items-center gap-1 px-1.5 py-0.5 rounded mx-1"
              style={{ background: "#0f172a", border: "1px solid #334155" }}
            >
              <Globe size={7} className="text-slate-500 flex-shrink-0" />
              <span className="text-[7px] text-slate-500 truncate font-mono">
                {url || title}
              </span>
            </div>
            {hasLive && (
              <button
                onClick={() => {
                  setKey((k) => k + 1);
                  setLoaded(false);
                  setError(false);
                }}
                className="w-4 h-4 flex items-center justify-center text-slate-600 hover:text-slate-400"
                title="Reload"
              >
                <RefreshCw size={7} />
              </button>
            )}
          </div>
          <div className="relative flex-1 bg-slate-950 overflow-hidden">
            {hasLive ? (
              <>
                {!loaded && !error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-950 z-10">
                    <div className="w-5 h-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                    <p className="text-[9px] text-slate-600">Loading…</p>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950 z-10 p-2">
                    {imageUrl ? (
                      <SafeImg
                        src={imageUrl}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-70"
                      />
                    ) : (
                      <>
                        <Globe size={20} className="text-slate-700" />
                        <p className="text-[9px] text-slate-600 text-center">
                          Preview blocked
                        </p>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-cyan-400 hover:underline flex items-center gap-0.5"
                        >
                          Open <ExternalLink size={7} />
                        </a>
                      </>
                    )}
                  </div>
                )}
                <iframe
                  key={key}
                  src={url}
                  title={title}
                  className="w-full h-full border-0"
                  onLoad={() => setLoaded(true)}
                  onError={() => setError(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  style={{ display: error ? "none" : "block" }}
                />
              </>
            ) : imageUrl ? (
              <SafeImg
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Monitor size={28} className="text-slate-700" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(to bottom,#334155,#1e293b)" }}
      />
      <div
        className="h-2 rounded-b-lg flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom,#1e293b,#0f172a)",
          border: "2px solid #334155",
          borderTop: "none",
        }}
      >
        <div
          className="w-10 h-1 rounded-full"
          style={{ background: "#334155" }}
        />
      </div>
    </div>
  );
}

/* ── Modal Laptop Frame (wide, edge-to-edge) ─────────────────── */
function ModalLaptopFrame({
  url,
  title,
  imageUrl,
}: {
  url?: string;
  title: string;
  imageUrl?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);
  const hasLive = isWebUrl(url);

  return (
    <div className="w-full select-none">
      {/* Screen */}
      <div
        className="relative rounded-t-xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg,#1e293b,#0f172a)",
          border: "3px solid #334155",
          height: "482px",
          boxShadow:
            "0 0 30px rgba(0,229,255,0.07), inset 0 0 15px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Browser chrome */}
          <div
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2"
            style={{
              background: "#1e293b",
              borderBottom: "1px solid #334155",
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <div
              className="flex-1 flex items-center gap-1 px-2 py-1 rounded-md mx-1"
              style={{ background: "#0f172a", border: "1px solid #334155" }}
            >
              <Globe size={8} className="text-slate-500 flex-shrink-0" />
              <span className="text-[8px] text-slate-500 truncate font-mono">
                {url || title}
              </span>
            </div>
            <button
              onClick={() => {
                setKey((k) => k + 1);
                setLoaded(false);
                setError(false);
              }}
              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors"
              title="Reload"
            >
              <RefreshCw size={9} />
            </button>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-cyan-400 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={9} />
              </a>
            )}
          </div>

          {/* Content */}
          <div className="relative flex-1 overflow-hidden bg-slate-950">
            {hasLive ? (
              <>
                {!loaded && !error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950 z-10">
                    <div className="w-6 h-6 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                    <p className="text-[9px] text-slate-600">Loading…</p>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950 z-10 p-3">
                    {imageUrl ? (
                      <SafeImg
                        src={imageUrl}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-60"
                      />
                    ) : (
                      <>
                        <Globe size={24} className="text-slate-700" />
                        <p className="text-[10px] text-slate-600 text-center">
                          Preview unavailable.{" "}
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline"
                          >
                            Open →
                          </a>
                        </p>
                      </>
                    )}
                  </div>
                )}
                <iframe
                  key={key}
                  src={url}
                  title={title}
                  className="w-full h-full border-0"
                  onLoad={() => setLoaded(true)}
                  onError={() => setError(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-navigation"
                  loading="lazy"
                  style={{ display: error ? "none" : "block" }}
                />
              </>
            ) : imageUrl ? (
              <SafeImg
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Monitor size={32} className="text-slate-700" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hinge */}
      <div
        className="h-1.5 w-full"
        style={{
          background: "linear-gradient(to bottom,#334155,#1e293b)",
        }}
      />

      {/* Base */}
      <div
        className="h-3 rounded-b-lg flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom,#1e293b,#0f172a)",
          border: "3px solid #334155",
          borderTop: "none",
        }}
      >
        <div
          className="w-12 h-1.5 rounded-full"
          style={{ background: "#334155" }}
        />
      </div>
    </div>
  );
}

/* ── Shared Info Panel ───────────────────────────────────────── */
function InfoPanel({
  item,
  appetize,
}: {
  item: ExtendedShowcase;
  appetize: boolean;
}) {
  const isPhone = item.type === "PHONE";

  return (
    <div className="space-y-5">
      {/* About */}
      <div>
        <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold flex items-center gap-1.5">
          <Info size={11} />
          About
        </h4>
        <p className="text-slate-400 leading-relaxed text-sm">
          {item.description}
        </p>
      </div>

      {/* Tech stack */}
      {item.technologies?.length > 0 && (
        <div>
          <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold flex items-center gap-1.5">
            <Code2 size={11} />
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{
                  background: "rgba(0,229,255,0.07)",
                  border: "1px solid rgba(0,229,255,0.18)",
                  color: "#67e8f9",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Status badges */}
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full font-semibold"
          style={{
            background: isPhone
              ? "rgba(168,85,247,0.08)"
              : "rgba(59,130,246,0.08)",
            border: isPhone
              ? "1px solid rgba(168,85,247,0.2)"
              : "1px solid rgba(59,130,246,0.2)",
            color: isPhone ? "#c084fc" : "#60a5fa",
          }}
        >
          {isPhone ? <Smartphone size={10} /> : <Monitor size={10} />}
          {isPhone ? "Mobile App" : "Web App"}
        </div>
        <div
          className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full font-semibold"
          style={{
            background: "rgba(0,229,255,0.06)",
            border: "1px solid rgba(0,229,255,0.15)",
            color: "#67e8f9",
          }}
        >
          <Zap size={10} />
          Live Project
        </div>
        {appetize && (
          <div
            className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full font-semibold"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#34d399",
            }}
          >
            <FaAndroid size={10} />
            Interactive Demo
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-1">
        {item.githubUrl && (
          <a
            href={item.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <FaGithub size={14} />
            Source Code
          </a>
        )}
        {item.liveUrl && !appetize && (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
              boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
            }}
          >
            <Globe size={14} />
            Open Live
          </a>
        )}
        {appetize && (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg,#10b981,#059669)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
            }}
          >
            <FaAndroid size={14} />
            Full Screen Demo
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Showcase Card ───────────────────────────────────────────── */
function ShowcaseCard({
  item,
  index,
  onExpand,
}: {
  item: ExtendedShowcase;
  index: number;
  onExpand: () => void;
}) {
  const isPhone = item.type === "PHONE";
  const appetize = isAppetize(item.liveUrl);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.09,
        ease: [0.23, 1, 0.32, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: hovered
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.03)",
        border: hovered
          ? "1px solid rgba(0,229,255,0.3)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered
          ? `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${
              isPhone ? "rgba(168,85,247,0.08)" : "rgba(0,229,255,0.08)"
            }`
          : "0 4px 20px rgba(0,0,0,0.25)",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${
            isPhone ? "rgba(168,85,247,0.08)" : "rgba(0,229,255,0.08)"
          }, transparent 60%)`,
        }}
      />

      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#0f172a 0%,#020617 100%)",
          minHeight: isPhone ? "260px" : "220px",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none z-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,1) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${
              isPhone ? "rgba(168,85,247,0.1)" : "rgba(0,229,255,0.1)"
            }, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />

        <div className="absolute top-2.5 left-2.5 z-20 flex gap-1.5">
          <div
            className={`flex items-center gap-1 text-[9px] px-2.5 py-0.5 rounded-full font-bold border backdrop-blur-md ${
              isPhone
                ? "text-purple-300 border-purple-500/30"
                : "text-cyan-300 border-cyan-500/30"
            }`}
            style={{
              background: isPhone
                ? "rgba(168,85,247,0.15)"
                : "rgba(0,229,255,0.12)",
            }}
          >
            {isPhone ? <Smartphone size={8} /> : <Monitor size={8} />}
            {isPhone ? "Mobile" : "Web"}
          </div>
          {appetize && (
            <div
              className="flex items-center gap-1 text-[9px] px-2.5 py-0.5 rounded-full font-bold border text-emerald-300 border-emerald-500/30 backdrop-blur-md"
              style={{ background: "rgba(16,185,129,0.15)" }}
            >
              <FaAndroid size={8} />
              Live
            </div>
          )}
        </div>

        <motion.button
          onClick={onExpand}
          className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
          style={{
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Expand"
        >
          <Maximize2 size={11} />
        </motion.button>

        {isPhone ? (
          <div
            className="flex justify-center items-center py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <PremiumPhoneFrame
              url={item.liveUrl}
              title={item.title}
              imageUrl={item.imageUrl}
              interactive={true}
              size="compact"
            />
          </div>
        ) : (
          <LaptopPreview
            url={item.liveUrl}
            title={item.title}
            imageUrl={item.imageUrl}
            compact
          />
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 relative">
        <div
          className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to right, transparent, ${
              isPhone ? "rgba(168,85,247,0.3)" : "rgba(0,229,255,0.3)"
            }, transparent)`,
          }}
        />

        <h3
          className="font-bold text-sm mb-1.5 leading-tight transition-colors duration-300"
          style={{
            color: hovered ? (isPhone ? "#c084fc" : "#00e5ff") : "white",
          }}
        >
          {item.title}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3 flex-1">
          {item.description}
        </p>

        {item.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[9px] px-2 py-0.5 rounded-md font-medium transition-all duration-300"
                style={{
                  background: hovered
                    ? "rgba(0,229,255,0.06)"
                    : "rgba(255,255,255,0.04)",
                  border: hovered
                    ? "1px solid rgba(0,229,255,0.12)"
                    : "1px solid rgba(255,255,255,0.07)",
                  color: hovered ? "#67e8f9" : "#94a3b8",
                }}
              >
                {tech}
              </span>
            ))}
            {item.technologies.length > 4 && (
              <span
                className="text-[9px] px-2 py-0.5 rounded-md"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#64748b",
                }}
              >
                +{item.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        <div
          className="flex items-center gap-3 pt-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-white transition-colors duration-200"
            >
              <FaGithub size={11} />
              Source
            </a>
          )}
          {item.liveUrl && !appetize && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-cyan-400 transition-colors duration-200"
            >
              <ArrowUpRight size={11} />
              Open
            </a>
          )}
          {appetize && (
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-500">
              <FaAndroid size={10} />
              Interactive
            </span>
          )}
          <button
            onClick={onExpand}
            className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-700 hover:text-cyan-400 transition-colors duration-200 group/btn"
          >
            <Maximize2
              size={10}
              className="group-hover/btn:scale-110 transition-transform"
            />
            Expand
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Full Modal ──────────────────────────────────────────────── */
function ShowcaseModal({
  item,
  onClose,
}: {
  item: ExtendedShowcase;
  onClose: () => void;
}) {
  const isPhone = item.type === "PHONE";
  const appetize = isAppetize(item.liveUrl);
  const hasWeb = isWebUrl(item.liveUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className={`relative w-full max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl ${
          isPhone ? "max-w-5xl" : "max-w-[90vw] xl:max-w-7xl"
        }`}
        style={{
          background: "rgba(8,12,28,0.98)",
          backdropFilter: "blur(40px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <X size={17} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-7">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: isPhone
                  ? "rgba(168,85,247,0.12)"
                  : "rgba(59,130,246,0.12)",
                border: isPhone
                  ? "1px solid rgba(168,85,247,0.2)"
                  : "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {isPhone ? (
                <Smartphone size={18} className="text-purple-400" />
              ) : (
                <Monitor size={18} className="text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{item.title}</h2>
              <span className="text-xs text-slate-500">
                {isPhone ? "Mobile Application" : "Web Application"}
              </span>
            </div>
          </div>

          {/*
           * Phone: same grid as before [260px | 1fr]
           * Laptop: separate wider layout — laptop stretches from left edge,
           *         info panel is a fixed 300px on the right
           */}
          {isPhone ? (
            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
              <div className="flex justify-center lg:justify-start">
                <PremiumPhoneFrame
                  url={item.liveUrl}
                  title={item.title}
                  imageUrl={item.imageUrl}
                  interactive={true}
                  size="modal"
                />
              </div>
              <div className="flex flex-col justify-start pt-2">
                <InfoPanel item={item} appetize={appetize} />
              </div>
            </div>
          ) : (
            /* Laptop: frame takes ALL remaining space, info panel fixed width on right */
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              {/* Laptop frame — stretches from left edge to info panel */}
              <div className="flex flex-col justify-center min-w-0">
                {hasWeb ? (
                  <ModalLaptopFrame
                    url={item.liveUrl}
                    title={item.title}
                    imageUrl={item.imageUrl}
                  />
                ) : item.imageUrl ? (
                  <div
                    className="relative w-full rounded-2xl overflow-hidden"
                    style={{ height: "420px", background: "#0f172a" }}
                  >
                    <SafeImg
                      src={item.imageUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full rounded-2xl flex items-center justify-center"
                    style={{
                      height: "300px",
                      background: "#0f172a",
                      border: "1px solid #334155",
                    }}
                  >
                    <Monitor size={44} className="text-slate-700" />
                  </div>
                )}
              </div>

              {/* Info panel — fixed 300px on right, top aligned */}
              <div className="flex flex-col justify-start pt-2">
                <InfoPanel item={item} appetize={appetize} />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export default function Showcase({ showcase }: ShowcaseProps) {
  const [selected, setSelected] = useState<ExtendedShowcase | null>(null);
  const [typeFilter, setTypeFilter] = useState<"ALL" | "LAPTOP" | "PHONE">(
    "ALL"
  );

  const filtered = showcase.filter((s) =>
    typeFilter === "ALL" ? true : s.type === typeFilter
  );
  const webCount = showcase.filter((s) => s.type === "LAPTOP").length;
  const mobileCount = showcase.filter((s) => s.type === "PHONE").length;

  return (
    <section className="relative py-24 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/4 blur-[120px]" />
        <div className="absolute bottom-1/3 -left-40 w-[400px] h-[400px] rounded-full bg-purple-600/4 blur-[120px]" />
      </div>

      <div className="relative section-container">
        <SectionTitle
          label="Live Showcase"
          title="Apps &"
          highlight="Websites"
          description="Live previews are embedded directly — no clicking required. Each card shows your project immediately."
        />

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {[
            {
              key: "ALL" as const,
              label: "All",
              count: showcase.length,
              icon: null,
            },
            {
              key: "LAPTOP" as const,
              label: "Websites",
              count: webCount,
              icon: Monitor,
            },
            {
              key: "PHONE" as const,
              label: "Mobile",
              count: mobileCount,
              icon: Smartphone,
            },
          ].map((f) => (
            <motion.button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background:
                  typeFilter === f.key
                    ? "linear-gradient(135deg,rgba(0,229,255,0.15),rgba(59,130,246,0.15))"
                    : "rgba(255,255,255,0.03)",
                border:
                  typeFilter === f.key
                    ? "1px solid rgba(0,229,255,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                color: typeFilter === f.key ? "#fff" : "#64748b",
                boxShadow:
                  typeFilter === f.key
                    ? "0 0 20px rgba(0,229,255,0.1)"
                    : "none",
              }}
            >
              {f.icon && <f.icon size={13} />}
              {f.label}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                style={{
                  background:
                    typeFilter === f.key
                      ? "rgba(0,229,255,0.15)"
                      : "rgba(255,255,255,0.05)",
                  color: typeFilter === f.key ? "#00e5ff" : "#64748b",
                }}
              >
                {f.count}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-3 rounded-xl flex items-center gap-3"
          style={{
            background: "rgba(0,229,255,0.04)",
            border: "1px solid rgba(0,229,255,0.1)",
          }}
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,229,255,0.1)" }}
          >
            <Monitor size={12} className="text-cyan-400" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-cyan-400 font-semibold">Live previews</span>{" "}
            embedded directly in each card. Click{" "}
            <span className="text-slate-400">↗ Expand</span> for fullscreen.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={typeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((item, i) => (
              <ShowcaseCard
                key={item.id}
                item={item as ExtendedShowcase}
                index={i}
                onExpand={() => setSelected(item as ExtendedShowcase)}
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
              <Layers size={28} className="text-slate-700" />
            </div>
            <p className="text-slate-600 text-sm">No items to display.</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <ShowcaseModal
            item={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}