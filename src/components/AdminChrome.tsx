"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type Counts = { messages: number; work: number; testimonials: number };

function badgeFor(href: string, c: Counts): number {
  if (href === "/admin/messages") return c.messages;
  if (href === "/admin/work") return c.work;
  if (href === "/admin/testimonials") return c.testimonials;
  return 0;
}

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/appointments", label: "Randevular", icon: "📅" },
  { href: "/admin/clients", label: "Danışanlar", icon: "👥" },
  { href: "/admin/sessions", label: "Seanslar", icon: "📋" },
  { href: "/admin/messages", label: "Mesajlar", icon: "✉" },
  { href: "/admin/students", label: "Öğrenciler", icon: "🎓" },
  { href: "/admin/work", label: "Öğrenci Çalışmaları", icon: "📥" },
  { href: "/admin/resources", label: "Kaynaklar", icon: "📚" },
  { href: "/admin/testimonials", label: "Yorumlar", icon: "⭐" },
  { href: "/admin/settings", label: "Ayarlar", icon: "⚙" },
];

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<Counts>({ messages: 0, work: 0, testimonials: 0 });

  useEffect(() => {
    fetch("/api/admin/counts", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCounts({ messages: d.messages ?? 0, work: d.work ?? 0, testimonials: d.testimonials ?? 0 }))
      .catch(() => {});
  }, [pathname]);

  return (
    <div className="min-h-screen flex bg-[#f5f7fa]">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-lg font-serif font-bold text-[var(--clr-navy)]">Yönetim Paneli</h1>
          <p className="text-xs text-gray-400 mt-0.5">Orhan Yaşlı</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--clr-primary)] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{link.icon}</span>
                <span className="flex-1">{link.label}</span>
                {badgeFor(link.href, counts) > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                      isActive ? "bg-white/25 text-white" : "bg-[var(--clr-primary)] text-white"
                    }`}
                  >
                    {badgeFor(link.href, counts)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-all"
          >
            <span>🚪</span>
            Çıkış Yap
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {sidebarLinks.find((l) => l.href === pathname || (pathname.startsWith(l.href) && l.href !== "/admin"))?.label || "Dashboard"}
            </h2>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-400 hover:text-[var(--clr-primary)] transition-colors">
                Siteyi Görüntüle →
              </Link>
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
