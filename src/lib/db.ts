import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL ?? "";

// Serverless (Vercel) ortamında her invocation yeni bir Pool açmasın diye
// küçük bir havuz limiti veriyoruz; sağlayıcıların bağlantı limitine takılmayı önler.
const adapter = new PrismaPg({
  connectionString,
  max: Number(process.env.PG_POOL_MAX ?? 5),
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// ÖNEMLİ: Production dahil her ortamda global önbelleğe al.
// Önceden yalnızca dev'de önbellekleniyordu; production'da her istek yeni
// PrismaClient + yeni pg Pool oluşturup veritabanı bağlantı limitini
// tüketiyordu ("Kayıt sırasında bir hata oluştu" hatasının ana nedeni).
globalForPrisma.prisma = prisma;

export default prisma;
