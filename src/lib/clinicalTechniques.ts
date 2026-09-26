/**
 * Klinik Müdahale & Terapi Teknikleri Kılavuzu
 * 
 * Psikolojik Danışman Orhan Yaşlı için seans içi müdahale protokolleri,
 * danışana söylenecek yönergeler, psiko-eğitim metaforları, ev ödevleri ve
 * dünya literatüründeki bilimsel dayanakları içerir.
 * 
 * Yalnızca ADMIN panelinde görüntülenir.
 */

export type ClinicalCategory =
  | "panik-atak"
  | "anksiyete-endise"
  | "sinav-kaygisi"
  | "depresyon-motivasyon"
  | "sema-terapi"
  | "varoluscu-adler"
  | "fobi-duyarsizlastirma"
  | "duygu-regulasyon";

export type TherapySchool =
  | "BDT (Bilişsel Davranışçı Terapi)"
  | "ACT (Kabul ve Kararlılık Terapisi)"
  | "Şema Terapi"
  | "Varoluşçu Psikoterapi"
  | "Adlerian (Bireysel Psikoloji)"
  | "Davranışçı Terapi & ERP"
  | "Somatik & Travma Regülasyonu";

export interface StepProtocol {
  stepNumber: number;
  title: string;
  counselorAction: string;
  clientInstruction?: string;
}

export interface ClinicalTechnique {
  id: string;
  title: string;
  category: ClinicalCategory;
  categoryLabel: string;
  school: TherapySchool;
  pioneers: string[];
  summary: string;
  targetSymptoms: string[];
  mechanism: string;
  stepByStep: StepProtocol[];
  counselorScript: string;
  homeworkAndPractice: string;
  cautionsAndContraindications: string[];
  evidenceAndReferences: string[];
}

export const CATEGORIES: { id: ClinicalCategory; label: string; count?: number }[] = [
  { id: "panik-atak", label: "Panik Atak & Agorafobi" },
  { id: "anksiyete-endise", label: "Yaygın Anksiyete & Kronik Endişe" },
  { id: "sinav-kaygisi", label: "Sınav Kaygısı & Akademik Performans" },
  { id: "depresyon-motivasyon", label: "Depresyon & Davranışsal Aktivasyon" },
  { id: "sema-terapi", label: "Şema Terapi & Sandalye Diyalogları" },
  { id: "varoluscu-adler", label: "Varoluşçu Terapi & Adlerian Yaklaşım" },
  { id: "fobi-duyarsizlastirma", label: "Fobi, Obsesyon & Duyarsızlaştırma" },
  { id: "duygu-regulasyon", label: "Duygu Regülasyonu & Travma Stabilizasyonu" },
];

export const SCHOOLS: TherapySchool[] = [
  "BDT (Bilişsel Davranışçı Terapi)",
  "ACT (Kabul ve Kararlılık Terapisi)",
  "Şema Terapi",
  "Varoluşçu Psikoterapi",
  "Adlerian (Bireysel Psikoloji)",
  "Davranışçı Terapi & ERP",
  "Somatik & Travma Regülasyonu",
];

export const CLINICAL_TECHNIQUES: ClinicalTechnique[] = [
  // ==========================================
  // 1. PANİK ATAK VE AGORAFOBİ
  // ==========================================
  {
    id: "interoseptif-maruz-birakma",
    title: "İnteroseptif Maruz Bırakma (Interoceptive Exposure)",
    category: "panik-atak",
    categoryLabel: "Panik Atak & Agorafobi",
    school: "BDT (Bilişsel Davranışçı Terapi)",
    pioneers: ["David H. Barlow", "Michelle G. Craske", "David M. Clark"],
    summary:
      "Panik atağı tetikleyen bedensel duyumları (çarpıntı, baş dönmesi, nefes darlığı, titreme) seans odasında kontrollü ve güvenli şekilde yapay olarak üreterek, bu duyumların tehlikeli veya ölümcül olmadığını sinir sistemine yeniden öğretme protokolüdür.",
    targetSymptoms: [
      "Çarpıntı korkusu (Taşikardi)",
      "Nefes alamama / boğulma hissi",
      "Baş dönmesi / bayılacak gibi olma",
      "Beden duyumlarını sürekli dinleme ve kontrol etme (Hipervijilans)",
    ],
    mechanism:
      "Koşullu korku tepkisinin sönümlenmesi (Extinction Learning). Danışan beden duyumu hissettiğinde amigdala otomatik olarak felaket alarmı verir. Danışan güvenli ortamda güvenlik davranışı (su içme, kaçma, yatma) uygulamadan bu duyumla 60-90 saniye kaldığında, beynin prefrontal korteksi duyumun zararsız olduğunu tecrübe eder.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Psiko-Eğitim ve Rasyonel Açıklama",
        counselorAction:
          "Danışana otonom sinir sisteminin sempatik dalının hayatta kalma alarmı olduğunu, beden duyumlarının bir hastalığın değil 'yanlış alarmın' fiziksel sonucu olduğunu anlatın.",
      },
      {
        stepNumber: 2,
        title: "Uyarım Egzersizlerinin Taranması (Baseline)",
        counselorAction:
          "5 temel egzersizi sırayla uygulayın ve her birinde danışandan benzerlik (0-100) ve kaygı (SUDS 0-100) puanı alın: 1) Baş dönmesi için döner sandalyede 60 sn dönme, 2) Dispne için pipetle 60 sn nefes alma, 3) Hiperventilasyon için 60 sn hızlı/derin soluma, 4) Nabız için 60 sn yerinde hızlı koşma, 5) Sıcak basması için kalın palto giyip sıcak ortamda durma.",
      },
      {
        stepNumber: 3,
        title: "Hedef Egzersizin Seçilmesi ve Maruz Bırakma",
        counselorAction:
          "Danışanın atağına en çok benzeyen 1 veya 2 egzersizi seçin. Egzersizi tam süre uygulayın. Bittiğinde danışanın hiçbir güvenlik davranışı yapmadan (derin nefes almaya çalışmadan, bir yere tutunmadan) duyumu izlemesini sağlayın.",
      },
      {
        stepNumber: 4,
        title: "Bilişsel Yeniden Değerlendirme & Debriefing",
        counselorAction:
          "Duyum zirveye çıkıp normale döndükten sonra sorun: 'Ne olacağını düşünmüştün? Kalp krizi geçirdin mi? Bayıldın mı? Vücudun ne kadar sürede kendi kendine normale döndü?'",
      },
    ],
    counselorScript:
      "“Şimdi seninle küçük bir bilimsel deney yapacağız. Biliyorum bedeninde hissettiğin o çarpıntı ve baş dönmesi sana sanki felaket bir şey olacakmış gibi hissettiriyor. Ancak bedenimiz tıpkı spor yaparken olduğu gibi bu hisleri üretebilir ve bu hisler tamamen zararsızdır. Şimdi seninle bir dakika boyunca bir pipetten nefes alıp vereceğiz. Bu esnada biraz nefesin yetmiyor gibi hissedeceksin; tam da panik anındaki gibi. Amacımız bu hissi yok etmek değil, bu his geldiğinde bedenine hiçbir şey olmadığını, kalbinin ve ciğerlerinin sağlam olduğunu sinir sistemine birlikte göstermek. Hazır olduğunda başlayalım, yanındayım.”",
    homeworkAndPractice:
      "Günde 2 kez belirlenen interoseptif egzersizi (örn. pipetle soluma veya 1 dk yerinde koşma) evde tek başına uygulayıp 'İnteroseptif Egzersiz Takip Çizelgesi'ne başlangıç SUDS puanını, en yüksek puanı ve normale dönme süresini kaydetme.",
    cautionsAndContraindications: [
      "Kontrendikasyon: Şiddetli astım, KOAH, kardiyovasküler hastalıklar, anevrizma, kontrolsüz hipertansiyon, epilepsi ve gebelik durumunda ilgili medikal uzmandan onay alınmadan fizyolojik yükleme yapılmamalıdır.",
      "Danışanın egzersiz esnasında güvenlik davranışlarına (derin nefes arama, su içme, koltuğa sıkıca sarılma) kaçmasına izin verilmemelidir; aksi takdirde 'Su içtiğim için kurtuldum' inancı pekişir.",
    ],
    evidenceAndReferences: [
      "Barlow, D. H., & Craske, M. G. (2007). Mastery of Your Anxiety and Panic: Client Workbook (4th ed.). Oxford University Press.",
      "Clark, D. M. (1986). A cognitive approach to panic. Behaviour Research and Therapy, 24(4), 461-470.",
      "Craske, M. G., et al. (2014). Maximizing exposure therapy: An inhibitory learning approach. Behaviour Research and Therapy, 58, 10-23.",
    ],
  },
  {
    id: "panik-dongusu-bilissel-yeniden-yapilandirma",
    title: "Clark Panik Döngüsü & Bilişsel Yeniden Yapılandırma",
    category: "panik-atak",
    categoryLabel: "Panik Atak & Agorafobi",
    school: "BDT (Bilişsel Davranışçı Terapi)",
    pioneers: ["David M. Clark", "Aaron T. Beck"],
    summary:
      "Tetikleyici -> Beden Duyumu -> Felaketleştirici Yorumlama ('Ölüyorum', 'Çıldırıyorum') döngüsünü tespit edip, felaket senaryolarını Sokratesçi sorgulama ve kanıt inceleme yöntemleriyle rasyonel alternatiflere dönüştürme çalışmasıdır.",
    targetSymptoms: [
      "Kalp krizi geçiriyorum düşüncesi",
      "Nefes alamayıp boğulacağım inancı",
      "Delireceğim veya kontrolü kaybedeceğim korkusu",
      "Rezillik yaşayacağım / yere düşeceğim endişesi",
    ],
    mechanism:
      "Bilişsel felaketleştirmenin kırılması. Panik atağı tetikleyen şey duyumun kendisi değil, duyuma yüklenen ölümcül anlamdır. Yorum nötralize edildiğinde sempatik sinir sisteminin aşırı uyarılması durur.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Kişisel Panik Döngüsünün Çizilmesi",
        counselorAction:
          "Beyaz tahtaya veya kağıda daire çizin: Tetikleyici (sıcak ortam, merdiven çıkma) -> Beden Duyumu (çarpıntı) -> Felaket Düşünce ('Kalbim duracak') -> Artan Kaygı -> Daha Çok Adrenalin -> Artan Çarpıntı.",
      },
      {
        stepNumber: 2,
        title: "Düşüncenin Bir 'Hipotez' Olarak Ele Alınması",
        counselorAction:
          "Danışana düşüncenin bir gerçek değil, zihnin ürettiği bir tahmin olduğunu fark ettirin. 'Kalp krizi geçiriyorum düşüncesine yüzde kaç inanıyorsun?'",
      },
      {
        stepNumber: 3,
        title: "Kanıt İnceleme (Evidence Gathering)",
        counselorAction:
          "Danışana geçmiş deneyimlerini sorgulatın: 'Bugüne kadar kaç kez bu hissi yaşadın? (Örn: 100 kez). Kaçında kalp krizi geçirdin? (0). Eğer bu his kalp krizi olsaydı, 100 kez kriz geçirip sağ kalabilir miydin?'",
      },
      {
        stepNumber: 4,
        title: "Başa Çıkma Kartı (Coping Card) Oluşturma",
        counselorAction:
          "Cüzdanda veya telefonda taşınacak net cümleler yazdırın: 'Bu duyum tehlikeli değil, rahatsız edici. Adrenalin yükseldi, birazdan düşecek.'",
      },
    ],
    counselorScript:
      "“Zihninde çok hassas bir yangın alarmı olduğunu düşün. Bu alarm o kadar hassas ki, mutfakta ekmek kızartırken çıkan ufak bir dumanda bile tüm binayı ayağa kaldırıyor ve 'Yangın var, kaçın!' diye bağırıyor. Bedenindeki çarpıntı da aynen böyle: Gerçek bir kalp krizi (yangın) yok, sadece aşırı hassaslaşmış duman dedektörün ekmek kızartma dumanına yangın muamelesi yapıyor. Şimdi o dedektör bağırdığında ona kulak vermek yerine pencereyi açıp 'Sakin ol, sadece ekmek kızarıyor' demeyi öğreneceğiz.”",
    homeworkAndPractice:
      "Her panik hissi geldiğinde '3 Sütunlu Panik Kaydı' doldurma: 1) Bedensel Duyum, 2) Akla Gelen Felaket Düşünce, 3) Alternatif Rasyonel Gerçek.",
    cautionsAndContraindications: [
      "Bilişsel yeniden yapılandırma tek başına yeterli değildir; mutlaka interoseptif maruz bırakma (bedensel deneyim) ile desteklenmelidir. Salt mantık, panik anındaki amigdala uyarılmasını tek başına durduramaz.",
    ],
    evidenceAndReferences: [
      "Clark, D. M. (1996). Panic disorder: From theory to therapy. In P. M. Salkovskis (Ed.), Frontiers of cognitive therapy (pp. 318-344). Guilford Press.",
      "Beck, A. T., Emery, G., & Greenberg, R. L. (2005). Anxiety disorders and phobias: A cognitive perspective. Basic Books.",
    ],
  },
  {
    id: "agorafobi-kademeli-maruz-birakma",
    title: "Agorafobik İn Vivo (Canlı) Kademeli Maruz Bırakma",
    category: "panik-atak",
    categoryLabel: "Panik Atak & Agorafobi",
    school: "Davranışçı Terapi & ERP",
    pioneers: ["Isaac Marks", "David H. Barlow", "Michelle G. Craske"],
    summary:
      "Kaçmanın zor olacağı veya yardım alınamayacağı düşünülen mekanlara (AVM, toplu taşıma, kalabalık, köprüler, evden uzaklaşma) karşı geliştirilen kaçınma ve güvenlik arayışı davranışlarını kademeli olarak sonlandırma protokolüdür.",
    targetSymptoms: [
      "Tek başına evden çıkamama",
      "Otobüs, metro, vapur gibi araçlara binememe",
      "Kalabalık ortamlarda kapıya yakın oturma zorunluluğu",
      "Yanında mutlaka biri olmadan sokağa çıkamama",
    ],
    mechanism:
      "Alışma (Habituation) ve Yeni İnhibitör Öğrenme (Inhibitory Learning). Kaçınma davranışı kaygıyı kısa vadede düşürür ama uzun vadede beynin o mekanı 'ölümcül tuzak' olarak kodlamasını sürdürür. Danışan ortamda kaldığında kaygının kendiliğinden zirve yapıp plato çizdiğini ve düştüğünü bizzat tecrübe eder.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Korku Hiyerarşisi (SUDS Merdiveni) Oluşturma",
        counselorAction:
          "Danışanla 0'dan 100'e kadar 8-10 basamaklık bir liste hazırlayın (Örn: 20: Apartman kapısında durmak, 40: Mahalle bakkalına gitmek, 60: 1 durak otobüse binmek, 80: AVM'de dolaşmak, 100: Metroyla köprüden geçmek).",
      },
      {
        stepNumber: 2,
        title: "Güvenlik Davranışlarının Tespiti ve Kademeli Bırakılması",
        counselorAction:
          "Danışanın 'güvenlik bastonlarını' listeleyin: Yanında su şişesi taşıma, tansiyon ilacı bulundurma, telefonla birini arama, duvara yakın yürüme. Bu davranışlar maruz bırakma esnasında kasıtlı olarak terk edilmelidir.",
      },
      {
        stepNumber: 3,
        title: "Maruz Kalma Süresi ve Kuralı",
        counselorAction:
          "Kural: Kaygı zirve yaptığında ortam terk edilmez. SUDS puanı en az %50 düşene kadar ortamda beklenir. Erken çıkış kaçınmayı pekiştirir.",
      },
    ],
    counselorScript:
      "“Kaygı bir deniz dalgası gibidir. Dalga gelir, yükselir, üzerine gelirken sanki seni boğacakmış gibi hissedersin. Eğer arkana bakmadan kıyıya kaçarsan, dalganın seni hep boğacağını düşünmeye devam edersin. Ama dalga yükseldiğinde ayaklarını yere sağlam basıp beklersen, o dalganın zirveye ulaştıktan sonra köpürüp kendiliğinden çekildiğini görürsün. Şimdi seninle o dalgayla kalmayı öğreneceğiz.”",
    homeworkAndPractice:
      "Haftada en az 4 gün, hiyerarşide belirlenen basamağa tek başına gidip en az 30 dakika kalma ve SUDS iniş grafiğini tutma.",
    cautionsAndContraindications: [
      "Çok yüksek bir basamaktan başlanmamalıdır; başarısızlık danışanın tedaviye inancını kırabilir. Merdiven basamak basamak tırmanılmalıdır.",
      "Eğer danışan ortamdan kaçmak zorunda kalırsa, sakinleştiğinde hemen tekrar aynı ortama dönmesi sağlanmalıdır.",
    ],
    evidenceAndReferences: [
      "Marks, I. M. (1987). Fears, Phobias, and Rituals: Panic, Anxiety, and Their Disorders. Oxford University Press.",
      "Craske, M. G., et al. (2014). Maximizing exposure therapy: An inhibitory learning approach. Behaviour Research and Therapy, 58, 10-23.",
    ],
  },
  {
    id: "kriz-ani-topraklama-ve-paced-breathing",
    title: "5-4-3-2-1 Topraklama (Grounding) & Paced Breathing (4-2-6)",
    category: "panik-atak",
    categoryLabel: "Panik Atak & Agorafobi",
    school: "Somatik & Travma Regülasyonu",
    pioneers: ["Marsha M. Linehan", "Stephen Porges"],
    summary:
      "Akut panik, dissosiyasyon veya yoğun sınav kaygısı krizinde parasempatik sinir sistemini (vagus siniri) aktive etmek ve dikkati içsel beden felaketlerinden dışsal somut gerçekliğe çekmek için kullanılan hızlı stabilizasyon tekniğidir.",
    targetSymptoms: [
      "Akut panik atağı başlangıcı",
      "Hiperventilasyon (Sık ve yüzeysel soluma)",
      "Gerçekdışılık hissi (Derealizasyon / Depersonalizasyon)",
      "Zihnin kilitlenmesi ve donma (Freezing)",
    ],
    mechanism:
      "Polivagal Teori ve Vagal Fren. Uzatılmış nefes verme (exhalation), kalbin sinoatriyal düğümüne vagal sinyaller göndererek kalp atım hızını düşürür. 5 duyu organının sırayla devreye sokulması ise beynin limbik sistemdeki aşırı uyarılmasını prefrontal kortekse aktarır.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Fiziksel Postür ve Temas",
        counselorAction:
          "Danışandan iki ayağını da yere tam basmasını, sırtını sandalyeye yaslamasını ve ellerini bacaklarına koymasını isteyin.",
      },
      {
        stepNumber: 2,
        title: "Paced Breathing (4-2-6 Nefes Döngüsü)",
        counselorAction:
          "Danışana komut verin: '4 saniye burundan sakince al... 2 saniye tut... 6 saniye boyunca dudaklarını büzerek ıslık çalar gibi yavaşça ver.' Bu döngüyü 4-5 kez birlikte yapın.",
      },
      {
        stepNumber: 3,
        title: "5-4-3-2-1 Duyusal Topraklama",
        counselorAction:
          "Danışana sesli olarak saydırın: 1) Etrafında gördüğün 5 farklı nesne, 2) Teninde hissettiğin 4 farklı doku (pantolon, masa, hava akımı), 3) Duyabildiğin 3 farklı ses, 4) Alabildiğin 2 farklı koku, 5) Ağzındaki 1 tat.",
      },
    ],
    counselorScript:
      "“Şimdi benim sesime odaklan. Bedenin şu an sana bir tehlike varmış gibi hissettiriyor ama tehlikede değilsin; odadasın, güvendesin ve benimlesin. Ayak tabanlarının yere bastığı yeri hisset. Şimdi gözlerini aç ve bana bu odada gördüğün 5 mavi veya kahverengi nesneyi sesli olarak söyle...”",
    homeworkAndPractice:
      "Gün içinde hiçbir kaygı yokken günde 2 kez 4-2-6 nefesini ve topraklamayı pratik etmek (böylece kriz anında otomatikleşir).",
    cautionsAndContraindications: [
      "Derin nefes alırken omuzların yukarı kalkmaması, diyaframın (karnın) şişmesi sağlanmalıdır. Göğüs nefesi hiperventilasyonu artırabilir.",
      "Bu teknik bir kaçınma veya duyumu yok etme çabası olarak değil, bedene güvenli liman sağlamak için kullanılmalıdır.",
    ],
    evidenceAndReferences: [
      "Linehan, M. M. (2014). DBT Skills Training Manual (2nd ed.). Guilford Press.",
      "Porges, S. W. (2011). The Polyvagal Theory: Neurophysiological Foundations of Emotions, Attachment, Communication, and Self-regulation. W. W. Norton & Company.",
    ],
  },

  // ==========================================
  // 2. YAYGIN ANKSİYETE VE KRONİK ENDİŞE
  // ==========================================
  {
    id: "endise-saati-protokolu",
    title: "Endişe Saati (Worry Time) & Uyaran Kontrolü",
    category: "anksiyete-endise",
    categoryLabel: "Yaygın Anksiyete & Kronik Endişe",
    school: "BDT (Bilişsel Davranışçı Terapi)",
    pioneers: ["Thomas D. Borkovec"],
    summary:
      "Gün boyu zihne üşüşen kontrolsüz endişeleri günün belirli, sınırlandırılmış 15-20 dakikalık bir zaman dilimine erteleyerek, endişenin hayatın tamamını istila etmesini önleyen uyaran kontrol protokolüdür.",
    targetSymptoms: [
      "Sürekli 'Ya şöyle olursa...' senaryoları kurma",
      "Ders çalışırken veya dinlenirken dikkatin endişeyle dağılması",
      "Kronik zihinsel yorgunluk ve kas gerginliği",
      "Endişelenmeyi bırakamama hissi",
    ],
    mechanism:
      "Uyaran Kontrolü ve Kuluçka Etkisi. Endişe günün her saatinde ödüllendirildiğinde (zihinsel prova yapıldığında) alışkanlık haline gelir. Endişe ertelendiğinde duygusal yükü azalır ve endişe saati geldiğinde düşüncelerin çoğunun önemini yitirdiği görülür.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Endişe Saati Belirleme",
        counselorAction:
          "Danışanla her gün için sabit bir saat belirleyin (Örn: 17:30 - 17:50 arası). Kural: Yatmadan hemen önce ve yatakta olmamalıdır.",
      },
      {
        stepNumber: 2,
        title: "Gün İçinde Endişeyi Fark Etme ve Erteleme",
        counselorAction:
          "Gün içinde bir endişe geldiğinde: 'Şu an endişeleniyorum. Bunu cebimdeki nota tek cümleyle yazıyorum ve saat 17:30'a erteliyorum.'",
      },
      {
        stepNumber: 3,
        title: "Endişe Saati Uygulaması",
        counselorAction:
          "Saat 17:30'da belirlenen sandalyeye oturulur, listedeki endişeler okunur: 1) Bu benim kontrolümde olan bir problem mi? Evetse: Eylem planı yazılır. 2) Kontrolümde olmayan varsayımsal bir korku mu? Evetse: 'Bunu kontrol edemem' diyerek dosya kapatılır.",
      },
    ],
    counselorScript:
      "“Zihnini gün boyu kapını çalıp duran talepkar bir misafir gibi düşün. Her kapıyı çaldığında içeri alıp saatlerce sohbet edersen, ne işini yapabilirsin ne ders çalışabilirsin. Şimdi ona diyeceğiz ki: 'Seni duyuyorum, seni önemsiz görmüyorum ama şu an seninle ilgilenemem. Saat tam 17:30'da gel, oturup seninle 20 dakika konuşacağız.' Göreceksin ki o saat geldiğinde o endişelerin birçoğu kapıya bile gelmeyecek.”",
    homeworkAndPractice:
      "Bir hafta boyunca küçük bir Endişe Not Defteri taşımak ve endişe saatini eksiksiz uygulamak.",
    cautionsAndContraindications: [
      "Endişe saati 20 dakikayı aşmamalıdır; süre bittiğinde alarm çalmalı ve hemen aktif başka bir uğraşa geçilmelidir.",
    ],
    evidenceAndReferences: [
      "Borkovec, T. D., Wilkinson, L., Folensbee, R., & Lerman, C. (1983). Stimulus control applications to the treatment of worry. Behaviour Research and Therapy, 21(3), 247-251.",
      "McGowan, S. K., & Behar, E. (2013). A preliminary investigation of stimulus control training for general worry. Behavior Modification, 37(1), 90-112.",
    ],
  },
  {
    id: "bilissel-ayrisma-defuzyon-act",
    title: "Bilişsel Ayrışma / De-füzyon (Cognitive Defusion)",
    category: "anksiyete-endise",
    categoryLabel: "Yaygın Anksiyete & Kronik Endişe",
    school: "ACT (Kabul ve Kararlılık Terapisi)",
    pioneers: ["Steven C. Hayes", "Kelly G. Wilson", "Kirk Strosahl"],
    summary:
      "Danışanın zihninden geçen düşüncelerle ('Ben yetersizim', 'Kesin batıracağım') kendini bir tutmasını (bilişsel kaynaşma) kırıp; düşünceleri mutlak gerçekler değil, sadece zihinden geçen nörolojik sesler ve kelimeler olarak izlemesini sağlayan ACT tekniğidir.",
    targetSymptoms: [
      "Düşünceleri mutlak emir veya kehanet gibi algılama",
      "Olumsuz düşüncelerle sürekli tartışıp yorulma",
      "Öz-eleştirel katı iç ses",
    ],
    mechanism:
      "Dilin bağlamsal kontrolünün zayıflatılması (Relational Frame Theory). Bir kelimenin yarattığı duygusal tehdit yükü, kelime tekrarlanarak veya bağlamı değiştirilerek nötrleştirilir. Düşünce 'benlik'ten ayrıştırılır.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Kaynaşmanın Tespiti",
        counselorAction:
          "Danışanın inandığı katı düşünceyi yakalayın: 'Sınavı kazanamazsam bir hiçim.'",
      },
      {
        stepNumber: 2,
        title: "Dilsel Çerçeveleme (Framing)",
        counselorAction:
          "Aşama 1: 'Sınavı kazanamazsam bir hiçim.' -> Aşama 2: 'Şu anda 'Sınavı kazanamazsam bir hiçim' düşüncesine sahip olduğumu fark ediyorum.' -> Aşama 3: 'Bedenimin bu düşünceye kaygıyla tepki verdiğini gözlemliyorum.'",
      },
      {
        stepNumber: 3,
        title: "Nehirdeki Yapraklar (Leaves on a Stream) Egzersizi",
        counselorAction:
          "Danışana gözlerini kapattırın: Sakin bir nehir kenarında oturduğunu, suyun üzerinde yaprakların aktığını hayal ettirin. Gelen her düşünceyi bir yaprağın üzerine koyup akıntı boyunca gitmesini izlemesini söyleyin. Düşünceyi durdurmaya veya hızlandırmaya çalışmaz.",
      },
    ],
    counselorScript:
      "“Bir otobüs şoförü olduğunu düşün. Otobüs senin hayatın, nereye süreceğin senin kararın. Arka koltuklarda ise bir sürü yolcu var: Korku, Endişe, Yetersizlik... Bu yolcular sürekli bağırıyor: 'Sağa dön, kaza yapacaksın! Sen bu yolu beceremezsin!' Şimdi iki seçeneğin var: Ya direksiyonu o bağıran yolculara bırakacaksın ya da onların arkada bağırmasına izin verip gözünü yoldan ayırmadan direksiyonu kendi gitmek istediğin hedefe doğru sürmeye devam edeceksin. Sen otobüsü sürensin, yolcular değilsin.”",
    homeworkAndPractice:
      "Günde en az 3 kez olumsuz düşünce geldiğinde 'Şu an zihnimin bana ... hikayesini anlattığını fark ediyorum' cümlesini kurma.",
    cautionsAndContraindications: [
      "De-füzyon düşünceyi yok etmeyi amaçlamaz. Düşünceyi yok etmeye çalışmak bilişsel baskılamaya ve geri tepme etkisine (rebound effect) yol açar.",
    ],
    evidenceAndReferences: [
      "Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2011). Acceptance and Commitment Therapy: The Process and Practice of Mindful Change (2nd ed.). Guilford Press.",
      "Blackledge, J. T. (2007). Disrupting verbal processes: Cognitive defusion in acceptance and commitment therapy and other cognitive-behavioral therapies. The Psychological Record, 57(4), 555-576.",
    ],
  },
  {
    id: "belirsizlige-tahammulsuzluk-ve-davranissal-deneyler",
    title: "Belirsizliğe Tahammülsüzlük Müdahalesi & Davranışsal Deneyler",
    category: "anksiyete-endise",
    categoryLabel: "Yaygın Anksiyete & Kronik Endişe",
    school: "BDT (Bilişsel Davranışçı Terapi)",
    pioneers: ["Michel J. Dugas", "Robert Ladouceur", "Melisa Robichaud"],
    summary:
      "Danışanın 'Her şeyi garantiye almalıyım, yüzde yüz emin olmadan adım atamam' inancını kırarak, yaşamın doğal bir parçası olan belirsizliği tolere etme kapasitesini küçük dozlu davranışsal deneylerle artırma protokolüdür.",
    targetSymptoms: [
      "Aşırı onay arama (Sürekli 'Sence iyi olacak mı?' diye sorma)",
      "Karar verememe ve sürekli erteleme",
      "Her konuyu saatlerce internetten aşırı araştırma (Bilgi bağımlılığı)",
      "Mükemmeliyetçilik kaynaklı tıkanma",
    ],
    mechanism:
      "Belirsizlik Kasının Güçlendirilmesi (IU Modeli). Anksiyeteli birey belirsizliği tehlike olarak algılar. Birey kontrollü olarak küçük belirsizliklere maruz bırakıldığında, belirsizliğin bir felaketle sonuçlanmadığını deneyimler.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Güvenlik ve Garanti Arayışı Davranışlarının Tespiti",
        counselorAction:
          "Danışanın belirsizliği yok etmek için yaptığı mikro-davranışları belirleyin: Menüyü yarım saat incelemek, mesajı atmadan önce 5 kişiye okutmak, sınav sonucunu sürekli hesaplamak.",
      },
      {
        stepNumber: 2,
        title: "Davranışsal Deney Tasarımı",
        counselorAction:
          "Küçük bir deney planlayın: 'Bu akşam bir restorana gittiğinde menüye 15 saniyeden fazla bakmadan rastgele bir yemek seç.' veya 'WhatsApp mesajını tekrar tekrar okumadan tek seferde gönder.'",
      },
      {
        stepNumber: 3,
        title: "Tahmin ve Gerçekleşen Sonuç Analizi",
        counselorAction:
          "Deney öncesi tahmin: 'Ne kadar kötü olabilir?' Deney sonrası: 'Ne oldu? Hayatta kaldın mı? Belirsizlikle baş edebildin mi?'",
      },
    ],
    counselorScript:
      "“Hayat bir hava durumu gibidir. Sen ne kadar meteoroloji raporlarını saat başı kontrol edersen et, yağmur yağacağı varsa yağar. Yağmuru engelleyemezsin ama yanında şemsiye taşıyabilir ve yağmur yağsa bile yürümeye devam edebilecek güce sahip olduğunu fark edebilirsin. Sürekli gökyüzüne bakıp kaygılanmak yerine, yağmur yağma ihtimaliyle yaşamayı öğreneceğiz.”",
    homeworkAndPractice:
      "Haftalık 'Belirsizlik Deneyi Çizelgesi': Haftada 3 farklı alanda bilinçli olarak küçük belirsizliklere izin verip sonuçları kaydetme.",
    cautionsAndContraindications: [
      "İlk deneyler düşük riskli alanlardan seçilmelidir; hayati veya kritik kararlarda ani belirsizlik yüklemesi yapılmamalıdır.",
    ],
    evidenceAndReferences: [
      "Dugas, M. J., & Robichaud, M. (2007). Cognitive-Behavioral Treatment for Generalized Anxiety Disorder: From Science to Practice. Routledge.",
      "Ladouceur, R., et al. (2000). Cognitive therapy of generalized anxiety disorder: Evaluating the best ingredients. Journal of Consulting and Clinical Psychology, 68(6), 957.",
    ],
  },
  {
    id: "progresif-kas-gevsetme-pmr",
    title: "Progresif Kas Gevşetme (PMR - Jacobson)",
    category: "anksiyete-endise",
    categoryLabel: "Yaygın Anksiyete & Kronik Endişe",
    school: "Davranışçı Terapi & ERP",
    pioneers: ["Edmund Jacobson", "Joseph Wolpe"],
    summary:
      "Vücuttaki temel kas gruplarını sırayla kasıp ardından gevşeterek, somatik kas gerginliği ile zihinsel kaygı arasındaki bağı koparan, derin parasempatik rahatlama sağlayan fizyolojik tekniktir.",
    targetSymptoms: [
      "Sürekli boyun, omuz ve çene sıkma (Bruksizm)",
      "Kronik kas ağrıları ve gerginlik tipi baş ağrısı",
      "Uykuya dalmakta zorlanma (Aşırı somatik uyarılmışlık)",
    ],
    mechanism:
      "Kas İğciği Geri Beslemesi ve Karşıt Koşullama. Fizyolojik olarak bir kas maksimum gerginliğe ulaştığında, gevşeme anında başlangıç noktasından daha derin bir gevşeme düzeyine geçer. Kas gevşediğinde beyne giden 'tehdit var' somatik sinyalleri kesilir.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Hazırlık ve Pozisyon",
        counselorAction:
          "Danışanı rahat bir koltuğa oturtun, gözlerini kapatmasını isteyin, nefesini yavaşlatın.",
      },
      {
        stepNumber: 2,
        title: "Kas Grupları Döngüsü (7 sn Kas - 15 sn Gevşe)",
        counselorAction:
          "Sırayla uygulatın: 1) Eller ve ön kollar (yumruk sıkma), 2) Pazu ve omuzlar (omuzları kulaklara çekme), 3) Yüz ve alın (kaşları çatma, gözleri sıkma), 4) Karın ve göğüs (karnı içeri çekme), 5) Bacaklar ve ayak parmakları (parmakları kendine çekme).",
      },
      {
        stepNumber: 3,
        title: "Farkı Hissetme (Kontrast)",
        counselorAction:
          "Gevşeme anında danışanın dikkatini sıcaklık, ağırlık ve gevşeme hissine yönlendirin: 'Gerginlik ile gevşeme arasındaki farkı hisset.'",
      },
    ],
    counselorScript:
      "“Şimdi ellerini yumruk yap ve tüm gücünle sık. Parmak eklemlerindeki gerginliği hisset, 1, 2, 3, 4, 5, 6, 7... Ve şimdi tamamen bırak! Bıraktığın anda parmak uçlarına yayılan o sıcaklığı, rahatlamayı ve kan akışını hisset. Bedenin gerginliği nasıl üretiyorsa, gevşemeyi de aynı şekilde üretebilir.”",
    homeworkAndPractice:
      "Her akşam yatmadan önce 15 dakika 4 ana kas grubu üzerinden PMR protokolünü uygulama.",
    cautionsAndContraindications: [
      "Kas veya eklem sakatlığı, fıtık veya akut ağrısı olan bölgeler aşırı sıkılmamalıdır.",
    ],
    evidenceAndReferences: [
      "Jacobson, E. (1938). Progressive Relaxation. University of Chicago Press.",
      "Bernstein, D. A., Borkovec, T. D., & Hazlett-Stevens, H. (2000). New Directions in Progressive Muscle Relaxation. Praeger.",
    ],
  },

  // ==========================================
  // 3. SINAV KAYGISI VE AKADEMİK PERFORMANS
  // ==========================================
  {
    id: "zihinsel-prova-ve-basari-canlandirmasi",
    title: "Zihinsel Prova ve Başarı Canlandırması (Mental Rehearsal)",
    category: "sinav-kaygisi",
    categoryLabel: "Sınav Kaygısı & Akademik Performans",
    school: "BDT (Bilişsel Davranışçı Terapi)",
    pioneers: ["Ann Hackmann", "Emily A. Holmes"],
    summary:
      "Öğrencinin sınav sabahını, salona girişini, zor bir soruyla karşılaştığı anı ve bu anı soğukkanlılıkla yönettiğini tüm duyusal ayrıntılarıyla zihninde canlandırarak sınav anına karşı nöral bağışıklık kazandırma tekniğidir.",
    targetSymptoms: [
      "Sınav anında panikleyip bildiğini unutma korkusu",
      "Zor bir soru gördüğünde donup kalma (Freezing)",
      "Sınav salonunu bir felaket mekanı gibi algılama",
    ],
    mechanism:
      "Fonksiyonel Eşdeğerlik (Functional Equivalence). Beyin nörogörüntüleme çalışmalarında, bir eylemi canlı olarak zihinde prova etmekle bizzat yapmak aynı motor ve prefrontal nöral devreleri aktive eder. Gerçek sınav anında beyin bu durumu 'daha önce defalarca başarıyla deneyimlenmiş bir senaryo' olarak algılar.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Kritik Eşik Sahnesinin Belirlenmesi",
        counselorAction:
          "Öğrencinin en çok korktuğu sahneyi belirleyin (Örn: Matematikte 5. soruda takıldığı ve sürenin azaldığını hissettiği an).",
      },
      {
        stepNumber: 2,
        title: "Canlandırmanın Başlatılması ve Duygusal Yükleme",
        counselorAction:
          "Öğrenciye sahneyi şimdiki zamanda anlattırın: 'Sıradayım, soruya bakıyorum, içimden kaygı dalgası yükseliyor.'",
      },
      {
        stepNumber: 3,
        title: "Usta Başa Çıkma Davranışının Canlandırılması (Coping Imagery)",
        counselorAction:
          "Öğrenciye müdahale ettirin: 'Şimdi kalemi sakince masaya bırakıyorsun. Sırtını yaslıyorsun. Derin bir 4-2-6 nefesi alıyorsun. Kendine 'Bu sadece bir soru, turlama taktiğiyle sonraya bırakabilirim' diyorsun. Yanındaki soruya geçiyorsun ve çözüyorsun.'",
      },
    ],
    counselorScript:
      "“Olimpiyat sporcuları yarıştan önce gözlerini kapatıp parkuru santim santim, viraj viraj zihinlerinde geçerler. Bir virajda kaydıklarını değil, kaydıklarında nasıl toparlayıp yola devam ettiklerini prova ederler. Şimdi biz de seninle sınav maratonunun zihinsel provasını yapacağız. Amacımız mükemmel bir sınav değil, zor bir soru geldiğinde nasıl sakin kalıp rotana devam ettiğini zihnine adım adım öğretmek.”",
    homeworkAndPractice:
      "Sınava 2 hafta kala her deneme sınavından 15 dakika önce bu 3 dakikalık başarı provasını uygulamak.",
    cautionsAndContraindications: [
      "Canlandırma sadece 'hiç hata yapmadığım mükemmel bir sınav' şeklinde olmamalıdır (Mastery imagery tek başına kırılgandır). Asıl dönüştürücü olan, zorlukla karşılaşıp başa çıktığı 'Coping Imagery' senaryolarıdır.",
    ],
    evidenceAndReferences: [
      "Hackmann, A., Bennett-Levy, J., & Holmes, E. A. (2011). Oxford Guide to Imagery in Cognitive Therapy. Oxford University Press.",
      "Holmes, E. A., & Mathews, A. (2010). Mental imagery in emotion and psychopathology. Journal of Abnormal Psychology, 119(2), 349-362.",
    ],
  },
  {
    id: "sinav-ani-30-saniyelik-stopp-protokolu",
    title: "Sınav Anı 30 Saniyelik Sıfırlama (STOPP Protokolü)",
    category: "sinav-kaygisi",
    categoryLabel: "Sınav Kaygısı & Akademik Performans",
    school: "BDT (Bilişsel Davranışçı Terapi)",
    pioneers: ["Carol Vivyan", "Aaron T. Beck"],
    summary:
      "Sınav esnasında kaygının tavan yaptığı, ellerin titrediği veya zihnin kilitlendiği anlarda öğrencinin 30 saniye içinde uygulayabileceği yapılandırılmış acil müdahale algoritmasıdır.",
    targetSymptoms: [
      "Sınav anında kilitlenme ve bildiklerini karıştırma",
      "Optik formda kaydırma yapma endişesiyle aşırı titreme",
      "'Yapamayacağım, her şey bitti' paniği",
    ],
    mechanism:
      "Amigdala kaçırmasını (Amygdala Hijack) durdurup yürütücü bilişsel işlevleri (Executive Functions) geri kazanma.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "S - Stop (DUR)",
        counselorAction: "Kalemi hemen masaya bırak, soruya bakmayı durdur.",
      },
      {
        stepNumber: 2,
        title: "T - Take a breath (NEFES AL)",
        counselorAction: "Burundan 1 derin nefes al, yavaşça ver, omuzlarını düşür.",
      },
      {
        stepNumber: 3,
        title: "O - Observe (GÖZLEMLE)",
        counselorAction: "İç sesini fark et: 'Şu an ne düşünüyorum? Panik yapıyorum. Bu gerçek bir tehlike mi? Hayır, sadece sınav stresi.'",
      },
      {
        stepNumber: 4,
        title: "P - Pull back (GENİŞ AÇIYA GEÇ)",
        counselorAction: "Tek bir soruya takılma: 'Bu 160 sorudan sadece biri. Bu soruyu geçebilirim, diğer sorular beni bekliyor.'",
      },
      {
        stepNumber: 5,
        title: "P - Proceed (DEVAM ET)",
        counselorAction: "Soruya bir işaret koy, sonraki soruya geç ve devam et.",
      },
    ],
    counselorScript:
      "“Sınav anında kafanın içinde bir sis çöktüğünü hissedersen kalemi zorla kağıda sürmeye çalışma. Kalemi sakince masaya bırak. S-T-O-P-P kuralını hatırla: Dur, tek bir derin nefes al, 'Şu an sadece stres yükseldi, dünyanın sonu değil' de, geniş açıya geç ve sıradaki soruya odaklan. 30 saniye kaybetmek, 10 soruyu panikle çöpe atmaktan bin kat daha karlıdır.”",
    homeworkAndPractice:
      "Haftalık çözülen tüm branş ve genel deneme sınavlarında zorlanılan anlarda STOPP protokolünü bilinçli olarak uygulamak.",
    cautionsAndContraindications: [
      "Öğrenci bu tekniği denemelerde prova etmeden asıl sınavda uygulayamaz; her denemede en az 1 kez kasıtlı olarak test edilmelidir.",
    ],
    evidenceAndReferences: [
      "Vivyan, C. (2009). Cognitive Behaviour Therapy Self-Help Resources: The STOPP Skill. Getselfhelp.",
      "Zeidner, M. (1998). Test Anxiety: The State of the Art. Plenum Press.",
    ],
  },
  {
    id: "akademik-erteleme-bes-dakika-kurali",
    title: "Akademik Erteleme İçin 5 Dakika Kuralı & Zeigarnik Çerçevesi",
    category: "sinav-kaygisi",
    categoryLabel: "Sınav Kaygısı & Akademik Performans",
    school: "Davranışçı Terapi & ERP",
    pioneers: ["Bluma Zeigarnik", "David Allen"],
    summary:
      "Öğrencinin ders masasına oturmasını engelleyen devasa zihinsel bariyeri yıkarak, eyleme geçiş direncini en aza indiren davranışsal aktivasyon kuralıdır.",
    targetSymptoms: [
      "Masa başına geçmeyi saatlerce erteleme (Procrastination)",
      "Konu çok büyük göründüğü için hiç başlayamama",
      "Sosyal medyada kaybolup vicdan azabı çekme",
    ],
    mechanism:
      "Zeigarnik Etkisi ve Eylemsizlik Momenti. İnsan zihni yarım kalmış görevleri tamamlanmış olanlardan çok daha güçlü hatırlar ve tamamlama güdüsü duyar. En zor aşama 'başlama' anıdır; 5 dakika ile başlama eşiği düşürüldüğünde beyin akışa girer.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Düşük Eşikli Anlaşma",
        counselorAction:
          "Öğrenciyle şu anlaşmayı yapın: 'Senden 3 saat çalışmanı istemiyorum. Sadece 5 dakika masaya oturup 1 tek test veya 1 sayfa açacaksın. 5 dakika dolduğunda istersen masadan kalkabilirsin.'",
      },
      {
        stepNumber: 2,
        title: "Tüm Dikkati Dağıtıcıları Kaldırma",
        counselorAction: "Telefon başka odaya bırakılır, masada sadece o 5 dakikalık materyal kalır.",
      },
      {
        stepNumber: 3,
        title: "Devam Etme İnisiyatifi",
        counselorAction:
          "5 dakika dolduğunda beynin Zeigarnik etkisi devreye girer; vakaların %85'inde öğrenci kalkmak istemez ve çalışmaya devam eder.",
      },
    ],
    counselorScript:
      "“Bir treni durduğu yerden ilk 1 metre hareket ettirmek devasa bir enerji ister; ama tren bir kez hareket ettiğinde kendi momentumuyla kilometrelerce gider. Ders çalışmak da böyledir. Gözünde 3 saati büyüttüğün için başlayamıyorsun. Kendine sadece şunu söyle: 'Sadece 5 dakika bakacağım, sonra istersem kalkarım.' O ilk 5 dakikayı atlattığında gerisinin nasıl aktığına şaşıracaksın.”",
    homeworkAndPractice:
      "Her çalışma bloğuna başlarken saati 5 dakikaya ayarlayıp masaya oturma egzersizi.",
    cautionsAndContraindications: [
      "Eğer öğrenci 5 dakika sonra gerçekten kalkmak isterse buna izin verilmelidir; aksi takdirde beyin 'kandırıldım' hissine kapılır ve kural inandırıcılığını kaybeder.",
    ],
    evidenceAndReferences: [
      "Zeigarnik, B. (1938). On finished and unfinished tasks. A Source Book of Gestalt Psychology, 300-314.",
      "Steel, P. (2007). The nature of procrastination: A meta-analytic and theoretical review of quintessential self-regulatory failure. Psychological Bulletin, 133(1), 65-94.",
    ],
  },

  // ==========================================
  // 4. DEPRESYON VE DAVRANIŞSAL AKTİVASYON
  // ==========================================
  {
    id: "davranissal-aktivasyon-ba",
    title: "Davranışsal Aktivasyon (Behavioral Activation - BA)",
    category: "depresyon-motivasyon",
    categoryLabel: "Depresyon & Davranışsal Aktivasyon",
    school: "BDT (Bilişsel Davranışçı Terapi)",
    pioneers: ["Christopher R. Martell", "Neil S. Jacobson", "Sona Dimidjian"],
    summary:
      "Depresif döngüdeki 'İçimden hiçbir şey yapmak gelmiyor, enerjim yok' eylemsizliğini kırmak için; duyguların eylemden önce değil, eylemden SONRA geleceğini kanıtlayan, zevk ve başarı odaklı aktivite planlama protokolüdür.",
    targetSymptoms: [
      "Yataktan çıkmak istememe, sürekli yatma isteği",
      "Sosyal geri çekilme ve izolasyon",
      "Hiçbir şeyden zevk alamama (Anhedoni)",
      "'Önce hevesim gelsin sonra çalışırım' yanılgısı",
    ],
    mechanism:
      "Dışsal Pozitif Pekiştireç Döngüsü (Reward Processing). İzolasyon ve pasiflik dopamin ve serotonin üretimini baskılar. Eyleme geçildiğinde (özellikle Ustalık ve Zevk üreten aktiviteler) beyindeki ödül devreleri yeniden canlanır.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Günlük Aktivite ve Ruh Hali Takibi (Baseline)",
        counselorAction:
          "Danışana bir haftalık saatlik çizelge verin. Her saatte ne yaptığını ve o esnada hissettiği Zevk (Pleasure 0-10) ile Ustalık/Başarı (Mastery 0-10) puanlarını yazdırın.",
      },
      {
        stepNumber: 2,
        title: "Kısır Döngünün Keşfi",
        counselorAction:
          "Çizelgeye birlikte bakın: 'Bütün gün yatakta telefonla vakit geçirdiğinde zevk puanın kaç olmuş? (1). Başarı puanın kaç? (0). Kendini daha mı enerjik hissettin yoksa daha mı bitkin?'",
      },
      {
        stepNumber: 3,
        title: "Derecelendirilmiş Görev Planlaması (Graded Tasks)",
        counselorAction:
          "Küçük, mikro-eylemler belirleyin: 'Yarın saat 11:00'de 15 dakika balkona çıkıp kahve içmek' veya 'Odanın sadece çalışma masasını toplamak'.",
      },
    ],
    counselorScript:
      "“Bir arabanın aküsü tamamen bittiğinde kontağı ne kadar çevirirsen çevir çalışmaz. 'Hadi araba, içinden çalışma isteği gelsin' diyemezsin. O arabayı çalıştırmak için önce dışarıdan itmek gerekir. Tekerlekler döndükçe akü şarj olur, motor çalışır. Depresyonda da böyledir: Motivasyonunun gelmesini beklersen aylarca yataktan çıkamazsın. Önce eylemi iteceğiz, motivasyon arkadan şarj olacak.”",
    homeworkAndPractice:
      "Haftalık Aktivite Çizelgesi: Her gün için önceden planlanmış 2 küçük aktiviteyi uygulamak ve Z/U puanlarını kaydetmek.",
    cautionsAndContraindications: [
      "Danışana baştan çok büyük ve ağır hedefler (Örn: 'Günde 5 saat ders çalış', 'Her gün spor salonuna git') verilmemelidir. Başarısızlık suçluluk duygusunu artırır.",
    ],
    evidenceAndReferences: [
      "Martell, C. R., Dimidjian, S., & Herman-Dunn, R. (2010). Behavioral Activation for Depression: A Clinician's Guide. Guilford Press.",
      "Jacobson, N. S., et al. (1996). A component analysis of cognitive-behavioral treatment for depression. Journal of Consulting and Clinical Psychology, 64(2), 295-304.",
    ],
  },
  {
    id: "otomatik-dusunce-kaydi-ve-bilissel-carpitmalar",
    title: "Otomatik Düşünce Kaydı (ODK) & Bilişsel Çarpıtma Analizi",
    category: "depresyon-motivasyon",
    categoryLabel: "Depresyon & Davranışsal Aktivasyon",
    school: "BDT (Bilişsel Davranışçı Terapi)",
    pioneers: ["Aaron T. Beck", "David D. Burns"],
    summary:
      "Danışanın duygularını bozan otomatik olumsuz düşünceleri (Ya Hep Ya Hiç, Zihin Okuma, Felaketleştirme, Etiketleme) yakalayıp, 7 sütunlu düşünce kaydı ile alternatif dengeli düşünceler üretmesini sağlayan klasik BDT omurgasıdır.",
    targetSymptoms: [
      "Aşırı suçluluk ve kendini değersizleştirme",
      "'Ben zaten hiçbir şeyi beceremem' etiketlemesi",
      "Geleceğe dair umutsuzluk ve karamsarlık",
    ],
    mechanism:
      "Bilişsel Model (A-B-C). Olaylar değil, olaylara verdiğimiz anlamlar duyguları belirler. Çarpıtılmış bilişsel şemalar yeniden yapılandırıldığında duygusal çökkünlük hafifler.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Durum ve Duygunun Ayrıştırılması",
        counselorAction:
          "Danışana 'Denemeden kötü puan aldım' (Olay) ile 'Ben yetersizim' (Düşünce) ve 'Çaresizlik %90' (Duygu) arasındaki farkı netleştirin.",
      },
      {
        stepNumber: 2,
        title: "Bilişsel Çarpıtmanın Adlandırılması",
        counselorAction:
          "Düşüncedeki mantık hatasını bulun: 'Bu Ya Hep Ya Hiç düşüncesi mi? Aşırı Genelleme mi?'",
      },
      {
        stepNumber: 3,
        title: "Lehte ve Aleyhte Kanıt Toplama & Alternatif Düşünce",
        counselorAction:
          "Mahkeme metaforu: 'Bir avukat gibi düşün. Bu düşüncenin doğruluğunu kanıtlayan somut gerçekler neler? Bu düşünceyi çürüten gerçekler neler? İkisini birleştiren dengeli yeni düşünce ne olabilir?'",
      },
    ],
    counselorScript:
      "“Zihninde takılı olan gözlüğün camları simsiyah boyanmış gibi. O gözlükle dünyaya baktığında güneşi görsen bile 'Hava ne kadar karanlık' diyorsun. O gözlük sana 'Sen yetersizsin' diyor. Şimdi o gözlüğü çıkarıp masaya koyacağız ve birlikte bakacağız: Gerçekten hava karanlık mı yoksa sadece gözlüğün camları mı kirli?”",
    homeworkAndPractice:
      "Haftada en az 3 olumsuz duygu anında 7 Sütunlu Otomatik Düşünce Kaydı doldurma.",
    cautionsAndContraindications: [
      "Pozitif polyannacılık yapılmamalıdır. Amaç 'Her şey harika olacak' demek değil, 'Durum zor ama başa çıkabilirim, eksiklerimi kapatabilirim' gerçekçiliğidir.",
    ],
    evidenceAndReferences: [
      "Beck, A. T. (1979). Cognitive Therapy of Depression. Guilford Press.",
      "Burns, D. D. (1980). Feeling Good: The New Mood Therapy. William Morrow and Company.",
    ],
  },

  // ==========================================
  // 5. ŞEMA TERAPİ (YOUNG)
  // ==========================================
  {
    id: "sema-mod-terapisi-sandalye-diyaloglari",
    title: "Şema Mod Terapisi: Sağlıklı Yetişkin & Cezalandırıcı Ebeveyn Sandalye Diyaloğu",
    category: "sema-terapi",
    categoryLabel: "Şema Terapi & Sandalye Diyalogları",
    school: "Şema Terapi",
    pioneers: ["Jeffrey E. Young", "Arnoud Arntz"],
    summary:
      "Danışanın çocukluktan getirdiği katı cezalandırıcı/talepkar ebeveyn iç seslerini dışsallaştırarak, iki sandalye tekniğiyle bu seslere sınır koyma ve Sağlıklı Yetişkin modunu güçlendirerek Kırılgan Çocuk modunu koruma protokolüdür.",
    targetSymptoms: [
      "Aşırı acımasız özeleştiri ('Aptalsın, tembelsin')",
      "Kronik kusurluluk ve yetersizlik inancı",
      "Başarısızlık şeması ve performans kaygısı",
    ],
    mechanism:
      "Duygusal Yeniden İşleme ve Mod Dönüşümü. İçselleştirilmiş ebeveyn sesleri somut bir sandalyeye oturtulduğunda danışan bu sesin kendisi olmadığını görür. Danışman önce Sağlıklı Yetişkin olarak modele girer, ardından danışanın kendi sağlıklı yetişkinine alan açar.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Modların İsimlendirilmesi",
        counselorAction:
          "Danışanın iç sesini netleştirin: 'Bu konuşan kim? Cezalandırıcı Ebeveyn Modu. Kime konuşuyor? Kırılgan Çocuk Moduna.'",
      },
      {
        stepNumber: 2,
        title: "Sandalyelerin Konumlandırılması",
        counselorAction:
          "Odaya iki sandalye koyun. Danışanı Cezalandırıcı Ebeveyn sandalyesine oturtun ve o acımasız sesin ağzından konuşmasını isteyin: 'Ne söylüyorsun ona?'",
      },
      {
        stepNumber: 3,
        title: "Sağlıklı Yetişkin Sandalyesine Geçiş ve Sınır Koyma",
        counselorAction:
          "Danışanı karşı sandalyeye geçirin. Gerekirse önce siz o sandalyeye geçip ebeveyne sınır koyun: 'Dur orada! Ona böyle konuşamazsın. O elinden gelenin en iyisini yapıyor ve senin bu aşağılamalarına izin vermeyeceğim.' Ardından danışana bu cümleyi kendi sesiyle söyletin.",
      },
      {
        stepNumber: 4,
        title: "Kırılgan Çocuğu Kucaklama (Sınırlı Yeniden Ebeveynlik)",
        counselorAction:
          "İçindeki üzgün, yorgun çocuğa şefkat göstermesini sağlayın: 'Seni duyuyorum, güvendesin, değerlisin.'",
      },
    ],
    counselorScript:
      "“Şimdi o sandalyeye bakmanı istiyorum. Orada senin küçüklüğünden beri kulağına 'Sen yetersizsin, asla kazanamayacaksın' diye fısıldayan o ses oturuyor. Şimdi ayağa kalk, o sesin karşısına geç ve gözlerinin içine bakarak söyle: 'Yıllardır beni korkutarak motive edeceğini sandın ama sadece beni tükettin. Artık seni dinlemiyorum. Hatalarım olabilir ama bu benim değerimi düşürmez. Çekil yolumdan!'”",
    homeworkAndPractice:
      "Hafta içinde cezalandırıcı ses devreye girdiğinde 'Dur, bu benim sesim değil, cezalandırıcı ebeveynim' diyerek Sağlıklı Yetişkin Başa Çıkma Cümlesini sesli okuma.",
    cautionsAndContraindications: [
      "Danışanın Sağlıklı Yetişkin modu çok zayıfsa, önce terapistin model olması (Limited Reparenting) gerekir; danışan hazır olmadan zorla sandalyeye oturtulmamalıdır.",
    ],
    evidenceAndReferences: [
      "Young, J. E., Klosko, J. S., & Weishaar, M. E. (2003). Schema Therapy: A Practitioner's Guide. Guilford Press.",
      "Arntz, A., & Jacob, G. (2012). Schema Therapy in Practice: An Introductory Guide to the Schema Mode Approach. Wiley-Blackwell.",
    ],
  },

  // ==========================================
  // 6. VAROLUŞÇU TERAPİ (YALOM) & ADLERİAN
  // ==========================================
  {
    id: "yalom-varoluscu-sorumluluk-ve-simdi-ve-burada",
    title: "Yalom: Varoluşsal Sorumluluk ve 'Şimdi ve Burada' (Here-and-Now)",
    category: "varoluscu-adler",
    categoryLabel: "Varoluşçu Terapi & Adlerian Yaklaşım",
    school: "Varoluşçu Psikoterapi",
    pioneers: ["Irvin D. Yalom", "Viktor E. Frankl", "Rollo May"],
    summary:
      "Danışanın hayatındaki başarısızlıkları ve mutsuzlukları sürekli dış faktörlere (aile, sınav sistemi, şanssızlık) yükleyip pasif bir 'kurban' rolüne sığınmasını dönüştürerek, kendi seçimlerinin ve geleceğinin yegane mimarı olduğunu fark ettirme ve seanstaki anlık ilişkiyi aynalama çalışmasıdır.",
    targetSymptoms: [
      "Kronik şikayet etme ama hiçbir sorumluluk almama",
      "'Elimde değil, onlar yüzünden böyleyim' kurban psikolojisi",
      "Varoluşsal anlamsızlık ve boşluk hissi",
    ],
    mechanism:
      "Kurban Dili yerine Fail Dili (Victim to Agent Language). Kişi kendi çaresizliğini kendisinin yarattığını fark ettiğinde, bunu değiştirme gücüne de yalnızca kendisinin sahip olduğunu idrak eder.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Şikayetin İçindeki Katkıyı Görme",
        counselorAction:
          "Danışan dış dünyayı suçlarken sorun: 'Peki bu durumun böyle sürmesinde senin payın ne? Bu şikayet ettiğin durumun devam etmesine nasıl katkıda bulunuyorsun?'",
      },
      {
        stepNumber: 2,
        title: "Dilsel Dönüşüm: 'Yapamıyorum' Yerine 'Seçmiyorum'",
        counselorAction:
          "Danışana 'Ders çalışamıyorum' dediğinde cümleyi düzelttirin: 'Ders çalışmamayı tercih ediyorum.' veya 'Ertelemeyi seçiyorum.' Farkı hissettirin.",
      },
      {
        stepNumber: 3,
        title: "Şimdi ve Burada (Here-and-Now) Aynalaması",
        counselorAction:
          "Danışanın dışarıdaki kalıbı seansta yaşandığı anda durdurun: 'Şu an fark ettin mi? Sana derin bir soru sorduğumda hemen gözlerini kaçırdın ve konuyu değiştirdin. Dışarıdaki ilişkilerinde de samimiyet derinleştiğinde böyle kaçıyor olabilir misin?'",
      },
    ],
    counselorScript:
      "“Bir parmaklığın ardında olduğunu düşünüyorsun ve sürekli dışarıdakilere bağırıyorsun: 'Beni buraya kilitlediniz, beni kurtarın!' Ama parmaklıklara dikkatlice bakarsan, kapının kilitli olmadığını ve anahtarın başından beri senin kendi cebinde durduğunu görürsün. Kapıyı açıp dışarı çıkmak korkutucu; çünkü dışarı çıkarsan artık kimseyi suçlayamazsın, hayatının tek sorumlusu sen olursun. Hazır mısın o anahtarı kullanmaya?”",
    homeworkAndPractice:
      "Gün içinde 'elimde değil' dediği her an durup 'Bunu ben seçiyorum' diyerek kendi sorumluluğunu not etme.",
    cautionsAndContraindications: [
      "Yargılayıcı veya suçlayıcı bir ton kullanılmamalıdır. Sorumluluk suçluluk demek değildir; sorumluluk 'yanıt verebilme gücü' (response-ability) demektir.",
    ],
    evidenceAndReferences: [
      "Yalom, I. D. (1980). Existential Psychotherapy. Basic Books.",
      "Yalom, I. D. (2002). The Gift of Therapy: An Open Letter to a New Generation of Therapists and Their Patients. HarperCollins.",
      "Frankl, V. E. (1959). Man's Search for Meaning. Beacon Press.",
    ],
  },
  {
    id: "adlerian-sanki-as-if-teknigi",
    title: "Adlerian 'Sanki' (As If) Tekniği & Cesaretlendirme",
    category: "varoluscu-adler",
    categoryLabel: "Varoluşçu Terapi & Adlerian Yaklaşım",
    school: "Adlerian (Bireysel Psikoloji)",
    pioneers: ["Alfred Adler", "Rudolf Dreikurs"],
    summary:
      "Danışanın aşağılık duygusu ve öğrenilmiş çaresizliğini kırmak için; hayal ettiği özgüvenli, başarılı ve yetkin kişiymiş gibi belirli süreler boyunca 'sanki öyleymiş gibi' davranmasını sağlayarak yeni davranış kalıpları ve sosyal cesaret üretme tekniğidir.",
    targetSymptoms: [
      "Aşırı çekingenlik, sosyal ortamlarda silikleşme",
      "'Ben özgüvensiz biriyim' katı kimlik inancı",
      "Söz hakkı alamama, hakkını arayamama",
    ],
    mechanism:
      "Davranışsal Rol Provası ve Sosyal İlgi (Gemeinschaftsgefühl). Kişi yeni bir rolü oynarken beyni 'Bu davranışı yapabiliyorum' kanıtını üretir. Davranış içsel inancı dönüştürür.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Büyülü Soru (The Question)",
        counselorAction:
          "Danışana sorun: 'Eğer bu kaygın/özgüvensizliğin bu gece bir mucizeyle tamamen kaybolsaydı, yarın sabah uyandığında ilk neyi farklı yapardın? Nasıl yürürdün? Nasıl konuşurdun?'",
      },
      {
        stepNumber: 2,
        title: "Sanki Sözleşmesi",
        counselorAction:
          "Danışanla anlaşın: 'Önümüzdeki Salı günü saat 14:00 ile 16:00 arasında, 2 saatliğine bir tiyatro oyuncusu gibi olacaksın. Sanki kendine %100 güvenen, dik duran, fikrini söyleyen biriymiş gibi rol yapacaksın.'",
      },
      {
        stepNumber: 3,
        title: "Seans Değerlendirmesi",
        counselorAction:
          "Danışanın deneyimini dinleyin: 'İnsanlar nasıl tepki verdi? Sen ne hissettin? O oynadığın kişi aslında senin içinde bir yerlerde zaten var olabilir mi?'",
      },
    ],
    counselorScript:
      "“Bir kostüm giydiğini düşün. Henüz kendini cesur hissetmiyor olabilirsin ama cesur bir insanın nasıl yürüdüğünü, nasıl nefes aldığını, göz teması kurarken nasıl baktığını çok iyi biliyorsun. Bu hafta sonu senden bir oyuncu olmanı istiyorum. Yalnızca 2 saat boyunca 'kendine tam güvenen o genç' kostümünü giy ve dünyayı o kostümle dolaş. Bakalım dünya sana nasıl karşılık verecek.”",
    homeworkAndPractice:
      "Haftanın 2 günü belirlenen 1'er saatlik zaman dilimlerinde 'Sanki' tekniğini uygulayıp gözlem günlüğü tutma.",
    cautionsAndContraindications: [
      "Danışana sahtekarlık (imposter) hissi yaşatılmamalıdır; bunun kalıcı bir rol değil, potansiyeli keşfetmek için bir deney olduğu vurgulanmalıdır.",
    ],
    evidenceAndReferences: [
      "Adler, A. (1927). Understanding Human Nature. Greenberg.",
      "Ansbacher, H. L., & Ansbacher, R. R. (Eds.). (1956). The Individual Psychology of Alfred Adler. Basic Books.",
      "Dreikurs, R. (1967). Psychodynamics, Psychotherapy, and Counseling. Alfred Adler Institute.",
    ],
  },

  // ==========================================
  // 7. FOBİLER, OBSESYONLAR & DUYARSIZLAŞTIRMA
  // ==========================================
  {
    id: "sistematik-duyarsizlastirma-wolpe",
    title: "Sistematik Duyarsızlaştırma (Systematic Desensitization)",
    category: "fobi-duyarsizlastirma",
    categoryLabel: "Fobi, Obsesyon & Duyarsızlaştırma",
    school: "Davranışçı Terapi & ERP",
    pioneers: ["Joseph Wolpe"],
    summary:
      "Özgül fobilerde ve koşullanmış korkularda, derin fizyolojik gevşeme ile korku hiyerarşisindeki basamakları zihinsel olarak eşleştirerek korku tepkisini adım adım söndüren klasik karşıt koşullama tekniğidir.",
    targetSymptoms: [
      "Özgül fobiler (Hayvan, yükseklik, kapalı alan, iğne/kan)",
      "Koşullanmış sınav salonu / okul fobisi",
    ],
    mechanism:
      "Karşıt Ketleme (Reciprocal Inhibition). Birbirine fizyolojik olarak zıt iki durum (derin sempatik gevşeme ile sempatik korku) aynı anda var olamaz. Gevşeme durumu korku tepkisini inhibe eder.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Korku Hiyerarşisi (10-12 Basamak)",
        counselorAction:
          "Örn. Köpek fobisi: 1) Köpek resmi görmek (10), 2) Cam arkasından köpek izlemek (30), 3) 10 metre uzaktan tasmalı köpek görmek (50), 4) Yanından geçmek (70), 5) Dokunmak (90).",
      },
      {
        stepNumber: 2,
        title: "Derin Gevşeme Eğitimi",
        counselorAction: "Danışana diyafram nefesi ve PMR ile hızlı gevşeme öğretilir.",
      },
      {
        stepNumber: 3,
        title: "Eşleştirme ve Söndürme Seansı",
        counselorAction:
          "Danışan gevşer. 1. basamak zihinde 15 sn canlandırılır. Kaygı hissedilirse parmak kaldırılır, sahne silinir, tekrar gevşenir. Sıfır kaygı ile canlandırılana kadar tekrarlanır; ardından bir üst basamağa geçilir.",
      },
    ],
    counselorScript:
      "“Korku bir yangınsa, gevşeme onun üzerine sıktığımız sudur. İkisi aynı yerde var olamaz. Bedenini tam bir sakinlik denizine soktuğumuzda, o korktuğun sahneyi zihnine küçük bir damla olarak bırakacağız. Bedenin o sakinliği korudukça, beynin 'Bu görüntü benim kalbimi hızlandıramıyor' demeyi öğrenecek.”",
    homeworkAndPractice:
      "Seans içi tamamlanan basamakların evde ses kaydı eşliğinde zihinsel provasını yapma.",
    cautionsAndContraindications: [
      "Basamaklar arasında acele edilmemelidir; bir basamakta kaygı tamamen sıfırlanmadan asla bir üst basamağa geçilmemelidir.",
    ],
    evidenceAndReferences: [
      "Wolpe, J. (1958). Psychotherapy by Reciprocal Inhibition. Stanford University Press.",
      "Wolpe, J. (1990). The Practice of Behavior Therapy (4th ed.). Pergamon Press.",
    ],
  },
  {
    id: "tepki-onleme-ile-maruz-birakma-erp",
    title: "Tepki Önleme ile Maruz Bırakma (ERP - Exposure and Response Prevention)",
    category: "fobi-duyarsizlastirma",
    categoryLabel: "Fobi, Obsesyon & Duyarsızlaştırma",
    school: "Davranışçı Terapi & ERP",
    pioneers: ["Edna B. Foa", "Jonathan S. Abramowitz"],
    summary:
      "Obsesif düşünceler veya fobik tetikleyicilerle yüzleşildiğinde yapılan rahatlatıcı kompulsiyonları, nötrleme davranışlarını ve zihinsel ritüelleri bilinçli olarak engelleyerek kaygının doğal düşüşünü yaşatma protokolüdür.",
    targetSymptoms: [
      "Kirlenme obsesyonu ve aşırı el yıkama",
      "Sürekli kontrol etme (Kapı, tüp, optik form, soru)",
      "Simetri ve düzen takıntıları",
      "Zihinsel nötrleme ritüelleri (İçinden sayı sayma, dua okuma)",
    ],
    mechanism:
      "Kompulsiyon Döngüsünün Kırılması. Kompulsiyon kaygıyı anlık düşürdüğü için obsesyonu besleyen bir 'negatif pekiştireç'tir. Kompulsiyon yapılmadığında, amigdala tehlikenin gerçekleşmediğini öğrenir ve obsesyon söner.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Tetikleyici ve Kompulsiyon Haritası",
        counselorAction:
          "Tetikleyici: 'Kapı koluna dokunmak'. Obsesyon: 'Hastalık bulaşacak'. Kompulsiyon: '3 kez elleri yıkamak'.",
      },
      {
        stepNumber: 2,
        title: "Maruz Bırakma ve Tepkiyi Önleme",
        counselorAction:
          "Danışan kapı koluna dokunur (Exposure). Ellerini yıkaması kesinlikle engellenir (Response Prevention).",
      },
      {
        stepNumber: 3,
        title: "Kaygı Eğrisinin Takibi",
        counselorAction:
          "Her 2 dakikada bir SUDS sorulur. Kaygı önce 80'e çıkar, sonra 60'a, 40'a ve 20'ye düşer. Danışan yıkanmadan da kaygının bittiğini görür.",
      },
    ],
    counselorScript:
      "“Kompulsiyon bir şantajcıya para ödemek gibidir. Şantajcı (obsesyon) gelir, 'Bana 100 lira vermezsen rezil olursun' der. Sen parayı (kompulsiyon) verirsin, 1 saat rahatlarsın. Ama ertesi gün şantajcı bu kez 500 lira istemek için geri gelir. Kompulsiyon yaptıkça obsesyonu beslersin. Bugün o şantajcıya ilk kez tek kuruş ödemeyeceğiz; kapıda bağırmasına izin vereceğiz ama kapıyı açmayacağız. Bir süre sonra sıkılıp gidecek.”",
    homeworkAndPractice:
      "Evde belirlenen maruz kalma egzersizini yapıp kompulsiyonu önce 15 dakika erteleme, ardından tamamen bırakma.",
    cautionsAndContraindications: [
      "Gizli zihinsel kompulsiyonlara (içinden 'iyi bir şey düşünme', kelime tekrarlama) dikkat edilmelidir; bunlar da ERP'yi bozar.",
    ],
    evidenceAndReferences: [
      "Foa, E. B., & Kozak, M. J. (1986). Emotional processing of fear: Exposure to corrective information. Psychological Bulletin, 99(1), 20-35.",
      "Abramowitz, J. S., Deacon, B. J., & Whiteside, S. P. (2019). Exposure Therapy for Anxiety: Principles and Practice (2nd ed.). Guilford Press.",
    ],
  },

  // ==========================================
  // 8. DUYGU REGÜLASYONU & TRAVMA STABİLİZASYONU
  // ==========================================
  {
    id: "kelebek-kucaklamasi-butterfly-hug",
    title: "Kelebek Kucaklaması (Butterfly Hug) & İki Yönlü Uyarım",
    category: "duygu-regulasyon",
    categoryLabel: "Duygu Regülasyonu & Travma Stabilizasyonu",
    school: "Somatik & Travma Regülasyonu",
    pioneers: ["Lucina Artigas", "Francine Shapiro (EMDR)"],
    summary:
      "Yoğun duygusal taşma, travmatik tetiklenme veya panik anında ellerin göğüs üzerinde çaprazlanarak bilateral (iki yönlü) ritmik vuruşlar yapılmasıyla sinir sistemini yatıştıran otonomik regülasyon aracıdır.",
    targetSymptoms: [
      "Duygusal taşma ve kontrol edilemeyen ağlama krizleri",
      "Geçmiş travmatik bir anının aniden canlanması (Flashback)",
      "Aşırı uyarılmışlık (Hiper-arousal) ve sakinleşememe",
    ],
    mechanism:
      "Bilateral Beyin Stimülasyonu. Sağ ve sol yarıkürelere sırayla gönderilen dokunsal uyaranlar, beyindeki bilgi işleme mekanizmasını (AIP modeli) aktive eder ve parasempatik freni devreye sokar.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Kelebek Pozisyonu",
        counselorAction:
          "Kollar göğüs üzerinde çaprazlanır. Başparmaklar birbirine kenetlenerek kelebeğin gövdesi yapılır; parmak uçları köprücük kemiklerinin hemen altına yerleştirilir.",
      },
      {
        stepNumber: 2,
        title: "Ritmik Alternatif Vuruşlar",
        counselorAction:
          "Gözler kapatılır. Sağ el - Sol el - Sağ el - Sol el şeklinde kelebek kanadı gibi yumuşak ve ritmik (saniyede 1 vuruş) vuruşlar yapılır.",
      },
      {
        stepNumber: 3,
        title: "Nefes ve Gözlem",
        counselorAction:
          "Derin diyafram nefesi eşlik eder. 20-30 vuruşluk bir setten sonra durulur: 'Derin bir nefes al... Şimdi bedeninde ne olduğunu fark et.'",
      },
    ],
    counselorScript:
      "“Kollarını göğsünde çaprazla, parmaklarını köprücük kemiklerinin altına yerleştir. Sanki göğsünde bir kelebek konmuş gibi. Şimdi tıpkı kelebeğin kanat çırpması gibi sırayla sağ elinle ve sol elinle hafifçe vurmaya başla... Sağ, sol, sağ, sol... Bırak nefesin kendi ritminde aksın. Bu vuruşlar bedenine 'Buradasın, şu andasın ve güvendesin' mesajı veriyor.”",
    homeworkAndPractice:
      "Stresli veya kaygılı anlarda kendine şefkatli bir alan açmak için 2-3 dakikalık setler halinde uygulama.",
    cautionsAndContraindications: [
      "Vuruşlar çok sert veya çok hızlı olmamalıdır; amaç uyarmak değil, ritmik olarak ninnilemek ve yatıştırmaktır.",
    ],
    evidenceAndReferences: [
      "Artigas, L., & Jarero, I. (2014). The Butterfly Hug Method for Bilateral Stimulation. In M. Luber (Ed.), Implementing EMDR Early Mental Health Interventions for Man-Made and Natural Disasters. Springer Publishing.",
      "Shapiro, F. (2001). Eye Movement Desensitization and Reprocessing (EMDR): Basic Principles, Protocols, and Procedures (2nd ed.). Guilford Press.",
    ],
  },
  {
    id: "guvenli-yer-imgesi-safe-place",
    title: "Güvenli Yer İmgelemi & Duyusal Çapalama (Safe Place)",
    category: "duygu-regulasyon",
    categoryLabel: "Duygu Regülasyonu & Travma Stabilizasyonu",
    school: "Somatik & Travma Regülasyonu",
    pioneers: ["Francine Shapiro", "Babette Rothschild"],
    summary:
      "Danışanın zihninde tüm duyusal bileşenleriyle (görme, işitme, koku, sıcaklık) kurgulanan ve bedensel bir çapa ile sabitlenen güvenli bir içsel sığınak inşa etme protokolüdür.",
    targetSymptoms: [
      "Kendini hiçbir yerde güvende hissedememe",
      "Yoğun içsel kaos ve huzursuzluk",
      "Zorlu seans konularından sonra stabilizasyon ihtiyacı",
    ],
    mechanism:
      "Duyusal Kodlama ve Parasempatik Nöral Yolak Oluşturma. Zihin hayal edilen huzurlu sahneye ait duyusal uyaranları işlerken amigdala sakinleşir ve güven hormonu (oksitosin / endorfin) salgılanır.",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Güvenli Mekanın Seçimi",
        counselorAction:
          "Danışana sorun: 'Gözlerini kapattığında kendini en huzurlu, en sakin ve en güvende hissettiğin bir yer var mı? Gerçek bir yer olabilir (deniz kenarı, anneannenin bahçesi) ya da tamamen hayal ürünü bir mekan.'",
      },
      {
        stepNumber: 2,
        title: "Çoklu Duyu ile Güçlendirme",
        counselorAction:
          "Sorularla derinleştirin: 1) Görsel: 'Etrafta ne renkler var? Işık nasıl?', 2) İşitsel: 'Hangi sesleri duyuyorsun? Dalga sesi mi, rüzgar mı?', 3) Dokunsal: 'Hava sıcak mı serin mi? Tenine ne değiyor?', 4) Koku: 'Havadaki kokuyu alabiliyor musun?'",
      },
      {
        stepNumber: 3,
        title: "Bedensel Çapalama (Anchoring)",
        counselorAction:
          "Maksimum huzur anında: 'Bu hissi bedeninde nerede hissediyorsun? Göğsünde. Şimdi başparmağınla işaret parmağını birbirine bastır ve bu mekana tek bir kelime isim ver (Örn: 'Huzur'). Bu hissi o kelimeye ve dokunuşa mühürle.'",
      },
    ],
    counselorScript:
      "“Şimdi o güvenli yerindesin. Rüzgar tenini okşuyor, dalga sesleri kulaklarında... Bu mekan sadece sana ait. Dış dünyada ne olursa olsun, bu kapı her zaman sana açık. Şimdi bu huzuru göğsünün ortasında hisset ve parmaklarını birbirine bastırarak bu hissi bedenine kaydet. İhtiyacın olan her an tek bir nefesle bu güvenli limana geri dönebilirsin.”",
    homeworkAndPractice:
      "Günde 1 kez sakin bir ortamda güvenli yere gidip çapayı (parmak dokunuşu) tazelemek.",
    cautionsAndContraindications: [
      "Seçilen güvenli mekanın içinde geçmiş travmatik olaylarla bağlantılı unsurlar (örn. çocukluk odası ama orada istismar varsa) kesinlikle bulunmamalıdır.",
    ],
    evidenceAndReferences: [
      "Shapiro, F. (2001). Eye Movement Desensitization and Reprocessing (EMDR). Guilford Press.",
      "Rothschild, B. (2000). The Body Remembers: The Psychophysiology of Trauma and Trauma Treatment. W. W. Norton & Company.",
    ],
  },
];

export function getAllTechniques(): ClinicalTechnique[] {
  return CLINICAL_TECHNIQUES;
}

export function getTechniqueById(id: string): ClinicalTechnique | undefined {
  return CLINICAL_TECHNIQUES.find((t) => t.id === id);
}

export function filterTechniques(
  category?: ClinicalCategory | "all",
  school?: string | "all",
  searchQuery?: string
): ClinicalTechnique[] {
  return CLINICAL_TECHNIQUES.filter((tech) => {
    if (category && category !== "all" && tech.category !== category) {
      return false;
    }
    if (school && school !== "all" && tech.school !== school) {
      return false;
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = tech.title.toLowerCase().includes(q);
      const matchSummary = tech.summary.toLowerCase().includes(q);
      const matchMechanism = tech.mechanism.toLowerCase().includes(q);
      const matchPioneers = tech.pioneers.some((p) => p.toLowerCase().includes(q));
      const matchSymptoms = tech.targetSymptoms.some((s) => s.toLowerCase().includes(q));
      const matchSchool = tech.school.toLowerCase().includes(q);
      return matchTitle || matchSummary || matchMechanism || matchPioneers || matchSymptoms || matchSchool;
    }
    return true;
  });
}
