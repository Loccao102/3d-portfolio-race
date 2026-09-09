import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Float, SpotLight, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const HeroMonument: React.FC = () => {
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = t * 0.5;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -t * 0.25;
      outerRingRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Plinth / Pedestal */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[4, 0.5, 4]} position={[0, 0.5, 0]} />
        <mesh receiveShadow castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[4, 4.5, 1, 32]} />
          <meshStandardMaterial color="#0b1120" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glow Ring on Pedestal */}
        <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.6, 3.8, 32]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
        </mesh>
      </RigidBody>

      {/* Floating 3D Portrait Frame */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[0, 0.4]}>
        <group position={[0, 4.5, 0]}>
          {/* Main Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.2, 4.2, 0.4]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Inner Glowing Edge */}
          <mesh position={[0, 0, 0.21]}>
            <boxGeometry args={[3.9, 3.9, 0.05]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>

          {/* Placeholder for Photo/Avatar Screen */}
          <mesh position={[0, 0, 0.22]}>
            <planeGeometry args={[3.8, 3.8]} />
            <meshStandardMaterial color="#020617" emissive="#020617" emissiveIntensity={0.5} roughness={0.5} />
          </mesh>

          {/* Holographic Text */}
          <Text
            position={[0, -2.6, 0.2]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#00f3ff"
          >
            LOC CAO
          </Text>
          <Text
            position={[0, -3.1, 0.2]}
            fontSize={0.2}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            SOFTWARE ENGINEER
          </Text>
        </group>
      </Float>

      {/* Kinetic Sci-Fi Rings */}
      <group position={[0, 4.5, 0]}>
        <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.8, 0.04, 16, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
        <mesh ref={outerRingRef} rotation={[Math.PI / 2.2, 0.1, 0]}>
          <torusGeometry args={[4.6, 0.08, 16, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={1} roughness={0.2} emissive="#f59e0b" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Dramatic Spotlights */}
      <SpotLight
        position={[-6, 0.5, 6]}
        angle={0.4}
        penumbra={0.5}
        intensity={200}
        color="#00f3ff"
        target-position={[0, 4.5, 0]}
        castShadow
      />
      <SpotLight
        position={[6, 0.5, 6]}
        angle={0.4}
        penumbra={0.5}
        intensity={200}
        color="#f59e0b"
        target-position={[0, 4.5, 0]}
        castShadow
      />
      <SpotLight
        position={[0, 0.5, -8]}
        angle={0.5}
        penumbra={0.5}
        intensity={150}
        color="#ffffff"
        target-position={[0, 4.5, 0]}
        castShadow
      />

    </group>
  );
};
