import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Timer, Trophy, Flag, ShieldCheck } from 'lucide-react';
import { i18n } from '../../data/i18n';

export const RaceHUD: React.FC = () => {
  const language = useGameStore((state) => state.language);
  const t = i18n[language];
  const isRacing = useGameStore((state) => state.isRacing);
  const currentLapTime = useGameStore((state) => state.currentLapTime);
  const bestLapTime = useGameStore((state) => state.bestLapTime);
  const currentLap = useGameStore((state) => state.currentLap);
  const checkpointsPassed = useGameStore((state) => state.checkpointsPassed);
  const raceNotification = useGameStore((state) => state.raceNotification);
  const playerProfile = useGameStore((state) => state.playerProfile);
  const theme = useGameStore((state) => state.theme);
  const vehicleSpeed = useGameStore((state) => state.vehicleSpeed);
  const isBoosting = useGameStore((state) => state.isBoosting);
  const isZenMode = useGameStore((state) => state.isZenMode);

  const isLight = theme === 'light';
  const isNight = theme === 'night';

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = (time % 60).toFixed(2);
    return `${mins.toString().padStart(2, '0')}:${secs.padStart(5, '0')}`;
  };

  const panelBg = isLight
    ? 'bg-white/95 border-slate-300 shadow-xl text-slate-800'
    : isNight
    ? 'bg-slate-950/92 border-cyan-500/50 shadow-[0_0_20px_rgba(0,243,255,0.2)] text-cyan-100'
    : 'bg-slate-900/95 border-slate-700 shadow-xl text-slate-100';

  return (
    <div className="pointer-events-none fixed inset-0 z-20 font-mono select-none">
      {/* 1. Giant Flash Race Notification Banner */}
      {raceNotification && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className={`px-6 py-2.5 border-2 font-bold text-sm md:text-base tracking-widest uppercase backdrop-blur-md ${
            isLight
              ? 'bg-white/95 border-cyan-600 text-cyan-950 shadow-xl'
              : isNight
              ? 'bg-slate-950/95 border-cyan-400 text-cyan-300 shadow-[0_0_35px_rgba(0,243,255,0.6)]'
              : 'bg-slate-900/95 border-cyan-500 text-cyan-200 shadow-xl'
          }`}>
            🏁 {raceNotification}
          </div>
        </div>
      )}

      {/* 2. Top-Left Race Circuit Telemetry */}
      <div className={`absolute ${isZenMode ? 'top-4 left-4' : 'top-20 left-4 md:left-6'} flex flex-col gap-2`}>
        {/* Pilot Identity Badge (hidden in Zen Mode) */}
        {!isZenMode && (
          <div className={`pointer-events-auto p-2.5 border backdrop-blur-md flex items-center gap-2.5 text-xs ${
            isLight
              ? 'bg-white/90 border-slate-300 shadow-md text-slate-800'
              : isNight
              ? 'bg-slate-950/90 border-cyan-500/40 shadow-[0_0_15px_rgba(0,243,255,0.2)] text-slate-200'
              : 'bg-slate-950/85 border-slate-800 text-slate-200'
          }`}>
            <span
              className="w-3 h-3 rounded-full border border-white shadow-[0_0_8px]"
              style={{ backgroundColor: playerProfile.accentColor, borderColor: playerProfile.accentColor }}
            />
            <div className="flex flex-col">
              <span className={`text-[10px] tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.callsign}</span>
              <span className={`font-bold tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{playerProfile.name}</span>
            </div>
          </div>
        )}

        {/* Digital Speedometer (Clean minimal view) */}
        <div className={`pointer-events-auto px-3 py-2 border backdrop-blur-md text-right ${panelBg}`}>
          <div className={`text-[9px] tracking-widest mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.speed}
          </div>
          <div className="flex items-baseline justify-end gap-1">
            <span
              className={`text-2xl font-bold tabular-nums leading-none transition-colors ${
                isBoosting
                  ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                  : isLight
                  ? 'text-cyan-700'
                  : 'text-cyan-300'
              }`}
            >
              {vehicleSpeed}
            </span>
            <span className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.kmh}</span>
          </div>
          {isBoosting && (
            <div className="text-[9px] font-bold tracking-widest text-amber-400 animate-pulse drop-shadow-[0_0_6px_rgba(245,158,11,0.6)] mt-0.5">
              ⚡ NITRO
            </div>
          )}
        </div>

        {/* Live Race Timer Panel (hidden in Zen Mode) */}
        {isRacing && !isZenMode && (
          <div className={`pointer-events-auto p-3 border backdrop-blur-md space-y-1.5 text-xs ${panelBg}`}>
            <div className={`flex items-center justify-between font-bold border-b pb-1 ${
              isLight
                ? 'border-slate-200 text-cyan-800'
                : isNight
                ? 'border-cyan-900/60 text-cyan-300 drop-shadow-[0_0_8px_rgba(0,243,255,0.7)]'
                : 'border-slate-800 text-cyan-400'
            }`}>
              <span className="flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.speedCircuit}</span>
              </span>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.lap} {currentLap}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className={`flex items-center gap-1 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Timer className="w-3 h-3 text-cyan-500" />
                <span>{t.lapTime}:</span>
              </span>
              <span className={`font-bold text-sm tracking-wider ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>
                {formatTime(currentLapTime)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className={`flex items-center gap-1 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>{t.bestRecord}:</span>
              </span>
              <span className={`font-bold tracking-wider ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
                {bestLapTime ? formatTime(bestLapTime) : '--:--.--'}
              </span>
            </div>

            <div className={`flex items-center justify-between gap-4 pt-0.5 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
              <span className={`flex items-center gap-1 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>{t.sectors}:</span>
              </span>
              <span className={`font-bold tracking-wider ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
                {checkpointsPassed} / 3
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

