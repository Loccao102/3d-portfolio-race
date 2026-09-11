import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';
import {
  DISTRICT_EXPERIENCES,
  TOUR_TOTAL_SECONDS,
  TOUR_TRANSITION_SECONDS,
  type DistrictExperience,
} from '@/game/features/portfolio/data/districtExperience';
import { useExperienceStore } from '@/game/features/portfolio/useExperienceStore';

interface RecruiterTourSystemProps {
  targetRef: React.RefObject<RapierRigidBody | null>;
}

type Vec3 = [number, number, number];

const TRANSIT_CONTROLS: Vec3[] = [
  [0, 0, 28],
  [0, 0, 0],
  [18, 0, -18],
  [0, 0, 0],
  [-20, 0, -36],
];

function quadraticPoint(start: Vec3, control: Vec3, end: Vec3, t: number) {
  const oneMinus = 1 - t;
  return new THREE.Vector3(
    oneMinus * oneMinus * start[0] + 2 * oneMinus * t * control[0] + t * t * end[0],
    oneMinus * oneMinus * start[1] + 2 * oneMinus * t * control[1] + t * t * end[1],
    oneMinus * oneMinus * start[2] + 2 * oneMinus * t * control[2] + t * t * end[2],
  );
}

function quadraticTangent(start: Vec3, control: Vec3, end: Vec3, t: number) {
  return new THREE.Vector3(
    2 * (1 - t) * (control[0] - start[0]) + 2 * t * (end[0] - control[0]),
    0,
    2 * (1 - t) * (control[2] - start[2]) + 2 * t * (end[2] - control[2]),
  );
}

function resolveTimeline(elapsed: number) {
  let cursor = 0;

  for (let index = 0; index < DISTRICT_EXPERIENCES.length; index += 1) {
    const district = DISTRICT_EXPERIENCES[index];
    const transitEnd = cursor + TOUR_TRANSITION_SECONDS;
    if (elapsed < transitEnd) {
      return {
        index,
        district,
        phase: 'transit' as const,
        progress: THREE.MathUtils.clamp((elapsed - cursor) / TOUR_TRANSITION_SECONDS, 0, 1),
      };
    }

    cursor = transitEnd;
    const holdEnd = cursor + district.holdSeconds;
    if (elapsed < holdEnd) {
      return {
        index,
        district,
        phase: 'hold' as const,
        progress: THREE.MathUtils.clamp((elapsed - cursor) / district.holdSeconds, 0, 1),
      };
    }
    cursor = holdEnd;
  }

  return null;
}

function getPreviousStop(index: number, initial: Vec3): Vec3 {
  if (index <= 0) return initial;
  return DISTRICT_EXPERIENCES[index - 1].stopPosition;
}

function applyDistrictState(district: DistrictExperience) {
  const game = useGameStore.getState();
  game.setActiveMilestone(district.id);
  game.markMilestoneVisited(district.id);
  game.setTargetWaypoint(district.id);
  game.setQuickViewTab(district.id);
  game.setCardOpen(false);
}

/**
 * 90-second recruiter tour.
 *
 * The same Rapier vehicle used by free drive is moved along authored approach paths.
 * PlayerVehicle yields control while tour mode is active, so there is one body and one
 * authority at a time. During district holds the camera system switches to authored shots.
 */
export function RecruiterTourSystem({ targetRef }: RecruiterTourSystemProps) {
  const elapsedRef = useRef(0);
  const initialPositionRef = useRef<Vec3>([0, 1.2, 14]);
  const wasRunningRef = useRef(false);
  const lastDistrictRef = useRef<string | null>(null);
  const lastUiSyncRef = useRef(-1);

  useFrame((_, delta) => {
    const body = targetRef.current;
    if (!body) return;

    const experience = useExperienceStore.getState();
    if (experience.mode !== 'tour') {
      wasRunningRef.current = false;
      elapsedRef.current = 0;
      lastDistrictRef.current = null;
      return;
    }

    if (!wasRunningRef.current && experience.tourStatus === 'running') {
      const position = body.translation();
      initialPositionRef.current = [position.x, Math.max(1.2, position.y), position.z];
      elapsedRef.current = experience.tourElapsed;
      wasRunningRef.current = true;
      useGameStore.getState().setCardOpen(false);
    }

    if (experience.tourStatus === 'paused' || experience.tourStatus === 'complete') {
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    if (experience.tourStatus !== 'running') return;

    elapsedRef.current = Math.min(TOUR_TOTAL_SECONDS, elapsedRef.current + Math.min(delta, 0.05));
    const timeline = resolveTimeline(elapsedRef.current);

    if (!timeline) {
      const finalDistrict = DISTRICT_EXPERIENCES[DISTRICT_EXPERIENCES.length - 1];
      const [x, , z] = finalDistrict.stopPosition;
      body.setTranslation({ x, y: 1.2, z }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      applyDistrictState(finalDistrict);
      useGameStore.getState().setVehicleSpeed(0);
      useExperienceStore.getState().setTourRuntime({
        elapsed: TOUR_TOTAL_SECONDS,
        index: DISTRICT_EXPERIENCES.length - 1,
        phase: 'hold',
        phaseProgress: 1,
        district: finalDistrict.id,
      });
      useExperienceStore.getState().completeTour();
      return;
    }

    const { index, district, phase, progress } = timeline;

    if (phase === 'transit') {
      const start = getPreviousStop(index, initialPositionRef.current);
      const end = district.stopPosition;
      const control = TRANSIT_CONTROLS[index] ?? [
        (start[0] + end[0]) / 2,
        0,
        (start[2] + end[2]) / 2,
      ];
      const eased = THREE.MathUtils.smootherstep(progress, 0, 1);
      const point = quadraticPoint(start, control, end, eased);
      const tangent = quadraticTangent(start, control, end, eased).normalize();
      const heading = Math.atan2(-tangent.x, -tangent.z);
      const half = heading / 2;

      body.setTranslation({ x: point.x, y: 1.2, z: point.z }, true);
      body.setRotation({ x: 0, y: Math.sin(half), z: 0, w: Math.cos(half) }, true);

      const derivative = quadraticTangent(start, control, end, eased);
      const estimatedSpeed = derivative.length() / TOUR_TRANSITION_SECONDS;
      body.setLinvel({ x: tangent.x * estimatedSpeed, y: 0, z: tangent.z * estimatedSpeed }, true);

      const game = useGameStore.getState();
      game.setActiveMilestone(null);
      game.setTargetWaypoint(district.id);
      game.setVehiclePos({ x: point.x, z: point.z, heading });
      game.setVehicleSpeed(Math.round(estimatedSpeed * 3.6));
      lastDistrictRef.current = null;
    } else {
      const [x, , z] = district.stopPosition;
      body.setTranslation({ x, y: 1.2, z }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      useGameStore.getState().setVehiclePos({ x, z, heading: 0 });
      useGameStore.getState().setVehicleSpeed(0);

      if (lastDistrictRef.current !== district.id) {
        applyDistrictState(district);
        lastDistrictRef.current = district.id;
      }
    }

    if (
      elapsedRef.current - lastUiSyncRef.current > 0.08 ||
      experience.tourIndex !== index ||
      experience.tourPhase !== phase
    ) {
      lastUiSyncRef.current = elapsedRef.current;
      useExperienceStore.getState().setTourRuntime({
        elapsed: elapsedRef.current,
        index,
        phase,
        phaseProgress: progress,
        district: phase === 'hold' ? district.id : null,
      });
    }
  });

  return null;
}
