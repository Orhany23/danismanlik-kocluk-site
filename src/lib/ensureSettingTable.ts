import prisma from "./db";

let ensured = false;

// Setting tablosu üretimde henüz oluşturulmamışsa ilk kullanımda oluşturur.
// (Bu projede migration çalışmıyor; tablolar runtime'da CREATE IF NOT EXISTS ile
// oluşuyor — Testimonial / StudentWork deseni.) DDL, prisma şemasıyla birebir.
export async function ensureSettingTable(): Promise<void> {
  if (ensured) return;
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Setting" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Setting_key_key" ON "Setting"("key")`);
  ensured = true;
}
