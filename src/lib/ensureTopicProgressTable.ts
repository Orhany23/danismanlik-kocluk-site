import prisma from "./db";

let ensured = false;

// TopicProgress tablosu üretimde henüz oluşturulmamışsa ilk kullanımda
// oluşturur (StudentWork/TestSubmission ile aynı desen).
export async function ensureTopicProgressTable(): Promise<void> {
  if (ensured) return;
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "TopicProgress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3),
    "feedback" TEXT,
    "feedbackAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TopicProgress_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "TopicProgress_studentId_topicId_key" ON "TopicProgress"("studentId", "topicId")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "TopicProgress_studentId_idx" ON "TopicProgress"("studentId")`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TopicProgress_studentId_fkey') THEN
      ALTER TABLE "TopicProgress" ADD CONSTRAINT "TopicProgress_studentId_fkey"
        FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$`);
  ensured = true;
}
