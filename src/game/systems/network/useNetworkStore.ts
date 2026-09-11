import { create } from 'zustand';
import PartySocket from 'partysocket';
import type { PlayerMetadata, PlayerPose, ServerMessage } from '@/shared/playerProtocol';

export interface RemotePlayer extends PlayerMetadata {
  pose?: PlayerPose;
  lastUpdate: number;
}

export interface EmoteEvent {
  emoteIndex: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

interface NetworkState {
  socket: PartySocket | null;
  isConnected: boolean;
  remotePlayers: Record<string, RemotePlayer>;
  myId: string | null;
  activeEmotes: Record<string, EmoteEvent>;
  chatMessages: ChatMessage[];
  connect: (metadata: Omit<PlayerMetadata, 'id'>) => void;
  disconnect: () => void;
  sendMove: (pose: PlayerPose) => void;
  sendEmote: (emoteIndex: number) => void;
  sendChat: (text: string) => void;
}

const createMessageId = () => Math.random().toString(36).substring(2, 9);

export const useNetworkStore = create<NetworkState>((set, get) => ({
  socket: null,
  isConnected: false,
  remotePlayers: {},
  myId: null,
  activeEmotes: {},
  chatMessages: [],

  connect: (metadata) => {
    if (get().socket) return;

    const host =
      process.env.NEXT_PUBLIC_PARTYKIT_HOST ||
      process.env.PARTYKIT_HOST ||
      'localhost:1999';

    const socket = new PartySocket({ host, room: 'world-main' });

    socket.addEventListener('open', () => {
      set({ isConnected: true, myId: socket.id });
      socket.send(
        JSON.stringify({
          type: 'JOIN',
          metadata: { ...metadata, id: socket.id },
        }),
      );
    });

    socket.addEventListener('message', (event) => {
      let data: ServerMessage;
      try {
        data = JSON.parse(event.data) as ServerMessage;
      } catch {
        return;
      }

      if (data.type === 'SYNC') {
        const players: Record<string, RemotePlayer> = {};
        for (const id in data.players) {
          if (id !== socket.id) {
            players[id] = { ...data.players[id], lastUpdate: Date.now() };
          }
        }
        set({ remotePlayers: players });
        return;
      }

      if (data.type === 'PLAYER_JOINED') {
        set((state) => ({
          remotePlayers: {
            ...state.remotePlayers,
            [data.id]: { ...data.metadata, lastUpdate: Date.now() },
          },
        }));
        return;
      }

      if (data.type === 'PLAYER_LEFT') {
        set((state) => {
          const remotePlayers = { ...state.remotePlayers };
          delete remotePlayers[data.id];
          return { remotePlayers };
        });
        return;
      }

      if (data.type === 'PLAYER_MOVED') {
        set((state) => {
          const current = state.remotePlayers[data.id];
          if (!current) return state;
          return {
            remotePlayers: {
              ...state.remotePlayers,
              [data.id]: {
                ...current,
                pose: data.pose,
                lastUpdate: Date.now(),
              },
            },
          };
        });
        return;
      }

      if (data.type === 'PLAYER_EMOTE') {
        set((state) => ({
          activeEmotes: {
            ...state.activeEmotes,
            [data.id]: { emoteIndex: data.emoteIndex, timestamp: Date.now() },
          },
        }));
        return;
      }

      if (data.type === 'PLAYER_CHAT') {
        const message: ChatMessage = {
          id: createMessageId(),
          senderId: data.id,
          text: data.text,
          timestamp: Date.now(),
        };
        set((state) => ({ chatMessages: [...state.chatMessages, message].slice(-50) }));
      }
    });

    socket.addEventListener('close', () => {
      set({
        isConnected: false,
        remotePlayers: {},
        socket: null,
        myId: null,
        activeEmotes: {},
        chatMessages: [],
      });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (!socket) return;

    socket.send(JSON.stringify({ type: 'LEAVE' }));
    socket.close();
    set({
      socket: null,
      isConnected: false,
      remotePlayers: {},
      myId: null,
      activeEmotes: {},
      chatMessages: [],
    });
  },

  sendMove: (pose) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) socket.send(JSON.stringify({ type: 'MOVE', pose }));
  },

  sendEmote: (emoteIndex) => {
    const { socket, isConnected, myId } = get();
    if (!socket || !isConnected || !myId) return;

    socket.send(JSON.stringify({ type: 'EMOTE', emoteIndex }));
    set((state) => ({
      activeEmotes: {
        ...state.activeEmotes,
        [myId]: { emoteIndex, timestamp: Date.now() },
      },
    }));
  },

  sendChat: (text) => {
    const { socket, isConnected, myId } = get();
    if (!socket || !isConnected || !myId) return;

    socket.send(JSON.stringify({ type: 'CHAT', text }));
    const message: ChatMessage = {
      id: createMessageId(),
      senderId: myId,
      text,
      timestamp: Date.now(),
    };
    set((state) => ({ chatMessages: [...state.chatMessages, message].slice(-50) }));
  },
}));
