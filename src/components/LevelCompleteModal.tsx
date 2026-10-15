import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, RotateCcw, ArrowRight, Award } from 'lucide-react';
import { BADGES } from '../data/characters';
import { soundManager } from '../utils/audio';

interface LevelCompleteModalProps {
  levelTitle: string;
  levelNumber: number;
  score: number;
  stars: number;
  commandsUsed: number;
  parCommands: number;
  questionsSolved: number;
  crystalsCollected: number;
  newBadges: string[];
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
  onBackToMenu: () => void;
  onOpenCharacterWardrobe?: () => void;
  onOpenCertificates?: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelTitle,
  levelNumber,
  score,
  stars,
  commandsUsed,
  parCommands,
  questionsSolved,
  crystalsCollected,
  newBadges,
  hasNextLevel,
  onNextLevel,
  onRetry,
  onBackToMenu,
  onOpenCharacterWardrobe,
  onOpenCertificates,
}) => {
  useEffect(() => {
    soundManager.playVictory();
    // Confetti cannon
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-center">
        {/* Glow circle behind icon */}
        <div className="w-20 h-20 mx-auto -mt-16 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/40 border-4 border-slate-900 rotate-3 transform hover:rotate-6 transition-transform">
          <Trophy className="w-10 h-10 text-slate-950" />
        </div>

        <div className="mt-4">
          <div className="inline-block text-[10px] font-black tracking-wider text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2.5 py-0.5 rounded-full mb-1.5 shadow-sm">
            YILDIZKENT ORTAOKULU • BAŞARI BELGESİ
          </div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-black block">
            Seviye {levelNumber} Tamamlandı!
          </span>
          <h2 className="text-2xl font-black text-slate-100 mt-1">{levelTitle}</h2>
        </div>

        {/* 3 Stars */}
        <div className="flex items-center justify-center gap-3 my-5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`transform transition-all duration-300 ${
                s <= stars ? 'scale-110' : 'opacity-30 scale-90'
              }`}
            >
              <Star
                className={`w-10 h-10 ${
                  s <= stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-slate-600'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Score Card Breakdown */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 my-5 grid grid-cols-2 gap-3 text-left">
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Kazanılan Puan</div>
            <div className="text-xl font-black text-amber-400 font-mono">+{score}</div>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Kullanılan Komut</div>
            <div className="text-xl font-black text-cyan-400 font-mono">
              {commandsUsed}{' '}
              <span className="text-xs text-slate-400 font-normal">/ Hedef: {parCommands}</span>
            </div>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Çözülen Fen Sorusu</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">{questionsSolved} Adet</div>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Enerji Kristalleri</div>
            <div className="text-lg font-bold text-sky-400 font-mono">{crystalsCollected} Adet</div>
          </div>
        </div>

        {/* Unlocked Badges */}
        {newBadges.length > 0 && (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 mb-5 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
              <Award className="w-4 h-4" />
              <span>Yeni Rozet Kazanıldı!</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {newBadges.map((bId) => {
                const badge = BADGES.find((b) => b.id === bId);
                return (
                  <div
                    key={bId}
                    className="flex items-center gap-1.5 bg-amber-500/20 text-amber-200 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold"
                  >
                    <span>{badge?.icon || '⭐'}</span>
                    <span>{badge?.title || 'Başarı'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Character & Wardrobe Reward Button */}
        <div className="mb-4 p-3 bg-purple-950/50 border border-purple-500/40 rounded-2xl flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <div>
              <div className="text-xs font-black text-purple-300">Yeni Karakter & Kostüm Hakkı!</div>
              <div className="text-[10px] text-slate-300">Seviyeyi geçerek gardıroptan yeni kıyafet ve aksesuar seçebilirsin.</div>
            </div>
          </div>
          {onOpenCharacterWardrobe && (
            <button
              type="button"
              onClick={onOpenCharacterWardrobe}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition cursor-pointer"
            >
              Gardıroba Git
            </button>
          )}
        </div>

        {/* Certificate & Badges View Button */}
        {onOpenCertificates && (
          <div className="mb-4 p-3 bg-amber-950/40 border border-amber-500/50 rounded-2xl flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📜</span>
              <div>
                <div className="text-xs font-black text-amber-300">Resmî Başarı Belgesi & Rozetler</div>
                <div className="text-[10px] text-slate-300">Yıldızkent OO onaylı başarı belgeni görüntüle, yazdır veya rozetlerini incele.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenCertificates}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
            >
              Belgeyi Gör
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tekrar Oyna</span>
          </button>

          {hasNextLevel ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 transform hover:scale-[1.02] transition cursor-pointer"
            >
              <span>Sonraki Seviye</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToMenu}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-lg cursor-pointer"
            >
              <span>Ana Menüye Dön</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
