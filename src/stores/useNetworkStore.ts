import { create } from 'zustand';
import PartySocket from 'partysocket';
import { PlayerMetadata, PlayerPose, ServerMessage } from '../shared/playerProtocol';

export interface RemotePlayer extends PlayerMetadata {
  pose?: PlayerPose;
  lastUpdate: number;
}

interface NetworkState {
  socket: PartySocket | null;
  isConnected: boolean;
  remotePlayers: Record<string, RemotePlayer>;
  myId: string | null;
  connect: (metadata: Omit<PlayerMetadata, 'id'>) => void;
  disconnect: () => void;
  sendMove: (pose: PlayerPose) => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  socket: null,
  isConnected: false,
  remotePlayers: {},
  myId: null,

  connect: (metadata) => {
    if (get().socket) return;

    // Use default PartyKit local port in dev (1999) or env variable for production
    const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'localhost:1999';
    
    const socket = new PartySocket({
      host,
      room: 'world-main',
    });

    socket.addEventListener('open', () => {
      set({ isConnected: true, myId: socket.id });
      // Send JOIN message immediately
      socket.send(JSON.stringify({
        type: 'JOIN',
        metadata: { ...metadata, id: socket.id }
      }));
    });

    socket.addEventListener('message', (e) => {
      const data = JSON.parse(e.data) as ServerMessage;
      const { remotePlayers } = get();

      if (data.type === 'SYNC') {
        const players: Record<string, RemotePlayer> = {};
        for (const id in data.players) {
          if (id !== socket.id) {
            players[id] = { ...data.players[id], lastUpdate: Date.now() };
          }
        }
        set({ remotePlayers: players });
      } 
      else if (data.type === 'PLAYER_JOINED') {
        set({
          remotePlayers: {
            ...remotePlayers,
            [data.id]: { ...data.metadata, lastUpdate: Date.now() }
          }
        });
      } 
      else if (data.type === 'PLAYER_LEFT') {
        const updated = { ...remotePlayers };
        delete updated[data.id];
        set({ remotePlayers: updated });
      } 
      else if (data.type === 'PLAYER_MOVED') {
        if (remotePlayers[data.id]) {
          set({
            remotePlayers: {
              ...remotePlayers,
              [data.id]: {
                ...remotePlayers[data.id],
                pose: data.pose,
                lastUpdate: Date.now()
              }
            }
          });
        }
      }
    });

    socket.addEventListener('close', () => {
      set({ isConnected: false, remotePlayers: {}, socket: null, myId: null });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.send(JSON.stringify({ type: 'LEAVE' }));
      socket.close();
      set({ socket: null, isConnected: false, remotePlayers: {}, myId: null });
    }
  },

  sendMove: (pose) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.send(JSON.stringify({ type: 'MOVE', pose }));
    }
  }
}));
