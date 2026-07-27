import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentClientLink } from "@/lib/ensureStudentClientLink";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Bağ sütunu üretimde henüz yoksa ekle; eklenemezse liste yine dönsün.
  let withLink = true;
  try {
    await ensureStudentClientLink();
  } catch (err) {
    console.error("Student-client link ensure failed:", err);
    withLink = false;
  }

  const students = await prisma.student.findMany({
    // id ikincil sıralama: aynı saniyede kaydolan öğrencilerde sıra kararsız
    // kalmasın (aksi halde liste her yenilemede yer değiştirebiliyor).
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      gradeLevel: true,
      active: true,
      createdAt: true,
      ...(withLink
        ? {
            client: { select: { id: true, name: true } },
            birthYear: true,
            guardianName: true,
            guardianPhone: true,
          }
        : {}),
    },
  });

  return NextResponse.json({ students }, { headers: { "Cache-Control": "no-store" } });
}
