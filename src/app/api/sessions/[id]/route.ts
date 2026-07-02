import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const coachingSession = await prisma.session.findUnique({
    where: { id },
    include: { client: { select: { id: true, name: true, email: true, phone: true } } },
  });
  if (!coachingSession) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(coachingSession);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await prisma.session.update({
      where: { id },
      data: {
        title: body.title ?? undefined,
        date: body.date ? new Date(body.date) : undefined,
        duration: body.duration ?? undefined,
        status: body.status ?? undefined,
        notes: body.notes ?? undefined,
      },
      include: { client: { select: { id: true, name: true } } },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.session.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
