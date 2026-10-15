import React, { useState } from 'react';
import { ScienceQuestion } from '../types/game';
import { ScienceDiagram } from './ScienceDiagram';
import { soundManager } from '../utils/audio';
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface ScienceQuestionModalProps {
  question: ScienceQuestion;
  onAnswerCorrect: (firstTry: boolean) => void;
  onAnswerWrong: () => void;
}

export const ScienceQuestionModal: React.FC<ScienceQuestionModalProps> = ({
  question,
  onAnswerCorrect,
  onAnswerWrong,
}) => {
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [solvedIndex, setSolvedIndex] = useState<number | null>(null);

  const handleSelectOption = (idx: number) => {
    // If already solved or already picked this wrong option, do nothing
    if (isSolved || wrongIndices.includes(idx)) return;

    if (idx === question.correctIndex) {
      // Correct answer!
      setIsSolved(true);
      setSolvedIndex(idx);
      soundManager.playCorrect();
    } else {
      // Wrong answer: deduct points, do NOT show the correct answer, let student retry!
      setWrongIndices((prev) => [...prev, idx]);
      soundManager.playWrong();
      onAnswerWrong();
    }
  };

  const handleContinue = () => {
    if (isSolved) {
      soundManager.playDoorUnlock();
      onAnswerCorrect(wrongIndices.length === 0);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 shadow-2xl shadow-cyan-950/60 max-h-[90vh] overflow-y-auto">
        {/* Header Badges */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-950/80 text-amber-300 border border-amber-500/50 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide">
              Yıldızkent Ortaokulu
            </span>
            <span className="bg-cyan-950/90 text-cyan-400 border border-cyan-700/60 px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {question.topicTitle}
            </span>
            {question.difficulty === 'zor' && (
              <span className="bg-rose-950/90 text-rose-300 border border-rose-500/60 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide flex items-center gap-1 shadow-sm">
                <span>🔥</span>
                <span>Zor Seviye (MEB 7. Sınıf)</span>
              </span>
            )}
            {question.difficulty === 'orta' && (
              <span className="bg-amber-950/90 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide">
                ⭐ Orta Seviye
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              MEB {question.gradeLevel}. Sınıf
            </span>
          </div>
          <div className="text-xs text-amber-400 font-bold flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
            <span>🔒 Güvenlik Kapısı Sorusu</span>
          </div>
        </div>

        {/* Question Text */}
        <div className="my-4">
          <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-100 leading-snug">
            {question.questionText}
          </h3>
        </div>

        {/* Visual Diagram if present */}
        {question.diagramType && (
          <div className="mb-4">
            <ScienceDiagram question={question} />
          </div>
        )}

        {/* Dynamic Penalty / Retry Warning Banner */}
        {!isSolved && wrongIndices.length > 0 && (
          <div className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-bold mb-4 flex items-center gap-2.5 animate-pulse">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="flex-1">
              <span>Yanlış Cevap! (-15 Puan Kesildi). Doğru cevabı bulana kadar tekrar deneyebilirsin!</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-300 font-mono bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700/60">
              <RefreshCw className="w-3 h-3" />
              <span>Tekrar Dene</span>
            </div>
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {question.options.map((opt, idx) => {
            const isWrong = wrongIndices.includes(idx);
            const isThisSolvedCorrect = isSolved && solvedIndex === idx;

            let btnStyle = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-200 hover:border-cyan-500/60 shadow-sm';
            
            if (isThisSolvedCorrect) {
              btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/20';
            } else if (isWrong) {
              btnStyle = 'bg-rose-950/60 border-rose-600/70 text-rose-300 opacity-75 cursor-not-allowed';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isSolved || isWrong}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 text-left transition-all duration-150 ${btnStyle} ${
                  !isSolved && !isWrong ? 'cursor-pointer active:scale-98' : ''
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isThisSolvedCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : isWrong
                      ? 'bg-rose-900/80 text-rose-300 border border-rose-600'
                      : 'bg-slate-900 border border-slate-700 text-cyan-400'
                  }`}
                >
                  {optionLabels[idx]}
                </span>

                <div className="flex-1 pt-0.5">
                  <span className="text-xs sm:text-sm font-bold block">{opt}</span>
                  {isWrong && (
                    <span className="text-[10px] text-rose-400 font-bold block mt-0.5">
                      ✕ Yanlış Şık (-15 Puan)
                    </span>
                  )}
                </div>

                {isThisSolvedCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                )}
                {isWrong && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Scientific Explanation (Only revealed when student gets it right!) */}
        {isSolved ? (
          <div className="p-4 rounded-2xl border bg-emerald-950/50 border-emerald-500/60 text-emerald-200 mb-4 animate-fade-in shadow-lg">
            <div className="flex items-center gap-2 font-black text-sm mb-1 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {wrongIndices.length === 0
                  ? 'Harika! İlk Denemede Doğru Cevap (+100 Puan!)'
                  : `Tebrikler! Doğru Şıkkı Buldun (+70 Puan!)`}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              <strong className="text-amber-300">Bilimsel Açıklama:</strong> {question.explanation}
            </p>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transform active:scale-95 transition"
            >
              <span>KAPI KİLİDİ AÇILDI • MACERAYA DEVAM ET</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Doğru şıkkı bulana kadar dilediğin şıkkı seçebilirsin.</span>
            </span>
            <span className="text-amber-400 font-bold">
              Yanlış Deneme: {wrongIndices.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
