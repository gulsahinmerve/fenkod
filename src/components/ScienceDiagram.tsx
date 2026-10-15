import React from 'react';
import { ScienceQuestion } from '../types/game';

interface ScienceDiagramProps {
  question: ScienceQuestion;
  className?: string;
}

export const ScienceDiagram: React.FC<ScienceDiagramProps> = ({ question, className = '' }) => {
  const { diagramType, diagramData } = question;
  if (!diagramType) return null;

  switch (diagramType) {
    case 'solar_eclipse':
      return (
        <div className={`bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col items-center shadow-xl shadow-amber-950/20 ${className}`}>
          <div className="flex items-center gap-2 text-xs text-amber-300 font-black mb-3 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
            <span>✨ Gök Cisimleri Dizilim Modeli (Disney/Pixar Galaksi İllüstrasyonu)</span>
          </div>
          <svg viewBox="0 0 480 160" className="w-full max-w-lg h-auto overflow-visible">
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EA580C" />
              </radialGradient>
              <radialGradient id="earthGlobe" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="40%" stopColor="#38BDF8" />
                <stop offset="80%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#082F49" />
              </radialGradient>
              <radialGradient id="moonGlobe" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#F1F5F9" />
                <stop offset="60%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </radialGradient>
              <linearGradient id="lightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#FDE047" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Background space stars */}
            <circle cx="80" cy="20" r="1.5" fill="#FFF" opacity="0.6" />
            <circle cx="160" cy="140" r="1.2" fill="#FFF" opacity="0.4" />
            <circle cx="300" cy="25" r="1.8" fill="#FDE047" opacity="0.5" />
            <circle cx="430" cy="130" r="1.5" fill="#FFF" opacity="0.7" />

            {/* Light Cone Beams */}
            <polygon points="60,80 220,70 390,56" fill="url(#lightBeam)" />
            <polygon points="60,80 220,90 390,104" fill="url(#lightBeam)" />
            {/* Shadow Cone (Umbra) */}
            <polygon points="220,80 390,68 390,92" fill="rgba(15, 23, 42, 0.9)" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Sun Body (Güneş) - Glowing Pixar Star */}
            <g className="filter drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
              <circle cx="60" cy="80" r="42" fill="url(#sunGlow)" />
              {/* Anime Sun Crown Rings */}
              <circle cx="60" cy="80" r="48" fill="none" stroke="#FDE047" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" className="animate-spin" />
              <text x="60" y="85" fill="#78350F" fontSize="11" fontWeight="black" textAnchor="middle">Işık Kaynağı</text>
            </g>

            {/* Middle Celestial Body (Ay) - Cute Moon */}
            <g className="filter drop-shadow-[0_0_8px_rgba(148,163,184,0.6)]">
              <circle cx="220" cy="80" r="16" fill="url(#moonGlobe)" stroke="#CBD5E1" strokeWidth="1.5" />
              {/* Moon craters */}
              <circle cx="215" cy="75" r="3" fill="#64748B" opacity="0.5" />
              <circle cx="224" cy="84" r="2" fill="#64748B" opacity="0.5" />
              <text x="220" y="116" fill="#FDE047" fontSize="12" fontWeight="black" textAnchor="middle">Gök Cismi (K)</text>
              <text x="220" y="130" fill="#94A3B8" fontSize="10" textAnchor="middle">(Ortadaki)</text>
            </g>

            {/* Right Celestial Body (Dünya) - Beautiful Blue Marble with Continents & Clouds */}
            <g className="filter drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]">
              <circle cx="390" cy="80" r="32" fill="url(#earthGlobe)" stroke="#E0F2FE" strokeWidth="2" />
              {/* Green continents */}
              <path d="M 374 72 Q 380 65 388 70 Q 386 78 376 80 Z" fill="#22C55E" opacity="0.8" />
              <path d="M 392 84 Q 402 82 406 90 Q 396 96 392 88 Z" fill="#22C55E" opacity="0.8" />
              {/* Cloud swirls */}
              <path d="M 372 65 Q 388 62 404 68" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.6" />
              {/* Shadow Overlay on Earth surface */}
              <ellipse cx="370" cy="80" rx="6" ry="12" fill="#020617" opacity="0.85" />
              <text x="390" y="84" fill="#FFFFFF" fontSize="11" fontWeight="black" textAnchor="middle">Gök Cismi (L)</text>
              <text x="390" y="130" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">Gölge Bölgesi</text>
            </g>
          </svg>
        </div>
      );

    case 'lunar_eclipse':
      return (
        <div className={`bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-2xl p-4 flex flex-col items-center shadow-xl shadow-indigo-950/20 ${className}`}>
          <div className="flex items-center gap-2 text-xs text-indigo-300 font-black mb-3 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
            <span>✨ Gök Cisimleri Dizilim Modeli (Disney/Pixar Galaksi İllüstrasyonu)</span>
          </div>
          <svg viewBox="0 0 480 160" className="w-full max-w-lg h-auto overflow-visible">
            <defs>
              <radialGradient id="sunGlow2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EA580C" />
              </radialGradient>
              <radialGradient id="earthGlobe2" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="40%" stopColor="#38BDF8" />
                <stop offset="80%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#082F49" />
              </radialGradient>
              <radialGradient id="bloodMoon" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FCA5A5" />
                <stop offset="60%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </radialGradient>
            </defs>

            {/* Sun Rays */}
            <polygon points="60,80 230,48 420,32" fill="rgba(254, 240, 138, 0.18)" />
            <polygon points="60,80 230,112 420,128" fill="rgba(254, 240, 138, 0.18)" />
            {/* Shadow Cone (Dünya Tam Gölgesi) */}
            <polygon points="230,48 420,60 420,100 230,112" fill="rgba(15, 23, 42, 0.95)" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Body 1 (Güneş) */}
            <g className="filter drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
              <circle cx="60" cy="80" r="42" fill="url(#sunGlow2)" />
              <text x="60" y="85" fill="#78350F" fontSize="11" fontWeight="black" textAnchor="middle">Işık Kaynağı</text>
            </g>

            {/* Body 2 (Ortadaki X cismi - Dünya) */}
            <g className="filter drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]">
              <circle cx="230" cy="80" r="32" fill="url(#earthGlobe2)" stroke="#E0F2FE" strokeWidth="2" />
              <text x="230" y="84" fill="#FFFFFF" fontSize="11" fontWeight="black" textAnchor="middle">Gök Cismi (X)</text>
              <text x="230" y="130" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">(Ortadaki)</text>
            </g>

            {/* Body 3 (En sağdaki Y cismi - Ay gölgeye girmiş) */}
            <g className="filter drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
              <circle cx="420" cy="80" r="16" fill="url(#bloodMoon)" stroke="#F87171" strokeWidth="1.5" />
              <text x="420" y="114" fill="#F87171" fontSize="12" fontWeight="black" textAnchor="middle">Gök Cismi (Y)</text>
              <text x="420" y="128" fill="#CBD5E1" fontSize="10" textAnchor="middle">(Gölge İçinde)</text>
            </g>
          </svg>
        </div>
      );

    case 'force_vectors': {
      const forces = diagramData?.forces || [];
      return (
        <div className={`bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/40 rounded-2xl p-4 flex flex-col items-center shadow-xl shadow-cyan-950/20 ${className}`}>
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-black mb-3 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
            <span>🎯 Dinamik Kuvvet Vektörleri Şeması</span>
          </div>
          <svg viewBox="0 0 400 140" className="w-full max-w-md h-auto overflow-visible">
            {/* Glossy Ground Line */}
            <line x1="20" y1="110" x2="380" y2="110" stroke="#38BDF8" strokeWidth="3" strokeDasharray="8 6" opacity="0.7" />

            {/* Central Stylized Object (Cute Pixar Container Box) */}
            <g className="filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]">
              <rect x="155" y="55" width="90" height="55" rx="12" fill="#1E293B" stroke="#38BDF8" strokeWidth="3" />
              {/* Metallic highlight */}
              <line x1="165" y1="62" x2="235" y2="62" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <rect x="180" y="72" width="40" height="20" rx="6" fill="#0F172A" />
              <text x="200" y="86" fill="#F8FAFC" fontSize="13" fontWeight="black" textAnchor="middle">CİSİM</text>
            </g>

            {/* Render Force Arrows */}
            {forces.map((f, i) => {
              const len = Math.min(Math.max(f.magnitude * 5, 45), 100);
              if (f.direction === 'right') {
                const startX = 245;
                const endX = startX + len;
                const y = 68 + i * 18;
                return (
                  <g key={i} className="filter drop-shadow-[0_2px_6px_rgba(16,185,129,0.5)]">
                    <line x1={startX} y1={y} x2={endX} y2={y} stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
                    <polygon points={`${endX + 4},${y} ${endX - 8},${y - 6} ${endX - 8},${y + 6}`} fill="#10B981" />
                    <text x={startX + len / 2} y={y - 8} fill="#34D399" fontSize="12" fontWeight="black" textAnchor="middle">
                      {f.name}
                    </text>
                  </g>
                );
              } else if (f.direction === 'left') {
                const startX = 155;
                const endX = startX - len;
                const y = 68 + i * 18;
                return (
                  <g key={i} className="filter drop-shadow-[0_2px_6px_rgba(239,68,68,0.5)]">
                    <line x1={startX} y1={y} x2={endX} y2={y} stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
                    <polygon points={`${endX - 4},${y} ${endX + 8},${y - 6} ${endX + 8},${y + 6}`} fill="#EF4444" />
                    <text x={startX - len / 2} y={y - 8} fill="#F87171" fontSize="12" fontWeight="black" textAnchor="middle">
                      {f.name}
                    </text>
                  </g>
                );
              } else if (f.direction === 'down') {
                const startY = 110;
                const endY = startY + len / 1.5;
                return (
                  <g key={i}>
                    <line x1="200" y1={startY} x2="200" y2={endY} stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                    <polygon points={`200,${endY + 4} 194,${endY - 6} 206,${endY - 6}`} fill="#F59E0B" />
                    <text x="220" y={endY - 4} fill="#FBBF24" fontSize="12" fontWeight="black">
                      {f.name}
                    </text>
                  </g>
                );
              } else {
                const startY = 55;
                const endY = startY - len / 1.5;
                return (
                  <g key={i}>
                    <line x1="200" y1={startY} x2="200" y2={endY} stroke="#A855F7" strokeWidth="4" strokeLinecap="round" />
                    <polygon points={`200,${endY - 4} 194,${endY + 6} 206,${endY + 6}`} fill="#A855F7" />
                    <text x="220" y={endY + 16} fill="#C084FC" fontSize="12" fontWeight="black">
                      {f.name}
                    </text>
                  </g>
                );
              }
            })}
          </svg>
        </div>
      );
    }

    case 'balanced_box': {
      const objName = diagramData?.objectName || 'Kutu';
      return (
        <div className={`bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-2xl p-4 flex flex-col items-center shadow-xl shadow-emerald-950/20 ${className}`}>
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-black mb-3 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            <span>⚖️ Dengelenmiş Kuvvet Modeli (Net Kuvvet R = 0 N)</span>
          </div>
          <svg viewBox="0 0 400 130" className="w-full max-w-md h-auto overflow-visible">
            <line x1="20" y1="100" x2="380" y2="100" stroke="#10B981" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />

            <g className="filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]">
              <rect x="150" y="45" width="100" height="55" rx="12" fill="#1E293B" stroke="#10B981" strokeWidth="3" />
              <text x="200" y="78" fill="#F8FAFC" fontSize="13" fontWeight="black" textAnchor="middle">{objName}</text>
            </g>

            {/* Equal Opposing Arrows */}
            <g className="filter drop-shadow-[0_2px_6px_rgba(16,185,129,0.5)]">
              <line x1="250" y1="72" x2="330" y2="72" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
              <polygon points="334,72 322,66 322,78" fill="#10B981" />
              <text x="290" y="62" fill="#34D399" fontSize="12" fontWeight="black" textAnchor="middle">F₁ = 10 N</text>
            </g>
            <g className="filter drop-shadow-[0_2px_6px_rgba(16,185,129,0.5)]">
              <line x1="150" y1="72" x2="70" y2="72" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
              <polygon points="66,72 78,66 78,78" fill="#10B981" />
              <text x="110" y="62" fill="#34D399" fontSize="12" fontWeight="black" textAnchor="middle">F₂ = 10 N</text>
            </g>
          </svg>
        </div>
      );
    }

    case 'planet_order': {
      return (
        <div className={`bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/40 rounded-2xl p-4 flex flex-col items-center shadow-xl shadow-cyan-950/20 ${className}`}>
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-black mb-3 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
            <span>🪐 Güneş Sistemi Yörünge Modeli</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full py-2 px-1 text-center justify-center">
            {/* Sun */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-yellow-200 shadow-lg shadow-amber-500/50 flex items-center justify-center text-xs animate-pulse">
                ☀️
              </div>
              <span className="text-[11px] text-amber-300 mt-1 font-black">Güneş</span>
            </div>

            {/* 8 Neutral Planetary Orbits */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((orbitNum) => (
              <div
                key={orbitNum}
                className="flex flex-col items-center shrink-0 px-1 py-1 rounded"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-400 shadow-md flex items-center justify-center text-[10px] text-cyan-200 font-mono font-black">
                  {orbitNum}
                </div>
                <span className="text-[10px] mt-1 whitespace-nowrap text-slate-300 font-bold">
                  {orbitNum}. Yörünge
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'dynamometer_scale': {
      const d = diagramData?.dynamometer || { maxCapacity: 50, totalDivisions: 10, stretchedDivisions: 4 };
      const maxCap = d.maxCapacity;
      const totalDiv = d.totalDivisions;
      const stretched = d.stretchedDivisions;
      const stretchPercent = Math.min(1, Math.max(0, stretched / totalDiv));
      const pointerY = 40 + stretchPercent * 100;

      return (
        <div className={`bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col items-center shadow-xl shadow-amber-950/20 ${className}`}>
          <div className="text-xs text-amber-300 font-black mb-3 flex items-center gap-1.5 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
            <span>🔬 Dinamometre Ölçümü</span>
            <span className="text-[11px] text-slate-300 font-mono font-bold">(Maksimum {maxCap} N, {totalDiv} Eşit Bölmeli)</span>
          </div>
          <svg viewBox="0 0 360 190" className="w-full max-w-xs h-auto overflow-visible">
            {/* Top Ring / Mount */}
            <circle cx="180" cy="14" r="9" fill="none" stroke="#94A3B8" strokeWidth="3" />
            <line x1="180" y1="23" x2="180" y2="30" stroke="#94A3B8" strokeWidth="4" />

            {/* Outer Tube */}
            <rect x="145" y="30" width="70" height="120" rx="8" fill="#1E293B" stroke="#0284C7" strokeWidth="3" />
            <rect x="153" y="36" width="54" height="108" rx="4" fill="#0F172A" />

            {/* Spring Coils */}
            <path
              d={`M 180 38 Q 188 44, 180 50 Q 172 56, 180 62 Q 188 68, 180 74 Q 172 80, 180 86 Q 188 92, 180 98 Q 172 104, 180 ${Math.min(pointerY, 135)}`}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
            />

            {/* Scale Markings */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((divIdx) => {
              const y = 40 + (divIdx / totalDiv) * 95;
              const isMajor = divIdx % 2 === 0;
              return (
                <g key={divIdx}>
                  <line
                    x1="155"
                    y1={y}
                    x2={isMajor ? 168 : 162}
                    y2={y}
                    stroke={isMajor ? '#F8FAFC' : '#64748B'}
                    strokeWidth={isMajor ? 2 : 1}
                  />
                  {isMajor && (
                    <text x="150" y={y + 3} fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="end">
                      {divIdx === 0 ? '0' : `${divIdx}`}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Active Pointer */}
            <polygon
              points={`170,${pointerY} 184,${pointerY - 5} 184,${pointerY + 5}`}
              fill="#EF4444"
            />
            <line x1="170" y1={pointerY} x2="205" y2={pointerY} stroke="#EF4444" strokeWidth="2.5" strokeDasharray="2 2" />
            <text x="210" y={pointerY + 4} fill="#F87171" fontSize="12" fontWeight="black">
              {stretched}. Bölme
            </text>

            {/* Bottom Hook */}
            <line x1="180" y1="140" x2="180" y2="155" stroke="#94A3B8" strokeWidth="3.5" />
            <path d="M 180 155 Q 175 162, 180 167 Q 185 170, 180 175" fill="none" stroke="#94A3B8" strokeWidth="3.5" />

            {/* Pixar-style cute weight */}
            <rect x="160" y="165" width="40" height="22" rx="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" className="filter drop-shadow-md" />
            <text x="180" y="180" fill="#78350F" fontSize="11" fontWeight="black" textAnchor="middle">
              G Cisim
            </text>
          </svg>
        </div>
      );
    }

    default:
      return null;
  }
};
