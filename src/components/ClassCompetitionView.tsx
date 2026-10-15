import React, { useState, useEffect } from 'react';
import { Student, DualMatchRecord, LeaderboardEntry, LevelConfig } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { ADVENTURE_LEVELS } from '../data/levels';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { CharacterAvatar } from './CharacterAvatar';
import { DualCompetitionArena } from './DualCompetitionArena';
import { QrAccessModal } from './QrAccessModal';
import {
  Trophy,
  Download,
  Play,
  Users,
  Clock,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  QrCode,
  Sparkles,
  Maximize2,
  Trash2,
  Swords,
  UserPlus,
  Flag
} from 'lucide-react';

interface ClassCompetitionViewProps {
  onStartStudentRun?: (student: Student, level: LevelConfig, timeLimitSeconds: number) => void;
  onBack: () => void;
}

export const ClassCompetitionView: React.FC<ClassCompetitionViewProps> = ({
  onBack,
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [students, setStudents] = useState<Student[]>(storage.getStudents());
  const [dualMatches, setDualMatches] = useState<DualMatchRecord[]>(storage.getDualMatches());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(storage.getLeaderboard());

  // Setup dual match state
  const [student1Id, setStudent1Id] = useState<string>(students[0]?.id || 'student_ada');
  const [student2Id, setStudent2Id] = useState<string>(students[1]?.id || students[0]?.id || 'student_can');
  const [char1Id, setChar1Id] = useState<string>('cosmic_cat');
  const [char2Id, setChar2Id] = useState<string>('robo_fen');
  const [durationSeconds, setDurationSeconds] = useState<number>(120); // 2 minutes standard
  const [gameMode, setGameMode] = useState<'timed' | 'first_to_finish'>('timed');
  const [targetAdventures, setTargetAdventures] = useState<number>(1);

  // Quick custom student names if students not registered
  const [quickP1Name, setQuickP1Name] = useState('');
  const [quickP2Name, setQuickP2Name] = useState('');

  // Active arena mode
  const [isArenaActive, setIsArenaActive] = useState<boolean>(false);

  // Tab: 'matches' or 'individual'
  const [activeTab, setActiveTab] = useState<'matches' | 'individual'>('matches');

  // Fullscreen helper
  const handleToggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const getP1Student = (): Student => {
    if (quickP1Name.trim()) {
      return {
        id: `p1_${Date.now()}`,
        fullName: quickP1Name.trim(),
        grade: '6',
        section: 'A',
        createdAt: Date.now(),
        totalScore: 0,
        questionsAnswered: 0,
        questionsCorrect: 0,
        completedLevelsCount: 0,
        lastActive: Date.now(),
      };
    }
    const found = students.find((s) => s.id === student1Id);
    if (found) return found;
    return {
      id: 'default_p1',
      fullName: '1. Öğrenci',
      grade: '6',
      section: 'A',
      createdAt: Date.now(),
      totalScore: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      completedLevelsCount: 0,
      lastActive: Date.now(),
    };
  };

  const getP2Student = (): Student => {
    if (quickP2Name.trim()) {
      return {
        id: `p2_${Date.now()}`,
        fullName: quickP2Name.trim(),
        grade: '6',
        section: 'B',
        createdAt: Date.now(),
        totalScore: 0,
        questionsAnswered: 0,
        questionsCorrect: 0,
        completedLevelsCount: 0,
        lastActive: Date.now(),
      };
    }
    const found = students.find((s) => s.id === student2Id);
    if (found) return found;
    return {
      id: 'default_p2',
      fullName: '2. Öğrenci',
      grade: '6',
      section: 'B',
      createdAt: Date.now(),
      totalScore: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      completedLevelsCount: 0,
      lastActive: Date.now(),
    };
  };

  const handleStartDuel = () => {
    soundManager.playClick();
    setIsArenaActive(true);
  };

  const handleExportCsv = () => {
    soundManager.playClick();
    if (activeTab === 'matches') {
      const rows = [
        ['Tarih', 'Kazanan', '1. Öğrenci', 'P1 Tamamlanan Macera', 'P1 Puan', '2. Öğrenci', 'P2 Tamamlanan Macera', 'P2 Puan', 'Süre (sn)']
      ];

      dualMatches.forEach((m) => {
        rows.push([
          `"${new Date(m.timestamp).toLocaleString('tr-TR')}"`,
          `"${m.winnerName}"`,
          `"${m.player1.studentName}"`,
          m.player1.adventuresCompleted.toString(),
          m.player1.score.toString(),
          `"${m.player2.studentName}"`,
          m.player2.adventuresCompleted.toString(),
          m.player2.score.toString(),
          m.durationSeconds.toString()
        ]);
      });

      const csvContent = '\uFEFF' + rows.map((e) => e.join(';')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fenkod_akilli_tahta_duellolari_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const rows = [
        ['Sıra', 'Öğrenci Adı', 'Sınıf/Şube', 'Puan', 'Doğru Fen Sorusu', 'Süre (sn)', 'Tarih']
      ];

      leaderboard.forEach((entry, idx) => {
        rows.push([
          (idx + 1).toString(),
          `"${entry.studentName}"`,
          `"${entry.gradeSection}"`,
          entry.score.toString(),
          entry.questionsSolved.toString(),
          entry.timeSeconds.toString(),
          `"${new Date(entry.timestamp).toLocaleDateString('tr-TR')}"`
        ]);
      });

      const csvContent = '\uFEFF' + rows.map((e) => e.join(';')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fenkod_liderlik_tablosu_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Düello geçmişini sıfırlamak istediğinize emin misiniz?')) {
      soundManager.playClick();
      storage.clearDualMatches();
      setDualMatches([]);
    }
  };

  // If Arena is active, render the split screen 2-player arena
  if (isArenaActive) {
    return (
      <DualCompetitionArena
        student1={getP1Student()}
        student2={getP2Student()}
        char1Id={char1Id}
        char2Id={char2Id}
        mode={gameMode}
        targetAdventures={targetAdventures}
        durationSeconds={durationSeconds}
        onBack={() => {
          setIsArenaActive(false);
          setDualMatches(storage.getDualMatches());
        }}
        onRematch={() => {
          setIsArenaActive(false);
          setDualMatches(storage.getDualMatches());
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 lg:p-8 animate-fade-in select-none">
      <QrAccessModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 cursor-pointer transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Menüye Dön</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-black text-amber-400 tracking-wide">
              👩‍🏫 Merve Öğretmen ile Sınıf Yarışması
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
            <Swords className="w-6 h-6 text-amber-400" />
            <span>Akıllı Tahta İkili Düello Modu</span>
          </h2>
          <p className="text-xs text-slate-400">
            2 öğrenci akıllı tahtada yanyana 2 dakika yarışır; en fazla macera tamamlayan kazanır!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition shadow"
            title="Akıllı Tahta Tam Ekran"
          >
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Tam Ekran</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setShowQrModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 text-xs font-black cursor-pointer transition shadow"
            title="Akıllı Tahta / Cep Telefonu Karekodu"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Karekod</span>
          </button>
        </div>
      </div>

      {/* Main Dual Setup Card */}
      <div className="my-6 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yanyana Ekranda Canlı Mücadele</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Yarışacak Öğrencileri ve Kahramanları Seçin
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center">
            {/* Player 1 Box (Left - Cyan Theme) */}
            <div className="lg:col-span-3 bg-slate-950/90 border-2 border-cyan-500/60 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs">
                  1. OYUNCU (SOL EKRAN)
                </span>
                <span className="text-xs text-cyan-300 font-bold">Mavi Köşe</span>
              </div>

              {/* Student Select or Quick Input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Öğrenci Seç:
                  </label>
                  <select
                    value={student1Id}
                    onChange={(e) => {
                      setStudent1Id(e.target.value);
                      setQuickP1Name('');
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.fullName} ({st.grade}-{st.section})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Veya Hızlı İsim Yaz:
                  </label>
                  <input
                    type="text"
                    value={quickP1Name}
                    onChange={(e) => setQuickP1Name(e.target.value)}
                    placeholder="Örn: Ada"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Character Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Karakterini Seç:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CHARACTERS.map((char) => {
                      const isSelected = char1Id === char.id;
                      return (
                        <button
                          key={char.id}
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setChar1Id(char.id);
                          }}
                          className={`flex flex-col items-center p-2 rounded-xl border text-center transition cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/50 shadow-lg'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <CharacterAvatar characterId={char.id} state={isSelected ? 'cheer' : 'idle'} size={36} />
                          <span className="text-[10px] font-bold text-slate-200 mt-1 truncate w-full">
                            {char.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: VS & Game Mode Settings */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center p-2 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 via-amber-400 to-rose-500 flex items-center justify-center font-black text-slate-950 text-base shadow-xl animate-pulse">
                VS
              </div>

              {/* Game Mode Selector */}
              <div className="mt-3 w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-2.5 space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1">
                  <span>Yarışma Türü</span>
                </label>

                <div className="grid grid-cols-1 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setGameMode('timed');
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      gameMode === 'timed'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Süreli (2 Dk)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setGameMode('first_to_finish');
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      gameMode === 'first_to_finish'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    <span>İlk Bitiren</span>
                  </button>
                </div>

                {gameMode === 'timed' ? (
                  <div className="pt-1">
                    <label className="block text-[9px] font-bold text-slate-400 mb-1">
                      Süre Limiti:
                    </label>
                    <select
                      value={durationSeconds}
                      onChange={(e) => setDurationSeconds(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-amber-500/50 rounded-lg px-2 py-1 text-xs font-black text-amber-300 focus:outline-none"
                    >
                      <option value={120}>2 Dakika (Önerilen)</option>
                      <option value={60}>1 Dakika (Hızlı)</option>
                      <option value={180}>3 Dakika (Maraton)</option>
                      <option value={300}>5 Dakika (Büyük Yarış)</option>
                    </select>
                  </div>
                ) : (
                  <div className="pt-1">
                    <label className="block text-[9px] font-bold text-slate-400 mb-1">
                      Hedef Seviye:
                    </label>
                    <select
                      value={targetAdventures}
                      onChange={(e) => setTargetAdventures(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-emerald-500/50 rounded-lg px-2 py-1 text-xs font-black text-emerald-300 focus:outline-none"
                    >
                      <option value={1}>1 Seviye (İlk Çıkan)</option>
                      <option value={2}>2 Seviye (Hızlı Tur)</option>
                      <option value={3}>3 Seviye (Şampiyonluk)</option>
                    </select>
                    <p className="text-[8px] text-emerald-400 mt-1 font-semibold leading-tight">
                      Hedefi ilk bitiren şampiyon olur!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Player 2 Box (Right - Amber/Red Theme) */}
            <div className="lg:col-span-3 bg-slate-950/90 border-2 border-amber-500/60 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                  2. OYUNCU (SAĞ EKRAN)
                </span>
                <span className="text-xs text-amber-300 font-bold">Kırmızı/Turuncu Köşe</span>
              </div>

              {/* Student Select or Quick Input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Öğrenci Seç:
                  </label>
                  <select
                    value={student2Id}
                    onChange={(e) => {
                      setStudent2Id(e.target.value);
                      setQuickP2Name('');
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.fullName} ({st.grade}-{st.section})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Veya Hızlı İsim Yaz:
                  </label>
                  <input
                    type="text"
                    value={quickP2Name}
                    onChange={(e) => setQuickP2Name(e.target.value)}
                    placeholder="Örn: Can"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Character Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Karakterini Seç:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CHARACTERS.map((char) => {
                      const isSelected = char2Id === char.id;
                      return (
                        <button
                          key={char.id}
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setChar2Id(char.id);
                          }}
                          className={`flex flex-col items-center p-2 rounded-xl border text-center transition cursor-pointer ${
                            isSelected
                              ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-500/50 shadow-lg'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <CharacterAvatar characterId={char.id} state={isSelected ? 'cheer' : 'idle'} size={36} />
                          <span className="text-[10px] font-bold text-slate-200 mt-1 truncate w-full">
                            {char.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Big CTA Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleStartDuel}
              className={`w-full max-w-xl py-4 px-6 rounded-2xl font-black text-base sm:text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-98 transition cursor-pointer border-2 ${
                gameMode === 'first_to_finish'
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/30 hover:from-emerald-300 hover:to-teal-300'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30 hover:from-amber-300 hover:to-yellow-300'
              }`}
            >
              <Swords className="w-6 h-6" />
              <span>
                {gameMode === 'first_to_finish'
                  ? `🏁 İLK BİTİREN KAZANIR DÜELLOSUNU BAŞLAT (${targetAdventures} SEVİYE)`
                  : `⏱️ 2 KİŞİLİK SÜRELİ DÜELLOYU BAŞLAT (${Math.round(durationSeconds / 60)} DAKİKA)`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Duel History & Leaderboard Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveTab('matches');
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer ${
                activeTab === 'matches'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🏆 Akıllı Tahta Düello Geçmişi ({dualMatches.length})
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveTab('individual');
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer ${
                activeTab === 'individual'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              📊 Bireysel Puan Tablosu ({leaderboard.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition shadow"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV İndir</span>
            </button>

            {activeTab === 'matches' && dualMatches.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-bold border border-slate-700 cursor-pointer transition"
                title="Geçmişi Temizle"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Temizle</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Dual Matches History */}
        {activeTab === 'matches' && (
          <div className="mt-4 overflow-x-auto">
            {dualMatches.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30 text-amber-400" />
                <p className="text-sm font-bold text-slate-400">Henüz ikili düello maçı yapılmadı.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Yukarıdan öğrencileri seçip "Düelloyu Başlat" butonuna tıklayarak ilk akıllı tahta yarışmasını yapabilirsiniz!
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Tarih</th>
                    <th className="py-2.5 px-3">Şampiyon / Kazanan</th>
                    <th className="py-2.5 px-3 text-cyan-400">1. Öğrenci</th>
                    <th className="py-2.5 px-3 text-amber-400">2. Öğrenci</th>
                    <th className="py-2.5 px-3 text-center">Süre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {dualMatches.map((m) => {
                    const isP1Win = m.winnerId === m.player1.studentId;
                    const isP2Win = m.winnerId === m.player2.studentId;
                    const isTie = m.winnerId === 'tie';

                    return (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 text-slate-400">
                          {new Date(m.timestamp).toLocaleDateString('tr-TR')} {new Date(m.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3 font-bold">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            <span>🏆</span>
                            <span>{m.winnerName}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className={`font-bold ${isP1Win ? 'text-cyan-300 font-black' : 'text-slate-300'}`}>
                            {m.player1.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {m.player1.adventuresCompleted} Macera • {m.player1.questionsSolved} Fen • {m.player1.score} P
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className={`font-bold ${isP2Win ? 'text-amber-300 font-black' : 'text-slate-300'}`}>
                            {m.player2.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {m.player2.adventuresCompleted} Macera • {m.player2.questionsSolved} Fen • {m.player2.score} P
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-400 font-mono">
                          {Math.round(m.durationSeconds / 60)} dk
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Individual Leaderboard */}
        {activeTab === 'individual' && (
          <div className="mt-4 overflow-x-auto">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm font-bold text-slate-400">Bireysel sıralama kaydı bulunmuyor.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Sıra</th>
                    <th className="py-2.5 px-3">Öğrenci</th>
                    <th className="py-2.5 px-3">Sınıf</th>
                    <th className="py-2.5 px-3 text-center">Puan</th>
                    <th className="py-2.5 px-3 text-center">Doğru Fen</th>
                    <th className="py-2.5 px-3 text-center">Süre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {leaderboard.map((e, idx) => (
                    <tr key={e.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-bold text-amber-400">#{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-white">{e.studentName}</td>
                      <td className="py-3 px-3 text-slate-400">{e.gradeSection}</td>
                      <td className="py-3 px-3 text-center font-black text-amber-300">{e.score}</td>
                      <td className="py-3 px-3 text-center text-cyan-300 font-bold">{e.questionsSolved}</td>
                      <td className="py-3 px-3 text-center text-slate-400 font-mono">{e.timeSeconds} sn</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
