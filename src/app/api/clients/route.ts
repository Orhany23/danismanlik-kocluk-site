import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(clients);
}

// Telefonu karşılaştırmak için sadeleştirir: boşluk/parantez/tire vb. atılır,
// ülke kodu farkı ("+90 532…" ile "0532…") aynı sayılsın diye son 10 hane alınır.
function phoneKey(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 50) : "";
    const notes = typeof body.notes === "string" ? body.notes.slice(0, 4000) : "";

    if (name.length < 2) {
      return NextResponse.json({ error: "Danışan adı gerekli." }, { status: 400 });
    }

    // Aynı kişi için tekrar tekrar kayıt açılmasın (randevu ekranı her seferinde
    // bu ucu çağırıyordu ve danışan listesi kopyalarla doluyordu).
    // Önce telefonla, sonra e-postayla mevcut kaydı ara.
    const key = phoneKey(phone);
    let existing = null;
    if (key.length >= 7) {
      const candidates = await prisma.client.findMany({
        where: { phone: { not: "" } },
        select: { id: true, name: true, email: true, phone: true, notes: true },
      });
      existing = candidates.find((c) => phoneKey(c.phone) === key) ?? null;
    }
    if (!existing && email) {
      existing = await prisma.client.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { id: true, name: true, email: true, phone: true, notes: true },
      });
    }

    if (existing) {
      // Eksik alanları tamamla; dolu olanları ezme.
      const patch: { email?: string; phone?: string } = {};
      if (!existing.email && email) patch.email = email;
      if (!existing.phone && phone) patch.phone = phone;
      const client = Object.keys(patch).length
        ? await prisma.client.update({ where: { id: existing.id }, data: patch })
        : await prisma.client.findUnique({ where: { id: existing.id } });
      return NextResponse.json(client, { status: 200 });
    }

    const client = await prisma.client.create({
      data: { name, email, phone, notes },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (err) {
    console.error("Client POST error:", err);
    return NextResponse.json({ error: "Danışan kaydedilemedi." }, { status: 500 });
  }
}
