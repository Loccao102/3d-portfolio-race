import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { developerData } from '../../data/developer';
import { projectsData } from '../../data/projects';
import { X, ExternalLink, Github, Mail, Linkedin, Terminal, Sparkles, Server, CheckCircle2 } from 'lucide-react';

export const MilestoneCard: React.FC = () => {
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
                WHO IS CAO TIEN LOC?
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
                CAREER TIMELINE
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
                CURRENT ENGINEERING FOCUS
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

            <div className={`pt-2 flex items-center justify-between text-[11px] border-t ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'}`}>
              <span>LOCATION: {developerData.location}</span>
              <span className={isLight ? 'text-cyan-700 font-bold' : 'text-cyan-400 font-medium'}>AVAILABLE FOR HIRE</span>
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
                  THE PROBLEM:
                </span>
                <p className={`leading-relaxed ${subText}`}>{activeProject.problem}</p>
              </div>

              <div>
                <span className={`font-semibold uppercase text-[11px] block mb-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  ENGINEERING SOLUTION:
                </span>
                <p className={`leading-relaxed ${bodyText}`}>{activeProject.solution}</p>
              </div>
            </div>

            {/* Key Engineering Decisions */}
            <div className={`p-2.5 ${cardBox}`}>
              <span className={`font-semibold uppercase text-[10px] tracking-wider block mb-1.5 ${subText}`}>
                KEY TECHNICAL DECISIONS
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
                RESTRICTED LAB // PROTOTYPES
              </h3>
              <p className={`text-xs ${subText}`}>{developerData.role}</p>
            </div>

            <div className={`space-y-3 text-xs leading-relaxed ${bodyText}`}>
              <p>
                This zone houses exploratory prototypes, custom GLSL shader experiments, procedural
                geometry generators, and experimental web interactions.
              </p>

              <div className={`p-3 space-y-2 ${cardBox}`}>
                <div className={`flex items-center gap-2 font-semibold ${isLight ? 'text-pink-700' : 'text-pink-300'}`}>
                  <Sparkles className={`w-4 h-4 ${isLight ? 'text-pink-600' : 'text-pink-400'}`} />
                  <span>Interactive Audio-Reactive Mesh</span>
                </div>
                <p className={`text-[11px] ${subText}`}>
                  Real-time FFT audio frequency analysis driving vertex displacement shaders in WebGL.
                </p>
              </div>

              <div className={`p-3 space-y-2 ${cardBox}`}>
                <div className={`flex items-center gap-2 font-semibold ${isLight ? 'text-pink-700' : 'text-pink-300'}`}>
                  <Terminal className={`w-4 h-4 ${isLight ? 'text-pink-600' : 'text-pink-400'}`} />
                  <span>Raymarching Distance Fields</span>
                </div>
                <p className={`text-[11px] ${subText}`}>
                  Custom fragment shader simulating volumetric fractal geometry without polygon meshes.
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
                COMMUNICATION ARRAY // ESTABLISH UPLINK
              </h3>
              <p className={`text-xs ${subText}`}>Let's build something extraordinary together.</p>
            </div>

            <p className={`text-xs leading-relaxed ${bodyText}`}>
              Whether you have an ambitious creative project, high-performance web engineering needs,
              or a full-time role—my inbox is open.
            </p>

            <div className="space-y-2.5 pt-2 font-mono">
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
                  <span>{developerData.contacts.email}</span>
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
                  <span>GitHub Profile</span>
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
          DISTRICT INTEL // [{displayedMilestone.toUpperCase()}]
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
        <span className={subText}>[E] / [ESC] TO CLOSE</span>
        <button
          onClick={() => setCardOpen(false)}
          className={`px-3 py-1.5 transition-colors uppercase tracking-wider font-semibold ${primaryBtn}`}
        >
          Continue Exploring
        </button>
      </div>
    </aside>
  );
};

