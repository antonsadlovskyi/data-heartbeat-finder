import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RoleKey = "owner" | "marketer" | "smm";

export const ROLES: { key: RoleKey; label: string; description: string }[] = [
  { key: "owner", label: "Owner", description: "Strategy & outcomes" },
  { key: "marketer", label: "Marketer", description: "Funnels & KPIs" },
  { key: "smm", label: "SMM", description: "Formats & hooks" },
];

interface RoleState {
  role: RoleKey;
  setRole: (r: RoleKey) => void;
}

export const useRole = create<RoleState>()(
  persist(
    (set) => ({
      role: "owner",
      setRole: (r) => set({ role: r }),
    }),
    { name: "navio-role-v1" }
  )
);