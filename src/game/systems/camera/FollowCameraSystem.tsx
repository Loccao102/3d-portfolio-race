import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';

const scratchVehiclePos = new THREE.Vector3();
const scratchDesiredPos = new THREE.Vector3();
const scratchDesiredLookAt = new THREE.Vector3();
const scratchQuat = new THREE.Quaternion();
const scratchForward = new THREE.Vector3();

interface FollowCameraSystemProps {
  targetRef: React.RefObject<RapierRigidBody | null>;
}

/** Global camera behavior. Player entities expose a target; they do not own camera policy. */
export function FollowCameraSystem({ targetRef }: FollowCameraSystemProps) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    if (!targetRef.current) return;

    const clampedDelta = Math.min(delta, 0.05);
    const { vehicleSpeed, isBoosting } = useGameStore.getState();

    const elevation = 14;
    const distance = 18;
    const positionLerp = 0.08;
    const lookAtLerp = 0.12;

    const translation = targetRef.current.translation();
    scratchVehiclePos.set(translation.x, translation.y, translation.z);

    const rotation = targetRef.current.rotation();
    scratchQuat.set(rotation.x, rotation.y, rotation.z, rotation.w);
    scratchForward.set(0, 0, -1).applyQuaternion(scratchQuat);

    if ('fov' in camera) {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      const speedRatio = Math.min(1, vehicleSpeed / 130);
      const targetFov = 46 + (isBoosting ? 8 : speedRatio * 4.5);
      perspectiveCamera.fov = THREE.MathUtils.lerp(
        perspectiveCamera.fov,
        targetFov,
        clampedDelta * 6,
      );
      perspectiveCamera.updateProjectionMatrix();
    }

    const lookAheadDistance = 3 + Math.min(6, (vehicleSpeed / 130) * 6);
    const shakeIntensity = isBoosting ? 0.04 : vehicleSpeed > 90 ? 0.02 : 0;
    const shakeX = shakeIntensity > 0 ? (Math.random() - 0.5) * shakeIntensity : 0;
    const shakeY = shakeIntensity > 0 ? (Math.random() - 0.5) * shakeIntensity : 0;

    scratchDesiredPos.set(
      scratchVehiclePos.x - scratchForward.x * distance + shakeX,
      scratchVehiclePos.y + elevation + shakeY,
      scratchVehiclePos.z - scratchForward.z * distance,
    );

    scratchDesiredLookAt.set(
      scratchVehiclePos.x + scratchForward.x * lookAheadDistance,
      scratchVehiclePos.y + 0.8,
      scratchVehiclePos.z + scratchForward.z * lookAheadDistance,
    );

    camera.position.lerp(scratchDesiredPos, positionLerp);
    currentLookAt.current.lerp(scratchDesiredLookAt, lookAtLerp);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
