import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, ArrowLeft, Coffee, Dumbbell, Scissors, Wrench,
  Camera, Pizza, Check, Plus, X, Instagram, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { submitOnboarding } from "@/lib/data/onboarding.functions";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Get started — Navio" },
      { name: "description", content: "Set up your Navio workspace in under 2 minutes." },
      { property: "og:title", content: "Get started — Navio" },
      { property: "og:description", content: "Set up your Navio workspace in under 2 minutes." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/onboarding" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/onboarding" },
    ],
  }),
});

const niches = [
  { id: "cafe", label: "Café / Restaurant", icon: Coffee, gradient: "bg-gradient-coral" },
  { id: "gym", label: "Gym / Fitness", icon: Dumbbell, gradient: "bg-gradient-violet" },
  { id: "beauty", label: "Beauty / Spa", icon: Scissors, gradient: "bg-gradient-lime" },
  { id: "service", label: "Local service", icon: Wrench, gradient: "bg-gradient-sunset" },
  { id: "studio", label: "Studio / Creative", icon: Camera, gradient: "bg-gradient-violet" },
  { id: "retail", label: "Retail / Food", icon: Pizza, gradient: "bg-gradient-coral" },
];

const languages = [
  { id: "uk" as const, label: "Українська", flag: "🇺🇦" },
  { id: "en" as const, label: "English", flag: "🇬🇧" },
  { id: "de" as const, label: "Deutsch", flag: "🇩🇪" },
];

function Onboarding() {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("cafe");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [handle, setHandle] = useState("");
  const [language, setLanguage] = useState<"uk" | "en" | "de">("uk");
  const [customHandle, setCustomHandle] = useState("");
  const [customs, setCustoms] = useState<{ handle: string; name: string; emoji: string }[]>([]);
  const [targetAudience, setTargetAudience] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetcher = useServerFn(submitOnboarding);
  const navigate = useNavigate();

  const totalCompetitors = customs.length;

  const next = () => {
    if (step === 1) {
      if (!targetAudience.trim() || !productDescription.trim() || !mainGoal.trim()) {
        setSubmitError("Заповни всі поля для продовження");
        return;
      }
      setSubmitError(null);
    }
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };
  const back = () => step > 1 && setStep(step - 1);

  const addCustom = () => {
    if (!customHandle.trim() || customs.length >= 10) return;
    const h = customHandle.startsWith("@") ? customHandle : "@" + customHandle;
    setCustoms([...customs, { handle: h, name: h.slice(1), emoji: "✨" }]);
    setCustomHandle("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const competitorAccounts = customs.map(c => ({
      platform: "instagram",
      username: c.handle.replace("@", ""),
    }));

    const ownAccounts = handle.trim()
      ? [{ platform: "instagram", username: handle.replace("@", "") }]
      : [];

    try {
      const result = await fetcher({
        data: {
          project_name: businessName || niche,
          niche,
          target_audience: targetAudience,
          product_description: productDescription,
          main_goal: mainGoal,
          report_language: language,
          own_accounts: ownAccounts,
          competitor_accounts: competitorAccounts,
        },
      });

      if (result.ok) {
        setScanning(true);
      } else {
        setSubmitError(result.error ?? "Помилка при запуску аналізу");
      }
    } catch (e: any) {
      setSubmitError(e?.message ?? "Невідома помилка");
    } finally {
      setSubmitting(false);
    }
  };

  if (scanning) return <ScanScreen />;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-gradient-violet opacity-20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-gradient-lime opacity-20 blur-3xl" />

      <header className="relative max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-2xl bg-gradient-violet shadow-pop grid place-items-center">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">Navio</span>
        </Link>
        <span className="text-sm text-muted-foreground">Step {step} of 3</span>
      </header>

      <div className="relative max-w-3xl mx-auto px-6">
        <Progress value={(step / 3) * 100} className="h-1.5" />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="mt-12"
          >
            {step === 1 && (
              <>
                <Badge variant="secondary" className="rounded-full mb-4">👋 Welcome</Badge>
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Tell us about your business.</h1>
                <p className="mt-3 text-muted-foreground text-lg">We'll use this to find the right competitors and trends.</p>

                <div className="mt-10 space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">What kind of business?</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {niches.map(n => (
                        <button
                          key={n.id}
                          onClick={() => setNiche(n.id)}
                          className={`group rounded-2xl p-5 text-left border-2 transition-all ${niche === n.id ? "border-primary bg-card shadow-pop" : "border-border bg-card/50 hover:border-border/80"}`}
                        >
                          <div className={`size-10 rounded-xl grid place-items-center text-white ${n.gradient} shadow-pop mb-3`}>
                            <n.icon className="size-5" />
                          </div>
                          <span className="font-medium text-sm">{n.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Business name</label>
                      <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Café Svitlo" className="h-12 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">City</label>
                      <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Lviv, UA" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Instagram handle</label>
                    <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input value={handle} onChange={e => setHandle(e.target.value)} placeholder="@yourhandle" className="h-12 rounded-xl pl-11" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Report language</label>
                    <div className="flex gap-2">
                      {languages.map(l => (
                        <button
                          key={l.id}
                          onClick={() => setLanguage(l.id)}
                          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border-2 transition-all ${language === l.id ? "border-primary bg-card shadow-pop" : "border-border bg-card/50 hover:border-border/80"}`}
                        >
                          <span>{l.flag}</span>
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {language === "de" ? "Zielgruppe" : language === "en" ? "Target audience" : "Цільова аудиторія"}
                    </label>
                    <textarea
                      value={targetAudience}
                      onChange={e => setTargetAudience(e.target.value)}
                      placeholder={language === "de" ? "Wer sind Ihre Kunden? Alter, Interessen, Probleme..." : language === "en" ? "Who are your customers? Age, interests, pain points..." : "Хто ваші клієнти? Вік, інтереси, болі..."}
                      className="w-full h-24 rounded-xl border border-border bg-card/50 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {language === "de" ? "Produktbeschreibung" : language === "en" ? "Product description" : "Опис продукту"}
                    </label>
                    <textarea
                      value={productDescription}
                      onChange={e => setProductDescription(e.target.value)}
                      placeholder={language === "de" ? "Was verkaufen Sie und was ist der Hauptnutzen?" : language === "en" ? "What do you sell and what is the main value?" : "Що ви продаєте і в чому головна цінність?"}
                      className="w-full h-24 rounded-xl border border-border bg-card/50 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {language === "de" ? "Hauptziel" : language === "en" ? "Main goal" : "Головна мета"}
                    </label>
                    <textarea
                      value={mainGoal}
                      onChange={e => setMainGoal(e.target.value)}
                      placeholder={language === "de" ? "Was möchten Sie erreichen? Mehr Kunden, Bekanntheit..." : language === "en" ? "What do you want to achieve? More customers, brand awareness..." : "Що хочете досягти? Наприклад: більше клієнтів, впізнаваність..."}
                      className="w-full h-24 rounded-xl border border-border bg-card/50 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <Badge variant="secondary" className="rounded-full mb-4">🎯 Niche detected</Badge>
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">We think you're in...</h1>
                <p className="mt-3 text-muted-foreground text-lg">Confirm your niche so our analysis stays sharp.</p>

                <div className="mt-10 rounded-3xl bg-gradient-card border border-border/60 p-8 shadow-soft">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl bg-gradient-coral grid place-items-center text-white shadow-pop">
                      <Coffee className="size-8" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold">Specialty Coffee</h3>
                      <p className="text-muted-foreground">{location || "Lviv"} · Downtown</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["specialty coffee", "latte art", "roastery", "brunch", "morning crowd", "remote work friendly"].map(t => (
                      <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
                    ))}
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground">
                    Based on 47 posts on {handle || "your account"}, your bio, and Google Maps category.
                    <button className="ml-2 text-primary font-medium hover:underline">Adjust niche</button>
                  </p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Badge variant="secondary" className="rounded-full mb-4">🔭 Competitor radar</Badge>
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Who are we watching?</h1>
                <p className="mt-3 text-muted-foreground text-lg">
                  Add competitors to track. Up to <strong>10 total</strong> · {totalCompetitors} added.
                </p>

                {customs.length > 0 && (
                  <div className="mt-8 grid md:grid-cols-2 gap-3">
                    {customs.map((c, i) => (
                      <div key={c.handle} className="rounded-2xl p-4 border-2 border-primary bg-card shadow-pop flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-gradient-lime grid place-items-center text-2xl">{c.emoji}</div>
                        <div className="flex-1">
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.handle} · added by you</div>
                        </div>
                        <button onClick={() => setCustoms(customs.filter((_, j) => j !== i))} className="size-7 rounded-full bg-muted grid place-items-center hover:bg-destructive hover:text-destructive-foreground transition">
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex gap-2">
                  <Input
                    value={customHandle}
                    onChange={e => setCustomHandle(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addCustom()}
                    placeholder="@add_custom_competitor"
                    className="h-12 rounded-xl"
                    disabled={totalCompetitors >= 10}
                  />
                  <Button onClick={addCustom} variant="outline" className="rounded-xl h-12 px-5" disabled={totalCompetitors >= 10}>
                    <Plus className="size-4 mr-1" /> Add
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex flex-col gap-4 pb-12">
          {submitError && (
            <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
              {submitError}
            </div>
          )}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={back} disabled={step === 1 || submitting} className="rounded-full">
              <ArrowLeft className="size-4 mr-1" /> Back
            </Button>
            <Button onClick={next} disabled={submitting} className="rounded-full h-12 px-7 bg-gradient-violet shadow-pop hover:shadow-glow">
              {step === 3
                ? submitting
                  ? <><Loader2 className="size-4 mr-2 animate-spin" /> Запускаємо...</>
                  : <>Start scanning <ArrowRight className="size-4 ml-1" /></>
                : <>Continue <ArrowRight className="size-4 ml-1" /></>
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background grid place-items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-30" />
      <motion.div
        className="absolute size-[600px] rounded-full bg-gradient-violet opacity-30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="relative text-center max-w-md px-6 space-y-6">
        <motion.div
          className="size-24 rounded-3xl bg-gradient-violet grid place-items-center mx-auto shadow-glow"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="size-12 text-primary-foreground" />
        </motion.div>
        <div>
          <h2 className="font-display text-3xl font-bold">Аналіз запущено!</h2>
          <p className="mt-3 text-muted-foreground">
            Збираємо дані конкурентів і аналізуємо контент.
            Зазвичай займає 5–15 хвилин. Можеш закрити вкладку —
            дані збережуться автоматично.
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/app" })}
          className="rounded-full h-12 px-7 bg-gradient-violet shadow-pop"
        >
          Перейти до дашборду <ArrowRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
