import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { ChevronRight } from 'lucide-react';

export const Intro: React.FC = () => {
  const isIntroFinished = useGameStore((state) => state.isIntroFinished);
  const setIntroFinished = useGameStore((state) => state.setIntroFinished);
  const [stage, setStage] = useState<number>(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Sequence timing
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => {
      setFading(true);
      setTimeout(() => setIntroFinished(true), 600);
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [setIntroFinished]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => setIntroFinished(true), 300);
  };

  if (isIntroFinished) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0d14] font-mono select-none transition-opacity duration-700 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      {/* Intro Content Container */}
      <div className="relative z-10 text-center px-6 max-w-xl space-y-4">
        {/* Name Reveal */}
        <div
          className={`transition-all duration-700 transform ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-[11px] tracking-[0.3em] text-cyan-400 uppercase font-semibold block mb-1">
            PORTFOLIO EXPERIENCE
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-widest text-slate-100 uppercase drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            CAO TIEN LOC
          </h1>
        </div>

        {/* Subtitle & Welcome */}
        <div
          className={`transition-all duration-700 delay-150 transform ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-xs md:text-sm text-slate-400 tracking-wider uppercase">
            CREATIVE TECHNOLOGIST // WEBGL ENGINEER
          </p>
          <p className="text-xs text-slate-500 pt-3">
            WELCOME TO MY MINIATURE CYBERPUNK DEV WORLD
          </p>
        </div>

        {/* Controls Instructions & Skip Button */}
        <div
          className={`pt-6 transition-all duration-700 delay-300 flex flex-col items-center gap-3 ${
            stage >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-[11px] text-cyan-300 font-semibold px-4 py-1.5 bg-cyan-950/40 border border-cyan-500/30 tracking-widest flex flex-col gap-0.5">
            <span>WASD / ARROWS / JOYSTICK TO DRIVE</span>
            <span className="text-[10px] text-amber-400 font-bold">[SHIFT] FOR NITRO BOOST</span>
          </div>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 uppercase tracking-wider transition-colors pt-2"
          >
            <span>Skip Intro</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

