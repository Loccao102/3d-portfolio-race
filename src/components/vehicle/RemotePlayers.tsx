import React from 'react';
import { useNetworkStore } from '../../stores/useNetworkStore';
import { RemotePlayer } from './RemotePlayer';

// Cleanup stale ghosts after 15 seconds of no updates
const STALE_TIMEOUT_MS = 15000;

export const RemotePlayers: React.FC = () => {
  const remotePlayers = useNetworkStore((state) => state.remotePlayers);

  const now = Date.now();
  
  return (
    <group>
      {Object.entries(remotePlayers).map(([id, player]) => {
        // Only render players who have sent a pose and haven't timed out completely
        if (!player.pose || (now - player.lastUpdate) > STALE_TIMEOUT_MS) return null;
        
        return <RemotePlayer key={id} id={id} player={player} />;
      })}
    </group>
  );
};
