import React, { useState } from 'react';
import { Student, Character } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { soundManager } from '../utils/audio';
import { storage } from '../utils/storage';
import { QrAccessModal } from './QrAccessModal';
import {
  Rocket,
  Users,
  Code2,
  Smile,
  ShieldCheck,
  Trophy,
  Sparkles,
  Zap,
  Globe2,
  Atom,
  QrCode,
  Smartphone,
  Award
} from 'lucide-react';

interface MainMenuProps {
  activeStudent: Student;
  selectedCharId: string;
  onSelectAction: (
    action: 'adventure' | 'competition' | 'certificates' | 'characters' | 'teacher'
  ) => void;
  onOpenStudentModal: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  activeStudent,
  selectedCharId,
  onSelectAction,
  onOpenStudentModal,
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const currentHero = CHARACTERS.find((c) => c.id === selectedCharId) || CHARACTERS[0];
  const customization = storage.getCustomization();

  const handleAction = (
    action: 'adventure' | 'competition' | 'certificates' | 'characters' | 'teacher'
  ) => {
    soundManager.playClick();
    onSelectAction(action);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* QR Access Modal */}
      <QrAccessModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

      {/* Background Ambience: Planets & Stars */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/5 blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="relative z-10 text-center max-w-3xl pt-2 sm:pt-4">
        {/* Floating Science Badges with School Name */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-black shadow-lg shadow-amber-950/40 mb-3 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>YILDIZKENT ORTAOKULU</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-300 font-semibold">Fen Bilimleri & Kodlama Platformu</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
          FEN KOD <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-teal-300 bg-clip-text text-transparent">MACERASI</span>
        </h1>
        <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-base sm:text-xl font-black text-amber-400 tracking-wide">
            👩‍🏫 Merve Öğretmen
          </span>
          <span className="text-xs text-amber-300/80 font-bold hidden sm:inline">• Yıldızkent Ortaokulu</span>
        </div>
        <p className="mt-2 text-sm sm:text-base font-medium text-slate-300">
          Kodla, keşfet, öğren, hedefe ulaş!
        </p>

        {/* Selected Character & Student Spotlight */}
        <div className="mt-6 inline-flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-800 border border-slate-700/80 flex items-center justify-center shadow-inner relative">
            <CharacterAvatar
              characterId={selectedCharId}
              state="cheer"
              size={54}
              outfitId={customization.outfitId}
              accessoryId={customization.accessoryId}
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {currentHero.tag}
              </span>
              <span className="text-[11px] text-slate-500">·</span>
              <span className="text-xs text-slate-400 font-semibold">{currentHero.name}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              {activeStudent.fullName}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>{activeStudent.grade}-{activeStudent.section} Sınıfı</span>
              <span className="text-amber-400 font-mono font-bold">
                ⭐ {activeStudent.totalScore} Puan
              </span>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onOpenStudentModal();
                }}
                className="text-cyan-400 hover:text-cyan-300 underline font-semibold text-xs cursor-pointer ml-1"
              >
                Değiştir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 5 Action Cards */}
      <div className="relative z-10 w-full max-w-5xl my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. YENİ MACERA */}
        <button
          type="button"
          onClick={() => handleAction('adventure')}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-900 border-2 border-cyan-500/50 hover:border-cyan-400 shadow-xl shadow-cyan-950/40 text-left transition-all duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Rocket className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-wider text-cyan-400 uppercase">
              ANA HİKAYE
            </span>
            <h3 className="text-xl font-black text-white mt-1 group-hover:text-cyan-300 transition-colors">
              1. YENİ MACERA
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Uzay üssünden başlayarak 6 seviyeli galaktik macerayı tamamla. Güneş sistemi ve kuvvet sorularını çöz, kapıları aç!
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
            <span>Maceraya Başla</span>
            <span>→</span>
          </div>
        </button>

        {/* 2. SINIF YARIŞMASI */}
        <button
          type="button"
          onClick={() => handleAction('competition')}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-500/50 hover:border-amber-400 shadow-xl shadow-amber-950/40 text-left transition-all duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-wider text-amber-400 uppercase flex items-center gap-1">
              <span>⚡</span>
              <span>AKILLI TAHTA İKİLİ DÜELLO (2 DAKİKA)</span>
            </span>
            <h3 className="text-xl font-black text-white mt-1 group-hover:text-amber-300 transition-colors">
              2. SINIF YARIŞMASI
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Ekran ikiye bölünür; 2 öğrenci akıllı tahtada yanyana 2 dakika yarışır. 2 dakikada en fazla macera tamamlayan kazanır!
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
            <span>Düelloya Katıl (2 Kişi Yanyana)</span>
            <span>→</span>
          </div>
        </button>

        {/* 3. BAŞARI BELGELERİ & ROZETLER */}
        <button
          type="button"
          onClick={() => handleAction('certificates')}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-yellow-950/80 via-slate-900 to-slate-900 border-2 border-amber-400/60 hover:border-amber-300 shadow-xl shadow-amber-950/40 text-left transition-all duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-wider text-amber-400 uppercase flex items-center gap-1">
              <span>📜</span>
              <span>RESMÎ SERTİFİKA & ROZETLER</span>
            </span>
            <h3 className="text-xl font-black text-white mt-1 group-hover:text-amber-300 transition-colors">
              3. BAŞARI BELGELERİ & ROZETLER
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              T.C. MEB ve Yıldızkent OO onaylı Merve Öğretmen Başarı Belgeni görüntüle ve yazdır! Kazandığın 12 bilim & kodlama rozetini incele.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
            <span>Belge ve Rozetleri Görüntüle</span>
            <span>→</span>
          </div>
        </button>

        {/* 4. KARAKTERİMİ SEÇ */}
        <button
          type="button"
          onClick={() => handleAction('characters')}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-900 border-2 border-purple-500/50 hover:border-purple-400 shadow-xl shadow-purple-950/40 text-left transition-all duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Smile className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-wider text-purple-400 uppercase">
              10 KAHRAMAN & GARDIROP
            </span>
            <h3 className="text-xl font-black text-white mt-1 group-hover:text-purple-300 transition-colors">
              4. KARAKTER & KOSTÜM SEÇ
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              10 sevimli bilim kahramanı arasından seçim yap; laboratuvar önlüğü, siber zırh, gözlük, büyüteç ve altın taç gibi aksesuarlarla donat!
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
            <span>Gardırop & Karakterlere Git</span>
            <span>→</span>
          </div>
        </button>

        {/* 5. ÖĞRETMEN PANELİ */}
        <button
          type="button"
          onClick={() => handleAction('teacher')}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border-2 border-indigo-500/50 hover:border-indigo-400 shadow-xl shadow-indigo-950/40 text-left transition-all duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-wider text-indigo-400 uppercase">
              YÖNETİM & ANALİZ
            </span>
            <h3 className="text-xl font-black text-white mt-1 group-hover:text-indigo-300 transition-colors">
              5. ÖĞRETMEN PANELİ
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Öğrenci listesi, Recharts görsel başarı analizleri ve MEB soru havuzu yönetimi.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-300 group-hover:translate-x-1 transition-transform">
            <span>Öğretmen Paneline Giriş Yap</span>
            <span>→</span>
          </div>
        </button>

        {/* 6. AKILLI TAHTA & CEP TELEFONU KAREKOD ERİŞİMİ */}
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-cyan-950/90 via-slate-900 to-slate-900 border-2 border-cyan-400/60 hover:border-cyan-300 shadow-xl shadow-cyan-950/50 text-left transition-all duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between ring-1 ring-cyan-500/30"
        >
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-wider text-cyan-400 uppercase flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              AKILLI TAHTA & MOBİL
            </span>
            <h3 className="text-xl font-black text-white mt-1 group-hover:text-cyan-300 transition-colors">
              6. TELEFONDAN KAREKODLA OYNA
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Akıllı tahtada açılan karekodu cep telefonunun kamerasıyla tarat, oyuna doğrudan telefonundan devam et!
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-cyan-300 group-hover:translate-x-1 transition-transform">
            <span>Karekodu Göster</span>
            <span>📱</span>
          </div>
        </button>
      </div>

      {/* Footer Info & Pardus Download Bar */}
      <div className="relative z-10 text-center text-xs text-slate-500 py-3 border-t border-slate-900/80 w-full max-w-5xl flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span>FENKOD MACERASI · Pardus, Akıllı Tahta, Tablet ve Tarayıcı Uyumlu</span>
        </div>
        <button
          type="button"
          onClick={() => {
            soundManager.playCorrect();
            import('../utils/pardusShortcut').then((m) => m.downloadPardusDesktopShortcut());
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-md cursor-pointer transition transform hover:scale-105"
        >
          <span>🐧 Pardus Masaüstü Kısayolu İndir (.desktop)</span>
        </button>
      </div>
    </div>
  );
};
