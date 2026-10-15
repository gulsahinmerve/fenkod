import { ScienceQuestion, ScienceTopic } from '../types/game';

export const INITIAL_QUESTIONS: ScienceQuestion[] = [
  // ==========================================
  // 1. GÜNEŞ SİSTEMİ & GEZEGENLER (1-16)
  // ==========================================
  {
    id: 'q_gs_01',
    topic: 'gunes_sistemi',
    topicTitle: 'Güneş Sistemi',
    gradeLevel: 6,
    questionText: 'Güneş Sistemi’nde Güneş’e en yakın ve aynı zamanda en küçük gezegen hangisidir?',
    options: ['Merkür', 'Venüs', 'Mars', 'Jüpiter'],
    correctIndex: 0,
    explanation: 'Merkür, Güneş’e en yakın (ortalama 58 milyon km) ve sistemdeki en küçük gezegendir.',
    isActive: true
  },
  {
    id: 'q_gs_02',
    topic: 'gezegenler',
    topicTitle: 'Gezegenler',
    gradeLevel: 6,
    questionText: 'Güneş Sistemi’nin en büyük gezegeni olup yüzeyinde devasa "Büyük Kırmızı Leke" fırtınası bulunan gezegen hangisidir?',
    options: ['Satürn', 'Neptün', 'Jüpiter', 'Uranüs'],
    correctIndex: 2,
    explanation: 'Jüpiter hem kütlece hem de hacimce en büyük gaz devidir. Büyük Kırmızı Leke yüzyıllardır süren dev bir fırtınadır.',
    isActive: true
  },
  {
    id: 'q_gs_03',
    topic: 'gezegenler',
    topicTitle: 'Gezegenler',
    gradeLevel: 6,
    questionText: 'Aşağıdakilerden hangisi "İç (Karasal) Gezegenler" grubunda yer ALMAZ?',
    options: ['Merkür', 'Venüs', 'Mars', 'Satürn'],
    correctIndex: 3,
    explanation: 'İç (karasal) gezegenler: Merkür, Venüs, Dünya ve Mars’tır. Satürn ise bir dış (gaz devidir).',
    isActive: true
  },
  {
    id: 'q_gs_04',
    topic: 'gezegenler',
    topicTitle: 'Gezegenler',
    gradeLevel: 6,
    questionText: 'Güneş Sistemi’nde yoğun karbondioksit atmosferi nedeniyle sera etkisi en yüksek ve en sıcak gezegen hangisidir?',
    options: ['Merkür', 'Venüs', 'Dünya', 'Mars'],
    correctIndex: 1,
    explanation: 'Venüs, yoğun karbondioksit gazından oluşan kalın atmosferi sebebiyle yaklaşık 465°C ile sistemin en sıcak gezegenidir.',
    isActive: true
  },
  {
    id: 'q_gs_05',
    topic: 'gezegenler',
    topicTitle: 'Gezegenler',
    gradeLevel: 6,
    questionText: 'Yüzeyindeki yoğun demir oksit (pas) tozu nedeniyle "Kızıl Gezegen" olarak adlandırılan gezegen hangisidir?',
    options: ['Mars', 'Merkür', 'Jüpiter', 'Satürn'],
    correctIndex: 0,
    explanation: 'Mars toprağındaki demir oksit nedeniyle kırmızı-turuncu bir görünüme sahiptir ve Kızıl Gezegen olarak bilinir.',
    isActive: true
  },
  {
    id: 'q_gs_06',
    topic: 'gunes_sistemi',
    topicTitle: 'Güneş Sistemi',
    gradeLevel: 6,
    questionText: 'Güneş Sistemi’nde Mars ile Jüpiter yörüngeleri arasında yoğun olarak yer alan gök cisimleri kuşağına ne ad verilir?',
    options: ['Oort Bulutu', 'Asteroit Kuşağı', 'Kuiper Kuşağı', 'Kuyruklu Yıldız Kuşağı'],
    correctIndex: 1,
    explanation: 'İç gezegenler ile dış gezegenler sınırında, Mars ve Jüpiter arasında Asteroit Kuşağı yer alır.',
    isActive: true
  },
  {
    id: 'q_gs_07',
    topic: 'gezegenler',
    topicTitle: 'Gezegenler',
    gradeLevel: 6,
    questionText: 'Görkemli ve belirgin halkalarıyla tanınan, Güneş’e yakınlık sıralamasında 6. sırada yer alan gezegen hangisidir?',
    options: ['Uranüs', 'Satürn', 'Neptün', 'Jüpiter'],
    correctIndex: 1,
    explanation: 'Satürn, buz ve kaya parçacıklarından oluşan eşsiz halka sistemi ile ünlüdür.',
    isActive: true
  },
  {
    id: 'q_gs_08',
    topic: 'gezegenler',
    topicTitle: 'Gezegenler',
    gradeLevel: 6,
    questionText: 'Yaklaşık 98 derecelik eksen eğikliği nedeniyle yörüngesinde yuvarlanan bir varil gibi yan yatmış şekilde dönen gezegen hangisidir?',
    options: ['Uranüs', 'Neptün', 'Mars', 'Venüs'],
    correctIndex: 0,
    explanation: 'Uranüs aşırı eksen eğikliği nedeniyle yörüngesinde yuvarlanan bir fıçı/varil gibi döner.',
    isActive: true
  },
  {
    id: 'q_gs_09',
    topic: 'gezegenler',
    topicTitle: 'Gezegenler',
    gradeLevel: 6,
    questionText: 'Güneş Sistemi’nin Güneş’e en uzak olan 8. gezegeni aşağıdakilerden hangisidir?',
    options: ['Uranüs', 'Neptün', 'Plüton', 'Satürn'],
    correctIndex: 1,
    explanation: 'Neptün 8. gezegendir ve Güneş Sistemi’nin en dış gezegenidir (Plüton cüce gezegen sınıfındadır).',
    isActive: true
  },
  {
    id: 'q_gs_10',
    topic: 'gunes_sistemi',
    topicTitle: 'Güneş Sistemi',
    gradeLevel: 6,
    questionText: 'Güneş Sistemi’nde doğal uydusu ve halkası BULUNMAYAN iki gezegen hangileridir?',
    options: ['Merkür ve Venüs', 'Dünya ve Mars', 'Mars ve Jüpiter', 'Venüs ve Mars'],
    correctIndex: 0,
    explanation: 'Güneş Sistemi’nde uydusu olmayan tek gezegenler Merkür ve Venüs’tür.',
    isActive: true
  },
  {
    id: 'q_gs_11',
    topic: 'gunes_sistemi',
    topicTitle: 'Güneş Sistemi',
    gradeLevel: 6,
    questionText: 'Dünya atmosferine girdiğinde sürtünmeyle ısınıp parlayan ve halk arasında "yıldız kayması" olarak bilinen olaya neden olan gök cismine ne ad verilir?',
    options: ['Kuyruklu Yıldız', 'Meteor', 'Gezegen', 'Süpernova'],
    correctIndex: 1,
    explanation: 'Atmosfere girip akkor hâline gelen gök cisimlerine meteor denir.',
    isActive: true
  },
  {
    id: 'q_gs_12',
    topic: 'gezegenler',
    topicTitle: 'Gezegenler',
    gradeLevel: 6,
    questionText: 'Aşağıdakilerden hangisi dış (gazsal) gezegenlerin ortak bir özelliğidir?',
    options: [
      'Katı taşlı yüzeye sahip olmaları',
      'Hepsinde irili ufaklı halkaların bulunması',
      'Güneş’e Dünya’dan daha yakın olmaları',
      'Hiçbirinin uydusunun olmaması'
    ],
    correctIndex: 1,
    explanation: 'Dış gezegenlerin (Jüpiter, Satürn, Uranüs, Neptün) tümünde halka sistemleri ve çok sayıda uydu bulunur.',
    isActive: true
  },
  {
    id: 'q_gs_13',
    topic: 'gezegenler',
    topicTitle: 'Gezegenler',
    gradeLevel: 6,
    questionText: 'Güneş Sistemi’ndeki gezegenlerin çoğu batıdan doğuya dönerken, saat yönünde (doğudan batıya) ters dönen gezegen hangisidir?',
    options: ['Venüs', 'Dünya', 'Mars', 'Neptün'],
    correctIndex: 0,
    explanation: 'Venüs (ve ekseni yatık olan Uranüs) diğer gezegenlerin tersi yönünde döner.',
    isActive: true
  },
  {
    id: 'q_gs_14',
    topic: 'gunes_sistemi',
    topicTitle: 'Güneş Sistemi',
    gradeLevel: 6,
    questionText: 'Güneş Sistemi’nde üzerinde yaşam olduğu bilinen tek gezegen ve tek uydusu Ay olan gök cismi hangisidir?',
    options: ['Mars', 'Dünya', 'Venüs', 'Merkür'],
    correctIndex: 1,
    explanation: 'Dünya, atmosferi ve sıvı suyu ile yaşama elverişli tek gezegendir ve uydusu Ay’dır.',
    isActive: true
  },
  {
    id: 'q_gs_15',
    topic: 'gunes_sistemi',
    topicTitle: 'Güneş Sistemi',
    gradeLevel: 6,
    questionText: 'Donmuş gaz, toz ve buzdan oluşan, Güneş’e yaklaştığında arkasında parlayan bir kuyruk beliren gök cismine ne ad verilir?',
    options: ['Kuyruklu Yıldız', 'Meteorit', 'Asteroit', 'Cüce Gezegen'],
    correctIndex: 0,
    explanation: 'Kuyruklu yıldızlar "kirli kartopu" olarak da bilinir; Güneş ısısıyla süblimleşerek gaz ve toz kuyruğu oluştururlar.',
    isActive: true
  },
  {
    id: 'q_gs_16',
    topic: 'gunes_sistemi',
    topicTitle: 'Güneş Sistemi',
    gradeLevel: 6,
    questionText: 'Güneş Sistemi’nin merkezinde bulunan ve sistemin kütlesinin yaklaşık %99.8’ini oluşturan gök cismi hangisidir?',
    options: ['Jüpiter', 'Güneş', 'Samanyolu', 'Kutup Yıldızı'],
    correctIndex: 1,
    explanation: 'Güneş, sistemimizin merkezindeki orta büyüklükte bir yıldızdır ve kütlenin ezici çoğunluğunu barındırır.',
    isActive: true
  },

  // ==========================================
  // 2. GÜNEŞ TUTULMASI & AY TUTULMASI (17-30)
  // ==========================================
  {
    id: 'q_tut_01',
    topic: 'gunes_tutulmasi',
    topicTitle: 'Güneş Tutulması',
    gradeLevel: 6,
    questionText: 'Görseldeki deney modelinde Işık Kaynağı (Güneş) ile L gök cismi arasına K gök cismi girmiş ve L üzerine gölge düşürmüştür. K cismi Ay, L cismi Dünya olduğuna göre bu model hangi doğa olayını temsil eder?',
    options: [
      'Güneş Tutulması',
      'Ay Tutulması',
      'Mevsimlerin Oluşumu',
      'Gece-Gündüz Oluşumu'
    ],
    correctIndex: 0,
    explanation: 'Ay’ın Güneş ile Dünya arasına girerek gölgesini Dünya üzerine düşürmesi Güneş Tutulması olayıdır.',
    diagramType: 'solar_eclipse',
    diagramData: { celestialBodies: ['sun', 'moon', 'earth'] },
    isActive: true
  },
  {
    id: 'q_tut_02',
    topic: 'ay_tutulmasi',
    topicTitle: 'Ay Tutulması',
    gradeLevel: 6,
    questionText: 'Görseldeki dizilim modelinde Işık Kaynağı ile Y cismi arasına X cismi girmiştir. X cismi Dünya, Y cismi Ay olduğuna göre Dünya’nın gölgesinin Ay üzerine düştüğü bu doğa olayı hangisidir?',
    options: [
      'Ay Tutulması',
      'Güneş Tutulması',
      'Gelgit Olayı',
      'Meteor Yağmuru'
    ],
    correctIndex: 0,
    explanation: 'Dünya’nın Güneş ile Ay arasına girip Ay’ı kendi tam gölgesinde bırakması Ay Tutulmasıdır.',
    diagramType: 'lunar_eclipse',
    diagramData: { celestialBodies: ['sun', 'earth', 'moon'] },
    isActive: true
  },
  {
    id: 'q_tut_03',
    topic: 'gunes_tutulmasi',
    topicTitle: 'Güneş Tutulması',
    gradeLevel: 6,
    questionText: 'Güneş tutulması olayı Ay’ın hangi ana evresindeyken meydana gelebilir?',
    options: ['Dolunay', 'Yeni Ay', 'İlk Dördün', 'Son Dördün'],
    correctIndex: 1,
    explanation: 'Güneş tutulması sadece Ay Yeni Ay evresindeyken gerçekleşebilir.',
    isActive: true
  },
  {
    id: 'q_tut_04',
    topic: 'ay_tutulmasi',
    topicTitle: 'Ay Tutulması',
    gradeLevel: 6,
    questionText: 'Ay tutulması olayı Ay’ın hangi ana evresindeyken gerçekleşebilir?',
    options: ['Yeni Ay', 'Dolunay', 'Hilal', 'İlk Dördün'],
    correctIndex: 1,
    explanation: 'Ay tutulması yalnızca Ay Dolunay evresindeyken Dünya’nın tam gölgesine girmesiyle gerçekleşir.',
    isActive: true
  },
  {
    id: 'q_tut_05',
    topic: 'gunes_tutulmasi',
    topicTitle: 'Güneş Tutulması',
    gradeLevel: 6,
    questionText: 'Gölge oluşumu ve tutulmaların gerçekleşmesi ışığın hangi temel davranışının bir kanıtıdır?',
    options: [
      'Işığın kırılması',
      'Işığın doğrusal yolla yayılması',
      'Işığın yansıması',
      'Işığın soğurulması'
    ],
    correctIndex: 1,
    explanation: 'Saydam olmayan cisimlerin arkasında net gölge oluşması, ışığın doğrusal yayılmasının doğrudan sonucudur.',
    isActive: true
  },
  {
    id: 'q_tut_06',
    topic: 'ay_tutulmasi',
    topicTitle: 'Ay Tutulması',
    gradeLevel: 6,
    questionText: 'Ay ve Güneş tutulmaları neden her ay düzenli olarak gerçekleşmez?',
    options: [
      'Ay’ın ve Dünya’nın yörünge düzlemleri arasında yaklaşık 5 derecelik bir eğiklik olduğu için',
      'Güneş ışınlarının gücü her ay değiştiği için',
      'Dünya kendi ekseni etrafında döndüğü için',
      'Ay’ın şekli değiştiği için'
    ],
    correctIndex: 0,
    explanation: 'Ay’ın dolanma düzlemi ile Dünya’nın dolanma düzlemi arasında ~5° açı farkı olduğundan her yeniay ve dolunayda tam aynı doğrultuya gelemezler.',
    isActive: true
  },
  {
    id: 'q_tut_07',
    topic: 'gunes_tutulmasi',
    topicTitle: 'Güneş Tutulması',
    gradeLevel: 6,
    questionText: 'Güneş tutulmasını izlerken aşağıdakilerden hangisi MUTLAKA yapılmalıdır?',
    options: [
      'Özel koruyucu filtreli gözlük kullanılmalıdır',
      'Çıplak gözle doğrudan bakılmalıdır',
      'Normal bir güneş gözlüğü takmak yeterlidir',
      'Dürbünle doğrudan Güneş’e bakılmalıdır'
    ],
    correctIndex: 0,
    explanation: 'Güneş tutulması sırasında zararlı ultraviyole ve kızılötesi ışınlar kalıcı göz hasarı yapabilir; mutlaka özel sertifikalı tutulma gözlüğü takılmalıdır.',
    isActive: true
  },
  {
    id: 'q_tut_08',
    topic: 'ay_tutulmasi',
    topicTitle: 'Ay Tutulması',
    gradeLevel: 6,
    questionText: 'Tam Ay tutulması sırasında Ay yüzeyinin bakır kırmızısı (kanlı ay) görünmesinin sebebi nedir?',
    options: [
      'Dünya atmosferinin mavi ışığı saçıp kırmızı ışığı Ay’a kırması',
      'Güneş’in kendi rengini değiştirmesi',
      'Ay yüzeyindeki lavların parlaması',
      'Ay’ın kendi ışığını üretmesi'
    ],
    correctIndex: 0,
    explanation: 'Dünya atmosferi güneş ışığının kırmızı dalga boylarını kırarak Ay üzerine yönlendirir (Rayleigh saçılması).',
    isActive: true
  },
  {
    id: 'q_tut_09',
    topic: 'gunes_tutulmasi',
    topicTitle: 'Güneş Tutulması',
    gradeLevel: 6,
    questionText: 'Güneş tutulması ile Ay tutulmasının süreleri karşılaştırıldığında hangisi doğrudur?',
    options: [
      'Güneş tutulması birkaç dakika sürerken, Ay tutulması saatlerce sürebilir',
      'Güneş tutulması tüm gün sürer',
      'Ay tutulması sadece 10 saniye sürer',
      'Her ikisi de tam olarak aynı sürede biter'
    ],
    correctIndex: 0,
    explanation: 'Ay’ın gölgesi küçük olduğu için Güneş tutulması birkaç dakika sürer; Dünya’nın gölgesi büyük olduğu için Ay tutulması saatlerce izlenebilir.',
    isActive: true
  },
  {
    id: 'q_tut_10',
    topic: 'ay_tutulmasi',
    topicTitle: 'Ay Tutulması',
    gradeLevel: 6,
    questionText: 'Ay tutulması Dünya’nın hangi bölgelerinden gözlemlenebilir?',
    options: [
      'O sırada geceyi yaşayan ve gökyüzü açık olan her yerden',
      'Sadece Ekvator çizgisinden',
      'Yalnızca gündüz vakti olan bölgelerden',
      'Yalnızca Kuzey Kutbundan'
    ],
    correctIndex: 0,
    explanation: 'Ay tutulması Dünya’nın o esnada geceyi yaşayan tüm yarıküresinden çıplak gözle güvenle izlenebilir.',
    isActive: true
  },

  // ==========================================
  // 3. KUVVET, DİNAMOMETRE & ÖLÇÜM (31-40)
  // ==========================================
  {
    id: 'q_kuv_01',
    topic: 'kuvvet_tanimi',
    topicTitle: 'Kuvvet',
    gradeLevel: 6,
    questionText: 'Kuvveti ölçen ölçüm aleti ve kuvvetin uluslararası birimi hangisidir?',
    options: [
      'Dinamometre - Newton (N)',
      'Eşit kollu terazi - Kilogram (kg)',
      'Termometre - Derece (°C)',
      'Manometre - Pascal (Pa)'
    ],
    correctIndex: 0,
    explanation: 'Kuvvet Dinamometre ile ölçülür ve birimi İngiliz bilim insanı Isaac Newton’ın anısına Newton (N)’dur.',
    isActive: true
  },
  {
    id: 'q_kuv_02',
    topic: 'kuvvet_tanimi',
    topicTitle: 'Kuvvet',
    gradeLevel: 6,
    questionText: 'Bir kuvveti tam olarak ifade edebilmek için aşağıdaki özelliklerden hangisi GEREKLİ DEĞİLDİR?',
    options: [
      'Doğrultusu ve yönü',
      'Büyüklüğü (şiddeti)',
      'Uygulama noktası',
      'Cismin rengi veya kokusu'
    ],
    correctIndex: 3,
    explanation: 'Kuvvet vektörel bir niceliktir: Uygulama noktası, doğrultusu, yönü ve büyüklüğü ile tanımlanır.',
    isActive: true
  },
  {
    id: 'q_kuv_03',
    topic: 'kuvvet_tanimi',
    topicTitle: 'Kuvvet',
    gradeLevel: 6,
    questionText: 'Görseldeki 10 eşit bölmeli ve maksimum 50 N ölçebilen dinamometreye asılan cisim yayı 4. bölmeye kadar uzatmıştır. Bu cismin ağırlığı kaç Newton’dur?',
    options: ['10 N', '20 N', '25 N', '40 N'],
    correctIndex: 1,
    explanation: '50 N / 10 bölme = 5 N/bölme. Yay 4 bölme uzadığı için cismin ağırlığı: 4 × 5 N = 20 N’dur.',
    diagramType: 'dynamometer_scale',
    diagramData: { dynamometer: { maxCapacity: 50, totalDivisions: 10, stretchedDivisions: 4 } },
    isActive: true
  },
  {
    id: 'q_kuv_04',
    topic: 'kuvvet_tanimi',
    topicTitle: 'Kuvvet',
    gradeLevel: 6,
    questionText: 'Doğu yönündeki bir kuvvet ile Batı yönündeki bir kuvvetin doğrultuları için ne söylenebilir?',
    options: [
      'Doğrultuları aynıdır (Doğu-Batı doğrultusu)',
      'Doğrultuları birbirine diktir',
      'Farklı doğrultulardadır',
      'Doğrultuları Kuzey-Güney yönündedir'
    ],
    correctIndex: 0,
    explanation: 'Doğu ve Batı zıt yönlerdir ancak ikisi de aynı "Doğu-Batı" doğrultusu üzerindedir.',
    isActive: true
  },
  {
    id: 'q_kuv_05',
    topic: 'kuvvet_tanimi',
    topicTitle: 'Kuvvet',
    gradeLevel: 6,
    questionText: 'Aşağıdaki araçlardan hangisinin çalışma prensibinde yayların esneklik özelliğinden yararlanılır?',
    options: ['Dinamometre', 'Termometre', 'Kronometre', 'Barometre'],
    correctIndex: 0,
    explanation: 'Dinamometrelerin içinde sarmal çelik yaylar bulunur. Kuvvet arttıkça yayın uzama miktarı doğru orantılı artar.',
    isActive: true
  },

  // ==========================================
  // 4. AYNI VE ZIT YÖNLÜ KUVVETLER & BİLEŞKE KUVVET (41-55)
  // ==========================================
  {
    id: 'q_ayni_01',
    topic: 'ayni_zit_kuvvetler',
    topicTitle: 'Aynı Yönlü Kuvvetler',
    gradeLevel: 6,
    questionText: 'Bir cisme Doğu yönünde uygulanan 12 N ve yine Doğu yönünde uygulanan 18 N büyüklüğündeki iki kuvvetin bileşkesi (net kuvveti) kaç N olur?',
    options: ['6 N Doğu', '30 N Doğu', '30 N Batı', '0 N'],
    correctIndex: 1,
    explanation: 'Aynı yönlü kuvvetlerin bileşkesi toplanarak bulunur: R = 12 + 18 = 30 N Doğu yönündedir.',
    diagramType: 'force_vectors',
    diagramData: {
      forces: [
        { name: 'F₁ = 12 N', magnitude: 8, direction: 'right' },
        { name: 'F₂ = 18 N', magnitude: 12, direction: 'right' }
      ]
    },
    isActive: true
  },
  {
    id: 'q_ayni_02',
    topic: 'ayni_zit_kuvvetler',
    topicTitle: 'Aynı Yönlü Kuvvetler',
    gradeLevel: 6,
    questionText: 'İki astronot arızalı bir uyduyu aynı yönde 25 N ve 35 N kuvvetlerle itmektedir. Uyduya etki eden net kuvvet nedir?',
    options: ['10 N', '60 N', '25 N', '0 N'],
    correctIndex: 1,
    explanation: 'Aynı yöndeki kuvvetler toplanır: R = 25 N + 35 N = 60 N.',
    isActive: true
  },
  {
    id: 'q_zit_01',
    topic: 'ayni_zit_kuvvetler',
    topicTitle: 'Zıt Yönlü Kuvvetler',
    gradeLevel: 6,
    questionText: 'Bir cisme Doğu yönünde 20 N, Batı yönünde 12 N kuvvet uygulandığında bileşke kuvvetin büyüklüğü ve yönü ne olur?',
    options: [
      '8 N Doğu',
      '8 N Batı',
      '32 N Doğu',
      '0 N'
    ],
    correctIndex: 0,
    explanation: 'Zıt yönlü kuvvetlerde büyük kuvvetten küçük kuvvet çıkarılır ve yön büyük kuvvetin yönüdür: R = 20 - 12 = 8 N Doğu.',
    diagramType: 'force_vectors',
    diagramData: {
      forces: [
        { name: 'F₁ = 20 N', magnitude: 12, direction: 'right' },
        { name: 'F₂ = 12 N', magnitude: 8, direction: 'left' }
      ]
    },
    isActive: true
  },
  {
    id: 'q_zit_02',
    topic: 'ayni_zit_kuvvetler',
    topicTitle: 'Zıt Yönlü Kuvvetler',
    gradeLevel: 6,
    questionText: 'Halat çekme yarışında A takımı Batı yönünde 80 N, B takımı Doğu yönünde 100 N kuvvet uygulamaktadır. İp hangi yönde kaç N net kuvvetle hareket eder?',
    options: [
      '20 N Doğu yönünde',
      '20 N Batı yönünde',
      '180 N Doğu yönünde',
      'Hareketsiz kalır'
    ],
    correctIndex: 0,
    explanation: 'R = 100 N - 80 N = 20 N. B takımı daha güçlü olduğu için hareket Doğu yönündedir.',
    isActive: true
  },
  {
    id: 'q_bil_01',
    topic: 'bileske_kuvvet',
    topicTitle: 'Bileşke Kuvvet',
    gradeLevel: 6,
    questionText: 'Birden fazla kuvvetin bir cisme yaptığı etkiyi tek başına yapan kuvvete ne ad verilir?',
    options: [
      'Bileşke (Net) Kuvvet',
      'Dengeleyici Kuvvet',
      'Sürtünme Kuvveti',
      'Yer Çekimi Kuvveti'
    ],
    correctIndex: 0,
    explanation: 'İki veya daha fazla kuvvetin toplam etkisini tek başına gösteren kuvvete bileşke (net) kuvvet denir ve R sembolüyle gösterilir.',
    isActive: true
  },
  {
    id: 'q_bil_02',
    topic: 'bileske_kuvvet',
    topicTitle: 'Bileşke Kuvvet',
    gradeLevel: 6,
    questionText: 'Bir kutuya Doğu yönünde 15 N ve 10 N, Batı yönünde ise 25 N kuvvet uygulanırsa bileşke kuvvet kaç N olur?',
    options: ['0 N', '5 N Doğu', '25 N Doğu', '50 N'],
    correctIndex: 0,
    explanation: 'Doğu toplamı = 15 + 10 = 25 N. Batı = 25 N. Zıt yönde eşit oldukları için R = 25 - 25 = 0 N olur.',
    diagramType: 'force_vectors',
    diagramData: {
      forces: [
        { name: '15 N (Doğu)', magnitude: 9, direction: 'right' },
        { name: '10 N (Doğu)', magnitude: 6, direction: 'right' },
        { name: '25 N (Batı)', magnitude: 15, direction: 'left' }
      ]
    },
    isActive: true
  },

  // ==========================================
  // 5. DENGELENMİŞ & DENGELENMEMİŞ KUVVETLER (56-65)
  // ==========================================
  {
    id: 'q_deng_01',
    topic: 'dengelenmis_kuvvetler',
    topicTitle: 'Dengelenmiş Kuvvetler',
    gradeLevel: 6,
    questionText: 'Bir cisme etki eden bileşke kuvvet sıfır (R = 0 N) ise bu cisim hangi kuvvetlerin etkisindedir?',
    options: [
      'Dengelenmiş kuvvetler',
      'Dengelenmemiş kuvvetler',
      'Yer çekimsiz kuvvetler',
      'Sürtünmesiz kuvvetler'
    ],
    correctIndex: 0,
    explanation: 'Bileşke kuvvet sıfır ise cisim "dengelenmiş kuvvetlerin" etkisindedir. Duran cisim durur, hareketli cisim sabit süratle yoluna devam eder.',
    diagramType: 'balanced_box',
    diagramData: { objectName: 'Kutu' },
    isActive: true
  },
  {
    id: 'q_deng_02',
    topic: 'dengelenmis_kuvvetler',
    topicTitle: 'Dengelenmiş Kuvvetler',
    gradeLevel: 6,
    questionText: 'Aşağıdaki durumlardan hangisi "Dengelenmiş Kuvvetlerin" etkisinde olan bir duruma örnektir?',
    options: [
      'Masanın üzerinde hareketsiz duran kitap',
      'Yokuş aşağı hızlanan bisiklet',
      'Kırmızı ışıkta yavaşlayan otomobil',
      'Pota çemberine atılan basketbol topu'
    ],
    correctIndex: 0,
    explanation: 'Hareketsiz duran veya sabit süratle doğrusal giden cisimler dengelenmiş kuvvetlerin etkisindedir.',
    isActive: true
  },
  {
    id: 'q_deng_03',
    topic: 'dengelenmemis_kuvvetler',
    topicTitle: 'Dengelenmemiş Kuvvetler',
    gradeLevel: 6,
    questionText: 'Aşağıdakilerden hangisi "Dengelenmemiş Kuvvetlerin" etkisindeki bir harekete örnektir?',
    options: [
      'Durağa yaklaşırken yavaşlayan otobüs',
      'Duvarda asılı duran saat',
      'Sabit 90 km/h süratle düz yolda giden otomobil',
      'Masa üstünde duran bilgisayar'
    ],
    correctIndex: 0,
    explanation: 'Hızlanan, yavaşlayan veya yön değiştiren hareketler dengelenmemiş kuvvetler (R ≠ 0) sonucunda gerçekleşir.',
    isActive: true
  },
  {
    id: 'q_deng_04',
    topic: 'dengelenmis_kuvvetler',
    topicTitle: 'Dengelenmiş Kuvvetler',
    gradeLevel: 6,
    questionText: 'Düz bir ray üzerinde sabit 120 km/h süratle ilerleyen hızlı tren için hangisi doğrudur?',
    options: [
      'Dengelenmiş kuvvetlerin etkisindedir',
      'Dengelenmemiş kuvvetlerin etkisindedir',
      'Üzerindeki net kuvvet sıfırdan büyüktür',
      'Sürekli hızlanmaktadır'
    ],
    correctIndex: 0,
    explanation: 'Sabit süratli doğrusal hareket yapan cisimler dengelenmiş kuvvetlerin etkisindedir (Net kuvvet = 0 N).',
    isActive: true
  },
  {
    id: 'q_deng_05',
    topic: 'dengelenmis_kuvvetler',
    topicTitle: 'Dengelenmiş Kuvvetler',
    gradeLevel: 6,
    questionText: 'Bir kutuya Doğu yönünde 40 N kuvvet uygulanıyor. Kutunun dengelenmiş kuvvetler etkisinde kalması için hangi kuvvet uygulanmalıdır?',
    options: [
      'Batı yönünde 40 N',
      'Doğu yönünde 40 N',
      'Kuzey yönünde 40 N',
      'Batı yönünde 80 N'
    ],
    correctIndex: 0,
    explanation: 'Dengelenmiş olması için bileşke 0 olmalıdır: Doğu 40 N’a karşı Batı yönünde 40 N zıt kuvvet gereklidir.',
    diagramType: 'balanced_box',
    diagramData: { objectName: 'Kutu' },
    isActive: true
  },
  {
    id: 'q_deng_06',
    topic: 'dengelenmemis_kuvvetler',
    topicTitle: 'Dengelenmemiş Kuvvetler',
    gradeLevel: 6,
    questionText: 'Dalından yere doğru düşen bir elmanın hareketi için aşağıdakilerden hangisi söylenebilir?',
    options: [
      'Dengelenmemiş kuvvet etkisiyle hızlanan hareket yapar',
      'Dengelenmiş kuvvet etkisiyle sabit hızla düşer',
      'Net kuvvet sıfırdır',
      'Yukarı doğru net kuvvet vardır'
    ],
    correctIndex: 0,
    explanation: 'Yer çekimi kuvveti nedeniyle düşen cisim aşağı doğru hızlanır; bu durum dengelenmemiş kuvvetlerin sonucudur.',
    difficulty: 'orta',
    isActive: true
  },

  // ========================================================
  // 6. İLERİ DÜZEY VE ZOR FEN SORULARI (7. SINIF DERİNLİK)
  // ========================================================
  {
    id: 'q_gs_hard_01',
    topic: 'gunes_sistemi',
    topicTitle: 'Uzay Araştırmaları & Teleskoplar',
    gradeLevel: 7,
    questionText: 'James Webb Uzay Teleskobu’nun Dünya’dan yaklaşık 1.5 milyon km uzaktaki Lagrange-2 (L2) noktasına yerleştirilmesinin en temel nedeni nedir?',
    options: [
      'Dünya ve Ay’ın yaydığı ısı ve ışıktan korunarak kızılötesi gözlemleri engelsiz yapabilmek',
      'Güneş’e daha yakın olup enerjisini artırmak',
      'Ay’ın çekim alanına girerek yörüngede sabit kalmak',
      'Dünya atmosferindeki oksijen gazını depolamak'
    ],
    correctIndex: 0,
    explanation: 'James Webb hassas bir kızılötesi teleskoptur. Dünya ve Ay’dan uzak L2 noktasında devasa güneş kalkanı sayesinde -233°C’ye kadar soğuyarak evrenin en eski yıldızlarını gözlemler.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_gs_hard_02',
    topic: 'gunes_sistemi',
    topicTitle: 'Uzay Kirliliği & Uydular',
    gradeLevel: 7,
    questionText: 'Türkiye’nin uzaydaki uyduları ile ilgili verilen bilgilerden hangisi DOĞRUDUR?',
    options: [
      'Türksat uyduları haberleşme, Göktürk uyduları ise yer gözlem amacıyla görev yapar',
      'Bilsat uydusu günümüzde en aktif haberleşme uydumuzdur',
      'Göktürk-2 uydusu televizyon ve radyo yayını yapmaktadır',
      'Uzay kirliliği sadece gök taşlarının çarpışmasıyla oluşur'
    ],
    correctIndex: 0,
    explanation: 'Türksat (5A, 5B, 6A vb.) haberleşme ve televizyon yayıncılığı için; Göktürk (1 ve 2) ise yüksek çözünürlüklü keşif ve yer gözlemi için kullanılır. Bilsat ise görev ömrünü tamamlamıştır.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_gs_hard_03',
    topic: 'gunes_sistemi',
    topicTitle: 'Yıldızların Yaşam Döngüsü',
    gradeLevel: 7,
    questionText: 'Başlangıç kütlesi Güneş’in kütlesinden çok daha büyük olan bir yıldızın ömrünü tamamladıktan sonra dönüşebileceği gök cisimleri hangisinde doğru verilmiştir?',
    options: [
      'Nötron Yıldızı (Pulsar) veya Kara Delik',
      'Beyaz Cüce veya Gezegenimsi Bulutsu',
      'Kuyruklu Yıldız veya Asteroid',
      'Kırmızı Dev veya Gaz Gezegeni'
    ],
    correctIndex: 0,
    explanation: 'Büyük kütleli yıldızlar süpernova patlaması geçirerek ya Nötron Yıldızı’na (Pulsar) ya da çekim kuvveti ışığı dahi hapseden Kara Delik’e dönüşür. Küçük kütleliler ise Beyaz Cüce olur.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_gs_hard_04',
    topic: 'gunes_sistemi',
    topicTitle: 'Işık Yılı Kavramı',
    gradeLevel: 7,
    questionText: '"Işık yılı" kavramı ile ilgili aşağıdaki ifadelerden hangisi BİLİMSEL OLARAK DOĞRUDUR?',
    options: [
      'Bir zaman birimi değil, ışığın boşlukta 1 yılda aldığı mesafe birimidir',
      'Güneş’in Dünya etrafında 1 kez dönme süresidir',
      'Yıldızların ömürlerini ölçmek için kullanılan bir zaman birimidir',
      'Güneş ışınlarının Dünya’ya ulaşma süresidir (yaklaşık 8 dakika)'
    ],
    correctIndex: 0,
    explanation: 'Işık saniyede yaklaşık 300.000 km hızla hareket eder. Işığın 1 yılda aldığı mesafe yaklaşık 9.46 trilyon kilometredir ve gök cisimleri arasındaki uzaklığı ölçmek için kullanılır.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_gs_hard_05',
    topic: 'gunes_sistemi',
    topicTitle: 'Galaksiler & Samanyolu',
    gradeLevel: 7,
    questionText: 'Güneş Sistemi’mizin içinde bulunduğu Samanyolu Galaksisi’nin yapısı ve Güneş’in konumu hangisinde doğru belirtilmiştir?',
    options: [
      'Sarmal galaksidir ve Güneş Sistemi "Avcı (Orion)" kolunda yer alır',
      'Eliptik galaksidir ve tam merkezdeki kara deliğin içindedir',
      'Düzensiz galaksidir ve kolları bulunmaz',
      'Çubuksuz sarmal galaksidir ve Güneş en dış uçtadır'
    ],
    correctIndex: 0,
    explanation: 'Samanyolu sarmal (çubuklu sarmal) bir galaksidir. Milyarlarca yıldız barındırır ve Güneş Sistemi bu galaksinin Avcı (Orion) kolunda bulunmaktadır.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_gez_hard_01',
    topic: 'gezegenler',
    topicTitle: 'Venüs & Sera Etkisi',
    gradeLevel: 7,
    questionText: 'Venüs gezegeninin Güneş’e Merkür’den daha uzak olmasına rağmen Güneş Sistemi’nin en sıcak gezegeni (yaklaşık 465°C) olmasının temel sebebi nedir?',
    options: [
      'Atmosferinin %96 oranında yoğun karbondioksitten (CO2) oluşması ve aşırı sera etkisi',
      'Yüzeyindeki aktif volkanların magma püskürtmesi',
      'Güneş’e bakan yüzünün hiç dönmemesi',
      'Çekirdeğindeki nükleer füzyon tepkimeleri'
    ],
    correctIndex: 0,
    explanation: 'Venüs’ün aşırı kalın atmosferi ve yüksek karbondioksit oranı Güneş’ten gelen ısıyı hapseder. Kontrolsüz sera etkisi sebebiyle yüzey sıcaklığı Merkür’den bile daha yüksektir.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_gez_hard_02',
    topic: 'gezegenler',
    topicTitle: 'Gezegenlerin Dolanma Süreleri',
    gradeLevel: 7,
    questionText: 'Gezegenlerin Güneş etrafındaki bir tam dolanım süreleri (1 yılı) incelendiğinde hangisi kesinlikle söylenebilir?',
    options: [
      'Güneş’e olan uzaklık arttıkça dolanma süresi de artar',
      'Gezegenin kütlesi büyüdükçe dolanma süresi kısalır',
      'Tüm gezegenlerin dolanma süresi Dünya ile aynıdır',
      'Karasal gezegenlerin dolanma süresi gaz devlerinden uzundur'
    ],
    correctIndex: 0,
    explanation: 'Güneş’e en yakın Merkür’ün 1 yılı 88 gün iken, en uzak gezegen Neptün’ün Güneş etrafında bir tam tur atması yaklaşık 165 Dünya yılı sürer.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_gez_hard_03',
    topic: 'gezegenler',
    topicTitle: 'Dev Uydular: Ganymede & Titan',
    gradeLevel: 7,
    questionText: 'Güneş Sistemi’nde Merkür gezegeninden bile daha büyük olan en büyük doğal uydu hangisidir ve hangi gezegene aittir?',
    options: [
      'Ganymede - Jüpiter',
      'Titan - Satürn',
      'Ay - Dünya',
      'Triton - Neptün'
    ],
    correctIndex: 0,
    explanation: 'Jüpiter’in uydusu Ganymede 5268 km çapıyla Güneş Sistemi’nin en büyük uydusudur ve Merkür gezegeninden bile daha büyüktür.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_gez_hard_04',
    topic: 'gezegenler',
    topicTitle: 'Gaz Devlerinin Özellikleri',
    gradeLevel: 7,
    questionText: 'Aşağıdakilerden hangisi dış gezegenlerin (Jüpiter, Satürn, Uranüs, Neptün) TÜMÜ için geçerli ortak bir özelliktir?',
    options: [
      'Halka sistemlerine ve çok sayıda doğal uyduya sahip olmaları',
      'Güneş Sistemi’nde en sıcak gezegenler olmaları',
      'Katı ve taşlı bir yüzeye sahip olmaları',
      'Kendi etrafında doğudan batıya doğru dönmeleri'
    ],
    correctIndex: 0,
    explanation: 'Tüm gaz devlerinin etrafında halkalar ve onlarca uydu bulunur. Katı bir yüzeyleri yoktur, çoğunlukla hidrojen ve helyum gazlarından oluşurlar.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_tut_hard_01',
    topic: 'gunes_tutulmasi',
    topicTitle: 'Güneş Tutulması & Yörünge Eğikliği',
    gradeLevel: 7,
    questionText: 'Ay her 29.5 günde bir Dünya etrafında dolanıp Yeni Ay evresine gelmesine rağmen NEDEN her ay bir Güneş tutulması gerçekleşmez?',
    options: [
      'Ay’ın Dünya etrafındaki yörünge düzlemi ile Dünya’nın Güneş etrafındaki yörüngesi arasında yaklaşık 5 derecelik eğiklik olması',
      'Güneş’in yaydığı ışık şiddetinin her ay değişmesi',
      'Dünya’nın kendi ekseni etrafında çok hızlı dönmesi',
      'Ay’ın her ay Güneş ile Dünya arasına girememesi'
    ],
    correctIndex: 0,
    explanation: 'Ay’ın yörünge düzlemi Dünya’nın tutulma düzlemine göre yaklaşık 5° eğiktir. Bu nedenle her yeni ayda Ay’ın gölgesi Dünya’nın üzerinden veya altından boşluğa düşer, tam çakışma yılda sadece 2-5 kez olur.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_tut_hard_02',
    topic: 'gunes_tutulmasi',
    topicTitle: 'Halkalı Güneş Tutulması',
    gradeLevel: 7,
    questionText: '"Halkalı Güneş Tutulması" olayının meydana gelmesinde etkili olan temel faktör hangisidir?',
    options: [
      'Ay’ın Dünya’ya olan mesafesinin eliptik yörünge sebebiyle en uzak konumda bulunması',
      'Dünya’nın Güneş’e en yakın konuma gelmesi',
      'Ay’ın atmosferinin kalınlaşması',
      'Güneş patlamalarının Ay’ı eritmesi'
    ],
    correctIndex: 0,
    explanation: 'Ay eliptik yörüngesinde Dünya’dan uzaklaştığında gökyüzündeki görünür boyutu küçülür. Güneş’in önüne geçtiğinde diskin tamamını kapatamaz ve etrafta parlak bir ateş çemberi (halka) bırakır.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_tut_hard_03',
    topic: 'ay_tutulmasi',
    topicTitle: 'Kanlı Ay Tutulması',
    gradeLevel: 7,
    questionText: 'Tam Ay tutulması sırasında Ay’ın tamamen kararmayıp bakır kırmızısı (Kanlı Ay) renkte görünmesinin sebebi nedir?',
    options: [
      'Dünya atmosferinden kırılan kırmızı dalga boylu Güneş ışınlarının Ay yüzeyine ulaşması',
      'Ay yüzeyindeki volkanların patlaması',
      'Güneş’in kırmızı dev aşamasına geçmesi',
      'Ay’ın toprağındaki pasın parlaması'
    ],
    correctIndex: 0,
    explanation: 'Güneş ışınları Dünya atmosferinden geçerken mavi ışık saçılır, ancak uzun dalga boylu kırmızı ışıklar kırılarak Dünya gölgesinin içine bükülür ve Ay’ı kızıla boyar.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_tut_hard_04',
    topic: 'ay_tutulmasi',
    topicTitle: 'Tutulmaların Karşılaştırması',
    gradeLevel: 7,
    questionText: 'Güneş ve Ay tutulmalarının gözlemlenmesiyle ilgili aşağıdaki karşılaştırmalardan hangisi DOĞRUDUR?',
    options: [
      'Ay tutulması gece olan tüm yarımküreden saatlerce izlenebilirken, Güneş tutulması dar bir şeritte birkaç dakika izlenir',
      'Güneş tutulması çıplak gözle güvenle izlenir, Ay tutulması ise göze zarar verir',
      'Güneş tutulması Dolunay evresinde, Ay tutulması Yeni Ay evresinde gerçekleşir',
      'Ay tutulmasında Ay, Güneş ile Dünya’nın arasına girer'
    ],
    correctIndex: 0,
    explanation: 'Dünya’nın gölgesi Ay’dan çok daha büyüktür; bu yüzden Ay tutulması Dünya’nın geceyi yaşayan her yerinden saatlerce izlenebilir. Güneş tutulmasında ise Ay’ın tam gölgesi yeryüzünde daracık bir iz bırakır.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_kuv_hard_01',
    topic: 'kuvvet_tanimi',
    topicTitle: 'Kütle ve Ağırlık İlişkisi',
    gradeLevel: 7,
    questionText: 'Dünya yüzeyinde dinamometre ile ağırlığı 600 N ölçülen bir astronot Ay yüzeyine gittiğinde, kütlesi ve ağırlığı için ne söylenebilir? (g_dünya ≈ 10 N/kg, g_ay ≈ g_dünya / 6)',
    options: [
      'Kütlesi 60 kg olarak değişmez, ağırlığı yaklaşık 100 N olur',
      'Kütlesi 10 kg’a düşer, ağırlığı 600 N kalır',
      'Hem kütlesi hem ağırlığı sıfır olur',
      'Kütlesi 600 kg olur, ağırlığı 60 N olur'
    ],
    correctIndex: 0,
    explanation: 'Kütle değişmeyen madde miktarıdır (m = 600 / 10 = 60 kg). Ay’da çekim ivmesi Dünya’nın 1/6’sı olduğu için ağırlık 600 / 6 = 100 N olur.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_kuv_hard_02',
    topic: 'kuvvet_tanimi',
    topicTitle: 'Kutuplar ve Ekvator Ağırlık Farkı',
    gradeLevel: 7,
    questionText: 'Dünya’nın kutuplardan basık, ekvatordan şişkin (geoit) şekle sahip olması sonucunda aynı cismin ağırlığı kutupta ve ekvatorda nasıl değişir?',
    options: [
      'Kutuplar yerin merkezine daha yakın olduğu için kutuptaki ağırlık ekvatordakinden büyüktür',
      'Ekvatorda yer çekimi daha fazla olduğu için ekvatorda daha ağırdır',
      'Kütle kutuplarda artar, ekvatorda azalır',
      'Cismin ağırlığı her iki yerde de tamamen eşittir'
    ],
    correctIndex: 0,
    explanation: 'Yer çekimi yerin merkezine olan uzaklığın karesiyle ters orantılıdır. Kutuplar merkeze daha yakın olduğu için yer çekimi ivmesi kutuplarda (~9.83 N/kg) ekvatordakinden (~9.78 N/kg) daha fazladır.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_kuv_hard_03',
    topic: 'kuvvet_tanimi',
    topicTitle: 'Yükseklik ve Yer Çekimi',
    gradeLevel: 7,
    questionText: 'Deniz seviyesinde hassas bir dinamometre ve eşit kollu terazi ile ölçülen bir kaya parçası, Everest Tepesi’nin zirvesine çıkarılırsa ölçüm aletlerindeki değerler nasıl değişir?',
    options: [
      'Eşit kollu terazideki kütle değişmez; dinamometredeki ağırlık azalır',
      'Her iki aletteki değer de artar',
      'Dinamometredeki değer değişmez; terazideki kütle azalır',
      'Dinamometredeki değer artar; terazideki kütle sıfır olur'
    ],
    correctIndex: 0,
    explanation: 'Yükseklere çıkıldıkça yerin merkezinden uzaklaşıldığı için yer çekimi kuvveti azalır (ağırlık düşer). Kütle ise madde miktarı olduğundan konuma bağlı değildir, değişmez.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_kuv_hard_04',
    topic: 'kuvvet_tanimi',
    topicTitle: 'Dinamometre Bölme Hesaplaması',
    gradeLevel: 7,
    questionText: 'En fazla 80 N ölçebilen 10 eşit bölmeli özdeş bir dinamometreye bir cisim asıldığında yay 3 bölme uzuyor. Bu cismin ağırlığı kaç N’dur?',
    options: [
      '24 N',
      '18 N',
      '30 N',
      '8 N'
    ],
    correctIndex: 0,
    explanation: 'Dinamometrenin 1 bölmesi = 80 N / 10 bölme = 8 N değerindedir. 3 bölme uzadığına göre cismin ağırlığı: 3 × 8 N = 24 N olarak bulunur.',
    difficulty: 'zor',
    diagramType: 'dynamometer_scale',
    diagramData: {
      dynamometer: {
        maxCapacity: 80,
        totalDivisions: 10,
        stretchedDivisions: 3,
        unitPerDivision: 8
      }
    },
    isActive: true
  },
  {
    id: 'q_bil_hard_01',
    topic: 'bileske_kuvvet',
    topicTitle: 'Çoklu Kuvvet Bileşkesi',
    gradeLevel: 7,
    questionText: 'Sürtünmesiz yatay bir masa üzerindeki cisme aynı doğrultuda; Doğu yönünde F1 = 35 N ve F2 = 15 N, Batı yönünde ise F3 = 20 N ve F4 = 45 N kuvvet uygulanıyor. Bileşke kuvvetin büyüklüğü ve yönü nedir?',
    options: [
      '15 N Batı',
      '15 N Doğu',
      '50 N Batı',
      '0 N (Dengede)'
    ],
    correctIndex: 0,
    explanation: 'Doğu toplamı = 35 + 15 = 50 N. Batı toplamı = 20 + 45 = 65 N. Zıt yönde oldukları için Net Kuvvet = 65 - 50 = 15 N ve büyük olan Batı yönündedir.',
    difficulty: 'zor',
    diagramType: 'force_vectors',
    diagramData: {
      forces: [
        { name: 'F1: 35N (Doğu)', magnitude: 12, direction: 'right' },
        { name: 'F2: 15N (Doğu)', magnitude: 6, direction: 'right' },
        { name: 'F3: 20N (Batı)', magnitude: 8, direction: 'left' },
        { name: 'F4: 45N (Batı)', magnitude: 16, direction: 'left' }
      ]
    },
    isActive: true
  },
  {
    id: 'q_bil_hard_02',
    topic: 'bileske_kuvvet',
    topicTitle: 'Dengeleyici Kuvvet Hesabı',
    gradeLevel: 7,
    questionText: 'Bir kutuya etki eden kuvvetlerin bileşkesi Doğu yönünde 28 N olarak hesaplanmıştır. Bu kutunun dengelenmiş kuvvetler etkisinde kalması (R = 0) için uygulanması gereken DENGELEYİCİ KUVVET nedir?',
    options: [
      'Batı yönünde 28 N',
      'Doğu yönünde 28 N',
      'Kuzey yönünde 28 N',
      'Batı yönünde 56 N'
    ],
    correctIndex: 0,
    explanation: 'Dengeleyici kuvvet, bileşke kuvvetle aynı doğrultuda, eşit büyüklükte fakat ZIT yönlü olan kuvvettir. R = 28 N Doğu ise dengeleyici kuvvet 28 N Batı yönündedir.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_deng_hard_01',
    topic: 'dengelenmis_kuvvetler',
    topicTitle: 'Limit Hıza Ulaşan Paraşütçü',
    gradeLevel: 7,
    questionText: 'Uçaktan atlayan bir paraşütçü paraşütünü açtıktan bir süre sonra sabit süratle yere doğru inmeye başlıyor. Bu andaki durumu için hangisi KESİNLİKLE DOĞRUDUR?',
    options: [
      'Aşağı yönlü yer çekimi kuvveti, yukarı yönlü hava direnci kuvvetine eşittir (R = 0 N)',
      'Yer çekimi kuvveti hava direncinden büyüktür',
      'Üzerindeki net kuvvet sürekli artmaktadır',
      'Dengelenmemiş kuvvetler etkisinde hızlanmaktadır'
    ],
    correctIndex: 0,
    explanation: 'Sabit süratli hareket dengelenmiş kuvvetlerin (R = 0 N) göstergesidir. Paraşütçüye etki eden hava direnci kuvveti ağırlığına eşit büyüklükte ve zıt yönlü olduğunda paraşütçü sabit süratle iner.',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_deng_hard_02',
    topic: 'dengelenmemis_kuvvetler',
    topicTitle: 'Viraj Dönen Araç Analizi',
    gradeLevel: 7,
    questionText: 'Sabit 60 km/h gösterge süratiyle dairesel bir virajı dönmekte olan bir otomobil için hangi ifade FİZİKSEL OLARAK DOĞRUDUR?',
    options: [
      'Hareketinin yönü sürekli değiştiği için dengelenmemiş kuvvetlerin etkisindedir',
      'Sürati sabit olduğu için dengelenmiş kuvvetlerin etkisindedir',
      'Otomobil üzerindeki net kuvvet sıfırdır',
      'Otomobil doğrusal ivmesiz hareket yapmaktadır'
    ],
    correctIndex: 0,
    explanation: 'Dengelenmiş kuvvetler için sadece süratin sabit olması yetmez, hareketin doğrusal (yönsüz) olması şarttır. Virajda yön sürekli değiştiği için merkezcil bir net kuvvet vardır (dengelenmemiştir).',
    difficulty: 'zor',
    isActive: true
  },
  {
    id: 'q_deng_hard_03',
    topic: 'dengelenmemis_kuvvetler',
    topicTitle: 'Yukarı Fırlatılan Taş',
    gradeLevel: 7,
    questionText: 'Düşey olarak yukarı doğru fırlatılan bir taşın tepe noktasına çıkarken yaptığı hareket ve kuvvet durumu için hangisi söylenebilir?',
    options: [
      'Hareket yönüne zıt yer çekimi kuvveti nedeniyle dengelenmemiş kuvvetle yavaşlar',
      'Yukarı doğru net kuvvet olduğu için hızlanır',
      'Dengelenmiş kuvvetlerin etkisinde sabit süratle yükselir',
      'Taş yükselirken yer çekimi kuvveti sıfır olur'
    ],
    correctIndex: 0,
    explanation: 'Yukarı doğru hareket eden taşa aşağı doğru yer çekimi kuvveti etki eder. Kuvvet hareket yönüne zıt olduğu için taş dengelenmemiş kuvvetlerin etkisiyle tepe noktasına kadar yavaşlar ve anlık durur.',
    difficulty: 'zor',
    isActive: true
  }
];

export const TOPIC_LABELS: Record<ScienceTopic, string> = {
  gunes_sistemi: 'Güneş Sistemi',
  gezegenler: 'Gezegenler',
  gunes_tutulmasi: 'Güneş Tutulması',
  ay_tutulmasi: 'Ay Tutulması',
  kuvvet_tanimi: 'Kuvvet ve Ölçümü',
  bileske_kuvvet: 'Bileşke Kuvvet',
  ayni_zit_kuvvetler: 'Aynı ve Zıt Kuvvetler',
  dengelenmis_kuvvetler: 'Dengelenmiş Kuvvetler',
  dengelenmemis_kuvvetler: 'Dengelenmemiş Kuvvetler'
};
