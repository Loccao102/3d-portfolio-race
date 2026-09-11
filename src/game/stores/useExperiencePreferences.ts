import { create } from 'zustand';

interface ExperiencePreferencesState {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
}

export const useExperiencePreferences = create<ExperiencePreferencesState>((set) => ({
  reducedMotion: false,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
