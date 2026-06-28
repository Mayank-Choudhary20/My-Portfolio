export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline: string;
  about: string;
  mission?: string | null;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  github: string;
  linkedin: string;
  leetcode?: string | null;
  codechef?: string | null;
  codeforces?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  yearsExperience: number;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  proficiency?: string | null;
  percentage?: number | null;
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
  thumbnailUrl?: string | null;  // ← this was missing — causes SSE refresh to not update the card
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

// ── Setting ───────────────────────────────────────────────────
export interface Setting {
  id: string;
  portfolioName: string;
  heroTitle?: string | null;       // optional — heroTypingTexts handles typing now
  heroSubtitle: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  leetcodeUrl?: string | null;
  codechefUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  resumeUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  primaryColor?: string | null;
  heroGreeting?: string | null;
  heroAvailableText?: string | null;
  heroBusyText?: string | null;
  heroTypingTexts?: string | null; // comma-separated: "AI Engineer, Full Stack Dev"
  createdAt: string;
  updatedAt: string;
}

export interface AiKnowledge {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// ── VisitorStats ──────────────────────────────────────────────
export interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  thisWeekVisitors?: number;
  countries: number;
  cities: number;
  returningPercentage: number;
  topCountries?: Array<{ country: string; count: number }>;
  topCities?: Array<{ city: string; count: number }>;
  topBrowsers?: Array<{ browser: string; count: number }>;
  topDevices?: Array<{ device: string; count: number }>;
  topOs?: Array<{ os: string; count: number }>;
}