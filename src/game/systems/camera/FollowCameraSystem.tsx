import React from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { CameraFollow } from '@/components/camera/CameraFollow';

interface FollowCameraSystemProps {
  targetRef: React.RefObject<RapierRigidBody | null>;
}

/** Camera policy boundary; gameplay entities do not own camera behavior. */
export function FollowCameraSystem({ targetRef }: FollowCameraSystemProps) {
  return <CameraFollow targetRef={targetRef} />;
}
