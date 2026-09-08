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

const FOV_NORMAL = 46;
const FOV_BOOST = 60;

export const CameraFollow: React.FC<CameraFollowProps> = ({ targetRef }) => {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isBoosting = useGameStore((state) => state.isBoosting);

  // Follow offsets: further back and higher to see surrounding city
  const ELEVATION = 16.0;
  const DISTANCE = 22.0;
  const POSITION_LERP = 0.07;
  const LOOKAT_LERP = 0.10;
  const FOV_LERP = 0.06;

  useFrame(() => {
    if (!targetRef.current) return;

    // Read current translation from Rapier
    const translation = targetRef.current.translation();
    scratchVehiclePos.set(translation.x, translation.y, translation.z);

    // Read rotation to calculate car forward vector
    const rawRot = targetRef.current.rotation();
    scratchQuat.set(rawRot.x, rawRot.y, rawRot.z, rawRot.w);
    scratchForward.set(0, 0, -1).applyQuaternion(scratchQuat);

    // Desired camera position: Elevated behind vehicle's heading
    scratchDesiredPos.set(
      scratchVehiclePos.x - scratchForward.x * DISTANCE,
      scratchVehiclePos.y + ELEVATION,
      scratchVehiclePos.z - scratchForward.z * DISTANCE
    );

    // Desired look-at point: Slightly ahead of vehicle
    scratchDesiredLookAt.set(
      scratchVehiclePos.x + scratchForward.x * 3.0,
      scratchVehiclePos.y + 0.8,
      scratchVehiclePos.z + scratchForward.z * 3.0
    );

    // Smooth spring interpolation
    camera.position.lerp(scratchDesiredPos, POSITION_LERP);
    currentLookAt.current.lerp(scratchDesiredLookAt, LOOKAT_LERP);
    camera.lookAt(currentLookAt.current);

    // FOV Speed Warp during Nitro Boost (42deg normal → 58deg boost)
    const targetFov = isBoosting ? FOV_BOOST : FOV_NORMAL;
    const perspCamera = camera as THREE.PerspectiveCamera;
    if (Math.abs(perspCamera.fov - targetFov) > 0.1) {
      perspCamera.fov = THREE.MathUtils.lerp(perspCamera.fov, targetFov, FOV_LERP);
      perspCamera.updateProjectionMatrix();
    }
  });

  return null;
};
