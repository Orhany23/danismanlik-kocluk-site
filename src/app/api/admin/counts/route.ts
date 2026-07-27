import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { ensureTestimonialTable } from "@/lib/ensureTestimonialTable";

// Kenar çubuğundaki "bekleyen" rozetleri için sayılar.
// Her sayı ayrı ayrı güvenli alınır; biri patlarsa diğerleri yine döner.
async function safe(fn: () => Promise<number>): Promise<number> {
  try {
    return await fn();
  } catch {
    return 0;
  }
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [messages, work, testimonials] = await Promise.all([
    safe(() => prisma.message.count({ where: { read: false } })),
    safe(async () => {
      await ensureStudentWorkTable();
      return prisma.studentWork.count({ where: { seen: false } });
    }),
    safe(async () => {
      await ensureTestimonialTable();
      return prisma.testimonial.count({ where: { status: "PENDING" } });
    }),
  ]);

  return NextResponse.json(
    { messages, work, testimonials },
    { headers: { "Cache-Control": "no-store" } },
  );
}
