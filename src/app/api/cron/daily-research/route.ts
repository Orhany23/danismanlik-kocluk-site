import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import studies from "@/data/gunun-arastirmasi.json";

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
    const now = new Date();
    const start = Date.UTC(now.getUTCFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start) / 86400000);
    const override = req.nextUrl.searchParams.get("index");
    const idx =
      override !== null && !Number.isNaN(Number(override))
        ? ((Number(override) % studies.length) + studies.length) % studies.length
        : dayOfYear % studies.length;

    const s = studies[idx] as { t: string; r: string; y: string; s: string; u: string };
    const title = `Günün Araştırması: ${s.t}`;
    const body = `${s.r} (${s.y})\n\n${s.s}\n\nKaynak: ${s.u}`;

    // Kütüphanede tek kart tutulur: varsa güncelle, yoksa oluştur
    const existing = await prisma.resource.findFirst({
      where: { category: CATEGORY, studentId: null },
    });

    const resource = existing
      ? await prisma.resource.update({
          where: { id: existing.id },
          data: { title, body, type: "NOTE", url: null, published: true, pinned: true, gradeLevel: null },
        })
      : await prisma.resource.create({
          data: { title, body, type: "NOTE", category: CATEGORY, published: true, pinned: true },
        });

    return NextResponse.json({ ok: true, index: idx, title: resource.title });
  } catch (err) {
    console.error("daily-research cron error:", err);
    return NextResponse.json({ error: "Günün araştırması güncellenemedi." }, { status: 500 });
  }
}
