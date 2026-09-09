import React from 'react';
import { useNetworkStore } from '../../stores/useNetworkStore';

export const OnlineRoster: React.FC = () => {
  const remotePlayers = useNetworkStore((state) => state.remotePlayers);
  const myId = useNetworkStore((state) => state.myId);
  const isConnected = useNetworkStore((state) => state.isConnected);

  const players = Object.values(remotePlayers);
  // Add ourselves to the count
  const totalOnline = isConnected ? players.length + 1 : 0;

  if (!isConnected) return null;

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 w-48 font-mono">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded p-3 shadow-lg shadow-black/50">
        <div className="flex items-center gap-2 mb-3 border-b border-slate-700 pb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-300 tracking-wider">
            ONLINE: <span className="text-emerald-400 font-bold">{totalOnline}</span>
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {/* Us */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-xs text-slate-400 truncate">You ({myId?.substring(0, 4)})</span>
          </div>
          
          {/* Remote Players */}
          {players.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <div 
                className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]"
                style={{ backgroundColor: p.accentColor, color: p.accentColor }} 
              />
              <span className="text-xs text-slate-200 truncate">
                {p.name || p.id.substring(0, 4)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Emote Instructions */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded p-2 text-center">
        <span className="text-[10px] text-slate-400">
          Press 1-4 to Emote
        </span>
      </div>
    </div>
  );
};

