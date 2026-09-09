import React from 'react';
import { useGameStore, ThemeMode } from '../../stores/useGameStore';
import { Volume2, VolumeX, Activity, Sun, Moon, Sparkles, Headphones, Eye, EyeOff } from 'lucide-react';
import { i18n } from '../../data/i18n';

export const HUD: React.FC = () => {
  const language = useGameStore((state) => state.language);
  const setLanguage = useGameStore((state) => state.setLanguage);
  const t = i18n[language];
  const theme = useGameStore((state) => state.theme);
  const setTheme = useGameStore((state) => state.setTheme);
  const activeMilestone = useGameStore((state) => state.activeMilestone);
  const visited = useGameStore((state) => state.visitedMilestones);
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

  const isLight = theme === 'light';
  const isNight = theme === 'night';

  // Dynamic Theme UI Classes
  const panelBg = isLight
    ? 'bg-white/85 text-slate-800 border-slate-300/90 shadow-md backdrop-blur-md'
    : isNight
    ? 'bg-black/85 text-cyan-300 border-cyan-500/50 shadow-[0_0_20px_rgba(0,243,255,0.2)] backdrop-blur-md'
    : 'bg-slate-900/90 text-slate-100 border-slate-800 backdrop-blur-md';

  const subTextColor = isLight
    ? 'text-slate-600'
    : isNight
    ? 'text-cyan-400/80'
    : 'text-slate-400';

  const navBtnHover = isLight
    ? 'text-slate-700 hover:text-cyan-700 hover:bg-slate-100'
    : isNight
    ? 'text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/60'
    : 'text-slate-300 hover:text-white hover:bg-slate-800';

  // If in Zen Focus Driving Mode, collapse all HUD panels and show only an unobtrusive restore button
  if (isZenMode) {
    return (
      <div className="pointer-events-none fixed inset-0 z-20 select-none font-mono">
        <div className="pointer-events-auto fixed top-4 right-4 z-50">
          <button
            onClick={toggleZenMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs tracking-wider uppercase transition-all backdrop-blur-md shadow-lg ${
              isNight
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:bg-cyan-900'
                : isLight
                ? 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-100'
                : 'bg-slate-900/90 border-slate-700 text-cyan-400 hover:bg-slate-800'
            }`}
            title={t.zenModeTitle}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.zenModeExpand}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 md:p-6 select-none font-mono">
      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        {/* Identity Plate */}
        <div className={`pointer-events-auto p-3 border ${panelBg}`}>
          <h1
            className={`text-xs md:text-sm tracking-widest font-bold uppercase ${
              isLight ? 'text-cyan-700' : 'text-cyan-400'
            }`}
          >
            {t.heroTitle}
          </h1>
          <p className={`text-[10px] md:text-[11px] ${subTextColor}`}>
            {t.heroSubtitle}
          </p>
        </div>

        {/* Top Action & Navigation Strip */}
        <div className="pointer-events-auto flex items-center gap-1.5 md:gap-2 flex-wrap">
          {/* Direct Category Nav */}
          <nav className={`hidden lg:flex items-center gap-1 p-1 border text-[11px] ${panelBg}`}>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-2.5 py-1 uppercase transition-colors ${navBtnHover}`}
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => handleNavClick('tech')}
              className={`px-2.5 py-1 uppercase transition-colors ${navBtnHover}`}
            >
              {t.navTech}
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              className={`px-2.5 py-1 uppercase transition-colors ${navBtnHover}`}
            >
              {t.navProjects}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-2.5 py-1 uppercase transition-colors ${navBtnHover}`}
            >
              {t.navContact}
            </button>
          </nav>

          {/* Natural VI / EN Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className={`px-2.5 py-1.5 border text-[10px] font-bold tracking-wider uppercase transition-all backdrop-blur-md ${
              language === 'vi'
                ? isLight
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-red-950/80 text-red-400 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                : isLight
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-blue-950/80 text-blue-400 border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
            }`}
            title="Chuyển đổi Ngôn ngữ / Switch Language"
          >
            🌐 {language === 'vi' ? 'TIẾNG VIỆT' : 'ENGLISH'}
          </button>

          {/* Quick View Button for Recruiters */}
          <button
            onClick={() => setQuickViewOpen(true)}
            className={`px-3 py-1.5 md:px-3.5 md:py-2 text-[11px] md:text-xs border uppercase tracking-wider backdrop-blur-md transition-colors ${
              isLight
                ? 'bg-cyan-50 hover:bg-cyan-100 border-cyan-400 text-cyan-800 font-bold shadow-sm'
                : isNight
                ? 'bg-cyan-950/80 hover:bg-cyan-900 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)] font-bold'
                : 'bg-cyan-950/70 hover:bg-cyan-900/80 border-cyan-500/40 text-cyan-300'
            }`}
          >
            {t.quickViewBtn}
          </button>

          {/* Procedural Lo-Fi Chill Radio */}
          <button
            onClick={toggleLofi}
            className={`flex items-center gap-1 px-2.5 py-1.5 border text-[10px] font-bold tracking-wider transition-all backdrop-blur-md ${
              lofiEnabled
                ? 'bg-purple-950/90 text-purple-300 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)] animate-pulse'
                : isLight
                ? 'bg-white/80 border-slate-300 text-slate-600 hover:text-purple-600'
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-purple-400'
            }`}
            title={t.lofiTitle}
          >
            <Headphones className={`w-3.5 h-3.5 ${lofiEnabled ? 'text-purple-300' : ''}`} />
            <span className="hidden sm:inline">{lofiEnabled ? t.lofiOn : t.lofiOff}</span>
          </button>

          {/* Sound Effects SFX Mute Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 md:p-2 border transition-colors backdrop-blur-md ${
              soundEnabled
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                : isLight
                ? 'bg-white/80 border-slate-300 text-slate-500 hover:text-slate-800'
                : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundEnabled ? t.soundOn : t.soundOff}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* 3-Segment Theme Switcher */}
          <div className={`flex items-center p-0.5 border text-[10px] font-bold ${panelBg}`}>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-2 py-1 transition-all ${
                theme === 'light'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-amber-500'
              }`}
              title="Daylight Clean Studio Mode"
            >
              <Sun className="w-3 h-3" />
              <span className="hidden sm:inline">{t.themeDay}</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-2 py-1 transition-all ${
                theme === 'dark'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Modern Dark Tech Mode"
            >
              <Moon className="w-3 h-3" />
              <span className="hidden sm:inline">{t.themeDark}</span>
            </button>
            <button
              onClick={() => setTheme('night')}
              className={`flex items-center gap-1 px-2 py-1 transition-all ${
                theme === 'night'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,243,255,0.5)]'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
              title="Cyberpunk Neon Night Mode"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">{t.themeNeon}</span>
            </button>
          </div>

          {/* Quality Mode Toggle (HD / LITE) */}
          <button
            onClick={() => setQuality(quality === 'high' ? 'low' : 'high')}
            className={`px-2 py-1 border text-[10px] font-bold transition-all backdrop-blur-md ${
              quality === 'high'
                ? isLight
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                  : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
            }`}
            title="Graphic Quality"
          >
            {quality === 'high' ? t.qualityHD : t.qualityLite}
          </button>

          {/* Focus Driving Zen Mode Toggle */}
          <button
            onClick={toggleZenMode}
            className={`flex items-center gap-1 px-2.5 py-1.5 border text-[10px] font-bold tracking-wider transition-all backdrop-blur-md ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 shadow-[0_0_8px_rgba(0,243,255,0.25)]'
            }`}
            title={t.zenModeTitle}
          >
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.zenModeCollapse}</span>
          </button>
        </div>
      </div>

      {/* Center Zone Interactive Banner */}
      {activeMilestone && (
        <button
          onClick={() => setCardOpen(true)}
          className={`self-center pointer-events-auto cursor-pointer animate-pulse px-5 py-2 border text-xs tracking-widest uppercase backdrop-blur-md transition-all hover:scale-105 shadow-xl ${
            isLight
              ? 'bg-white/95 border-cyan-600 text-cyan-800'
              : 'bg-slate-950/95 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(0,243,255,0.45)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span>
              {isMobile
                ? `📍 [${(t.districts as any)[activeMilestone]?.title || activeMilestone.toUpperCase()}] // ${t.inspectHintMobile}`
                : `${t.districtReached}: [${(t.districts as any)[activeMilestone]?.title || activeMilestone.toUpperCase()}] — ${t.inspectHintDesktop}`}
            </span>
          </div>
        </button>
      )}

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        {/* Desktop Driving Controls Guide */}
        <div className={`hidden md:flex flex-col gap-1 text-[11px] p-3.5 border ${panelBg}`}>
          <div
            className={`font-semibold mb-1 tracking-wider ${
              isLight ? 'text-cyan-700' : 'text-cyan-400'
            }`}
          >
            {t.controlsTitle}
          </div>
          <div>{t.drive}</div>
          <div className="text-amber-400 font-semibold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            {t.boost}
          </div>
          <div>{t.brake}</div>
          <div className="text-cyan-400">{t.reset}</div>
          <div className="text-emerald-400 font-semibold">{t.inspect}</div>
          <div className="text-purple-400 font-semibold">{t.toggleZen}</div>
        </div>

        {/* Right Telemetry Column: Exploration + FPS Monitor */}
        <div className="flex flex-col gap-2 items-end">
          {/* FPS Live Badge */}
          <div className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 border ${panelBg}`}>
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>RENDER:</span>
            <span className="text-emerald-500 font-bold">{fps} FPS</span>
          </div>

          {/* Landmarks Metric */}
          <div className={`text-right text-[11px] p-3 border ${panelBg}`}>
            <div className="tracking-wider">{t.landmarksVisited}</div>
            <div
              className={`font-bold text-sm ${
                isLight ? 'text-cyan-700' : 'text-cyan-300'
              }`}
            >
              {visited.length} / 5
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
