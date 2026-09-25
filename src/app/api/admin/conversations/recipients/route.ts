import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { messageErrorResponse, privateHeaders } from "@/lib/portalMessages";

export async function GET(req: Request) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 100);
    const students = await prisma.student.findMany({
      where: { active: true, ...(q ? { name: { contains: q, mode: "insensitive" } } : {}) },
      select: { id: true, name: true, gradeLevel: true, active: true }, orderBy: [{ name: "asc" }, { id: "asc" }], take: 31,
    });
    return NextResponse.json({ students: students.slice(0, 30), hasMore: students.length > 30 }, { headers: privateHeaders });
  } catch (error) { return messageErrorResponse(error); }
}
