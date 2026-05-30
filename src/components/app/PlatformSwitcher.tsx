import { Instagram, Music2, Facebook, MapPin, Layers } from "lucide-react";
import { useNavio } from "@/lib/store";
import type { PlatformFilter } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";

type Opt = { id: PlatformFilter; labelKey?: "platform.all"; rawLabel?: string; icon: React.ComponentType<{ className?: string }>; disabled?: boolean; disabledKey?: "platform.facebook_soon" | "platform.maps_soon" };
const options: Opt[] = [
  { id: "all", labelKey: "platform.all", icon: Layers },
  { id: "instagram", rawLabel: "Instagram", icon: Instagram },
  { id: "tiktok", rawLabel: "TikTok", icon: Music2 },
  { id: "facebook", rawLabel: "Facebook", icon: Facebook, disabled: true, disabledKey: "platform.facebook_soon" },
  { id: "google_maps", rawLabel: "Maps", icon: MapPin, disabled: true, disabledKey: "platform.maps_soon" },
];

export function PlatformSwitcher({ compact = false }: { compact?: boolean }) {
  const platform = useNavio((s) => s.platform);
  const setPlatform = useNavio((s) => s.setPlatform);
  const t = useT();

  return (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-card/70 backdrop-blur-xl p-1 gap-0.5">
      {options.map((o) => {
        const active = platform === o.id;
        const label = o.labelKey ? t(o.labelKey) : o.rawLabel ?? "";
        const title = o.disabled && o.disabledKey ? t(o.disabledKey) : label;
        return (
          <button
            key={o.id}
            onClick={() => !o.disabled && setPlatform(o.id)}
            disabled={o.disabled}
            title={title}
            className={cn(
              "flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium transition",
              active
                ? "bg-primary/20 text-primary border border-primary/40"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              o.disabled && "opacity-40 cursor-not-allowed"
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
