import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  allPracticeAreas,
  initialAdvocates,
  initialClientRequests,
  kenyanCounties,
  type Advocate,
  type ClientRequest,
  type PracticeArea,
} from "@/data/lawyers-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lawyers")({
  head: () => ({
    meta: [
      { title: "Wakili Hub — Find a Lawyer & Legal Marketplace | Jua Katiba" },
      {
        name: "description",
        content:
          "Connect with verified Advocates of the High Court of Kenya. Find legal representation, book consultations, or market your law practice to citizens across Kenya.",
      },
    ],
  }),
  component: LawyersPage,
});

export function LawyersPage() {
  const [advocates, setAdvocates] = useState<Advocate[]>(initialAdvocates);
  const [clientRequests, setClientRequests] = useState<ClientRequest[]>(initialClientRequests);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("find-lawyer");

  // Dialog states
  const [bookingAdvocate, setBookingAdvocate] = useState<Advocate | null>(null);
  const [viewingAdvocate, setViewingAdvocate] = useState<Advocate | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [postRequestModalOpen, setPostRequestModalOpen] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    consultationMode: "video",
    preferredDate: "",
    issueSummary: "",
  });

  // Lawyer Registration Form State
  const [lawyerForm, setLawyerForm] = useState({
    name: "",
    title: "Advocate of the High Court of Kenya",
    firm: "",
    lskNumber: "",
    county: "Nairobi",
    officeLocation: "",
    primaryArea: "Constitutional & Human Rights" as PracticeArea,
    consultationFee: "KSh 3,000 / 30 min",
    hourlyRate: "KSh 6,000 / hr",
    proBono: true,
    languages: "English, Swahili",
    phone: "",
    email: "",
    bio: "",
    notableMatters: "",
    experienceYears: 5,
  });

  // Client Request Form State
  const [clientRequestForm, setClientRequestForm] = useState({
    clientName: "",
    category: "Land, Property & Conveyancing" as PracticeArea,
    county: "Nairobi",
    title: "",
    description: "",
    urgency: "Within a week" as ClientRequest["urgency"],
    consultationPreference: "Video / Phone" as ClientRequest["consultationPreference"],
    budget: "Flexible / Market Rate",
  });

  // Load persisted lawyers & requests on mount
  useEffect(() => {
    try {
      const savedAdvocates = localStorage.getItem("jua_katiba_advocates");
      if (savedAdvocates) {
        const parsed = JSON.parse(savedAdvocates);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdvocates([...parsed, ...initialAdvocates]);
        }
      }
      const savedRequests = localStorage.getItem("jua_katiba_client_requests");
      if (savedRequests) {
        const parsed = JSON.parse(savedRequests);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClientRequests([...parsed, ...initialClientRequests]);
        }
      }
    } catch {
      // ignore JSON parse errors
    }
  }, []);

  // Filter Advocates
  const filteredAdvocates = useMemo(() => {
    return advocates.filter((adv) => {
      // Query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        adv.name.toLowerCase().includes(q) ||
        adv.firm.toLowerCase().includes(q) ||
        adv.county.toLowerCase().includes(q) ||
        adv.officeLocation.toLowerCase().includes(q) ||
        adv.bio.toLowerCase().includes(q) ||
        adv.practiceAreas.some((p) => p.toLowerCase().includes(q));

      // Area filter
      const matchesArea =
        selectedArea === "all" ||
        adv.practiceAreas.includes(selectedArea as PracticeArea);

      // County filter
      const matchesCounty =
        selectedCounty === "all" ||
        adv.county.toLowerCase() === selectedCounty.toLowerCase();

      // Mode filter
      const matchesMode =
        selectedMode === "all" ||
        (selectedMode === "pro-bono" && adv.proBono) ||
        (selectedMode === "video" && adv.consultationModes.includes("video")) ||
        (selectedMode === "in-person" && adv.consultationModes.includes("in-person"));

      return matchesQuery && matchesArea && matchesCounty && matchesMode;
    });
  }, [advocates, searchQuery, selectedArea, selectedCounty, selectedMode]);

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.clientName || !bookingForm.clientPhone) {
      toast.error("Please enter your name and phone number");
      return;
    }
    toast.success(
      `Consultation requested with ${bookingAdvocate?.name}! You will receive confirmation via WhatsApp / Phone shortly.`,
    );
    setBookingAdvocate(null);
    setBookingForm({
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      consultationMode: "video",
      preferredDate: "",
      issueSummary: "",
    });
  };

  // Handle Lawyer Registration Submit
  const handleLawyerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lawyerForm.name || !lawyerForm.firm || !lawyerForm.phone || !lawyerForm.lskNumber) {
      toast.error("Please fill in all required practice details and LSK number");
      return;
    }

    const initials = lawyerForm.name
      .split(" ")
      .filter((s) => !s.toLowerCase().startsWith("adv"))
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "WK";

    const newAdvocate: Advocate = {
      id: `adv-custom-${Date.now()}`,
      name: lawyerForm.name.startsWith("Adv.") ? lawyerForm.name : `Adv. ${lawyerForm.name}`,
      title: lawyerForm.title || "Advocate of the High Court of Kenya",
      firm: lawyerForm.firm,
      lskNumber: lawyerForm.lskNumber,
      avatarBg: "from-flag-green to-emerald-800",
      initials,
      rating: 5.0,
      reviewsCount: 1,
      experienceYears: Number(lawyerForm.experienceYears) || 5,
      county: lawyerForm.county,
      officeLocation: lawyerForm.officeLocation || `${lawyerForm.county} CBD`,
      practiceAreas: [lawyerForm.primaryArea],
      consultationFee: lawyerForm.consultationFee,
      hourlyRate: lawyerForm.hourlyRate,
      proBono: lawyerForm.proBono,
      languages: lawyerForm.languages.split(",").map((s) => s.trim()),
      consultationModes: ["video", "in-person", "phone"],
      bio: lawyerForm.bio || "Dedicated advocate practicing before Kenyan courts with focus on client rights.",
      notableMatters: lawyerForm.notableMatters
        ? lawyerForm.notableMatters.split("\n").filter((s) => s.trim().length > 0)
        : ["Licensed legal practitioner under the Advocates Act"],
      phone: lawyerForm.phone,
      email: lawyerForm.email,
      officeHours: "Mon - Fri: 8:30 AM - 5:00 PM",
      verified: true,
      isUserAdded: true,
    };

    const updated = [newAdvocate, ...advocates];
    setAdvocates(updated);

    try {
      const stored = localStorage.getItem("jua_katiba_advocates");
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem("jua_katiba_advocates", JSON.stringify([newAdvocate, ...list]));
    } catch {
      // ignore
    }

    toast.success("Karibu Wakili! Your practice profile is now live on Jua Katiba Wakili Hub.");
    setRegisterModalOpen(false);
    setActiveTab("find-lawyer");
  };

  // Handle Client Request Submit
  const handleClientRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientRequestForm.title || !clientRequestForm.description) {
      toast.error("Please provide a title and description for your legal brief");
      return;
    }

    const newRequest: ClientRequest = {
      id: `req-${Date.now()}`,
      clientName: clientRequestForm.clientName || "Kenyan Citizen",
      category: clientRequestForm.category,
      county: clientRequestForm.county,
      title: clientRequestForm.title,
      description: clientRequestForm.description,
      urgency: clientRequestForm.urgency,
      consultationPreference: clientRequestForm.consultationPreference,
      budget: clientRequestForm.budget,
      createdAt: "Just now",
      responsesCount: 0,
    };

    const updated = [newRequest, ...clientRequests];
    setClientRequests(updated);

    try {
      const stored = localStorage.getItem("jua_katiba_client_requests");
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem("jua_katiba_client_requests", JSON.stringify([newRequest, ...list]));
    } catch {
      // ignore
    }

    toast.success("Your legal need has been posted to the Advocate Desk!");
    setPostRequestModalOpen(false);
    setActiveTab("client-requests");
  };

  return (
    <SiteShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/60 bg-hero-radial">
        <div className="absolute inset-0 pattern-kente opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-flag-green">
              Wakili Hub · Legal Marketplace
            </span>
            <Badge variant="outline" className="text-xs border-flag-green/40 text-flag-green">
              Republic of Kenya
            </Badge>
          </div>

          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl lg:text-6xl text-foreground">
            Where Katiba Meets Justice.
            <br className="hidden sm:block" /> Connect with Verified Kenyan Advocates.
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Knowing your constitutional rights is the first step. When you need legal defense, land
            conveyancing, bail representation, or commercial advice, connect directly with licensed
            Advocates of the High Court of Kenya.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="rounded-full shadow-md"
              onClick={() => {
                setActiveTab("find-lawyer");
                const el = document.getElementById("marketplace-view");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Search className="mr-2 h-4 w-4" /> Find an Advocate
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-flag-green/60 text-flag-green hover:bg-flag-green/10"
              onClick={() => setRegisterModalOpen(true)}
            >
              <Briefcase className="mr-2 h-4 w-4" /> Market Your Practice (For Lawyers)
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="rounded-full"
              onClick={() => setPostRequestModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Post a Legal Need
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-flag-green/10 text-flag-green">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-base font-bold text-foreground">LSK Verified</div>
                <div className="text-xs">Licensed Advocates</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-base font-bold text-foreground">47 Counties</div>
                <div className="text-xs">Nationwide Reach</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-flag-red/10 text-flag-red">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-base font-bold text-foreground">Pro-Bono & Paid</div>
                <div className="text-xs">Flexible Retainers</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-base font-bold text-foreground">Direct Access</div>
                <div className="text-xs">No Intermediary Fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div id="marketplace-view" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
            <TabsList className="bg-muted/70 p-1 rounded-full">
              <TabsTrigger value="find-lawyer" className="rounded-full text-xs sm:text-sm">
                <Users className="mr-1.5 h-4 w-4" /> Advocate Directory ({advocates.length})
              </TabsTrigger>
              <TabsTrigger value="client-requests" className="rounded-full text-xs sm:text-sm">
                <MessageSquare className="mr-1.5 h-4 w-4" /> Client Case Board (
                {clientRequests.length})
              </TabsTrigger>
              <TabsTrigger value="for-lawyers" className="rounded-full text-xs sm:text-sm">
                <Sparkles className="mr-1.5 h-4 w-4" /> For Legal Practitioners
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setPostRequestModalOpen(true)}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Post Brief as Client
              </Button>
              <Button
                size="sm"
                className="rounded-full text-xs bg-flag-green hover:bg-flag-green/90 text-white"
                onClick={() => setRegisterModalOpen(true)}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> List Your Practice
              </Button>
            </div>
          </div>

          {/* TAB 1: FIND A LAWYER */}
          <TabsContent value="find-lawyer" className="pt-6 space-y-8">
            {/* Filter Bar */}
            <div className="rounded-3xl border border-border bg-card p-6 card-elevated space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by lawyer name, firm, or issue (e.g. bail, land, divorce, petition)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 rounded-full bg-background"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div>
                  <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                    <SelectTrigger className="h-10 rounded-full bg-background">
                      <SelectValue placeholder="All Counties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All 47 Counties</SelectItem>
                      {kenyanCounties.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c} County
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={selectedMode} onValueChange={setSelectedMode}>
                    <SelectTrigger className="h-10 rounded-full bg-background">
                      <SelectValue placeholder="Consultation Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Consultation Modes</SelectItem>
                      <SelectItem value="video">Virtual (Video / Phone)</SelectItem>
                      <SelectItem value="in-person">In-Person Chambers</SelectItem>
                      <SelectItem value="pro-bono">Pro-Bono / Legal Aid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Practice Area Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50">
                <span className="text-xs font-medium text-muted-foreground mr-2 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Practice Area:
                </span>
                <button
                  onClick={() => setSelectedArea("all")}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    selectedArea === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  All Practice Areas
                </button>
                {allPracticeAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      selectedArea === area
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                Found <strong>{filteredAdvocates.length}</strong> verified legal practitioners
              </span>
              {(selectedArea !== "all" ||
                selectedCounty !== "all" ||
                selectedMode !== "all" ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedArea("all");
                    setSelectedCounty("all");
                    setSelectedMode("all");
                    setSearchQuery("");
                  }}
                  className="text-flag-green hover:underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Advocate Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAdvocates.map((adv) => (
                <Card
                  key={adv.id}
                  className={cn(
                    "flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-6 transition-all duration-300 card-elevated hover:-translate-y-1",
                    adv.isUserAdded ? "border-flag-green/70 ring-1 ring-flag-green/30" : "border-border",
                  )}
                >
                  <div className="space-y-4">
                    {/* Header: Avatar, Name, LSK info */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className={cn(
                          "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-md",
                          adv.avatarBg,
                        )}
                      >
                        {adv.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-display text-base font-bold text-foreground truncate">
                            {adv.name}
                          </h3>
                          {adv.verified && (
                            <span title="LSK Roll Verified Advocate">
                              <ShieldCheck className="h-4 w-4 text-flag-green shrink-0" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-medium text-muted-foreground truncate">
                          {adv.firm}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center text-gold">
                            <Star className="h-3 w-3 fill-gold mr-0.5" />
                            {adv.rating.toFixed(1)}
                          </span>
                          <span>({adv.reviewsCount} reviews)</span>
                          <span>·</span>
                          <span>{adv.experienceYears} yrs exp</span>
                        </div>
                      </div>
                    </div>

                    {/* Location & LSK Badge */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-y border-border/50 py-2.5">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-flag-red" /> {adv.county} County
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/80">
                        {adv.lskNumber}
                      </span>
                    </div>

                    {/* Practice Areas */}
                    <div className="flex flex-wrap gap-1.5">
                      {adv.practiceAreas.map((area) => (
                        <Badge
                          key={area}
                          variant="secondary"
                          className="text-[10px] font-normal px-2 py-0.5 bg-muted"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {adv.bio}
                    </p>

                    {/* Consultation Pricing */}
                    <div className="rounded-2xl bg-muted/40 p-3 text-xs space-y-1 border border-border/40">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Consultation:</span>
                        <span className="font-semibold text-foreground text-right truncate pl-2">
                          {adv.consultationFee}
                        </span>
                      </div>
                      {adv.proBono && (
                        <div className="flex items-center gap-1 text-[11px] text-flag-green font-medium">
                          <HeartHandshake className="h-3.5 w-3.5" /> Pro-Bono matters considered
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-6 pt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="rounded-full text-xs shadow-sm"
                        onClick={() => setBookingAdvocate(adv)}
                      >
                        <Calendar className="mr-1.5 h-3.5 w-3.5" /> Book Session
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs"
                        onClick={() => setViewingAdvocate(adv)}
                      >
                        View Profile
                      </Button>
                    </div>

                    <a
                      href={`https://wa.me/${adv.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                        adv.name,
                      )},%20I%20found%20your%20practice%20on%20Jua%20Katiba%20Wakili%20Hub%20and%20would%20like%20to%20consult.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-flag-green py-1 transition-colors"
                    >
                      <Phone className="h-3 w-3" /> Quick WhatsApp / Call {adv.phone}
                    </a>
                  </div>
                </Card>
              ))}
            </div>

            {filteredAdvocates.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                <Scale className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <h3 className="mt-3 font-display text-lg font-semibold">No advocates match your filters</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting the practice area, selecting "All 47 Counties", or resetting your search.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedArea("all");
                    setSelectedCounty("all");
                    setSelectedMode("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 rounded-full"
                >
                  Reset all filters
                </Button>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: CLIENT CASE BOARD */}
          <TabsContent value="client-requests" className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 card-elevated">
              <div>
                <h2 className="font-display text-xl font-bold">Public Legal Assistance Desk</h2>
                <p className="mt-1 text-xs text-muted-foreground max-w-xl">
                  Citizens post briefs when they need representation for land successions, arbitrary
                  arrests, employment disputes, or constitutional rights. Licensed advocates review
                  these briefs and offer legal assistance.
                </p>
              </div>
              <Button
                className="rounded-full shadow-md shrink-0"
                onClick={() => setPostRequestModalOpen(true)}
              >
                <Plus className="mr-1.5 h-4 w-4" /> Post Your Legal Issue
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {clientRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 card-elevated"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-medium">
                        {req.category}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{req.createdAt}</span>
                    </div>

                    <h3 className="font-display text-base font-bold text-foreground">
                      {req.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {req.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/50 pt-3">
                      <div className="flex items-center justify-between">
                        <span>County:</span>
                        <span className="font-medium text-foreground">{req.county}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Urgency:</span>
                        <span className="font-medium text-flag-red">{req.urgency}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Budget / Terms:</span>
                        <span className="font-medium text-foreground">{req.budget}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Client:</span>
                        <span className="font-medium text-foreground">{req.clientName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border/50 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full text-xs text-flag-green border-flag-green/40 hover:bg-flag-green/10"
                      onClick={() => {
                        toast.success(
                          `Request details unlocked. You can reach out directly regarding: "${req.title}".`,
                        );
                      }}
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" /> Respond as Advocate ({req.responsesCount} responses)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: FOR LEGAL PRACTITIONERS / MARKETING INFO */}
          <TabsContent value="for-lawyers" className="pt-6 space-y-8">
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 card-elevated">
              <div className="max-w-3xl">
                <div className="text-xs font-semibold uppercase tracking-widest text-flag-green">
                  Practitioner Network
                </div>
                <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                  Market Your Practice to Citizens Who Care About the Law
                </h2>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Thousands of Kenyans visit Jua Katiba every month to understand their fundamental
                  rights, devolution, court structures, and land laws. When they recognize their
                  legal need, Jua Katiba Wakili Hub connects them directly with qualified,
                  licensed Advocates of the High Court of Kenya.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4 border border-border/50">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-flag-green/10 text-flag-green">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm">Targeted Client Inflow</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Connect with citizens who already understand basic legal principles and are
                        actively looking for retainers, land transactions, and courtroom defense.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4 border border-border/50">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm">Establish LSK Authority</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Showcase your High Court roll number, notable petitions, specialized areas
                        of practice, and thought leadership in your home county.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4 border border-border/50">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm">Direct Contact Channels</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        No middleman fees. Clients connect directly with your chambers via phone,
                        WhatsApp, email, or your office booking link.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4 border border-border/50">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-flag-red/10 text-flag-red">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm">Pro-Bono & Public Good</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Easily identify deserving public interest litigation and civic cases to
                        fulfill your annual pro-bono aspirations and defend the Katiba.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center gap-4">
                  <Button
                    size="lg"
                    className="rounded-full shadow-md bg-flag-green hover:bg-flag-green/90 text-white"
                    onClick={() => setRegisterModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Your Advocate Profile Now
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Free directory listing for licensed advocates holding valid LSK practicing certificates.
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* DIALOG 1: BOOK A CONSULTATION */}
      <Dialog open={!!bookingAdvocate} onOpenChange={(open) => !open && setBookingAdvocate(null)}>
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Book a Consultation with {bookingAdvocate?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {bookingAdvocate?.firm} · {bookingAdvocate?.county} County · Fee:{" "}
              {bookingAdvocate?.consultationFee}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="clientName" className="text-xs">
                  Your Full Name *
                </Label>
                <Input
                  id="clientName"
                  placeholder="e.g. Wambui Njeri"
                  value={bookingForm.clientName}
                  onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="clientPhone" className="text-xs">
                  Phone / WhatsApp *
                </Label>
                <Input
                  id="clientPhone"
                  placeholder="+254 7XX XXX XXX"
                  value={bookingForm.clientPhone}
                  onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="clientEmail" className="text-xs">
                Email Address (Optional)
              </Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="name@example.com"
                value={bookingForm.clientEmail}
                onChange={(e) => setBookingForm({ ...bookingForm, clientEmail: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="consultationMode" className="text-xs">
                  Preferred Format
                </Label>
                <Select
                  value={bookingForm.consultationMode}
                  onValueChange={(val) =>
                    setBookingForm({ ...bookingForm, consultationMode: val })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Virtual Video Call (Google Meet / Zoom)</SelectItem>
                    <SelectItem value="in-person">In-Person at Chambers</SelectItem>
                    <SelectItem value="phone">Direct Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="preferredDate" className="text-xs">
                  Preferred Date
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={bookingForm.preferredDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="issueSummary" className="text-xs">
                Brief Description of Your Legal Issue
              </Label>
              <Textarea
                id="issueSummary"
                placeholder="Describe your legal situation (e.g. land succession, employment contract review, police bail, or constitutional petition)..."
                rows={3}
                value={bookingForm.issueSummary}
                onChange={(e) => setBookingForm({ ...bookingForm, issueSummary: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setBookingAdvocate(null)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full text-xs shadow-md">
                Confirm Consultation Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: ADVOCATE FULL PROFILE VIEW */}
      <Dialog open={!!viewingAdvocate} onOpenChange={(open) => !open && setViewingAdvocate(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl">
          {viewingAdvocate && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-md",
                    viewingAdvocate.avatarBg,
                  )}
                >
                  {viewingAdvocate.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {viewingAdvocate.name}
                    </h2>
                    {viewingAdvocate.verified && (
                      <Badge className="bg-flag-green/10 text-flag-green border-none text-[10px]">
                        LSK Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {viewingAdvocate.title} · {viewingAdvocate.firm}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    {viewingAdvocate.lskNumber}
                  </p>
                </div>
              </div>

              {/* Quick Details */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-muted/40 p-4 text-xs border border-border/50">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Location</span>
                  <span className="font-medium text-foreground">
                    {viewingAdvocate.officeLocation} ({viewingAdvocate.county} County)
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Experience</span>
                  <span className="font-medium text-foreground">
                    {viewingAdvocate.experienceYears} Years Post-Admission
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Consultation Fee</span>
                  <span className="font-medium text-foreground">
                    {viewingAdvocate.consultationFee}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Languages</span>
                  <span className="font-medium text-foreground">
                    {viewingAdvocate.languages.join(", ")}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-display font-semibold text-sm">Professional Background</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {viewingAdvocate.bio}
                </p>
              </div>

              {/* Notable Matters */}
              {viewingAdvocate.notableMatters.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-sm">
                    Notable Cases & Track Record
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {viewingAdvocate.notableMatters.map((matter, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-flag-green shrink-0 mt-0.5" />
                        <span>{matter}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practice Areas */}
              <div>
                <h3 className="font-display font-semibold text-sm">Areas of Practice</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {viewingAdvocate.practiceAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60">
                <a
                  href={`tel:${viewingAdvocate.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5" /> {viewingAdvocate.phone}
                </a>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs flex-1 sm:flex-initial"
                    onClick={() => setViewingAdvocate(null)}
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full text-xs flex-1 sm:flex-initial shadow-md"
                    onClick={() => {
                      setBookingAdvocate(viewingAdvocate);
                      setViewingAdvocate(null);
                    }}
                  >
                    <Calendar className="mr-1.5 h-3.5 w-3.5" /> Book Consultation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: LAWYER REGISTRATION & MARKETING */}
      <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              List Your Law Practice on Wakili Hub
            </DialogTitle>
            <DialogDescription className="text-xs">
              Market your legal practice to civic learners across all 47 Kenyan counties.
              Directly connect with prospective clients seeking constitutional, land, civil and
              commercial counsel.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLawyerRegister} className="space-y-4 pt-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="advName" className="text-xs">
                  Advocate Full Name *
                </Label>
                <Input
                  id="advName"
                  placeholder="e.g. Adv. Wangari Gitau"
                  value={lawyerForm.name}
                  onChange={(e) => setLawyerForm({ ...lawyerForm, name: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="lskNumber" className="text-xs">
                  LSK Admission / Roll No. *
                </Label>
                <Input
                  id="lskNumber"
                  placeholder="e.g. P.105/18921/20"
                  value={lawyerForm.lskNumber}
                  onChange={(e) => setLawyerForm({ ...lawyerForm, lskNumber: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="firm" className="text-xs">
                  Law Firm / Chambers Name *
                </Label>
                <Input
                  id="firm"
                  placeholder="e.g. Gitau & Co. Advocates"
                  value={lawyerForm.firm}
                  onChange={(e) => setLawyerForm({ ...lawyerForm, firm: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="county" className="text-xs">
                  Primary County *
                </Label>
                <Select
                  value={lawyerForm.county}
                  onValueChange={(val) => setLawyerForm({ ...lawyerForm, county: val })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kenyanCounties.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c} County
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="officeLocation" className="text-xs">
                Physical Office Address / Building
              </Label>
              <Input
                id="officeLocation"
                placeholder="e.g. 4th Floor, Rehema House, Standard St, Nairobi CBD"
                value={lawyerForm.officeLocation}
                onChange={(e) => setLawyerForm({ ...lawyerForm, officeLocation: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="primaryArea" className="text-xs">
                  Primary Practice Area *
                </Label>
                <Select
                  value={lawyerForm.primaryArea}
                  onValueChange={(val: PracticeArea) =>
                    setLawyerForm({ ...lawyerForm, primaryArea: val })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allPracticeAreas.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="experienceYears" className="text-xs">
                  Years of Experience
                </Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min={1}
                  max={50}
                  value={lawyerForm.experienceYears}
                  onChange={(e) =>
                    setLawyerForm({ ...lawyerForm, experienceYears: Number(e.target.value) })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="consultationFee" className="text-xs">
                  Consultation Fee Description
                </Label>
                <Input
                  id="consultationFee"
                  placeholder="e.g. KSh 3,000 / 30 min (or Free 15-min call)"
                  value={lawyerForm.consultationFee}
                  onChange={(e) => setLawyerForm({ ...lawyerForm, consultationFee: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="languages" className="text-xs">
                  Languages Spoken
                </Label>
                <Input
                  id="languages"
                  placeholder="e.g. English, Swahili, Kikuyu"
                  value={lawyerForm.languages}
                  onChange={(e) => setLawyerForm({ ...lawyerForm, languages: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs">
                  Official Phone / WhatsApp *
                </Label>
                <Input
                  id="phone"
                  placeholder="+254 7XX XXX XXX"
                  value={lawyerForm.phone}
                  onChange={(e) => setLawyerForm({ ...lawyerForm, phone: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="advocate@chambers.co.ke"
                  value={lawyerForm.email}
                  onChange={(e) => setLawyerForm({ ...lawyerForm, email: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="bio" className="text-xs">
                Professional Bio & Pitch to Clients
              </Label>
              <Textarea
                id="bio"
                placeholder="Highlight your court litigation background, dispute resolution focus, and client philosophy..."
                rows={3}
                value={lawyerForm.bio}
                onChange={(e) => setLawyerForm({ ...lawyerForm, bio: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="notableMatters" className="text-xs">
                Notable Matters / Track Record (One per line)
              </Label>
              <Textarea
                id="notableMatters"
                placeholder="e.g. Secured landmark bail order in High Court Petition 12 of 2024&#10;Arbitrated KSh 15M commercial joint venture dispute&#10;Over 100 successful land title transfer completions"
                rows={2}
                value={lawyerForm.notableMatters}
                onChange={(e) => setLawyerForm({ ...lawyerForm, notableMatters: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setRegisterModalOpen(false)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full text-xs bg-flag-green hover:bg-flag-green/90 text-white shadow-md"
              >
                Publish Advocate Profile
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: POST A LEGAL NEED (FOR CLIENTS) */}
      <Dialog open={postRequestModalOpen} onOpenChange={setPostRequestModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Post a Legal Brief</DialogTitle>
            <DialogDescription className="text-xs">
              Explain the legal assistance you need. Licensed advocates on Jua Katiba will review
              your brief and reach out to offer representation or legal counsel.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleClientRequestSubmit} className="space-y-4 pt-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="clientReqName" className="text-xs">
                  Your Name / Alias
                </Label>
                <Input
                  id="clientReqName"
                  placeholder="e.g. Peter M."
                  value={clientRequestForm.clientName}
                  onChange={(e) =>
                    setClientRequestForm({ ...clientRequestForm, clientName: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="clientReqCounty" className="text-xs">
                  County of Legal Matter
                </Label>
                <Select
                  value={clientRequestForm.county}
                  onValueChange={(val) =>
                    setClientRequestForm({ ...clientRequestForm, county: val })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kenyanCounties.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c} County
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="clientReqCategory" className="text-xs">
                Legal Category
              </Label>
              <Select
                value={clientRequestForm.category}
                onValueChange={(val: PracticeArea) =>
                  setClientRequestForm({ ...clientRequestForm, category: val })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allPracticeAreas.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="clientReqTitle" className="text-xs">
                Brief Headline *
              </Label>
              <Input
                id="clientReqTitle"
                placeholder="e.g. Succession and subdivision of 3-acre parcel in Eldoret"
                value={clientRequestForm.title}
                onChange={(e) =>
                  setClientRequestForm({ ...clientRequestForm, title: e.target.value })
                }
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="clientReqDesc" className="text-xs">
                Detailed Summary of Your Case *
              </Label>
              <Textarea
                id="clientReqDesc"
                placeholder="Provide necessary background so advocates understand what assistance or court filings are required..."
                rows={3}
                value={clientRequestForm.description}
                onChange={(e) =>
                  setClientRequestForm({ ...clientRequestForm, description: e.target.value })
                }
                required
                className="rounded-xl text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="urgency" className="text-xs">
                  Urgency
                </Label>
                <Select
                  value={clientRequestForm.urgency}
                  onValueChange={(val: ClientRequest["urgency"]) =>
                    setClientRequestForm({ ...clientRequestForm, urgency: val })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Immediate (24 hrs)">Immediate (24 hrs - Bail / Arrest)</SelectItem>
                    <SelectItem value="Within a week">Within a week</SelectItem>
                    <SelectItem value="Flexible">Flexible / Advisory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="budget" className="text-xs">
                  Budget / Terms
                </Label>
                <Input
                  id="budget"
                  placeholder="e.g. KSh 20k - 50k / Pro-bono sought"
                  value={clientRequestForm.budget}
                  onChange={(e) =>
                    setClientRequestForm({ ...clientRequestForm, budget: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPostRequestModalOpen(false)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full text-xs shadow-md">
                Submit Legal Brief
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
