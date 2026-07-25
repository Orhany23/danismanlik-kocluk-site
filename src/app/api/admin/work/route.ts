import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";

// Tüm öğrenci çalışmalarını (en yeni önce) öğrenci bilgisiyle listeler.
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureStudentWorkTable();
    const rows = await prisma.studentWork.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      include: { student: { select: { id: true, name: true, gradeLevel: true } } },
    });
    // Dosyalar private; ham Blob URL'i istemciye verilmez. LINK dışında url
    // gizlenir; dosya varsa hasFile ile işaretlenir (admin /api/admin/work/[id]/file kullanır).
    const works = rows.map((w) => ({
      ...w,
      url: w.type === "LINK" ? w.url : null,
      hasFile: w.type === "FILE" || w.type === "PHOTO",
    }));
    return NextResponse.json({ works }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Admin work GET error:", err);
    return NextResponse.json({ works: [] });
  }
}
