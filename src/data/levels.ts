import { LevelConfig, GridCell } from '../types/game';

// Helper to generate a grid with walls, crystals, questions, and obstacles
function createGrid(
  width: number,
  height: number,
  walls: [number, number][],
  crystals: [number, number][],
  questions: { pos: [number, number]; qId: string }[],
  obstacles: [number, number][] = []
): GridCell[] {
  const cells: GridCell[] = [];
  const wallSet = new Set(walls.map(([x, y]) => `${x},${y}`));
  const crystalSet = new Set(crystals.map(([x, y]) => `${x},${y}`));
  const questionMap = new Map(questions.map((q) => [`${q.pos[0]},${q.pos[1]}`, q.qId]));
  const obstacleSet = new Set(obstacles.map(([x, y]) => `${x},${y}`));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      if (wallSet.has(key)) {
        cells.push({ x, y, type: 'wall' });
      } else if (obstacleSet.has(key)) {
        cells.push({ x, y, type: 'obstacle', hazardType: 'laser' });
      } else if (questionMap.has(key)) {
        cells.push({ x, y, type: 'question', questionId: questionMap.get(key), unlocked: false });
      } else if (crystalSet.has(key)) {
        cells.push({ x, y, type: 'crystal', collected: false });
      } else {
        cells.push({ x, y, type: 'empty' });
      }
    }
  }
  return cells;
}

export const ADVENTURE_LEVELS: LevelConfig[] = [
  // ========================================================
  // SEVİYE 1: UZAY ÜSSÜNDEN KAÇIŞ (5 ZORUNLU FEN SORUSU)
  // ========================================================
  {
    id: 'level_1',
    levelNumber: 1,
    title: 'Uzay Üssünden Kaçış',
    subtitle: 'Güneş Sistemi ve Gezegenler',
    topic: 'Güneş Sistemi',
    description: 'Uzay üssünün koridorlarında 5 ayrı kilitli fen kapısı bulunuyor! Güneş Sistemi ve gezegen sorularını çözerek kapıları aç ve çıkış kapsülüne ulaş.',
    gridWidth: 8,
    gridHeight: 7,
    startPos: { x: 1, y: 5 },
    startDir: 3, // North
    targetPos: { x: 6, y: 1 },
    parCommands: 10,
    codeMode: 'both',
    scienceObjective: 'Güneş Sistemi’ndeki gezegenlerin büyüklük, yakınlık ve özelliklerini açıkla.',
    codingObjective: 'Sıralı komutlar, kısayollar (2x, 3x İleri) ve blok kodlama ile hedefe ulaş.',
    questionIds: ['q_gs_01', 'q_gs_04', 'q_gs_05', 'q_gs_02', 'q_gs_07'],
    cells: createGrid(
      8,
      7,
      [
        // Perimeter boundaries
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
        [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6],
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [7, 1], [7, 2], [7, 3], [7, 4], [7, 5],
        // Internal wall dividers creating mandatory snake corridor
        [2, 2], [2, 3], [2, 4], [2, 5],
        [4, 1], [4, 2], [4, 3], [4, 4],
        [6, 2], [6, 3], [6, 4], [6, 5]
      ],
      // Energy Crystals
      [[1, 1], [3, 2], [5, 5]],
      // 5 Mandatory Questions placed on unavoidable corridor bottleneck tiles
      [
        { pos: [1, 3], qId: 'q_gs_01' }, // Kapı 1: En yakın ve en küçük gezegen (Merkür)
        { pos: [2, 1], qId: 'q_gs_04' }, // Kapı 2: En sıcak gezegen (Venüs)
        { pos: [3, 4], qId: 'q_gs_05' }, // Kapı 3: Kızıl Gezegen (Mars)
        { pos: [5, 4], qId: 'q_gs_02' }, // Kapı 4: En büyük gaz devi (Jüpiter)
        { pos: [5, 2], qId: 'q_gs_07' }  // Kapı 5: Görkemli halkalar (Satürn)
      ]
    )
  },

  // ========================================================
  // SEVİYE 2: GEZEGENLER ARASI YOLCULUK (5 ZORUNLU FEN SORUSU)
  // ========================================================
  {
    id: 'level_2',
    levelNumber: 2,
    title: 'Gezegenler Arası Yolculuk',
    subtitle: 'Karasal ve Gaz Devleri',
    topic: 'Gezegenlerin Özellikleri',
    description: 'Asteroit kuşağı koridorlarında 5 ayrı fen güvenlik kapısı seni bekliyor. Karasal, gaz devleri ve halkalı gezegen sorularını çözmeden çıkışa varamazsın.',
    gridWidth: 9,
    gridHeight: 7,
    startPos: { x: 1, y: 5 },
    startDir: 3, // North
    targetPos: { x: 7, y: 1 },
    parCommands: 12,
    codeMode: 'both',
    scienceObjective: 'İç ve dış gezegenler ile halkalı gezegenlerin özelliklerini ayırt et.',
    codingObjective: 'Döngü blokları (Tekrarla) veya adım çarpanları (2x, 3x) ile kodu optimize et.',
    questionIds: ['q_gs_03', 'q_gs_06', 'q_gs_08', 'q_gs_09', 'q_gs_12'],
    cells: createGrid(
      9,
      7,
      [
        // Perimeter
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0],
        [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6],
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
        // Internal corridors
        [2, 2], [2, 3], [2, 4], [2, 5],
        [4, 1], [4, 2], [4, 3], [4, 4],
        [6, 2], [6, 3], [6, 4], [6, 5]
      ],
      // Crystals
      [[1, 1], [3, 2], [5, 5], [7, 4]],
      // 5 Mandatory Questions
      [
        { pos: [1, 4], qId: 'q_gs_03' }, // Kapı 1: İç / Dış gezegenler
        { pos: [1, 2], qId: 'q_gs_06' }, // Kapı 2: Asteroit Kuşağı
        { pos: [3, 3], qId: 'q_gs_08' }, // Kapı 3: Yan yatmış dönen Uranüs
        { pos: [5, 3], qId: 'q_gs_09' }, // Kapı 4: En uzak gezegen Neptün
        { pos: [6, 1], qId: 'q_gs_12' }  // Kapı 5: Dış gezegenlerin ortak özellikleri
      ]
    )
  },

  // ========================================================
  // SEVİYE 3: TUTULMA LABORATUVARI (5 ZORUNLU FEN SORUSU)
  // ========================================================
  {
    id: 'level_3',
    levelNumber: 3,
    title: 'Tutulma Laboratuvarı',
    subtitle: 'Güneş ve Ay Tutulmaları',
    topic: 'Tutulmalar ve Işık',
    description: 'Optik koridorlarda 5 fen kapısı var! Güneş tutulması, Ay tutulması, ışığın doğrusal yayılması ve gölge sorularını bilerek kalkanları kaldır.',
    gridWidth: 9,
    gridHeight: 8,
    startPos: { x: 1, y: 6 },
    startDir: 3, // North
    targetPos: { x: 7, y: 1 },
    parCommands: 14,
    codeMode: 'both',
    scienceObjective: 'Güneş ve Ay tutulmalarında gök cisimlerinin sıralanışını ve ışığın doğrusal yayılmasını açıkla.',
    codingObjective: 'Koşullu mantık (Eğer/Değilse), döngüler ve adım kısayollarıyla lazerleri güvenle geç.',
    questionIds: ['q_tut_01', 'q_tut_02', 'q_tut_03', 'q_tut_04', 'q_tut_05'],
    cells: createGrid(
      9,
      8,
      [
        // Outer boundaries
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0],
        [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7],
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
        [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6],
        // Internal lab walls
        [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
        [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
        [6, 2], [6, 3], [6, 4], [6, 5], [6, 6]
      ],
      // Crystals
      [[1, 2], [3, 6], [5, 2], [7, 4]],
      // 5 Mandatory Questions
      [
        { pos: [1, 4], qId: 'q_tut_01' }, // Kapı 1: Güneş Tutulması Sıralaması
        { pos: [2, 1], qId: 'q_tut_02' }, // Kapı 2: Ay Tutulması Sıralaması
        { pos: [3, 3], qId: 'q_tut_03' }, // Kapı 3: Güneş Tutulmasında Yeniay Evresi
        { pos: [5, 4], qId: 'q_tut_04' }, // Kapı 4: Ay Tutulmasında Dolunay Evresi
        { pos: [6, 1], qId: 'q_tut_05' }  // Kapı 5: Işığın Doğrusal Yayılması
      ],
      // Hazard lasers
      [[3, 2], [5, 5]]
    )
  },

  // ========================================================
  // SEVİYE 4: KUVVETLER ARENASI (5 ZORUNLU FEN SORUSU)
  // ========================================================
  {
    id: 'level_4',
    levelNumber: 4,
    title: 'Kuvvetler Arenası',
    subtitle: 'Kuvvetin Ölçülmesi ve Yönü',
    topic: 'Kuvvet ve Vektörler',
    description: 'Manyetik platformlarda 5 ayrı kuvvet kapısı yer alıyor. Dinamometre, Newton birimi, kuvvetin özellikleri ve aynı yönlü bileşke kuvvet sorularını yanıtla.',
    gridWidth: 9,
    gridHeight: 8,
    startPos: { x: 1, y: 6 },
    startDir: 3, // North
    targetPos: { x: 7, y: 1 },
    parCommands: 14,
    codeMode: 'both',
    scienceObjective: 'Kuvvetin büyüklüğü, doğrultusu, yönü, dinamometre ile ölçümü ve aynı yönlü bileşkeyi kavra.',
    codingObjective: 'Yön komutları, adım çarpanları (2x, 3x) ve algoritma planlamasını birleştir.',
    questionIds: ['q_kuv_01', 'q_kuv_02', 'q_kuv_03', 'q_ayni_01', 'q_ayni_02'],
    cells: createGrid(
      9,
      8,
      [
        // Perimeter
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0],
        [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7],
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
        [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6],
        // Arena walls
        [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
        [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
        [6, 2], [6, 3], [6, 4], [6, 5], [6, 6]
      ],
      // Crystals
      [[1, 1], [3, 6], [5, 2], [7, 5]],
      // 5 Mandatory Questions
      [
        { pos: [1, 4], qId: 'q_kuv_01' }, // Kapı 1: Dinamometre ve Newton
        { pos: [2, 1], qId: 'q_kuv_02' }, // Kapı 2: Kuvvetin 4 Temel Özelliği
        { pos: [3, 4], qId: 'q_kuv_03' }, // Kapı 3: Dinamometrede Bölme Hesabı
        { pos: [5, 3], qId: 'q_ayni_01' }, // Kapı 4: Aynı Yönlü Kuvvetlerin Bileşkesi
        { pos: [6, 1], qId: 'q_ayni_02' }  // Kapı 5: 25N + 35N İtiş Gücü
      ]
    )
  },

  // ========================================================
  // SEVİYE 5: BİLEŞKE KUVVET USTASI (5 ZORUNLU FEN SORUSU)
  // ========================================================
  {
    id: 'level_5',
    levelNumber: 5,
    title: 'Bileşke Kuvvet Ustası',
    subtitle: 'Zıt Kuvvetler ve Denge Durumu',
    topic: 'Bileşke Kuvvet & Denge',
    description: 'Gravite reaktöründe 5 zorunlu kontrol kapısı var. Zıt kuvvetler, halat çekme, net kuvvet ve dengelenmiş kuvvet (R = 0 N) durumlarını analiz et.',
    gridWidth: 10,
    gridHeight: 8,
    startPos: { x: 1, y: 6 },
    startDir: 3, // North
    targetPos: { x: 8, y: 1 },
    parCommands: 16,
    codeMode: 'both',
    scienceObjective: 'Zıt kuvvetlerin bileşkesini hesapla; dengelenmiş ve dengelenmemiş kuvvetleri ayırt et.',
    codingObjective: 'Döngü blokları (Tekrarla) ile uzun koridorları kompakt kodla aş.',
    questionIds: ['q_zit_01', 'q_zit_02', 'q_deng_01', 'q_deng_02', 'q_deng_04'],
    cells: createGrid(
      10,
      8,
      [
        // Outer boundaries
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0],
        [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7],
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
        [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6],
        // Reactor barriers
        [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
        [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
        [6, 2], [6, 3], [6, 4], [6, 5], [6, 6]
      ],
      // Crystals
      [[1, 1], [3, 6], [5, 2], [7, 5]],
      // 5 Mandatory Questions
      [
        { pos: [1, 4], qId: 'q_zit_01' },  // Kapı 1: Zıt Yönlü Kuvvetler
        { pos: [2, 1], qId: 'q_zit_02' },  // Kapı 2: Halat Çekme Yarışı
        { pos: [3, 4], qId: 'q_deng_01' }, // Kapı 3: Dengelenmiş Kuvvet (R=0)
        { pos: [5, 4], qId: 'q_deng_02' }, // Kapı 4: Masadaki Kitap
        { pos: [7, 3], qId: 'q_deng_04' }  // Kapı 5: Sabit Süratli Tren
      ],
      // Lasers
      [[5, 6], [7, 1]]
    )
  },

  // ========================================================
  // SEVİYE 6: BÜYÜK FENKOD FİNALİ (6 ZORUNLU FEN SORUSU)
  // ========================================================
  {
    id: 'level_6',
    levelNumber: 6,
    title: 'Büyük FenKod Finali',
    subtitle: 'Tüm Fen ve Kodlama Güçlerini Birleştir!',
    topic: 'Fen Bilimleri ve Kodlama Büyük Sentezi',
    description: 'Galaktik Ana Gemi Merkezinde 6 kilitli kapı seni bekliyor! Gezegenler, tutulmalar, bileşke kuvvet ve denge durumlarını çözerek şampiyon ol!',
    gridWidth: 11,
    gridHeight: 9,
    startPos: { x: 1, y: 7 },
    startDir: 3, // North
    targetPos: { x: 9, y: 1 },
    parCommands: 18,
    codeMode: 'both',
    scienceObjective: 'Güneş sistemi, tutulmalar ve kuvvet konularının tüm MEB kazanımlarını hatasız sentezle.',
    codingObjective: 'Döngü, koşul ve adım çarpanlarını optimize ederek mükemmel algoritmayı yaz.',
    questionIds: ['q_gs_10', 'q_tut_06', 'q_kuv_05', 'q_bil_01', 'q_deng_03', 'q_deng_05'],
    cells: createGrid(
      11,
      9,
      [
        // Outer boundaries
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0],
        [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [10, 8],
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
        [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [10, 7],
        // Final maze dividers
        [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7],
        [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
        [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7],
        [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6]
      ],
      // Energy Crystals
      [[1, 1], [3, 7], [5, 1], [7, 7]],
      // 6 Mandatory Questions
      [
        { pos: [1, 4], qId: 'q_gs_10' }, // Kapı 1: Uydusu olmayan gezegenler
        { pos: [2, 1], qId: 'q_tut_06' }, // Kapı 2: Yörünge eğikliği ve tutulmalar
        { pos: [3, 5], qId: 'q_kuv_05' }, // Kapı 3: Yayların esnekliği ve dinamometre
        { pos: [5, 4], qId: 'q_bil_01' }, // Kapı 4: Bileşke (Net) Kuvvet tanımı
        { pos: [6, 7], qId: 'q_deng_03' }, // Kapı 5: Dengelenmemiş kuvvet (Yavaşlayan otobüs)
        { pos: [8, 7], qId: 'q_deng_05' }  // Kapı 6: Dengelenmiş kuvvet tamamlama (Doğu 40N -> Batı 40N)
      ],
      // Lasers
      [[5, 2], [7, 3]]
    )
  }
];

