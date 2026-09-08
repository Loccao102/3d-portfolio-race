import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';

export const MobileJoystick: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const setJoystickInput = useGameStore((state) => state.setJoystickInput);
  const [active, setActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);
  const basePosRef = useRef({ x: 0, y: 0 });

  const RADIUS = 48; // Max movement radius in px

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      basePosRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    setActive(true);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          const deltaX = touch.clientX - basePosRef.current.x;
          const deltaY = touch.clientY - basePosRef.current.y;
          const dist = Math.hypot(deltaX, deltaY);
          const angle = Math.atan2(deltaY, deltaX);

          const clampedDist = Math.min(dist, RADIUS);
          const moveX = Math.cos(angle) * clampedDist;
          const moveY = Math.sin(angle) * clampedDist;

          if (knobRef.current) {
            knobRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
          }

          // Normalized outputs: X = steering (-1 to 1), Y = throttle (forward positive)
          const normX = clampedDist > 6 ? moveX / RADIUS : 0;
          const normY = clampedDist > 6 ? -moveY / RADIUS : 0;
          setJoystickInput({ x: normX, y: normY });
          break;
        }
      }
    },
    [setJoystickInput]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          setActive(false);
          if (knobRef.current) {
            knobRef.current.style.transform = 'translate(0px, 0px)';
          }
          setJoystickInput({ x: 0, y: 0 });
          break;
        }
      }
    },
    [setJoystickInput]
  );

  useEffect(() => {
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      className="md:hidden fixed bottom-8 left-8 w-28 h-28 rounded-full bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center touch-none z-30 select-none shadow-[0_0_20px_rgba(0,243,255,0.15)]"
    >
      <div
        ref={knobRef}
        className={`w-12 h-12 rounded-full border border-cyan-400 bg-cyan-500/30 transition-transform duration-75 flex items-center justify-center ${
          active ? 'bg-cyan-400/50 shadow-[0_0_15px_#00f3ff]' : ''
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-cyan-300" />
      </div>
    </div>
  );
};

