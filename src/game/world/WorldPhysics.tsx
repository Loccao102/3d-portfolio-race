import React, { Suspense } from 'react';
import { Physics, type RapierRigidBody } from '@react-three/rapier';
import { Ground } from '@/components/world/Ground';
import { InstancedProps } from '@/components/world/InstancedProps';
import { PortfolioDistricts } from '../features/portfolio/PortfolioDistricts';
import { LocalPlayer } from '../entities/player/LocalPlayer';
import { RemotePlayers } from '../systems/network/RemotePlayers';
import { PHYSICS_CONFIG } from '../config/scene';

interface WorldPhysicsProps {
  playerRef: React.RefObject<RapierRigidBody | null>;
}

/**
 * Authoritative physical world. Local physics and replicated kinematic visitors
 * live here; lighting/camera/presentation-only assets stay outside.
 */
export function WorldPhysics({ playerRef }: WorldPhysicsProps) {
  return (
    <Suspense fallback={null}>
      <Physics gravity={PHYSICS_CONFIG.gravity} timeStep={PHYSICS_CONFIG.timeStep}>
        <Ground />
        <InstancedProps />
        <PortfolioDistricts />
        <LocalPlayer ref={playerRef} />
        <RemotePlayers />
      </Physics>
    </Suspense>
  );
}
