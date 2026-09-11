import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleEffectsProps {
  speed?: number;
  speedRef?: React.RefObject<number>;
  corneringRef?: React.RefObject<number>;
  isAccelerating: boolean;
  isBraking: boolean;
  isBoosting?: boolean;
}

const PARTICLE_COUNT = 28;

export const VehicleEffects: React.FC<VehicleEffectsProps> = ({
  speed = 0,
  speedRef,
  corneringRef,
  isAccelerating,
  isBraking,
  isBoosting = false,
}) => {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const leftHazeRef = useRef<THREE.MeshBasicMaterial>(null);
  const rightHazeRef = useRef<THREE.MeshBasicMaterial>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
        pos: new THREE.Vector3(0, -100, 0),
        vel: new THREE.Vector3(0, 0, 0),
        life: 1,
        maxLife: 0.34 + ((index * 17) % 9) * 0.025,
        size: 0.14 + ((index * 11) % 7) * 0.025,
      })),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }, delta) => {
    if (!particlesRef.current) return;

    const currentSpeed = speedRef ? Math.abs(speedRef.current) : speed;
    const cornering = Math.abs(corneringRef?.current ?? 0);
    const hardCorner = currentSpeed > 8 && cornering > 0.58;
    const brakeSlip = isBraking && currentSpeed > 5;
    const shouldEmit =
      (isAccelerating && currentSpeed > 12) ||
      brakeSlip ||
      hardCorner ||
      isBoosting;

    particles.forEach((particle, index) => {
      particle.life += delta;

      if (particle.life < particle.maxLife) {
        particle.pos.addScaledVector(particle.vel, delta);
        particle.vel.y += delta * 0.18;
        const progress = particle.life / particle.maxLife;
        const scale = particle.size * (1 - progress * 0.82);
        dummy.position.copy(particle.pos);
        dummy.scale.set(scale, scale * 0.72, scale);
        dummy.updateMatrix();
        particlesRef.current?.setMatrixAt(index, dummy.matrix);
      } else if (shouldEmit && Math.random() < (isBoosting ? 0.48 : 0.34)) {
        particle.life = 0;
        const side = index % 2 === 0 ? -0.72 : 0.72;
        const rearBias = brakeSlip || hardCorner ? 1.55 : 1.3;
        particle.pos.set(side + (Math.random() - 0.5) * 0.16, 0.12, rearBias);
        particle.vel.set(
          (Math.random() - 0.5) * (hardCorner ? 1.05 : 0.55),
          0.18 + Math.random() * 0.32,
          0.7 + Math.random() * 1.2,
        );
      } else {
        dummy.position.set(0, -100, 0);
        dummy.updateMatrix();
        particlesRef.current?.setMatrixAt(index, dummy.matrix);
      }
    });

    const hazeStrength = THREE.MathUtils.clamp(
      (brakeSlip ? 0.34 : 0) + (hardCorner ? cornering * 0.22 : 0),
      0,
      0.48,
    );
    const hazePulse = 0.88 + Math.sin(clock.getElapsedTime() * 19) * 0.08;
    if (leftHazeRef.current) leftHazeRef.current.opacity = hazeStrength * hazePulse;
    if (rightHazeRef.current) rightHazeRef.current.opacity = hazeStrength * hazePulse;

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
              opacity={0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {[-0.72, 0.72].map((x, index) => (
        <mesh key={`tire-haze-${x}`} position={[x, 0.11, 1.48]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 20]} />
          <meshBasicMaterial
            ref={index === 0 ? leftHazeRef : rightHazeRef}
            color="#cbd5e1"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
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
          opacity={isBoosting ? 0.42 : 0.28}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
};
