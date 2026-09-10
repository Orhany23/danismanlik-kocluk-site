// Ziyaretçiye yönelik, tamamen anonim öz-değerlendirme testleri.
//
// Önemli: Bunlar klinik tanı araçları DEĞİLDİR. Beck Depresyon Envanteri,
// DASS-21, STAI gibi çoğu standart ölçek telif korumalıdır ve izinsiz
// kullanılamaz. Buradaki testler ya tamamen özgün (Orhan Yaşlı için
// hazırlanmış) ya da uluslararası taramalarda yaygın kullanılan, telifsiz
// soru setlerinden esinlenerek yeniden yazılmıştır. Sonuç, ekranda anlık
// hesaplanır; sunucuya veya veritabanına hiçbir cevap gönderilmez/kaydedilmez.

export type LikertOption = { label: string; value: number };

export type LikertBand = {
  min: number;
  max: number;
  label: string;
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
  questions: { id: string; text: string }[];
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
  intro:
    "Aşağıdaki 10 ifadeyi, son bir ay içindeki sınav deneyimlerini düşünerek yanıtla. Doğru ya da yanlış cevap yok; ne kadar sık hissettiğini işaretlemen yeterli.",
  source: "Bu ölçek Orhan Yaşlı tarafından sınav koçluğu danışanları için özgün olarak hazırlanmıştır.",
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
        "Kaygı düzeyin, sınav performansını olumsuz etkileyecek boyutta görünmüyor. Mevcut çalışma ve hazırlık rutinini sürdürebilirsin.",
    },
    {
      min: 10,
      max: 19,
      tone: "mid",
      label: "Orta düzey sınav kaygısı",
      description:
        "Sınav dönemlerinde belirgin bir gerginlik yaşıyor olabilirsin. Nefes egzersizleri, düzenli çalışma planı ve deneme sınavlarıyla alışkanlık kazanmak bu düzeyi azaltabilir.",
    },
    {
      min: 20,
      max: 30,
      tone: "high",
      label: "Yüksek sınav kaygısı",
      description:
        "Kaygı düzeyin günlük yaşamını ve sınav performansını etkiliyor olabilir. Bir koç veya psikolojik danışmanla bu konuyu konuşman faydalı olur.",
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
  title: "Genel Kaygı / Stres Taraması",
  shortDesc: "Son iki haftadır ne sıklıkla kaygı belirtileri yaşadığını gösteren kısa bir tarama.",
  category: "Psikolojik Destek",
  estimatedMinutes: 2,
  intro:
    "Son iki hafta içinde, aşağıdaki durumlardan her biri seni ne sıklıkla rahatsız etti? Bu bir tanı testi değil, farkındalık amaçlı bir taramadır.",
  source:
    "Uluslararası kaygı taramalarında (GAD-7) yaygın kullanılan maddelerden esinlenerek hazırlanmıştır; resmî/klinik ölçek yerine geçmez.",
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
      max: 4,
      tone: "low",
      label: "Minimal düzey",
      description: "Belirtilerin günlük yaşamını etkileyecek düzeyde görünmüyor.",
    },
    {
      min: 5,
      max: 9,
      tone: "mid",
      label: "Hafif düzey",
      description: "Hafif düzeyde kaygı belirtileri yaşıyor olabilirsin. Uyku, hareket ve mola düzenine dikkat etmek faydalı olabilir.",
    },
    {
      min: 10,
      max: 14,
      tone: "mid",
      label: "Orta düzey",
      description: "Belirtiler günlük yaşamını etkiliyor olabilir. Bir psikolojik danışmanla konuşman önerilir.",
    },
    {
      min: 15,
      max: 21,
      tone: "high",
      label: "Yüksek düzey",
      description: "Belirtiler yoğun görünüyor. Bir ruh sağlığı uzmanından destek almanı öneririz.",
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

export const PSYCH_TESTS: PsychTest[] = [examAnxietyTest, anxietyScreeningTest, learningStyleTest];

export function getTestBySlug(slug: string): PsychTest | undefined {
  return PSYCH_TESTS.find((t) => t.slug === slug);
}

export function scoreLikertTest(test: LikertTest, answers: Record<string, number>) {
  const total = test.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
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
