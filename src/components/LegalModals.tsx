"use client";

export default function LegalModals() {
  const closeModal = (id: string) => {
    document.getElementById(id)?.classList.remove("show");
  };

  const handleOverlayClick = (e: React.MouseEvent, id: string) => {
    if (e.target === e.currentTarget) closeModal(id);
  };

  return (
    <>
      {/* GİZLİLİK POLİTİKASI MODAL */}
      <div
        id="modal-privacy"
        className="modal-overlay"
        onClick={(e) => handleOverlayClick(e, "modal-privacy")}
      >
        <div className="modal-box">
          <button className="modal-close" onClick={() => closeModal("modal-privacy")}>✕</button>
          <div id="modal-privacy-content">
            <h2 className="text-2xl font-bold mb-1">Gizlilik Politikası</h2>
            <p className="text-sm text-gray-400 mb-6">Son güncelleme: Haziran 2026 · psdorhanyasli.com.tr</p>

            <p className="text-gray-300 mb-5">
              Bu politika, platformumuzu kullanan kişilerin kişisel verilerinin nasıl toplandığını,
              işlendiğini ve korunduğunu açıklar. 6698 sayılı KVKK kapsamında hazırlanmıştır.
            </p>

            <h3 className="font-semibold text-lg mb-2">1. Toplanan Veriler</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-5">
              <li>Kimlik bilgileri: Ad, soyad</li>
              <li>İletişim bilgileri: E-posta, telefon numarası</li>
              <li>Danışmanlık sürecine ait mesaj ve randevu içerikleri</li>
              <li>Teknik veriler: IP adresi, tarayıcı türü, oturum bilgileri</li>
            </ul>

            <h3 className="font-semibold text-lg mb-2">2. Verilerin İşlenme Amacı</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-5">
              <li>Psikolojik danışmanlık ve koçluk hizmetinin sunulması</li>
              <li>Randevu yönetimi ve hatırlatmalar</li>
              <li>WhatsApp Business üzerinden iletişim (açık rıza ile)</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>

            <h3 className="font-semibold text-lg mb-2">3. Verilerin Saklanması</h3>
            <p className="text-gray-300 mb-5">
              Verileriniz, hizmet ilişkisi süresince ve yasal süreler dolana kadar saklanır.
              Sözleşme sona erdiğinde güvenli biçimde silinir veya anonimleştirilir.
            </p>

            <h3 className="font-semibold text-lg mb-2">4. Üçüncü Taraflarla Paylaşım</h3>
            <p className="text-gray-300 mb-5">
              Kişisel verileriniz hiçbir koşulda üçüncü taraflara satılmaz. Yalnızca yasal
              zorunluluk halinde yetkili kurumlarla paylaşılabilir. Teknik altyapı için Vercel
              (hosting) kullanılmaktadır; bu sağlayıcı veri işleyen sıfatıyla hareket eder.
            </p>

            <h3 className="font-semibold text-lg mb-2">5. Haklarınız (KVKK Md. 11)</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-5">
              <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Verilere erişim ve düzeltme talep etme</li>
              <li>Silinmesini veya yok edilmesini isteme</li>
              <li>İşlemeye itiraz etme ve veri taşınabilirliği</li>
            </ul>

            <div className="bg-white/5 rounded-xl p-4 mt-4">
              <p className="text-sm text-gray-300">
                <strong>Veri Sorumlusu:</strong> Orhan Yaşlı · Çanakkale, Türkiye
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KULLANIM KOŞULLARI MODAL */}
      <div
        id="modal-terms"
        className="modal-overlay"
        onClick={(e) => handleOverlayClick(e, "modal-terms")}
      >
        <div className="modal-box">
          <button className="modal-close" onClick={() => closeModal("modal-terms")}>✕</button>
          <div id="modal-terms-content">
            <h2 className="text-2xl font-bold mb-1">Kullanım Koşulları</h2>
            <p className="text-sm text-gray-400 mb-6">Son güncelleme: Haziran 2026 · psdorhanyasli.com.tr</p>

            <h3 className="font-semibold text-lg mb-2">1. Hizmetin Kapsamı</h3>
            <p className="text-gray-300 mb-5">
              Bu platform; psikolojik danışmanlık, sınav koçluğu ve rehberlik hizmetlerinin online
              sunulduğu bir PDR platformudur. Sunulan hizmetler tıbbi tedavi veya psikiyatrik
              müdahale yerine geçmez.
            </p>

            <h3 className="font-semibold text-lg mb-2">2. Kullanıcı Yükümlülükleri</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-5">
              <li>Platforma gerçek bilgilerle kayıt olunması zorunludur.</li>
              <li>Hesap bilgilerinin üçüncü kişilerle paylaşılması yasaktır.</li>
              <li>Platform yalnızca yasal ve etik amaçlarla kullanılabilir.</li>
              <li>Seans içerikleri kayıt altına alınamaz, paylaşılamaz.</li>
            </ul>

            <h3 className="font-semibold text-lg mb-2">3. Seans & Randevu Koşulları</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-5">
              <li>İptal bildirimleri en az 24 saat öncesinde yapılmalıdır.</li>
              <li>Geç iptallerde seans ücreti iade edilmeyebilir.</li>
              <li>Online seanslar için stabil internet bağlantısı kullanıcının sorumluluğundadır.</li>
            </ul>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-5">
              <p className="text-amber-300 text-sm">
                ⚠️ Platform bir kriz müdahale hizmeti değildir. Acil durumlarda{" "}
                <strong>182 (ALO Psikiyatri)</strong> veya <strong>112</strong>&apos;yi arayın.
              </p>
            </div>

            <h3 className="font-semibold text-lg mb-2">4. Fikri Mülkiyet</h3>
            <p className="text-gray-300 mb-5">
              Platform üzerindeki tüm içerikler danışmana aittir. İzinsiz kopyalanması veya
              dağıtılması yasaktır.
            </p>

            <h3 className="font-semibold text-lg mb-2">5. Sorumluluk & Hukuk</h3>
            <p className="text-gray-300 mb-2">
              Teknik kesintiler veya mücbir sebepten kaynaklanan zararlardan platform sorumlu tutulamaz.
            </p>
            <p className="text-gray-300">
              Anlaşmazlıklarda Türk Hukuku uygulanır; yetkili mahkemeler Çanakkale Mahkemeleridir.
            </p>
          </div>
        </div>
      </div>

      {/* ÇEREZLER MODAL */}
      <div
        id="modal-cookies"
        className="modal-overlay"
        onClick={(e) => handleOverlayClick(e, "modal-cookies")}
      >
        <div className="modal-box">
          <button className="modal-close" onClick={() => closeModal("modal-cookies")}>✕</button>
          <div id="modal-cookies-content">
            <h2 className="text-2xl font-bold mb-4">Çerez Politikası</h2>
            <p className="text-gray-300 mb-4">
              Oturum yönetimi için zorunlu çerezler kullanılmaktadır. Analitik çerezler
              yalnızca açık onayınız ile aktif hale gelir.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
