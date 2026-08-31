import type { NextAuthConfig } from "next-auth";

// Prisma / Node-only bağımlılık YOK. proxy.ts bu yapılandırmayla JWT'yi çözer
// (Auth.js + Next.js 16 resmi ayrımı: edge/proxy güvenli config).

export const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60; // 8 saat — ayrıcalıklı oturum
export const STUDENT_SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 gün

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    // Çerez üst sınırı öğrenci süresi; admin JWT exp aşağıda kısaltılır.
    maxAge: STUDENT_SESSION_MAX_AGE,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (token.role === "ADMIN") {
        const issued = typeof token.iat === "number" ? token.iat : Math.floor(Date.now() / 1000);
        token.exp = issued + ADMIN_SESSION_MAX_AGE;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
