import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { MilestoneZone } from '../../milestones/MilestoneZone';
import { useGameStore } from '../../../stores/useGameStore';
import { i18n } from '../../../data/i18n';
import { DistrictProps } from './AboutDistrict';

export const ExperimentLab: React.FC<DistrictProps> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const language = useGameStore((state) => state.language);
  const t = i18n[language].districts.experiments;
  const screensRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (screensRef.current) {
      screensRef.current.position.y = 2 + Math.sin(time * 1.5) * 0.2;
      screensRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Floating Island Base */}
      <RigidBody type="fixed">
        <CuboidCollider args={[10, 0.5, 10]} position={[0, -0.5, 0]} />
        <mesh position={[0, -3, 0]} receiveShadow>
          <cylinderGeometry args={[10, 2, 6, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[10.2, 10.2, 0.4, 16]} />
          <meshStandardMaterial color="#c084fc" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Creative Studio Props (Cameras, Screens) */}
      <group position={[0, 0.2, -3]}>
        {/* Main Lens / Camera Body */}
        <mesh castShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[3, 2, 1.5]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Lens Cylinder */}
        <mesh castShadow position={[0, 1.5, 1]}>
          <cylinderGeometry args={[0.8, 0.8, 1, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 1.5, 1.51]}>
          <circleGeometry args={[0.6, 16]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      </group>

      {/* Floating Screens */}
      <group ref={screensRef} position={[0, 3, 2]}>
        <mesh castShadow position={[-2, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
          <planeGeometry args={[2, 1.5]} />
          <meshBasicMaterial color="#ec4899" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
        <mesh castShadow position={[2, 0, 0]} rotation={[0, -Math.PI / 6, 0]}>
          <planeGeometry args={[2, 1.5]} />
          <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Interactive Milestone Trigger Zone */}
      <MilestoneZone
        id="experiments"
        position={[0, 0.5, 6]}
        radius={5.2}
        label={t.title}
        sublabel={t.subtitle}
        color="#c084fc"
      />
    </group>
  );
};
