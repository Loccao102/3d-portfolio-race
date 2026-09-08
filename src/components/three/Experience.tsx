import React, { useRef } from 'react';
import { Physics, RapierRigidBody } from '@react-three/rapier';
import { Vehicle } from '../vehicle/Vehicle';
import { RivalRacers } from '../vehicle/RivalRacers';
import { CameraFollow } from '../camera/CameraFollow';
import { Ground } from '../world/Ground';
import { InstancedProps } from '../world/InstancedProps';
import { CityBuildings } from '../world/CityBuildings';
import { AboutDistrict } from '../world/districts/AboutDistrict';
import { TechDistrict } from '../world/districts/TechDistrict';
import { ProjectGarage } from '../world/districts/ProjectGarage';
import { ExperimentLab } from '../world/districts/ExperimentLab';
import { ContactStation } from '../world/districts/ContactStation';
import { PerformanceMonitor } from './PerformanceMonitor';

import { Environment } from '@react-three/drei';
import { useGameStore } from '../../stores/useGameStore';

export const Experience: React.FC = () => {
  const vehicleRef = useRef<RapierRigidBody>(null);
  const theme = useGameStore((state) => state.theme);
  const isLight = theme === 'light';
  const isDark = theme === 'dark';
  const isNight = theme === 'night';

  const envIntensity = isLight ? 0.95 : isDark ? 0.6 : 0.45;
  const hemiArgs: [string, string, number] = isLight
    ? ['#ffffff', '#cbd5e1', 2.3]
    : isDark
    ? ['#38bdf8', '#0f172a', 1.5]
    : ['#00f3ff', '#020617', 1.35];

  const ambientIntensity = isLight ? 1.1 : isDark ? 0.8 : 0.65;
  const ambientColor = isLight ? '#ffffff' : isDark ? '#94a3b8' : '#64748b';

  const sunIntensity = isLight ? 3.4 : isDark ? 2.6 : 2.2;
  const sunColor = isLight ? '#ffffff' : isDark ? '#f1f5f9' : '#93c5fd';

  const cyanIntensity = isLight ? 0.6 : isDark ? 1.5 : 2.8;
  const magentaIntensity = isLight ? 0.4 : isDark ? 1.1 : 2.2;
  const amberIntensity = isLight ? 0.5 : isDark ? 0.8 : 1.3;

  return (
    <>
      {/* Realistic Image-Based Lighting & Reflections */}
      <Environment preset="city" environmentIntensity={envIntensity} />

      {/* Performance FPS Telemetry Monitor */}
      <PerformanceMonitor />

      {/* 1. Dynamic Sky/Ground Ambient Hemisphere Light */}
      <hemisphereLight args={hemiArgs} />

      {/* 2. Soft Omni Ambient Fill */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />

      {/* 3. Primary Key Light */}
      <directionalLight
        position={[55, 90, 45]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={10}
        shadow-camera-far={240}
        shadow-camera-left={-85}
        shadow-camera-right={85}
        shadow-camera-top={85}
        shadow-camera-bottom={-85}
        shadow-bias={-0.0004}
      />

      {/* 4. Electric Cyan Rim Accent Light */}
      <directionalLight
        position={[-55, 40, -55]}
        intensity={cyanIntensity}
        color="#00f3ff"
      />

      {/* 5. Cyberpunk Neon Magenta Accent Light */}
      <directionalLight
        position={[55, 30, 55]}
        intensity={magentaIntensity}
        color="#f472b6"
      />

      {/* 6. Front Warm Amber Horizon Fill Light */}
      <directionalLight
        position={[0, 30, 75]}
        intensity={amberIntensity}
        color="#f59e0b"
      />

      {/* Physics World Simulation */}
      <Physics gravity={[0, -26, 0]} timeStep="vary">
        {/* World Base Ground & Roads & Grand Speed Circuit */}
        <Ground />

        {/* Real 3D Low-Poly City Buildings & Urban Plazas */}
        <CityBuildings />

        {/* Instanced City Props (Lamps, Barriers, Trees) */}
        <InstancedProps />

        {/* Autonomous AI Rival Racers competing on the Speed Circuit */}
        <RivalRacers />

        {/* The 5 Thematic Architectural Districts */}
        <AboutDistrict />
        <TechDistrict />
        <ProjectGarage />
        <ExperimentLab />
        <ContactStation />

        {/* Customized Playable Cyber-Roadster */}
        <Vehicle ref={vehicleRef} initialPosition={[0, 1.2, 0]} />
      </Physics>

      {/* Isometric Follow Camera */}
      <CameraFollow targetRef={vehicleRef} />
    </>
  );
};
