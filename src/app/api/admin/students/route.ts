import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    },
  });

  return NextResponse.json({ students });
}
