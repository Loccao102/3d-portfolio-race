'use client';
import React, { useEffect } from 'react';
import { DistrictProgress } from './DistrictProgress';
import { DistrictExperienceHUD } from './DistrictExperienceHUD';
import { RecruiterTourHUD } from './RecruiterTourHUD';
import { ProjectCaseStudyHUD } from './ProjectCaseStudyHUD';
import { MultiplayerPresenceHUD } from './MultiplayerPresenceHUD';
import { Intro } from './Intro';
import { HUD } from './HUD';
import { MilestoneCard } from './MilestoneCard';
import { QuickViewModal } from './QuickViewModal';
import { MiniMap } from './MiniMap';
import { RaceHUD } from './RaceHUD';
import { NitroOverlay } from './NitroOverlay';
import { MobileJoystick } from './MobileJoystick';
import { useGameStore } from '../../stores/useGameStore';
import { getOrCreatePlayerProfile } from '../../data/playerProfile';

export const OverlayUI: React.FC = () => {
  const setPlayerProfile = useGameStore((state) => state.setPlayerProfile);

  useEffect(() => {
    const profile = getOrCreatePlayerProfile();
    setPlayerProfile(profile);
  }, [setPlayerProfile]);

  return (
    <>
      <Intro />
      <HUD />
      <DistrictProgress />
      <DistrictExperienceHUD />
      <RecruiterTourHUD />
      <ProjectCaseStudyHUD />
      <MultiplayerPresenceHUD />
      <RaceHUD />
      <NitroOverlay />
      <MilestoneCard />
      <QuickViewModal />
      <MiniMap />
      <MobileJoystick />
    </>
  );
};
