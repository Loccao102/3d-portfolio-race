import React from 'react';
import { Intro } from './Intro';
import { HUD } from './HUD';
import { MilestoneCard } from './MilestoneCard';
import { QuickViewModal } from './QuickViewModal';
import { MiniMap } from './MiniMap';
import { RaceHUD } from './RaceHUD';
import { MobileJoystick } from './MobileJoystick';

export const OverlayUI: React.FC = () => {
  return (
    <>
      <Intro />
      <HUD />
      <RaceHUD />
      <MilestoneCard />
      <QuickViewModal />
      <MiniMap />
      <MobileJoystick />
    </>
  );
};
