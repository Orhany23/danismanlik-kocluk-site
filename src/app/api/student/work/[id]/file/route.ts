import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";

// Öğrenci yalnızca KENDİ yüklediği private dosyayı görüntüleyebilir.
// Dosya Blob'dan sunucu tarafında (token ile) çekilir ve stream edilir.
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
    if (!work || work.studentId !== studentId || !work.url) {
      return new NextResponse("Bulunamadı", { status: 404 });
    }
    const res = await get(work.url, { access: "private" });
    if (!res || res.statusCode !== 200) return new NextResponse("Bulunamadı", { status: 404 });
    return new Response(res.stream, {
      headers: {
        "Content-Type": res.blob.contentType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(work.fileName || "dosya")}"`,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("Student work file error:", err);
    return new NextResponse("Hata", { status: 500 });
  }
}
