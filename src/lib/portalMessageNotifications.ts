import prisma from "@/lib/db";
import { portalEmailEnabled, portalNotificationOrigin, validNotificationEmail, sendPortalNotificationEmail, PortalEmailError } from "@/lib/portalNotificationEmail";

export type PortalEmailStatus = { studentReady: boolean; adminReady: boolean; adminEmail: string | null; detail: string };

async function adminRecipient(): Promise<string | null> {
  const configured = process.env.PORTAL_ADMIN_NOTIFICATION_EMAIL?.trim();
  if (configured) return validNotificationEmail(configured) ? configured : null;
  const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { email: true }, take: 2 });
  // Birden fazla yönetici varsa alıcıyı tahmin etme; açık adres ayarı gerekir.
  return admins.length === 1 && validNotificationEmail(admins[0].email) ? admins[0].email : null;
}

export async function getPortalEmailStatus(): Promise<PortalEmailStatus> {
  const unavailable = (detail: string): PortalEmailStatus => ({ studentReady: false, adminReady: false, adminEmail: null, detail });
  if (!portalEmailEnabled()) return unavailable("Bu ortamda e-posta bildirimleri kapalı.");
  if (!process.env.RESEND_API_KEY?.trim()) return unavailable("E-posta hizmeti henüz ayarlanmamış. Bildirimler için e-posta kurulumunu tamamlayın.");
  try {
    portalNotificationOrigin();
    const email = await adminRecipient();
    return {
      studentReady: true, adminReady: Boolean(email), adminEmail: email,
      detail: email
        ? "E-posta ayarları mevcut. Öğrencilere hesaplarındaki adrese, size aşağıdaki adrese bildirim gönderilir."
        : "Öğrencilere bildirim gönderilebilir. Sizin bildirim alacağınız yönetici e-posta adresi henüz belirlenmemiş.",
    };
  } catch {
    return unavailable("E-posta bildirim ayarları kontrol edilemedi. Mesajlaşmayı kullanmaya devam edebilirsiniz.");
  }
}

export async function notifyPortalMessage(messageId: string) {
  if (!portalEmailEnabled() || !process.env.RESEND_API_KEY?.trim()) return;
  try {
    const message = await prisma.portalMessage.findUnique({
      where: { id: messageId },
      select: { id: true, studentId: true, sender: true, readAt: true, createdAt: true },
    });
    // Okunmuş veya eski bir mesaj için gecikmiş bildirim gönderme.
    if (!message || message.readAt || Date.now() - message.createdAt.getTime() > 5 * 60 * 1000) return;
    if (message.sender !== "ADMIN" && message.sender !== "STUDENT") return;
    const student = await prisma.student.findUnique({ where: { id: message.studentId }, select: { active: true, email: true } });
    if (!student?.active) return;
    const to = message.sender === "ADMIN" ? student.email : await adminRecipient();
    if (!to) throw new PortalEmailError("missing_admin_recipient");
    await sendPortalNotificationEmail({ to, messageId: message.id, studentId: message.studentId, sender: message.sender });
  } catch (error) {
    // Bir e-posta sorunu kaydedilmiş mesajı başarısız göstermez; kişisel veri loglanmaz.
    console.error("Portal email notification failed", { code: error instanceof PortalEmailError ? error.code : "notification_error" });
  }
}
