import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

// Öğrenci hesabını askıya alır / yeniden etkinleştirir.
// active=false olan öğrenci giriş yapamaz (bkz. lib/auth.ts student provider).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data: { active?: boolean; gradeLevel?: string | null } = {};
  if ("active" in body) data.active = body.active === true;
  if ("gradeLevel" in body) {
    const g = typeof body.gradeLevel === "string" ? body.gradeLevel.trim().slice(0, 40) : "";
    data.gradeLevel = g || null;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Güncellenecek alan yok." }, { status: 400 });
  }

  try {
    const student = await prisma.student.update({
      where: { id },
      data,
      select: { id: true, active: true, gradeLevel: true },
    });
    return NextResponse.json({ ok: true, student });
  } catch (err) {
    console.error("Admin student PATCH error:", err);
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}
