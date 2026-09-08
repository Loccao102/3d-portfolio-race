import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';

export const PerformanceMonitor: React.FC = () => {
  const setFps = useGameStore((state) => state.setFps);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current += 1;
    if (frameCount.current >= 45) {
      const now = performance.now();
      const delta = (now - lastTime.current) / 1000;
      const currentFps = Math.round(frameCount.current / delta);
      setFps(Math.min(60, currentFps));
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
};

