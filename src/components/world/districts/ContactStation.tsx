import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { MilestoneZone } from '../../milestones/MilestoneZone';
import { useGameStore } from '../../../stores/useGameStore';
import { i18n } from '../../../data/i18n';
import { DistrictProps } from './AboutDistrict';

export const ContactStation: React.FC<DistrictProps> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const language = useGameStore((state) => state.language);
  const t = i18n[language].districts.contact;
  const lanternsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (lanternsRef.current) {
      // Gentle swing
      lanternsRef.current.children.forEach((lantern, i) => {
        lantern.rotation.z = Math.sin(time * 2 + i) * 0.1;
      });
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Floating Island Base */}
      <RigidBody type="fixed">
        <CuboidCollider args={[10, 0.5, 10]} position={[0, -0.5, 0]} />
        <mesh position={[0, -3, 0]} receiveShadow>
          <cylinderGeometry args={[10, 2, 6, 16]} />
          <meshStandardMaterial color="#57534e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[10.2, 10.2, 0.4, 16]} />
          <meshStandardMaterial color="#ea580c" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Traditional Vietnamese House (Hội An style) */}
      <group position={[0, 0.2, -4]}>
        {/* Wall */}
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[8, 3, 4]} />
          <meshStandardMaterial color="#fef3c7" /> {/* Yellow wall */}
        </mesh>
        {/* Roof */}
        <mesh castShadow position={[0, 3.5, 0]}>
          <coneGeometry args={[5, 2, 4]} />
          <meshStandardMaterial color="#991b1b" roughness={0.9} /> {/* Terracotta roof */}
        </mesh>
        {/* Door */}
        <mesh position={[0, 1, 2.01]}>
          <boxGeometry args={[1.5, 2, 0.1]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      </group>

      {/* Hanging Lanterns */}
      <group ref={lanternsRef} position={[0, 4, -1]}>
        {[-3, -1, 1, 3].map((x, i) => (
          <group key={`lantern-${i}`} position={[x, 0, 0]}>
            {/* String */}
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1]} />
              <meshBasicMaterial color="#000" />
            </mesh>
            {/* Lantern Body */}
            <mesh position={[0, -1, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color={i % 2 === 0 ? "#ef4444" : "#f59e0b"} />
            </mesh>
            <pointLight position={[0, -1, 0]} color={i % 2 === 0 ? "#ef4444" : "#f59e0b"} intensity={1.5} distance={4} />
          </group>
        ))}
      </group>

      {/* Interactive Milestone Trigger Zone */}
      <MilestoneZone
        id="contact"
        position={[0, 0.5, 6]}
        radius={5.2}
        label={t.title}
        sublabel={t.subtitle}
        color="#f59e0b"
      />
    </group>
  );
};
