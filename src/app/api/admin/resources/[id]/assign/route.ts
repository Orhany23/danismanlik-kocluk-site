import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * Bir kaynağın (genelde bir şablonun) BAĞIMSIZ BİR KOPYASINI oluşturup
 * belirtilen öğrenciye özel hale getirir. Kaynak metni tek yerde
 * (şablon kütüphanesinde) yazılır, her atamada yeniden yazılmaz;
 * kopya oluştuktan sonra şablondan bağımsızdır — şablonu sonradan
 * düzenlemek daha önce atanmış kopyaları DEĞİŞTİRMEZ (bilinçli tercih:
 * bir danışana verilmiş bilgilendirme metni geriye dönük değişmemeli).
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json().catch(() => null);
  const studentId = typeof data?.studentId === "string" ? data.studentId : "";
  if (!studentId) {
    return NextResponse.json({ error: "Öğrenci seçimi zorunludur." }, { status: 400 });
  }

  const source = await prisma.resource.findUnique({ where: { id } });
  if (!source) {
    return NextResponse.json({ error: "Kaynak bulunamadı." }, { status: 404 });
  }
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) {
    return NextResponse.json({ error: "Öğrenci bulunamadı." }, { status: 400 });
  }

  const copy = await prisma.resource.create({
    data: {
      title: source.title,
      description: source.description,
      type: source.type,
      url: source.url,
      body: source.body,
      category: source.category,
      gradeLevel: source.gradeLevel,
      studentId: student.id,
      published: true,
      pinned: false,
      isTemplate: false,
    },
    include: { student: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ resource: copy }, { status: 201 });
}
