import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { clientIp, rateLimited } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    if (rateLimited("contact", clientIp(req), 5, 10 * 60 * 1000)) {
      return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, phone, subject, message, website } = body;

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ ok: false, error: "Invalid name" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.length > 5000) {
      return NextResponse.json({ ok: false, error: "Invalid message" }, { status: 400 });
    }
    if (email && (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 200)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    await prisma.message.create({
      data: {
        name: name.slice(0, 200),
        phone: String(phone ?? "").slice(0, 50),
        email: email ? String(email).slice(0, 200) : null,
        service: subject ? String(subject).slice(0, 200) : null,
        message: message.slice(0, 5000),
      },
    });

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (BOT_TOKEN && CHAT_ID) {
      const text = `Yeni İletişim Formu Mesajı\n\nAd: ${name}\nE-posta: ${email ?? "-"}\nTelefon: ${phone ?? "-"}\nKonu: ${subject ?? "-"}\nMesaj: ${message}`;
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text }),
        });
        if (!tgRes.ok) {
          console.error("Telegram error:", tgRes.status, await tgRes.text());
        }
      } catch (e) {
        console.error("Telegram fetch failed:", e);
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
