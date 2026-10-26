import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { rooms, hostTokens, genCode, genToken } from "@/lib/roomStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const hostName = (body?.hostName || "Host").toString().slice(0, 40);

  const code = genCode();
  const hostToken = genToken();
  const maxShares = Number(process.env.NEXT_PUBLIC_MAX_SCREEN_SHARES || 8);

  rooms.set(code, {
    code,
    createdAt: Date.now(),
    hostName,
    locked: false,
    maxShares,
    hostOnlyShare: false,
    blockedSharers: [],
  });
  hostTokens.set(code, hostToken);

  // Issue host access token
  const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
  const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";
  const at = new AccessToken(apiKey, apiSecret, {
    identity: `host-${hostToken.slice(0, 8)}`,
    name: hostName,
    metadata: JSON.stringify({ role: "host", name: hostName }),
  });
  at.addGrant({
    roomJoin: true,
    room: code,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  const token = await at.toJwt();

  return NextResponse.json({ code, hostToken, token, url: process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880" });
}
