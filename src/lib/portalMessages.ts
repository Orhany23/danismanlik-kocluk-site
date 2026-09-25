import { after, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ensurePortalMessageTables } from "@/lib/ensurePortalMessageTables";
import { rateLimited } from "@/lib/rateLimit";
import { notifyPortalMessage } from "@/lib/portalMessageNotifications";

export type PortalSender = "ADMIN" | "STUDENT";
const PAGE_SIZE = 50;
const messageSelect = { id: true, sender: true, body: true, createdAt: true, readAt: true } as const;
export const privateHeaders = { "Cache-Control": "private, no-store, max-age=0" };

export class MessageError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function messageErrorResponse(error: unknown) {
  // Mesaj metinlerini ya da veritabanı sorgularını günlüğe dökme.
  if (!(error instanceof MessageError)) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "unknown";
    console.error("Portal message operation failed", { type: error instanceof Error ? error.name : "unknown", code });
  }
  return NextResponse.json(
    { error: error instanceof MessageError ? error.message : "Mesaj işlemi tamamlanamadı. Lütfen tekrar dene." },
    { status: error instanceof MessageError ? error.status : 500, headers: privateHeaders },
  );
}

export async function readMessageInput(req: Request): Promise<Record<string, unknown>> {
  const origin = req.headers.get("origin");
  if (req.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(req.url).origin)) {
    throw new MessageError("Bu kaynaktan gönderime izin verilmiyor.", 403);
  }
  if (req.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new MessageError("JSON biçiminde gönderim gerekli.", 415);
  }
  if (Number(req.headers.get("content-length")) > 32768) throw new MessageError("Gönderim çok büyük.", 413);
  const raw = await req.text();
  if (Buffer.byteLength(raw) > 32768) throw new MessageError("Gönderim çok büyük.", 413);
  let data: unknown;
  try { data = JSON.parse(raw); } catch { throw new MessageError("Geçersiz gönderim."); }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new MessageError("Geçersiz gönderim.");
  return data as Record<string, unknown>;
}

export async function getPortalMessages(req: Request, studentId: string) {
  await ensurePortalMessageTables();
  const params = new URL(req.url).searchParams;
  const before = params.get("before");
  const after = params.get("after");
  if ((before && after) || (before?.length ?? 0) > 100 || (after?.length ?? 0) > 100) {
    throw new MessageError("Geçersiz sayfa.");
  }
  const cursorId = before || after;
  const cursor = cursorId ? await prisma.portalMessage.findFirst({
    where: { id: cursorId, studentId }, select: { id: true, createdAt: true },
  }) : null;
  if (cursorId && !cursor) throw new MessageError("Mesaj bulunamadı.", 404);
  const direction = after ? "asc" : "desc";
  const rows = await prisma.portalMessage.findMany({
    where: {
      studentId,
      ...(cursor ? { OR: [
        { createdAt: after ? { gt: cursor.createdAt } : { lt: cursor.createdAt } },
        { createdAt: cursor.createdAt, id: after ? { gt: cursor.id } : { lt: cursor.id } },
      ] } : {}),
    },
    orderBy: [{ createdAt: direction }, { id: direction }], take: PAGE_SIZE + 1, select: messageSelect,
  });
  const hasMore = rows.length > PAGE_SIZE;
  const page = rows.slice(0, PAGE_SIZE);
  return NextResponse.json({ messages: after ? page : page.reverse(), hasMore }, { headers: privateHeaders });
}

export async function sendPortalMessage(req: Request, studentId: string, sender: PortalSender) {
  const input = await readMessageInput(req);
  const body = typeof input.body === "string" ? input.body.trim() : "";
  const clientMessageId = typeof input.clientMessageId === "string" ? input.clientMessageId : "";
  if (!body || body.length > 5000) throw new MessageError("Mesaj 1–5000 karakter olmalı.");
  if (!/^[a-zA-Z0-9-]{10,80}$/.test(clientMessageId)) throw new MessageError("Geçersiz gönderim kimliği.");
  if (rateLimited("portal-message", `${sender}:${studentId}`, 30, 60 * 1000)) {
    throw new MessageError("Çok hızlı mesaj gönderiyorsun. Bir dakika sonra tekrar dene.", 429);
  }
  await ensurePortalMessageTables();
  const { message, created } = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`INSERT INTO "PortalConversation" ("studentId") VALUES (${studentId}) ON CONFLICT ("studentId") DO NOTHING`;
    // Aynı konuşmaya eş zamanlı yazımlarda sıralamayı ve yanıt durumunu koru.
    await tx.$queryRaw`SELECT "studentId" FROM "PortalConversation" WHERE "studentId" = ${studentId} FOR UPDATE`;
    const existing = await tx.portalMessage.findUnique({
      where: { studentId_sender_clientMessageId: { studentId, sender, clientMessageId } }, select: messageSelect,
    });
    if (existing) {
      if (existing.body !== body) throw new MessageError("Bu gönderim kimliği zaten kullanılmış.", 409);
      return { message: existing, created: false };
    }
    const created = await tx.portalMessage.create({
      data: { studentId, sender, body, clientMessageId, createdAt: new Date() }, select: messageSelect,
    });
    await tx.portalConversation.update({
      where: { studentId }, data: { needsReply: sender === "STUDENT", updatedAt: created.createdAt },
    });
    return { message: created, created: true };
  });
  // Yanıtı bekletmeden, yalnızca yeni kaydın transaction'ı tamamlanınca bildir.
  if (created) after(() => notifyPortalMessage(message.id));
  return NextResponse.json({ message }, { status: 201, headers: privateHeaders });
}

export async function markPortalMessagesRead(req: Request, studentId: string, reader: PortalSender) {
  const { ids } = await readMessageInput(req);
  if (!Array.isArray(ids) || ids.length < 1 || ids.length > 100 || ids.some((id) => typeof id !== "string" || !id || id.length > 100)) {
    throw new MessageError("Geçersiz mesaj listesi.");
  }
  await ensurePortalMessageTables();
  // Yalnızca gerçekten görüntülenen, karşı taraftan gelen mesajlar okunur olur.
  const result = await prisma.portalMessage.updateMany({
    where: { studentId, id: { in: ids }, sender: reader === "ADMIN" ? "STUDENT" : "ADMIN", readAt: null },
    data: { readAt: new Date() },
  });
  return NextResponse.json({ updated: result.count }, { headers: privateHeaders });
}
