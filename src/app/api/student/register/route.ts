import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

// Basit in-memory rate limit
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
    }

    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");
    const gradeLevel = body.gradeLevel ? String(body.gradeLevel).slice(0, 40) : null;
    const consent = body.guardianConsent === true;
    const website = body.website; // honeypot

    if (website) return NextResponse.json({ ok: true }); // bot

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Lütfen geçerli bir ad girin." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Lütfen geçerli bir e-posta girin." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Devam etmek için onay kutusunu işaretlemelisiniz." }, { status: 400 });
    }

    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta ile zaten bir kayıt var." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.student.create({
      data: {
        name,
        email,
        password: hashed,
        gradeLevel,
        guardianConsent: true,
        consentAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
