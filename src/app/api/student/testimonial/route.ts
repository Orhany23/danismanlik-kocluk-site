import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTestimonialTable } from "@/lib/ensureTestimonialTable";

// Basit in-memory rate limit (register/route.ts deseni)
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count++;
  return rec.count > MAX_HITS;
}

const DISPLAY_PREFS = ["NAME", "INITIALS"];

// Giriş yapmış öğrencinin kendi yorumunu getirir
export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const studentId = (session?.user as { id?: string } | undefined)?.id;

  if (!session?.user || role !== "STUDENT" || !studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureTestimonialTable();
    const testimonial = await prisma.testimonial.findUnique({
      where: { studentId },
      select: { rating: true, text: true, displayPref: true, status: true },
    });
    return NextResponse.json({ testimonial: testimonial ?? null });
  } catch (err) {
    console.error("Student testimonial GET error:", err);
    return NextResponse.json({ error: "Yorum getirilemedi." }, { status: 500 });
  }
}

// Öğrenci yorum oluşturur/günceller (upsert). Her gönderim onay bekler.
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const studentId = (session?.user as { id?: string } | undefined)?.id;

  if (!session?.user || role !== "STUDENT" || !studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }

    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Lütfen 1 ile 5 arasında bir puan seçin." }, { status: 400 });
    }

    const text = String(body.text ?? "").trim();
    if (text.length < 20 || text.length > 600) {
      return NextResponse.json({ error: "Yorum en az 20, en fazla 600 karakter olmalı." }, { status: 400 });
    }
    if (/https?:\/\//i.test(text)) {
      return NextResponse.json({ error: "Yorumda bağlantı paylaşılamaz." }, { status: 400 });
    }

    const displayPref = String(body.displayPref ?? "");
    if (!DISPLAY_PREFS.includes(displayPref)) {
      return NextResponse.json({ error: "Geçersiz görünüm tercihi." }, { status: 400 });
    }

    await ensureTestimonialTable();

    // Her gönderim/düzenleme yeniden onaya düşer (status PENDING)
    await prisma.testimonial.upsert({
      where: { studentId },
      create: { studentId, rating, text, displayPref, status: "PENDING" },
      update: { rating, text, displayPref, status: "PENDING" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Student testimonial POST error:", err);
    return NextResponse.json({ error: "Yorum kaydedilemedi." }, { status: 500 });
  }
}
