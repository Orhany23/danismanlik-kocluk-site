import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import { authConfig } from "./auth.config";
import { clientIp, rateLimited } from "./rateLimit";
import { checkPassword, PASSWORD_MAX } from "./password";

export { hashPassword, isPasswordPolicyOk } from "./password";

function normalizeEmail(raw: unknown): string {
  return String(raw ?? "").toLowerCase().trim();
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = normalizeEmail(credentials?.email);
        const password = String(credentials?.password ?? "");
        if (!email || !password || password.length > PASSWORD_MAX) return null;

        const ip = request instanceof Request ? clientIp(request) : "unknown";
        if (rateLimited("login-admin", `${ip}:${email}`, 8, 15 * 60 * 1000)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        const isValid = await checkPassword(password, user?.password ?? null);
        if (!user || !isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "student",
      name: "student",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = normalizeEmail(credentials?.email);
        const password = String(credentials?.password ?? "");
        if (!email || !password || password.length > PASSWORD_MAX) return null;

        const ip = request instanceof Request ? clientIp(request) : "unknown";
        if (rateLimited("login-student", `${ip}:${email}`, 8, 15 * 60 * 1000)) return null;

        const student = await prisma.student.findUnique({ where: { email } });
        const isValid = await checkPassword(password, student?.password ?? null);
        if (!student || !student.active || !isValid) return null;

        return {
          id: student.id,
          email: student.email,
          name: student.name,
          role: "STUDENT",
        };
      },
    }),
  ],
});

/** Yalnızca role === "ADMIN". Öğrenci JWT'si yönetim verisine inemez. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}

export type AuthedStudent = {
  id: string;
  email: string;
  name: string;
  gradeLevel: string | null;
};

/**
 * Öğrenci oturumu + DB'de hâlâ aktif. JWT tek başına yetmez
 * (askıya alma, silme — OWASP: her istekte yetki).
 */
export async function requireStudent(): Promise<AuthedStudent | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!session?.user || session.user.role !== "STUDENT" || !id) return null;
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, active: true, gradeLevel: true },
    });
    if (!student?.active) return null;
    return {
      id: student.id,
      email: student.email,
      name: student.name,
      gradeLevel: student.gradeLevel,
    };
  } catch {
    return null;
  }
}
