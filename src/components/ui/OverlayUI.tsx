'use client';
import React, { useEffect } from 'react';
import { Intro } from './Intro';
import { HUD } from './HUD';
import { MilestoneCard } from './MilestoneCard';
import { QuickViewModal } from './QuickViewModal';
import { MiniMap } from './MiniMap';
import { RaceHUD } from './RaceHUD';
import { MobileJoystick } from './MobileJoystick';
import { NitroOverlay } from './NitroOverlay';
import { useGameStore } from '../../stores/useGameStore';
import { useNetworkStore } from '../../stores/useNetworkStore';
import { getOrCreatePlayerProfile } from '../../data/playerProfile';

export const OverlayUI: React.FC = () => {
  const setPlayerProfile = useGameStore((state) => state.setPlayerProfile);
  const connect = useNetworkStore((state) => state.connect);
  const disconnect = useNetworkStore((state) => state.disconnect);

  useEffect(() => {
    const profile = getOrCreatePlayerProfile();
    setPlayerProfile(profile);
    
    // Connect to multiplayer server
    connect({ 
      name: profile.name,
      bodyColor: profile.bodyColor, 
      accentColor: profile.accentColor 
    });
    return () => disconnect();
  }, [setPlayerProfile, connect, disconnect]);

  return (
    <>
      <Intro />
      <HUD />
      <RaceHUD />
      <NitroOverlay />
      <MilestoneCard />
      <QuickViewModal />
      <MiniMap />
      <MobileJoystick />
    </>
  );
};
