// Öğrenci hesabıyla giriş yapıldıktan sonra doldurulan öz-değerlendirme
// testleri (bkz. /testler). Cevaplar sunucuda puanlanır ve öğrenciye bağlı
// olarak veritabanında saklanır; admin panelinden Orhan Yaşlı tarafından
// görüntülenir (bkz. src/app/api/student/test-submission/route.ts).
//
// Önemli: Bunlar klinik tanı araçları DEĞİLDİR. Beck Depresyon Envanteri,
// DASS-21, STAI, Yale-Brown OKB gibi çoğu standart klinik ölçek, izinsiz
// kullanımı kısıtlayan bir telif/lisans rejimine tabidir. Buradaki testler
// ya tamamen özgün (Orhan Yaşlı için hazırlanmış) ya da telif hakkı sahibi
// tarafından ücretsiz/serbest kullanıma açıkça izin verilen, dünya genelinde
// en yaygın kullanılan ölçeklerden uyarlanmıştır (PHQ-9, Rosenberg Benlik
// Saygısı Ölçeği, DSÖ-5 İyi Oluş Endeksi, GAD-7).

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
  questions: { id: string; text: string; reverse?: boolean }[];
  bands: LikertBand[];
  disclaimer: string;
  /** true ise öğrenci ham puanı/bandı görmez; yalnızca admin panelinde görünür. */
  hideResultFromUser?: boolean;
  /** Bu soruya olumlu (0'dan farklı) cevap verilirse anlık kriz mesajı gösterilir ve danışmana uyarı gönderilir. */
  crisisItemId?: string;
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

const phq9Options: LikertOption[] = [
  { label: "Hiç", value: 0 },
  { label: "Birkaç gün", value: 1 },
  { label: "Günlerin yarısından fazlasında", value: 2 },
  { label: "Neredeyse her gün", value: 3 },
];

const SELF_HARM_ITEM_ID = "q9";

export const phq9Test: LikertTest = {
  slug: "depresyon-taramasi",
  kind: "likert",
  title: "Depresyon Taraması",
  shortDesc: "Dünya genelinde en yaygın kullanılan depresyon tarama ölçeklerinden biri.",
  category: "Psikolojik Destek",
  estimatedMinutes: 3,
  intro:
    "Son iki hafta içinde, aşağıdaki durumlardan her biri seni ne sıklıkla rahatsız etti? Bu bir tanı testi değildir; cevapların, danışmanlık sürecinde birlikte değerlendirilmek üzere kaydedilir.",
  source:
    "PHQ-9 (Patient Health Questionnaire-9) ölçeğinden uyarlanmıştır. Pfizer Inc. tarafından geliştirilen bu ölçek, izin gerektirmeden serbestçe kullanılabilir; resmî/klinik tanı yerine geçmez.",
  options: phq9Options,
  questions: [
    { id: "q1", text: "Bir şeylere karşı ilgi duymamak ya da bir şeylerden keyif alamamak" },
    { id: "q2", text: "Kendini üzgün, çökkün ya da umutsuz hissetmek" },
    { id: "q3", text: "Uykuya dalmakta/uykuyu sürdürmekte zorlanmak ya da çok fazla uyumak" },
    { id: "q4", text: "Yorgun hissetmek ya da enerjisiz olmak" },
    { id: "q5", text: "İştahsızlık ya da aşırı yemek yeme" },
    { id: "q6", text: "Kendini kötü hissetmek — kendini başarısız biri olarak görmek ya da kendini/ailesini hayal kırıklığına uğrattığını düşünmek" },
    { id: "q7", text: "Bir şeye (ders çalışmak, kitap okumak, TV izlemek gibi) odaklanmakta zorlanmak" },
    { id: "q8", text: "Başkalarının fark edeceği kadar yavaş hareket etmek/konuşmak; ya da tam tersi, her zamankinden çok daha huzursuz ve hareketli olmak" },
    { id: "q9", text: "Kendine zarar verme ya da ölmüş olmayı dileme türünden düşünceler" },
  ],
  bands: [
    { min: 0, max: 4, tone: "low", label: "Minimal düzey", description: "Belirtilerin günlük yaşamını etkileyecek düzeyde görünmüyor." },
    { min: 5, max: 9, tone: "mid", label: "Hafif düzey", description: "Hafif düzeyde belirtiler yaşıyor olabilirsin." },
    { min: 10, max: 14, tone: "mid", label: "Orta düzey", description: "Belirtiler günlük yaşamını etkiliyor olabilir." },
    { min: 15, max: 19, tone: "high", label: "Orta-yüksek düzey", description: "Belirtiler belirgin görünüyor." },
    { min: 20, max: 27, tone: "high", label: "Yüksek düzey", description: "Belirtiler yoğun görünüyor." },
  ],
  disclaimer: CRISIS_NOTE,
  hideResultFromUser: true,
  crisisItemId: SELF_HARM_ITEM_ID,
};

const rosenbergOptions: LikertOption[] = [
  { label: "Kesinlikle katılmıyorum", value: 0 },
  { label: "Katılmıyorum", value: 1 },
  { label: "Katılıyorum", value: 2 },
  { label: "Kesinlikle katılıyorum", value: 3 },
];

export const rosenbergTest: LikertTest = {
  slug: "benlik-saygisi",
  kind: "likert",
  title: "Benlik Saygısı Ölçeği",
  shortDesc: "Dünya genelinde en çok kullanılan benlik saygısı ölçeklerinden biriyle kendini değerlendir.",
  category: "Psikolojik Destek",
  estimatedMinutes: 3,
  intro: "Aşağıdaki ifadelere ne kadar katıldığını işaretle. Doğru ya da yanlış cevap yok.",
  source: "Rosenberg Benlik Saygısı Ölçeği'nden (Rosenberg Self-Esteem Scale, 1965) uyarlanmıştır; serbestçe kullanılabilen, dünya genelinde en yaygın kullanılan psikoloji ölçeklerinden biridir.",
  options: rosenbergOptions,
  questions: [
    { id: "q1", text: "Genel olarak kendimden memnunum." },
    { id: "q2", text: "Bazen hiç iyi olmadığımı düşünürüm.", reverse: true },
    { id: "q3", text: "Birçok güzel özelliğim olduğunu düşünüyorum." },
    { id: "q4", text: "Çoğu insan kadar işleri iyi yapabilirim." },
    { id: "q5", text: "Gurur duyacağım fazla bir şeyim olmadığını düşünüyorum.", reverse: true },
    { id: "q6", text: "Bazen kesinlikle işe yaramaz olduğumu hissediyorum.", reverse: true },
    { id: "q7", text: "Kendimin, en az başkaları kadar değerli biri olduğunu düşünüyorum." },
    { id: "q8", text: "Kendime karşı daha fazla saygı duyabilmeyi isterdim.", reverse: true },
    { id: "q9", text: "Genel olarak kendimi başarısız biri olarak görme eğilimindeyim.", reverse: true },
    { id: "q10", text: "Kendime karşı olumlu bir tutumum var." },
  ],
  bands: [
    { min: 0, max: 14, tone: "high", label: "Düşük benlik saygısı", description: "Kendine bakışını zorlayan bir dönemden geçiyor olabilirsin. Bir danışmanla konuşmak bu alanı güçlendirebilir." },
    { min: 15, max: 25, tone: "mid", label: "Orta düzey benlik saygısı", description: "Çoğu insanın bulunduğu aralıktasın; iniş çıkışlar doğaldır." },
    { min: 26, max: 30, tone: "low", label: "Yüksek benlik saygısı", description: "Kendine dair genel olarak olumlu ve sağlam bir bakışın var." },
  ],
  disclaimer: CRISIS_NOTE,
};

const who5Options: LikertOption[] = [
  { label: "Hiçbir zaman", value: 0 },
  { label: "Ara sıra", value: 1 },
  { label: "Zamanın yarısından azında", value: 2 },
  { label: "Zamanın yarısından fazlasında", value: 3 },
  { label: "Çoğu zaman", value: 4 },
  { label: "Her zaman", value: 5 },
];

export const who5Test: LikertTest = {
  slug: "iyi-olus-endeksi",
  kind: "likert",
  title: "İyi Oluş Endeksi",
  shortDesc: "Dünya Sağlık Örgütü'nün 5 soruluk, dünya genelinde en yaygın kullanılan iyi oluş ölçeği.",
  category: "Psikolojik Destek",
  estimatedMinutes: 1,
  intro: "Son iki hafta için, aşağıdaki ifadelerin senin için ne kadar geçerli olduğunu işaretle.",
  source: "Dünya Sağlık Örgütü (DSÖ) İyi Oluş Endeksi'nden (WHO-5 Well-Being Index) uyarlanmıştır; DSÖ tarafından izin gerektirmeden serbest kullanıma açılmıştır.",
  options: who5Options,
  questions: [
    { id: "q1", text: "Kendimi neşeli ve keyifli hissettim." },
    { id: "q2", text: "Kendimi sakin ve huzurlu hissettim." },
    { id: "q3", text: "Kendimi enerjik ve aktif hissettim." },
    { id: "q4", text: "Uyandığımda kendimi dinlenmiş ve zinde hissettim." },
    { id: "q5", text: "Günlük hayatım ilgimi çeken şeylerle doluydu." },
  ],
  bands: [
    { min: 0, max: 12, tone: "high", label: "Düşük iyi oluş", description: "İyi oluş düzeyin düşük görünüyor. Bir danışmanla bu dönemi konuşman faydalı olabilir." },
    { min: 13, max: 18, tone: "mid", label: "Orta düzey iyi oluş", description: "Genel olarak dengeli bir dönemdesin; küçük destekler faydalı olabilir." },
    { min: 19, max: 25, tone: "low", label: "Yüksek iyi oluş", description: "Kendini genel olarak iyi ve dengeli hissediyorsun." },
  ],
  disclaimer: CRISIS_NOTE,
};

export const PSYCH_TESTS: PsychTest[] = [
  examAnxietyTest,
  anxietyScreeningTest,
  learningStyleTest,
  phq9Test,
  rosenbergTest,
  who5Test,
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
