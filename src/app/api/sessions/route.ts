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
    const newSession = await prisma.session.create({
      data: {
        clientId: body.clientId,
        title: body.title,
        date: new Date(body.date),
        duration: body.duration || 45,
        notes: body.notes || "",
        status: "PLANNED",
      },
      include: { client: { select: { id: true, name: true } } },
    });
    return NextResponse.json(newSession, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
