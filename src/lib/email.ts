import { Resend } from "resend";

// RESEND_API_KEY yoksa build/dev sırasında çökmesin; gönderim anında hata verir.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.RESEND_FROM_EMAIL || "Orhan Yaşlı <bildirim@psdorhanyasli.com.tr>";

export async function sendPasswordResetEmail(to: string, resetUrl: string, name: string) {
  if (!resend) {
    console.error("RESEND_API_KEY tanımlı değil — e-posta gönderilemedi.");
    throw new Error("E-posta servisi yapılandırılmamış.");
  }

  await resend.emails.send({
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
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
