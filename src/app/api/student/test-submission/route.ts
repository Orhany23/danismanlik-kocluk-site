import { NextRequest, NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTestSubmissionTable } from "@/lib/ensureTestSubmissionTable";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { getTestBySlug, scoreLikertTest, scoreCategoryTest } from "@/lib/psychTests";

// İletişim formuyla aynı Telegram botu (bkz. api/contact/route.ts) — kendine
// zarar verme ile doğrudan ilgili bir maddeye olumlu cevap verildiğinde ya da
// yüksek riskli bir bant eşiğine ulaşıldığında danışmana anında ulaşması için.
async function notifyCrisisFlag(studentName: string, testTitle: string) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Kriz uyarısı gönderilemedi: Telegram yapılandırılmamış.");
    return;
  }
  const text = `⚠️ ACİL: Test Güvenlik Uyarısı\n\nÖğrenci: ${studentName}\nTest: ${testTitle}\n\nBu öğrencinin test sonucu, kendine zarar verme ya da yüksek risk açısından değerlendirilmesi gereken bir düzeyde. Lütfen en kısa sürede öğrenciye ulaş ve admin panelindeki test sonuçlarını incele.`;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
    if (!res.ok) console.error("Telegram kriz uyarısı hatası:", res.status, await res.text());
  } catch (e) {
    console.error("Telegram kriz uyarısı gönderilemedi:", e);
  }
}

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
      for (const q of test.questions) {
        const validValues = new Set((q.options ?? test.options).map((o) => String(o.value)));
        if (!validValues.has(answers[q.id])) {
          return NextResponse.json({ error: "Geçersiz cevap." }, { status: 400 });
        }
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

      // Kritik güvenlik durumu (ör. BDE'nin kendine zarar verme maddesi, ya
      // da BUÖ'nün yüksek riskli bant eşiği) tespit edilirse, sonucu
      // ekranda saklasak bile danışmana anında haber verilir — pasif admin
      // panelinin bunu fark etmesini beklemek riskli.
      const itemFlag = Boolean(test.crisisItemId && numericAnswers[test.crisisItemId] > 0);
      const thresholdFlag = test.crisisThreshold !== undefined && total >= test.crisisThreshold;
      const crisisFlag = itemFlag || thresholdFlag;
      if (crisisFlag) {
        await notifyCrisisFlag(student.name, test.title);
      }

      // ÖNEMLİ: band (yorum/etiket/açıklama) bilinçli olarak istemciye
      // gönderilmiyor. Öğrenci sadece ham puanını görür; yorumu danışmanlık
      // görüşmesinde Orhan Yaşlı yapar (bkz. admin panelindeki tam bant
      // bilgisi). Bu, kullanıcının kendi kendine "tanı koymasını" önler.
      return NextResponse.json({ ok: true, kind: "likert", score: total, maxScore, crisisFlag });
    }

    // kategori testi (ör. öğrenme stili) — klinik değil, koçluk amaçlı;
    // sonucu (kategori + öneriler) doğrudan öğrenciye gösterilir.
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
