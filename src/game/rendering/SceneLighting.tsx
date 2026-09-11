import React, { Suspense, useEffect } from 'react';
import { Environment, Sparkles, Stars } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';
import { getSceneLook } from '../config/scene';

/** Visual atmosphere only: IBL, renderer color management, lights and sky particles. */
export function SceneLighting() {
  const theme = useGameStore((state) => state.theme);
  const quality = useGameStore((state) => state.quality);
  const { gl } = useThree();
  const look = getSceneLook(theme);
  const isLowQuality = quality === 'low';
  const isLight = theme === 'light';
  const isNight = theme === 'night';

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = isLight ? 1.02 : isNight ? 1.14 : 1.08;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl, isLight, isNight]);

  return (
    <>
      <Suspense fallback={null}>
        <Environment
          preset={isLight ? 'sunset' : 'city'}
          environmentIntensity={look.environmentIntensity}
        />
      </Suspense>

      {!isLight && !isLowQuality && (
        <>
          <Stars radius={190} depth={75} count={isNight ? 1500 : 650} factor={2.2} saturation={0.1} fade speed={0.25} />
          <Sparkles
            count={isNight ? 54 : 28}
            scale={[170, 32, 210]}
            size={1.15}
            speed={0.18}
            opacity={isNight ? 0.28 : 0.14}
            color="#b9e8ff"
          />
        </>
      )}

      <hemisphereLight args={look.hemisphere} />
      <ambientLight intensity={look.ambientIntensity} color={look.ambientColor} />

      {/* Warm late-afternoon key light gives the city a less synthetic cyberpunk palette. */}
      <directionalLight
        position={[68, 96, 58]}
        intensity={look.sunIntensity}
        color={look.sunColor}
        castShadow={!isLowQuality}
        shadow-mapSize={isLowQuality ? [512, 512] : [1536, 1536]}
        shadow-camera-near={10}
        shadow-camera-far={260}
        shadow-camera-left={-95}
        shadow-camera-right={95}
        shadow-camera-top={105}
        shadow-camera-bottom={-95}
        shadow-bias={-0.00035}
      />

      {/* Cool city fill + restrained magenta for depth. */}
      <directionalLight position={[-62, 42, -64]} intensity={look.cyanIntensity} color="#38bdf8" />
      <directionalLight position={[58, 34, 46]} intensity={look.magentaIntensity} color="#e879f9" />
      <directionalLight position={[-20, 28, 76]} intensity={look.amberIntensity} color="#f59e0b" />

      {/* District pools make each destination read as a place rather than a loose mesh cluster. */}
      <pointLight position={[0, 10, 38]} color="#f59e0b" intensity={look.districtGlowIntensity} distance={28} decay={2} />
      <pointLight position={[0, 11, -38]} color="#22d3ee" intensity={look.districtGlowIntensity} distance={28} decay={2} />
      <pointLight position={[42, 10, 0]} color="#f472b6" intensity={look.districtGlowIntensity} distance={26} decay={2} />
      <pointLight position={[-42, 10, 0]} color="#a78bfa" intensity={look.districtGlowIntensity} distance={26} decay={2} />
      <pointLight position={[0, 12, -76]} color="#38bdf8" intensity={look.districtGlowIntensity * 1.15} distance={28} decay={2} />
    </>
  );
}
