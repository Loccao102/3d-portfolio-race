'use client';

import React, { useMemo, useState } from 'react';
import { MessageCircle, Radio, Send, Users } from 'lucide-react';
import { useNetworkStore } from '@/game/systems/network/useNetworkStore';

function districtFromPose(x: number, z: number): string {
  if (z < -66 && Math.abs(x) < 28) return 'Contact';
  if (z < -24 && Math.abs(x) < 28) return 'Tech';
  if (z > 24 && Math.abs(x) < 30) return 'About';
  if (x > 26) return 'Projects';
  if (x < -26) return 'Experiments';
  return 'City Core';
}

const EMOTES = ['👋', '🔥', '⚡', '💻'];

export function MultiplayerPresenceHUD() {
  const isConnected = useNetworkStore((state) => state.isConnected);
  const remotePlayers = useNetworkStore((state) => state.remotePlayers);
  const chatMessages = useNetworkStore((state) => state.chatMessages);
  const sendEmote = useNetworkStore((state) => state.sendEmote);
  const sendChat = useNetworkStore((state) => state.sendChat);
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);

  const visitors = useMemo(
    () =>
      Object.entries(remotePlayers)
        .filter(([, player]) => Boolean(player.pose) && Date.now() - player.lastUpdate < 15_000)
        .map(([id, player]) => ({
          id,
          name: player.name || id.slice(0, 4),
          district: player.pose ? districtFromPose(player.pose.x, player.pose.z) : 'Connecting',
          accent: player.accentColor,
        })),
    [remotePlayers],
  );

  const submitChat = (event: React.FormEvent) => {
    event.preventDefault();
    const text = message.trim().slice(0, 120);
    if (!text) return;
    sendChat(text);
    setMessage('');
  };

  return (
    <div className="pointer-events-auto fixed right-5 top-20 z-30 hidden w-[250px] lg:block">
      <button
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#060b13]/80 px-4 py-3 text-left shadow-xl backdrop-blur-xl transition hover:bg-[#0a111c]/90"
      >
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]' : 'bg-slate-600'}`} />
          <div>
            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Live visitors</div>
            <div className="text-[10px] font-bold text-white">{visitors.length + 1} in the city</div>
          </div>
        </div>
        <Users className="h-4 w-4 text-cyan-300" />
      </button>

      {expanded && (
        <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#060b13]/92 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 p-3">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.18em] text-cyan-300">
              <Radio className="h-3.5 w-3.5" /> Presence
            </div>
            <div className="mt-2 space-y-1.5">
              {visitors.length === 0 ? (
                <div className="rounded-xl bg-white/[0.03] px-3 py-2 text-[8px] text-slate-500">No other visitor is connected right now.</div>
              ) : (
                visitors.slice(0, 6).map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: visitor.accent }} />
                      <span className="text-[9px] font-bold text-slate-200">{visitor.name}</span>
                    </div>
                    <span className="text-[7px] uppercase tracking-[0.1em] text-slate-500">{visitor.district}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-b border-white/10 p-3">
            <div className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">Quick signal</div>
            <div className="mt-2 flex gap-2">
              {EMOTES.map((emoji, index) => (
                <button
                  key={emoji}
                  onClick={() => sendEmote(index)}
                  disabled={!isConnected}
                  className="flex-1 rounded-xl border border-white/8 bg-white/[0.035] py-2 text-sm transition hover:bg-white/[0.08] disabled:opacity-30"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">
              <MessageCircle className="h-3.5 w-3.5" /> City channel
            </div>
            <div className="mt-2 max-h-24 space-y-1 overflow-y-auto">
              {chatMessages.slice(-4).map((chat) => {
                const sender = remotePlayers[chat.senderId];
                return (
                  <div key={chat.id} className="text-[8px] leading-relaxed text-slate-400">
                    <span className="font-bold text-slate-200">{sender?.name ?? 'You'}:</span> {chat.text}
                  </div>
                );
              })}
            </div>
            <form onSubmit={submitChat} className="mt-2 flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={!isConnected}
                maxLength={120}
                placeholder="Say hi…"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[9px] text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
              />
              <button disabled={!isConnected || !message.trim()} className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 text-cyan-200 disabled:opacity-30">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
