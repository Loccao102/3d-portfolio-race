import React, { useRef } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { SceneLighting } from '../rendering/SceneLighting';
import { PortfolioWorld } from '../world/PortfolioWorld';
import { WorldPhysics } from '../world/WorldPhysics';
import { FollowCameraSystem } from '../systems/camera/FollowCameraSystem';
import { NetworkSystem } from '../systems/network/NetworkSystem';
import { PerformanceSystem } from '../systems/performance/PerformanceSystem';

/**
 * Scene composition root.
 *
 * dependency direction:
 * rendering -> presentation only
 * world     -> environment/domain composition
 * entities  -> stateful actors
 * systems   -> cross-entity behavior
 * core      -> orchestration only
 */
export function GameScene() {
  const localPlayerRef = useRef<RapierRigidBody>(null);

  return (
    <>
      <SceneLighting />
      <PortfolioWorld />
      <WorldPhysics playerRef={localPlayerRef} />
      <FollowCameraSystem targetRef={localPlayerRef} />
      <NetworkSystem playerRef={localPlayerRef} />
      <PerformanceSystem />
    </>
  );
}
