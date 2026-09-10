// Öğrenci hesabıyla giriş yapıldıktan sonra doldurulan öz-değerlendirme
// testleri (bkz. /testler). Cevaplar sunucuda puanlanır ve öğrenciye bağlı
// olarak veritabanında saklanır; admin panelinden Orhan Yaşlı tarafından
// görüntülenir (bkz. src/app/api/student/test-submission/route.ts).
//
// Önemli — kaynak durumu (dürüst envanter):
// - "Sınav Kaygısı Ölçeği" ve "Öğrenme Stili Testi" tamamen özgündür,
//   Orhan Yaşlı için hazırlanmıştır; resmî/standart bir ölçek DEĞİLDİR.
// - "Genel Kaygı Taraması", GAD-7'nin Türkçe uyarlama çalışmasından
//   (Konkan ve ark., 2013, Nöropsikiyatri Arşivi) alınan, doğrulanmış
//   kesme puanını (≥8) kullanır. Madde metinleri GAD-7'nin uluslararası
//   standart İngilizce içeriğinin çevirisidir — Türkçe uyarlama
//   makalesinin birebir çeviri metni bu ortamdan doğrulanamadı.
// - "İyi Oluş Endeksi", Dünya Sağlık Örgütü'nün resmî, çok dilli WHO-5
//   Well-Being Index'inden alınan, uluslararası kabul görmüş tarama
//   eşiğini (ham puan ≤13) kullanır. DSÖ bu ölçeği Türkçe dahil onlarca
//   dilde resmî olarak yayınlar (who.int); madde metinleri bu resmî
//   çevirinin birebir kopyası OLMAYIP uyarlamadır.
// - Beck Depresyon Envanteri, Rosenberg Benlik Saygısı Ölçeği (Türkçe
//   uyarlamasının puanlama yöntemi orijinalinden farklı — Guttman tipi),
//   PHQ-9 gibi ölçekler, madde metni/puanlama yöntemi bu ortamda birebir
//   doğrulanamadığı için BİLEREK EKLENMEDİ. Resmî kaynağı (PDF/makale)
//   sağlarsan birebir aktarılabilir.
//
// Öğrenciye SADECE ham puan gösterilir (bkz. PsychTestClient.tsx),
// yorum/bant/klinik değerlendirme gösterilmez — bu, danışmanlık sürecinde
// Orhan Yaşlı tarafından yapılır (admin panelinde tam bant + açıklama görünür).

export type LikertOption = { label: string; value: number };

export type LikertBand = {
  min: number;
  max: number;
  label: string;
  /** Yalnızca admin panelinde görünür — öğrenciye asla gösterilmez. */
  description: string;
  tone: "low" | "mid" | "high";
};

export type LikertTest = {
  slug: string;
  kind: "likert";
  title: string;
  shortDesc: string;
  category: string;
  estimatedMinutes: number;
  intro: string;
  source?: string;
  options: LikertOption[];
  questions: { id: string; text: string; reverse?: boolean }[];
  bands: LikertBand[];
  disclaimer: string;
};

export type CategoryOption = { label: string; category: string };

export type CategoryResult = { label: string; description: string; tips: string[] };

export type CategoryTest = {
  slug: string;
  kind: "category";
  title: string;
  shortDesc: string;
  category: string;
  estimatedMinutes: number;
  intro: string;
  questions: { id: string; text: string; options: CategoryOption[] }[];
  results: Record<string, CategoryResult>;
  disclaimer: string;
};

export type PsychTest = LikertTest | CategoryTest;

const CRISIS_NOTE =
  "Bu test bir tanı aracı değildir, sadece farkındalık amaçlıdır. Kendine ya da başkasına zarar verme düşüncen varsa hemen 112'yi ara ya da bir yakınından yardım iste.";

const HAND_OFF_NOTE = "Sonunda sadece puanını göreceksin; ne anlama geldiğini bir sonraki görüşmede Orhan Yaşlı ile birlikte değerlendireceksiniz.";

const examAnxietyOptions: LikertOption[] = [
  { label: "Hiçbir zaman", value: 0 },
  { label: "Bazen", value: 1 },
  { label: "Sık sık", value: 2 },
  { label: "Her zaman", value: 3 },
];

export const examAnxietyTest: LikertTest = {
  slug: "sinav-kaygisi",
  kind: "likert",
  title: "Sınav Kaygısı Ölçeği",
  shortDesc: "Sınav öncesi ve sırasında yaşadığın kaygının düzeyini gösteren kısa bir öz-değerlendirme.",
  category: "Sınav Koçluğu",
  estimatedMinutes: 3,
  intro: `Aşağıdaki 10 ifadeyi, son bir ay içindeki sınav deneyimlerini düşünerek yanıtla. Doğru ya da yanlış cevap yok. ${HAND_OFF_NOTE}`,
  source: "Bu ölçek Orhan Yaşlı tarafından sınav koçluğu danışanları için özgün olarak hazırlanmıştır; standart/validasyonu yapılmış bir ölçek değildir.",
  options: examAnxietyOptions,
  questions: [
    { id: "q1", text: "Sınav öncesi kalbimin hızlı attığını fark ederim." },
    { id: "q2", text: "Sınav sırasında bildiğim bir soruyu bile hatırlayamadığım anlar olur." },
    { id: "q3", text: "Sınava yaklaştıkça uyku düzenim bozulur." },
    { id: "q4", text: "Sınav düşüncesi ders çalışmamı ya da günlük hayatımı olumsuz etkiler." },
    { id: "q5", text: "Sınavda başarısız olursam çevremin beni yargılayacağını düşünürüm." },
    { id: "q6", text: "Sınav öncesi mide bulantısı, kramp gibi fiziksel belirtiler yaşarım." },
    { id: "q7", text: "Kendimi diğer sınava girecek arkadaşlarımla kıyaslayıp kaygılanırım." },
    { id: "q8", text: "Sonucu düşünmek, sınav sırasında soruya odaklanmamı zorlaştırır." },
    { id: "q9", text: "Sınav sabahı ellerimin terlediğini ya da titrediğini fark ederim." },
    { id: "q10", text: "Bir sınavda başarısız olmanın hayatımı tamamen olumsuz etkileyeceğini düşünürüm." },
  ],
  bands: [
    {
      min: 0,
      max: 9,
      tone: "low",
      label: "Düşük sınav kaygısı",
      description:
        "Kaygı düzeyi, sınav performansını olumsuz etkileyecek boyutta görünmüyor. Mevcut çalışma ve hazırlık rutini sürdürülebilir.",
    },
    {
      min: 10,
      max: 19,
      tone: "mid",
      label: "Orta düzey sınav kaygısı",
      description:
        "Sınav dönemlerinde belirgin bir gerginlik yaşıyor olabilir. Nefes egzersizleri, düzenli çalışma planı ve deneme sınavlarıyla alışkanlık kazanmak bu düzeyi azaltabilir.",
    },
    {
      min: 20,
      max: 30,
      tone: "high",
      label: "Yüksek sınav kaygısı",
      description:
        "Kaygı düzeyi günlük yaşamı ve sınav performansını etkiliyor olabilir. Görüşmede bu konu detaylı ele alınmalı.",
    },
  ],
  disclaimer: CRISIS_NOTE,
};

const anxietyScreeningOptions: LikertOption[] = [
  { label: "Hiç", value: 0 },
  { label: "Birkaç gün", value: 1 },
  { label: "Günlerin yarısından fazlasında", value: 2 },
  { label: "Neredeyse her gün", value: 3 },
];

export const anxietyScreeningTest: LikertTest = {
  slug: "genel-kaygi-taramasi",
  kind: "likert",
  title: "Genel Kaygı Taraması",
  shortDesc: "Son iki haftadır ne sıklıkla kaygı belirtileri yaşadığını gösteren kısa bir tarama.",
  category: "Psikolojik Destek",
  estimatedMinutes: 2,
  intro: `Son iki hafta içinde, aşağıdaki durumlardan her biri seni ne sıklıkla rahatsız etti? ${HAND_OFF_NOTE}`,
  source:
    "GAD-7'nin (Generalized Anxiety Disorder-7) uluslararası standart maddelerinden uyarlanmıştır. Kesme puanı, GAD-7'nin Türkçe uyarlama çalışmasından alınmıştır: Konkan ve ark. (2013), \"Yaygın Anksiyete Bozukluğu-7 (YAB-7) Testi Türkçe Uyarlaması, Geçerlik ve Güvenirliği\", Nöropsikiyatri Arşivi — klinik olarak anlamlı kabul edilen kesme puanı: 8.",
  options: anxietyScreeningOptions,
  questions: [
    { id: "q1", text: "Sinirli, endişeli ya da gergin hissetme" },
    { id: "q2", text: "Endişelenmeyi durduramama ya da kontrol edememe" },
    { id: "q3", text: "Farklı konular hakkında aşırı endişelenme" },
    { id: "q4", text: "Rahatlamakta zorlanma" },
    { id: "q5", text: "Yerinde duramayacak kadar huzursuz hissetme" },
    { id: "q6", text: "Kolayca sinirlenme ya da huzursuzlaşma" },
    { id: "q7", text: "Sanki kötü bir şey olacakmış gibi bir korku hissetme" },
  ],
  bands: [
    {
      min: 0,
      max: 7,
      tone: "low",
      label: "Kesme değerinin altında (<8)",
      description: "Türkçe YAB-7 uyarlamasının (Konkan ve ark., 2013) klinik olarak anlamlı kabul ettiği kesme puanının (8) altında.",
    },
    {
      min: 8,
      max: 21,
      tone: "high",
      label: "Kesme değerinde/üzerinde (≥8)",
      description: "Türkçe YAB-7 uyarlamasının (Konkan ve ark., 2013) klinik olarak anlamlı kabul ettiği kesme puanına (8) ulaşmış ya da üzerinde. Görüşmede değerlendirilmeli.",
    },
  ],
  disclaimer: CRISIS_NOTE,
};

export const who5Test: LikertTest = {
  slug: "iyi-olus-endeksi",
  kind: "likert",
  title: "İyi Oluş Endeksi",
  shortDesc: "Dünya Sağlık Örgütü'nün 5 soruluk iyi oluş tarama ölçeği.",
  category: "Psikolojik Destek",
  estimatedMinutes: 1,
  intro: `Son iki hafta için, aşağıdaki ifadelerin senin için ne kadar geçerli olduğunu işaretle. ${HAND_OFF_NOTE}`,
  source:
    "Dünya Sağlık Örgütü'nün resmî, çok dilli WHO-5 Well-Being Index'inden (İyi Oluş Endeksi) uyarlanmıştır; DSÖ bu ölçeği Türkçe dahil onlarca dilde ücretsiz/resmî olarak yayınlar (who.int). Tarama eşiği uluslararası kabul görmüş standarttır: ham puan ≤13 (ya da yüzdelik <%50) ek değerlendirme/görüşme önerilir.",
  options: [
    { label: "Hiçbir zaman", value: 0 },
    { label: "Ara sıra", value: 1 },
    { label: "Zamanın yarısından azında", value: 2 },
    { label: "Zamanın yarısından fazlasında", value: 3 },
    { label: "Çoğu zaman", value: 4 },
    { label: "Her zaman", value: 5 },
  ],
  questions: [
    { id: "q1", text: "Kendimi neşeli ve keyifli hissettim." },
    { id: "q2", text: "Kendimi sakin ve huzurlu hissettim." },
    { id: "q3", text: "Kendimi enerjik ve aktif hissettim." },
    { id: "q4", text: "Uyandığımda kendimi dinlenmiş ve zinde hissettim." },
    { id: "q5", text: "Günlük hayatım ilgimi çeken şeylerle doluydu." },
  ],
  bands: [
    {
      min: 0,
      max: 13,
      tone: "high",
      label: "Tarama eşiğinde/altında (≤13)",
      description: "WHO-5'in uluslararası kabul görmüş tarama eşiğinde ya da altında (ham puan ≤13, yüzdelik <%50). Ek değerlendirme/görüşme önerilir.",
    },
    {
      min: 14,
      max: 25,
      tone: "low",
      label: "Tarama eşiğinin üzerinde (>13)",
      description: "WHO-5'in uluslararası kabul görmüş tarama eşiğinin üzerinde (ham puan >13, yüzdelik >%50).",
    },
  ],
  disclaimer: CRISIS_NOTE,
};

export const learningStyleTest: CategoryTest = {
  slug: "ogrenme-stili",
  kind: "category",
  title: "Çalışma / Öğrenme Stili Testi",
  shortDesc: "Görsel, işitsel ya da kinestetik hangi öğrenme tarzına daha yatkın olduğunu keşfet.",
  category: "Sınav Koçluğu",
  estimatedMinutes: 3,
  intro: "Her soruda seni en iyi anlatan seçeneği işaretle. Sonunda baskın çalışma tarzını ve sana özel çalışma önerilerini göreceksin.",
  questions: [
    {
      id: "q1",
      text: "Yeni bir konuyu öğrenirken en çok neyden faydalanırsın?",
      options: [
        { label: "Şema, grafik ve renkli notlardan", category: "gorsel" },
        { label: "Sesli anlatım ya da tartışmadan", category: "isitsel" },
        { label: "Örnek çözerek, uygulama yaparak", category: "kinestetik" },
      ],
    },
    {
      id: "q2",
      text: "Ders çalışırken hangisi seni daha çok rahatsız eder?",
      options: [
        { label: "Dağınık, karmaşık görünen bir sayfa", category: "gorsel" },
        { label: "Gürültü ya da sürekli konuşma", category: "isitsel" },
        { label: "Uzun süre hareketsiz oturmak", category: "kinestetik" },
      ],
    },
    {
      id: "q3",
      text: "Bir konuyu hatırlamaya çalışırken zihninde ne canlanır?",
      options: [
        { label: "Sayfanın veya şemanın görüntüsü", category: "gorsel" },
        { label: "Öğretmenin ya da kendi sesin", category: "isitsel" },
        { label: "O konuyla ilgili yaptığın bir hareket/uygulama", category: "kinestetik" },
      ],
    },
    {
      id: "q4",
      text: "Yeni bir bilgiyi en kolay nasıl akılda tutarsın?",
      options: [
        { label: "Renkli kalemle not alarak, çizerek", category: "gorsel" },
        { label: "Sesli tekrar ederek ya da başkasına anlatarak", category: "isitsel" },
        { label: "Elimle yazarak ya da soru çözerek", category: "kinestetik" },
      ],
    },
    {
      id: "q5",
      text: "Bir video izlerken en çok neye dikkat edersin?",
      options: [
        { label: "Görsellere, animasyonlara, altyazıya", category: "gorsel" },
        { label: "Anlatıcının sesine ve tonuna", category: "isitsel" },
        { label: "Videodaki uygulamayı kendim de yapmaya çalışırım", category: "kinestetik" },
      ],
    },
    {
      id: "q6",
      text: "Boş zamanında hangisini yapmayı tercih edersin?",
      options: [
        { label: "Kitap/dergi okumak, resim çizmek", category: "gorsel" },
        { label: "Müzik dinlemek, podcast/sohbet", category: "isitsel" },
        { label: "Spor yapmak, bir şeyler üretmek/inşa etmek", category: "kinestetik" },
      ],
    },
    {
      id: "q7",
      text: "Sınavda bir soruyu çözerken nasıl bir yol izlersin?",
      options: [
        { label: "Önce soruyu zihnimde görselleştiririm", category: "gorsel" },
        { label: "Soruyu kendi kendime sesli/içimden okurum", category: "isitsel" },
        { label: "Direkt kâğıt üzerinde deneyerek ilerlerim", category: "kinestetik" },
      ],
    },
    {
      id: "q8",
      text: "Uzun bir ders anlatımını dinlerken en çok ne işine yarar?",
      options: [
        { label: "Slayt, tablo ya da yazılı özet", category: "gorsel" },
        { label: "Anlatımın kendisi, hiçbir görsele gerek duymam", category: "isitsel" },
        { label: "Ara sıra durup notlarımı elle çıkarmak", category: "kinestetik" },
      ],
    },
    {
      id: "q9",
      text: "Yeni bir yere giderken yol tarifini nasıl daha kolay hatırlarsın?",
      options: [
        { label: "Haritaya bakarak", category: "gorsel" },
        { label: "Sözlü tarif dinleyerek", category: "isitsel" },
        { label: "Bir kere kendim yürüyerek/giderek", category: "kinestetik" },
      ],
    },
  ],
  results: {
    gorsel: {
      label: "Görsel Öğrenen",
      description:
        "Bilgiyi en iyi görerek, okuyarak ve görselleştirerek öğreniyorsun. Renkli notlar, şemalar ve zihin haritaları senin için güçlü araçlar.",
      tips: [
        "Konu özetlerini renkli kalemler ve şemalarla çıkar.",
        "Zihin haritası (mind map) yöntemini dene.",
        "Ders videolarında altyazı ve slaytları takip et.",
      ],
    },
    isitsel: {
      label: "İşitsel Öğrenen",
      description:
        "Bilgiyi dinleyerek ve sesli tekrar ederek daha iyi öğreniyorsun. Anlatım, tartışma ve sesli tekrar senin için etkili.",
      tips: [
        "Konuyu yüksek sesle kendine ya da bir arkadaşına anlat.",
        "Ders kayıtlarını veya podcast tarzı özetleri dinle.",
        "Önemli bilgileri sesli kaydedip tekrar dinle.",
      ],
    },
    kinestetik: {
      label: "Kinestetik Öğrenen",
      description:
        "Bilgiyi yaparak, uygulayarak ve hareket ederek daha iyi öğreniyorsun. Uzun süre pasif dinlemek senin için zor olabilir.",
      tips: [
        "Konuyu öğrenir öğrenmez hemen soru çözerek pekiştir.",
        "Çalışırken kısa aralarla ayağa kalk, hareket et.",
        "Bilgiyi elle yazarak, kart yaparak ya da modelleyerek çalış.",
      ],
    },
  },
  disclaimer: CRISIS_NOTE,
};

export const PSYCH_TESTS: PsychTest[] = [
  examAnxietyTest,
  anxietyScreeningTest,
  who5Test,
  learningStyleTest,
];

export function getTestBySlug(slug: string): PsychTest | undefined {
  return PSYCH_TESTS.find((t) => t.slug === slug);
}

export function scoreLikertTest(test: LikertTest, answers: Record<string, number>) {
  const maxOptionValue = Math.max(...test.options.map((o) => o.value));
  const total = test.questions.reduce((sum, q) => {
    const raw = answers[q.id] ?? 0;
    return sum + (q.reverse ? maxOptionValue - raw : raw);
  }, 0);
  const band = test.bands.find((b) => total >= b.min && total <= b.max) ?? test.bands[test.bands.length - 1];
  return { total, band };
}

export function scoreCategoryTest(test: CategoryTest, answers: Record<string, string>) {
  const tally: Record<string, number> = {};
  for (const q of test.questions) {
    const category = answers[q.id];
    if (!category) continue;
    tally[category] = (tally[category] ?? 0) + 1;
  }
  let topCategory: string | null = null;
  let topCount = -1;
  for (const [category, count] of Object.entries(tally)) {
    if (count > topCount) {
      topCategory = category;
      topCount = count;
    }
  }
  const result = topCategory ? test.results[topCategory] : undefined;
  return { tally, topCategory, result };
}
