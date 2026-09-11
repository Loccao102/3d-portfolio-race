import React, { Suspense } from 'react';
import { Environment } from '@react-three/drei';
import { useGameStore } from '@/stores/useGameStore';
import { getSceneLook } from '../config/scene';

/**
 * Owns visual atmosphere only: IBL and lights.
 * No world geometry, player state, physics or telemetry belongs here.
 */
export function SceneLighting() {
  const theme = useGameStore((state) => state.theme);
  const quality = useGameStore((state) => state.quality);
  const look = getSceneLook(theme);
  const isLowQuality = quality === 'low';

  return (
    <>
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={look.environmentIntensity} />
      </Suspense>

      <hemisphereLight args={look.hemisphere} />
      <ambientLight intensity={look.ambientIntensity} color={look.ambientColor} />

      <directionalLight
        position={[55, 90, 45]}
        intensity={look.sunIntensity}
        color={look.sunColor}
        castShadow={!isLowQuality}
        shadow-mapSize={isLowQuality ? [512, 512] : [1024, 1024]}
        shadow-camera-near={10}
        shadow-camera-far={240}
        shadow-camera-left={-85}
        shadow-camera-right={85}
        shadow-camera-top={85}
        shadow-camera-bottom={-85}
        shadow-bias={-0.0004}
      />

      <directionalLight
        position={[-55, 40, -55]}
        intensity={look.cyanIntensity}
        color="#00f3ff"
      />
      <directionalLight
        position={[55, 30, 55]}
        intensity={look.magentaIntensity}
        color="#f472b6"
      />
      <directionalLight
        position={[0, 30, 75]}
        intensity={look.amberIntensity}
        color="#f59e0b"
      />
    </>
  );
}
