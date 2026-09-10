import prisma from "./db";

let ensured = false;

// TestSubmission tablosu üretimde henüz oluşturulmamışsa ilk kullanımda
// oluşturur. DDL, `prisma db push`un üreteceği yapıyla birebir aynıdır
// (StudentWork ile aynı desen — bkz. ensureStudentWorkTable.ts).
export async function ensureTestSubmissionTable(): Promise<void> {
  if (ensured) return;
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "TestSubmission" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "testSlug" TEXT NOT NULL,
    "testTitle" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER,
    "maxScore" INTEGER,
    "resultLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestSubmission_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "TestSubmission_studentId_idx" ON "TestSubmission"("studentId")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "TestSubmission_testSlug_idx" ON "TestSubmission"("testSlug")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "TestSubmission_createdAt_idx" ON "TestSubmission"("createdAt")`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TestSubmission_studentId_fkey') THEN
      ALTER TABLE "TestSubmission" ADD CONSTRAINT "TestSubmission_studentId_fkey"
        FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$`);
  ensured = true;
}
