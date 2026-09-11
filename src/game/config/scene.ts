export type SceneTheme = 'light' | 'dark' | 'night';
export type SceneQuality = 'low' | 'medium' | 'high';

export const SCENE_CAMERA = {
  position: [0, 20, 28] as [number, number, number],
  fov: 46,
  near: 0.5,
  far: 450,
} as const;

export const PHYSICS_CONFIG = {
  gravity: [0, -26, 0] as [number, number, number],
  timeStep: 'vary' as const,
} as const;

export const getSceneLook = (theme: SceneTheme) => {
  const isLight = theme === 'light';
  const isDark = theme === 'dark';

  return {
    background: isLight ? '#e2e8f0' : isDark ? '#0f172a' : '#050811',
    fogNear: isLight ? 160 : isDark ? 150 : 140,
    fogFar: isLight ? 420 : isDark ? 400 : 390,
    environmentIntensity: isLight ? 0.95 : isDark ? 0.6 : 0.45,
    hemisphere: (isLight
      ? ['#ffffff', '#cbd5e1', 2.3]
      : isDark
        ? ['#38bdf8', '#0f172a', 1.5]
        : ['#00f3ff', '#020617', 1.35]) as [string, string, number],
    ambientIntensity: isLight ? 1.1 : isDark ? 0.8 : 0.65,
    ambientColor: isLight ? '#ffffff' : isDark ? '#94a3b8' : '#64748b',
    sunIntensity: isLight ? 3.4 : isDark ? 2.6 : 2.2,
    sunColor: isLight ? '#ffffff' : isDark ? '#f1f5f9' : '#93c5fd',
    cyanIntensity: isLight ? 0.6 : isDark ? 1.5 : 2.8,
    magentaIntensity: isLight ? 0.4 : isDark ? 1.1 : 2.2,
    amberIntensity: isLight ? 0.5 : isDark ? 0.8 : 1.3,
  };
};

export const getMaxDpr = (quality: SceneQuality, isMobile: boolean) => {
  if (quality === 'low') return 1;
  return isMobile ? 1.2 : 1.5;
};
