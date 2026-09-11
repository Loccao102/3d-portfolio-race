import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';

function WindowStrip({
  position,
  rotation = 0,
  count = 5,
  spacing = 1.25,
  accent = '#f8fafc',
}: {
  position: [number, number, number];
  rotation?: number;
  count?: number;
  spacing?: number;
  accent?: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: count }, (_, index) => {
        const offset = (index - (count - 1) / 2) * spacing;
        return (
          <group key={`window-${index}`} position={[offset, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.78, 1.05, 0.08]} />
              <meshPhysicalMaterial
                color="#0f1d2d"
                roughness={0.14}
                metalness={0.24}
                transmission={0.08}
                envMapIntensity={1.7}
              />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[0.62, 0.84]} />
              <meshStandardMaterial
                color={index % 3 === 0 ? '#fde68a' : accent}
                emissive={index % 3 === 0 ? '#f59e0b' : accent}
                emissiveIntensity={index % 3 === 0 ? 0.42 : 0.15}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function AirConUnit({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.82, 0.58, 0.34]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.64} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0, 0.18]}>
        <circleGeometry args={[0.2, 18]} />
        <meshStandardMaterial color="#475569" roughness={0.48} metalness={0.35} />
      </mesh>
      <mesh position={[0, -0.37, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.42]} />
        <meshStandardMaterial color="#64748b" metalness={0.48} roughness={0.34} />
      </mesh>
    </group>
  );
}

function WaterTank({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.8, 0.8, 1.5, 20]} />
        <meshStandardMaterial color="#64748b" roughness={0.36} metalness={0.72} />
      </mesh>
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.76, 0.18, 20]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.34} metalness={0.68} />
      </mesh>
      {[0, Math.PI / 2].map((angle) => (
        <mesh key={`tank-leg-${angle}`} position={[Math.cos(angle) * 0.48, -1, Math.sin(angle) * 0.48]}>
          <cylinderGeometry args={[0.055, 0.055, 0.65, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function Balcony({ position, rotation = 0, width = 4.6 }: { position: [number, number, number]; rotation?: number; width?: number }) {
  const rails = useMemo(() => Array.from({ length: Math.max(5, Math.floor(width / 0.55)) }, (_, i) => i), [width]);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, -0.08, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.16, 1.05]} />
        <meshStandardMaterial color="#4b5563" roughness={0.62} metalness={0.24} />
      </mesh>
      <mesh position={[0, 0.55, 1]}>
        <boxGeometry args={[width, 0.055, 0.055]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.82} roughness={0.24} />
      </mesh>
      {rails.map((index) => {
        const x = -width / 2 + (index / Math.max(1, rails.length - 1)) * width;
        return (
          <mesh key={`rail-${index}`} position={[x, 0.27, 1]}>
            <boxGeometry args={[0.045, 0.6, 0.045]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.26} />
          </mesh>
        );
      })}
    </group>
  );
}

function RooftopAntenna({ position, accent = '#38bdf8' }: { position: [number, number, number]; accent?: string }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.09, 3.6, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.82} roughness={0.25} />
      </mesh>
      {[0.8, 1.3].map((y, index) => (
        <mesh key={`antenna-arm-${index}`} position={[0, y, 0]} rotation={[0, 0, index % 2 === 0 ? 0.5 : -0.5]}>
          <boxGeometry args={[1.15, 0.035, 0.035]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.78} roughness={0.24} />
        </mesh>
      ))}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function CableLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const mid = a.clone().lerp(b, 0.5);
    mid.y -= 0.7;
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [start, end]);

  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 16, 0.025, 5, false), [curve]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#111827" roughness={0.72} metalness={0.28} />
    </mesh>
  );
}

/**
 * Close-range detail pass layered on top of the lightweight authored GLBs.
 * These props add Vietnamese urban cues without replacing or inflating the base assets.
 */
export function ArchitecturalDetails() {
  const quality = useGameStore((state) => state.quality);
  const high = quality === 'high';

  return (
    <group>
      {/* About district: residential / studio facades. */}
      <WindowStrip position={[-14, 4.6, 44.9]} count={5} accent="#67e8f9" />
      <WindowStrip position={[14, 5.2, 44.9]} count={5} accent="#fca5a5" />
      <Balcony position={[-14, 3.1, 45.3]} width={5.4} />
      <Balcony position={[14, 3.5, 45.3]} width={5.2} />
      <AirConUnit position={[-11.2, 2.4, 45.1]} />
      <AirConUnit position={[16.9, 2.8, 45.1]} />
      <WaterTank position={[-14, 9.6, 48]} scale={0.8} />
      <WaterTank position={[14, 10.3, 48]} scale={0.82} />

      {/* Tech district: sharper glass bands and rooftop signal hardware. */}
      <WindowStrip position={[-15, 6.2, -43.7]} count={6} spacing={1.05} accent="#22d3ee" />
      <WindowStrip position={[15, 6.8, -43.7]} count={6} spacing={1.05} accent="#818cf8" />
      <RooftopAntenna position={[-15, 13.6, -48]} accent="#22d3ee" />
      <RooftopAntenna position={[15, 14.8, -48]} accent="#818cf8" />

      {/* Project district: workshop facade details. */}
      <WindowStrip position={[46.9, 5.1, 14]} rotation={Math.PI / 2} count={4} accent="#fb7185" />
      <WindowStrip position={[46.9, 4.7, -14]} rotation={Math.PI / 2} count={4} accent="#f59e0b" />
      <AirConUnit position={[47.1, 2.8, 16.8]} rotation={Math.PI / 2} />
      <AirConUnit position={[47.1, 2.6, -11.2]} rotation={Math.PI / 2} />

      {/* Experiment district: service hardware and antenna detail. */}
      <WindowStrip position={[-46.8, 5.1, 12]} rotation={-Math.PI / 2} count={4} accent="#c084fc" />
      <WindowStrip position={[-46.8, 5.6, -12]} rotation={-Math.PI / 2} count={4} accent="#34d399" />
      <RooftopAntenna position={[-52, 12.2, -12]} accent="#a855f7" />

      {/* Contact district: practical rooftop tanks + comms. */}
      <WaterTank position={[-12, 9.4, -100]} scale={0.68} />
      <WaterTank position={[12, 9.4, -100]} scale={0.68} />
      <RooftopAntenna position={[-12, 11.5, -100]} accent="#38bdf8" />
      <RooftopAntenna position={[12, 11.5, -100]} accent="#60a5fa" />

      {high && (
        <>
          <CableLine start={[-18, 8.4, 48]} end={[-4, 10.4, 62]} />
          <CableLine start={[18, 8.8, 48]} end={[4, 10.4, 62]} />
          <CableLine start={[-15, 13.8, -48]} end={[0, 11.8, -60]} />
          <CableLine start={[15, 14.8, -48]} end={[0, 11.8, -60]} />
        </>
      )}
    </group>
  );
}
