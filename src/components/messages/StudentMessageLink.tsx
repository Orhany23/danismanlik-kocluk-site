"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function StudentMessageLink() {
  const [unread, setUnread] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    let pending = false;
    const load = async () => {
      if (document.hidden || pending) return;
      pending = true;
      try {
        const res = await fetch("/api/student/messages/unread", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (mounted) setUnread(data.unread);
      } catch { if (mounted) setUnread(null); }
      finally { pending = false; }
    };
    void load();
    const timer = setInterval(() => void load(), 30000);
    document.addEventListener("visibilitychange", load);
    return () => { mounted = false; clearInterval(timer); document.removeEventListener("visibilitychange", load); };
  }, []);
  return <Link href="/ogrenci/mesajlar"><MessageCircle /><span><b>Mesajlarım {unread != null && unread > 0 && <span aria-label={`${unread} okunmamış mesaj`}>({unread})</span>}</b><small>{unread ? "Danışmanından yeni mesaj var" : "Danışmanına mesaj yaz"}</small></span><ArrowRight /></Link>;
}
