import prisma from "@/lib/db";

let ensuring: Promise<void> | null = null;

// Mevcut projenin ilk kullanımda şema hazırlama desenini izler.
// Yalnızca iki yeni tablo ekler; geçmiş çalışma/mesaj kayıtlarını değiştirmez.
export const PORTAL_MESSAGE_DDL = [
  `CREATE TABLE IF NOT EXISTS "PortalConversation" (
    "studentId" TEXT NOT NULL PRIMARY KEY,
    "needsReply" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PortalConversation_studentId_fkey" FOREIGN KEY ("studentId")
      REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "PortalMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "sender" TEXT NOT NULL CHECK ("sender" IN ('STUDENT', 'ADMIN')),
    "body" TEXT NOT NULL CHECK (char_length("body") BETWEEN 1 AND 5000),
    "clientMessageId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PortalMessage_studentId_fkey" FOREIGN KEY ("studentId")
      REFERENCES "PortalConversation"("studentId") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PortalMessage_studentId_sender_clientMessageId_key"
    ON "PortalMessage"("studentId", "sender", "clientMessageId")`,
  `CREATE INDEX IF NOT EXISTS "PortalMessage_studentId_createdAt_id_idx"
    ON "PortalMessage"("studentId", "createdAt", "id")`,
  `CREATE INDEX IF NOT EXISTS "PortalMessage_sender_readAt_studentId_idx"
    ON "PortalMessage"("sender", "readAt", "studentId")`,
  `CREATE INDEX IF NOT EXISTS "PortalConversation_needsReply_updatedAt_idx"
    ON "PortalConversation"("needsReply", "updatedAt")`,
  `CREATE INDEX IF NOT EXISTS "PortalConversation_updatedAt_studentId_idx"
    ON "PortalConversation"("updatedAt", "studentId")`,
] as const;

export function ensurePortalMessageTables(): Promise<void> {
  if (!ensuring) {
    ensuring = prisma.$transaction(async (tx) => {
      // Birden fazla sunucu aynı anda ilk isteği alırsa DDL işlemlerini sırala.
      await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(79540216)`;
      for (const statement of PORTAL_MESSAGE_DDL) {
        await tx.$executeRawUnsafe(statement); // Sabit DDL; kullanıcı girdisi yok.
      }
    }, { timeout: 15000 }).catch((error) => {
      ensuring = null;
      throw error;
    });
  }
  return ensuring;
}
