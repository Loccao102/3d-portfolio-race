export type SceneTheme = 'light' | 'dark' | 'night';
export type SceneQuality = 'low' | 'high';

export const SCENE_CAMERA = {
  position: [0, 20, 28] as [number, number, number],
  fov: 46,
  near: 0.5,
  far: 520,
};

export const PHYSICS_CONFIG = {
  gravity: [0, -26, 0] as [number, number, number],
  timeStep: 'vary' as const,
};

export const getSceneLook = (theme: SceneTheme) => {
  const isLight = theme === 'light';
  const isDark = theme === 'dark';

  return {
    background: isLight ? '#c9d8df' : isDark ? '#111723' : '#04070d',
    fogNear: isLight ? 125 : isDark ? 112 : 98,
    fogFar: isLight ? 390 : isDark ? 350 : 320,
    environmentIntensity: isLight ? 0.92 : isDark ? 0.68 : 0.52,
    hemisphere: (isLight
      ? ['#f8e8cf', '#8195a3', 2.15]
      : isDark
        ? ['#557fa2', '#0d111b', 1.48]
        : ['#244b66', '#02050a', 1.18]) as [string, string, number],
    ambientIntensity: isLight ? 0.95 : isDark ? 0.62 : 0.48,
    ambientColor: isLight ? '#fff4df' : isDark ? '#7f95aa' : '#52677d',
    sunIntensity: isLight ? 3.25 : isDark ? 2.35 : 1.8,
    sunColor: isLight ? '#ffd6a0' : isDark ? '#ffc078' : '#f59e6b',
    cyanIntensity: isLight ? 0.34 : isDark ? 1.15 : 2.0,
    magentaIntensity: isLight ? 0.18 : isDark ? 0.72 : 1.25,
    amberIntensity: isLight ? 0.8 : isDark ? 1.28 : 1.8,
    districtGlowIntensity: isLight ? 0.7 : isDark ? 1.3 : 2.1,
  };
};

export const getMaxDpr = (quality: SceneQuality, isMobile: boolean) => {
  if (quality === 'low') return 1;
  return isMobile ? 1.2 : 1.5;
};
