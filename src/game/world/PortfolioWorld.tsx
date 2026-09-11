import React, { Suspense } from 'react';
import { CityBuildings } from '@/components/world/CityBuildings';

/**
 * Visual world shell. Async authored assets live here and intentionally stay
 * outside the physics subtree until they have authoritative collider proxies.
 */
export function PortfolioWorld() {
  return (
    <Suspense fallback={null}>
      <CityBuildings />
    </Suspense>
  );
}
