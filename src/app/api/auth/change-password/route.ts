import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { hashPassword, isPasswordPolicyOk, requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { clientIp, rateLimited } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (rateLimited("pw-admin", clientIp(req), 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !isPasswordPolicyOk(newPassword)) {
      return NextResponse.json({ error: "Yeni şifre 8–128 karakter olmalı" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(String(currentPassword), user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Mevcut şifre hatalı" }, { status: 400 });
    }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Şifre değiştirilemedi" }, { status: 500 });
  }
}
