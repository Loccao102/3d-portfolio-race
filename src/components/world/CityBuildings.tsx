import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelInstanceProps {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
}

const ModelInstance: React.FC<ModelInstanceProps> = ({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  const scaleArray = typeof scale === 'number' ? [scale, scale, scale] : scale;

  return (
    <primitive
      object={cloned}
      position={position}
      rotation={rotation}
      scale={scaleArray}
    />
  );
};

export const CityBuildings: React.FC = () => {
  return (
    <group>
      {/* 1. PROJECT GARAGE BACKDROP BUILDINGS (East District) */}
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

      {/* 2. TECH DISTRICT DATA TOWERS (North District) */}
      <ModelInstance
        url="/models/building-small-b.glb"
        position={[-15, 0.5, -48]}
        rotation={[0, 0, 0]}
        scale={[8, 12, 8]}
      />
      <ModelInstance
        url="/models/building-small-c.glb"
        position={[15, 0.5, -48]}
        rotation={[0, 0, 0]}
        scale={[8, 13, 8]}
      />
      <ModelInstance
        url="/models/building-small-d.glb"
        position={[0, 0.5, -60]}
        rotation={[0, Math.PI, 0]}
        scale={[10, 11, 10]}
      />

      {/* 3. ABOUT DISTRICT LOFTS & HEADQUARTERS (South District) */}
      <ModelInstance
        url="/models/building-small-a.glb"
        position={[-14, 0.5, 48]}
        rotation={[0, 0, 0]}
        scale={[9, 9, 9]}
      />
      <ModelInstance
        url="/models/building-small-d.glb"
        position={[14, 0.5, 48]}
        rotation={[0, 0, 0]}
        scale={[9, 10, 9]}
      />
      <ModelInstance
        url="/models/building-small-c.glb"
        position={[0, 0.5, 62]}
        rotation={[0, 0, 0]}
        scale={[11, 12, 11]}
      />

      {/* 4. EXPERIMENTS LAB TECH CAMPUS (West District) */}
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

      {/* 5. CONTACT STATION SATELLITE TOWERS */}
      <ModelInstance
        url="/models/building-small-a.glb"
        position={[-12, 0.5, -100]}
        rotation={[0, 0, 0]}
        scale={[7, 9, 7]}
      />
      <ModelInstance
        url="/models/building-small-a.glb"
        position={[12, 0.5, -100]}
        rotation={[0, 0, 0]}
        scale={[7, 9, 7]}
      />

      {/* 6. CENTRAL FOUNTAIN PLAZA (Roundabout Center Islands) */}
      <ModelInstance
        url="/models/pavement-fountain.glb"
        position={[22, 0.05, 22]}
        rotation={[0, 0, 0]}
        scale={[7, 6, 7]}
      />
      <ModelInstance
        url="/models/pavement-fountain.glb"
        position={[-22, 0.05, -22]}
        rotation={[0, 0, 0]}
        scale={[7, 6, 7]}
      />

      {/* 7. GREEN PARKS & URBAN TREES */}
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
      <ModelInstance
        url="/models/grass-trees-tall.glb"
        position={[-35, 0.05, 45]}
        rotation={[0, 0.2, 0]}
        scale={[8, 8, 8]}
      />
      <ModelInstance
        url="/models/grass-trees-tall.glb"
        position={[35, 0.05, 45]}
        rotation={[0, -0.3, 0]}
        scale={[8, 8, 8]}
      />
      <ModelInstance
        url="/models/grass-trees-tall.glb"
        position={[-35, 0.05, -45]}
        rotation={[0, 0.5, 0]}
        scale={[8, 8, 8]}
      />
      <ModelInstance
        url="/models/grass-trees-tall.glb"
        position={[35, 0.05, -45]}
        rotation={[0, -0.4, 0]}
        scale={[8, 8, 8]}
      />
    </group>
  );
};

// Preload all city models
useGLTF.preload('/models/building-garage.glb');
useGLTF.preload('/models/building-small-a.glb');
useGLTF.preload('/models/building-small-b.glb');
useGLTF.preload('/models/building-small-c.glb');
useGLTF.preload('/models/building-small-d.glb');
useGLTF.preload('/models/grass-trees.glb');
useGLTF.preload('/models/grass-trees-tall.glb');
useGLTF.preload('/models/pavement-fountain.glb');

