import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return session && role === "ADMIN";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json().catch(() => ({}));

  const allowed: Record<string, unknown> = {};
  if (typeof data.published === "boolean") allowed.published = data.published;
  if (typeof data.pinned === "boolean") allowed.pinned = data.pinned;
  if (typeof data.title === "string" && data.title.trim()) allowed.title = data.title.trim();
  if (typeof data.description === "string") allowed.description = data.description.trim() || null;
  if (typeof data.category === "string") allowed.category = data.category.trim() || null;

  // Görünürlük değişikliği: null => herkese açık, id => yalnızca o öğrenci
  if ("studentId" in data) {
    if (data.studentId === null || data.studentId === "") {
      allowed.studentId = null;
    } else if (typeof data.studentId === "string") {
      const student = await prisma.student.findUnique({ where: { id: data.studentId } });
      if (!student) {
        return NextResponse.json({ error: "Öğrenci bulunamadı." }, { status: 400 });
      }
      allowed.studentId = data.studentId;
    }
  }

  // Seviye etiketi (görünürlüğü etkilemez)
  if ("gradeLevel" in data) {
    allowed.gradeLevel =
      typeof data.gradeLevel === "string" && data.gradeLevel.trim() ? data.gradeLevel.trim() : null;
  }

  const resource = await prisma.resource.update({
    where: { id },
    data: allowed,
    include: { student: { select: { id: true, name: true, email: true } } },
  });
  return NextResponse.json({ resource });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.resource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
