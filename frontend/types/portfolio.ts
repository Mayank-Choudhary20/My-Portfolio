export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  github: string;
  linkedin: string;
  leetcode?: string;
  codechef?: string;
  codeforces?: string;
  twitter?: string;
  instagram?: string;
  yearsExperience: number;
  available: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  featured: boolean;
  slug: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  icon?: string;
  years?: number;
  featured: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  companyLogo?: string;
  technologies: string[];
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  credentialUrl?: string;
  imageUrl: string;
  featured: boolean;
}

export interface Showcase {
  id: string;
  title: string;
  type: "PHONE" | "LAPTOP";
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
}

export interface Resume {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
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

export interface Setting {
  id: string;
  portfolioName: string;
  heroTitle: string;
  heroSubtitle: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  leetcodeUrl?: string;
  codechefUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  primaryColor?: string;
}

export interface AiKnowledge {
  id: string;
  question: string;
  answer: string;
  category?: string;
}