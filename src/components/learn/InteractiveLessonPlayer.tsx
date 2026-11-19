import React, { useState, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Globe2,
  HelpCircle,
  MessageSquare,
  Play,
  RotateCcw,
  Scale,
  Send,
  Share2,
  Shield,
  Sparkles,
  Square,
  Trophy,
  Volume2,
  VolumeX,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { type Lesson, type Track } from "@/data/learn-content";
import { getLessonGamification, type LessonGamification } from "@/data/lesson-gamification-data";
import { askWakiliAI, type ChatMessage } from "@/lib/civic-ai-service";
import {
  addXp,
  getNextRankProgress,
  getRankForXp,
  playChimeSound,
  subscribeGamification,
  getGamificationState,
} from "@/lib/gamification";
import { cn } from "@/lib/utils";

interface InteractiveLessonPlayerProps {
  lesson: Lesson;
  track: Track;
  onClose: () => void;
  onNextLesson?: () => void;
}

type LanguageMode = "official" | "simple" | "sheng";

export function InteractiveLessonPlayer({
  lesson,
  track,
  onClose,
  onNextLesson,
}: InteractiveLessonPlayerProps) {
  const gamData: LessonGamification = useMemo(
    () => getLessonGamification(lesson.slug, lesson.title),
    [lesson.slug, lesson.title],
  );

  // Steps:
  // 0: Intro & Hook
  // 1 .. sections.length: Section slides
  // sections.length + 1: Dilemma ("Wewe Ni Jaji")
  // sections.length + 2: Knowledge Check Quiz
  // sections.length + 3: Completion & XP celebration
  const totalSteps = lesson.sections.length + 4;
  const [currentStep, setCurrentStep] = useState(0);

  const [langMode, setLangMode] = useState<LanguageMode>("simple");
  const [sessionXpEarned, setSessionXpEarned] = useState(0);

  // Dilemma state
  const [selectedDilemmaOption, setSelectedDilemmaOption] = useState<string | null>(null);
  const [dilemmaAnswered, setDilemmaAnswered] = useState(false);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Text to Speech
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Wakili AI Drawer
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Habari! I am **Wakili AI**, your civic companion for **${lesson.title}**. Ask me to explain anything in Sheng, provide real-world examples, or clarify how ${lesson.articles.join(", ")} protect you!`,
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Gamification state
  const [gameState, setGameState] = useState(getGamificationState());
  useEffect(() => {
    return subscribeGamification(setGameState);
  }, []);

  // Stop speech synthesis on unmount or slide change
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep]);

  // Voice narration helper
  const handleToggleSpeech = (textToRead: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick English or regional voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith("en-KE") || v.lang.startsWith("en-ZA") || v.lang.startsWith("en-GB")) ||
      voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    playChimeSound("click");
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    playChimeSound("click");
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  // Dilemma choice handler
  const handleChooseDilemma = (optionId: string) => {
    if (dilemmaAnswered) return;
    setSelectedDilemmaOption(optionId);
    setDilemmaAnswered(true);

    const chosen = gamData.dilemma.options.find((o) => o.id === optionId);
    if (chosen?.isCorrect) {
      playChimeSound("dilemma");
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
      const pts = chosen.points || 25;
      setSessionXpEarned((x) => x + pts);
      addXp(pts, lesson.slug);
      toast.success(`Haki Imelindwa! +${pts} XP earned`);
    } else {
      playChimeSound("click");
    }
  };

  // Quiz submission handler
  const handleAnswerQuiz = (optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizSelected(optionIdx);
    setQuizSubmitted(true);

    const currentQ = gamData.quiz[quizIndex];
    if (optionIdx === currentQ.answer) {
      playChimeSound("success");
      setQuizScore((s) => s + 1);
      setSessionXpEarned((x) => x + 15);
      addXp(15, lesson.slug);
      toast.success("Correct answer! +15 XP");
    } else {
      playChimeSound("click");
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < gamData.quiz.length - 1) {
      setQuizIndex((i) => i + 1);
      setQuizSelected(null);
      setQuizSubmitted(false);
    } else {
      // Completed lesson!
      handleCompleteLesson();
    }
  };

  // Lesson Final Completion
  const handleCompleteLesson = () => {
    playChimeSound("complete");
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    const finalBonus = 30;
    setSessionXpEarned((x) => x + finalBonus);
    const { unlockedBadge } = addXp(finalBonus, lesson.slug);
    if (unlockedBadge) {
      toast.success(`New Badge Unlocked: ${unlockedBadge.name}! ${unlockedBadge.icon}`);
    }
    setCurrentStep(totalSteps - 1);
  };

  // Send AI Question
  const handleSendAi = async (promptText?: string) => {
    const text = promptText || aiInput;
    if (!text.trim() || aiLoading) return;

    const newMsgs: ChatMessage[] = [...aiMessages, { role: "user", content: text }];
    setAiMessages(newMsgs);
    if (!promptText) setAiInput("");
    setAiLoading(true);

    try {
      const reply = await askWakiliAI(newMsgs, {
        title: lesson.title,
        articles: lesson.articles,
        summary: lesson.summary,
      });

      setAiMessages([...newMsgs, { role: "assistant", content: reply }]);
    } catch {
      setAiMessages([
        ...newMsgs,
        {
          role: "assistant",
          content: "Pole sana! I had trouble reaching the network. But remember: your rights under the Constitution remain supreme!",
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const currentSection =
    currentStep >= 1 && currentStep <= lesson.sections.length
      ? lesson.sections[currentStep - 1]
      : null;

  const currentRankInfo = getNextRankProgress(gameState.xp);

  // Share achievement
  const handleShare = () => {
    const text = `I just mastered "${lesson.title}" on JuaKatiba AI! 🇰🇪 Empowering Kenyans with gamified constitutional literacy. Check it out at juakatiba.ke!`;
    if (navigator.share) {
      navigator.share({ title: "Jua Katiba AI", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Achievement copied to clipboard! Share on WhatsApp or X.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md">
      {/* Top Header Bar */}
      <header className="border-b border-border/70 bg-card/80 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
              title="Close lesson"
            >
              <X className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-flag-green">
                  {track.title}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground font-mono">
                  Card {currentStep + 1} of {totalSteps}
                </span>
              </div>
              <h2 className="font-display text-sm font-bold sm:text-base text-foreground line-clamp-1">
                {lesson.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Session XP */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
              <Sparkles className="h-3.5 w-3.5 text-gold animate-pulse" />
              <span>+{sessionXpEarned} XP</span>
            </div>

            {/* Wakili AI Sheet Trigger */}
            <Sheet open={isAiOpen} onOpenChange={setIsAiOpen}>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-flag-green/40 bg-flag-green/5 text-flag-green hover:bg-flag-green/10 text-xs font-semibold"
                >
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Ask</span> Wakili AI
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
                <SheetHeader className="border-b p-4 bg-muted/40">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-flag-green text-white shadow-sm">
                      <Scale className="h-4 w-4" />
                    </div>
                    <div>
                      <SheetTitle className="text-base font-display">Wakili AI Copilot</SheetTitle>
                      <p className="text-xs text-muted-foreground">
                        Your real-time Kenyan civic tutor for {lesson.title}
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                {/* AI Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
                  {aiMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-2xl p-3.5 leading-relaxed max-w-[88%]",
                        m.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground font-medium rounded-tr-none"
                          : "mr-auto bg-muted/70 text-foreground border border-border/60 rounded-tl-none",
                      )}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="mr-auto rounded-2xl bg-muted/70 p-3.5 text-xs text-muted-foreground animate-pulse">
                      Wakili AI is citing articles...
                    </div>
                  )}
                </div>

                {/* Quick Prompts */}
                <div className="border-t border-border/50 p-2.5 bg-muted/20 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSendAi("Explain this lesson in authentic Kenyan Sheng")}
                    className="rounded-full bg-card border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-flag-green transition-colors"
                  >
                    🇰🇪 Explain in Sheng
                  </button>
                  <button
                    onClick={() => handleSendAi("What should I do if police violate this right?")}
                    className="rounded-full bg-card border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-flag-green transition-colors"
                  >
                    👮 Police encounter drill
                  </button>
                  <button
                    onClick={() => handleSendAi("Give me a real landmark court case on this topic")}
                    className="rounded-full bg-card border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-flag-green transition-colors"
                  >
                    ⚖️ Real court precedent
                  </button>
                </div>

                {/* AI Input */}
                <div className="border-t p-3 bg-card flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAi()}
                    placeholder="Ask Wakili AI anything about this lesson..."
                    className="flex-1 rounded-full border border-border bg-muted/50 px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-flag-green"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSendAi()}
                    disabled={!aiInput.trim() || aiLoading}
                    className="rounded-full shrink-0 h-8 w-8"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mx-auto mt-2 max-w-5xl">
          <Progress
            value={Math.round(((currentStep + 1) / totalSteps) * 100)}
            className="h-1.5 bg-muted"
          />
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Language Mode Selector & Audio Bar */}
          {currentStep < totalSteps - 1 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/60 p-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground px-2">
                  Explain in:
                </span>
                <div className="flex rounded-full bg-muted p-0.5 text-xs">
                  <button
                    onClick={() => setLangMode("simple")}
                    className={cn(
                      "rounded-full px-3 py-1 font-medium transition-colors",
                      langMode === "simple"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    🗣️ Plain English
                  </button>
                  <button
                    onClick={() => setLangMode("sheng")}
                    className={cn(
                      "rounded-full px-3 py-1 font-medium transition-colors",
                      langMode === "sheng"
                        ? "bg-flag-green text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    🇰🇪 Sheng / Mtaa
                  </button>
                  <button
                    onClick={() => setLangMode("official")}
                    className={cn(
                      "rounded-full px-3 py-1 font-medium transition-colors",
                      langMode === "official"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    🏛️ Legal Katiba
                  </button>
                </div>
              </div>

              {/* Text-To-Speech Listen Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  let textToSpeak = "";
                  if (currentStep === 0) {
                    textToSpeak = `${lesson.title}. ${langMode === "sheng" ? gamData.shengSummary : gamData.simpleSummary}`;
                  } else if (currentSection) {
                    textToSpeak = `${currentSection.heading}. ${currentSection.body}`;
                  } else if (currentStep === lesson.sections.length + 1) {
                    textToSpeak = `${gamData.dilemma.scenarioTitle}. ${gamData.dilemma.scenario}. ${gamData.dilemma.question}`;
                  }
                  handleToggleSpeech(textToSpeak);
                }}
                className={cn(
                  "rounded-full text-xs gap-1.5",
                  isSpeaking && "border-flag-red text-flag-red animate-pulse",
                )}
              >
                {isSpeaking ? (
                  <>
                    <Square className="h-3 w-3 fill-current" /> Stop Audio
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-flag-green" /> Sikiza Katiba
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Animated Slide Content */}
          <AnimatePresence mode="wait">
            {/* SLIDE 0: Overview & Hook */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-flag-green/30 bg-gradient-to-br from-flag-green/10 via-card to-card p-6 sm:p-8 card-elevated">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-flag-green">
                    <Sparkles className="h-4 w-4" /> The Citizen's Foundation
                  </div>
                  <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl text-foreground">
                    {lesson.title}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">{lesson.summary}</p>

                  {/* Constitutional Articles */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {lesson.articles.map((art) => (
                      <span
                        key={art}
                        className="rounded-full bg-flag-green/15 px-3 py-1 text-xs font-semibold text-flag-green"
                      >
                        {art}
                      </span>
                    ))}
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {lesson.duration} study
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {lesson.level}
                    </span>
                  </div>

                  {/* Dynamic Explanation based on Language Mode */}
                  <div className="mt-6 rounded-2xl border border-border/80 bg-background/80 p-5 shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                      <span>
                        {langMode === "sheng"
                          ? "🇰🇪 Form ya Mtaa (Sheng):"
                          : langMode === "official"
                            ? "🏛️ Constitutional Architecture:"
                            : "🗣️ Plain Language Summary:"}
                      </span>
                      <span className="text-[10px] text-flag-green font-normal">
                        Click 'Sheng' or 'Legal' above to change
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {langMode === "sheng"
                        ? gamData.shengSummary
                        : langMode === "official"
                          ? lesson.sections[0]?.body || lesson.summary
                          : gamData.simpleSummary}
                    </p>
                  </div>

                  {/* Real World Impact Callout */}
                  <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/5 p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Why This Matters To You in Kenya</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {gamData.realWorldImpact}
                      </p>
                    </div>
                  </div>

                  {/* Landmark Case Callout */}
                  {gamData.keyCase && (
                    <div className="mt-4 rounded-2xl border border-border/70 bg-muted/40 p-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-flag-green mb-1">
                        <Scale className="h-3.5 w-3.5" /> Landmark Kenyan Precedent:
                      </div>
                      <h5 className="text-xs font-bold text-foreground">
                        {gamData.keyCase.title} ({gamData.keyCase.citation})
                      </h5>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {gamData.keyCase.takeaway}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SLIDES 1 to N: Bite-Sized Content Cards */}
            {currentSection && (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 card-elevated">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-mono font-medium">
                      Concept {currentStep} of {lesson.sections.length}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {lesson.title}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                    {currentSection.heading}
                  </h3>

                  {/* Body Content */}
                  <div className="mt-4 text-base leading-relaxed text-foreground/90 space-y-4">
                    <p className="bg-muted/30 p-4 rounded-2xl border border-border/60">
                      {currentSection.body}
                    </p>

                    {langMode === "sheng" && (
                      <div className="rounded-2xl border border-flag-green/40 bg-flag-green/5 p-4 text-sm text-foreground">
                        <div className="text-xs font-bold text-flag-green uppercase tracking-wider mb-1">
                          🇰🇪 Ufafanuzi wa Mtaa:
                        </div>
                        {gamData.shengSummary}
                      </div>
                    )}
                  </div>

                  {/* Practical Mwananchi Tip */}
                  <div className="mt-6 rounded-2xl border border-border/80 bg-background p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-flag-green shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed text-muted-foreground">
                      <strong className="text-foreground font-semibold">Takeaway: </strong>
                      {lesson.takeaways[(currentStep - 1) % lesson.takeaways.length] ||
                        "Defend the Constitution and know your rights."}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SLIDE: Interactive Dilemma ("Wewe Ni Jaji" / Citizen In The Hotseat) */}
            {currentStep === lesson.sections.length + 1 && (
              <motion.div
                key="step-dilemma"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-gold/10 via-card to-card p-6 sm:p-8 card-elevated">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold">
                      <Trophy className="h-3.5 w-3.5" /> Wewe Ni Jaji: Case Challenge
                    </span>
                    <span className="text-xs font-bold text-gold">+25 XP</span>
                  </div>

                  <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold text-foreground">
                    {gamData.dilemma.scenarioTitle}
                  </h3>

                  <div className="mt-2 text-xs font-medium text-muted-foreground">
                    Involving: <span className="text-foreground">{gamData.dilemma.character}</span>
                  </div>

                  {/* Scenario Narrative Box */}
                  <div className="mt-4 rounded-2xl border border-border bg-background p-5 text-sm leading-relaxed text-foreground shadow-inner">
                    {gamData.dilemma.scenario}
                  </div>

                  {/* The Question */}
                  <div className="mt-5 text-sm font-bold text-foreground">
                    ⚖️ {gamData.dilemma.question}
                  </div>

                  {/* Interactive Options */}
                  <div className="mt-4 space-y-3">
                    {gamData.dilemma.options.map((option) => {
                      const isSelected = selectedDilemmaOption === option.id;
                      return (
                        <button
                          key={option.id}
                          disabled={dilemmaAnswered}
                          onClick={() => handleChooseDilemma(option.id)}
                          className={cn(
                            "w-full rounded-2xl border p-4 text-left transition-all duration-200 select-none text-xs sm:text-sm font-medium",
                            !dilemmaAnswered &&
                              "hover:border-primary/80 hover:bg-muted/40 active:scale-[0.99]",
                            dilemmaAnswered &&
                              option.isCorrect &&
                              "border-flag-green bg-flag-green/10 text-flag-green ring-2 ring-flag-green/30",
                            dilemmaAnswered &&
                              isSelected &&
                              !option.isCorrect &&
                              "border-flag-red bg-flag-red/10 text-flag-red ring-2 ring-flag-red/30",
                            !isSelected && dilemmaAnswered && !option.isCorrect && "opacity-50 border-border",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold uppercase",
                                dilemmaAnswered && option.isCorrect
                                  ? "bg-flag-green text-white"
                                  : dilemmaAnswered && isSelected && !option.isCorrect
                                    ? "bg-flag-red text-white"
                                    : "bg-muted text-muted-foreground",
                              )}
                            >
                              {option.id}
                            </div>
                            <span className="flex-1">{option.text}</span>
                          </div>

                          {/* Reveal feedback */}
                          {dilemmaAnswered && isSelected && (
                            <div className="mt-3 border-t border-border/50 pt-2 text-xs font-normal leading-relaxed">
                              {option.explanation}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {dilemmaAnswered && (
                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                      <div className="text-xs text-muted-foreground">
                        Constitutional Anchor: <strong className="text-foreground">{gamData.dilemma.articleAnchor}</strong>
                      </div>
                      <Button onClick={handleNext} className="rounded-full text-xs">
                        Continue to Knowledge Check <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SLIDE: Knowledge Check Mini-Quiz */}
            {currentStep === lesson.sections.length + 2 && (
              <motion.div
                key={`step-quiz-${quizIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 card-elevated">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Zap className="h-3.5 w-3.5" /> Katiba Check: Question {quizIndex + 1} of{" "}
                      {gamData.quiz.length}
                    </span>
                    <span className="text-xs font-bold text-gold">+15 XP each</span>
                  </div>

                  <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold text-foreground">
                    {gamData.quiz[quizIndex].q}
                  </h3>

                  <div className="mt-6 space-y-3">
                    {gamData.quiz[quizIndex].options.map((opt, oIdx) => {
                      const isCorrect = oIdx === gamData.quiz[quizIndex].answer;
                      const isChosen = quizSelected === oIdx;

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleAnswerQuiz(oIdx)}
                          className={cn(
                            "w-full rounded-2xl border p-4 text-left transition-all duration-200 text-xs sm:text-sm font-medium",
                            !quizSubmitted &&
                              "hover:border-primary/80 hover:bg-muted/40 active:scale-[0.99]",
                            quizSubmitted &&
                              isCorrect &&
                              "border-flag-green bg-flag-green/10 text-flag-green font-semibold",
                            quizSubmitted &&
                              isChosen &&
                              !isCorrect &&
                              "border-flag-red bg-flag-red/10 text-flag-red",
                            quizSubmitted && !isChosen && !isCorrect && "opacity-50 border-border",
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="h-4 w-4 text-flag-green shrink-0" />
                            )}
                            {quizSubmitted && isChosen && !isCorrect && (
                              <XCircle className="h-4 w-4 text-flag-red shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-5 rounded-2xl bg-muted/60 p-4 border border-border/80">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        <strong className="text-foreground">Why: </strong>
                        {gamData.quiz[quizIndex].explain}
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={handleNextQuizQuestion}
                          className="rounded-full text-xs"
                        >
                          {quizIndex < gamData.quiz.length - 1 ? "Next Question" : "Complete Lesson!"}
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SLIDE: Completion Celebration & Mastery Screen */}
            {currentStep === totalSteps - 1 && (
              <motion.div
                key="step-victory"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-flag-green/40 bg-gradient-to-br from-flag-green/15 via-card to-card p-6 sm:p-10 text-center card-elevated">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-flag-green text-white shadow-xl animate-bounce">
                    <Trophy className="h-10 w-10" />
                  </div>

                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-flag-green/15 px-3 py-1 text-xs font-bold text-flag-green uppercase tracking-wider">
                    Lesson Mastered!
                  </div>

                  <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl text-foreground">
                    Kongole! You Conquered {lesson.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    You have strengthened your constitutional awareness and unlocked vital civic power.
                  </p>

                  {/* Rewards Grid */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                    <div className="rounded-2xl border border-border/70 bg-card p-4">
                      <div className="text-xs text-muted-foreground">XP Gained</div>
                      <div className="font-display text-2xl font-black text-gold">
                        +{sessionXpEarned} XP
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-4">
                      <div className="text-xs text-muted-foreground">Civic Streak</div>
                      <div className="font-display text-2xl font-black text-flag-red flex items-center justify-center gap-1">
                        <Flame className="h-5 w-5 fill-current" /> {gameState.streak}d
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/70 bg-card p-4">
                      <div className="text-xs text-muted-foreground">Civic Rank</div>
                      <div className="font-display text-base font-bold text-flag-green truncate">
                        {currentRankInfo.currentRank.badge} {currentRankInfo.currentRank.title}
                      </div>
                    </div>
                  </div>

                  {/* Rank Progress Bar */}
                  {currentRankInfo.nextRank && (
                    <div className="mt-6 max-w-md mx-auto text-left rounded-2xl bg-muted/40 p-4 border border-border/60">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Rank Progress</span>
                        <span>
                          {gameState.xp} / {currentRankInfo.nextRank.minXp} XP to{" "}
                          <strong>{currentRankInfo.nextRank.title}</strong>
                        </span>
                      </div>
                      <Progress value={currentRankInfo.progressPct} className="h-2" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    {onNextLesson ? (
                      <Button
                        onClick={onNextLesson}
                        size="lg"
                        className="rounded-full w-full sm:w-auto px-6 font-semibold"
                      >
                        Next Lesson <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={onClose}
                        size="lg"
                        className="rounded-full w-full sm:w-auto px-6 font-semibold"
                      >
                        Return to All Modules
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleShare}
                      className="rounded-full w-full sm:w-auto gap-2"
                    >
                      <Share2 className="h-4 w-4" /> Share Achievement
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Control Bar */}
      {currentStep < totalSteps - 1 && (
        <footer className="border-t border-border/70 bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="rounded-full text-xs"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
            </Button>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {currentStep === lesson.sections.length + 1 ? (
                <span className="font-semibold text-gold flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" /> Citizen Challenge
                </span>
              ) : currentStep === lesson.sections.length + 2 ? (
                <span className="font-semibold text-primary flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" /> Mini-Quiz
                </span>
              ) : (
                <span>
                  Card {currentStep + 1} of {totalSteps}
                </span>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleNext}
              disabled={
                (currentStep === lesson.sections.length + 1 && !dilemmaAnswered) ||
                (currentStep === lesson.sections.length + 2 && !quizSubmitted)
              }
              className="rounded-full text-xs font-semibold px-4"
            >
              {currentStep === totalSteps - 2 ? (
                "Finish"
              ) : (
                <>
                  Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
