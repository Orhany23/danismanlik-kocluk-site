import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createResetToken } from "@/lib/passwordReset";
import { sendPasswordResetEmail } from "@/lib/email";

// Basit in-memory rate limit (diğer public uçlarla aynı desen)
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

// Kullanıcı var/yok bilgisini sızdırmamak için her zaman aynı genel mesaj
// döner (bkz. güvenlik raporu Y2/DÜŞÜK-1: enumeration önleme).
const GENERIC_MESSAGE =
  "Bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Geçerli bir e-posta girin." }, { status: 400 });
  }

  try {
    const origin = req.nextUrl.origin;

    const admin = await prisma.user.findUnique({ where: { email } });
    if (admin) {
      const token = await createResetToken("ADMIN", admin.id);
      const resetUrl = `${origin}/sifre-sifirla?token=${token}`;
      await sendPasswordResetEmail(admin.email, resetUrl, admin.name);
      return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
    }

    const student = await prisma.student.findUnique({ where: { email } });
    if (student && student.active) {
      const token = await createResetToken("STUDENT", student.id);
      const resetUrl = `${origin}/sifre-sifirla?token=${token}`;
      await sendPasswordResetEmail(student.email, resetUrl, student.name);
    }

    // Bulunamasa veya öğrenci pasif olsa da aynı yanıt döner.
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  } catch (err) {
    console.error("Forgot password error:", err);
    // Hata durumunda da enumeration'a yol açmamak için genel mesajla döneriz.
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  }
}
