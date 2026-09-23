import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createResetToken } from "@/lib/passwordReset";
import { sendPasswordResetEmail } from "@/lib/email";
import { clientIp, rateLimited } from "@/lib/rateLimit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;

const GENERIC_MESSAGE =
  "Bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.";

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimited("forgot-password", ip, MAX_HITS, WINDOW_MS)) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 },
    );
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

    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  }
}
