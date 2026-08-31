import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/db";
import { safeEqual } from "@/lib/safeEqual";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!safeEqual(secret, process.env.SEED_SECRET)) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, message: "Admin user already exists" });
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: { name: "Admin", email, password: hashedPassword, role: "ADMIN" },
    });

    return NextResponse.json({ ok: true, message: "Admin user created" });
  } catch {
    return NextResponse.json({ ok: false, error: "Seed failed" }, { status: 500 });
  }
}
