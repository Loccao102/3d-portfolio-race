import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface FerrariModelProps {
  bodyColor: string;
  accentColor?: string;
  speed?: number;
  speedRef?: React.RefObject<number>;
  steerAngle?: number;
  steerAngleRef?: React.RefObject<number>;
  isReversing?: boolean;
  scale?: number;
}

export const FerrariModel: React.FC<FerrariModelProps> = ({
  bodyColor,
  accentColor = '#00f3ff',
  speed = 0,
  speedRef,
  steerAngle = 0,
  steerAngleRef,
  isReversing = false,
  scale = 0.92,
}) => {
  const { scene } = useGLTF('/models/ferrari.glb');
  const carGroupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const frontLeftWheelRef = useRef<THREE.Object3D | null>(null);
  const frontRightWheelRef = useRef<THREE.Object3D | null>(null);
  const wheelRotationRef = useRef<number>(0);

  // Clone the scene graph so each car (player and AI rivals) has independent transforms & materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(bodyColor),
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor || '#ffffff'),
      metalness: 0.95,
      roughness: 0.12,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      transparent: true,
      opacity: 0.88,
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e293b'),
      metalness: 0.8,
      roughness: 0.3,
    });

    const brakeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor || '#f59e0b'),
      metalness: 0.8,
      roughness: 0.2,
    });

    const wheels: THREE.Object3D[] = [];

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.name === 'body') {
          mesh.material = bodyMat;
        } else if (mesh.name.startsWith('rim_')) {
          mesh.material = rimMat;
        } else if (mesh.name === 'glass') {
          mesh.material = glassMat;
        } else if (mesh.name === 'trim' || mesh.name === 'plastic_gray') {
          mesh.material = trimMat;
        } else if (mesh.name === 'brakes' || mesh.name === 'brake') {
          mesh.material = brakeMat;
        }
      }

      if (
        child.name === 'wheel_fl' ||
        child.name === 'wheel_fr' ||
        child.name === 'wheel_rl' ||
        child.name === 'wheel_rr'
      ) {
        wheels.push(child);
        if (child.name === 'wheel_fl') frontLeftWheelRef.current = child;
        if (child.name === 'wheel_fr') frontRightWheelRef.current = child;
      }
    });

    wheelsRef.current = wheels;
    return clone;
  }, [scene, bodyColor, accentColor]);

  useFrame((_, delta) => {
    const currentSpeed = speedRef ? speedRef.current : speed;
    const currentSteer = steerAngleRef ? steerAngleRef.current : steerAngle;

    // 1. Wheel spin rotation proportional to speed (tire radius ~0.35m)
    const clampedDelta = Math.min(delta, 0.05);
    const angularSpeed = (currentSpeed || 0) / 0.35;
    wheelRotationRef.current += angularSpeed * clampedDelta;

    for (const w of wheelsRef.current) {
      w.rotation.x = wheelRotationRef.current;
    }

    // 2. Front wheel steering rotation on Y axis
    if (frontLeftWheelRef.current) {
      frontLeftWheelRef.current.rotation.y = currentSteer || 0;
    }
    if (frontRightWheelRef.current) {
      frontRightWheelRef.current.rotation.y = currentSteer || 0;
    }
  });

  return (
    <group ref={carGroupRef} scale={[scale, scale, scale]} position={[0, 0, 0]}>
      {/* 3D Ferrari GLTF Model Hierarchy */}
      <primitive object={clonedScene} />

      {/* Cyberpunk LED Neon Underglow Light */}
      <pointLight
        position={[0, 0.15, 0]}
        intensity={2.8}
        distance={4.5}
        color={accentColor}
      />
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 3.8]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.25} />
      </mesh>

      {/* Front Headlights Beams */}
      <group position={[0, 0.42, -1.9]}>
        {/* Left Projector */}
        <mesh position={[-0.58, 0, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Right Projector */}
        <mesh position={[0.58, 0, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Forward Headlight Spotlight */}
        <spotLight
          position={[0, 0.2, 0]}
          target-position={[0, 0, -15]}
          intensity={3.5}
          distance={28}
          angle={0.65}
          penumbra={0.6}
          color="#f0f9ff"
        />
      </group>

      {/* Rear Taillights & Reversing Lights */}
      <group position={[0, 0.52, 2.05]}>
        {/* Left Red LED */}
        <mesh position={[-0.62, 0, 0]}>
          <boxGeometry args={[0.22, 0.08, 0.04]} />
          <meshBasicMaterial color="#ff0044" />
        </mesh>
        {/* Right Red LED */}
        <mesh position={[0.62, 0, 0]}>
          <boxGeometry args={[0.22, 0.08, 0.04]} />
          <meshBasicMaterial color="#ff0044" />
        </mesh>

        {/* Dynamic White LED Reverse Lights */}
        {isReversing && (
          <>
            <mesh position={[-0.32, -0.06, 0.01]}>
              <boxGeometry args={[0.15, 0.06, 0.03]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.32, -0.06, 0.01]}>
              <boxGeometry args={[0.15, 0.06, 0.03]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <pointLight
              position={[0, 0, 0.3]}
              intensity={2.2}
              distance={4}
              color="#ffffff"
            />
          </>
        )}
      </group>
    </group>
  );
};

useGLTF.preload('/models/ferrari.glb');
