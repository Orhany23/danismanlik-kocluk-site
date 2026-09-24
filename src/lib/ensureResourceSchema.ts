import prisma from "@/lib/db";

let ensurePromise: Promise<void> | null = null;

export function ensureResourceSchema(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = prisma
      .$executeRawUnsafe(
        'ALTER TABLE "Resource" ADD COLUMN IF NOT EXISTS "isTemplate" BOOLEAN NOT NULL DEFAULT false'
      )
      .then(() => undefined)
      .catch((error) => {
        ensurePromise = null;
        throw error;
      });
  }

  return ensurePromise;
}
