import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Flame,
  Layers,
  Play,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { InteractiveLessonPlayer } from "@/components/learn/InteractiveLessonPlayer";
import { SiteShell } from "@/components/site/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { tracks, type Lesson, type Track } from "@/data/learn-content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  getGamificationState,
  getNextRankProgress,
  subscribeGamification,
  toggleSound,
} from "@/lib/gamification";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Jua Katiba" },
      {
        name: "description",
        content:
          "Gamified interactive micro-lessons on the Constitution of Kenya, Bill of Rights, devolution, and citizen empowerment.",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [expandedTracks, setExpandedTracks] = useState<Set<string>>(new Set(["foundations", "bill-of-rights"]));
  const [previewTakeaways, setPreviewTakeaways] = useState<Set<string>>(new Set());

  // Active Interactive Lesson Player
  const [activeLesson, setActiveLesson] = useState<{ track: Track; lesson: Lesson } | null>(null);

  // Gamification state
  const [gameState, setGameState] = useState(getGamificationState());
  useEffect(() => {
    return subscribeGamification(setGameState);
  }, []);

  const rankInfo = getNextRankProgress(gameState.xp);

  const { data: progress } = useQuery({
    queryKey: ["progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("lesson_progress")
        .select("lesson_slug,completed")
        .eq("user_id", user!.id);
      return new Set((data ?? []).filter((d) => d.completed).map((d) => d.lesson_slug));
    },
  });

  // Check URL query parameters or hash to auto-open lesson if linked directly
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const targetSlug = params.get("lesson") || window.location.hash.replace("#", "");

    if (targetSlug) {
      for (const t of tracks) {
        const found = t.lessons.find((l) => l.slug === targetSlug);
        if (found) {
          setActiveLesson({ track: t, lesson: found });
          break;
        }
      }
    }
  }, []);

  const toggleTrack = (slug: string) => {
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const toggleTakeaways = (lessonSlug: string) => {
    setPreviewTakeaways((prev) => {
      const next = new Set(prev);
      if (next.has(lessonSlug)) {
        next.delete(lessonSlug);
      } else {
        next.add(lessonSlug);
      }
      return next;
    });
  };

  const trackProgress = (t: Track) => {
    const done = t.lessons.filter(
      (l) => progress?.has(l.slug) || gameState.completedLessons.includes(l.slug),
    ).length;
    return Math.round((done / t.lessons.length) * 100);
  };

  const filteredTracks = useMemo(() => {
    if (!search.trim()) return tracks;
    const q = search.toLowerCase();
    return tracks.filter((t) => {
      const matchesTrack =
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.longDesc.toLowerCase().includes(q);
      const matchesLesson = t.lessons.some(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q) ||
          l.articles.some((a) => a.toLowerCase().includes(q)),
      );
      return matchesTrack || matchesLesson;
    });
  }, [search]);

  // When searching, auto-expand matching tracks
  const isSearching = !!search.trim();
  const effectiveExpanded = isSearching
    ? new Set(filteredTracks.map((t) => t.slug))
    : expandedTracks;

  const expandAll = () => {
    setExpandedTracks(new Set(tracks.map((t) => t.slug)));
  };

  const collapseAll = () => {
    setExpandedTracks(new Set());
  };

  const totalLessons = tracks.reduce((s, t) => s + t.lessons.length, 0);
  const completedLessons = Math.max(
    progress?.size ?? 0,
    gameState.completedLessons.length,
  );

  // Quick Start: find first uncompleted lesson
  const handleQuickStart = () => {
    for (const t of tracks) {
      for (const l of t.lessons) {
        if (!gameState.completedLessons.includes(l.slug)) {
          setActiveLesson({ track: t, lesson: l });
          return;
        }
      }
    }
    // Fallback to first lesson
    setActiveLesson({ track: tracks[0], lesson: tracks[0].lessons[0] });
  };

  // Find next lesson after current active one
  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentTrack = activeLesson.track;
    const currentIdx = currentTrack.lessons.findIndex((l) => l.slug === activeLesson.lesson.slug);

    if (currentIdx >= 0 && currentIdx < currentTrack.lessons.length - 1) {
      setActiveLesson({ track: currentTrack, lesson: currentTrack.lessons[currentIdx + 1] });
      return;
    }

    // Try next track
    const trackIdx = tracks.findIndex((t) => t.slug === currentTrack.slug);
    if (trackIdx >= 0 && trackIdx < tracks.length - 1) {
      const nextTrack = tracks[trackIdx + 1];
      setActiveLesson({ track: nextTrack, lesson: nextTrack.lessons[0] });
      return;
    }

    setActiveLesson(null);
  };

  return (
    <SiteShell>
      {/* Interactive Lesson Modal Player */}
      {activeLesson && (
        <InteractiveLessonPlayer
          lesson={activeLesson.lesson}
          track={activeLesson.track}
          onClose={() => setActiveLesson(null)}
          onNextLesson={handleNextLesson}
        />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/60 bg-hero-radial">
        <div className="absolute inset-0 pattern-kente opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-flag-green flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold" /> Gamified Civic Academy
              </div>
              <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl lg:text-6xl text-foreground">
                Don't just read the Katiba.
                <br className="hidden sm:block" />
                <span className="text-gradient-civic">Play, learn & master it.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                Transform 200+ pages of legal jargon into bite-sized, gamified micro-lessons.
                Experience real-world citizen dilemmas, toggle authentic Sheng translations, listen
                hands-free with Sikiza Katiba, and chat live with Wakili AI.
              </p>
            </div>

            {/* Quick Action Play Card */}
            <div className="w-full sm:w-auto shrink-0">
              <Button
                onClick={handleQuickStart}
                size="lg"
                className="h-14 rounded-full px-8 text-base font-bold shadow-lg shadow-flag-green/20 hover:scale-105 transition-transform"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
                Start Interactive Lesson
              </Button>
            </div>
          </div>

          {/* Gamification Live Dashboard Banner */}
          <div className="mt-8 rounded-3xl border border-border/80 bg-card/80 p-5 backdrop-blur-md shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-3xl shadow-inner">
                  {rankInfo.currentRank.badge}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Civic Rank
                    </span>
                    <span className="text-xs font-bold text-flag-green">
                      {rankInfo.currentRank.title}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {rankInfo.nextRank
                      ? `${gameState.xp} XP · ${rankInfo.nextRank.minXp - gameState.xp} XP to ${rankInfo.nextRank.title}`
                      : `${gameState.xp} XP · Maximum Rank Achieved!`}
                  </div>
                  {rankInfo.nextRank && (
                    <Progress value={rankInfo.progressPct} className="mt-2 h-1.5 w-48 sm:w-64" />
                  )}
                </div>
              </div>

              {/* Stats & Toggles */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-bold text-foreground">
                  <Flame className="h-4 w-4 text-flag-red fill-current" />
                  <span>{gameState.streak} Day Streak</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-bold text-gold">
                  <Trophy className="h-4 w-4" />
                  <span>{gameState.xp} XP</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-bold text-flag-green">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{completedLessons}/{totalLessons} Mastered</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const soundOn = toggleSound();
                    setGameState((prev) => ({ ...prev, soundEnabled: soundOn }));
                  }}
                  className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
                  title={gameState.soundEnabled ? "Mute gamification sounds" : "Enable gamification sounds"}
                >
                  {gameState.soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-flag-green" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules & Sub-lessons Explorer */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Controls Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by topic or article (e.g. Sovereignty, Bail, Article 37)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-full pl-10 pr-9 text-sm bg-card"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={effectiveExpanded.size > 0 ? collapseAll : expandAll}
              className="rounded-full text-xs"
            >
              <Layers className="mr-1.5 h-3.5 w-3.5 text-flag-green" />
              {effectiveExpanded.size > 0 ? "Collapse all" : "Expand all modules"}
            </Button>
            <div className="text-xs text-muted-foreground">
              Showing {filteredTracks.length} of {tracks.length} modules
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredTracks.map((t, i) => {
            const pct = trackProgress(t);
            const isOpen = effectiveExpanded.has(t.slug);
            const doneCount = t.lessons.filter(
              (l) => progress?.has(l.slug) || gameState.completedLessons.includes(l.slug),
            ).length;

            return (
              <motion.div
                key={t.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                className={cn(
                  "flex flex-col rounded-3xl border bg-card text-left transition-all duration-300 card-elevated",
                  isOpen
                    ? "border-flag-green/60 ring-2 ring-flag-green/15 shadow-xl"
                    : "border-border hover:border-border/80 hover:shadow-md",
                )}
              >
                {/* Module Header / Clickable Accordion Trigger */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleTrack(t.slug)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTrack(t.slug);
                    }
                  }}
                  className="group flex cursor-pointer flex-col p-6 sm:p-7 select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "grid h-13 w-13 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md transition-transform duration-300 group-hover:scale-105",
                          t.color,
                        )}
                      >
                        <t.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Module {i + 1}
                          </span>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-flag-green">
                            <BookOpen className="h-3 w-3" /> {t.lessons.length} sub-lessons
                          </span>
                        </div>
                        <h2 className="font-display text-xl font-bold sm:text-2xl text-foreground">
                          {t.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-muted/60 text-muted-foreground transition-all duration-300 group-hover:border-flag-green group-hover:text-flag-green",
                          isOpen && "bg-flag-green text-white rotate-180 border-flag-green",
                        )}
                        title={isOpen ? "Click to collapse sub-lessons" : "Click to view sub-lessons"}
                      >
                        <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {isOpen ? "Sub-lessons open" : "Click to view sub-lessons"}
                      </span>
                      {doneCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-flag-green font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> {doneCount}/{t.lessons.length} done
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-flag-green">
                        {pct > 0 ? `${pct}%` : `${t.lessons.length} parts`}
                      </span>
                    </div>
                  </div>

                  {pct > 0 && <Progress value={pct} className="mt-2.5 h-1.5" />}
                </div>

                {/* Sub-lessons Collapsible Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-border/60 bg-muted/20"
                    >
                      <div className="p-6 sm:p-7 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Sub-lessons in this module
                          </h3>
                          <Link
                            to="/learn/$trackSlug"
                            params={{ trackSlug: t.slug }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-flag-green hover:underline"
                          >
                            Full track view <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>

                        {/* List of Sub-lessons */}
                        <div className="space-y-3">
                          {t.lessons.map((lesson: Lesson, lIdx: number) => {
                            const isDone =
                              progress?.has(lesson.slug) ||
                              gameState.completedLessons.includes(lesson.slug);
                            const showingTakeaways = previewTakeaways.has(lesson.slug);

                            return (
                              <div
                                key={lesson.slug}
                                className={cn(
                                  "rounded-2xl border bg-card p-4 transition-all duration-200",
                                  isDone
                                    ? "border-flag-green/40 bg-flag-green/[0.02]"
                                    : "border-border/70 hover:border-border",
                                )}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                  <div className="space-y-1.5 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge
                                        variant="outline"
                                        className="h-5 px-1.5 text-[10px] font-mono font-medium"
                                      >
                                        Sub-lesson {lIdx + 1}
                                      </Badge>
                                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                        <Clock className="h-3 w-3" /> {lesson.duration}
                                      </span>
                                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                        {lesson.level}
                                      </span>
                                      <span className="inline-flex items-center gap-1 rounded bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">
                                        <Sparkles className="h-3 w-3" /> +50 XP
                                      </span>
                                      {isDone && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-flag-green/10 px-2 py-0.5 text-[10px] font-semibold text-flag-green">
                                          <CheckCircle2 className="h-3 w-3" /> Mastered
                                        </span>
                                      )}
                                    </div>

                                    <h4 className="font-display text-base font-semibold text-foreground">
                                      {lesson.title}
                                    </h4>

                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {lesson.summary}
                                    </p>

                                    {/* Articles */}
                                    <div className="flex flex-wrap gap-1 pt-1">
                                      {lesson.articles.map((art) => (
                                        <span
                                          key={art}
                                          className="rounded-md bg-flag-green/10 px-2 py-0.5 text-[10px] font-medium text-flag-green"
                                        >
                                          {art}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Sub-lesson Actions */}
                                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0">
                                    <Button
                                      onClick={() => setActiveLesson({ track: t, lesson })}
                                      size="sm"
                                      className="rounded-full px-4 text-xs font-semibold gap-1.5 shadow-sm hover:scale-105 transition-transform"
                                    >
                                      <Play className="h-3.5 w-3.5 fill-current" /> Study Lesson
                                    </Button>

                                    {lesson.takeaways?.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => toggleTakeaways(lesson.slug)}
                                        className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
                                      >
                                        {showingTakeaways ? "Hide takeaways" : "Key takeaways"}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Expandable Takeaways Preview */}
                                <AnimatePresence initial={false}>
                                  {showingTakeaways && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden border-t border-border/60 mt-3 pt-3"
                                    >
                                      <div className="text-[11px] font-semibold text-flag-green uppercase tracking-wider mb-1.5">
                                        Core Takeaways:
                                      </div>
                                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        {lesson.takeaways.map((takeaway, tkIdx) => (
                                          <li key={tkIdx} className="flex items-start gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-flag-green shrink-0" />
                                            <span>{takeaway}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>

                        {/* Module Footer Action */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <Button
                            onClick={() => setActiveLesson({ track: t, lesson: t.lessons[0] })}
                            className="w-full sm:w-auto rounded-full text-xs font-semibold gap-2"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            Start Module Experience ({t.lessons.length} lessons)
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTrack(t.slug)}
                            className="rounded-full text-xs text-muted-foreground hover:text-foreground"
                          >
                            Close module
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
