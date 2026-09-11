import React from 'react';
import * as THREE from 'three';
import {
  BRAKING_WEAR_PLACEMENTS,
  DRAIN_GRATE_PLACEMENTS,
  THRESHOLD_REFLECTOR_PLACEMENTS,
} from './data/roadSurfacePlan';

function BrakingWear({
  position,
  size,
  rotation,
}: {
  position: [number, number, number];
  size: [number, number];
  rotation: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, size[1]]} />
          <meshStandardMaterial
            color="#05070a"
            transparent
            opacity={0.19}
            roughness={0.92}
            metalness={0.02}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color="#111827"
          transparent
          opacity={0.035}
          roughness={0.86}
          metalness={0.02}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function DrainGrate({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.25, 0.62]} />
        <meshStandardMaterial color="#20242b" metalness={0.72} roughness={0.42} />
      </mesh>
      {[-0.42, -0.21, 0, 0.21, 0.42].map((x) => (
        <mesh key={x} position={[x, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.055, 0.5]} />
          <meshBasicMaterial color="#05070a" />
        </mesh>
      ))}
    </group>
  );
}

function ThresholdReflector({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.085, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        roughness={0.2}
        metalness={0.45}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Road realism with cause-and-effect: rubber appears at braking zones, drains sit beside
 * runoff sources, and reflectors mark actual district thresholds. Nothing is random dressing.
 */
export function RoadSurfaceCues() {
  return (
    <group>
      {BRAKING_WEAR_PLACEMENTS.map((placement) => (
        <BrakingWear
          key={placement.id}
          position={placement.position}
          size={placement.size}
          rotation={placement.rotation}
        />
      ))}

      {DRAIN_GRATE_PLACEMENTS.map((placement) => (
        <DrainGrate
          key={placement.id}
          position={placement.position}
          rotation={placement.rotation}
        />
      ))}

      {THRESHOLD_REFLECTOR_PLACEMENTS.map((placement) => (
        <ThresholdReflector
          key={placement.id}
          position={placement.position}
          color={placement.color}
        />
      ))}
    </group>
  );
}
