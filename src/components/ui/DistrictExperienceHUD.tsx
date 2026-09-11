'use client';

import React from 'react';
import { ArrowRight, BookOpen, Route } from 'lucide-react';
import { useGameStore, type MilestoneId } from '@/stores/useGameStore';
import {
  getDistrictExperience,
  getNextDistrictId,
  type DistrictExperienceId,
} from '@/game/features/portfolio/data/districtExperience';
import { useExperienceStore } from '@/game/features/portfolio/useExperienceStore';

const DISTRICT_IDS = new Set<MilestoneId>(['about', 'tech', 'projects', 'experiments', 'contact']);

export function DistrictExperienceHUD() {
  const mode = useExperienceStore((state) => state.mode);
  const activeMilestone = useGameStore((state) => state.activeMilestone);
  const isCardOpen = useGameStore((state) => state.isCardOpen);
  const isIntroFinished = useGameStore((state) => state.isIntroFinished);
  const setCardOpen = useGameStore((state) => state.setCardOpen);
  const setTargetWaypoint = useGameStore((state) => state.setTargetWaypoint);

  if (
    mode !== 'free' ||
    !isIntroFinished ||
    isCardOpen ||
    !activeMilestone ||
    !DISTRICT_IDS.has(activeMilestone)
  ) {
    return null;
  }

  const district = getDistrictExperience(activeMilestone as DistrictExperienceId);
  const nextId = getNextDistrictId(district.id);
  const next = getDistrictExperience(nextId);
  const isLast = district.id === 'contact';

  return (
    <div className="pointer-events-none fixed bottom-7 left-1/2 z-30 w-[min(92vw,640px)] -translate-x-1/2 px-3 md:bottom-8">
      <div
        className="pointer-events-auto overflow-hidden rounded-3xl border border-white/10 bg-[#07101b]/88 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
        style={{ boxShadow: `0 22px 80px rgba(0,0,0,.48), 0 0 36px ${district.accent}18` }}
      >
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${district.accent}, transparent)` }} />
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[8px] font-black uppercase tracking-[0.26em]" style={{ color: district.accent }}>
                {district.eyebrow}
              </div>
              <h2 className="mt-1 text-lg font-black tracking-[-0.02em] text-white md:text-xl">{district.title}</h2>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:block">
              Guided stop
            </div>
          </div>

          <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-slate-300 md:text-xs">{district.summary}</p>

          <div className="mt-3 flex items-center gap-2 text-[9px] text-slate-500">
            <Route className="h-3.5 w-3.5" style={{ color: district.accent }} />
            <span>{district.arrivalPrompt}</span>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setCardOpen(true)}
              className="flex flex-1 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left transition hover:bg-white/[0.1]"
            >
              <span>
                <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-white">Mở nội dung khu này</span>
                <span className="mt-0.5 block text-[8px] text-slate-500">Timeline, stack, case study hoặc contact</span>
              </span>
              <BookOpen className="h-4 w-4" style={{ color: district.accent }} />
            </button>

            <button
              onClick={() => setTargetWaypoint(isLast ? 'about' : next.id)}
              className="flex items-center justify-between gap-5 rounded-2xl border px-4 py-3 text-left transition hover:bg-white/[0.06] sm:min-w-[205px]"
              style={{ borderColor: `${district.accent}44`, background: `${district.accent}0d` }}
            >
              <span>
                <span className="block text-[8px] uppercase tracking-[0.14em] text-slate-500">{isLast ? 'Tiếp tục' : 'Điểm tiếp theo'}</span>
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-white">
                  {isLast ? 'Free Drive' : next.title.split(' / ')[0]}
                </span>
              </span>
              <ArrowRight className="h-4 w-4" style={{ color: district.accent }} />
            </button>
          </div>

          <div className="mt-3 text-[8px] leading-relaxed text-slate-600">{district.exitPrompt}</div>
        </div>
      </div>
    </div>
  );
}
