import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, isPasswordPolicyOk } from "@/lib/password";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { ensureStudentClientLink } from "@/lib/ensureStudentClientLink";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GRADE_LEVELS = new Set(["", "LGS", "YKS-Sayısal", "YKS-EA", "YKS-Sözel", "YKS-Dil", "Mezun", "Diğer"]);

export async function POST(req: NextRequest) {
  try {
    if (rateLimited("register", clientIp(req), 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
    }

    // ÖNEMLİ: Student'a dokunan ilk sorgudan ÖNCE çalışmalı. Prisma yeni
    // alanları (birthYear/guardian*) SELECT'e dahil ettiği için, sütunlar
    // eklenmeden yapılan findUnique "ColumnNotFound" ile patlıyor.
    await ensureStudentClientLink();

    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");
    const rawGrade = body.gradeLevel ? String(body.gradeLevel).slice(0, 40) : "";
    const gradeLevel = GRADE_LEVELS.has(rawGrade) && rawGrade ? rawGrade : null;
    const consent = body.guardianConsent === true;
    const birthYear = Number.parseInt(String(body.birthYear ?? ""), 10);
    const guardianName = String(body.guardianName ?? "").trim().slice(0, 120);
    const guardianPhone = String(body.guardianPhone ?? "").trim().slice(0, 50);
    const website = body.website; // honeypot

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

    // Doğum yılı → reşit mi? 18 yaş altındaysa veli adı ve telefonu zorunlu;
    // böylece onay kaydı "kim onayladı, nasıl ulaşılır" bilgisini de içerir.
    const thisYear = new Date().getFullYear();
    if (!Number.isFinite(birthYear) || birthYear < thisYear - 100 || birthYear > thisYear) {
      return NextResponse.json({ error: "Lütfen geçerli bir doğum yılı seçin." }, { status: 400 });
    }
    const isMinor = thisYear - birthYear < 18;
    if (isMinor) {
      if (guardianName.length < 3) {
        return NextResponse.json({ error: "18 yaş altı kayıtlarda veli adı soyadı gerekli." }, { status: 400 });
      }
      if (guardianPhone.replace(/\D/g, "").length < 10) {
        return NextResponse.json({ error: "18 yaş altı kayıtlarda veli telefonu gerekli." }, { status: 400 });
      }
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
        birthYear,
        guardianName: isMinor ? guardianName : null,
        guardianPhone: isMinor ? guardianPhone : null,
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
