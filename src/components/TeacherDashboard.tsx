import React, { useState } from 'react';
import { Student, ScienceQuestion, ScienceTopic, TeacherSettings } from '../types/game';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { TOPIC_LABELS } from '../data/questions';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Settings,
  BarChart3,
  Database,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Check,
  X,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import { TeacherAnalyticsDashboard } from './TeacherAnalyticsDashboard';

interface TeacherDashboardProps {
  onBack: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  // Password protection: 'merkado'
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('teacher_auth_merkado') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'merkado') {
      soundManager.playCorrect();
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('teacher_auth_merkado', 'true');
      } catch {}
      setPasswordError(false);
    } else {
      soundManager.playWrong();
      setPasswordError(true);
    }
  };

  const handleLockPanel = () => {
    soundManager.playClick();
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('teacher_auth_merkado');
    } catch {}
    setPasswordInput('');
  };

  const [activeTab, setActiveTab] = useState<'students' | 'questions' | 'settings' | 'analytics' | 'data'>('students');

  // Students state
  const [students, setStudents] = useState<Student[]>(storage.getStudents());
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('6');
  const [newStudentSection, setNewStudentSection] = useState('A');

  // Questions state
  const [questions, setQuestions] = useState<ScienceQuestion[]>(storage.getQuestions());
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [customTopic, setCustomTopic] = useState<ScienceTopic>('gunes_sistemi');
  const [customText, setCustomText] = useState('');
  const [customOptions, setCustomOptions] = useState(['', '', '', '']);
  const [customCorrect, setCustomCorrect] = useState(0);
  const [customExplanation, setCustomExplanation] = useState('');

  // Settings state
  const [settings, setSettings] = useState<TeacherSettings>(storage.getTeacherSettings());

  // Message notifications
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Student CRUD
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      showToast('Öğrenci adı boş bırakılamaz.', 'error');
      return;
    }
    const created = storage.addStudent(newStudentName, newStudentGrade, newStudentSection);
    setStudents(storage.getStudents());
    setNewStudentName('');
    showToast(`${created.fullName} başarıyla eklendi.`);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`${name} adlı öğrenciyi silmek istediğinize emin misiniz?`)) {
      storage.deleteStudent(id);
      setStudents(storage.getStudents());
      showToast(`${name} silindi.`);
    }
  };

  const handleExportStudentsCsv = () => {
    const rows = [['ID', 'Adı Soyadı', 'Sınıf', 'Şube', 'Toplam Puan', 'Çözülen Soru', 'Tamamlanan Seviye']];
    students.forEach((s) => {
      rows.push([s.id, `"${s.fullName}"`, s.grade, s.section, s.totalScore.toString(), s.questionsCorrect.toString(), s.completedLevelsCount.toString()]);
    });
    const csvContent = '\uFEFF' + rows.map((e) => e.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fenkod_ogrenci_listesi_${Date.now()}.csv`;
    link.click();
  };

  // Questions Toggle & Create
  const handleToggleQuestionActive = (qId: string) => {
    const list = [...questions];
    const item = list.find((q) => q.id === qId);
    if (item) {
      item.isActive = !item.isActive;
      storage.saveQuestions(list);
      setQuestions([...list]);
      soundManager.playClick();
    }
  };

  const handleToggleTopicGroup = (topic: ScienceTopic, makeActive: boolean) => {
    const list = questions.map((q) => {
      if (q.topic === topic) {
        return { ...q, isActive: makeActive };
      }
      return q;
    });
    storage.saveQuestions(list);
    setQuestions(list);
    showToast(`${TOPIC_LABELS[topic]} soruları ${makeActive ? 'etkinleştirildi' : 'devre dışı bırakıldı'}.`);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() || customOptions.some((o) => !o.trim())) {
      showToast('Lütfen soru metnini ve 4 seçeneği eksiksiz doldurun.', 'error');
      return;
    }
    const newQ = storage.addCustomQuestion({
      topic: customTopic,
      topicTitle: TOPIC_LABELS[customTopic],
      gradeLevel: 6,
      questionText: customText.trim(),
      options: customOptions.map((o) => o.trim()),
      correctIndex: customCorrect,
      explanation: customExplanation.trim() || 'Doğru cevap.',
      isActive: true
    });
    setQuestions(storage.getQuestions());
    setShowAddQuestion(false);
    setCustomText('');
    setCustomOptions(['', '', '', '']);
    setCustomExplanation('');
    showToast('Yeni soru havuza eklendi.');
  };

  const handleDeleteQuestion = (qId: string) => {
    if (window.confirm('Bu soruyu havuzdan silmek istediğinize emin misiniz?')) {
      storage.deleteQuestion(qId);
      setQuestions(storage.getQuestions());
      showToast('Soru silindi.');
    }
  };

  // Settings Save
  const handleUpdateSettings = (partial: Partial<TeacherSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    storage.saveTeacherSettings(updated);
    showToast('Ayarlar güncellendi.');
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const json = storage.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fenkod_tam_yedek_${Date.now()}.json`;
    link.click();
    showToast('Tam sistem yedeği indirildi.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storage.importFullBackup(content);
      if (success) {
        setStudents(storage.getStudents());
        setQuestions(storage.getQuestions());
        setSettings(storage.getTeacherSettings());
        showToast('Yedek başarıyla geri yüklendi!');
      } else {
        showToast('Yedek dosyası okunamadı veya biçimi hatalı.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAll = () => {
    if (window.confirm('DİKKAT: Tüm öğrenci kayıtları, ilerlemeler ve puanlar silinecek. Onaylıyor musunuz?')) {
      storage.resetAllData();
      setStudents(storage.getStudents());
      setQuestions(storage.getQuestions());
      setSettings(storage.getTeacherSettings());
      showToast('Tüm veriler sıfırlandı ve fabrika ayarlarına döndürüldü.');
    }
  };

  const filteredQuestions = selectedTopicFilter === 'all'
    ? questions
    : questions.filter((q) => q.topic === selectedTopicFilter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 animate-fade-in select-none">
        <div className="max-w-md w-full bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <span>👩‍🏫 Merve Öğretmen Yetkili Alanı</span>
          </div>

          <h2 className="text-2xl font-black text-white">Öğretmen Paneli Girişi</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Öğrenci notları, soru havuzu ve sistem ayarlarını düzenlemek için lütfen öğretmen şifrenizi giriniz.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Öğretmen Giriş Şifresi:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(false);
                  }}
                  placeholder="Şifreyi giriniz..."
                  className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none transition ${
                    passwordError
                      ? 'border-rose-500 ring-2 ring-rose-500/30'
                      : 'border-slate-800 focus:border-indigo-400'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Hatalı şifre! Lütfen Merve Öğretmen giriş şifrenizi giriniz.</span>
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm shadow-lg shadow-indigo-500/25 cursor-pointer transition transform active:scale-98"
              >
                Giriş Yap
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition"
              >
                Ana Menüye Dön
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-16 right-5 z-50 px-4 py-2.5 rounded-xl border text-xs font-bold shadow-xl animate-fade-in flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
              : 'bg-rose-950 border-rose-500 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 cursor-pointer transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Menüye Dön</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span>Yıldızkent Ortaokulu • Öğretmen Yönetim Paneli</span>
          </h2>
          <p className="text-xs text-slate-400">
            Yıldızkent Ortaokulu öğrenci listesi, soru havuzu kontrolü, seviye yönetimi ve analitik raporlar
          </p>
        </div>

        <button
          type="button"
          onClick={handleLockPanel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-bold transition cursor-pointer shadow"
          title="Öğretmen Panelini Kilitle"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kilitle</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 my-5 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'students', label: 'Öğrenci Yönetimi', icon: Users },
          { id: 'questions', label: 'Soru Havuzu (MEB)', icon: BookOpen },
          { id: 'settings', label: 'Oyun & Seviye Ayarları', icon: Settings },
          { id: 'analytics', label: 'Başarı & Analiz', icon: BarChart3 },
          { id: 'data', label: 'Yedekleme & Sıfırlama', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ÖĞRENCİ YÖNETİMİ */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Student Card */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 shadow-xl h-fit">
            <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Yeni Öğrenci Ekle</span>
            </h3>

            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Adı ve Soyadı:</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Örn: Zeynep Kaya"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Sınıf:</label>
                  <select
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="5">5. Sınıf</option>
                    <option value="6">6. Sınıf</option>
                    <option value="7">7. Sınıf</option>
                    <option value="8">8. Sınıf</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Şube:</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={newStudentSection}
                    onChange={(e) => setNewStudentSection(e.target.value.toUpperCase())}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow cursor-pointer transition"
              >
                Öğrenciyi Kaydet
              </button>
            </form>
          </div>

          {/* Student Roster Table */}
          <div className="lg:col-span-2 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Kayıtlı Öğrenci Listesi ({students.length})</span>
              </h3>
              <button
                type="button"
                onClick={handleExportStudentsCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV Olarak İndir</span>
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Öğrenci Adı</th>
                    <th className="py-2.5 px-3">Sınıf</th>
                    <th className="py-2.5 px-3">Puan</th>
                    <th className="py-2.5 px-3">Doğru Fen</th>
                    <th className="py-2.5 px-3">Seviye</th>
                    <th className="py-2.5 px-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-850/50 transition">
                      <td className="py-3 px-3 font-bold text-slate-100">{st.fullName}</td>
                      <td className="py-3 px-3 text-slate-300 font-mono">
                        {st.grade}-{st.section}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">{st.totalScore}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{st.questionsCorrect}</td>
                      <td className="py-3 px-3 text-cyan-400">{st.completedLevelsCount} / 6</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(st.id, st.fullName)}
                          className="p-1 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SORU HAVUZU */}
      {activeTab === 'questions' && (
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Fen Bilimleri Soru Havuzu ({questions.length} Soru)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Henüz işlemediğiniz konuları devre dışı bırakabilir veya özel soru ekleyebilirsiniz.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddQuestion(!showAddQuestion)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Özel Soru Ekle</span>
              </button>
            </div>
          </div>

          {/* Filter by Topic Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedTopicFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                selectedTopicFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              Tümü ({questions.length})
            </button>
            {(Object.keys(TOPIC_LABELS) as ScienceTopic[]).map((topicKey) => {
              const count = questions.filter((q) => q.topic === topicKey).length;
              return (
                <button
                  key={topicKey}
                  type="button"
                  onClick={() => setSelectedTopicFilter(topicKey)}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer whitespace-nowrap ${
                    selectedTopicFilter === topicKey
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {TOPIC_LABELS[topicKey]} ({count})
                </button>
              );
            })}
          </div>

          {/* Add Question Form Modal inline */}
          {showAddQuestion && (
            <form onSubmit={handleCreateQuestion} className="p-4 bg-slate-950 border border-cyan-500/40 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider">Yeni Soru Formu:</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Konu:</label>
                  <select
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value as ScienceTopic)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {(Object.keys(TOPIC_LABELS) as ScienceTopic[]).map((k) => (
                      <option key={k} value={k}>
                        {TOPIC_LABELS[k]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Doğru Seçenek:</label>
                  <select
                    value={customCorrect}
                    onChange={(e) => setCustomCorrect(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value={0}>A Şıkkı</option>
                    <option value={1}>B Şıkkı</option>
                    <option value={2}>C Şıkkı</option>
                    <option value={3}>D Şıkkı</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Soru Metni:</label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Soruyu buraya yazınız..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <div key={letter}>
                    <label className="block text-[11px] font-bold text-slate-400 mb-0.5">{letter} Şıkkı:</label>
                    <input
                      type="text"
                      value={customOptions[idx]}
                      onChange={(e) => {
                        const copy = [...customOptions];
                        copy[idx] = e.target.value;
                        setCustomOptions(copy);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Öğretici Açıklama:</label>
                <input
                  type="text"
                  value={customExplanation}
                  onChange={(e) => setCustomExplanation(e.target.value)}
                  placeholder="Cevap açıklamasını yazınız..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddQuestion(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black cursor-pointer shadow"
                >
                  Soruyu Kaydet
                </button>
              </div>
            </form>
          )}

          {/* Questions List */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  q.isActive
                    ? 'bg-slate-800/60 border-slate-750'
                    : 'bg-slate-950/60 border-slate-850 opacity-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded text-cyan-400 border border-slate-800">
                      {q.topicTitle}
                    </span>
                    <span className="text-[10px] text-slate-500">MEB {q.gradeLevel}. Sınıf</span>
                    {q.isCustom && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-600/40">
                        Öğretmen Sorusu
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-100">{q.questionText}</p>
                  <div className="grid grid-cols-2 gap-1.5 mt-2 text-[11px] text-slate-400">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`truncate ${
                          oIdx === q.correctIndex ? 'text-emerald-400 font-bold' : ''
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}) {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleQuestionActive(q.id)}
                    className="p-1 cursor-pointer"
                    title={q.isActive ? 'Soruyu Kapat' : 'Soruyu Aç'}
                  >
                    {q.isActive ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-500" />
                    )}
                  </button>
                  {q.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OYUN & SEVİYE AYARLARI */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl max-w-2xl space-y-5">
          <h3 className="text-sm font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Oyun Modu ve Seviye Kilitleri</span>
          </h3>

          {/* Unlock all levels toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-100">Tüm Seviyeleri Aç (Kilitleri Kaldır)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Öğrencilerin 6 seviyeye de doğrudan serbestçe erişebilmesini sağlar.
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleUpdateSettings({ unlockedAllLevels: !settings.unlockedAllLevels })}
              className="cursor-pointer"
            >
              {settings.unlockedAllLevels ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-500" />
              )}
            </button>
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-100">Ses Efektleri</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Adım, dönüş, kapı açılma ve zafer seslerini açar/kapatır.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextVal = !settings.soundEnabled;
                soundManager.setMuted(!nextVal);
                handleUpdateSettings({ soundEnabled: nextVal });
              }}
              className="cursor-pointer"
            >
              {settings.soundEnabled ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-500" />
              )}
            </button>
          </div>

          {/* Reduced motion toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-100">Animasyonları Azalt (Erişilebilirlik)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Düşük donanımlı cihazlar veya akıllı tahta performansı için sadeleştirir.
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className="cursor-pointer"
            >
              {settings.reducedMotion ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: BAŞARI ANALİZİ & GÖRSEL RECHARTS DASHBOARD */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <TeacherAnalyticsDashboard students={students} />

          {/* Top Rankers List */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sınıfın En Yüksek Başarı Gösteren Öğrencileri:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {[...students]
                .sort((a, b) => b.totalScore - a.totalScore)
                .slice(0, 6)
                .map((st, idx) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-750 text-xs shadow-sm hover:border-cyan-500/50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-950'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-100 block">{st.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {st.grade}-{st.section} Şubesi • {st.completedLevelsCount} Seviye
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-amber-400 text-sm">{st.totalScore} Puan</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: YEDEKLEME & SIFIRLAMA */}
      {activeTab === 'data' && (
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl max-w-2xl space-y-6">
          <h3 className="text-sm font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Veri Yedekleme ve Sıfırlama</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-200">🐧 Pardus Masaüstü Kısayolu (.desktop)</div>
                <div className="text-[11px] text-emerald-400/80">
                  Pardus akıllı tahtalarda ve laboratuvar bilgisayarlarında doğrudan masaüstünden çalıştırmak için kısayol dosyasını indirin.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundManager.playCorrect();
                  import('../utils/pardusShortcut').then((m) => m.downloadPardusDesktopShortcut());
                  showToast('Pardus kısayolu indirildi.');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow"
              >
                <Download className="w-4 h-4" />
                <span>Pardus İndir</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-100">Tüm Verileri JSON Olarak İndir</div>
                <div className="text-[11px] text-slate-400">
                  Öğrenci puanları, soru havuzu ve ayarlar bilgisayarınıza güvenle kaydedilir.
                </div>
              </div>
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow"
              >
                <Download className="w-4 h-4" />
                <span>Yedek İndir</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-100">Yedekten Geri Yükle</div>
                <div className="text-[11px] text-slate-400">
                  Daha önce indirdiğiniz bir .json yedek dosyasını içeri aktarın.
                </div>
              </div>
              <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs cursor-pointer shadow">
                <Upload className="w-4 h-4" />
                <span>Dosya Seç</span>
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-rose-300">Tüm Verileri Sıfırla</div>
                <div className="text-[11px] text-rose-400/80">
                  Tüm öğrenci listesini ve ilerlemeleri temizleyip fabrika ayarlarına döndürür.
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sıfırla</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
