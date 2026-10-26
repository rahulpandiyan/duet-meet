import { NextResponse } from "next/server";
import { rooms, hostTokens } from "@/lib/roomStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code || "").trim().toUpperCase();
  const hostToken = String(body?.hostToken || "");
  const identity = String(body?.identity || "");
  const canShare = Boolean(body?.canShare);
  if (!rooms.has(code) || hostTokens.get(code) !== hostToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const room = rooms.get(code)!;
  if (canShare) {
    room.blockedSharers = room.blockedSharers.filter((x) => x !== identity);
  } else {
    if (!room.blockedSharers.includes(identity)) room.blockedSharers.push(identity);
  }
  return NextResponse.json({ ok: true });
}
