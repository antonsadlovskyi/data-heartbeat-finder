import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Sparkles, TrendingUp, Eye, ChevronLeft, ChevronRight, ArrowRight,
  Instagram, Facebook, MapPin, CheckCircle2, BarChart3, Target, Rocket, UserCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo, LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "FlyHigh — Marketing intelligence for local business" },
      { name: "description", content: "Spy on competitors, ride trends, ship better posts. Built for local cafés, gyms and studios." },
    ],
  }),
});

const slides = [
  { eyebrow: "WE ARE FLYHIGH", title: "Your strategic marketing advantage." },
  { eyebrow: "COMPETITOR RADAR", title: "See what works. Skip what doesn't." },
  { eyebrow: "TREND TRACKER", title: "Catch the wave before it peaks." },
  { eyebrow: "PERFORMANCE", title: "Prove the lift with your own data." },
];

function Landing() {
  const [slide, setSlide] = useState(0);
  const next = () => setSlide((s) => (s + 1) % slides.length);
  const prev = () => setSlide((s) => (s - 1 + slides.length) % slides.length);
  const current = slides[slide];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* HERO — cosmic */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 starfield" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 horizon-glow pointer-events-none" />

        {/* Top pill — slide indicator */}
        <div className="relative z-20 pt-10 flex justify-center px-6">
          <div className="flex items-center gap-3 rounded-full bg-gradient-pill border border-border/60 backdrop-blur-xl shadow-pop px-3 py-2 min-w-[420px] max-w-[90vw]">
            <button onClick={prev} className="size-9 grid place-items-center rounded-full hover:bg-white/5 text-muted-foreground hover:text-primary transition">
              <ChevronLeft className="size-4" />
            </button>
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 text-center"
            >
              <div className="text-[11px] tracking-[0.25em] text-primary/90 font-medium">{current.eyebrow}</div>
              <div className="text-sm text-foreground/85 mt-0.5">{current.title}</div>
            </motion.div>
            <button onClick={next} className="size-9 grid place-items-center rounded-full hover:bg-white/5 text-muted-foreground hover:text-primary transition">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Center — particle wordmark */}
        <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="font-display font-light tracking-tight text-glow text-[clamp(4rem,16vw,12rem)] leading-[1.15] pb-4 bg-gradient-to-r from-lime via-sky to-violet bg-clip-text text-transparent">
              FlyHigh
            </h1>
            <div className="mt-8 flex justify-center">
              <LogoMark className="size-14 opacity-80" />
            </div>
            <p className="mt-4 text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground">
              Marketing Intelligence
            </p>
          </motion.div>
        </div>

      </section>

      {/* STICKY HEADER — sits flush at hero bottom, docks to top on scroll */}
      <header className="sticky top-0 z-40 -mt-[64px] px-6 py-3 bg-gradient-to-b from-background/0 via-background/60 to-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="text-foreground">
            <Logo markClassName="size-8" />
          </Link>

          <div className="rounded-full bg-gradient-pill border border-border/60 backdrop-blur-xl shadow-pop px-2 py-1.5 flex items-center gap-1">
            <NavPill href="#features" label="Features" active />
            <NavPill href="#how" label="How it works" />
            <NavPill href="#pricing" label="Pricing" />
            <NavPill href="#contact" label="Contact" />
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost" className="rounded-full h-10 w-10 p-0 border border-primary/30 hover:bg-primary/10 hover:border-primary/60" title="Open app">
              <Link to="/app"><UserCircle2 className="size-5 text-primary" /></Link>
            </Button>
            <Button asChild size="sm" className="rounded-full h-10 px-5 bg-primary text-primary-foreground hover:opacity-90 shadow-glow text-xs uppercase tracking-widest font-semibold">
              <Link to="/onboarding">Start trial</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Platforms */}
      <section className="relative border-y border-border/40 bg-card/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-muted-foreground">
          <span className="text-[11px] uppercase tracking-[0.3em]">Connects to</span>
          <span className="flex items-center gap-2 text-sm"><Instagram className="size-4 text-primary" /> Instagram</span>
          <span className="flex items-center gap-2 text-sm"><Facebook className="size-4 text-primary" /> Facebook</span>
          <span className="flex items-center gap-2 text-sm"><Sparkles className="size-4 text-primary" /> TikTok</span>
          <span className="flex items-center gap-2 text-sm"><MapPin className="size-4 text-primary" /> Google Maps</span>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-32 px-6">
        <div className="absolute inset-0 starfield opacity-30" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="text-[11px] tracking-[0.3em] text-primary uppercase mb-4">What do we do?</div>
            <h2 className="font-display font-light text-4xl md:text-6xl tracking-tight text-balance">
              Three views.{" "}
              <span className="text-primary text-glow">One unfair advantage.</span>
            </h2>
            <p className="mt-6 text-muted-foreground">Every screen ends in a concrete next step — never a data graveyard.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <OrbitCard icon={<Eye className="size-6" />} title="Competitor Radar" body="Track up to 10 rivals across IG, FB, TikTok and Maps. Cadence, hashtags, top posts, sentiment — side by side." />
            <OrbitCard icon={<TrendingUp className="size-6" />} title="Trend Tracker" body="Audios, hashtags, formats and seasonal hooks bubbling up locally — before they peak." />
            <OrbitCard icon={<BarChart3 className="size-6" />} title="My Performance" body="Connect your accounts. FlyHigh correlates what you post with how it performs." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative py-32 px-6 border-y border-border/40">
        <div className="absolute inset-x-0 bottom-0 h-1/2 horizon-glow opacity-40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="text-[11px] tracking-[0.3em] text-primary uppercase mb-4">Process</div>
            <h2 className="font-display font-light text-4xl md:text-6xl tracking-tight">From signup to insight in <span className="text-primary text-glow">2 minutes.</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <Step n="01" icon={<Target className="size-5" />} title="Tell us about you" body="Name, location, your handle. We auto-detect your niche." />
            <Step n="02" icon={<Eye className="size-5" />} title="Pick competitors" body="AI suggests 5–8. Approve, swap, or add up to 10 manually." />
            <Step n="03" icon={<Rocket className="size-5" />} title="Get insights" body="Apify + n8n scrape. Claude synthesizes. Daily action card." />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="text-[11px] tracking-[0.3em] text-primary uppercase mb-4">Pricing</div>
            <h2 className="font-display font-light text-4xl md:text-6xl tracking-tight">Start free. <span className="text-primary text-glow">Upgrade when hooked.</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <PriceCard tier="Trial" price="Free" period="for 7 days" features={["3 competitors", "All 4 platforms", "Daily updates", "Insights feed"]} cta="Start trial" />
            <PriceCard tier="Starter" price="€10" period="/ month" features={["5 competitors", "Connect own accounts", "Performance tracking", "Weekly AI report"]} cta="Choose Starter" highlighted />
            <PriceCard tier="Pro" price="€30" period="/ month" features={["10 competitors", "Trend Tracker + audios", "Side-by-side compare", "PDF exports"]} cta="Go Pro" />
          </div>
          <p className="mt-8 text-center text-xs tracking-widest uppercase text-muted-foreground">UA market pricing adjusted ~35% lower at checkout.</p>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="relative px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-card p-12 md:p-20 shadow-glow">
            <div className="absolute inset-0 horizon-glow opacity-60" />
            <div className="absolute inset-0 starfield opacity-40" />
            <div className="relative max-w-2xl">
              <div className="text-[11px] tracking-[0.3em] text-primary uppercase mb-4">Ready?</div>
              <h2 className="font-display font-light text-4xl md:text-6xl tracking-tight">Stop guessing. <span className="text-primary text-glow">Start knowing.</span></h2>
              <p className="mt-6 text-muted-foreground text-lg">Your competitors are publishing tonight. Be smarter about it.</p>
              <Button size="lg" asChild className="mt-10 rounded-full h-14 px-8 bg-primary text-primary-foreground hover:opacity-90 text-xs uppercase tracking-[0.25em] font-bold shadow-glow">
                <Link to="/onboarding">Start free trial <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-widest text-muted-foreground">
          <span>© 2026 FlyHigh — Prototype</span>
          <span>Apify · n8n · Claude</span>
        </div>
      </footer>
    </div>
  );
}

function NavPill({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition ${
        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      {label}
    </a>
  );
}

function OrbitCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative rounded-3xl p-8 overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-violet/10 shadow-pop hover:shadow-glow hover:border-primary/60 transition-all"
    >
      <div className="absolute -top-24 -right-24 size-56 rounded-full bg-primary/30 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -bottom-24 -left-24 size-48 rounded-full bg-violet/25 blur-3xl opacity-50 group-hover:opacity-90 transition-opacity" />
      <div className="relative">
        <div className="size-14 rounded-2xl grid place-items-center text-primary-foreground bg-primary mb-6 shadow-glow">
          {icon}
        </div>
        <h3 className="font-display text-2xl font-medium">{title}</h3>
        <p className="mt-3 text-foreground/80 text-sm leading-relaxed">{body}</p>
        <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-primary opacity-90 group-hover:opacity-100 transition">
          Learn more <ArrowRight className="size-3" />
        </div>
      </div>
    </motion.div>
  );
}

function Step({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="relative rounded-3xl p-8 border border-primary/25 bg-gradient-to-br from-card via-primary/5 to-violet/15 shadow-pop overflow-hidden">
      <div className="absolute -top-16 -right-16 size-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex items-center gap-4 mb-5">
        <span className="font-display text-5xl font-bold bg-gradient-to-br from-primary to-violet bg-clip-text text-transparent">{n}</span>
        <div className="size-10 rounded-2xl grid place-items-center text-primary-foreground bg-primary shadow-glow">{icon}</div>
      </div>
      <h3 className="relative font-display text-xl font-medium">{title}</h3>
      <p className="relative mt-2 text-foreground/75 text-sm">{body}</p>
    </div>
  );
}

function PriceCard({ tier, price, period, features, cta, highlighted }: { tier: string; price: string; period: string; features: string[]; cta: string; highlighted?: boolean }) {
  return (
    <div className={`relative rounded-3xl border ${highlighted ? "bg-gradient-to-br from-primary/25 via-primary/10 to-violet/20 border-primary/70 shadow-glow md:scale-[1.03]" : "bg-gradient-to-br from-card via-card to-primary/5 border-primary/25 shadow-pop"}`}>
      {highlighted && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 rounded-full bg-primary text-primary-foreground border-0 text-[10px] uppercase tracking-widest px-3 py-1 whitespace-nowrap">Most popular</Badge>}
      <div className="relative rounded-3xl p-8 overflow-hidden">
      {highlighted && <div className="absolute -top-20 -right-20 size-56 rounded-full bg-primary/40 blur-3xl pointer-events-none" />}
      <div className="relative text-[11px] tracking-[0.3em] uppercase text-primary/80">{tier}</div>
      <div className="relative mt-3 flex items-baseline gap-1.5">
        <span className={`font-display text-5xl font-bold tracking-tight ${highlighted ? "text-primary text-glow" : "text-foreground"}`}>{price}</span>
        <span className="text-muted-foreground text-sm">{period}</span>
      </div>
      <ul className="relative mt-8 space-y-3">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2 className="size-4 mt-0.5 text-primary shrink-0" />
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>
      <Button asChild className={`relative mt-8 w-full rounded-full h-12 text-xs uppercase tracking-widest font-bold ${highlighted ? "bg-primary text-primary-foreground hover:opacity-90 shadow-glow" : "bg-primary/15 border border-primary/40 hover:bg-primary/25 text-primary"}`}>
        <Link to="/onboarding">{cta}</Link>
      </Button>
      </div>
    </div>
  );
}
