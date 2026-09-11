import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';

/**
 * Behavior-bearing infrastructure only. Every object exists because it controls access,
 * communicates operational state, or provides a real portfolio interaction.
 */
export function InteractiveInfrastructure() {
  const garageDoorRef = useRef<THREE.Mesh>(null);
  const labArmRef = useRef<THREE.Group>(null);
  const contactPulseRef = useRef<THREE.Mesh>(null);

  const activeMilestone = useGameStore((state) => state.activeMilestone);
  const vehiclePos = useGameStore((state) => state.vehiclePos);
  const setActiveMilestone = useGameStore((state) => state.setActiveMilestone);
  const setCardOpen = useGameStore((state) => state.setCardOpen);
  const markMilestoneVisited = useGameStore((state) => state.markMilestoneVisited);

  const projectApproach = activeMilestone === 'projects' || vehiclePos.x > 29;
  const labApproach = activeMilestone === 'experiments' || vehiclePos.x < -29;

  useFrame(({ clock }, delta) => {
    if (garageDoorRef.current) {
      const targetY = projectApproach ? 7.2 : 3.0;
      garageDoorRef.current.position.y = THREE.MathUtils.damp(
        garageDoorRef.current.position.y,
        targetY,
        4.5,
        delta,
      );
    }
    if (labArmRef.current) {
      const target = labApproach ? -1.25 : 0;
      labArmRef.current.rotation.z = THREE.MathUtils.damp(
        labArmRef.current.rotation.z,
        target,
        5,
        delta,
      );
    }
    if (contactPulseRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2.2) * 0.12;
      contactPulseRef.current.scale.setScalar(pulse);
    }
  });

  const openContact = () => {
    setActiveMilestone('contact');
    markMilestoneVisited('contact');
    setCardOpen(true);
  };

  return (
    <group>
      {/* Project Garage access shutter: visually explains why the garage is an authored destination. */}
      <group position={[37.2, 0, 0]}>
        <mesh position={[0, 3.4, -5.2]} castShadow>
          <boxGeometry args={[0.42, 6.8, 0.42]} />
          <meshStandardMaterial color="#263244" metalness={0.82} roughness={0.26} />
        </mesh>
        <mesh position={[0, 3.4, 5.2]} castShadow>
          <boxGeometry args={[0.42, 6.8, 0.42]} />
          <meshStandardMaterial color="#263244" metalness={0.82} roughness={0.26} />
        </mesh>
        <mesh ref={garageDoorRef} position={[0, 3.0, 0]} castShadow>
          <boxGeometry args={[0.3, 5.1, 10.0]} />
          <meshStandardMaterial color="#0d1724" metalness={0.76} roughness={0.34} />
        </mesh>
        <mesh position={[-0.18, 6.9, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[7.4, 1.05]} />
          <meshBasicMaterial color="#10b981" transparent opacity={projectApproach ? 0.32 : 0.1} />
        </mesh>
      </group>

      {/* Experiment Lab safety arm: service campus visibly switches from restricted to active. */}
      <group position={[-34.5, 0, -5.4]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.5, 2.2, 0.5]} />
          <meshStandardMaterial color="#202b3a" metalness={0.72} roughness={0.32} />
        </mesh>
        <group ref={labArmRef} position={[0, 2.0, 0]}>
          <mesh position={[0, 0, 2.8]} castShadow>
            <boxGeometry args={[0.18, 0.18, 5.6]} />
            <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={0.35} />
          </mesh>
        </group>
        <pointLight position={[0, 2.1, 0]} color={labApproach ? '#22c55e' : '#ef4444'} intensity={1.8} distance={5} />
      </group>

      {/* Contact terminal: a functional interaction surface, placed on the actual Contact approach. */}
      <group position={[8.5, 0, -72]} rotation={[0, -0.25, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[2.8, 3.0, 1.0]} />
          <meshStandardMaterial color="#0b1422" metalness={0.68} roughness={0.26} />
        </mesh>
        <mesh ref={contactPulseRef} position={[0, 1.75, -0.53]}>
          <circleGeometry args={[0.55, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
        </mesh>
        <Html center position={[0, 0.72, -0.58]} distanceFactor={18} className="pointer-events-auto select-none">
          <button
            onClick={openContact}
            className="rounded-xl border border-sky-300/25 bg-slate-950/90 px-3 py-2 text-center shadow-xl backdrop-blur-md transition hover:border-sky-300/60 hover:bg-sky-300/10"
          >
            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-sky-300">Contact terminal</div>
            <div className="mt-1 text-[7px] text-slate-400">Open channels</div>
          </button>
        </Html>
      </group>
    </group>
  );
}
