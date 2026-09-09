import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Float, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';
import { i18n } from '../../data/i18n';

export const HeroMonument: React.FC = () => {
  const language = useGameStore((state) => state.language);
  const t = i18n[language];
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Plinth / Pedestal (Trống Đồng - Bronze Drum) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[4, 0.5, 4]} position={[0, 0.5, 0]} />
        <mesh receiveShadow castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[4, 4.5, 0.8, 32]} />
          <meshStandardMaterial color="#b45309" metalness={0.6} roughness={0.4} /> {/* Bronze / Gold */}
        </mesh>
        {/* Bronze Drum Top Face */}
        <mesh ref={innerRingRef} position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.9, 32]} />
          <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Stylized Lotus Pedestals (Hoa Sen) */}
        {[-3.5, 3.5].map((x) => (
          <group key={x} position={[x, 0.8, 0]}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.4, 0.1, 0.4, 8]} />
              <meshStandardMaterial color="#ec4899" /> {/* Pink Lotus Base */}
            </mesh>
            <pointLight position={[0, 1, 0]} color="#fdf2f8" intensity={2} distance={5} />
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color="#fdf2f8" />
            </mesh>
          </group>
        ))}
      </RigidBody>

      {/* Flagpole (Cờ Tổ Quốc) */}
      <group position={[0, 0.8, -3]}>
        <mesh castShadow position={[0, 3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 6, 8]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.9} />
        </mesh>
        {/* Red Flag */}
        <mesh position={[0.7, 5.5, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshStandardMaterial color="#ef4444" side={THREE.DoubleSide} />
        </mesh>
        {/* Yellow Star (Simplified) */}
        <mesh position={[0.7, 5.5, 0.01]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.2, 5]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* Floating 3D Portrait Frame (Wooden/Traditional Vibe) */}
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.3} floatingRange={[0, 0.2]}>
        <group position={[0, 4.0, 0]}>
          {/* Main Wooden Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.2, 4.2, 0.4]} />
            <meshStandardMaterial color="#451a03" metalness={0.1} roughness={0.8} />
          </mesh>
          
          {/* Inner Golden Edge */}
          <mesh position={[0, 0, 0.21]}>
            <boxGeometry args={[3.9, 3.9, 0.05]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>

          {/* Placeholder for Photo/Avatar Screen */}
          <mesh position={[0, 0, 0.22]}>
            <planeGeometry args={[3.8, 3.8]} />
            <meshStandardMaterial color="#fffbeb" emissive="#fffbeb" emissiveIntensity={0.1} roughness={0.9} />
          </mesh>

          {/* Holographic Text (Now dark/classic) */}
          <Text
            position={[0, -2.6, 0.2]}
            fontSize={0.4}
            color="#451a03"
            anchorX="center"
            anchorY="middle"
          >
            {t.heroTitle}
          </Text>
          <Text
            position={[0, -3.1, 0.2]}
            fontSize={0.2}
            color="#78350f"
            anchorX="center"
            anchorY="middle"
          >
            {t.heroSubtitle}
          </Text>
        </group>
      </Float>

      {/* Dramatic Spotlights (Warm Sunlit Colors) */}
      <SpotLight
        position={[-6, 0.5, 6]}
        angle={0.4}
        penumbra={0.5}
        intensity={100}
        color="#fef08a"
        target-position={[0, 4.0, 0]}
        castShadow
      />
      <SpotLight
        position={[6, 0.5, 6]}
        angle={0.4}
        penumbra={0.5}
        intensity={100}
        color="#f59e0b"
        target-position={[0, 4.0, 0]}
        castShadow
      />
    </group>
  );
};
