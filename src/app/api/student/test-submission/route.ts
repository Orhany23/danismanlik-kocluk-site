import { NextRequest, NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTestSubmissionTable } from "@/lib/ensureTestSubmissionTable";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { getTestBySlug, scoreLikertTest, scoreCategoryTest } from "@/lib/psychTests";

// Cevaplar istemciden geliyor ama puan burada, sunucuda hesaplanır — bir
// ziyaretçi istemci tarafındaki hesaplamayı değiştirip sahte bir puanı
// admin paneline düşüremesin diye (bu puanlar gerçek klinik değerlendirmede
// kullanılacak).
export async function POST(req: NextRequest) {
  const student = await requireStudent();
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (rateLimited("test-submission", clientIp(req), 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Çok fazla gönderim. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const testSlug = String(body.testSlug ?? "");
    const test = getTestBySlug(testSlug);
    if (!test) return NextResponse.json({ error: "Test bulunamadı." }, { status: 404 });

    const rawAnswers = body.answers;
    if (!rawAnswers || typeof rawAnswers !== "object") {
      return NextResponse.json({ error: "Cevaplar eksik." }, { status: 400 });
    }
    const answers: Record<string, string> = {};
    for (const q of test.questions) {
      const value = (rawAnswers as Record<string, unknown>)[q.id];
      if (typeof value !== "string" || !value) {
        return NextResponse.json({ error: "Lütfen tüm soruları yanıtla." }, { status: 400 });
      }
      answers[q.id] = value;
    }

    await ensureTestSubmissionTable();

    if (test.kind === "likert") {
      const validValues = new Set(test.options.map((o) => String(o.value)));
      for (const v of Object.values(answers)) {
        if (!validValues.has(v)) return NextResponse.json({ error: "Geçersiz cevap." }, { status: 400 });
      }
      const numericAnswers: Record<string, number> = {};
      for (const [k, v] of Object.entries(answers)) numericAnswers[k] = Number(v);
      const { total, band } = scoreLikertTest(test, numericAnswers);
      const maxScore = test.bands[test.bands.length - 1].max;

      await prisma.testSubmission.create({
        data: {
          studentId: student.id,
          testSlug: test.slug,
          testTitle: test.title,
          answers,
          score: total,
          maxScore,
          resultLabel: band.label,
        },
      });

      return NextResponse.json({
        ok: true,
        kind: "likert",
        score: total,
        maxScore,
        band: { label: band.label, description: band.description, tone: band.tone },
      });
    }

    // kategori testi (ör. öğrenme stili)
    const validCategories = new Set(Object.keys(test.results));
    for (const v of Object.values(answers)) {
      if (!validCategories.has(v)) return NextResponse.json({ error: "Geçersiz cevap." }, { status: 400 });
    }
    const { result } = scoreCategoryTest(test, answers);
    if (!result) return NextResponse.json({ error: "Sonuç hesaplanamadı." }, { status: 400 });

    await prisma.testSubmission.create({
      data: {
        studentId: student.id,
        testSlug: test.slug,
        testTitle: test.title,
        answers,
        score: null,
        maxScore: null,
        resultLabel: result.label,
      },
    });

    return NextResponse.json({ ok: true, kind: "category", result });
  } catch (err) {
    console.error("Test submission POST error:", err);
    return NextResponse.json({ error: "Gönderim sırasında bir hata oluştu." }, { status: 500 });
  }
}
