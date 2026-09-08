import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VehicleEffectsProps {
  speed: number;
  isAccelerating: boolean;
  isBraking: boolean;
}

const PARTICLE_COUNT = 24;

export const VehicleEffects: React.FC<VehicleEffectsProps> = ({
  speed,
  isAccelerating,
  isBraking,
}) => {
  const particlesRef = useRef<THREE.InstancedMesh>(null);

  // Initialize particle states: [x, y, z, life, maxLife, vx, vy, vz]
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      pos: new THREE.Vector3(0, -100, 0),
      vel: new THREE.Vector3(0, 0, 0),
      life: 0,
      maxLife: 0.4 + Math.random() * 0.3,
      size: 0.15 + Math.random() * 0.15,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;

    const shouldEmit = (isAccelerating && speed > 2) || (isBraking && speed > 3);

    particles.forEach((p, i) => {
      p.life += delta;

      if (p.life < p.maxLife) {
        // Move particle with velocity
        p.pos.addScaledVector(p.vel, delta);
        p.vel.y += delta * 0.2; // Slight upward float

        const progress = p.life / p.maxLife;
        const currentScale = p.size * (1 - progress);

        dummy.position.copy(p.pos);
        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.updateMatrix();
        particlesRef.current?.setMatrixAt(i, dummy.matrix);
      } else {
        // Recycle particle if emitting
        if (shouldEmit && Math.random() < 0.25) {
          p.life = 0;
          // Spawn near rear tires (local coordinate offset behind car)
          const side = Math.random() > 0.5 ? -0.7 : 0.7;
          p.pos.set(side + (Math.random() - 0.5) * 0.3, 0.1, -1.3);
          p.vel.set(
            (Math.random() - 0.5) * 0.6,
            0.4 + Math.random() * 0.4,
            -1.5 - Math.random() * 1.5
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
      {/* 1. Volumetric Headlight Projection Cones */}
      {/* Left Headlight Light Cone */}
      <group position={[-0.55, 0.35, 1.6]} rotation={[0.08, 0.05, 0]}>
        <mesh position={[0, -0.2, 2.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.8, 4.8, 16, 1, true]} />
          <meshBasicMaterial
            color="#00f3ff"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Right Headlight Light Cone */}
      <group position={[0.55, 0.35, 1.6]} rotation={[0.08, -0.05, 0]}>
        <mesh position={[0, -0.2, 2.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.8, 4.8, 16, 1, true]} />
          <meshBasicMaterial
            color="#00f3ff"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 2. Tire Dust & Skid Particle System */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </instancedMesh>
    </group>
  );
};

