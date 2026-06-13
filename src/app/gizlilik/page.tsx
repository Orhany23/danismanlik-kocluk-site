export const metadata = {
  title: "Gizlilik Politikası | Orhan Yaşlı",
  description: "Kişisel verilerin korunması hakkında bilgi edinin. KVKK kapsamında gizlilik politikamız.",
  alternates: { canonical: "/gizlilik" },
};

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            🔒 Gizlilik Politikası
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kişisel Verilerin Korunması
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Son güncelleme: Haziran 2026 · psdorhanyasli.com.tr
          </p>

          <p className="text-gray-600 mb-6">
            Bu politika, platformumuzu kullanan kişilerin kişisel verilerinin nasıl toplandığını,
            işlendiğini ve korunduğunu açıklar. 6698 sayılı KVKK ve GDPR kapsamında hazırlanmıştır.
          </p>

          {[
            {
              title: "1. Toplanan Veriler",
              items: [
                "Kimlik bilgileri: Ad, soyad",
                "İletişim bilgileri: E-posta adresi, telefon numarası",
                "Randevu & mesaj içerikleri: Danışmanlık sürecine ait iletişimler",
                "Teknik veriler: IP adresi, tarayıcı türü, oturum bilgileri",
              ],
            },
            {
              title: "2. Verilerin İşlenme Amacı",
              items: [
                "Psikolojik danışmanlık hizmetinin sunulması",
                "Randevu yönetimi ve hatırlatmalar",
                "WhatsApp Business üzerinden iletişim (açık rıza ile)",
                "Yasal yükümlülüklerin yerine getirilmesi",
              ],
            },
            {
              title: "6. Haklarınız (KVKK Md. 11)",
              items: [
                "Verilerinizin işlenip işlenmediğini öğrenme",
                "Verilere erişim ve düzeltme talep etme",
                "Silinmesini veya yok edilmesini isteme",
                "İşlemeye itiraz etme ve veri taşınabilirliği",
              ],
            },
          ].map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Verilerin Saklanması</h2>
            <p className="text-gray-600">
              Verileriniz, hizmet ilişkisi süresince ve ilgili yasal süreler dolana kadar saklanır.
              Sözleşme sona erdiğinde veriler güvenli biçimde silinir veya anonimleştirilir.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Üçüncü Taraflarla Paylaşım</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-3 text-blue-800 text-sm">
              Kişisel verileriniz hiçbir koşulda üçüncü taraflara satılmaz. Yalnızca yasal zorunluluk
              halinde yetkili kurumlarla paylaşılabilir.
            </div>
            <p className="text-gray-600">
              Teknik altyapı için Vercel (hosting) ve Prisma destekli veritabanı hizmetlerinden
              yararlanılmaktadır. Bu sağlayıcılar veri işleyen sıfatıyla hareket eder.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Çerezler (Cookies)</h2>
            <p className="text-gray-600">
              Oturum yönetimi için zorunlu çerezler kullanılmaktadır. Analitik çerezler yalnızca
              açık onayınız ile aktif hale gelir.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">İletişim & Başvuru</h2>
            <p className="text-gray-600 text-sm">
              <strong>Veri Sorumlusu:</strong> Orhan Yaşlı
              <br />
              <strong>Web:</strong>{" "}
              <a href="https://psdorhanyasli.com.tr" className="text-blue-600 hover:underline">
                psdorhanyasli.com.tr
              </a>
              <br />
              <strong>Konum:</strong> Çanakkale, Türkiye
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
