import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore, type MilestoneId } from '@/stores/useGameStore';
import { DISTRICT_EXPERIENCES } from '@/game/features/portfolio/data/districtExperience';
import { useExperienceStore } from '@/game/features/portfolio/useExperienceStore';
import { useExperiencePreferences } from '@/game/stores/useExperiencePreferences';

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
    const reducedMotion = useExperiencePreferences.getState().reducedMotion;
    const experience = useExperienceStore.getState();
    const tourDistrict = DISTRICT_EXPERIENCES[
      Math.min(experience.tourIndex, DISTRICT_EXPERIENCES.length - 1)
    ];

    const useAuthoredTourShot =
      experience.mode === 'tour' &&
      (experience.tourPhase === 'hold' || experience.tourStatus === 'complete') &&
      tourDistrict;

    if (useAuthoredTourShot) {
      const orbit = reducedMotion
        ? 0
        : experience.tourStatus === 'running'
          ? Math.sin(clock.getElapsedTime() * 0.28) * 0.75
          : 0;
      scratchDesiredPos.set(
        tourDistrict.cameraPosition[0] + orbit,
        tourDistrict.cameraPosition[1],
        tourDistrict.cameraPosition[2] + orbit * 0.28,
      );
      scratchDesiredLookAt.set(...tourDistrict.lookAt);

      const shotPositionLerp = 1 - Math.exp(-clampedDelta * (reducedMotion ? 5.2 : 2.8));
      const shotLookLerp = 1 - Math.exp(-clampedDelta * (reducedMotion ? 5.6 : 3.4));
      camera.position.lerp(scratchDesiredPos, shotPositionLerp);
      currentLookAt.current.lerp(scratchDesiredLookAt, shotLookLerp);
      camera.lookAt(currentLookAt.current);

      if ('fov' in camera) {
        const perspectiveCamera = camera as THREE.PerspectiveCamera;
        perspectiveCamera.fov = THREE.MathUtils.lerp(
          perspectiveCamera.fov,
          43,
          1 - Math.exp(-clampedDelta * 3.2),
        );
        perspectiveCamera.updateProjectionMatrix();
      }
      return;
    }

    const { vehicleSpeed, isBoosting, activeMilestone } = useGameStore.getState();
    const speedRatio = Math.min(1, vehicleSpeed / 130);
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
      ? THREE.MathUtils.clamp(1 - vehicleSpeed / 48, 0, 1) * (reducedMotion ? 0.18 : 0.36)
      : 0;

    if ('fov' in camera) {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      const explorationFovBoost = cinematicAmount * 2.2;
      const motionFov = reducedMotion ? 0 : isBoosting ? 7.5 : speedRatio * 3.5;
      const targetFov = 47 + explorationFovBoost + motionFov;
      perspectiveCamera.fov = THREE.MathUtils.lerp(
        perspectiveCamera.fov,
        targetFov,
        1 - Math.exp(-clampedDelta * 5.5),
      );
      perspectiveCamera.updateProjectionMatrix();
    }

    const lookAheadDistance = 4.2 + speedRatio * 6.4;
    const shakeIntensity = reducedMotion ? 0 : isBoosting ? 0.028 : vehicleSpeed > 100 ? 0.012 : 0;
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
