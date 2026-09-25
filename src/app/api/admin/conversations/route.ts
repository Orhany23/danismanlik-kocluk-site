import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensurePortalMessageTables } from "@/lib/ensurePortalMessageTables";
import { MessageError, messageErrorResponse, privateHeaders } from "@/lib/portalMessages";

export async function GET(req: Request) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await ensurePortalMessageTables();
    const params = new URL(req.url).searchParams;
    const query = (params.get("q") ?? "").trim().slice(0, 100);
    const filter = params.get("filter") ?? "all";
    const page = Number(params.get("page") ?? 0);
    if (!Number.isSafeInteger(page) || page < 0 || page > 10000 || !["all", "unread", "waiting"].includes(filter)) {
      throw new MessageError("Geçersiz liste isteği.");
    }
    const where = {
      ...(query ? { student: { name: { contains: query, mode: "insensitive" as const } } } : {}),
      ...(filter === "waiting" ? { needsReply: true } : {}),
      ...(filter === "unread" ? { messages: { some: { sender: "STUDENT", readAt: null } } } : {}),
    };
    const rows = await prisma.portalConversation.findMany({
      where, orderBy: [{ updatedAt: "desc" }, { studentId: "desc" }], take: 31, skip: page * 30,
      select: {
        studentId: true, needsReply: true, updatedAt: true,
        student: { select: { id: true, name: true, gradeLevel: true, active: true } },
        messages: { take: 1, orderBy: [{ createdAt: "desc" }, { id: "desc" }], select: { body: true, sender: true } },
        _count: { select: { messages: { where: { sender: "STUDENT", readAt: null } } } },
      },
    });
    return NextResponse.json({
      conversations: rows.slice(0, 30).map(({ messages, _count, ...row }) => ({ ...row, lastMessage: messages[0] ?? null, unread: _count.messages })),
      hasMore: rows.length > 30,
    }, { headers: privateHeaders });
  } catch (error) { return messageErrorResponse(error); }
}
