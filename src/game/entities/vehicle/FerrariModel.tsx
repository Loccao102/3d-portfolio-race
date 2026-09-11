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
  const wheelRotationRef = useRef(0);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(bodyColor),
      metalness: 0.84,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.035,
      reflectivity: 1,
      envMapIntensity: 2.2,
      ior: 1.46,
      specularIntensity: 1,
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor || '#ffffff'),
      metalness: 1,
      roughness: 0.1,
      envMapIntensity: 2.15,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dff4ff'),
      metalness: 0.05,
      roughness: 0.035,
      transmission: 0.92,
      thickness: 0.14,
      ior: 1.45,
      transparent: true,
      opacity: 0.94,
      envMapIntensity: 2.45,
      attenuationColor: new THREE.Color('#8bd7ff'),
      attenuationDistance: 2.8,
    });

    const trimMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#090d12'),
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 0.55,
      clearcoatRoughness: 0.16,
      envMapIntensity: 1.45,
    });

    const brakeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor || '#f59e0b'),
      emissive: new THREE.Color(accentColor || '#f59e0b').multiplyScalar(0.12),
      metalness: 0.78,
      roughness: 0.18,
      envMapIntensity: 1.8,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: '#05070a',
      roughness: 0.88,
      metalness: 0.02,
    });

    const wheels: THREE.Object3D[] = [];

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const meshName = mesh.name.toLowerCase();
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.name === 'body') mesh.material = bodyMat;
        else if (mesh.name.startsWith('rim_')) mesh.material = rimMat;
        else if (mesh.name === 'glass') mesh.material = glassMat;
        else if (mesh.name === 'trim' || mesh.name === 'plastic_gray') mesh.material = trimMat;
        else if (mesh.name === 'brakes' || mesh.name === 'brake') mesh.material = brakeMat;
        else if (meshName.includes('tire') || meshName.includes('tyre')) mesh.material = tireMat;
      }

      if (['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].includes(child.name)) {
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
    const clampedDelta = Math.min(delta, 0.05);
    wheelRotationRef.current += ((currentSpeed || 0) / 0.35) * clampedDelta;

    for (const wheel of wheelsRef.current) wheel.rotation.x = wheelRotationRef.current;
    if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.y = currentSteer || 0;
    if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.y = currentSteer || 0;
  });

  return (
    <group ref={carGroupRef} scale={[scale, scale, scale]} position={[0, 0, 0]}>
      <primitive object={clonedScene} />

      {/* Controlled underbody reflection rather than a full bright rectangle. */}
      <pointLight position={[0, 0.1, 0]} intensity={1.5} distance={3.6} color={accentColor} />
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.9, 1]}>
        <circleGeometry args={[0.78, 36]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.13} depthWrite={false} />
      </mesh>

      {/* Headlight housings + subtle beam cards. */}
      <group position={[0, 0.42, -1.9]}>
        {[-0.58, 0.58].map((x) => (
          <group key={`headlight-${x}`} position={[x, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#effaff" emissive="#dff7ff" emissiveIntensity={3.5} />
            </mesh>
            <mesh position={[0, -0.04, -2.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.42, 2.8, 1]}>
              <planeGeometry args={[0.35, 1.8]} />
              <meshBasicMaterial
                color="#dff7ff"
                transparent
                opacity={0.055}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
        <pointLight position={[0, 0.12, -0.45]} intensity={2.3} distance={10} color="#dff7ff" />
      </group>

      {/* Rear light signature. */}
      <group position={[0, 0.52, 2.05]}>
        {[-0.62, 0.62].map((x) => (
          <group key={`tail-${x}`} position={[x, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.3, 0.09, 0.045]} />
              <meshStandardMaterial color="#450a0a" emissive="#ff174d" emissiveIntensity={2.2} />
            </mesh>
            <mesh position={[0, 0, 0.028]}>
              <boxGeometry args={[0.16, 0.035, 0.02]} />
              <meshBasicMaterial color="#fb7185" />
            </mesh>
          </group>
        ))}

        {isReversing && (
          <>
            <mesh position={[-0.32, -0.07, 0.02]}>
              <boxGeometry args={[0.15, 0.06, 0.03]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.4} />
            </mesh>
            <mesh position={[0.32, -0.07, 0.02]}>
              <boxGeometry args={[0.15, 0.06, 0.03]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.4} />
            </mesh>
            <pointLight position={[0, 0, 0.35]} intensity={1.7} distance={4} color="#ffffff" />
          </>
        )}
      </group>
    </group>
  );
};

useGLTF.preload('/models/ferrari.glb');
