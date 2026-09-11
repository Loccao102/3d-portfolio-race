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
  const isNight = theme === 'night';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      const scale = 1.0 + Math.sin(t * 2.5) * 0.04;
      ringRef.current.scale.set(scale, scale, 1);
    }
    if (beaconRef.current) {
      beaconRef.current.position.y = 2.5 + Math.sin(t * 2.0) * 0.25;
      beaconRef.current.rotation.y = t * 0.8;
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

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[radius - 0.5, radius, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isInside ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 4.0, 0]}>
        <cylinderGeometry args={[radius * 0.9, radius * 0.9, 8.0, 16, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isInside ? 0.2 : 0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={beaconRef} position={[0, 2.5, 0]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isInside ? 1.5 : 0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      <Html
        center
        distanceFactor={30}
        position={[0, 4.4, 0]}
        className="select-none pointer-events-auto cursor-pointer"
        onClick={() => {
          setActiveMilestone(id);
          setCardOpen(true);
        }}
      >
        <div
          className={`px-3 py-1.5 border text-center font-mono transition-all backdrop-blur-md whitespace-nowrap ${
            isInside ? 'scale-110 ring-2 ring-cyan-400' : 'scale-100 hover:scale-105'
          } ${
            isLight
              ? 'bg-white/95 border-slate-300 text-slate-800 shadow-lg'
              : isNight
              ? 'bg-black/90 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'bg-slate-950/90 border-slate-700 text-slate-200 shadow-md'
          }`}
        >
          <div
            className="text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5"
            style={{ color }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block animate-ping"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </div>
          <div className={`text-[9px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {sublabel}
          </div>
          {isInside && (
            <div className="mt-1 px-1.5 py-0.5 text-[8.5px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded animate-pulse">
              [E] XEM CHI TIẾT
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
