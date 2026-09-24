import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { sendContactReplyEmail } from "@/lib/email";
import { ensureMessageReplySchema } from "@/lib/ensureMessageReplySchema";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureMessageReplySchema();
    const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(messages, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Mesajlar alınamadı." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureMessageReplySchema();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Mesaj kimliği gerekli." }, { status: 400 });
    return NextResponse.json(await prisma.message.update({ where: { id }, data: { read: true } }));
  } catch (error) {
    console.error("Message PATCH error:", error);
    return NextResponse.json({ error: "Mesaj güncellenemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (rateLimited("message-reply", clientIp(req), 30, 15 * 60 * 1000))
    return NextResponse.json({ error: "Çok fazla yanıt isteği." }, { status: 429 });

  try {
    await ensureMessageReplySchema();
    const body = await req.json();
    const id = String(body.id ?? "");
    const reply = String(body.reply ?? "").trim();
    if (!id || reply.length < 2 || reply.length > 5000)
      return NextResponse.json({ error: "Yanıt 2–5000 karakter olmalı." }, { status: 400 });

    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) return NextResponse.json({ error: "Mesaj bulunamadı." }, { status: 404 });
    if (!message.email) return NextResponse.json({ error: "Bu mesajda e-posta adresi yok." }, { status: 400 });

    await sendContactReplyEmail(message.email, message.name, message.message, reply);
    const updated = await prisma.message.update({
      where: { id },
      data: { read: true, reply, repliedAt: new Date() },
    });
    return NextResponse.json({ ok: true, message: updated });
  } catch (error) {
    console.error("Message reply error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Yanıt gönderilemedi." },
      { status: 500 }
    );
  }
}
