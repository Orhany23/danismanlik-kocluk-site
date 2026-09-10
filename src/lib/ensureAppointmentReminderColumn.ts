import prisma from "./db";

let ensured = false;

// Appointment tablosu üretimde henüz "reminderSentAt" sütununu içermiyor
// olabilir — ilk kullanımda ekler (StudentWork/TestSubmission ile aynı desen).
export async function ensureAppointmentReminderColumn(): Promise<void> {
  if (ensured) return;
  await prisma.$executeRawUnsafe(`ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "reminderSentAt" TIMESTAMP(3)`);
  ensured = true;
}
