import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';

export const InstancedProps: React.FC = () => {
  const barriersRef = useRef<THREE.InstancedMesh>(null);
  const bollardsRef = useRef<THREE.InstancedMesh>(null);
  const treesTrunkRef = useRef<THREE.InstancedMesh>(null);
  const treesFoliageRef = useRef<THREE.InstancedMesh>(null);
  const treeCanopyRef = useRef<THREE.InstancedMesh>(null);
  const theme = useGameStore((state) => state.theme);

  // Traffic barriers stay intentionally sparse around the central crossroads.
  const barrierPositions = useMemo(() => {
    const pos: [number, number, number, number][] = [];
    [-8.5, 8.5].forEach((x) => {
      pos.push([x, 0, 8.5, Math.PI / 4]);
      pos.push([x, 0, -8.5, -Math.PI / 4]);
    });
    return pos;
  }, []);

  // Small roadside bollards add scale without competing with the landmark gateways.
  const bollardPositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    [-24, -16, 16, 24].forEach((z) => {
      pos.push([-6.7, 0, z], [6.7, 0, z]);
    });
    [-25, -17, 17, 25].forEach((x) => {
      pos.push([x, 0, -6.7], [x, 0, 6.7]);
    });
    return pos;
  }, []);

  // Urban trees sit between road and district architecture. Keep the silhouette organic,
  // not crystalline, so the city feels lived-in rather than like a tech demo.
  const treePositions = useMemo<[number, number, number][]>(() => {
    return [
      [-13, 0, 20],
      [13, 0, 20],
      [-13, 0, -20],
      [13, 0, -20],
      [-20, 0, 13],
      [20, 0, 13],
      [-20, 0, -13],
      [20, 0, -13],
      [-29, 0, 18],
      [29, 0, 18],
      [-29, 0, -18],
      [29, 0, -18],
      [-18, 0, 54],
      [18, 0, 54],
    ];
  }, []);

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);

    barrierPositions.forEach(([x, , z, rotY], index) => {
      position.set(x, 0.45, z);
      rotation.set(0, rotY, 0);
      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
      barriersRef.current?.setMatrixAt(index, matrix);
    });
    if (barriersRef.current) barriersRef.current.instanceMatrix.needsUpdate = true;

    bollardPositions.forEach(([x, , z], index) => {
      position.set(x, 0.34, z);
      rotation.set(0, 0, 0);
      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
      bollardsRef.current?.setMatrixAt(index, matrix);
    });
    if (bollardsRef.current) bollardsRef.current.instanceMatrix.needsUpdate = true;

    treePositions.forEach(([x, , z], index) => {
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
  }, [barrierPositions, bollardPositions, treePositions]);

  const isLight = theme === 'light';

  return (
    <group>
      {/* Street lighting now belongs to VietnamCityLayer so there is one authored lighting system, not two overlapping sets. */}
      <instancedMesh ref={barriersRef} args={[undefined, undefined, barrierPositions.length]} castShadow>
        <boxGeometry args={[2.2, 0.75, 0.28]} />
        <meshStandardMaterial color={isLight ? '#64748b' : '#263244'} metalness={0.64} roughness={0.34} />
      </instancedMesh>

      <instancedMesh ref={bollardsRef} args={[undefined, undefined, bollardPositions.length]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.68, 8]} />
        <meshStandardMaterial color={isLight ? '#475569' : '#172033'} metalness={0.74} roughness={0.3} />
      </instancedMesh>

      <instancedMesh ref={treesTrunkRef} args={[undefined, undefined, treePositions.length]} castShadow>
        <cylinderGeometry args={[0.18, 0.32, 1.9, 7]} />
        <meshStandardMaterial color="#5b4636" roughness={0.92} metalness={0.02} />
      </instancedMesh>

      <instancedMesh ref={treesFoliageRef} args={[undefined, undefined, treePositions.length]} castShadow>
        <icosahedronGeometry args={[1.38, 1]} />
        <meshStandardMaterial
          color={isLight ? '#3f7754' : '#214c3b'}
          roughness={0.88}
          metalness={0.01}
        />
      </instancedMesh>

      <instancedMesh ref={treeCanopyRef} args={[undefined, undefined, treePositions.length]} castShadow>
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
