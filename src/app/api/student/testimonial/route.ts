import { NextRequest, NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTestimonialTable } from "@/lib/ensureTestimonialTable";
import { clientIp, rateLimited } from "@/lib/rateLimit";

const DISPLAY_PREFS = ["NAME", "INITIALS"];

export async function GET() {
  const student = await requireStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureTestimonialTable();
    const testimonial = await prisma.testimonial.findUnique({
      where: { studentId: student.id },
      select: { rating: true, text: true, displayPref: true, status: true },
    });
    return NextResponse.json({ testimonial: testimonial ?? null });
  } catch (err) {
    console.error("Student testimonial GET error:", err);
    return NextResponse.json({ error: "Yorum getirilemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const student = await requireStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (rateLimited("testimonial", clientIp(req), 5, 15 * 60 * 1000)) {
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

    await prisma.testimonial.upsert({
      where: { studentId: student.id },
      create: { studentId: student.id, rating, text, displayPref, status: "PENDING" },
      update: { rating, text, displayPref, status: "PENDING" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Student testimonial POST error:", err);
    return NextResponse.json({ error: "Yorum kaydedilemedi." }, { status: 500 });
  }
}
