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

const ModelInstance: React.FC<ModelInstanceProps> = ({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const { scene } = useGLTF(url);
  const quality = useGameStore((state) => state.quality);

  const cloned = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;

      const mesh = child as THREE.Mesh;
      mesh.castShadow = quality === 'high';
      mesh.receiveShadow = true;

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(polishMaterial);
      } else if (mesh.material) {
        mesh.material = polishMaterial(mesh.material);
      }
    });

    return clone;
  }, [scene, quality]);

  const scaleArray = typeof scale === 'number' ? [scale, scale, scale] : scale;

  return <primitive object={cloned} position={position} rotation={rotation} scale={scaleArray} />;
};

export const CityBuildings: React.FC = () => {
  return (
    <group>
      {/* Project district backdrop */}
      <ModelInstance
        url="/models/building-garage.glb"
        position={[52, 0.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[12, 10, 14]}
      />
      <ModelInstance
        url="/models/building-small-c.glb"
        position={[52, 0.5, 14]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[10, 10, 10]}
      />
      <ModelInstance
        url="/models/building-small-b.glb"
        position={[52, 0.5, -14]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[10, 9, 10]}
      />

      {/* Tech district */}
      <ModelInstance url="/models/building-small-b.glb" position={[-15, 0.5, -48]} scale={[8, 12, 8]} />
      <ModelInstance url="/models/building-small-c.glb" position={[15, 0.5, -48]} scale={[8, 13, 8]} />
      <ModelInstance
        url="/models/building-small-d.glb"
        position={[0, 0.5, -60]}
        rotation={[0, Math.PI, 0]}
        scale={[10, 11, 10]}
      />

      {/* About district */}
      <ModelInstance url="/models/building-small-a.glb" position={[-14, 0.5, 48]} scale={[9, 9, 9]} />
      <ModelInstance url="/models/building-small-d.glb" position={[14, 0.5, 48]} scale={[9, 10, 9]} />
      <ModelInstance url="/models/building-small-c.glb" position={[0, 0.5, 62]} scale={[11, 12, 11]} />

      {/* Experiment district */}
      <ModelInstance
        url="/models/building-small-c.glb"
        position={[-52, 0.5, 12]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[10, 10, 10]}
      />
      <ModelInstance
        url="/models/building-small-b.glb"
        position={[-52, 0.5, -12]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[10, 11, 10]}
      />
      <ModelInstance
        url="/models/building-garage.glb"
        position={[-52, 0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[10, 9, 12]}
      />

      {/* Contact district */}
      <ModelInstance url="/models/building-small-a.glb" position={[-12, 0.5, -100]} scale={[7, 9, 7]} />
      <ModelInstance url="/models/building-small-a.glb" position={[12, 0.5, -100]} scale={[7, 9, 7]} />

      {/* Public realm */}
      <ModelInstance url="/models/pavement-fountain.glb" position={[22, 0.05, 22]} scale={[7, 6, 7]} />
      <ModelInstance url="/models/pavement-fountain.glb" position={[-22, 0.05, -22]} scale={[7, 6, 7]} />

      <ModelInstance
        url="/models/grass-trees.glb"
        position={[-22, 0.05, 22]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[8, 7, 8]}
      />
      <ModelInstance
        url="/models/grass-trees.glb"
        position={[22, 0.05, -22]}
        rotation={[0, -Math.PI / 4, 0]}
        scale={[8, 7, 8]}
      />
      <ModelInstance url="/models/grass-trees-tall.glb" position={[-35, 0.05, 45]} rotation={[0, 0.2, 0]} scale={8} />
      <ModelInstance url="/models/grass-trees-tall.glb" position={[35, 0.05, 45]} rotation={[0, -0.3, 0]} scale={8} />
      <ModelInstance url="/models/grass-trees-tall.glb" position={[-35, 0.05, -45]} rotation={[0, 0.5, 0]} scale={8} />
      <ModelInstance url="/models/grass-trees-tall.glb" position={[35, 0.05, -45]} rotation={[0, -0.4, 0]} scale={8} />
    </group>
  );
};

useGLTF.preload('/models/building-garage.glb');
useGLTF.preload('/models/building-small-a.glb');
useGLTF.preload('/models/building-small-b.glb');
useGLTF.preload('/models/building-small-c.glb');
useGLTF.preload('/models/building-small-d.glb');
useGLTF.preload('/models/grass-trees.glb');
useGLTF.preload('/models/grass-trees-tall.glb');
useGLTF.preload('/models/pavement-fountain.glb');
