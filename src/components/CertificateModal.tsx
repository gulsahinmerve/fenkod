import React, { useState } from 'react';
import { Student } from '../types/game';
import { BADGES } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { soundManager } from '../utils/audio';
import { storage } from '../utils/storage';
import {
  Award,
  Printer,
  ArrowLeft,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
  Star,
  Download,
  ShieldCheck,
  Medal
} from 'lucide-react';

interface CertificateModalProps {
  student: Student;
  selectedCharId: string;
  onBack: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  student,
  selectedCharId,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'certificate' | 'badges'>('certificate');
  const customization = storage.getCustomization();
  const studentResults = storage.getStudentResults(student.id);
  const earnedBadgesCount = Math.min(12, Math.max(3, student.completedLevelsCount * 2 + 1));

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in select-none">
      {/* Print Hide Controls */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 cursor-pointer transition shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Menüye Dön</span>
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('certificate');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'certificate'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>📜 Başarı Belgesi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('badges');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Medal className="w-4 h-4" />
            <span>🏅 Rozetlerim ({earnedBadgesCount} / {EXPANDED_BADGES.length})</span>
          </button>
        </div>

        {activeTab === 'certificate' && (
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / PDF İndir</span>
          </button>
        )}
      </div>

      {/* TAB 1: OFFICIAL CERTIFICATE */}
      {activeTab === 'certificate' && (
        <div className="my-6 flex justify-center">
          {/* Certificate Paper Frame */}
          <div className="relative w-full max-w-4xl bg-gradient-to-b from-amber-50 via-white to-amber-50 text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-8 border-amber-300/80 ring-4 ring-amber-600/40 print:m-0 print:shadow-none print:border-4">
            {/* Elegant Corner Ornaments */}
            <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-xl pointer-events-none" />

            {/* Inner Border */}
            <div className="border-2 border-dashed border-amber-400/60 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
              {/* Subtle Watermark Seal */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Trophy className="w-96 h-96 text-amber-900" />
              </div>

              {/* Ministry & School Header */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white mb-2">
                  T.C.
                </div>
                <h3 className="text-xs sm:text-sm font-black tracking-widest text-slate-700 uppercase">
                  T.C. MİLLÎ EĞİTİM BAKANLIĞI
                </h3>
                <h2 className="text-sm sm:text-base font-black tracking-wider text-amber-700 uppercase">
                  YILDIZKENT ORTAOKULU MÜDÜRLÜĞÜ
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 my-2 rounded-full" />
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mt-1">
                  ÜSTÜN BAŞARI BELGESİ
                </h1>
                <p className="text-xs font-bold text-amber-800 tracking-wider uppercase mt-0.5">
                  Fen Bilimleri ve Algoritmik Blok Kodlama Programı
                </p>
              </div>

              {/* Awarded To Details */}
              <div className="my-6">
                <p className="text-sm text-slate-600 italic">Bu başarı belgesi,</p>
                <div className="inline-block border-b-2 border-amber-500 pb-1 px-8 my-2">
                  <h3 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif tracking-wide">
                    {student.fullName || 'Öğrenci'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
                  Yıldızkent Ortaokulu {student.grade}-{student.section} Şubesi Öğrencisi
                </p>
              </div>

              {/* Laudatory Body Text */}
              <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed my-4">
                Öğrencimiz, <strong>Fen Kod Macerası</strong> eğitim modülünde Güneş Sistemi, Gezegenler, Tutulmalar, 
                Kuvvetin Ölçülmesi ve Bileşke Kuvvet konularındaki MEB kazanım sorularını ve algoritmik blok kodlama 
                görevlerini üstün gayret ve başarıyla tamamlayarak bu belgeyi almaya hak kazanmıştır.
              </p>

              {/* Achievement Metrics Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 max-w-2xl mx-auto bg-amber-100/60 border border-amber-300 rounded-2xl p-3 text-left">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-amber-200">
                  <div className="text-[10px] font-bold text-slate-500">Kazanılan Puan</div>
                  <div className="text-lg font-black text-amber-600 font-mono">⭐ {student.totalScore || 620}</div>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-sm border border-amber-200">
                  <div className="text-[10px] font-bold text-slate-500">Doğru Fen Sorusu</div>
                  <div className="text-lg font-black text-emerald-600 font-mono">🔬 {student.questionsCorrect || 18} Adet</div>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-sm border border-amber-200">
                  <div className="text-[10px] font-bold text-slate-500">Tamamlanan Seviye</div>
                  <div className="text-lg font-black text-cyan-600 font-mono">🚀 {student.completedLevelsCount || 6} Seviye</div>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-sm border border-amber-200">
                  <div className="text-[10px] font-bold text-slate-500">Başarı Derecesi</div>
                  <div className="text-sm font-black text-purple-700">⭐⭐⭐ Pekiyi</div>
                </div>
              </div>

              {/* Official Seal and Signatures */}
              <div className="mt-8 pt-6 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                {/* Teacher Signature */}
                <div className="text-center">
                  <div className="text-xs text-slate-500 font-medium">Tarih: {currentDate}</div>
                  <div className="font-serif italic font-bold text-base text-slate-800 my-1">
                    Merve Öğretmen
                  </div>
                  <div className="text-xs font-black text-slate-700">Fen Bilimleri Öğretmeni</div>
                  <div className="text-[10px] text-slate-500">Zümre Başkanı</div>
                </div>

                {/* Golden Official Stamp */}
                <div className="w-24 h-24 rounded-full border-4 border-amber-500 bg-amber-400/20 flex flex-col items-center justify-center p-1 text-center shadow-md rotate-[-8deg]">
                  <Sparkles className="w-5 h-5 text-amber-600 mb-0.5" />
                  <span className="text-[8px] font-black uppercase text-amber-800 tracking-tighter leading-tight">
                    MERVE ÖĞRETMEN<br />RESMÎ ONAYLI<br />DİJİTAL MÜHÜR
                  </span>
                </div>

                {/* School Director Signature */}
                <div className="text-center">
                  <div className="text-xs text-slate-500 font-medium">Yıldızkent / 2026</div>
                  <div className="font-serif italic font-bold text-base text-slate-800 my-1">
                    Okul Müdürlüğü
                  </div>
                  <div className="text-xs font-black text-slate-700">Yıldızkent Ortaokulu</div>
                  <div className="text-[10px] text-slate-500">Kurum Kodu: 754210</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPANDED BADGES SHOWCASE */}
      {activeTab === 'badges' && (
        <div className="my-6">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>Fen Bilimleri ve Kodlama Rozetleri</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Fen sorularını doğru çözerek, algoritmaları en az adımla tamamlayarak ve ikili düellolarda yarışarak yeni rozetler kazan!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXPANDED_BADGES.map((b, idx) => {
              const isEarned = idx < earnedBadgesCount;
              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                    isEarned
                      ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-950/30'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 ${
                      isEarned
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isEarned ? b.icon : '🔒'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{b.title}</h4>
                      {isEarned ? (
                        <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40">
                          KAZANILDI
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                          KİLİTLİ
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium text-cyan-400 mt-0.5">{b.categoryText}</div>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">{b.description}</p>
                    <div className="text-[10px] text-amber-400/80 mt-1.5 font-semibold">
                      Hedef: {b.conditionText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const EXPANDED_BADGES = [
  {
    id: 'badge_algo',
    title: 'Algoritma Ustası',
    categoryText: 'Kodlama Becerisi',
    description: 'Tüm komutları kusursuz sıralama ve döngülerle çalıştırdın.',
    icon: '⚡',
    conditionText: 'Bir seviyeyi hedef komut sayısıyla hatasız bitir.'
  },
  {
    id: 'badge_science',
    title: 'Fen Dedektifi',
    categoryText: 'Fen Bilimleri',
    description: 'Fen bilimleri sorularına ilk denemede üst üste hatasız yanıt verdin.',
    icon: '🔬',
    conditionText: '3 fen sorusunu ardışık olarak ilk denemede çöz.'
  },
  {
    id: 'badge_force',
    title: 'Bileşke Kuvvet Uzmanı',
    categoryText: 'Fizik & Vektörler',
    description: 'Zıt ve aynı yönlü kuvvetlerin net bileşkesini hatasız hesapladın.',
    icon: '🎯',
    conditionText: 'Kuvvetler Arenası seviyesindeki tüm kapıları aç.'
  },
  {
    id: 'badge_debug',
    title: 'Hata Ayıklama Kahramanı',
    categoryText: 'Kodlama Becerisi',
    description: 'Algoritmanı gözden geçirip duvara çarpmadan rotanı başarıyla optimize ettin.',
    icon: '🛡️',
    conditionText: 'Çarpışma olmadan labirenti tamamla.'
  },
  {
    id: 'badge_space',
    title: 'Uzay Kaşifi',
    categoryText: 'Astronomi',
    description: 'Güneş sistemi gezegenlerini ve tutulma düzenlerini ezber bozan bir başarıyla geçtin.',
    icon: '🚀',
    conditionText: '1. ve 2. seviyeleri yıldızlarla tamamla.'
  },
  {
    id: 'badge_master',
    title: 'FenKod Büyük Ustası',
    categoryText: 'Büyük Şampiyonluk',
    description: 'Tüm macera seviyelerini ve büyük finali 3 yıldızla tamamladın!',
    icon: '👑',
    conditionText: '6. Büyük Final Seviyesini başarıyla bitir.'
  },
  {
    id: 'badge_balance',
    title: 'Denge Mühendisi',
    categoryText: 'Kuvvet & Denge',
    description: 'Dengelenmiş kuvvetler (R = 0 N) durumunu analiz edip cisimlerin hareketini doğru tahmin ettin.',
    icon: '⚖️',
    conditionText: 'Denge reaktörü seviyesini tamamla.'
  },
  {
    id: 'badge_planets',
    title: 'Gezegenler Fatihi',
    categoryText: 'Astronomi',
    description: 'Karasal ve gaz devlerinin tüm özelliklerini ve uydularını eksiksiz ayırt ettin.',
    icon: '🪐',
    conditionText: 'Gezegenler Arası Yolculuk seviyesinde 5 soruyu çöz.'
  },
  {
    id: 'badge_eclipse',
    title: 'Tutulma Bilgini',
    categoryText: 'Optik & Işık',
    description: 'Güneş ve Ay tutulmalarındaki gölge alanlarını ve gök cisimlerinin hizalanışını kavradın.',
    icon: '🌑',
    conditionText: 'Tutulma Laboratuvarı seviyesini hatasız geç.'
  },
  {
    id: 'badge_dynamometer',
    title: 'Newton Ölçüm Ustası',
    categoryText: 'Fizik',
    description: 'Dinamometre yay uzamalarını ve bölme hesaplamalarını hatasız tamamladın.',
    icon: '🧲',
    conditionText: 'Dinamometre sorularının tümüne doğru yanıt ver.'
  },
  {
    id: 'badge_speed',
    title: 'Sürat Şampiyonu',
    categoryText: 'Akıllı Tahta Düellosu',
    description: 'Akıllı tahta ikili sınıf yarışmasında hedefe en kısa sürede ulaştın.',
    icon: '🏁',
    conditionText: 'İlk Bitiren Kazanır düellosunda şampiyon ol.'
  },
  {
    id: 'badge_crystal',
    title: 'Kristal Koleksiyoncusu',
    categoryText: 'Özel Başarı',
    description: 'Tüm seviyelerdeki gizli enerji kristallerini eksiksiz topladın.',
    icon: '💎',
    conditionText: 'Seviyelerdeki 15 kristalin tümünü topla.'
  }
];
