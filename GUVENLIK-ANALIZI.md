# Güvenlik Analizi — psdorhanyasli.com.tr

Tarih: 31 Ağustos 2026  
Kapsam: tüm repo (`src/`, `prisma/`, `next.config.ts`, `vercel.json`, bağımlılıklar)  
Yöntem: kaynak kod incelemesi (statik). Canlı penetrasyon testi yapılmadı.

## Uygulanan yamalar (31 Ağustos 2026)

OWASP A01 (her istekte sunucu yetkisi), Auth.js + Next.js 16 (`proxy.ts` yalnızca yönlendirme), NIST 800-63B (kısa ayrıcalıklı oturum) ve KVKK rıza ilkesi izlendi.

- Öğrenci JWT'si `/admin` panosuna ve danışan verisine inemez (`requireAdmin` layout + sayfa; proxy rol yönlendirmesi).
- Askıya alınan öğrenci her korumalı uçta DB `active` kontrolüyle reddedilir.
- Admin oturumu 8 saat, öğrenci 7 gün; girişte in-memory rate limit + dummy bcrypt.
- Analitik yalnızca çerez rızasından sonra yüklenir.
- Seed/cron sırları timing-safe karşılaştırılır; yapılandırma sızıntısı kapatıldı.
- Dosya yüklemede sihirli bayt; kaynak URL yalnızca http(s); ayar anahtarı allowlist.
- `User.role` varsayılanı artık `ADMIN` değil.

Hâlâ açık (bilinçli ertelendi — altyapı/sözleşme ister): 2FA, e-posta doğrulama, Upstash rate limit, seans notu şifreleme, Prisma migrate.

Bu site hem **psikolojik danışmanlık** hem **öğrenci koçluğu** verisi tutuyor. Seans notları, danışan iletişim bilgileri ve öğrenci çalışmaları KVKK md. 6 kapsamında **özel nitelikli kişisel veri** sayılabilir. Bu yüzden standart bir pazarlama sitesinden daha sıkı bir güvenlik barı gerekir.

---

## Özet

| Seviye | Adet | En kritik örnek |
|---|---|---|
| Kritik | 2 | Öğrenci oturumu admin panosundaki danışan/mesaj verisini görür |
| Yüksek | 7 | Brute-force, açık kayıt, JWT iptal yok, analitik rızasız yüklenir |
| Orta | 11 | Seed/cron sırları query string’de, dosya imza kontrolü yok, CSP zayıf |
| Düşük | 8 | User enumeration, `X-Frame-Options`, bilgi sızıntısı |

Önceki turda (`DEGISIKLIKLER.md`) yapılan işler gerçekten işe yaramış: `/api/seed` kilitlenmiş, iletişim formu rate-limit + honeypot almış, yönetim API’lerine `requireAdmin` eklenmiş, öğrenci dosyaları private Blob + `serveWorkFile` ile sunuluyor. **Ancak yetki kontrolü API katmanında duruyor; sunucu tarafı admin sayfası ve `proxy.ts` rol bakmıyor.** Bu boşluk tek başına önceki düzeltmeleri deliyor.

---

## İyi gidenler (korunmalı)

- Yönetim API’lerinin çoğunda `requireAdmin()` var; öğrenci JWT’si `/api/clients`, `/api/messages` vb. üzerinde 401 alıyor.
- Öğrenci dosyaları private Vercel Blob’da; ham URL istemciye verilmiyor; `X-Content-Type-Options: nosniff` + `CSP: sandbox`.
- İletişim ve kayıt formunda honeypot + uzunluk sınırı + in-memory rate limit.
- Telegram’a `parse_mode` yok → Markdown injection kapalı.
- `poweredByHeader: false`, HSTS, `nosniff`, `frame-ancestors`, `object-src 'none'`.
- Şifreler bcrypt (cost 10). Öğrenci kaydı min. 8 karakter.
- Public testimonials uçunda `id` / `email` / `studentId` dönmüyor.
- `.env*` gitignore’da. Seed artık env sırına bağlı.
- Prisma ORM kullanıldığı için klasik SQL injection yüzeyi dar (runtime DDL sabit string).

---

## KRİTİK

### K1. Öğrenci, yönetim panosundaki danışan ve mesaj verisini görür

**CWE-863 / OWASP A01 Broken Access Control**

`src/proxy.ts` yalnızca çerezin **varlığına** bakar; JWT’yi doğrulamaz, `role` okumaz:

```14:24:src/proxy.ts
  if (pathname.startsWith("/admin")) {
    const sessionCookie =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
```

`src/app/admin/page.tsx` de yalnızca oturumun olup olmadığına bakar:

```54:56:src/app/admin/page.tsx
export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
```

Sonra **doğrudan Prisma** ile tüm danışan sayısı, okunmamış mesajlar, son randevular (isimle) ve son iletişim mesajlarının içeriği çekilir.

Saldırı:

1. `/ogrenci/kayit` ile herkes hesap açabilir.
2. NextAuth öğrenci JWT çerezi yazar (`authjs.session-token`).
3. `/admin` açılır → proxy çerezi görünce geçirir.
4. Dashboard sunucuda render edilir → danışan adları, mesaj metinleri, randevu durumları sızar.

Client-side admin sayfaları (`/admin/clients` vb.) API’den 401 alır; asıl sızıntı **sunucu tarafı dashboard**. Psikolojik danışmanlık verisi için kabul edilemez.

**Düzeltme**

- `proxy.ts` içinde çerez yetmez. `auth()` ile JWT doğrula; `role !== "ADMIN"` ise `/admin/login` (öğrenci ise `/ogrenci`).
- `admin/page.tsx` ve mümkünse `admin/layout` (sunucu layout’a çevirerek) `requireAdmin()` kullansın.
- Sahte/bozuk çerez de reddedilsin.

```ts
// admin/page.tsx — önerilen
const session = await requireAdmin();
if (!session) redirect("/admin/login");
```

Next.js 16’da `proxy.ts` **güvenlik sınırı değildir**; her sayfa ve her API kendi yetkisini kontrol etmeli.

---

### K2. Askıya alınan öğrenci JWT süresi dolana kadar sistemde kalır

**CWE-613**

`active === false` yalnızca giriş anında kontrol ediliyor (`src/lib/auth.ts` student provider). JWT stratejisi oturumu sunucuda iptal edemez.

Sonuç: koç öğrenciyi askıya alsa bile mevcut tarayıcıdaki oturum panel, dosya ve yorum API’lerine erişmeye devam eder.

**Düzeltme**

- Her öğrenci isteğinde `student.active` (ve varsa `passwordChangedAt`) DB’den doğrulansın.
- JWT’ye `pv` (password version) koy; şifre değişince eski token düşsün.
- Session `maxAge` kısaltılsın (admin için 8 saat, öğrenci için 7 gün).
- İleride Redis/DB session veya token denylist.

---

## YÜKSEK

### Y1. Admin ve öğrenci girişinde brute-force koruması yok

`/admin/login` ve `/ogrenci/giris` → NextAuth Credentials. Rate limit yok, hesap kilidi yok, 2FA yok, gecikmeli yanıt yok.

Admin tek hesap + yalnızca 8 karakter şifre → çevrimdışı sözlük saldırısı pratik.

**Düzeltme**

- IP + e-posta bazlı rate limit (Upstash Redis; in-memory Vercel’de işe yaramaz).
- 5 hatalı denemeden sonra 15 dk kilit.
- Admin için TOTP 2FA.
- Başarısız girişlerde sabit süre (dummy `bcrypt.compare`) — kullanıcı var/yok sızıntısını kapatır.

### Y2. Öğrenci kaydı herkese açık, e-posta doğrulaması yok

`/api/student/register` public. 409 ile “bu e-posta kayıtlı” dönüyor (kullanıcı enumerasyonu). Onay kutusu yasal rıza yerine geçmez; 18 yaş altı için KVKK açık rıza + veli doğrulaması yok.

Bot/spam hesap → Blob kotası, DB şişmesi ve **K1 ile birleşince** danışan verisine giden yol.

**Düzeltme**

- Kayıt: davet kodu veya koç onayı (`active: false` default).
- E-posta doğrulama (magic link).
- Turnstile/hCaptcha.
- 409 yerine nötr mesaj: “Bu e-posta varsa giriş bağlantısı gönderildi.”

### Y3. Şifre politikası zayıf, oturum uzun, JWT iptal yok

- Min. 8 karakter, karmaşıklık yok, sızmış-şifre kontrolü yok (`haveibeenpwned` k-anonymity).
- bcrypt cost 10; 12 daha uygun.
- NextAuth `session.maxAge` tanımsız → varsayılan ~30 gün.
- Şifre değişince diğer cihazlardaki JWT geçerliliğini korur.
- `User.role` şemada `@default("ADMIN")` — yanlışlıkla açılan her User kaydı yönetici olur. Varsayılan `"USER"` olmalı.

### Y4. Çerez rızası sahte — Vercel Analytics her zaman yüklenir

`layout.tsx` `<Analytics />` koşulsuz. `CookieBanner` reddetse bile analitik script çalışır. Gizlilik metni “analitik çerezler yalnızca açık onayınız ile aktif hale gelir” diyor — **uygulama bunu yalanlıyor** (KVKK / GDPR).

Ayrıca rıza `localStorage`’da; çerez yöneticisi değil. Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`) üçüncü taraf, CSP’de açık, rızasız.

**Düzeltme**

- Analytics yalnızca `cookies-accepted=true` iken yüklenir.
- Fontları `next/font` ile self-host et; CSP’den Google’ı çıkar.
- Rıza kaydını httpOnly çereze al.

### Y5. `/api/seed` ve cron sırrı query string’de

```
GET /api/seed?secret=...
GET /api/cron/daily-research?secret=...
```

Query string access log, Vercel log, tarayıcı geçmişi, Referer, reverse proxy’ye düşer. Karşılaştırma `!==` — timing-safe değil.

**Düzeltme**

- Yalnızca `Authorization: Bearer`.
- `crypto.timingSafeEqual`.
- Seed’i production’dan sil; CLI script yap (`prisma/seed.ts`).
- `CRON_SECRET` yokken 503 gövdesinde yapılandırma detayı verme.

### Y6. Dosya yükleme: MIME’e güveniliyor, sihirli bayt yok

Öğrenci `FILE`/`PHOTO` yükler. Kontrol `file.type` (istemci kontrolünde). Polyglot HTML/PDF, sahte JPEG mümkün.

`serveWorkFile` nosniff + sandbox ile risk düşüyor; yine de:

- İlk 8–16 baytı oku (PDF `%PDF`, JPEG `FF D8 FF`).
- SVG/HTML/XML’i reddet.
- ClamAV/VirusTotal taraması (ileride).
- Öğrenci başına günlük kota (adet + MB).

### Y7. Seans notları ve danışan notları düz metin

`Session.notes`, `Client.notes`, `Message.message` PostgreSQL’de şifresiz. Hosting sağlayıcısı veya sızan `DATABASE_URL` tüm danışmanlık arşivini açar.

**Düzeltme**

- Uygulama katmanı şifreleme (AES-256-GCM, anahtar KMS/env).
- Erişim audit log (kim, hangi danışan, ne zaman).
- Yedek şifreleme + saklama süresi (KVKK silme hakkı).

---

## ORTA

### O1. `proxy.ts` yetki katmanı gibi kullanılmamalı

Next.js 16 bunu özellikle “ağ sınırında yönlendirme” olarak tanımlıyor. Sahte çerez, öğrenci çerezi, süresi dolmuş JWT hepsi “cookie var” diye geçer. Gerçek kontrol sayfa + API’de olmalı. Matcher yalnızca `/admin`; `/ogrenci` korumasız (sayfa kendi kontrolünü yapıyor — iyi, ama tutarsız).

### O2. Girdi doğrulama / mass assignment

| Uç | Sorun |
|---|---|
| `POST /api/appointments` | `clientId`, `title`, `status`, `notes` tip/uzunluk/enum yok |
| `POST /api/sessions` | aynı |
| `PUT /api/clients/[id]` | `body.name` vb. doğrudan yazılıyor |
| `PUT /api/settings` | `key` allowlist yok; rastgele satır şişirilebilir |
| `POST /api/admin/resources` | `url` için `javascript:` / `data:` kontrolü yok |
| `POST /api/contact` | e-posta formatı yok |

Zod (veya benzeri) ile şema doğrulama her yazma ucuna.

### O3. CSP `script-src 'unsafe-inline'`

Tema-init ve JSON-LD inline. XSS bulunursa CSP kurtarmaz. Nonce veya hash (`'sha256-...'`) kullan; `unsafe-inline` kaldır.

Eksikler: `upgrade-insecure-requests`, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `X-Frame-Options: DENY` (şimdi `SAMEORIGIN`).

`img-src https:` çok geniş (her HTTPS görsel).

### O4. Runtime DDL (`$executeRawUnsafe`)

`ensureSettingTable`, `ensureTestimonialTable`, `ensureStudentWorkTable`, `ensureStudentClientLink` her istek yolunda `CREATE TABLE` / `ALTER TABLE` çalıştırıyor. SQL sabit olduğu için injection yok; ama:

- DB kullanıcısı DDL yetkili → uygulama sızınca şema da ele geçer.
- Race / kilit.
- Production şeması koda dağılmış, migration yok.

Kalıcı çözüm: Prisma migrate, runtime DDL kapat, DB kullanıcısı yalnızca DML.

### O5. Rate limit in-memory

Vercel’de her instance ayrı sayaç. Belirli bir ölçekte bypass edilir. Upstash Redis / Vercel KV.

`x-forwarded-for` ilk IP’si sahte olabilir; Vercel’in eklediği son/güvenilir hop kullanılmalı.

### O6. XSS yüzeyi: `dangerouslySetInnerHTML` + `innerHTML`

Kaynaklar: `HeroSection`, `ExamSection` (kart HTML’i), `ArticlesSection`, `LegalModals`, `CookieBanner` (`content.innerHTML = ...`), `makaleler/page.tsx`.

İçerik şu an statik i18n — düşük risk. Yarın CMS/admin’den HTML gelirse stored XSS. CookieBanner DOM API ile HTML basıyor.

React children veya DOMPurify.

### O7. Open redirect riski düşük ama `callbackUrl` var

`proxy.ts` `callbackUrl=pathname` koyuyor; pathname `/admin` ile başlıyor. Login sayfası `callbackUrl`’i **kullanmıyor** (sabit `/admin`). Yine de ileride `signIn(..., { callbackUrl })` eklenirse yalnızca same-origin path kabul edilsin.

### O8. Kaynak URL’si öğrenci panelinde ham `href`

Admin `javascript:alert(1)` kaydederse öğrencinin tarayıcısında çalışır. `http:`/`https:` allowlist (çalışma LINK tipi bunu yapıyor; kaynak API’si yapmıyor).

### O9. `next-auth` v5 beta

`next-auth@5.0.0-beta.31`. Beta. `trustHost`, `AUTH_SECRET`, cookie `secure`/`sameSite` kodda yok — env’e bırakılmış. Vercel’de `AUTH_SECRET` yoksa oturum öngörülemez / kırılır.

Kodda açıkça:

```ts
session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
trustHost: true,
```

### O10. Footer’da `/admin/login` linki

Keşif yüzeyini küçültmek için kaldırın veya `robots` + basic auth / IP allowlist (Vercel Firewall) ekleyin. `robots.ts` `/ogrenci` yasaklamıyor; sayfa `robots: noindex` ile idare ediyor — `disallow: ["/admin", "/api", "/ogrenci"]` daha doğru.

### O11. Bağımlılık ve sır yüzeyi

- Telegram bot token’ı env’de (iyi) ama token sızarsa geçmiş mesajlar okunabilir; bota minimum yetki.
- `DATABASE_URL` yoksa `` `${undefined}` `` → `"undefined"` string’ine bağlanmaya çalışır; fail-fast olsun.
- `npm audit` düzenli çalıştırılsın; `next@16.2.11` güncel tutulmalı (2026’da auth bypass CVE’leri duyuruldu — yama disiplinini bırakmayın).

---

## DÜŞÜK

1. **Kullanıcı enumerasyonu:** kayıt 409, girişte user yokken `bcrypt.compare` atlanıyor (zaman farkı).
2. **Admin e-posta normalize edilmiyor** (`toLowerCase` yok); öğrencide var.
3. **İletişim formu `phone` zorunlu değil** API’de; XSS yok (React escape) ama HTML e-posta şablonunda dikkat.
4. **Honeypot** erişilebilirlik araçları / autofill doldurabilir.
5. **`Content-Disposition` filename** `encodeURIComponent` — RFC 5987 `filename*` daha doğru.
6. **Audit log yok** — “kim hangi danışanı sildi?” sorusuna cevap yok.
7. **Gizlilik politikası eksik maddeler:** Telegram paylaşımı, Vercel Blob, Vercel Analytics, saklama süreleri, yurt dışı aktarım (AB/ABD).
8. **security.txt** (`/.well-known/security.txt`) yok.

---

## KVKK / GDPR (teknik olmayan ama bağlayıcı)

Bu bir PDR/koçluk platformu. Aşağıdakiler kod kadar önemli:

| Konu | Durum | Öneri |
|---|---|---|
| Açık rıza | Checkbox, kanıt zayıf | Rıza metni sürümü + IP + zaman DB’de |
| 18 yaş altı | Beyana dayalı | Veli e-posta onayı veya yüz yüze sözleşme |
| Veri minimizasyonu | Seans notu, mood, followUp tutuluyor | Amaç bağla, süre bitince sil |
| Silme hakkı | Öğrenci hesabı silme ucu yok | `/api/student/delete-me` + admin cascade |
| İşleyenler | Vercel, Postgres, Telegram, Blob | Sözleşme + yurt dışı aktarım aydınlatması |
| Analitik | Rızasız | Y4 |
| Aydınlatma | Telegram, Blob, Analytics yazılı değil | `/gizlilik` güncelle |
| Log / iz | Yok | Admin erişim kaydı (6. madde verisi) |

---

## Öncelikli yol haritası

### Bu hafta (P0)

1. `admin/page.tsx` → `requireAdmin()`, değilse redirect.
2. `proxy.ts` → JWT + `role === "ADMIN"` (öğrenci `/ogrenci`’ye).
3. Öğrenci `active` kontrolünü her korumalı uçta tekrarla.
4. Canlı admin şifresini değiştir (eski `admin123` uyarısı hâlâ `DEGISIKLIKLER.md`’de).
5. `AUTH_SECRET` üretimde 32+ byte rastgele olduğundan emin ol.
6. Analytics’i rızaya bağla.

### Sonraki sprint (P1)

7. Upstash ile login/register/contact rate limit.
8. Kayıt: e-posta doğrulama veya davet/onay.
9. Seed rotasını sil; cron’dan query-string sırrını kaldır.
10. Zod validasyon katmanı.
11. Session süreleri + password version.
12. CSP nonce; Google Fonts self-host.
13. `User.role` default `"USER"`.

### Orta vade (P2)

14. Prisma migrate; runtime DDL kapat.
15. Seans/danışan notu şifreleme + audit log.
16. Admin 2FA.
17. Dosya magic-byte + kota.
18. Öğrenci hesabı silme (KVKK).
19. Gizlilik metnini gerçek veri akışıyla hizala.

---

## Mimari hedef (yetki)

```
İstek
  → proxy.ts     yalnızca yönlendirme (çerez yoksa login)
  → sayfa/layout requireAdmin() / requireStudent()
  → API          aynı yardımcı, her metodun başında
  → Prisma       asla rol kontrolsüz çağrılmasın
```

Tek bir `src/lib/auth.ts` içinde:

```ts
export async function requireAdmin() { /* role === "ADMIN" */ }
export async function requireStudent() {
  /* role === "STUDENT" AND student.active === true */
}
```

Admin resource/testimonial uçlarındaki kopya `requireAdmin` fonksiyonları silinip ortak yardımcı kullanılsın (şu an iki ayrı kopya var; biri unutulursa delik açılır).

---

## Test senaryoları (düzeltme sonrası)

- [ ] Öğrenci JWT ile `GET /admin` → login veya `/ogrenci`, dashboard HTML’inde danışan/mesaj yok.
- [ ] Öğrenci JWT ile `GET /api/clients` → 401.
- [ ] Bozuk çerez ile `/admin` → login.
- [ ] Askıya alınan öğrenci eski JWT ile `/api/student/work` → 401.
- [ ] 20 hızlı login denemesi → 429.
- [ ] Cookie reddi → Analytics script yok.
- [ ] `/api/seed` secretsiz → 404; query string ile (production) → 404.
- [ ] `javascript:alert(1)` kaynak URL → kaydedilmez.
- [ ] `file.type=application/pdf` ama içerik HTML → reddedilir.

---

Bu rapor yalnızca kod incelemesidir. Düzeltmelerin uygulanmasını, canlıda yetki testini veya P0 yamalarını buradan devam ettirebilirim.
