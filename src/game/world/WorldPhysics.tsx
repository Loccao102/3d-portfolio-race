import React, { Suspense } from 'react';
import { Physics, type RapierRigidBody } from '@react-three/rapier';
import { Ground } from '@/components/world/Ground';
import { InstancedProps } from '@/components/world/InstancedProps';
import { PortfolioDistricts } from '../features/portfolio/PortfolioDistricts';
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
        <PortfolioDistricts />
        <LocalPlayer ref={playerRef} />
      </Physics>
    </Suspense>
  );
}
