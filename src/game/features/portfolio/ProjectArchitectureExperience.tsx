import React, { useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { projectsData } from '@/data/projects';
import { useGameStore } from '@/stores/useGameStore';
import { getProjectEngineeringStory, type ArchitectureNodeKind } from './data/projectCaseStudy';

const NODE_COLORS: Record<ArchitectureNodeKind, string> = {
  client: '#60a5fa',
  gateway: '#22d3ee',
  service: '#10b981',
  realtime: '#a78bfa',
  queue: '#f59e0b',
  data: '#f472b6',
  external: '#94a3b8',
};

const NODE_POSITIONS: Array<[number, number, number]> = [
  [-4.5, 1.7, 0],
  [-1.5, 3.2, 0],
  [1.5, 3.2, 0],
  [4.5, 1.7, 0],
  [1.5, 0.2, 0],
  [-1.5, 0.2, 0],
  [0, -1.2, 0],
];

function Connection({ start, end, color }: { start: THREE.Vector3; end: THREE.Vector3; color: string }) {
  const geometry = useMemo(() => {
    const direction = end.clone().sub(start);
    const length = direction.length();
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const geo = new THREE.CylinderGeometry(0.025, 0.025, length, 6);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize(),
    );
    geo.applyQuaternion(quaternion);
    geo.translate(midpoint.x, midpoint.y, midpoint.z);
    return geo;
  }, [start, end]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </mesh>
  );
}

export function ProjectArchitectureExperience() {
  const activeMilestone = useGameStore((state) => state.activeMilestone);
  const selectedProjectId = useGameStore((state) => state.selectedProjectId);
  const rootRef = useRef<THREE.Group>(null);
  const project = projectsData.find((item) => item.id === selectedProjectId) ?? projectsData[0];
  const story = getProjectEngineeringStory(project);

  const positions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    story.architecture.forEach((node, index) => {
      const p = NODE_POSITIONS[index] ?? [0, -1.2 - index, 0];
      map.set(node.id, new THREE.Vector3(p[0], p[1], p[2]));
    });
    return map;
  }, [story]);

  useFrame(({ clock }) => {
    if (!rootRef.current) return;
    rootRef.current.position.y = 4.5 + Math.sin(clock.getElapsedTime() * 0.8) * 0.08;
  });

  if (activeMilestone !== 'projects') return null;

  return (
    <group ref={rootRef} position={[52, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0.8, -0.55]}>
        <boxGeometry args={[12.2, 7.5, 0.18]} />
        <meshStandardMaterial color="#050a12" transparent opacity={0.82} roughness={0.28} metalness={0.72} />
      </mesh>
      <mesh position={[0, 0.8, -0.43]}>
        <planeGeometry args={[11.7, 7]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.035} />
      </mesh>

      {story.edges.map((edge, index) => {
        const start = positions.get(edge.from);
        const end = positions.get(edge.to);
        if (!start || !end) return null;
        return <Connection key={`${edge.from}-${edge.to}-${index}`} start={start} end={end} color={project.color} />;
      })}

      {story.architecture.map((node, index) => {
        const pos = positions.get(node.id) ?? new THREE.Vector3();
        const color = NODE_COLORS[node.kind];
        return (
          <group key={node.id} position={[pos.x, pos.y, pos.z]}>
            <mesh castShadow>
              <boxGeometry args={[1.65, 0.82, 0.32]} />
              <meshStandardMaterial color="#0b1220" emissive={color} emissiveIntensity={0.18} metalness={0.62} roughness={0.28} />
            </mesh>
            <mesh position={[0, -0.34, 0.18]}>
              <boxGeometry args={[1.35, 0.05, 0.03]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <Html center position={[0, 0, 0.22]} distanceFactor={18} className="pointer-events-none select-none">
              <div className="w-[92px] text-center">
                <div className="text-[8px] font-black uppercase tracking-[0.08em] text-white">{node.label}</div>
                <div className="mt-0.5 text-[6px] leading-tight text-slate-400">{node.detail}</div>
              </div>
            </Html>
          </group>
        );
      })}

      <Html center position={[0, 5.0, 0]} distanceFactor={18} className="pointer-events-none select-none">
        <div className="min-w-[260px] rounded-xl border border-white/10 bg-slate-950/85 px-4 py-2 text-center backdrop-blur-md">
          <div className="text-[8px] font-black uppercase tracking-[0.24em]" style={{ color: project.color }}>SYSTEM MAP</div>
          <div className="mt-1 text-[9px] font-bold text-white">{project.title}</div>
        </div>
      </Html>
    </group>
  );
}
