import { Languages } from "lucide-react";
import { useUiLang } from "@/lib/i18n/ui-language-store";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const lang = useUiLang((s) => s.lang);
  const setLang = useUiLang((s) => s.setLang);
  const opts: { id: "en" | "uk"; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "uk", label: "UA" },
  ];
  return (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-card/70 backdrop-blur p-0.5">
      <Languages className="size-3.5 text-muted-foreground mx-2" />
      {opts.map((o) => {
        const active = lang === o.id;
        return (
          <button
            key={o.id}
            onClick={() => setLang(o.id)}
            className={cn(
              "px-2.5 h-7 rounded-full text-[11px] font-semibold tracking-wide transition",
              active
                ? "bg-primary text-primary-foreground shadow-pop"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={active}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}