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

// ── Safe image ────────────────────────────────────────────────
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

// ── Inline Laptop preview (always visible) ────────────────────
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
      {/* Screen */}
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
          {/* Browser chrome */}
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
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
              }}
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

          {/* Content */}
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

      {/* Hinge */}
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(to bottom,#334155,#1e293b)",
        }}
      />
      {/* Base */}
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

// ── Inline Phone preview (always visible) ─────────────────────
function PhonePreview({
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
  const phoneW = compact ? "130px" : "150px";
  const hasLive = !!url;

  return (
    <div className="flex justify-center py-2">
      <div style={{ width: phoneW }}>
        <div
          className="relative rounded-[24px] overflow-hidden"
          style={{
            background: "linear-gradient(145deg,#1e293b,#0f172a)",
            border: "3px solid #334155",
            paddingTop: "195%",
            boxShadow:
              "0 0 0 1px #475569, 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,229,255,0.06), inset 0 0 15px rgba(0,0,0,0.4)",
          }}
        >
          {/* Dynamic island */}
          <div
            className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30 rounded-full"
            style={{
              width: "50px",
              height: "14px",
              background: "#000",
              border: "1px solid #1e293b",
            }}
          />

          {/* Screen */}
          <div className="absolute inset-0 pt-7 pb-3 overflow-hidden">
            {hasLive ? (
              <div className="relative w-full h-full">
                {!loaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
                    <div className="w-5 h-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                  </div>
                )}
                <iframe
                  src={url}
                  title={title}
                  className="w-full h-full border-0"
                  onLoad={() => setLoaded(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                />
              </div>
            ) : imageUrl ? (
              <div className="relative w-full h-full bg-slate-900">
                <SafeImg
                  src={imageUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900">
                <Smartphone size={24} className="text-slate-600" />
              </div>
            )}
          </div>

          {/* Side buttons */}
          <div
            className="absolute right-0 top-1/4 w-0.5 h-8 rounded-l-full"
            style={{ background: "#334155" }}
          />
          <div
            className="absolute left-0 w-0.5 h-6 rounded-r-full"
            style={{ background: "#334155", top: "22%" }}
          />
          <div
            className="absolute left-0 w-0.5 h-6 rounded-r-full"
            style={{ background: "#334155", top: "33%" }}
          />

          {/* Home indicator */}
          <div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: "40px",
              height: "3px",
              background: "rgba(255,255,255,0.2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Showcase Card ─────────────────────────────────────────────
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
  const hasWeb = isWebUrl(item.liveUrl);
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
        background: "rgba(255,255,255,0.03)",
        border: hovered
          ? "1px solid rgba(0,229,255,0.28)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered
          ? "0 20px 50px rgba(0,0,0,0.45), 0 0 30px rgba(0,229,255,0.07)"
          : "0 4px 20px rgba(0,0,0,0.25)",
        transition: "box-shadow 0.3s ease, border 0.3s ease",
      }}
    >
      {/* ── PREVIEW AREA — always visible ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#0f172a 0%,#020617 100%)",
          minHeight: isPhone ? "240px" : "200px",
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none z-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,1) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Type badge */}
        <div className="absolute top-2 left-2 z-20 flex gap-1">
          <div
            className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-semibold border backdrop-blur-sm ${
              isPhone
                ? "text-purple-400 border-purple-500/30"
                : "text-blue-400 border-blue-500/30"
            }`}
            style={{
              background: isPhone
                ? "rgba(168,85,247,0.12)"
                : "rgba(59,130,246,0.12)",
            }}
          >
            {isPhone ? <Smartphone size={7} /> : <Monitor size={7} />}
            {isPhone ? "Mobile" : "Web"}
          </div>
          {appetize && (
            <div
              className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-semibold border text-emerald-400 border-emerald-500/30 backdrop-blur-sm"
              style={{ background: "rgba(16,185,129,0.12)" }}
            >
              <FaAndroid size={7} />
              Live
            </div>
          )}
        </div>

        {/* Expand button */}
        <button
          onClick={onExpand}
          className="absolute top-2 right-2 z-20 w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all backdrop-blur-sm"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          title="Expand"
        >
          <Maximize2 size={10} />
        </button>

        {/* Preview — shown directly without any click */}
        {isPhone ? (
          <PhonePreview
            url={item.liveUrl}
            title={item.title}
            imageUrl={item.imageUrl}
            compact
          />
        ) : (
          <LaptopPreview
            url={item.liveUrl}
            title={item.title}
            imageUrl={item.imageUrl}
            compact
          />
        )}
      </div>

      {/* ── Card info ── */}
      <div className="flex flex-col flex-1 p-4">
        <h3
          className="font-bold text-sm mb-1 leading-tight transition-colors duration-200"
          style={{ color: hovered ? "#00e5ff" : "white" }}
        >
          {item.title}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3 flex-1">
          {item.description}
        </p>

        {/* Tech pills */}
        {item.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#94a3b8",
                }}
              >
                {tech}
              </span>
            ))}
            {item.technologies.length > 4 && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded"
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

        {/* Actions */}
        <div
          className="flex items-center gap-3 pt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-white transition-colors"
            >
              <FaGithub size={10} />
              Source
            </a>
          )}
          {item.liveUrl && !appetize && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-cyan-400 transition-colors"
            >
              <ExternalLink size={10} />
              Open
            </a>
          )}
          {appetize && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-500">
              <FaAndroid size={9} />
              Interactive
            </span>
          )}
          <button
            onClick={onExpand}
            className="ml-auto flex items-center gap-1 text-[10px] text-slate-700 hover:text-cyan-400 transition-colors"
          >
            <Maximize2 size={9} />
            Expand
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Modal laptop frame ────────────────────────────────────────
function ModalLaptop({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <div className="w-full">
      <div
        className="relative rounded-t-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg,#1e293b,#0f172a)",
          border: "3px solid #334155",
          paddingTop: "62%",
          boxShadow:
            "0 0 40px rgba(0,229,255,0.08), inset 0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        <div className="absolute inset-0 flex flex-col">
          <div
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2"
            style={{
              background: "#1e293b",
              borderBottom: "1px solid #334155",
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div
              className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded-md"
              style={{ background: "#0f172a", border: "1px solid #334155" }}
            >
              <Globe size={10} className="text-slate-500 flex-shrink-0" />
              <span className="text-[9px] text-slate-500 truncate font-mono">
                {url}
              </span>
            </div>
            <button
              onClick={() => {
                setKey((k) => k + 1);
                setLoaded(false);
                setError(false);
              }}
              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-300"
              title="Reload"
            >
              <RefreshCw size={10} />
            </button>
          </div>
          <div className="relative flex-1 bg-white overflow-hidden">
            {!loaded && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 z-10">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                <p className="text-xs text-slate-500">Loading {title}…</p>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 z-10">
                <Globe size={32} className="text-slate-600" />
                <p className="text-xs text-slate-500 text-center px-4">
                  Preview unavailable.{" "}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    Open in new tab →
                  </a>
                </p>
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
          </div>
        </div>
      </div>
      <div
        className="h-2 w-full"
        style={{ background: "linear-gradient(to bottom,#334155,#1e293b)" }}
      />
      <div
        className="h-4 rounded-b-xl flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom,#1e293b,#0f172a)",
          border: "3px solid #334155",
          borderTop: "none",
        }}
      >
        <div
          className="w-16 h-2 rounded-full"
          style={{ background: "#334155" }}
        />
      </div>
    </div>
  );
}

// ── Modal phone frame ─────────────────────────────────────────
function ModalPhone({
  url,
  title,
  imageUrl,
}: {
  url?: string;
  title: string;
  imageUrl?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mx-auto" style={{ width: "220px" }}>
      <div
        className="relative rounded-[36px] overflow-hidden"
        style={{
          background: "linear-gradient(145deg,#1e293b,#0f172a)",
          border: "4px solid #334155",
          paddingTop: "200%",
          boxShadow:
            "0 0 0 1px #475569, 0 30px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,229,255,0.08), inset 0 0 25px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-30 rounded-full"
          style={{
            width: "80px",
            height: "24px",
            background: "#000",
            border: "1px solid #1e293b",
          }}
        />
        <div className="absolute inset-0 pt-11 pb-6 overflow-hidden">
          {url ? (
            <div className="relative w-full h-full">
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                </div>
              )}
              <iframe
                src={url}
                title={title}
                className="w-full h-full border-0"
                onLoad={() => setLoaded(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            </div>
          ) : imageUrl ? (
            <div className="relative w-full h-full bg-slate-900">
              <SafeImg
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <Smartphone size={36} className="text-slate-600" />
            </div>
          )}
        </div>
        <div
          className="absolute right-0 top-1/4 w-1 h-10 rounded-l-full"
          style={{ background: "#334155" }}
        />
        <div
          className="absolute left-0 w-1 h-7 rounded-r-full"
          style={{ background: "#334155", top: "22%" }}
        />
        <div
          className="absolute left-0 w-1 h-7 rounded-r-full"
          style={{ background: "#334155", top: "33%" }}
        />
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: "70px",
            height: "4px",
            background: "rgba(255,255,255,0.2)",
          }}
        />
      </div>
    </div>
  );
}

// ── Full Modal ─────────────────────────────────────────────────
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
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
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

          {/* Main grid */}
          <div
            className={`grid gap-8 ${
              isPhone ? "lg:grid-cols-[240px_1fr]" : "grid-cols-1"
            }`}
          >
            {/* Device preview */}
            <div>
              {isPhone ? (
                <ModalPhone
                  url={item.liveUrl}
                  title={item.title}
                  imageUrl={item.imageUrl}
                />
              ) : hasWeb ? (
                <ModalLaptop url={item.liveUrl!} title={item.title} />
              ) : item.imageUrl ? (
                <div
                  className="relative w-full rounded-2xl overflow-hidden"
                  style={{ height: "260px", background: "#0f172a" }}
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
                    height: "180px",
                    background: "#0f172a",
                    border: "1px solid #334155",
                  }}
                >
                  <Monitor size={44} className="text-slate-700" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-5">
              <div>
                <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold flex items-center gap-1.5">
                  <Info size={11} />
                  About
                </h4>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>

              {item.technologies?.length > 0 && (
                <div>
                  <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">
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

              {/* Action buttons */}
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
                      background:
                        "linear-gradient(135deg,#3b82f6,#7c3aed)",
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
                      background:
                        "linear-gradient(135deg,#10b981,#059669)",
                      boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
                    }}
                  >
                    <FaAndroid size={14} />
                    Full Screen Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────
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
      {/* Background */}
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

        {/* Filter tabs */}
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

        {/* Info bar */}
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
            <span className="text-cyan-400 font-semibold">
              Live previews
            </span>{" "}
            embedded directly in each card. Click{" "}
            <span className="text-slate-400">↗ Expand</span> for fullscreen.
          </p>
        </motion.div>

        {/* Grid */}
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

        {/* Empty state */}
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

      {/* Modal */}
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