import React, { Suspense } from 'react';
import { Physics, type RapierRigidBody } from '@react-three/rapier';
import { Ground } from '@/components/world/Ground';
import { InstancedProps } from '@/components/world/InstancedProps';
import { AboutDistrict } from '@/components/world/districts/AboutDistrict';
import { TechDistrict } from '@/components/world/districts/TechDistrict';
import { ProjectGarage } from '@/components/world/districts/ProjectGarage';
import { ExperimentLab } from '@/components/world/districts/ExperimentLab';
import { ContactStation } from '@/components/world/districts/ContactStation';
import { LocalPlayer } from '../entities/player/LocalPlayer';
import { PHYSICS_CONFIG } from '../config/scene';

interface WorldPhysicsProps {
  playerRef: React.RefObject<RapierRigidBody | null>;
}

/**
 * Authoritative physical world. Only collision/sensor/player objects belong
 * here; lighting, camera and presentation-only assets must stay outside.
 */
export function WorldPhysics({ playerRef }: WorldPhysicsProps) {
  return (
    <Suspense fallback={null}>
      <Physics gravity={PHYSICS_CONFIG.gravity} timeStep={PHYSICS_CONFIG.timeStep}>
        <Ground />
        <InstancedProps />

        <AboutDistrict />
        <TechDistrict />
        <ProjectGarage />
        <ExperimentLab />
        <ContactStation />

        <LocalPlayer ref={playerRef} />
      </Physics>
    </Suspense>
  );
}
