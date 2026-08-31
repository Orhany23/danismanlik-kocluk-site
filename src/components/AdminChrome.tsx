"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, CalendarDays, Users, ClipboardList, Mail, GraduationCap,
  Inbox, BookOpen, Star, Settings, LogOut, Menu, X, ExternalLink,
} from "lucide-react";
import { AdminDialogProvider } from "@/components/admin/DialogProvider";

type Counts = { messages: number; work: number; testimonials: number };

function badgeFor(href: string, c: Counts): number {
  if (href === "/admin/messages") return c.messages;
  if (href === "/admin/work") return c.work;
  if (href === "/admin/testimonials") return c.testimonials;
  return 0;
}

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Randevular", icon: CalendarDays },
  { href: "/admin/clients", label: "Danışanlar", icon: Users },
  { href: "/admin/sessions", label: "Seanslar", icon: ClipboardList },
  { href: "/admin/messages", label: "Mesajlar", icon: Mail },
  { href: "/admin/students", label: "Öğrenciler", icon: GraduationCap },
  { href: "/admin/work", label: "Öğrenci Çalışmaları", icon: Inbox },
  { href: "/admin/resources", label: "Kaynaklar", icon: BookOpen },
  { href: "/admin/testimonials", label: "Yorumlar", icon: Star },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
];

// Mobilde alt çubuk: günlük en sık dokunulan üç iş + menü
// (parmakla erişilebilir bölgede, 44px dokunma hedefi — WCAG 2.2 / iOS HIG).
const bottomBarLinks = [
  { href: "/admin/appointments", label: "Randevu", icon: CalendarDays },
  { href: "/admin/messages", label: "Mesaj", icon: Mail },
  { href: "/admin/work", label: "Çalışma", icon: Inbox },
];

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<Counts>({ messages: 0, work: 0, testimonials: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    fetch("/api/admin/counts", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCounts({ messages: d.messages ?? 0, work: d.work ?? 0, testimonials: d.testimonials ?? 0 }))
      .catch(() => {});
  }, [pathname]);

  // Escape ile kapat, odağı tetikleyiciye döndür
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = useCallback(
    (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)),
    [pathname]
  );

  const currentLabel =
    sidebarLinks.find((l) => l.href === pathname || (pathname.startsWith(l.href) && l.href !== "/admin"))?.label ||
    "Dashboard";

  const navList = (
    <nav className="flex-1 p-4 space-y-1">
      {sidebarLinks.map((link) => {
        const active = isActive(link.href);
        const Icon = link.icon;
        const badge = badgeFor(link.href, counts);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
              active ? "bg-[var(--clr-primary)] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span className="flex-1">{link.label}</span>
            {badge > 0 && (
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                  active ? "bg-white/25 text-white" : "bg-[var(--clr-primary)] text-white"
                }`}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const signOutButton = (
    <div className="p-4 border-t border-gray-100">
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-all min-h-[44px]"
      >
        <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
        Çıkış Yap
      </button>
    </div>
  );

  return (
    <AdminDialogProvider>
    <div className="min-h-screen flex bg-[#f5f7fa]">
      {/* Masaüstü kenar çubuğu */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-lg font-serif font-bold text-[var(--clr-navy)]">Yönetim Paneli</h1>
          <p className="text-xs text-gray-400 mt-0.5">Orhan Yaşlı</p>
        </div>
        {navList}
        {signOutButton}
      </aside>

      {/* Mobil çekmece */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="admin-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Panel menüsü"
            className="relative w-[86%] max-w-[300px] bg-white flex flex-col h-full shadow-xl"
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h1 className="text-base font-serif font-bold text-[var(--clr-navy)]">Yönetim Paneli</h1>
                <p className="text-xs text-gray-400 mt-0.5">Orhan Yaşlı</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Menüyü kapat"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navList}</div>
            {signOutButton}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                ref={menuButtonRef}
                onClick={() => setMenuOpen(true)}
                aria-label="Menüyü aç"
                aria-expanded={menuOpen}
                aria-controls="admin-mobile-menu"
                className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Menu size={20} aria-hidden="true" />
              </button>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{currentLabel}</h2>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[var(--clr-primary)] transition-colors shrink-0"
            >
              <span className="hidden sm:inline">Siteyi Görüntüle</span>
              <ExternalLink size={16} aria-hidden="true" />
            </Link>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 lg:pb-8">
          {children}
        </div>
      </div>

      {/* Mobil alt çubuk */}
      <nav
        aria-label="Hızlı gezinme"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {bottomBarLinks.map((link) => {
          const active = isActive(link.href);
          const Icon = link.icon;
          const badge = badgeFor(link.href, counts);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-[0.7rem] font-medium ${
                active ? "text-[var(--clr-primary)]" : "text-gray-500"
              }`}
            >
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              {link.label}
              {badge > 0 && (
                <span className="absolute top-1.5 right-[22%] min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--clr-primary)] text-white text-[0.65rem] font-semibold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menüyü aç"
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-menu"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-[0.7rem] font-medium text-gray-500"
        >
          <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
          Menü
        </button>
      </nav>
    </div>
    </AdminDialogProvider>
  );
}
