import React from 'react';
import { LevelConfig, StudentLevelResult } from '../types/game';
import { ADVENTURE_LEVELS } from '../data/levels';
import { soundManager } from '../utils/audio';
import { Star, Lock, Play, ArrowLeft, Trophy, Sparkles } from 'lucide-react';

interface LevelSelectModalProps {
  studentResults: StudentLevelResult[];
  unlockedAll: boolean;
  onSelectLevel: (level: LevelConfig) => void;
  onBack: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  studentResults,
  unlockedAll,
  onSelectLevel,
  onBack,
}) => {
  const isLevelUnlocked = (index: number) => {
    if (unlockedAll || index === 0) return true;
    const prevLevelId = ADVENTURE_LEVELS[index - 1].id;
    const prevResult = studentResults.find((r) => r.levelId === prevLevelId);
    return !!prevResult?.completed;
  };

  const getLevelResult = (levelId: string) => {
    return studentResults.find((r) => r.levelId === levelId);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
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
          <h2 className="text-xl sm:text-2xl font-black text-white">Galaktik Macera Haritası</h2>
          <p className="text-xs text-slate-400">
            6 Ana Seviye: Güneş Sistemi, Tutulmalar ve Kuvvet Dünyası
          </p>
        </div>

        <div className="w-24" />
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
        {ADVENTURE_LEVELS.map((level, idx) => {
          const unlocked = isLevelUnlocked(idx);
          const result = getLevelResult(level.id);
          const stars = result?.stars || 0;

          return (
            <div
              key={level.id}
              className={`relative rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between ${
                unlocked
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-400 shadow-xl shadow-cyan-950/20 backdrop-blur-md hover:-translate-y-1'
                  : 'bg-slate-950/60 border-slate-850 opacity-65'
              }`}
            >
              {/* Badge & Number */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  SEVİYE {level.levelNumber}
                </span>

                {/* Stars Display */}
                {unlocked && result?.completed ? (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                ) : !unlocked ? (
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Kilitli</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Yeni Görev
                  </span>
                )}
              </div>

              {/* Title & Topic */}
              <div>
                <h3 className="text-lg font-black text-white">{level.title}</h3>
                <h4 className="text-xs font-bold text-amber-400 mt-0.5">{level.subtitle}</h4>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
                  {level.description}
                </p>
              </div>

              {/* Objectives */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] space-y-1 text-slate-400">
                <div>
                  <span className="text-cyan-400 font-bold">Fen Konusu:</span> {level.topic}
                </div>
                <div>
                  <span className="text-purple-400 font-bold">Kodlama:</span> {level.codingObjective}
                </div>
                {result && (
                  <div className="font-mono text-amber-300 pt-1">
                    En Yüksek Skor: <span className="font-bold">{result.score} Puan</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5">
                {unlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      onSelectLevel(level);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 cursor-pointer transform active:scale-95 transition"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{result?.completed ? 'TEKRAR OYNA' : 'BAŞLA'}</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-600 text-center text-xs font-bold">
                    Önceki Seviyeyi Tamamla
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
