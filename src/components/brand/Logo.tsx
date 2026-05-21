import { cn } from "@/lib/utils";

/**
 * Minimalist FlyHigh constellation mark — three sparkles connected by a faint
 * line forming an upward-rising arc, plus the wordmark.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-9", className)} fill="none" aria-hidden>
      <defs>
        <radialGradient id="fh-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.92 0.18 220)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="oklch(0.7 0.2 240)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="oklch(0.5 0.2 270)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fh-stroke" x1="0" x2="64" y1="64" y2="0">
          <stop offset="0%" stopColor="oklch(0.7 0.2 280)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.9 0.18 220)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* Soft halo */}
      <circle cx="32" cy="32" r="28" fill="url(#fh-glow)" />

      {/* Connecting arc rising upward */}
      <path d="M 12 50 Q 28 30 32 14 Q 36 30 52 50" stroke="url(#fh-stroke)" strokeWidth="0.8" strokeLinecap="round" fill="none" strokeDasharray="1.5 2" />

      {/* Sparkle helper */}
      {[
        { x: 12, y: 50, s: 3 },
        { x: 32, y: 14, s: 5 },
        { x: 52, y: 50, s: 3 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.s * 1.6} fill="url(#fh-glow)" />
          <path
            d={`M${p.x},${p.y - p.s} L${p.x + p.s * 0.25},${p.y - p.s * 0.25} L${p.x + p.s},${p.y} L${p.x + p.s * 0.25},${p.y + p.s * 0.25} L${p.x},${p.y + p.s} L${p.x - p.s * 0.25},${p.y + p.s * 0.25} L${p.x - p.s},${p.y} L${p.x - p.s * 0.25},${p.y - p.s * 0.25} Z`}
            fill="oklch(0.97 0.05 220)"
          />
        </g>
      ))}
    </svg>
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="font-display text-xl font-light tracking-tight text-foreground">
        Fly<span className="text-primary text-glow">High</span>
      </span>
    </div>
  );
}