import React from 'react';
import { RivalRacers } from '@/game/entities/npc/RivalRacers';
import { RoadNetwork } from './RoadNetwork';

/** Owns portfolio racing gameplay: circuit visuals, lap/checkpoint sensors and NPC rivals. */
export function RacingFeature() {
  return (
    <>
      <RoadNetwork />
      <RivalRacers />
    </>
  );
}
