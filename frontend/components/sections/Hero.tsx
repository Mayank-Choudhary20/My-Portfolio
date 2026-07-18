"use client";

import { motion } from "framer-motion";
import { Mail, Download } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

type HeroProps = {
  profile: any;
  resume: any;
};

export default function Hero({ profile, resume }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 lg:flex-row lg:justify-between">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="mb-4 text-blue-400 font-semibold tracking-widest uppercase">
            Welcome
          </p>

          <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
            {profile?.name}
          </h1>

          <h2 className="mt-5 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl font-bold text-transparent">
            {profile?.title}
          </h2>

          <p className="mt-6 max-w-xl text-lg text-gray-300">
            {profile?.tagline}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <a
              href={resume?.fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
            >
              <Download size={20} />
              Resume
            </a>

            <a
              href="#contact"
              className="rounded-xl border border-gray-500 px-6 py-3 transition hover:border-white"
            >
              Contact Me
            </a>

          </div>

          {/* Social Links */}

          <div className="mt-10 flex gap-6">

            <a
              href={profile?.github || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cyan-400"
            >
              <FaGithub size={28} />
            </a>

            <a
              href={profile?.linkedin || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cyan-400"
            >
              <FaLinkedin size={28} />
            </a>

            <a
              href={`mailto:${profile?.email || ""}`}
              className="transition hover:text-cyan-400"
            >
              <Mail size={28} />
            </a>

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-16 lg:mt-0"
        >
          <div className="h-80 w-80 overflow-hidden rounded-full border-4 border-blue-500 shadow-2xl">

            <img
              src="/profile.jpg"
              alt={profile?.name}
              className="h-full w-full object-cover"
            />

          </div>
        </motion.div>

      </div>
    </section>
  );
}