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
}

export interface PlayerMetadata {
  id: string;
  bodyColor: string;
  accentColor: string;
}

export type ClientMessage =
  | { type: 'JOIN'; metadata: PlayerMetadata }
  | { type: 'MOVE'; pose: PlayerPose }
  | { type: 'LEAVE' };

export type ServerMessage =
  | { type: 'SYNC'; players: Record<string, PlayerMetadata & { pose?: PlayerPose }> }
  | { type: 'PLAYER_JOINED'; id: string; metadata: PlayerMetadata }
  | { type: 'PLAYER_LEFT'; id: string }
  | { type: 'PLAYER_MOVED'; id: string; pose: PlayerPose };
