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
// - Beck Depresyon Envanteri (BDE), Beck Anksiyete Ölçeği ve Beck Umutsuzluk
//   Ölçeği (BUÖ): Orhan Yaşlı'nın kendi klinik formlarından (PDF) birebir
//   aktarılmıştır. Kesme puanları gerçek Türkçe uyarlama çalışmalarından:
//   BDE → Hisli (1988), kesme puanı 17; Beck Anksiyete → Ulusoy ve ark.
//   (1998); BUÖ → Seber (1991), ters puanlanan maddeler (1,3,5,6,8,10,13,
//   15,19) ve kesme puanları (0-3/4-8/9-14/15-20) doğrulanmıştır.
// - Agorafobik Bilişler Ölçeği: Kart & Türkçapar'ın Türkçe uyarlama
//   çalışmasından (JCBPR, 2018) aktarılmıştır. Kaynak PDF'te 13 madde yer
//   alıyor (orijinali 14 maddedir); yayınlanmış bir kesme puanı/norm
//   bulunamadı — bu yüzden yorumlama tamamen klinik değerlendirmeye
//   bırakılmıştır (bkz. test tanımındaki not).
// - Rosenberg Benlik Saygısı Ölçeği ve PHQ-9, madde metni/puanlama yöntemi
//   bu ortamda birebir doğrulanamadığı için BİLEREK EKLENMEDİ.
//
// Öğrenciye SADECE ham puan gösterilir (bkz. PsychTestClient.tsx),
// yorum/bant/klinik değerlendirme gösterilmez — bu, danışmanlık sürecinde
// Orhan Yaşlı tarafından yapılır (admin panelinde tam bant + açıklama görünür).
// Kendine zarar verme ile doğrudan ilgili bir maddeye (ör. BDE madde 8)
// olumlu cevap verilirse ya da BUÖ yüksek bantta sonuçlanırsa, öğrenciye
// anlık destek mesajı gösterilir VE Telegram üzerinden Orhan Yaşlı'ya
// anında uyarı gönderilir (bkz. api/student/test-submission/route.ts).

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
  /** Testin varsayılan cevap seçenekleri. Madde kendi `options`'ını tanımlarsa onunla ezilir (ör. BDE/Beck Anksiyete — her maddenin ifadesi farklıdır). */
  options: LikertOption[];
  questions: { id: string; text: string; reverse?: boolean; options?: LikertOption[] }[];
  bands: LikertBand[];
  disclaimer: string;
  /** true ise toplam yerine ortalama puan hesaplanır/gösterilir (ör. Agorafobik Bilişler Ölçeği). */
  averageScore?: boolean;
  /** Bu soruya 0'dan farklı cevap verilirse kriz bildirimi tetiklenir. */
  crisisItemId?: string;
  /** Toplam/ortalama puan bu değere ulaşır/geçerse kriz bildirimi tetiklenir. */
  crisisThreshold?: number;
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

const SUICIDE_ITEM_ID = "q8";

const bdeOptions = (statements: [string, string, string, string]): LikertOption[] => [
  { label: statements[0], value: 0 },
  { label: statements[1], value: 1 },
  { label: statements[2], value: 2 },
  { label: statements[3], value: 3 },
];

export const beckDepresyonTest: LikertTest = {
  slug: "beck-depresyon-envanteri",
  kind: "likert",
  title: "Beck Depresyon Envanteri",
  shortDesc: "Son bir haftadır kendini nasıl hissettiğini değerlendiren, klinikte en sık kullanılan depresyon ölçeklerinden biri.",
  category: "Psikolojik Destek",
  estimatedMinutes: 6,
  intro: `Son bir (1) hafta içinde kendini nasıl hissettiğini araştıran 21 maddelik bir form. Her maddede sana en uygun ifadeyi seç. ${HAND_OFF_NOTE}`,
  source:
    "Beck Depresyon Envanteri (BDE), Beck ve ark. tarafından geliştirilmiş, Türkçe geçerlik ve güvenirlik çalışması Hisli (1988) tarafından yapılmıştır. Klinik olarak anlamlı kabul edilen kesme puanı: 17 (0-63 arası).",
  options: [],
  questions: [
    { id: "q1", text: "", options: bdeOptions([
      "Üzgün ve sıkıntılı değilim.",
      "Kendimi üzüntülü ve sıkıntılı hissediyorum.",
      "Hep üzüntülü ve sıkıntılıyım. Bundan kurtulamıyorum.",
      "O kadar üzgün ve sıkıntılıyım ki, artık dayanamıyorum.",
    ]) },
    { id: "q2", text: "", options: bdeOptions([
      "Gelecek hakkında umutsuz ve karamsar değilim.",
      "Gelecek için karamsarım.",
      "Gelecekten beklediğim hiçbir şey yok.",
      "Gelecek hakkında umutsuzum ve sanki hiçbir şey düzelmeyecekmiş gibi geliyor.",
    ]) },
    { id: "q3", text: "", options: bdeOptions([
      "Kendimi başarısız biri olarak görmüyorum.",
      "Başkalarından daha başarısız olduğumu hissediyorum.",
      "Geçmişe baktığımda başarısızlıklarla dolu olduğunu görüyorum.",
      "Kendimi tümüyle başarısız bir insan olarak görüyorum.",
    ]) },
    { id: "q4", text: "", options: bdeOptions([
      "Her şeyden eskisi kadar zevk alıyorum.",
      "Birçok şeyden eskiden olduğu gibi zevk alamıyorum.",
      "Artık hiçbir şey bana tam anlamıyla zevk vermiyor.",
      "Her şeyden sıkılıyorum.",
    ]) },
    { id: "q5", text: "", options: bdeOptions([
      "Kendimi herhangi bir biçimde suçlu hissetmiyorum.",
      "Kendimi zaman zaman suçlu hissediyorum.",
      "Çoğu zaman kendimi suçlu hissediyorum.",
      "Kendimi her zaman suçlu hissediyorum.",
    ]) },
    { id: "q6", text: "", options: bdeOptions([
      "Kendimden memnunum.",
      "Kendimden pek memnun değilim.",
      "Kendime kızgınım.",
      "Kendimden nefret ediyorum.",
    ]) },
    { id: "q7", text: "", options: bdeOptions([
      "Başkalarından daha kötü olduğumu sanmıyorum.",
      "Hatalarım ve zayıf taraflarım olduğunu düşünüyorum.",
      "Hatalarımdan dolayı kendimden utanıyorum.",
      "Her şeyi yanlış yapıyormuşum gibi geliyor ve hep kendimi kabahatli buluyorum.",
    ]) },
    { id: "q8", text: "", options: bdeOptions([
      "Kendimi öldürmek gibi düşüncelerim yok.",
      "Kimi zaman kendimi öldürmeyi düşündüğüm oluyor ama yapmıyorum.",
      "Kendimi öldürmek isterdim.",
      "Fırsatını bulsam kendimi öldürürüm.",
    ]) },
    { id: "q9", text: "", options: bdeOptions([
      "İçimden ağlamak geldiği pek olmuyor.",
      "Zaman zaman içimden ağlamak geliyor.",
      "Çoğu zaman ağlıyorum.",
      "Eskiden ağlayabilirdim ama şimdi istesem de ağlayamıyorum.",
    ]) },
    { id: "q10", text: "", options: bdeOptions([
      "Her zaman olduğumdan daha canı sıkkın ve sinirli değilim.",
      "Eskisine oranla daha kolay canım sıkılıyor ve kızıyorum.",
      "Her şey canımı sıkıyor ve kendimi hep sinirli hissediyorum.",
      "Canımı sıkan şeylere bile artık kızamıyorum.",
    ]) },
    { id: "q11", text: "", options: bdeOptions([
      "Başkalarıyla görüşme, konuşma isteğimi kaybetmedim.",
      "Eskisi kadar insanlarla birlikte olmak istemiyorum.",
      "Birileriyle görüşüp konuşmak hiç içimden gelmiyor.",
      "Artık çevremde hiç kimseyi istemiyorum.",
    ]) },
    { id: "q12", text: "", options: bdeOptions([
      "Karar verirken eskisinden fazla güçlük çekmiyorum.",
      "Eskiden olduğu kadar kolay karar veremiyorum.",
      "Eskiye kıyasla karar vermekte çok güçlük çekiyorum.",
      "Artık hiçbir konuda karar veremiyorum.",
    ]) },
    { id: "q13", text: "", options: bdeOptions([
      "Her zamankinden farklı göründüğümü sanmıyorum.",
      "Aynada kendime her zamankinden kötü görünüyorum.",
      "Aynaya baktığımda kendimi yaşlanmış ve çirkinleşmiş buluyorum.",
      "Kendimi çok çirkin buluyorum.",
    ]) },
    { id: "q14", text: "", options: bdeOptions([
      "Eskisi kadar iyi iş güç yapabiliyorum.",
      "Her zaman yaptığım işler şimdi gözümde büyüyor.",
      "Ufacık bir işi bile kendimi çok zorlayarak yapabiliyorum.",
      "Artık hiçbir iş yapamıyorum.",
    ]) },
    { id: "q15", text: "", options: bdeOptions([
      "Uykum her zamanki gibi.",
      "Eskisi gibi uyuyamıyorum.",
      "Her zamankinden 1-2 saat önce uyanıyorum ve kolay kolay tekrar uykuya dalamıyorum.",
      "Sabahları çok erken uyanıyorum ve bir daha uyuyamıyorum.",
    ]) },
    { id: "q16", text: "", options: bdeOptions([
      "Kendimi her zamankinden yorgun hissetmiyorum.",
      "Eskiye oranla daha çabuk yoruluyorum.",
      "Her şey beni yoruyor.",
      "Kendimi hiçbir şey yapamayacak kadar yorgun ve bitkin hissediyorum.",
    ]) },
    { id: "q17", text: "", options: bdeOptions([
      "İştahım her zamanki gibi.",
      "Eskisinden daha iştahsızım.",
      "İştahım çok azaldı.",
      "Hiçbir şey yiyemiyorum.",
    ]) },
    { id: "q18", text: "", options: bdeOptions([
      "Son zamanlarda zayıflamadım.",
      "Zayıflamaya çalışmadığım halde en az 2 kg verdim.",
      "Zayıflamaya çalışmadığım halde en az 4 kg verdim.",
      "Zayıflamaya çalışmadığım halde en az 6 kg verdim.",
    ]) },
    { id: "q19", text: "", options: bdeOptions([
      "Sağlığımla ilgili kaygılarım yok.",
      "Ağrılar, mide sancıları, kabızlık gibi şikayetlerim oluyor ve bunlar beni tasalandırıyor.",
      "Sağlığımın bozulmasından çok kaygılanıyorum ve kafamı başka şeylere vermekte zorlanıyorum.",
      "Sağlık durumum kafama o kadar takılıyor ki, başka hiçbir şey düşünemiyorum.",
    ]) },
    { id: "q20", text: "", options: bdeOptions([
      "Sekse karşı ilgimde herhangi bir değişiklik yok.",
      "Eskisine oranla sekse ilgim az.",
      "Cinsel isteğim çok azaldı.",
      "Hiç cinsel istek duymuyorum.",
    ]) },
    { id: "q21", text: "", options: bdeOptions([
      "Cezalandırılması gereken şeyler yaptığımı sanmıyorum.",
      "Yaptıklarımdan dolayı cezalandırılabileceğimi düşünüyorum.",
      "Cezamı çekmeyi bekliyorum.",
      "Sanki cezamı bulmuşum gibi geliyor.",
    ]) },
  ],
  bands: [
    { min: 0, max: 9, tone: "low", label: "Minimal düzey (0-9)", description: "Türkçe BDE uyarlamasının (Hisli, 1988) klinik kesme puanının (17) belirgin şekilde altında." },
    { min: 10, max: 16, tone: "mid", label: "Hafif düzey (10-16)", description: "Kesme puanının (17) altında ama izlenmesi faydalı olabilecek bir düzey." },
    { min: 17, max: 29, tone: "high", label: "Orta düzey (17-29)", description: "Türkçe BDE uyarlamasının (Hisli, 1988) klinik olarak anlamlı kabul ettiği kesme puanına (17) ulaşmış ya da üzerinde." },
    { min: 30, max: 63, tone: "high", label: "Şiddetli düzey (30-63)", description: "Kesme puanının çok üzerinde; görüşmede öncelikli ele alınmalı." },
  ],
  disclaimer: CRISIS_NOTE,
  crisisItemId: SUICIDE_ITEM_ID,
};

export const beckAnksiyeteTest: LikertTest = {
  slug: "beck-anksiyete-olcegi",
  kind: "likert",
  title: "Beck Anksiyete Ölçeği",
  shortDesc: "Son bir haftadır yaşadığın kaygı belirtilerinin şiddetini değerlendiren, klinikte en sık kullanılan anksiyete ölçeklerinden biri.",
  category: "Psikolojik Destek",
  estimatedMinutes: 4,
  intro: `Aşağıda kaygılı/endişeli olduğunuzda yaşanan bazı belirtiler var. Her birinin bugün dahil son bir (1) haftadır seni ne kadar rahatsız ettiğini işaretle. ${HAND_OFF_NOTE}`,
  source:
    "Beck Anksiyete Ölçeği (BAI), Beck ve ark. (1988) tarafından geliştirilmiş, Türkçe geçerlik ve güvenirlik çalışması Ulusoy, Şahin ve Erkmen (1998) tarafından yapılmıştır (0-63 arası).",
  options: [
    { label: "Hiç — beni hiç etkilemedi", value: 0 },
    { label: "Hafif düzeyde — beni pek etkilemedi", value: 1 },
    { label: "Orta düzeyde — hoş değildi ama katlanabildim", value: 2 },
    { label: "Ciddi düzeyde — dayanmakta çok zorlandım", value: 3 },
  ],
  questions: [
    { id: "q1", text: "Bedeninizin herhangi bir yerinde uyuşma veya karıncalanma" },
    { id: "q2", text: "Sıcak/ateş basmaları" },
    { id: "q3", text: "Bacaklarda halsizlik, titreme" },
    { id: "q4", text: "Gevşeyememe" },
    { id: "q5", text: "Çok kötü şeyler olacak korkusu" },
    { id: "q6", text: "Baş dönmesi veya sersemlik" },
    { id: "q7", text: "Kalp çarpıntısı" },
    { id: "q8", text: "Dengeyi kaybetme duygusu" },
    { id: "q9", text: "Dehşete kapılma" },
    { id: "q10", text: "Sinirlilik" },
    { id: "q11", text: "Boğuluyormuş gibi olma duygusu" },
    { id: "q12", text: "Ellerde titreme" },
    { id: "q13", text: "Titreklik" },
    { id: "q14", text: "Kontrolü kaybetme korkusu" },
    { id: "q15", text: "Nefes almada güçlük" },
    { id: "q16", text: "Ölüm korkusu" },
    { id: "q17", text: "Korkuya kapılma" },
    { id: "q18", text: "Midede hazımsızlık ya da rahatsızlık hissi" },
    { id: "q19", text: "Baygınlık" },
    { id: "q20", text: "Yüzün kızarması" },
    { id: "q21", text: "Terleme (sıcaklığa bağlı olmayan)" },
  ],
  bands: [
    { min: 0, max: 7, tone: "low", label: "Minimal düzey (0-7)", description: "Türkçe BAI uyarlamasının (Ulusoy ve ark., 1998) en düşük bandında." },
    { min: 8, max: 15, tone: "mid", label: "Hafif düzey (8-15)", description: "Hafif düzeyde anksiyete belirtileri." },
    { min: 16, max: 25, tone: "mid", label: "Orta düzey (16-25)", description: "Orta düzeyde anksiyete belirtileri; görüşmede değerlendirilmeli." },
    { min: 26, max: 63, tone: "high", label: "Şiddetli düzey (26-63)", description: "Şiddetli düzeyde anksiyete belirtileri; görüşmede öncelikli ele alınmalı." },
  ],
  disclaimer: CRISIS_NOTE,
};

const buoReverse = new Set(["q1", "q3", "q5", "q6", "q8", "q10", "q13", "q15", "q19"]);
const buoOptions: LikertOption[] = [
  { label: "Hayır", value: 0 },
  { label: "Evet", value: 1 },
];
const buoItems: [string, string][] = [
  ["q1", "Geleceğe umut ve coşku ile bakıyorum."],
  ["q2", "Kendim ile ilgili şeyleri düzeltemediğime göre çabalamayı bıraksam iyi olur."],
  ["q3", "İşler kötüye giderken bile her şeyin hep böyle kalmayacağını bilmek beni rahatlatıyor."],
  ["q4", "Gelecek on yıl içinde hayatımın nasıl olacağını hayal bile edemiyorum."],
  ["q5", "Yapmayı en çok istediğim şeyleri gerçekleştirmek için yeterli zamanım var."],
  ["q6", "Benim için çok önemli konularda ileride başarılı olacağımı umuyorum."],
  ["q7", "Geleceğimi karanlık görüyorum."],
  ["q8", "Dünya nimetlerinden sıradan bir insandan daha çok yararlanacağımı umuyorum."],
  ["q9", "İyi fırsatlar yakalayamıyorum. Gelecekte yakalayacağıma inanmam için de hiçbir neden yok."],
  ["q10", "Geçmiş deneyimlerim beni geleceğe iyi hazırladı."],
  ["q11", "Gelecek benim için hoş şeylerden çok tatsızlıklarla dolu görünüyor."],
  ["q12", "Gerçekten özlediğim şeylere kavuşabileceğimi ummuyorum."],
  ["q13", "Geleceğe baktığımda şimdikine oranla daha mutlu olacağımı umuyorum."],
  ["q14", "İşler bir türlü benim istediğim gibi gitmiyor."],
  ["q15", "Geleceğe büyük inancım var."],
  ["q16", "Arzu ettiğim şeyleri elde edemediğime göre bir şeyler istemek aptallık olur."],
  ["q17", "Gelecekte gerçek doyuma ulaşmam olanaksız gibi."],
  ["q18", "Gelecek bana bulanık ve belirsiz görünüyor."],
  ["q19", "Kötü günlerden çok, iyi günler bekliyorum."],
  ["q20", "İstediğim her şeyi elde etmek için çaba göstermenin gerçekten yararı yok, nasıl olsa onu elde edemeyeceğim."],
];

export const beckUmutsuzlukTest: LikertTest = {
  slug: "beck-umutsuzluk-olcegi",
  kind: "likert",
  title: "Beck Umutsuzluk Ölçeği",
  shortDesc: "Geleceğe yönelik beklentilerini değerlendiren, 20 maddelik evet/hayır formatında bir ölçek.",
  category: "Psikolojik Destek",
  estimatedMinutes: 4,
  intro: `Geleceğe yönelik olumlu ya da olumsuz düşünceleri içeren cümlelerden sana uygun olanı evet ya da hayır olarak işaretle. ${HAND_OFF_NOTE}`,
  source:
    "Beck Umutsuzluk Ölçeği (BUÖ), Beck ve ark. (1974) tarafından geliştirilmiş, Türkçe geçerlik ve güvenirlik çalışması Seber (1991) tarafından yapılmıştır. Bu ölçek, intihar riskiyle ilişkisi literatürde iyi belgelenmiş bir araçtır (0-20 arası).",
  options: buoOptions,
  questions: buoItems.map(([id, text]) => ({ id, text, reverse: buoReverse.has(id) })),
  bands: [
    { min: 0, max: 3, tone: "low", label: "Umutsuzluk yok (0-3)", description: "Türkçe BUÖ uyarlamasının (Seber, 1991) en düşük bandında." },
    { min: 4, max: 8, tone: "mid", label: "Hafif düzey (4-8)", description: "Hafif düzeyde umutsuzluk." },
    { min: 9, max: 14, tone: "high", label: "Orta düzey (9-14)", description: "Literatürde intihar riskiyle ilişkilendirilen aralığa girmiş; görüşmede öncelikli ele alınmalı." },
    { min: 15, max: 20, tone: "high", label: "İleri düzey (15-20)", description: "Literatürde intihar riskiyle en güçlü ilişkilendirilen bant; acil değerlendirme gerektirebilir." },
  ],
  disclaimer: CRISIS_NOTE,
  crisisThreshold: 15,
};

export const agorafobikBilislerTest: LikertTest = {
  slug: "agorafobik-bilisler-olcegi",
  kind: "likert",
  title: "Agorafobik Bilişler Ölçeği",
  shortDesc: "Kaygılı ya da korktuğun anlarda aklından geçen felaket senaryolarının sıklığını değerlendirir.",
  category: "Psikolojik Destek",
  estimatedMinutes: 3,
  intro: `Aşağıda, endişeli ya da korkmuş olduğunda aklından geçebilecek bazı düşünceler var. Her birinin senin için ne sıklıkla ortaya çıktığını işaretle. Bu test için yayınlanmış bir kesme puanı bulunmuyor; yorumlama tamamen görüşmede yapılacak klinik değerlendirmeye bağlıdır.`,
  source:
    "Agorafobik Bilişler Ölçeği'nin (Agoraphobic Cognitions Questionnaire) Türkçe uyarlaması: Kart & Türkçapar, \"Validity and Reliability of Agoraphobic Cognitions Questionnaire-Turkish Version\", Journal of Cognitive Behavioral Psychotherapy and Research, 2(3), 167-172. NOT: Kaynak formda 13 madde yer alıyor; orijinali 14 maddedir. Yayınlanmış bir kesme puanı/norm bulunamadı — puan, ortalama olarak hesaplanır (1-5 arası).",
  options: [
    { label: "Hiçbir zaman", value: 1 },
    { label: "Nadiren", value: 2 },
    { label: "Yarı yarıya", value: 3 },
    { label: "Genellikle", value: 4 },
    { label: "Her zaman", value: 5 },
  ],
  questions: [
    { id: "q1", text: "Bayılacağım." },
    { id: "q2", text: "Bende beyin tümörü olmalı." },
    { id: "q3", text: "Kalp krizi geçireceğim." },
    { id: "q4", text: "Boğularak öleceğim." },
    { id: "q5", text: "Aptalca davranacağım." },
    { id: "q6", text: "Kör olacağım." },
    { id: "q7", text: "Kendimi kontrol edemeyeceğim." },
    { id: "q8", text: "Birine zarar vereceğim." },
    { id: "q9", text: "Felç geçireceğim." },
    { id: "q10", text: "Çıldıracağım." },
    { id: "q11", text: "Çığlık atacağım." },
    { id: "q12", text: "Saçmalayacağım veya gülünç konuşacağım." },
    { id: "q13", text: "Korkudan felç olacağım." },
  ],
  bands: [
    {
      min: 1,
      max: 5,
      tone: "mid",
      label: "Norm bulunamadı — ortalama puan",
      description: "Bu ölçek için yayınlanmış bir kesme puanı/norm bulunamadı. Yorumlama, madde bazında cevaplarla birlikte tamamen klinik değerlendirmene bağlıdır.",
    },
  ],
  disclaimer: CRISIS_NOTE,
  averageScore: true,
};

export const PSYCH_TESTS: PsychTest[] = [
  examAnxietyTest,
  anxietyScreeningTest,
  who5Test,
  beckDepresyonTest,
  beckAnksiyeteTest,
  beckUmutsuzlukTest,
  agorafobikBilislerTest,
  learningStyleTest,
];

export function getTestBySlug(slug: string): PsychTest | undefined {
  return PSYCH_TESTS.find((t) => t.slug === slug);
}

export function scoreLikertTest(test: LikertTest, answers: Record<string, number>) {
  const sum = test.questions.reduce((acc, q) => {
    const raw = answers[q.id] ?? 0;
    if (!q.reverse) return acc + raw;
    const opts = q.options ?? test.options;
    const maxOptionValue = Math.max(...opts.map((o) => o.value));
    return acc + (maxOptionValue - raw);
  }, 0);
  const total = test.averageScore ? Math.round((sum / test.questions.length) * 10) / 10 : sum;
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
