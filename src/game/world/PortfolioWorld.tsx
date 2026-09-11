import React, { Suspense } from 'react';
import { CityBuildings } from './CityBuildings';

/** Visual world shell for authored GLB assets. */
export function PortfolioWorld() {
  return (
    <Suspense fallback={null}>
      <CityBuildings />
    </Suspense>
  );
}
