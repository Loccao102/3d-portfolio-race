import React, { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CylinderCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { sound } from '@/lib/soundEngine';
import { isLocalVehicleObject } from '@/game/entities/player/localPhysics';
import { useGameStore, type MilestoneId } from '@/stores/useGameStore';

interface MilestoneZoneProps {
  id: MilestoneId;
  position: [number, number, number];
  radius?: number;
  label: string;
  sublabel: string;
  color?: string;
}

export const MilestoneZone: React.FC<MilestoneZoneProps> = ({
  id,
  position,
  radius = 4.5,
  label,
  sublabel,
  color = '#00f3ff',
}) => {
  const [isInside, setIsInside] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const setActiveMilestone = useGameStore((state) => state.setActiveMilestone);
  const markMilestoneVisited = useGameStore((state) => state.markMilestoneVisited);
  const setCardOpen = useGameStore((state) => state.setCardOpen);
  const theme = useGameStore((state) => state.theme);

  const isLight = theme === 'light';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.22;
      const scale = 1 + Math.sin(t * 2.1) * 0.025;
      ringRef.current.scale.set(scale, scale, 1);
    }
    if (beaconRef.current) {
      beaconRef.current.position.y = 2.25 + Math.sin(t * 1.7) * 0.16;
      beaconRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={position}>
      <RigidBody
        type="fixed"
        sensor
        onIntersectionEnter={({ other }) => {
          if (isLocalVehicleObject(other.rigidBodyObject)) {
            setIsInside(true);
            setActiveMilestone(id);
            markMilestoneVisited(id);
            sound.playZoneEnter();
          }
        }}
        onIntersectionExit={({ other }) => {
          if (isLocalVehicleObject(other.rigidBodyObject)) {
            setIsInside(false);
            setActiveMilestone(null);
          }
        }}
      >
        <CylinderCollider args={[2.0, radius]} position={[0, 1.0, 0]} />
      </RigidBody>

      {/* A restrained navigation marker: district architecture now does most of the visual storytelling. */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.075, 0]}>
        <ringGeometry args={[radius - 0.22, radius, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isInside ? 0.82 : 0.24}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[radius * 0.78, radius * 0.78, 3.6, 28, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={isInside ? 0.095 : 0.018} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={beaconRef} position={[0, 2.25, 0]}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isInside ? 2.1 : 0.9}
          roughness={0.18}
          metalness={0.88}
        />
      </mesh>

      <pointLight position={[0, 1.4, 0]} color={color} intensity={isInside ? 2.8 : 0.55} distance={9} decay={2} />

      <Html
        center
        distanceFactor={32}
        position={[0, 3.5, 0]}
        className="pointer-events-auto select-none cursor-pointer"
        onClick={() => {
          setActiveMilestone(id);
          setCardOpen(true);
        }}
      >
        <div
          className={`whitespace-nowrap rounded-full border backdrop-blur-xl transition-all ${
            isInside
              ? 'scale-105 px-3 py-2 shadow-2xl'
              : 'scale-90 px-2.5 py-1.5 opacity-75 hover:scale-95 hover:opacity-100'
          } ${
            isLight
              ? 'border-slate-300/80 bg-white/85 text-slate-800'
              : 'border-white/10 bg-[#07101b]/78 text-white shadow-[0_12px_32px_rgba(0,0,0,0.3)]'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
            <span className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color }}>
              {label}
            </span>
          </div>
          {isInside && (
            <div className={`mt-1 text-center text-[8px] uppercase tracking-[0.12em] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {sublabel} • open details
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
