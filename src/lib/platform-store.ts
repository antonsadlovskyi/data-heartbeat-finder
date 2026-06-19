import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PLATFORMS, type Platform } from "@/lib/data/page-objects.functions";

export { PLATFORMS };
export type { Platform };

interface PlatformState {
  platform: Platform;
  setPlatform: (p: Platform) => void;
}

/**
 * Minimal V2 platform store. Session 2 adds the PlatformSwitcher UI; this exists
 * now so the data layer (usePageObject) can key/refetch on platform and be
 * testable. Default `all` matches the RPC's aggregate view.
 */
export const usePlatform = create<PlatformState>()(
  persist(
    (set) => ({
      platform: "all",
      setPlatform: (p) => set({ platform: p }),
    }),
    { name: "navio-platform-v1" }
  )
);
