import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { MilestoneZone } from '../../milestones/MilestoneZone';
import { useGameStore } from '../../../stores/useGameStore';
import { i18n } from '../../../data/i18n';
import { DistrictProps } from './AboutDistrict';

export const TechDistrict: React.FC<DistrictProps> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const language = useGameStore((state) => state.language);
  const t = i18n[language].districts.tech;
  const scrollRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (scrollRef.current) {
      scrollRef.current.position.y = 2.5 + Math.sin(time * 2) * 0.2;
      scrollRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Floating Island Base */}
      <RigidBody type="fixed">
        <CuboidCollider args={[10, 0.5, 10]} position={[0, -0.5, 0]} />
        <mesh position={[0, -3, 0]} receiveShadow>
          <cylinderGeometry args={[10, 2, 6, 16]} />
          <meshStandardMaterial color="#292524" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[10.2, 10.2, 0.4, 16]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Traditional Temple structure (Khê Văn Các / Temple of Literature inspired) */}
      <group position={[0, 0.2, -3]}>
        {/* Base */}
        <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[6, 0.8, 6]} />
          <meshStandardMaterial color="#d6d3d1" />
        </mesh>
        {/* Pillars */}
        {[-2.5, 2.5].map((x) =>
          [-2.5, 2.5].map((z) => (
            <mesh key={`${x}-${z}`} castShadow position={[x, 2, z]}>
              <cylinderGeometry args={[0.2, 0.2, 3, 8]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          ))
        )}
        {/* Sweeping Red Roof */}
        <mesh castShadow position={[0, 4, 0]}>
          <coneGeometry args={[4.5, 2.5, 4]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.7} />
        </mesh>
      </group>

      {/* Floating Knowledge Scroll (Tech/Magic) */}
      <mesh ref={scrollRef} position={[0, 2.5, 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, 2.5, 2]} color="#fef08a" intensity={2} distance={5} />

      {/* Bamboo Grove */}
      {[-6, -5, -4].map((x, i) => (
        <mesh key={`bamboo-${i}`} position={[x, 2, -2 + i]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 4, 6]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
      ))}

      {/* Interactive Milestone Trigger Zone */}
      <MilestoneZone
        id="tech"
        position={[0, 0.5, 6]}
        radius={5.2}
        label={t.title}
        sublabel={t.subtitle}
        color="#fef08a"
      />
    </group>
  );
};
