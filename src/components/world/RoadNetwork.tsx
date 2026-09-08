import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

export const RoadNetwork: React.FC = () => {
  const centerRingsRef = useRef<THREE.Group>(null);
  const compassOrbRef = useRef<THREE.Mesh>(null);
  const finishBannerRef = useRef<THREE.Mesh>(null);

  const crossFinishLine = useGameStore((state) => state.crossFinishLine);
  const passCheckpoint = useGameStore((state) => state.passCheckpoint);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (centerRingsRef.current) {
      centerRingsRef.current.rotation.z = t * 0.3;
    }
    if (compassOrbRef.current) {
      compassOrbRef.current.rotation.y = t * 0.8;
      compassOrbRef.current.position.y = 1.5 + Math.sin(t * 2.0) * 0.15;
    }
    if (finishBannerRef.current) {
      const mat = finishBannerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.65 + Math.sin(t * 5.0) * 0.25;
    }
  });

  const theme = useGameStore((state) => state.theme);
  const isLight = theme === 'light';
  const isNight = theme === 'night';

  const roadColor = isLight ? '#1e293b' : isNight ? '#0b101e' : '#141e30';
  const circuitColor = isLight ? '#182438' : isNight ? '#080d1a' : '#101828';
  const markingColor = isLight ? '#ffffff' : isNight ? '#00f3ff' : '#38bdf8';
  const kerbRed = isNight ? '#ff0055' : '#ef4444';
  const kerbWhite = isLight ? '#ffffff' : isNight ? '#00f3ff' : '#f8fafc';

  return (
    <group position={[0, 0.02, 0]}>
      {/* 1. North-South Main Highway (Extended to 210m) */}
      <mesh receiveShadow position={[0, 0, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.4, 215]} />
        <meshStandardMaterial color={roadColor} roughness={0.65} metalness={0.2} />
      </mesh>

      {/* 2. East-West Main Avenue (Extended to 160m) */}
      <mesh receiveShadow position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[165, 10.4]} />
        <meshStandardMaterial color={roadColor} roughness={0.65} metalness={0.2} />
      </mesh>

      {/* 3. Outer Grand Racing Circuit Perimeter Loop (Width 9.2m) */}
      {/* North Circuit Straight */}
      <mesh receiveShadow position={[0, 0.003, -95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 9.2]} />
        <meshStandardMaterial color={circuitColor} roughness={0.6} metalness={0.25} />
      </mesh>
      {/* South Circuit Straight */}
      <mesh receiveShadow position={[0, 0.003, 85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 9.2]} />
        <meshStandardMaterial color={circuitColor} roughness={0.6} metalness={0.25} />
      </mesh>
      {/* East Circuit Straight */}
      <mesh receiveShadow position={[80, 0.003, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.2, 180]} />
        <meshStandardMaterial color={circuitColor} roughness={0.6} metalness={0.25} />
      </mesh>
      {/* West Circuit Straight */}
      <mesh receiveShadow position={[-80, 0.003, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.2, 180]} />
        <meshStandardMaterial color={circuitColor} roughness={0.6} metalness={0.25} />
      </mesh>

      {/* RACING CORNER KERBS (Alternating Red/White Formula 1 rumble strips) */}
      {[
        { x: 80, z: -95, rot: 0 },
        { x: 80, z: 85, rot: Math.PI / 2 },
        { x: -80, z: 85, rot: Math.PI },
        { x: -80, z: -95, rot: -Math.PI / 2 },
      ].map((corner, cIdx) => (
        <group key={`corner-kerbs-${cIdx}`} position={[corner.x, 0.036, corner.z]} rotation={[0, corner.rot, 0]}>
          {[-4, -2.5, -1, 0.5, 2, 3.5].map((offset, kIdx) => (
            <mesh key={`kerb-${kIdx}`} position={[offset, 0, 4.6]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.4, 0.5]} />
              <meshBasicMaterial color={kIdx % 2 === 0 ? kerbRed : kerbWhite} />
            </mesh>
          ))}
        </group>
      ))}

      {/* STARTING GRID POSITION BOXES (Slots 1, 2, 3, 4 before Start Line) */}
      {[
        { x: -2.2, z: -88 },
        { x: 2.2, z: -84 },
        { x: -2.2, z: -80 },
        { x: 2.2, z: -76 },
      ].map((slot, sIdx) => (
        <group key={`grid-slot-${sIdx}`} position={[slot.x, 0.036, slot.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.0, 3.2]} />
            <meshBasicMaterial color={markingColor} wireframe />
          </mesh>
        </group>
      ))}

      {/* 4. Central Roundabout Multi-Tier Plaza */}
      <mesh receiveShadow position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[12.5, 48]} />
        <meshStandardMaterial color="#1c273c" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Raised Center Plaza Island */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[4.4, 4.8, 0.28, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Concentric Rotating Holographic Rings on Plaza */}
      <group ref={centerRingsRef} position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[3.8, 4.15, 32]} />
          <meshBasicMaterial color="#00f3ff" side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[3.0, 3.25, 32]} />
          <meshBasicMaterial color="#e879f9" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Floating 3D City Center Compass Monolith */}
      <mesh ref={compassOrbRef} position={[0, 1.5, 0]}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      <pointLight position={[0, 1.8, 0]} color="#00f3ff" intensity={2.5} distance={10} />

      {/* 5. START / FINISH LINE ARCH & LAP TIMER SENSOR GATES */}
      {/* Start / Finish Gantry Arch at North Straight (x: 0, z: -95) */}
      <group position={[0, 0, -95]}>
        {/* Rapier Finish Line Sensor */}
        <RigidBody
          type="fixed"
          sensor
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject?.userData?.type === 'vehicle') {
              crossFinishLine();
            }
          }}
        >
          <CuboidCollider args={[7.0, 2.5, 1.0]} position={[0, 1.5, 0]} />
        </RigidBody>

        {/* Gantry Pillars */}
        {[-6.0, 6.0].map((x, i) => (
          <mesh key={`finish-pylon-${i}`} castShadow position={[x, 3.0, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 6.0, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
        ))}

        {/* Overhead Gantry Truss */}
        <mesh position={[0, 5.8, 0]}>
          <boxGeometry args={[12.6, 0.6, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>

        {/* Holographic Glowing Checkered Banner */}
        <mesh ref={finishBannerRef} position={[0, 5.8, 0.45]}>
          <planeGeometry args={[10.5, 0.9]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
        </mesh>

        {/* Checkered Asphalt Finish Strip on Road */}
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10.0, 1.6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* CHECKPOINT 1: East Turn (80, 0) */}
      <group position={[80, 0, 0]}>
        <RigidBody
          type="fixed"
          sensor
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject?.userData?.type === 'vehicle') {
              passCheckpoint(1);
            }
          }}
        >
          <CuboidCollider args={[1.0, 2.5, 7.0]} position={[0, 1.5, 0]} />
        </RigidBody>
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[10.0, 0.8]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* CHECKPOINT 2: South Hairpin (0, 85) */}
      <group position={[0, 0, 85]}>
        <RigidBody
          type="fixed"
          sensor
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject?.userData?.type === 'vehicle') {
              passCheckpoint(2);
            }
          }}
        >
          <CuboidCollider args={[7.0, 2.5, 1.0]} position={[0, 1.5, 0]} />
        </RigidBody>
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10.0, 0.8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* CHECKPOINT 3: West Straight (-80, 0) */}
      <group position={[-80, 0, 0]}>
        <RigidBody
          type="fixed"
          sensor
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject?.userData?.type === 'vehicle') {
              passCheckpoint(3);
            }
          }}
        >
          <CuboidCollider args={[1.0, 2.5, 7.0]} position={[0, 1.5, 0]} />
        </RigidBody>
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[10.0, 0.8]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
      </group>

      {/* 6. 3D In-World Street Wayfinding Signposts at Central Hub */}
      {/* South Signpost -> ABOUT */}
      <group position={[0, 0, 9.5]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 3.6, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <group position={[0, 3.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.8, 0.7, 0.08]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[3.4, 0.1, 0.02]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
        </group>
      </group>

      {/* North Signpost -> TECH & CIRCUIT */}
      <group position={[0, 0, -9.5]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 3.6, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <group position={[0, 3.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4.4, 0.7, 0.08]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[4.0, 0.1, 0.02]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>
      </group>

      {/* East Signpost -> PROJECTS */}
      <group position={[9.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 3.6, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <group position={[0, 3.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.8, 0.7, 0.08]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[3.4, 0.1, 0.02]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      </group>

      {/* West Signpost -> EXPERIMENTS */}
      <group position={[-9.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 3.6, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <group position={[0, 3.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.8, 0.7, 0.08]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[3.4, 0.1, 0.02]} />
            <meshBasicMaterial color="#ec4899" />
          </mesh>
        </group>
      </group>

      {/* 7. Luminous Dashed Road Centerlines */}
      {[-80, -60, -40, -20, 20, 40, 60, 80].map((z) => (
        <mesh key={`dash-z-${z}`} position={[0, 0.032, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 5.0]} />
          <meshBasicMaterial color={markingColor} />
        </mesh>
      ))}
      {[-60, -40, -20, 20, 40, 60].map((x) => (
        <mesh key={`dash-x-${x}`} position={[x, 0.032, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.3, 5.0]} />
          <meshBasicMaterial color={markingColor} />
        </mesh>
      ))}
    </group>
  );
};
