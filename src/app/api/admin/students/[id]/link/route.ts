import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentClientLink } from "@/lib/ensureStudentClientLink";

// Öğrenciyi bir danışan kaydına bağlar / bağı kaldırır.
//   { clientId: "..." }  → mevcut danışana bağla
//   { create: true }     → öğrencinin bilgilerinden yeni danışan oluştur ve bağla
//   { clientId: null }   → bağı kaldır
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  try {
    await ensureStudentClientLink();

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return NextResponse.json({ error: "Öğrenci bulunamadı." }, { status: 404 });

    // Bağı kaldır
    if (body.clientId === null) {
      await prisma.student.update({ where: { id }, data: { clientId: null } });
      return NextResponse.json({ ok: true, client: null });
    }

    let clientId: string;

    if (body.create === true) {
      // Öğrencinin bilgilerinden danışan kaydı oluştur
      const created = await prisma.client.create({
        data: { name: student.name, email: student.email, phone: "", notes: "" },
      });
      clientId = created.id;
    } else if (typeof body.clientId === "string" && body.clientId) {
      const exists = await prisma.client.findUnique({ where: { id: body.clientId } });
      if (!exists) return NextResponse.json({ error: "Danışan bulunamadı." }, { status: 404 });
      // Bir danışana yalnızca bir öğrenci bağlanabilir (clientId unique)
      const taken = await prisma.student.findFirst({
        where: { clientId: body.clientId, NOT: { id } },
        select: { name: true },
      });
      if (taken) {
        return NextResponse.json(
          { error: `Bu danışan zaten ${taken.name} ile eşleşmiş.` },
          { status: 409 },
        );
      }
      clientId = body.clientId;
    } else {
      return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }

    await prisma.student.update({ where: { id }, data: { clientId } });
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, name: true, phone: true, email: true },
    });
    return NextResponse.json({ ok: true, client });
  } catch (err) {
    console.error("Student link error:", err);
    return NextResponse.json({ error: "Bağlantı kurulamadı." }, { status: 500 });
  }
}
