import React, { useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { STORY_CHAPTERS } from '../../data/storyChapters';
import { Play, Pause, ChevronRight, Compass } from 'lucide-react';

export const StoryHUD: React.FC = () => {
  const language = useGameStore((state) => state.language);
  const theme = useGameStore((state) => state.theme);
  const vehicleSpeed = useGameStore((state) => state.vehicleSpeed);
  const isBoosting = useGameStore((state) => state.isBoosting);
  const isZenMode = useGameStore((state) => state.isZenMode);
  const isStoryTourActive = useGameStore((state) => state.isStoryTourActive);
  const toggleStoryTour = useGameStore((state) => state.toggleStoryTour);
  const stopStoryTour = useGameStore((state) => state.stopStoryTour);
  const currentChapterIdx = useGameStore((state) => state.currentStoryChapter);
  const setStoryChapter = useGameStore((state) => state.setStoryChapter);
  const setTargetWaypoint = useGameStore((state) => state.setTargetWaypoint);
  const activeMilestone = useGameStore((state) => state.activeMilestone);

  // Sync activeMilestone with currentStoryChapter when user drives into a zone
  useEffect(() => {
    if (!activeMilestone) return;
    const foundIdx = STORY_CHAPTERS.findIndex((c) => c.id === activeMilestone);
    if (foundIdx !== -1 && foundIdx !== currentChapterIdx) {
      setStoryChapter(foundIdx);
    }
  }, [activeMilestone, currentChapterIdx, setStoryChapter]);

  if (isZenMode) {
    // In Zen Mode, only show minimal speed
    return (
      <div className="pointer-events-none fixed top-4 left-4 z-20 font-mono select-none">
        <div className="px-2.5 py-1 bg-black/60 border border-cyan-500/30 text-cyan-300 text-xs rounded shadow">
          <span className="font-bold text-sm">{vehicleSpeed}</span> <span className="text-[10px] text-slate-400">km/h</span>
        </div>
      </div>
    );
  }

  const isLight = theme === 'light';
  const isNight = theme === 'night';
  const chapter = STORY_CHAPTERS[currentChapterIdx] || STORY_CHAPTERS[0];

  const barBg = isLight
    ? 'bg-white/90 border-slate-300 text-slate-800 shadow-lg backdrop-blur-md'
    : isNight
    ? 'bg-black/85 border-cyan-500/40 text-cyan-200 shadow-[0_0_25px_rgba(0,243,255,0.2)] backdrop-blur-md'
    : 'bg-slate-900/90 border-slate-700 text-slate-200 shadow-xl backdrop-blur-md';

  const handleSelectChapter = (index: number) => {
    setStoryChapter(index);
    setTargetWaypoint(STORY_CHAPTERS[index].id);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-20 font-mono select-none flex flex-col justify-between p-4 md:p-6">
      {/* 1. Top Center: Story Chapter Progression Timeline */}
      <div className="w-full flex flex-col items-center gap-2 pt-16 md:pt-14">
        {/* Autopilot Status Toast */}
        {isStoryTourActive && (
          <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-1.5 border border-amber-400/80 bg-amber-950/90 text-amber-300 text-xs rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold tracking-wider">
              {language === 'vi' ? 'ĐANG PHÁT HÀNH TRÌNH TỰ ĐỘNG' : 'CINEMATIC AUTOPILOT TOUR ACTIVE'}
            </span>
            <span className="text-[10px] opacity-75 hidden sm:inline">
              ({language === 'vi' ? 'Bấm phím WASD bất kỳ lúc nào để tự lái' : 'Press WASD anytime to steer'})
            </span>
            <button
              onClick={stopStoryTour}
              className="ml-2 px-2 py-0.5 bg-amber-400 text-slate-950 rounded font-bold text-[10px] hover:bg-amber-300"
            >
              {language === 'vi' ? 'DỪNG' : 'EXIT'}
            </button>
          </div>
        )}

        {/* 5-Chapter Milestone Progress Timeline */}
        <div className={`pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-2 border rounded-full ${barBg}`}>
          <div className="hidden md:flex items-center gap-1.5 pr-2 mr-1 border-r border-slate-700 text-[11px] font-bold text-cyan-400 tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'HÀNH TRÌNH:' : 'ODYSSEY:'}</span>
          </div>

          {STORY_CHAPTERS.map((ch, idx) => {
            const isActive = idx === currentChapterIdx;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChapter(idx)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all ${
                  isActive
                    ? isNight
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,243,255,0.6)] scale-105'
                      : isLight
                      ? 'bg-cyan-700 text-white shadow'
                      : 'bg-cyan-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
                title={ch.title[language]}
              >
                <span>0{ch.chapterNumber}</span>
                <span className="hidden lg:inline">{ch.title[language].replace(/CHƯƠNG \d+ \/\/ |CHAPTER \d+ \/\/ /g, '')}</span>
              </button>
            );
          })}
        </div>

        {/* Cinematic Chapter Narrative Subtitle Toast */}
        <div className={`pointer-events-auto max-w-xl mx-auto px-4 py-2.5 border text-center transition-all duration-300 rounded-lg ${barBg}`}>
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: chapter.color }}
            />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-cyan-400">
              {chapter.title[language]} — {chapter.subtitle[language]}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-serif italic text-amber-300/90 mb-1">
            {chapter.quote[language]}
          </p>
          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
            {chapter.narrative[language]}
          </p>
        </div>
      </div>

      {/* 2. Bottom Right: Minimal Digital Velocity Pill */}
      <div className="flex justify-between items-end">
        {/* Empty left to keep clear view */}
        <div />

        {/* Speedometer Badge */}
        <div className={`pointer-events-auto flex items-baseline gap-1.5 px-3.5 py-2 border rounded ${barBg}`}>
          <span className="text-[9px] text-slate-400 tracking-wider">SPEED</span>
          <span
            className={`text-2xl font-bold tabular-nums leading-none ${
              isBoosting
                ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                : 'text-cyan-400'
            }`}
          >
            {vehicleSpeed}
          </span>
          <span className="text-[10px] text-slate-400">km/h</span>
          {isBoosting && (
            <span className="ml-1 text-[9px] font-bold text-amber-400 animate-pulse">
              NITRO
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
