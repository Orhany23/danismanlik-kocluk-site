# Değişiklik Notları — 12 Haziran 2026

Claude tarafından yapılan güvenlik ve SEO iyileştirmeleri.

## 🔒 Güvenlik Düzeltmeleri

### 1. `/api/seed` güvenli hale getirildi
**Sorun:** Bu endpoint herkese açıktı ve sabit `admin@danismanlik.com / admin123` bilgileriyle admin hesabı oluşturuyordu. Bu bilgiler public GitHub reposunda görülebiliyordu — yani herkes admin paneline girebilirdi.

**Çözüm:** Route artık `SEED_SECRET` ortam değişkeni olmadan 404 döner. Admin e-posta/şifresi de env'den okunur:
- `SEED_SECRET` — rastgele uzun bir string
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`

Kullanım: `GET /api/seed?secret=SEED_SECRET_DEGERI`

> ⚠️ **YAPILACAK:** Canlıdaki mevcut admin kullanıcısının şifresini değiştir! Eski şifre hâlâ `admin123` ise site risk altında.

### 2. `/api/telegram` silindi → yerine `/api/contact` geldi
**Sorun:** Eski endpoint korumasızdı; herkes sınırsız sayıda istek atıp Telegram'ına spam gönderebilirdi. Ayrıca form mesajları sadece Telegram'a gidiyordu — Telegram başarısız olursa mesaj tamamen kayboluyordu.

**Çözüm:** Yeni `/api/contact` endpoint'i:
- Mesajı **önce veritabanına kaydeder** (admin panelindeki Mesajlar sayfasında görünür)
- Sonra Telegram bildirimi gönderir (başarısız olsa bile mesaj kaybolmaz)
- **Rate limit:** Aynı IP'den 10 dakikada en fazla 5 mesaj
- **Honeypot:** Botların doldurduğu gizli alan ile spam filtreleme
- **Input validasyonu:** İsim/mesaj zorunlu, uzunluk sınırları var
- Markdown parse kaldırıldı (Telegram'a injection yapılamaz)

### 3. İletişim formu güncellendi
`ContactSection.tsx` yeni endpoint'e bağlandı ve görünmez honeypot alanı eklendi.

## 📈 SEO İyileştirmeleri

### 4. `robots.txt` eklendi (`src/app/robots.ts`)
`/admin` ve `/api` arama motorlarından gizlendi, sitemap adresi bildirildi.

### 5. `sitemap.xml` eklendi (`src/app/sitemap.ts`)

### 6. `layout.tsx` metadata iyileştirmeleri
- `metadataBase` tanımlandı (OG/Twitter görselleri artık doğru çözümlenir)
- Canonical URL eklendi
- **JSON-LD yapılandırılmış veri** eklendi (ProfessionalService şeması) — "Çanakkale sınav koçu" gibi yerel aramalarda Google'ın işi anlaması için

## 📋 Push Sonrası Yapılacaklar Listesi

1. ✅ Vercel → Settings → Environment Variables → `SEED_SECRET` ekle (seed kullanmayacaksan opsiyonel)
2. ⚠️ **Canlıdaki admin şifresini değiştir** (en acil madde)
3. 🔑 GitHub'da bu iş için oluşturduğun token'ı revoke et
4. 🖼️ İleride: bir OG görseli ekle (`opengraph-image.png`) — sosyal medya paylaşımlarında görsel çıkar
5. 🧹 İleride: `public/` içindeki kullanılmayan Next.js varsayılan SVG'lerini sil
6. 📝 İleride: `admin/page.tsx`'teki 2 adet TypeScript `implicit any` hatasını düzelt (önceden vardı, kritik değil)

## Bilinen Notlar

- Rate limit in-memory çalışır; Vercel'de her serverless instance kendi sayacını tutar. İlk savunma için yeterli, ileride Upstash Redis ile kalıcı hale getirilebilir.
- Honeypot alanının adı `website` — gerçek kullanıcılar görmez, dolduran istekler sessizce yutulur.

---

# Ek Değişiklikler — 12 Haziran 2026 (2. tur)

## 7. Şifre değiştirme özelliği eklendi
Admin panelinde şifre değiştirme ekranı yoktu. Eklenenler:
- `api/auth/change-password` — mevcut şifre doğrulaması + bcrypt ile yeni şifre (min. 8 karakter)
- Ayarlar sayfasının altına "Şifre Değiştir" kartı (mevcut şifre, yeni şifre, tekrar)

## 8. Site menüsünün admin paneline binmesi düzeltildi
Site navbar'ı, footer ve WhatsApp butonu root layout'ta her sayfada render ediliyordu; admin panel başlığının üstüne biniyordu. Yeni `SiteChrome.tsx` bileşeni `/admin` altında bunları gizler.

## 9. Navbar şeffaflık sorunu düzeltildi
Navbar'da çalışmayan bir `scrolled:` varyantı vardı; arka plan hiç devreye girmediği için sayfa içeriği menünün altından geçerken yazılar üst üste biniyordu. Navbar'a kalıcı yarı saydam + blur arka plan ve gölge verildi.

## 10. Görsel iyileştirmeler (çeki düzen turu)
- **Hero arka planı:** Hero'nun kendi arka planı yoktu; yarı saydam karartma açık mavi sayfa zemini üzerine bindiği için soluk görünüyordu. Artık koyu lacivert degrade zemin var — beyaz yazılar net, partikül animasyonu belirgin.
- **Renk uyumu:** Başlıktaki turuncu vurgu, mavi paletle çakışıyordu → gök mavisi degradeye çevrildi.
- **Butonlar:** Abartılı gölge ve büyüme efekti sadeleştirildi.
- **Kartlar:** Dinlenme halinde hafif gölge eklendi (derinlik hissi).
- **Bölüm aralıkları:** Masaüstünde 96px, mobilde 64px; menüden tıklayınca bölüm başlığı artık sabit menünün altında kalmıyor (scroll-margin düzeltmesi).
- **Tipografi:** Büyük başlıklarda harf aralığı sıkılaştırıldı, daha derli toplu görünüm.
- **Mobil menü eklendi:** Telefonda menü linkleri tamamen kayboluyordu — hamburger menü ve açılır panel eklendi.
- **Erişilebilirlik:** "Hareketi azalt" tercihi olan kullanıcılar için animasyonlar kapatılıyor.

## 11. Sınavlar bölümüne bilimsel çalışma teknikleri kartları eklendi
İki yeni kart (TR + EN):
- **Bilimsel Kanıtlı Çalışma Teknikleri:** Aktif Hatırlama (retrieval practice) ve Aralıklı Tekrar (spaced repetition) — eğitim bilimlerinde en güçlü kanıta sahip iki teknik, pratik kullanım örnekleriyle.
- **Verimli Çalışma Düzeni:** Önce hatırlama → odaklı bloklar (Pomodoro) → ders karıştırma (interleaving) → anlatarak öğrenme (Feynman), artı uykunun öğrenmedeki rolü.
Yeni kartlar için iki ikon eklendi.

## 12. OG görseli, favicon ve uygulama ikonları
- `opengraph-image.png` / `twitter-image.png`: Site WhatsApp, Instagram, X vb. yerlerde paylaşıldığında artık markalı bir kart görseli çıkar (lacivert zemin, logo, başlık, konum rozetleri).
- `icon.png`, `apple-icon.png`, `favicon.ico`: Varsayılan Next.js faviconu yerine marka renkleriyle logo ikonu.
- `public/` içindeki kullanılmayan Next.js varsayılan SVG'leri silindi.
