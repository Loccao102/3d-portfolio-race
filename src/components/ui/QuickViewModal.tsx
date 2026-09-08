import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { developerData } from '../../data/developer';
import { projectsData } from '../../data/projects';
import { X, ExternalLink, Github, Mail, Linkedin, Server, CheckCircle2 } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const isQuickViewOpen = useGameStore((state) => state.isQuickViewOpen);
  const setQuickViewOpen = useGameStore((state) => state.setQuickViewOpen);
  const quickViewTab = useGameStore((state) => state.quickViewTab);
  const setQuickViewTab = useGameStore((state) => state.setQuickViewTab);
  const theme = useGameStore((state) => state.theme);

  if (!isQuickViewOpen) return null;

  const isLight = theme === 'light';
  const isNight = theme === 'night';

  const modalBg = isLight
    ? 'bg-white text-slate-800 border-slate-300 shadow-2xl'
    : isNight
    ? 'bg-[#040814]/98 text-cyan-100 border-cyan-500/50 shadow-[0_0_50px_rgba(0,243,255,0.25)]'
    : 'bg-slate-900/98 text-slate-100 border-slate-700 shadow-2xl';

  const headerBg = isLight
    ? 'border-slate-200 bg-slate-50'
    : isNight
    ? 'border-cyan-900/60 bg-black/90'
    : 'border-slate-800 bg-slate-950';

  const tabStripBg = isLight
    ? 'border-slate-200 bg-slate-100/90'
    : isNight
    ? 'border-cyan-950 bg-black/60'
    : 'border-slate-800 bg-slate-950/60';

  const cardBox = isLight
    ? 'bg-slate-50 border border-slate-200 text-slate-800'
    : isNight
    ? 'bg-slate-950/80 border border-cyan-500/30 text-slate-200'
    : 'bg-slate-950/70 border border-slate-800 text-slate-200';

  const subText = isLight ? 'text-slate-500' : 'text-slate-400';
  const bodyText = isLight ? 'text-slate-700' : 'text-slate-300';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-md font-mono select-none animate-in fade-in duration-200 ${
      isLight ? 'bg-slate-900/40' : isNight ? 'bg-black/85' : 'bg-slate-950/85'
    }`}>
      <div className={`relative w-full max-w-4xl max-h-[85vh] border flex flex-col overflow-hidden ${modalBg}`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${headerBg}`}>
          <div>
            <h2 className={`text-sm font-bold tracking-widest uppercase ${
              isLight ? 'text-cyan-800' : isNight ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,243,255,0.7)]' : 'text-cyan-400'
            }`}>
              INDEX // RECRUITER QUICK VIEW
            </h2>
            <p className={`text-xs ${subText}`}>{developerData.name} — {developerData.role}</p>
          </div>
          <button
            onClick={() => setQuickViewOpen(false)}
            className={`p-1.5 transition-colors ${
              isLight
                ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b overflow-x-auto text-xs ${tabStripBg}`}>
          {[
            { id: 'about', label: '1. ABOUT & BIO' },
            { id: 'projects', label: '2. FEATURED PROJECTS' },
            { id: 'tech', label: '3. TECH STACK' },
            { id: 'contact', label: '4. CONTACT & LINKS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setQuickViewTab(tab.id as any)}
              className={`px-5 py-3 border-b-2 transition-colors uppercase tracking-wider font-semibold whitespace-nowrap ${
                quickViewTab === tab.id
                  ? isLight
                    ? 'border-cyan-600 text-cyan-800 bg-white font-bold shadow-sm'
                    : isNight
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                    : 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {quickViewTab === 'about' && (
            <div className="space-y-4">
              <div className={`space-y-3 text-xs md:text-sm leading-relaxed ${bodyText}`}>
                {developerData.bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-cyan-800' : 'text-cyan-400'}`}>
                  PRIMARY TECHNICAL FOCUS
                </h4>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 text-xs ${bodyText}`}>
                  {developerData.focus.map((f, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 ${cardBox}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-cyan-600' : 'bg-cyan-400'}`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {quickViewTab === 'projects' && (
            <div className="space-y-6">
              {projectsData.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 space-y-3 ${cardBox}`}
                >
                  <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
                    <div>
                      <span className={`text-[10px] font-mono font-bold tracking-wider mr-2 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        [{project.bayNumber}]
                      </span>
                      <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{project.title}</span>
                    </div>
                    <span className={`text-xs ${subText}`}>{project.category} ({project.year})</span>
                  </div>

                  <p className={`text-xs italic ${subText}`}>"{project.tagline}"</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className={`text-[11px] font-semibold uppercase block mb-1 ${isLight ? 'text-red-700' : 'text-red-400'}`}>
                        PROBLEM:
                      </span>
                      <p className={subText}>{project.problem}</p>
                    </div>
                    <div>
                      <span className={`text-[11px] font-semibold uppercase block mb-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        SOLUTION:
                      </span>
                      <p className={bodyText}>{project.solution}</p>
                    </div>
                  </div>

                  {/* Impact Results */}
                  <div className={`p-2.5 ${isLight ? 'bg-slate-100 border border-slate-200' : isNight ? 'bg-slate-900/60 border border-emerald-500/30' : 'bg-slate-900/60 border border-slate-800/80'}`}>
                    <span className={`text-[10px] uppercase tracking-wider block mb-1 ${subText}`}>
                      KEY RESULTS:
                    </span>
                    <ul className={`space-y-1 text-xs ${bodyText}`}>
                      {project.results.map((res, rIdx) => (
                        <li key={rIdx} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-2 py-0.5 text-[10px] ${
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
                </div>
              ))}
            </div>
          )}

          {quickViewTab === 'tech' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {developerData.skills.map((cat, i) => (
                  <div key={i} className={`p-4 space-y-3 ${cardBox}`}>
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider border-b pb-2 ${
                      isLight ? 'border-slate-200 text-amber-800' : 'border-slate-800 text-amber-400'
                    }`}>
                      <Server className="w-4 h-4" />
                      <span>{cat.category}</span>
                    </div>
                    <ul className="space-y-2 text-xs">
                      {cat.items.map((skill, sIdx) => (
                        <li key={sIdx} className={`flex justify-between items-center ${bodyText}`}>
                          <span>{skill.name}</span>
                          <span className={`text-[10px] font-mono ${subText}`}>{skill.level}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {quickViewTab === 'contact' && (
            <div className="space-y-4 max-w-lg mx-auto py-4">
              <div className="text-center space-y-1 mb-6">
                <h3 className={`text-sm font-bold uppercase tracking-widest ${isLight ? 'text-sky-800' : 'text-sky-400'}`}>
                  ESTABLISH DIRECT CONNECTION
                </h3>
                <p className={`text-xs ${subText}`}>Feel free to reach out directly via email or social networks.</p>
              </div>

              <div className="space-y-3 text-xs">
                <a
                  href={`mailto:${developerData.contacts.email}`}
                  className={`flex items-center justify-between p-3 transition-colors ${
                    isLight
                      ? 'bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-sky-900 shadow-sm'
                      : isNight
                      ? 'bg-slate-950/80 hover:bg-sky-950/50 border border-cyan-500/30 hover:border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,243,255,0.1)]'
                      : 'bg-slate-950 hover:bg-sky-950/50 border border-slate-800 hover:border-sky-500/50 text-sky-300'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Mail className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-sky-400'}`} />
                    <span>{developerData.contacts.email}</span>
                  </span>
                  <ExternalLink className={`w-3.5 h-3.5 ${subText}`} />
                </a>

                <a
                  href={developerData.contacts.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-between p-3 transition-colors ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 shadow-sm'
                      : isNight
                      ? 'bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 text-slate-200'
                      : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Github className="w-4 h-4" />
                    <span>GitHub Profile</span>
                  </span>
                  <ExternalLink className={`w-3.5 h-3.5 ${subText}`} />
                </a>

                <a
                  href={developerData.contacts.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-between p-3 transition-colors ${
                    isLight
                      ? 'bg-slate-50 hover:bg-sky-50 border border-slate-200 text-sky-900 shadow-sm'
                      : isNight
                      ? 'bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 text-sky-300'
                      : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-400'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Linkedin className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-sky-400'}`} />
                    <span>LinkedIn Profile</span>
                  </span>
                  <ExternalLink className={`w-3.5 h-3.5 ${subText}`} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`flex items-center justify-between px-6 py-3 border-t text-xs ${
          isLight
            ? 'border-slate-200 bg-slate-50 text-slate-500'
            : isNight
            ? 'border-cyan-900/60 bg-black/90 text-slate-400'
            : 'border-slate-800 bg-slate-950 text-slate-400'
        }`}>
          <span>PRESS ESC OR CLICK OUTSIDE TO RETURN TO WORLD</span>
          <button
            onClick={() => setQuickViewOpen(false)}
            className={`px-4 py-1.5 transition-colors uppercase tracking-wider font-semibold ${
              isLight
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm'
                : isNight
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
            }`}
          >
            Back to 3D World
          </button>
        </div>
      </div>
    </div>
  );
};

