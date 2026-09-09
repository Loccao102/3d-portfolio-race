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

  const setMobileAction = useGameStore((state) => state.setMobileAction);
  const mobileActions = useGameStore((state) => state.mobileActions);
  const activeMilestone = useGameStore((state) => state.activeMilestone);
  const setCardOpen = useGameStore((state) => state.setCardOpen);

  return (
    <>
      {/* Left-side Virtual Analog Steering Joystick */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        className="md:hidden fixed bottom-8 left-6 w-28 h-28 rounded-full bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center touch-none z-30 select-none shadow-[0_0_20px_rgba(0,243,255,0.15)]"
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

      {/* Right-side Mobile Touch Action Buttons */}
      <div className="md:hidden fixed bottom-8 right-6 z-30 flex flex-col items-end gap-3 pointer-events-auto select-none touch-none font-mono">
        {/* District Detail Open Button (Only when near district) */}
        {activeMilestone && (
          <button
            onTouchStart={(e) => {
              e.stopPropagation();
              setCardOpen(true);
            }}
            onClick={() => setCardOpen(true)}
            className="px-3 py-1.5 bg-cyan-950/90 border border-cyan-400 text-cyan-300 text-xs font-bold rounded-md shadow-[0_0_15px_rgba(0,243,255,0.5)] animate-bounce flex items-center gap-1.5"
          >
            <span>📄</span>
            <span>XEM DỰ ÁN</span>
          </button>
        )}

        {/* Action Button Row: Reset, Brake, Nitro */}
        <div className="flex items-center gap-2.5">
          {/* Quick Track Reset / Respawn */}
          <button
            onTouchStart={() => {
              setMobileAction('reset', true);
              setTimeout(() => setMobileAction('reset', false), 200);
            }}
            className="w-11 h-11 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold flex items-center justify-center active:scale-90 active:bg-cyan-950 shadow-md"
            title="Reset Vehicle"
          >
            ↺
          </button>

          {/* Handbrake / Reverse */}
          <button
            onTouchStart={() => setMobileAction('brake', true)}
            onTouchEnd={() => setMobileAction('brake', false)}
            className={`w-13 h-13 px-3 py-2.5 rounded-full border text-xs font-bold flex items-center justify-center transition-transform active:scale-95 shadow-md ${
              mobileActions.brake
                ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
            }`}
            title="Brake"
          >
            🛑 PHANH
          </button>

          {/* Nitro Turbo Boost */}
          <button
            onTouchStart={() => setMobileAction('boost', true)}
            onTouchEnd={() => setMobileAction('boost', false)}
            className={`w-16 h-16 rounded-full border-2 text-xs font-bold flex flex-col items-center justify-center transition-transform active:scale-95 ${
              mobileActions.boost
                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.9)] scale-105'
                : 'bg-amber-950/80 border-amber-400/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
            }`}
            title="Nitro Boost"
          >
            <span className="text-base leading-none">⚡</span>
            <span className="text-[9px] tracking-wider leading-none mt-0.5">NITRO</span>
          </button>
        </div>
      </div>
    </>
  );
};

