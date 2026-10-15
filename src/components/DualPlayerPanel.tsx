import React, { useState, useEffect, useRef } from 'react';
import { Direction, GridCell, CodeBlock, ExecStep, ScienceQuestion, LevelConfig } from '../types/game';
import { GameArea } from './GameArea';
import { CharacterAvatar } from './CharacterAvatar';
import { ScienceDiagram } from './ScienceDiagram';
import { soundManager } from '../utils/audio';
import { storage } from '../utils/storage';
import {
  Play,
  RotateCcw,
  Trash2,
  ArrowUp,
  RotateCw,
  Zap,
  HelpCircle,
  Trophy,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';

interface DualPlayerPanelProps {
  playerNumber: 1 | 2;
  studentName: string;
  charId: string;
  currentLevel: LevelConfig;
  adventuresCompleted: number;
  score: number;
  questionsSolved: number;
  isTimerRunning: boolean;
  onLevelComplete: () => void;
  onAddScore: (points: number, isQuestion: boolean) => void;
}

export const DualPlayerPanel: React.FC<DualPlayerPanelProps> = ({
  playerNumber,
  studentName,
  charId,
  currentLevel,
  adventuresCompleted,
  score,
  questionsSolved,
  isTimerRunning,
  onLevelComplete,
  onAddScore,
}) => {
  const isP1 = playerNumber === 1;

  // Grid / character state
  const [playerPos, setPlayerPos] = useState({ ...currentLevel.startPos });
  const [direction, setDirection] = useState<Direction>(currentLevel.startDir);
  const [cells, setCells] = useState<GridCell[]>(currentLevel.cells.map((c) => ({ ...c })));
  const [charState, setCharState] = useState<'idle' | 'walk' | 'cheer' | 'think' | 'celebrate'>('idle');
  const [collisionCell, setCollisionCell] = useState<{ x: number; y: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Coding blocks
  const [blocks, setBlocks] = useState<CodeBlock[]>([
    { id: `p${playerNumber}_b1`, type: 'forward' },
    { id: `p${playerNumber}_b2`, type: 'forward' },
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Stop ref
  const stopRef = useRef(false);

  // Science question modal state
  const [activeQuestion, setActiveQuestion] = useState<ScienceQuestion | null>(null);
  const [pendingSteps, setPendingSteps] = useState<{ steps: ExecStep[]; currentIdx: number } | null>(null);
  const [questionFeedback, setQuestionFeedback] = useState<{
    selectedId: string;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  // Level completion animation banner
  const [levelSuccessBanner, setLevelSuccessBanner] = useState(false);

  // Reset when level changes
  useEffect(() => {
    stopRef.current = true;
    setIsRunning(false);
    setActiveBlockId(null);
    setPlayerPos({ ...currentLevel.startPos });
    setDirection(currentLevel.startDir);
    setCells(currentLevel.cells.map((c) => ({ ...c })));
    setCollisionCell(null);
    setErrorMessage(null);
    setCharState('idle');
    setActiveQuestion(null);
    setPendingSteps(null);
    setQuestionFeedback(null);
    setBlocks([
      { id: `p${playerNumber}_b1`, type: 'forward' },
      { id: `p${playerNumber}_b2`, type: 'forward' },
    ]);
  }, [currentLevel, playerNumber]);

  // Block management
  const handleAddBlock = (type: 'forward' | 'turn_left' | 'turn_right', stepCount: number = 1) => {
    if (isRunning) return;
    if (blocks.length >= 20) {
      soundManager.playCollision();
      return;
    }
    soundManager.playClick();
    const newBlock: CodeBlock = {
      id: `p${playerNumber}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      stepCount: type === 'forward' && stepCount > 1 ? stepCount : undefined,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleUndoLastBlock = () => {
    if (isRunning || blocks.length === 0) return;
    soundManager.playClick();
    setBlocks((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRemoveBlock = (id: string) => {
    if (isRunning) return;
    soundManager.playClick();
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleClearBlocks = () => {
    if (isRunning) return;
    soundManager.playClick();
    setBlocks([]);
  };

  const handleResetPosition = () => {
    soundManager.playClick();
    stopRef.current = true;
    setIsRunning(false);
    setActiveBlockId(null);
    setPlayerPos({ ...currentLevel.startPos });
    setDirection(currentLevel.startDir);
    setCells(currentLevel.cells.map((c) => ({ ...c })));
    setCollisionCell(null);
    setErrorMessage(null);
    setCharState('idle');
    setActiveQuestion(null);
    setPendingSteps(null);
    setQuestionFeedback(null);
  };

  // Execution engine
  const handleRunCode = async () => {
    if (isRunning || blocks.length === 0) return;
    soundManager.playRun();
    setIsRunning(true);
    stopRef.current = false;
    setErrorMessage(null);
    setCollisionCell(null);

    // Reset position before fresh run
    const startP = { ...currentLevel.startPos };
    const startD = currentLevel.startDir;
    setPlayerPos(startP);
    setDirection(startD);

    const steps: ExecStep[] = [];
    for (const b of blocks) {
      if (b.type === 'forward' && b.stepCount && b.stepCount > 1) {
        for (let s = 0; s < b.stepCount; s++) {
          steps.push({ blockId: b.id, type: 'forward' });
        }
      } else {
        steps.push({ blockId: b.id, type: b.type });
      }
    }

    await executeSteps(steps, 0, startP, startD, cells);
  };

  const executeSteps = async (
    steps: ExecStep[],
    startIndex: number,
    initialPos: { x: number; y: number },
    initialDir: Direction,
    initialCells: GridCell[]
  ) => {
    let curPos = { ...initialPos };
    let curDir = initialDir;
    const curCells = initialCells.map((c) => ({ ...c }));
    const stepSpeed = 260; // fast & responsive for competition!

    for (let i = startIndex; i < steps.length; i++) {
      if (stopRef.current) break;

      const step = steps[i];
      setActiveBlockId(step.blockId);

      if (step.type === 'turn_right') {
        curDir = ((curDir + 1) % 4) as Direction;
        setDirection(curDir);
        soundManager.playTurn();
        await new Promise((r) => setTimeout(r, stepSpeed));
      } else if (step.type === 'turn_left') {
        curDir = ((curDir + 3) % 4) as Direction;
        setDirection(curDir);
        soundManager.playTurn();
        await new Promise((r) => setTimeout(r, stepSpeed));
      } else if (step.type === 'forward') {
        let nx = curPos.x;
        let ny = curPos.y;
        if (curDir === 0) nx += 1;
        else if (curDir === 1) ny += 1;
        else if (curDir === 2) nx -= 1;
        else if (curDir === 3) ny -= 1;

        // Wall & bounds check
        const isOutOfBounds = nx < 0 || nx >= currentLevel.gridWidth || ny < 0 || ny >= currentLevel.gridHeight;
        const targetCell = curCells.find((c) => c.x === nx && c.y === ny);

        if (isOutOfBounds || targetCell?.type === 'wall' || targetCell?.type === 'obstacle') {
          soundManager.playCollision();
          setCollisionCell({ x: nx, y: ny });
          setErrorMessage('Engelle karşılaştın! Önün kapalı.');
          setCharState('think');
          setIsRunning(false);
          stopRef.current = true;
          setActiveBlockId(null);
          return;
        }

        // Science question gate check
        if (targetCell?.type === 'question' && !targetCell.unlocked) {
          soundManager.playClick();
          setCharState('think');
          setIsRunning(false);
          stopRef.current = true;

          const allQuestions = storage.getQuestions();
          const qId = targetCell.questionId || currentLevel.questionIds[0];
          const foundQ = allQuestions.find((q) => q.id === qId) || allQuestions[0];

          setActiveQuestion(foundQ);
          setPendingSteps({ steps, currentIdx: i });
          return;
        }

        // Valid move
        curPos = { x: nx, y: ny };
        setPlayerPos(curPos);
        setCharState('walk');
        soundManager.playStep();

        // Crystal pickup
        if (targetCell?.type === 'crystal' && !targetCell.collected) {
          targetCell.collected = true;
          setCells([...curCells]);
          soundManager.playCrystal();
          onAddScore(30, false);
        }

        // Target exit reached!
        if (curPos.x === currentLevel.targetPos.x && curPos.y === currentLevel.targetPos.y) {
          const lockedGates = curCells.filter((c) => c.type === 'question' && !c.unlocked);
          if (lockedGates.length > 0) {
            soundManager.playCollision();
            setErrorMessage(`Çıkış kilitli! Haritadaki fen kapısını çözmelisin!`);
            setCharState('think');
            setIsRunning(false);
            stopRef.current = true;
            setActiveBlockId(null);
            return;
          }

          // SUCCESS!
          setIsRunning(false);
          stopRef.current = true;
          setActiveBlockId(null);
          setCharState('celebrate');
          soundManager.playSuccess();
          onAddScore(150, false);
          setLevelSuccessBanner(true);

          setTimeout(() => {
            setLevelSuccessBanner(false);
            onLevelComplete();
          }, 1200);
          return;
        }

        await new Promise((r) => setTimeout(r, stepSpeed));
        setCharState('idle');
      }
    }

    setIsRunning(false);
    setActiveBlockId(null);
  };

  // Answering science questions
  const handleAnswerQuestion = (optionIndex: number) => {
    if (!activeQuestion) return;
    const isCorrect = optionIndex === activeQuestion.correctIndex;

    if (isCorrect) {
      soundManager.playCorrect();
      setQuestionFeedback({
        selectedId: String(optionIndex),
        isCorrect: true,
        explanation: activeQuestion.explanation,
      });

      // Unlock gate
      const updatedCells = cells.map((c) => {
        if (c.type === 'question' && (c.questionId === activeQuestion.id || !c.unlocked)) {
          return { ...c, unlocked: true };
        }
        return c;
      });
      setCells(updatedCells);
      onAddScore(100, true);

      // Auto close and resume after brief delay
      setTimeout(() => {
        setActiveQuestion(null);
        setQuestionFeedback(null);
        if (pendingSteps) {
          const { steps, currentIdx } = pendingSteps;
          setPendingSteps(null);
          stopRef.current = false;
          setIsRunning(true);
          // Resume remaining steps
          executeSteps(steps, currentIdx + 1, playerPos, direction, updatedCells);
        }
      }, 900);
    } else {
      soundManager.playWrong();
      setQuestionFeedback({
        selectedId: String(optionIndex),
        isCorrect: false,
        explanation: 'Tekrar dene veya ipucunu oku: ' + activeQuestion.explanation,
      });
    }
  };

  const themeBorder = isP1 ? 'border-cyan-500/60 shadow-cyan-950/40' : 'border-amber-500/60 shadow-amber-950/40';
  const themeHeaderBg = isP1
    ? 'bg-gradient-to-r from-cyan-950/90 via-slate-900 to-slate-900'
    : 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-900';
  const themeBadge = isP1
    ? 'bg-cyan-500 text-slate-950 border-cyan-300'
    : 'bg-amber-500 text-slate-950 border-amber-300';

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl border-2 ${themeBorder} bg-slate-950/90 p-2.5 sm:p-4 shadow-2xl backdrop-blur-md overflow-hidden`}
    >
      {/* Level Success Celebration Overlay */}
      {levelSuccessBanner && (
        <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in p-4 text-center">
          <div className="text-4xl sm:text-6xl animate-bounce mb-2">🎉 🌟</div>
          <h3 className="text-xl sm:text-3xl font-black text-amber-300 drop-shadow-lg">
            MACERA TAMAMLANDI!
          </h3>
          <p className="text-sm sm:text-base font-bold text-white mt-1">
            +1 Macera Skorunuza Eklendi! Sıradaki Seviye Açılıyor...
          </p>
          <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Mükemmel Hız! Devam Et!</span>
          </div>
        </div>
      )}

      {/* Science Question Modal Overlay */}
      {activeQuestion && (
        <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col p-3 sm:p-5 overflow-y-auto animate-fade-in justify-center">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-3 sm:p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  FEN KİLİDİ: {activeQuestion.topic}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Doğru Cevapla, Geçidi Aç!
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-white my-3 leading-snug">
              {activeQuestion.questionText}
            </p>

            {/* Diagram if available */}
            {activeQuestion.diagramType && (
              <div className="my-2 bg-slate-950/80 rounded-xl p-2 border border-slate-800 flex justify-center">
                <ScienceDiagram question={activeQuestion} className="max-h-36" />
              </div>
            )}

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {activeQuestion.options.map((optText, optIdx) => {
                const isSelected = questionFeedback?.selectedId === String(optIdx);
                let btnStyle = 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700/80';
                if (isSelected && questionFeedback?.isCorrect) {
                  btnStyle = 'bg-emerald-600 border-emerald-400 text-white animate-pulse';
                } else if (isSelected && questionFeedback && !questionFeedback.isCorrect) {
                  btnStyle = 'bg-rose-600 border-rose-400 text-white';
                }

                const letter = ['A', 'B', 'C', 'D'][optIdx] || String(optIdx + 1);

                return (
                  <button
                    key={`opt_${optIdx}`}
                    type="button"
                    onClick={() => handleAnswerQuestion(optIdx)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer shadow ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-lg bg-slate-900/80 flex items-center justify-center font-black text-[11px] shrink-0 text-amber-400 border border-slate-700">
                      {letter}
                    </span>
                    <span className="truncate">{optText}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback message */}
            {questionFeedback && (
              <div
                className={`mt-3 p-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  questionFeedback.isCorrect
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                }`}
              >
                {questionFeedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{questionFeedback.explanation}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. Player Header Banner (Compact & Crisp) */}
      <div className={`shrink-0 flex items-center justify-between p-2 rounded-2xl border border-slate-800 ${themeHeaderBg} mb-2`}>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center shadow-inner">
              <CharacterAvatar characterId={charId} state={charState} size={34} />
            </div>
            <span
              className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full font-black text-[9px] border shadow ${themeBadge}`}
            >
              P{playerNumber}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-black text-white truncate max-w-[130px] sm:max-w-[180px]">
                {studentName}
              </h4>
              <span className="text-[10px] text-slate-400 font-semibold">
                (Öğrenci {playerNumber})
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium">
              {currentLevel.title}
            </p>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex flex-col items-center bg-slate-950/80 px-2 sm:px-3 py-1 rounded-xl border border-amber-500/40">
            <span className="text-[9px] font-bold text-amber-400 uppercase flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              Macera
            </span>
            <span className="text-sm sm:text-base font-black text-amber-300">
              {adventuresCompleted}
            </span>
          </div>

          <div className="flex flex-col items-center bg-slate-950/80 px-2 sm:px-3 py-1 rounded-xl border border-slate-800">
            <span className="text-[9px] font-bold text-cyan-400 uppercase">
              Puan
            </span>
            <span className="text-sm sm:text-base font-black text-cyan-300">
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Hero Game Area Arena (Olabildiğince Büyük, Eşit Ebatlı, Fen Kapısı & Kristaller Net Görünür) */}
      <div className="w-full flex-1 min-h-[320px] sm:min-h-[380px] md:min-h-[440px] flex flex-col items-center justify-center mb-2 bg-slate-950/50 rounded-2xl p-1 sm:p-2 border border-slate-800/80 shadow-inner overflow-hidden">
        <GameArea
          gridWidth={currentLevel.gridWidth}
          gridHeight={currentLevel.gridHeight}
          cells={cells}
          playerPos={playerPos}
          direction={direction}
          characterId={charId}
          characterState={charState}
          targetPos={currentLevel.targetPos}
          startPos={currentLevel.startPos}
          collisionCell={collisionCell}
          errorMessage={errorMessage}
          unsolvedQuestionsCount={cells.filter((c) => c.type === 'question' && !c.unlocked).length}
          compact={true}
          theme={currentLevel.theme}
        />
      </div>

      {/* 3. Compact & Ultra-Functional Coding Cockpit (Daha Dar Ama Çok Daha İşlevsel Blok Kodlama Alanı) */}
      <div className="w-full shrink-0 flex flex-col bg-slate-900/95 border-2 border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-xl">
        {/* Top Header of Cockpit */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="p-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3 h-3" />
            </span>
            <span className="text-xs font-black text-white tracking-wide uppercase">
              KODLAMA PANELİ
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.2 rounded-md bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold text-[11px]">
              {blocks.length} / 20 Blok
            </span>
            {isRunning && (
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] animate-pulse">
                YÜRÜTÜLÜYOR
              </span>
            )}
          </div>
        </div>

        {/* Row 1: Command Palette - 4 Big Touch Buttons */}
        <div className="grid grid-cols-4 gap-1 sm:gap-1.5 mb-1.5">
          <button
            type="button"
            onClick={() => handleAddBlock('forward', 1)}
            disabled={isRunning || !isTimerRunning}
            className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-95 disabled:opacity-40 text-white font-black text-xs shadow-md border border-blue-400/30 cursor-pointer transition"
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
            <span>+1 İLERİ</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('forward', 2)}
            disabled={isRunning || !isTimerRunning}
            className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 active:scale-95 disabled:opacity-40 text-white font-black text-xs shadow-md border border-sky-400/30 cursor-pointer transition"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
            <span>+2x İLERİ</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('turn_left')}
            disabled={isRunning || !isTimerRunning}
            className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 disabled:opacity-40 text-white font-black text-xs shadow-md border border-indigo-400/30 cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>SOLA DÖN</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('turn_right')}
            disabled={isRunning || !isTimerRunning}
            className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-95 disabled:opacity-40 text-white font-black text-xs shadow-md border border-purple-400/30 cursor-pointer transition"
          >
            <RotateCw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>SAĞA DÖN</span>
          </button>
        </div>

        {/* Row 2: Horizontal Scrolling Code Sequence Tray (Akış & Komut Dizisi) */}
        <div className="w-full h-[44px] sm:h-[48px] bg-slate-950/95 rounded-xl px-2 border border-slate-800 flex items-center gap-1.5 overflow-x-auto overflow-y-hidden mb-1.5 select-none scrollbar-thin">
          {blocks.length === 0 ? (
            <div className="w-full flex items-center justify-center text-slate-500 text-[11px] font-semibold gap-1.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-slate-600" />
              <span>Komut dizisi boş. Yukarıdaki butonlarla algoritmanızı oluşturun.</span>
            </div>
          ) : (
            blocks.map((b, idx) => {
              const isActive = activeBlockId === b.id;
              let label = 'İleri';
              let badgeBg = 'bg-blue-950/90 border-blue-500/50 text-blue-200';
              let icon = <ArrowUp className="w-3 h-3 text-blue-300 stroke-[3]" />;

              if (b.type === 'forward' && b.stepCount && b.stepCount === 2) {
                label = '2x İleri';
                badgeBg = 'bg-sky-950/90 border-sky-400/50 text-sky-200';
                icon = <Zap className="w-3 h-3 text-amber-300 fill-current" />;
              } else if (b.type === 'turn_left') {
                label = 'Sola Dön';
                badgeBg = 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200';
                icon = <RotateCcw className="w-3 h-3 text-indigo-300 stroke-[2.5]" />;
              } else if (b.type === 'turn_right') {
                label = 'Sağa Dön';
                badgeBg = 'bg-purple-950/90 border-purple-500/50 text-purple-200';
                icon = <RotateCw className="w-3 h-3 text-purple-300 stroke-[2.5]" />;
              }

              return (
                <div
                  key={b.id}
                  className={`group flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-black shrink-0 transition-all shadow ${badgeBg} ${
                    isActive
                      ? 'ring-2 ring-emerald-400 scale-105 bg-emerald-950 text-emerald-200 border-emerald-400'
                      : 'hover:border-slate-400'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-950/80 flex items-center justify-center text-[9px] font-bold text-slate-400">
                    {idx + 1}
                  </span>
                  {icon}
                  <span>{label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(b.id)}
                    disabled={isRunning}
                    title="Bu adımı sil"
                    className="p-0.5 rounded hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Row 3: Action Toolbar - Big Run, Undo, Reset, Clear */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning || blocks.length === 0 || !isTimerRunning}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm shadow-xl transition cursor-pointer active:scale-98 ${
              isP1
                ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950'
                : 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-slate-950'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'YÜRÜTÜLÜYOR...' : 'KODU ÇALIŞTIR'}</span>
          </button>

          <button
            type="button"
            onClick={handleUndoLastBlock}
            disabled={isRunning || blocks.length === 0}
            title="Son Adımı Geri Al"
            className="flex items-center gap-1 px-2.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer transition disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Geri Al</span>
          </button>

          <button
            type="button"
            onClick={handleResetPosition}
            disabled={isRunning}
            title="Karakteri Başlangıç Noktasına Getir"
            className="flex items-center gap-1 px-2.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Başa Al</span>
          </button>

          <button
            type="button"
            onClick={handleClearBlocks}
            disabled={isRunning || blocks.length === 0}
            title="Tüm Kodları Temizle"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 font-bold text-xs border border-slate-700 cursor-pointer transition disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
