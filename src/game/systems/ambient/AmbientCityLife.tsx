import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';
import { useExperiencePreferences } from '@/game/stores/useExperiencePreferences';

type RectSample = { x: number; z: number; heading: number };

function sampleRectLoop(progress: number, halfX: number, halfZ: number, centerZ = -5): RectSample {
  const p = ((progress % 1) + 1) % 1;
  const perimeter = 4 * (halfX + halfZ);
  let distance = p * perimeter;
  if (distance < halfX * 2) return { x: -halfX + distance, z: centerZ - halfZ, heading: Math.PI / 2 };
  distance -= halfX * 2;
  if (distance < halfZ * 2) return { x: halfX, z: centerZ - halfZ + distance, heading: 0 };
  distance -= halfZ * 2;
  if (distance < halfX * 2) return { x: halfX - distance, z: centerZ + halfZ, heading: -Math.PI / 2 };
  distance -= halfX * 2;
  return { x: -halfX, z: centerZ + halfZ - distance, heading: Math.PI };
}

function DroneVisual({ accent }: { accent: string }) {
  return (
    <group>
      <mesh castShadow><boxGeometry args={[1.25, 0.28, 0.72]} /><meshStandardMaterial color="#20293a" metalness={0.8} roughness={0.25} /></mesh>
      <mesh position={[0, 0.05, -0.4]}><boxGeometry args={[0.58, 0.12, 0.12]} /><meshBasicMaterial color={accent} /></mesh>
      {[-0.78, 0.78].map((x) => (
        <group key={`drone-arm-${x}`} position={[x, 0, 0]}>
          <mesh><boxGeometry args={[0.55, 0.08, 0.08]} /><meshStandardMaterial color="#475569" metalness={0.8} roughness={0.25} /></mesh>
          <mesh position={[x > 0 ? 0.3 : -0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 16]} /><meshBasicMaterial color="#94a3b8" transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AmbientVehicle({ accent }: { accent: string }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.32, 0]}><boxGeometry args={[1.05, 0.45, 2.05]} /><meshStandardMaterial color="#182233" roughness={0.32} metalness={0.62} /></mesh>
      <mesh position={[0, 0.58, -0.1]}><boxGeometry args={[0.82, 0.28, 0.92]} /><meshStandardMaterial color="#334155" roughness={0.2} metalness={0.72} /></mesh>
      <mesh position={[0, 0.36, -1.04]}><boxGeometry args={[0.58, 0.08, 0.04]} /><meshBasicMaterial color={accent} /></mesh>
      {[-0.34, 0.34].map((x) => <mesh key={x} position={[x, 0.28, 1.04]}><boxGeometry args={[0.2, 0.09, 0.04]} /><meshBasicMaterial color="#fde68a" /></mesh>)}
    </group>
  );
}

function Pedestrian({ jacket }: { jacket: string }) {
  return (
    <group>
      <mesh position={[0, 0.95, 0]} castShadow><capsuleGeometry args={[0.19, 0.72, 4, 8]} /><meshStandardMaterial color={jacket} roughness={0.7} /></mesh>
      <mesh position={[0, 1.62, 0]} castShadow><sphereGeometry args={[0.23, 10, 10]} /><meshStandardMaterial color="#d6b89c" roughness={0.85} /></mesh>
    </group>
  );
}

export function AmbientCityLife() {
  const quality = useGameStore((state) => state.quality);
  const reducedMotion = useExperiencePreferences((state) => state.reducedMotion);
  const droneRefs = useRef<(THREE.Group | null)[]>([]);
  const vehicleRefs = useRef<(THREE.Group | null)[]>([]);
  const pedestrianRefs = useRef<(THREE.Group | null)[]>([]);

  const drones = useMemo(() => [
    { radiusX: 42, radiusZ: 32, y: 17, speed: 0.055, phase: 0.08, accent: '#22d3ee' },
    { radiusX: 65, radiusZ: 46, y: 23, speed: -0.038, phase: 0.42, accent: '#fb7185' },
    { radiusX: 54, radiusZ: 58, y: 20, speed: 0.044, phase: 0.7, accent: '#f59e0b' },
    { radiusX: 32, radiusZ: 71, y: 15, speed: -0.05, phase: 0.9, accent: '#a855f7' },
  ], []);

  const vehicles = useMemo(() => [
    { speed: 0.018, phase: 0.04, halfX: 69, halfZ: 76, accent: '#22d3ee' },
    { speed: 0.015, phase: 0.32, halfX: 69, halfZ: 76, accent: '#fb7185' },
    { speed: -0.016, phase: 0.62, halfX: 61, halfZ: 68, accent: '#f59e0b' },
    { speed: -0.014, phase: 0.84, halfX: 61, halfZ: 68, accent: '#38bdf8' },
  ], []);

  const pedestrians = useMemo(() => [
    { from: [-12, 11] as const, to: [-12, 28] as const, speed: 0.055, phase: 0.1, jacket: '#0f766e' },
    { from: [12, -12] as const, to: [12, -29] as const, speed: 0.046, phase: 0.42, jacket: '#1d4ed8' },
    { from: [18, 12] as const, to: [34, 12] as const, speed: 0.052, phase: 0.7, jacket: '#9f1239' },
    { from: [-18, -12] as const, to: [-35, -12] as const, speed: 0.048, phase: 0.83, jacket: '#6d28d9' },
    { from: [-14, 49] as const, to: [14, 49] as const, speed: 0.038, phase: 0.26, jacket: '#92400e' },
    { from: [-16, -50] as const, to: [16, -50] as const, speed: 0.042, phase: 0.55, jacket: '#155e75' },
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const motionScale = reducedMotion ? 0 : 1;

    drones.forEach((drone, index) => {
      const group = droneRefs.current[index];
      if (!group) return;
      const angle = ((t * drone.speed * motionScale) + drone.phase) * Math.PI * 2;
      group.position.set(Math.cos(angle) * drone.radiusX, drone.y + Math.sin(t * 1.2 + index) * 0.45 * motionScale, Math.sin(angle) * drone.radiusZ - 8);
      group.rotation.y = -angle + Math.PI / 2;
      group.rotation.z = Math.sin(t * 0.8 + index) * 0.06 * motionScale;
    });

    vehicles.forEach((vehicle, index) => {
      const group = vehicleRefs.current[index];
      if (!group) return;
      const sample = sampleRectLoop(t * vehicle.speed * motionScale + vehicle.phase, vehicle.halfX, vehicle.halfZ);
      group.position.set(sample.x, 0.08, sample.z);
      group.rotation.y = sample.heading;
    });

    pedestrians.forEach((pedestrian, index) => {
      const group = pedestrianRefs.current[index];
      if (!group) return;
      const raw = (t * pedestrian.speed * motionScale + pedestrian.phase) % 2;
      const alpha = raw <= 1 ? raw : 2 - raw;
      const x = THREE.MathUtils.lerp(pedestrian.from[0], pedestrian.to[0], alpha);
      const z = THREE.MathUtils.lerp(pedestrian.from[1], pedestrian.to[1], alpha);
      group.position.set(x, 0.05 + Math.abs(Math.sin(t * 6 + index)) * 0.025 * motionScale, z);
      group.rotation.y = raw <= 1 ? Math.atan2(pedestrian.to[0] - pedestrian.from[0], pedestrian.to[1] - pedestrian.from[1]) : Math.atan2(pedestrian.from[0] - pedestrian.to[0], pedestrian.from[1] - pedestrian.to[1]);
    });
  });

  const droneCount = quality === 'low' ? 2 : drones.length;
  const vehicleCount = quality === 'low' ? 2 : vehicles.length;
  const pedestrianCount = quality === 'low' ? 3 : pedestrians.length;

  return (
    <group>
      {drones.slice(0, droneCount).map((drone, index) => <group key={`ambient-drone-${index}`} ref={(node) => { droneRefs.current[index] = node; }}><DroneVisual accent={drone.accent} /></group>)}
      {vehicles.slice(0, vehicleCount).map((vehicle, index) => <group key={`ambient-vehicle-${index}`} ref={(node) => { vehicleRefs.current[index] = node; }}><AmbientVehicle accent={vehicle.accent} /></group>)}
      {pedestrians.slice(0, pedestrianCount).map((pedestrian, index) => <group key={`ambient-pedestrian-${index}`} ref={(node) => { pedestrianRefs.current[index] = node; }}><Pedestrian jacket={pedestrian.jacket} /></group>)}
    </group>
  );
}
