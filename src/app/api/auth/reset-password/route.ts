import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { consumeResetToken } from "@/lib/passwordReset";
import { hashPassword, isPasswordPolicyOk, PASSWORD_MAX } from "@/lib/password";
import { clientIp, rateLimited } from "@/lib/rateLimit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 10;

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimited("reset-password", ip, MAX_HITS, WINDOW_MS)) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const token = String(body?.token ?? "");
  const password = String(body?.password ?? "");

  if (!token) {
    return NextResponse.json({ error: "Geçersiz bağlantı." }, { status: 400 });
  }

  if (!isPasswordPolicyOk(password)) {
    return NextResponse.json(
      { error: `Şifre 8-${PASSWORD_MAX} karakter arasında olmalı.` },
      { status: 400 },
    );
  }

  try {
    const result = await consumeResetToken(token);
    if (!result) {
      return NextResponse.json(
        { error: "Bağlantının süresi dolmuş veya daha önce kullanılmış. Yeniden talep edin." },
        { status: 400 },
      );
    }

    const hashed = await hashPassword(password);

    if (result.userType === "ADMIN") {
      await prisma.user.update({
        where: { id: result.userId },
        data: { password: hashed },
      });
      return NextResponse.json({ ok: true, loginUrl: "/admin/login" });
    }

    if (result.userType === "STUDENT") {
      const student = await prisma.student.findUnique({ where: { id: result.userId } });
      if (!student || !student.active) {
        return NextResponse.json(
          { error: "Hesap bulunamadı veya pasif." },
          { status: 400 },
        );
      }

      await prisma.student.update({
        where: { id: result.userId },
        data: { password: hashed },
      });
      return NextResponse.json({ ok: true, loginUrl: "/ogrenci/giris" });
    }

    return NextResponse.json({ error: "Geçersiz bağlantı." }, { status: 400 });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Şifre sıfırlanamadı. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
