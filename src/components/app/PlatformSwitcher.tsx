import { Instagram, Music2, Facebook, MapPin, Layers } from "lucide-react";
import { useNavio } from "@/lib/store";
import type { PlatformFilter } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const options: { id: PlatformFilter; label: string; icon: React.ComponentType<{ className?: string }>; disabled?: boolean }[] = [
  { id: "all", label: "All", icon: Layers },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tiktok", label: "TikTok", icon: Music2 },
  { id: "facebook", label: "Facebook", icon: Facebook, disabled: true },
  { id: "google_maps", label: "Maps", icon: MapPin, disabled: true },
];

export function PlatformSwitcher({ compact = false }: { compact?: boolean }) {
  const platform = useNavio((s) => s.platform);
  const setPlatform = useNavio((s) => s.setPlatform);

  return (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-card/70 backdrop-blur-xl p-1 gap-0.5">
      {options.map((o) => {
        const active = platform === o.id;
        return (
          <button
            key={o.id}
            onClick={() => !o.disabled && setPlatform(o.id)}
            disabled={o.disabled}
            title={o.disabled ? `${o.label} — coming soon` : o.label}
            className={cn(
              "flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium transition",
              active
                ? "bg-primary/20 text-primary border border-primary/40"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              o.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            <o.icon className="size-3.5" />
            {!compact && <span className="hidden sm:inline">{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
