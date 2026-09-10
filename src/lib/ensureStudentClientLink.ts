import prisma from "./db";

let ensured = false;

// Student.clientId sütunu (öğrenci → danışan bağı) üretimde henüz yoksa ekler.
// Student tablosu zaten var olduğu için CREATE değil ALTER kullanılır.
export async function ensureStudentClientLink(): Promise<void> {
  if (ensured) return;
  await prisma.$executeRawUnsafe(`ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "clientId" TEXT`);
  // Veli onayı alanları (doğum yılı + veli iletişimi)
  await prisma.$executeRawUnsafe(`ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "birthYear" INTEGER`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "guardianName" TEXT`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "guardianPhone" TEXT`);
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "Student_clientId_key" ON "Student"("clientId")`,
  );
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Student_clientId_fkey') THEN
      ALTER TABLE "Student" ADD CONSTRAINT "Student_clientId_fkey"
        FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
  END $$`);
  ensured = true;
}
