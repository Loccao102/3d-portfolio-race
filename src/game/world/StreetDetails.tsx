import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CrosswalkNS({ z }: { z: number }) {
  return (
    <group position={[0, 0.065, z]}>
      {[-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((offset) => (
        <mesh key={`cross-ns-${z}-${offset}`} position={[0, 0, offset]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.6, 0.34]} />
          <meshBasicMaterial color="#e5e7eb" transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function CrosswalkEW({ x }: { x: number }) {
  return (
    <group position={[x, 0.068, 0]}>
      {[-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((offset) => (
        <mesh key={`cross-ew-${x}-${offset}`} position={[offset, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.34, 8.6]} />
          <meshBasicMaterial color="#e5e7eb" transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function TrafficLight({
  position,
  rotation = 0,
  phase = 0,
}: {
  position: [number, number, number];
  rotation?: number;
  phase?: number;
}) {
  const redRef = useRef<THREE.MeshStandardMaterial>(null);
  const amberRef = useRef<THREE.MeshStandardMaterial>(null);
  const greenRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const cycle = (clock.getElapsedTime() + phase) % 9;
    const red = cycle < 3.5;
    const amber = cycle >= 3.5 && cycle < 4.5;
    const green = cycle >= 4.5;
    if (redRef.current) redRef.current.emissiveIntensity = red ? 2.2 : 0.12;
    if (amberRef.current) amberRef.current.emissiveIntensity = amber ? 2.4 : 0.12;
    if (greenRef.current) greenRef.current.emissiveIntensity = green ? 2.1 : 0.12;
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 2.3, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 4.6, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.5, 4.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 1, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.85} roughness={0.25} />
      </mesh>
      <group position={[0.95, 4.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 1.25, 0.38]} />
          <meshStandardMaterial color="#111827" roughness={0.45} metalness={0.55} />
        </mesh>
        <mesh position={[0, 0.36, 0.205]}>
          <circleGeometry args={[0.105, 16]} />
          <meshStandardMaterial ref={redRef} color="#450a0a" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 0, 0.205]}>
          <circleGeometry args={[0.105, 16]} />
          <meshStandardMaterial ref={amberRef} color="#451a03" emissive="#f59e0b" emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[0, -0.36, 0.205]}>
          <circleGeometry args={[0.105, 16]} />
          <meshStandardMaterial ref={greenRef} color="#052e16" emissive="#22c55e" emissiveIntensity={0.12} />
        </mesh>
      </group>
    </group>
  );
}

function StreetSign({
  position,
  rotation = 0,
  title,
  sub,
  accent,
}: {
  position: [number, number, number];
  rotation?: number;
  title: string;
  sub: string;
  accent: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 3.2, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <boxGeometry args={[2.9, 0.95, 0.15]} />
        <meshStandardMaterial color="#162033" metalness={0.48} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.28, 0.085]}>
        <boxGeometry args={[2.65, 0.07, 0.025]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <Html center position={[0, 2.75, 0.12]} distanceFactor={22} className="pointer-events-none select-none">
        <div className="min-w-[92px] rounded-md border border-white/10 bg-slate-950/82 px-2 py-1 text-center font-mono shadow-lg backdrop-blur-md">
          <div className="text-[8px] font-black tracking-[0.14em] text-white">{title}</div>
          <div className="text-[6px] uppercase tracking-[0.12em] text-slate-400">{sub}</div>
        </div>
      </Html>
    </group>
  );
}

function BusShelter() {
  return (
    <group position={[20, 0, 11]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[5.4, 0.16, 2.2]} />
        <meshStandardMaterial color="#334155" metalness={0.72} roughness={0.3} />
      </mesh>
      {[-2.45, 2.45].map((x) => (
        <mesh key={`shelter-post-${x}`} position={[x, 0.8, 0.8]} castShadow>
          <boxGeometry args={[0.12, 1.6, 0.12]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 0.92, 0.95]}>
        <boxGeometry args={[5, 1.45, 0.06]} />
        <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.2} roughness={0.05} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[3.5, 0.16, 0.65]} />
        <meshStandardMaterial color="#7c4a2d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.31, 0]} castShadow>
        <boxGeometry args={[0.14, 0.5, 0.5]} />
        <meshStandardMaterial color="#475569" metalness={0.65} />
      </mesh>
      <mesh position={[-1.1, 1.02, 0.9]}>
        <planeGeometry args={[1.6, 0.55]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.72} />
      </mesh>
    </group>
  );
}

function WetPatch({
  position,
  scale,
  rotation = 0,
}: {
  position: [number, number, number];
  scale: [number, number];
  rotation?: number;
}) {
  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, rotation]}
      scale={[scale[0], scale[1], 1]}
    >
      <circleGeometry args={[1, 32]} />
      <meshStandardMaterial
        color="#0f2740"
        transparent
        opacity={0.32}
        roughness={0.12}
        metalness={0.35}
      />
    </mesh>
  );
}

export function StreetDetails() {
  return (
    <group>
      <CrosswalkNS z={11} />
      <CrosswalkNS z={-11} />
      <CrosswalkEW x={11} />
      <CrosswalkEW x={-11} />

      <TrafficLight position={[-7.2, 0, 7.2]} rotation={Math.PI} phase={0} />
      <TrafficLight position={[7.2, 0, -7.2]} phase={0} />
      <TrafficLight position={[7.2, 0, 7.2]} rotation={Math.PI / 2} phase={4.5} />
      <TrafficLight position={[-7.2, 0, -7.2]} rotation={-Math.PI / 2} phase={4.5} />

      <StreetSign position={[-15, 0, 16]} rotation={0.2} title="PHỐ DEV" sub="About →" accent="#f59e0b" />
      <StreetSign position={[16, 0, -16]} rotation={Math.PI + 0.1} title="KHU TECH" sub="Data district" accent="#22d3ee" />
      <StreetSign position={[33, 0, 12]} rotation={-Math.PI / 2} title="DỰ ÁN" sub="Garage →" accent="#fb7185" />
      <StreetSign position={[-33, 0, -12]} rotation={Math.PI / 2} title="PHÒNG LAB" sub="Experiment →" accent="#a855f7" />

      <BusShelter />

      <WetPatch position={[5.5, 0.072, 21]} scale={[2.6, 1.2]} rotation={0.25} />
      <WetPatch position={[-21, 0.074, -5.8]} scale={[1.8, 3.1]} rotation={-0.3} />
      <WetPatch position={[36, 0.072, -7]} scale={[2.2, 1.1]} rotation={0.65} />

      {[-15, -5, 5, 15].map((x) => (
        <group key={`planter-${x}`} position={[x, 0, 16.5]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[2.2, 0.7, 1.2]} />
            <meshStandardMaterial color="#374151" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.95, 0]} castShadow>
            <dodecahedronGeometry args={[0.78, 0]} />
            <meshStandardMaterial color="#166534" roughness={0.82} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
