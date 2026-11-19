import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Lock,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InteractiveLessonPlayer } from "@/components/learn/InteractiveLessonPlayer";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { findTrack, type Lesson, type LessonSection } from "@/data/learn-content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { getGamificationState, subscribeGamification } from "@/lib/gamification";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/$trackSlug")({
  loader: ({ params }) => {
    const track = findTrack(params.trackSlug);
    if (!track) throw notFound();
    return { trackSlug: params.trackSlug };
  },
  head: ({ loaderData }) => ({
    meta: (() => {
      const track = loaderData ? findTrack(loaderData.trackSlug) : undefined;
      if (!track) {
        return [
          { title: "Learn — Jua Katiba" },
          { name: "description", content: "Explore civic learning tracks and lessons." },
        ];
      }
      return [
        { title: `${track.title} — Learn — Jua Katiba` },
        { name: "description", content: track.desc },
        { property: "og:title", content: `${track.title} — Jua Katiba` },
        { property: "og:description", content: track.desc },
      ];
    })(),
  }),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Track not found</h1>
        <p className="mt-3 text-muted-foreground">That learning track doesn't exist.</p>
        <Link to="/learn" className="mt-6 inline-block">
          <Button className="rounded-full">Back to Learn</Button>
        </Link>
      </div>
    </SiteShell>
  ),
  component: TrackDetailPage,
});

function TrackDetailPage() {
  const { trackSlug } = Route.useParams();
  const track = findTrack(trackSlug);
  if (!track) throw notFound();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState<Record<string, Set<number>>>({});
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [gameState, setGameState] = useState(getGamificationState());
  useEffect(() => {
    return subscribeGamification(setGameState);
  }, []);

  // Auto-open active lesson if specified in URL query or hash
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const targetSlug = params.get("lesson") || window.location.hash.replace("#", "");
    if (targetSlug) {
      const found = track.lessons.find((l: Lesson) => l.slug === targetSlug);
      if (found) {
        setActiveLesson(found);
      }
    }
  }, [track.lessons]);

  const { data: progress } = useQuery({
    queryKey: ["progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("lesson_progress")
        .select("lesson_slug,completed,progress")
        .eq("user_id", user!.id);
      return new Map((data ?? []).map((d) => [d.lesson_slug, d]));
    },
  });

  const saveProgress = useMutation({
    mutationFn: async ({ slug, completed }: { slug: string; completed: boolean }) => {
      if (!user) throw new Error("Sign in to save progress");
      const { error } = await supabase.from("lesson_progress").upsert(
        { user_id: user.id, lesson_slug: slug, completed, progress: completed ? 100 : 50 },
        { onConflict: "user_id,lesson_slug" },
      );
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["progress", user?.id] });
      qc.invalidateQueries({ queryKey: ["lessons", user?.id] });
      toast.success(v.completed ? "Lesson marked complete · +10 XP" : "Marked in progress");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleSection = (lessonSlug: string, idx: number) => {
    setOpen((o) => {
      const set = new Set(o[lessonSlug] ?? []);
      if (set.has(idx)) set.delete(idx);
      else set.add(idx);
      return { ...o, [lessonSlug]: set };
    });
  };

  const done = track.lessons.filter(
    (l: Lesson) => progress?.get(l.slug)?.completed || gameState.completedLessons.includes(l.slug),
  ).length;
  const pct = Math.round((done / track.lessons.length) * 100);

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentIdx = track.lessons.findIndex((l: Lesson) => l.slug === activeLesson.slug);
    if (currentIdx >= 0 && currentIdx < track.lessons.length - 1) {
      setActiveLesson(track.lessons[currentIdx + 1]);
    } else {
      setActiveLesson(null);
    }
  };

  return (
    <SiteShell>
      {/* Interactive Lesson Player */}
      {activeLesson && (
        <InteractiveLessonPlayer
          lesson={activeLesson}
          track={track}
          onClose={() => setActiveLesson(null)}
          onNextLesson={handleNextLesson}
        />
      )}

      <section className={`relative overflow-hidden border-b border-border/60 bg-gradient-to-br ${track.color} text-white`}>
        <div className="absolute inset-0 pattern-kente opacity-15" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm text-white/85 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All tracks
          </Link>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur shadow-md">
                <track.icon className="h-8 w-8" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-white/80">Interactive Module</div>
                <h1 className="font-display text-3xl font-bold sm:text-4xl">{track.title}</h1>
              </div>
            </div>

            <Button
              onClick={() => setActiveLesson(track.lessons[0])}
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 rounded-full font-bold shadow-lg"
            >
              <Play className="mr-2 h-4 w-4 fill-current text-flag-green" />
              Start Full Module Experience
            </Button>
          </div>

          <p className="mt-5 max-w-2xl text-white/90 leading-relaxed">{track.longDesc}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">
              <BookOpen className="h-3.5 w-3.5" /> {track.lessons.length} sub-lessons
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> +{track.lessons.length * 50} XP available
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">
              <Target className="h-3.5 w-3.5" /> {done}/{track.lessons.length} complete · {pct}%
            </span>
          </div>
          <Progress value={pct} className="mt-4 h-1.5 bg-white/20" />
        </div>
      </section>

      {!user && (
        <section className="border-b border-border/60 bg-muted/40">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" /> Guest mode active · XP and progress saved locally. Sign in anytime to sync to cloud!
            </span>
            <Link to="/auth" search={{ redirect: `/learn/${track.slug}` }}>
              <Button size="sm" className="rounded-full">Sign in to sync</Button>
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {track.lessons.map((lesson: Lesson, idx: number) => {
            const p = progress?.get(lesson.slug);
            const isDone = !!p?.completed || gameState.completedLessons.includes(lesson.slug);
            const openSet = open[lesson.slug] ?? new Set<number>();

            return (
              <motion.article
                key={lesson.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                id={lesson.slug}
                className={cn(
                  "overflow-hidden rounded-3xl border bg-card card-elevated",
                  isDone ? "border-flag-green/40 bg-flag-green/[0.01]" : "border-border",
                )}
              >
                <header className="border-b border-border/60 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Sub-Lesson {idx + 1} of {track.lessons.length}
                        </span>
                        <span className="rounded bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">
                          +50 XP
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-bold sm:text-3xl text-foreground">
                        {lesson.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">{lesson.summary}</p>
                      <div className="flex flex-wrap gap-2 text-xs pt-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                          <Clock className="h-3 w-3" /> {lesson.duration}
                        </span>
                        <span className="rounded-full bg-muted px-2.5 py-1">{lesson.level}</span>
                        {lesson.articles.map((a: string) => (
                          <span key={a} className="rounded-full bg-flag-green/10 px-2.5 py-1 font-medium text-flag-green">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0 pt-2 sm:pt-0">
                      <Button
                        onClick={() => setActiveLesson(lesson)}
                        className="rounded-full px-5 font-semibold text-xs shadow-md gap-1.5 hover:scale-105 transition-transform"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" /> Study Interactive Lesson
                      </Button>

                      {isDone && (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-flag-green/10 px-3 py-1 text-xs font-semibold text-flag-green">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Mastered
                        </span>
                      )}
                    </div>
                  </div>
                </header>

                <div className="divide-y divide-border/60">
                  {lesson.sections.map((section: LessonSection, sIdx: number) => {
                    const isOpen = openSet.has(sIdx);
                    return (
                      <div key={sIdx}>
                        <button
                          onClick={() => toggleSection(lesson.slug, sIdx)}
                          className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-muted/40 sm:px-8"
                        >
                          <span className="font-display font-semibold text-sm sm:text-base">{section.heading}</span>
                          <ChevronDown
                            className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-8">
                                {section.body}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border/60 bg-muted/30 p-6 sm:p-8">
                  <div className="text-xs font-semibold uppercase tracking-widest text-flag-green">Key takeaways</div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {lesson.takeaways.map((t: string) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-flag-green" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button
                      onClick={() => setActiveLesson(lesson)}
                      className="rounded-full text-xs font-semibold gap-1.5"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" /> Open in Interactive Mode
                    </Button>

                    <Button
                      onClick={() => saveProgress.mutate({ slug: lesson.slug, completed: !isDone })}
                      disabled={!user || saveProgress.isPending}
                      variant={isDone ? "outline" : "ghost"}
                      size="sm"
                      className="rounded-full text-xs"
                    >
                      {isDone ? (
                        <>
                          <Circle className="mr-1.5 h-3.5 w-3.5" /> Mark not completed
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Mark completed
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 card-elevated">
          <div>
            <div className="font-display text-lg font-semibold">Test your civic reflex with daily challenges</div>
            <p className="text-sm text-muted-foreground">Take a daily quiz and earn XP toward your Katiba streak.</p>
          </div>
          <Link to="/quizzes">
            <Button className="rounded-full">Go to daily quizzes</Button>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
