import prisma from "@/lib/db";

let ensurePromise: Promise<void> | null = null;

export function ensureMessageReplySchema(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      await prisma.$executeRawUnsafe('ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "reply" TEXT');
      await prisma.$executeRawUnsafe('ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "repliedAt" TIMESTAMP(3)');
    })().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }
  return ensurePromise;
}
