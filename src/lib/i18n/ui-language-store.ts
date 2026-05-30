import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UiLang } from "./dictionaries";

interface UiLangState {
  lang: UiLang;
  setLang: (l: UiLang) => void;
}

function detectInitial(): UiLang {
  if (typeof navigator !== "undefined") {
    const n = (navigator.language || "").toLowerCase();
    if (n.startsWith("uk") || n.startsWith("ru")) return "uk";
  }
  return "en";
}

export const useUiLang = create<UiLangState>()(
  persist(
    (set) => ({
      lang: detectInitial(),
      setLang: (l) => set({ lang: l }),
    }),
    { name: "navio-ui-lang-v1" }
  )
);