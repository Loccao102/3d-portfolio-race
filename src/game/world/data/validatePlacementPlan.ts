import {
  BARRIER_PLACEMENTS,
  BOLLARD_PLACEMENTS,
  BUS_SHELTER_PLACEMENTS,
  CROSSWALK_PLACEMENTS,
  LANTERN_STRING_PLACEMENTS,
  PLANTER_PLACEMENTS,
  STREET_LAMP_PLACEMENTS,
  STREET_SIGN_PLACEMENTS,
  TRAFFIC_LIGHT_PLACEMENTS,
  TREE_PLACEMENTS,
  WET_PATCH_PLACEMENTS,
  type PurposefulPlacement,
} from './placementPlan';
import {
  BRAKING_WEAR_PLACEMENTS,
  DRAIN_GRATE_PLACEMENTS,
  THRESHOLD_REFLECTOR_PLACEMENTS,
} from './roadSurfacePlan';

const ALL_PLACEMENTS: PurposefulPlacement<Record<string, unknown>>[] = [
  ...BARRIER_PLACEMENTS,
  ...BOLLARD_PLACEMENTS,
  ...BUS_SHELTER_PLACEMENTS,
  ...CROSSWALK_PLACEMENTS,
  ...LANTERN_STRING_PLACEMENTS,
  ...PLANTER_PLACEMENTS,
  ...STREET_LAMP_PLACEMENTS,
  ...STREET_SIGN_PLACEMENTS,
  ...TRAFFIC_LIGHT_PLACEMENTS,
  ...TREE_PLACEMENTS,
  ...WET_PATCH_PLACEMENTS,
  ...BRAKING_WEAR_PLACEMENTS,
  ...DRAIN_GRATE_PLACEMENTS,
  ...THRESHOLD_REFLECTOR_PLACEMENTS,
] as PurposefulPlacement<Record<string, unknown>>[];

function getPlacementPoint(placement: PurposefulPlacement<Record<string, unknown>>) {
  const position = placement.position;
  if (!Array.isArray(position) || position.length < 3) return null;
  const [x, , z] = position as [number, number, number];
  return { x, z };
}

/**
 * Cheap invariants for future world edits. The typed placement shape already requires
 * zone/role/purpose; these checks catch duplicate IDs and decorative clutter inside
 * the main cross-shaped driving corridor.
 */
export function validatePurposefulPlacementPlan() {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const placement of ALL_PLACEMENTS) {
    if (ids.has(placement.id)) errors.push(`Duplicate placement id: ${placement.id}`);
    ids.add(placement.id);

    if (!placement.purpose.trim()) errors.push(`Missing purpose: ${placement.id}`);

    const point = getPlacementPoint(placement);
    if (!point) continue;

    const inPrimaryLane = Math.abs(point.x) < 5.4 || Math.abs(point.z) < 5.4;
    const decorativeRole = ['shade', 'social', 'story', 'framing'].includes(placement.role);
    if (inPrimaryLane && decorativeRole) {
      errors.push(`Decorative placement enters primary driving corridor: ${placement.id}`);
    }
  }

  return errors;
}

export function assertPurposefulPlacementPlan() {
  const errors = validatePurposefulPlacementPlan();
  if (errors.length > 0) {
    throw new Error(`Invalid world placement plan:\n${errors.join('\n')}`);
  }
}
