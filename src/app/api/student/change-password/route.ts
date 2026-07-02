import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// Giriş yapmış öğrencinin kendi şifresini değiştirmesi
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const studentId = (session?.user as { id?: string } | undefined)?.id;

  if (!session?.user || role !== "STUDENT" || !studentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Mevcut ve yeni şifre gerekli." }, { status: 400 });
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json({ error: "Yeni şifre en az 8 karakter olmalı." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student || !student.active) {
      return NextResponse.json({ error: "Hesap bulunamadı." }, { status: 404 });
    }

    const isValid = await bcrypt.compare(String(currentPassword), student.password);
    if (!isValid) {
      return NextResponse.json({ error: "Mevcut şifre hatalı." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(String(newPassword), 10);
    await prisma.student.update({ where: { id: studentId }, data: { password: hashed } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Student change-password error:", err);
    return NextResponse.json({ error: "Şifre değiştirilemedi." }, { status: 500 });
  }
}
