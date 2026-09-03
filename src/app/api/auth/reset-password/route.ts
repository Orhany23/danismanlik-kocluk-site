import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { consumeResetToken } from "@/lib/passwordReset";

const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 10;

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

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const token = String(body?.token ?? "");
  const password = String(body?.password ?? "");

  if (!token) {
    return NextResponse.json({ error: "Geçersiz bağlantı." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  }

  try {
    const result = await consumeResetToken(token);
    if (!result) {
      return NextResponse.json(
        { error: "Bağlantının süresi dolmuş veya daha önce kullanılmış. Yeniden talep edin." },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    if (result.userType === "ADMIN") {
      await prisma.user.update({ where: { id: result.userId }, data: { password: hashed } });
      return NextResponse.json({ ok: true, loginUrl: "/admin/login" });
    }

    if (result.userType === "STUDENT") {
      const student = await prisma.student.findUnique({ where: { id: result.userId } });
      if (!student || !student.active) {
        return NextResponse.json({ error: "Hesap bulunamadı veya pasif." }, { status: 400 });
      }
      await prisma.student.update({ where: { id: result.userId }, data: { password: hashed } });
      return NextResponse.json({ ok: true, loginUrl: "/ogrenci/giris" });
    }

    return NextResponse.json({ error: "Geçersiz bağlantı." }, { status: 400 });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Şifre sıfırlanamadı. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
