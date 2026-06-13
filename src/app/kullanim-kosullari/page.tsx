export const metadata = {
  title: "Kullanım Koşulları | Orhan Yaşlı",
  description: "Platformun kullanım koşulları, seans kuralları ve yasal bilgiler.",
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <span className="inline-block bg-green-50 text-green-600 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            📋 Kullanım Koşulları
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hizmet Kullanım Koşulları
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Son güncelleme: Haziran 2026 · psdorhanyasli.com.tr
          </p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Hizmetin Kapsamı</h2>
            <p className="text-gray-600">
              Bu platform; bireysel psikolojik danışmanlık, koçluk ve rehberlik hizmetlerinin online
              olarak sunulduğu bir PDR platformudur. Sunulan hizmetler tıbbi tedavi veya psikiyatrik
              müdahale yerine geçmez.
            </p>
          </div>

          {[
            {
              title: "2. Kullanıcı Yükümlülükleri",
              items: [
                "Platforma gerçek bilgilerle kayıt olunması zorunludur.",
                "Hesap bilgilerinin üçüncü kişilerle paylaşılması yasaktır.",
                "Platform yalnızca yasal ve etik amaçlarla kullanılabilir.",
                "Seans içerikleri kayıt altına alınamaz, paylaşılamaz.",
              ],
            },
            {
              title: "3. Seans & Randevu Koşulları",
              items: [
                "İptal bildirimleri en az 24 saat öncesinde yapılmalıdır.",
                "Geç iptallerde seans ücreti iade edilmeyebilir.",
                "Online seanslar için stabil internet bağlantısı kullanıcının sorumluluğundadır.",
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
            <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Acil Durum Bildirimi</h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg text-amber-800 text-sm">
              ⚠️ Platform bir kriz müdahale hizmeti değildir. Acil durumlarda lütfen{" "}
              <strong>182 (ALO Psikiyatri Hattı)</strong> veya <strong>112</strong>&apos;yi arayın.
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Fikri Mülkiyet</h2>
            <p className="text-gray-600">
              Platform üzerindeki tüm içerikler danışmana aittir. İzinsiz kopyalanması veya
              dağıtılması yasaktır.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Sorumluluk Sınırı</h2>
            <p className="text-gray-600">
              Teknik kesintiler, kullanıcı hatası veya mücbir sebepten kaynaklanan zararlardan
              platform sorumlu tutulamaz.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">7. Değişiklikler</h2>
            <p className="text-gray-600">
              Koşullar önceden bildirim yapılarak güncellenebilir. Platformu kullanmaya devam etmek
              güncel koşulların kabulü anlamına gelir.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">8. Uygulanacak Hukuk</h2>
            <p className="text-gray-600">
              Anlaşmazlıklarda Türk Hukuku uygulanır; yetkili mahkemeler Çanakkale
              Mahkemeleridir.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="/gizlilik"
              className="flex-1 text-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              🔒 Gizlilik Politikası
            </a>
            <a
              href="/"
              className="flex-1 text-center bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors text-sm"
            >
              ← Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
