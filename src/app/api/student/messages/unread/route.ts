import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensurePortalMessageTables } from "@/lib/ensurePortalMessageTables";
import { privateHeaders, messageErrorResponse } from "@/lib/portalMessages";

export async function GET() {
  try {
    const student = await requireStudent();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await ensurePortalMessageTables();
    const unread = await prisma.portalMessage.count({ where: { studentId: student.id, sender: "ADMIN", readAt: null } });
    return NextResponse.json({ unread }, { headers: privateHeaders });
  } catch (error) { return messageErrorResponse(error); }
}
