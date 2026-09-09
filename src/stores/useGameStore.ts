import { create } from 'zustand';
import { sound } from '../lib/soundEngine';
import { PlayerProfile, DEFAULT_PLAYER_PROFILE } from '../data/playerProfile';

export type MilestoneId =
  | 'about'
  | 'tech'
  | 'projects'
  | 'experiments'
  | 'contact'
  | 'project-1'
  | 'project-2'
  | 'project-3';

export interface MilestoneWaypoint {
  id: MilestoneId;
  name: string;
  x: number;
  z: number;
  color: string;
}

export const MILESTONE_WAYPOINTS: MilestoneWaypoint[] = [
  // Targets sit at the approach side of each local sensor, rather than in
  // the rear of the district props where a building proxy would block entry.
  { id: 'about', name: 'ABOUT DISTRICT', x: 0, z: 34, color: '#00f3ff' },
  { id: 'tech', name: 'TECH LAB', x: 0, z: -34, color: '#f59e0b' },
  { id: 'projects', name: 'PROJECT GARAGE', x: 43, z: 0, color: '#10b981' },
  { id: 'experiments', name: 'EXPERIMENTS', x: -38, z: 0, color: '#ec4899' },
  { id: 'contact', name: 'CONTACT STATION', x: 0, z: -71, color: '#38bdf8' },
];

export type ThemeMode = 'light' | 'dark' | 'night';
export type Language = 'vi' | 'en';

interface GameState {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // Theme Modes: 'light' (Daylight Studio), 'dark' (Modern Dark Tech), 'night' (Cyberpunk Neon)
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
  toggleTheme: () => void;

  // Visitor Identity
  playerProfile: PlayerProfile;
  setPlayerProfile: (profile: PlayerProfile) => void;

  // Navigation & Milestones
  activeMilestone: MilestoneId | null;
  targetWaypoint: MilestoneId;
  selectedProjectId: string | null;
  visitedMilestones: MilestoneId[];
  setActiveMilestone: (id: MilestoneId | null) => void;
  setTargetWaypoint: (id: MilestoneId) => void;
  setSelectedProject: (id: string | null) => void;
  markMilestoneVisited: (id: MilestoneId) => void;

  // Racing Circuit System
  isRacing: boolean;
  setIsRacing: (racing: boolean) => void;
  currentLapTime: number;
  bestLapTime: number | null;
  currentLap: number;
  checkpointsPassed: number;
  checkpointSplits: (number | null)[];
  bestCheckpointSplits: (number | null)[];
  raceNotification: string | null;
  setRaceNotification: (msg: string | null) => void;
  tickRaceTimer: (delta: number) => void;
  passCheckpoint: (index: number) => void;
  crossFinishLine: () => void;

  // Vehicle Telemetry for Minimap & HUD
  vehiclePos: { x: number; z: number; heading: number };
  setVehiclePos: (pos: { x: number; z: number; heading: number }) => void;
  vehicleSpeed: number; // km/h
  setVehicleSpeed: (speed: number) => void;
  isBoosting: boolean;
  setIsBoosting: (boosting: boolean) => void;

  // Story Narrative & Autopilot Tour
  isStoryTourActive: boolean;
  currentStoryChapter: number;
  startStoryTour: () => void;
  stopStoryTour: () => void;
  toggleStoryTour: () => void;
  setStoryChapter: (chapter: number) => void;
  nextStoryChapter: () => void;

  // UI & Experience State
  isIntroFinished: boolean;
  setIntroFinished: (finished: boolean) => void;
  isCardOpen: boolean;
  setCardOpen: (open: boolean) => void;
  isQuickViewOpen: boolean;
  setQuickViewOpen: (open: boolean) => void;
  isMiniMapExpanded: boolean;
  toggleMiniMap: () => void;
  isZenMode: boolean;
  toggleZenMode: () => void;
  setZenMode: (zen: boolean) => void;
  quickViewTab: 'about' | 'tech' | 'projects' | 'experiments' | 'contact';
  setQuickViewTab: (tab: 'about' | 'tech' | 'projects' | 'experiments' | 'contact') => void;

  // Virtual Joystick & Mobile Actions
  joystickInput: { x: number; y: number };
  setJoystickInput: (input: { x: number; y: number }) => void;
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  mobileActions: { boost: boolean; brake: boolean; reset: boolean };
  setMobileAction: (action: 'boost' | 'brake' | 'reset', active: boolean) => void;

  // Settings & Audio
  soundEnabled: boolean;
  toggleSound: () => void;
  lofiEnabled: boolean;
  toggleLofi: () => void;
  quality: 'high' | 'low';
  setQuality: (quality: 'high' | 'low') => void;

  // Performance Telemetry
  fps: number;
  setFps: (fps: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  language: 'vi',
  setLanguage: (language) => {
    sound.playClick();
    set({ language });
  },

  // Default theme is 'night' (vibrant Cyberpunk night) with instant toggle to 'dark' or 'light'
  theme: 'night',
  setTheme: (theme: ThemeMode) => {
    sound.playClick();
    set({ theme });
  },
  cycleTheme: () => {
    sound.playClick();
    set((state) => {
      const nextTheme: ThemeMode =
        state.theme === 'light' ? 'dark' : state.theme === 'dark' ? 'night' : 'light';
      return { theme: nextTheme };
    });
  },
  toggleTheme: () => {
    sound.playClick();
    set((state) => {
      const nextTheme: ThemeMode =
        state.theme === 'light' ? 'dark' : state.theme === 'dark' ? 'night' : 'light';
      return { theme: nextTheme };
    });
  },

  playerProfile: DEFAULT_PLAYER_PROFILE,
  setPlayerProfile: (profile) => set({ playerProfile: profile }),

  activeMilestone: null,
  targetWaypoint: 'about',
  selectedProjectId: null,
  visitedMilestones: [],
  setActiveMilestone: (id) =>
    set((state) => {
      if (!id) return { activeMilestone: null };
      const visited = state.visitedMilestones.includes(id)
        ? state.visitedMilestones
        : [...state.visitedMilestones, id];
      return { activeMilestone: id, visitedMilestones: visited };
    }),
  setTargetWaypoint: (id) => set({ targetWaypoint: id }),
  setSelectedProject: (id) => set({ selectedProjectId: id }),
  markMilestoneVisited: (id) =>
    set((state) => ({
      visitedMilestones: state.visitedMilestones.includes(id)
        ? state.visitedMilestones
        : [...state.visitedMilestones, id],
    })),

  // Racing System States
  isRacing: false,
  setIsRacing: (racing) => set({ isRacing: racing }),
  currentLapTime: 0,
  bestLapTime: typeof window !== 'undefined' ? (() => {
    try {
      const cached = localStorage.getItem('cao_tien_loc_best_lap');
      return cached ? parseFloat(cached) : null;
    } catch { return null; }
  })() : null,
  currentLap: 1,
  checkpointsPassed: 0,
  checkpointSplits: [null, null, null],
  bestCheckpointSplits: [null, null, null],
  raceNotification: null,
  setRaceNotification: (msg) => set({ raceNotification: msg }),

  tickRaceTimer: (delta) => {
    const { isRacing, currentLapTime } = get();
    if (isRacing) {
      set({ currentLapTime: currentLapTime + delta });
    }
  },

  passCheckpoint: (index) => {
    const { checkpointsPassed, currentLapTime, bestCheckpointSplits } = get();
    if (index === checkpointsPassed + 1) {
      const splits = [...get().checkpointSplits];
      splits[index - 1] = currentLapTime;

      let splitInfo = '';
      if (bestCheckpointSplits[index - 1] !== null) {
        const delta = currentLapTime - (bestCheckpointSplits[index - 1] as number);
        const sign = delta > 0 ? '+' : '';
        splitInfo = ` (${sign}${delta.toFixed(2)}s)`;
      }

      set({
        checkpointsPassed: index,
        checkpointSplits: splits,
        raceNotification: `SECTOR ${index}/3 PASSED${splitInfo}!`,
      });
      sound.playCheckpoint();
      setTimeout(() => set({ raceNotification: null }), 1400);
    }
  },

  crossFinishLine: () => {
    const { isRacing, currentLapTime, bestLapTime, checkpointsPassed, currentLap, checkpointSplits } = get();
    if (!isRacing) {
      set({
        isRacing: true,
        currentLapTime: 0,
        checkpointsPassed: 0,
        checkpointSplits: [null, null, null],
        raceNotification: 'SPEED CIRCUIT // LAP STARTED! GO GO GO!',
      });
      sound.playZoneEnter();
      setTimeout(() => set({ raceNotification: null }), 1800);
      return;
    }

    if (checkpointsPassed >= 3) {
      const isNewBest = bestLapTime === null || currentLapTime < bestLapTime;
      const newBest = isNewBest ? currentLapTime : bestLapTime;
      if (isNewBest && typeof window !== 'undefined') {
        try {
          localStorage.setItem('cao_tien_loc_best_lap', String(newBest));
        } catch {}
      }

      set((state) => ({
        bestLapTime: newBest,
        bestCheckpointSplits: isNewBest ? checkpointSplits : state.bestCheckpointSplits,
        currentLap: currentLap + 1,
        currentLapTime: 0,
        checkpointsPassed: 0,
        checkpointSplits: [null, null, null],
        raceNotification: isNewBest
          ? `🏆 NEW LAP RECORD: ${currentLapTime.toFixed(2)}s!`
          : `LAP COMPLETED: ${currentLapTime.toFixed(2)}s`,
      }));
      sound.playLapComplete();
      setTimeout(() => set({ raceNotification: null }), 2600);
    }
  },

  vehiclePos: { x: 0, z: 0, heading: 0 },
  setVehiclePos: (pos) => set({ vehiclePos: pos }),
  vehicleSpeed: 0,
  setVehicleSpeed: (speed) => set({ vehicleSpeed: speed }),
  isBoosting: false,
  setIsBoosting: (boosting) => set({ isBoosting: boosting }),

  // Story Tour Implementation
  isStoryTourActive: false,
  currentStoryChapter: 0,
  startStoryTour: () => {
    sound.playClick();
    set({ isStoryTourActive: true, isZenMode: false });
  },
  stopStoryTour: () => set({ isStoryTourActive: false }),
  toggleStoryTour: () => {
    sound.playClick();
    set((state) => ({ isStoryTourActive: !state.isStoryTourActive }));
  },
  setStoryChapter: (chapter) => {
    set({ currentStoryChapter: Math.max(0, Math.min(4, chapter)) });
  },
  nextStoryChapter: () => {
    set((state) => ({ currentStoryChapter: (state.currentStoryChapter + 1) % 5 }));
  },

  isIntroFinished: false,
  setIntroFinished: (finished) => set({ isIntroFinished: finished }),
  isCardOpen: false,
  setCardOpen: (open) => set({ isCardOpen: open }),
  isQuickViewOpen: false,
  setQuickViewOpen: (open) => {
    sound.playClick();
    set({ isQuickViewOpen: open });
  },
  isMiniMapExpanded: true,
  toggleMiniMap: () => set((state) => ({ isMiniMapExpanded: !state.isMiniMapExpanded })),
  isZenMode: false,
  toggleZenMode: () => {
    sound.playClick();
    set((state) => ({ isZenMode: !state.isZenMode }));
  },
  setZenMode: (zen) => set({ isZenMode: zen }),
  quickViewTab: 'about',
  setQuickViewTab: (tab) => {
    sound.playClick();
    set({ quickViewTab: tab });
  },

  joystickInput: { x: 0, y: 0 },
  setJoystickInput: (input) => set({ joystickInput: input }),
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
  mobileActions: { boost: false, brake: false, reset: false },
  setMobileAction: (action, active) =>
    set((state) => ({
      mobileActions: { ...state.mobileActions, [action]: active },
    })),

  soundEnabled: false,
  toggleSound: () =>
    set((state) => {
      const next = !state.soundEnabled;
      sound.setEnabled(next);
      return { soundEnabled: next };
    }),
  lofiEnabled: false,
  toggleLofi: () =>
    set((state) => {
      const next = sound.toggleLofi();
      return { lofiEnabled: next };
    }),
  quality: typeof window !== 'undefined' ? (() => {
    try {
      const cached = localStorage.getItem('cao_tien_loc_quality');
      if (cached === 'low' || cached === 'high') return cached;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return 'low';
      if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) return 'low';
    } catch {}
    return 'high';
  })() : 'high',
  setQuality: (quality) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cao_tien_loc_quality', quality);
      } catch {}
    }
    set({ quality });
  },

  fps: 60,
  setFps: (fps) => set({ fps }),
}));
