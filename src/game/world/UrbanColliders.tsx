import React from 'react';
import { CuboidCollider, RigidBody } from '@react-three/rapier';

const GATE_POSTS: Array<[number, number, number]> = [
  [-5.8, 2.55, 27.5],
  [5.8, 2.55, 27.5],
  [-5.8, 2.55, -27.5],
  [5.8, 2.55, -27.5],
  [31.5, 2.55, -5.8],
  [31.5, 2.55, 5.8],
  [-31.5, 2.55, -5.8],
  [-31.5, 2.55, 5.8],
  [-5.8, 2.55, -63],
  [5.8, 2.55, -63],
];

const STREET_LAMPS: Array<[number, number, number]> = [
  [-7.4, 2.1, 18],
  [7.4, 2.1, 18],
  [-7.4, 2.1, -18],
  [7.4, 2.1, -18],
  [-28, 2.1, 7.3],
  [28, 2.1, 7.3],
  [-28, 2.1, -7.3],
  [28, 2.1, -7.3],
  [-7.4, 2.1, 55],
  [7.4, 2.1, 55],
  [-7.4, 2.1, -55],
  [7.4, 2.1, -55],
];

/**
 * Low-cost proxy collision for procedural landmarks rendered by VietnamCityLayer.
 * Visual meshes intentionally stay outside Rapier; only simple authored proxies
 * enter the physics world.
 */
export function UrbanColliders() {
  return (
    <RigidBody type="fixed" colliders={false} friction={0.55} restitution={0.05}>
      {GATE_POSTS.map((position, index) => (
        <CuboidCollider key={`gate-${index}`} args={[0.28, 2.55, 0.28]} position={position} />
      ))}

      {STREET_LAMPS.map((position, index) => (
        <CuboidCollider key={`lamp-${index}`} args={[0.16, 2.1, 0.16]} position={position} />
      ))}

      {/* Vietnamese cafe / townhouse corner. */}
      <CuboidCollider args={[3.8, 2.45, 2.6]} position={[-64.8, 2.8, 42]} />
      <CuboidCollider args={[2.9, 2.7, 2.2]} position={[-54.3, 3.05, 40.8]} />

      {/* East-side portfolio billboard. */}
      <CuboidCollider args={[4.5, 3.2, 0.3]} position={[59, 3.2, 37]} />
    </RigidBody>
  );
}
