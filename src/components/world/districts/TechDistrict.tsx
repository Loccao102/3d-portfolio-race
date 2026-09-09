import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { MilestoneZone } from '../../milestones/MilestoneZone';
import { TechReactorModel } from './TechReactorModel';

export const TechDistrict: React.FC = () => {
  const gyro1Ref = useRef<THREE.Group>(null);
  const gyro2Ref = useRef<THREE.Group>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const dataLightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (gyro1Ref.current) {
      gyro1Ref.current.rotation.y = t * 0.9;
      gyro1Ref.current.rotation.x = Math.sin(t * 0.6) * 0.2;
    }
    if (gyro2Ref.current) {
      gyro2Ref.current.rotation.x = t * -0.7;
      gyro2Ref.current.rotation.z = Math.cos(t * 0.5) * 0.2;
    }
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 2.5 + Math.sin(t * 3.5) * 1.0;
    }
    if (dataLightRef.current) {
      dataLightRef.current.position.y = 2.2 + Math.sin(t * 4.0) * 1.5;
    }
  });

  return (
    <group position={[0, 0, -38]}>
      {/* Interactive Milestone Trigger Zone */}
      <MilestoneZone
        id="tech"
        position={[0, 0, 4]}
        radius={5.5}
        label="TECH DISTRICT"
        sublabel="Architecture & Systems"
        color="#f59e0b"
      />

      {/* 1. Raised District Base Platform */}
      <RigidBody type="fixed">
        <CuboidCollider args={[10.5, 0.25, 8.5]} position={[0, 0.25, -4]} />
      </RigidBody>
      <mesh receiveShadow position={[0, 0.25, -4]}>
        <boxGeometry args={[21, 0.5, 17]} />
        <meshStandardMaterial color="#111726" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Glowing Amber Perimeter Baseboard Strip */}
      <mesh position={[0, 0.51, 4.4]}>
        <boxGeometry args={[20.8, 0.04, 0.08]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* 2. Central High-Fidelity 3D Ion Reactor Core */}
      <group position={[0, 0.5, -6]}>
        {/* Hexagonal Foundation Base */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[2.8, 3.4, 1.0, 6]} />
          <meshStandardMaterial color="#1a2234" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* 3D Sci-Fi Primary Ion Drive Model */}
        <TechReactorModel />
      </group>

      {/* 3. PostgreSQL Data Vault (Left Flank) */}
      <group position={[-6.8, 0.5, -4]}>
        {/* Monolith Server Tower */}
        <mesh castShadow position={[0, 2.4, 0]}>
          <boxGeometry args={[2.4, 4.8, 2.8]} />
          <meshStandardMaterial color="#0b1120" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Server Memory Banks with Cascading Cyan LEDs */}
        {[-1.5, -0.7, 0.1, 0.9, 1.7].map((y, idx) => (
          <mesh key={`slot-${idx}`} position={[0, 2.4 + y, 1.41]}>
            <boxGeometry args={[2.0, 0.28, 0.04]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
        ))}
        {/* Animated Data Stream Packet */}
        <mesh ref={dataLightRef} position={[0, 2.2, 1.45]}>
          <boxGeometry args={[0.3, 0.8, 0.06]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 4. Docker Container Yard (Right Flank) */}
      <group position={[6.8, 0.5, -4]}>
        {/* Lower Container (Ocean Blue) */}
        <mesh castShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[2.3, 1.8, 4.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.35} metalness={0.65} />
        </mesh>
        {/* Upper Stacked Container (Electric Cyan) */}
        <mesh castShadow position={[0, 2.7, 0.4]}>
          <boxGeometry args={[2.3, 1.8, 4.6]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.35} metalness={0.65} />
        </mesh>
        {/* Hazard Yellow/Black Warning Stripe */}
        <mesh position={[1.16, 2.7, 0.4]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.8, 0.45]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      </group>

      {/* 5. Overhead Tech District Hologram Marquee */}
      <group position={[0, 7.2, -4]}>
        <mesh>
          <boxGeometry args={[8.6, 1.1, 0.12]} />
          <meshStandardMaterial color="#080c16" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[8.3, 0.9]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[6.2, 0.14, 0.02]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>
    </group>
  );
};
