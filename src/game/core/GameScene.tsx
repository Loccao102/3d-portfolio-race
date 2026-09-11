import React, { useRef } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { SceneLighting } from '../rendering/SceneLighting';
import { PortfolioWorld } from '../world/PortfolioWorld';
import { WorldPhysics } from '../world/WorldPhysics';
import { FollowCameraSystem } from '../systems/camera/FollowCameraSystem';

/**
 * Scene composition root.
 *
 * Dependency direction:
 * rendering -> presentation only
 * world     -> environment/domain composition
 * entities  -> stateful actors
 * systems   -> cross-entity behavior (camera/network/performance/etc.)
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
    </>
  );
}
