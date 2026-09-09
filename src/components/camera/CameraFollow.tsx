import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

// Static scratch vectors to eliminate memory thrashing in render loop
const scratchVehiclePos = new THREE.Vector3();
const scratchDesiredPos = new THREE.Vector3();
const scratchDesiredLookAt = new THREE.Vector3();
const scratchQuat = new THREE.Quaternion();
const scratchForward = new THREE.Vector3();

interface CameraFollowProps {
  targetRef: React.RefObject<RapierRigidBody | null>;
}

export const CameraFollow: React.FC<CameraFollowProps> = ({ targetRef }) => {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    if (!targetRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    // Read latest speed and boost state without triggering React re-renders
    const state = useGameStore.getState();
    const vehicleSpeed = state.vehicleSpeed;
    const isBoosting = state.isBoosting;

    // Camera follow offsets
    const ELEVATION = 14.0;
    const DISTANCE = 18.0;
    const POSITION_LERP = 0.08;
    const LOOKAT_LERP = 0.12;

    // Read current translation from Rapier
    const translation = targetRef.current.translation();
    scratchVehiclePos.set(translation.x, translation.y, translation.z);

    // Read rotation to calculate car forward vector
    const rawRot = targetRef.current.rotation();
    scratchQuat.set(rawRot.x, rawRot.y, rawRot.z, rawRot.w);
    scratchForward.set(0, 0, -1).applyQuaternion(scratchQuat);

    // Dynamic camera FOV warp based on speed and boost
    if ('fov' in camera) {
      const persCamera = camera as THREE.PerspectiveCamera;
      const speedRatio = Math.min(1.0, vehicleSpeed / 130);
      const targetFov = 46 + (isBoosting ? 8 : speedRatio * 4.5);
      persCamera.fov = THREE.MathUtils.lerp(persCamera.fov, targetFov, clampedDelta * 6.0);
      persCamera.updateProjectionMatrix();
    }

    // Dynamic look-ahead distance expands as vehicle speeds up
    const lookAheadDistance = 3.0 + Math.min(6.0, (vehicleSpeed / 130) * 6.0);

    // Subtle high-speed camera vibration for visceral speed sensation
    const shakeIntensity = isBoosting ? 0.04 : vehicleSpeed > 90 ? 0.02 : 0;
    const shakeX = shakeIntensity > 0 ? (Math.random() - 0.5) * shakeIntensity : 0;
    const shakeY = shakeIntensity > 0 ? (Math.random() - 0.5) * shakeIntensity : 0;

    // Desired camera position: Elevated behind vehicle's heading
    scratchDesiredPos.set(
      scratchVehiclePos.x - scratchForward.x * DISTANCE + shakeX,
      scratchVehiclePos.y + ELEVATION + shakeY,
      scratchVehiclePos.z - scratchForward.z * DISTANCE
    );

    // Desired look-at point: Ahead of vehicle
    scratchDesiredLookAt.set(
      scratchVehiclePos.x + scratchForward.x * lookAheadDistance,
      scratchVehiclePos.y + 0.8,
      scratchVehiclePos.z + scratchForward.z * lookAheadDistance
    );

    // Smooth spring interpolation
    camera.position.lerp(scratchDesiredPos, POSITION_LERP);
    currentLookAt.current.lerp(scratchDesiredLookAt, LOOKAT_LERP);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
