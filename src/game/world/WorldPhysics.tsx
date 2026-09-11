import React, { Suspense } from 'react';
import { Physics, type RapierRigidBody } from '@react-three/rapier';
import { PHYSICS_CONFIG } from '../config/scene';
import { LocalPlayer } from '../entities/player/LocalPlayer';
import { PortfolioDistricts } from '../features/portfolio/PortfolioDistricts';
import { RacingFeature } from '../features/racing/RacingFeature';
import { RemotePlayers } from '../systems/network/RemotePlayers';
import { Ground } from './Ground';
import { InstancedProps } from './InstancedProps';
import { UrbanColliders } from './UrbanColliders';

interface WorldPhysicsProps {
  playerRef: React.RefObject<RapierRigidBody | null>;
}

/** Authoritative physical world and feature composition boundary. */
export function WorldPhysics({ playerRef }: WorldPhysicsProps) {
  return (
    <Suspense fallback={null}>
      <Physics gravity={PHYSICS_CONFIG.gravity} timeStep={PHYSICS_CONFIG.timeStep}>
        <Ground />
        <InstancedProps />
        <UrbanColliders />
        <PortfolioDistricts />
        <RacingFeature />
        <LocalPlayer ref={playerRef} />
        <RemotePlayers />
      </Physics>
    </Suspense>
  );
}
