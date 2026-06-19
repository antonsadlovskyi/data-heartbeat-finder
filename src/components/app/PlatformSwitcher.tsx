import { Instagram, Music2, AtSign, X as XIcon, Layers } from "lucide-react";
import { usePlatform, PLATFORMS, type Platform } from "@/lib/platform-store";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";

type Opt = {
  id: Platform;
  labelKey?: "platform.all";
  rawLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
};

// Canonical V2 platforms (see memory: navio-v2-contract). All five are backed by
// page_objects — threads/x simply resolve to data_status `not_connected`, which
// the page renders, so none are disabled here.
const OPTIONS: Record<Platform, Opt> = {
  all: { id: "all", labelKey: "platform.all", icon: Layers },
  instagram: { id: "instagram", rawLabel: "Instagram", icon: Instagram },
  tiktok: { id: "tiktok", rawLabel: "TikTok", icon: Music2 },
  threads: { id: "threads", rawLabel: "Threads", icon: AtSign },
  x: { id: "x", rawLabel: "X", icon: XIcon },
};

export function PlatformSwitcher({ compact = false }: { compact?: boolean }) {
  const platform = usePlatform((s) => s.platform);
  const setPlatform = usePlatform((s) => s.setPlatform);
  const t = useT();

  return (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-card/70 backdrop-blur-xl p-1 gap-0.5">
      {PLATFORMS.map((id) => {
        const o = OPTIONS[id];
        const active = platform === o.id;
        const label = o.labelKey ? t(o.labelKey) : o.rawLabel ?? "";
        return (
          <button
            key={o.id}
            onClick={() => setPlatform(o.id)}
            title={label}
            className={cn(
              "flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium transition",
              active
                ? "bg-primary/20 text-primary border border-primary/40"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <o.icon className="size-3.5" />
            {!compact && <span className="hidden sm:inline">{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
