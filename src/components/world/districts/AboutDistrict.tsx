import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { MilestoneZone } from '../../milestones/MilestoneZone';
import { useGameStore } from '../../../stores/useGameStore';
import { i18n } from '../../../data/i18n';

export interface DistrictProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const AboutDistrict: React.FC<DistrictProps> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const language = useGameStore((state) => state.language);
  const t = i18n[language].districts.about;
  const boatRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (boatRef.current) {
      boatRef.current.position.y = Math.sin(time * 2) * 0.1;
      boatRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Floating Island Base */}
      <RigidBody type="fixed">
        <CuboidCollider args={[10, 0.5, 10]} position={[0, -0.5, 0]} />
        <mesh position={[0, -3, 0]} receiveShadow>
          <cylinderGeometry args={[10, 2, 6, 16]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.9} />
        </mesh>
        {/* Grass Top */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[10.2, 10.2, 0.4, 16]} />
          <meshStandardMaterial color="#4ade80" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Terraced Rice Fields (Ruộng bậc thang) */}
      <group position={[-2, 0.2, -2]}>
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[6, 6, 0.4, 12]} />
          <meshStandardMaterial color="#84cc16" />
        </mesh>
        <mesh position={[1, 0.6, 1]} receiveShadow castShadow>
          <cylinderGeometry args={[4, 4, 0.4, 12]} />
          <meshStandardMaterial color="#a3e635" />
        </mesh>
        <mesh position={[2, 1.0, 2]} receiveShadow castShadow>
          <cylinderGeometry args={[2, 2, 0.4, 12]} />
          <meshStandardMaterial color="#bef264" />
        </mesh>
      </group>

      {/* Halong Bay style Karst Mountain */}
      <mesh position={[5, 3, -4]} castShadow>
        <coneGeometry args={[2, 6, 7]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.9} />
      </mesh>

      {/* Small Boat */}
      <group ref={boatRef} position={[-5, 0.5, 4]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.4, 0.6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Sail */}
        <mesh position={[0, 1, 0]} rotation={[0, Math.PI / 4, 0]}>
          <planeGeometry args={[1, 1.5]} />
          <meshStandardMaterial color="#fef08a" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Interactive Milestone Trigger Zone */}
      <MilestoneZone
        id="about"
        position={[0, 0.5, 6]}
        radius={5.2}
        label={t.title}
        sublabel={t.subtitle}
        color="#22c55e"
      />
    </group>
  );
};
