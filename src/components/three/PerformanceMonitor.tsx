import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';

export const PerformanceMonitor: React.FC = () => {
  const setFps = useGameStore((state) => state.setFps);
  const quality = useGameStore((state) => state.quality);
  const setQuality = useGameStore((state) => state.setQuality);
  const setRaceNotification = useGameStore((state) => state.setRaceNotification);

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsCyclesRef = useRef(0);

  useFrame(() => {
    frameCount.current += 1;
    if (frameCount.current >= 45) {
      const now = performance.now();
      const delta = (now - lastTime.current) / 1000;
      const currentFps = Math.round(frameCount.current / delta);
      const cappedFps = Math.min(60, currentFps);
      setFps(cappedFps);

      // Adaptive Performance Monitoring:
      // If FPS drops below 32 for 3 consecutive measuring intervals (~3 seconds),
      // downgrade quality to maintain fluid interaction without overheating low-spec devices
      if (cappedFps < 32 && quality === 'high') {
        lowFpsCyclesRef.current += 1;
        if (lowFpsCyclesRef.current >= 3) {
          setQuality('low');
          setRaceNotification('ADAPTIVE PERFORMANCE: TUNED FOR SMOOTH 60 FPS');
          setTimeout(() => setRaceNotification(null), 2500);
          lowFpsCyclesRef.current = 0;
        }
      } else {
        lowFpsCyclesRef.current = 0;
      }

      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
};

