import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ensureAppointmentReminderColumn } from "@/lib/ensureAppointmentReminderColumn";
import { sendAppointmentReminderEmail } from "@/lib/email";
import { safeEqual } from "@/lib/safeEqual";

// Vercel Cron günde bir kez çalışır (vercel.json), bu yüzden "1 saat önce"
// gibi hassas bir hatırlatma yerine "yarınki randevular" penceresi kullanılır.
// Pencere 20-32 saat olarak seçildi: cron'un tam hangi dakikada tetiklendiğine
// bakılmaksızın ertesi günün randevularının tek seferde, atlanmadan yakalanmasını sağlar.
const WINDOW_MIN_HOURS = 20;
const WINDOW_MAX_HOURS = 32;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("CRON_SECRET missing");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const qs = req.nextUrl.searchParams.get("secret");
  if (!safeEqual(bearer, secret) && !safeEqual(qs, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureAppointmentReminderColumn();

    const now = new Date();
    const windowStart = new Date(now.getTime() + WINDOW_MIN_HOURS * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + WINDOW_MAX_HOURS * 60 * 60 * 1000);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: windowStart, lte: windowEnd },
        status: { notIn: ["CANCELLED", "IPTAL"] },
        reminderSentAt: null,
      },
      include: { client: { select: { id: true, name: true, email: true } } },
    });

    let sent = 0;
    let skippedNoEmail = 0;
    const failures: string[] = [];

    for (const appt of appointments) {
      if (!appt.client.email) {
        skippedNoEmail++;
        continue;
      }
      try {
        await sendAppointmentReminderEmail(appt.client.email, appt.client.name, appt.title, appt.date, appt.type);
        await prisma.appointment.update({ where: { id: appt.id }, data: { reminderSentAt: now } });
        sent++;
      } catch (err) {
        console.error(`Randevu hatırlatması gönderilemedi (${appt.id}):`, err);
        failures.push(appt.id);
      }
    }

    return NextResponse.json({ ok: true, checked: appointments.length, sent, skippedNoEmail, failures });
  } catch (err) {
    console.error("appointment-reminders cron error:", err);
    return NextResponse.json({ error: "Randevu hatırlatmaları gönderilemedi." }, { status: 500 });
  }
}
