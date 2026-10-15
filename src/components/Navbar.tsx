import React, { useState, useEffect } from 'react';
import { Student } from '../types/game';
import { soundManager } from '../utils/audio';
import { storage } from '../utils/storage';
import { CharacterAvatar } from './CharacterAvatar';
import { downloadPardusDesktopShortcut } from '../utils/pardusShortcut';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Home,
  ShieldCheck,
  Rocket,
  Download,
  Terminal,
  Check,
  QrCode
} from 'lucide-react';
import { QrAccessModal } from './QrAccessModal';

interface NavbarProps {
  activeStudent: Student;
  selectedCharId: string;
  onOpenStudentModal: () => void;
  onGoHome: () => void;
  onOpenTeacherPanel: () => void;
  currentScreen: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeStudent,
  selectedCharId,
  onOpenStudentModal,
  onGoHome,
  onOpenTeacherPanel,
  currentScreen,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPardusToast, setShowPardusToast] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    soundManager.setMuted(next);
    setIsMuted(next);
    if (!next) soundManager.playClick();
  };

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleDownloadPardus = () => {
    soundManager.playCorrect();
    downloadPardusDesktopShortcut();
    setShowPardusToast(true);
    setTimeout(() => setShowPardusToast(false), 4000);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-2 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 select-none">
      {/* Toast Alert for Pardus Download */}
      {showPardusToast && (
        <div className="fixed top-16 right-5 z-50 px-4 py-3 rounded-2xl bg-cyan-950/95 border-2 border-cyan-400 text-cyan-100 text-xs font-bold shadow-2xl flex items-center gap-3 animate-fade-in">
          <Check className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <div className="text-cyan-300 font-black">Pardus Kısayolu İndirildi!</div>
            <div className="text-[11px] text-slate-300 font-normal">
              FenKod_Macerasi.desktop dosyasını Masaüstüne taşıyıp doğrudan açabilirsiniz.
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal for Smartboard / Mobile connection */}
      <QrAccessModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

      {/* Brand & Home */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer text-left"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-cyan-400/40">
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xs sm:text-base font-black tracking-tight bg-gradient-to-r from-cyan-400 via-amber-300 to-teal-300 bg-clip-text text-transparent">
                FEN KOD MACERASI
              </h1>
              <span className="text-[9px] sm:text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/60 px-1.5 sm:px-2 py-0.5 rounded-full tracking-wide shadow-sm">
                Yıldızkent OO
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] sm:text-xs font-black text-amber-400 flex items-center gap-1 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span>Merve Öğretmen</span>
              </p>
              <span className="hidden md:inline text-[10px] text-slate-500">•</span>
              <p className="hidden md:block text-[10px] text-slate-400 font-medium">
                Kodla, Keşfet, Öğren, Hedefe Ulaş!
              </p>
            </div>
          </div>
        </button>

        {currentScreen !== 'menu' && (
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onGoHome();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 cursor-pointer transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Ana Menü</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Active Student Pill */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onOpenStudentModal();
          }}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-200 text-xs font-bold shadow cursor-pointer transition group"
          title="Öğrenci Adını Gir veya Değiştir"
        >
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
            <CharacterAvatar
              characterId={selectedCharId}
              size={22}
              outfitId={storage.getCustomization().outfitId}
              accessoryId={storage.getCustomization().accessoryId}
            />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-slate-100 font-bold group-hover:text-cyan-400 transition-colors text-[11px] sm:text-xs truncate max-w-[80px] sm:max-w-none">
              {activeStudent.fullName}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono hidden xs:inline">
              {activeStudent.grade}-{activeStudent.section}
            </span>
          </div>
        </button>

        {/* QR Access Button for Smartboard */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setShowQrModal(true);
          }}
          title="Akıllı Tahta / Cep Telefonu Karekod Erişimi"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/60 text-cyan-300 hover:text-cyan-200 text-xs font-black cursor-pointer transition shadow shadow-cyan-950/40"
        >
          <QrCode className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="hidden md:inline">Karekodla Bağlan</span>
        </button>

        {/* Pardus Shortcut Download Button */}
        <button
          type="button"
          onClick={handleDownloadPardus}
          title="Pardus Masaüstü Kısayolu İndir (.desktop)"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 hover:text-emerald-200 text-xs font-bold cursor-pointer transition shadow"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Pardus Kısayolu</span>
        </button>

        {/* Teacher Panel Quick Access */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onOpenTeacherPanel();
          }}
          title="Öğretmen Paneli"
          className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 cursor-pointer transition"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          className={`p-1.5 sm:p-2 rounded-xl border cursor-pointer transition ${
            isMuted
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-400'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Fullscreen Toggle - Visible on BOTH Mobile and Smartboard */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Tam Ekrandan Çık (ESC)' : 'Akıllı Tahta / Cep Telefonu Tam Ekran'}
          className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border cursor-pointer transition shadow ${
            isFullscreen
              ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
              : 'bg-indigo-950/60 hover:bg-indigo-900/70 border-indigo-500/50 text-indigo-300 hover:text-indigo-200'
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-indigo-400" />}
          <span className="hidden xl:inline text-xs font-bold">
            {isFullscreen ? 'Küçült' : 'Tam Ekran'}
          </span>
        </button>
      </div>
    </header>
  );
};
