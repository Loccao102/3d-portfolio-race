import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../../stores/useGameStore';
import { i18n } from '../../../data/i18n';
import { DistrictProps } from './AboutDistrict';
import { projectsData } from '../../../data/projects';
import { isLocalVehicleObject } from '../../vehicle/localPhysics';
import { PROJECT_GARAGE_WALL_COLLIDERS } from '../worldPlacements';

export const ProjectGarage: React.FC<DistrictProps> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const language = useGameStore((state) => state.language);
  const t = i18n[language].districts.projects;
  const setActiveMilestone = useGameStore((state) => state.setActiveMilestone);
  const setSelectedProject = useGameStore((state) => state.setSelectedProject);
  const markMilestoneVisited = useGameStore((state) => state.markMilestoneVisited);

  const rocketRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (rocketRef.current) {
      rocketRef.current.position.y = 2 + Math.sin(time * 3) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Floating Island Base */}
      <RigidBody type="fixed">
        <CuboidCollider args={[10, 0.5, 10]} position={[0, -0.5, 0]} />
        <mesh position={[0, -3, 0]} receiveShadow>
          <cylinderGeometry args={[10, 2, 6, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[10.2, 10.2, 0.4, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* Workshop / Modern Architecture mixed with nature */}
      <group position={[0, 0.2, -4]}>
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
          <boxGeometry args={[8, 4, 6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
        {/* Glass Window */}
        <mesh position={[0, 2, 3.01]}>
          <planeGeometry args={[6, 2]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Rocket / High-Tech Build Element */}
      <group ref={rocketRef} position={[6, 2, -2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.8, 3, 16]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh castShadow position={[0, 2, 0]}>
          <coneGeometry args={[0.6, 1.5, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Rocket Flame */}
        <mesh position={[0, -1.8, 0]}>
          <coneGeometry args={[0.4, 1.5, 8]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>
        <pointLight position={[0, -2, 0]} color="#f97316" intensity={2} distance={6} />
      </group>

      {/* Main Garage Interactive Bays (reusing original logic) */}
      <group position={[0, 0, 4]}>
        {projectsData.map((project, index) => {
          const xPos = index * 4.5 - 4.5; // Centers 3 projects (-4.5, 0, 4.5)
          const milestoneId = `project-${index + 1}` as any;
          return (
            <group key={project.id} position={[xPos, 0, 0]}>
              <RigidBody
                type="fixed"
                sensor
                onIntersectionEnter={({ other }) => {
                  if (isLocalVehicleObject(other.rigidBodyObject)) {
                    setActiveMilestone(milestoneId);
                    setSelectedProject(project.id);
                    markMilestoneVisited(milestoneId);
                  }
                }}
                onIntersectionExit={({ other }) => {
                  if (isLocalVehicleObject(other.rigidBodyObject)) {
                    setActiveMilestone(null);
                  }
                }}
              >
                <CuboidCollider args={[1.5, 2, 1.5]} position={[0, 2, 0]} />
              </RigidBody>
              {/* Holographic Platform */}
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[1.6, 1.8, 0.2, 16]} />
                <meshStandardMaterial color="#10b981" />
              </mesh>
            </group>
          );
        })}
      </group>

    </group>
  );
};
