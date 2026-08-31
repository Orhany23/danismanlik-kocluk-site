---

## [v4] — 31 Ağustos 2026 — UX yaması (NN/g · Baymard · GOV.UK · WCAG 2.2)

### Ana sayfa akışı
- Sıra karar akışına göre yenilendi: Hero → İki kapı → Paketler → Süreç → Yorumlar → Hakkımda → Kimler → Hizmetler → Keşif şeridi → Sınav takvimi → Günün kıvılcımı → SSS → İletişim.
- Paketler artık ilk ekranlardan biri; ziyaretçi ne aldığını erken görüyor.
- Makalelerin tam bölümü ana sayfadan çıkarıldı (`/makaleler` zaten var); yerine üç kartlık keşif şeridi geldi. `ArticlesSection` bileşeni kaldırıldı.

### Hero
- `min-height: 94vh` kaldırıldı, dolgular kompaktlaştı — bir sonraki bölüm daha erken görünür.
- H1 doğrudan hizmeti ve yeri söylüyor: "Çanakkale'de ve online: sınav koçluğu ve psikolojik danışmanlık." Şiirsel alıntı H1 olmaktan çıkıp altına alındı.
- Günün araştırması şeridi herodan çıkarıldı. Birincil CTA "Ücretsiz görüşme" (#contact), ikincil "Paketleri gör" (/paketler).
- Portre `onError` ile gizlenir; CSS'teki "OY" yer tutucu görünür kalır.

### Gezinme
- Navbar: Paketler · Hizmetler · Hakkımda · Makaleler · İletişim + birincil CTA "Ücretsiz görüşme".
- Mobil menü Escape ile kapanır ve odak tetikleyici butona döner (WCAG 2.2).
- `SiteChrome`: kamu navbarı, footer, WhatsApp butonu ve çerez şeridi artık `/admin` yanında `/ogrenci` altında da gizli.

### İçerik bölümleri
- Yeni "İki kapı" bölümü: Koçluk → `/paketler#kocluk`, Danışmanlık → `/paketler#danismanlik` (+ gizlilik cümlesi).
- Hizmetler: her grupta önce 3 kart, kalanı "Tümünü gör" ile açılır (progressive disclosure).
- Yorumlar: onaylı yorum yokken bölüm gizlenmiyor; açıkça "Örnek" etiketli iki alıntı ve "her yorum onaylanır" notu gösteriliyor.
- Sınavlar: "Tarihler ÖSYM/MEB duyurularına dayanır; resmi takvimi kontrol edin" uyarısı eklendi; +/− işaretleri Lucide ikonlarına geçti.
- SSS: fiyat yanıtı netleşti (Koçluk 7.000 ₺/ay, danışmanlık ilk görüşmede, tanışma ~20 dk ücretsiz); ikon `+` yerine dönen chevron.
- Footer: her bağlantı gerçek hedefe gidiyor (`/paketler#…`, `/#about`, `/#faq`, gizlilik modalı); dil anahtarı footer'a da eklendi.
- Çerez şeridi: "Oturum için zorunlu çerezler. Analitik yalnızca kabulde."

### İletişim formu
- Konu alanı serbest metinden üç seçenekli listeye döndü: Koçluk / Danışmanlık / Diğer.
- Başarı mesajı beklenti veriyor: "Mesajınız ulaştı. 24 saat içinde dönüş yapacağım."
- Zorunluluk yıldızı ekran okuyucuya "Zorunlu alan" olarak okunuyor; alanlara `autocomplete` eklendi.

### Öğrenci paneli
- Panelin ilk ekranında iki kart: **Sonraki seans** (bağlı danışan üzerinden en yakın randevu/seans, yoksa "Henüz seans yok") ve **Koçun son notu** (son `StudentWork.feedback`).
- Kütüphane boş durumu: "Orhan senin için kaynak eklediğinde burada görünür."
- Giriş sayfasına "Şifremi unuttum" → hazır WhatsApp mesajı.
- `requireStudent` artık `clientId` de döndürüyor.

### Admin paneli
- Emoji ikonlar Lucide setiyle değiştirildi (kenar çubuğu, dashboard kartları, mesaj/çalışma/kaynak ekranları).
- Mobil: üstte hamburger + çekmece menü, altta hızlı gezinme çubuğu (Randevu, Mesaj, Çalışma, Menü); dokunma hedefleri ≥44px.
- `confirm()` / `alert()` yerine panel içi diyalog (`AdminDialogProvider`): `role="alertdialog"`, Escape ile kapanır, odağı geri verir.
- Ayarlar: alandan çıkınca sessiz kayıt kaldırıldı; tek "Değişiklikleri kaydet" butonu, "geri al" seçeneği ve kaydedilmemiş değişiklik durumu.

### i18n
- Yeni anahtarlar TR + EN: `nav.packages`, `hero.quote`, `hero.cta.packages`, `gateway.*`, `discover.*`, `contact.form.topics`, `services.showAll/showLess`, `testimonials.samples/moderationNote`, `exams.disclaimer`, `footer.langLabel`.

## [v3] — 14 Haziran 2026 — Öğrenci paneli altyapısı (Kaynaklar)
Ne değişti:
- Öğrenci panelindeki "Çok Yakında" kartları gerçek özelliğe dönüştü: Kaynak Kütüphanesi + Sana Özel İçerikler.
- Yeni veritabanı modeli Resource (kaynak): tür (bağlantı/video/dosya/not), kategori, seviye, herkese açık ya da bir öğrenciye özel.
- Admin paneline "Kaynaklar" sekmesi eklendi.
- Öğrenci paneli gerçek içerikleri listeler; içerik yoksa nazik boş durum gösterir.
Dosyalar: prisma/schema.prisma, src/app/api/admin/resources/route.ts, src/app/api/admin/resources/[id]/route.ts, src/app/admin/resources/page.tsx, src/app/admin/layout.tsx, src/app/ogrenci/page.tsx, src/app/globals.css
Commit: bu commit
