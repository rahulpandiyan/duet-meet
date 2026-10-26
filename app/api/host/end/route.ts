import { NextResponse } from "next/server";
import { rooms, hostTokens } from "@/lib/roomStore";
import { roomService } from "@/lib/livekitServer";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code || "").trim().toUpperCase();
  const hostToken = String(body?.hostToken || "");
  if (!rooms.has(code) || hostTokens.get(code) !== hostToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    await roomService().deleteRoom(code);
  } catch {}
  rooms.delete(code);
  hostTokens.delete(code);
  return NextResponse.json({ ok: true });
}
