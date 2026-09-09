import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { developerData } from '../../data/developer';
import { projectsData } from '../../data/projects';
import { X, ExternalLink, Github, Mail, Linkedin, Terminal, Sparkles, Server, CheckCircle2, Phone, MapPin, GraduationCap, Languages } from 'lucide-react';
import { i18n } from '../../data/i18n';

export const MilestoneCard: React.FC = () => {
  const language = useGameStore((state) => state.language);
  const t = i18n[language];
  const activeMilestone = useGameStore((state) => state.activeMilestone);
  const isCardOpen = useGameStore((state) => state.isCardOpen);
  const setCardOpen = useGameStore((state) => state.setCardOpen);
  const selectedProjectId = useGameStore((state) => state.selectedProjectId);
  const setSelectedProject = useGameStore((state) => state.setSelectedProject);
  const theme = useGameStore((state) => state.theme);

  const [displayedMilestone, setDisplayedMilestone] = React.useState<typeof activeMilestone>(activeMilestone);

  React.useEffect(() => {
    if (activeMilestone) {
      setDisplayedMilestone(activeMilestone);
    }
  }, [activeMilestone]);

  // Keyboard shortcut listener: [E] toggles or inspects, [ESC] closes
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCardOpen(false);
      } else if (e.key === 'e' || e.key === 'E') {
        if (isCardOpen) {
          setCardOpen(false);
        } else if (activeMilestone) {
          setCardOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMilestone, isCardOpen, setCardOpen]);

  if (!isCardOpen || !displayedMilestone) return null;

  const isLight = theme === 'light';
  const isNight = theme === 'night';

  const panelBg = isLight
    ? 'bg-white/95 text-slate-800 border-slate-200 shadow-2xl backdrop-blur-xl'
    : isNight
    ? 'bg-[#040814]/95 text-cyan-100 border-cyan-500/40 shadow-[0_0_40px_rgba(0,243,255,0.25)] backdrop-blur-xl'
    : 'bg-slate-900/95 text-slate-100 border-slate-800 shadow-2xl backdrop-blur-xl';

  const headerBg = isLight
    ? 'border-slate-200 bg-slate-50/90'
    : isNight
    ? 'border-cyan-900/60 bg-cyan-950/40'
    : 'border-slate-800 bg-slate-950/60';

  const cardBox = isLight
    ? 'bg-slate-50 border border-slate-200 text-slate-700'
    : isNight
    ? 'bg-slate-950/80 border border-cyan-500/30 text-slate-300 shadow-[0_0_15px_rgba(0,243,255,0.05)]'
    : 'bg-slate-950/70 border border-slate-800 text-slate-300';

  const tagPill = isLight
    ? 'bg-slate-100 text-slate-700 border border-slate-300'
    : isNight
    ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/40'
    : 'bg-slate-900 text-slate-300 border border-slate-700';

  const subText = isLight ? 'text-slate-500' : 'text-slate-400';
  const bodyText = isLight ? 'text-slate-700' : 'text-slate-300';

  const footerBg = isLight
    ? 'border-slate-200 bg-slate-50/90 text-slate-500'
    : isNight
    ? 'border-cyan-900/60 bg-black/60 text-slate-400'
    : 'border-slate-800 bg-slate-950/60 text-slate-400';

  const primaryBtn = isLight
    ? 'bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-sm'
    : isNight
    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,243,255,0.5)]'
    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40';

  // Render content based on current district
  const renderDistrictContent = () => {
    switch (displayedMilestone) {
      case 'about':
        return (
          <div className="space-y-4">
            <div className={`border-l-2 ${isLight ? 'border-cyan-600' : 'border-cyan-400'} pl-3`}>
              <h3 className={`font-bold text-sm tracking-wider uppercase ${isLight ? 'text-cyan-800' : 'text-cyan-400'}`}>
                {t.whoIsLoc}
              </h3>
              <p className={`text-xs ${subText}`}>{developerData.role}</p>
            </div>

            <div className={`space-y-2 text-xs leading-relaxed ${bodyText}`}>
              {developerData.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Key Engineering Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {developerData.stats.map((s, i) => (
                <div key={i} className={`p-2 border ${cardBox} text-center`}>
                  <div className={`text-xs font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>{s.value}</div>
                  <div className={`text-[9px] uppercase tracking-wider ${subText}`}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Career Timeline */}
            <div className="pt-2">
              <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${subText}`}>
                {t.careerTimeline}
              </h4>
              <div className="space-y-2.5">
                {developerData.experience.map((exp, i) => (
                  <div key={i} className={`p-2.5 border ${cardBox}`}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{exp.role}</span>
                      <span className={`text-[9px] font-mono ${subText}`}>{exp.period}</span>
                    </div>
                    <div className="text-[11px] font-medium text-cyan-400 mb-1.5">{exp.company}</div>
                    <ul className={`space-y-1 text-[11px] ${bodyText}`}>
                      {exp.highlights.map((h, hi) => (
                        <li key={hi} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 mt-0.5">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${subText}`}>
                {t.primaryFocus}
              </h4>
              <ul className={`space-y-1.5 text-xs ${bodyText}`}>
                {developerData.focus.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-cyan-600' : 'bg-cyan-400'}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education & Academic Foundation */}
            <div className="pt-2">
              <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${subText}`}>
                HỌC VẤN & NỀN TẢNG KỸ THUẬT
              </h4>
              <div className={`p-2.5 border ${cardBox} space-y-1`}>
                <div className="flex items-center gap-2">
                  <GraduationCap className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{developerData.education.school}</span>
                </div>
                <div className={`text-[11px] ${subText}`}>
                  {developerData.education.major} • {developerData.education.period} ({developerData.education.degree})
                </div>
              </div>
            </div>

            {/* Foreign Languages */}
            <div className="pt-1">
              <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${subText}`}>
                NGOẠI NGỮ
              </h4>
              <div className="flex flex-wrap gap-2">
                {developerData.languages.map((lang, idx) => (
                  <div key={idx} className={`px-2.5 py-1 text-[11px] border ${cardBox} flex items-center gap-1.5`}>
                    <Languages className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang.name}: <strong>{lang.level}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`pt-2 flex items-center justify-between text-[11px] border-t ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'}`}>
              <span>{t.locationLabel}</span>
              <span className={isLight ? 'text-cyan-700 font-bold' : 'text-cyan-400 font-medium'}>{t.availableLabel}</span>
            </div>
          </div>
        );

      case 'tech':
        return (
          <div className="space-y-4">
            <div className={`border-l-2 ${isLight ? 'border-amber-600' : 'border-amber-400'} pl-3`}>
              <h3 className={`font-bold text-sm tracking-wider uppercase ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                SYSTEM ARCHITECTURE & TECH MATRIX
              </h3>
              <p className={`text-xs ${subText}`}>Data Center & Engineering Competencies</p>
            </div>

            <div className="space-y-3">
              {developerData.skills.map((group, idx) => (
                <div key={idx} className={`p-2.5 ${cardBox}`}>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold mb-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    <Server className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                    <span>{group.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className={`px-2 py-1 text-[11px] ${tagPill}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects': {
        const activeProject =
          projectsData.find((p) => p.id === selectedProjectId) || projectsData[0];
        return (
          <div className="space-y-4">
            {/* Bay Switcher */}
            <div className={`flex gap-2 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              {projectsData.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProject(proj.id)}
                  className={`px-2.5 py-1 text-xs font-mono transition-colors ${
                    activeProject.id === proj.id
                      ? isLight
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : isNight
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : isLight
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {proj.bayNumber}
                </button>
              ))}
            </div>

            <div className={`border-l-2 ${isLight ? 'border-emerald-600' : 'border-emerald-400'} pl-3`}>
              <h3 className={`font-bold text-sm tracking-wider uppercase ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                {activeProject.title}
              </h3>
              <p className={`text-xs ${subText}`}>{activeProject.subtitle}</p>
            </div>

            <div className={`text-xs italic p-2 ${cardBox}`}>
              "{activeProject.tagline}"
            </div>

            {/* Problem & Solution Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div>
                <span className={`font-semibold uppercase text-[11px] block mb-0.5 ${isLight ? 'text-red-700' : 'text-red-400'}`}>
                  {t.problemLabel}
                </span>
                <p className={`leading-relaxed ${subText}`}>{activeProject.problem}</p>
              </div>

              <div>
                <span className={`font-semibold uppercase text-[11px] block mb-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  {t.solutionLabel}
                </span>
                <p className={`leading-relaxed ${bodyText}`}>{activeProject.solution}</p>
              </div>
            </div>

            {/* Key Engineering Decisions */}
            <div className={`p-2.5 ${cardBox}`}>
              <span className={`font-semibold uppercase text-[10px] tracking-wider block mb-1.5 ${subText}`}>
                {t.decisionsLabel}
              </span>
              <ul className={`space-y-1 text-xs ${bodyText}`}>
                {activeProject.decisions.map((dec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    <span>{dec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeProject.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 text-[10px] font-mono ${
                    isLight
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : isNight
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Links */}
            <div className={`pt-2 flex gap-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              {activeProject.demo && (
                <a
                  href={activeProject.demo}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors uppercase font-mono tracking-wider ${
                    isLight
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm'
                      : isNight
                      ? 'bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </a>
              )}
              {activeProject.github && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors uppercase font-mono tracking-wider ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                      : isNight
                      ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-cyan-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <Github className="w-3.5 h-3.5" />
                  Source Code
                </a>
              )}
            </div>
          </div>
        );
      }

      case 'experiments':
        return (
          <div className="space-y-4">
            <div className={`border-l-2 ${isLight ? 'border-pink-600' : 'border-pink-500'} pl-3`}>
              <h3 className={`font-bold text-sm tracking-wider uppercase ${isLight ? 'text-pink-800' : 'text-pink-400'}`}>
                PHÒNG THÍ NGHIỆM // R&D & ĐÒN BẨY CÔNG NGHỆ
              </h3>
              <p className={`text-xs ${subText}`}>Real-Time Sockets, AI Workflows & Interactive 3D</p>
            </div>

            <div className={`space-y-3 text-xs leading-relaxed ${bodyText}`}>
              <p>
                Không gian nghiên cứu & thử nghiệm các giải pháp kỹ thuật mới, từ kiến trúc Socket thời gian thực đến việc tích hợp AI thế hệ mới vào quy trình phát triển phần mềm thực chiến.
              </p>

              <div className={`p-3 space-y-2 ${cardBox}`}>
                <div className={`flex items-center gap-2 font-semibold ${isLight ? 'text-pink-700' : 'text-pink-300'}`}>
                  <Terminal className={`w-4 h-4 ${isLight ? 'text-pink-600' : 'text-pink-400'}`} />
                  <span>Real-Time Socket State Engine (Wewin/MonkeyCard)</span>
                </div>
                <p className={`text-[11px] ${subText}`}>
                  Nghiên cứu kiến trúc truyền thông 2 chiều Socket.io + Redis Cache phân tán, đảm bảo độ trễ mili-giây và đồng bộ trạng thái trận đấu cho hàng ngàn người chơi đồng thời.
                </p>
              </div>

              <div className={`p-3 space-y-2 ${cardBox}`}>
                <div className={`flex items-center gap-2 font-semibold ${isLight ? 'text-pink-700' : 'text-pink-300'}`}>
                  <Sparkles className={`w-4 h-4 ${isLight ? 'text-pink-600' : 'text-pink-400'}`} />
                  <span>AI-Augmented Software Engineering</span>
                </div>
                <p className={`text-[11px] ${subText}`}>
                  Tối ưu hóa quy trình coding thực tế bằng Cursor, Claude, GitHub Copilot và ChatGPT: tăng tốc độ sinh boilerplate, phân tích log, review code và nghiên cứu giải pháp kỹ thuật.
                </p>
              </div>

              <div className={`p-3 space-y-2 ${cardBox}`}>
                <div className={`flex items-center gap-2 font-semibold ${isLight ? 'text-pink-700' : 'text-pink-300'}`}>
                  <Server className={`w-4 h-4 ${isLight ? 'text-pink-600' : 'text-pink-400'}`} />
                  <span>Interactive 3D Web & Rapier Physics Simulation</span>
                </div>
                <p className={`text-[11px] ${subText}`}>
                  Nghiên cứu kiến trúc WebGL 60 FPS không cấp phát bộ nhớ rác, vật lý Rapier WebAssembly và kỹ thuật tối ưu render cho thiết bị di động.
                </p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div className={`border-l-2 ${isLight ? 'border-sky-600' : 'border-sky-400'} pl-3`}>
              <h3 className={`font-bold text-sm tracking-wider uppercase ${isLight ? 'text-sky-800' : 'text-sky-400'}`}>
                KẾT NỐI KỸ THUẬT // TRẠM LIÊN LẠC
              </h3>
              <p className={`text-xs ${subText}`}>Sẵn sàng cho các cơ hội hợp tác kỹ sư & dự án cao tải.</p>
            </div>

            <p className={`text-xs leading-relaxed ${bodyText}`}>
              Cửa sổ liên lạc luôn mở rộng cho các cơ hội nghề nghiệp Backend / .NET Fullstack Developer, vai trò Team Lead hoặc các bài toán kiến trúc hệ thống phân tán, FinTech và High-concurrency.
            </p>

            <div className="space-y-2.5 pt-2 font-mono">
              <a
                href={`tel:${developerData.contacts.phone}`}
                className={`flex items-center justify-between p-2.5 text-xs transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-emerald-900 shadow-sm'
                    : isNight
                    ? 'bg-slate-950/80 hover:bg-emerald-950/60 border border-cyan-500/30 hover:border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 text-emerald-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Phone className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  <span>Điện thoại: {developerData.contacts.phone}</span>
                </span>
                <ExternalLink className={`w-3.5 h-3.5 ${subText}`} />
              </a>

              <a
                href={`mailto:${developerData.contacts.email}`}
                className={`flex items-center justify-between p-2.5 text-xs transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-400 text-sky-900 shadow-sm'
                    : isNight
                    ? 'bg-slate-950/80 hover:bg-sky-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,243,255,0.1)]'
                    : 'bg-slate-900 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/50 text-sky-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-sky-400'}`} />
                  <span>Email: {developerData.contacts.email}</span>
                </span>
                <ExternalLink className={`w-3.5 h-3.5 ${subText}`} />
              </a>

              <a
                href={developerData.contacts.github}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-between p-2.5 text-xs transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 shadow-sm'
                    : isNight
                    ? 'bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 text-slate-200'
                    : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>GitHub Profile (github.com/Loccao102)</span>
                </span>
                <ExternalLink className={`w-3.5 h-3.5 ${subText}`} />
              </a>

              <a
                href={developerData.contacts.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-between p-2.5 text-xs transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-sky-50 border border-slate-200 text-sky-900 shadow-sm'
                    : isNight
                    ? 'bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 text-sky-300'
                    : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Linkedin className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-sky-400'}`} />
                  <span>LinkedIn Profile</span>
                </span>
                <ExternalLink className={`w-3.5 h-3.5 ${subText}`} />
              </a>

              <div className={`flex items-center justify-between p-2.5 text-xs border ${cardBox}`}>
                <span className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                  <span>Địa điểm: {developerData.contacts.location}</span>
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <aside
      className={`fixed z-40 flex flex-col pointer-events-auto font-mono duration-300
        bottom-0 left-0 right-0 max-h-[85vh] w-full rounded-t-2xl md:rounded-none md:top-6 md:right-6 md:bottom-6 md:left-auto md:w-full md:max-w-md
        ${panelBg} animate-in slide-in-from-bottom-8 md:slide-in-from-right-8 shadow-2xl`}
    >
      {/* Top Bar */}
      <div className={`flex items-center justify-between px-5 py-3.5 border-b ${headerBg}`}>
        <span className={`text-[11px] font-bold tracking-widest uppercase ${
          isLight ? 'text-cyan-800' : isNight ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,243,255,0.7)]' : 'text-cyan-400'
        }`}>
          {(t.districts as any)[displayedMilestone]?.title || displayedMilestone.toUpperCase()} // {(t.districts as any)[displayedMilestone]?.subtitle || 'SYSTEM INTEL'}
        </span>
        <button
          onClick={() => setCardOpen(false)}
          className={`p-1.5 transition-colors rounded ${
            isLight
              ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
              : 'hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Close details (ESC)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
        {renderDistrictContent()}
      </div>

      {/* Bottom Dismiss / Keep Driving Bar */}
      <div className={`px-5 py-3 border-t flex justify-between items-center text-[11px] ${footerBg}`}>
        <span className={subText}>{t.closeHint}</span>
        <button
          onClick={() => setCardOpen(false)}
          className={`px-3 py-1.5 transition-colors uppercase tracking-wider font-semibold ${primaryBtn}`}
        >
          {t.continueDriving}
        </button>
      </div>
    </aside>
  );
};

