import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/stores/useGameStore';

const SAMPLE_FRAMES = 60;
const LOW_FPS_THRESHOLD = 34;
const LOW_FPS_WINDOWS_BEFORE_DEGRADE = 4;

/** Runtime telemetry + conservative adaptive quality policy. */
export function PerformanceSystem() {
  const setFps = useGameStore((state) => state.setFps);
  const quality = useGameStore((state) => state.quality);
  const setQuality = useGameStore((state) => state.setQuality);
  const setRaceNotification = useGameStore((state) => state.setRaceNotification);

  const frameCount = useRef(0);
  const lastTime = useRef(typeof performance !== 'undefined' ? performance.now() : 0);
  const lowFpsCyclesRef = useRef(0);
  const pageVisibleRef = useRef(true);

  useEffect(() => {
    const updateVisibility = () => {
      pageVisibleRef.current = !document.hidden;
      frameCount.current = 0;
      lowFpsCyclesRef.current = 0;
      lastTime.current = performance.now();
    };
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useFrame(() => {
    if (!pageVisibleRef.current) return;
    frameCount.current += 1;
    if (frameCount.current < SAMPLE_FRAMES) return;

    const now = performance.now();
    const delta = Math.max(0.001, (now - lastTime.current) / 1000);
    const currentFps = Math.round(frameCount.current / delta);
    const cappedFps = Math.min(60, currentFps);
    setFps(cappedFps);

    // Deliberately conservative: one temporary shader/asset spike must not downgrade the whole session.
    if (cappedFps < LOW_FPS_THRESHOLD && quality === 'high') {
      lowFpsCyclesRef.current += 1;
      if (lowFpsCyclesRef.current >= LOW_FPS_WINDOWS_BEFORE_DEGRADE) {
        setQuality('low');
        setRaceNotification('PERFORMANCE MODE: DISTRICT DETAIL + SHADOWS REDUCED');
        window.setTimeout(() => setRaceNotification(null), 2800);
        lowFpsCyclesRef.current = 0;
      }
    } else if (cappedFps >= LOW_FPS_THRESHOLD + 8) {
      lowFpsCyclesRef.current = Math.max(0, lowFpsCyclesRef.current - 1);
    }

    frameCount.current = 0;
    lastTime.current = now;
  });

  return null;
}
