import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { hashPassword, isPasswordPolicyOk, requireStudent } from "@/lib/auth";
import prisma from "@/lib/db";
import { clientIp, rateLimited } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const student = await requireStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (rateLimited("pw-student", clientIp(req), 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !isPasswordPolicyOk(newPassword)) {
      return NextResponse.json({ error: "Yeni şifre 8–128 karakter olmalı." }, { status: 400 });
    }

    const row = await prisma.student.findUnique({ where: { id: student.id } });
    if (!row || !row.active) {
      return NextResponse.json({ error: "Hesap bulunamadı." }, { status: 404 });
    }

    const isValid = await bcrypt.compare(String(currentPassword), row.password);
    if (!isValid) {
      return NextResponse.json({ error: "Mevcut şifre hatalı." }, { status: 400 });
    }

    const hashed = await hashPassword(newPassword);
    await prisma.student.update({ where: { id: student.id }, data: { password: hashed } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Student change-password error:", err);
    return NextResponse.json({ error: "Şifre değiştirilemedi." }, { status: 500 });
  }
}
