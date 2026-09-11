import React from 'react';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useGameStore } from '@/stores/useGameStore';

const DISTRICT_SLABS = [
  { position: [-42, 0, 42] as [number, number, number], size: [63, 0.12, 64] as [number, number, number] },
  { position: [42, 0, 42] as [number, number, number], size: [63, 0.12, 64] as [number, number, number] },
  { position: [-42, 0, -45] as [number, number, number], size: [63, 0.12, 72] as [number, number, number] },
  { position: [42, 0, -45] as [number, number, number], size: [63, 0.12, 72] as [number, number, number] },
];

export const Ground: React.FC = () => {
  const theme = useGameStore((state) => state.theme);
  const isLight = theme === 'light';
  const isDark = theme === 'dark';

  const topColor = isLight ? '#d9e0e6' : isDark ? '#111a27' : '#08101d';
  const slabColor = isLight ? '#e8edf1' : isDark ? '#172231' : '#0e1726';
  const bevelColor = isLight ? '#b9c3cc' : '#050a12';
  const rimColor = isLight ? '#0ea5e9' : '#22d3ee';
  const warmAccent = isLight ? '#d97706' : '#f59e0b';
  const waterColor = isLight ? '#91b9c7' : '#061525';

  return (
    <group>
      <RigidBody type="fixed" friction={0.42}>
        <CuboidCollider args={[95, 10, 125]} position={[0, -10, -5]} />
      </RigidBody>

      {/* Floating city island base. */}
      <group position={[0, -0.01, -5]}>
        <mesh receiveShadow position={[0, -0.34, 0]}>
          <boxGeometry args={[186, 0.68, 246]} />
          <meshStandardMaterial color={topColor} roughness={0.88} metalness={0.08} />
        </mesh>

        <mesh position={[0, -1.35, 0]}>
          <boxGeometry args={[182, 1.9, 242]} />
          <meshStandardMaterial color={bevelColor} roughness={0.96} metalness={0.08} />
        </mesh>

        {/* District blocks create sidewalks/plazas without looking like an infinite debug grid. */}
        {DISTRICT_SLABS.map((slab, index) => (
          <mesh
            key={index}
            receiveShadow
            position={[slab.position[0], 0.07, slab.position[2]]}
          >
            <boxGeometry args={slab.size} />
            <meshStandardMaterial
              color={slabColor}
              roughness={0.82}
              metalness={isLight ? 0.05 : 0.14}
            />
          </mesh>
        ))}

        {/* Warm/cool perimeter lighting gives the city a Vietnamese night-street warmth instead of pure cyan. */}
        {[-93.1, 93.1].map((x, index) => (
          <mesh key={`rim-x-${index}`} position={[x, 0.045, 0]}>
            <boxGeometry args={[0.14, 0.09, 246.2]} />
            <meshBasicMaterial color={index === 0 ? warmAccent : rimColor} />
          </mesh>
        ))}
        {[-123.1, 123.1].map((z, index) => (
          <mesh key={`rim-z-${index}`} position={[0, 0.045, z]}>
            <boxGeometry args={[186.2, 0.09, 0.14]} />
            <meshBasicMaterial color={index === 0 ? rimColor : warmAccent} />
          </mesh>
        ))}

        {/* Thin architectural seams on plazas, deliberately sparse rather than a debug grid. */}
        {[-60, -30, 30, 60].map((x) => (
          <mesh key={`seam-x-${x}`} position={[x, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.055, 220]} />
            <meshBasicMaterial color={isLight ? '#a8b3bd' : '#263449'} transparent opacity={0.42} />
          </mesh>
        ))}
        {[-68, -34, 34, 68].map((z) => (
          <mesh key={`seam-z-${z}`} position={[0, 0.145, z]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.055, 168]} />
            <meshBasicMaterial color={isLight ? '#a8b3bd' : '#263449'} transparent opacity={0.36} />
          </mesh>
        ))}

        {/* Water/void below the floating city edge. */}
        <mesh position={[0, -3.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[280, 330]} />
          <meshStandardMaterial
            color={waterColor}
            roughness={0.26}
            metalness={0.42}
            transparent
            opacity={isLight ? 0.72 : 0.92}
          />
        </mesh>
      </group>

      <RigidBody type="fixed">
        <CuboidCollider args={[1, 6, 125]} position={[-93, 3.0, -5]} />
        <CuboidCollider args={[1, 6, 125]} position={[93, 3.0, -5]} />
        <CuboidCollider args={[95, 6, 1]} position={[0, 3.0, -127]} />
        <CuboidCollider args={[95, 6, 1]} position={[0, 3.0, 117]} />
      </RigidBody>
    </group>
  );
};
