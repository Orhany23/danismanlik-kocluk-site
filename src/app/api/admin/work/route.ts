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
    const works = await prisma.studentWork.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      include: { student: { select: { id: true, name: true, gradeLevel: true } } },
    });
    return NextResponse.json({ works });
  } catch (err) {
    console.error("Admin work GET error:", err);
    return NextResponse.json({ works: [] });
  }
}
