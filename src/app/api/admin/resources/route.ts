import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { parseHttpUrl } from "@/lib/httpUrl";

const TYPES = ["LINK", "VIDEO", "FILE", "NOTE"];

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resources = await prisma.resource.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    include: { student: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ resources }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json().catch(() => null);
  if (!data || !data.title || typeof data.title !== "string") {
    return NextResponse.json({ error: "Başlık zorunludur." }, { status: 400 });
  }

  const title = data.title.trim().slice(0, 200);
  if (!title) {
    return NextResponse.json({ error: "Başlık zorunludur." }, { status: 400 });
  }

  const type = TYPES.includes(data.type) ? data.type : "LINK";
  let url: string | null = null;
  if (type !== "NOTE") {
    url = parseHttpUrl(data.url);
    if (!url) {
      return NextResponse.json({ error: "Geçerli bir http(s) bağlantısı zorunludur." }, { status: 400 });
    }
  }
  if (type === "NOTE" && !data.body) {
    return NextResponse.json({ error: "Not metni zorunludur." }, { status: 400 });
  }

  const resource = await prisma.resource.create({
    data: {
      title,
      description: typeof data.description === "string" ? data.description.trim().slice(0, 500) || null : null,
      type,
      url,
      body: type === "NOTE" && typeof data.body === "string" ? data.body.trim().slice(0, 20000) : null,
      category: typeof data.category === "string" ? data.category.trim().slice(0, 80) || null : null,
      gradeLevel: typeof data.gradeLevel === "string" ? data.gradeLevel.trim().slice(0, 40) || null : null,
      studentId: typeof data.studentId === "string" && data.studentId ? data.studentId : null,
      published: data.published !== false,
      pinned: data.pinned === true,
    },
  });

  return NextResponse.json({ resource }, { status: 201 });
}
