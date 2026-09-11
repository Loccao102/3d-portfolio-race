'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from '@/stores/useGameStore';
import { GameScene } from '../core/GameScene';
import { getMaxDpr, getSceneLook, SCENE_CAMERA } from '../config/scene';

/**
 * WebGL host only. This component owns renderer/browser concerns and delegates
 * scene content to GameScene.
 */
export default function GameCanvas() {
  const theme = useGameStore((state) => state.theme);
  const quality = useGameStore((state) => state.quality);
  const isMobile = useGameStore((state) => state.isMobile);
  const setIsMobile = useGameStore((state) => state.setIsMobile);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  const look = getSceneLook(theme);
  const dprMax = getMaxDpr(quality, isMobile);

  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        shadows={quality !== 'low'}
        dpr={[1, dprMax]}
        camera={SCENE_CAMERA}
        gl={{
          antialias: quality !== 'low',
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            'webglcontextlost',
            (event) => {
              event.preventDefault();
              console.warn('WebGL context lost - preventing crash.');
            },
            false,
          );
          gl.domElement.addEventListener(
            'webglcontextrestored',
            () => console.info('WebGL context restored.'),
            false,
          );
        }}
      >
        <color attach="background" args={[look.background]} />
        <fog attach="fog" args={[look.background, look.fogNear, look.fogFar]} />
        <Suspense fallback={null}>
          <GameScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
