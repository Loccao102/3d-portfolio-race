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
import { OnlineRoster } from './OnlineRoster';

export const OverlayUI: React.FC = () => {
  const setPlayerProfile = useGameStore((state) => state.setPlayerProfile);
  const connect = useNetworkStore((state) => state.connect);
  const disconnect = useNetworkStore((state) => state.disconnect);
  const sendEmote = useNetworkStore((state) => state.sendEmote);

  useEffect(() => {
    const profile = getOrCreatePlayerProfile();
    setPlayerProfile(profile);
    
    // Connect to multiplayer server
    connect({ 
      name: profile.name,
      bodyColor: profile.bodyColor, 
      accentColor: profile.accentColor 
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '1') sendEmote(1);
      if (e.key === '2') sendEmote(2);
      if (e.key === '3') sendEmote(3);
      if (e.key === '4') sendEmote(4);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      disconnect();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setPlayerProfile, connect, disconnect, sendEmote]);

  return (
    <>
      <Intro />
      <OnlineRoster />
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
