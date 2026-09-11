'use client';

import { useEffect } from 'react';
import { useExperiencePreferences } from '@/game/stores/useExperiencePreferences';

export function AccessibilitySystem() {
  const setReducedMotion = useExperiencePreferences((state) => state.setReducedMotion);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [setReducedMotion]);

  return null;
}
