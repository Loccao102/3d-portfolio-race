import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const metalDark = '#111827';
const concrete = '#273244';

function Lantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.24, 0.42, 12]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={1.8} />
      </mesh>
      <pointLight intensity={0.55} distance={4} color="#fb7185" />
    </group>
  );
}

function AboutPavilion() {
  const lanterns = useMemo(
    () => [
      [-9, 4.3, 53],
      [-6, 4.3, 53],
      [6, 4.3, 53],
      [9, 4.3, 53],
    ] as [number, number, number][],
    [],
  );

  return (
    <group>
      <group position={[-7.5, 0, 53]}>
        <mesh position={[0, 2.4, 0]} castShadow>
          <boxGeometry args={[7.2, 4.8, 5.4]} />
          <meshStandardMaterial color="#352a24" roughness={0.75} />
        </mesh>
        <mesh position={[0, 5.25, 0]} rotation={[0, 0, 0.06]} castShadow>
          <boxGeometry args={[8.4, 0.34, 6.6]} />
          <meshStandardMaterial color="#5b211e" roughness={0.55} metalness={0.15} />
        </mesh>
        <mesh position={[0, 4.72, 2.72]}>
          <boxGeometry args={[5.4, 0.08, 0.12]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      <group position={[7.5, 0, 53]}>
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[6.8, 4.2, 5.0]} />
          <meshStandardMaterial color="#2f2926" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.72, 0]} rotation={[0, 0, -0.06]} castShadow>
          <boxGeometry args={[8.0, 0.34, 6.2]} />
          <meshStandardMaterial color="#6b2520" roughness={0.55} metalness={0.15} />
        </mesh>
        <mesh position={[0, 4.18, 2.52]}>
          <boxGeometry args={[5.0, 0.08, 0.12]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      </group>

      {[-10.5, -4.5, 4.5, 10.5].map((x) => (
        <mesh key={`about-column-${x}`} position={[x, 2.2, 49.7]} castShadow>
          <cylinderGeometry args={[0.17, 0.22, 4.4, 10]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
      ))}

      <mesh position={[0, 4.45, 49.7]} castShadow>
        <boxGeometry args={[22, 0.24, 0.34]} />
        <meshStandardMaterial color="#3f2a24" roughness={0.65} />
      </mesh>

      {lanterns.map((position, index) => (
        <Lantern key={`about-lantern-${index}`} position={position} />
      ))}

      <mesh position={[0, 0.08, 53]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.2, 4.45, 48]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.52} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function TechPagoda() {
  const rings = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rings.current) {
      rings.current.rotation.y = t * 0.42;
      rings.current.rotation.z = Math.sin(t * 0.45) * 0.16;
    }
    if (core.current) {
      const material = core.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.7 + Math.sin(t * 3.1) * 0.45;
    }
  });

  return (
    <group position={[18, 0, -52]}>
      {[0, 1, 2, 3].map((tier) => {
        const width = 9 - tier * 1.45;
        return (
          <group key={`tech-tier-${tier}`} position={[0, 1.1 + tier * 2.1, 0]}>
            <mesh castShadow>
              <boxGeometry args={[width, 1.55, width]} />
              <meshStandardMaterial
                color={tier % 2 === 0 ? '#12253a' : '#172f48'}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
            <mesh position={[0, 0.82, 0]}>
              <boxGeometry args={[width + 0.55, 0.08, width + 0.55]} />
              <meshBasicMaterial color={tier % 2 === 0 ? '#22d3ee' : '#60a5fa'} />
            </mesh>
          </group>
        );
      })}

      <mesh ref={core} position={[0, 9.8, 0]}>
        <octahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={2}
          metalness={0.5}
          roughness={0.18}
        />
      </mesh>

      <group ref={rings} position={[0, 9.8, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.06, 12, 64]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
        <mesh rotation={[0.7, 0, 1.1]}>
          <torusGeometry args={[2.8, 0.045, 12, 64]} />
          <meshBasicMaterial color="#818cf8" />
        </mesh>
      </group>
      <pointLight position={[0, 9, 0]} intensity={2.4} distance={20} color="#22d3ee" />
    </group>
  );
}

function ProjectLaunchGarage() {
  const bays = [-8, 0, 8];
  return (
    <group position={[57, 0, 5]}>
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <boxGeometry args={[25, 0.7, 15]} />
        <meshStandardMaterial color="#161c27" roughness={0.65} metalness={0.25} />
      </mesh>

      {bays.map((x, index) => (
        <group key={`project-bay-${x}`} position={[x, 0, 0]}>
          <mesh position={[0, 3.5, -5.7]} castShadow>
            <boxGeometry args={[6.5, 7, 0.5]} />
            <meshStandardMaterial color="#202838" metalness={0.5} roughness={0.45} />
          </mesh>
          <mesh position={[0, 3.6, -5.4]}>
            <planeGeometry args={[5.2, 4.8]} />
            <meshStandardMaterial
              color={index === 0 ? '#fb7185' : index === 1 ? '#38bdf8' : '#f59e0b'}
              emissive={index === 0 ? '#be123c' : index === 1 ? '#0284c7' : '#b45309'}
              emissiveIntensity={0.65}
            />
          </mesh>
          <mesh position={[0, 7.1, -5.7]}>
            <boxGeometry args={[6.8, 0.18, 0.62]} />
            <meshBasicMaterial color={index === 0 ? '#fb7185' : index === 1 ? '#38bdf8' : '#f59e0b'} />
          </mesh>
          <mesh position={[0, 1.35, 0]} castShadow>
            <boxGeometry args={[3.8, 0.25, 6.8]} />
            <meshStandardMaterial color="#30394b" roughness={0.35} metalness={0.65} />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <boxGeometry args={[2.8, 0.08, 4.8]} />
            <meshBasicMaterial color={index === 0 ? '#fb7185' : index === 1 ? '#38bdf8' : '#f59e0b'} />
          </mesh>
        </group>
      ))}

      {[-12, 12].map((x) => (
        <group key={`garage-gantry-${x}`} position={[x, 4.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 9, 15.5]} />
            <meshStandardMaterial color="#384152" metalness={0.8} roughness={0.28} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 8.8, 0]} castShadow>
        <boxGeometry args={[25, 0.7, 0.7]} />
        <meshStandardMaterial color="#465064" metalness={0.8} roughness={0.25} />
      </mesh>
      <pointLight position={[0, 6, 3]} intensity={2.1} distance={22} color="#f97316" />
    </group>
  );
}

function ExperimentKineticLab() {
  const outer = useRef<THREE.Mesh>(null);
  const middle = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outer.current) outer.current.rotation.set(t * 0.2, t * 0.32, 0.2);
    if (middle.current) middle.current.rotation.set(0.9, -t * 0.48, t * 0.24);
    if (inner.current) inner.current.rotation.set(t * -0.36, 0.4, t * 0.52);
  });

  return (
    <group position={[-57, 0, 4]}>
      <mesh position={[0, 0.45, 0]} receiveShadow>
        <cylinderGeometry args={[10, 11, 0.9, 12]} />
        <meshStandardMaterial color="#1b1830" roughness={0.55} metalness={0.45} />
      </mesh>
      <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.8, 8.15, 48]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      <group position={[0, 6.2, 0]}>
        <mesh ref={outer}>
          <torusGeometry args={[5.2, 0.16, 16, 96]} />
          <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={1.15} metalness={0.65} />
        </mesh>
        <mesh ref={middle}>
          <torusGeometry args={[3.9, 0.13, 16, 96]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={1.15} metalness={0.65} />
        </mesh>
        <mesh ref={inner}>
          <torusGeometry args={[2.6, 0.11, 16, 96]} />
          <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={1.25} metalness={0.6} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshStandardMaterial color="#f5f3ff" emissive="#c084fc" emissiveIntensity={1.8} roughness={0.2} metalness={0.35} />
        </mesh>
      </group>
      <pointLight position={[0, 6, 0]} intensity={2.8} distance={24} color="#a855f7" />
    </group>
  );
}

function ContactSignalLotus() {
  const dish = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const petals = useMemo(() => Array.from({ length: 10 }, (_, index) => index), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (dish.current) dish.current.rotation.y = Math.sin(t * 0.32) * 0.55;
    if (pulse.current) {
      const scale = 1 + ((t * 0.45) % 1) * 2.8;
      pulse.current.scale.setScalar(scale);
      const material = pulse.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 0.48 - (scale - 1) * 0.16);
    }
  });

  return (
    <group position={[18, 0, -82]}>
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <cylinderGeometry args={[7.5, 8.5, 0.8, 20]} />
        <meshStandardMaterial color="#172033" metalness={0.45} roughness={0.5} />
      </mesh>

      {petals.map((index) => {
        const angle = (index / petals.length) * Math.PI * 2;
        return (
          <mesh
            key={`signal-petal-${index}`}
            position={[Math.cos(angle) * 3.2, 1.05, Math.sin(angle) * 3.2]}
            rotation={[0, -angle, -0.18]}
            castShadow
          >
            <boxGeometry args={[2.6, 0.28, 5.2]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? '#dbeafe' : '#bfdbfe'}
              emissive="#3b82f6"
              emissiveIntensity={0.22}
              metalness={0.5}
              roughness={0.28}
            />
          </mesh>
        );
      })}

      <mesh position={[0, 5.8, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.55, 9.2, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.88} roughness={0.22} />
      </mesh>

      <group ref={dish} position={[0, 8.9, 0]} rotation={[0.2, 0, -0.35]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <sphereGeometry args={[2.1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.1]} />
          <meshStandardMaterial color="#dbeafe" side={THREE.DoubleSide} metalness={0.6} roughness={0.28} />
        </mesh>
        <mesh position={[1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 2.1, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[2.2, 0, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.2} />
        </mesh>
      </group>

      <mesh ref={pulse} position={[0, 9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 1.95, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 7.5, 0]} intensity={2} distance={22} color="#38bdf8" />
    </group>
  );
}

export function DistrictLandmarks() {
  return (
    <group>
      <AboutPavilion />
      <TechPagoda />
      <ProjectLaunchGarage />
      <ExperimentKineticLab />
      <ContactSignalLotus />
    </group>
  );
}
