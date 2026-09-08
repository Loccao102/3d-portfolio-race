'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';
import { useGameStore } from '../../stores/useGameStore';

export const SceneCanvas: React.FC = () => {
  const theme = useGameStore((state) => state.theme);

  const bgColor =
    theme === 'light'
      ? '#e2e8f0'
      : theme === 'dark'
      ? '#0f172a'
      : '#050811';

  const fogNear = theme === 'light' ? 160 : theme === 'dark' ? 150 : 140;
  const fogFar = theme === 'light' ? 420 : theme === 'dark' ? 400 : 390;

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)]}
        camera={{
          position: [0, 20, 28],
          fov: 46,
          near: 0.5,
          far: 450,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Dynamic Sky Color & Distant Soft Fog for 3 themes */}
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, fogNear, fogFar]} />
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneCanvas;
