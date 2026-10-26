import type { RoomInfo } from "./types";

// In-memory registry for MVP. Reset on server restart.
const g = globalThis as any;
if (!g.__duetRooms) g.__duetRooms = new Map<string, RoomInfo>();
if (!g.__duetHostTokens) g.__duetHostTokens = new Map<string, string>();

export const rooms: Map<string, RoomInfo> = g.__duetRooms;
export const hostTokens: Map<string, string> = g.__duetHostTokens;

export function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) out += "-";
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function genToken(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}
