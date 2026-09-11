import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../../stores/useGameStore';
import { projectsData } from '../../../data/projects';

export const ProjectGarage: React.FC = () => {
  const setActiveMilestone = useGameStore((state) => state.setActiveMilestone);
  const setSelectedProject = useGameStore((state) => state.setSelectedProject);
  const markMilestoneVisited = useGameStore((state) => state.markMilestoneVisited);

  const hologramIcons = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    hologramIcons.current.forEach((icon, i) => {
      if (icon) {
        icon.rotation.y = t * 0.8 * (i % 2 === 0 ? 1 : -1);
        icon.position.y = 1.6 + Math.sin(t * 2.0 + i) * 0.15;
      }
    });
  });

  return (
    <group position={[42, 0, 0]}>
      {/* 1. Main Hangar Raised Platform */}
      <RigidBody type="fixed">
        <CuboidCollider args={[8, 0.25, 17]} position={[4, 0.25, 0]} />
      </RigidBody>
      <mesh receiveShadow position={[4, 0.25, 0]}>
        <boxGeometry args={[16, 0.5, 34]} />
        <meshStandardMaterial color="#101726" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Glowing Emerald Green Edge Strip */}
      <mesh position={[-3.9, 0.51, 0]}>
        <boxGeometry args={[0.08, 0.04, 33.8]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* Main Overhead Hangar Sign */}
      <group position={[-3.8, 6.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[15, 1.3, 0.16]} />
          <meshStandardMaterial color="#080c16" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[14.6, 1.1]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[10.5, 0.16, 0.02]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* 2. Three Dedicated Project Bays */}
      {projectsData.map((project, idx) => {
        const bayZ = (idx - 1) * 10.0; // Positions: Z = -10, 0, +10
        return (
          <group key={project.id} position={[3.8, 0.5, bayZ]}>
            {/* Rapier Sensor Collider for each specific project */}
            <RigidBody
              type="fixed"
              sensor
              onIntersectionEnter={({ other }) => {
                if (other.rigidBodyObject?.userData?.type === 'vehicle') {
                  setActiveMilestone('projects');
                  setSelectedProject(project.id);
                  markMilestoneVisited('projects');
                }
              }}
            >
              <CylinderCollider args={[2.0, 4.2]} position={[0, 1.0, 0]} />
            </RigidBody>

            {/* Bay Floor Markings (Concentric Glowing Rings) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[3.2, 3.7, 32]} />
              <meshBasicMaterial color={project.color} transparent opacity={0.65} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.021, 0]}>
              <circleGeometry args={[1.6, 24]} />
              <meshBasicMaterial color={project.color} transparent opacity={0.15} />
            </mesh>

            {/* Rotating 3D Holographic Project Icon */}
            <group
              ref={(el) => {
                hologramIcons.current[idx] = el;
              }}
              position={[0, 1.6, 0]}
            >
              {idx === 0 && (
                // Bay 1: Server Core Stack
                <group>
                  <mesh>
                    <boxGeometry args={[1.2, 0.35, 1.2]} />
                    <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.8} wireframe />
                  </mesh>
                  <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[1.0, 0.35, 1.0]} />
                    <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.8} wireframe />
                  </mesh>
                </group>
              )}
              {idx === 1 && (
                // Bay 2: Cyber Geometric Crystal
                <mesh>
                  <octahedronGeometry args={[0.85, 0]} />
                  <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={1.0} wireframe />
                </mesh>
              )}
              {idx === 2 && (
                // Bay 3: Node Network Matrix
                <mesh>
                  <icosahedronGeometry args={[0.85, 0]} />
                  <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.9} wireframe />
                </mesh>
              )}
            </group>

            {/* Industrial Overhead Gantry Arch & Downward Spotlight */}
            <group position={[4.0, 0, 0]}>
              <mesh castShadow position={[0, 2.4, 0]}>
                <boxGeometry args={[0.35, 4.8, 0.35]} />
                <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh position={[-4.0, 4.8, 0]}>
                <boxGeometry args={[8.2, 0.3, 0.3]} />
                <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
              </mesh>
              <pointLight
                position={[-4.0, 4.5, 0]}
                intensity={2.2}
                distance={8}
                color={project.color}
              />
            </group>

            {/* Bay Indicator Neon Label (e.g. "BAY_01") */}
            <group position={[-4.0, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2.8, 0.7, 0.06]} />
                <meshStandardMaterial color="#080c16" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0.05]}>
                <boxGeometry args={[2.2, 0.1, 0.02]} />
                <meshBasicMaterial color={project.color} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};
