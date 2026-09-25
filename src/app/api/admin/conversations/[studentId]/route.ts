import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { getPortalMessages, sendPortalMessage, markPortalMessagesRead, messageErrorResponse } from "@/lib/portalMessages";

type Context = { params: Promise<{ studentId: string }> };

async function handle(req: Request, context: Context, method: "GET" | "POST" | "PATCH") {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: "Yetkili yönetici oturumu gerekli." }, { status: 401 });
    const { studentId } = await context.params;
    const student = await prisma.student.findUnique({ where: { id: studentId }, select: { active: true } });
    if (!student) return NextResponse.json({ error: "Kişi bulunamadı." }, { status: 404 });
    if (method === "GET") return await getPortalMessages(req, studentId);
    if (method === "POST") {
      if (!student.active) return NextResponse.json({ error: "Bu hesap pasif. Mesaj gönderilemez." }, { status: 409 });
      return await sendPortalMessage(req, studentId, "ADMIN");
    }
    return await markPortalMessagesRead(req, studentId, "ADMIN");
  } catch (error) { return messageErrorResponse(error); }
}

export const GET = (req: Request, context: Context) => handle(req, context, "GET");
export const POST = (req: Request, context: Context) => handle(req, context, "POST");
export const PATCH = (req: Request, context: Context) => handle(req, context, "PATCH");
