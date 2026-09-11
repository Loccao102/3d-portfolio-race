import React, { useRef } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { SceneLighting } from '../rendering/SceneLighting';
import { PortfolioWorld } from '../world/PortfolioWorld';
import { WorldPhysics } from '../world/WorldPhysics';
import { AccessibilitySystem } from '../systems/accessibility/AccessibilitySystem';
import { AmbientCityLife } from '../systems/ambient/AmbientCityLife';
import { FollowCameraSystem } from '../systems/camera/FollowCameraSystem';
import { NetworkSystem } from '../systems/network/NetworkSystem';
import { PerformanceSystem } from '../systems/performance/PerformanceSystem';
import { RecruiterTourSystem } from '../systems/tour/RecruiterTourSystem';

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
      <AccessibilitySystem />
      <SceneLighting />
      <PortfolioWorld />
      <WorldPhysics playerRef={localPlayerRef} />
      <AmbientCityLife />
      <RecruiterTourSystem targetRef={localPlayerRef} />
      <FollowCameraSystem targetRef={localPlayerRef} />
      <NetworkSystem playerRef={localPlayerRef} />
      <PerformanceSystem />
    </>
  );
}
