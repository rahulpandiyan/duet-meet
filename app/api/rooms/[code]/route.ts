import { NextResponse } from "next/server";
import { rooms } from "@/lib/roomStore";

export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const room = rooms.get(code.trim().toUpperCase());
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    code: room.code,
    hostName: room.hostName,
    locked: room.locked,
    maxShares: room.maxShares,
    hostOnlyShare: room.hostOnlyShare,
    blockedSharers: room.blockedSharers,
  });
}
