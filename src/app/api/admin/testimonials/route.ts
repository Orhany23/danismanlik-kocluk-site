import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTestimonialTable } from "@/lib/ensureTestimonialTable";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return session && role === "ADMIN";
}

// Statü sıralama önceliği: PENDING önce, sonra APPROVED, sonra REJECTED
const STATUS_ORDER: Record<string, number> = { PENDING: 0, APPROVED: 1, REJECTED: 2 };

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureTestimonialTable();
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
      include: { student: { select: { id: true, name: true, email: true, gradeLevel: true } } },
    });

    // Bekleyenler üstte olacak şekilde sırala (createdAt desc korunur)
    testimonials.sort(
      (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9),
    );

    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error("Admin testimonials GET error:", err);
    return NextResponse.json({ testimonials: [] });
  }
}
