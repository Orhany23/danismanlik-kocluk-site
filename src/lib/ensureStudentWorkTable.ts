import prisma from "./db";

let ensured = false;

// StudentWork tablosu üretimde henüz oluşturulmamışsa ilk kullanımda oluşturur.
// DDL, `prisma db push`un üreteceği yapıyla birebir aynıdır (Testimonial deseni).
export async function ensureStudentWorkTable(): Promise<void> {
  if (ensured) return;
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "StudentWork" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NOTE',
    "title" TEXT,
    "note" TEXT,
    "url" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentWork_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "StudentWork_studentId_idx" ON "StudentWork"("studentId")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "StudentWork_createdAt_idx" ON "StudentWork"("createdAt")`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StudentWork_studentId_fkey') THEN
      ALTER TABLE "StudentWork" ADD CONSTRAINT "StudentWork_studentId_fkey"
        FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$`);
  ensured = true;
}
