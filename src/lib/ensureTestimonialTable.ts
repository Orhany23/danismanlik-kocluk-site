import prisma from "./db";

let ensured = false;

// Testimonial tablosu üretimde henüz oluşturulmamışsa ilk kullanımda oluşturur.
// DDL, `prisma db push`un üreteceği yapıyla birebir aynıdır; sonradan db push
// çalıştırılırsa çakışma yaşanmaz.
export async function ensureTestimonialTable(): Promise<void> {
  if (ensured) return;
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "displayPref" TEXT NOT NULL DEFAULT 'NAME',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Testimonial_studentId_key" ON "Testimonial"("studentId")`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Testimonial_studentId_fkey') THEN
      ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_studentId_fkey"
        FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$`);
  ensured = true;
}
