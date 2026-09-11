import React, { Suspense } from 'react';
import { CityBuildings } from './CityBuildings';
import { VietnamCityLayer } from './VietnamCityLayer';

/** Visual world shell for authored GLB assets plus lightweight procedural city dressing. */
export function PortfolioWorld() {
  return (
    <Suspense fallback={null}>
      <CityBuildings />
      <VietnamCityLayer />
    </Suspense>
  );
}
