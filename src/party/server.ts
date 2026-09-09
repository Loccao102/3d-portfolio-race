import type * as Party from "partykit/server";
import { ClientMessage, PlayerMetadata, PlayerPose, ServerMessage } from "../shared/playerProtocol";

interface GamePlayer extends PlayerMetadata {
  pose?: PlayerPose;
  lastUpdate: number;
}

export default class RaceServer implements Party.Server {
  players: Map<string, GamePlayer> = new Map();

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // Player connected, but not officially joined yet
  }

  onClose(conn: Party.Connection) {
    if (this.players.has(conn.id)) {
      this.players.delete(conn.id);
      const msg: ServerMessage = { type: 'PLAYER_LEFT', id: conn.id };
      this.room.broadcast(JSON.stringify(msg));
    }
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const data = JSON.parse(message) as ClientMessage;

      if (data.type === 'JOIN') {
        this.players.set(sender.id, {
          ...data.metadata,
          id: sender.id,
          lastUpdate: Date.now()
        });

        // 1. Send full current state to the new player
        const state: Record<string, GamePlayer> = {};
        this.players.forEach((player, id) => {
          state[id] = player;
        });
        const syncMsg: ServerMessage = { type: 'SYNC', players: state };
        sender.send(JSON.stringify(syncMsg));

        // 2. Broadcast to everyone else that a new player joined
        const joinMsg: ServerMessage = { type: 'PLAYER_JOINED', id: sender.id, metadata: data.metadata };
        this.room.broadcast(JSON.stringify(joinMsg), [sender.id]);
      }
      else if (data.type === 'MOVE') {
        const player = this.players.get(sender.id);
        if (player) {
          player.pose = data.pose;
          player.lastUpdate = Date.now();
          
          // Broadcast movement update to others
          const moveMsg: ServerMessage = { type: 'PLAYER_MOVED', id: sender.id, pose: data.pose };
          this.room.broadcast(JSON.stringify(moveMsg), [sender.id]);
        }
      }
      else if (data.type === 'LEAVE') {
        if (this.players.has(sender.id)) {
          this.players.delete(sender.id);
          const msg: ServerMessage = { type: 'PLAYER_LEFT', id: sender.id };
          this.room.broadcast(JSON.stringify(msg));
        }
      }
    } catch (err) {
      console.error("Invalid message received:", message);
    }
  }
}

