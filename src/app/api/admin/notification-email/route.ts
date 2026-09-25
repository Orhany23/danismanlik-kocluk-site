import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readMessageInput, MessageError, messageErrorResponse, privateHeaders } from "@/lib/portalMessages";
import { validNotificationEmail } from "@/lib/portalNotificationEmail";
import { savePortalAdminEmail } from "@/lib/portalNotificationSettings";
import { getPortalEmailStatus } from "@/lib/portalMessageNotifications";

export async function PUT(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Yönetici oturumu gerekli." }, { status: 401, headers: privateHeaders });
  try {
    const input = await readMessageInput(req);
    const email = typeof input.email === "string" ? input.email.trim() : "";
    if (!validNotificationEmail(email)) throw new MessageError("Geçerli bir e-posta adresi yazın.");
    await savePortalAdminEmail(email);
    return NextResponse.json({ ok: true, email, status: await getPortalEmailStatus() }, { headers: privateHeaders });
  } catch (error) { return messageErrorResponse(error); }
}
