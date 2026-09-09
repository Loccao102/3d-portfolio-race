import React from 'react';
import { useGameStore } from '../../stores/useGameStore';

export const LanguageToggle: React.FC = () => {
  const language = useGameStore((state) => state.language);
  const setLanguage = useGameStore((state) => state.setLanguage);

  return (
    <div className="absolute top-4 left-4 z-50 flex gap-2 font-mono text-xs drop-shadow-md">
      <button
        onClick={() => setLanguage('vi')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'vi' 
            ? 'bg-slate-100 text-slate-900 shadow-[0_0_10px_#fff]' 
            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
        }`}
      >
        VN
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en' 
            ? 'bg-slate-100 text-slate-900 shadow-[0_0_10px_#fff]' 
            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
        }`}
      >
        EN
      </button>
    </div>
  );
};

