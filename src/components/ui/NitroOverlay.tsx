'use client';
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';

/**
 * NitroOverlay — Full-screen cinematic speed-line burst + vignette during Nitro Boost.
 * Uses inline SVG for speed lines and CSS for the edge vignette. Zero external deps.
 */
export const NitroOverlay: React.FC = () => {
  const isBoosting = useGameStore((state) => state.isBoosting);

  // SVG speed lines emanating from center
  // Coordinates are rounded to 3dp to prevent SSR/client floating-point hydration mismatch
  const NUM_LINES = 24;
  const lines = Array.from({ length: NUM_LINES }, (_, i) => {
    const angle = (i / NUM_LINES) * 2 * Math.PI;
    const innerR = 15;
    const outerR = 58;
    const cx = 50;
    const cy = 50;
    const r = (n: number) => Math.round(n * 1000) / 1000;
    return {
      x1: r(cx + Math.cos(angle) * innerR),
      y1: r(cy + Math.sin(angle) * innerR),
      x2: r(cx + Math.cos(angle) * outerR),
      y2: r(cy + Math.sin(angle) * outerR),
    };
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 select-none"
      style={{
        opacity: isBoosting ? 1 : 0,
        transition: 'opacity 120ms ease-out',
      }}
    >
      {/* Edge vignette darkening */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Speed line burst SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.35 }}
      >
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="white"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Cyan electric rim glow */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 80px rgba(0, 243, 255, 0.18)',
        }}
      />
    </div>
  );
};
