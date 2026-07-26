import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";

// Çalışmayı "görüldü / bekliyor" işaretler ve/veya koç dönütünü kaydeder.
// Yalnızca gönderilen alanlar güncellenir (seen ve feedback bağımsız).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data: { seen?: boolean; feedback?: string | null; feedbackAt?: Date | null } = {};
  if ("seen" in body) data.seen = body.seen === true;
  if ("feedback" in body) {
    const text = typeof body.feedback === "string" ? body.feedback.trim().slice(0, 4000) : "";
    data.feedback = text || null;
    data.feedbackAt = text ? new Date() : null;
    // Dönüt yazmak, çalışmayı görülmüş sayar.
    if (text) data.seen = true;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Güncellenecek alan yok." }, { status: 400 });
  }

  try {
    await ensureStudentWorkTable();
    const updated = await prisma.studentWork.update({
      where: { id },
      data,
      select: { seen: true, feedback: true, feedbackAt: true },
    });
    return NextResponse.json({ ok: true, ...updated });
  } catch (err) {
    console.error("Admin work PATCH error:", err);
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}

// Çalışmayı siler; yüklenmiş dosyaysa Blob'dan da kaldırır (yer açar).
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await ensureStudentWorkTable();
    const work = await prisma.studentWork.findUnique({ where: { id } });
    if (work?.url && (work.type === "FILE" || work.type === "PHOTO")) {
      try {
        await del(work.url);
      } catch (e) {
        console.error("Blob delete failed (continuing):", e);
      }
    }
    await prisma.studentWork.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin work DELETE error:", err);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}
