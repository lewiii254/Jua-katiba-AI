import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  TrendingUp,
  Landmark,
  FileText,
  BookOpen,
  Vote,
  Sparkles,
  ArrowRight,
  Send,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/issues")({
  head: () => ({
    meta: [
      { title: "Current Issues, Parliamentary Bills & Motions — Jua Katiba" },
      {
        name: "description",
        content:
          "Track active bills in the National Assembly and Senate, parliamentary motions, and citizen public participation deadlines grounded in the Constitution of Kenya 2010.",
      },
    ],
  }),
  component: IssuesPage,
});

type CategoryTab = "all" | "bills" | "motions" | "memoranda";

const activeBillsAndMotions = [
  {
    type: "bill" as const,
    house: "National Assembly",
    billNum: "Bill No. 42 of 2024",
    title: "Public Participation Bill, 2024/2025",
    stage: "2nd Reading / Public Memoranda Open",
    statusBadge: "Public Input Active",
    statusTone: "urgent",
    articleRef: "Article 118(1)(b) & Article 10",
    articleNum: "Art. 118",
    deadline: "Submissions open until March 15",
    desc: "A framework statute to enforce authentic, non-cosmetic public engagement in legislative formulation across national government and all 47 counties.",
    mwananchiImpact: "Prevents government agencies from declaring bills passed without conducting advertised town halls with published summaries in plain language.",
    howToEngage: "Submit written memoranda directly to the Clerk of the National Assembly, P.O. Box 41842-00100 Nairobi or clerk@parliament.go.ke.",
  },
  {
    type: "bill" as const,
    house: "The Senate",
    billNum: "Senate Bill No. 12 of 2025",
    title: "County Allocation of Revenue Bill (CARA 2025/2026)",
    stage: "Mediation Committee",
    statusBadge: "Bicameral Threshold",
    statusTone: "active",
    articleRef: "Article 217 & 218",
    articleNum: "Art. 217",
    deadline: "2025/2026 Budget Calendar",
    desc: "Governs the equitable sharing of national revenue among Kenya's 47 counties, determining the survival budget for devolved healthcare, roads, and water.",
    mwananchiImpact: "Directly determines whether dispensaries in your ward have medicine, whether doctors are paid on time, and whether county bursaries are disbursed.",
    howToEngage: "Engage your county Senator and review your County Assembly's Annual Development Plan (ADP).",
  },
  {
    type: "motion" as const,
    house: "National Assembly & Senate",
    billNum: "House Motion No. 08",
    title: "Implementation of the IEBC Reconstitution Selection Panel",
    stage: "Committee Review & Floor Debate",
    statusBadge: "Floor Debate",
    statusTone: "active",
    articleRef: "Article 88 & 89",
    articleNum: "Art. 88",
    deadline: "Statutory Deadline Pending",
    desc: "Debate on the constitution and swearing-in of the selection panel to vet candidates for IEBC Chairperson and commissioners.",
    mwananchiImpact: "Unlocks stalled by-elections for vacant parliamentary and ward seats, voter registration drives, and the constitutionally mandated boundaries review.",
    howToEngage: "Monitor parliamentary broadcasts on KBC/Parliament TV and petition your area MP.",
  },
  {
    type: "motion" as const,
    house: "The Senate",
    billNum: "Senate Motion No. 19",
    title: "Inquiry into Transition from NHIF to Social Health Insurance (SHIF)",
    stage: "Senate Health Committee Inquiry",
    statusBadge: "Public Hearing Ongoing",
    statusTone: "urgent",
    articleRef: "Article 43(1)(a) & Article 46",
    articleNum: "Art. 43",
    deadline: "Senate Committee Hearings",
    desc: "Scrutiny of patient deductions, public hospital system downtimes, and guaranteed emergency medical treatment without upfront out-of-pocket cash.",
    mwananchiImpact: "Affirms that under Article 43, no healthcare facility may deny emergency medical care to any citizen.",
    howToEngage: "Submit patient testimonies and grievance reports to the Senate Standing Committee on Health.",
  },
  {
    type: "memoranda" as const,
    house: "Civic Toolkit",
    billNum: "Citizen Template #01",
    title: "How to Draft a Constitutional Memorandum for Parliament",
    stage: "Citizen Guide & Step-by-Step",
    statusBadge: "Civic Resource",
    statusTone: "guide",
    articleRef: "Article 37 & Article 119",
    articleNum: "Art. 119",
    deadline: "Available anytime",
    desc: "Complete guide on how any Kenyan, youth group, or community CBO can author a legally valid memorandum to Parliament that MPs must consider.",
    mwananchiImpact: "Demystifies the official petition format, required signatures, legal citations, and submission protocols.",
    howToEngage: "Download the free template below and adapt it for any bill currently before the House.",
  },
];

const generalIssues = [
  {
    tag: "Public Finance",
    title: "County Budget 2025/26: What changed and why it matters to your town",
    date: "Current",
    read: "5 min",
    article: "Art. 201",
    desc: "Understanding the county fiscal strategy paper and how public hearings in your ward dictate road and water projects.",
  },
  {
    tag: "Elections",
    title: "IEBC reconstitution: timelines, boundary review & implications",
    date: "Active",
    read: "7 min",
    article: "Art. 88",
    desc: "Why the delay in swearing in the electoral commission touches on voter rights and parliamentary constituency counts.",
  },
  {
    tag: "Bill of Rights",
    title: "The right to protest and peaceful assembly in Kenya",
    date: "Essential",
    read: "8 min",
    article: "Art. 37",
    desc: "Article 37 unpacked: peaceful picketing, notice vs. permission, and police duty to provide security.",
  },
  {
    tag: "Devolution",
    title: "Healthcare devolution: 15 years of county wins and challenges",
    date: "In-depth",
    read: "6 min",
    article: "Art. 174",
    desc: "How health management was transferred to the 47 counties and where citizens can demand accountability.",
  },
  {
    tag: "Digital Rights",
    title: "Data Protection Act & phone search rights at roadblocks",
    date: "Guide",
    read: "10 min",
    article: "Art. 31",
    desc: "Your legal rights under Article 31: what an officer can and cannot inspect on your smartphone.",
  },
  {
    tag: "Public Participation",
    title: "How to participate in County Assembly public barazas",
    date: "Toolkit",
    read: "12 min",
    article: "Art. 196",
    desc: "Where notices are published, how to speak up, and how to verify if your views were recorded in the final hansard.",
  },
];

function IssuesPage() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");

  const filteredBills = activeBillsAndMotions.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "bills") return item.type === "bill";
    if (activeTab === "motions") return item.type === "motion";
    if (activeTab === "memoranda") return item.type === "memoranda";
    return true;
  });

  return (
    <SiteShell>
      {/* Editorial Header */}
      <section className="border-b border-border/60 bg-hero-radial py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="eyebrow flex items-center gap-1.5">
              <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
              Parliamentary & Governance Watch
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-flag-green/10 px-2.5 py-0.5 text-[10px] font-bold text-flag-green font-ui">
              <span className="h-1.5 w-1.5 rounded-full bg-flag-green animate-pulse" />
              Kenya 2025/2026 Legislative Calendar
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl text-balance">
            Current Issues, Bills
            <br />
            <span className="text-gradient italic">& Active Motions.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Every statute, motion, and debate in Kenya’s National Assembly and Senate is bound by the Constitution.
            Track bills while there is still time to submit citizen views under Article 118.
          </p>

          {/* Tab selectors */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-border/70 pb-4">
            {[
              { id: "all" as const, label: "All Legislative Trackers" },
              { id: "bills" as const, label: "Active Bills (Assembly & Senate)" },
              { id: "motions" as const, label: "Parliamentary Motions" },
              { id: "memoranda" as const, label: "Citizen Memoranda & Toolkits" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold font-ui transition-all",
                  activeTab === tab.id
                    ? "bg-flag-green text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Primary Section: Active Bills & Motions */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Active Legislation & Motions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ground truth on what is being drafted, debated, and voted on in Nairobi and the 47 counties.
            </p>
          </div>
          <span className="text-xs font-semibold font-ui text-muted-foreground">
            Showing {filteredBills.length} item{filteredBills.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredBills.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7 card-elevated hover:border-flag-green/50 transition-all"
            >
              <div>
                {/* Meta Top */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-muted px-2.5 py-1 text-[11px] font-bold font-ui text-foreground">
                      {item.house}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-ui">{item.billNum}</span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-bold font-ui",
                      item.statusTone === "urgent"
                        ? "bg-flag-green/15 text-flag-green"
                        : item.statusTone === "active"
                        ? "bg-gold/20 text-[oklch(0.55_0.12_65)]"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                    )}
                  >
                    {item.statusBadge}
                  </span>
                </div>

                {/* Title */}
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <Link
                    to="/constitution"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-bold font-ui text-flag-green hover:underline"
                    title={`View ${item.articleRef}`}
                  >
                    <BookOpen className="h-3 w-3" />
                    {item.articleNum}
                  </Link>
                </div>

                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5 font-ui">
                  <Calendar className="h-3.5 w-3.5" />
                  {item.deadline} · Stage: {item.stage}
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>

                {/* Mwananchi Impact Box */}
                <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-flag-green font-ui flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    How this touches everyday life:
                  </div>
                  <p className="mt-1 text-xs text-foreground/80 leading-relaxed font-ui">
                    {item.mwananchiImpact}
                  </p>
                </div>

                {/* Engagement Protocol */}
                <div className="mt-3 text-xs text-muted-foreground font-ui border-l-2 border-flag-green/40 pl-2.5">
                  <strong className="text-foreground">Citizen action: </strong>
                  {item.howToEngage}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                <Link to="/constitution">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs font-medium font-ui border-border/80"
                  >
                    Constitutional Root ({item.articleNum})
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    size="sm"
                    className="rounded-full text-xs font-medium font-ui bg-flag-green hover:bg-flag-green/90 text-white"
                  >
                    Ask Wakili AI About This Bill <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Secondary Section: Essential Civic Explainers */}
      <section className="border-t border-border/60 bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="eyebrow">Civic Knowledge Archive</span>
            <h2 className="mt-2 font-display text-3xl font-bold">Deep-Dive Civic Explainers</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Essential foundational guides on the budget cycle, the right to protest, and devolution mechanisms.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {generalIssues.map((it, i) => (
              <motion.article
                key={it.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 card-elevated hover:border-flag-green/60 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 font-bold font-ui text-foreground text-[11px]">
                      {it.tag}
                    </span>
                    <span className="font-ui text-flag-green font-semibold">{it.article}</span>
                  </div>

                  <h3 className="font-display text-lg font-bold group-hover:text-flag-green transition-colors leading-snug">
                    {it.title}
                  </h3>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {it.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{it.read} read</span>
                  <Link to="/learn" className="text-flag-green font-semibold font-ui hover:underline inline-flex items-center gap-1">
                    Study Topic <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Citizen Action Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-flag-green/30 bg-flag-green/5 p-8 text-center sm:p-12">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-flag-green text-white mb-4">
            <Vote className="h-6 w-6" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold">
            "Parliament shall facilitate public participation..."
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
            Article 118 is not a suggestion — it is a constitutional command. When citizens actively submit views on bills and budgets, Kenya's democracy works.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/constitution">
              <Button className="rounded-full px-6 font-medium font-ui text-sm bg-flag-green hover:bg-flag-green/90 text-white">
                Read Article 118 <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="rounded-full px-6 font-medium font-ui text-sm border-border">
                Draft a Memo with Wakili AI
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
