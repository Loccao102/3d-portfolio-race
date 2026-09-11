export type Vec3 = [number, number, number];

export type WorldZone =
  | 'central-junction'
  | 'about-promenade'
  | 'tech-corridor'
  | 'projects-forecourt'
  | 'experiments-service-edge'
  | 'contact-approach'
  | 'district-threshold';

export type PlacementRole =
  | 'safety'
  | 'navigation'
  | 'shade'
  | 'social'
  | 'service'
  | 'drainage'
  | 'story'
  | 'framing';

export type PurposefulPlacement<T extends object = Record<string, never>> = T & {
  id: string;
  zone: WorldZone;
  role: PlacementRole;
  purpose: string;
};

export const PLACEMENT_RULES = {
  keepDrivingLaneClear: 'Do not place decorative geometry inside the primary racing/driving corridor.',
  protectSightlines: 'Landmarks and wayfinding signs must remain visible from their approach road.',
  clusterByUse: 'Street furniture belongs to a pedestrian, service, social or navigation cluster — never isolated decoration.',
  districtIdentity: 'Every district-facing prop must reinforce the function/story of that district.',
  sparseByDefault: 'If an object has no role, zone and purpose, it should not exist in the scene.',
} as const;

export const CROSSWALK_PLACEMENTS: PurposefulPlacement<{
  axis: 'ns' | 'ew';
  value: number;
}>[] = [
  {
    id: 'crosswalk-about-entry',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Pedestrian crossing on the About promenade approach before vehicles enter the central junction.',
    axis: 'ns',
    value: 11,
  },
  {
    id: 'crosswalk-tech-entry',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Pedestrian crossing on the Tech corridor approach before vehicles enter the central junction.',
    axis: 'ns',
    value: -11,
  },
  {
    id: 'crosswalk-project-entry',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Pedestrian crossing between the city core and Project Garage forecourt.',
    axis: 'ew',
    value: 11,
  },
  {
    id: 'crosswalk-lab-entry',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Pedestrian crossing between the city core and Experiment service edge.',
    axis: 'ew',
    value: -11,
  },
];

export const TRAFFIC_LIGHT_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
  rotation?: number;
  phase: number;
}>[] = [
  {
    id: 'light-nw',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Controls the north-south vehicle flow at the central pedestrian crossing.',
    position: [-7.2, 0, 7.2],
    rotation: Math.PI,
    phase: 0,
  },
  {
    id: 'light-se',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Pairs with the north-west signal to control the north-south flow.',
    position: [7.2, 0, -7.2],
    phase: 0,
  },
  {
    id: 'light-ne',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Controls the east-west vehicle flow and alternates against north-south traffic.',
    position: [7.2, 0, 7.2],
    rotation: Math.PI / 2,
    phase: 4.5,
  },
  {
    id: 'light-sw',
    zone: 'central-junction',
    role: 'safety',
    purpose: 'Pairs with the north-east signal to protect the east-west crossing.',
    position: [-7.2, 0, -7.2],
    rotation: -Math.PI / 2,
    phase: 4.5,
  },
];

export const STREET_SIGN_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
  rotation?: number;
  title: string;
  sub: string;
  accent: string;
}>[] = [
  {
    id: 'sign-about',
    zone: 'about-promenade',
    role: 'navigation',
    purpose: 'Confirms the driver is leaving the core toward the personal/story district.',
    position: [-15, 0, 16],
    rotation: 0.2,
    title: 'PHỐ DEV',
    sub: 'About →',
    accent: '#f59e0b',
  },
  {
    id: 'sign-tech',
    zone: 'tech-corridor',
    role: 'navigation',
    purpose: 'Marks the technology corridor before the skyline and data-pagoda become visible.',
    position: [16, 0, -16],
    rotation: Math.PI + 0.1,
    title: 'KHU TECH',
    sub: 'Data district',
    accent: '#22d3ee',
  },
  {
    id: 'sign-projects',
    zone: 'projects-forecourt',
    role: 'navigation',
    purpose: 'Turns the east avenue into the Project Garage arrival sequence.',
    position: [33, 0, 12],
    rotation: -Math.PI / 2,
    title: 'DỰ ÁN',
    sub: 'Garage →',
    accent: '#fb7185',
  },
  {
    id: 'sign-experiments',
    zone: 'experiments-service-edge',
    role: 'navigation',
    purpose: 'Marks the west avenue as a lab/service zone rather than a generic street.',
    position: [-33, 0, -12],
    rotation: Math.PI / 2,
    title: 'PHÒNG LAB',
    sub: 'Experiment →',
    accent: '#a855f7',
  },
];

export const BUS_SHELTER_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
  rotation: number;
}>[] = [
  {
    id: 'project-transit-stop',
    zone: 'projects-forecourt',
    role: 'social',
    purpose: 'Creates a believable public-transport waiting point between the core and the Project Garage, outside the driving lane.',
    position: [20, 0, 11],
    rotation: Math.PI,
  },
];

export const WET_PATCH_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
  scale: [number, number];
  rotation: number;
}>[] = [
  {
    id: 'shelter-drainage',
    zone: 'projects-forecourt',
    role: 'drainage',
    purpose: 'Small runoff patch beside the bus shelter roof/drain path, not a random reflective decal.',
    position: [20, 0.072, 13.4],
    scale: [2.3, 0.9],
    rotation: 0.08,
  },
  {
    id: 'garage-washdown',
    zone: 'projects-forecourt',
    role: 'service',
    purpose: 'Workshop wash-down residue at the edge of the Project Garage service apron.',
    position: [45.5, 0.074, 8.8],
    scale: [2.1, 1.05],
    rotation: 0.5,
  },
  {
    id: 'lab-cooling-runoff',
    zone: 'experiments-service-edge',
    role: 'service',
    purpose: 'Cooling/service runoff beside the experiment campus service edge.',
    position: [-45.5, 0.074, -9.2],
    scale: [1.8, 1.1],
    rotation: -0.42,
  },
];

export const PLANTER_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
}>[] = [-15, -5, 5, 15].map((x, index) => ({
  id: `about-buffer-planter-${index}`,
  zone: 'about-promenade' as const,
  role: 'safety' as const,
  purpose: 'Forms a soft pedestrian buffer on the About promenade without blocking the vehicle sightline.',
  position: [x, 0, 16.5] as Vec3,
}));

export const BARRIER_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
  rotation: number;
}>[] = [
  [-8.5, 0, 8.5, Math.PI / 4],
  [8.5, 0, 8.5, Math.PI / 4],
  [-8.5, 0, -8.5, -Math.PI / 4],
  [8.5, 0, -8.5, -Math.PI / 4],
].map(([x, y, z, rotation], index) => ({
  id: `junction-barrier-${index}`,
  zone: 'central-junction' as const,
  role: 'safety' as const,
  purpose: 'Protects the corner pedestrian refuge from a vehicle cutting the central junction too tightly.',
  position: [x, y, z] as Vec3,
  rotation,
}));

export const BOLLARD_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
}>[] = [
  [-6.7, 0, 24], [6.7, 0, 24],
  [-6.7, 0, -24], [6.7, 0, -24],
  [25, 0, -6.7], [25, 0, 6.7],
  [-25, 0, -6.7], [-25, 0, 6.7],
].map(([x, y, z], index) => ({
  id: `threshold-bollard-${index}`,
  zone: 'district-threshold' as const,
  role: 'safety' as const,
  purpose: 'Marks a district threshold and prevents decorative/sidewalk space from visually bleeding into the drive lane.',
  position: [x, y, z] as Vec3,
}));

export const TREE_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
}>[] = [
  { id: 'about-tree-left', zone: 'about-promenade', role: 'shade', purpose: 'Frames the About approach and provides a softer, human-scale transition from the core.', position: [-13, 0, 20] },
  { id: 'about-tree-right', zone: 'about-promenade', role: 'shade', purpose: 'Balances the About approach without hiding the pavilion gateway.', position: [13, 0, 20] },
  { id: 'about-tree-deep-left', zone: 'about-promenade', role: 'shade', purpose: 'Adds shade beside the residential/pavilion edge, outside the main sightline.', position: [-18, 0, 54] },
  { id: 'about-tree-deep-right', zone: 'about-promenade', role: 'shade', purpose: 'Pairs with the opposite tree to define the courtyard edge.', position: [18, 0, 54] },
  { id: 'tech-tree-left', zone: 'tech-corridor', role: 'framing', purpose: 'Frames the data-pagoda approach while keeping its central silhouette clear.', position: [-13, 0, -20] },
  { id: 'tech-tree-right', zone: 'tech-corridor', role: 'framing', purpose: 'Balances the tech corridor foreground and keeps the skyline readable.', position: [13, 0, -20] },
  { id: 'project-tree-north', zone: 'projects-forecourt', role: 'shade', purpose: 'Softens the garage forecourt pedestrian edge without entering the racing line.', position: [29, 0, 18] },
  { id: 'project-tree-south', zone: 'projects-forecourt', role: 'shade', purpose: 'Creates a paired forecourt edge near the workshop/service zone.', position: [29, 0, -18] },
  { id: 'lab-tree-north', zone: 'experiments-service-edge', role: 'framing', purpose: 'Frames the kinetic lab from the avenue and separates it from the central road.', position: [-29, 0, 18] },
  { id: 'lab-tree-south', zone: 'experiments-service-edge', role: 'framing', purpose: 'Balances the west campus edge while preserving the lab sightline.', position: [-29, 0, -18] },
];

export const STREET_LAMP_PLACEMENTS: PurposefulPlacement<{
  position: Vec3;
  rotation?: Vec3;
}>[] = [
  { id: 'lamp-about-left', zone: 'about-promenade', role: 'safety', purpose: 'Lights the About approach pedestrian edge.', position: [-7.4, 0, 18] },
  { id: 'lamp-about-right', zone: 'about-promenade', role: 'safety', purpose: 'Pairs with the opposite lamp to illuminate the About approach.', position: [7.4, 0, 18] },
  { id: 'lamp-tech-left', zone: 'tech-corridor', role: 'safety', purpose: 'Lights the Tech approach pedestrian edge.', position: [-7.4, 0, -18] },
  { id: 'lamp-tech-right', zone: 'tech-corridor', role: 'safety', purpose: 'Pairs with the opposite lamp to illuminate the Tech approach.', position: [7.4, 0, -18] },
  { id: 'lamp-lab-north', zone: 'experiments-service-edge', role: 'safety', purpose: 'Lights the west avenue near the experiment campus entrance.', position: [-28, 0, 7.3], rotation: [0, Math.PI / 2, 0] },
  { id: 'lamp-project-north', zone: 'projects-forecourt', role: 'safety', purpose: 'Lights the east avenue near the garage entrance.', position: [28, 0, 7.3], rotation: [0, Math.PI / 2, 0] },
  { id: 'lamp-lab-south', zone: 'experiments-service-edge', role: 'safety', purpose: 'Illuminates the south side of the experiment campus approach.', position: [-28, 0, -7.3], rotation: [0, Math.PI / 2, 0] },
  { id: 'lamp-project-south', zone: 'projects-forecourt', role: 'safety', purpose: 'Illuminates the south side of the garage approach.', position: [28, 0, -7.3], rotation: [0, Math.PI / 2, 0] },
  { id: 'lamp-about-deep-left', zone: 'about-promenade', role: 'social', purpose: 'Creates a warmer pool of light near the About courtyard/residential edge.', position: [-7.4, 0, 55] },
  { id: 'lamp-about-deep-right', zone: 'about-promenade', role: 'social', purpose: 'Completes the courtyard lighting pair.', position: [7.4, 0, 55] },
  { id: 'lamp-contact-left', zone: 'contact-approach', role: 'navigation', purpose: 'Pulls the eye down the long Contact approach after the Tech district.', position: [-7.4, 0, -55] },
  { id: 'lamp-contact-right', zone: 'contact-approach', role: 'navigation', purpose: 'Pairs with the opposite lamp to frame the Contact approach.', position: [7.4, 0, -55] },
];

export const LANTERN_STRING_PLACEMENTS: PurposefulPlacement<{
  start: Vec3;
  end: Vec3;
}>[] = [
  {
    id: 'about-entry-lanterns',
    zone: 'about-promenade',
    role: 'story',
    purpose: 'Signals a warmer Vietnamese social/residential district immediately after the About gateway.',
    start: [-17, 6.5, 31],
    end: [17, 6.5, 31],
  },
  {
    id: 'about-courtyard-lanterns',
    zone: 'about-promenade',
    role: 'social',
    purpose: 'Makes the deeper About courtyard feel inhabited and distinct from the colder tech districts.',
    start: [-17, 7.3, 47],
    end: [17, 7.3, 47],
  },
  {
    id: 'lab-service-lanterns',
    zone: 'experiments-service-edge',
    role: 'story',
    purpose: 'Adds a local street-market memory to the experimental west edge instead of generic sci-fi lighting.',
    start: [-57, 6.8, -20],
    end: [-57, 6.8, 20],
  },
];
