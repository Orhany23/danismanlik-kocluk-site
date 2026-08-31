import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import AdminChrome from "@/components/AdminChrome";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");
  return <AdminChrome>{children}</AdminChrome>;
}
