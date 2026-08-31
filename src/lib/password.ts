import bcrypt from "bcryptjs";

export const BCRYPT_COST = 12;
export const PASSWORD_MAX = 128;
const DUMMY_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export function isPasswordPolicyOk(plain: unknown): plain is string {
  return typeof plain === "string" && plain.length >= 8 && plain.length <= PASSWORD_MAX;
}

/** Kullanıcı yokken de compare çalışsın (zaman farkıyla enumerasyonu azaltır). */
export async function checkPassword(plain: string, hash: string | null): Promise<boolean> {
  return bcrypt.compare(plain, hash ?? DUMMY_HASH);
}
