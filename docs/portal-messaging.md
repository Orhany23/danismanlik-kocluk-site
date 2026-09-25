# Panel içi mesajlaşma

Öğrenci / danışan panelindeki kişisel mesajlar çalışma teslimi sayılmaz. Çalışma formu PDF, fotoğraf, bağlantı ve çalışma notlarını mevcut akışta tutar. Yeni mesajlaşma metin tabanlıdır; dosya teslimi aynı çalışma formundan devam eder.

## Kullanım

- Öğrenci: Panel → **Mesajlarım** → mesaj yaz → **Mesajı gönder**.
- Yönetici: **Mesajlar → Öğrenci / Danışan** → kişi seç → yanıt yaz. **+** ile ilk mesajı yönetici de başlatabilir.
- Öğrenci kartındaki **Mesaj yaz** doğrudan o kişinin konuşmasını açar.
- **Okunmamış** görünümü görülmeyen mesajları, **Yanıt bekleyen** görünümü son mesajı öğrenciden gelen konuşmaları gösterir. Mesajı okumak, yanıt verilmiş sayılmaz.
- Eski iletişim formu mesajları ve e-posta yanıtları **İletişim formu** sekmesindedir.
- Görünür sayfada sohbet 10 saniyede, gelen kutusu 15 saniyede, panel rozetleri 30 saniyede yenilenir. Sekmeye dönüşte de kontrol edilir. Bu sürüm websocket, SMS veya e-posta bildirimi kullanmaz.
- Önceki mesajlar imleçle sayfalanır. Hatalı gönderimde taslak korunur; aynı taslağı yeniden göndermek ikinci bir kayıt üretmez.
- Hızlı yanıt düğmeleri yalnızca taslak doldurur; yönetici **Mesajı gönder** düğmesine basınca gönderilir.

## Veri ve yetki

`PortalConversation` ve `PortalMessage` yeni tablolardır. `StudentWork` ve iletişim formunun `Message` tablosu değiştirilmez. Eski çalışma notları otomatik sınıflandırılmaz veya taşınmaz.

Öğrenci kimliği oturumdan, gönderici rolü sunucudan belirlenir. Okuma ve okundu işaretleme aynı öğrenci kimliğine sınırlandırılır. Pasif öğrenciler yeni mesaj gönderemez ve sohbet geçmişine giriş yapamaz; yönetici geçmişi görebilir. İstekler JSON ve aynı kaynak kontrolünden geçer. Mesaj metinleri HTML olarak çalıştırılmaz. Yanıtlar `private, no-store` başlığı taşır. Yeni sistemde mesaj içeriği dış bildirim servisine gönderilmez.

Okundu bilgisi yalnızca açık sekmede, görünür mesajlar için yazılır. Konuşma satırı kilidi eş zamanlı mesajların yanıt durumunu sırayla günceller. `(studentId, sender, clientMessageId)` benzersizliği tekrar gönderimde kopyaları engeller.

Şema, projenin mevcut `ensure*` desenine uygun olarak ilk yetkili kullanımda oluşturulur. `ensurePortalMessageTables` yalnızca yeni tabloları ve indeksleri ekler; işlem kilidi aynı anda gelen ilk istekleri sıraya koyar. Çalışma zamanı veritabanı kullanıcısının yeni tablo oluşturma yetkisi bulunmalıdır. Bu yetki yoksa dağıtımdan önce yeni şema kontrollü olarak uygulanmalıdır. Tablo kurulumu başarısız olduğunda mesaj API'si hata verir; boş konuşma gibi göstermez.

`npm ci` içindeki `prisma generate` yeni istemciyi üretir. Canlıya geçmeden üretim derlemesi tamamlanmalıdır. Geri alma için önceki uygulama sürümü tekrar dağıtılabilir; yeni tablolar ve konuşmalar silinmemelidir.

## Doğrulama

```sh
npm ci
npm run typecheck
npm run lint
npm run build
```

`tests/portal-messages.test.mjs` yerel, ayrı bir test veritabanına bağlı çalışan uygulamaya gerçek HTTP istekleri gönderir. Gerekli ortam değişkenleri:

- `PORTAL_TEST_URL`: yerel uygulamanın adresi.
- `DATABASE_URL`: aynı uygulamanın ayrı test veritabanı.
- `AUTH_SECRET`: yalnızca test uygulamasının oturum anahtarı.
- `PORTAL_TEST_DB=1`: test ortamının açık seçimi.

```sh
node --test tests/portal-messages.test.mjs
```

Testler loopback dışındaki adresleri reddeder. Benzersiz test öğrenci kayıtları oluşturur ve bitince yalnızca bu kayıtları temizler. Yetkisiz erişim, hesap izolasyonu, gönderici sahteciliği, girdi sınırları, okunmamış/yanıt bekleyen ayrımı, yinelenen gönderim, geçmiş sayfalama ve pasif hesap davranışı kapsanır. Gerçek kullanıcılar adına mesaj gönderilmez.

## Sonraki geliştirmeler — bu sürüme dahil değil

1. **Koçluk / Danışmanlık / Her ikisi profili.** Danışmanlık alan kişilere sınav hedefi veya ders çalışmadı uyarısı göstermemek; ortak mesajlar ve kaynakları korumak.
2. **Kişiye atanmış görevler.** Dosya oku, form/test doldur, çalışma teslim et türleri; son tarih, tamamlanma ve yönetici geri bildirimi. Dosyanın açılması ve kişinin “okudum” demesi ayrı durumlar olmalı.
3. **Görüşme öncesi tek kişi özeti.** Son mesajlar, atanan görevler, çalışma teslimleri ve test uygulamalarını tek ekranda göstermek; yalnız yöneticiye ait notları açıkça ayrı tutmak.
4. **Test atama ve değerlendirme akışı.** Mevcut test sonuçlarına uygulama tarihi ve danışman değerlendirmesi eklemek. Sonuçların kişiye gösterilmesi ayrı bir yönetici tercihi olmalı.

İlk öncelik mesajlaşma, ardından profil türü ve kişiye atanmış görevlerdir. Bunlar günlük takip yükünü doğrudan azaltır.
