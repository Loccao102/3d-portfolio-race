import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export const InstancedProps: React.FC = () => {
  const streetLampPolesRef = useRef<THREE.InstancedMesh>(null);
  const streetLampHeadsRef = useRef<THREE.InstancedMesh>(null);
  const barriersRef = useRef<THREE.InstancedMesh>(null);
  const treesTrunkRef = useRef<THREE.InstancedMesh>(null);
  const treesFoliageRef = useRef<THREE.InstancedMesh>(null);

  // Street Lamp Positions along North-South and East-West avenues
  const lampPositions = useMemo(() => {
    const pos: [number, number, number, number][] = []; // [x, y, z, rotY]
    // North-South avenue lamps
    [-65, -50, -35, -20, 20, 35].forEach((z) => {
      pos.push([-5.6, 0, z, Math.PI / 2]);
      pos.push([5.6, 0, z, -Math.PI / 2]);
    });
    // East-West avenue lamps
    [-35, -20, 20, 35].forEach((x) => {
      pos.push([x, 0, -5.6, 0]);
      pos.push([x, 0, 5.6, Math.PI]);
    });
    return pos;
  }, []);

  // Traffic Barrier Positions
  const barrierPositions = useMemo(() => {
    const pos: [number, number, number, number][] = [];
    // Near intersections and plaza corners
    [-8.5, 8.5].forEach((x) => {
      pos.push([x, 0, 8.5, Math.PI / 4]);
      pos.push([x, 0, -8.5, -Math.PI / 4]);
    });
    return pos;
  }, []);

  // Stylized Diorama Trees
  const treePositions = useMemo(() => {
    return [
      [-13, 0, 20],
      [13, 0, 20],
      [-13, 0, -20],
      [13, 0, -20],
      [-20, 0, 13],
      [20, 0, 13],
      [-20, 0, -13],
      [20, 0, -13],
      [-28, 0, 18],
      [28, 0, 18],
      [-28, 0, -18],
      [28, 0, -18],
    ];
  }, []);

  // Populate InstancedMesh transform matrices
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);

    // Street Lamps
    lampPositions.forEach(([x, y, z, rotY], i) => {
      // Pole
      position.set(x, 2.0, z);
      rotation.set(0, rotY, 0);
      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
      streetLampPolesRef.current?.setMatrixAt(i, matrix);

      // Head
      position.set(
        x + (rotY === Math.PI / 2 ? 0.8 : rotY === -Math.PI / 2 ? -0.8 : 0),
        4.1,
        z + (rotY === 0 ? 0.8 : rotY === Math.PI ? -0.8 : 0)
      );
      matrix.compose(position, quaternion, scale);
      streetLampHeadsRef.current?.setMatrixAt(i, matrix);
    });

    if (streetLampPolesRef.current) {
      streetLampPolesRef.current.instanceMatrix.needsUpdate = true;
      streetLampPolesRef.current.computeBoundingSphere();
    }
    if (streetLampHeadsRef.current) {
      streetLampHeadsRef.current.instanceMatrix.needsUpdate = true;
      streetLampHeadsRef.current.computeBoundingSphere();
    }

    // Barriers
    barrierPositions.forEach(([x, y, z, rotY], i) => {
      position.set(x, 0.45, z);
      rotation.set(0, rotY, 0);
      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
      barriersRef.current?.setMatrixAt(i, matrix);
    });

    if (barriersRef.current) {
      barriersRef.current.instanceMatrix.needsUpdate = true;
      barriersRef.current.computeBoundingSphere();
    }

    // Trees
    treePositions.forEach(([x, y, z], i) => {
      // Trunk
      position.set(x, 0.9, z);
      rotation.set(0, (i * Math.PI) / 3, 0);
      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
      treesTrunkRef.current?.setMatrixAt(i, matrix);

      // Foliage
      position.set(x, 2.6, z);
      matrix.compose(position, quaternion, scale);
      treesFoliageRef.current?.setMatrixAt(i, matrix);
    });

    if (treesTrunkRef.current) {
      treesTrunkRef.current.instanceMatrix.needsUpdate = true;
      treesTrunkRef.current.computeBoundingSphere();
    }
    if (treesFoliageRef.current) {
      treesFoliageRef.current.instanceMatrix.needsUpdate = true;
      treesFoliageRef.current.computeBoundingSphere();
    }
  }, [lampPositions, barrierPositions, treePositions]);

  return (
    <group>
      {/* Physics proxies mirror the visible instanced transforms. Lights and
          foliage stay visual; poles, barriers, and trunks are solid. */}
      <RigidBody type="fixed" colliders={false}>
        {lampPositions.map(([x, , z], index) => (
          <CylinderCollider key={`lamp-collider-${index}`} args={[2, 0.12]} position={[x, 2, z]} />
        ))}
        {barrierPositions.map(([x, , z, rotY], index) => (
          <CuboidCollider
            key={`barrier-collider-${index}`}
            args={[1.1, 0.45, 0.14]}
            position={[x, 0.45, z]}
            rotation={[0, rotY, 0]}
          />
        ))}
        {treePositions.map(([x, , z], index) => (
          <CylinderCollider key={`tree-collider-${index}`} args={[0.9, 0.38]} position={[x, 0.9, z]} />
        ))}
      </RigidBody>

      {/* 1. Street Lamp Carbon Poles */}
      <instancedMesh
        ref={streetLampPolesRef}
        args={[undefined, undefined, lampPositions.length]}
        castShadow
        frustumCulled={false}
      >
        <cylinderGeometry args={[0.08, 0.12, 4.0, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
      </instancedMesh>

      {/* 2. Street Lamp Glowing Cantilever Heads */}
      <instancedMesh
        ref={streetLampHeadsRef}
        args={[undefined, undefined, lampPositions.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[0.6, 0.16, 0.35]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={1.8}
          roughness={0.2}
        />
      </instancedMesh>

      {/* 3. Traffic Safety Barriers with Neon Stripe */}
      <instancedMesh
        ref={barriersRef}
        args={[undefined, undefined, barrierPositions.length]}
        castShadow
        frustumCulled={false}
      >
        <boxGeometry args={[2.2, 0.75, 0.28]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </instancedMesh>

      {/* 4. Stylized Diorama Tree Trunks */}
      <instancedMesh
        ref={treesTrunkRef}
        args={[undefined, undefined, treePositions.length]}
        castShadow
        frustumCulled={false}
      >
        <cylinderGeometry args={[0.2, 0.38, 1.8, 6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </instancedMesh>

      {/* 5. Crystalline Bioluminescent Tree Foliage */}
      <instancedMesh
        ref={treesFoliageRef}
        args={[undefined, undefined, treePositions.length]}
        castShadow
        frustumCulled={false}
      >
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#059669"
          emissive="#10b981"
          emissiveIntensity={0.35}
          roughness={0.4}
          metalness={0.2}
        />
      </instancedMesh>
    </group>
  );
};
