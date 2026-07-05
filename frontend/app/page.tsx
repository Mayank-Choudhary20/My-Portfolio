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
  ] = results;

  return {
    profile:
      profile.status === "fulfilled" ? profile.value : null,
    projects:
      projects.status === "fulfilled" ? projects.value : [],
    skills:
      skills.status === "fulfilled" ? skills.value : [],
    certificates:
      certificates.status === "fulfilled" ? certificates.value : [],
    experience:
      experience.status === "fulfilled" ? experience.value : [],
    showcase:
      showcase.status === "fulfilled" ? showcase.value : [],
    resume:
      resume.status === "fulfilled" ? resume.value : null,
    education:
      education.status === "fulfilled" ? education.value : [],
    settings:
      settings.status === "fulfilled" ? settings.value : null,
    aiKnowledge:
      aiKnowledge.status === "fulfilled" ? aiKnowledge.value : [],
  };
}

function SectionDivider({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }}
    />
  );
}

export default async function Home() {
  const data = await getData();

  return (
    <main
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        background: "transparent",
      }}
    >
      <Navbar profile={data.profile} settings={data.settings} />

      <div id="hero">
        <Hero profile={data.profile} resume={data.resume} />
      </div>

      <SectionDivider color="rgba(0,229,255,0.08)" />

      <div id="about">
        <About profile={data.profile} />
      </div>

      <SectionDivider color="rgba(59,130,246,0.06)" />

      <div id="education">
        <Education education={data.education} />
      </div>

      <SectionDivider color="rgba(124,58,237,0.06)" />

      <div id="skills">
        <Skills skills={data.skills} />
      </div>

      <SectionDivider color="rgba(59,130,246,0.06)" />

      <div id="experience">
        <Experience experience={data.experience} />
      </div>

      <SectionDivider color="rgba(59,130,246,0.06)" />

      <div id="projects">
        <Projects projects={data.projects} />
      </div>

      <SectionDivider color="rgba(245,158,11,0.06)" />

      <div id="certificates">
        <Certificates certificates={data.certificates} />
      </div>

      <SectionDivider color="rgba(0,229,255,0.06)" />

      <div id="showcase">
        <Showcase showcase={data.showcase} />
      </div>

      <SectionDivider color="rgba(124,58,237,0.06)" />

      <div id="coding-profiles">
        <CodingProfiles profile={data.profile} />
      </div>

      <SectionDivider color="rgba(59,130,246,0.06)" />

      <div id="resume">
        <ResumeSection resume={data.resume} />
      </div>

      <SectionDivider color="rgba(0,229,255,0.06)" />

      <div id="ai">
        <AskMayankAI aiKnowledge={data.aiKnowledge} profile={data.profile} />
      </div>

      <SectionDivider color="rgba(124,58,237,0.06)" />

      <div id="contact">
        <Contact profile={data.profile} />
      </div>

      <div id="footer">
        <Footer
          profile={data.profile}
          resume={data.resume}
          settings={data.settings}
        />
      </div>
    </main>
  );
}