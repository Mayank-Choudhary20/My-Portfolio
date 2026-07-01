import api from "@/lib/api";
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

async function getData() {
  try {
    const [
      profile,
      projects,
      skills,
      certificates,
      experience,
      showcase,
      resume,
    ] = await Promise.all([
      api.get("/profile"),
      api.get("/projects"),
      api.get("/skills"),
      api.get("/certificates"),
      api.get("/experience"),
      api.get("/showcase"),
      api.get("/resume"),
    ]);

    return {
      profile: profile.data,
      projects: projects.data,
      skills: skills.data,
      certificates: certificates.data,
      experience: experience.data,
      showcase: showcase.data,
      resume: resume.data,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: unknown };
      message?: string;
    };
    console.log("API ERROR:", err.response?.data || err.message);
    return {
      profile: null,
      projects: [],
      skills: [],
      certificates: [],
      experience: [],
      showcase: [],
      resume: null,
    };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    /*
      position: relative + z-index: 1 ensures HTML sits ABOVE
      the fixed Three.js canvas (z-index: 0).
      background is transparent so the 3D scene shows through
      wherever there is no opaque HTML content.
    */
    <main
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        // Transparent background so 3D scene is visible
        background: "transparent",
      }}
    >
      <Navbar profile={data.profile} />

      {/* Hero — transparent bg so avatar shows behind text */}
      <div id="hero">
        <Hero profile={data.profile} resume={data.resume} />
      </div>

      <SectionDivider color="rgba(0,229,255,0.08)" />

      <div id="about">
        <About profile={data.profile} />
      </div>

      <SectionDivider color="rgba(59,130,246,0.06)" />

      <div id="skills">
        <Skills skills={data.skills} />
      </div>

      <SectionDivider color="rgba(124,58,237,0.06)" />

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

      <div id="contact">
        <Contact profile={data.profile} />
      </div>

      <div id="footer">
        <Footer profile={data.profile} resume={data.resume} />
      </div>
    </main>
  );
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