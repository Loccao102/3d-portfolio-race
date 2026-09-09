import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { MilestoneZone } from '../../milestones/MilestoneZone';

export const AboutDistrict: React.FC = () => {
  const neonSignRef = useRef<THREE.Group>(null);
  const monitorGlowRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (neonSignRef.current) {
      neonSignRef.current.position.y = 5.6 + Math.sin(t * 1.6) * 0.12;
    }
    if (monitorGlowRef.current) {
      const material = monitorGlowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.75 + Math.sin(t * 4.0) * 0.15;
    }
    if (steamRef.current) {
      steamRef.current.position.y = 1.75 + Math.sin(t * 2.5) * 0.08;
      const s = 0.8 + Math.sin(t * 3.0) * 0.2;
      steamRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, 38]}>
      {/* Interactive Milestone Trigger Zone */}
      <MilestoneZone
        id="about"
        position={[0, 0, -4]}
        radius={5.2}
        label="ABOUT DISTRICT"
        sublabel="Who is Loc?"
        color="#00f3ff"
      />

      {/* 1. Raised Architectural Loft Deck */}
      <RigidBody type="fixed">
        <CuboidCollider args={[7.5, 0.25, 6]} position={[0, 0.25, 3]} />
      </RigidBody>
      <mesh receiveShadow position={[0, 0.25, 3]}>
        <boxGeometry args={[15, 0.5, 12]} />
        <meshStandardMaterial color="#182030" roughness={0.4} metalness={0.4} />
      </mesh>
      {/* Warm Golden / Amber Recessed Baseboard Glow */}
      <mesh position={[0, 0.49, -2.9]}>
        <boxGeometry args={[14.8, 0.04, 0.08]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, 0.49, 8.9]}>
        <boxGeometry args={[14.8, 0.04, 0.08]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>

      {/* 2. Sleek Developer Workstation */}
      <group position={[0, 0.5, 3]}>
        {/* Tabletop: Dark Smoked Glass / Carbon */}
        <mesh castShadow receiveShadow position={[0, 1.35, 0]}>
          <boxGeometry args={[5.6, 0.1, 2.4]} />
          <meshStandardMaterial color="#0b111e" roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Brushed Aluminum Table Legs */}
        {[-2.4, 2.4].map((x, i) => (
          <group key={`desk-leg-${i}`} position={[x, 0.65, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.12, 1.3, 2.0]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Dual Curved Ultrawide Display Array */}
        {/* Primary Monitor: Curved Wide Code Display */}
        <group position={[-0.8, 2.25, -0.4]} rotation={[0, 0.08, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.6, 1.25, 0.08]} />
            <meshStandardMaterial color="#0a0e17" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Glowing Code Matrix */}
          <mesh ref={monitorGlowRef} position={[0, 0, 0.05]}>
            <planeGeometry args={[2.5, 1.15]} />
            <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
          </mesh>
          {/* Articulated Stand */}
          <mesh position={[0, -0.5, -0.2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.7, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
        </group>

        {/* Secondary Vertical Terminal Display */}
        <group position={[1.4, 2.35, -0.2]} rotation={[0, -0.28, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.0, 1.55, 0.08]} />
            <meshStandardMaterial color="#0a0e17" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[0.92, 1.45]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Mechanical Keyboard with Cyan RGB Underglow */}
        <mesh position={[-0.4, 1.42, 0.45]}>
          <boxGeometry args={[1.3, 0.06, 0.48]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-0.4, 1.4, 0.45]}>
          <planeGeometry args={[1.4, 0.6]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} />
        </mesh>

        {/* Ergonomic Designer Mesh Chair */}
        <group position={[-0.4, 0, 1.7]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow position={[0, 0.9, 0]}>
            <boxGeometry args={[1.1, 0.12, 1.0]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 1.5, -0.45]}>
            <boxGeometry args={[1.0, 1.1, 0.15]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.9, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>

        {/* Ceramic Coffee Mug with Rising Steam */}
        <group position={[1.5, 1.47, 0.45]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.1, 0.24, 14]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 12]} />
            <meshBasicMaterial color="#78350f" />
          </mesh>
          {/* Subtle Steam Puff */}
          <mesh ref={steamRef} position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#e2e8f0" transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Designer Desk Lamp with Focused Warm Spotlight */}
        <group position={[-2.1, 1.42, -0.4]}>
          <mesh castShadow position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
          <mesh position={[0.2, 0.9, 0.1]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.26, 0.38, 14]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
          </mesh>
          <pointLight position={[0.3, 0.8, 0.2]} intensity={2.2} distance={6} color="#fde68a" />
        </group>

        {/* Cyber Bonsai Plant with Glowing Emerald Foliage */}
        <group position={[-2.1, 1.42, 0.45]}>
          {/* Pot */}
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.28, 12]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Trunk */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.05, 0.08, 0.35, 8]} />
            <meshStandardMaterial color="#3f2e21" />
          </mesh>
          {/* Bioluminescent Foliage Cluster */}
          <mesh position={[0, 0.45, 0]}>
            <dodecahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* 3. Floating Architectural Neon Marquee ("WHO IS LOC?") */}
      <group ref={neonSignRef} position={[0, 5.6, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[7.2, 1.3, 0.18]} />
          <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Glow Backplate */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[7.0, 1.1]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.2} />
        </mesh>
        {/* Neon Accent Channels */}
        <mesh position={[0, 0.22, 0.12]}>
          <boxGeometry args={[5.6, 0.14, 0.04]} />
          <meshBasicMaterial color="#00f3ff" />
        </mesh>
        <mesh position={[0, -0.22, 0.12]}>
          <boxGeometry args={[4.2, 0.1, 0.04]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>
    </group>
  );
};
