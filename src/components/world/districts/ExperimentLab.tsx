import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { MilestoneZone } from '../../milestones/MilestoneZone';
import { DistrictProps } from './AboutDistrict';

export const ExperimentLab: React.FC<DistrictProps> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const orbRef = useRef<THREE.Group>(null);
  const laserRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 1.2;
      orbRef.current.rotation.z = Math.sin(t * 0.8) * 0.4;
      orbRef.current.position.y = 3.2 + Math.sin(t * 2.0) * 0.3;
    }
    if (laserRef.current) {
      const mat = laserRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(t * 6.0) * 0.3;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Interactive Milestone Trigger Zone */}
      <MilestoneZone
        id="experiments"
        position={[4, 0, 0]}
        radius={5.0}
        label="EXPERIMENT ZONE"
        sublabel="Restricted Lab & Prototypes"
        color="#ff0077"
      />

      {/* 1. Base Platform */}
      <RigidBody type="fixed">
        <CuboidCollider args={[7.5, 0.2, 10]} position={[-3, 0.2, 0]} />
      </RigidBody>
      <mesh receiveShadow position={[-3, 0.2, 0]}>
        <boxGeometry args={[15, 0.4, 20]} />
        <meshStandardMaterial color="#121622" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* 2. Central Experiment Containment Chamber */}
      <group position={[-5, 0.4, 0]}>
        {/* Foundation Pedestal */}
        <mesh castShadow position={[0, 0.6, 0]}>
          <cylinderGeometry args={[2.5, 3.0, 1.2, 8]} />
          <meshStandardMaterial color="#1e2433" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Floating Futuristic Quantum Core / Diagnostic Orb */}
        <group ref={orbRef} position={[0, 3.2, 0]}>
          <mesh>
            <icosahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial
              color="#ff0077"
              emissive="#ff0077"
              emissiveIntensity={1.8}
              wireframe
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight color="#ff0077" intensity={2.0} distance={7} />
        </group>

        {/* Laser Containment Barrier Beams */}
        {[-2.0, 2.0].map((z, idx) => (
          <group key={`laser-pylon-${idx}`} position={[0, 0, z]}>
            <mesh castShadow position={[0, 1.8, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 3.6, 8]} />
              <meshStandardMaterial color="#0f1420" metalness={0.9} />
            </mesh>
            <mesh position={[0, 3.7, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color="#ff0077" />
            </mesh>
          </group>
        ))}

        {/* Pulsing Horizontal Laser Tripwire */}
        <mesh ref={laserRef} position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 4.0, 8]} />
          <meshBasicMaterial color="#ff0077" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 3. Restricted Sign Billboard */}
      <group position={[3.5, 5.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[10, 1.0, 0.1]} />
          <meshStandardMaterial color="#0c0e17" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[9.6, 0.8]} />
          <meshBasicMaterial color="#ff0077" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[7.0, 0.12, 0.02]} />
          <meshBasicMaterial color="#ff0077" />
        </mesh>
      </group>
    </group>
  );
};

