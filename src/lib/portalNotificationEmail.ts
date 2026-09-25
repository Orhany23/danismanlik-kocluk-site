export type PortalNotificationSender = "ADMIN" | "STUDENT";

export class PortalEmailError extends Error {
  constructor(public code: string) { super(code); }
}

export function portalEmailEnabled() {
  return process.env.PORTAL_EMAIL_NOTIFICATIONS !== "false"
    && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
}

export function validNotificationEmail(value: string) {
  return value.length <= 254 && /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(value);
}

export function portalNotificationOrigin() {
  const url = new URL(process.env.PORTAL_SITE_URL || "https://psdorhanyasli.com.tr");
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new PortalEmailError("invalid_site_url");
  }
  return url.origin;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

// Yalnızca bildirim bilgileri alınır; sohbet metni bu işleve aktarılmaz.
export async function sendPortalNotificationEmail(input: {
  to: string; messageId: string; studentId: string; sender: PortalNotificationSender;
}) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new PortalEmailError("missing_api_key");
  if (!validNotificationEmail(input.to)) throw new PortalEmailError("invalid_recipient");
  const url = new URL(input.sender === "ADMIN" ? "/ogrenci/mesajlar" : "/admin/messages", portalNotificationOrigin());
  if (input.sender === "STUDENT") url.searchParams.set("student", input.studentId);
  const description = input.sender === "ADMIN"
    ? "Danışmanınız size yeni bir mesaj gönderdi."
    : "Bir öğrenci veya danışanınız size yeni bir mesaj gönderdi.";
  const payload = JSON.stringify({
    from: process.env.RESEND_FROM_EMAIL || "Orhan Yaşlı <bildirim@psdorhanyasli.com.tr>",
    to: [input.to],
    subject: "Panelinizde yeni mesaj var — Orhan Yaşlı",
    text: `${description}\n\nMesajınızı okumak ve yanıtlamak için hesabınıza giriş yapın:\n${url.href}\n\nYanıtınızı site üzerinden yazabilirsiniz.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;line-height:1.7;color:#25383b"><h2>Yeni mesajınız var</h2><p>${description}</p><p>Mesajınızı okumak ve yanıtlamak için hesabınıza giriş yapın.</p><p style="margin:24px 0"><a href="${escapeHtml(url.href)}" style="display:inline-block;background:#245c4d;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none">Mesajlarıma git</a></p><p style="font-size:13px;color:#607174">Yanıtınızı site üzerinden yazabilirsiniz.</p><p>Orhan Yaşlı</p></div>`,
  });
  // Sabit içerik ve aynı anahtar, belirsiz ağ hatalarında çift e-postayı önler.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST", cache: "no-store", signal: AbortSignal.timeout(6000),
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `portal-message/${input.messageId}` },
        body: payload,
      });
      if (response.ok) {
        const data = await response.json();
        if (typeof data?.id !== "string") throw new PortalEmailError("invalid_provider_response");
        return;
      }
      const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
      // Sağlayıcının hata metni e-posta adresi içerebilir; yalnızca durum kodu tutulur.
      await response.body?.cancel();
      if (!retryable || attempt === 2) throw new PortalEmailError(`provider_${response.status}`);
    } catch (error) {
      if (error instanceof PortalEmailError) throw error;
      if (attempt === 2) throw new PortalEmailError("network_error");
    }
    await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 750));
  }
}
