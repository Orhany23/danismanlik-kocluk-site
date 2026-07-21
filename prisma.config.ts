import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Bu URL yalnızca Prisma CLI komutları (generate, db push, migrate) için
    // kullanılır; çalışma zamanı bağlantısı src/lib/db.ts'te adapter üzerinden
    // process.env.DATABASE_URL ile kurulur. "prisma generate" gerçek bir
    // bağlantı gerektirmediğinden, DATABASE_URL tanımlı olmayan build
    // ortamlarında (ör. Vercel npm install) yer tutucuya düşülür — env("...")
    // kullanılsaydı değişken yokken kurulum hata verirdi.
    url:
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
