export interface PlayerProfile {
  id: string;
  name: string;
  bodyColor: string;
  accentColor: string;
  glowColor: string;
  carNumber: string;
}

const CALLSIGN_PREFIXES = ['CYBER', 'PHANTOM', 'VIPER', 'NEXUS', 'SPECTER', 'TITAN', 'DRIFT', 'APEX', 'BLADE', 'PULSE'];
const CALLSIGN_SUFFIXES = ['RUNNER', 'PILOT', 'STRIKER', 'RACER', 'DRIVER', 'GHOST', 'SHADOW', 'ZERO'];

const CYBER_PALETTES = [
  { body: '#0f172a', accent: '#00f3ff', glow: '#00f3ff' }, // Electric Cyan
  { body: '#18181b', accent: '#f43f5e', glow: '#f43f5e' }, // Crimson Rose
  { body: '#172554', accent: '#38bdf8', glow: '#38bdf8' }, // Sky Blue
  { body: '#052e16', accent: '#10b981', glow: '#10b981' }, // Acid Lime
  { body: '#2e1065', accent: '#c084fc', glow: '#c084fc' }, // Royal Purple
  { body: '#451a03', accent: '#fbbf24', glow: '#fbbf24' }, // Solar Gold
  { body: '#1c1917', accent: '#ff7700', glow: '#ff7700' }, // Cyber Orange
  { body: '#31102e', accent: '#f472b6', glow: '#f472b6' }, // Neon Hot Pink
];

export const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  id: 'pilot-local',
  name: 'CYBER-PILOT #01',
  bodyColor: '#0f172a',
  accentColor: '#00f3ff',
  glowColor: '#00f3ff',
  carNumber: '01',
};

// Generate or retrieve persistent visitor profile from localStorage
export function getOrCreatePlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') {
    return DEFAULT_PLAYER_PROFILE;
  }

  const STORAGE_KEY = 'cao_tien_loc_player_profile';
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {}

  // Generate new randomized profile
  const prefix = CALLSIGN_PREFIXES[Math.floor(Math.random() * CALLSIGN_PREFIXES.length)];
  const suffix = CALLSIGN_SUFFIXES[Math.floor(Math.random() * CALLSIGN_SUFFIXES.length)];
  const num = Math.floor(10 + Math.random() * 90);
  const palette = CYBER_PALETTES[Math.floor(Math.random() * CYBER_PALETTES.length)];

  const profile: PlayerProfile = {
    id: `pilot-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: `${prefix}-${suffix} #${num}`,
    bodyColor: palette.body,
    accentColor: palette.accent,
    glowColor: palette.glow,
    carNumber: String(num),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {}

  return profile;
}

export interface RivalPilot {
  id: string;
  name: string;
  bodyColor: string;
  accentColor: string;
  glowColor: string;
  carNumber: string;
  circuitOffset: number; // Offset along the race circuit curve
  speed: number;
}

export const INITIAL_RIVALS: RivalPilot[] = [
  {
    id: 'rival-1',
    name: 'GHOST-DRIFT #77',
    bodyColor: '#18181b',
    accentColor: '#f43f5e',
    glowColor: '#f43f5e',
    carNumber: '77',
    circuitOffset: 0.15,
    speed: 16.5,
  },
  {
    id: 'rival-2',
    name: 'APEX-SHADOW #88',
    bodyColor: '#451a03',
    accentColor: '#fbbf24',
    glowColor: '#fbbf24',
    carNumber: '88',
    circuitOffset: 0.45,
    speed: 17.5,
  },
  {
    id: 'rival-3',
    name: 'NEXUS-RACER #23',
    bodyColor: '#2e1065',
    accentColor: '#c084fc',
    glowColor: '#c084fc',
    carNumber: '23',
    circuitOffset: 0.75,
    speed: 15.8,
  },
];

