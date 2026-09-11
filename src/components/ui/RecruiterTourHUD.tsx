'use client';

import React from 'react';
import { Pause, Play, Square, TimerReset, BookOpen, Route } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import {
  DISTRICT_EXPERIENCES,
  TOUR_TOTAL_SECONDS,
} from '@/game/features/portfolio/data/districtExperience';
import { useExperienceStore } from '@/game/features/portfolio/useExperienceStore';

const formatSeconds = (value: number) => {
  const total = Math.max(0, Math.round(value));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export function RecruiterTourHUD() {
  const isIntroFinished = useGameStore((state) => state.isIntroFinished);
  const setCardOpen = useGameStore((state) => state.setCardOpen);
  const setIsRacing = useGameStore((state) => state.setIsRacing);
  const setActiveMilestone = useGameStore((state) => state.setActiveMilestone);
  const mode = useExperienceStore((state) => state.mode);
  const status = useExperienceStore((state) => state.tourStatus);
  const elapsed = useExperienceStore((state) => state.tourElapsed);
  const index = useExperienceStore((state) => state.tourIndex);
  const phase = useExperienceStore((state) => state.tourPhase);
  const phaseProgress = useExperienceStore((state) => state.tourPhaseProgress);
  const startTour = useExperienceStore((state) => state.startTour);
  const pauseTour = useExperienceStore((state) => state.pauseTour);
  const resumeTour = useExperienceStore((state) => state.resumeTour);
  const stopTour = useExperienceStore((state) => state.stopTour);

  if (!isIntroFinished) return null;

  if (mode === 'free') {
    return (
      <button
        onClick={() => {
          setIsRacing(false);
          setCardOpen(false);
          setActiveMilestone(null);
          startTour();
        }}
        className="fixed bottom-6 right-5 z-30 hidden items-center gap-3 rounded-2xl border border-cyan-300/20 bg-[#07101b]/82 px-4 py-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-[#0a1724]/92 md:flex"
      >
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
          <TimerReset className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white">90s Recruiter Tour</div>
          <div className="mt-0.5 text-[8px] text-slate-500">Tự chạy qua 5 điểm quan trọng</div>
        </div>
      </button>
    );
  }

  const district = DISTRICT_EXPERIENCES[Math.min(index, DISTRICT_EXPERIENCES.length - 1)];
  const progress = Math.min(1, elapsed / TOUR_TOTAL_SECONDS);
  const isComplete = status === 'complete';
  const isPaused = status === 'paused';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-3 md:bottom-7">
      <div className="pointer-events-auto w-[min(94vw,760px)] overflow-hidden rounded-3xl border border-white/10 bg-[#050b13]/92 shadow-[0_28px_100px_rgba(0,0,0,0.52)] backdrop-blur-2xl">
        <div className="h-1 bg-white/5">
          <div
            className="h-full transition-[width] duration-150"
            style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg,#22d3ee,${district.accent})` }}
          />
        </div>

        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.22em] text-cyan-300">
                <Route className="h-3.5 w-3.5" />
                Recruiter Tour · {index + 1}/{DISTRICT_EXPERIENCES.length}
              </div>
              <h2 className="mt-1 truncate text-base font-black text-white md:text-lg">{district.title}</h2>
              <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-slate-500">
                {phase === 'transit' ? `Đang di chuyển · ${Math.round(phaseProgress * 100)}%` : district.eyebrow}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[10px] font-black tabular-nums text-white">{formatSeconds(elapsed)} / 1:30</div>
              <div className="mt-1 text-[8px] uppercase tracking-[0.14em] text-slate-600">guided overview</div>
            </div>
          </div>

          {phase === 'hold' && !isComplete ? (
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.1fr]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <div className="text-[10px] font-bold leading-relaxed text-slate-200">{district.recruiterHeadline}</div>
              </div>
              <div className="space-y-1.5">
                {district.recruiterPoints.map((point) => (
                  <div key={point} className="flex items-start gap-2 text-[9px] leading-relaxed text-slate-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: district.accent }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {isComplete ? (
            <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">90-second overview complete</div>
              <div className="mt-1 text-[10px] leading-relaxed text-slate-400">
                Bạn đã đi qua toàn bộ 5 district. Từ đây recruiter có thể mở Quick View hoặc trả lại quyền lái để xem sâu khu mình quan tâm.
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!isComplete && (
              <button
                onClick={isPaused ? resumeTour : pauseTour}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-slate-200 transition hover:bg-white/[0.09]"
              >
                {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
              </button>
            )}

            {phase === 'hold' && !isComplete && (
              <button
                onClick={() => {
                  pauseTour();
                  setCardOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/[0.06]"
                style={{ borderColor: `${district.accent}55`, background: `${district.accent}12` }}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Xem chi tiết
              </button>
            )}

            <button
              onClick={() => {
                stopTour();
                setActiveMilestone(null);
                setCardOpen(false);
              }}
              className="ml-auto flex items-center gap-2 rounded-xl border border-red-300/15 bg-red-400/[0.05] px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-red-200 transition hover:bg-red-400/[0.1]"
            >
              <Square className="h-3.5 w-3.5" />
              {isComplete ? 'Free Drive' : 'Thoát tour'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
