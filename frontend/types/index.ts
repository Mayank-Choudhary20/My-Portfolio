export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string | null;
  liveUrl: string | null;
  technologies: string[];
  featured: boolean;
  slug: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  imageUrl: string;
  credentialUrl: string | null;
  issueDate: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  companyLogo: string | null;
  technologies: string[];
  startDate: string;
  endDate: string | null;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  icon: string | null;
  years: number | null;
  featured: boolean;
}

export interface Showcase {
  id: string;
  title: string;
  type: "PHONE" | "LAPTOP";
  description: string;
  imageUrl: string;
  liveUrl: string | null;
  githubUrl: string | null;
  technologies: string[];
  featured: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  field?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
  certificateUrl?: string;
}

export interface AiKnowledge {
  id: string;
  question: string;
  answer: string;
  category?: string;
}