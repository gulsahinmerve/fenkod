import React from 'react';
import { GridCell, Direction, LevelTheme } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { ScienceLevelBackground } from './ScienceLevelBackground';
import { Lock, Unlock, Gem, Flag, AlertTriangle, Zap, Compass, ShieldAlert } from 'lucide-react';

interface GameAreaProps {
  gridWidth: number;
  gridHeight: number;
  cells: GridCell[];
  playerPos: { x: number; y: number };
  direction: Direction;
  characterId: string;
  characterState: 'idle' | 'walk' | 'cheer' | 'think' | 'celebrate';
  targetPos: { x: number; y: number };
  startPos: { x: number; y: number };
  collisionCell: { x: number; y: number } | null;
  errorMessage: string | null;
  unsolvedQuestionsCount?: number;
  compact?: boolean;
  theme?: LevelTheme;
  outfitId?: string;
  accessoryId?: string;
}

export const GameArea: React.FC<GameAreaProps> = ({
  gridWidth,
  gridHeight,
  cells,
  playerPos,
  direction,
  characterId,
  characterState,
  targetPos,
  startPos,
  collisionCell,
  errorMessage,
  unsolvedQuestionsCount = 0,
  compact = false,
  theme = 'space_deep',
  outfitId = 'outfit_default',
  accessoryId = 'acc_none',
}) => {
  // Rotation degrees for character direction indicator
  // 0: East (Sağ), 1: South (Aşağı), 2: West (Sol), 3: North (Yukarı)
  const dirAngles: Record<Direction, number> = {
    0: 90,
    1: 180,
    2: 270,
    3: 0,
  };

  const dirLabels: Record<Direction, string> = {
    0: 'Doğu (Sağ)',
    1: 'Güney (Aşağı)',
    2: 'Batı (Sol)',
    3: 'Kuzey (Yukarı)',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${compact ? 'p-1.5 sm:p-2 w-full' : 'p-3 sm:p-5'} bg-slate-950/70 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden select-none`}>
      {/* Dynamic Science Themed Background (Uzay, Gezegenler, Tutulmalar, Kuvvet vb. - Saf Görsel, Yazısız) */}
      <ScienceLevelBackground theme={theme} />

      {/* Top Status Banner */}
      <div className={`w-full flex items-center justify-between ${compact ? 'pb-1.5 text-[10px]' : 'pb-3 text-xs'} text-slate-400 font-medium`}>
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>Yön:</span>
          <span className="text-cyan-300 font-bold">{dirLabels[direction]}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
          <span>Konum:</span>
          <span className="text-amber-300 font-mono font-bold">
            [{playerPos.x}, {playerPos.y}]
          </span>
        </div>
      </div>

      {/* Collision Alert Toast */}
      {errorMessage && (
        <div className="absolute top-10 z-30 bg-rose-950/95 border-2 border-rose-500 text-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid Canvas Wrapper with guaranteed identical bounds */}
      <div className={`relative ${compact ? 'p-1.5 sm:p-2 w-full flex-1 min-h-[310px] sm:min-h-[350px] md:min-h-[390px] flex items-center justify-center' : 'p-1.5 sm:p-3 max-w-full overflow-x-auto flex justify-center'} bg-slate-900/90 border-2 border-slate-800 rounded-2xl shadow-inner`}>
        <div
          className={`grid gap-1 sm:gap-1.5 ${compact ? 'max-h-full max-w-full items-center justify-center' : 'w-full'}`}
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
            aspectRatio: `${gridWidth} / ${gridHeight}`,
            width: '100%',
            maxWidth: compact ? `${Math.min(gridWidth * 68, 560)}px` : `${gridWidth * 64}px`,
            maxHeight: compact ? '100%' : undefined,
          }}
        >
          {cells.map((cell) => {
            const isPlayerHere = playerPos.x === cell.x && playerPos.y === cell.y;
            const isStart = startPos.x === cell.x && startPos.y === cell.y;
            const isExit = targetPos.x === cell.x && targetPos.y === cell.y;
            const isCollision = collisionCell && collisionCell.x === cell.x && collisionCell.y === cell.y;

            let cellBg = 'bg-slate-900/90 border-slate-800/80 text-slate-600';

            if (cell.type === 'wall') {
              cellBg = 'bg-gradient-to-br from-stone-800 to-stone-900 border-stone-700/80 shadow-md';
            } else if (cell.type === 'obstacle') {
              cellBg = 'bg-red-950/60 border-red-700/60 shadow-inner';
            } else if (cell.type === 'question') {
              cellBg = cell.unlocked
                ? 'bg-emerald-950/50 border-emerald-500/60'
                : 'bg-amber-950/60 border-amber-500/80 shadow-lg shadow-amber-500/20';
            } else if (cell.type === 'crystal' && !cell.collected) {
              cellBg = 'bg-cyan-950/30 border-cyan-500/40';
            } else if (isExit) {
              cellBg = unsolvedQuestionsCount > 0
                ? 'bg-rose-950/40 border-rose-500/70 shadow-lg shadow-rose-950/30'
                : 'bg-emerald-950/50 border-emerald-400 shadow-lg shadow-emerald-500/30 animate-pulse';
            } else if (isStart) {
              cellBg = 'bg-blue-950/40 border-blue-500/60';
            }

            if (isCollision) {
              cellBg += ' ring-2 ring-rose-500 bg-rose-950/80 animate-pulse';
            }

            return (
              <div
                key={`${cell.x}-${cell.y}`}
                className={`relative aspect-square ${compact ? 'w-full min-w-[28px] max-w-[64px]' : 'min-w-[28px] sm:min-w-[46px] md:min-w-[54px]'} rounded-xl border flex items-center justify-center overflow-hidden transition-all duration-150 ${cellBg}`}
              >
                {/* Cell Contents */}
                {cell.type === 'wall' && (
                  <div className="w-full h-full p-1 flex items-center justify-center opacity-85">
                    <div className="w-full h-full rounded-lg bg-stone-800/90 border border-stone-700/60 flex items-center justify-center shadow-inner">
                      <div className="w-3 h-3 rounded-full bg-stone-700/80 -translate-x-1 -translate-y-1" />
                      <div className="w-2 h-2 rounded-full bg-stone-600/80 translate-x-1 translate-y-1" />
                    </div>
                  </div>
                )}

                {cell.type === 'obstacle' && (
                  <div className="flex flex-col items-center justify-center text-rose-500 animate-pulse text-center">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.95)]" />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tight text-rose-300 bg-rose-950/80 px-1 rounded border border-rose-500/40">
                      LAZER
                    </span>
                  </div>
                )}

                {cell.type === 'crystal' && !cell.collected && (
                  <div className="flex flex-col items-center justify-center animate-bounce text-center p-0.5">
                    <span className="text-2xl sm:text-3xl drop-shadow-[0_0_14px_rgba(34,211,238,0.95)]">💎</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-cyan-200 tracking-tight uppercase px-1 py-0.2 rounded bg-cyan-950/90 border border-cyan-400/60 shadow">
                      KRİSTAL
                    </span>
                  </div>
                )}

                {cell.type === 'question' && (
                  <div className="flex flex-col items-center justify-center text-center p-0.5">
                    {cell.unlocked ? (
                      <div className="flex flex-col items-center text-emerald-300 animate-pulse">
                        <span className="text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]">🔓</span>
                        <span className="text-[8px] sm:text-[9px] font-black text-emerald-300 bg-emerald-950/80 px-1 rounded border border-emerald-500/50">
                          AÇIK
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-amber-300 animate-pulse">
                        <span className="text-2xl sm:text-3xl drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]">⭐</span>
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-200 tracking-tighter uppercase px-1 py-0.2 rounded bg-amber-950/90 border border-amber-500/60 shadow">
                          FEN KAPI
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {isExit && (
                  <div className="flex flex-col items-center justify-center text-center">
                    {unsolvedQuestionsCount > 0 ? (
                      <div className="flex flex-col items-center text-rose-400">
                        <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
                        <span className="text-[8px] sm:text-[9px] font-black text-rose-300 uppercase bg-rose-950/80 px-1 rounded border border-rose-500/40">
                          KİLİTLİ
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-emerald-300 animate-bounce">
                        <span className="text-2xl sm:text-3xl drop-shadow-[0_0_14px_rgba(52,211,153,0.95)]">🚀</span>
                        <span className="text-[8px] sm:text-[9px] font-black text-emerald-200 bg-emerald-950/80 px-1 rounded border border-emerald-400/50">
                          ÇIKIŞ
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {isStart && !isPlayerHere && (
                  <div className="flex flex-col items-center justify-center text-blue-400 opacity-70">
                    <span className="text-[8px] sm:text-[9px] font-bold">BAŞLANGIÇ</span>
                  </div>
                )}

                {/* The Player Character */}
                {isPlayerHere && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-0.5 transition-all duration-200">
                    {/* Directional Beacon Pointer */}
                    <div
                      className="absolute w-full h-full pointer-events-none flex items-start justify-center transition-transform duration-200"
                      style={{ transform: `rotate(${dirAngles[direction]}deg)` }}
                    >
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-cyan-400 -mt-1.5 drop-shadow-[0_0_6px_rgba(34,211,238,1)]" />
                    </div>

                    <CharacterAvatar
                      characterId={characterId}
                      state={characterState}
                      size={compact ? 36 : 42}
                      showAura={true}
                      outfitId={outfitId}
                      accessoryId={accessoryId}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
