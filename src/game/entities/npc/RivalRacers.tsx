import React, { useRef } from 'react';
import { ContactShadows } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INITIAL_RIVALS } from '@/data/playerProfile';
import { FerrariModel } from '@/game/entities/vehicle/FerrariModel';

const CIRCUIT_POINTS: [number, number][] = [
  [0, -95],
  [55, -95],
  [75, -90],
  [80, -75],
  [80, 0],
  [80, 65],
  [75, 80],
  [55, 85],
  [0, 85],
  [-55, 85],
  [-75, 80],
  [-80, 65],
  [-80, 0],
  [-80, -75],
  [-75, -90],
  [-55, -95],
];

export const RivalRacers: React.FC = () => {
  const rivalsRef = useRef<(THREE.Group | null)[]>([]);
  const offsetsRef = useRef<number[]>(INITIAL_RIVALS.map((r) => r.circuitOffset));

  const curve = React.useMemo(() => {
    const points3D = CIRCUIT_POINTS.map(([x, z]) => new THREE.Vector3(x, 0.4, z));
    return new THREE.CatmullRomCurve3(points3D, true, 'catmullrom', 0.2);
  }, []);

  const dummyPos = React.useMemo(() => new THREE.Vector3(), []);
  const dummyTangent = React.useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    INITIAL_RIVALS.forEach((rival, i) => {
      const group = rivalsRef.current[i];
      if (!group) return;

      const totalLength = curve.getLength();
      const advance = (rival.speed * clampedDelta) / totalLength;
      offsetsRef.current[i] = (offsetsRef.current[i] + advance) % 1.0;

      const t = offsetsRef.current[i];
      curve.getPointAt(t, dummyPos);
      curve.getTangentAt(t, dummyTangent);

      group.position.copy(dummyPos);
      group.rotation.y = Math.atan2(-dummyTangent.x, -dummyTangent.z);
    });
  });

  return (
    <group>
      {INITIAL_RIVALS.map((rival, idx) => (
        <group
          key={rival.id}
          ref={(el) => {
            rivalsRef.current[idx] = el;
          }}
        >
          <group position={[0, 2.1, 0]}>
            <mesh>
              <boxGeometry args={[2.0, 0.28, 0.05]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <planeGeometry args={[1.9, 0.22]} />
              <meshBasicMaterial color={rival.accentColor} transparent opacity={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.04]}>
              <boxGeometry args={[1.6, 0.04, 0.01]} />
              <meshBasicMaterial color={rival.accentColor} />
            </mesh>
          </group>

          <group position={[0, 0.02, 0]}>
            <FerrariModel
              bodyColor={rival.bodyColor}
              accentColor={rival.accentColor}
              speed={rival.speed}
              scale={0.92}
            />

            <ContactShadows
              position={[0, 0.02, 0]}
              opacity={0.65}
              scale={5.2}
              blur={1.8}
              far={1.6}
              color="#000000"
            />
          </group>
        </group>
      ))}
    </group>
  );
};
