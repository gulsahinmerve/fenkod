import { Student, StudentLevelResult, LeaderboardEntry, TeacherSettings, ScienceQuestion, DualMatchRecord, CharacterCustomization } from '../types/game';
import { INITIAL_QUESTIONS } from '../data/questions';

const STORAGE_KEYS = {
  STUDENTS: 'fenkod_students_v1',
  ACTIVE_STUDENT_ID: 'fenkod_active_student_id',
  SELECTED_CHAR_ID: 'fenkod_selected_character_id',
  CUSTOMIZATION: 'fenkod_customization_v1',
  STUDENT_RESULTS: 'fenkod_results_v1',
  LEADERBOARD: 'fenkod_leaderboard_v1',
  DUAL_MATCHES: 'fenkod_dual_matches_v1',
  TEACHER_SETTINGS: 'fenkod_teacher_settings_v1',
  QUESTIONS: 'fenkod_questions_v3',
  EARNED_BADGES: 'fenkod_badges_v1',
};

// Default seed students for quick testing and class experience
const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'student_ada',
    fullName: 'Ada Yılmaz',
    grade: '6',
    section: 'A',
    createdAt: Date.now() - 86400000,
    totalScore: 450,
    questionsAnswered: 4,
    questionsCorrect: 4,
    completedLevelsCount: 2,
    lastActive: Date.now()
  },
  {
    id: 'student_can',
    fullName: 'Can Demir',
    grade: '6',
    section: 'B',
    createdAt: Date.now() - 72000000,
    totalScore: 280,
    questionsAnswered: 3,
    questionsCorrect: 2,
    completedLevelsCount: 1,
    lastActive: Date.now()
  },
  {
    id: 'student_zeynep',
    fullName: 'Zeynep Kaya',
    grade: '5',
    section: 'A',
    createdAt: Date.now() - 50000000,
    totalScore: 620,
    questionsAnswered: 6,
    questionsCorrect: 5,
    completedLevelsCount: 3,
    lastActive: Date.now()
  }
];

export const storage = {
  // Students
  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  hasRegisteredStudent(): boolean {
    try {
      const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
      const students = this.getStudents();
      return !!active && students.some((s) => s.id === active);
    } catch {
      return false;
    }
  },

  saveStudents(students: Student[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Storage error saveStudents:', e);
    }
  },

  addStudent(fullName: string, grade: string, section: string): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      fullName: fullName.trim(),
      grade: grade.trim(),
      section: section.trim().toUpperCase(),
      createdAt: Date.now(),
      totalScore: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      completedLevelsCount: 0,
      lastActive: Date.now()
    };
    students.push(newStudent);
    this.saveStudents(students);
    return newStudent;
  },

  updateStudent(student: Student) {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === student.id);
    if (idx !== -1) {
      students[idx] = student;
      this.saveStudents(students);
    }
  },

  deleteStudent(id: string) {
    const students = this.getStudents().filter((s) => s.id !== id);
    this.saveStudents(students);
    if (this.getActiveStudentId() === id) {
      this.setActiveStudentId(students[0]?.id || 'guest');
    }
  },

  getActiveStudentId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID) || '';
    } catch {
      return '';
    }
  },

  setActiveStudentId(id: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
    } catch {
      // ignore
    }
  },

  getActiveStudent(): Student {
    const activeId = this.getActiveStudentId();
    const students = this.getStudents();
    const found = students.find((s) => s.id === activeId);
    if (found) return found;
    if (students.length > 0) return students[0];

    return {
      id: 'guest',
      fullName: 'Öğrenci Girişi Yap',
      grade: '6',
      section: 'A',
      createdAt: Date.now(),
      totalScore: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      completedLevelsCount: 0,
      lastActive: Date.now()
    };
  },

  // Character
  getSelectedCharacterId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_CHAR_ID) || 'cosmic_cat';
    } catch {
      return 'cosmic_cat';
    }
  },

  setSelectedCharacterId(id: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CHAR_ID, id);
    } catch {
      // ignore
    }
  },

  // Character Customization (Kıyafet & Aksesuar)
  getCustomization(): CharacterCustomization {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMIZATION);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return {
      outfitId: 'outfit_default',
      accessoryId: 'acc_none'
    };
  },

  setCustomization(customization: CharacterCustomization) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMIZATION, JSON.stringify(customization));
    } catch {
      // ignore
    }
  },

  // Level Results per Student
  getAllResults(): Record<string, StudentLevelResult[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_RESULTS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getStudentResults(studentId: string): StudentLevelResult[] {
    const all = this.getAllResults();
    return all[studentId] || [];
  },

  saveLevelResult(result: StudentLevelResult) {
    try {
      const all = this.getAllResults();
      const studentResults = all[result.studentId] || [];
      const existingIdx = studentResults.findIndex((r) => r.levelId === result.levelId);
      
      if (existingIdx !== -1) {
        // Keep best score
        if (result.score > studentResults[existingIdx].score) {
          studentResults[existingIdx] = result;
        }
      } else {
        studentResults.push(result);
      }
      all[result.studentId] = studentResults;
      localStorage.setItem(STORAGE_KEYS.STUDENT_RESULTS, JSON.stringify(all));

      // Update student profile metrics
      if (result.studentId !== 'guest') {
        const student = this.getStudents().find((s) => s.id === result.studentId);
        if (student) {
          student.totalScore = studentResults.reduce((acc, r) => acc + r.score, 0);
          student.questionsAnswered += result.questionsSolved;
          student.questionsCorrect += result.questionsSolved; // correct gates passed
          student.completedLevelsCount = studentResults.filter((r) => r.completed).length;
          student.lastActive = Date.now();
          this.updateStudent(student);
        }
      }
    } catch (e) {
      console.error('Storage saveLevelResult error:', e);
    }
  },

  // Leaderboard / Competition Entries
  getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addLeaderboardEntry(entry: LeaderboardEntry) {
    try {
      const list = this.getLeaderboard();
      list.push(entry);
      // Sort: (1) Score desc, (2) Questions desc, (3) Time asc
      list.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.questionsSolved !== a.questionsSolved) return b.questionsSolved - a.questionsSolved;
        return a.timeSeconds - b.timeSeconds;
      });
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(list));
    } catch (e) {
      console.error('Storage addLeaderboardEntry error:', e);
    }
  },

  clearLeaderboard() {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    } catch {
      // ignore
    }
  },

  // Dual Matches (Smartboard Side-by-Side Competitions)
  getDualMatches(): DualMatchRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DUAL_MATCHES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDualMatch(record: DualMatchRecord) {
    try {
      const list = this.getDualMatches();
      list.unshift(record); // newest first
      // Keep up to 50 matches
      if (list.length > 50) list.splice(50);
      localStorage.setItem(STORAGE_KEYS.DUAL_MATCHES, JSON.stringify(list));
    } catch (e) {
      console.error('Storage saveDualMatch error:', e);
    }
  },

  clearDualMatches() {
    try {
      localStorage.removeItem(STORAGE_KEYS.DUAL_MATCHES);
    } catch {
      // ignore
    }
  },

  // Questions (Persisted, allowing teacher to enable/disable or add custom)
  getQuestions(): ScienceQuestion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
        return INITIAL_QUESTIONS;
      }
      const stored: ScienceQuestion[] = JSON.parse(data);
      // Auto-merge any new initial questions that are not yet in stored list
      const storedIds = new Set(stored.map((q) => q.id));
      const missing = INITIAL_QUESTIONS.filter((q) => !storedIds.has(q.id));
      if (missing.length > 0) {
        const merged = [...stored, ...missing];
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(merged));
        return merged;
      }
      return stored;
    } catch {
      return INITIAL_QUESTIONS;
    }
  },

  saveQuestions(questions: ScienceQuestion[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error('Storage saveQuestions error:', e);
    }
  },

  updateQuestion(question: ScienceQuestion) {
    const list = this.getQuestions();
    const idx = list.findIndex((q) => q.id === question.id);
    if (idx !== -1) {
      list[idx] = question;
      this.saveQuestions(list);
    }
  },

  addCustomQuestion(q: Omit<ScienceQuestion, 'id'>): ScienceQuestion {
    const list = this.getQuestions();
    const newQ: ScienceQuestion = {
      ...q,
      id: `q_custom_${Date.now()}`,
      isCustom: true
    };
    list.unshift(newQ);
    this.saveQuestions(list);
    return newQ;
  },

  deleteQuestion(id: string) {
    const list = this.getQuestions().filter((q) => q.id !== id);
    this.saveQuestions(list);
  },

  // Teacher Settings
  getTeacherSettings(): TeacherSettings {
    const defaults: TeacherSettings = {
      soundEnabled: true,
      reducedMotion: false,
      timerEnabled: true,
      unlockedAllLevels: false,
      executionSpeedMs: 350
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHER_SETTINGS);
      return data ? { ...defaults, ...JSON.parse(data) } : defaults;
    } catch {
      return defaults;
    }
  },

  saveTeacherSettings(settings: TeacherSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  // Earned Badges
  getEarnedBadgeIds(studentId: string): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EARNED_BADGES);
      const all: Record<string, string[]> = data ? JSON.parse(data) : {};
      return all[studentId] || [];
    } catch {
      return [];
    }
  },

  earnBadge(studentId: string, badgeId: string) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EARNED_BADGES);
      const all: Record<string, string[]> = data ? JSON.parse(data) : {};
      const list = all[studentId] || [];
      if (!list.includes(badgeId)) {
        list.push(badgeId);
        all[studentId] = list;
        localStorage.setItem(STORAGE_KEYS.EARNED_BADGES, JSON.stringify(all));
      }
    } catch {
      // ignore
    }
  },

  // Backup & Restore
  exportFullBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      students: this.getStudents(),
      results: this.getAllResults(),
      leaderboard: this.getLeaderboard(),
      questions: this.getQuestions(),
      settings: this.getTeacherSettings(),
      selectedCharacterId: this.getSelectedCharacterId()
    };
    return JSON.stringify(backup, null, 2);
  },

  importFullBackup(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.students && Array.isArray(parsed.students)) {
        this.saveStudents(parsed.students);
      }
      if (parsed.results) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_RESULTS, JSON.stringify(parsed.results));
      }
      if (parsed.leaderboard && Array.isArray(parsed.leaderboard)) {
        localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(parsed.leaderboard));
      }
      if (parsed.questions && Array.isArray(parsed.questions)) {
        this.saveQuestions(parsed.questions);
      }
      if (parsed.settings) {
        this.saveTeacherSettings(parsed.settings);
      }
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },

  resetAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_RESULTS);
      localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
      localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
      localStorage.removeItem(STORAGE_KEYS.TEACHER_SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.EARNED_BADGES);
    } catch {
      // ignore
    }
  }
};
