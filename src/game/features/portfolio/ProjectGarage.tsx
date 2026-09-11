import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../../stores/useGameStore';
import { projectsData } from '../../../data/projects';
import { isLocalVehicleObject } from '@/game/entities/player/localPhysics';
import { getProjectEngineeringStory } from './data/projectCaseStudy';

const BAY_SPACING = 8;

export const ProjectGarage: React.FC = () => {
  const setActiveMilestone = useGameStore((state) => state.setActiveMilestone);
  const setSelectedProject = useGameStore((state) => state.setSelectedProject);
  const markMilestoneVisited = useGameStore((state) => state.markMilestoneVisited);
  const selectedProjectId = useGameStore((state) => state.selectedProjectId);
  const hologramIcons = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    hologramIcons.current.forEach((icon, i) => {
      if (!icon) return;
      icon.rotation.y = t * 0.72 * (i % 2 === 0 ? 1 : -1);
      icon.position.y = 1.65 + Math.sin(t * 1.8 + i) * 0.12;
    });
  });

  return (
    <group position={[42, 0, 0]}>
      <RigidBody type="fixed">
        <CuboidCollider args={[8, 0.25, 17]} position={[4, 0.25, 0]} />
      </RigidBody>
      <mesh receiveShadow position={[4, 0.25, 0]}>
        <boxGeometry args={[16, 0.5, 34]} />
        <meshStandardMaterial color="#101726" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[-3.9, 0.51, 0]}>
        <boxGeometry args={[0.08, 0.04, 33.8]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      <group position={[-3.8, 6.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[20, 1.3, 0.16]} />
          <meshStandardMaterial color="#080c16" metalness={0.9} roughness={0.2} />
        </mesh>
        <Html center position={[0, 0, 0.12]} distanceFactor={22} className="pointer-events-none select-none">
          <div className="min-w-[280px] text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">PROJECT GARAGE</div>
            <div className="mt-1 text-[7px] uppercase tracking-[0.16em] text-slate-400">problem → architecture → trade-off → result</div>
          </div>
        </Html>
      </group>

      {projectsData.map((project, idx) => {
        const bayZ = (idx - (projectsData.length - 1) / 2) * BAY_SPACING;
        const story = getProjectEngineeringStory(project);
        const isSelected = selectedProjectId === project.id;

        return (
          <group key={project.id} position={[3.8, 0.5, bayZ]}>
            <RigidBody
              type="fixed"
              sensor
              onIntersectionEnter={({ other }) => {
                if (!isLocalVehicleObject(other.rigidBodyObject)) return;
                setActiveMilestone('projects');
                setSelectedProject(project.id);
                markMilestoneVisited('projects');
              }}
            >
              <CylinderCollider args={[2.0, 3.35]} position={[0, 1.0, 0]} />
            </RigidBody>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[2.55, 3.0, 40]} />
              <meshBasicMaterial color={project.color} transparent opacity={isSelected ? 0.95 : 0.42} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.021, 0]}>
              <circleGeometry args={[1.35, 28]} />
              <meshBasicMaterial color={project.color} transparent opacity={isSelected ? 0.24 : 0.09} />
            </mesh>

            <group
              ref={(el) => {
                hologramIcons.current[idx] = el;
              }}
              position={[0, 1.65, 0]}
            >
              {idx % 4 === 0 && (
                <group>
                  {[0, 0.45, 0.9].map((y, layer) => (
                    <mesh key={layer} position={[0, y - 0.45, 0]}>
                      <boxGeometry args={[1.2 - layer * 0.12, 0.28, 1.2 - layer * 0.12]} />
                      <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.85} wireframe />
                    </mesh>
                  ))}
                </group>
              )}
              {idx % 4 === 1 && (
                <mesh>
                  <octahedronGeometry args={[0.82, 0]} />
                  <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={1.0} wireframe />
                </mesh>
              )}
              {idx % 4 === 2 && (
                <mesh>
                  <icosahedronGeometry args={[0.84, 1]} />
                  <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.9} wireframe />
                </mesh>
              )}
              {idx % 4 === 3 && (
                <group>
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.72, 0.08, 10, 32]} />
                    <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={1.0} />
                  </mesh>
                  <mesh rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[0.48, 0.06, 10, 28]} />
                    <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.8} />
                  </mesh>
                </group>
              )}
            </group>

            <group position={[4.0, 0, 0]}>
              <mesh castShadow position={[0, 2.4, 0]}>
                <boxGeometry args={[0.35, 4.8, 0.35]} />
                <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh position={[-4.0, 4.8, 0]}>
                <boxGeometry args={[8.2, 0.3, 0.3]} />
                <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
              </mesh>
              <pointLight position={[-4.0, 4.5, 0]} intensity={isSelected ? 3.4 : 1.5} distance={8} color={project.color} />
            </group>

            <Html center position={[0, 3.45, 0]} distanceFactor={24} className="pointer-events-none select-none">
              <div className={`min-w-[132px] rounded-xl border px-3 py-2 text-center backdrop-blur-md transition ${isSelected ? 'border-white/25 bg-slate-950/92' : 'border-white/10 bg-slate-950/72'}`}>
                <div className="text-[7px] font-black uppercase tracking-[0.18em]" style={{ color: project.color }}>{project.bayNumber}</div>
                <div className="mt-1 line-clamp-2 text-[8px] font-bold leading-tight text-white">{project.title}</div>
                <div className="mt-1 text-[7px] font-black" style={{ color: project.color }}>{story.metric} <span className="font-medium text-slate-500">{story.metricLabel}</span></div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
