export type WorldPosition = [number, number, number];

export interface WorldBoxCollider {
  position: WorldPosition;
  halfExtents: WorldPosition;
  rotationY?: number;
}

export interface WorldCylinderCollider {
  position: WorldPosition;
  halfHeight: number;
  radius: number;
}

// Primitive proxies for the major GLB silhouettes. They deliberately leave
// the road side of garages open so a vehicle can reach the district sensors.
export const CITY_BUILDING_COLLIDERS: WorldBoxCollider[] = [
  { position: [59.5, 4, 0], halfExtents: [1.5, 4, 18] },
  { position: [55, 3, 14], halfExtents: [3, 3, 3] },
  { position: [55, 3, -14], halfExtents: [3, 3, 3] },
  { position: [-15, 5, -48], halfExtents: [4, 5, 4] },
  { position: [15, 5.5, -48], halfExtents: [4, 5.5, 4] },
  { position: [0, 5, -60], halfExtents: [5, 5, 5] },
  { position: [-14, 4, 48], halfExtents: [4, 4, 3] },
  { position: [14, 4.5, 48], halfExtents: [4, 4.5, 3] },
  { position: [0, 5, 62], halfExtents: [5, 5, 5] },
  { position: [-56, 4, 12], halfExtents: [3.5, 4, 4] },
  { position: [-56, 4.5, -12], halfExtents: [3.5, 4.5, 4] },
  { position: [-59, 3.5, 0], halfExtents: [1.5, 3.5, 16] },
  { position: [-12, 4, -100], halfExtents: [4, 4, 4] },
  { position: [12, 4, -100], halfExtents: [4, 4, 4] },
];

export const FOUNTAIN_COLLIDERS: WorldCylinderCollider[] = [
  { position: [22, 0.6, 22], halfHeight: 0.6, radius: 3.4 },
  { position: [-22, 0.6, -22], halfHeight: 0.6, radius: 3.4 },
];

// Side and rear compound walls for the hangar. The western bay openings stay
// clear, and each bay sensor remains reachable from the central avenue.
export const PROJECT_GARAGE_WALL_COLLIDERS: WorldBoxCollider[] = [
  { position: [10, 3, 0], halfExtents: [0.8, 3, 17] },
  { position: [6.5, 2.5, -15.5], halfExtents: [3.5, 2.5, 0.8] },
  { position: [6.5, 2.5, 15.5], halfExtents: [3.5, 2.5, 0.8] },
];

