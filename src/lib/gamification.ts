// Gamification and Civic Progression System for Jua Katiba

export type CivicRank = {
  title: string;
  minXp: number;
  maxXp: number;
  badge: string;
  description: string;
};

export const CIVIC_RANKS: CivicRank[] = [
  {
    title: "Mwananchi Raw",
    minXp: 0,
    maxXp: 99,
    badge: "🌱",
    description: "Beginning your civic journey. Learning the basics of citizenship.",
  },
  {
    title: "Civic Observer",
    minXp: 100,
    maxXp: 299,
    badge: "👁️",
    description: "Actively monitoring public affairs and understanding fundamental rights.",
  },
  {
    title: "Bunge Watcher",
    minXp: 300,
    maxXp: 599,
    badge: "🏛️",
    description: "Keen on devolution, legislation, and public participation.",
  },
  {
    title: "Katiba Defender",
    minXp: 600,
    maxXp: 999,
    badge: "🛡️",
    description: "Stands up for Article 3 — respecting, upholding, and defending the Constitution.",
  },
  {
    title: "Senior Counsel",
    minXp: 1000,
    maxXp: 1999,
    badge: "⚖️",
    description: "High constitutional literacy. Able to mentor peers on Bill of Rights.",
  },
  {
    title: "Chief Justice",
    minXp: 2000,
    maxXp: 999999,
    badge: "👑",
    description: "Supreme constitutional mastery. Champion of Kenyan democratic governance.",
  },
];

export type BadgeItem = {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredXp?: number;
  requiredLessons?: number;
};

export const AVAILABLE_BADGES: BadgeItem[] = [
  {
    id: "first_lesson",
    name: "First Step",
    icon: "🌱",
    description: "Completed your very first interactive civic lesson",
    requiredLessons: 1,
  },
  {
    id: "streak_3",
    name: "Civic Patriot",
    icon: "🔥",
    description: "Maintained a 3-day civic learning streak",
  },
  {
    id: "rights_defender",
    name: "Bill of Rights Guardian",
    icon: "🛡️",
    description: "Mastered fundamental rights and freedoms in Chapter 4",
  },
  {
    id: "devolution_pro",
    name: "Devolution Pioneer",
    icon: "🏛️",
    description: "Mastered county structures and devolved governance",
  },
  {
    id: "integrity_champ",
    name: "Chapter 6 Crusader",
    icon: "⚖️",
    description: "Understood leadership ethics and public trust requirements",
  },
  {
    id: "centurion",
    name: "100 XP Club",
    icon: "⭐",
    description: "Earned 100 total civic XP",
    requiredXp: 100,
  },
  {
    id: "master_scholar",
    name: "Katiba Master",
    icon: "🏆",
    description: "Completed 5 or more interactive modules",
    requiredLessons: 5,
  },
];

const STORAGE_KEY = "juakatiba_gamification_v2";

export type GamificationState = {
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  badges: string[];
  soundEnabled: boolean;
};

function getInitialState(): GamificationState {
  if (typeof window === "undefined") {
    return {
      xp: 40,
      streak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      completedLessons: [],
      badges: [],
      soundEnabled: true,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Update streak if needed
      const today = new Date().toISOString().split("T")[0];
      const lastActive = parsed.lastActiveDate;
      let streak = parsed.streak || 1;
      if (lastActive) {
        const lastDate = new Date(lastActive);
        const currDate = new Date(today);
        const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          // consecutive day
        } else if (diffDays > 1) {
          streak = 1;
        }
      }
      return {
        ...parsed,
        streak,
        lastActiveDate: today,
      };
    }
  } catch {
    // fallback
  }

  const today = new Date().toISOString().split("T")[0];
  return {
    xp: 50,
    streak: 1,
    lastActiveDate: today,
    completedLessons: [],
    badges: ["first_lesson"],
    soundEnabled: true,
  };
}

// Global state listeners for reactivity across components
const listeners = new Set<(state: GamificationState) => void>();
let currentState: GamificationState = getInitialState();

export function getGamificationState(): GamificationState {
  return currentState;
}

export function subscribeGamification(listener: (state: GamificationState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function persistState(newState: GamificationState) {
  currentState = newState;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // storage error
    }
  }
  listeners.forEach((fn) => fn(currentState));
}

export function addXp(amount: number, lessonSlug?: string): { newXp: number; unlockedBadge?: BadgeItem } {
  const current = getGamificationState();
  const nextXp = current.xp + amount;
  const completed = new Set(current.completedLessons);
  if (lessonSlug) completed.add(lessonSlug);

  const nextBadges = new Set(current.badges);
  let newlyUnlocked: BadgeItem | undefined;

  // Check badge unlocks
  AVAILABLE_BADGES.forEach((b) => {
    if (!nextBadges.has(b.id)) {
      if (b.requiredXp && nextXp >= b.requiredXp) {
        nextBadges.add(b.id);
        newlyUnlocked = b;
      }
      if (b.requiredLessons && completed.size >= b.requiredLessons) {
        nextBadges.add(b.id);
        newlyUnlocked = b;
      }
    }
  });

  const nextState: GamificationState = {
    ...current,
    xp: nextXp,
    completedLessons: Array.from(completed),
    badges: Array.from(nextBadges),
    lastActiveDate: new Date().toISOString().split("T")[0],
  };

  persistState(nextState);
  return { newXp: nextXp, unlockedBadge: newlyUnlocked };
}

export function toggleSound(): boolean {
  const current = getGamificationState();
  const next = !current.soundEnabled;
  persistState({ ...current, soundEnabled: next });
  return next;
}

export function getRankForXp(xp: number): CivicRank {
  for (let i = CIVIC_RANKS.length - 1; i >= 0; i--) {
    if (xp >= CIVIC_RANKS[i].minXp) {
      return CIVIC_RANKS[i];
    }
  }
  return CIVIC_RANKS[0];
}

export function getNextRankProgress(xp: number): { currentRank: CivicRank; nextRank: CivicRank | null; progressPct: number } {
  const currentRank = getRankForXp(xp);
  const currentIndex = CIVIC_RANKS.findIndex((r) => r.title === currentRank.title);
  const nextRank = currentIndex < CIVIC_RANKS.length - 1 ? CIVIC_RANKS[currentIndex + 1] : null;

  if (!nextRank) {
    return { currentRank, nextRank: null, progressPct: 100 };
  }

  const range = nextRank.minXp - currentRank.minXp;
  const currentInRange = xp - currentRank.minXp;
  const progressPct = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));

  return { currentRank, nextRank, progressPct };
}

// Web Audio API Synthesizer (Zero asset dependencies, instant offline audio feedback)
export function playChimeSound(type: "success" | "dilemma" | "complete" | "click") {
  if (typeof window === "undefined") return;
  if (!currentState.soundEnabled) return;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
      return;
    }

    if (type === "success") {
      // Pleasant two-tone chime (E5 -> G#5)
      const notes = [659.25, 830.61];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.25);
      });
      return;
    }

    if (type === "dilemma") {
      // Victory chord (C5 -> E5 -> G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
      });
      return;
    }

    if (type === "complete") {
      // Majestic 4-note celebration chime (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.13);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.13);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.13 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.13);
        osc.stop(ctx.currentTime + idx * 0.13 + 0.45);
      });
    }
  } catch {
    // Web audio not permitted or supported
  }
}
