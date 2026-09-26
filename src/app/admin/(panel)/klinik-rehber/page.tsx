import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import KlinikRehberClient from "@/components/admin/KlinikRehberClient";

export const metadata: Metadata = {
  title: "Klinik Müdahale & Terapi Teknikleri Rehberi | Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function KlinikRehberPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  return <KlinikRehberClient />;
}
