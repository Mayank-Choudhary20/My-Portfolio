// ─── Core Models ──────────────────────────────────────────────────────────────

export interface Admin {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

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
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  technologies: string[];
  featured: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  proficiency?: string | null;
  percentage?: number | null;
  icon?: string | null;
  years?: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  companyLogo?: string | null;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  field?: string | null;
  startDate: string;
  endDate?: string | null;
  grade?: string | null;
  description?: string | null;
  certificateUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Showcase {
  id: string;
  title: string;
  type: string;
  description: string;
  imageUrl: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  technologies: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiKnowledge {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Visitor {
  id: string;
  ip?: string | null;
  country?: string | null;
  city?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  visitedAt: string;
}

export interface Setting {
  id: string;
  portfolioName: string;
  heroTitle: string;
  heroSubtitle: string;
  // ── Hero control fields ───────────────────────────────────────
  heroGreeting?: string | null;
  heroAvailableText?: string | null;
  heroBusyText?: string | null;
  heroTypingTexts?: string | null; // comma-separated: "AI Engineer, Full Stack Dev"
  // ── Social links ──────────────────────────────────────────────
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  leetcodeUrl?: string | null;
  codechefUrl?: string | null;
  // ── Contact ───────────────────────────────────────────────────
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  resumeUrl?: string | null;
  // ── SEO ───────────────────────────────────────────────────────
  seoTitle?: string | null;
  seoDescription?: string | null;
  primaryColor?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalExperience: number;
  totalEducation: number;
  totalCertificates: number;
  totalShowcase: number;
  totalContacts: number;
  unreadContacts: number;
  totalVisitors: number;
  totalAiKnowledge: number;
}

export interface VisitorStats {
  totalVisitors:       number;
  todayVisitors:       number;
  thisWeekVisitors:    number;
  countries:           number;
  cities:              number;
  returningPercentage: number;
  topCountries:        Array<{ country: string; count: number }>;
  topCities:           Array<{ city: string; count: number }>;
  topBrowsers:         Array<{ browser: string; count: number }>;
  topDevices:          Array<{ device: string; count: number }>;
  topOs:               Array<{ os: string; count: number }>;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthState {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  admin: Admin;
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: string;
  icon?: string;
}