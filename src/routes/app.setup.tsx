import { createFileRoute } from "@tanstack/react-router";
import { useFlyHigh } from "@/lib/store";
import { ProfileDiagnosisCard, EmptyState } from "@/components/app/cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/app/setup")({
  component: SetupPage,
  head: () => ({ meta: [{ title: "FlyHigh · Setup" }] }),
});

function SetupPage() {
  const workspace = useFlyHigh((s) => s.workspace);
  const updateWorkspace = useFlyHigh((s) => s.updateWorkspace);
  const ownProfiles = useFlyHigh((s) => s.ownProfiles);
  const updateOwnProfileDiagnosis = useFlyHigh((s) => s.updateOwnProfileDiagnosis);
  const competitors = useFlyHigh((s) => s.competitors);
  const removeCompetitor = useFlyHigh((s) => s.removeCompetitor);

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Setup</h1>
          <p className="text-muted-foreground mt-1">
            Tell FlyHigh who you are. The sharper the brief, the sharper the insights.
          </p>
        </div>
        <Badge variant="outline" className="rounded-full gap-1.5">
          <Wand2 className="size-3.5" /> AI-assisted
        </Badge>
      </header>

      {/* Business brief */}
      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop space-y-5">
        <div>
          <h2 className="font-display text-xl font-semibold">Business brief</h2>
          <p className="text-xs text-muted-foreground">Used by every scan, insight and idea.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Business name" value={workspace.business_name} onSave={(v) => updateWorkspace({ business_name: v })} />
          <Field label="Niche" value={workspace.niche} onSave={(v) => updateWorkspace({ niche: v })} />
          <Field label="Location" value={workspace.location} onSave={(v) => updateWorkspace({ location: v })} />
          <Field label="Main goal" value={workspace.main_goal} onSave={(v) => updateWorkspace({ main_goal: v })} />
        </div>
        <FieldArea label="Target audience" value={workspace.target_audience} onSave={(v) => updateWorkspace({ target_audience: v })} />
        <FieldArea label="Brand positioning" value={workspace.brand_positioning} onSave={(v) => updateWorkspace({ brand_positioning: v })} />
      </section>

      {/* Own profiles */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold">Your profiles</h2>
          <Badge variant="outline" className="rounded-full">{ownProfiles.length}</Badge>
        </div>
        {ownProfiles.length === 0 ? (
          <EmptyState title="No profiles connected" body="Add your Instagram or TikTok to start tracking." />
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {ownProfiles.map((p) => (
              <ProfileDiagnosisCard
                key={p.id}
                profile={p}
                onSave={(corr) => updateOwnProfileDiagnosis(p.id, corr)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Competitors */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold">Tracked competitors</h2>
            <Badge variant="outline" className="rounded-full">{competitors.length}</Badge>
          </div>
          <Button size="sm" className="rounded-full bg-primary text-primary-foreground">
            <Plus className="size-3.5 mr-1" /> Add competitor
          </Button>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur-sm divide-y divide-border/60 overflow-hidden">
          {competitors.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4">
              <div className="size-10 rounded-xl grid place-items-center bg-primary/10 border border-primary/30 text-lg">
                {c.emoji ?? "✨"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.competitor_name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {c.handle} · {c.platform} · {c.followers.toLocaleString()} followers
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-muted-foreground hover:text-destructive"
                onClick={() => removeCompetitor(c.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      <Input
        defaultValue={value}
        onBlur={(e) => {
          const v = e.target.value.trim();
          if (v && v !== value) onSave(v);
        }}
        className="rounded-xl bg-background/40"
      />
    </div>
  );
}

function FieldArea({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      <Textarea
        defaultValue={value}
        rows={2}
        onBlur={(e) => {
          const v = e.target.value.trim();
          if (v && v !== value) onSave(v);
        }}
        className="rounded-xl bg-background/40"
      />
    </div>
  );
}
