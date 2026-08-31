import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await prisma.session.findMany({
    include: { client: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const clientId = typeof body.clientId === "string" ? body.clientId : "";
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 200) : "";
    const date = new Date(body.date);
    const duration = Number(body.duration || 45);
    const notes = typeof body.notes === "string" ? body.notes.slice(0, 4000) : "";
    if (!clientId || !title || Number.isNaN(date.getTime()) || !Number.isFinite(duration) || duration < 1 || duration > 300) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const newSession = await prisma.session.create({
      data: { clientId, title, date, duration, notes, status: "PLANNED" },
      include: { client: { select: { id: true, name: true } } },
    });
    return NextResponse.json(newSession, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
