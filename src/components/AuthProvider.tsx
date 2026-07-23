"use client";

import { SessionProvider } from "next-auth/react";

// NextAuth oturumunu istemci bileşenlerine (Navbar vb.) güvenilir biçimde
// sağlar. Elle fetch("/api/auth/session") yerine bunu kullanırız; önbellek ve
// yeniden doğrulama NextAuth tarafından yönetilir.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
