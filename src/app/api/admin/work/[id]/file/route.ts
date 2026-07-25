import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { serveWorkFile } from "@/lib/serveWork";

// Koç (admin) bir öğrenci çalışmasının private dosyasını görüntüler.
// Dosya Blob'dan token ile çekilip güvenli başlıklarla stream edilir.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await ensureStudentWorkTable();
    const work = await prisma.studentWork.findUnique({ where: { id } });
    if (!work) return new NextResponse("Bulunamadı", { status: 404 });
    return await serveWorkFile(work.url, work.fileName);
  } catch (err) {
    console.error("Admin work file error:", err);
    return new NextResponse("Hata", { status: 500 });
  }
}
