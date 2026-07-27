import Link from "next/link";
import { LEGAL_UPDATED, LEGAL_EMAIL } from "@/lib/legal";

export const metadata = {
  title: "Gizlilik Politikası | Orhan Yaşlı",
  description: "Kişisel verilerin korunması hakkında bilgi edinin. KVKK kapsamında gizlilik politikamız.",
  alternates: { canonical: "/gizlilik" },
};

// Bu sayfa gizlilik metninin TEK kaynağıdır. Daha önce aynı metnin bir de
// modal içinde ayrı bir kopyası vardı ve ikisi birbiriyle çelişiyordu
// (iptal süresi, acil hat vb.). Footer ve çerez bandı artık buraya bağlanır.
export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <span className="inline-block bg-[var(--clr-accent-tint)] text-[var(--clr-primary)] text-sm font-semibold px-3 py-1 rounded-full mb-4">
            🔒 Gizlilik Politikası
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kişisel Verilerin Korunması</h1>
          <p className="text-gray-500 text-sm mb-8">
            Son güncelleme: {LEGAL_UPDATED} · psdorhanyasli.com.tr
          </p>

          <p className="text-gray-600 mb-8">
            Bu politika, psdorhanyasli.com.tr üzerinden toplanan kişisel verilerin nasıl işlendiğini
            açıklar. 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca veri
            sorumlusu <strong>Orhan Yaşlı</strong>&apos;dır.
          </p>

          <Section title="1. İşlenen Veriler ve Amaçları">
            <p className="mb-2">
              <strong>İletişim formu:</strong> Ad-soyad, telefon, e-posta, konu ve mesaj içeriği.
              Talebinize dönüş yapmak, randevu oluşturmak ve danışmanlık sürecini yürütmek amacıyla
              işlenir.
            </p>
            <p className="mb-2">
              <strong>Öğrenci portalı hesabı:</strong> Ad-soyad, e-posta, şifre (geri döndürülemez
              biçimde şifrelenmiş olarak saklanır), hedef sınav bilgisi ve veli onayı kaydı.
            </p>
            <p className="mb-2">
              <strong>Portal içeriği:</strong> Öğrencinin paylaştığı çalışma notları, bağlantılar,
              PDF ve fotoğraflar ile koçun bu çalışmalara yazdığı değerlendirmeler.
            </p>
            <p className="mb-2">
              <strong>Danışan kayıtları:</strong> Randevu, seans ve süreç notları; hizmetin
              yürütülmesi ve takibi amacıyla işlenir.
            </p>
            <p>
              <strong>Teknik veriler:</strong> Site altyapısının çalışması için zorunlu kayıtlar
              (ör. sunucu günlükleri, oturum bilgisi).
            </p>
          </Section>

          <Section title="2. Hizmet Sağlayıcılar (Veri İşleyenler)">
            <p className="mb-2">
              Verileriniz pazarlama amacıyla üçüncü kişilerle paylaşılmaz ve satılmaz. Hizmetin
              sunulabilmesi için aşağıdaki altyapılar kullanılır:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Vercel</strong> — site barındırma ve yüklenen dosyaların depolanması</li>
              <li><strong>PostgreSQL veritabanı</strong> — kayıtların saklanması</li>
              <li><strong>Telegram</strong> — iletişim formu bildirimlerinin koça iletilmesi</li>
              <li><strong>WhatsApp</strong> — tercih etmeniz hâlinde mesajlaşma</li>
            </ul>
            <p className="mt-2">
              Yasal yükümlülük hâlinde yetkili mercilere aktarım yapılabilir.
            </p>
          </Section>

          <Section title="3. Yüklenen Dosyaların Gizliliği">
            <p>
              Öğrenci portalına yüklenen PDF ve fotoğraflar <strong>herkese açık değildir</strong>;
              yalnızca dosyayı yükleyen öğrenci ve koç görüntüleyebilir. Dosyalar kimlik doğrulaması
              yapılan bir bağlantı üzerinden sunulur.
            </p>
          </Section>

          <Section title="4. Saklama Süresi">
            <p>
              Veriler, işleme amacının gerektirdiği süre ve ilgili mevzuattaki zamanaşımı/saklama
              süreleri boyunca muhafaza edilir; sonrasında silinir veya anonim hâle getirilir.
              Portal hesabınızın ve içeriğinizin silinmesini talep edebilirsiniz.
            </p>
          </Section>

          <Section title="5. Danışmanlık Gizliliği">
            <p>
              Danışmanlık görüşmelerinde paylaşılan bilgiler mesleki gizlilik ilkeleri çerçevesinde
              korunur. Kendisine veya başkasına zarar verme riski ile yasal bildirim yükümlülüğü
              doğuran hâller bu gizliliğin istisnasıdır.
            </p>
          </Section>

          <Section title="6. Reşit Olmayanlar">
            <p>
              18 yaş altı ziyaretçilerin veri paylaşımının veli/vasi bilgisi dâhilinde yapılması
              beklenir. Portal hesabı oluşturulurken veli onayı beyanı alınır; hizmet süreçlerinde
              reşit olmayan danışanlar için veli onayı esastır. Veli olarak çocuğunuza ait verilerin
              silinmesini her zaman talep edebilirsiniz.
            </p>
          </Section>

          <Section title="7. Çerezler ve Ziyaret İstatistikleri">
            <p className="mb-2">
              Oturum yönetimi için <strong>zorunlu çerezler</strong> kullanılır; bunlar olmadan
              giriş yapılamaz.
            </p>
            <p>
              Ziyaret istatistikleri için <strong>çerez kullanmayan</strong> ve kişi bazlı takip
              yapmayan bir ölçümleme (Vercel Analytics) kullanılır; reklam amaçlı izleme yapılmaz.
            </p>
          </Section>

          <Section title="8. Haklarınız (KVKK m. 11)">
            <p className="mb-2">
              Verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya
              silinmesini isteme, işlemeye itiraz etme ve veri taşınabilirliği haklarına sahipsiniz.
            </p>
            <p>
              Başvurularınız için: <a href={`mailto:${LEGAL_EMAIL}`} className="text-[var(--clr-primary)] hover:underline">{LEGAL_EMAIL}</a>
            </p>
          </Section>

          <div className="bg-gray-50 rounded-xl p-5 mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">İletişim &amp; Başvuru</h2>
            <p className="text-gray-600 text-sm">
              <strong>Veri Sorumlusu:</strong> Orhan Yaşlı
              <br />
              <strong>E-posta:</strong>{" "}
              <a href={`mailto:${LEGAL_EMAIL}`} className="text-[var(--clr-primary)] hover:underline">{LEGAL_EMAIL}</a>
              <br />
              <strong>Konum:</strong> Çanakkale, Türkiye
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Ayrıca bkz.{" "}
              <Link href="/kullanim-kosullari" className="text-[var(--clr-primary)] hover:underline">
                Kullanım Koşulları
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
