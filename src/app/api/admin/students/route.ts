import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentClientLink } from "@/lib/ensureStudentClientLink";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { ensureTopicProgressTable } from "@/lib/ensureTopicProgressTable";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await Promise.allSettled([ensureStudentClientLink(), ensureStudentWorkTable(), ensureTopicProgressTable()]);
    const students = await prisma.student.findMany({
      orderBy: [{ active: "desc" }, { name: "asc" }],
      select: {
        id: true, name: true, email: true, gradeLevel: true, active: true, createdAt: true,
        birthYear: true, guardianName: true, guardianPhone: true,
        client: { select: {
          id: true, name: true,
          appointments: { where: { date: { gte: new Date() }, status: { notIn: ["CANCELLED", "IPTAL"] } }, orderBy: { date: "asc" }, take: 1, select: { date: true, title: true } },
          sessions: { where: { date: { gte: new Date() }, status: "PLANNED" }, orderBy: { date: "asc" }, take: 1, select: { date: true, title: true } },
        }},
        works: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true, seen: true, feedback: true } },
        topicProgress: { select: { checkedAt: true } },
        testSubmissions: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } },
        _count: { select: { works: true, testSubmissions: true } },
      },
    });

    const now = Date.now();
    const enriched = students.map((s) => {
      const lastWork = s.works[0] ?? null;
      const checkedTopics = s.topicProgress.filter((x) => x.checkedAt).length;
      const nextCandidates = [
        ...(s.client?.appointments ?? []).map((x) => ({ ...x, kind: "Randevu" })),
        ...(s.client?.sessions ?? []).map((x) => ({ ...x, kind: "Seans" })),
      ].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const nextMeeting = nextCandidates[0] ?? null;
      const daysSinceWork = lastWork ? Math.floor((now - new Date(lastWork.createdAt).getTime()) / 86400000) : null;
      const needsAttention = s.active && (
        !lastWork || (daysSinceWork !== null && daysSinceWork >= 7) ||
        (lastWork && !lastWork.seen) ||
        (nextMeeting && new Date(nextMeeting.date).getTime() - now < 48 * 3600000)
      );
      return {
        id:s.id,name:s.name,email:s.email,gradeLevel:s.gradeLevel,active:s.active,createdAt:s.createdAt,
        birthYear:s.birthYear,guardianName:s.guardianName,guardianPhone:s.guardianPhone,
        client:s.client ? { id:s.client.id,name:s.client.name } : null,
        lastWork,lastTest:s.testSubmissions[0] ?? null,nextMeeting,
        workCount:s._count.works,testCount:s._count.testSubmissions,checkedTopics,
        daysSinceWork,needsAttention,
      };
    });

    return NextResponse.json({ students: enriched }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Student cockpit GET error:", err);
    return NextResponse.json({ students: [] });
  }
}
