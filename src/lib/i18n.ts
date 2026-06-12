export type Locale = "tr" | "en";

export type Dictionary = {
  nav: {
    brand: string;
    about: string;
    services: string;
    process: string;
    whoFor: string;
    exams: string;
    faq: string;
    contact: string;
    appointment: string;
    lang: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: { free: string; whatsapp: string };
    stats: {
      experience: { num: string; label: string };
      clients: { num: string; label: string };
      specialties: { num: string; label: string };
      satisfaction: { num: string; label: string };
    };
    scroll: string;
  };
  about: {
    label: string;
    title: string;
    university: string;
    degree: string;
    para1: string;
    para2: string;
    features: string[];
    cta: string;
    cta2: string;
  };
  services: {
    label: string;
    title: string;
    subtitle: string;
    groups: Array<{
      key: string;
      eyebrow: string;
      heading: string;
      blurb: string;
      items: Array<{ title: string; desc: string; tag?: string }>;
    }>;
  };
  process: {
    label: string;
    title: string;
    subtitle: string;
    steps: Array<{ title: string; desc: string }>;
  };
  whoFor: {
    label: string;
    title: string;
    subtitle: string;
    profiles: Array<{ title: string; desc: string }>;
  };
  exams: {
    label: string;
    title: string;
    subtitle: string;
    cards: Array<{ title: string; content: string }>;
  };
  faq: {
    label: string;
    title: string;
    subtitle: string;
    items: Array<{ q: string; a: string }>;
  };
  contact: {
    label: string;
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    hours: string;
    hoursValue: string;
    form: {
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
      submit: string;
      success: string;
      placeholders: {
        name: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
      };
    };
  };
  footer: {
    brand: string;
    desc: string;
    services: string;
    servicesLinks: string[];
    about: string;
    aboutLinks: string[];
    contact: string;
    contactLinks: string[];
    copyright: string;
    privacy: string;
    terms: string;
    cookies: string;
  };
  cookie: {
    text: string;
    accept: string;
    reject: string;
    privacy: string;
  };
  theme: { light: string; dark: string };
  legal: {
    privacyTitle: string;
    privacyContent: string;
    termsTitle: string;
    termsContent: string;
    cookieTitle: string;
    cookieContent: string;
  };
  loading: string;
  whatsapp: string;
};

export const dictionaries: Record<Locale, Dictionary> = {
  tr: {
    nav: {
      brand: "Orhan Yaşlı",
      about: "Hakkımda",
      services: "Hizmetler",
      process: "Süreç",
      whoFor: "Kimler?",
      exams: "Sınavlar",
      faq: "S.S.S.",
      contact: "İletişim",
      appointment: "Randevu Al",
      lang: "EN",
    },
    hero: {
      badge: "Çanakkale ve Türkiye geneli online koçluk ve danışmanlık",
      title: "Sınava hazırlanan zihin,<br><em>iyi hisseden zihindir.</em>",
      subtitle: "Orhan Yaşlı ile sınav koçluğu, öğrenci koçluğu ve psikolojik danışmanlık. Rehberlik ve Psikolojik Danışmanlık altyapısıyla öğrencilere özel destek.",
      cta: { free: "Ücretsiz Ön Görüşme", whatsapp: "WhatsApp" },
      stats: {
        experience: { num: "3+", label: "Yıl Deneyim" },
        clients: { num: "200+", label: "Danışan" },
        specialties: { num: "8", label: "Uzmanlık Alanı" },
        satisfaction: { num: "%98", label: "Memnuniyet" },
      },
      scroll: "Keşfet",
    },
    about: {
      label: "Hakkımda",
      title: "Orhan Yaşlı<br>Koçluk ve Danışmanlık",
      university: "Muş Alparslan Üniversitesi",
      degree: "RPD Mezunu · 2022",
      para1: "Muş Alparslan Üniversitesi Rehberlik ve Psikolojik Danışmanlık bölümü mezunuyum. RPD altyapımı sınav koçluğu ve öğrenci koçluğu alanında da kullanarak, öğrencilere psikolojik temelli akademik destek sunuyorum.",
      para2: "Hâlihazırda Çanakkale'de bir okulda rehber öğretmen olarak görev yapmakta, aynı zamanda sınav koçluğu ve bireysel psikolojik danışmanlık hizmeti sunmaktayım.",
      features: [
        "Sınav Koçluğu",
        "Öğrenci Koçluğu",
        "Bireysel Danışmanlık",
        "Online Koçluk ve Danışmanlık",
        "Oyun Terapisi",
        "Sınav Kaygısı Yönetimi",
      ],
      cta: "Randevu Al",
      cta2: "Hizmetlerim",
    },
    services: {
      label: "Hizmetler",
      title: "İki alan,<br>tek amaç: <em>iyi olmak.</em>",
      subtitle: "Akademik destek ve psikolojik danışmanlık birbirinden ayrı yürütülen ama birbirini besleyen iki alandır. Hangi kapıdan girerseniz girin, bütüncül bir yaklaşımla karşılanırsınız.",
      groups: [
        {
          key: "academic",
          eyebrow: "Alan 01 — Akademik Destek",
          heading: "Sınava ve okula dair her şey",
          blurb: "Hedefi olan öğrenci için: plan, yöntem, takip ve motivasyon. Koçluk özel ders değildir; ders anlatmaz, nasıl çalışılacağını öğretir ve süreci yönetir.",
          items: [
            {
              title: "Sınav Koçluğu (YKS/LGS)",
              desc: "Hedef belirleme, kişiye özel çalışma programı, deneme analizleri ve motivasyon desteğiyle sınava hazırlık. Psikolojik altyapıyla desteklenmiş koçluk.",
              tag: "Öne Çıkan",
            },
            {
              title: "Öğrenci Koçluğu",
              desc: "Ders çalışma alışkanlıkları, zaman yönetimi, verimli öğrenme teknikleri ve motivasyon. Akademik başarıyı sürdürülebilir kılmak için birebir koçluk.",
            },
            {
              title: "Okul ve Akademik Danışmanlık",
              desc: "Öğrencilerin akademik, sosyal ve duygusal ihtiyaçlarını birlikte ele alan danışmanlık. Okul başarısını artırmayı ve genel yaşam kalitesini iyileştirmeyi hedefler.",
            },
            {
              title: "Kariyer Danışmanlığı",
              desc: "Bölüm ve meslek seçimi, ilgi-yetenek değerlendirmesi ve hedef planlaması. Sınav sonrası kararlar için yapılandırılmış destek.",
            },
            {
              title: "Özel Ders",
              desc: "İlkokuldan lise kademesine kadar, Çanakkale'de yüz yüze ve Türkiye genelinde online özel ders. Koçluktan ayrı, doğrudan ders anlatımı içeren hizmettir.",
              tag: "Yüz yüze + Online",
            },
          ],
        },
        {
          key: "counseling",
          eyebrow: "Alan 02 — Psikolojik Danışmanlık & Terapi",
          heading: "Zihne ve ilişkilere dair her şey",
          blurb: "RPD altyapısıyla yürütülen danışmanlık ve terapi çalışmaları. İlk görüşmede ihtiyaç birlikte değerlendirilir, size uygun yöntem ve plan birlikte belirlenir.",
          items: [
            {
              title: "Bireysel Danışma",
              desc: "Kaygı, stres yönetimi, özgüven ve yaşam dönüm noktaları üzerine birebir çalışma. Her seans, ihtiyaçlarınıza göre kişiselleştirilir.",
            },
            {
              title: "Sınav Kaygısı Yönetimi",
              desc: "Sınav kaygısına yönelik bilişsel teknikler, nefes egzersizleri ve psikolojik destek. Akademik koçlukla birlikte de yürütülebilir.",
              tag: "İki alanın kesişimi",
            },
            {
              title: "Bilişsel Davranışçı Yaklaşım (BDT)",
              desc: "Düşünce, duygu ve davranış arasındaki döngüleri fark edip değiştirmeye odaklanan, bilimsel olarak en çok araştırılmış yaklaşımlardan biri.",
            },
            {
              title: "Oyun Terapisi",
              desc: "Çocukların kendilerini en doğal yolla — oyunla — ifade etmesine dayanan çalışma. Duygusal ve davranışsal güçlüklerde çocuğa uygun bir destek yolu.",
              tag: "Çocuklar için",
            },
            {
              title: "Aile Danışmanlığı",
              desc: "Aile içi iletişim, ebeveynlik tutumları ve birlikte yaşanan güçlükler üzerine yapılandırılmış görüşmeler.",
            },
            {
              title: "Çift Danışmanlığı",
              desc: "İletişim örüntüleri, çatışma çözümü ve ilişkiyi güçlendirme odaklı ortak çalışma.",
            },
            {
              title: "Online Danışmanlık",
              desc: "Güvenli görüntülü görüşmeyle Türkiye'nin her yerinden erişim. Zaman, mekân veya ulaşım kısıtı olanlar için araştırmalarla desteklenen, esnek bir seçenek.",
              tag: "Türkiye geneli",
            },
          ],
        },
      ],
    },
    process: {
      label: "Çalışma Süreci",
      title: "Koçluk ve Danışmanlık Süreci<br>Nasıl İşler?",
      subtitle: "İlk adımdan itibaren sizi desteklemek için yapılandırılmış ve şeffaf bir süreç izliyoruz.",
      steps: [
        {
          title: "İlk İletişim",
          desc: "Formu doldurun ya da WhatsApp/Telegram'dan ulaşın. 24 saat içinde size dönüş yapılır.",
        },
        {
          title: "Ücretsiz Tanışma",
          desc: "20 dakikalık ücretsiz görüşme ile ihtiyaçlarınızı anlar, size en uygun koçluk veya danışmanlık planını belirleriz.",
        },
        {
          title: "Hedef Belirleme",
          desc: "Net, ölçülebilir hedefler koyar ve bu hedeflere ulaşmak için kişiye özel bir yol haritası çizeriz.",
        },
        {
          title: "Seans ve Takip",
          desc: "Düzenli seanslarla ilerleme kaydedilir, deneme analizleri yapılır ve hedeflere ulaşma süreci desteklenir.",
        },
      ],
    },
    whoFor: {
      label: "Kimler İçin?",
      title: "Sınav Koçluğu<br>Kimler İçin Uygun?",
      subtitle: "Her öğrencinin ihtiyacı farklıdır. Aşağıdaki profillerden birine uyuyorsanız koçluk desteği size göre.",
      profiles: [
        {
          title: '"Çalışıyorum Ama Olmuyor" Diyenler',
          desc: "Çok zaman harcayan ama deneme netlerini artıramayan, verimli ders çalışma yöntemlerini bilmeyen öğrenciler. Koçluk, çalışma alışkanlıklarınızı analiz edip stratejik bir plan oluşturur.",
        },
        {
          title: "Sınav Kaygısı Yaşayanlar",
          desc: "Bildiği konuları sınav anında yapamayan, panikleyen, potansiyelini gösteremeyen öğrenciler. BDT temelli teknikler ile kaygı yönetimi sağlanır.",
        },
        {
          title: "Zaman Yönetimi Sorunu Olanlar",
          desc: "Ders çalışmayı erteleyen, neye ne zaman çalışacağını bilemeyen, okul-kurs-sosyal hayat dengesini kuramayan öğrenciler.",
        },
        {
          title: "Motivasyon Kaybı Yaşayanlar",
          desc: "Birkaç denemede başarısız olunca pes eden, hedeflerini netleştiremeyen veya sınav maratonunda yorulan öğrenciler.",
        },
        {
          title: "Veli-Çocuk Çatışması Yaşayan Aileler",
          desc: '"Hadi ders çalış" demenin kavgaya dönüştüğü, ebeveynin denetleyici rolünden destekleyici role geçmek istediği aileler. Koç, bu üçgeni profesyonelce yöneterek iletişimi rahatlatır.',
        },
      ],
    },
    exams: {
      label: "Sınavlar",
      title: "2026 Sınav Takvimi ve<br>Sistem Rehberi",
      subtitle: "Güncel sınav tarihleri, başvuru bilgileri ve velilerin en çok merak ettiği sorular.",
      cards: [
        {
          title: "LGS 2026",
          content: `<p><strong>Sınav:</strong> 13 Haziran 2026 (Cumartesi)</p><p><strong>Başvuru:</strong> Mart sonu – Nisan ortası (e-Okul)</p><p><strong>Sonuç:</strong> 11 Temmuz 2026</p><p style="margin-top:8px;">İki oturum: Sözel (75 dk) + Sayısal (80 dk). İsteğe bağlı; sınavsız öğrenci alan liseler de mevcut.</p><p style="margin-top:8px;"><strong>Veliler merak ediyor:</strong></p><ul style="margin-top:6px;padding-left:16px;"><li><strong>Sınav zorunlu mu?</strong> Hayır, LGS isteğe bağlıdır. Sınavsız öğrenci alan liseler (yerel yerleştirme / adrese dayalı) da mevcuttur.</li><li><strong>Hangi okullar sınavla alıyor?</strong> Fen Liseleri, Sosyal Bilimler Liseleri, Proje Okulları ve bazı özel okulların burslu kontenjanları sınavla öğrenci alır.</li><li><strong>Kaç net kaç puana denk geliyor?</strong> LGS'de 3 yanlış 1 doğruyu götürür. Yaklaşık: 90 net → ~500 puan, 80 net → ~450 puan, 70 net → ~400 puan, 50 net → ~300 puan.</li></ul>`,
        },
        {
          title: "YKS 2026 (TYT – AYT – YDT)",
          content: `<p><strong>Başvuru:</strong> 6 Şubat – 2 Mart 2026</p><p><strong>TYT:</strong> 20 Haziran (Cts, 10:15, 165 dk)</p><p><strong>AYT:</strong> 21 Haziran (Paz, 10:15, 180 dk)</p><p><strong>YDT:</strong> 21 Haziran (Paz, 15:45, 120 dk)</p><p><strong>Sonuç:</strong> 22 Temmuz 2026</p><p style="margin-top:8px;">TYT herkes için zorunlu. AYT bölüme göre (Sözel/EA/Sayısal), YDT yabancı dil öğrencileri için.</p><p style="margin-top:8px;"><strong>Veliler merak ediyor:</strong></p><ul style="margin-top:6px;padding-left:16px;"><li><strong>Hangi bölüm için hangi oturum gerekli?</strong> TYT herkes için zorunlu. Sayısal (mühendislik, tıp) → TYT+AYT Fen-Mat. Eşit Ağırlık (hukuk, psikoloji, PDR) → TYT+AYT Mat-Edebiyat. Sözel (tarih, Türk dili) → TYT+AYT Edebiyat-Sosyal.</li><li><strong>Baraj kalktı mı?</strong> Evet, 2022'den itibaren TYT 150 ve AYT 180 puan barajı tamamen kalktı.</li><li><strong>Kaç netle nereye girilir?</strong> Tıp için ~100 net + AYT ~115 net. Hukuk için ~85 + ~70 (EA). PDR için ~75 + ~55 (EA).</li></ul>`,
        },
        {
          title: "MEB-AGS 2026",
          content: `<p><strong>Sınav:</strong> 12 Temmuz 2026 (Pazar)</p><p><strong>Başvuru:</strong> 8 – 20 Mayıs 2026</p><p><strong>Sonuç:</strong> 12 Ağustos 2026</p><p style="margin-top:8px;">2025'ten itibaren öğretmen atamalarında KPSS kalktı, yerine MEB-AGS geldi. AGS (80 soru) + ÖABT (50 soru). Mülakat kaldırıldı, tamamen puan üstünlüğü.</p><p style="margin-top:8px;"><strong>Veliler merak ediyor:</strong></p><ul style="margin-top:6px;padding-left:16px;"><li><strong>Öğretmen olmak için KPSS'ye mi AGS'ye mi girilmeli?</strong> Kesinlikle AGS'ye. KPSS artık yalnızca öğretmenlik dışı kamu personeli içindir.</li><li><strong>AGS puanı kaç yıl geçerli?</strong> Bir sonraki AGS sınav sonuçları açıklanana kadar geçerlidir.</li></ul>`,
        },
        {
          title: "KPSS 2026",
          content: `<p><strong>Lisans:</strong> Başvuru 1-13 Temmuz, Sınav 6 Eylül</p><p><strong>Ön Lisans:</strong> Başvuru 29 Temmuz-10 Ağustos, Sınav 4 Ekim</p><p><strong>Ortaöğretim:</strong> Başvuru 27 Ağustos-8 Eylül, Sınav 25 Ekim</p><p style="margin-top:8px;">KPSS artık yalnızca öğretmenlik dışı kamu personeli içindir.</p>`,
        },
        {
          title: "ALES / DGS 2026",
          content: `<p><strong>ALES/1:</strong> 5 Nisan 2026</p><p><strong>ALES/2:</strong> 6 Eylül 2026</p><p><strong>ALES/3:</strong> 15 Kasım 2026</p><p><strong>DGS:</strong> 28 Haziran 2026</p><p style="margin-top:8px;">ALES lisansüstü başvuruları, DGS ise ön lisanstan lisansa geçiş için gereklidir.</p>`,
        },
        {
          title: "Bilimsel Kanıtlı Çalışma Teknikleri",
          content: `<p>Eğitim bilimlerinde yüzlerce araştırmayla etkisi kanıtlanmış iki teknik:</p><ul style="margin-top:8px;padding-left:16px;"><li><strong>Aktif Hatırlama (Retrieval Practice):</strong> Konuyu tekrar tekrar okumak yerine kitabı kapatıp kendinize sorular sorun, hatırlamaya çalışın. Test çözmek de bu yüzden en güçlü öğrenme araçlarından biridir — sadece ölçmez, öğretir.</li><li><strong>Aralıklı Tekrar (Spaced Repetition):</strong> Bir konuyu tek seferde 3 saat çalışmak yerine 1+1+1 saat olarak günlere yayın. Unutmaya başladığınız anda yapılan tekrar, bilgiyi kalıcı hafızaya taşır.</li></ul><p style="margin-top:8px;">Bu ikisini birleştirin: konuyu çalışın → ertesi gün test çözün → 3 gün sonra tekrar test → 1 hafta sonra son tekrar.</p>`,
        },
        {
          title: "Verimli Çalışma Düzeni Nasıl Kurulur?",
          content: `<p>Araştırmaların önerdiği çalışma sırası:</p><ul style="margin-top:8px;padding-left:16px;"><li><strong>1. Önce hatırla:</strong> Yeni konuya başlamadan önce dünkü konuyu 5 dakika defter kapalı hatırlamaya çalışın.</li><li><strong>2. Odaklı bloklar:</strong> 25-40 dakika kesintisiz çalışma + 5-10 dakika mola (Pomodoro). Telefon başka odada — görüş alanında olması bile dikkati böler.</li><li><strong>3. Karıştırarak çalışın (Interleaving):</strong> 3 saat boyunca tek ders yerine matematik → fen → matematik gibi dönüşümlü çalışmak, sınavda soru tipini tanıma becerisini güçlendirir.</li><li><strong>4. Anlat ve öğren (Feynman Tekniği):</strong> Konuyu bir arkadaşınıza ya da kendinize basit cümlelerle anlatın. Anlatamadığınız yer, tam olarak çalışmanız gereken yerdir.</li></ul><p style="margin-top:8px;"><strong>Unutmayın:</strong> 7-9 saat uyku öğrenmenin parçasıdır — beyin, bilgiyi uykuda kalıcı hale getirir. Sınav öncesi gece sabahlamak net kaybettirir.</p>`,
        },
      ],
    },
    faq: {
      label: "S.S.S.",
      title: "Sıkça Sorulan Sorular",
      subtitle: "Koçluk ve danışmanlık hakkında en çok merak edilenleri yanıtlıyorum.",
      items: [
        {
          q: "Koçluk ile psikolojik danışmanlık arasındaki fark nedir?",
          a: "Koçluk, hedef odaklıdır ve genellikle akademik başarı, sınav hazırlığı, zaman yönetimi gibi konulara odaklanır. Psikolojik danışmanlık ise ruh sağlığı odaklıdır; kaygı, depresyon, özgüven gibi konularda daha derinlemesine çalışma gerektirir. RPD mezunu olarak her iki alanda da hizmet verebiliyorum.",
        },
        {
          q: "Seanslar ne kadar sürer?",
          a: "Koçluk seansları genellikle 45-50 dakika, psikolojik danışmanlık seansları ise 50 dakikadır. İlk görüşme (ücretsiz tanışma) yaklaşık 20 dakikadır.",
        },
        {
          q: "Online koçluk yüz yüze kadar etkili mi?",
          a: "Evet, araştırmalar online koçluğun yüz yüze koçluk kadar etkili olduğunu göstermektedir. Özellikle program ve hedef takibi gibi konularda online çalışma çok verimlidir.",
        },
        {
          q: "Kaç seansta sonuç alabilirim?",
          a: "Kişiden kişiye değişmekle birlikte, düzenli koçluk seanslarıyla 4-6 hafta içinde çalışma alışkanlıklarında belirgin değişim gözlemlenebilir.",
        },
        {
          q: "Hangi sınavlara hazırlık için koçluk veriyorsunuz?",
          a: "YKS (TYT-AYT), LGS, KPSS, AGS, ALES, DGS ve ara sınıflara yönelik düzenli ders çalışma koçluğu hizmeti veriyorum.",
        },
        {
          q: "Seans ücretleri nedir?",
          a: "Ücretler seans türüne ve pakete göre değişmektedir. En güncel bilgi için iletişim formu üzerinden bana ulaşabilirsiniz.",
        },
        {
          q: "Psikolojik danışmanlık gizli midir?",
          a: "Evet, tüm görüşmeler etik kurallar çerçevesinde tamamen gizlidir. Kişisel bilgileriniz üçüncü kişilerle paylaşılmaz.",
        },
        {
          q: "İlk görüşme gerçekten ücretsiz mi?",
          a: "Evet, ilk tanışma görüşmesi tamamen ücretsizdir. Bu görüşmede ihtiyaçlarınızı anlar, size en uygun çalışma planını belirleriz.",
        },
      ],
    },
    contact: {
      label: "İletişim",
      title: "Bana Ulaşın",
      subtitle: "Randevu almak veya sorularınız için benimle iletişime geçebilirsiniz.",
      email: "Pskdanorhanyasli@proton.me",
      phone: "+90 (543) 250 04 17",
      location: "Çanakkale, Türkiye",
      hours: "Çalışma Saatleri",
      hoursValue: "Hafta içi ve Cumartesi: 09:00 - 19:00",
      form: {
        name: "Adınız Soyadınız",
        email: "E-posta Adresiniz",
        phone: "Telefon Numaranız",
        subject: "Konu",
        message: "Mesajınız",
        submit: "Mesajı Gönder",
        success: "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.",
        placeholders: {
          name: "Adınız ve soyadınız",
          email: "ornek@mail.com",
          phone: "05XX XXX XX XX",
          subject: "Görüşmek istediğiniz konu",
          message: "Mesajınızı buraya yazın...",
        },
      },
    },
    footer: {
      brand: "Orhan Yaşlı",
      desc: "Sınav koçluğu, öğrenci koçluğu ve psikolojik danışmanlık alanında profesyonel destek.",
      services: "Hizmetler",
      servicesLinks: ["Sınav Koçluğu", "Öğrenci Koçluğu", "Sınav Kaygısı Yönetimi", "Online Koçluk", "Oyun Terapisi"],
      about: "Kurumsal",
      aboutLinks: ["Hakkımda", "S.S.S.", "Gizlilik Politikası"],
      contact: "İletişim",
      contactLinks: ["E-posta", "Telefon", "WhatsApp", "Telegram"],
      copyright: "© 2026 Orhan Yaşlı. Tüm hakları saklıdır.",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Koşulları",
      cookies: "Çerez Politikası",
    },
    cookie: {
      text: "Bu site, deneyiminizi iyileştirmek için çerezler kullanmaktadır.",
      accept: "Kabul Et",
      reject: "Reddet",
      privacy: "Gizlilik Politikası",
    },
    theme: { light: "Açık Tema", dark: "Koyu Tema" },
    legal: {
      privacyTitle: "Gizlilik Politikası",
      privacyContent:
        "Bu gizlilik politikası, Orhan Yaşlı Koçluk ve Danışmanlık olarak kişisel verilerinizin işlenmesi ve korunmasına ilişkin esasları belirlemektedir. Kişisel verileriniz, iletişim formu aracılığıyla tarafımıza iletilen ad, soyad, e-posta adresi, telefon numarası ve mesaj içeriğinden oluşmaktadır. Bu veriler yalnızca size hizmet verebilmek, randevu oluşturmak ve danışmanlık sürecini yürütebilmek amacıyla işlenmektedir. Verileriniz üçüncü kişilerle paylaşılmamakta, yalnızca yasal yükümlülükler gerektiğinde yetkili mercilere aktarılabilmektedir. Verileriniz, hizmet ilişkimiz devam ettiği sürece ve yasal saklama süreleri boyunca muhafaza edilmektedir. KVKK kapsamında verilerinize erişme, düzeltme, silme ve işleme amaçlarına ilişkin bilgi talep etme hakkına sahipsiniz. Talepleriniz için Pskdanorhanyasli@proton.me adresinden bize ulaşabilirsiniz.",
      termsTitle: "Kullanım Koşulları",
      termsContent:
        "Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Bu sitede yer alan tüm içerik bilgilendirme amaçlıdır ve kesin bir taahhüt niteliği taşımaz. Hizmetlerimizle ilgili en güncel bilgi için doğrudan iletişime geçilmesi önerilir. Web sitesi içeriğinde yer alan bilgilerin doğruluğu konusunda azami özen gösterilmekle birlikte, herhangi bir hata veya eksiklikten sorumlu tutulamaz. Sitede yer alan bağlantılar yalnızca kullanıcı kolaylığı için sağlanmıştır; bağlantı verilen sitelerin içeriğinden sorumlu değiliz. Hizmet bedelleri ve paket içerikleri önceden haber verilmeksizin değiştirilebilir.",
      cookieTitle: "Çerez Politikası",
      cookieContent:
        "Bu web sitesi, kullanıcı deneyimini iyileştirmek ve site trafiğini analiz etmek amacıyla çerezler kullanmaktadır. Çerezler, tarayıcınız tarafından cihazınızda depolanan küçük metin dosyalarıdır. Site yalnızca zorunlu teknik çerezler ve analitik çerezler kullanmaktadır. Kişisel veri toplayan reklam veya izleme çerezleri kullanılmamaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilir veya silebilirsiniz; ancak bu durumda site işlevselliğinde kısmi azalma olabilir.",
    },
    loading: "Orhan Yaşlı",
    whatsapp: "WhatsApp'tan yazın",
  },

  en: {
    nav: {
      brand: "Orhan Yaşlı",
      about: "About",
      services: "Services",
      process: "Process",
      whoFor: "Who?",
      exams: "Exams",
      faq: "FAQ",
      contact: "Contact",
      appointment: "Book Now",
      lang: "TR",
    },
    hero: {
      badge: "Online coaching & counseling across Turkey",
      title: "A mind preparing for exams<br>is a mind that <em>feels well.</em>",
      subtitle: "Exam coaching, student coaching and psychological counseling with Orhan Yaşlı. Personalized support with a Guidance & Psychological Counseling background.",
      cta: { free: "Free Consultation", whatsapp: "WhatsApp" },
      stats: {
        experience: { num: "3+", label: "Years Experience" },
        clients: { num: "200+", label: "Clients" },
        specialties: { num: "8", label: "Specialties" },
        satisfaction: { num: "98%", label: "Satisfaction" },
      },
      scroll: "Explore",
    },
    about: {
      label: "About Me",
      title: "Orhan Yaşlı<br>Coaching & Counseling",
      university: "Muş Alparslan University",
      degree: "PGR Graduate · 2022",
      para1: "I graduated from Muş Alparslan University, Guidance and Psychological Counseling department. I use my PGR background in exam coaching and student coaching to provide psychology-based academic support.",
      para2: "I currently work as a guidance counselor at a school in Çanakkale, while also providing exam coaching and individual psychological counseling services.",
      features: [
        "Exam Coaching",
        "Student Coaching",
        "Individual Counseling",
        "Online Coaching & Counseling",
        "Play Therapy",
        "Exam Anxiety Management",
      ],
      cta: "Book Appointment",
      cta2: "My Services",
    },
    services: {
      label: "Services",
      title: "Two domains,<br>one goal: <em>wellbeing.</em>",
      subtitle: "Academic support and psychological counseling are two distinct but mutually reinforcing domains. Whichever door you enter through, you are met with a holistic approach.",
      groups: [
        {
          key: "academic",
          eyebrow: "Domain 01 — Academic Support",
          heading: "Everything about exams and school",
          blurb: "For students with a goal: planning, method, follow-up and motivation. Coaching is not tutoring; it does not teach the subject — it teaches how to study and manages the process.",
          items: [
            {
              title: "Exam Coaching (YKS/LGS)",
              desc: "Exam preparation through goal setting, personalized study plans, mock exam analysis, and motivational support. Coaching backed by psychological expertise.",
              tag: "Featured",
            },
            {
              title: "Student Coaching",
              desc: "Study habits, time management, effective learning techniques, and motivation. One-on-one coaching for sustainable academic success.",
            },
            {
              title: "School & Academic Counseling",
              desc: "Counseling that addresses students' academic, social and emotional needs together, aiming to improve school success and overall quality of life.",
            },
            {
              title: "Career Counseling",
              desc: "Field and career choice, interest-aptitude assessment and goal planning. Structured support for post-exam decisions.",
            },
            {
              title: "Private Tutoring",
              desc: "From primary to high school level — in person in Çanakkale, online across Turkey. A separate service from coaching, involving direct subject teaching.",
              tag: "In person + Online",
            },
          ],
        },
        {
          key: "counseling",
          eyebrow: "Domain 02 — Counseling & Therapy",
          heading: "Everything about the mind and relationships",
          blurb: "Counseling and therapeutic work grounded in a Guidance & Psychological Counseling background. In the first session we assess your needs together and agree on the right approach and plan.",
          items: [
            {
              title: "Individual Counseling",
              desc: "One-on-one work on anxiety, stress management, self-confidence and life transitions. Every session is personalized to your needs.",
            },
            {
              title: "Exam Anxiety Management",
              desc: "Cognitive techniques, breathing exercises and psychological support for exam anxiety. Can run alongside academic coaching.",
              tag: "Where both domains meet",
            },
            {
              title: "Cognitive Behavioral Approach (CBT)",
              desc: "Focuses on noticing and changing the loops between thoughts, feelings and behavior — one of the most extensively researched approaches.",
            },
            {
              title: "Play Therapy",
              desc: "Built on children's most natural form of expression — play. A child-appropriate path of support for emotional and behavioral difficulties.",
              tag: "For children",
            },
            {
              title: "Family Counseling",
              desc: "Structured sessions on family communication, parenting attitudes and shared difficulties.",
            },
            {
              title: "Couples Counseling",
              desc: "Joint work focused on communication patterns, conflict resolution and strengthening the relationship.",
            },
            {
              title: "Online Counseling",
              desc: "Accessible from anywhere in Turkey via secure video sessions. A flexible, research-supported option for those with time, location or mobility constraints.",
              tag: "Across Turkey",
            },
          ],
        },
      ],
    },
    process: {
      label: "Our Process",
      title: "How Does the<br>Process Work?",
      subtitle: "We follow a structured and transparent process to support you from the first step.",
      steps: [
        {
          title: "First Contact",
          desc: "Fill out the form or reach out via WhatsApp/Telegram. We'll get back to you within 24 hours.",
        },
        {
          title: "Free Meeting",
          desc: "A 20-minute free consultation to understand your needs and determine the best coaching or counseling plan for you.",
        },
        {
          title: "Goal Setting",
          desc: "We set clear, measurable goals and draw a personalized roadmap to achieve them.",
        },
        {
          title: "Session & Follow-up",
          desc: "Regular sessions track progress, analyze mock exams, and support the journey toward your goals.",
        },
      ],
    },
    whoFor: {
      label: "Who Is It For?",
      title: "Exam Coaching<br>Who Is It Suitable For?",
      subtitle: "Every student's needs are different. If one of these profiles sounds like you, coaching support might be right.",
      profiles: [
        {
          title: '"I Study But It Doesn\'t Work"',
          desc: "Students who spend a lot of time but can't improve their mock exam scores, who don't know effective study methods. Coaching analyzes your habits and creates a strategic plan.",
        },
        {
          title: "Those Experiencing Exam Anxiety",
          desc: "Students who know the material but freeze during exams, who can't show their potential. CBT-based techniques help manage anxiety.",
        },
        {
          title: "Those with Time Management Issues",
          desc: "Students who procrastinate, don't know what to study when, who can't balance school and social life.",
        },
        {
          title: "Those Losing Motivation",
          desc: "Students who give up after a few failures, can't clarify goals, or get tired during the exam marathon.",
        },
        {
          title: "Families Experiencing Parent-Child Conflict",
          desc: 'Families where "go study" turns into arguments, where parents want to shift from controller to supporter.',
        },
      ],
    },
    exams: {
      label: "Exams",
      title: "2026 Exam Calendar &<br>System Guide",
      subtitle: "Current exam dates, application info, and the most frequently asked questions.",
      cards: [
        {
          title: "LGS 2026",
          content: `<p><strong>Exam:</strong> June 13, 2026 (Saturday)</p><p><strong>Application:</strong> Late March – Mid April</p><p><strong>Results:</strong> July 11, 2026</p><p style="margin-top:8px;">Two sessions: Verbal (75 min) + Numeric (80 min). Optional; schools without exam admission also exist.</p>`,
        },
        {
          title: "YKS 2026 (TYT – AYT – YDT)",
          content: `<p><strong>Application:</strong> Feb 6 – Mar 2, 2026</p><p><strong>TYT:</strong> June 20 (Sat, 10:15, 165 min)</p><p><strong>AYT:</strong> June 21 (Sun, 10:15, 180 min)</p><p><strong>Results:</strong> July 22, 2026</p><p style="margin-top:8px;">TYT is mandatory for everyone. AYT varies by department.</p>`,
        },
        {
          title: "MEB-AGS 2026",
          content: `<p><strong>Exam:</strong> July 12, 2026 (Sunday)</p><p><strong>Application:</strong> May 8 – May 20, 2026</p><p><strong>Results:</strong> August 12, 2026</p><p style="margin-top:8px;">From 2025 onward, KPPS is replaced by MEB-AGS for teacher appointments.</p>`,
        },
        {
          title: "KPSS 2026",
          content: `<p><strong>Bachelor's:</strong> Application Jul 1-13, Exam Sep 6</p><p><strong>Associate:</strong> Application Jul 29-Aug 10, Exam Oct 4</p><p><strong>Secondary:</strong> Application Aug 27-Sep 8, Exam Oct 25</p>`,
        },
        {
          title: "ALES / DGS 2026",
          content: `<p><strong>ALES/1:</strong> April 5, 2026</p><p><strong>ALES/2:</strong> September 6, 2026</p><p><strong>ALES/3:</strong> November 15, 2026</p><p><strong>DGS:</strong> June 28, 2026</p>`,
        },
        {
          title: "Evidence-Based Study Techniques",
          content: `<p>Two techniques proven by hundreds of studies in learning science:</p><ul style="margin-top:8px;padding-left:16px;"><li><strong>Active Recall (Retrieval Practice):</strong> Instead of re-reading, close the book and quiz yourself. Practice tests don't just measure learning — they create it.</li><li><strong>Spaced Repetition:</strong> Spread 3 hours of study across several days instead of one sitting. Reviewing just as you start to forget moves knowledge into long-term memory.</li></ul><p style="margin-top:8px;">Combine them: study → quiz yourself next day → again after 3 days → final review after a week.</p>`,
        },
        {
          title: "How to Structure an Effective Study Session",
          content: `<p>The order research recommends:</p><ul style="margin-top:8px;padding-left:16px;"><li><strong>1. Recall first:</strong> Before new material, spend 5 minutes recalling yesterday's topic with the notebook closed.</li><li><strong>2. Focused blocks:</strong> 25-40 minutes of uninterrupted work + a 5-10 minute break (Pomodoro). Phone in another room — even seeing it splits attention.</li><li><strong>3. Interleave subjects:</strong> Alternating math → science → math beats 3 hours of a single subject and builds problem-type recognition.</li><li><strong>4. Teach it (Feynman Technique):</strong> Explain the topic in simple words. Wherever you get stuck is exactly what to study next.</li></ul><p style="margin-top:8px;"><strong>Remember:</strong> 7-9 hours of sleep is part of learning — the brain consolidates knowledge during sleep. All-nighters before exams cost points.</p>`,
        },
      ],
    },
    faq: {
      label: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Answering the most common questions about coaching and counseling.",
      items: [
        {
          q: "What is the difference between coaching and psychological counseling?",
          a: "Coaching is goal-oriented and focuses on academic success, exam preparation, time management. Psychological counseling is mental health-focused, dealing with anxiety, depression, self-esteem. As a PGR graduate, I can serve in both areas.",
        },
        {
          q: "How long are the sessions?",
          a: "Coaching sessions are 45-50 minutes, counseling sessions are 50 minutes. The first free meeting is about 20 minutes.",
        },
        {
          q: "Is online coaching as effective as in-person?",
          a: "Yes, research shows online coaching is as effective as in-person. Especially for program and goal tracking, online work is very productive.",
        },
        {
          q: "How many sessions until I see results?",
          a: "It varies by individual, but with regular sessions you can see changes in study habits within 4-6 weeks.",
        },
        {
          q: "Which exams do you provide coaching for?",
          a: "YKS (TYT-AYT), LGS, KPSS, AGS, ALES, DGS and regular study coaching for intermediate grades.",
        },
        {
          q: "What are the session fees?",
          a: "Fees vary by session type and package. Please contact me via the form for the most current information.",
        },
        {
          q: "Is psychological counseling confidential?",
          a: "Yes, all sessions are completely confidential within ethical guidelines. Your information is never shared with third parties.",
        },
        {
          q: "Is the first meeting really free?",
          a: "Yes, the first consultation meeting is completely free. We'll understand your needs and determine the best plan.",
        },
      ],
    },
    contact: {
      label: "Contact",
      title: "Get In Touch",
      subtitle: "Contact me to book an appointment or ask your questions.",
      email: "Pskdanorhanyasli@proton.me",
      phone: "+90 (543) 250 04 17",
      location: "Çanakkale, Turkey",
      hours: "Working Hours",
      hoursValue: "Weekdays & Saturday: 09:00 - 19:00",
      form: {
        name: "Your Full Name",
        email: "Your Email",
        phone: "Your Phone Number",
        subject: "Subject",
        message: "Your Message",
        submit: "Send Message",
        success: "Your message has been sent successfully! I will get back to you as soon as possible.",
        placeholders: {
          name: "Your full name",
          email: "example@mail.com",
          phone: "+90 XXX XXX XX XX",
          subject: "Subject you want to discuss",
          message: "Write your message here...",
        },
      },
    },
    footer: {
      brand: "Orhan Yaşlı",
      desc: "Professional support in exam coaching, student coaching, and psychological counseling.",
      services: "Services",
      servicesLinks: ["Exam Coaching", "Student Coaching", "Exam Anxiety Management", "Online Coaching", "Play Therapy"],
      about: "Company",
      aboutLinks: ["About Me", "FAQ", "Privacy Policy"],
      contact: "Contact",
      contactLinks: ["Email", "Phone", "WhatsApp", "Telegram"],
      copyright: "© 2026 Orhan Yaşlı. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      cookies: "Cookie Policy",
    },
    cookie: {
      text: "This site uses cookies to improve your experience.",
      accept: "Accept",
      reject: "Reject",
      privacy: "Privacy Policy",
    },
    theme: { light: "Light Theme", dark: "Dark Theme" },
    legal: {
      privacyTitle: "Privacy Policy",
      privacyContent:
        "This privacy policy sets out the principles regarding the processing and protection of your personal data by Orhan Yaşlı Coaching and Counseling. Your personal data consists of your name, surname, email address, phone number, and message content submitted through the contact form. This data is processed solely to serve you, schedule appointments, and conduct the counseling process. Your data is not shared with third parties and may only be transferred to authorized authorities when required by legal obligations. Your data is retained for the duration of our service relationship and legal retention periods. Under the relevant data protection law, you have the right to access, correct, delete your data, and request information about processing purposes. You can reach us at Pskdanorhanyasli@proton.me for your requests.",
      termsTitle: "Terms of Use",
      termsContent:
        "By using this website, you agree to the following terms of use. All content on this site is for informational purposes only and does not constitute a binding commitment. It is recommended to contact us directly for the most current information about our services. While we exercise maximum care regarding the accuracy of the information on the website, we cannot be held responsible for any errors or omissions. Links on the site are provided for user convenience only; we are not responsible for the content of linked sites. Service fees and package contents may be changed without prior notice.",
      cookieTitle: "Cookie Policy",
      cookieContent:
        "This website uses cookies to improve user experience and analyze site traffic. Cookies are small text files stored on your device by your browser. The site only uses essential technical cookies and analytical cookies. No advertising or tracking cookies that collect personal data are used. You can disable or delete cookies from your browser settings; however, this may result in partial reduction of site functionality.",
    },
    loading: "Orhan Yaşlı",
    whatsapp: "Message on WhatsApp",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
