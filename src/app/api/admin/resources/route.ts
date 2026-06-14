import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

const TYPES = ["LINK", "VIDEO", "FILE", "NOTE"];

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return session && role === "ADMIN";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resources = await prisma.resource.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    include: { student: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ resources });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json().catch(() => null);
  if (!data || !data.title || typeof data.title !== "string") {
    return NextResponse.json({ error: "Başlık zorunludur." }, { status: 400 });
  }

  const type = TYPES.includes(data.type) ? data.type : "LINK";
  if (type !== "NOTE" && !data.url) {
    return NextResponse.json({ error: "Bağlantı (URL) zorunludur." }, { status: 400 });
  }
  if (type === "NOTE" && !data.body) {
    return NextResponse.json({ error: "Not metni zorunludur." }, { status: 400 });
  }

  const resource = await prisma.resource.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      type,
      url: type === "NOTE" ? null : data.url.trim(),
      body: type === "NOTE" ? data.body.trim() : null,
      category: data.category?.trim() || null,
      gradeLevel: data.gradeLevel?.trim() || null,
      studentId: data.studentId || null,
      published: data.published !== false,
      pinned: data.pinned === true,
    },
  });

  return NextResponse.json({ resource }, { status: 201 });
}
