import { NextRequest, NextResponse } from "next/server";
import { hashPassword, isPasswordPolicyOk, requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

// Koç, şifresini unutan öğrencinin şifresini sıfırlar.
// Sitede "şifremi unuttum" akışı (ve e-posta altyapısı) olmadığı için
// kilitlenen öğrencinin tek kurtuluş yolu budur.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (!isPasswordPolicyOk(password)) {
    return NextResponse.json({ error: "Şifre 8–128 karakter olmalı." }, { status: 400 });
  }

  try {
    const hashed = await hashPassword(password);
    await prisma.student.update({ where: { id }, data: { password: hashed } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin student password reset error:", err);
    return NextResponse.json({ error: "Şifre sıfırlanamadı." }, { status: 500 });
  }
}
