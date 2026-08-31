import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, isPasswordPolicyOk } from "@/lib/password";
import { clientIp, rateLimited } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GRADE_LEVELS = new Set(["", "LGS", "YKS-Sayısal", "YKS-EA", "YKS-Sözel", "YKS-Dil", "Mezun", "Diğer"]);

export async function POST(req: NextRequest) {
  try {
    if (rateLimited("register", clientIp(req), 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
    }

    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");
    const rawGrade = body.gradeLevel ? String(body.gradeLevel).slice(0, 40) : "";
    const gradeLevel = GRADE_LEVELS.has(rawGrade) && rawGrade ? rawGrade : null;
    const consent = body.guardianConsent === true;
    const website = body.website;

    if (website) return NextResponse.json({ ok: true });

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Lütfen geçerli bir ad girin." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Lütfen geçerli bir e-posta girin." }, { status: 400 });
    }
    if (!isPasswordPolicyOk(password)) {
      return NextResponse.json({ error: "Şifre 8–128 karakter olmalı." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Devam etmek için onay kutusunu işaretlemelisiniz." }, { status: 400 });
    }

    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta ile zaten bir kayıt var." }, { status: 409 });
    }

    const hashed = await hashPassword(password);
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
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Bu e-posta ile zaten bir kayıt var." }, { status: 409 });
    }
    console.error("Student register error:", err);
    return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
