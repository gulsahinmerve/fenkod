import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  LevelConfig,
  Student,
  CodeBlock,
  Direction,
  ScienceQuestion,
  StudentLevelResult
} from '../types/game';
import { GameArea } from './GameArea';
import { CodeEditor } from './CodeEditor';
import { ScienceQuestionModal } from './ScienceQuestionModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { compileProgram, ExecStep } from '../utils/interpreter';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { ADVENTURE_LEVELS } from '../data/levels';
import { buildDynamicLevel } from '../utils/dynamicLevel';
import { ArrowLeft, Clock, Target, Gem, Award, Zap, AlertCircle, QrCode, Maximize2, Minimize2 } from 'lucide-react';
import { QrAccessModal } from './QrAccessModal';

interface AdventureGameViewProps {
  level: LevelConfig;
  activeStudent: Student;
  selectedCharId: string;
  isCompetitionMode?: boolean;
  competitionTimeLimit?: number;
  onFinishLevel?: () => void;
  onBackToLevels: () => void;
  onNextLevel?: (nextLvl: LevelConfig) => void;
  onOpenCharacterWardrobe?: () => void;
}

export const AdventureGameView: React.FC<AdventureGameViewProps> = ({
  level,
  activeStudent,
  selectedCharId,
  isCompetitionMode = false,
  competitionTimeLimit = 0,
  onFinishLevel,
  onBackToLevels,
  onNextLevel,
  onOpenCharacterWardrobe,
}) => {
  // Dynamic level variation for fresh questions & door positions on replay
  const [replaySalt, setReplaySalt] = useState(() => Date.now());
  const dynamicLevel = useMemo(() => buildDynamicLevel(level, 1, replaySalt).level, [level.id, replaySalt]);
  const customization = storage.getCustomization();

  // Arena State
  const [playerPos, setPlayerPos] = useState({ ...dynamicLevel.startPos });
  const [direction, setDirection] = useState<Direction>(dynamicLevel.startDir);
  const [cells, setCells] = useState(dynamicLevel.cells.map((c) => ({ ...c })));
  const [charState, setCharState] = useState<'idle' | 'walk' | 'cheer' | 'think' | 'celebrate'>('idle');
  const [collisionCell, setCollisionCell] = useState<{ x: number; y: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Coding State
  const [blocks, setBlocks] = useState<CodeBlock[]>([
    { id: 'b_init_1', type: 'forward' },
    { id: 'b_init_2', type: 'forward' },
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speedMs, setSpeedMs] = useState(350);

  // Cancellation ref for async code execution
  const stopExecutionRef = useRef(false);

  // Science Question Popup State
  const [activeQuestion, setActiveQuestion] = useState<ScienceQuestion | null>(null);
  const [pendingResumeSteps, setPendingResumeSteps] = useState<{ steps: ExecStep[]; currentIdx: number } | null>(null);

  // Step-by-step debugger index
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Score & Metrics Tracking
  const [levelScore, setLevelScore] = useState(0);
  const [questionsSolvedCount, setQuestionsSolvedCount] = useState(0);
  const [crystalsCount, setCrystalsCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryData, setVictoryData] = useState<{
    stars: number;
    totalScore: number;
    newBadges: string[];
  } | null>(null);

  // Smartboard QR & Fullscreen State
  const [showQrModal, setShowQrModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reset arena state
  const handleReset = () => {
    soundManager.playClick();
    stopExecutionRef.current = true;
    setIsRunning(false);
    setActiveBlockId(null);
    const freshSalt = Date.now();
    setReplaySalt(freshSalt);
    const freshLevel = buildDynamicLevel(level, 1, freshSalt).level;
    setPlayerPos({ ...freshLevel.startPos });
    setDirection(freshLevel.startDir);
    setCells(freshLevel.cells.map((c) => ({ ...c })));
    setCollisionCell(null);
    setErrorMessage(null);
    setCharState('idle');
    setActiveQuestion(null);
    setPendingResumeSteps(null);
    setCurrentStepIdx(0);
  };

  const handleStop = () => {
    soundManager.playClick();
    stopExecutionRef.current = true;
    setIsRunning(false);
    setActiveBlockId(null);
    setCharState('idle');
  };

  // Main Execution Loop
  const executeStepSequence = async (
    steps: ExecStep[],
    startIndex = 0,
    initialPos = playerPos,
    initialDir = direction,
    initialCells = cells
  ) => {
    let curPos = { ...initialPos };
    let curDir = initialDir;
    let curCells = initialCells.map((c) => ({ ...c }));

    for (let i = startIndex; i < steps.length; i++) {
      if (stopExecutionRef.current) {
        break;
      }

      const step = steps[i];
      setActiveBlockId(step.blockId);

      if (step.type === 'turn_right') {
        curDir = ((curDir + 1) % 4) as Direction;
        setDirection(curDir);
        soundManager.playTurn();
        await new Promise((r) => setTimeout(r, speedMs));
      } else if (step.type === 'turn_left') {
        curDir = ((curDir + 3) % 4) as Direction;
        setDirection(curDir);
        soundManager.playTurn();
        await new Promise((r) => setTimeout(r, speedMs));
      } else if (step.type === 'forward') {
        let nx = curPos.x;
        let ny = curPos.y;
        if (curDir === 0) nx += 1;
        else if (curDir === 1) ny += 1;
        else if (curDir === 2) nx -= 1;
        else if (curDir === 3) ny -= 1;

        // Boundary or Wall / Hazard checks
        const isOutOfBounds = nx < 0 || nx >= level.gridWidth || ny < 0 || ny >= level.gridHeight;
        const targetCell = curCells.find((c) => c.x === nx && c.y === ny);

        // Wall or Obstacle collision
        if (isOutOfBounds || targetCell?.type === 'wall' || targetCell?.type === 'obstacle') {
          soundManager.playCollision();
          setCollisionCell({ x: nx, y: ny });
          setErrorMessage('Duvara çarptın! Önün kapalı.');
          setCharState('think');
          setMistakesCount((m) => m + 1);
          setIsRunning(false);
          stopExecutionRef.current = true;
          setActiveBlockId(null);
          return;
        }

        // Science Question Gate: Check if locked
        if (targetCell?.type === 'question' && !targetCell.unlocked) {
          // Pause execution and open Question Modal!
          soundManager.playClick();
          setCharState('think');
          setIsRunning(false);
          stopExecutionRef.current = true;

          // Find question from pool
          const allQuestions = storage.getQuestions();
          const qId = targetCell.questionId || level.questionIds[0];
          const foundQ = allQuestions.find((q) => q.id === qId) || allQuestions[0];

          setActiveQuestion(foundQ);
          setPendingResumeSteps({ steps, currentIdx: i });
          return;
        }

        // Valid Forward Step!
        curPos = { x: nx, y: ny };
        setPlayerPos(curPos);
        setCharState('walk');
        soundManager.playStep();

        // Crystal Collect
        if (targetCell?.type === 'crystal' && !targetCell.collected) {
          targetCell.collected = true;
          setCells([...curCells]);
          setCrystalsCount((c) => c + 1);
          setLevelScore((s) => s + 30);
          soundManager.playCrystal();
        }

        // Check if Reached Exit Portal!
        if (curPos.x === level.targetPos.x && curPos.y === level.targetPos.y) {
          // MANDATORY SCIENCE QUESTION CHECK!
          const remainingUnsolved = curCells.filter((c) => c.type === 'question' && !c.unlocked);
          if (remainingUnsolved.length > 0) {
            soundManager.playCollision();
            setErrorMessage(`Çıkış Kilitli! Haritadaki tüm fen kapılarını (${remainingUnsolved.length} soru kaldı) çözmelisin!`);
            setCharState('think');
            setIsRunning(false);
            stopExecutionRef.current = true;
            setActiveBlockId(null);
            return;
          }

          setIsRunning(false);
          stopExecutionRef.current = true;
          setActiveBlockId(null);
          setCharState('celebrate');
          handleLevelCompleted();
          return;
        }

        await new Promise((r) => setTimeout(r, speedMs));
        setCharState('idle');
      } else if (step.type === 'wait') {
        await new Promise((r) => setTimeout(r, speedMs * 1.5));
      }
    }

    setIsRunning(false);
    stopExecutionRef.current = true;
    setActiveBlockId(null);
    setCharState('idle');
  };

  const handleRun = () => {
    if (isRunning) return;
    if (blocks.length === 0) {
      setErrorMessage('Lütfen önce en az bir komut ekleyin!');
      return;
    }

    setErrorMessage(null);
    setCollisionCell(null);
    stopExecutionRef.current = false;
    setIsRunning(true);

    // Compile Program from blocks
    const steps = compileProgram(
      blocks,
      level.startPos,
      level.startDir,
      level.cells,
      level.gridWidth,
      level.gridHeight
    );

    // Reset character to start pos
    setPlayerPos({ ...level.startPos });
    setDirection(level.startDir);
    setCells(level.cells.map((c) => ({ ...c })));
    setCurrentStepIdx(0);

    executeStepSequence(steps, 0, level.startPos, level.startDir, level.cells);
  };

  // Step-by-step execution for debugging
  const handleStep = async () => {
    if (isRunning || blocks.length === 0) return;
    setErrorMessage(null);
    setCollisionCell(null);

    const steps = compileProgram(
      blocks,
      playerPos,
      direction,
      cells,
      level.gridWidth,
      level.gridHeight
    );

    if (currentStepIdx >= steps.length) {
      // Loop over or reset
      setCurrentStepIdx(0);
      return;
    }

    const step = steps[currentStepIdx];
    setActiveBlockId(step.blockId);
    stopExecutionRef.current = false;

    let curPos = { ...playerPos };
    let curDir = direction;
    let curCells = [...cells];

    if (step.type === 'turn_right') {
      curDir = ((curDir + 1) % 4) as Direction;
      setDirection(curDir);
      soundManager.playTurn();
    } else if (step.type === 'turn_left') {
      curDir = ((curDir + 3) % 4) as Direction;
      setDirection(curDir);
      soundManager.playTurn();
    } else if (step.type === 'forward') {
      let nx = curPos.x;
      let ny = curPos.y;
      if (curDir === 0) nx += 1;
      else if (curDir === 1) ny += 1;
      else if (curDir === 2) nx -= 1;
      else if (curDir === 3) ny -= 1;

      const isOutOfBounds = nx < 0 || nx >= level.gridWidth || ny < 0 || ny >= level.gridHeight;
      const targetCell = curCells.find((c) => c.x === nx && c.y === ny);

      if (isOutOfBounds || targetCell?.type === 'wall' || targetCell?.type === 'obstacle') {
        soundManager.playCollision();
        setCollisionCell({ x: nx, y: ny });
        setErrorMessage('Duvara çarptın! Önün kapalı.');
        setCharState('think');
        return;
      }

      if (targetCell?.type === 'question' && !targetCell.unlocked) {
        soundManager.playClick();
        setCharState('think');
        const allQuestions = storage.getQuestions();
        const qId = targetCell.questionId || level.questionIds[0];
        const foundQ = allQuestions.find((q) => q.id === qId) || allQuestions[0];
        setActiveQuestion(foundQ);
        setPendingResumeSteps({ steps, currentIdx: currentStepIdx });
        return;
      }

      curPos = { x: nx, y: ny };
      setPlayerPos(curPos);
      soundManager.playStep();

      if (targetCell?.type === 'crystal' && !targetCell.collected) {
        targetCell.collected = true;
        setCells([...curCells]);
        setCrystalsCount((c) => c + 1);
        setLevelScore((s) => s + 30);
        soundManager.playCrystal();
      }

      if (curPos.x === level.targetPos.x && curPos.y === level.targetPos.y) {
        const remainingUnsolved = curCells.filter((c) => c.type === 'question' && !c.unlocked);
        if (remainingUnsolved.length > 0) {
          soundManager.playCollision();
          setErrorMessage(`Çıkış Kilitli! Haritadaki tüm fen kapılarını (${remainingUnsolved.length} soru kaldı) çözmelisin!`);
          setCharState('think');
          return;
        }
        setCharState('celebrate');
        handleLevelCompleted();
        return;
      }
    }

    setCurrentStepIdx((prev) => prev + 1);
  };

  // Called when student answers question correctly
  const handleQuestionCorrect = (firstTry: boolean) => {
    setActiveQuestion(null);
    setCharState('cheer');
    setQuestionsSolvedCount((c) => c + 1);
    const addedScore = firstTry ? 100 : 70;
    setLevelScore((s) => s + addedScore);

    // Unlock target gate cell
    if (pendingResumeSteps) {
      let nx = playerPos.x;
      let ny = playerPos.y;
      if (direction === 0) nx += 1;
      else if (direction === 1) ny += 1;
      else if (direction === 2) nx -= 1;
      else if (direction === 3) ny -= 1;

      const updatedCells = cells.map((c) => {
        if (c.x === nx && c.y === ny && c.type === 'question') {
          return { ...c, unlocked: true };
        }
        return c;
      });
      setCells(updatedCells);

      // Resume execution sequence
      setTimeout(() => {
        stopExecutionRef.current = false;
        setIsRunning(true);
        executeStepSequence(
          pendingResumeSteps.steps,
          pendingResumeSteps.currentIdx,
          playerPos,
          direction,
          updatedCells
        );
        setPendingResumeSteps(null);
      }, 300);
    }
  };

  const handleQuestionWrong = () => {
    setMistakesCount((m) => m + 1);
    setLevelScore((prev) => Math.max(0, prev - 15));
    setErrorMessage('Yanlış cevap! -15 Puan kesildi. Tekrar deneyebilirsin.');
    setTimeout(() => setErrorMessage(null), 3500);
  };

  // Level Victory Celebration & Score Calculation
  const handleLevelCompleted = () => {
    soundManager.playVictory();

    const commandsCount = blocks.length;
    let stars = 1;
    if (commandsCount <= level.parCommands && mistakesCount === 0) {
      stars = 3;
    } else if (commandsCount <= level.parCommands + 3) {
      stars = 2;
    }

    let total = levelScore + 50; // base completion
    if (commandsCount <= level.parCommands) {
      total += 50; // par commands bonus
    }

    const newBadges: string[] = [];
    if (commandsCount <= level.parCommands) {
      storage.earnBadge(activeStudent.id, 'badge_algo');
      newBadges.push('badge_algo');
    }
    if (questionsSolvedCount >= 2) {
      storage.earnBadge(activeStudent.id, 'badge_science');
      newBadges.push('badge_science');
    }
    if (level.levelNumber === 6) {
      storage.earnBadge(activeStudent.id, 'badge_master');
      newBadges.push('badge_master');
    }

    const result: StudentLevelResult = {
      studentId: activeStudent.id,
      levelId: level.id,
      completed: true,
      score: total,
      stars,
      commandsUsed: commandsCount,
      questionsSolved: questionsSolvedCount,
      mistakesCount,
      timeSpentSeconds: elapsedSeconds,
      completedAt: Date.now()
    };

    storage.saveLevelResult(result);

    if (isCompetitionMode) {
      storage.addLeaderboardEntry({
        id: `lead_${Date.now()}`,
        studentId: activeStudent.id,
        studentName: activeStudent.fullName,
        gradeSection: `${activeStudent.grade}-${activeStudent.section}`,
        score: total,
        questionsSolved: questionsSolvedCount,
        timeSeconds: elapsedSeconds,
        completedLevelId: level.title,
        timestamp: Date.now()
      });
    }

    setVictoryData({
      stars,
      totalScore: total,
      newBadges
    });
    setShowVictoryModal(true);
  };

  const currentLevelIndex = ADVENTURE_LEVELS.findIndex((l) => l.id === level.id);
  const nextLevel = ADVENTURE_LEVELS[currentLevelIndex + 1];

  const unsolvedQuestionsCount = cells.filter((c) => c.type === 'question' && !c.unlocked).length;

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 animate-fade-in select-none">
      {/* Top Level Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onBackToLevels();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Haritaya Dön</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                Seviye {level.levelNumber}
              </span>
              <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2 py-0.5 rounded-md">
                Yıldızkent Ortaokulu
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">{level.title}</h2>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {level.scienceObjective}
            </p>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Target Par */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Hedef Komut:</span>
            <span className="text-cyan-300 font-bold font-mono">{level.parCommands}</span>
          </div>

          {/* Crystals */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold font-mono">{crystalsCount}</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-bold">{elapsedSeconds} sn</span>
            {isCompetitionMode && competitionTimeLimit > 0 && (
              <span className="text-slate-500 font-normal">/ {competitionTimeLimit} sn</span>
            )}
          </div>

          {/* Live Score */}
          <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-bold font-mono">{levelScore} Puan</span>
          </div>

          {/* Smartboard Mobile QR Access Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setShowQrModal(true);
            }}
            title="Akıllı Tahta / Cep Telefonu Karekod Erişimi"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 text-xs font-bold cursor-pointer transition shadow"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">Karekod</span>
          </button>

          {/* Fullscreen Sığdırma Butonu */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
                setIsFullscreen(true);
              } else {
                document.exitFullscreen().catch(() => {});
                setIsFullscreen(false);
              }
            }}
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Akıllı Tahtaya / Ekrana Tam Sığdır'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/60 text-indigo-300 text-xs font-bold cursor-pointer transition shadow"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-indigo-400" /> : <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="hidden md:inline">Tam Ekrana Sığdır</span>
          </button>
        </div>
      </div>

      {/* Smartboard QR Access Modal */}
      <QrAccessModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

      {/* Mandatory Questions Banner */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-2 text-slate-300">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Zorunlu Fen Kapıları:</strong> Çıkışa ulaşabilmek için tüm fen sorularını çözmelisin!
          </span>
        </div>
        <div className="flex items-center gap-2">
          {unsolvedQuestionsCount > 0 ? (
            <span className="bg-amber-950/70 border border-amber-500/60 text-amber-300 font-bold px-2.5 py-0.5 rounded-lg text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{unsolvedQuestionsCount} Kilitli Fen Kapısı Kaldı</span>
            </span>
          ) : (
            <span className="bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 font-bold px-2.5 py-0.5 rounded-lg text-xs">
              ✓ Tüm Fen Kapıları Açıldı! Çıkış Aktif!
            </span>
          )}
        </div>
      </div>

      {/* Main Split Layout: Game Arena (Left) & Code Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start mt-4">
        {/* Left Column: Game Area (7 cols) */}
        <div className="lg:col-span-7">
          <GameArea
            gridWidth={level.gridWidth}
            gridHeight={level.gridHeight}
            cells={cells}
            playerPos={playerPos}
            direction={direction}
            characterId={selectedCharId}
            characterState={charState}
            targetPos={dynamicLevel.targetPos}
            startPos={dynamicLevel.startPos}
            collisionCell={collisionCell}
            errorMessage={errorMessage}
            unsolvedQuestionsCount={unsolvedQuestionsCount}
            theme={dynamicLevel.theme}
            outfitId={customization.outfitId}
            accessoryId={customization.accessoryId}
          />
        </div>

        {/* Right Column: Code Editor (5 cols) */}
        <div className="lg:col-span-5">
          <CodeEditor
            blocks={blocks}
            activeBlockId={activeBlockId}
            isRunning={isRunning}
            codeMode={level.codeMode}
            speedMs={speedMs}
            onUpdateBlocks={setBlocks}
            onRun={handleRun}
            onStop={handleStop}
            onReset={handleReset}
            onStep={handleStep}
            onChangeSpeed={setSpeedMs}
          />
        </div>
      </div>

      {/* Science Question Modal Triggered by Doors */}
      {activeQuestion && (
        <ScienceQuestionModal
          question={activeQuestion}
          onAnswerCorrect={handleQuestionCorrect}
          onAnswerWrong={handleQuestionWrong}
        />
      )}

      {/* Level Victory Modal */}
      {showVictoryModal && victoryData && (
        <LevelCompleteModal
          levelTitle={level.title}
          levelNumber={level.levelNumber}
          score={victoryData.totalScore}
          stars={victoryData.stars}
          commandsUsed={blocks.length}
          parCommands={level.parCommands}
          questionsSolved={questionsSolvedCount}
          crystalsCollected={crystalsCount}
          newBadges={victoryData.newBadges}
          hasNextLevel={!!nextLevel}
          onOpenCharacterWardrobe={() => {
            setShowVictoryModal(false);
            if (onOpenCharacterWardrobe) {
              onOpenCharacterWardrobe();
            }
          }}
          onNextLevel={() => {
            setShowVictoryModal(false);
            if (nextLevel && onNextLevel) {
              onNextLevel(nextLevel);
            }
          }}
          onRetry={() => {
            setShowVictoryModal(false);
            handleReset();
          }}
          onBackToMenu={() => {
            setShowVictoryModal(false);
            onBackToLevels();
          }}
        />
      )}
    </div>
  );
};
