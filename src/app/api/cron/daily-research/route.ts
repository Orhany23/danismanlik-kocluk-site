import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getDailyStudy, getStudyByIndex } from "@/lib/dailyResearch";

const CATEGORY = "Günün Araştırması";

// Her gün Vercel Cron tarafından çağrılır (vercel.json'daki tanım).
// Havuzdaki klasik psikoloji araştırmalarından günün kaydını seçer ve
// öğrenci kütüphanesindeki tek "Günün Araştırması" kartını günceller.
export async function GET(req: NextRequest) {
  // Yetki: Vercel Cron "Authorization: Bearer CRON_SECRET" başlığı gönderir.
  // Elle tetikleme için ?secret= de kabul edilir.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET tanımlı değil. Vercel ortam değişkenlerine ekleyin." },
      { status: 503 }
    );
  }
  const auth = req.headers.get("authorization");
  const qs = req.nextUrl.searchParams.get("secret");
  if (auth !== `Bearer ${secret}` && qs !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Gün-of-year'a göre deterministik seçim (test için ?index= ile ezilebilir)
    const override = req.nextUrl.searchParams.get("index");
    const { study: s, index: idx } =
      override !== null && !Number.isNaN(Number(override))
        ? getStudyByIndex(Number(override))
        : getDailyStudy();

    const title = `Günün Araştırması: ${s.t}`;
    const description = `${s.r} · ${s.y}`;
    const body = `${s.s}\n\nAraştırmanın Amacı\n${s.a}\n\nYöntem ve Denekler\n${s.m}\n\nBulgular ve Sonuç\n${s.f}\n\nPsikolojik Yorum\n${s.p}\n\nKaynak: ${s.u}`;

    // Kütüphanede tek kart tutulur: varsa güncelle, yoksa oluştur
    const existing = await prisma.resource.findFirst({
      where: { category: CATEGORY, studentId: null },
    });

    const resource = existing
      ? await prisma.resource.update({
          where: { id: existing.id },
          data: { title, description, body, type: "NOTE", url: null, published: true, pinned: true, gradeLevel: null },
        })
      : await prisma.resource.create({
          data: { title, description, body, type: "NOTE", category: CATEGORY, published: true, pinned: true },
        });

    return NextResponse.json(
      { ok: true, index: idx, title: resource.title },
      { headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (err) {
    console.error("daily-research cron error:", err);
    return NextResponse.json({ error: "Günün araştırması güncellenemedi." }, { status: 500 });
  }
}
