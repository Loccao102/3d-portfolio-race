import React, { useEffect, useState } from 'react';
import { Car, ChevronRight, TimerReset } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { useExperienceStore } from '@/game/features/portfolio/useExperienceStore';

export const Intro: React.FC = () => {
  const isIntroFinished = useGameStore((state) => state.isIntroFinished);
  const setIntroFinished = useGameStore((state) => state.setIntroFinished);
  const setIsRacing = useGameStore((state) => state.setIsRacing);
  const startTour = useExperienceStore((state) => state.startTour);
  const [stage, setStage] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 220);
    const t2 = setTimeout(() => setStage(2), 900);
    const t3 = setTimeout(() => setStage(3), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const finishIntro = (tour: boolean) => {
    if (tour) {
      setIsRacing(false);
      startTour();
    }
    setFading(true);
    setTimeout(() => setIntroFinished(true), 320);
  };

  if (isIntroFinished) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#05080d] select-none transition-opacity duration-700 ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(245,158,11,0.17),transparent_28%),radial-gradient(circle_at_22%_75%,rgba(34,211,238,0.12),transparent_32%),linear-gradient(135deg,#05080d_10%,#0a111d_55%,#05070b_100%)]" />
      <div className="absolute left-[-10%] top-[18%] h-px w-[65%] rotate-[-8deg] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
      <div className="absolute bottom-[22%] right-[-10%] h-px w-[70%] rotate-[7deg] bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-10">
        <div className="grid items-end gap-10 md:grid-cols-[1.22fr_0.78fr]">
          <div>
            <div
              className={`transition-all duration-700 ${
                stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              <div className="mb-5 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.34em] text-amber-300">
                <span className="h-px w-10 bg-amber-300/70" />
                built in vietnam • interactive portfolio
              </div>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.9] tracking-[-0.055em] text-white md:text-7xl">
                CAO TIẾN
                <br />
                <span className="bg-gradient-to-r from-amber-200 via-white to-cyan-200 bg-clip-text text-transparent">LỘC.</span>
              </h1>
            </div>

            <div
              className={`mt-6 max-w-xl transition-all delay-100 duration-700 ${
                stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <p className="text-sm font-medium leading-relaxed text-slate-300 md:text-base">
                Backend developer building reliable systems — and occasionally turning them into places you can drive through.
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                ASP.NET Core • React • realtime systems • AI experiments
              </p>
            </div>
          </div>

          <div
            className={`transition-all delay-200 duration-700 ${
              stage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
              <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-cyan-300">Choose your visit</div>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                Recruiter có thể xem toàn bộ điểm chính trong 90 giây. Muốn tự khám phá thì lái xe tự do như trước.
              </p>

              <button
                onClick={() => finishIntro(true)}
                className="mt-5 flex w-full items-center justify-between rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-left transition hover:bg-cyan-300/18"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    <TimerReset className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100">90s Recruiter Tour</span>
                    <span className="mt-0.5 block text-[8px] text-cyan-200/50">Xe tự chạy • cinematic stops • recruiter highlights</span>
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-cyan-200" />
              </button>

              <button
                onClick={() => finishIntro(false)}
                className="mt-2 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:bg-white/[0.06]"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.05] text-slate-300">
                    <Car className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-white">Explore freely</span>
                    <span className="mt-0.5 block text-[8px] text-slate-500">WASD drive • SHIFT nitro • guided district prompts</span>
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[9px] uppercase tracking-[0.12em] text-slate-500">
                <div className="rounded-xl border border-white/8 bg-black/15 px-3 py-2">5 districts</div>
                <div className="rounded-xl border border-white/8 bg-black/15 px-3 py-2">real case studies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
