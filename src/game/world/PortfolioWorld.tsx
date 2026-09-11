import React, { Suspense } from 'react';
import { ArchitecturalDetails } from './ArchitecturalDetails';
import { CityBuildings } from './CityBuildings';
import { RoadSurfaceCues } from './RoadSurfaceCues';
import { StreetDetails } from './StreetDetails';
import { VietnamCityLayer } from './VietnamCityLayer';
import { assertPurposefulPlacementPlan } from './data/validatePlacementPlan';

assertPurposefulPlacementPlan();

/** Visual world shell for authored GLB assets plus layered procedural detail passes. */
export function PortfolioWorld() {
  return (
    <Suspense fallback={null}>
      <CityBuildings />
      <VietnamCityLayer />
      <ArchitecturalDetails />
      <StreetDetails />
      <RoadSurfaceCues />
    </Suspense>
  );
}
