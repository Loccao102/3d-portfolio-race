import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const TechReactorModel: React.FC = () => {
  const { scene } = useGLTF('/models/PrimaryIonDrive.glb');
  const groupRef = useRef<THREE.Group>(null);

  const clonedScene = React.useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2.8, 0]} scale={[1.4, 1.4, 1.4]}>
      <primitive object={clonedScene} rotation={[0, 0, Math.PI / 2]} />
      {/* High-intensity Amber/Cyan Energy Core Glow */}
      <pointLight position={[0, 0, 0]} intensity={4.5} distance={12} color="#f59e0b" />
      <pointLight position={[0, 1.5, 0]} intensity={2.5} distance={8} color="#00f3ff" />
    </group>
  );
};

useGLTF.preload('/models/PrimaryIonDrive.glb');

