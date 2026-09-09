import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export const Ground: React.FC = () => {
  // Bridges configuration
  const bridges = [0, 1, 2, 3, 4].map(i => {
    const angle = i * (Math.PI * 2) / 5 - Math.PI / 2;
    // Bridge spans from r=5 to r=55, length = 50
    const length = 50;
    const rCenter = 30; // Midpoint
    return {
      x: Math.cos(angle) * rCenter,
      z: Math.sin(angle) * rCenter,
      rotationY: -angle,
    };
  });

  return (
    <group>
      {/* 1. Global Water/Cloud Plane */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          transparent 
          opacity={0.8} 
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Physics Floor under everything to prevent falling forever, but much lower */}
      <RigidBody type="fixed" friction={0.4}>
        <CuboidCollider args={[500, 2, 500]} position={[0, -8, 0]} />
      </RigidBody>

      {/* 2. Central Hub Island Base (Underneath the Trống Đồng) */}
      <RigidBody type="fixed">
        <CuboidCollider args={[8, 4, 8]} position={[0, -4, 0]} />
        <mesh castShadow receiveShadow position={[0, -4, 0]}>
          <cylinderGeometry args={[8, 12, 8, 32]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
        {/* Grassy rim */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[8.2, 8.2, 0.2, 32]} />
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* 3. The 5 Connecting Stone Bridges */}
      {bridges.map((bridge, index) => (
        <group key={`bridge-${index}`} position={[bridge.x, 0, bridge.z]} rotation={[0, bridge.rotationY, 0]}>
          <RigidBody type="fixed">
            <CuboidCollider args={[25, 0.2, 3]} position={[0, -0.2, 0]} />
            
            {/* Bridge Path */}
            <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
              <boxGeometry args={[50, 0.4, 6]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.7} />
            </mesh>

            {/* Bridge Side Rails */}
            <mesh castShadow position={[0, 0.2, 2.9]}>
              <boxGeometry args={[50, 0.4, 0.2]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
            <mesh castShadow position={[0, 0.2, -2.9]}>
              <boxGeometry args={[50, 0.4, 0.2]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>

            {/* Arch underneath (purely visual) */}
            <mesh castShadow position={[0, -2, 0]}>
              <cylinderGeometry args={[3, 3, 5.8, 16, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#a8a29e" roughness={0.9} />
            </mesh>
          </RigidBody>
        </group>
      ))}
    </group>
  );
};
