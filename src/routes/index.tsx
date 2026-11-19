import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  Flame,
  Globe2,
  MessageSquare,
  Scale,
  ScrollText,
  Sparkles,
  Trophy,
  Users,
  Vote,
  ChevronRight,
  Play,
  Volume2,
  MapPin,
  Landmark,
  FileText,
  AlertCircle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import heroImg from "@/assets/hero-civic.jpg";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Jua Katiba AI — Know Your Constitution, Kenya" },
      {
        name: "description",
        content:
          "Jua Katiba AI makes the Constitution of Kenya accessible, interactive, and relevant to every citizen. Learn your rights, explore constitutional articles, and engage with Wakili AI.",
      },
    ],
  }),
  component: Home,
} as Parameters<typeof createFileRoute<"/">>[0]));

// ─── Animation presets ───────────────────────────────────────────────────────

function useFadeUp(delay = 0) {
  const reduced = useReducedMotion();
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

function useFadeIn(delay = 0) {
  const reduced = useReducedMotion();
  if (reduced) return {};
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

// ─── Homepage shell ───────────────────────────────────────────────────────────

function Home() {
  return (
    <SiteShell>
      <Hero />
      <IntroStats />
      <Purpose />
      <ConstitutionExplorer />
      <ParliamentWatch />
      <LearnInteract />
      <WakiliShowcase />
      <CivicParticipation />
      <WakiliHub />
      <ClosingCTA />
    </SiteShell>
  );
}

// ─── 1. Hero ──────────────────────────────────────────────────────────────────

function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-hero-radial"
      aria-labelledby="hero-heading"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 pattern-kente opacity-[0.04] pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[90vh] items-center gap-12 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-0">
          {/* Text column */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <motion.div
              {...(reduced ? {} : {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, ease: "easeOut" },
              })}
            >
              <span
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-flag-green animate-pulse" aria-hidden="true" />
                Kenya's civic education platform
              </span>
            </motion.div>

            {/* Main headline — editorial serif */}
            <motion.h1
              id="hero-heading"
              className="mt-7 font-display text-5xl font-bold leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]"
              {...(reduced ? {} : {
                initial: { opacity: 0, y: 24 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
              })}
            >
              Your Constitution.{" "}
              <span className="text-gradient italic">Your Rights.</span>
              <br />
              Your Power.
            </motion.h1>

            {/* Supporting copy */}
            <motion.p
              className="mt-6 max-w-lg text-[17px] leading-relaxed text-muted-foreground"
              {...(reduced ? {} : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.22, ease: "easeOut" },
              })}
            >
              Kenya's Constitution belongs to all of us. Discover what it means,
              understand your rights, and learn how to shape the future of your country.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              {...(reduced ? {} : {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, delay: 0.34 },
              })}
            >
              <Link to="/constitution">
                <Button
                  size="lg"
                  className="rounded-full px-7 text-[15px] font-medium font-ui shadow-sm"
                  style={{ backgroundColor: "var(--color-flag-green)", color: "white" }}
                >
                  Explore the Constitution
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-7 text-[15px] font-medium font-ui border-border/80 hover:bg-muted/60"
                >
                  Meet Wakili AI
                </Button>
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
              {...(reduced ? {} : {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.5, delay: 0.48 },
              })}
            >
              {[
                "Free forever",
                "Mobile-first",
                "Built in 🇰🇪",
              ].map((text) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  <span className="h-1 w-1 rounded-full bg-flag-green/60" aria-hidden="true" />
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Image column — editorial composition */}
          <motion.div
            className="relative"
            {...(reduced ? {} : {
              initial: { opacity: 0, scale: 0.97 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
            })}
          >
            {/* Decorative ruled lines behind the image */}
            <div
              className="absolute -inset-6 rounded-[2.5rem] opacity-50 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 23px, color-mix(in oklab, var(--color-flag-green) 8%, transparent) 23px, color-mix(in oklab, var(--color-flag-green) 8%, transparent) 24px)`,
              }}
              aria-hidden="true"
            />

            {/* Main image frame */}
            <div className="relative overflow-hidden rounded-2xl border border-border/70 shadow-[0_20px_60px_-15px_oklch(0_0_0/20%)]">
              <img
                src={heroImg}
                alt="Kenyan citizens participating in civic education — understanding their constitutional rights"
                width={960}
                height={640}
                className="h-auto w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />

              {/* Image overlay — article reference card */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-6">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, var(--color-flag-green), oklch(0.42 0.12 140))" }}
                    aria-hidden="true"
                  >
                    Art.
                  </div>
                  <div className="text-white">
                    <div className="text-sm font-semibold leading-tight">Article 1(1)</div>
                    <div className="mt-0.5 text-[12px] text-white/80 leading-relaxed max-w-[260px]">
                      "All sovereign power belongs to the people of Kenya."
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent — lesson progress (desktop only) */}
            <motion.div
              className="absolute -left-5 top-1/4 hidden lg:block"
              {...(reduced ? {} : {
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.5, delay: 0.6 },
              })}
              aria-hidden="true"
            >
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-flag-green/15 text-flag-green">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-foreground">Bill of Rights</div>
                  <div className="text-[11px] text-muted-foreground">Chapter 4 · 12 min</div>
                </div>
              </div>
            </motion.div>

            {/* Floating accent — streak (desktop only) */}
            <motion.div
              className="absolute -right-5 bottom-1/3 hidden lg:block"
              {...(reduced ? {} : {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.5, delay: 0.72 },
              })}
              aria-hidden="true"
            >
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/20">
                  <Trophy className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-foreground">12,400+ learners</div>
                  <div className="text-[11px] text-muted-foreground">active this week</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. Intro stats ───────────────────────────────────────────────────────────

function IntroStats() {
  const stats = [
    { value: "264", label: "Constitutional Articles" },
    { value: "18", label: "Chapters" },
    { value: "47", label: "County Governments" },
    { value: "12K+", label: "Active Learners" },
  ];

  return (
    <div className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-y divide-border/60 lg:grid-cols-4 lg:divide-y-0">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...useFadeUp(i * 0.06)}
              className="py-10 px-8 text-center"
            >
              <div className="font-display text-4xl font-bold text-gradient lg:text-5xl">{s.value}</div>
              <div
                className="mt-1.5 text-[13px] text-muted-foreground"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 3. Purpose ───────────────────────────────────────────────────────────────

function Purpose() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="purpose-heading"
    >
      <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {/* Text side */}
        <div>
          <motion.p
            {...useFadeUp(0)}
            className="eyebrow"
          >
            Why Jua Katiba AI
          </motion.p>
          <motion.h2
            id="purpose-heading"
            {...useFadeUp(0.08)}
            className="mt-4 font-display text-4xl font-bold leading-tight text-balance sm:text-5xl"
          >
            The Constitution protects you.
            <br />
            <span className="text-gradient italic">Do you know how?</span>
          </motion.h2>
          <motion.p
            {...useFadeUp(0.16)}
            className="mt-6 text-[16px] leading-relaxed text-muted-foreground max-w-lg text-pretty"
          >
            Kenya's Constitution is one of the most progressive in Africa — 
            yet legal language keeps its protections out of reach for most citizens.
            Jua Katiba AI is the accessible bridge between constitutional knowledge 
            and everyday life.
          </motion.p>
          <motion.p
            {...useFadeUp(0.22)}
            className="mt-4 text-[16px] leading-relaxed text-muted-foreground max-w-lg text-pretty"
          >
            Whether you're a student in Kisumu, a boda rider in Nairobi, 
            or a community leader in Turkana — the Constitution was written for you.
          </motion.p>
          <motion.div {...useFadeUp(0.3)} className="mt-8">
            <Link to="/about">
              <Button
                variant="outline"
                className="rounded-full px-6 font-medium font-ui border-border/80 hover:bg-muted/60"
              >
                Our mission <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Values grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: BookOpen,
              title: "Plain language",
              text: "Every constitutional article translated into clear, everyday English — and Sheng.",
              color: "bg-flag-green/10 text-flag-green",
            },
            {
              icon: Sparkles,
              title: "Interactive learning",
              text: "Lessons, quizzes, and civic scenarios that make learning feel like play.",
              color: "bg-gold/20 text-[oklch(0.6_0.12_65)]",
            },
            {
              icon: Brain,
              title: "AI-powered guidance",
              text: "Wakili AI answers your civic and constitutional questions in real time.",
              color: "bg-blue-100/60 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            },
            {
              icon: Users,
              title: "Built for Kenya",
              text: "Real Kenyan contexts, 47-county coverage, and local legal advocates.",
              color: "bg-flag-red/10 text-flag-red",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              {...useFadeUp(0.08 + i * 0.08)}
              className="group rounded-2xl border border-border/70 bg-card p-6 card-elevated hover:border-border transition-all"
            >
              <div className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", item.color)}>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-[17px] font-semibold">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Constitution Explorer ─────────────────────────────────────────────────

const constitutionArticles = [
  {
    num: "Art. 1",
    chapter: "Chapter 1",
    title: "Sovereignty of the People",
    text: "All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution.",
    tag: "Foundation",
    tagColor: "bg-flag-green/10 text-flag-green",
  },
  {
    num: "Art. 27",
    chapter: "Chapter 4 · Bill of Rights",
    title: "Equality & Non-Discrimination",
    text: "Every person is equal before the law and has the right to equal protection and equal benefit of the law.",
    tag: "Rights",
    tagColor: "bg-blue-100/60 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    num: "Art. 43",
    chapter: "Chapter 4 · Bill of Rights",
    title: "Economic & Social Rights",
    text: "Every person has the right to the highest attainable standard of health, housing, food, water, social security, and education.",
    tag: "Social Rights",
    tagColor: "bg-gold/20 text-[oklch(0.5_0.12_65)]",
  },
  {
    num: "Art. 174",
    chapter: "Chapter 11 · Devolution",
    title: "Objects of Devolution",
    text: "To give powers of self-governance to the people and enhance the participation of the people in the exercise of the powers of the State.",
    tag: "Governance",
    tagColor: "bg-flag-red/10 text-flag-red",
  },
];

function ConstitutionExplorer() {
  const [active, setActive] = useState(0);
  const article = constitutionArticles[active];

  return (
    <section
      className="bg-muted/20 border-y border-border/50"
      aria-labelledby="explorer-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.p {...useFadeUp()} className="eyebrow">Constitution Explorer</motion.p>
            <motion.h2
              id="explorer-heading"
              {...useFadeUp(0.08)}
              className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl"
            >
              Articles every Kenyan
              <br />
              should know.
            </motion.h2>
            <motion.p
              {...useFadeUp(0.16)}
              className="mt-4 max-w-lg text-[16px] text-muted-foreground leading-relaxed"
            >
              The Constitution contains rights and protections for every citizen. 
              Start here — these are the most important.
            </motion.p>
          </div>
          <motion.div {...useFadeUp(0.12)}>
            <Link to="/constitution">
              <Button
                variant="outline"
                className="rounded-full font-medium font-ui border-border/80 hover:bg-background"
              >
                All 264 Articles <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Article cards + detail */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          {/* Article list */}
          <div className="flex flex-col gap-3" role="tablist" aria-label="Constitution articles">
            {constitutionArticles.map((a, i) => (
              <motion.button
                key={a.num}
                {...useFadeUp(0.06 + i * 0.07)}
                role="tab"
                aria-selected={active === i}
                aria-controls={`article-panel-${i}`}
                onClick={() => setActive(i)}
                className={cn(
                  "group w-full text-left rounded-2xl border p-5 transition-all duration-200 focus-ring",
                  active === i
                    ? "border-flag-green/60 bg-background shadow-[0_2px_12px_-2px_color-mix(in_oklab,var(--color-flag-green)_15%,transparent)]"
                    : "border-border bg-card hover:border-border/80 hover:bg-background",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "shrink-0 rounded-lg px-2.5 py-1.5 font-ui text-[11px] font-bold uppercase tracking-wider transition-colors",
                        active === i
                          ? "bg-flag-green text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-flag-green/10 group-hover:text-flag-green",
                      )}
                    >
                      {a.num}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">{a.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{a.chapter}</div>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground/50 transition-all",
                      active === i && "text-flag-green translate-x-0.5",
                    )}
                    aria-hidden="true"
                  />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Article detail panel */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            id={`article-panel-${active}`}
            role="tabpanel"
            className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] lg:sticky lg:top-24"
          >
            {/* Document-style header */}
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-lg bg-flag-green text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider font-ui">
                    {article.num}
                  </span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-ui", article.tagColor)}>
                    {article.tag}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold">{article.title}</h3>
                <p className="mt-1 text-[12px] text-muted-foreground font-ui">{article.chapter}</p>
              </div>
            </div>

            {/* Article text — styled like a legal document excerpt */}
            <div className="mt-5">
              <div className="rounded-xl border border-border/50 bg-muted/30 p-5 pattern-ruled">
                <p className="text-[15px] leading-relaxed text-foreground italic font-display">
                  "{article.text}"
                </p>
              </div>
            </div>

            {/* Plain language callout */}
            <div className="mt-4 rounded-xl border border-flag-green/20 bg-flag-green/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-flag-green font-ui">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Plain language
              </div>
              <p className="text-[14px] leading-relaxed text-foreground/80">
                {active === 0 && "The government gets its power from the people — not the other way around. Citizens are the ultimate authority in Kenya."}
                {active === 1 && "No one can be treated differently because of their gender, ethnicity, age, disability, religion, or any other reason. The law treats everyone equally."}
                {active === 2 && "The government must work to ensure every Kenyan can access healthcare, clean water, housing, food, and education — not as charity, but as constitutional rights."}
                {active === 3 && "County governments exist to bring power closer to the people. Devolution means your ward, town, and county have real authority over local decisions."}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Link to="/constitution" className="flex-1">
                <Button
                  className="w-full rounded-full font-medium font-ui text-sm"
                  style={{ backgroundColor: "var(--color-flag-green)", color: "white" }}
                >
                  Explore Constitution <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/learn" search={{ lesson: "bor-1" }}>
                <Button
                  variant="outline"
                  className="rounded-full font-medium font-ui text-sm border-border/80"
                >
                  <Play className="h-3.5 w-3.5 fill-current mr-1.5" aria-hidden="true" />
                  Learn
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 4b. Current Issues & Legislative Watch ──────────────────────────────────

type HouseType = "all" | "assembly" | "senate" | "participation";

const legislativeItems = [
  {
    id: "pub-part-bill",
    house: "National Assembly",
    houseType: "assembly" as const,
    billNumber: "Bill No. 42 of 2024",
    title: "Public Participation Bill",
    status: "Public Submissions Open",
    statusType: "urgent", // green / gold highlight
    deadline: "Memoranda open until March 15",
    articleRef: "Article 118(1)(b) & Article 10",
    articleNum: "Art. 118",
    articleLink: "/constitution",
    issueLink: "/issues",
    mwananchiImpact: "Will make it legally mandatory for Parliament and County Assemblies to meaningfully incorporate citizen feedback before passing budgets or new taxes, nullifying bills passed in secrecy.",
    keyQuote: "“Parliament shall facilitate public participation and involvement in the legislative and other business of Parliament.”",
  },
  {
    id: "cara-2025",
    house: "The Senate",
    houseType: "senate" as const,
    billNumber: "Senate Bill No. 12 of 2025",
    title: "County Allocation of Revenue Bill (CARA)",
    status: "Mediation Committee",
    statusType: "active",
    deadline: "Budget Cycle 2025/2026",
    articleRef: "Article 217 & 218",
    articleNum: "Art. 217",
    articleLink: "/constitution",
    issueLink: "/issues",
    mwananchiImpact: "Determines the exact billions dispatched to your county for Level 4/5 hospitals, medicine supply, ECD teachers, agricultural extension, and county roads.",
    keyQuote: "“The Senate shall determine the basis for allocating among the counties the share of national revenue.”",
  },
  {
    id: "iebc-motion",
    house: "Joint Parliamentary Committee",
    houseType: "assembly" as const,
    billNumber: "Statutory Instrument & Motion",
    title: "IEBC Selection Panel & Reconstitution",
    status: "Floor Debate",
    statusType: "active",
    deadline: "Delimitation Clock Running",
    articleRef: "Article 88 & 89",
    articleNum: "Art. 88",
    articleLink: "/constitution",
    issueLink: "/issues",
    mwananchiImpact: "Essential for filling vacant MP/MCA seats via by-elections, reviewing constituency boundaries, and auditing voter rolls ahead of national democratic exercises.",
    keyQuote: "“The Commission is responsible for conducting or supervising referenda and elections to any elective body established by the Constitution.”",
  },
  {
    id: "privacy-surveillance",
    house: "Senate ICT & High Court",
    houseType: "participation" as const,
    billNumber: "Civic Rights Petition & Review",
    title: "Digital Privacy & Device Search Review",
    status: "High Court Benchmark",
    statusType: "urgent",
    deadline: "Judicial Precedent Set",
    articleRef: "Article 31 & 35",
    articleNum: "Art. 31",
    articleLink: "/constitution",
    issueLink: "/issues",
    mwananchiImpact: "Clarifies that police officers at road checks or public barazas cannot demand smartphone passwords or inspect M-Pesa balances without a signed judicial warrant.",
    keyQuote: "“Every person has the right to privacy, which includes the right not to have the privacy of their communications infringed.”",
  },
];

function ParliamentWatch() {
  const [filter, setFilter] = useState<HouseType>("all");

  const filteredItems = legislativeItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "assembly") return item.houseType === "assembly";
    if (filter === "senate") return item.houseType === "senate";
    if (filter === "participation") return item.statusType === "urgent";
    return true;
  });

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-border/50"
      aria-labelledby="parliament-watch-heading"
    >
      {/* Section Header */}
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow flex items-center gap-1.5">
              <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
              Parliament & Senate Watch
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-flag-red/10 px-2 py-0.5 text-[10px] font-bold text-flag-red">
              <span className="h-1.5 w-1.5 rounded-full bg-flag-red animate-ping" />
              Live Civic Tracker
            </span>
          </div>
          <h2
            id="parliament-watch-heading"
            className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl text-balance"
          >
            Current Bills & Motions
            <br />
            <span className="text-gradient italic">Shaping Kenya Right Now.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] text-muted-foreground leading-relaxed">
            Laws should never pass in the dark. Follow active parliamentary motions, Senate revenue debates,
            and citizen memorandum windows before they become the law of the land.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border/80 bg-muted/40 p-1.5 font-ui text-xs">
          {[
            { id: "all" as const, label: "All Trackers" },
            { id: "assembly" as const, label: "National Assembly" },
            { id: "senate" as const, label: "The Senate" },
            { id: "participation" as const, label: "Public Memoranda Open" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-xl px-3.5 py-2 font-medium transition-all focus-ring",
                filter === tab.id
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {filteredItems.map((item, i) => (
          <motion.div
            key={item.id}
            {...useFadeUp(i * 0.07)}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-7 card-elevated hover:border-flag-green/50 transition-all relative overflow-hidden"
          >
            {/* Top metadata strip */}
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-muted px-2.5 py-1 text-[11px] font-bold font-ui text-foreground">
                    {item.house}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-ui">
                    {item.billNumber}
                  </span>
                </div>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold font-ui",
                    item.statusType === "urgent"
                      ? "bg-flag-green/15 text-flag-green"
                      : "bg-gold/20 text-[oklch(0.55_0.12_65)]",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      item.statusType === "urgent" ? "bg-flag-green animate-pulse" : "bg-gold",
                    )}
                  />
                  {item.status}
                </span>
              </div>

              {/* Title & Constitutional Link */}
              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl font-bold group-hover:text-flag-green transition-colors">
                    {item.title}
                  </h3>
                  <Link
                    to={item.articleLink}
                    className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold font-ui text-flag-green hover:underline"
                    title={`Read ${item.articleRef} in Constitution`}
                  >
                    <BookOpen className="h-3 w-3" />
                    {item.articleNum}
                  </Link>
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {item.deadline}
                </div>
              </div>

              {/* Legal quote */}
              <div className="mt-4 rounded-xl border border-border/50 bg-muted/30 p-3.5 pattern-ruled">
                <p className="text-[13px] italic font-display text-foreground/90">
                  {item.keyQuote}
                </p>
                <div className="mt-1 text-[11px] text-muted-foreground font-ui">
                  Constitutional anchor: {item.articleRef}
                </div>
              </div>

              {/* Mwananchi Impact */}
              <div className="mt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-flag-green font-ui flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  What this means for your daily life:
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {item.mwananchiImpact}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between gap-3">
              <Link to={item.issueLink} className="w-full sm:w-auto">
                <Button
                  size="sm"
                  className="w-full sm:w-auto rounded-full font-medium font-ui text-xs px-4 bg-foreground text-background hover:bg-foreground/90"
                >
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  Read Full Issue Explainer
                </Button>
              </Link>
              <Link
                to="/issues"
                className="hidden sm:inline-flex items-center text-xs font-semibold text-flag-green hover:underline font-ui"
              >
                Public Memo Guide <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Participation Callout Banner */}
      <motion.div
        {...useFadeUp(0.2)}
        className="mt-10 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-flag-green/10 text-flag-green">
            <Vote className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-display text-lg font-bold">Have a say on these bills before the deadline</h4>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              Article 118 gives every citizen the right to submit written memoranda to the Clerk of the Senate and National Assembly.
              Use our plain-English templates to draft and send your feedback directly.
            </p>
          </div>
        </div>

        <Link to="/issues" className="shrink-0">
          <Button
            size="lg"
            className="rounded-full px-6 font-medium font-ui text-sm bg-flag-green hover:bg-flag-green/90 text-white shadow-sm"
          >
            Explore All Current Issues <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}

// ─── 5. Learn through interaction ────────────────────────────────────────────

const features = [
  {
    id: "wewe-ni-jaji",
    icon: Scale,
    eyebrow: "Wewe Ni Jaji",
    headline: "Learn through real Kenyan scenarios",
    description:
      "Face real civic dilemmas — police roadblocks, chief barazas, county tender disputes. Choose your response, see the constitutional consequence, and earn XP as you go.",
    preview: {
      situation: "An officer stops you at 9 PM and demands your phone password.",
      action: "Under Article 31 (Right to Privacy), you politely decline without a court warrant.",
      outcome: "Rights protected · +25 XP",
    },
    link: "/learn",
    linkLabel: "Try a Scenario",
    accent: "border-l-flag-green/40",
    iconBg: "bg-flag-green/10 text-flag-green",
  },
  {
    id: "daily-challenge",
    icon: Flame,
    eyebrow: "30-Day Civic Challenge",
    headline: "A month of Katiba, one day at a time",
    description:
      "30 themed days. 150 questions. Sovereignty, devolution, the Bill of Rights, public finance, and civic participation — all covered. Earn up to 3,000 XP.",
    preview: {
      situation: "Day 7: Under which article does the right to education appear?",
      action: "Article 43(1)(f) — the right to education, guaranteed for every Kenyan.",
      outcome: "Streak maintained · Day 8 unlocked",
    },
    link: "/quizzes/day/$day",
    linkLabel: "Start Day 1",
    accent: "border-l-gold/40",
    iconBg: "bg-gold/15 text-[oklch(0.55_0.12_65)]",
  },
  {
    id: "katiba-mtaani",
    icon: MessageSquare,
    eyebrow: "Katiba Mtaani",
    headline: "Legal text in the language you speak",
    description:
      "Every article includes a toggle between Official Legal Text, Plain Everyday English, and Kenyan Sheng — so anyone from high schoolers to mama mbogas can understand.",
    preview: {
      situation: "Official: 'All sovereign power belongs to the people of Kenya.'",
      action: "Sheng: 'Power yote kwa hii nchi ni ya raia! Wakiharibu, raia wana mamlaka ya kuwawajibisha!'",
      outcome: "100% comprehensible for every Kenyan",
    },
    link: "/learn",
    linkLabel: "Explore Lessons",
    accent: "border-l-blue-400/40",
    iconBg: "bg-blue-100/60 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "sikiza-katiba",
    icon: Volume2,
    eyebrow: "Sikiza Katiba",
    headline: "Listen on your commute",
    description:
      "Every lesson features native voice narration. Tap 'Sikiza Katiba' and have the Constitution read aloud to you on the matatu, in the shamba, or during your morning run.",
    preview: {
      situation: "Commuting on Thika Road or Mombasa Highway?",
      action: "Stream audio summaries of the Bill of Rights and Devolution directly into your earphones.",
      outcome: "Accessible to auditory learners everywhere",
    },
    link: "/learn",
    linkLabel: "Start Listening",
    accent: "border-l-flag-red/40",
    iconBg: "bg-flag-red/10 text-flag-red",
  },
];

function LearnInteract() {
  const [active, setActive] = useState(0);
  const feature = features[active];

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="learn-heading"
    >
      {/* Header */}
      <div className="max-w-2xl">
        <motion.p {...useFadeUp()} className="eyebrow">Learn through interaction</motion.p>
        <motion.h2
          id="learn-heading"
          {...useFadeUp(0.08)}
          className="mt-4 font-display text-4xl font-bold sm:text-5xl text-balance"
        >
          More than reading.
          <br />
          <span className="text-gradient italic">An experience.</span>
        </motion.h2>
        <motion.p
          {...useFadeUp(0.16)}
          className="mt-4 text-[16px] text-muted-foreground leading-relaxed max-w-lg"
        >
          Four ways to engage with Kenya's Constitution — each designed to meet
          you where you are and how you learn best.
        </motion.p>
      </div>

      {/* Feature selector */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        {/* Feature list */}
        <div className="flex flex-col gap-3" role="tablist" aria-label="Learning features">
          {features.map((f, i) => (
            <motion.button
              key={f.id}
              {...useFadeUp(0.06 + i * 0.06)}
              role="tab"
              aria-selected={active === i}
              aria-controls={`feature-panel-${i}`}
              onClick={() => setActive(i)}
              className={cn(
                "group w-full text-left rounded-2xl border p-5 transition-all duration-200 focus-ring",
                active === i
                  ? "border-flag-green/50 bg-background shadow-[0_2px_12px_-2px_color-mix(in_oklab,var(--color-flag-green)_15%,transparent)]"
                  : "border-border bg-card hover:border-border/80 hover:bg-background",
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform", f.iconBg, active === i && "scale-105")}>
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[13px] font-bold text-foreground"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {f.eyebrow}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted-foreground line-clamp-1">{f.headline}</p>
                </div>
                <ChevronRight
                  className={cn(
                    "ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-all",
                    active === i && "text-flag-green translate-x-0.5",
                  )}
                  aria-hidden="true"
                />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Feature detail */}
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          id={`feature-panel-${active}`}
          role="tabpanel"
          className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] lg:sticky lg:top-24"
        >
          {/* Feature header */}
          <div className="flex items-center gap-3 border-b border-border/60 pb-5">
            <div className={cn("grid h-11 w-11 place-items-center rounded-xl", feature.iconBg)}>
              <feature.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-flag-green font-ui">{feature.eyebrow}</div>
              <h3 className="font-display text-[18px] font-bold">{feature.headline}</h3>
            </div>
          </div>

          <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
            {feature.description}
          </p>

          {/* Live scenario preview */}
          <div className={cn("mt-5 rounded-xl border-l-4 border border-border bg-muted/30 p-4 space-y-3", feature.accent)}>
            <div className="text-[11px] font-bold uppercase tracking-wider text-flag-green font-ui">Live preview</div>
            <p className="text-[13px] font-medium text-foreground">{feature.preview.situation}</p>
            <div className="rounded-lg border border-border/50 bg-background p-3 text-[13px] text-muted-foreground">
              {feature.preview.action}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-flag-green font-ui">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {feature.preview.outcome}
            </div>
          </div>

          <div className="mt-5">
            <Link
              to={feature.id === "daily-challenge" ? "/quizzes/day/$day" : feature.link}
              params={feature.id === "daily-challenge" ? { day: "1" } : undefined}
            >
              <Button
                className="rounded-full px-6 font-medium font-ui text-sm"
                style={{ backgroundColor: "var(--color-flag-green)", color: "white" }}
              >
                {feature.linkLabel} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 6. Wakili AI showcase ────────────────────────────────────────────────────

const wakiliConversation = [
  {
    role: "citizen" as const,
    message: "What happens if my landlord cuts off my water because I disputed a utility bill?",
  },
  {
    role: "wakili" as const,
    message:
      "Under Article 43(1)(d) of the Constitution, clean and safe water is a fundamental social right. Arbitrary disconnection without due process likely violates Article 47 — the right to fair administrative action. You can formally demand reconnection in writing, citing these articles. If unresolved, the matter can be escalated to the Landlord and Tenant Tribunal.",
  },
  {
    role: "citizen" as const,
    message: "Can I be arrested without being told why?",
  },
  {
    role: "wakili" as const,
    message:
      "No. Article 49(1)(a) guarantees that any person arrested must be informed of the reason for arrest, in a language they understand. If this right is violated, any evidence obtained may be inadmissible. You should request to know the specific charge or offence immediately upon arrest.",
  },
];

function WakiliShowcase() {
  const [visibleCount, setVisibleCount] = useState(1);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount < wakiliConversation.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  return (
    <section
      className="bg-muted/20 border-y border-border/50"
      aria-labelledby="wakili-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Chat preview */}
          <motion.div {...useFadeUp()} className="order-2 lg:order-1">
            {/* Browser chrome */}
            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card-hover)] overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <div className="h-3 w-3 rounded-full bg-flag-red/60" />
                  <div className="h-3 w-3 rounded-full bg-gold/60" />
                  <div className="h-3 w-3 rounded-full bg-flag-green/60" />
                </div>
                <div className="mx-auto flex items-center gap-2">
                  <Brain className="h-3.5 w-3.5 text-flag-green" aria-hidden="true" />
                  <span className="text-[12px] font-semibold font-ui text-muted-foreground">Wakili AI — Constitutional Assistant</span>
                </div>
              </div>

              {/* Chat messages */}
              <div
                ref={chatRef}
                className="space-y-4 p-5 min-h-[320px]"
                aria-label="Wakili AI conversation preview"
                aria-live="polite"
              >
                {wakiliConversation.slice(0, visibleCount).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("flex gap-3", msg.role === "citizen" ? "justify-end" : "justify-start")}
                  >
                    {msg.role === "wakili" && (
                      <div
                        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, var(--color-flag-green), oklch(0.42 0.12 140))" }}
                        aria-label="Wakili AI"
                      >
                        W
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
                        msg.role === "citizen"
                          ? "bg-flag-green/10 text-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm border border-border/50",
                      )}
                    >
                      {msg.message}
                    </div>
                    {msg.role === "citizen" && (
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted border border-border text-xs font-semibold text-muted-foreground" aria-label="You">
                        You
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {visibleCount < wakiliConversation.length && visibleCount % 2 === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 pl-10"
                  >
                    <div className="flex gap-1" aria-label="Wakili AI is typing">
                      {[0, 0.2, 0.4].map((d, i) => (
                        <motion.div
                          key={i}
                          className="h-2 w-2 rounded-full bg-flag-green/60"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, delay: d, repeat: Infinity }}
                        />
                      ))}
                    </div>
                    <span className="sr-only">Wakili AI is typing</span>
                  </motion.div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="border-t border-border/50 bg-muted/30 px-5 py-3">
                <p className="text-[11px] text-muted-foreground leading-relaxed font-ui">
                  <strong>Educational use only.</strong> Wakili AI provides constitutional and civic information, not legal advice. For matters requiring representation, consult a qualified advocate.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <motion.p {...useFadeUp()} className="eyebrow">Wakili AI</motion.p>
            <motion.h2
              id="wakili-heading"
              {...useFadeUp(0.08)}
              className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl text-balance"
            >
              Your constitutional
              <br />
              <span className="text-gradient italic">companion.</span>
            </motion.h2>
            <motion.p
              {...useFadeUp(0.16)}
              className="mt-6 text-[16px] leading-relaxed text-muted-foreground max-w-lg"
            >
              Ask anything about the Constitution in plain language. 
              Wakili AI draws on the Constitution of Kenya 2010 to give 
              clear, grounded answers — available any time, on any device.
            </motion.p>

            <motion.div {...useFadeUp(0.22)} className="mt-7 space-y-3">
              {[
                "Answers grounded in the Constitution of Kenya 2010",
                "Covers rights, governance, devolution, and more",
                "Available in English and Swahili",
                "Integrated across every lesson",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 text-[14px] text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-flag-green" aria-hidden="true" />
                  {point}
                </div>
              ))}
            </motion.div>

            <motion.div {...useFadeUp(0.3)} className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="rounded-full px-7 font-medium font-ui"
                  style={{ backgroundColor: "var(--color-flag-green)", color: "white" }}
                >
                  Ask Wakili AI <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. Civic participation ───────────────────────────────────────────────────

function CivicParticipation() {
  const pillars = [
    {
      icon: Vote,
      title: "Public Participation",
      text: "The Constitution guarantees every Kenyan the right to participate in governance. County budget hearings, public bills, and policy decisions all require citizen input.",
      link: "/issues",
      linkLabel: "Current Issues",
    },
    {
      icon: Building2,
      title: "County Government",
      text: "Devolution brought government closer to the people. All 47 county governments are accountable to residents — learn who represents you and how to hold them accountable.",
      link: "/counties",
      linkLabel: "Explore Counties",
    },
    {
      icon: Globe2,
      title: "Active Citizenship",
      text: "An informed citizen is a powerful one. Track legislation, understand your ward representative's responsibilities, and know how to petition for change.",
      link: "/learn",
      linkLabel: "Learn More",
    },
  ];

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="civic-heading"
    >
      {/* Header */}
      <div className="max-w-2xl">
        <motion.p {...useFadeUp()} className="eyebrow">Civic Participation</motion.p>
        <motion.h2
          id="civic-heading"
          {...useFadeUp(0.08)}
          className="mt-4 font-display text-4xl font-bold sm:text-5xl text-balance"
        >
          Knowledge is the beginning.
          <br />
          <span className="text-gradient italic">Participation is the point.</span>
        </motion.h2>
        <motion.p
          {...useFadeUp(0.16)}
          className="mt-4 text-[16px] text-muted-foreground leading-relaxed"
        >
          Constitutional knowledge should lead to informed civic action. 
          Jua Katiba connects learning to real opportunities for participation.
        </motion.p>
      </div>

      {/* Pillars */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            {...useFadeUp(0.08 + i * 0.1)}
            className="group flex flex-col rounded-2xl border border-border bg-card p-7 card-elevated hover:border-flag-green/40 transition-all"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-flag-green/10 text-flag-green">
              <p.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground flex-1">{p.text}</p>
            <Link
              to={p.link}
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-flag-green hover:underline focus-ring rounded font-ui"
            >
              {p.linkLabel} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Constitutional quote bar */}
      <motion.div
        {...useFadeUp(0.2)}
        className="mt-12 relative overflow-hidden rounded-2xl border border-flag-green/20 bg-flag-green/5 p-8 sm:p-10"
      >
        <div className="absolute inset-0 pattern-kente opacity-[0.03]" aria-hidden="true" />
        <div className="relative grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
          <div
            className="hidden lg:grid h-16 w-16 place-items-center rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg, var(--color-flag-green), oklch(0.42 0.12 140))" }}
            aria-hidden="true"
          >
            <ScrollText className="h-8 w-8" />
          </div>
          <div>
            <p className="font-display text-xl font-bold italic text-foreground sm:text-2xl">
              "Every person has the right to petition public authorities on any matter."
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground font-ui">— Article 37, Constitution of Kenya 2010</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── 8. Wakili Hub ────────────────────────────────────────────────────────────

function WakiliHub() {
  const features = [
    { label: "LSK Verified", desc: "Advocates of the High Court of Kenya", icon: "⚖️" },
    { label: "47 Counties", desc: "From Nairobi to Marsabit to Turkana", icon: "🗺️" },
    { label: "Pro-Bono & Paid", desc: "Connecting public interest matters with lawyers", icon: "🤝" },
    { label: "Direct Access", desc: "Contact via phone, WhatsApp, or email", icon: "📞" },
  ];

  return (
    <section
      className="bg-muted/20 border-t border-border/50"
      aria-labelledby="hub-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          {/* Text */}
          <div>
            <motion.p {...useFadeUp()} className="eyebrow">Wakili Hub</motion.p>
            <motion.h2
              id="hub-heading"
              {...useFadeUp(0.08)}
              className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl text-balance"
            >
              Where citizens meet
              <br />
              <span className="text-gradient italic">verified advocates.</span>
            </motion.h2>
            <motion.p
              {...useFadeUp(0.16)}
              className="mt-6 text-[16px] leading-relaxed text-muted-foreground max-w-lg"
            >
              Constitutional knowledge is the first step. When you need professional 
              legal support — a rights violation, a land dispute, a police matter — 
              Wakili Hub connects you with verified Kenyan advocates.
            </motion.p>
            <motion.div {...useFadeUp(0.22)} className="mt-8 flex flex-wrap gap-3">
              <Link to="/lawyers">
                <Button
                  size="lg"
                  className="rounded-full px-7 font-medium font-ui"
                  style={{ backgroundColor: "var(--color-flag-green)", color: "white" }}
                >
                  Find an Advocate <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/lawyers">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-7 font-medium font-ui border-border/80 hover:bg-background"
                >
                  List Your Practice
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Feature grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                {...useFadeUp(0.08 + i * 0.08)}
                className="rounded-2xl border border-border bg-card p-5 card-elevated"
              >
                <div className="text-2xl mb-3" aria-hidden="true">{f.icon}</div>
                <div className="font-display text-lg font-bold">{f.label}</div>
                <div className="mt-1 text-[13px] text-muted-foreground">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* County highlight */}
        <motion.div
          {...useFadeUp(0.12)}
          className="mt-10 flex items-center gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-flag-green/10 text-flag-green">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="font-display font-bold">Advocates across all 47 counties</div>
            <div className="text-[13px] text-muted-foreground">Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Turkana and beyond</div>
          </div>
          <Link to="/lawyers" className="ml-auto shrink-0">
            <Button variant="ghost" size="sm" className="rounded-full font-ui text-sm text-flag-green hover:bg-flag-green/10">
              Search <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 9. Closing CTA ───────────────────────────────────────────────────────────

function ClosingCTA() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="cta-heading"
    >
      <motion.div
        {...useFadeUp()}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, var(--color-flag-green) 0%, oklch(0.35 0.12 148) 55%, oklch(0.28 0.08 155) 100%)",
        }}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-kente opacity-[0.08]" aria-hidden="true" />

        <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
          <motion.p
            {...useFadeUp(0.08)}
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60 font-ui"
          >
            Jua Katiba AI
          </motion.p>
          <motion.h2
            id="cta-heading"
            {...useFadeUp(0.14)}
            className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl text-balance"
          >
            An informed citizen is
            <br />
            <em>a powerful citizen.</em>
          </motion.h2>
          <motion.p
            {...useFadeUp(0.2)}
            className="mx-auto mt-6 max-w-xl text-[17px] text-white/80 leading-relaxed"
          >
            Start understanding the Constitution that protects your rights
            and shapes your future.
          </motion.p>
          <motion.div
            {...useFadeUp(0.26)}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link to="/learn">
              <Button
                size="lg"
                className="rounded-full px-8 text-[15px] font-medium font-ui bg-white text-flag-green hover:bg-white/95 shadow-lg"
              >
                Begin Your Journey <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/constitution">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-[15px] font-medium font-ui border-white/40 text-white hover:bg-white/10 hover:border-white/60"
              >
                Read the Constitution
              </Button>
            </Link>
          </motion.div>

          {/* Supporting features */}
          <motion.div
            {...useFadeUp(0.32)}
            className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3"
          >
            {[
              { icon: BookOpen, label: "100+ Lessons" },
              { icon: Brain, label: "Wakili AI" },
              { icon: Globe2, label: "All 47 Counties" },
              { icon: Trophy, label: "Civic Challenges" },
            ].map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-2 text-[13px] text-white/70 font-ui"
              >
                <f.icon className="h-4 w-4 text-white/50" aria-hidden="true" />
                {f.label}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
