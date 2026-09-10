import { NextRequest, NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTopicProgressTable } from "@/lib/ensureTopicProgressTable";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { allTopicIds } from "@/lib/curriculum";

export async function GET() {
  const student = await requireStudent();
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureTopicProgressTable();
    const rows = await prisma.topicProgress.findMany({
      where: { studentId: student.id },
      select: { topicId: true, checkedAt: true, feedback: true, feedbackAt: true },
    });
    return NextResponse.json({ progress: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Topic progress GET error:", err);
    return NextResponse.json({ progress: [] });
  }
}

export async function POST(req: NextRequest) {
  const student = await requireStudent();
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (rateLimited("topic-progress", clientIp(req), 200, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const topicId = String(body.topicId ?? "");
    const checked = Boolean(body.checked);
    if (!allTopicIds().has(topicId)) {
      return NextResponse.json({ error: "Geçersiz konu." }, { status: 400 });
    }

    await ensureTopicProgressTable();
    const now = checked ? new Date() : null;
    await prisma.topicProgress.upsert({
      where: { studentId_topicId: { studentId: student.id, topicId } },
      create: { studentId: student.id, topicId, checkedAt: now },
      update: { checkedAt: now },
    });

    return NextResponse.json({ ok: true, topicId, checked });
  } catch (err) {
    console.error("Topic progress POST error:", err);
    return NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 });
  }
}
