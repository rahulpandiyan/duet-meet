import { NextResponse } from "next/server";
import { rooms, hostTokens } from "@/lib/roomStore";
import { roomService } from "@/lib/livekitServer";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code || "").trim().toUpperCase();
  const hostToken = String(body?.hostToken || "");
  const identity = String(body?.identity || "");
  if (!rooms.has(code) || hostTokens.get(code) !== hostToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    await roomService().removeParticipant(code, identity);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
