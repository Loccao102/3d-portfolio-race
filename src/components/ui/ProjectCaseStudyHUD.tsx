'use client';

import React from 'react';
import { ChevronRight, Network, Scale, Trophy } from 'lucide-react';
import { projectsData } from '@/data/projects';
import { useGameStore } from '@/stores/useGameStore';
import { getProjectEngineeringStory } from '@/game/features/portfolio/data/projectCaseStudy';

export function ProjectCaseStudyHUD() {
  const activeMilestone = useGameStore((state) => state.activeMilestone);
  const selectedProjectId = useGameStore((state) => state.selectedProjectId);
  const setSelectedProject = useGameStore((state) => state.setSelectedProject);
  const setCardOpen = useGameStore((state) => state.setCardOpen);

  if (activeMilestone !== 'projects') return null;

  const currentIndex = Math.max(0, projectsData.findIndex((project) => project.id === selectedProjectId));
  const project = projectsData[currentIndex] ?? projectsData[0];
  const story = getProjectEngineeringStory(project);

  const nextProject = () => {
    const next = projectsData[(currentIndex + 1) % projectsData.length];
    setSelectedProject(next.id);
  };

  return (
    <aside className="pointer-events-auto fixed bottom-6 left-6 z-30 hidden w-[330px] overflow-hidden rounded-3xl border border-white/10 bg-[#060b13]/88 shadow-[0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-xl lg:block">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[8px] font-black uppercase tracking-[0.28em] text-emerald-300">Interactive case study</div>
            <div className="mt-1 text-sm font-black leading-tight text-white">{project.title}</div>
          </div>
          <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-[8px] font-black text-emerald-200">
            {project.bayNumber}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4">
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
          <Trophy className="h-4 w-4 text-amber-300" />
          <div className="mt-2 text-xl font-black text-white">{story.metric}</div>
          <div className="text-[8px] uppercase tracking-[0.12em] text-slate-500">{story.metricLabel}</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
          <Network className="h-4 w-4 text-cyan-300" />
          <div className="mt-2 text-[9px] font-bold leading-relaxed text-slate-200">{story.scale}</div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="rounded-2xl border border-violet-300/10 bg-violet-300/[0.04] p-3">
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.18em] text-violet-300">
            <Scale className="h-3.5 w-3.5" /> Engineering trade-off
          </div>
          <p className="mt-2 text-[9px] leading-relaxed text-slate-400">{story.tradeoff}</p>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setCardOpen(true)}
            className="flex-1 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-emerald-100 transition hover:bg-emerald-300/20"
          >
            Deep dive
          </button>
          <button
            onClick={nextProject}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-slate-300 transition hover:bg-white/[0.08]"
          >
            Next bay <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
