import React from 'react';
import { useNetworkStore } from '@/stores/useNetworkStore';
import { RemotePlayer } from './RemotePlayer';

const STALE_TIMEOUT_MS = 15_000;

/** Renders replicated visitors from the network store into the physics world. */
export function RemotePlayers() {
  const remotePlayers = useNetworkStore((state) => state.remotePlayers);
  const now = Date.now();

  return (
    <group>
      {Object.entries(remotePlayers).map(([id, player]) => {
        if (!player.pose || now - player.lastUpdate > STALE_TIMEOUT_MS) return null;
        return <RemotePlayer key={id} id={id} player={player} />;
      })}
    </group>
  );
}
