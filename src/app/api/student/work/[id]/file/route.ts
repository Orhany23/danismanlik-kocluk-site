import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { serveWorkFile } from "@/lib/serveWork";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const student = await requireStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await ensureStudentWorkTable();
    const work = await prisma.studentWork.findUnique({ where: { id } });
    if (!work || work.studentId !== student.id) {
      return new NextResponse("Bulunamadı", { status: 404 });
    }
    return await serveWorkFile(work.url, work.fileName);
  } catch (err) {
    console.error("Student work file error:", err);
    return new NextResponse("Hata", { status: 500 });
  }
}
