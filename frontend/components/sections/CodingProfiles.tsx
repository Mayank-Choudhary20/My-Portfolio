"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import {
  SiLeetcode,
  SiCodechef,
  SiCodeforces,
} from "react-icons/si";
import { ExternalLink, Code2 } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Profile } from "@/types/portfolio";

interface CodingProfilesProps {
  profile: Profile | null;
}

interface PlatformConfig {
  key: keyof Profile;
  label: string;
  icon: React.ElementType;
  gradient: string;
  glow: string;
  border: string;
  description: string;
  prefix: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    key: "github",
    label: "GitHub",
    icon: FaGithub,
    gradient: "from-slate-700 to-slate-800",
    glow: "rgba(255,255,255,0.15)",
    border: "rgba(255,255,255,0.2)",
    description: "Open source projects & contributions",
    prefix: "github.com/",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    gradient: "from-blue-600 to-blue-700",
    glow: "rgba(59,130,246,0.3)",
    border: "rgba(59,130,246,0.4)",
    description: "Professional network & career",
    prefix: "linkedin.com/in/",
  },
  {
    key: "leetcode",
    label: "LeetCode",
    icon: SiLeetcode,
    gradient: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.3)",
    border: "rgba(245,158,11,0.4)",
    description: "DSA problems & competitive programming",
    prefix: "leetcode.com/u/",
  },
  {
    key: "codechef",
    label: "CodeChef",
    icon: SiCodechef,
    gradient: "from-amber-700 to-amber-800",
    glow: "rgba(180,120,60,0.3)",
    border: "rgba(180,120,60,0.4)",
    description: "Competitive programming contests",
    prefix: "codechef.com/users/",
  },
  {
    key: "codeforces",
    label: "Codeforces",
    icon: SiCodeforces,
    gradient: "from-blue-700 to-blue-800",
    glow: "rgba(29,78,216,0.3)",
    border: "rgba(29,78,216,0.4)",
    description: "Algorithm competitions & ratings",
    prefix: "codeforces.com/profile/",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: FaTwitter,
    gradient: "from-sky-500 to-sky-600",
    glow: "rgba(14,165,233,0.3)",
    border: "rgba(14,165,233,0.4)",
    description: "Tech thoughts & updates",
    prefix: "x.com/",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    gradient: "from-pink-500 via-rose-500 to-orange-400",
    glow: "rgba(236,72,153,0.3)",
    border: "rgba(236,72,153,0.4)",
    description: "Life & behind the scenes",
    prefix: "instagram.com/",
  },
];

function extractUsername(url: string, prefix: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const path = u.pathname.replace(/^\/+|\/+$/g, "");
    // For linkedin /in/username
    if (path.startsWith("in/")) return path.replace("in/", "");
    // For /u/username (leetcode)
    if (path.startsWith("u/")) return path.replace("u/", "");
    // For /users/username
    if (path.startsWith("users/")) return path.replace("users/", "");
    // For /profile/username
    if (path.startsWith("profile/")) return path.replace("profile/", "");
    return path || url;
  } catch {
    return url;
  }
}

function ProfileCard({
  platform,
  url,
  index,
}: {
  platform: PlatformConfig;
  url: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const username = extractUsername(url, platform.prefix);
  const Icon = platform.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="group relative"
    >
      {/* Glow backdrop */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${platform.glow}, transparent)`,
        }}
      />

      <motion.div
        className="relative rounded-2xl p-6 flex flex-col gap-4 h-full"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
        }}
        whileHover={{
          y: -6,
          borderColor: platform.border,
          boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${platform.glow}`,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Icon */}
        <div className="flex items-start justify-between">
          <motion.div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            style={{
              boxShadow: `0 8px 25px ${platform.glow}`,
            }}
          >
            <Icon size={26} className="text-white" />
          </motion.div>

          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <ExternalLink size={11} className="text-slate-400" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-base font-bold text-white mb-1">
            {platform.label}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-2">
            {platform.description}
          </p>
          <div
            className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-md"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#94a3b8",
            }}
          >
            <Code2 size={9} className="text-slate-600" />@{username}
          </div>
        </div>

        {/* Button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{
            background: `linear-gradient(135deg, ${platform.glow.replace("0.3", "0.15")}, ${platform.glow.replace("0.3", "0.08")})`,
            border: `1px solid ${platform.border.replace("0.4", "0.2")}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={13} />
          Open Profile
        </a>
      </motion.div>
    </motion.div>
  );
}

export default function CodingProfiles({ profile }: CodingProfilesProps) {
  if (!profile) return null;

  const activePlatforms = PLATFORMS.filter((p) => {
    const val = profile[p.key];
    return typeof val === "string" && val.length > 0;
  });

  if (activePlatforms.length === 0) return null;

  return (
    <section className="relative py-28 overflow-hidden bg-[#020617]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-[120px]" />
        <div className="absolute bottom-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-blue-600/4 blur-[120px]" />
      </div>

      <div className="relative section-container">
        <SectionTitle
          label="Coding Profiles"
          title="Find Me"
          highlight="Online"
          description="Connect with me across platforms — from competitive programming to professional networking."
        />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {activePlatforms.map((platform, i) => (
            <ProfileCard
              key={platform.key}
              platform={platform}
              url={profile[platform.key] as string}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}