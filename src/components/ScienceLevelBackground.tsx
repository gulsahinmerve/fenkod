import React from 'react';
import { LevelTheme } from '../types/game';

interface ScienceLevelBackgroundProps {
  theme?: LevelTheme;
  className?: string;
}

/**
 * Purely visual, science-themed background with ZERO text words or watermarks.
 * Renders subtle (silik), atmospheric space and physics visuals for each level:
 * deep space nebula, planets (Saturn & Jupiter), eclipses, magnetic fields, and space-time curvature.
 */
export const ScienceLevelBackground: React.FC<ScienceLevelBackgroundProps> = ({
  theme = 'space_deep',
  className = '',
}) => {
  switch (theme) {
    // 1. DERİN UZAY, YILDIZ KÜMELERİ & NEBULA (Seviye 1)
    case 'space_deep':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
          {/* Subtle Deep Space Colors */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-slate-950/70" />
          <div className="absolute -top-16 -left-16 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />

          {/* Pure Visual SVG: Nebula, Stars, Constellations, Distant Spiral Galaxy */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Nebula soft gradient */}
              <radialGradient id="deepNebula" cx="30%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.3" />
                <stop offset="40%" stopColor="#818CF8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0" />
              </radialGradient>
              {/* Moon texture glow */}
              <radialGradient id="moonGlow" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#94A3B8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.2" />
              </radialGradient>
            </defs>

            {/* Glowing Nebula Dust Cloud */}
            <circle cx="25%" cy="30%" r="160" fill="url(#deepNebula)" />
            <circle cx="80%" cy="70%" r="130" fill="url(#deepNebula)" />

            {/* Distant Crescent Moon with Craters (Top Left) */}
            <g transform="translate(30, 25)" opacity="0.4">
              <circle cx="30" cy="30" r="22" fill="url(#moonGlow)" />
              <circle cx="36" cy="28" r="20" fill="#090D16" />
              {/* Tiny craters on crescent */}
              <circle cx="20" cy="30" r="2.5" fill="#64748B" opacity="0.5" />
              <circle cx="24" cy="38" r="2" fill="#64748B" opacity="0.4" />
              <circle cx="22" cy="22" r="1.8" fill="#64748B" opacity="0.4" />
            </g>

            {/* Distant Swirling Spiral Galaxy (Bottom Right) */}
            <g transform="translate(82%, 78%)" opacity="0.45">
              <ellipse cx="0" cy="0" rx="45" ry="16" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeDasharray="12 4" transform="rotate(-30)" />
              <ellipse cx="0" cy="0" rx="30" ry="10" fill="none" stroke="#E9D5FF" strokeWidth="2" strokeDasharray="8 3" transform="rotate(-30)" />
              <circle cx="0" cy="0" r="6" fill="#FDF4FF" filter="drop-shadow(0 0 6px #C084FC)" />
            </g>

            {/* Constellation Star Lines (Ursa Major / Big Dipper) */}
            <g stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" opacity="0.35">
              <polyline points="220,60 270,75 320,65 350,95 400,90 405,130 355,135 350,95" fill="none" />
              <circle cx="220" cy="60" r="3" fill="#FFFFFF" />
              <circle cx="270" cy="75" r="2.5" fill="#BAE6FD" />
              <circle cx="320" cy="65" r="2.5" fill="#BAE6FD" />
              <circle cx="350" cy="95" r="3" fill="#FFFFFF" />
              <circle cx="400" cy="90" r="3" fill="#FDE047" />
              <circle cx="405" cy="130" r="3" fill="#FFFFFF" />
              <circle cx="355" cy="135" r="2.5" fill="#BAE6FD" />
            </g>

            {/* Twinkling Star Field */}
            <circle cx="10%" cy="15%" r="2" fill="#FFFFFF" className="animate-ping" />
            <circle cx="24%" cy="45%" r="1.5" fill="#C7D2FE" />
            <circle cx="42%" cy="18%" r="2.5" fill="#FDE047" />
            <circle cx="58%" cy="32%" r="1.5" fill="#FFFFFF" />
            <circle cx="72%" cy="12%" r="2" fill="#BAE6FD" />
            <circle cx="88%" cy="35%" r="2.5" fill="#FDE047" className="animate-ping" />
            <circle cx="15%" cy="80%" r="2" fill="#FDE047" />
            <circle cx="38%" cy="88%" r="1.5" fill="#FFFFFF" />
            <circle cx="52%" cy="75%" r="2" fill="#C7D2FE" />
            <circle cx="68%" cy="85%" r="2" fill="#BAE6FD" />
            <circle cx="92%" cy="65%" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
      );

    // 2. GÜNEŞ SİSTEMİ & GEZEGENLER: SATÜRN, JÜPİTER, MARS (Seviye 2)
    case 'solar_planets':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/25 via-slate-950/35 to-orange-950/30" />
          <div className="absolute -top-16 -right-16 w-88 h-88 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-16 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl" />

          {/* Pure Visual SVG: Detailed Saturn with 3D Rings, Jupiter with Storm, Mars */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="saturnBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="40%" stopColor="#FBBF24" />
                <stop offset="80%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <linearGradient id="jupiterBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="35%" stopColor="#FB923C" />
                <stop offset="70%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#7C2D12" />
              </linearGradient>
            </defs>

            {/* Glowing Sun Flare in corner */}
            <circle cx="100%" cy="0%" r="90" fill="#F59E0B" opacity="0.15" />
            <circle cx="100%" cy="0%" r="60" fill="#FDE047" opacity="0.25" />

            {/* SATURN WITH MULTI-STRIPE RINGS (Top Right) */}
            <g transform="translate(75%, 15%)">
              {/* Back Ring Half */}
              <ellipse cx="40" cy="40" rx="55" ry="14" fill="none" stroke="#FDE68A" strokeWidth="4" opacity="0.6" transform="rotate(-25 40 40)" />
              <ellipse cx="40" cy="40" rx="64" ry="16" fill="none" stroke="#D97706" strokeWidth="2.5" opacity="0.5" transform="rotate(-25 40 40)" />
              
              {/* Saturn Globe */}
              <circle cx="40" cy="40" r="28" fill="url(#saturnBody)" />
              {/* Atmospheric Bands */}
              <path d="M 16 34 Q 40 40 64 34" stroke="#B45309" strokeWidth="2" fill="none" opacity="0.7" />
              <path d="M 14 44 Q 40 50 66 44" stroke="#92400E" strokeWidth="2.5" fill="none" opacity="0.6" />
              <path d="M 19 26 Q 40 31 61 26" stroke="#F59E0B" strokeWidth="1.5" fill="none" opacity="0.8" />
              
              {/* Front Ring Half */}
              <path d="M -15 36 A 55 14 0 0 0 95 44" fill="none" stroke="#FDE68A" strokeWidth="5" transform="rotate(-25 40 40)" />
              <path d="M -24 36 A 64 16 0 0 0 104 44" fill="none" stroke="#D97706" strokeWidth="2.5" transform="rotate(-25 40 40)" />
            </g>

            {/* JUPITER WITH CLOUD BANDS & RED SPOT (Bottom Left) */}
            <g transform="translate(8%, 68%)">
              {/* Jupiter Globe */}
              <circle cx="36" cy="36" r="32" fill="url(#jupiterBody)" />
              {/* Swirling Bands */}
              <path d="M 6 26 Q 36 32 66 26" stroke="#9A3412" strokeWidth="3" fill="none" opacity="0.8" />
              <path d="M 4 36 Q 36 42 68 36" stroke="#C2410C" strokeWidth="3.5" fill="none" opacity="0.9" />
              <path d="M 5 46 Q 36 52 67 46" stroke="#9A3412" strokeWidth="2.5" fill="none" opacity="0.7" />
              {/* The Great Red Spot (Dev Kırmızı Leke) */}
              <ellipse cx="48" cy="42" rx="7" ry="4.5" fill="#991B1B" stroke="#7F1D1D" strokeWidth="1" />
              <circle cx="48" cy="42" r="2" fill="#B91C1C" />
              {/* 3 Tiny Galilean Moons */}
              <circle cx="78" cy="36" r="2" fill="#FDE68A" />
              <circle cx="92" cy="36" r="1.5" fill="#E2E8F0" />
              <circle cx="-10" cy="36" r="2.2" fill="#FED7AA" />
            </g>

            {/* MARS (Center Left) */}
            <g transform="translate(3%, 22%)">
              <circle cx="16" cy="16" r="14" fill="#EF4444" opacity="0.85" />
              {/* Polar Ice Cap */}
              <path d="M 8 7 Q 16 11 24 7 Z" fill="#F8FAFC" opacity="0.85" />
              {/* Martian Canyons / Darker Patches */}
              <circle cx="13" cy="17" r="3" fill="#991B1B" opacity="0.6" />
              <circle cx="20" cy="19" r="4" fill="#7F1D1D" opacity="0.5" />
            </g>

            {/* Planetary Orbits (Fine Golden Ellipses) */}
            <ellipse cx="50%" cy="50%" rx="52%" ry="26%" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="5 7" opacity="0.25" />
            <ellipse cx="50%" cy="50%" rx="38%" ry="19%" fill="none" stroke="#FB923C" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.2" />
            <ellipse cx="50%" cy="50%" rx="24%" ry="12%" fill="none" stroke="#FBBF24" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.2" />
          </svg>
        </div>
      );

    // 3. TUTULMALAR: GÜNEŞ & AY TUTULMASI VE IŞIK OPTİĞİ (Seviye 3)
    case 'eclipse_optics':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950/35 via-slate-950/40 to-indigo-950/45" />
          <div className="absolute top-1/4 left-1/3 w-88 h-88 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />

          {/* Pure Visual SVG: Solar Eclipse Corona, Diamond Ring, Light Cones */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Corona Glow */}
              <radialGradient id="eclipseCorona" cx="50%" cy="50%" r="50%">
                <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.6" />
                <stop offset="85%" stopColor="#0284C7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* SOLAR ECLIPSE WITH CORONA FLARES (Top Center) */}
            <g transform="translate(50%, 20%)">
              {/* Soft Outer Corona Halo */}
              <circle cx="0" cy="0" r="75" fill="url(#eclipseCorona)" />
              
              {/* Corona Ray Spikes */}
              <line x1="0" y1="-85" x2="0" y2="-45" stroke="#38BDF8" strokeWidth="2" opacity="0.6" />
              <line x1="0" y1="45" x2="0" y2="85" stroke="#38BDF8" strokeWidth="2" opacity="0.6" />
              <line x1="-85" y1="0" x2="-45" y2="0" stroke="#38BDF8" strokeWidth="2" opacity="0.6" />
              <line x1="45" y1="0" x2="85" y2="0" stroke="#38BDF8" strokeWidth="2" opacity="0.6" />
              <line x1="-58" y1="-58" x2="-32" y2="-32" stroke="#7DD3FC" strokeWidth="1.5" opacity="0.5" />
              <line x1="32" y1="32" x2="58" y2="58" stroke="#7DD3FC" strokeWidth="1.5" opacity="0.5" />
              <line x1="58" y1="-58" x2="32" y2="-32" stroke="#7DD3FC" strokeWidth="1.5" opacity="0.5" />
              <line x1="-32" y1="32" x2="-58" y2="58" stroke="#7DD3FC" strokeWidth="1.5" opacity="0.5" />

              {/* Glowing Solar Edge */}
              <circle cx="0" cy="0" r="38" fill="none" stroke="#BAE6FD" strokeWidth="3" opacity="0.8" />
              
              {/* Pitch-Black Moon Silhouette Blocking the Sun */}
              <circle cx="0" cy="0" r="36" fill="#020617" />
              
              {/* Diamond Ring Flare (Baily's Beads Effect) */}
              <circle cx="28" cy="-22" r="4.5" fill="#FFFFFF" filter="drop-shadow(0 0 8px #FFFFFF)" />
              <circle cx="28" cy="-22" r="8" fill="#38BDF8" opacity="0.4" />
            </g>

            {/* Optical Light Rays (Umbra & Penumbra Geometry Lines) */}
            <line x1="10%" y1="10%" x2="90%" y2="85%" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 6" opacity="0.2" />
            <line x1="90%" y1="10%" x2="10%" y2="85%" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 6" opacity="0.2" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#0284C7" strokeWidth="0.8" strokeDasharray="4 8" opacity="0.15" />
          </svg>
        </div>
      );

    // 4. KUVVETLER VE MANYETİK ALAN (Seviye 4)
    case 'forces_magnetic':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-950/30 to-purple-950/40" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

          {/* Pure Visual SVG: Magnetic Field Flux Curves & Dynamic Vectors */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="forceVectorArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#60A5FA" />
              </marker>
              <marker id="forceVectorAmber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#FBBF24" />
              </marker>
            </defs>

            {/* Glowing Aurora Borealis (Kutup Işıkları) Ribbon in upper sky */}
            <path d="M 0 60 Q 200 10 400 50 T 800 30" fill="none" stroke="#34D399" strokeWidth="2.5" opacity="0.35" filter="drop-shadow(0 0 8px #10B981)" />
            <path d="M 0 75 Q 250 25 500 65 T 1000 45" fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.3" filter="drop-shadow(0 0 8px #0284C7)" />

            {/* Magnetic Dipole Flux Loops (N -> S) */}
            <path d="M 20% 50% C 20% 15%, 80% 15%, 80% 50%" fill="none" stroke="#93C5FD" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.25" />
            <path d="M 20% 50% C 20% 85%, 80% 85%, 80% 50%" fill="none" stroke="#93C5FD" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.25" />
            <path d="M 28% 50% C 28% 25%, 72% 25%, 72% 50%" fill="none" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
            <path d="M 28% 50% C 28% 75%, 72% 75%, 72% 50%" fill="none" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />

            {/* Dynamic Vector Lines (Balanced and Counter-acting) */}
            <line x1="12%" y1="28%" x2="42%" y2="28%" stroke="#60A5FA" strokeWidth="2" markerEnd="url(#forceVectorArrow)" opacity="0.45" />
            <line x1="88%" y1="72%" x2="58%" y2="72%" stroke="#FBBF24" strokeWidth="2" markerEnd="url(#forceVectorAmber)" opacity="0.45" />
          </svg>
        </div>
      );

    // 5. YERÇEKİMİ VE UZAY-ZAMAN EĞRİLİĞİ (Seviye 5)
    case 'gravity_reactor':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-teal-950/35 via-slate-950/30 to-emerald-950/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />

          {/* Pure Visual SVG: Einstein Spacetime Curvature Grid & Gravitational Lensing */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            {/* Spacetime Curvature Warp Grid */}
            <g stroke="#34D399" strokeWidth="0.8" opacity="0.3">
              <path d="M 0 50% Q 50% 75% 100% 50%" fill="none" />
              <path d="M 0 65% Q 50% 88% 100% 65%" fill="none" />
              <path d="M 0 35% Q 50% 62% 100% 35%" fill="none" />
              <path d="M 25% 0 Q 42% 50% 25% 100%" fill="none" />
              <path d="M 50% 0 L 50% 100%" fill="none" strokeDasharray="4 4" />
              <path d="M 75% 0 Q 58% 50% 75% 100%" fill="none" />
            </g>

            {/* Concentric Gravitational Equipotential Rings */}
            <circle cx="50%" cy="50%" r="120" fill="none" stroke="#34D399" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.3" />
            <circle cx="50%" cy="50%" r="80" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.3" />
            <circle cx="50%" cy="50%" r="45" fill="none" stroke="#6EE7B7" strokeWidth="2" opacity="0.4" />
            <circle cx="50%" cy="50%" r="14" fill="#059669" opacity="0.5" />
          </svg>
        </div>
      );

    // 6. BÜYÜK GALAKSİ & SAMANYOLU MERKEZİ (Seviye 6)
    case 'galactic_command':
    default:
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-slate-950/30 to-yellow-950/35" />
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />

          {/* Pure Visual SVG: Grand Spiral Galaxy Arms & Cosmic Dust */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="galacticCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#D97706" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glowing Core Bulge */}
            <circle cx="50%" cy="50%" r="65" fill="url(#galacticCore)" />

            {/* Spiral Galaxy Arms (Logarithmic curves) */}
            <path d="M 50% 50% C 55% 40%, 65% 35%, 80% 32% C 90% 30%, 98% 38%, 95% 55%" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="10 4" opacity="0.4" />
            <path d="M 50% 50% C 45% 60%, 35% 65%, 20% 68% C 10% 70%, 2% 62%, 5% 45%" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="10 4" opacity="0.4" />
            <path d="M 50% 50% C 60% 55%, 68% 65%, 72% 80% C 74% 90%, 65% 98%, 50% 95%" fill="none" stroke="#FEF08A" strokeWidth="1.8" strokeDasharray="6 3" opacity="0.35" />
            <path d="M 50% 50% C 40% 45%, 32% 35%, 28% 20% C 26% 10%, 35% 2%, 50% 5%" fill="none" stroke="#FEF08A" strokeWidth="1.8" strokeDasharray="6 3" opacity="0.35" />

            {/* Concentric Stellar Radii */}
            <circle cx="50%" cy="50%" r="130" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="12 8" opacity="0.25" />
            <circle cx="50%" cy="50%" r="90" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="8 5" opacity="0.3" />
          </svg>
        </div>
      );
  }
};
