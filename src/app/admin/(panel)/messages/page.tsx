import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import AdminMessagesHome from "@/components/messages/AdminMessagesHome";
import { getPortalEmailStatus } from "@/lib/portalMessageNotifications";
import "@/components/messages/messages.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mesajlar | Yönetim", robots: { index: false, follow: false } };

export default async function AdminMessagesPage({ searchParams }: {
  searchParams: Promise<{ tab?: string; student?: string }>;
}) {
  if (!await requireAdmin()) redirect("/admin/login");
  const params = await searchParams;
  const person = typeof params.student === "string" ? await prisma.student.findUnique({
    where: { id: params.student }, select: { id: true, name: true, gradeLevel: true, active: true },
  }) : null;
  const emailStatus = await getPortalEmailStatus();
  return <AdminMessagesHome initialTab={params.tab === "contact" ? "contact" : "portal"} initialPerson={person} emailStatus={emailStatus} />;
}
