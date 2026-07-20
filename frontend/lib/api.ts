const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 60 },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API error: ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getProfile() {
  return apiFetch<import("@/types/portfolio").Profile>("/profile");
}
export async function getProjects() {
  return apiFetch<import("@/types/portfolio").Project[]>("/projects");
}
export async function getSkills() {
  return apiFetch<import("@/types/portfolio").Skill[]>("/skills");
}
export async function getCertificates() {
  return apiFetch<import("@/types/portfolio").Certificate[]>("/certificates");
}
export async function getExperience() {
  return apiFetch<import("@/types/portfolio").Experience[]>("/experience");
}
export async function getShowcase() {
  return apiFetch<import("@/types/portfolio").Showcase[]>("/showcase");
}
export async function getResume() {
  return apiFetch<import("@/types/portfolio").Resume>("/resume");
}
export async function getEducation() {
  return apiFetch<import("@/types/portfolio").Education[]>("/education");
}
export async function getSettings() {
  return apiFetch<import("@/types/portfolio").Setting>("/settings");
}
export async function getAiKnowledge() {
  return apiFetch<import("@/types/portfolio").AiKnowledge[]>("/ai");
}

// Keep axios instance for backward compat (contact form uses it)
import axios from "axios";
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
export default api;