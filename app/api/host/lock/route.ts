import { NextResponse } from "next/server";
import { rooms, hostTokens } from "@/lib/roomStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code || "").trim().toUpperCase();
  const hostToken = String(body?.hostToken || "");
  if (!rooms.has(code) || hostTokens.get(code) !== hostToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const room = rooms.get(code)!;
  if (typeof body?.locked === "boolean") room.locked = body.locked;
  if (typeof body?.hostOnlyShare === "boolean") room.hostOnlyShare = body.hostOnlyShare;
  return NextResponse.json({ ok: true, locked: room.locked, hostOnlyShare: room.hostOnlyShare });
}
