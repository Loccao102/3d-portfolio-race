import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoadNetwork } from './RoadNetwork';
import { useGameStore } from '../../stores/useGameStore';

export const Ground: React.FC = () => {
  const theme = useGameStore((state) => state.theme);
  const isLight = theme === 'light';
  const isDark = theme === 'dark';
  const isNight = theme === 'night';

  const topColor = isLight ? '#f1f5f9' : isDark ? '#1e293b' : '#141c2e';
  const bevelColor = isLight ? '#cbd5e1' : isDark ? '#0f172a' : '#070b14';
  const rimColor = isLight ? '#0284c7' : isDark ? '#38bdf8' : '#00f3ff';
  const gridPrimary = isLight ? '#0284c7' : isDark ? '#38bdf8' : '#00f3ff';
  const gridSecondary = isLight ? '#94a3b8' : isDark ? '#334155' : '#1e293b';
  const underglowColor = isLight ? '#38bdf8' : '#00f3ff';
  const underglowOpacity = isLight ? 0.08 : isDark ? 0.18 : 0.35;

  return (
    <group>
      {/* 1. Solid Physics Floor (Expanded to 180m x 240m) */}
      <RigidBody type="fixed" friction={0.4}>
        <CuboidCollider args={[95, 0.5, 125]} position={[0, -0.5, -5]} />
      </RigidBody>

      {/* 2. Expanded Floating Diorama Island Base */}
      <group position={[0, -0.01, -5]}>
        {/* Top Surface (Daylight vs Dark Tech vs Cyberpunk Night) */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[186, 0.6, 246]} />
          <meshStandardMaterial
            color={topColor}
            roughness={isLight ? 0.8 : 0.6}
            metalness={isLight ? 0.05 : 0.25}
          />
        </mesh>

        {/* Floating Bevel Rim Base */}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[182, 1.8, 242]} />
          <meshStandardMaterial
            color={bevelColor}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Luminous Island Perimeter Rim Strip */}
        {[-93.1, 93.1].map((x, i) => (
          <mesh key={`rim-x-${i}`} position={[x, 0.22, 0]}>
            <boxGeometry args={[0.1, 0.18, 246.2]} />
            <meshBasicMaterial color={rimColor} />
          </mesh>
        ))}
        {[-123.1, 123.1].map((z, i) => (
          <mesh key={`rim-z-${i}`} position={[0, 0.22, z]}>
            <boxGeometry args={[186.2, 0.18, 0.1]} />
            <meshBasicMaterial color={rimColor} />
          </mesh>
        ))}

        {/* Floating Underglow Light */}
        <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[190, 250]} />
          <meshBasicMaterial
            color={underglowColor}
            transparent
            opacity={underglowOpacity}
          />
        </mesh>
      </group>

      {/* Ground Grid Pattern */}
      <gridHelper
        args={[186, 62, gridPrimary, gridSecondary]}
        position={[0, 0.005, -5]}
      />

      {/* 3. High-Contrast Road Network, Street Signs & Grand Speed Circuit */}
      <RoadNetwork />

      {/* 4. Safety Colliders along the 180m x 240m perimeter */}
      <RigidBody type="fixed">
        <CuboidCollider args={[1, 6, 125]} position={[-93, 3.0, -5]} />
        <CuboidCollider args={[1, 6, 125]} position={[93, 3.0, -5]} />
        <CuboidCollider args={[95, 6, 1]} position={[0, 3.0, -127]} />
        <CuboidCollider args={[95, 6, 1]} position={[0, 3.0, 117]} />
      </RigidBody>
    </group>
  );
};
