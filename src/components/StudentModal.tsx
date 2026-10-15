import React, { useState } from 'react';
import { Student } from '../types/game';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { User, Check, UserCheck, ShieldAlert, X, Sparkles, History } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
}) => {
  const [students, setStudents] = useState<Student[]>(storage.getStudents());
  const [activeId, setActiveId] = useState<string>(storage.getActiveStudentId());
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('6');
  const [section, setSection] = useState('A');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChoose = (st: Student) => {
    soundManager.playClick();
    storage.setActiveStudentId(st.id);
    setActiveId(st.id);
    onSelectStudent(st);
    onClose();
  };

  const handleGuest = () => {
    soundManager.playClick();
    storage.setActiveStudentId('guest');
    setActiveId('guest');
    const guest: Student = {
      id: 'guest',
      fullName: 'Misafir Kaşif',
      grade: '6',
      section: 'M',
      createdAt: Date.now(),
      totalScore: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      completedLevelsCount: 0,
      lastActive: Date.now()
    };
    onSelectStudent(guest);
    onClose();
  };

  const handleRegisterAndStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Lütfen adını ve soyadını yaz.');
      return;
    }
    setErrorMsg('');
    soundManager.playCorrect();
    const created = storage.addStudent(name, grade, section);
    setStudents(storage.getStudents());
    storage.setActiveStudentId(created.id);
    setActiveId(created.id);
    onSelectStudent(created);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/60 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/50">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <User className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>Öğrenci Girişi</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Maceraya başlamak için adını ve sınıfını yaz!
            </p>
          </div>
        </div>

        {/* Direct Self-Registration Form */}
        <form onSubmit={handleRegisterAndStart} className="space-y-3.5 mb-5 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          {errorMsg && (
            <div className="p-3 bg-rose-950/70 border border-rose-500/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Adın ve Soyadın:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Eren Yıldız"
              className="w-full bg-slate-800/90 border-2 border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-bold focus:outline-none focus:border-cyan-400 transition"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Sınıfın:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-800/90 border-2 border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="5">5. Sınıf</option>
                <option value="6">6. Sınıf</option>
                <option value="7">7. Sınıf</option>
                <option value="8">8. Sınıf</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Şuben:</label>
              <input
                type="text"
                maxLength={2}
                value={section}
                onChange={(e) => setSection(e.target.value.toUpperCase())}
                placeholder="A"
                className="w-full bg-slate-800/90 border-2 border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 uppercase font-bold focus:outline-none focus:border-cyan-400 text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 cursor-pointer transform hover:scale-[1.01] transition active:scale-95"
          >
            MACERAYA BAŞLA!
          </button>
        </form>

        {/* Previously Saved Students on this Device */}
        {students.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Bu cihazda kayıtlı öğrenciler:</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {students.map((st) => {
                const isSelected = activeId === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleChoose(st)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 ring-1 ring-cyan-400/50'
                        : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-cyan-300">
                        {st.grade}-{st.section}
                      </span>
                      <span className="text-xs font-bold text-slate-100">{st.fullName}</span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        ({st.totalScore} Puan)
                      </span>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold hover:text-cyan-400">
                        Seç →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Guest fallback button */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex justify-center">
          <button
            type="button"
            onClick={handleGuest}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-semibold cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Kayıt olmadan misafir olarak devam et</span>
          </button>
        </div>
      </div>
    </div>
  );
};
