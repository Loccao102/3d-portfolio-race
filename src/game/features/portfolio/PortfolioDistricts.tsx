import React from 'react';
import { AboutDistrict } from './AboutDistrict';
import { ContactStation } from './ContactStation';
import { ExperimentLab } from './ExperimentLab';
import { ProjectGarage } from './ProjectGarage';
import { TechDistrict } from './TechDistrict';

/** Portfolio-specific physical content. City of Lies replaces this feature, not the engine shell. */
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
