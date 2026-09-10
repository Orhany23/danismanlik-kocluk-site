import { Resend } from "resend";

// RESEND_API_KEY yoksa build/dev sırasında çökmesin; gönderim anında hata verir.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.RESEND_FROM_EMAIL || "Orhan Yaşlı <bildirim@psdorhanyasli.com.tr>";

export async function sendPasswordResetEmail(to: string, resetUrl: string, name: string) {
  if (!resend) {
    console.error("RESEND_API_KEY tanımlı değil — e-posta gönderilemedi.");
    throw new Error("E-posta servisi yapılandırılmamış.");
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Şifre Sıfırlama Talebi",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Şifre Sıfırlama</h2>
        <p>Merhaba ${escapeHtml(name)},</p>
        <p>Hesabınız için bir şifre sıfırlama talebi aldık. Aşağıdaki bağlantı 1 saat boyunca geçerlidir:</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#1e293b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
            Şifremi Sıfırla
          </a>
        </p>
        <p style="color:#64748b;font-size:13px;">Bu talebi siz yapmadıysanız bu e-postayı yok sayabilirsiniz; şifreniz değişmeyecektir.</p>
      </div>
    `,
  });

  // ÖNEMLİ: Resend SDK'sı API hatalarında (geçersiz anahtar, doğrulanmamış
  // domain, limit aşımı vb.) İSTİSNA FIRLATMAZ — hatayı sessizce `error`
  // alanında döner. Bu kontrol olmadan gönderim gerçekte başarısız olsa
  // bile kod hiçbir zaman hata görmüyor ve çağıran taraf (KVKK/enumeration
  // önleme amacıyla) her zaman "gönderildi" mesajı gösteriyordu.
  if (error) {
    console.error("Resend gönderim hatası:", error);
    throw new Error(`E-posta gönderilemedi: ${error.message}`);
  }
}

const APPOINTMENT_DATE_FMT = new Intl.DateTimeFormat("tr-TR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Istanbul",
});

export async function sendAppointmentReminderEmail(
  to: string,
  clientName: string,
  title: string,
  date: Date,
  type: string
) {
  if (!resend) {
    console.error("RESEND_API_KEY tanımlı değil — hatırlatma e-postası gönderilemedi.");
    return;
  }

  const dateStr = APPOINTMENT_DATE_FMT.format(date);
  const locationLine =
    type === "ONLINE"
      ? "Görüşme online yapılacaktır; bağlantı ayrıca WhatsApp'tan paylaşılır."
      : "Görüşme yüz yüze yapılacaktır.";

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `Hatırlatma: Yarınki randevunuz — ${dateStr}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Randevu Hatırlatması</h2>
        <p>Merhaba ${escapeHtml(clientName)},</p>
        <p><strong>${escapeHtml(title)}</strong> için randevunuz yaklaşıyor:</p>
        <p style="background:#f5f1ea;border-radius:8px;padding:14px 18px;font-size:15px;">
          📅 ${dateStr}
        </p>
        <p style="color:#64748b;font-size:13px;">${locationLine}</p>
        <p style="color:#64748b;font-size:13px;">Değişiklik veya iptal için lütfen WhatsApp'tan bize ulaşın.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Randevu hatırlatma e-postası hatası:", error);
    throw new Error(`Hatırlatma e-postası gönderilemedi: ${error.message}`);
  }
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
