import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  BUS_SHELTER_PLACEMENTS,
  CROSSWALK_PLACEMENTS,
  PLANTER_PLACEMENTS,
  STREET_SIGN_PLACEMENTS,
  TRAFFIC_LIGHT_PLACEMENTS,
  WET_PATCH_PLACEMENTS,
  type Vec3,
} from './data/placementPlan';

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
  position: Vec3;
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
  position: Vec3;
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

function BusShelter({ position, rotation }: { position: Vec3; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
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

function WetPatch({ position, scale, rotation = 0 }: { position: Vec3; scale: [number, number]; rotation?: number }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} scale={[scale[0], scale[1], 1]}>
      <circleGeometry args={[1, 32]} />
      <meshPhysicalMaterial
        color="#0b2438"
        transparent
        opacity={0.34}
        roughness={0.08}
        metalness={0.18}
        clearcoat={0.7}
        clearcoatRoughness={0.08}
        envMapIntensity={1.6}
      />
    </mesh>
  );
}

export function StreetDetails() {
  return (
    <group>
      {CROSSWALK_PLACEMENTS.map((placement) =>
        placement.axis === 'ns' ? (
          <CrosswalkNS key={placement.id} z={placement.value} />
        ) : (
          <CrosswalkEW key={placement.id} x={placement.value} />
        ),
      )}

      {TRAFFIC_LIGHT_PLACEMENTS.map((placement) => (
        <TrafficLight
          key={placement.id}
          position={placement.position}
          rotation={placement.rotation}
          phase={placement.phase}
        />
      ))}

      {STREET_SIGN_PLACEMENTS.map((placement) => (
        <StreetSign
          key={placement.id}
          position={placement.position}
          rotation={placement.rotation}
          title={placement.title}
          sub={placement.sub}
          accent={placement.accent}
        />
      ))}

      {BUS_SHELTER_PLACEMENTS.map((placement) => (
        <BusShelter key={placement.id} position={placement.position} rotation={placement.rotation} />
      ))}

      {WET_PATCH_PLACEMENTS.map((placement) => (
        <WetPatch
          key={placement.id}
          position={placement.position}
          scale={placement.scale}
          rotation={placement.rotation}
        />
      ))}

      {PLANTER_PLACEMENTS.map((placement) => (
        <group key={placement.id} position={placement.position}>
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
