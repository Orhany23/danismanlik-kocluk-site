import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

// GÜVENLİK: Bu route artık SEED_SECRET olmadan çalışmaz ve şifre env'den gelir.
// Kullanım: GET /api/seed?secret=... (SEED_SECRET ve SEED_ADMIN_PASSWORD env'de tanımlı olmalı)
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not configured" },
      { status: 500 }
    );
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, message: "Admin user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name: "Admin", email, password: hashedPassword, role: "ADMIN" },
    });

    return NextResponse.json({ ok: true, message: "Admin user created" });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Seed failed" }, { status: 500 });
  }
}
