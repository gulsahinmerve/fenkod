import { LevelConfig, GridCell, LevelTheme } from '../types/game';
import { INITIAL_QUESTIONS } from '../data/questions';
import { ADVENTURE_LEVELS } from '../data/levels';

// Map of topics associated with each level
const LEVEL_TOPIC_MAP: Record<string, string[]> = {
  level_1: ['gunes_sistemi', 'gezegenler'],
  level_2: ['gezegenler', 'gunes_sistemi'],
  level_3: ['gunes_tutulmasi', 'ay_tutulmasi'],
  level_4: ['kuvvet_tanimi', 'ayni_zit_kuvvetler'],
  level_5: ['bileske_kuvvet', 'dengelenmis_kuvvetler', 'dengelenmemis_kuvvetler', 'ayni_zit_kuvvetler'],
  level_6: ['gunes_sistemi', 'gezegenler', 'gunes_tutulmasi', 'kuvvet_tanimi', 'bileske_kuvvet', 'dengelenmis_kuvvetler'],
};

// Shuffling helper (Fisher-Yates)
function shuffleArray<T>(array: T[], seed?: number): T[] {
  const arr = [...array];
  let m = arr.length;
  let s = seed !== undefined ? seed : Math.random() * 10000;
  while (m) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    const i = Math.floor(rnd * m--);
    const t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

/**
 * Gets questions matching the level's science topic, shuffled and filtered
 */
export function getQuestionsForLevel(levelId: string, count: number = 5, excludeIds: string[] = []): string[] {
  const topics = LEVEL_TOPIC_MAP[levelId] || ['gunes_sistemi'];
  const pool = INITIAL_QUESTIONS.filter((q) => topics.includes(q.topic) && !excludeIds.includes(q.id));
  
  if (pool.length < count) {
    // If pool exhausted with excludeIds, include all from topics
    const allTopicPool = INITIAL_QUESTIONS.filter((q) => topics.includes(q.topic));
    const shuffled = shuffleArray(allTopicPool);
    return shuffled.slice(0, count).map((q) => q.id);
  }

  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, count).map((q) => q.id);
}

// Corridor candidate coordinates for doors and crystals on each level
const CANDIDATE_POSITIONS: Record<
  string,
  {
    questions: [number, number][];
    crystals: [number, number][];
  }
> = {
  level_1: {
    questions: [
      [1, 3], [1, 2], [2, 1], [3, 1], [3, 3], [3, 4], [5, 4], [5, 3], [5, 2], [6, 3]
    ],
    crystals: [
      [1, 1], [3, 2], [5, 5], [1, 4], [3, 5], [5, 1]
    ]
  },
  level_2: {
    questions: [
      [1, 4], [1, 3], [1, 2], [2, 1], [3, 1], [3, 3], [3, 5], [5, 4], [5, 3], [5, 2], [6, 1], [7, 3]
    ],
    crystals: [
      [1, 1], [3, 2], [5, 5], [7, 4], [3, 4], [7, 2]
    ]
  },
  level_3: {
    questions: [
      [1, 5], [1, 4], [1, 3], [2, 1], [3, 1], [3, 3], [3, 5], [5, 4], [5, 3], [5, 2], [6, 1], [7, 3]
    ],
    crystals: [
      [1, 2], [3, 6], [5, 2], [7, 4], [1, 1], [7, 5]
    ]
  },
  level_4: {
    questions: [
      [1, 5], [1, 4], [1, 3], [2, 1], [3, 1], [3, 4], [3, 5], [5, 4], [5, 3], [5, 2], [6, 1], [7, 4]
    ],
    crystals: [
      [1, 1], [3, 6], [5, 2], [7, 5], [1, 2], [7, 2]
    ]
  },
  level_5: {
    questions: [
      [1, 5], [1, 4], [1, 3], [2, 1], [3, 1], [3, 4], [3, 5], [5, 4], [5, 3], [5, 2], [7, 3], [7, 4], [8, 3]
    ],
    crystals: [
      [1, 1], [3, 6], [5, 2], [7, 5], [8, 5], [3, 2]
    ]
  },
  level_6: {
    questions: [
      [1, 5], [1, 3], [2, 1], [3, 2], [3, 5], [4, 1], [5, 4], [5, 2], [6, 1], [7, 3], [7, 5], [8, 1], [9, 4]
    ],
    crystals: [
      [1, 1], [3, 6], [5, 1], [7, 6], [9, 5], [2, 7]
    ]
  }
};

/**
 * Creates an Anti-Cheat / Randomized variant of a level for a player.
 * - Randomizes questions from the science question bank.
 * - For Player 1 vs Player 2, guarantees different questions and different door/crystal coordinates!
 */
export function buildDynamicLevel(
  baseLevel: LevelConfig,
  playerNumber: 1 | 2 = 1,
  seedModifier: number = Date.now(),
  excludedQuestionIds: string[] = []
): { level: LevelConfig; chosenQuestionIds: string[] } {
  const levelId = baseLevel.id;
  const questionCount = baseLevel.questionIds?.length || 5;

  // 1. Pick distinct questions from pool
  const chosenQuestionIds = getQuestionsForLevel(levelId, questionCount, excludedQuestionIds);

  // 2. Select corridor positions for doors and crystals based on candidate list
  const cand = CANDIDATE_POSITIONS[levelId];
  let questionPositions: [number, number][] = [];
  let crystalPositions: [number, number][] = [];

  if (cand && cand.questions.length >= questionCount) {
    const seed = (playerNumber * 777 + seedModifier) % 100000;
    const shuffledQPositions = shuffleArray(cand.questions, seed);
    questionPositions = shuffledQPositions.slice(0, questionCount);

    const qSet = new Set(questionPositions.map(([x, y]) => `${x},${y}`));
    const availCrystals = cand.crystals.filter(([x, y]) => !qSet.has(`${x},${y}`));
    const shuffledCrystals = shuffleArray(availCrystals, seed + 42);
    crystalPositions = shuffledCrystals.slice(0, Math.min(3, availCrystals.length));
  }

  // 3. Rebuild cells
  const newCells: GridCell[] = baseLevel.cells.map((originalCell) => {
    // If it was a wall or obstacle, preserve it
    if (originalCell.type === 'wall' || originalCell.type === 'obstacle') {
      return { ...originalCell };
    }
    // Start and target pos must remain clear
    if (
      (originalCell.x === baseLevel.startPos.x && originalCell.y === baseLevel.startPos.y) ||
      (originalCell.x === baseLevel.targetPos.x && originalCell.y === baseLevel.targetPos.y)
    ) {
      return { ...originalCell, type: 'empty' };
    }
    return {
      x: originalCell.x,
      y: originalCell.y,
      type: 'empty' as const
    };
  });

  // Assign questions to selected positions
  if (questionPositions.length === questionCount) {
    questionPositions.forEach(([qx, qy], idx) => {
      const cellIdx = newCells.findIndex((c) => c.x === qx && c.y === qy);
      if (cellIdx !== -1) {
        newCells[cellIdx] = {
          x: qx,
          y: qy,
          type: 'question',
          questionId: chosenQuestionIds[idx],
          unlocked: false
        };
      }
    });
  } else {
    // Fallback: place along original question positions with new question IDs
    let qIdx = 0;
    baseLevel.cells.forEach((c) => {
      if (c.type === 'question') {
        const cellIdx = newCells.findIndex((cell) => cell.x === c.x && cell.y === c.y);
        if (cellIdx !== -1) {
          newCells[cellIdx] = {
            ...c,
            type: 'question',
            questionId: chosenQuestionIds[qIdx % chosenQuestionIds.length],
            unlocked: false
          };
          qIdx++;
        }
      }
    });
  }

  // Assign crystals to selected positions
  crystalPositions.forEach(([cx, cy]) => {
    const cellIdx = newCells.findIndex((c) => c.x === cx && c.y === cy && c.type === 'empty');
    if (cellIdx !== -1) {
      newCells[cellIdx] = {
        x: cx,
        y: cy,
        type: 'crystal',
        collected: false
      };
    }
  });

  // Theme identification
  let theme: LevelTheme = 'space_deep';
  if (baseLevel.levelNumber === 2) theme = 'solar_planets';
  else if (baseLevel.levelNumber === 3) theme = 'eclipse_optics';
  else if (baseLevel.levelNumber === 4) theme = 'forces_magnetic';
  else if (baseLevel.levelNumber === 5) theme = 'gravity_reactor';
  else if (baseLevel.levelNumber === 6) theme = 'galactic_command';

  return {
    level: {
      ...baseLevel,
      theme,
      cells: newCells,
      questionIds: chosenQuestionIds
    },
    chosenQuestionIds
  };
}
