import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * Hazır psikoeğitim şablonlarını (isTemplate: true) tek seferde oluşturur.
 * Aynı başlık zaten varsa tekrar oluşturmaz (idempotent) — admin panelden
 * "Hazır şablonları yükle" butonuna birden fazla kez basılsa bile kaynak
 * çoğalmaz.
 *
 * İçerikler: Türkiye Psikiyatri Derneği'nin halka yönelik anksiyete/panik
 * atak tanımları ve APA (1997) / alan yazınındaki psikolojik danışma
 * tanımı temel alınarak özgün biçimde yazılmıştır — kaynak, her metnin
 * sonunda ayrıca belirtilir.
 */
const TEMPLATES: { title: string; category: string; body: string }[] = [
  {
    title: "Anksiyete Nedir?",
    category: "Psikoeğitim",
    body: `Anksiyete, henüz gerçekleşmemiş bir tehdit ya da belirsizlik karşısında yaşanan yoğun kaygı, huzursuzluk ve gerginlik halidir. Belirli bir düzeyde anksiyete normaldir; bizi tetikte tutar, harekete geçirir. Ancak süresi, şiddeti ya da sıklığı yaşamı (iş, okul, ilişkiler) olumsuz etkilemeye başladığında klinik anlamda değerlendirilmesi gereken bir durum haline gelir.

Sık görülen belirtiler arasında sürekli endişe, kas gerginliği, yorgunluk, uyku sorunları, odaklanma güçlüğü ve kalp çarpıntısı gibi bedensel tepkiler sayılabilir. Anksiyetenin genetik yatkınlık, kişilik özellikleri ve yaşanan stresli olaylar gibi birden fazla nedeni olabilir; tek bir sebebe bağlamak genellikle doğru değildir.

İyi haber: anksiyete bozuklukları, psikoterapi ve gerektiğinde uzman desteğiyle etkili biçimde yönetilebilir bir alandır.

—
Bu metin genel bilgilendirme amaçlıdır; tanı ya da tedavi yerine geçmez.
Kaynak: Türkiye Psikiyatri Derneği'nin halka yönelik anksiyete bozuklukları tanımları temel alınarak hazırlanmıştır.`,
  },
  {
    title: "Panik Atak Nedir?",
    category: "Psikoeğitim",
    body: `Panik atak; aniden başlayan, birkaç dakika içinde en yoğun noktasına ulaşan ve genellikle 10-30 dakika içinde kendiliğinden geçen, yoğun korku ya da rahatsızlık nöbetidir.

Çarpıntı, nefes darlığı, göğüste sıkışma, terleme, titreme, baş dönmesi, uyuşma-karıncalanma gibi bedensel belirtilerle birlikte kontrolünü kaybetme ya da "bir şey olacak" hissi eşlik edebilir. Bu belirtiler kalple ya da başka bir organla ilgili bir hastalığa işaret etmez; vücudun tehlike anında verdiği doğal "kaç ya da savaş" tepkisinin fazla şiddetli çalışmasıdır.

Panik atak tek başına bir kez de yaşanabilir; tekrarlayıcı hale gelip atak yaşama korkusuyla belirli yer/durumlardan kaçınma başladığında "panik bozukluk"tan söz edilir ve bu, tedavi edilebilir bir durumdur.

—
Bu metin genel bilgilendirme amaçlıdır; acil tıbbi değerlendirmenin yerini tutmaz.
Kaynak: Türkiye Psikiyatri Derneği Anksiyete Bozuklukları Bilimsel Çalışma Birimi'nin panik atak tanımları temel alınarak hazırlanmıştır.`,
  },
  {
    title: "Panik Atakla Nasıl Mücadele Edilir?",
    category: "Psikoeğitim",
    body: `Bir atak sırasında amaç "atağı durdurmak" değil, bedenin doğal seyrini tamamlamasına izin vermektir — atak, ne yaparsanız yapın birkaç dakika içinde geriler.

Yardımcı olabilecek birkaç yöntem:
1) Yavaş, derin nefes — 4 saniye burundan al, 4 saniye tut, 6-8 saniyede ağızdan ver.
2) 5-4-3-2-1 tekniği — görebildiğin 5, dokunabildiğin 4, duyabildiğin 3, koklayabildiğin 2, tadabildiğin 1 şeyi say; bu zihni "an"a geri getirir.
3) Kendine hatırlat: "Bu tehlikeli değil, geçici, daha önce de geçti."
4) Kaçmak yerine mümkünse olduğun yerde kal — kaçınma, uzun vadede korkuyu pekiştirir.

Ataklar sık tekrarlıyorsa, bir uzmanla (bilişsel davranışçı terapi başta olmak üzere) çalışmak, hem atak sıklığını azaltmada hem de tetikleyicileri anlamada en etkili yoldur.

—
Bu metin genel bilgilendirme amaçlıdır; kişiye özel destek için danışmanlık sürecimiz devam ediyor.
Kaynak: Bilişsel Davranışçı Terapi (BDT) yaklaşımı ve Türkiye Psikiyatri Derneği'nin panik atak baş etme önerileri temel alınarak hazırlanmıştır.`,
  },
  {
    title: "Psikolojik Danışma Nedir, Nasıl Yapılır?",
    category: "Psikoeğitim",
    body: `Psikolojik danışma; bir sorunu olan kişi (danışan) ile bu konuda eğitim almış bir uzman (danışman) arasında, güvenli ve gizliliğe dayalı bir ortamda yürütülen, kişinin kendini daha iyi tanımasını, zorluklarıyla baş etme yollarını keşfetmesini ve hedeflerine ulaşmasını destekleyen profesyonel bir süreçtir.

Yaygın bir yanılgının aksine, yalnızca "ağır" psikolojik sorunları olanlar için değildir — ilişkilerini geliştirmek, özgüvenini artırmak, kaygısıyla baş etmek ya da hayatındaki bir değişimi anlamlandırmak isteyen herkes bu süreçten yararlanabilir.

Görüşmeler genellikle danışanın kendi sözleriyle durumunu anlatmasıyla başlar; danışman yargılamadan dinler, doğru soruları sorar ve danışanın kendi çözümlerini bulmasına eşlik eder. Süreç, kişiye ve hedefe göre birkaç seans sürebileceği gibi daha uzun soluklu da olabilir.

—
Kaynak: Amerikan Psikolojik Danışma Derneği'nin (APA, 1997) psikolojik danışma tanımı ve alan yazını temel alınarak hazırlanmıştır.`,
  },
];

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.resource.findMany({
    where: { isTemplate: true, title: { in: TEMPLATES.map((t) => t.title) } },
    select: { title: true },
  });
  const existingTitles = new Set(existing.map((r: { title: string }) => r.title));
  const toCreate = TEMPLATES.filter((t) => !existingTitles.has(t.title));

  if (toCreate.length === 0) {
    return NextResponse.json({ created: 0, message: "Zaten yüklü." });
  }

  await prisma.resource.createMany({
    data: toCreate.map((t) => ({
      title: t.title,
      category: t.category,
      type: "NOTE",
      body: t.body,
      studentId: null,
      isTemplate: true,
      published: true,
    })),
  });

  return NextResponse.json({ created: toCreate.length });
}
