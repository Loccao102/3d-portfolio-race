import React, { forwardRef } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { Vehicle } from '@/components/vehicle/Vehicle';

export interface LocalPlayerProps {
  initialPosition?: [number, number, number];
}

/**
 * Canonical local-player entity boundary.
 * The current vehicle implementation stays behind this adapter so gameplay
 * can evolve without leaking vehicle internals into the scene composition.
 */
export const LocalPlayer = forwardRef<RapierRigidBody, LocalPlayerProps>(
  ({ initialPosition = [0, 1.2, 14] }, ref) => (
    <Vehicle ref={ref} initialPosition={initialPosition} />
  ),
);

LocalPlayer.displayName = 'LocalPlayer';
