import React from 'react';
import { AboutDistrict } from '@/components/world/districts/AboutDistrict';
import { TechDistrict } from '@/components/world/districts/TechDistrict';
import { ProjectGarage } from '@/components/world/districts/ProjectGarage';
import { ExperimentLab } from '@/components/world/districts/ExperimentLab';
import { ContactStation } from '@/components/world/districts/ContactStation';

/** Portfolio-specific world content. Lies will replace this feature, not fork the engine shell. */
export function PortfolioDistricts() {
  return (
    <>
      <AboutDistrict />
      <TechDistrict />
      <ProjectGarage />
      <ExperimentLab />
      <ContactStation />
    </>
  );
}
