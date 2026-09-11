import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleEffectsProps {
  speed?: number;
  speedRef?: React.RefObject<number>;
  isAccelerating: boolean;
  isBraking: boolean;
  isBoosting?: boolean;
}

const PARTICLE_COUNT = 24;

export const VehicleEffects: React.FC<VehicleEffectsProps> = ({
  speed = 0,
  speedRef,
  isAccelerating,
  isBraking,
  isBoosting = false,
}) => {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        pos: new THREE.Vector3(0, -100, 0),
        vel: new THREE.Vector3(0, 0, 0),
        life: 0,
        maxLife: 0.35 + Math.random() * 0.25,
        size: 0.16 + Math.random() * 0.16,
      })),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;

    const currentSpeed = speedRef ? Math.abs(speedRef.current) : speed;
    const shouldEmit =
      (isAccelerating && currentSpeed > 2) ||
      (isBraking && currentSpeed > 2) ||
      isBoosting;

    particles.forEach((particle, index) => {
      particle.life += delta;

      if (particle.life < particle.maxLife) {
        particle.pos.addScaledVector(particle.vel, delta);
        particle.vel.y += delta * 0.25;
        const progress = particle.life / particle.maxLife;
        const scale = particle.size * (1 - progress);
        dummy.position.copy(particle.pos);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        particlesRef.current?.setMatrixAt(index, dummy.matrix);
      } else if (shouldEmit && Math.random() < 0.3) {
        particle.life = 0;
        const side = Math.random() > 0.5 ? -0.75 : 0.75;
        particle.pos.set(side + (Math.random() - 0.5) * 0.2, 0.12, 1.35);
        particle.vel.set(
          (Math.random() - 0.5) * 0.6,
          0.3 + Math.random() * 0.4,
          0.8 + Math.random() * 1.5,
        );
      } else {
        dummy.position.set(0, -100, 0);
        dummy.updateMatrix();
        particlesRef.current?.setMatrixAt(index, dummy.matrix);
      }
    });

    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {[-0.56, 0.56].map((x) => (
        <group key={x} position={[x, 0.38, -1.8]}>
          <mesh position={[0, -0.15, -2.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.85, 4.8, 16, 1, true]} />
            <meshBasicMaterial
              color="#00f3ff"
              transparent
              opacity={0.14}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {isBraking && (
        <group position={[0, 0.48, 1.95]}>
          {[-0.62, 0.62].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.28, 0.12, 0.05]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} />
            </mesh>
          ))}
          <pointLight color="#ef4444" intensity={2.5} distance={3.5} />
        </group>
      )}

      {isBoosting && (
        <pointLight position={[0, 0.35, 2.2]} color="#00f3ff" intensity={3.5} distance={5} />
      )}

      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshBasicMaterial
          color={isBoosting ? '#38bdf8' : '#cbd5e1'}
          transparent
          opacity={0.38}
        />
      </instancedMesh>
    </group>
  );
};
