import {
  getProfile,
  getProjects,
  getSkills,
  getCertificates,
  getExperience,
  getShowcase,
  getResume,
  getEducation,
  getSettings,
  getAiKnowledge,
  getVisitorStats,
} from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Certificates from "@/components/sections/Certificates";
import Showcase from "@/components/sections/Showcase";
import Contact from "@/components/sections/Contact";
import Education from "@/components/sections/Education";
import ResumeSection from "@/components/sections/ResumeSection";
import CodingProfiles from "@/components/sections/CodingProfiles";
import AskMayankAI from "@/components/sections/AskMayankAI";
import ScrollToTop from "@/components/ui/ScrollToTop";
import VisitorTracker from "@/components/VisitorTracker";

async function getData() {
  const results = await Promise.allSettled([
    getProfile(),
    getProjects(),
    getSkills(),
    getCertificates(),
    getExperience(),
    getShowcase(),
    getResume(),
    getEducation(),
    getSettings(),
    getAiKnowledge(),
    getVisitorStats(),
  ]);


  const [
    profile,
    projects,
    skills,
    certificates,
    experience,
    showcase,
    resume,
    education,
    settings,
    aiKnowledge,
    visitorStats,
  ] = results;

  return {
    profile: profile.status === "fulfilled" ? profile.value : null,
    projects: projects.status === "fulfilled" ? projects.value : [],
    skills: skills.status === "fulfilled" ? skills.value : [],
    certificates: certificates.status === "fulfilled" ? certificates.value : [],
    experience: experience.status === "fulfilled" ? experience.value : [],
    showcase: showcase.status === "fulfilled" ? showcase.value : [],
    resume: resume.status === "fulfilled" ? resume.value : null,
    education: education.status === "fulfilled" ? education.value : [],
    settings: settings.status === "fulfilled" ? settings.value : null,
    aiKnowledge: aiKnowledge.status === "fulfilled" ? aiKnowledge.value : [],
    visitorStats: visitorStats.status === "fulfilled"
      ? visitorStats.value
      : {
        totalVisitors: 0,
        countries: 0,
        cities: 0,
        returningPercentage: 0,
        todayVisitors: 0,
      },
  };
}

/* ─────────────────────────────────────────────
   SectionBreak
───────────────────────────────────────────── */
interface SectionBreakProps {
  variant?: "cyan" | "blue" | "purple" | "amber" | "green" | "pink";
  label?: string;
}

function SectionBreak({ variant = "cyan", label }: SectionBreakProps) {
  return (
    <div
      aria-hidden="true"
      role="separator"
      className={`section-break-wrapper section-break--${variant}`}
    >
      <div className="section-break-badge">
        <span className="section-break-tick" />
        <span className="section-break-gem" />
        {label && <span className="section-break-label">{label}</span>}
        <span className="section-break-gem" />
        <span className="section-break-tick" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default async function Home() {
  const data = await getData();
  const primaryColor = data.settings?.primaryColor || "#3b82f6";
  return (
    <main
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        background: "transparent",
        // Inject as CSS variable — all components can use var(--primary)
        "--primary": primaryColor,
      } as React.CSSProperties}
    >
      {/* Silent visitor tracker */}
      <VisitorTracker />

      <ScrollToTop />
      <Navbar profile={data.profile} settings={data.settings} />

      {/* ── HERO ─────────────────────────────── */}
      <div id="hero">
        <Hero
          profile={data.profile}
          resume={data.resume}
          projects={data.projects}
          certificates={data.certificates}
          settings={data.settings}
        />
      </div>

      <SectionBreak variant="cyan" />

      {/* ── ABOUT ────────────────────────────── */}
      <div id="about">
        <About
          profile={data.profile}
          projects={data.projects}
          skills={data.skills}
          certificates={data.certificates}
        />
      </div>

      <SectionBreak variant="cyan" label="Education" />

      {/* ── EDUCATION ────────────────────────── */}
      <div id="education">
        <Education education={data.education} />
      </div>

      <SectionBreak variant="purple" label="Skills" />

      {/* ── SKILLS ───────────────────────────── */}
      <div id="skills">
        <Skills skills={data.skills} />
      </div>

      <SectionBreak variant="blue" label="Experience" />

      {/* ── EXPERIENCE ───────────────────────── */}
      <div id="experience">
        <Experience experience={data.experience} />
      </div>

      <SectionBreak variant="amber" label="Projects" />

      {/* ── PROJECTS ─────────────────────────── */}
      <div id="projects">
        <Projects projects={data.projects} />
      </div>

      <SectionBreak variant="green" label="Certificates" />

      {/* ── CERTIFICATES ─────────────────────── */}
      <div id="certificates">
        <Certificates certificates={data.certificates} />
      </div>

      <SectionBreak variant="pink" label="Showcase" />

      {/* ── SHOWCASE ─────────────────────────── */}
      <div id="showcase">
        <Showcase showcase={data.showcase} />
      </div>

      <SectionBreak variant="blue" label="Coding Profiles" />

      {/* ── CODING PROFILES ──────────────────── */}
      <div id="coding-profiles">
        <CodingProfiles profile={data.profile} />
      </div>

      <SectionBreak variant="purple" label="Resume" />

      {/* ── RESUME ───────────────────────────── */}
      <div id="resume">
        <ResumeSection resume={data.resume} />
      </div>

      <SectionBreak variant="purple" label="AI Assistant" />

      {/* ── ASK MAYANK AI ────────────────────── */}
      <div id="ai">
        <AskMayankAI
          aiKnowledge={data.aiKnowledge}
          profile={data.profile}
        />
      </div>

      <SectionBreak variant="cyan" label="Contact" />

      {/* ── CONTACT ──────────────────────────── */}
      <div id="contact">
        <Contact profile={data.profile} />
      </div>

      {/* ── FOOTER — with live analytics built in ── */}
      <div id="footer">
        <Footer
          profile={data.profile}
          resume={data.resume}
          settings={data.settings}
          visitorStats={data.visitorStats}
        />
      </div>
    </main>
  );
}