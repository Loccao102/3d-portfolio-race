import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

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

  // Isometric follow offsets: Behind and elevated
  const ELEVATION = 14.0;
  const DISTANCE = 18.0;
  const POSITION_LERP = 0.08;
  const LOOKAT_LERP = 0.12;

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
  });

  return null;
};

