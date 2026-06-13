# Öğrenci Portalı — Aşama 2 Yol Haritası (LMS)

> Bu döküman, kapsamlı öğrenme sistemi için planı içerir. Yeni bir oturumda
> "ASAMA-2-LMS.md dosyasındaki plana göre öğrenme sistemine başla" diyerek
> temiz bir bağlamdan devam edilebilir.

## Hedef
Orhan Yaşlı'nın öğrencilerine kurs, ders, kaynak ve ödev tanımlayabildiği;
içeriği hem genel (herkese/gruba) hem kişiye özel atayabildiği; video ve PDF
yükleyebildiği tam teşekküllü bir mini LMS.

## Veritabanı şeması (Prisma)
Mevcut `Student` modeline ek olarak:

```
model Course {
  id          String   @id @default(cuid())
  title       String
  description String?
  coverImage  String?
  level       String?   // LGS, YKS-Sayısal vb.
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  modules     Module[]
  enrollments Enrollment[]
}

model Module {        // Kurs içindeki bölüm/ünite
  id        String   @id @default(cuid())
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title     String
  order     Int      @default(0)
  lessons   Lesson[]
}

model Lesson {        // Ders: video, döküman, yazı veya link
  id        String   @id @default(cuid())
  moduleId  String
  module    Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  title     String
  type      String   // "video" | "pdf" | "text" | "link"
  content   String?  // metin içeriği veya URL
  fileUrl   String?  // yüklenen dosyanın Blob URL'i
  order     Int      @default(0)
}

model Enrollment {    // Öğrenci <-> Kurs ilişkisi (atama)
  id        String   @id @default(cuid())
  studentId String
  courseId  String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())
  @@unique([studentId, courseId])
}

model Progress {      // Ders tamamlama takibi
  id        String   @id @default(cuid())
  studentId String
  lessonId  String
  completed Boolean  @default(false)
  updatedAt DateTime @updatedAt
  @@unique([studentId, lessonId])
}

model Assignment {    // Ödev/görev (kişiye özel veya kursa bağlı)
  id          String   @id @default(cuid())
  studentId   String?  // null ise gruba/herkese
  courseId    String?
  title       String
  description String?
  dueDate     DateTime?
  createdAt   DateTime @default(now())
}
```
`Student` modeline ters ilişkiler eklenir: enrollments, progress.

## Atama mantığı (hem genel hem kişiye özel)
- **Genel:** Kurs `published=true` ise + `level` öğrencinin hedefiyle eşleşiyorsa otomatik görünür.
- **Kişiye özel:** `Enrollment` kaydı ile belirli öğrenciye atanır.
- Öğrenci panelinde "Kurslarım" = published+level eşleşen ∪ kendisine atanan.

## Dosya yükleme — Vercel Blob
1. Vercel panelinde Storage → Blob oluştur (ücretsiz kota: ~1 GB başlangıç).
2. `BLOB_READ_WRITE_TOKEN` env değişkeni Production + Preview'a eklenir.
3. `npm i @vercel/blob`
4. Admin yükleme route'u: `put(filename, file, { access: 'public' })` → dönen URL `Lesson.fileUrl`'e kaydedilir.
5. Video için: küçük dosyalar Blob'a; büyük videolar için YouTube "unlisted" link önerilir (maliyet/performans).

## Sayfalar
**Admin tarafı:**
- `/admin/courses` — kurs listesi, yeni kurs
- `/admin/courses/[id]` — modül/ders ekleme, dosya yükleme, yayınlama
- `/admin/courses/[id]/students` — kursa öğrenci atama
- Öğrenci detayında: o öğrenciye özel atama/ödev

**Öğrenci tarafı:**
- `/ogrenci` paneli güncellenir: "Kurslarım" kartları
- `/ogrenci/kurs/[id]` — modül/ders görüntüleme, video oynatma, PDF görüntüleme
- Ders tamamlandı işaretleme → Progress

## Güvenlik / yetki
- Tüm `/admin/courses*` ve `/api/admin/*` yalnızca role=ADMIN.
- Öğrenci yalnızca kendisine atanan/yayınlanan içeriği görebilir (API tarafında kontrol — sadece UI gizlemek yetmez).
- Dosya URL'leri Blob'da public olduğundan, hassas içerik için imzalı URL veya erişim kontrolü değerlendirilmeli.

## Aşamalandırma önerisi (tek oturuma sığmazsa)
1. **2a:** Course + Module + Lesson şeması, admin kurs/ders ekleme (sadece text + link), öğreci panelinde listeleme.
2. **2b:** Vercel Blob + dosya (PDF/video) yükleme.
3. **2c:** Enrollment (kişiye özel atama) + Progress (tamamlama takibi).
4. **2d:** Assignment (ödev) + bildirimler.

## Önemli notlar
- KVKK: Öğrenci ilerleme/ödev verisi de kişisel veridir; aydınlatma metni buna göre güncellenmeli.
- Her aşama ayrı branch + önizleme testi ile yapılmalı (DATABASE_URL Preview'a eklenmeli).
- Bu sistem büyük; aceleye getirilmemeli.
