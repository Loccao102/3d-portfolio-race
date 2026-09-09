import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { INITIAL_RIVALS } from '../../data/playerProfile';
import { FerrariModel } from './FerrariModel';

// Outer Grand Speed Circuit Waypoints forming a continuous closed loop along track centerlines
const CIRCUIT_POINTS: [number, number][] = [
  [0, -95],    // Start / Finish Line
  [55, -95],   // Turn 1 Approach
  [75, -90],   // Turn 1 Apex
  [80, -75],   // Turn 1 Exit into East Straight
  [80, 0],     // East Checkpoint 1
  [80, 65],    // Turn 2 Approach
  [75, 80],    // Turn 2 Apex
  [55, 85],    // Turn 2 Exit into South Straight
  [0, 85],     // South Hairpin Checkpoint 2
  [-55, 85],   // Turn 3 Approach
  [-75, 80],   // Turn 3 Apex
  [-80, 65],   // Turn 3 Exit into West Straight
  [-80, 0],    // West Checkpoint 3
  [-80, -75],  // Final Turn Approach
  [-75, -90],  // Final Turn Apex
  [-55, -95],  // Final Straight Sprint
];

export const RivalRacers: React.FC = () => {
  const rivalsRef = useRef<(THREE.Group | null)[]>([]);
  const offsetsRef = useRef<number[]>(INITIAL_RIVALS.map((r) => r.circuitOffset));

  // Compute CatmullRomCurve3 for the smooth racetrack loop
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

      // Advance rival offset along the race curve based on speed
      const totalLength = curve.getLength();
      const advance = (rival.speed * clampedDelta) / totalLength;
      offsetsRef.current[i] = (offsetsRef.current[i] + advance) % 1.0;

      const t = offsetsRef.current[i];
      curve.getPointAt(t, dummyPos);
      curve.getTangentAt(t, dummyTangent);

      group.position.copy(dummyPos);

      // Compute heading angle from tangent
      const angle = Math.atan2(-dummyTangent.x, -dummyTangent.z);
      group.rotation.y = angle;
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
          {/* Floating Callsign Nametag Badge */}
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

          {/* High-Fidelity Ferrari Rival Racer Model */}
          <group position={[0, 0.02, 0]}>
            <FerrariModel
              bodyColor={rival.bodyColor}
              accentColor={rival.accentColor}
              speed={rival.speed}
              scale={0.92}
            />

            {/* Soft Contact Shadows */}
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
