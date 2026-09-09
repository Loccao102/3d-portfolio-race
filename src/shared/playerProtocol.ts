export interface PlayerPose {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  rw: number;
  speed: number;
  isReversing: boolean;
  isBoosting: boolean;
}

export interface PlayerMetadata {
  id: string;
  name: string;
  bodyColor: string;
  accentColor: string;
}

export type ClientMessage =
  | { type: 'JOIN'; metadata: PlayerMetadata }
  | { type: 'MOVE'; pose: PlayerPose }
  | { type: 'LEAVE' }
  | { type: 'EMOTE'; emoteIndex: number }
  | { type: 'CHAT'; text: string };

export type ServerMessage =
  | { type: 'SYNC'; players: Record<string, PlayerMetadata & { pose?: PlayerPose }> }
  | { type: 'PLAYER_JOINED'; id: string; metadata: PlayerMetadata }
  | { type: 'PLAYER_LEFT'; id: string }
  | { type: 'PLAYER_MOVED'; id: string; pose: PlayerPose }
  | { type: 'PLAYER_EMOTE'; id: string; emoteIndex: number }
  | { type: 'PLAYER_CHAT'; id: string; text: string };

