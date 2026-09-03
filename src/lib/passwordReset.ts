import crypto from "crypto";
import prisma from "./db";
import { ensurePasswordResetTable } from "./ensurePasswordResetTable";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 saat

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// Ham token yalnızca e-postada gider; DB'de yalnızca hash saklanır
// (K7 mantığı: sızan DB tek başına aktif reset linki üretmemeli).
export async function createResetToken(userType: "ADMIN" | "STUDENT", userId: string): Promise<string> {
  await ensurePasswordResetTable();

  // Aynı kullanıcı için önceki kullanılmamış tokenlar geçersiz kılınır.
  await prisma.passwordResetToken.updateMany({
    where: { userType, userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  const raw = crypto.randomBytes(32).toString("base64url");
  await prisma.passwordResetToken.create({
    data: {
      userType,
      userId,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  return raw;
}

export async function consumeResetToken(
  rawToken: string,
): Promise<{ userType: string; userId: string } | null> {
  await ensurePasswordResetTable();

  const tokenHash = hashToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return { userType: record.userType, userId: record.userId };
}
