import React from 'react';
import { AboutDistrict } from '@/components/world/districts/AboutDistrict';
import { TechDistrict } from '@/components/world/districts/TechDistrict';
import { ProjectGarage } from '@/components/world/districts/ProjectGarage';
import { ExperimentLab } from '@/components/world/districts/ExperimentLab';
import { ContactStation } from '@/components/world/districts/ContactStation';

/**
 * Portfolio-specific physical feature composition.
 * The implementations are the next migration target; City of Lies replaces
 * this feature entirely while reusing the same scene/world/system shell.
 */
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
