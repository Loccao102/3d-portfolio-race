import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { MilestoneZone } from '../../milestones/MilestoneZone';

export const ContactStation: React.FC = () => {
  const dishRef = useRef<THREE.Group>(null);
  const skyBeamRef = useRef<THREE.Mesh>(null);
  const beaconLightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(t * 0.3) * 0.35;
    }
    if (skyBeamRef.current) {
      const mat = skyBeamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + Math.sin(t * 3.0) * 0.1;
    }
    if (beaconLightRef.current) {
      const mat = beaconLightRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (Math.sin(t * 5.0) > 0.3 ? 1.0 : 0.2);
    }
  });

  return (
    <group position={[0, 0, -76]}>
      {/* Interactive Milestone Trigger Zone */}
      <MilestoneZone
        id="contact"
        position={[0, 0, 5]}
        radius={5.5}
        label="CONTACT STATION"
        sublabel="Communication & Uplink"
        color="#38bdf8"
      />

      {/* 1. Station Base Platform */}
      <RigidBody type="fixed">
        <CuboidCollider args={[8, 0.2, 7]} position={[0, 0.2, -3]} />
      </RigidBody>
      <mesh receiveShadow position={[0, 0.2, -3]}>
        <boxGeometry args={[16, 0.4, 14]} />
        <meshStandardMaterial color="#0f1422" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* 2. Parabolic Satellite Dish Tower */}
      <group position={[0, 0.4, -4]}>
        {/* Foundation Pylon */}
        <mesh castShadow position={[0, 1.8, 0]}>
          <cylinderGeometry args={[1.2, 1.8, 3.6, 8]} />
          <meshStandardMaterial color="#1a2233" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Rotating Dish Assembly */}
        <group ref={dishRef} position={[0, 3.8, 0]}>
          {/* Gimbal Mount */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.7, 8, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>

          {/* Parabolic Dish (Angled toward sky) */}
          <group rotation={[-0.65, 0, 0]} position={[0, 0.8, -0.4]}>
            {/* Outer Rim */}
            <mesh castShadow>
              <cylinderGeometry args={[3.2, 1.2, 0.8, 16, 1, true]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} side={THREE.DoubleSide} />
            </mesh>
            {/* Dish Core */}
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[1.2, 0.4, 0.3, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.9} />
            </mesh>
            {/* Feed Horn Antenna Spire */}
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 2.2, 8]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <sphereGeometry args={[0.22, 8, 8]} />
              <meshBasicMaterial color="#00f3ff" />
            </mesh>
          </group>
        </group>

        {/* Transmission Tower Spire */}
        <group position={[-5.0, 0, 0]}>
          <mesh castShadow position={[0, 4.5, 0]}>
            <cylinderGeometry args={[0.08, 0.35, 9.0, 6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          {/* Aircraft Warning Flashing Red Beacon */}
          <mesh ref={beaconLightRef} position={[0, 9.1, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <pointLight position={[0, 9.1, 0]} color="#ef4444" intensity={1.5} distance={10} />
        </group>

        {/* Vertical Sky Data Beam */}
        <mesh ref={skyBeamRef} position={[0, 25, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 50, 16, 1, true]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3. Overhead Neon Billboard */}
      <group position={[0, 6.2, 3]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <boxGeometry args={[8.0, 1.0, 0.1]} />
          <meshStandardMaterial color="#0c0e17" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[7.6, 0.8]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[5.8, 0.12, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  );
};

