import { RoomServiceClient } from "livekit-server-sdk";

export function roomService() {
  const url = (process.env.LIVEKIT_URL || "http://localhost:7880").replace(/^ws/, "http");
  const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
  const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";
  return new RoomServiceClient(url, apiKey, apiSecret);
}
