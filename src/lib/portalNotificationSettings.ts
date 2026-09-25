import prisma from "@/lib/db";
import { ensureSettingTable } from "@/lib/ensureSettingTable";

const ADMIN_EMAIL_KEY = "portalAdminNotificationEmail";

export async function savedPortalAdminEmail(): Promise<string | null> {
  await ensureSettingTable();
  const setting = await prisma.setting.findUnique({ where: { key: ADMIN_EMAIL_KEY }, select: { value: true } });
  return setting?.value.trim() || null;
}

export async function savePortalAdminEmail(email: string) {
  await ensureSettingTable();
  await prisma.setting.upsert({
    where: { key: ADMIN_EMAIL_KEY },
    create: { id: ADMIN_EMAIL_KEY, key: ADMIN_EMAIL_KEY, value: email },
    update: { value: email },
  });
}
