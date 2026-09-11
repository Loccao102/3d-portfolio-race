import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';

interface ModelInstanceProps {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
}

interface DistrictClusterProps {
  center: [number, number];
  radius?: number;
  accent: string;
  proxySize: [number, number, number];
  proxyPosition: [number, number, number];
  children: React.ReactNode;
}

function polishMaterial(material: THREE.Material) {
  const next = material.clone();
  if (next instanceof THREE.MeshStandardMaterial) {
    next.envMapIntensity = Math.max(1.15, next.envMapIntensity ?? 1);
    next.roughness = THREE.MathUtils.clamp(next.roughness ?? 0.65, 0.24, 0.76);
    next.metalness = THREE.MathUtils.clamp(next.metalness ?? 0.06, 0.04, 0.72);
    if (next.map) {
      next.map.colorSpace = THREE.SRGBColorSpace;
      next.map.anisotropy = Math.max(next.map.anisotropy, 4);
    }
    if (next.emissiveMap) next.emissiveMap.colorSpace = THREE.SRGBColorSpace;
    next.needsUpdate = true;
  }
  return next;
}

const ModelInstance: React.FC<ModelInstanceProps> = ({ url, position, rotation = [0, 0, 0], scale = 1 }) => {
  const { scene } = useGLTF(url);
  const quality = useGameStore((state) => state.quality);

  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = quality === 'high';
      mesh.receiveShadow = true;
      if (Array.isArray(mesh.material)) mesh.material = mesh.material.map(polishMaterial);
      else if (mesh.material) mesh.material = polishMaterial(mesh.material);
    });
    return clone;
  }, [scene, quality]);

  const scaleArray = typeof scale === 'number' ? [scale, scale, scale] : scale;
  return <primitive object={cloned} position={position} rotation={rotation} scale={scaleArray} />;
};

function DistrictCluster({ center, radius = 42, accent, proxySize, proxyPosition, children }: DistrictClusterProps) {
  const vehiclePos = useGameStore((state) => state.vehiclePos);
  const quality = useGameStore((state) => state.quality);
  const effectiveRadius = quality === 'low' ? radius * 0.82 : radius;
  const distance = Math.hypot(vehiclePos.x - center[0], vehiclePos.z - center[1]);
  const near = distance <= effectiveRadius;

  if (near) return <>{children}</>;

  return (
    <group position={proxyPosition}>
      <mesh castShadow={false} receiveShadow>
        <boxGeometry args={proxySize} />
        <meshStandardMaterial color="#0b1320" roughness={0.72} metalness={0.28} />
      </mesh>
      <mesh position={[0, proxySize[1] / 2 + 0.08, 0]}>
        <boxGeometry args={[proxySize[0] * 0.72, 0.1, proxySize[2] * 0.72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.52} />
      </mesh>
    </group>
  );
}

export const CityBuildings: React.FC = () => {
  return (
    <group>
      <DistrictCluster center={[52, 0]} accent="#10b981" proxyPosition={[52, 7, 0]} proxySize={[12, 14, 24]}>
        <ModelInstance url="/models/building-garage.glb" position={[52, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[12, 10, 14]} />
        <ModelInstance url="/models/building-small-c.glb" position={[52, 0.5, 14]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 10, 10]} />
        <ModelInstance url="/models/building-small-b.glb" position={[52, 0.5, -14]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 9, 10]} />
      </DistrictCluster>

      <DistrictCluster center={[0, -52]} accent="#22d3ee" proxyPosition={[0, 10, -53]} proxySize={[30, 20, 14]}>
        <ModelInstance url="/models/building-small-b.glb" position={[-15, 0.5, -48]} scale={[8, 12, 8]} />
        <ModelInstance url="/models/building-small-c.glb" position={[15, 0.5, -48]} scale={[8, 13, 8]} />
        <ModelInstance url="/models/building-small-d.glb" position={[0, 0.5, -60]} rotation={[0, Math.PI, 0]} scale={[10, 11, 10]} />
      </DistrictCluster>

      <DistrictCluster center={[0, 52]} accent="#f59e0b" proxyPosition={[0, 9, 53]} proxySize={[30, 18, 15]}>
        <ModelInstance url="/models/building-small-a.glb" position={[-14, 0.5, 48]} scale={[9, 9, 9]} />
        <ModelInstance url="/models/building-small-d.glb" position={[14, 0.5, 48]} scale={[9, 10, 9]} />
        <ModelInstance url="/models/building-small-c.glb" position={[0, 0.5, 62]} scale={[11, 12, 11]} />
      </DistrictCluster>

      <DistrictCluster center={[-52, 0]} accent="#a855f7" proxyPosition={[-52, 8, 0]} proxySize={[14, 16, 26]}>
        <ModelInstance url="/models/building-small-c.glb" position={[-52, 0.5, 12]} rotation={[0, Math.PI / 2, 0]} scale={[10, 10, 10]} />
        <ModelInstance url="/models/building-small-b.glb" position={[-52, 0.5, -12]} rotation={[0, Math.PI / 2, 0]} scale={[10, 11, 10]} />
        <ModelInstance url="/models/building-garage.glb" position={[-52, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} scale={[10, 9, 12]} />
      </DistrictCluster>

      <DistrictCluster center={[0, -92]} radius={48} accent="#38bdf8" proxyPosition={[0, 8, -100]} proxySize={[27, 16, 12]}>
        <ModelInstance url="/models/building-small-a.glb" position={[-12, 0.5, -100]} scale={[7, 9, 7]} />
        <ModelInstance url="/models/building-small-a.glb" position={[12, 0.5, -100]} scale={[7, 9, 7]} />
      </DistrictCluster>

      <DistrictCluster center={[22, 22]} radius={34} accent="#f59e0b" proxyPosition={[22, 1.2, 22]} proxySize={[7, 2.4, 7]}>
        <ModelInstance url="/models/pavement-fountain.glb" position={[22, 0.05, 22]} scale={[7, 6, 7]} />
      </DistrictCluster>
      <DistrictCluster center={[-22, -22]} radius={34} accent="#22d3ee" proxyPosition={[-22, 1.2, -22]} proxySize={[7, 2.4, 7]}>
        <ModelInstance url="/models/pavement-fountain.glb" position={[-22, 0.05, -22]} scale={[7, 6, 7]} />
      </DistrictCluster>

      <DistrictCluster center={[-22, 22]} radius={35} accent="#166534" proxyPosition={[-22, 2.5, 22]} proxySize={[9, 5, 9]}>
        <ModelInstance url="/models/grass-trees.glb" position={[-22, 0.05, 22]} rotation={[0, Math.PI / 4, 0]} scale={[8, 7, 8]} />
      </DistrictCluster>
      <DistrictCluster center={[22, -22]} radius={35} accent="#166534" proxyPosition={[22, 2.5, -22]} proxySize={[9, 5, 9]}>
        <ModelInstance url="/models/grass-trees.glb" position={[22, 0.05, -22]} rotation={[0, -Math.PI / 4, 0]} scale={[8, 7, 8]} />
      </DistrictCluster>

      {useGameStore.getState().quality === 'high' && (
        <>
          <ModelInstance url="/models/grass-trees-tall.glb" position={[-35, 0.05, 45]} rotation={[0, 0.2, 0]} scale={8} />
          <ModelInstance url="/models/grass-trees-tall.glb" position={[35, 0.05, 45]} rotation={[0, -0.3, 0]} scale={8} />
          <ModelInstance url="/models/grass-trees-tall.glb" position={[-35, 0.05, -45]} rotation={[0, 0.5, 0]} scale={8} />
          <ModelInstance url="/models/grass-trees-tall.glb" position={[35, 0.05, -45]} rotation={[0, -0.4, 0]} scale={8} />
        </>
      )}
    </group>
  );
};
