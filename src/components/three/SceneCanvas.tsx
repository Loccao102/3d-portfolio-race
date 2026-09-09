'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';
import { useGameStore } from '../../stores/useGameStore';

export const SceneCanvas: React.FC = () => {
  const theme = useGameStore((state) => state.theme);
  const quality = useGameStore((state) => state.quality);
  const isMobile = useGameStore((state) => state.isMobile);
  const setIsMobile = useGameStore((state) => state.setIsMobile);

  useEffect(() => {
    const checkMobile = () => {
      const isMob =
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
      setIsMobile(isMob);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  const bgColor =
    theme === 'light'
      ? '#e2e8f0'
      : theme === 'dark'
      ? '#0f172a'
      : '#050811';

  const fogNear = theme === 'light' ? 160 : theme === 'dark' ? 150 : 140;
  const fogFar = theme === 'light' ? 420 : theme === 'dark' ? 400 : 390;

  // Clamped Adaptive DPR: saves 50%+ fillrate on high-DPI phones / low-spec GPUs
  const dprMax = quality === 'low' ? 1 : isMobile ? 1.2 : 1.5;

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows={quality !== 'low'}
        dpr={[1, dprMax]}
        camera={{
          position: [0, 20, 28],
          fov: 46,
          near: 0.5,
          far: 450,
        }}
        gl={{
          antialias: quality !== 'low',
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('WebGL context lost - preventing crash.');
          }, false);
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context successfully restored.');
          }, false);
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
