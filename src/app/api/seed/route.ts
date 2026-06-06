import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const existing = await prisma.user.findUnique({ where: { email: "admin@danismanlik.com" } });
    if (existing) {
      return NextResponse.json({ ok: true, message: "Admin user already exists" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@danismanlik.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({ ok: true, message: "Admin user created (admin@danismanlik.com / admin123)" });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
