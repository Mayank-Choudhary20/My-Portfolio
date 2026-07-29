const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── Token ────────────────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}
export function setToken(t: string) {
  localStorage.setItem("admin_token", t);
}
export function removeToken() {
  localStorage.removeItem("admin_token");
}

// ─── Core fetch ───────────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message || `Error ${res.status}`
    );
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message || `Upload error ${res.status}`
    );
  }
  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<import("@/types").LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () =>
    apiFetch<import("@/types").DashboardStats>("/dashboard/stats"),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => apiFetch<import("@/types").Profile>("/profile"),
  update: (data: Partial<import("@/types").Profile>) =>
    apiFetch<import("@/types").Profile>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projectsApi = {
  getAll: () => apiFetch<import("@/types").Project[]>("/projects"),
  getOne: (id: string) =>
    apiFetch<import("@/types").Project>(`/projects/${id}`),
  create: (data: unknown) =>
    apiFetch<import("@/types").Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: unknown) =>
    apiFetch<import("@/types").Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/projects/${id}`, { method: "DELETE" }),
};

// ─── Skills ───────────────────────────────────────────────────────────────────
export const skillsApi = {
  getAll: () => apiFetch<import("@/types").Skill[]>("/skills"),
  getOne: (id: string) => apiFetch<import("@/types").Skill>(`/skills/${id}`),
  create: (data: unknown) =>
    apiFetch<import("@/types").Skill>("/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: unknown) =>
    apiFetch<import("@/types").Skill>(`/skills/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/skills/${id}`, { method: "DELETE" }),
};

// ─── Experience ───────────────────────────────────────────────────────────────
export const experienceApi = {
  getAll: () => apiFetch<import("@/types").Experience[]>("/experience"),
  getOne: (id: string) =>
    apiFetch<import("@/types").Experience>(`/experience/${id}`),
  create: (data: unknown) =>
    apiFetch<import("@/types").Experience>("/experience", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: unknown) =>
    apiFetch<import("@/types").Experience>(`/experience/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/experience/${id}`, { method: "DELETE" }),
};

// ─── Education ────────────────────────────────────────────────────────────────
export const educationApi = {
  getAll: () => apiFetch<import("@/types").Education[]>("/education"),
  getOne: (id: string) =>
    apiFetch<import("@/types").Education>(`/education/${id}`),
  create: (data: unknown) =>
    apiFetch<import("@/types").Education>("/education", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: unknown) =>
    apiFetch<import("@/types").Education>(`/education/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/education/${id}`, { method: "DELETE" }),
};

// ─── Certificates ─────────────────────────────────────────────────────────────
export const certificatesApi = {
  getAll: () => apiFetch<import("@/types").Certificate[]>("/certificates"),
  getOne: (id: string) =>
    apiFetch<import("@/types").Certificate>(`/certificates/${id}`),
  create: (data: unknown) =>
    apiFetch<import("@/types").Certificate>("/certificates", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: unknown) =>
    apiFetch<import("@/types").Certificate>(`/certificates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/certificates/${id}`, { method: "DELETE" }),
};

// ─── Showcase ─────────────────────────────────────────────────────────────────
export const showcaseApi = {
  getAll: () => apiFetch<import("@/types").Showcase[]>("/showcase"),
  getOne: (id: string) =>
    apiFetch<import("@/types").Showcase>(`/showcase/${id}`),
  create: (data: unknown) =>
    apiFetch<import("@/types").Showcase>("/showcase", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: unknown) =>
    apiFetch<import("@/types").Showcase>(`/showcase/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/showcase/${id}`, { method: "DELETE" }),
};

// ─── Resume ───────────────────────────────────────────────────────────────────
// ─── Resume ───────────────────────────────────────────────────────────────────
export const resumeApi = {
  get: () => apiFetch<import("@/types").Resume>("/resume"),
  create: (data: { title: string; fileUrl: string; thumbnailUrl?: string | null }) =>
    apiFetch<import("@/types").Resume>("/resume", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { title?: string; fileUrl?: string; thumbnailUrl?: string | null }) =>
    apiFetch<import("@/types").Resume>(`/resume/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  updateByPut: (data: { title?: string; fileUrl?: string; thumbnailUrl?: string | null }) =>
    apiFetch<import("@/types").Resume>("/resume", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/resume/${id}`, { method: "DELETE" }),
};

// ─── AI Knowledge ─────────────────────────────────────────────────────────────
export const aiApi = {
  getAll: () => apiFetch<import("@/types").AiKnowledge[]>("/ai"),
  getOne: (id: string) =>
    apiFetch<import("@/types").AiKnowledge>(`/ai/${id}`),
  create: (data: unknown) =>
    apiFetch<import("@/types").AiKnowledge>("/ai", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: unknown) =>
    apiFetch<import("@/types").AiKnowledge>(`/ai/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/ai/${id}`, { method: "DELETE" }),
  bulkDelete: (ids: string[]) =>
    apiFetch<void>("/ai/bulk-delete", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    }),
};

// ─── Contacts ─────────────────────────────────────────────────────────────────
export const contactsApi = {
  getAll: () => apiFetch<import("@/types").Contact[]>("/contact"),
  getOne: (id: string) =>
    apiFetch<import("@/types").Contact>(`/contact/${id}`),
  markRead: (id: string) =>
    apiFetch<import("@/types").Contact>(`/contact/${id}/read`, {
      method: "PATCH",
    }),
  delete: (id: string) =>
    apiFetch<void>(`/contact/${id}`, { method: "DELETE" }),
};

// ─── Visitors ─────────────────────────────────────────────────────────────────
export const visitorsApi = {
  getAll: () => apiFetch<import("@/types").Visitor[]>("/visitor"),
  getStats: () =>
    apiFetch<import("@/types").VisitorStats>("/visitor/stats"),
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => apiFetch<import("@/types").Setting>("/settings"),
  update: (data: unknown) =>
    apiFetch<import("@/types").Setting>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadApi = {
  uploadImage: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiUpload<{ url: string }>("/upload/image", fd);
  },
  uploadPdf: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiUpload<{ url: string }>("/upload/pdf", fd);
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  getAll: () => apiFetch<import("@/types").Admin[]>("/auth/admins"),
  create: (data: { email: string; password: string }) =>
    apiFetch<import("@/types").Admin>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch<void>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/auth/admins/${id}`, { method: "DELETE" }),
};