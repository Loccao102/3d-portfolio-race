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

interface GameState {
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

  // UI & Experience State
  isIntroFinished: boolean;
  setIntroFinished: (finished: boolean) => void;
  isCardOpen: boolean;
  setCardOpen: (open: boolean) => void;
  isQuickViewOpen: boolean;
  setQuickViewOpen: (open: boolean) => void;
  isMiniMapExpanded: boolean;
  toggleMiniMap: () => void;
  quickViewTab: 'about' | 'tech' | 'projects' | 'experiments' | 'contact';
  setQuickViewTab: (tab: 'about' | 'tech' | 'projects' | 'experiments' | 'contact') => void;

  // Virtual Joystick (Mobile)
  joystickInput: { x: number; y: number };
  setJoystickInput: (input: { x: number; y: number }) => void;

  // Settings & Audio
  soundEnabled: boolean;
  toggleSound: () => void;
  quality: 'high' | 'low';
  setQuality: (quality: 'high' | 'low') => void;

  // Performance Telemetry
  fps: number;
  setFps: (fps: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
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
      if (!id) return { activeMilestone: null, isCardOpen: false };
      const visited = state.visitedMilestones.includes(id)
        ? state.visitedMilestones
        : [...state.visitedMilestones, id];
      return { activeMilestone: id, visitedMilestones: visited, isCardOpen: true };
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
  bestLapTime: null,
  currentLap: 1,
  checkpointsPassed: 0,
  raceNotification: null,
  setRaceNotification: (msg) => set({ raceNotification: msg }),

  tickRaceTimer: (delta) => {
    const { isRacing, currentLapTime } = get();
    if (isRacing) {
      set({ currentLapTime: currentLapTime + delta });
    }
  },

  passCheckpoint: (index) => {
    const { checkpointsPassed } = get();
    if (index === checkpointsPassed + 1) {
      set({ checkpointsPassed: index, raceNotification: `CHECKPOINT ${index}/3!` });
      sound.playClick();
      setTimeout(() => set({ raceNotification: null }), 1200);
    }
  },

  crossFinishLine: () => {
    const { isRacing, currentLapTime, bestLapTime, checkpointsPassed, currentLap } = get();
    if (!isRacing) {
      set({ isRacing: true, currentLapTime: 0, checkpointsPassed: 0, raceNotification: 'LAP STARTED! GO GO GO!' });
      sound.playZoneEnter();
      setTimeout(() => set({ raceNotification: null }), 1800);
      return;
    }

    if (checkpointsPassed >= 3) {
      const isNewBest = bestLapTime === null || currentLapTime < bestLapTime;
      const newBest = isNewBest ? currentLapTime : bestLapTime;
      set({
        bestLapTime: newBest,
        currentLap: currentLap + 1,
        currentLapTime: 0,
        checkpointsPassed: 0,
        raceNotification: isNewBest
          ? `NEW LAP RECORD: ${currentLapTime.toFixed(2)}s!`
          : `LAP COMPLETED: ${currentLapTime.toFixed(2)}s`,
      });
      sound.playZoneEnter();
      setTimeout(() => set({ raceNotification: null }), 2500);
    }
  },

  vehiclePos: { x: 0, z: 0, heading: 0 },
  setVehiclePos: (pos) => set({ vehiclePos: pos }),
  vehicleSpeed: 0,
  setVehicleSpeed: (speed) => set({ vehicleSpeed: speed }),
  isBoosting: false,
  setIsBoosting: (boosting) => set({ isBoosting: boosting }),

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
  quickViewTab: 'about',
  setQuickViewTab: (tab) => {
    sound.playClick();
    set({ quickViewTab: tab });
  },

  joystickInput: { x: 0, y: 0 },
  setJoystickInput: (input) => set({ joystickInput: input }),

  soundEnabled: false,
  toggleSound: () =>
    set((state) => {
      const next = !state.soundEnabled;
      sound.setEnabled(next);
      return { soundEnabled: next };
    }),
  quality: 'high',
  setQuality: (quality) => set({ quality }),

  fps: 60,
  setFps: (fps) => set({ fps }),
}));
