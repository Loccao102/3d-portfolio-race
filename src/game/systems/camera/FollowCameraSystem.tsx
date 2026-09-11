import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore, type MilestoneId } from '@/stores/useGameStore';

const scratchVehiclePos = new THREE.Vector3();
const scratchDesiredPos = new THREE.Vector3();
const scratchDesiredLookAt = new THREE.Vector3();
const scratchDistrictFocus = new THREE.Vector3();
const scratchQuat = new THREE.Quaternion();
const scratchForward = new THREE.Vector3();

const DISTRICT_FOCUS: Partial<Record<MilestoneId, [number, number, number]>> = {
  about: [0, 4.6, 52],
  tech: [18, 7.4, -52],
  projects: [57, 5.4, 5],
  experiments: [-57, 6.2, 4],
  contact: [18, 7.2, -82],
};

interface FollowCameraSystemProps {
  targetRef: React.RefObject<RapierRigidBody | null>;
}

/** Global camera behavior. Player entities expose a target; they do not own camera policy. */
export function FollowCameraSystem({ targetRef }: FollowCameraSystemProps) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ clock }, delta) => {
    if (!targetRef.current) return;

    const clampedDelta = Math.min(delta, 0.05);
    const { vehicleSpeed, isBoosting, activeMilestone } = useGameStore.getState();
    const speedRatio = Math.min(1, vehicleSpeed / 130);

    // Lower than the old diorama camera so buildings, street furniture and signs
    // read at city scale. Pull back slightly at high speed for racing visibility.
    const elevation = 9.8 + speedRatio * 2.4;
    const distance = 15.2 + speedRatio * 2.2;
    const positionLerp = 1 - Math.exp(-clampedDelta * 5.2);
    const lookAtLerp = 1 - Math.exp(-clampedDelta * 7.4);

    const translation = targetRef.current.translation();
    scratchVehiclePos.set(translation.x, translation.y, translation.z);

    const rotation = targetRef.current.rotation();
    scratchQuat.set(rotation.x, rotation.y, rotation.z, rotation.w);
    scratchForward.set(0, 0, -1).applyQuaternion(scratchQuat);

    const districtAnchor = activeMilestone ? DISTRICT_FOCUS[activeMilestone] : undefined;
    const cinematicAmount = districtAnchor
      ? THREE.MathUtils.clamp(1 - vehicleSpeed / 48, 0, 1) * 0.36
      : 0;

    if ('fov' in camera) {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      const explorationFovBoost = cinematicAmount * 2.2;
      const targetFov = 47 + explorationFovBoost + (isBoosting ? 7.5 : speedRatio * 3.5);
      perspectiveCamera.fov = THREE.MathUtils.lerp(
        perspectiveCamera.fov,
        targetFov,
        1 - Math.exp(-clampedDelta * 5.5),
      );
      perspectiveCamera.updateProjectionMatrix();
    }

    const lookAheadDistance = 4.2 + speedRatio * 6.4;
    const shakeIntensity = isBoosting ? 0.028 : vehicleSpeed > 100 ? 0.012 : 0;
    const phase = clock.getElapsedTime() * 24;
    const shakeX = Math.sin(phase) * shakeIntensity;
    const shakeY = Math.cos(phase * 0.73) * shakeIntensity * 0.65;

    scratchDesiredPos.set(
      scratchVehiclePos.x - scratchForward.x * distance + shakeX,
      scratchVehiclePos.y + elevation + shakeY,
      scratchVehiclePos.z - scratchForward.z * distance,
    );

    scratchDesiredLookAt.set(
      scratchVehiclePos.x + scratchForward.x * lookAheadDistance,
      scratchVehiclePos.y + 1.05,
      scratchVehiclePos.z + scratchForward.z * lookAheadDistance,
    );

    // When the player slows down inside a portfolio district, blend the camera
    // toward that district's signature landmark. At speed this automatically
    // falls back to the normal chase camera so racing readability is preserved.
    if (districtAnchor && cinematicAmount > 0) {
      scratchDistrictFocus.set(...districtAnchor);
      scratchDesiredLookAt.lerp(scratchDistrictFocus, cinematicAmount);
      scratchDesiredPos.y += cinematicAmount * 1.4;
    }

    camera.position.lerp(scratchDesiredPos, positionLerp);
    currentLookAt.current.lerp(scratchDesiredLookAt, lookAtLerp);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
