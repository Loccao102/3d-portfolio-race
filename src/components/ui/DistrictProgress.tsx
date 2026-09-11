'use client';

import React from 'react';
import { useGameStore, type MilestoneId } from '@/stores/useGameStore';

const DISTRICTS: Array<{ id: MilestoneId; short: string; accent: string }> = [
  { id: 'about', short: 'ABOUT', accent: '#f59e0b' },
  { id: 'tech', short: 'TECH', accent: '#22d3ee' },
  { id: 'projects', short: 'PROJECTS', accent: '#fb7185' },
  { id: 'experiments', short: 'LAB', accent: '#a855f7' },
  { id: 'contact', short: 'CONTACT', accent: '#38bdf8' },
];

export function DistrictProgress() {
  const activeMilestone = useGameStore((state) => state.activeMilestone);
  const visitedMilestones = useGameStore((state) => state.visitedMilestones);
  const setTargetWaypoint = useGameStore((state) => state.setTargetWaypoint);
  const isZenMode = useGameStore((state) => state.isZenMode);

  if (isZenMode) return null;

  const completed = DISTRICTS.filter((district) => visitedMilestones.includes(district.id)).length;

  return (
    <aside className="pointer-events-auto fixed right-4 top-24 z-30 hidden w-[168px] rounded-2xl border border-white/10 bg-slate-950/58 p-3 text-white shadow-2xl backdrop-blur-xl xl:block">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.26em] text-slate-400">Explore</div>
          <div className="mt-0.5 text-xs font-semibold text-slate-100">Portfolio City</div>
        </div>
        <div className="text-[10px] font-bold text-cyan-300">{completed}/5</div>
      </div>

      <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-fuchsia-400 transition-all duration-500"
          style={{ width: `${(completed / DISTRICTS.length) * 100}%` }}
        />
      </div>

      <div className="space-y-1.5">
        {DISTRICTS.map((district) => {
          const visited = visitedMilestones.includes(district.id);
          const active = activeMilestone === district.id;
          return (
            <button
              key={district.id}
              type="button"
              onClick={() => setTargetWaypoint(district.id)}
              className={`group flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all ${
                active
                  ? 'border-white/20 bg-white/10'
                  : 'border-transparent bg-white/[0.025] hover:border-white/10 hover:bg-white/[0.07]'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full transition-transform ${active ? 'scale-125' : 'scale-100'}`}
                style={{
                  backgroundColor: visited ? district.accent : 'rgba(148,163,184,0.38)',
                  boxShadow: active ? `0 0 14px ${district.accent}` : undefined,
                }}
              />
              <span className={`flex-1 text-[9px] font-bold tracking-[0.14em] ${visited ? 'text-slate-100' : 'text-slate-500'}`}>
                {district.short}
              </span>
              <span className={`text-[9px] ${visited ? 'text-emerald-300' : 'text-slate-600'}`}>
                {visited ? '✓' : '○'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-white/8 pt-2 text-[8px] leading-relaxed text-slate-500">
        Click a district to update the navigation target.
      </div>
    </aside>
  );
}
