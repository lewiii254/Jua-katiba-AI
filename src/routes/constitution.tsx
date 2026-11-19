import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookMarked,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Copy,
  ExternalLink,
  MessageSquare,
  Search,
  Sparkles,
  Volume2,
  Check,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/constitution")({
  head: () => ({
    meta: [
      { title: "Constitution Explorer — Jua Katiba AI" },
      {
        name: "description",
        content:
          "Explore the 18 chapters and 264 articles of the Constitution of Kenya with simplified plain-language and Sheng explainers.",
      },
    ],
  }),
  component: ConstitutionPage,
});

type ArticleDetail = {
  n: string;
  title: string;
  summary: string;
  plainEnglish: string;
  shengTranslation: string;
  practicalTip: string;
};

type Chapter = {
  n: number;
  title: string;
  articles: string;
  category: "foundations" | "rights" | "governance" | "devolution" | "finance";
  highlights: ArticleDetail[];
};

const chapters: Chapter[] = [
  {
    n: 1,
    title: "Sovereignty of the People & Supremacy of the Constitution",
    articles: "1–3",
    category: "foundations",
    highlights: [
      {
        n: "1",
        title: "Sovereignty of the people",
        summary:
          "All sovereign power belongs to the citizens of Kenya. State organs and officials only exercise authority on loan from the people.",
        plainEnglish:
          "Citizens hold the ultimate authority in Kenya. Leaders are elected or appointed to serve the public, not to rule over them.",
        shengTranslation:
          "Nguvu yote kwa nchi ni ya raia. Viongozi wote tumewakopesha mamlaka; wakileta maringo, raia wana haki ya kuwatoa.",
        practicalTip:
          "You have the constitutional right to question any public decision and participate in public barazas.",
      },
      {
        n: "2",
        title: "Supremacy of the Constitution",
        summary:
          "The Constitution is the highest law in the land. Any other law or official action that conflicts with it is automatically null and void.",
        plainEnglish:
          "No president, governor, police officer, or court order can override the Constitution.",
        shengTranslation:
          "Katiba ndio sheria nambari moja. Sheria yoyote au agizo linaloenda kinyume nayo ni batili papo hapo.",
        practicalTip:
          "If an official gives an unconstitutional directive, you can challenge it in court.",
      },
      {
        n: "3",
        title: "Defence of the Constitution",
        summary:
          "Every individual has a binding duty to respect, protect, and uphold the Constitution.",
        plainEnglish:
          "Defending the Constitution is an active civic duty expected of every resident.",
        shengTranslation:
          "Kila Mkenya anafaa kulinda Katiba bila uoga, kupinga ufisadi, na kupigania haki za wananchi.",
        practicalTip:
          "Reporting abuse of public funds or illegal arrests is a direct way of defending the Constitution.",
      },
    ],
  },
  {
    n: 2,
    title: "The Republic & National Values",
    articles: "4–11",
    category: "foundations",
    highlights: [
      {
        n: "10",
        title: "National values and principles of governance",
        summary:
          "Key principles binding all public bodies: patriotism, the rule of law, human dignity, equity, social justice, and integrity.",
        plainEnglish:
          "These values must guide every government appointment, budget decision, and court ruling.",
        shengTranslation:
          "Serikali yafaa iongozwe kwa ukweli, usawa, na uwazi bila mapendeleo ya kikabila au kibinafsi.",
        practicalTip:
          "Cite Article 10 when challenging lack of public participation in county projects.",
      },
    ],
  },
  {
    n: 3,
    title: "Citizenship",
    articles: "12–18",
    category: "foundations",
    highlights: [
      {
        n: "14",
        title: "Citizenship by birth",
        summary:
          "Any person is a Kenyan citizen by birth if either mother or father is a Kenyan citizen on the day of birth.",
        plainEnglish:
          "A person born of a Kenyan parent holds immediate and irrevocable right to Kenyan citizenship.",
        shengTranslation:
          "Mzazi mmoja akiwa Mkenya wakati unazaliwa, wewe ni raia halisi wa Kenya moja kwa moja.",
        practicalTip:
          "Dual citizenship is explicitly permitted under Article 16.",
      },
    ],
  },
  {
    n: 4,
    title: "The Bill of Rights",
    articles: "19–59",
    category: "rights",
    highlights: [
      {
        n: "27",
        title: "Equality and freedom from discrimination",
        summary:
          "Every person is equal before the law and entitled to full protection without prejudice based on gender, ethnicity, age, or status.",
        plainEnglish:
          "No employer, school, landlord, or government department can deny you opportunities because of your background.",
        shengTranslation:
          "Hakuna kubaguliwa kwa misingi ya jinsia, kabila, au ulemavu; sheria inafaa kutulinda sote kwa usawa.",
        practicalTip:
          "Discriminatory policies can be challenged through the Kenya National Commission on Human Rights.",
      },
      {
        n: "31",
        title: "Right to privacy",
        summary:
          "Protection of your person, home, possessions, and private digital communications from arbitrary search or seizure.",
        plainEnglish:
          "Law enforcement officers cannot search your home or inspect your smartphone without a lawful court warrant.",
        shengTranslation:
          "Polisi hawezi kudai password ya simu yako au kupekua meseji zako kiholela bila kibali cha jaji.",
        practicalTip:
          "You can politely ask to see a search warrant if an officer requests your mobile device.",
      },
      {
        n: "37",
        title: "Assembly, demonstration, picketing, and petition",
        summary:
          "The fundamental right to gather, march, picket, and present petitions to authorities peaceably and unarmed.",
        plainEnglish:
          "Peaceful protests are constitutional rights. The police must provide protection rather than unlawful disruption.",
        shengTranslation:
          "Una uhuru wa kuandamana na kuwasilisha malalamishi yako kwa serikali bila fujo au silaha.",
        practicalTip:
          "Organizers are required to notify authorities in advance for security facilitation.",
      },
      {
        n: "43",
        title: "Economic and social rights",
        summary:
          "Guarantees the progressive realization of healthcare, housing, food, clean water, social security, and basic education.",
        plainEnglish:
          "Access to basic human necessities is an enforceable right, not a favor from politicians.",
        shengTranslation:
          "Kila mtu anastahili huduma za afya, maji safi, chakula, makazi bora na masomo bila ubaguzi.",
        practicalTip:
          "No hospital can turn away a patient requiring emergency medical treatment.",
      },
      {
        n: "49",
        title: "Rights of arrested persons",
        summary:
          "Guarantees that arrested individuals are informed of the reason, allowed legal counsel, and brought to court within 24 hours.",
        plainEnglish:
          "You must be told why you were arrested immediately and given access to an advocate and family.",
        shengTranslation:
          "Ukikamatwa, lazima uambiwe kosa lako mara moja na upelekwe kortini ndani ya saa 24.",
        practicalTip:
          "Remind officers of your right to remain silent until your legal counsel is present.",
      },
    ],
  },
  {
    n: 5,
    title: "Land and Environment",
    articles: "60–72",
    category: "foundations",
    highlights: [
      {
        n: "60",
        title: "Principles of land policy",
        summary:
          "Equitable access to land, security of tenure, transparent land administration, and sustainable conservation.",
        plainEnglish:
          "Land ownership must be documented fairly, preventing unlawful grabs of communal and public property.",
        shengTranslation:
          "Mashamba yanafaa kugawanywa na kusimamiwa kwa haki bila wizi wa ardhi ya umma.",
        practicalTip:
          "Verify all title deeds through the National Land Information Management System.",
      },
    ],
  },
  {
    n: 6,
    title: "Leadership and Integrity",
    articles: "73–80",
    category: "governance",
    highlights: [
      {
        n: "73",
        title: "Responsibilities of leadership",
        summary:
          "Authority granted to state officers is a public trust to be exercised with objectivity, impartiality, and selfless service.",
        plainEnglish:
          "Public officials must serve citizens ethically and remain strictly accountable for their conduct.",
        shengTranslation:
          "Uongozi sio nafasi ya kujitajirisha; ni wito wa kuwatumikia wananchi kwa uadilifu mkuu.",
        practicalTip:
          "Citizens can lodge complaints against unethical officials at the Ethics and Anti-Corruption Commission.",
      },
      {
        n: "75",
        title: "Conduct of State officers",
        summary:
          "Prohibits conflicts of interest and actions that compromise public trust in public offices.",
        plainEnglish:
          "Public leaders cannot use their position to award state tenders to their private businesses.",
        shengTranslation:
          "Afisa wa serikali haruhusiwi kibiashara kujipatia tenda kwenye idara anayosimamia.",
        practicalTip:
          "Conflict of interest violations can lead to removal from office under Article 75.",
      },
    ],
  },
  {
    n: 7,
    title: "Representation of the People",
    articles: "81–92",
    category: "governance",
    highlights: [
      {
        n: "81",
        title: "General principles for the electoral system",
        summary:
          "Guarantees universal suffrage, free and fair secret-ballot voting, and representation of youth and marginalized groups.",
        plainEnglish:
          "Every eligible citizen has a right to register and vote in transparent, peaceful elections.",
        shengTranslation:
          "Uchaguzi unafaa kuwa wa siri, wa uwazi, na bila vitisho au hongo kwa raia.",
        practicalTip:
          "Check your voter status during official registration drives organized by the electoral commission.",
      },
    ],
  },
  {
    n: 8,
    title: "The Legislature",
    articles: "93–128",
    category: "governance",
    highlights: [
      {
        n: "94",
        title: "Role of Parliament",
        summary:
          "Legislative authority originates from the people and is exercised by the National Assembly and the Senate.",
        plainEnglish:
          "Parliament passes laws and audits national finances on behalf of Kenyan voters.",
        shengTranslation:
          "Bunge linatunga sheria na kuchunguza jinsi pesa za ushuru zinavyotumiwa na serikali.",
        practicalTip:
          "Track legislative voting records to understand how your elected MP represents your constituency.",
      },
      {
        n: "118",
        title: "Public access and participation",
        summary:
          "Mandates that Parliament conduct business openly and facilitate meaningful citizen input on all proposed laws.",
        plainEnglish:
          "Committees must advertise and listen to public feedback before voting on any bill.",
        shengTranslation:
          "Bunge haliwezi kupitisha sheria kwa siri; lazima raia wapewe nafasi ya kutoa maoni.",
        practicalTip:
          "Anyone can submit written memoranda to the Clerk of the National Assembly or Senate.",
      },
    ],
  },
  {
    n: 9,
    title: "The Executive",
    articles: "129–155",
    category: "governance",
    highlights: [
      {
        n: "129",
        title: "Principles of executive authority",
        summary:
          "Executive power is exercised for the well-being and benefit of all Kenyans, respecting national diversity.",
        plainEnglish:
          "The President and Cabinet must operate within constitutional limits and promote national unity.",
        shengTranslation:
          "Mamlaka ya Rais na Baraza la Mawaziri yana mipaka na lazima yalete maendeleo kwa kila kona ya nchi.",
        practicalTip:
          "Presidential appointments require confirmation hearings by the National Assembly.",
      },
    ],
  },
  {
    n: 10,
    title: "Judiciary",
    articles: "159–173",
    category: "governance",
    highlights: [
      {
        n: "159",
        title: "Judicial authority",
        summary:
          "Judicial authority stems from the people and must be exercised without undue delay or procedural technicalities.",
        plainEnglish:
          "Courts are tasked with delivering fair justice to rich and poor alike without unnecessary red tape.",
        shengTranslation:
          "Mahakama inafaa kutoa haki haraka kwa kila mtu bila kupendelea walio na mamlaka au pesa.",
        practicalTip:
          "Alternative Dispute Resolution (ADR) and traditional mediation are constitutionally recognized.",
      },
      {
        n: "160",
        title: "Independence of the Judiciary",
        summary:
          "The Judiciary is subject only to the Constitution and the law, free from executive or political interference.",
        plainEnglish:
          "Judges decide cases according to law, not political pressure or external directives.",
        shengTranslation:
          "Majaji hawafai kupokea maagizo kutoka kwa viongozi wa kisiasa wanapoamua kesi.",
        practicalTip:
          "Judicial decisions can be reviewed through appellate courts up to the Supreme Court.",
      },
    ],
  },
  {
    n: 11,
    title: "Devolved Government",
    articles: "174–200",
    category: "devolution",
    highlights: [
      {
        n: "174",
        title: "Objects of devolution",
        summary:
          "To promote self-governance, enhance citizen participation, and ensure equitable resource sharing across all 47 counties.",
        plainEnglish:
          "Decentralizes power so that local communities decide their priorities rather than waiting on Nairobi.",
        shengTranslation:
          "Madaraka yashuka mashinani ili kaunti yako ijiamulie miradi ya hospitali, maji, na barabara.",
        practicalTip:
          "Attend county budget consultative forums to decide ward development fund allocations.",
      },
      {
        n: "176",
        title: "County governments",
        summary:
          "Establishes a county executive led by the Governor and a county assembly of elected and nominated MCAs.",
        plainEnglish:
          "Your County Assembly monitors local budgets and passes county-specific bylaws.",
        shengTranslation:
          "Kila kaunti ina serikali yake inayoongozwa na Gavana akisaidiwa na wawakilishi wa wadi (MCAs).",
        practicalTip:
          "You can petition your Member of County Assembly (MCA) regarding ward issues.",
      },
    ],
  },
  {
    n: 12,
    title: "Public Finance",
    articles: "201–231",
    category: "finance",
    highlights: [
      {
        n: "201",
        title: "Principles of public finance",
        summary:
          "Openness, accountability, public participation in financial matters, and responsible public debt management.",
        plainEnglish:
          "Government budgets must be clear, transparent, and protect future generations from unsustainable debt.",
        shengTranslation:
          "Matumizi ya ushuru lazima yawe wazi kwa raia, na madeni ya nchi yasimamiwe kwa uangalifu.",
        practicalTip:
          "Citizens can examine the National Treasury Budget Policy Statement during annual public review stages.",
      },
      {
        n: "203",
        title: "Equitable share and financial allocations",
        summary:
          "Guarantees that a constitutionally protected minimum percentage of national revenue flows directly to counties.",
        plainEnglish:
          "County governments have a guaranteed constitutional share of revenue to ensure localized delivery.",
        shengTranslation:
          "Kuna fungu maalum la pesa za kitaifa ambalo lazima litumwe kaunti kugharamia maendeleo.",
        practicalTip:
          "The Commission on Revenue Allocation publishes annual recommendations on county allocations.",
      },
    ],
  },
  {
    n: 13,
    title: "The Public Service",
    articles: "232–236",
    category: "governance",
    highlights: [
      {
        n: "232",
        title: "Values and principles of public service",
        summary:
          "High standards of professional ethics, efficient service delivery, transparency, and merit-based recruitment.",
        plainEnglish:
          "Civil servants are expected to serve the public with courtesy, professionalism, and integrity.",
        shengTranslation:
          "Wafanyakazi wa serikali wanafaa kutoa huduma safi, kwa wakati, na bila kuomba hongo.",
        practicalTip:
          "The Public Service Commission offers feedback mechanisms for reporting substandard service.",
      },
    ],
  },
  {
    n: 14,
    title: "National Security",
    articles: "238–247",
    category: "governance",
    highlights: [
      {
        n: "238",
        title: "Principles of national security",
        summary:
          "Security organs must operate with strict adherence to human rights, national law, and democratic oversight.",
        plainEnglish:
          "Security forces protect citizens while upholding fundamental human dignity.",
        shengTranslation:
          "Usalama wa nchi unapaswa kuheshimu haki za kibinadamu na sheria za Katiba.",
        practicalTip:
          "The Independent Policing Oversight Authority (IPOA) investigates misconduct by police officers.",
      },
    ],
  },
  {
    n: 15,
    title: "Commissions and Independent Offices",
    articles: "248–254",
    category: "governance",
    highlights: [
      {
        n: "249",
        title: "Objects and authority of constitutional commissions",
        summary:
          "Independent institutions that safeguard people's sovereignty and ensure democratic accountability.",
        plainEnglish:
          "Commissions like the Auditor-General and Ombudsman operate independently from ministerial interference.",
        shengTranslation:
          "Tume hizi zinalinda haki za mwananchi na kuzuia viongozi kutumia mamlaka vibaya.",
        practicalTip:
          "Review Auditor-General reports to see how your local county spent public funds.",
      },
    ],
  },
  {
    n: 16,
    title: "Amendment of the Constitution",
    articles: "255–257",
    category: "foundations",
    highlights: [
      {
        n: "255",
        title: "Amendment by referendum",
        summary:
          "Core provisions including sovereignty, fundamental rights, and devolution can only be amended through a direct referendum.",
        plainEnglish:
          "Parliament cannot alter fundamental rights without the direct vote of Kenyan citizens in a national referendum.",
        shengTranslation:
          "Bunge haliwezi kurekebisha haki za raia au ugatuzi bila kupigiwa kura na wananchi kwenye kura ya maoni.",
        practicalTip:
          "A constitutional referendum requires a simple majority with at least 20 percent turnout across half the counties.",
      },
    ],
  },
  {
    n: 17,
    title: "General Provisions & Enforcement",
    articles: "258–264",
    category: "rights",
    highlights: [
      {
        n: "258",
        title: "Enforcement of the Constitution",
        summary:
          "Any person has the right to file court proceedings if the Constitution has been violated or is threatened.",
        plainEnglish:
          "You do not need to be personally harmed to file a public interest case defending constitutional protections.",
        shengTranslation:
          "Mkenya yeyote anaweza kuenda kortini kusimamisha jambo linalovunja Katiba hata kama halijamdhuru kibinafsi.",
        practicalTip:
          "Public interest litigation allows civil groups to challenge unconstitutional government actions.",
      },
    ],
  },
  {
    n: 18,
    title: "Transitional and Consequential Provisions",
    articles: "Sched.",
    category: "foundations",
    highlights: [
      {
        n: "Sixth Schedule",
        title: "Transitional provisions",
        summary:
          "Structured the legal transition from the previous constitutional framework to the 2010 Constitution.",
        plainEnglish:
          "Ensured continuity of government functions, courts, and existing contracts during institutional reforms.",
        shengTranslation:
          "Iliweka mpangilio wa kubadilisha mfumo wa zamani na kuingiza Katiba mpya ya mwaka 2010.",
        practicalTip:
          "Certain historical tenure rules remain anchored in the Sixth Schedule.",
      },
    ],
  },
];

export function ConstitutionPage() {
  const [q, setQ] = useState("");
  const [openChapter, setOpenChapter] = useState<number | null>(4); // Bill of Rights open by default
  const [activeTab, setActiveTab] = useState<"all" | "rights" | "devolution" | "governance" | "finance">("all");
  const [expandedLanguage, setExpandedLanguage] = useState<Record<string, "summary" | "plain" | "sheng">>({});
  const [copiedArticle, setCopiedArticle] = useState<string | null>(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>(["27", "43", "118"]);

  const filteredChapters = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return chapters.filter((c) => {
      // Category filter
      if (activeTab !== "all" && c.category !== activeTab) {
        return false;
      }
      if (!needle) return true;

      // Text search
      const matchesChapter = `${c.n} ${c.title} chapter ${c.articles}`.toLowerCase().includes(needle);
      const matchesArticle = c.highlights.some(
        (a) =>
          a.n.toLowerCase().includes(needle) ||
          a.title.toLowerCase().includes(needle) ||
          a.summary.toLowerCase().includes(needle) ||
          a.plainEnglish.toLowerCase().includes(needle) ||
          a.shengTranslation.toLowerCase().includes(needle),
      );
      return matchesChapter || matchesArticle;
    });
  }, [q, activeTab]);

  const handleCopyCitation = (artNum: string, artTitle: string) => {
    const text = `Article ${artNum} (${artTitle}), Constitution of Kenya 2010.`;
    navigator.clipboard.writeText(text);
    setCopiedArticle(artNum);
    setTimeout(() => setCopiedArticle(null), 2000);
  };

  const toggleBookmark = (artNum: string) => {
    setBookmarkedArticles((prev) =>
      prev.includes(artNum) ? prev.filter((id) => id !== artNum) : [...prev, artNum],
    );
  };

  return (
    <SiteShell>
      {/* Header */}
      <section className="border-b border-border/60 bg-hero-radial py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="eyebrow flex items-center gap-1.5">
              <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
              Constitutional Library
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-flag-green/10 px-2.5 py-0.5 text-[10px] font-bold text-flag-green font-ui">
              Official Text · Plain English · Sheng
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl text-balance">
            The Constitution of Kenya, 2010.
            <br />
            <span className="text-gradient italic">Clear. Accessible. Empowering.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            All 18 chapters and 264 articles demystified. Search key protections, explore everyday meanings,
            and switch between legal summaries and everyday language.
          </p>

          {/* Search bar */}
          <div className="relative mt-8 max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by keyword, topic, or article number (e.g., '43', 'privacy', 'devolution')..."
              className="h-14 rounded-2xl border-border bg-card pl-12 pr-4 text-base shadow-sm focus-ring"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground font-ui"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-ui mr-1">Quick Filters:</span>
            {[
              { id: "all" as const, label: "All 18 Chapters" },
              { id: "rights" as const, label: "Bill of Rights (Ch. 4)" },
              { id: "devolution" as const, label: "Devolved Government (Ch. 11)" },
              { id: "governance" as const, label: "Leadership & Governance" },
              { id: "finance" as const, label: "Public Finance (Ch. 12)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium font-ui transition-all",
                  activeTab === tab.id
                    ? "bg-flag-green text-white shadow-sm font-semibold"
                    : "bg-card border border-border/70 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter Index Numbers Banner */}
      <div className="border-b border-border/50 bg-muted/20 py-3 hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-ui text-muted-foreground py-1">
            <span className="font-semibold text-foreground shrink-0 mr-2">Jump to Chapter:</span>
            {Array.from({ length: 18 }).map((_, i) => {
              const chNum = i + 1;
              return (
                <button
                  key={chNum}
                  onClick={() => {
                    setOpenChapter(chNum);
                    const el = document.getElementById(`chapter-${chNum}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "h-7 w-7 rounded-lg border flex items-center justify-center font-bold transition-all shrink-0",
                    openChapter === chNum
                      ? "bg-flag-green text-white border-flag-green"
                      : "bg-card border-border hover:border-flag-green/60 text-foreground",
                  )}
                >
                  {chNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chapter List */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {filteredChapters.map((c) => {
            const isOpen = openChapter === c.n;
            return (
              <motion.div
                key={c.n}
                id={`chapter-${c.n}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-all card-elevated",
                  isOpen ? "border-flag-green/40 bg-card" : "border-border bg-card hover:border-border/80",
                )}
              >
                {/* Chapter Accordion Header */}
                <button
                  onClick={() => setOpenChapter(isOpen ? null : c.n)}
                  className="flex w-full items-start gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-muted/30 focus-ring"
                  aria-expanded={isOpen}
                >
                  <div
                    className={cn(
                      "grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-lg font-bold transition-transform",
                      isOpen ? "bg-flag-green text-white" : "bg-flag-green/10 text-flag-green",
                    )}
                  >
                    {c.n}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-ui">
                      <BookMarked className="h-3.5 w-3.5 text-flag-green" />
                      <span>Chapter {c.n} · Articles {c.articles}</span>
                    </div>
                    <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold leading-tight text-foreground">
                      {c.title}
                    </h2>
                  </div>

                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-flag-green",
                    )}
                  />
                </button>

                {/* Chapter Articles Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="border-t border-border/60 bg-muted/15"
                    >
                      <div className="space-y-4 p-5 sm:p-6">
                        {c.highlights.map((a) => {
                          const lang = expandedLanguage[a.n] || "plain";
                          const isBookmarked = bookmarkedArticles.includes(a.n);
                          const isCopied = copiedArticle === a.n;

                          return (
                            <div
                              key={a.n}
                              className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm hover:border-flag-green/40 transition-all"
                            >
                              {/* Article Card Top */}
                              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 pb-3.5">
                                <div className="flex items-baseline gap-2">
                                  <span className="rounded-lg bg-flag-green px-2.5 py-1 text-xs font-bold text-white font-ui">
                                    Art. {a.n}
                                  </span>
                                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                                    {a.title}
                                  </h3>
                                </div>

                                {/* Utilities: Bookmark & Copy */}
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyCitation(a.n, a.title)}
                                    className="h-8 px-2 text-xs font-ui text-muted-foreground hover:text-foreground"
                                    title="Copy legal citation"
                                  >
                                    {isCopied ? (
                                      <Check className="h-3.5 w-3.5 text-flag-green mr-1" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5 mr-1" />
                                    )}
                                    {isCopied ? "Copied" : "Cite"}
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleBookmark(a.n)}
                                    className="h-8 px-2 text-xs font-ui text-muted-foreground hover:text-foreground"
                                    title={isBookmarked ? "Remove bookmark" : "Save article"}
                                  >
                                    {isBookmarked ? (
                                      <BookmarkCheck className="h-3.5 w-3.5 text-flag-green mr-1 fill-flag-green/20" />
                                    ) : (
                                      <Bookmark className="h-3.5 w-3.5 mr-1" />
                                    )}
                                    {isBookmarked ? "Saved" : "Save"}
                                  </Button>
                                </div>
                              </div>

                              {/* Language Mode Toggle Tabs */}
                              <div className="mt-3.5 flex items-center gap-1.5 border-b border-border/40 pb-2">
                                <span className="text-[11px] font-semibold text-muted-foreground font-ui mr-1.5">
                                  Perspective:
                                </span>
                                {[
                                  { id: "plain" as const, label: "Plain English" },
                                  { id: "sheng" as const, label: "Katiba Mtaani (Sheng)" },
                                  { id: "summary" as const, label: "Official Summary" },
                                ].map((tab) => (
                                  <button
                                    key={tab.id}
                                    onClick={() =>
                                      setExpandedLanguage((prev) => ({
                                        ...prev,
                                        [a.n]: tab.id,
                                      }))
                                    }
                                    className={cn(
                                      "rounded-lg px-2.5 py-1 text-xs font-medium font-ui transition-colors",
                                      lang === tab.id
                                        ? "bg-muted text-foreground font-semibold"
                                        : "text-muted-foreground hover:text-foreground",
                                    )}
                                  >
                                    {tab.label}
                                  </button>
                                ))}
                              </div>

                              {/* Dynamic Text Box */}
                              <div className="mt-3.5">
                                {lang === "plain" && (
                                  <div className="rounded-xl bg-flag-green/5 border border-flag-green/20 p-4">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-flag-green font-ui flex items-center gap-1.5 mb-1.5">
                                      <Sparkles className="h-3.5 w-3.5" /> Plain Everyday Meaning
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground font-medium">
                                      {a.plainEnglish}
                                    </p>
                                  </div>
                                )}

                                {lang === "sheng" && (
                                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 dark:bg-amber-950/20">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-ui flex items-center gap-1.5 mb-1.5">
                                      <MessageSquare className="h-3.5 w-3.5" /> Katiba Mtaani (Kenyan Sheng)
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground font-medium italic">
                                      "{a.shengTranslation}"
                                    </p>
                                  </div>
                                )}

                                {lang === "summary" && (
                                  <div className="rounded-xl bg-muted/40 border border-border/70 p-4 pattern-ruled">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-ui mb-1.5">
                                      Legal Core
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground font-display">
                                      "{a.summary}"
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Citizen Action Tip */}
                              <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground font-ui bg-muted/20 rounded-lg p-2.5">
                                <strong className="text-foreground shrink-0">Practical tip:</strong>
                                <span>{a.practicalTip}</span>
                              </div>

                              {/* Action Footer */}
                              <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
                                <Link to="/learn" search={{ lesson: "bor-1" }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full text-xs font-ui h-8 border-border"
                                  >
                                    Study Interactive Lesson
                                  </Button>
                                </Link>

                                <Link to="/dashboard">
                                  <Button
                                    size="sm"
                                    className="rounded-full text-xs font-ui h-8 bg-flag-green hover:bg-flag-green/90 text-white"
                                  >
                                    Ask Wakili AI About Art. {a.n}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {filteredChapters.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card">
              <Search className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
              <h3 className="font-display text-lg font-bold text-foreground">No matches found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                No chapters or articles match "{q}". Try searching for terms like "devolution", "rights", or article numbers like "37".
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQ("");
                  setActiveTab("all");
                }}
                className="mt-4 rounded-full text-xs font-ui"
              >
                Reset Search Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Preamble Card */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 card-elevated">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-flag-green font-ui">
            <Sparkles className="h-3.5 w-3.5" /> Preamble
          </div>
          <h3 className="mt-2 font-display text-2xl font-bold">"We, the people of Kenya..."</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic font-display">
            "Recognising the aspirations of all Kenyans for a government based on the essential values of human rights,
            equality, freedom, democracy, social justice and the rule of law... Adopt, enact and give this Constitution
            to ourselves and to our future generations."
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
