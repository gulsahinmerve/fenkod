import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Student, DualMatchRecord, LevelConfig } from '../types/game';
import { ADVENTURE_LEVELS } from '../data/levels';
import { buildDynamicLevel } from '../utils/dynamicLevel';
import { DualPlayerPanel } from './DualPlayerPanel';
import { CharacterAvatar } from './CharacterAvatar';
import { soundManager } from '../utils/audio';
import { storage } from '../utils/storage';
import {
  Trophy,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Sparkles,
  Award,
  Flag,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DualCompetitionArenaProps {
  student1: Student;
  student2: Student;
  char1Id: string;
  char2Id: string;
  mode?: 'timed' | 'first_to_finish';
  targetAdventures?: number;
  durationSeconds?: number;
  onBack: () => void;
  onRematch?: () => void;
}

export const DualCompetitionArena: React.FC<DualCompetitionArenaProps> = ({
  student1,
  student2,
  char1Id,
  char2Id,
  mode = 'timed',
  targetAdventures = 1,
  durationSeconds = 120, // 2 minutes standard
  onBack,
  onRematch,
}) => {
  // Timer state
  // For 'timed': countdown from durationSeconds
  // For 'first_to_finish': count up (stopwatch) from 0
  const isFirstToFinish = mode === 'first_to_finish';
  const [timerCount, setTimerCount] = useState<number>(isFirstToFinish ? 0 : durationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Replay salt to regenerate completely new questions and door positions on every match
  const [matchSalt, setMatchSalt] = useState<number>(Date.now());

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Player 1 state
  const [p1LevelIdx, setP1LevelIdx] = useState<number>(0);
  const [p1Adventures, setP1Adventures] = useState<number>(0);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p1Questions, setP1Questions] = useState<number>(0);

  // Player 2 state
  const [p2LevelIdx, setP2LevelIdx] = useState<number>(0);
  const [p2Adventures, setP2Adventures] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [p2Questions, setP2Questions] = useState<number>(0);

  // Winner state
  const [winnerInfo, setWinnerInfo] = useState<{
    winner: 'p1' | 'p2' | 'tie';
    name: string;
    reason: string;
  } | null>(null);

  // Anti-Cheat Dynamic Level Generation:
  // Player 1 gets randomized questions & door positions
  const p1DynamicResult = useMemo(() => {
    const base = ADVENTURE_LEVELS[p1LevelIdx % ADVENTURE_LEVELS.length];
    return buildDynamicLevel(base, 1, matchSalt + p1LevelIdx * 31, []);
  }, [p1LevelIdx, matchSalt]);

  // Player 2 gets DIFFERENT questions and DIFFERENT door positions
  const p2DynamicResult = useMemo(() => {
    const base = ADVENTURE_LEVELS[p2LevelIdx % ADVENTURE_LEVELS.length];
    return buildDynamicLevel(base, 2, matchSalt + p2LevelIdx * 53 + 17, p1DynamicResult.chosenQuestionIds);
  }, [p2LevelIdx, matchSalt, p1DynamicResult.chosenQuestionIds]);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Timer loop
  useEffect(() => {
    if (!isTimerRunning || isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimerCount((prev) => {
        if (!isFirstToFinish) {
          // Timed countdown mode
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimedExpired();
            return 0;
          }
          return prev - 1;
        } else {
          // First to finish stopwatch mode (counts up)
          return prev + 1;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isGameOver, isFirstToFinish, p1Adventures, p2Adventures, p1Score, p2Score]);

  // Handle victory in First-to-Finish mode
  const handleFirstToFinishVictory = (winningPlayer: 1 | 2) => {
    if (isGameOver) return;
    setIsGameOver(true);
    setIsTimerRunning(false);
    soundManager.playVictory();

    const winnerName = winningPlayer === 1 ? student1.fullName : student2.fullName;
    const timeFormatted = formatTime(timerCount);
    const reasonText = `Hedef seviyeyi ${timeFormatted} sürede ilk tamamlayarak yarışın şampiyonu oldu!`;

    setWinnerInfo({
      winner: winningPlayer === 1 ? 'p1' : 'p2',
      name: winnerName,
      reason: reasonText,
    });

    const matchRecord: DualMatchRecord = {
      id: `match_${Date.now()}`,
      timestamp: Date.now(),
      durationSeconds: timerCount,
      mode: 'first_to_finish',
      player1: {
        studentId: student1.id,
        studentName: student1.fullName,
        charId: char1Id,
        adventuresCompleted: winningPlayer === 1 ? p1Adventures + 1 : p1Adventures,
        questionsSolved: p1Questions,
        score: p1Score + (winningPlayer === 1 ? 500 : 0),
      },
      player2: {
        studentId: student2.id,
        studentName: student2.fullName,
        charId: char2Id,
        adventuresCompleted: winningPlayer === 2 ? p2Adventures + 1 : p2Adventures,
        questionsSolved: p2Questions,
        score: p2Score + (winningPlayer === 2 ? 500 : 0),
      },
      winnerId: winningPlayer === 1 ? student1.id : student2.id,
      winnerName: winnerName,
    };

    storage.saveDualMatch(matchRecord);
  };

  // When time expires in Timed mode
  const handleTimedExpired = () => {
    setIsGameOver(true);
    setIsTimerRunning(false);
    soundManager.playCelebration();

    let winResult: 'p1' | 'p2' | 'tie' = 'tie';
    let winName = 'Dostluk Kazandı!';
    let reason = 'Her iki öğrenci de eşit başarı gösterdi!';

    if (p1Adventures > p2Adventures) {
      winResult = 'p1';
      winName = student1.fullName;
      reason = `${durationSeconds} saniyede ${p1Adventures} macera tamamlayarak kazandı!`;
    } else if (p2Adventures > p1Adventures) {
      winResult = 'p2';
      winName = student2.fullName;
      reason = `${durationSeconds} saniyede ${p2Adventures} macera tamamlayarak kazandı!`;
    } else {
      // Tie breaker: Score
      if (p1Score > p2Score) {
        winResult = 'p1';
        winName = student1.fullName;
        reason = `Puan üstünlüğüyle (${p1Score} - ${p2Score}) şampiyon oldu!`;
      } else if (p2Score > p1Score) {
        winResult = 'p2';
        winName = student2.fullName;
        reason = `Puan üstünlüğüyle (${p2Score} - ${p1Score}) şampiyon oldu!`;
      } else {
        winResult = 'tie';
        winName = 'Berabere! Her iki öğrenci de harika yarıştı!';
        reason = 'Tüm maceralar ve puanlar eşit sonuçlandı!';
      }
    }

    setWinnerInfo({ winner: winResult, name: winName, reason });

    const matchRecord: DualMatchRecord = {
      id: `match_${Date.now()}`,
      timestamp: Date.now(),
      durationSeconds,
      mode: 'timed',
      player1: {
        studentId: student1.id,
        studentName: student1.fullName,
        charId: char1Id,
        adventuresCompleted: p1Adventures,
        questionsSolved: p1Questions,
        score: p1Score,
      },
      player2: {
        studentId: student2.id,
        studentName: student2.fullName,
        charId: char2Id,
        adventuresCompleted: p2Adventures,
        questionsSolved: p2Questions,
        score: p2Score,
      },
      winnerId: winResult === 'p1' ? student1.id : winResult === 'p2' ? student2.id : 'tie',
      winnerName: winName,
    };

    storage.saveDualMatch(matchRecord);
  };

  // Reset match with fresh randomized seeds
  const handleResetMatch = () => {
    soundManager.playClick();
    setTimerCount(isFirstToFinish ? 0 : durationSeconds);
    setIsGameOver(false);
    setIsTimerRunning(true);
    setWinnerInfo(null);
    setP1LevelIdx(0);
    setP1Adventures(0);
    setP1Score(0);
    setP1Questions(0);
    setP2LevelIdx(0);
    setP2Adventures(0);
    setP2Score(0);
    setP2Questions(0);
    setMatchSalt(Date.now()); // Generate fresh questions & doors!
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col p-2 sm:p-3 overflow-x-hidden select-none">
      {/* Top Header Cockpit Bar for Smartboard */}
      <div className="w-full flex items-center justify-between bg-slate-900/95 border-2 border-slate-800 rounded-2xl px-3 sm:px-5 py-2 shadow-2xl mb-2 sm:mb-3 backdrop-blur-md">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition shadow"
            title="Yarıştan Çık"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-amber-400">
                👩‍🏫 Merve Öğretmen
              </span>
              <span className="hidden md:inline-block text-[10px] bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                Yıldızkent Ortaokulu
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Kopya Korumalı (Farklı Soru & Kapı Konumları)</span>
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>Fen Kod Macerası</span>
              <span className="text-slate-500 font-normal">|</span>
              <span className="text-xs sm:text-sm font-bold text-cyan-300">
                {isFirstToFinish ? '🏁 İlk Bitiren Kazanır Modu' : '⏱️ 2 Dakikalık Hızlı Düello'}
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Live Timer Display */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-2xl border-2 border-slate-800 shadow-inner">
          <div className="flex items-center gap-2">
            <Clock
              className={`w-5 h-5 ${
                !isFirstToFinish && timerCount <= 15
                  ? 'text-rose-500 animate-ping'
                  : !isFirstToFinish && timerCount <= 30
                  ? 'text-amber-400 animate-pulse'
                  : 'text-cyan-400'
              }`}
            />
            <div className="flex flex-col items-center">
              <span
                className={`font-mono font-black text-xl sm:text-2xl tracking-wider leading-none ${
                  !isFirstToFinish && timerCount <= 15
                    ? 'text-rose-400 animate-pulse drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                    : !isFirstToFinish && timerCount <= 30
                    ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                }`}
              >
                {formatTime(timerCount)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {isFirstToFinish ? 'Geçen Süre' : 'Kalan Süre'}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 mx-1" />

          {/* Teacher Play/Pause & Reset */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsTimerRunning(!isTimerRunning);
              }}
              disabled={isGameOver}
              className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                isTimerRunning
                  ? 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/60 text-amber-300'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/60 text-emerald-300'
              } disabled:opacity-50`}
              title={isTimerRunning ? 'Süreyi Duraklat' : 'Süreyi Devam Ettir'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleResetMatch}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              title="Yarışmayı Sıfırla (Sorular ve Kapılar Yenilenir)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Scoreboard & Fullscreen toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-black text-cyan-400">
              {student1.fullName}: {p1Adventures} Macera
            </span>
            <span className="text-xs font-black text-amber-400 px-1">VS</span>
            <span className="text-xs font-black text-amber-400">
              {student2.fullName}: {p2Adventures} Macera
            </span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-xs cursor-pointer transition shadow"
            title="Akıllı Tahta Tam Ekran"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Pencere</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Tam Ekran</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split-Screen 2-Player Grid (Eşit Ebatlı İkili Ekran) */}
      <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch max-w-[1920px] mx-auto">
        {/* Left Screen: Player 1 (Blue Cyber) */}
        <DualPlayerPanel
          playerNumber={1}
          studentName={student1.fullName}
          charId={char1Id}
          currentLevel={p1DynamicResult.level}
          adventuresCompleted={p1Adventures}
          score={p1Score}
          questionsSolved={p1Questions}
          isTimerRunning={isTimerRunning && !isGameOver}
          onLevelComplete={() => {
            const nextAdv = p1Adventures + 1;
            setP1Adventures(nextAdv);
            setP1LevelIdx((idx) => idx + 1);

            // In First-to-Finish mode:
            if (isFirstToFinish && nextAdv >= targetAdventures) {
              handleFirstToFinishVictory(1);
            }
          }}
          onAddScore={(pts, isQ) => {
            setP1Score((s) => s + pts);
            if (isQ) setP1Questions((q) => q + 1);
          }}
        />

        {/* Right Screen: Player 2 (Amber Blaze) */}
        <DualPlayerPanel
          playerNumber={2}
          studentName={student2.fullName}
          charId={char2Id}
          currentLevel={p2DynamicResult.level}
          adventuresCompleted={p2Adventures}
          score={p2Score}
          questionsSolved={p2Questions}
          isTimerRunning={isTimerRunning && !isGameOver}
          onLevelComplete={() => {
            const nextAdv = p2Adventures + 1;
            setP2Adventures(nextAdv);
            setP2LevelIdx((idx) => idx + 1);

            // In First-to-Finish mode:
            if (isFirstToFinish && nextAdv >= targetAdventures) {
              handleFirstToFinishVictory(2);
            }
          }}
          onAddScore={(pts, isQ) => {
            setP2Score((s) => s + pts);
            if (isQ) setP2Questions((q) => q + 1);
          }}
        />
      </div>

      {/* Game Over / Victory Modal */}
      {isGameOver && winnerInfo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-2xl w-full bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
            {/* Ambient Star Glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="text-5xl sm:text-7xl animate-bounce mb-3">
              {winnerInfo.winner === 'tie' ? '🤝' : '🏆'}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-xs uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>
                {isFirstToFinish ? '🏁 İLK BİTİREN KAZANDI MÜCADELESİ' : '⏱️ 2 DAKİKALIK DÜELLO BİTTİ'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white mt-1">
              {winnerInfo.winner === 'tie' ? 'DOSTLUK KAZANDI!' : `Tebrikler ${winnerInfo.name}!`}
            </h2>

            <p className="text-sm sm:text-base text-amber-200 mt-2 font-medium">
              {winnerInfo.reason}
            </p>

            {/* Match Stats Comparison */}
            <div className="grid grid-cols-2 gap-4 my-6">
              {/* P1 Card */}
              <div
                className={`p-4 rounded-2xl border-2 ${
                  winnerInfo.winner === 'p1'
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CharacterAvatar characterId={char1Id} size={40} />
                  <div className="text-left">
                    <div className="text-xs font-bold text-cyan-400">1. Öğrenci</div>
                    <div className="text-base font-black text-white">{student1.fullName}</div>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Tamamlanan Macera:</span>
                    <span className="font-bold text-amber-400">{p1Adventures}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Çözülen Fen Sorusu:</span>
                    <span className="font-bold text-emerald-400">{p1Questions}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Toplam Puan:</span>
                    <span className="font-mono font-black text-cyan-300">+{p1Score}</span>
                  </div>
                </div>
              </div>

              {/* P2 Card */}
              <div
                className={`p-4 rounded-2xl border-2 ${
                  winnerInfo.winner === 'p2'
                    ? 'bg-amber-950/80 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CharacterAvatar characterId={char2Id} size={40} />
                  <div className="text-left">
                    <div className="text-xs font-bold text-amber-400">2. Öğrenci</div>
                    <div className="text-base font-black text-white">{student2.fullName}</div>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Tamamlanan Macera:</span>
                    <span className="font-bold text-amber-400">{p2Adventures}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Çözülen Fen Sorusu:</span>
                    <span className="font-bold text-emerald-400">{p2Questions}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Toplam Puan:</span>
                    <span className="font-mono font-black text-amber-300">+{p2Score}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetMatch}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer transition transform active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>YENİ DÜELLO OYNA (YENİ SORULARLA)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 cursor-pointer transition"
              >
                Yarışma Menüsüne Dön
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
