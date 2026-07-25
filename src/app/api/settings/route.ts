import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureSettingTable } from "@/lib/ensureSettingTable";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureSettingTable();
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return NextResponse.json(map, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Settings GET error:", err);
    // Tablo yoksa/okunamıyorsa panel boş alanlarla açılsın, patlamasın.
    return NextResponse.json({});
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body?.key || typeof body.key !== "string" || typeof body.value !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await ensureSettingTable();
    await prisma.setting.upsert({
      where: { key: body.key },
      update: { value: body.value },
      // id varsayılanı "main" olduğu için ikinci kayıt PK çakışmasıyla düşüyordu;
      // her ayara benzersiz id veriyoruz (id = key).
      create: { id: body.key, key: body.key, value: body.value },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Settings PUT error:", err);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
