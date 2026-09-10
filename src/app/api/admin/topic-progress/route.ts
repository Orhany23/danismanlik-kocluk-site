import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTopicProgressTable } from "@/lib/ensureTopicProgressTable";
import { allTopicIds } from "@/lib/curriculum";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const studentId = req.nextUrl.searchParams.get("studentId") ?? "";
  if (!studentId) return NextResponse.json({ error: "studentId gerekli." }, { status: 400 });

  try {
    await ensureTopicProgressTable();
    const rows = await prisma.topicProgress.findMany({
      where: { studentId },
      select: { topicId: true, checkedAt: true, feedback: true, feedbackAt: true },
    });
    return NextResponse.json({ progress: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Admin topic progress GET error:", err);
    return NextResponse.json({ progress: [] });
  }
}

// Koçun bir öğrencinin belirli bir konusuna yazdığı değerlendirme — öğrenci
// panelinde o konunun yanında görünür (StudentWork.feedback ile aynı desen).
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const studentId = String(body.studentId ?? "");
    const topicId = String(body.topicId ?? "");
    const feedback = String(body.feedback ?? "").trim().slice(0, 2000) || null;
    if (!studentId || !allTopicIds().has(topicId)) {
      return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }

    await ensureTopicProgressTable();
    const row = await prisma.topicProgress.upsert({
      where: { studentId_topicId: { studentId, topicId } },
      create: { studentId, topicId, feedback, feedbackAt: feedback ? new Date() : null },
      update: { feedback, feedbackAt: feedback ? new Date() : null },
    });

    return NextResponse.json({ ok: true, feedback: row.feedback, feedbackAt: row.feedbackAt });
  } catch (err) {
    console.error("Admin topic progress PATCH error:", err);
    return NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 });
  }
}
