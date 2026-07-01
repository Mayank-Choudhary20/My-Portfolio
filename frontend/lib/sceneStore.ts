import { create } from "zustand";

export type SectionName =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "certificates"
  | "showcase"
  | "contact"
  | "footer";

interface SceneStore {
  currentSection: SectionName;
  mouseX: number;
  mouseY: number;
  scrollY: number;
  setSection: (section: SectionName) => void;
  setMouse: (x: number, y: number) => void;
  setScrollY: (y: number) => void;
}

// Create the store
export const useSceneStore = create<SceneStore>((set) => ({
  currentSection: "hero",
  mouseX: 0,
  mouseY: 0,
  scrollY: 0,
  setSection: (section) => set({ currentSection: section }),
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),
  setScrollY: (y) => set({ scrollY: y }),
}));

// Export the raw store for use OUTSIDE React components
// (inside useFrame, event listeners, etc.)
export const sceneStore = useSceneStore;