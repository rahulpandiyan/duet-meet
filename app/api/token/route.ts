import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { rooms, hostTokens } from "@/lib/roomStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = (body?.code || "").toString().trim().toUpperCase();
  const name = (body?.name || "Guest").toString().slice(0, 40);
  const hostToken = body?.hostToken ? String(body.hostToken) : null;

  const room = rooms.get(code);
  if (!room) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }
  if (room.locked) {
    // allow host to still join
    const isHostAttempt = hostToken && hostTokens.get(code) === hostToken;
    if (!isHostAttempt) {
      return NextResponse.json({ error: "Meeting is locked" }, { status: 403 });
    }
  }

  const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
  const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";

  let isHost = false;
  let identity = `p-${Math.random().toString(36).slice(2, 10)}`;
  if (hostToken && hostTokens.get(code) === hostToken) {
    isHost = true;
    identity = `host-${hostToken.slice(0, 8)}`;
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    name,
    metadata: JSON.stringify({ role: isHost ? "host" : "participant", name }),
  });
  at.addGrant({
    roomJoin: true,
    room: code,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  const token = await at.toJwt();

  return NextResponse.json({
    token,
    url: process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880",
    isHost,
    identity,
    code,
  });
}
