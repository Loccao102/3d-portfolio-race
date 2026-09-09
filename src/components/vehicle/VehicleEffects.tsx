import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleEffectsProps {
  speed: number;
  isAccelerating: boolean;
  isBraking: boolean;
  isBoosting?: boolean;
}

const PARTICLE_COUNT = 24;

export const VehicleEffects: React.FC<VehicleEffectsProps> = ({
  speed,
  isAccelerating,
  isBraking,
  isBoosting = false,
}) => {
  const particlesRef = useRef<THREE.InstancedMesh>(null);

  // Initialize particle states: [x, y, z, life, maxLife, vx, vy, vz]
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      pos: new THREE.Vector3(0, -100, 0),
      vel: new THREE.Vector3(0, 0, 0),
      life: 0,
      maxLife: 0.35 + Math.random() * 0.25,
      size: 0.16 + Math.random() * 0.16,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;

    const shouldEmit = (isAccelerating && speed > 2) || (isBraking && speed > 2) || isBoosting;

    particles.forEach((p, i) => {
      p.life += delta;

      if (p.life < p.maxLife) {
        // Move particle with velocity
        p.pos.addScaledVector(p.vel, delta);
        p.vel.y += delta * 0.25; // Slight upward thermal float

        const progress = p.life / p.maxLife;
        const currentScale = p.size * (1 - progress);

        dummy.position.copy(p.pos);
        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.updateMatrix();
        particlesRef.current?.setMatrixAt(i, dummy.matrix);
      } else {
        // Recycle particle if emitting
        if (shouldEmit && Math.random() < 0.3) {
          p.life = 0;
          // Spawn near rear tires (+1.35 along Z axis)
          const side = Math.random() > 0.5 ? -0.75 : 0.75;
          p.pos.set(side + (Math.random() - 0.5) * 0.2, 0.12, 1.35);
          p.vel.set(
            (Math.random() - 0.5) * 0.6,
            0.3 + Math.random() * 0.4,
            0.8 + Math.random() * 1.5 // Drifts backward behind car
          );
        } else {
          dummy.position.set(0, -100, 0);
          dummy.updateMatrix();
          particlesRef.current?.setMatrixAt(i, dummy.matrix);
        }
      }
    });

    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* 1. Volumetric Headlight Projection Cones (Facing Forward along -Z) */}
      {/* Left Headlight Light Cone */}
      <group position={[-0.56, 0.38, -1.8]}>
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

      {/* Right Headlight Light Cone */}
      <group position={[0.56, 0.38, -1.8]}>
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

      {/* 2. Active Rear Brake Lights (Glows bright red when braking) */}
      {isBraking && (
        <group position={[0, 0.48, 1.95]}>
          {/* Left Brake Light Lens */}
          <mesh position={[-0.62, 0, 0]}>
            <boxGeometry args={[0.28, 0.12, 0.05]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={3.0}
            />
          </mesh>
          {/* Right Brake Light Lens */}
          <mesh position={[0.62, 0, 0]}>
            <boxGeometry args={[0.28, 0.12, 0.05]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={3.0}
            />
          </mesh>
          <pointLight color="#ef4444" intensity={2.5} distance={3.5} />
        </group>
      )}

      {/* 3. Active Nitro Boost Exhaust Point Light */}
      {isBoosting && (
        <pointLight
          position={[0, 0.35, 2.2]}
          color="#00f3ff"
          intensity={3.5}
          distance={5.0}
        />
      )}

      {/* 4. Tire Dust & Skid Particle System */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshBasicMaterial color={isBoosting ? '#38bdf8' : '#cbd5e1'} transparent opacity={0.38} />
      </instancedMesh>
    </group>
  );
};
