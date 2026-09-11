import React from 'react';
import {
  Activity,
  Eye,
  EyeOff,
  Headphones,
  Moon,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useGameStore, type ThemeMode } from '../../stores/useGameStore';
import { i18n } from '../../data/i18n';

const NAV_ITEMS: Array<{
  id: 'about' | 'tech' | 'projects' | 'experiments' | 'contact';
  labelVi: string;
  labelEn: string;
}> = [
  { id: 'about', labelVi: 'Về tôi', labelEn: 'About' },
  { id: 'tech', labelVi: 'Công nghệ', labelEn: 'Tech' },
  { id: 'projects', labelVi: 'Dự án', labelEn: 'Projects' },
  { id: 'experiments', labelVi: 'Thử nghiệm', labelEn: 'Experiments' },
  { id: 'contact', labelVi: 'Kết nối', labelEn: 'Contact' },
];

export const HUD: React.FC = () => {
  const language = useGameStore((state) => state.language);
  const setLanguage = useGameStore((state) => state.setLanguage);
  const t = i18n[language];
  const theme = useGameStore((state) => state.theme);
  const setTheme = useGameStore((state) => state.setTheme);
  const activeMilestone = useGameStore((state) => state.activeMilestone);
  const setCardOpen = useGameStore((state) => state.setCardOpen);
  const setQuickViewOpen = useGameStore((state) => state.setQuickViewOpen);
  const setQuickViewTab = useGameStore((state) => state.setQuickViewTab);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const lofiEnabled = useGameStore((state) => state.lofiEnabled);
  const toggleLofi = useGameStore((state) => state.toggleLofi);
  const isZenMode = useGameStore((state) => state.isZenMode);
  const toggleZenMode = useGameStore((state) => state.toggleZenMode);
  const quality = useGameStore((state) => state.quality);
  const setQuality = useGameStore((state) => state.setQuality);
  const isMobile = useGameStore((state) => state.isMobile);
  const fps = useGameStore((state) => state.fps);

  const handleNavClick = (tab: 'about' | 'tech' | 'projects' | 'experiments' | 'contact') => {
    setQuickViewTab(tab);
    setQuickViewOpen(true);
  };

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'night'];
    const current = modes.indexOf(theme);
    setTheme(modes[(current + 1) % modes.length]);
  };

  const isLight = theme === 'light';
  const isNight = theme === 'night';
  const glass = isLight
    ? 'border-slate-300/70 bg-white/74 text-slate-900 shadow-[0_18px_55px_rgba(15,23,42,0.14)]'
    : 'border-white/10 bg-[#07101b]/72 text-white shadow-[0_18px_60px_rgba(0,0,0,0.36)]';
  const muted = isLight ? 'text-slate-500' : 'text-slate-400';
  const softButton = isLight
    ? 'border-slate-300/70 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-950'
    : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100';

  if (isZenMode) {
    return (
      <div className="pointer-events-none fixed inset-0 z-20 select-none">
        <button
          onClick={toggleZenMode}
          className={`pointer-events-auto fixed right-5 top-5 flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-xl transition ${glass}`}
          title={t.zenModeTitle}
        >
          <Eye className="h-3.5 w-3.5 text-cyan-400" />
          HUD
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-20 select-none px-4 py-4 md:px-6 md:py-5">
      {/* Identity: portfolio first, game UI second. */}
      <div className={`pointer-events-auto absolute left-4 top-4 rounded-2xl border px-4 py-3 backdrop-blur-2xl md:left-6 md:top-5 ${glass}`}>
        <div className="flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-amber-300/30 bg-gradient-to-br from-amber-300/20 via-cyan-300/10 to-fuchsia-400/10">
            <span className="text-xs font-black tracking-tight">CL</span>
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          </div>
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.26em] text-amber-400">Vietnam • Developer</div>
            <div className="mt-0.5 text-sm font-black tracking-[0.04em]">CAO TIẾN LỘC</div>
            <div className={`text-[9px] uppercase tracking-[0.14em] ${muted}`}>Backend × Creative 3D Web</div>
          </div>
        </div>
      </div>

      {/* Compact primary navigation. */}
      <nav className={`pointer-events-auto absolute left-1/2 top-5 hidden -translate-x-1/2 items-center gap-1 rounded-full border p-1.5 backdrop-blur-2xl lg:flex ${glass}`}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className="rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            {language === 'vi' ? item.labelVi : item.labelEn}
          </button>
        ))}
      </nav>

      {/* Utility controls deliberately de-emphasized. */}
      <div className="pointer-events-auto absolute right-4 top-4 flex max-w-[52vw] flex-wrap justify-end gap-1.5 md:right-6 md:top-5">
        <button
          onClick={() => setQuickViewOpen(true)}
          className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-cyan-200 backdrop-blur-xl transition hover:bg-cyan-300/20"
        >
          {t.quickViewBtn}
        </button>
        <button onClick={cycleTheme} className={`grid h-8 w-8 place-items-center rounded-full border backdrop-blur-xl transition ${softButton}`} title="Theme">
          {theme === 'light' ? <Sun className="h-3.5 w-3.5" /> : theme === 'night' ? <Sparkles className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          className={`h-8 rounded-full border px-2.5 text-[9px] font-black tracking-[0.14em] backdrop-blur-xl transition ${softButton}`}
        >
          {language === 'vi' ? 'VI' : 'EN'}
        </button>
        <button onClick={toggleSound} className={`grid h-8 w-8 place-items-center rounded-full border backdrop-blur-xl transition ${softButton}`} title="Sound">
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={toggleLofi}
          className={`grid h-8 w-8 place-items-center rounded-full border backdrop-blur-xl transition ${
            lofiEnabled ? 'border-fuchsia-300/40 bg-fuchsia-300/15 text-fuchsia-200' : softButton
          }`}
          title={t.lofiTitle}
        >
          <Headphones className="h-3.5 w-3.5" />
        </button>
        <button onClick={toggleZenMode} className={`grid h-8 w-8 place-items-center rounded-full border backdrop-blur-xl transition ${softButton}`} title={t.zenModeTitle}>
          <EyeOff className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Destination prompt floats low so the world remains visible. */}
      {activeMilestone && (
        <button
          onClick={() => setCardOpen(true)}
          className={`pointer-events-auto absolute bottom-20 left-1/2 -translate-x-1/2 rounded-2xl border px-4 py-2.5 text-left backdrop-blur-2xl transition hover:-translate-y-0.5 ${glass}`}
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-cyan-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
            </span>
            <div>
              <div className="text-[8px] font-semibold uppercase tracking-[0.22em] text-cyan-300">District discovered</div>
              <div className="text-[11px] font-black uppercase tracking-[0.13em]">
                {(t.districts as any)[activeMilestone]?.title || activeMilestone}
              </div>
            </div>
            <div className={`ml-2 text-[8px] uppercase tracking-[0.14em] ${muted}`}>
              {isMobile ? 'tap to open' : 'E / click'}
            </div>
          </div>
        </button>
      )}

      {/* Driving hint and performance status. */}
      <div className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 md:bottom-5">
        <div className={`rounded-full border px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl ${glass}`}>
          <span className="text-white/80">WASD</span>
          <span className="mx-2 opacity-30">•</span>
          <span className="text-amber-300">Shift Nitro</span>
          <span className="mx-2 hidden opacity-30 sm:inline">•</span>
          <span className={`hidden sm:inline ${muted}`}>Drive • explore • discover</span>
        </div>
      </div>

      <button
        onClick={() => setQuality(quality === 'high' ? 'low' : 'high')}
        className={`pointer-events-auto absolute bottom-4 right-4 flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] backdrop-blur-xl transition md:bottom-5 md:right-6 ${softButton}`}
        title="Render quality"
      >
        <Activity className="h-3 w-3" />
        <span>{Math.round(fps)} fps</span>
        <span className={isNight ? 'text-cyan-300' : ''}>{quality}</span>
      </button>
    </div>
  );
};
