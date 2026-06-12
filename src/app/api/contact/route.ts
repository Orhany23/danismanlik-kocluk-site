import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Basit in-memory rate limit (Vercel'de instance başına çalışır; sıfır maliyetli ilk savunma)
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 dk
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count++;
  return rec.count > MAX_HITS;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, phone, subject, message, website } = body;

    // Honeypot: gerçek kullanıcılar "website" alanını görmez/doldurmaz
    if (website) {
      return NextResponse.json({ ok: true }); // botu sessizce yut
    }

    if (!name || typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ ok: false, error: "Invalid name" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.length > 5000) {
      return NextResponse.json({ ok: false, error: "Invalid message" }, { status: 400 });
    }

    // 1) Önce veritabanına kaydet — Telegram düşse bile mesaj kaybolmaz
    await prisma.message.create({
      data: {
        name: name.slice(0, 200),
        phone: String(phone ?? "").slice(0, 50),
        email: email ? String(email).slice(0, 200) : null,
        service: subject ? String(subject).slice(0, 200) : null,
        message: message.slice(0, 5000),
      },
    });

    // 2) Telegram bildirimi (best-effort)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (BOT_TOKEN && CHAT_ID) {
      const text = `Yeni İletişim Formu Mesajı\n\nAd: ${name}\nE-posta: ${email ?? "-"}\nTelefon: ${phone ?? "-"}\nKonu: ${subject ?? "-"}\nMesaj: ${message}`;
      // parse_mode kullanılmıyor: kullanıcı girdisi Markdown injection yapamasın
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
