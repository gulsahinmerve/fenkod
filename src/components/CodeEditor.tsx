import React, { useState } from 'react';
import { CodeBlock, CommandType, ConditionType } from '../types/game';
import {
  Play,
  Square,
  RotateCcw,
  Undo2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Repeat,
  Compass,
  FastForward,
  ArrowUp,
  CornerDownRight,
  HelpCircle,
  Zap,
  Sparkles,
  Layers
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CodeEditorProps {
  blocks: CodeBlock[];
  activeBlockId: string | null;
  isRunning: boolean;
  codeMode: 'buttons' | 'blocks' | 'both';
  speedMs: number;
  onUpdateBlocks: (blocks: CodeBlock[]) => void;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onStep: () => void;
  onChangeSpeed: (ms: number) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  blocks,
  activeBlockId,
  isRunning,
  codeMode,
  speedMs,
  onUpdateBlocks,
  onRun,
  onStop,
  onReset,
  onStep,
  onChangeSpeed,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'movement' | 'control'>('all');
  const [history, setHistory] = useState<CodeBlock[][]>([]);

  const pushHistory = (newBlocks: CodeBlock[]) => {
    setHistory((prev) => [...prev.slice(-15), blocks]);
    onUpdateBlocks(newBlocks);
  };

  const handleUndo = () => {
    if (history.length === 0 || isRunning) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    onUpdateBlocks(previous);
    soundManager.playClick();
  };

  const handleClear = () => {
    if (isRunning) return;
    pushHistory([]);
    soundManager.playClick();
  };

  // Add command with custom stepCount shortcut
  const handleAddCommand = (type: CommandType, stepCount = 1) => {
    if (isRunning) return;
    soundManager.playClick();
    const newBlock: CodeBlock = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      stepCount: type === 'forward' ? stepCount : undefined,
    };
    pushHistory([...blocks, newBlock]);
  };

  // Set step count on an existing forward block
  const handleSetStepCount = (blockIndex: number, newCount: number) => {
    if (isRunning) return;
    const count = Math.max(1, Math.min(newCount, 8));
    const newBlocks = [...blocks];
    newBlocks[blockIndex] = { ...newBlocks[blockIndex], stepCount: count };
    pushHistory(newBlocks);
    soundManager.playClick();
  };

  // Add loop block
  const handleAddLoop = (count = 3) => {
    if (isRunning) return;
    soundManager.playClick();
    const newBlock: CodeBlock = {
      id: `loop_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: 'loop',
      loopCount: count,
      children: [
        {
          id: `cmd_${Date.now()}_sub`,
          type: 'forward',
          stepCount: 1
        }
      ]
    };
    pushHistory([...blocks, newBlock]);
  };

  // Add conditional block
  const handleAddCondition = (cond: ConditionType = 'front_is_blocked') => {
    if (isRunning) return;
    soundManager.playClick();
    const newBlock: CodeBlock = {
      id: `if_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: 'if_condition',
      condition: cond,
      children: [
        {
          id: `cmd_${Date.now()}_then`,
          type: 'turn_right'
        }
      ],
      elseChildren: [
        {
          id: `cmd_${Date.now()}_else`,
          type: 'forward',
          stepCount: 1
        }
      ]
    };
    pushHistory([...blocks, newBlock]);
  };

  // Move block up
  const handleMoveUp = (index: number) => {
    if (index === 0 || isRunning) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index - 1];
    newBlocks[index - 1] = newBlocks[index];
    newBlocks[index] = temp;
    pushHistory(newBlocks);
    soundManager.playClick();
  };

  // Move block down
  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1 || isRunning) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index + 1];
    newBlocks[index + 1] = newBlocks[index];
    newBlocks[index] = temp;
    pushHistory(newBlocks);
    soundManager.playClick();
  };

  // Delete a block
  const handleDeleteBlock = (index: number) => {
    if (isRunning) return;
    const newBlocks = blocks.filter((_, idx) => idx !== index);
    pushHistory(newBlocks);
    soundManager.playClick();
  };

  // Change loop count
  const handleSetLoopCount = (blockIndex: number, delta: number) => {
    if (isRunning) return;
    const newBlocks = [...blocks];
    const current = newBlocks[blockIndex].loopCount || 2;
    const nextVal = Math.max(2, Math.min(current + delta, 9));
    newBlocks[blockIndex] = { ...newBlocks[blockIndex], loopCount: nextVal };
    pushHistory(newBlocks);
    soundManager.playClick();
  };

  // Change condition
  const handleChangeCondition = (blockIndex: number, cond: ConditionType) => {
    if (isRunning) return;
    const newBlocks = [...blocks];
    newBlocks[blockIndex] = { ...newBlocks[blockIndex], condition: cond };
    pushHistory(newBlocks);
    soundManager.playClick();
  };

  // Children inside loop/conditional
  const handleAddChildToBlock = (parentIdx: number, type: CommandType, isElse = false) => {
    if (isRunning) return;
    const newBlocks = [...blocks];
    const parent = { ...newBlocks[parentIdx] };
    const child: CodeBlock = {
      id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      stepCount: type === 'forward' ? 1 : undefined
    };
    if (isElse) {
      parent.elseChildren = [...(parent.elseChildren || []), child];
    } else {
      parent.children = [...(parent.children || []), child];
    }
    newBlocks[parentIdx] = parent;
    pushHistory(newBlocks);
    soundManager.playClick();
  };

  const handleDeleteChildFromBlock = (parentIdx: number, childIdx: number, isElse = false) => {
    if (isRunning) return;
    const newBlocks = [...blocks];
    const parent = { ...newBlocks[parentIdx] };
    if (isElse && parent.elseChildren) {
      parent.elseChildren = parent.elseChildren.filter((_, idx) => idx !== childIdx);
    } else if (parent.children) {
      parent.children = parent.children.filter((_, idx) => idx !== childIdx);
    }
    newBlocks[parentIdx] = parent;
    pushHistory(newBlocks);
    soundManager.playClick();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/95 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header / Mode Switcher */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block">
              BLOK KODLAMA EDİTÖRÜ
            </span>
            <span className="text-[10px] text-slate-400">
              {blocks.length} Blok Algoritma
            </span>
          </div>
        </div>

        {/* Speed, Undo, Clear Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Geri Al"
            onClick={handleUndo}
            disabled={history.length === 0 || isRunning}
            className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded hover:bg-slate-800 transition cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Tüm Blokları Temizle"
            onClick={handleClear}
            disabled={blocks.length === 0 || isRunning}
            className="p-1.5 text-slate-400 hover:text-rose-400 disabled:opacity-30 rounded hover:bg-slate-800 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center ml-1 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-300 overflow-hidden">
            <button
              type="button"
              onClick={() => onChangeSpeed(550)}
              className={`px-2 py-1 cursor-pointer transition ${speedMs >= 500 ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-slate-800'}`}
              title="Normal Hız"
            >
              1x
            </button>
            <button
              type="button"
              onClick={() => onChangeSpeed(350)}
              className={`px-2 py-1 cursor-pointer transition ${speedMs < 500 && speedMs > 250 ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-slate-800'}`}
              title="Hızlı"
            >
              2x
            </button>
            <button
              type="button"
              onClick={() => onChangeSpeed(180)}
              className={`px-2 py-1 cursor-pointer transition ${speedMs <= 250 ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-slate-800'}`}
              title="Süper Hızlı"
            >
              3x
            </button>
          </div>
        </div>
      </div>

      {/* Block Palette Category Tabs */}
      <div className="flex items-center gap-1 px-3 pt-2 pb-1 bg-slate-950/60 border-b border-slate-800/80 text-[11px]">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tüm Bloklar
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('movement')}
          className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
            activeCategory === 'movement'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-blue-300'
          }`}
        >
          Hareket Blokları
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('control')}
          className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
            activeCategory === 'control'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-amber-300'
          }`}
        >
          Kontrol & Döngü
        </button>
      </div>

      {/* Visual Block Palette (Tap to Add) */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800 space-y-2.5">
        {/* Kısayol Adım Butonları (1x, 2x, 3x, 4x İleri Git) */}
        {(activeCategory === 'all' || activeCategory === 'movement') && (
          <div>
            <div className="text-[10px] font-bold text-cyan-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                İLERİ GİT KISAYOLLARI (Tek Dokunuşla Ekle):
              </span>
            </div>

            {/* Grid of Forward shortcuts: 1x, 2x, 3x, 4x */}
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => handleAddCommand('forward', step)}
                  disabled={isRunning}
                  className={`group relative flex items-center justify-center gap-1 py-2 px-1 rounded-xl font-black text-xs shadow-md transition transform active:scale-95 cursor-pointer disabled:opacity-40 border ${
                    step === 1
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-blue-400/50'
                      : step === 2
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white border-cyan-400/60 ring-1 ring-cyan-400/30'
                      : step === 3
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-indigo-400/50'
                      : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white border-sky-400/50'
                  }`}
                  title={`${step} kere ileri gitme komut bloğu ekle`}
                >
                  <ArrowUp className="w-3.5 h-3.5 shrink-0 group-hover:-translate-y-0.5 transition" />
                  <span>{step}x İleri</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Turning & Waiting Blocks */}
        {(activeCategory === 'all' || activeCategory === 'movement') && (
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleAddCommand('turn_right')}
              disabled={isRunning}
              className="flex items-center justify-center gap-1 py-2 px-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl border border-purple-400/40 shadow cursor-pointer transition active:scale-95"
            >
              <CornerDownRight className="w-3.5 h-3.5" />
              <span>Sağa Dön (90°)</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddCommand('turn_left')}
              disabled={isRunning}
              className="flex items-center justify-center gap-1 py-2 px-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl border border-purple-400/40 shadow cursor-pointer transition active:scale-95"
            >
              <CornerDownRight className="w-3.5 h-3.5 transform -scale-x-100" />
              <span>Sola Dön (90°)</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddCommand('wait')}
              disabled={isRunning}
              className="flex items-center justify-center gap-1 py-2 px-1.5 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 shadow cursor-pointer transition active:scale-95"
            >
              <span>⏳ 1 Adım Bekle</span>
            </button>
          </div>
        )}

        {/* Control & Loop Blocks (Tekrarla & Eğer) */}
        {(activeCategory === 'all' || activeCategory === 'control') && (
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => handleAddLoop(3)}
              disabled={isRunning}
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition active:scale-95 border border-amber-400/50"
            >
              <Repeat className="w-3.5 h-3.5 text-amber-200" />
              <span>TEKRARLA (Döngü)</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddCondition('front_is_blocked')}
              disabled={isRunning}
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition active:scale-95 border border-emerald-400/50"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>EĞER ... İSE (Koşul)</span>
            </button>
          </div>
        )}
      </div>

      {/* Program Code List (Scratch / Blockly style interlocking blocks) */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-[160px] max-h-[360px] bg-slate-950/30">
        {blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
            <Sparkles className="w-6 h-6 text-cyan-500/40 mb-2" />
            <p className="text-xs font-bold text-slate-300">Algoritman henüz boş!</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Yukarıdaki <strong>1x, 2x, 3x İleri Git</strong> veya <strong>Döngü</strong> bloklarına dokunarak komutlarını sırayla buraya ekle.
            </p>
          </div>
        ) : (
          blocks.map((block, idx) => {
            const isActive = activeBlockId === block.id;

            // Simple Movement & Turn & Wait Block
            if (
              block.type === 'forward' ||
              block.type === 'turn_right' ||
              block.type === 'turn_left' ||
              block.type === 'wait'
            ) {
              const stepCount = block.stepCount || 1;
              return (
                <div
                  key={block.id}
                  className={`relative flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xl shadow-amber-400/40 scale-[1.02] ring-4 ring-amber-300/60 z-10'
                      : block.type === 'forward'
                      ? 'bg-gradient-to-r from-blue-950/90 to-cyan-950/80 border-blue-500/60 text-blue-100 hover:border-cyan-400'
                      : block.type === 'wait'
                      ? 'bg-slate-900 border-slate-700 text-slate-200'
                      : 'bg-gradient-to-r from-purple-950/90 to-indigo-950/80 border-purple-500/60 text-purple-100 hover:border-purple-400'
                  }`}
                >
                  {/* Left: Step index & Block badge */}
                  <div className="flex items-center gap-2 font-bold text-xs flex-wrap">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono ${
                        isActive
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-slate-900 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    {/* Forward block with visual step multiplier */}
                    {block.type === 'forward' && (
                      <div className="flex items-center gap-2">
                        <ArrowUp className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                        <span className="font-black tracking-wide">
                          {stepCount > 1 ? `${stepCount}x İLERİ GİT` : 'İLERİ GİT'}
                        </span>

                        {/* Step Multiplier Pills / Controls */}
                        <div
                          className={`flex items-center rounded-lg px-1 text-[11px] border ${
                            isActive
                              ? 'bg-slate-950 text-amber-300 border-slate-900'
                              : 'bg-slate-900/90 border-cyan-500/50 text-cyan-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSetStepCount(idx, stepCount - 1)}
                            disabled={isRunning || stepCount <= 1}
                            className="px-1 font-black cursor-pointer hover:text-white disabled:opacity-20"
                            title="1 Adım Azalt"
                          >
                            -
                          </button>
                          <span className="font-mono font-black px-1.5">
                            {stepCount} Adım
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSetStepCount(idx, stepCount + 1)}
                            disabled={isRunning || stepCount >= 8}
                            className="px-1 font-black cursor-pointer hover:text-white disabled:opacity-20"
                            title="1 Adım Artır"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {block.type === 'turn_right' && (
                      <div className="flex items-center gap-1.5">
                        <CornerDownRight className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-purple-400'}`} />
                        <span>SAĞA DÖN (90°)</span>
                      </div>
                    )}

                    {block.type === 'turn_left' && (
                      <div className="flex items-center gap-1.5">
                        <CornerDownRight
                          className={`w-4 h-4 transform -scale-x-100 ${isActive ? 'text-slate-950' : 'text-purple-400'}`}
                        />
                        <span>SOLA DÖN (90°)</span>
                      </div>
                    )}

                    {block.type === 'wait' && (
                      <div className="flex items-center gap-1.5">
                        <span>⏳ 1 ADIM BEKLE</span>
                      </div>
                    )}
                  </div>

                  {/* Actions for block: Up, Down, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0 || isRunning}
                      className="p-1 hover:bg-slate-800/80 rounded disabled:opacity-20 cursor-pointer"
                      title="Yukarı Taşı"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === blocks.length - 1 || isRunning}
                      className="p-1 hover:bg-slate-800/80 rounded disabled:opacity-20 cursor-pointer"
                      title="Aşağı Taşı"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(idx)}
                      disabled={isRunning}
                      className="p-1 hover:bg-rose-900/50 text-rose-400 rounded disabled:opacity-20 cursor-pointer"
                      title="Bloğu Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            }

            // Loop Block (Scratch-style C-block)
            if (block.type === 'loop') {
              return (
                <div
                  key={block.id}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'bg-amber-950/90 border-amber-400 ring-4 ring-amber-400/50'
                      : 'bg-amber-950/40 border-amber-600/70'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-amber-600/40">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Repeat className="w-4 h-4 text-amber-400" />
                      <span>TEKRARLA</span>
                      <div className="flex items-center bg-slate-900 border border-amber-500/60 rounded px-1.5 py-0.5 text-xs text-white">
                        <button
                          type="button"
                          onClick={() => handleSetLoopCount(idx, -1)}
                          disabled={isRunning || (block.loopCount || 2) <= 2}
                          className="px-1 text-amber-400 hover:text-amber-200 cursor-pointer disabled:opacity-20"
                        >
                          -
                        </button>
                        <span className="font-mono font-black px-1.5 text-amber-300">
                          {block.loopCount || 2}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSetLoopCount(idx, 1)}
                          disabled={isRunning || (block.loopCount || 2) >= 9}
                          className="px-1 text-amber-400 hover:text-amber-200 cursor-pointer disabled:opacity-20"
                        >
                          +
                        </button>
                      </div>
                      <span>KEZ YAP:</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0 || isRunning}
                        className="p-1 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === blocks.length - 1 || isRunning}
                        className="p-1 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(idx)}
                        disabled={isRunning}
                        className="p-1 text-rose-400 hover:bg-rose-900/40 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Children of Loop */}
                  <div className="pl-4 py-2 border-l-2 border-amber-500/50 my-1 space-y-1.5">
                    {block.children?.map((child, cIdx) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs text-slate-200"
                      >
                        <span className="font-bold flex items-center gap-1.5">
                          {child.type === 'forward' && (
                            <>
                              <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                              <span>İleri Git (1 Adım)</span>
                            </>
                          )}
                          {child.type === 'turn_right' && (
                            <>
                              <CornerDownRight className="w-3.5 h-3.5 text-purple-400" />
                              <span>Sağa Dön (90°)</span>
                            </>
                          )}
                          {child.type === 'turn_left' && (
                            <>
                              <CornerDownRight className="w-3.5 h-3.5 text-purple-400 transform -scale-x-100" />
                              <span>Sola Dön (90°)</span>
                            </>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteChildFromBlock(idx, cIdx, false)}
                          disabled={isRunning}
                          className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {/* Add child inside loop */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAddChildToBlock(idx, 'forward', false)}
                        disabled={isRunning}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-0.5 rounded text-cyan-300 cursor-pointer"
                      >
                        + İleri
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddChildToBlock(idx, 'turn_right', false)}
                        disabled={isRunning}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-0.5 rounded text-purple-300 cursor-pointer"
                      >
                        + Sağa Dön
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddChildToBlock(idx, 'turn_left', false)}
                        disabled={isRunning}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-0.5 rounded text-purple-300 cursor-pointer"
                      >
                        + Sola Dön
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Conditional If/Else Block
            if (block.type === 'if_condition') {
              return (
                <div
                  key={block.id}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'bg-emerald-950/90 border-emerald-400 ring-4 ring-emerald-400/50'
                      : 'bg-emerald-950/40 border-emerald-600/70'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-600/40">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 flex-wrap">
                      <span>EĞER</span>
                      <select
                        value={block.condition || 'front_is_blocked'}
                        onChange={(e) => handleChangeCondition(idx, e.target.value as ConditionType)}
                        disabled={isRunning}
                        className="bg-slate-900 border border-emerald-500/60 rounded px-1.5 py-0.5 text-xs text-emerald-200 cursor-pointer"
                      >
                        <option value="front_is_blocked">Önümde engel varsa</option>
                        <option value="front_is_clear">Önüm açıksa</option>
                        <option value="front_is_door">Önümde kapı varsa</option>
                        <option value="on_crystal">Kristal üstündeyse</option>
                      </select>
                      <span>İSE:</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0 || isRunning}
                        className="p-1 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === blocks.length - 1 || isRunning}
                        className="p-1 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(idx)}
                        disabled={isRunning}
                        className="p-1 text-rose-400 hover:bg-rose-900/40 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* THEN body */}
                  <div className="pl-4 py-1.5 border-l-2 border-emerald-500/50 my-1 space-y-1">
                    <div className="text-[10px] text-emerald-400 font-bold">Yapılacak:</div>
                    {block.children?.map((child, cIdx) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs text-slate-200"
                      >
                        <span>
                          {child.type === 'forward' && 'İleri Git'}
                          {child.type === 'turn_right' && 'Sağa Dön'}
                          {child.type === 'turn_left' && 'Sola Dön'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteChildFromBlock(idx, cIdx, false)}
                          disabled={isRunning}
                          className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAddChildToBlock(idx, 'turn_right', false)}
                        disabled={isRunning}
                        className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-purple-300 cursor-pointer"
                      >
                        + Sağa Dön
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddChildToBlock(idx, 'forward', false)}
                        disabled={isRunning}
                        className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-cyan-300 cursor-pointer"
                      >
                        + İleri
                      </button>
                    </div>
                  </div>

                  {/* ELSE body */}
                  <div className="pl-4 py-1.5 border-l-2 border-slate-600/50 mt-2 space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold">DEĞİLSE:</div>
                    {block.elseChildren?.map((child, cIdx) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs text-slate-200"
                      >
                        <span>
                          {child.type === 'forward' && 'İleri Git'}
                          {child.type === 'turn_right' && 'Sağa Dön'}
                          {child.type === 'turn_left' && 'Sola Dön'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteChildFromBlock(idx, cIdx, true)}
                          disabled={isRunning}
                          className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAddChildToBlock(idx, 'forward', true)}
                        disabled={isRunning}
                        className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-cyan-300 cursor-pointer"
                      >
                        + İleri
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })
        )}
      </div>

      {/* Execution Control Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              type="button"
              onClick={onRun}
              disabled={blocks.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 cursor-pointer transform active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>KODU ÇALIŞTIR</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-sm shadow-lg shadow-rose-600/30 cursor-pointer transform active:scale-95 transition"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>KODU DURDUR</span>
            </button>
          )}

          <button
            type="button"
            onClick={onStep}
            disabled={blocks.length === 0 || isRunning}
            title="Adım Adım Yürüt (Hata Ayıklama)"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer transition"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Adım Adım</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 cursor-pointer transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sıfırla</span>
        </button>
      </div>
    </div>
  );
};
