'use client';

import { create } from 'zustand';
import type { DistrictExperienceId } from './data/districtExperience';

export type ExperienceMode = 'free' | 'tour';
export type TourStatus = 'idle' | 'running' | 'paused' | 'complete';
export type TourPhase = 'transit' | 'hold';

interface ExperienceState {
  mode: ExperienceMode;
  tourStatus: TourStatus;
  tourElapsed: number;
  tourIndex: number;
  tourPhase: TourPhase;
  tourPhaseProgress: number;
  activeTourDistrict: DistrictExperienceId | null;
  startTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  stopTour: () => void;
  completeTour: () => void;
  setTourRuntime: (runtime: {
    elapsed: number;
    index: number;
    phase: TourPhase;
    phaseProgress: number;
    district: DistrictExperienceId | null;
  }) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  mode: 'free',
  tourStatus: 'idle',
  tourElapsed: 0,
  tourIndex: 0,
  tourPhase: 'transit',
  tourPhaseProgress: 0,
  activeTourDistrict: null,
  startTour: () =>
    set({
      mode: 'tour',
      tourStatus: 'running',
      tourElapsed: 0,
      tourIndex: 0,
      tourPhase: 'transit',
      tourPhaseProgress: 0,
      activeTourDistrict: null,
    }),
  pauseTour: () => set((state) => (state.tourStatus === 'running' ? { tourStatus: 'paused' } : state)),
  resumeTour: () => set((state) => (state.tourStatus === 'paused' ? { tourStatus: 'running' } : state)),
  stopTour: () =>
    set({
      mode: 'free',
      tourStatus: 'idle',
      tourElapsed: 0,
      tourIndex: 0,
      tourPhase: 'transit',
      tourPhaseProgress: 0,
      activeTourDistrict: null,
    }),
  completeTour: () => set({ tourStatus: 'complete', tourPhase: 'hold', tourPhaseProgress: 1 }),
  setTourRuntime: ({ elapsed, index, phase, phaseProgress, district }) =>
    set({
      tourElapsed: elapsed,
      tourIndex: index,
      tourPhase: phase,
      tourPhaseProgress: phaseProgress,
      activeTourDistrict: district,
    }),
}));
