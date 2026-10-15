export type Direction = 0 | 1 | 2 | 3; // 0: East (Sağ), 1: South (Aşağı), 2: West (Sol), 3: North (Yukarı)

export type CellType = 
  | 'start' 
  | 'empty' 
  | 'wall' 
  | 'obstacle' 
  | 'question' 
  | 'crystal' 
  | 'checkpoint' 
  | 'exit';

export interface GridCell {
  x: number;
  y: number;
  type: CellType;
  questionId?: string;
  collected?: boolean;
  unlocked?: boolean; // for doors/questions
  label?: string;
  hazardType?: 'laser' | 'asteroid' | 'meteor' | 'blackhole';
}

export type CommandType = 
  | 'forward' 
  | 'turn_right' 
  | 'turn_left' 
  | 'wait' 
  | 'loop' 
  | 'if_condition';

export type ConditionType = 
  | 'front_is_blocked' 
  | 'front_is_clear' 
  | 'on_crystal' 
  | 'front_is_door';

export interface CodeBlock {
  id: string;
  type: CommandType;
  stepCount?: number; // for 'forward' step multiplier e.g. 2x, 3x, 4x
  loopCount?: number; // for 'loop'
  condition?: ConditionType; // for 'if_condition'
  children?: CodeBlock[]; // for loops and 'if' body
  elseChildren?: CodeBlock[]; // for 'else' body
}

export interface ExecStep {
  blockId: string;
  type: CommandType;
}


export type ScienceTopic = 
  | 'gunes_sistemi' 
  | 'gezegenler' 
  | 'gunes_tutulmasi' 
  | 'ay_tutulmasi' 
  | 'kuvvet_tanimi' 
  | 'bileske_kuvvet' 
  | 'ayni_zit_kuvvetler' 
  | 'dengelenmis_kuvvetler' 
  | 'dengelenmemis_kuvvetler';

export interface ScienceQuestion {
  id: string;
  topic: ScienceTopic;
  topicTitle: string;
  gradeLevel: number; // 5, 6, 7
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  diagramType?: 'force_vectors' | 'solar_eclipse' | 'lunar_eclipse' | 'planet_order' | 'balanced_box' | 'dynamometer_scale';
  diagramData?: {
    forces?: { name: string; magnitude: number; direction: 'right' | 'left' | 'up' | 'down'; color?: string }[];
    celestialBodies?: ('sun' | 'moon' | 'earth')[];
    planetHighlight?: string;
    objectName?: string;
    dynamometer?: { maxCapacity: number; totalDivisions: number; stretchedDivisions: number; unitPerDivision?: number };
  };
  difficulty?: 'kolay' | 'orta' | 'zor';
  isActive: boolean;
  isCustom?: boolean;
}

export type LevelTheme = 
  | 'space_deep' 
  | 'solar_planets' 
  | 'eclipse_optics' 
  | 'forces_magnetic' 
  | 'gravity_reactor' 
  | 'galactic_command';

export interface CharacterOutfit {
  id: string;
  name: string;
  description: string;
  icon: string;
  tag: string;
  badgeRequired?: string;
  levelRequired?: number;
}

export interface CharacterAccessory {
  id: string;
  name: string;
  description: string;
  icon: string;
  tag: string;
  badgeRequired?: string;
  levelRequired?: number;
}

export interface CharacterCustomization {
  outfitId: string;
  accessoryId: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  tag: string;
  unlockedAtLevel?: number;
}

export interface Student {
  id: string;
  fullName: string;
  grade: string; // e.g., "5", "6", "7"
  section: string; // e.g., "A", "B", "C"
  createdAt: number;
  totalScore: number;
  questionsAnswered: number;
  questionsCorrect: number;
  completedLevelsCount: number;
  lastActive: number;
  customization?: CharacterCustomization;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'coding' | 'science' | 'mastery';
  conditionText: string;
}

export interface LevelConfig {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  topic: string;
  description: string;
  theme?: LevelTheme;
  gridWidth: number;
  gridHeight: number;
  startPos: { x: number; y: number };
  startDir: Direction;
  targetPos: { x: number; y: number };
  cells: GridCell[];
  questionIds: string[];
  candidateQuestionPositions?: [number, number][];
  candidateCrystalPositions?: [number, number][];
  parCommands: number; // optimal command count for bonus
  codeMode: 'buttons' | 'blocks' | 'both';
  scienceObjective: string;
  codingObjective: string;
}

export interface StudentLevelResult {
  studentId: string;
  levelId: string;
  completed: boolean;
  score: number;
  stars: number;
  commandsUsed: number;
  questionsSolved: number;
  mistakesCount: number;
  timeSpentSeconds: number;
  completedAt: number;
}

export interface LeaderboardEntry {
  id: string;
  studentId: string;
  studentName: string;
  gradeSection: string;
  score: number;
  questionsSolved: number;
  timeSeconds: number;
  completedLevelId: string;
  timestamp: number;
}

export interface CompetitionConfig {
  id: string;
  title: string;
  levelId: string;
  timeLimitSeconds: number; // 0 for unlimited
  isActive: boolean;
  date: string;
}

export interface TeacherSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  timerEnabled: boolean;
  unlockedAllLevels: boolean;
  executionSpeedMs: number; // 200, 400, 700
}

export interface DualMatchRecord {
  id: string;
  timestamp: number;
  durationSeconds: number;
  mode?: 'timed' | 'first_to_finish';
  player1: {
    studentId: string;
    studentName: string;
    charId: string;
    adventuresCompleted: number;
    questionsSolved: number;
    score: number;
  };
  player2: {
    studentId: string;
    studentName: string;
    charId: string;
    adventuresCompleted: number;
    questionsSolved: number;
    score: number;
  };
  winnerId: string | 'tie';
  winnerName: string;
}
