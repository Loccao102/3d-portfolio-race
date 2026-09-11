import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import { useNetworkStore } from '@/stores/useNetworkStore';

const EMOTES: Record<number, string> = {
  1: '❤️',
  2: '🔥',
  3: '😎',
  4: '🚀',
};

export function EmoteBubble({ id }: { id: string }) {
  const activeEmote = useNetworkStore((state) => state.activeEmotes[id]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!activeEmote) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 2500);
    return () => window.clearTimeout(timer);
  }, [activeEmote]);

  if (!visible || !activeEmote) return null;

  return (
    <Html
      position={[0, 2.5, 0]}
      center
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
        transform: 'translate3d(0, 0, 0)',
        animation: 'emotePop 2.5s ease-out forwards',
      }}
    >
      <div
        style={{
          fontSize: '32px',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '8px 12px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(4px)',
          textShadow: '0 0 10px rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {EMOTES[activeEmote.emoteIndex] || '👋'}
      </div>
      <style>{`
        @keyframes emotePop {
          0% { opacity: 0; transform: translateY(20px) scale(0.5); }
          15% { opacity: 1; transform: translateY(0px) scale(1.2); }
          25% { transform: translateY(-5px) scale(1); }
          80% { opacity: 1; transform: translateY(-10px) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.8); }
        }
      `}</style>
    </Html>
  );
}
