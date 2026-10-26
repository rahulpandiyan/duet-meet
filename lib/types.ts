export type Role = "host" | "participant";

export interface RoomInfo {
  code: string;
  createdAt: number;
  hostName: string;
  locked: boolean;
  maxShares: number;
  hostOnlyShare: boolean;
  blockedSharers: string[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  identity: string;
  text: string;
  ts: number;
}

export interface ParticipantMeta {
  role: Role;
  name: string;
}
