# Fotoğraflar için `public/` klasörü

Bu klasör sitenin statik dosyalarını barındırır. Portre fotoğraflarını eklemek
için kod değişikliğine gerek yoktur; aşağıdaki dosyaları **birebir bu adlarla**
bu klasöre bırakmanız yeterlidir.

## Beklenen dosyalar

| Dosya adı         | Kullanıldığı yer     | Öneriler                                              |
| ----------------- | -------------------- | ---------------------------------------------------- |
| `orhan.jpg`       | Hero (üst) bölümü    | 4:5 dikey, ~1200×1500px, JPEG ~%80 kalite, <400KB    |
| `orhan-about.jpg` | Hakkımda bölümü      | 4:5 dikey, ~1200×1500px, JPEG ~%80 kalite, <400KB    |

## Notlar

- Dosyalar bu klasöre bu adlarla eklendiğinde site otomatik olarak fotoğrafları
  gösterir; başka hiçbir ayar gerekmez.
- Farklı bir en-boy oranı yüklerseniz görsel `object-fit: cover` ile ortadan
  kırpılarak çerçeveye sığdırılır. En temiz sonuç için 4:5 dikey oran önerilir.
- Fotoğraf eklenmediğinde tasarlanmış "OY" monogramlı çerçeve gösterilir; bu
  bilinçli bir yedek görünümdür.
- Fotoğraflar eklendikten sonra bu `README.md` dosyası silinebilir. Bu dosya
  herkese açık `/README.md` adresinden erişilebilir olduğundan, üretimde
  bırakmak zorunlu değildir.
