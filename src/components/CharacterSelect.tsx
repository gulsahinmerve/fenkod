import React, { useState } from 'react';
import { CHARACTERS, CHARACTER_OUTFITS, CHARACTER_ACCESSORIES } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { CharacterCustomization } from '../types/game';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/audio';
import {
  Check,
  Sparkles,
  ArrowLeft,
  Shirt,
  Crown,
  Smile,
  ShieldCheck,
  Lock,
  Layers
} from 'lucide-react';

interface CharacterSelectProps {
  currentSelectedId: string;
  onSelectCharacter: (id: string) => void;
  onBack: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  currentSelectedId,
  onSelectCharacter,
  onBack,
}) => {
  const [selectedId, setSelectedId] = useState(currentSelectedId);
  const [customization, setCustomization] = useState<CharacterCustomization>(() => storage.getCustomization());
  const [activeTab, setActiveTab] = useState<'characters' | 'outfits' | 'accessories'>('characters');
  const [previewState, setPreviewState] = useState<'idle' | 'walk' | 'cheer' | 'think' | 'celebrate'>('idle');

  const student = storage.getActiveStudent();
  const completedLevels = student?.completedLevelsCount || 0;

  const handlePickCharacter = (id: string) => {
    soundManager.playClick();
    setSelectedId(id);
    storage.setSelectedCharacterId(id);
    onSelectCharacter(id);
  };

  const handlePickOutfit = (outfitId: string) => {
    soundManager.playClick();
    const updated = { ...customization, outfitId };
    setCustomization(updated);
    storage.setCustomization(updated);
  };

  const handlePickAccessory = (accessoryId: string) => {
    soundManager.playClick();
    const updated = { ...customization, accessoryId };
    setCustomization(updated);
    storage.setCustomization(updated);
  };

  const handleTestAnim = (state: 'idle' | 'walk' | 'cheer' | 'think' | 'celebrate') => {
    soundManager.playClick();
    setPreviewState(state);
    if (state === 'walk') soundManager.playStep();
    else if (state === 'cheer') soundManager.playCorrect();
    else if (state === 'think') soundManager.playWrong();
    else if (state === 'celebrate') soundManager.playVictory();
  };

  const activeChar = CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];
  const activeOutfit = CHARACTER_OUTFITS.find((o) => o.id === customization.outfitId) || CHARACTER_OUTFITS[0];
  const activeAccessory = CHARACTER_ACCESSORIES.find((a) => a.id === customization.accessoryId) || CHARACTER_ACCESSORIES[0];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 cursor-pointer transition shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Karakter & Gardırop Stüdyosu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Kahramanını ve Kostümünü Özelleştir!</h2>
          <p className="text-xs text-slate-400">
            Seviyeleri tamamladıkça yeni karakterler, kıyafetler ve aksesuarlar açılır
          </p>
        </div>

        <div className="w-24 hidden sm:block" />
      </div>

      {/* Main Interactive Stage */}
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border-2 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Big Avatar Stage */}
        <div className="flex flex-col items-center relative z-10">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-b from-slate-950 to-slate-850 border-2 border-slate-700 flex items-center justify-center shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/5 rounded-3xl" />
            <CharacterAvatar
              characterId={selectedId}
              state={previewState}
              size={120}
              showAura={true}
              outfitId={customization.outfitId}
              accessoryId={customization.accessoryId}
            />
          </div>

          {/* Animation Tester Buttons */}
          <div className="flex items-center gap-1 mt-3 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow">
            <button
              type="button"
              onClick={() => handleTestAnim('idle')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                previewState === 'idle' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              Bekle
            </button>
            <button
              type="button"
              onClick={() => handleTestAnim('walk')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                previewState === 'walk' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'
              }`}
            >
              Yürü
            </button>
            <button
              type="button"
              onClick={() => handleTestAnim('cheer')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                previewState === 'cheer' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400'
              }`}
            >
              Sevin
            </button>
            <button
              type="button"
              onClick={() => handleTestAnim('think')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                previewState === 'think' ? 'bg-purple-400 text-slate-950 font-black' : 'text-slate-400'
              }`}
            >
              Düşün
            </button>
            <button
              type="button"
              onClick={() => handleTestAnim('celebrate')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                previewState === 'celebrate' ? 'bg-emerald-400 text-slate-950 font-black' : 'text-slate-400'
              }`}
            >
              Kutla
            </button>
          </div>
        </div>

        {/* Selected Hero Info & Current Equipment Badges */}
        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeChar.tag}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <span>{activeOutfit.icon} {activeOutfit.name}</span>
            </span>
            {customization.accessoryId !== 'acc_none' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                <span>{activeAccessory.icon} {activeAccessory.name}</span>
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">{activeChar.name}</h3>
          <h4 className="text-sm font-semibold text-cyan-400 mt-0.5">{activeChar.title}</h4>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed max-w-xl">
            {activeChar.description}
          </p>

          <div className="mt-5 flex items-center justify-center md:justify-start gap-3">
            <button
              type="button"
              onClick={() => {
                soundManager.playCorrect();
                onBack();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 cursor-pointer transform hover:scale-105 transition"
            >
              <Check className="w-4 h-4" />
              <span>Bu Kombinasyonla Maceraya Başla</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wardrobe Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActiveTab('characters');
          }}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition cursor-pointer border-2 ${
            activeTab === 'characters'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>1. Karakterler ({CHARACTERS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActiveTab('outfits');
          }}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition cursor-pointer border-2 ${
            activeTab === 'outfits'
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>2. Kıyafetler ({CHARACTER_OUTFITS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActiveTab('accessories');
          }}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition cursor-pointer border-2 ${
            activeTab === 'accessories'
              ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-lg shadow-purple-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>3. Aksesuarlar ({CHARACTER_ACCESSORIES.length})</span>
        </button>
      </div>

      {/* TAB 1: 10 CHARACTERS GRID */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHARACTERS.map((char) => {
            const isSelected = selectedId === char.id;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => handlePickCharacter(char.id)}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-xl shadow-cyan-950/50 ring-2 ring-cyan-400/40 transform scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  <CharacterAvatar characterId={char.id} size={48} outfitId={customization.outfitId} accessoryId={customization.accessoryId} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white truncate">{char.name}</h4>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-amber-400 truncate">{char.title}</div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                    {char.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* TAB 2: OUTFITS GRID */}
      {activeTab === 'outfits' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHARACTER_OUTFITS.map((outfit) => {
            const isSelected = customization.outfitId === outfit.id;
            return (
              <button
                key={outfit.id}
                type="button"
                onClick={() => handlePickOutfit(outfit.id)}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? 'bg-amber-950/70 border-amber-400 shadow-xl ring-2 ring-amber-400/40 transform scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-3xl">
                  {outfit.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white truncate">{outfit.name}</h4>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-cyan-400 truncate">{outfit.tag}</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {outfit.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* TAB 3: ACCESSORIES GRID */}
      {activeTab === 'accessories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHARACTER_ACCESSORIES.map((acc) => {
            const isSelected = customization.accessoryId === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => handlePickAccessory(acc.id)}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-purple-950/70 border-purple-400 shadow-xl ring-2 ring-purple-400/40 transform scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-3xl mb-2">
                  {acc.icon}
                </div>
                <div className="flex items-center justify-center gap-1.5 w-full">
                  <h4 className="text-sm font-bold text-white truncate">{acc.name}</h4>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center text-[10px] font-black shrink-0">
                      ✓
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-semibold text-purple-300 mt-0.5">{acc.tag}</div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                  {acc.description}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
