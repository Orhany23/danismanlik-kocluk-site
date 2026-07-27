import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentClientLink } from "@/lib/ensureStudentClientLink";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: { orderBy: { date: "desc" } },
      sessions: { orderBy: { date: "desc" } },
    },
  });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Bağlı portal hesabı ve son çalışmaları — tek ekranda kişinin tamamı görünsün.
  // Bağ sütunu/tabloları henüz yoksa detay sayfası yine açılsın diye güvenli alınır.
  let student = null;
  try {
    await ensureStudentClientLink();
    await ensureStudentWorkTable();
    student = await prisma.student.findFirst({
      where: { clientId: id },
      select: {
        id: true, name: true, email: true, gradeLevel: true, active: true,
        works: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, type: true, title: true, seen: true, feedback: true, createdAt: true },
        },
        _count: { select: { works: true, resources: true } },
      },
    });
  } catch (err) {
    console.error("Client detail student lookup failed:", err);
  }

  return NextResponse.json({ ...client, student }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const client = await prisma.client.update({
      where: { id },
      data: { name: body.name, email: body.email, phone: body.phone, notes: body.notes },
    });
    return NextResponse.json(client);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
