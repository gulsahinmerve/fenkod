/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, LevelConfig } from './types/game';
import { storage } from './utils/storage';
import { soundManager } from './utils/audio';
import { ADVENTURE_LEVELS } from './data/levels';
import { Navbar } from './components/Navbar';
import { MainMenu } from './components/MainMenu';
import { StudentModal } from './components/StudentModal';
import { CharacterSelect } from './components/CharacterSelect';
import { LevelSelectModal } from './components/LevelSelectModal';
import { AdventureGameView } from './components/AdventureGameView';
import { CertificateModal } from './components/CertificateModal';
import { ClassCompetitionView } from './components/ClassCompetitionView';
import { TeacherDashboard } from './components/TeacherDashboard';

export default function App() {
  const [screen, setScreen] = useState<
    'menu' | 'adventure_levels' | 'adventure_play' | 'competition' | 'competition_play' | 'certificates' | 'characters' | 'teacher'
  >('menu');

  const [activeStudent, setActiveStudent] = useState<Student>(storage.getActiveStudent());
  const [selectedCharId, setSelectedCharId] = useState<string>(storage.getSelectedCharacterId());
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Current playing level
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig>(ADVENTURE_LEVELS[0]);

  // Competition run params
  const [compTimeLimit, setCompTimeLimit] = useState(120);

  // Sync state whenever student changes
  const refreshStudentState = () => {
    setActiveStudent(storage.getActiveStudent());
    setSelectedCharId(storage.getSelectedCharacterId());
  };

  const teacherSettings = storage.getTeacherSettings();
  const studentResults = storage.getStudentResults(activeStudent.id);

  // Handlers for Main Menu actions
  const handleMenuAction = (
    action: 'adventure' | 'competition' | 'certificates' | 'characters' | 'teacher'
  ) => {
    if (action === 'adventure') {
      setScreen('adventure_levels');
    } else if (action === 'competition') {
      setScreen('competition');
    } else if (action === 'certificates') {
      setScreen('certificates');
    } else if (action === 'characters') {
      setScreen('characters');
    } else if (action === 'teacher') {
      setScreen('teacher');
    }
  };

  // Launch a standard adventure level
  const handleLaunchLevel = (lvl: LevelConfig) => {
    setSelectedLevel(lvl);
    setScreen('adventure_play');
  };

  // Launch a competition run
  const handleStartCompetitionRun = (
    student: Student,
    lvl: LevelConfig,
    timeLimitSeconds: number
  ) => {
    storage.setActiveStudentId(student.id);
    setActiveStudent(student);
    setSelectedLevel(lvl);
    setCompTimeLimit(timeLimitSeconds);
    setScreen('competition_play');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Outfit',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        activeStudent={activeStudent}
        selectedCharId={selectedCharId}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onGoHome={() => setScreen('menu')}
        onOpenTeacherPanel={() => setScreen('teacher')}
        currentScreen={screen}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {screen === 'menu' && (
          <MainMenu
            activeStudent={activeStudent}
            selectedCharId={selectedCharId}
            onSelectAction={handleMenuAction}
            onOpenStudentModal={() => setIsStudentModalOpen(true)}
          />
        )}

        {screen === 'characters' && (
          <CharacterSelect
            currentSelectedId={selectedCharId}
            onSelectCharacter={(id) => {
              setSelectedCharId(id);
              refreshStudentState();
            }}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'adventure_levels' && (
          <LevelSelectModal
            studentResults={studentResults}
            unlockedAll={teacherSettings.unlockedAllLevels}
            onSelectLevel={handleLaunchLevel}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'adventure_play' && (
          <AdventureGameView
            key={`adv_${selectedLevel.id}_${activeStudent.id}`}
            level={selectedLevel}
            activeStudent={activeStudent}
            selectedCharId={selectedCharId}
            isCompetitionMode={false}
            onBackToLevels={() => setScreen('adventure_levels')}
            onOpenCharacterWardrobe={() => setScreen('characters')}
            onNextLevel={(nextLvl) => {
              setSelectedLevel(nextLvl);
            }}
          />
        )}

        {screen === 'competition' && (
          <ClassCompetitionView
            onStartStudentRun={handleStartCompetitionRun}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'competition_play' && (
          <AdventureGameView
            key={`comp_${selectedLevel.id}_${activeStudent.id}`}
            level={selectedLevel}
            activeStudent={activeStudent}
            selectedCharId={selectedCharId}
            isCompetitionMode={true}
            competitionTimeLimit={compTimeLimit}
            onBackToLevels={() => setScreen('competition')}
            onNextLevel={(nextLvl) => {
              setSelectedLevel(nextLvl);
            }}
          />
        )}

        {screen === 'certificates' && (
          <CertificateModal
            student={activeStudent}
            selectedCharId={selectedCharId}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'teacher' && (
          <TeacherDashboard onBack={() => setScreen('menu')} />
        )}
      </main>

      {/* Student Selection / Login Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSelectStudent={(st) => {
          setActiveStudent(st);
          refreshStudentState();
        }}
      />
    </div>
  );
}
