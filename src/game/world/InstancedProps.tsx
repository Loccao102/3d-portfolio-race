import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';
import {
  BARRIER_PLACEMENTS,
  BOLLARD_PLACEMENTS,
  TREE_PLACEMENTS,
} from './data/placementPlan';

export const InstancedProps: React.FC = () => {
  const barriersRef = useRef<THREE.InstancedMesh>(null);
  const bollardsRef = useRef<THREE.InstancedMesh>(null);
  const treesTrunkRef = useRef<THREE.InstancedMesh>(null);
  const treesFoliageRef = useRef<THREE.InstancedMesh>(null);
  const treeCanopyRef = useRef<THREE.InstancedMesh>(null);
  const theme = useGameStore((state) => state.theme);

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);

    BARRIER_PLACEMENTS.forEach((placement, index) => {
      const [x, , z] = placement.position;
      position.set(x, 0.45, z);
      rotation.set(0, placement.rotation, 0);
      quaternion.setFromEuler(rotation);
      scale.set(1, 1, 1);
      matrix.compose(position, quaternion, scale);
      barriersRef.current?.setMatrixAt(index, matrix);
    });
    if (barriersRef.current) barriersRef.current.instanceMatrix.needsUpdate = true;

    BOLLARD_PLACEMENTS.forEach((placement, index) => {
      const [x, , z] = placement.position;
      position.set(x, 0.34, z);
      rotation.set(0, 0, 0);
      quaternion.setFromEuler(rotation);
      scale.set(1, 1, 1);
      matrix.compose(position, quaternion, scale);
      bollardsRef.current?.setMatrixAt(index, matrix);
    });
    if (bollardsRef.current) bollardsRef.current.instanceMatrix.needsUpdate = true;

    TREE_PLACEMENTS.forEach((placement, index) => {
      const [x, , z] = placement.position;
      const yaw = (index * 1.73) % (Math.PI * 2);
      const size = 0.86 + (index % 4) * 0.07;
      rotation.set(0, yaw, 0);
      quaternion.setFromEuler(rotation);

      position.set(x, 0.95 * size, z);
      scale.set(0.88 * size, 1.08 * size, 0.88 * size);
      matrix.compose(position, quaternion, scale);
      treesTrunkRef.current?.setMatrixAt(index, matrix);

      position.set(x - 0.15, 2.75 * size, z);
      scale.set(1.08 * size, 0.88 * size, 1.0 * size);
      matrix.compose(position, quaternion, scale);
      treesFoliageRef.current?.setMatrixAt(index, matrix);

      position.set(x + 0.42, 3.18 * size, z - 0.12);
      scale.set(0.72 * size, 0.62 * size, 0.74 * size);
      matrix.compose(position, quaternion, scale);
      treeCanopyRef.current?.setMatrixAt(index, matrix);
    });

    if (treesTrunkRef.current) treesTrunkRef.current.instanceMatrix.needsUpdate = true;
    if (treesFoliageRef.current) treesFoliageRef.current.instanceMatrix.needsUpdate = true;
    if (treeCanopyRef.current) treeCanopyRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  const isLight = theme === 'light';

  return (
    <group>
      <instancedMesh ref={barriersRef} args={[undefined, undefined, BARRIER_PLACEMENTS.length]} castShadow>
        <boxGeometry args={[2.2, 0.75, 0.28]} />
        <meshStandardMaterial color={isLight ? '#64748b' : '#263244'} metalness={0.64} roughness={0.34} />
      </instancedMesh>

      <instancedMesh ref={bollardsRef} args={[undefined, undefined, BOLLARD_PLACEMENTS.length]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.68, 8]} />
        <meshStandardMaterial color={isLight ? '#475569' : '#172033'} metalness={0.74} roughness={0.3} />
      </instancedMesh>

      <instancedMesh ref={treesTrunkRef} args={[undefined, undefined, TREE_PLACEMENTS.length]} castShadow>
        <cylinderGeometry args={[0.18, 0.32, 1.9, 7]} />
        <meshStandardMaterial color="#5b4636" roughness={0.92} metalness={0.02} />
      </instancedMesh>

      <instancedMesh ref={treesFoliageRef} args={[undefined, undefined, TREE_PLACEMENTS.length]} castShadow>
        <icosahedronGeometry args={[1.38, 1]} />
        <meshStandardMaterial
          color={isLight ? '#3f7754' : '#214c3b'}
          roughness={0.88}
          metalness={0.01}
        />
      </instancedMesh>

      <instancedMesh ref={treeCanopyRef} args={[undefined, undefined, TREE_PLACEMENTS.length]} castShadow>
        <icosahedronGeometry args={[1.18, 1]} />
        <meshStandardMaterial
          color={isLight ? '#568a60' : '#2b5f46'}
          roughness={0.86}
          metalness={0.01}
        />
      </instancedMesh>
    </group>
  );
};
