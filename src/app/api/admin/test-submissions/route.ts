import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTestSubmissionTable } from "@/lib/ensureTestSubmissionTable";

// Tüm test sonuçlarını (en yeni önce) öğrenci bilgisiyle listeler.
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureTestSubmissionTable();
    const rows = await prisma.testSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      include: { student: { select: { id: true, name: true, gradeLevel: true } } },
    });
    return NextResponse.json({ submissions: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Admin test-submissions GET error:", err);
    return NextResponse.json({ submissions: [] });
  }
}
