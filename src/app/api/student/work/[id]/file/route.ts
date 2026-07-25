import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { serveWorkFile } from "@/lib/serveWork";

// Öğrenci yalnızca KENDİ yüklediği private dosyayı görüntüleyebilir.
// Dosya Blob'dan token ile çekilip güvenli başlıklarla stream edilir.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const studentId = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user || role !== "STUDENT" || !studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await ensureStudentWorkTable();
    const work = await prisma.studentWork.findUnique({ where: { id } });
    if (!work || work.studentId !== studentId) {
      return new NextResponse("Bulunamadı", { status: 404 });
    }
    return await serveWorkFile(work.url, work.fileName);
  } catch (err) {
    console.error("Student work file error:", err);
    return new NextResponse("Hata", { status: 500 });
  }
}
