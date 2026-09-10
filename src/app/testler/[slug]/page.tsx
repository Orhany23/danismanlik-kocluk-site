import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { getTestBySlug } from "@/lib/psychTests";
import PsychTestClient from "@/components/PsychTestClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const test = getTestBySlug(slug);
  if (!test) return {};
  return {
    title: `${test.title} | Orhan Yaşlı`,
    description: test.shortDesc,
    alternates: { canonical: `/testler/${test.slug}` },
    robots: { index: false, follow: false },
  };
}

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const student = await requireStudent();
  if (!student) redirect("/ogrenci/giris");

  const { slug } = await params;
  const test = getTestBySlug(slug);
  if (!test) notFound();

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <PsychTestClient test={test} />
      </div>
    </main>
  );
}
