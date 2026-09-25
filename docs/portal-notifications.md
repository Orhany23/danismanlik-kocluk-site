# Mesajlaşma için e-posta bildirimleri

Bu ek, bağımsız öğrenci/danışan mesajlaşmasına iki yönlü e-posta bildirimi getirir.
Öğrenci yazınca yöneticiye; yönetici yazınca öğrencinin hesabındaki e-posta adresine bildirim gönderilir.
Dosya veya çalışma teslimlerini değiştirmez. SMS göndermez.

## Kurulum

1. `apply-message-email-notifications.yml` dosyasını `.github/workflows/` klasörüne yükleyin.
2. GitHub Actions içindeki **Apply Message Email Notifications** işini **Run workflow** ile başlatın.
3. İşin ve Vercel yayınının tamamlanmasını bekleyin.
4. Vercel → proje → Settings → Environment Variables alanında aşağıdaki ayarları kontrol edin.
5. Ortam değişkenlerini eklediyseniz Vercel'de **Redeploy** yapın. Sadece ayar kaydetmek mevcut yayını güncellemez.
6. Admin → Mesajlar → Öğrenci / Danışan bölümündeki **E-posta bildirimleri** kartını kontrol edin.

| Ayar | Kullanımı |
| --- | --- |
| `RESEND_API_KEY` | Resend gönderim anahtarı. Mevcut e-posta özelliğinde tanımlıysa aynı anahtar kullanılır. |
| `RESEND_FROM_EMAIL` | Resend'de doğrulanmış alan adındaki gönderici. Varsayılan: `Orhan Yaşlı <bildirim@psdorhanyasli.com.tr>`. |
| `PORTAL_ADMIN_NOTIFICATION_EMAIL` | Bildirim almak istediğiniz tek e-posta adresi. Boşsa, sistemde **tek** ADMIN hesabı varsa o hesabın adresi kullanılır. Birden fazla yönetici varsa bu ayar gereklidir. |
| `PORTAL_SITE_URL` | İsteğe bağlı site adresi. Varsayılan: `https://psdorhanyasli.com.tr`. HTTPS olmalıdır. |
| `PORTAL_EMAIL_NOTIFICATIONS` | İsteğe bağlı kapatma anahtarı. `false` yapılırsa yalnızca portal mesajlarının e-posta bildirimleri kapanır. |

API anahtarlarını GitHub dosyalarına veya sohbet mesajlarına yazmayın; Vercel'in ortam değişkenleri alanında saklayın.
Resend hesabı ve doğrulanmış gönderici alan adı gerekir. Resend'in test göndericisi, gerçek öğrencilere genel gönderim için uygun değildir.
Vercel önizleme ortamlarında bu bildirimler gönderilmez. Yapılandırma kartı bir teslimat testi değildir.

## Kullanım

- E-posta yalnızca yeni mesaj bilgisini ve giriş gerektiren panel bağlantısını taşır. Sohbet metni, test sonucu veya dosya eklenmez.
- Öğrenci e-postayı yanıtlamak yerine sitedeki Mesajlarım alanından yanıtlar.
- Admin e-postasındaki bağlantı ilgili konuşmayı açar. Oturum kapalıysa giriş gerekir; mevcut giriş sayfası önce ana panele götürür. Mesajlar alanından konuşmaya ulaşılır.
- Alıcı mesajı arka plan işlemi başlamadan okumuşsa bildirim gönderilmez.
- Kurulumdan önceki mesajlar için geriye dönük e-posta gönderilmez.
- Aynı mesajın bağlantı hatası nedeniyle tekrar gönderilmesi yeni e-posta oluşturmaz. Ayrı yeni mesajlar ayrı bildirimlerdir; bu sürümde günlük özet veya birleştirme yoktur.
- Öğrenci hesabı pasifse bildirim gönderilmez. Veli telefonu veya e-posta adresi otomatik alıcı olarak seçilmez.

## Güvenilirlik ve sınırlar

Mesaj veritabanına kaydedildikten sonra Next.js `after` ile bildirim başlatılır. Kullanıcı yanıtı, e-posta sağlayıcısını beklemez.
Alıcılar istek gövdesinden alınmaz; kayıtlı öğrenci hesabı ve yönetici ayarından belirlenir.
Her yeni mesajın kimliği Resend idempotency anahtarıdır. Geçici ağ/408/429/5xx hatalarında aynı içerik ve anahtarla toplam en fazla üç deneme yapılır; her isteğin altı saniye sınırı vardır.

E-posta sorunu panelde kaydedilen mesajı geri almaz. Sağlayıcı adresi kabul etse bile gelen kutusuna teslimat garanti edilmez; spam, kota, doğrulanmamış alan adı veya geçersiz adres gibi durumlar Resend panelinden incelenmelidir.
Bu sürümde kalıcı e-posta kuyruğu veya teslimat webhook'u yoktur. Üç deneme başarısız olursa daha sonra otomatik tekrar yapılmaz. Sunucu günlüğüne yalnızca hata kodu yazılır; mesaj metni, adres veya API anahtarı yazılmaz.

## Kontrol

Önce kendi deneme öğrenci hesabınızı kullanın:

1. Öğrencinin Mesajlarım ekranını kapatın. Admin olarak o hesaba yazın; öğrencinin e-postasını kontrol edin.
2. Adminin konuşma ekranını kapatın. Öğrenci olarak yazın; yönetici e-postasını kontrol edin.
3. Mesajın panelde kaldığını ve e-postadaki bağlantının siteye gittiğini doğrulayın.
4. E-posta gelmezse admin bildirim kartını, istenmeyen posta klasörünü ve Resend gönderim günlüğünü kontrol edin.

Çevrimdışı kontroller: `node --test tests/portal-notifications.test.mjs`.
Bu testler gerçek e-posta göndermeden alıcı seçimini, yapılandırmayı, geçici/kalıcı hataları, tekrar göndermeyi ve yeni mesajın transaction sonrası tetiklenmesini doğrular.

## Geri alma

Yalnızca bildirimleri durdurmak için `PORTAL_EMAIL_NOTIFICATIONS=false` ayarlayıp yeniden yayınlayın.
Ek veritabanı tablosu veya veri dönüşümü yoktur. Kod değişikliği kendi commit'iyle geri alınabilir.
Başarılı kurulum ve canlı denemeden sonra kurulum workflow'u silinebilir; bildirimler site kodunda çalışır.

## Sağlayıcı belgeleri

- Resend gönderim API'si: https://resend.com/docs/api-reference/emails/send-email
- Tekrar gönderim anahtarları: https://resend.com/docs/dashboard/emails/idempotency-keys
- Alan adı doğrulaması: https://resend.com/docs/dashboard/domains/introduction
- Sonraki aşamada SMS için Netgsm API gereksinimleri: https://bilgibankasi.netgsm.com.tr/sms/toplu-sms/api-ile-sms
