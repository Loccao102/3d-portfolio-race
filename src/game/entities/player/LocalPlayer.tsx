import React, { forwardRef } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { PlayerVehicle } from './PlayerVehicle';

export interface LocalPlayerProps {
  initialPosition?: [number, number, number];
}

/** Canonical local-player entity boundary used by the scene composition root. */
export const LocalPlayer = forwardRef<RapierRigidBody, LocalPlayerProps>(
  ({ initialPosition = [0, 1.2, 14] }, ref) => (
    <PlayerVehicle ref={ref} initialPosition={initialPosition} />
  ),
);

LocalPlayer.displayName = 'LocalPlayer';
