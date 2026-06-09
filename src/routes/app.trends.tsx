import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";

const INITIAL_VISIBLE = 6;

export const Route = createFileRoute("/app/trends")({
  head: () => ({
    meta: [
      { title: "Trends — Navio" },
      { name: "description", content: "Local audios, hashtags, and formats bubbling up before they peak." },
      { property: "og:title", content: "Trends — Navio" },
      { property: "og:description", content: "Local audios, hashtags, and formats bubbling up before they peak." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/trends" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/trends" },
    ],
  }),
  component: Trends,
});

function TrendGroup({ group }: { group: any }) {
  const items: any[] = group.items ?? [];
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, INITIAL_VISIBLE);
  const hidden = items.length - INITIAL_VISIBLE;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl font-bold">{group.label}</h2>
        <Badge variant="outline" className="rounded-full">{items.length}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {visible.map((item: any, i: number) => {
          const title = item.pattern ?? item.insight ?? "";
          const body = item.works_because ?? item.what_to_watch ?? "";
          const note = item.platform_specific_note ?? null;
          const tag = item.type ?? null;
          return (
            <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-2">
              <div className="flex flex-wrap items-start gap-2">
                {tag && (
                  <Badge variant="outline" className="rounded-full text-xs shrink-0">{tag}</Badge>
                )}
                <h3 className="font-display text-base font-semibold leading-snug">{title}</h3>
              </div>
              {body && (
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              )}
              {note && (
                <div className="pt-1">
                  <Badge variant="outline" className="rounded-full text-xs border-primary/30 text-primary/80">
                    {note}
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!expanded && hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="text-sm text-primary hover:underline"
        >
          Показати ще {hidden} патернів ↓
        </button>
      )}
      {expanded && items.length > INITIAL_VISIBLE && (
        <button
          onClick={() => setExpanded(false)}
          className="text-sm text-muted-foreground hover:underline"
        >
          Згорнути ↑
        </button>
      )}
    </section>
  );
}

function Trends() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("trend_tracker");

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="trend_tracker" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="trend_tracker" roleKey={role} generatedAt={generatedAt} />;

  const groups: any[] = payload.sections?.trend_groups ?? [];

  if (groups.length === 0) return <PageObjectEmpty pageKey="trend_tracker" roleKey={role} generatedAt={generatedAt} />;

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          {payload.page_title || "Тренди"}
        </h1>
      </div>

      {groups.map((group) => (
        <TrendGroup key={group.group_key} group={group} />
      ))}
    </div>
  );
}
