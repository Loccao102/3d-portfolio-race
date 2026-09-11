import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/stores/useGameStore';

/** Runtime telemetry + adaptive quality policy. Kept outside rendering composition. */
export function PerformanceSystem() {
  const setFps = useGameStore((state) => state.setFps);
  const quality = useGameStore((state) => state.quality);
  const setQuality = useGameStore((state) => state.setQuality);
  const setRaceNotification = useGameStore((state) => state.setRaceNotification);

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsCyclesRef = useRef(0);

  useFrame(() => {
    frameCount.current += 1;
    if (frameCount.current < 45) return;

    const now = performance.now();
    const delta = (now - lastTime.current) / 1000;
    const currentFps = Math.round(frameCount.current / delta);
    const cappedFps = Math.min(60, currentFps);
    setFps(cappedFps);

    if (cappedFps < 32 && quality === 'high') {
      lowFpsCyclesRef.current += 1;
      if (lowFpsCyclesRef.current >= 3) {
        setQuality('low');
        setRaceNotification('ADAPTIVE PERFORMANCE: TUNED FOR SMOOTH 60 FPS');
        window.setTimeout(() => setRaceNotification(null), 2500);
        lowFpsCyclesRef.current = 0;
      }
    } else {
      lowFpsCyclesRef.current = 0;
    }

    frameCount.current = 0;
    lastTime.current = now;
  });

  return null;
}
