import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ensureTestimonialTable } from "@/lib/ensureTestimonialTable";

// Ad görünüm tercihine göre gösterilecek adı üretir.
// INITIALS: "Elif Kaya" -> "E. K." (her kelimenin ilk harfi + nokta)
function displayName(name: string, pref: string): string {
  if (pref !== "INITIALS") return name;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toLocaleUpperCase("tr-TR")}.`)
    .join(" ");
  return initials || name;
}

// HERKESE AÇIK uç — yalnızca onaylı yorumlar; kimlik alanları (id/email/studentId)
// ASLA dönmez. Herhangi bir DB hatasında site bozulmasın diye boş liste döner.
export async function GET() {
  try {
    await ensureTestimonialTable();
    const rows = await prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        rating: true,
        text: true,
        displayPref: true,
        createdAt: true,
        student: { select: { name: true, gradeLevel: true } },
      },
    });

    const items = rows.map((r) => ({
      name: displayName(r.student.name, r.displayPref),
      gradeLevel: r.student.gradeLevel ?? null,
      rating: r.rating,
      text: r.text,
      date: r.createdAt.toISOString(),
    }));

    return NextResponse.json(
      { items },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch (err) {
    console.error("Public testimonials GET error:", err);
    return NextResponse.json({ items: [] });
  }
}
