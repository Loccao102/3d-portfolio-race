'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { OverlayUI } from '@/components/ui/OverlayUI';
import { ExperienceErrorBoundary } from '@/components/ui/ExperienceErrorBoundary';
import { useGameStore } from '@/stores/useGameStore';
import { getSceneLook } from '@/game/config/scene';

const GameCanvas = dynamic(() => import('@/game/rendering/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80">
          Initializing 3D Simulation...
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  const theme = useGameStore((state) => state.theme);
  const look = getSceneLook(theme);

  return (
    <main
      className="relative h-screen h-[100dvh] w-full select-none overflow-hidden overscroll-none transition-colors duration-500"
      style={{ backgroundColor: look.background }}
    >
      <OverlayUI />
      <ExperienceErrorBoundary>
        <GameCanvas />
      </ExperienceErrorBoundary>
    </main>
  );
}
