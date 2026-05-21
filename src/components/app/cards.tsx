import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight, Bookmark, Check, X, Sparkles, Eye, Heart, MessageCircle,
  Lightbulb, TrendingUp, AlertTriangle, Target, Layers, FileText, Megaphone,
  Play, Pause, RotateCcw, CheckCheck, Instagram, Music2, Facebook, MapPin,
} from "lucide-react";
import type {
  CompetitorProfile, CompetitorScorecard, IdeaSuggestion, Insight,
  Platform, Post, PostMetrics, TodoItem, TrackingExperiment, TrendItem,
  ContentFormatAnalysis, OwnSocialProfile, DashboardCard,
} from "@/lib/data/types";

// ---------- helpers --------------------------------------------------------

export function PlatformBadge({ platform }: { platform: Platform | "all" }) {
  const map: Record<string, { Icon: React.ComponentType<{ className?: string }>; label: string }> = {
    instagram: { Icon: Instagram, label: "Instagram" },
    tiktok: { Icon: Music2, label: "TikTok" },
    facebook: { Icon: Facebook, label: "Facebook" },
    google_maps: { Icon: MapPin, label: "Maps" },
    all: { Icon: Layers, label: "All" },
  };
  const { Icon, label } = map[platform] ?? map.all;
  return (
    <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-widest gap-1 border-primary/30 text-primary">
      <Icon className="size-3" /> {label}
    </Badge>
  );
}

const insightTypeStyle: Record<Insight["insight_type"], { label: string; cls: string; Icon: React.ComponentType<{ className?: string }> }> = {
  opportunity: { label: "Opportunity", cls: "bg-success/15 text-success border-success/40", Icon: Lightbulb },
  warning: { label: "Warning", cls: "bg-destructive/15 text-destructive border-destructive/40", Icon: AlertTriangle },
  trend: { label: "Trend", cls: "bg-violet/20 text-violet border-violet/40", Icon: TrendingUp },
  competitor_move: { label: "Competitor move", cls: "bg-primary/15 text-primary border-primary/40", Icon: Target },
  content_gap: { label: "Content gap", cls: "bg-warning/15 text-warning border-warning/40", Icon: FileText },
  own_performance: { label: "Own performance", cls: "bg-primary/15 text-primary border-primary/40", Icon: TrendingUp },
  product_update: { label: "Product update", cls: "bg-violet/15 text-violet border-violet/40", Icon: Megaphone },
};

function impactDot(level: "low" | "medium" | "high") {
  return level === "high" ? "bg-success" : level === "medium" ? "bg-warning" : "bg-muted-foreground";
}

// ---------- ScoreCard ------------------------------------------------------

export function ScoreCard({
  label, value, delta, hint, accent,
}: { label: string; value: string; delta?: string; hint?: string; accent?: "positive" | "negative" | "neutral" }) {
  const deltaCls =
    accent === "positive" ? "text-success border-success/40"
      : accent === "negative" ? "text-destructive border-destructive/40"
        : "text-muted-foreground border-border/60";
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        {delta && (
          <Badge variant="outline" className={cn("rounded-full text-[10px]", deltaCls)}>{delta}</Badge>
        )}
      </div>
      <div className="font-display text-3xl font-bold tracking-tight">{value}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ---------- InsightCard ----------------------------------------------------

export function InsightCard({
  insight, onApply, onSave, onDismiss, onEvidence,
}: {
  insight: Insight;
  onApply?: (i: Insight) => void;
  onSave?: (i: Insight) => void;
  onDismiss?: (i: Insight) => void;
  onEvidence?: (i: Insight) => void;
}) {
  const t = insightTypeStyle[insight.insight_type];
  const applied = insight.status === "applied";
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
      <div className="flex items-start gap-3">
        <div className={cn("size-10 rounded-2xl grid place-items-center border", t.cls)}>
          <t.Icon className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="outline" className={cn("rounded-full text-[10px] uppercase tracking-widest", t.cls)}>
              {t.label}
            </Badge>
            <PlatformBadge platform={insight.platform} />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <span className={cn("size-1.5 rounded-full", impactDot(insight.expected_impact))} /> {insight.expected_impact} impact
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">·</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{insight.difficulty}</span>
          </div>

          <h3 className="font-display text-lg font-semibold leading-snug">{insight.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{insight.summary}</p>

          <div className="mt-4 rounded-2xl bg-background/40 border border-border/60 p-3 flex items-start gap-2">
            <Sparkles className="size-4 mt-0.5 text-primary shrink-0" />
            <div className="text-sm"><span className="font-semibold">Do this:</span> {insight.suggested_action}</div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">{insight.evidence}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="rounded-full h-8" onClick={() => onEvidence?.(insight)}>
                <Eye className="size-3.5 mr-1" /> Evidence
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full h-8" onClick={() => onSave?.(insight)}>
                <Bookmark className="size-3.5 mr-1" /> Save
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full h-8 text-muted-foreground" onClick={() => onDismiss?.(insight)}>
                <X className="size-3.5 mr-1" /> Dismiss
              </Button>
              <Button
                size="sm"
                className="rounded-full h-8 bg-primary text-primary-foreground shadow-glow hover:opacity-90"
                disabled={applied}
                onClick={() => onApply?.(insight)}
              >
                {applied ? <><Check className="size-3.5 mr-1" /> Applied</> : <>Apply <ArrowRight className="size-3.5 ml-1" /></>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- CompetitorRankCard ---------------------------------------------

export function CompetitorRankCard({
  rank, competitor, scorecard, onOpen,
}: { rank: number; competitor: CompetitorProfile; scorecard?: CompetitorScorecard; onOpen?: () => void }) {
  const overall = scorecard?.overall_score ?? 0;
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
      <div className="grid lg:grid-cols-[auto_1fr_auto] gap-5 items-center">
        <div className="flex items-center gap-4 min-w-[260px]">
          <div className="relative size-14 rounded-2xl grid place-items-center text-2xl bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 shadow-pop">
            {competitor.emoji ?? "✨"}
            <span className="absolute -top-2 -left-2 size-6 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold border border-background">
              {rank}
            </span>
          </div>
          <div className="min-w-0">
            <div className="font-display text-base font-bold truncate">{competitor.competitor_name}</div>
            <div className="text-xs text-muted-foreground truncate">{competitor.handle} · {competitor.followers.toLocaleString()} followers</div>
            <div className="mt-1 flex items-center gap-1.5">
              <PlatformBadge platform={competitor.platform} />
              <Badge variant="outline" className="rounded-full text-[10px]">{competitor.positioning}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniScore label="Overall" value={overall} accent />
          <MiniScore label="Engagement" value={scorecard?.engagement_score ?? 0} />
          <MiniScore label="Consistency" value={scorecard?.consistency_score ?? 0} />
          <MiniScore label="Trend usage" value={scorecard?.trend_usage_score ?? 0} />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={onOpen}>Open</Button>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-border/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Why they stand out</div>
          <div>{competitor.why_they_stand_out}</div>
        </div>
        <div className="rounded-2xl border border-border/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">How to respond</div>
          <div>{scorecard?.recommended_response ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}

function MiniScore({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("font-display text-xl font-bold", accent && "text-primary")}>{value}</div>
    </div>
  );
}

// ---------- EmbeddedPostCard ----------------------------------------------

export function EmbeddedPostCard({
  post, metrics, competitor, reason,
}: { post: Post; metrics?: PostMetrics; competitor?: CompetitorProfile; reason?: string }) {
  const grad =
    post.post_type === "reel" || post.post_type === "tiktok_video"
      ? "bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40"
      : "bg-gradient-to-br from-violet/30 via-primary/20 to-primary/30 border border-primary/40";
  return (
    <div className="rounded-3xl border border-border/60 overflow-hidden bg-card/70 backdrop-blur-sm shadow-pop">
      <div className={cn("aspect-square grid place-items-center relative", grad)}>
        {(post.post_type === "reel" || post.post_type === "tiktok_video") && <Play className="size-12 text-primary" />}
        {post.post_type === "carousel" && <Layers className="size-12 text-foreground/70" />}
        <Badge className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur text-foreground border-0">{post.creative_format}</Badge>
        {metrics && (
          <Badge className="absolute top-3 right-3 rounded-full bg-primary text-primary-foreground border-0">
            {metrics.performance_score}
          </Badge>
        )}
        <PlatformBadge platform={post.platform} />
        <div className="absolute bottom-3 left-3">
          <PlatformBadge platform={post.platform} />
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-muted-foreground">{competitor?.handle}</div>
        <div className="font-medium line-clamp-2 mt-1">{post.caption}</div>
        {metrics && (
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="size-3.5" /> {metrics.views.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Heart className="size-3.5" /> {metrics.likes.toLocaleString()}</span>
            <span className="flex items-center gap-1"><MessageCircle className="size-3.5" /> {metrics.comments.toLocaleString()}</span>
          </div>
        )}
        <div className="mt-3 rounded-2xl border border-border/60 bg-background/40 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Why this probably worked</div>
          <div className="text-sm">{reason ?? post.marketing_idea}</div>
        </div>
      </div>
    </div>
  );
}

// ---------- TodoCard -------------------------------------------------------

export function TodoCard({
  todo, onStart, onTrack, onPause, onPostpone, onComplete,
}: {
  todo: TodoItem;
  onStart?: () => void; onTrack?: () => void; onPause?: () => void;
  onPostpone?: () => void; onComplete?: () => void;
}) {
  return (
    <div className="rounded-2xl bg-card/70 backdrop-blur-sm border border-border/60 p-4 shadow-pop space-y-3">
      <div className="flex items-center justify-between gap-2">
        <PlatformBadge platform={todo.platform} />
        <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-widest">{todo.category}</Badge>
      </div>
      <div>
        <div className="font-semibold leading-snug">{todo.title}</div>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{todo.description}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-muted-foreground">Metric</div>
          <div className="font-medium truncate">{todo.success_metric}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Baseline</div>
          <div className="font-medium">{todo.baseline_value}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Target</div>
          <div className="font-medium text-primary">{todo.target_value}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {todo.status === "open" && (
          <Button size="sm" variant="outline" className="rounded-full h-8" onClick={onStart}><Play className="size-3 mr-1" /> Start</Button>
        )}
        {(todo.status === "in_progress" || todo.status === "paused") && (
          <Button size="sm" className="rounded-full h-8 bg-primary text-primary-foreground" onClick={onTrack}>
            <CheckCheck className="size-3 mr-1" /> Done, track
          </Button>
        )}
        {todo.status !== "completed" && todo.status !== "paused" && (
          <Button size="sm" variant="ghost" className="rounded-full h-8" onClick={onPause}><Pause className="size-3 mr-1" /> Pause</Button>
        )}
        {todo.status !== "completed" && (
          <>
            <Button size="sm" variant="ghost" className="rounded-full h-8" onClick={onPostpone}><RotateCcw className="size-3 mr-1" /> Postpone</Button>
            <Button size="sm" variant="ghost" className="rounded-full h-8 text-success" onClick={onComplete}><Check className="size-3 mr-1" /> Complete</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- TrackingExperimentCard ----------------------------------------

export function TrackingExperimentCard({ exp }: { exp: TrackingExperiment }) {
  const pct = exp.target_value
    ? Math.min(100, Math.round(((exp.current_value - exp.baseline_value) / (exp.target_value - exp.baseline_value)) * 100))
    : 0;
  const statusCls = exp.result_status === "improved"
    ? "border-success/40 text-success"
    : exp.result_status === "worse"
      ? "border-destructive/40 text-destructive"
      : "border-border/60 text-muted-foreground";
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
      <div className="flex items-center justify-between gap-2 mb-2">
        <Badge variant="outline" className={cn("rounded-full text-[10px] uppercase tracking-widest", statusCls)}>
          {exp.result_status}
        </Badge>
        <span className="text-xs text-muted-foreground">{exp.metric_tracked}</span>
      </div>
      <div className="font-display text-lg font-semibold">{exp.title}</div>
      <p className="mt-1 text-xs text-muted-foreground">{exp.action_taken}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl border border-border/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Baseline</div>
          <div className="font-display text-xl font-bold">{exp.baseline_value}</div>
        </div>
        <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3">
          <div className="text-[10px] uppercase tracking-widest text-primary">Now</div>
          <div className="font-display text-xl font-bold text-primary">{exp.current_value}</div>
        </div>
        <div className="rounded-2xl border border-border/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Target</div>
          <div className="font-display text-xl font-bold">{exp.target_value}</div>
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${Math.max(2, pct)}%` }} />
      </div>
      <p className="mt-3 text-sm">{exp.result_summary}</p>
    </div>
  );
}

// ---------- IdeaCard -------------------------------------------------------

export function IdeaCard({ idea, onCreateTodo, onSave }: { idea: IdeaSuggestion; onCreateTodo?: () => void; onSave?: () => void }) {
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-widest">{idea.idea_type}</Badge>
        <PlatformBadge platform={idea.platform} />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-auto">
          {idea.difficulty} · {idea.expected_impact} impact
        </span>
      </div>
      <h3 className="font-display text-lg font-semibold leading-snug">{idea.title}</h3>
      <p className="text-sm text-muted-foreground">{idea.description}</p>
      <div className="rounded-2xl border border-border/60 bg-background/40 p-3 text-sm">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Why it fits</div>
        {idea.why_it_fits}
      </div>
      <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
        {idea.implementation_steps.map((s, i) => <li key={i}><span className="text-foreground">{s}</span></li>)}
      </ol>
      <div className="flex gap-1 pt-1">
        <Button size="sm" className="rounded-full h-8 bg-primary text-primary-foreground shadow-glow hover:opacity-90" onClick={onCreateTodo}>
          Create To Do <ArrowRight className="size-3.5 ml-1" />
        </Button>
        <Button size="sm" variant="ghost" className="rounded-full h-8" onClick={onSave}>
          <Bookmark className="size-3.5 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
}

// ---------- TrendCard ------------------------------------------------------

export function TrendCard({ trend, onTurnIntoIdea }: { trend: TrendItem; onTurnIntoIdea?: () => void }) {
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-widest">{trend.trend_type}</Badge>
        <PlatformBadge platform={trend.platform} />
        <Badge className={cn("rounded-full text-[10px] ml-auto border-0",
          trend.urgency === "high" ? "bg-destructive text-destructive-foreground"
            : trend.urgency === "medium" ? "bg-warning text-warning-foreground" : "bg-muted text-foreground")}>
          {trend.urgency} urgency
        </Badge>
      </div>
      <h3 className="font-display text-lg font-semibold">{trend.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{trend.description}</p>
      <div className="mt-3 text-xs text-success font-semibold flex items-center gap-1">
        <TrendingUp className="size-3.5" /> {trend.growth_signal}
      </div>
      <div className="mt-3 rounded-2xl border border-border/60 bg-background/40 p-3 text-sm">
        <span className="font-semibold">Do this:</span> {trend.recommended_action}
      </div>
      <div className="mt-3 flex gap-1">
        <Button size="sm" className="rounded-full h-8 bg-primary text-primary-foreground" onClick={onTurnIntoIdea}>
          Turn into idea <ArrowRight className="size-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// ---------- ProfileDiagnosisCard ------------------------------------------

export function ProfileDiagnosisCard({
  profile, onSave,
}: { profile: OwnSocialProfile; onSave: (corrections: OwnSocialProfile["user_corrections"]) => void }) {
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-semibold">Profile diagnosis</h3>
          <p className="text-xs text-muted-foreground">AI detected this from your {profile.handle}. Correct anything off.</p>
        </div>
        <PlatformBadge platform={profile.platform} />
      </div>

      <DiagnosisRow
        label="Niche"
        detected={profile.detected_niche}
        current={profile.user_corrections.niche}
        onSave={(v) => onSave({ niche: v })}
      />
      <DiagnosisRow
        label="Brand voice"
        detected={profile.detected_brand_voice}
        current={profile.user_corrections.brand_voice}
        onSave={(v) => onSave({ brand_voice: v })}
      />
      <DiagnosisRow
        label="Visual style"
        detected={profile.detected_visual_style}
        current={profile.user_corrections.visual_style}
        onSave={(v) => onSave({ visual_style: v })}
      />
      <div className="py-3 border-t border-border/60">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Content pillars</div>
        <div className="flex flex-wrap gap-2">
          {(profile.user_corrections.content_pillars ?? profile.detected_content_pillars).map((p) => (
            <Badge key={p} variant="outline" className="rounded-full">{p}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiagnosisRow({
  label, detected, current, onSave,
}: { label: string; detected: string; current?: string; onSave: (v: string) => void }) {
  return (
    <div className="py-3 border-t border-border/60 first:border-t-0 flex items-start gap-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground w-28 pt-1">{label}</div>
      <div className="flex-1">
        <div className="text-sm">{current ?? detected}</div>
        {!current && <div className="text-xs text-muted-foreground mt-0.5">AI detected · correct if needed</div>}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="rounded-full h-8"
        onClick={() => {
          const v = typeof window !== "undefined" ? window.prompt(`Correct ${label}:`, current ?? detected) : null;
          if (v && v.trim()) onSave(v.trim());
        }}
      >
        Edit
      </Button>
    </div>
  );
}

// ---------- FormatCard ----------------------------------------------------

export function FormatCard({ format }: { format: ContentFormatAnalysis }) {
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
      <div className="flex items-center justify-between mb-2">
        <PlatformBadge platform={format.platform} />
        <Badge variant="outline" className={cn(
          "rounded-full text-[10px]",
          format.average_performance_score >= 75 ? "border-success/40 text-success"
            : format.average_performance_score >= 50 ? "border-warning/40 text-warning"
              : "border-destructive/40 text-destructive"
        )}>
          Score {format.average_performance_score}
        </Badge>
      </div>
      <h3 className="font-display text-lg font-semibold">{format.format_name}</h3>
      <p className="text-xs text-muted-foreground mt-1">Used by {format.competitor_usage_count} of your competitors {format.user_uses_it ? "· you use it" : "· you don't use it yet"}</p>
      <div className="mt-3 rounded-2xl border border-border/60 bg-background/40 p-3 text-sm">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Why it works</div>
        {format.why_it_works}
      </div>
      <div className="mt-2 rounded-2xl border border-primary/30 bg-primary/5 p-3 text-sm">
        <div className="text-[10px] uppercase tracking-widest text-primary mb-1">Recommendation</div>
        {format.recommendation_for_user}
      </div>
    </div>
  );
}

// ---------- DashboardCardView --------------------------------------------

export function DashboardCardView({ card }: { card: DashboardCard }) {
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
      <div className="flex items-center justify-between gap-2 mb-1">
        <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-widest">{card.card_type.replaceAll("_", " ")}</Badge>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">via {card.created_by}</span>
      </div>
      <h3 className="font-display text-lg font-semibold mt-1">{card.title}</h3>
      {card.subtitle && <div className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</div>}
      {card.body && <p className="mt-2 text-sm">{card.body}</p>}
      <div className="mt-3 flex gap-1">
        <Button size="sm" variant="ghost" className="rounded-full h-8"><Eye className="size-3.5 mr-1" /> Evidence</Button>
        <Button size="sm" className="rounded-full h-8 bg-primary text-primary-foreground">Create To Do <ArrowRight className="size-3.5 ml-1" /></Button>
      </div>
    </div>
  );
}

// ---------- EmptyState ----------------------------------------------------

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 backdrop-blur-sm p-8 text-center">
      <div className="size-12 mx-auto rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center mb-3">
        <Sparkles className="size-5 text-primary" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{body}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-3">n8n + Apify will populate this</p>
    </div>
  );
}
