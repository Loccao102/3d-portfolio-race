import React, { useState, useRef, useEffect } from 'react';
import { useNetworkStore } from '../../stores/useNetworkStore';
import { useGameStore } from '../../stores/useGameStore';

export const ChatBox: React.FC = () => {
  const chatMessages = useNetworkStore((state) => state.chatMessages);
  const sendChat = useNetworkStore((state) => state.sendChat);
  const remotePlayers = useNetworkStore((state) => state.remotePlayers);
  const myId = useNetworkStore((state) => state.myId);
  const isConnected = useNetworkStore((state) => state.isConnected);
  const profile = useGameStore((state) => state.playerProfile);
  
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isOpen]);

  // Handle global Enter key to open chat box
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isOpen && isConnected) {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 10);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, isConnected]);

  if (!isConnected) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendChat(input.trim());
      setInput('');
    }
    // Close on submit so they can drive again right away
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const getName = (id: string) => {
    if (id === myId) return profile?.name || "You";
    return remotePlayers[id]?.name || id.substring(0, 4);
  };

  const getColor = (id: string) => {
    if (id === myId) return profile?.accentColor || "#10b981";
    return remotePlayers[id]?.accentColor || "#94a3b8";
  };

  return (
    <div className="absolute bottom-4 left-4 z-50 flex flex-col justify-end w-80 font-mono pointer-events-none">
      
      {/* Messages Area (always visible if there are messages, fades out older ones optionally, but let's just show standard list) */}
      <div 
        className={`flex flex-col gap-1 overflow-y-auto transition-all duration-300 ${isOpen ? 'h-64 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-t p-2 pointer-events-auto' : 'h-40 p-2 pointer-events-none'}`}
        style={{
          maskImage: !isOpen ? 'linear-gradient(to bottom, transparent, black 40%)' : 'none',
          WebkitMaskImage: !isOpen ? 'linear-gradient(to bottom, transparent, black 40%)' : 'none'
        }}
      >
        {chatMessages.length === 0 && isOpen && (
          <div className="text-xs text-slate-500 text-center my-auto">
            No messages yet. Say hello!
          </div>
        )}
        
        {chatMessages.map((msg) => (
          <div key={msg.id} className="flex gap-2 text-xs drop-shadow-md">
            <span className="font-bold shrink-0" style={{ color: getColor(msg.senderId) }}>
              {getName(msg.senderId)}:
            </span>
            <span className="text-slate-200 break-words">{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {isOpen ? (
        <form onSubmit={handleSubmit} className="border border-t-0 border-slate-700 bg-slate-800/90 rounded-b p-2 pointer-events-auto flex items-center shadow-lg shadow-black/50">
          <span className="text-slate-400 mr-2 text-xs">»</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message... (Esc to cancel)"
            className="w-full bg-transparent text-white text-xs placeholder-slate-500 outline-none"
            maxLength={120}
            // Vital: prevent spacebar/WASD from moving the car while typing
            onKeyDown={(e) => e.stopPropagation()} 
            onBlur={() => setIsOpen(false)}
          />
        </form>
      ) : (
        <div className="text-[10px] text-slate-400/70 p-2 drop-shadow-md pointer-events-none">
          Press <kbd className="border border-slate-600 rounded px-1 bg-slate-800/50">Enter</kbd> to chat
        </div>
      )}
    </div>
  );
};
