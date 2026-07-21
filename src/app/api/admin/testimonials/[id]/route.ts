import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTestimonialTable } from "@/lib/ensureTestimonialTable";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return session && role === "ADMIN";
}

const STATUSES = ["APPROVED", "REJECTED", "PENDING"];

// Yorumu onayla/reddet
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json().catch(() => ({}));

  if (typeof data.status !== "string" || !STATUSES.includes(data.status)) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  try {
    await ensureTestimonialTable();
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { status: data.status },
      include: { student: { select: { id: true, name: true, email: true, gradeLevel: true } } },
    });
    return NextResponse.json({ testimonial });
  } catch (err) {
    console.error("Admin testimonial PATCH error:", err);
    return NextResponse.json({ error: "Yorum güncellenemedi." }, { status: 500 });
  }
}

// Yorumu sil
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    await ensureTestimonialTable();
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin testimonial DELETE error:", err);
    return NextResponse.json({ error: "Yorum silinemedi." }, { status: 500 });
  }
}
