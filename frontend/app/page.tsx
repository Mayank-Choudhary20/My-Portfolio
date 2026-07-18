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
  } catch (error: any) {
    console.log("API ERROR:", error.response?.data || error.message);

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
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <Hero profile={data.profile} resume={data.resume} />

      <About profile={data.profile} />

      <Skills skills={data.skills} />

      <Experience experience={data.experience} />

      <Projects projects={data.projects} />

      <Certificates certificates={data.certificates} />

      <Showcase showcase={data.showcase} />

      <Contact />

      <Footer />
    </main>
  );
}