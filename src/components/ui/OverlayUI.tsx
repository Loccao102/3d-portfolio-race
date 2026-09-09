'use client';
import React, { useEffect } from 'react';
import { Intro } from './Intro';
import { HUD } from './HUD';
import { MilestoneCard } from './MilestoneCard';
import { QuickViewModal } from './QuickViewModal';
import { MiniMap } from './MiniMap';
import { StoryHUD } from './StoryHUD';
import { RaceHUD } from './RaceHUD';
import { NitroOverlay } from './NitroOverlay';
import { MobileJoystick } from './MobileJoystick';
import { useGameStore } from '../../stores/useGameStore';
import { getOrCreatePlayerProfile } from '../../data/playerProfile';

export const OverlayUI: React.FC = () => {
  const setPlayerProfile = useGameStore((state) => state.setPlayerProfile);
  const experienceMode = useGameStore((state) => state.experienceMode);

  useEffect(() => {
    const profile = getOrCreatePlayerProfile();
    setPlayerProfile(profile);
  }, [setPlayerProfile]);

  return (
    <>
      <Intro />
      <HUD />
      {experienceMode === 'race' ? <RaceHUD /> : <StoryHUD />}
      <NitroOverlay />
      <MilestoneCard />
      <QuickViewModal />
      <MiniMap />
      <MobileJoystick />
    </>
  );
};
