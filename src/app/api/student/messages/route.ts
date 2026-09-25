import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import { getPortalMessages, sendPortalMessage, markPortalMessagesRead, messageErrorResponse } from "@/lib/portalMessages";

async function handle(req: Request, method: "GET" | "POST" | "PATCH") {
  try {
    const student = await requireStudent();
    if (!student) return NextResponse.json({ error: "Oturumun sona erdi. Yeniden giriş yap." }, { status: 401 });
    // Hedef kimliği URL/gövde yerine yalnızca oturumdan al.
    if (method === "GET") return await getPortalMessages(req, student.id);
    if (method === "POST") return await sendPortalMessage(req, student.id, "STUDENT");
    return await markPortalMessagesRead(req, student.id, "STUDENT");
  } catch (error) { return messageErrorResponse(error); }
}

export const GET = (req: Request) => handle(req, "GET");
export const POST = (req: Request) => handle(req, "POST");
export const PATCH = (req: Request) => handle(req, "PATCH");
