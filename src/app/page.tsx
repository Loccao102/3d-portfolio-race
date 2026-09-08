'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { OverlayUI } from '../components/ui/OverlayUI';
import { useGameStore } from '../stores/useGameStore';

// Dynamically import 3D Canvas with ssr: false to prevent SSR execution of WebGL, Rapier WASM, & Three.js
const SceneCanvas = dynamic(() => import('../components/three/SceneCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs font-mono tracking-widest text-cyan-400/80 uppercase">
          Initializing 3D Simulation...
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  const theme = useGameStore((state) => state.theme);

  const bgColor =
    theme === 'light'
      ? '#e2e8f0'
      : theme === 'dark'
      ? '#0f172a'
      : '#050811';

  return (
    <main
      className="relative w-screen h-screen overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      {/* 2D HTML/DOM UI Layer */}
      <OverlayUI />

      {/* 3D WebGL Canvas Viewport (Client-only) */}
      <SceneCanvas />
    </main>
  );
}
