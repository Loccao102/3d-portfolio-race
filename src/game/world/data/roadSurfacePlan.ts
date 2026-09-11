import type { PurposefulPlacement, Vec3 } from './placementPlan';

export const BRAKING_WEAR_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
  size: [number, number];
  rotation: number;
}>[] = [
  {
    id: 'wear-about-braking-zone',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Subtle rubber build-up where vehicles brake before the About-side crosswalk.',
    position: [0, 0.079, 15.2],
    size: [4.2, 5.8],
    rotation: 0,
  },
  {
    id: 'wear-tech-braking-zone',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Subtle rubber build-up where vehicles brake before the Tech-side crosswalk.',
    position: [0, 0.079, -15.2],
    size: [4.2, 5.8],
    rotation: 0,
  },
  {
    id: 'wear-project-braking-zone',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Marks the normal braking area before the east-west pedestrian crossing.',
    position: [15.2, 0.079, 0],
    size: [4.2, 5.8],
    rotation: Math.PI / 2,
  },
  {
    id: 'wear-lab-braking-zone',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Balances the west approach with believable tire wear before the crossing.',
    position: [-15.2, 0.079, 0],
    size: [4.2, 5.8],
    rotation: Math.PI / 2,
  },
];

export const DRAIN_GRATE_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
  rotation: number;
}>[] = [
  {
    id: 'drain-project-shelter',
    zone: 'projects-forecourt',
    role: 'drainage',
    purpose: 'Receives runoff from the bus shelter and explains the nearby wet patch.',
    position: [20, 0.083, 14.25],
    rotation: 0,
  },
  {
    id: 'drain-project-garage',
    zone: 'projects-forecourt',
    role: 'service',
    purpose: 'Workshop floor/apron drainage that explains the garage wash-down wet patch.',
    position: [47.3, 0.083, 9.4],
    rotation: Math.PI / 2,
  },
  {
    id: 'drain-experiment-service',
    zone: 'experiments-service-edge',
    role: 'service',
    purpose: 'Service drain for lab cooling/runoff at the west campus edge.',
    position: [-47.2, 0.083, -9.6],
    rotation: Math.PI / 2,
  },
];

export const THRESHOLD_REFLECTOR_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
  color: string;
}>[] = [
  { id: 'reflector-about-left', zone: 'district-threshold', role: 'navigation', purpose: 'Marks the About threshold edge at night.', position: [-4.5, 0.09, 25.5], color: '#f59e0b' },
  { id: 'reflector-about-right', zone: 'district-threshold', role: 'navigation', purpose: 'Pairs with the opposite reflector to frame the About threshold.', position: [4.5, 0.09, 25.5], color: '#f59e0b' },
  { id: 'reflector-tech-left', zone: 'district-threshold', role: 'navigation', purpose: 'Marks the Tech threshold edge at night.', position: [-4.5, 0.09, -25.5], color: '#22d3ee' },
  { id: 'reflector-tech-right', zone: 'district-threshold', role: 'navigation', purpose: 'Pairs with the opposite reflector to frame the Tech threshold.', position: [4.5, 0.09, -25.5], color: '#22d3ee' },
  { id: 'reflector-project-top', zone: 'district-threshold', role: 'navigation', purpose: 'Marks the Project Garage threshold from the east avenue.', position: [27.5, 0.09, 4.5], color: '#fb7185' },
  { id: 'reflector-project-bottom', zone: 'district-threshold', role: 'navigation', purpose: 'Completes the Project Garage threshold pair.', position: [27.5, 0.09, -4.5], color: '#fb7185' },
  { id: 'reflector-lab-top', zone: 'district-threshold', role: 'navigation', purpose: 'Marks the Experiment threshold from the west avenue.', position: [-27.5, 0.09, 4.5], color: '#a855f7' },
  { id: 'reflector-lab-bottom', zone: 'district-threshold', role: 'navigation', purpose: 'Completes the Experiment threshold pair.', position: [-27.5, 0.09, -4.5], color: '#a855f7' },
];
