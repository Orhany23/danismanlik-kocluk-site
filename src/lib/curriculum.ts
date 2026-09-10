// Türk eğitim sistemi müfredatı — ünite/konu düzeyinde, öğrenci panelindeki
// "Konu Takibi" için referans veri.
//
// Kapsam: Ortaokul (5-8. sınıf) ve Lise (9-12. sınıf), ana dersler (Türkçe/
// Türk Dili ve Edebiyatı, Matematik, Fen Bilimleri/Fizik-Kimya-Biyoloji,
// Sosyal Bilgiler/Tarih-Coğrafya-Felsefe/İnkılap Tarihi, İngilizce, Din
// Kültürü). İlkokul (1-4. sınıf) ve sınav kapsamına girmeyen branş dersleri
// (Beden Eğitimi, Müzik, Görsel Sanatlar, Teknoloji ve Tasarım vb.) bilinçli
// olarak dışarıda bırakıldı — bu site sınav koçluğu (LGS/YKS) ve psikolojik
// danışmanlık üzerine kurulu, bu dersler hizmetin kapsamına girmiyor.
//
// Kaynak durumu (dürüst envanter — bkz. psychTests.ts'teki aynı yaklaşım):
// MEB'in resmî müfredat sitesi (mufredat.meb.gov.tr) bu ortamdan erişilemedi.
// Ünite başlıkları, birbirini doğrulayan birden fazla bağımsız eğitim kaynağı
// (yayınevleri, dershaneler, eğitim portalları) üzerinden araştırılıp derlendi;
// 8. sınıf ve TYT/AYT dersleri için çapraz doğrulama yapıldı. Yine de bu bir
// ünite ÖZETİDİR, MEB'in en güncel ders kitaplarının birebir kopyası değildir
// — küçük sapmalar olabilir. Resmî/güncel bir kaynak paylaşılırsa düzeltilir.

export type CurriculumTopic = { id: string; label: string };
export type CurriculumSubject = { id: string; label: string; topics: CurriculumTopic[] };
export type CurriculumGrade = { id: string; label: string; group: "Ortaokul" | "Lise"; subjects: CurriculumSubject[] };

function grade(
  id: string,
  label: string,
  group: "Ortaokul" | "Lise",
  subjectDefs: [id: string, label: string, topics: string[]][]
): CurriculumGrade {
  return {
    id,
    label,
    group,
    subjects: subjectDefs.map(([sid, slabel, topics]) => ({
      id: sid,
      label: slabel,
      topics: topics.map((t, i) => ({ id: `${id}-${sid}-${i + 1}`, label: t })),
    })),
  };
}

const ENGLISH_TOPICS = [
  "Kelime Bilgisi (Vocabulary)",
  "Dilbilgisi Yapıları (Grammar)",
  "Okuma ve Anlama (Reading)",
  "Dinleme (Listening)",
  "Konuşma (Speaking)",
  "Yazma (Writing)",
];

export const CURRICULUM: CurriculumGrade[] = [
  grade("5", "5. Sınıf", "Ortaokul", [
    ["turkce", "Türkçe", [
      "Sözcükte Anlam (Gerçek, Mecaz, Terim Anlam)",
      "Cümlede ve Parçada Anlam",
      "Eş ve Zıt Anlamlı Kelimeler",
      "Deyimler ve Atasözleri",
      "Yazım Kuralları",
      "Noktalama İşaretleri",
      "Kök ve Ekler",
      "Sözcük Türlerine Giriş (İsim, Fiil, Sıfat, Zamir, Zarf)",
    ]],
    ["matematik", "Matematik", [
      "Doğal Sayılar",
      "Doğal Sayılarla İşlemler",
      "Kesirler",
      "Kesirlerle İşlemler",
      "Ondalık Gösterim",
      "Yüzdeler",
      "Temel Geometrik Kavramlar",
      "Üçgen ve Dörtgenler",
      "Veri Toplama ve Değerlendirme",
      "Uzunluk ve Alan Ölçme",
    ]],
    ["fen", "Fen Bilimleri", [
      "Güneş, Dünya ve Ay",
      "Canlılar Dünyasını Gezelim, Tanıyalım",
      "Kuvvetin Ölçülmesi ve Sürtünme",
      "Maddenin Değişimi",
      "Işığın Yayılması",
      "Canlılar ve Enerji İlişkileri",
      "İnsan ve Çevre",
    ]],
    ["sosyal", "Sosyal Bilgiler", [
      "Birey ve Toplum",
      "Kültür ve Miras",
      "İnsanlar, Yerler ve Çevreler",
      "Bilim, Teknoloji ve Toplum",
      "Üretim, Dağıtım ve Tüketim",
      "Etkin Vatandaşlık",
      "Küresel Bağlantılar",
    ]],
    ["ingilizce", "İngilizce", ENGLISH_TOPICS],
    ["din", "Din Kültürü ve Ahlak Bilgisi", [
      "Allah İnancı",
      "Kur'an-ı Kerim ve Özellikleri",
      "Hz. Muhammed'in Hayatı",
      "İbadetler: Temizlik ve Namaz",
      "Ahlaki Değerlerimiz",
    ]],
  ]),

  grade("6", "6. Sınıf", "Ortaokul", [
    ["turkce", "Türkçe", [
      "Sözcükte, Cümlede ve Parçada Anlam",
      "Fiilde Zaman ve Kişi Ekleri",
      "Fiilimsilere Giriş",
      "Cümlenin Ögelerine Giriş",
      "Yazım Kuralları",
      "Noktalama İşaretleri",
      "Söz Sanatlarına Giriş",
    ]],
    ["matematik", "Matematik", [
      "Çokluklar ve Oran",
      "Tam Sayılar",
      "Cebirsel İfadeler",
      "Oran ve Orantı",
      "Yüzdeler",
      "Veri Analizi",
      "Açılar",
      "Alan Ölçme",
      "Çember",
      "Simetri ve Örüntüler",
    ]],
    ["fen", "Fen Bilimleri", [
      "Güneş, Dünya ve Ay'ın Şekli",
      "Vücudumuzdaki Sistemler",
      "Kuvvet ve Hareket",
      "Madde ve Isı",
      "Işığın Madde ile Etkileşimi",
      "Elektriğin İletimi",
      "Canlılar ve Enerji İlişkileri",
    ]],
    ["sosyal", "Sosyal Bilgiler", [
      "Birey ve Toplum",
      "Kültür ve Miras",
      "İnsanlar, Yerler ve Çevreler",
      "Bilim, Teknoloji ve Toplum",
      "Üretim, Dağıtım ve Tüketim",
      "Etkin Vatandaşlık",
      "Küresel Bağlantılar",
    ]],
    ["ingilizce", "İngilizce", ENGLISH_TOPICS],
    ["din", "Din Kültürü ve Ahlak Bilgisi", [
      "Allah'a İman",
      "Kur'an-ı Kerim'i Tanıyalım",
      "Hz. Muhammed'in Örnekliği",
      "Din ve Ahlak İlişkisi",
      "İbadetlerimiz",
    ]],
  ]),

  grade("7", "7. Sınıf", "Ortaokul", [
    ["turkce", "Türkçe", [
      "Fiilimsiler",
      "Cümlenin Ögeleri",
      "Fiilde Çatı",
      "Anlatım Bozukluklarına Giriş",
      "Söz Sanatları",
      "Yazım Kuralları ve Noktalama",
      "Paragrafta Anlam",
    ]],
    ["matematik", "Matematik", [
      "Tam Sayılarla İşlemler",
      "Rasyonel Sayılar",
      "Cebirsel İfadeler",
      "Doğrusal Denklemler",
      "Oran ve Orantı",
      "Yüzdeler",
      "Çokgenler",
      "Çember ve Daire",
      "Veri Analizi",
      "Olasılık",
    ]],
    ["fen", "Fen Bilimleri", [
      "Güneş Sistemi ve Ötesi",
      "Hücre ve Bölünmeler",
      "Kuvvet ve Enerji",
      "Saf Madde ve Karışımlar",
      "Işığın Kırılması",
      "Elektrik Enerjisi",
      "Canlılarda Üreme, Büyüme ve Gelişme",
    ]],
    ["sosyal", "Sosyal Bilgiler", [
      "Birey ve Toplum",
      "Kültür ve Miras",
      "İnsanlar, Yerler ve Çevreler",
      "Bilim, Teknoloji ve Toplum",
      "Üretim, Dağıtım ve Tüketim",
      "Etkin Vatandaşlık",
      "Küresel Bağlantılar",
    ]],
    ["ingilizce", "İngilizce", ENGLISH_TOPICS],
    ["din", "Din Kültürü ve Ahlak Bilgisi", [
      "Melek ve Ahiret İnancı",
      "Kaza ve Kader",
      "Din ve Hayat",
      "Hz. Muhammed ve Aile Hayatı",
      "Din Kültürümüzde Kavramlar",
    ]],
  ]),

  grade("8", "8. Sınıf (LGS)", "Ortaokul", [
    ["turkce", "Türkçe", [
      "Fiilimsiler",
      "Cümlenin Ögeleri",
      "Fiilde Çatı",
      "Cümle Çeşitleri",
      "Anlatım Bozuklukları",
      "Söz Sanatları",
      "Yazım Kuralları",
      "Noktalama İşaretleri",
      "Paragrafta Anlam (Ana Fikir, Paragraf Tamamlama, Anlam Çıkarma)",
    ]],
    ["matematik", "Matematik", [
      "Çarpanlar ve Katlar",
      "Üslü İfadeler",
      "Kareköklü İfadeler",
      "Veri Analizi",
      "Basit Olayların Olma Olasılığı",
      "Cebirsel İfadeler ve Özdeşlikler",
      "Doğrusal Denklemler",
      "Eşitsizlikler",
      "Üçgenler",
      "Eşlik ve Benzerlik",
      "Dönüşüm Geometrisi",
      "Geometrik Cisimler",
    ]],
    ["fen", "Fen Bilimleri", [
      "Mevsimlerin Oluşumu, İklim ve Hava Hareketleri",
      "DNA ve Genetik Kod (Kalıtım, Mutasyon, Adaptasyon, Biyoteknoloji)",
      "Periyodik Sistem",
      "Fiziksel ve Kimyasal Değişimler",
      "Kimyasal Tepkimeler, Asitler ve Bazlar",
      "Maddenin Isı ile Etkileşimi",
      "Basınç",
      "Enerji Dönüşümleri ve Çevre Sorunları",
      "Elektrik Yükleri ve Elektriklenme",
      "Elektrik Enerjisinin Dönüşümü",
    ]],
    ["inkilap", "T.C. İnkılap Tarihi ve Atatürkçülük", [
      "Bir Kahraman Doğuyor",
      "Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar",
      "Ya İstiklal Ya Ölüm!",
      "Atatürkçülük ve Çağdaşlaşan Türkiye",
      "Demokratikleşme Çabaları",
      "Atatürk Dönemi Türk Dış Politikası ve Ekonomi",
      "Atatürk'ün Ölümü ve Sonrası",
    ]],
    ["ingilizce", "İngilizce", ENGLISH_TOPICS],
    ["din", "Din Kültürü ve Ahlak Bilgisi", [
      "Kader İnancı",
      "Zekât, Hac ve Kurban",
      "Din, Kültür ve Sanat",
      "Hz. Muhammed'in Örnek Ahlakı",
      "Kur'an'dan Mesajlar",
    ]],
  ]),

  grade("9", "9. Sınıf", "Lise", [
    ["edebiyat", "Türk Dili ve Edebiyatı", [
      "Giriş: Metinlerin Sınıflandırılması",
      "Şiir İnceleme Yöntemi",
      "Anlatım Türleri (Öyküleyici, Betimleyici vb.)",
      "Coşku ve Heyecanı Dile Getiren Metinler (Şiir)",
      "Olay Çevresinde Oluşan Metinler (Hikâye)",
    ]],
    ["matematik", "Matematik", [
      "Temel Kavramlar ve Mantık",
      "Sayılar (Kümeler, Rasyonel-İrrasyonel)",
      "Üslü ve Köklü Sayılar",
      "Çarpanlara Ayırma",
      "Denklemler ve Eşitsizlikler",
      "Oran-Orantı ve Problemler",
      "Kümeler",
      "Fonksiyonlara Giriş",
    ]],
    ["fizik", "Fizik", [
      "Fizik Bilimine Giriş",
      "Madde ve Özellikleri",
      "Hareket ve Kuvvet",
      "İş, Güç ve Enerji",
      "Isı ve Sıcaklık",
      "Elektrostatik",
    ]],
    ["kimya", "Kimya", [
      "Kimya Bilimi",
      "Atom ve Periyodik Sistem",
      "Kimyasal Türler Arası Etkileşimler",
      "Maddenin Halleri",
      "Doğa ve Kimya",
    ]],
    ["biyoloji", "Biyoloji", [
      "Yaşam Bilimi Biyoloji",
      "Hücre",
      "Canlılar Dünyası",
    ]],
    ["tarih", "Tarih", [
      "Tarih Bilimine Giriş",
      "İlk ve Orta Çağlarda Dünya",
      "İslam Tarihi ve Uygarlığı",
      "Türk-İslam Devletleri",
    ]],
    ["cografya", "Coğrafya", [
      "Doğa ve İnsan",
      "Dünya'nın Şekli ve Hareketleri",
      "Coğrafi Konum",
      "İklim Bilgisi",
    ]],
    ["ingilizce", "İngilizce", ENGLISH_TOPICS],
    ["din", "Din Kültürü ve Ahlak Bilgisi", [
      "Bilgi ve İnanç",
      "İslam ve İbadet",
      "Gençlik ve Değerler",
    ]],
  ]),

  grade("10", "10. Sınıf", "Lise", [
    ["edebiyat", "Türk Dili ve Edebiyatı", [
      "Anlatım Biçimleri",
      "Şiir İncelemesi (Kavramlar)",
      "Halk Edebiyatına Giriş",
      "Divan Edebiyatına Giriş",
      "Öğretici Metinler (Makale, Deneme)",
    ]],
    ["matematik", "Matematik", [
      "Fonksiyonlar",
      "Polinomlar",
      "İkinci Dereceden Denklemler",
      "Trigonometriye Giriş",
      "Analitik Geometriye Giriş",
      "Olasılık",
    ]],
    ["fizik", "Fizik", [
      "Basınç ve Kaldırma Kuvveti",
      "Isı, Sıcaklık ve Genleşme",
      "Elektrik ve Manyetizma",
      "Dalgalar",
      "Optik",
    ]],
    ["kimya", "Kimya", [
      "Kimyasal Hesaplamalar (Mol Kavramı)",
      "Karışımlar",
      "Asit, Baz ve Tuz",
      "Kimya Her Yerde",
    ]],
    ["biyoloji", "Biyoloji", [
      "Hücre Bölünmeleri (Mitoz - Mayoz)",
      "Kalıtım",
      "Ekosistem Ekolojisi",
      "Canlılar ve Çevre",
    ]],
    ["tarih", "Tarih", [
      "Beylikten Devlete Osmanlı Siyaseti",
      "Devlet-i Aliyye (Dünya Gücü Osmanlı)",
      "Değişen Dünya Dengeleri Karşısında Osmanlı",
      "Uluslararası İlişkilerde Denge Stratejisi",
    ]],
    ["cografya", "Coğrafya", [
      "Nüfus",
      "Göç",
      "Yerleşme",
      "Ekonomik Faaliyetler ve Doğal Kaynaklar",
    ]],
    ["ingilizce", "İngilizce", ENGLISH_TOPICS],
    ["din", "Din Kültürü ve Ahlak Bilgisi", [
      "İslam Düşüncesinde Yorumlar",
      "Dinler Tarihi",
      "Ahlaki Tutum ve Davranışlar",
    ]],
  ]),

  grade("11", "11. Sınıf", "Lise", [
    ["edebiyat", "Türk Dili ve Edebiyatı", [
      "Tanzimat, Servet-i Fünun ve Fecr-i Ati Edebiyatı",
      "Milli Edebiyat",
      "Cumhuriyet Dönemi Şiirine Giriş",
      "Cumhuriyet Dönemi Roman ve Hikâyeye Giriş",
    ]],
    ["matematik", "Matematik", [
      "Trigonometri",
      "Analitik Geometri",
      "Fonksiyonlarda Uygulamalar",
      "Diziler",
      "Logaritma",
      "Türeve Giriş",
    ]],
    ["fizik", "Fizik", [
      "Vektörler",
      "Newton'un Hareket Yasaları",
      "Enerji, İş ve Güç",
      "Elektrik Alan ve Potansiyel",
      "Manyetizma",
      "Elektromanyetik İndüksiyon",
    ]],
    ["kimya", "Kimya", [
      "Modern Atom Teorisi",
      "Gazlar",
      "Sıvı Çözeltiler ve Derişim",
      "Kimyasal Tepkimelerde Enerji (Entalpi)",
      "Kimyasal Tepkimelerde Hız ve Denge",
    ]],
    ["biyoloji", "Biyoloji", [
      "İnsan Fizyolojisi: Sinir, Endokrin ve Duyu Sistemleri",
      "Destek ve Hareket Sistemi",
      "Sindirim Sistemi",
      "Dolaşım ve Bağışıklık Sistemi",
      "Solunum Sistemi",
      "Üriner Sistem (Boşaltım)",
    ]],
    ["tarih", "Tarih", [
      "XX. Yüzyıl Başlarında Osmanlı Devleti ve Dünya",
      "I. Dünya Savaşı",
      "Milli Mücadele",
      "Atatürk İlkeleri ve İnkılap Tarihi",
    ]],
    ["cografya", "Coğrafya", [
      "Türkiye'nin Yer Şekilleri",
      "Türkiye'nin İklimi",
      "Türkiye'de Nüfus ve Yerleşme",
      "Türkiye Ekonomisi",
    ]],
    ["felsefe", "Felsefe", [
      "Felsefeye Giriş",
      "Bilgi Felsefesi",
      "Varlık Felsefesi",
      "Ahlak Felsefesi",
      "Sanat Felsefesi",
    ]],
    ["ingilizce", "İngilizce", ENGLISH_TOPICS],
    ["din", "Din Kültürü ve Ahlak Bilgisi", [
      "İslam ve Bilim",
      "Güncel Dini Meseleler",
      "Hint ve Çin Dinleri",
    ]],
  ]),

  grade("12", "12. Sınıf", "Lise", [
    ["edebiyat", "Türk Dili ve Edebiyatı", [
      "Cumhuriyet Dönemi Şiiri",
      "Cumhuriyet Dönemi Roman ve Hikâyesi",
      "Cumhuriyet Dönemi Tiyatrosu",
      "Dünya Edebiyatından Örnekler",
    ]],
    ["matematik", "Matematik", [
      "Limit ve Süreklilik",
      "Türev",
      "Türevin Uygulamaları",
      "İntegral",
    ]],
    ["fizik", "Fizik", [
      "Elektrik Devreleri",
      "Alternatif Akım ve Transformatörler",
      "Çembersel Hareket",
      "Basit Harmonik Hareket",
      "Modern Fizik",
      "Atom Fiziğinden Günümüze",
    ]],
    ["kimya", "Kimya", [
      "Kimyasal Denge",
      "Asit-Baz Dengesi",
      "Çözünürlük Dengesi",
      "Elektrokimya (Piller ve Elektroliz)",
      "Organik Kimyaya Giriş",
      "Enerji Kaynakları ve Bilimsel Gelişmeler",
    ]],
    ["biyoloji", "Biyoloji", [
      "Bitki Biyolojisi",
      "Komünite ve Popülasyon Ekolojisi",
      "Genden Proteine",
      "Canlılarda Enerji Dönüşümleri (Fotosentez, Hücresel Solunum)",
      "Bitki ve Hayvanlarda Üreme",
      "Canlılar ve Çevre",
    ]],
    ["tarih", "Tarih (T.C. İnkılap Tarihi ve Atatürkçülük)", [
      "İki Savaş Arası Dönemde Türkiye ve Dünya",
      "II. Dünya Savaşı",
      "Soğuk Savaş Dönemi",
      "Yumuşama Dönemi ve Sonrası",
      "Küreselleşen Dünya",
    ]],
    ["cografya", "Coğrafya", [
      "Türkiye'de Ekonomik Faaliyetler",
      "Bölgeler ve Ülkeler",
      "Küresel Ortam: Bölgeler ve Ülkeler",
      "Çevre ve Toplum",
    ]],
    ["din", "Din Kültürü ve Ahlak Bilgisi", [
      "Hint, Çin ve Yahudilik-Hristiyanlık",
      "Yaşayan Dinler",
      "Güncel Ahlaki Meseleler",
    ]],
  ]),
];

export function getGradeById(id: string): CurriculumGrade | undefined {
  return CURRICULUM.find((g) => g.id === id);
}

export function getTopicById(topicId: string): { grade: CurriculumGrade; subject: CurriculumSubject; topic: CurriculumTopic } | undefined {
  for (const g of CURRICULUM) {
    for (const s of g.subjects) {
      const t = s.topics.find((t) => t.id === topicId);
      if (t) return { grade: g, subject: s, topic: t };
    }
  }
  return undefined;
}

export function allTopicIds(): Set<string> {
  const ids = new Set<string>();
  for (const g of CURRICULUM) for (const s of g.subjects) for (const t of s.topics) ids.add(t.id);
  return ids;
}
