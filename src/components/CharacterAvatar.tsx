import React from 'react';

interface CharacterAvatarProps {
  characterId: string;
  state?: 'idle' | 'walk' | 'cheer' | 'think' | 'celebrate';
  size?: number;
  className?: string;
  showAura?: boolean;
  outfitId?: string;
  accessoryId?: string;
}

/**
 * 10 Pixar/Disney 3D Claymation ("Oyun Hamuru") Science Heroes
 * Features:
 * - Round, hand-sculpted plasticine proportions & chubby cheeks
 * - Glossy clay specular highlights giving tactile, shiny play-doh texture
 * - Expressive Disney-Pixar sparkle eyes with dual reflections
 * - Customizable outfits & accessories with clay styling
 */
export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  state = 'idle',
  size = 64,
  className = '',
  showAura = false,
  outfitId = 'outfit_default',
  accessoryId = 'acc_none',
}) => {
  // Animation classes
  let animClass = '';
  if (state === 'walk') {
    animClass = 'animate-bounce';
  } else if (state === 'cheer') {
    animClass = 'scale-110 -translate-y-1 transition-transform';
  } else if (state === 'think') {
    animClass = 'rotate-[-8deg] transition-transform';
  } else if (state === 'celebrate') {
    animClass = 'animate-pulse scale-110';
  }

  // Render accessories overlay (Play-doh stylized)
  const renderAccessoryOverlay = () => {
    switch (accessoryId) {
      case 'acc_glasses':
        return (
          <g className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            {/* Clay Visor / Glasses with doughy rounded corners and specular sheen */}
            <rect x="24" y="43" width="52" height="15" rx="7" fill="#06B6D4" stroke="#67E8F9" strokeWidth="2.5" />
            <path d="M 28 46 Q 50 44 72 46" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" fill="none" />
            <circle cx="34" cy="50" r="3" fill="#FFFFFF" />
            <circle cx="66" cy="50" r="3" fill="#FFFFFF" />
            <path d="M 24 49 L 18 47" stroke="#0891B2" strokeWidth="3" strokeLinecap="round" />
            <path d="M 76 49 L 82 47" stroke="#0891B2" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'acc_magnifier':
        return (
          <g className="filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
            {/* Chunky clay magnifying glass */}
            <circle cx="78" cy="66" r="14" fill="#E0F2FE" fillOpacity="0.6" stroke="#F59E0B" strokeWidth="3.5" />
            <circle cx="78" cy="66" r="10" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="88" y1="76" x2="98" y2="88" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
            <path d="M 72 59 Q 78 55 84 61" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          </g>
        );

      case 'acc_space_helmet':
        return (
          <g>
            {/* Bubble clay space helmet with glossy reflection */}
            <circle cx="50" cy="48" r="43" fill="#38BDF8" fillOpacity="0.25" stroke="#7DD3FC" strokeWidth="3" />
            <path d="M 22 36 Q 48 14 78 26" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
            <line x1="50" y1="5" x2="50" y2="-2" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="-2" r="4" fill="#F43F5E" className="animate-ping" />
            <circle cx="50" cy="-2" r="3" fill="#EF4444" />
          </g>
        );

      case 'acc_crown':
        return (
          <g className="filter drop-shadow-[0_3px_6px_rgba(251,191,36,0.8)]">
            {/* Doughy Golden Crown */}
            <path d="M 28 25 L 33 11 L 42 19 L 50 8 L 58 19 L 67 11 L 72 25 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="33" cy="11" r="3" fill="#EF4444" />
            <circle cx="50" cy="8" r="3.5" fill="#3B82F6" />
            <circle cx="67" cy="11" r="3" fill="#10B981" />
            <rect x="30" y="23" width="40" height="5" rx="2.5" fill="#F59E0B" />
            {/* Clay shine */}
            <ellipse cx="44" cy="16" rx="4" ry="1.5" fill="#FEF08A" opacity="0.8" />
          </g>
        );

      case 'acc_propeller':
        return (
          <g className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            {/* Beanie with spinning blades */}
            <ellipse cx="50" cy="20" rx="19" ry="7" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <path d="M 31 20 Q 50 5 69 20 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <line x1="50" y1="12" x2="50" y2="3" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="38" cy="3" rx="10" ry="3" fill="#FBBF24" className="animate-spin origin-[50px_3px]" />
            <ellipse cx="62" cy="3" rx="10" ry="3" fill="#10B981" className="animate-spin origin-[50px_3px]" />
            <circle cx="50" cy="3" r="3" fill="#F43F5E" />
          </g>
        );

      case 'acc_antenna':
        return (
          <g className="filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
            {/* Clay star antenna */}
            <line x1="50" y1="18" x2="50" y2="2" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="2" r="5.5" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <circle cx="50" cy="2" r="10" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 2" className="animate-ping" />
            <circle cx="48" cy="0" r="1.5" fill="#FFFFFF" />
          </g>
        );

      case 'acc_wizard_hat':
        return (
          <g className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
            {/* Chunky purple wizard hat with clay star */}
            <ellipse cx="50" cy="24" rx="27" ry="8" fill="#4C1D95" stroke="#2E1065" strokeWidth="2.5" />
            <path d="M 29 23 L 50 -4 L 71 23 Z" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 37 21 Q 50 17 63 21" stroke="#FBBF24" strokeWidth="3.5" fill="none" />
            <circle cx="50" cy="8" r="3.5" fill="#FDE047" />
          </g>
        );

      default:
        return null;
    }
  };

  // Render outfit overlay on torso (Play-doh stylized)
  const renderOutfitOverlay = () => {
    switch (outfitId) {
      case 'outfit_lab':
        return (
          <g className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            {/* White science lab coat with clay lapels */}
            <path d="M 26 72 L 44 95 L 23 96 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <path d="M 74 72 L 56 95 L 77 96 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="35" y="74" width="30" height="23" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
            <rect x="38" y="79" width="9" height="8" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
            <line x1="41" y1="77" x2="41" y2="83" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
            <line x1="44" y1="77" x2="44" y2="83" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
            <circle cx="57" cy="83" r="3.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          </g>
        );

      case 'outfit_cyber':
        return (
          <g className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]">
            <path d="M 26 73 L 74 73 L 78 96 L 22 96 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
            <polygon points="50,75 58,82 50,90 42,82" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="50" cy="82" r="3.5" fill="#67E8F9" className="animate-pulse" />
          </g>
        );

      case 'outfit_ninja':
        return (
          <g className="filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.6)]">
            <path d="M 24 72 L 76 72 L 78 96 L 22 96 Z" fill="#18181B" stroke="#27272A" strokeWidth="2" />
            <path d="M 24 72 L 76 96" stroke="#EF4444" strokeWidth="4" />
            <circle cx="50" cy="84" r="5" fill="#DC2626" stroke="#B91C1C" strokeWidth="1.5" />
          </g>
        );

      case 'outfit_rainbow':
        return (
          <g className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            <rect x="25" y="72" width="50" height="24" rx="8" fill="#F43F5E" />
            <rect x="25" y="78" width="50" height="6" fill="#FBBF24" />
            <rect x="25" y="84" width="50" height="6" fill="#10B981" />
            <rect x="25" y="90" width="50" height="6" rx="4" fill="#3B82F6" />
            <polygon points="50,78 52,82 56,83 53,86 54,90 50,88 46,90 47,86 44,83 48,82" fill="#FFFFFF" />
          </g>
        );

      case 'outfit_pilot':
        return (
          <g className="filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
            <rect x="25" y="72" width="50" height="24" rx="8" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <path d="M 32 72 Q 50 82 68 72" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="3" />
            <circle cx="40" cy="86" r="3" fill="#FBBF24" />
            <circle cx="60" cy="86" r="3" fill="#FBBF24" />
          </g>
        );

      default:
        return null;
    }
  };

  // 10 UNIQUE CHARACTERS IN DISNEY PLAY-DOH / CLAYMATION FORMAT
  const renderCharacterBase = () => {
    switch (characterId) {
      // 1. KOZMİK KEDİ (Tangerine Orange Clay Cat with Big Pixar Eyes & Rosy Cheeks)
      case 'cosmic_cat':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              {/* Clay Orange Radial */}
              <radialGradient id="catClay" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="35%" stopColor="#FB923C" />
                <stop offset="85%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#C2410C" />
              </radialGradient>
              <radialGradient id="catEyeClay" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064E3B" />
              </radialGradient>
              <linearGradient id="suitClay" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>

            {/* Astronaut Backpack - Chunky Dough */}
            <rect x="22" y="70" width="56" height="23" rx="11" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
            <circle cx="34" cy="80" r="3.5" fill="#38BDF8" />
            <circle cx="66" cy="80" r="3.5" fill="#38BDF8" />

            {/* Chubby Suit Body */}
            <path d="M 28 73 C 28 65, 72 65, 72 73 L 78 95 C 78 99, 22 99, 22 95 Z" fill="url(#suitClay)" stroke="#64748B" strokeWidth="2.5" />
            <circle cx="50" cy="84" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="28" cy="94" rx="7" ry="4.5" fill="#F59E0B" />
            <ellipse cx="72" cy="94" rx="7" ry="4.5" fill="#F59E0B" />

            {/* Outfit */}
            {renderOutfitOverlay()}

            {/* Chubby Clay Cat Ears */}
            <polygon points="26,22 40,40 15,40" fill="#EA580C" stroke="#C2410C" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="74,22 60,40 85,40" fill="#EA580C" stroke="#C2410C" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="28,27 37,38 21,38" fill="#FCA5A5" />
            <polygon points="72,27 63,38 79,38" fill="#FCA5A5" />

            {/* Round Play-Doh Cat Head */}
            <circle cx="50" cy="49" r="27" fill="url(#catClay)" stroke="#C2410C" strokeWidth="2.5" />
            {/* Glossy Clay Specular Highlight */}
            <ellipse cx="40" cy="35" rx="10" ry="5" fill="#FFFFFF" opacity="0.6" transform="rotate(-25 40 35)" />

            {/* Rosy Dough Cheeks */}
            <ellipse cx="33" cy="58" rx="6" ry="4" fill="#FB7185" opacity="0.75" />
            <ellipse cx="67" cy="58" rx="6" ry="4" fill="#FB7185" opacity="0.75" />

            {/* Disney Pixar Expressive Cat Eyes */}
            <ellipse cx="37" cy="47" rx="7.5" ry="9" fill="url(#catEyeClay)" stroke="#064E3B" strokeWidth="1.5" />
            <ellipse cx="37" cy="47" rx="4.5" ry="6" fill="#022C22" />
            {/* Dual Catchlights */}
            <circle cx="34" cy="43" r="3.2" fill="#FFFFFF" />
            <circle cx="39" cy="49" r="1.5" fill="#FFFFFF" />

            <ellipse cx="63" cy="47" rx="7.5" ry="9" fill="url(#catEyeClay)" stroke="#064E3B" strokeWidth="1.5" />
            <ellipse cx="63" cy="47" rx="4.5" ry="6" fill="#022C22" />
            <circle cx="60" cy="43" r="3.2" fill="#FFFFFF" />
            <circle cx="65" cy="49" r="1.5" fill="#FFFFFF" />

            {/* Cute Pink Clay Nose */}
            <polygon points="50,56 46,53 54,53" fill="#F43F5E" />
            {/* Friendly Clay Smile */}
            <path d="M 45 58 Q 47 62 50 59 Q 53 62 55 58" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

            {/* Chunky Whiskers */}
            <line x1="26" y1="56" x2="14" y2="54" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="60" x2="13" y2="62" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
            <line x1="74" y1="56" x2="86" y2="54" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
            <line x1="74" y1="60" x2="87" y2="62" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />

            {/* Default Glass Visor if no custom helmet */}
            {accessoryId !== 'acc_space_helmet' && (
              <circle cx="50" cy="47" r="38" fill="#38BDF8" fillOpacity="0.2" stroke="#60A5FA" strokeWidth="2" />
            )}

            {/* Accessory */}
            {renderAccessoryOverlay()}
          </svg>
        );

      // 2. ROBO-FEN (Cute Rounded Baymax/Wall-E Clay Robot with Glowing Eyes)
      case 'robo_fen':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              <radialGradient id="roboClay" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="40%" stopColor="#0284C7" />
                <stop offset="90%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#075985" />
              </radialGradient>
            </defs>

            {/* Antenna with Yellow Play-Doh Ball */}
            <line x1="50" y1="18" x2="50" y2="3" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="3" r="6" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" className="animate-pulse" />
            <circle cx="48" cy="1" r="1.8" fill="#FFFFFF" />

            {/* Pillow-rounded Robot Head */}
            <rect x="20" y="15" width="60" height="44" rx="18" fill="url(#roboClay)" stroke="#0369A1" strokeWidth="2.5" />
            {/* Clay Highlight Sheen */}
            <path d="M 26 22 Q 50 18 74 22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none" />

            {/* Glossy Curved Visor Screen */}
            <rect x="24" y="21" width="52" height="32" rx="12" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />

            {/* Big Pixar Glowing Eyes */}
            <circle cx="37" cy="37" r="8" fill="#38BDF8" className="animate-pulse" />
            <circle cx="34" cy="34" r="3" fill="#FFFFFF" />
            <circle cx="38" cy="39" r="1.5" fill="#FFFFFF" />

            <circle cx="63" cy="37" r="8" fill="#38BDF8" className="animate-pulse" />
            <circle cx="60" cy="34" r="3" fill="#FFFFFF" />
            <circle cx="64" cy="39" r="1.5" fill="#FFFFFF" />

            {/* Neck Joint */}
            <rect x="42" y="58" width="16" height="8" rx="3" fill="#64748B" />

            {/* Chubby Torso */}
            <rect x="25" y="65" width="50" height="30" rx="14" fill="url(#roboClay)" stroke="#0369A1" strokeWidth="2.5" />
            <circle cx="50" cy="80" r="7.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2" />
            <polygon points="50,75 52,79 56,80 53,83 54,87 50,85 46,87 47,83 44,80 48,79" fill="#F59E0B" />

            {/* Chubby Wheels */}
            <rect x="18" y="88" width="18" height="10" rx="5" fill="#334155" stroke="#1E293B" strokeWidth="2" />
            <rect x="64" y="88" width="18" height="10" rx="5" fill="#334155" stroke="#1E293B" strokeWidth="2" />

            {/* Overlays */}
            {renderOutfitOverlay()}
            {renderAccessoryOverlay()}
          </svg>
        );

      // 3. ASTRONOT ADA (Hero Girl with Soft Clay Chestnut Hair & Sparkle Eyes)
      case 'astronaut_ada':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              <radialGradient id="adaSkinClay" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="50%" stopColor="#FED7AA" />
                <stop offset="100%" stopColor="#FDBA74" />
              </radialGradient>
              <radialGradient id="adaHairClay" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#A16207" />
                <stop offset="50%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </radialGradient>
            </defs>

            {/* Chubby Pink Spacesuit */}
            <rect x="25" y="69" width="50" height="28" rx="12" fill="#EC4899" stroke="#BE185D" strokeWidth="2.5" />
            <ellipse cx="25" cy="94" rx="7" ry="5" fill="#BE185D" />
            <ellipse cx="75" cy="94" rx="7" ry="5" fill="#BE185D" />

            {/* Outfit */}
            {renderOutfitOverlay()}

            {/* Doughy Chestnut Hair Back */}
            <circle cx="50" cy="46" r="31" fill="url(#adaHairClay)" />
            {/* Cute Doughy Buns */}
            <circle cx="18" cy="48" r="11" fill="url(#adaHairClay)" stroke="#451A03" strokeWidth="1.5" />
            <circle cx="82" cy="48" r="11" fill="url(#adaHairClay)" stroke="#451A03" strokeWidth="1.5" />
            <ellipse cx="16" cy="44" rx="4" ry="2" fill="#CA8A04" opacity="0.6" />
            <ellipse cx="80" cy="44" rx="4" ry="2" fill="#CA8A04" opacity="0.6" />

            {/* Round Chubby Face */}
            <circle cx="50" cy="48" r="23" fill="url(#adaSkinClay)" stroke="#FB923C" strokeWidth="1.5" />
            {/* Clay Cheek Blush */}
            <ellipse cx="34" cy="56" rx="5" ry="3.5" fill="#FB7185" opacity="0.8" />
            <ellipse cx="66" cy="56" rx="5" ry="3.5" fill="#FB7185" opacity="0.8" />

            {/* Smooth Rounded Bangs */}
            <path d="M 28 35 Q 50 48 72 35 C 68 28, 32 28, 28 35 Z" fill="url(#adaHairClay)" />
            <ellipse cx="45" cy="32" rx="12" ry="4" fill="#CA8A04" opacity="0.5" transform="rotate(-10 45 32)" />

            {/* Big Disney Eyes */}
            <ellipse cx="39" cy="48" rx="6.5" ry="7.5" fill="#1E293B" />
            <circle cx="36" cy="45" r="2.8" fill="#FFFFFF" />
            <circle cx="41" cy="50" r="1.4" fill="#FFFFFF" />

            <ellipse cx="61" cy="48" rx="6.5" ry="7.5" fill="#1E293B" />
            <circle cx="58" cy="45" r="2.8" fill="#FFFFFF" />
            <circle cx="63" cy="50" r="1.4" fill="#FFFFFF" />

            {/* Friendly Clay Smile */}
            <path d="M 45 58 Q 50 63 55 58" fill="none" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />

            {/* Accessory */}
            {renderAccessoryOverlay()}
          </svg>
        );

      // 4. ZEKI TİLKİ (Play-Doh Red Fox with Big Ears & Warm Glow)
      case 'clever_fox':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              <radialGradient id="foxClay" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="40%" stopColor="#EA580C" />
                <stop offset="90%" stopColor="#C2410C" />
                <stop offset="100%" stopColor="#7C2D12" />
              </radialGradient>
            </defs>

            {/* Torso */}
            <path d="M 30 73 C 30 65, 70 65, 70 73 L 75 96 L 25 96 Z" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            <ellipse cx="50" cy="85" rx="12" ry="8" fill="#FEF3C7" />
            <ellipse cx="28" cy="94" rx="7" ry="4" fill="#92400E" />
            <ellipse cx="72" cy="94" rx="7" ry="4" fill="#92400E" />

            {/* Outfit */}
            {renderOutfitOverlay()}

            {/* Fluffy Dough Fox Ears */}
            <polygon points="22,16 42,38 14,38" fill="url(#foxClay)" stroke="#7C2D12" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="78,16 58,38 86,38" fill="url(#foxClay)" stroke="#7C2D12" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="26,22 38,36 18,36" fill="#18181B" />
            <polygon points="74,22 62,36 82,36" fill="#18181B" />

            {/* Round Chubby Fox Head */}
            <circle cx="50" cy="49" r="27" fill="url(#foxClay)" stroke="#7C2D12" strokeWidth="2.5" />
            {/* White Clay Cheeks */}
            <path d="M 24 53 Q 36 67 50 60 Q 64 67 76 53 Q 50 72 24 53 Z" fill="#FFFBEB" />
            <ellipse cx="32" cy="56" rx="5" ry="3.5" fill="#FB7185" opacity="0.75" />
            <ellipse cx="68" cy="56" rx="5" ry="3.5" fill="#FB7185" opacity="0.75" />

            {/* Disney Big Fox Eyes */}
            <ellipse cx="38" cy="47" rx="7" ry="8.5" fill="#451A03" />
            <circle cx="35" cy="44" r="3" fill="#FFFFFF" />
            <circle cx="39" cy="49" r="1.4" fill="#FFFFFF" />

            <ellipse cx="62" cy="47" rx="7" ry="8.5" fill="#451A03" />
            <circle cx="59" cy="44" r="3" fill="#FFFFFF" />
            <circle cx="63" cy="49" r="1.4" fill="#FFFFFF" />

            {/* Black Clay Snout & Nose */}
            <ellipse cx="50" cy="58" rx="4" ry="3" fill="#0F172A" />
            <circle cx="49" cy="57" r="1" fill="#FFFFFF" />
            <path d="M 46 61 Q 50 64 54 61" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

            {/* Accessory */}
            {renderAccessoryOverlay()}
          </svg>
        );

      // 5. KODLAMACI KAPLUMBAĞA (Green Play-Doh Turtle with Hex Shell)
      case 'coding_turtle':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              <radialGradient id="turtleClay" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#A7F3D0" />
                <stop offset="40%" stopColor="#10B981" />
                <stop offset="90%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </radialGradient>
              <radialGradient id="shellClay" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="40%" stopColor="#D97706" />
                <stop offset="90%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </radialGradient>
            </defs>

            {/* Chunky Dough Shell */}
            <circle cx="50" cy="74" r="28" fill="url(#shellClay)" stroke="#451A03" strokeWidth="3" />
            {/* Hexagonal Play-Doh Stamp Pattern */}
            <polygon points="50,60 60,66 60,78 50,84 40,78 40,66" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
            <circle cx="28" cy="90" r="7" fill="#059669" />
            <circle cx="72" cy="90" r="7" fill="#059669" />

            {/* Outfit */}
            {renderOutfitOverlay()}

            {/* Big Doughy Turtle Head */}
            <circle cx="50" cy="44" r="25" fill="url(#turtleClay)" stroke="#064E3B" strokeWidth="2.5" />
            {/* Sheen */}
            <ellipse cx="42" cy="32" rx="9" ry="4" fill="#FFFFFF" opacity="0.6" transform="rotate(-20 42 32)" />

            {/* Cheeks */}
            <ellipse cx="34" cy="51" rx="5" ry="3" fill="#FB7185" opacity="0.75" />
            <ellipse cx="66" cy="51" rx="5" ry="3" fill="#FB7185" opacity="0.75" />

            {/* Big Disney Eyes */}
            <ellipse cx="38" cy="42" rx="6.5" ry="8" fill="#0F172A" />
            <circle cx="35" cy="39" r="3" fill="#FFFFFF" />
            <circle cx="39" cy="44" r="1.4" fill="#FFFFFF" />

            <ellipse cx="62" cy="42" rx="6.5" ry="8" fill="#0F172A" />
            <circle cx="59" cy="39" r="3" fill="#FFFFFF" />
            <circle cx="63" cy="44" r="1.4" fill="#FFFFFF" />

            {/* Smile */}
            <path d="M 44 53 Q 50 58 56 53" fill="none" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />

            {/* Accessory */}
            {renderAccessoryOverlay()}
          </svg>
        );

      // 6. PROF. EINSTEIN (Chibi Scientist with Cloud-like Play-Doh White Hair & Glasses)
      case 'prof_einstein':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              <radialGradient id="einsteinSkin" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="45%" stopColor="#FED7AA" />
                <stop offset="100%" stopColor="#FDBA74" />
              </radialGradient>
            </defs>

            {/* Body */}
            <rect x="25" y="69" width="50" height="28" rx="12" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2.5" />
            <ellipse cx="50" cy="80" rx="6" ry="6" fill="#FDE047" />

            {/* Outfit */}
            {renderOutfitOverlay()}

            {/* Fluffy Cloud-like White Clay Hair */}
            <g fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2">
              <circle cx="20" cy="40" r="11" />
              <circle cx="16" cy="52" r="10" />
              <circle cx="80" cy="40" r="11" />
              <circle cx="84" cy="52" r="10" />
              <circle cx="32" cy="24" r="11" />
              <circle cx="50" cy="20" r="12" />
              <circle cx="68" cy="24" r="11" />
            </g>

            {/* Round Chubby Face */}
            <circle cx="50" cy="48" r="23" fill="url(#einsteinSkin)" stroke="#F97316" strokeWidth="1.5" />
            <ellipse cx="33" cy="56" rx="5" ry="3.5" fill="#FB7185" opacity="0.8" />
            <ellipse cx="67" cy="56" rx="5" ry="3.5" fill="#FB7185" opacity="0.8" />

            {/* Round Play-Doh Glasses */}
            <circle cx="38" cy="46" r="8" fill="none" stroke="#D97706" strokeWidth="2.5" />
            <circle cx="62" cy="46" r="8" fill="none" stroke="#D97706" strokeWidth="2.5" />
            <line x1="46" y1="46" x2="54" y2="46" stroke="#D97706" strokeWidth="2.5" />

            {/* Big Disney Eyes behind glasses */}
            <circle cx="38" cy="46" r="4.5" fill="#1E293B" />
            <circle cx="36" cy="44" r="2" fill="#FFFFFF" />

            <circle cx="62" cy="46" r="4.5" fill="#1E293B" />
            <circle cx="60" cy="44" r="2" fill="#FFFFFF" />

            {/* White Clay Mustache */}
            <path d="M 38 56 Q 50 53 62 56 Q 50 63 38 56 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Cute Pink Play-Doh Tongue (Iconic Einstein) */}
            <ellipse cx="50" cy="62" rx="3.5" ry="4" fill="#F43F5E" />

            {/* Accessory */}
            {renderAccessoryOverlay()}
          </svg>
        );

      // 7. SEVİMLİ DİNO (Chubby Cute Play-Doh T-Rex with Soft Spikes)
      case 'cyber_dino':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              <radialGradient id="dinoClay" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#A3E635" />
                <stop offset="40%" stopColor="#65A30D" />
                <stop offset="90%" stopColor="#3F6212" />
                <stop offset="100%" stopColor="#1A2E05" />
              </radialGradient>
            </defs>

            {/* Chubby Dino Tail & Spikes */}
            <path d="M 20 85 Q 8 80 14 70 Q 25 76 30 85 Z" fill="#65A30D" stroke="#3F6212" strokeWidth="2" />
            {/* Soft Play-Doh Orange Spikes on Head */}
            <polygon points="50,14 54,23 46,23" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
            <polygon points="62,17 65,26 58,26" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
            <polygon points="38,17 42,26 35,26" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />

            {/* Chubby Torso */}
            <path d="M 28 68 C 28 60, 72 60, 72 68 L 78 96 L 22 96 Z" fill="url(#dinoClay)" stroke="#3F6212" strokeWidth="2.5" />
            <ellipse cx="50" cy="84" rx="14" ry="10" fill="#FEF08A" />
            <ellipse cx="28" cy="94" rx="7" ry="5" fill="#3F6212" />
            <ellipse cx="72" cy="94" rx="7" ry="5" fill="#3F6212" />

            {/* Outfit */}
            {renderOutfitOverlay()}

            {/* Chubby Dino Head */}
            <rect x="22" y="21" width="56" height="44" rx="20" fill="url(#dinoClay)" stroke="#3F6212" strokeWidth="2.5" />
            {/* Clay Sheen */}
            <ellipse cx="40" cy="27" rx="10" ry="4" fill="#FFFFFF" opacity="0.6" transform="rotate(-15 40 27)" />

            {/* Rosy Cheeks */}
            <ellipse cx="30" cy="54" rx="6" ry="4" fill="#FB7185" opacity="0.8" />
            <ellipse cx="70" cy="54" rx="6" ry="4" fill="#FB7185" opacity="0.8" />

            {/* Big Friendly Disney Eyes */}
            <ellipse cx="37" cy="42" rx="7" ry="8.5" fill="#0F172A" />
            <circle cx="34" cy="39" r="3" fill="#FFFFFF" />
            <circle cx="38" cy="44" r="1.4" fill="#FFFFFF" />

            <ellipse cx="63" cy="42" rx="7" ry="8.5" fill="#0F172A" />
            <circle cx="60" cy="39" r="3" fill="#FFFFFF" />
            <circle cx="64" cy="44" r="1.4" fill="#FFFFFF" />

            {/* Snout & Cute Little White Clay Tooth */}
            <circle cx="45" cy="53" r="1.5" fill="#1A2E05" />
            <circle cx="55" cy="53" r="1.5" fill="#1A2E05" />
            <path d="M 42 58 Q 50 63 58 58" fill="none" stroke="#1A2E05" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="48,59 52,59 50,63" fill="#FFFFFF" />

            {/* Accessory */}
            {renderAccessoryOverlay()}
          </svg>
        );

      // 8. DERİN DALGIÇ (Play-Doh Diver with Aquamarine Wetsuit & Round Snorkel)
      case 'aqua_diver':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              <radialGradient id="diverClay" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="40%" stopColor="#0891B2" />
                <stop offset="90%" stopColor="#0E7490" />
                <stop offset="100%" stopColor="#155E75" />
              </radialGradient>
            </defs>

            {/* Oxygen Tank on Back */}
            <rect x="22" y="68" width="56" height="24" rx="10" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="34" cy="78" r="3" fill="#FEF08A" />
            <circle cx="66" cy="78" r="3" fill="#FEF08A" />

            {/* Torso */}
            <rect x="26" y="69" width="48" height="28" rx="12" fill="url(#diverClay)" stroke="#155E75" strokeWidth="2.5" />
            <ellipse cx="28" cy="94" rx="7" ry="5" fill="#0E7490" />
            <ellipse cx="72" cy="94" rx="7" ry="5" fill="#0E7490" />

            {/* Outfit */}
            {renderOutfitOverlay()}

            {/* Round Head */}
            <circle cx="50" cy="46" r="26" fill="url(#diverClay)" stroke="#155E75" strokeWidth="2.5" />
            {/* Yellow Diving Mask Rim */}
            <rect x="26" y="34" width="48" height="22" rx="10" fill="#E0F2FE" fillOpacity="0.6" stroke="#F59E0B" strokeWidth="3" />
            <ellipse cx="40" cy="38" rx="8" ry="3" fill="#FFFFFF" opacity="0.8" />

            {/* Big Eyes inside mask */}
            <ellipse cx="38" cy="45" rx="5.5" ry="6.5" fill="#0F172A" />
            <circle cx="36" cy="43" r="2.2" fill="#FFFFFF" />

            <ellipse cx="62" cy="45" rx="5.5" ry="6.5" fill="#0F172A" />
            <circle cx="60" cy="43" r="2.2" fill="#FFFFFF" />

            {/* Snorkel tube on the side */}
            <path d="M 74 48 Q 84 55 84 32 L 84 20 Q 86 16 90 20" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />

            {/* Cheerful Smile */}
            <path d="M 44 60 Q 50 64 56 60" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

            {/* Accessory */}
            {renderAccessoryOverlay()}
          </svg>
        );

      // 9. DOĞA PERİSİ (Mint Green & Lavender Fairy with Leaf Wings)
      case 'nature_elf':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              <radialGradient id="fairySkin" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="50%" stopColor="#FED7AA" />
                <stop offset="100%" stopColor="#FDBA74" />
              </radialGradient>
            </defs>

            {/* Soft Play-Doh Leaf Wings */}
            <ellipse cx="22" cy="50" rx="14" ry="24" fill="#86EFAC" fillOpacity="0.7" stroke="#22C55E" strokeWidth="2" transform="rotate(-25 22 50)" />
            <ellipse cx="78" cy="50" rx="14" ry="24" fill="#86EFAC" fillOpacity="0.7" stroke="#22C55E" strokeWidth="2" transform="rotate(25 78 50)" />

            {/* Lavender Torso */}
            <rect x="28" y="70" width="44" height="26" rx="11" fill="#C084FC" stroke="#9333EA" strokeWidth="2" />
            <ellipse cx="30" cy="94" rx="6" ry="4" fill="#9333EA" />
            <ellipse cx="70" cy="94" rx="6" ry="4" fill="#9333EA" />

            {/* Outfit */}
            {renderOutfitOverlay()}

            {/* Pastel Mint Clay Hair */}
            <circle cx="50" cy="46" r="28" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
            {/* Flower on hair */}
            <circle cx="68" cy="28" r="7" fill="#FBBF24" />
            <circle cx="68" cy="28" r="3" fill="#DC2626" />

            {/* Round Face */}
            <circle cx="50" cy="48" r="22" fill="url(#fairySkin)" stroke="#F59E0B" strokeWidth="1.5" />
            <ellipse cx="35" cy="55" rx="5" ry="3.5" fill="#FB7185" opacity="0.8" />
            <ellipse cx="65" cy="55" rx="5" ry="3.5" fill="#FB7185" opacity="0.8" />

            {/* Big Disney Eyes */}
            <ellipse cx="39" cy="47" rx="6" ry="7.5" fill="#047857" />
            <circle cx="36" cy="44" r="2.8" fill="#FFFFFF" />
            <circle cx="41" cy="49" r="1.3" fill="#FFFFFF" />

            <ellipse cx="61" cy="47" rx="6" ry="7.5" fill="#047857" />
            <circle cx="58" cy="44" r="2.8" fill="#FFFFFF" />
            <circle cx="63" cy="49" r="1.3" fill="#FFFFFF" />

            {/* Gentle Smile */}
            <path d="M 45 58 Q 50 62 55 58" fill="none" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />

            {/* Accessory */}
            {renderAccessoryOverlay()}
          </svg>
        );

      // 10. MİNİ ASTRONOT / DEFAULT (Classic White Pillowy Spacesuit Hero)
      case 'mini_astronaut':
      default:
        return (
          <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id="miniSuit" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
              <radialGradient id="miniVisor" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="90%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>
            </defs>

            {/* Backpack */}
            <rect x="22" y="70" width="56" height="23" rx="10" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
            <circle cx="34" cy="80" r="3" fill="#38BDF8" />
            <circle cx="66" cy="80" r="3" fill="#38BDF8" />

            {/* Chubby Suit */}
            <path d="M 28 73 C 28 65, 72 65, 72 73 L 78 95 C 78 99, 22 99, 22 95 Z" fill="url(#miniSuit)" stroke="#64748B" strokeWidth="2.5" />
            <circle cx="50" cy="84" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="28" cy="94" rx="7" ry="4.5" fill="#38BDF8" />
            <ellipse cx="72" cy="94" rx="7" ry="4.5" fill="#38BDF8" />

            {/* Outfit */}
            {renderOutfitOverlay()}

            {/* Round Helmet */}
            <circle cx="50" cy="46" r="28" fill="url(#miniSuit)" stroke="#64748B" strokeWidth="2.5" />
            <ellipse cx="40" cy="30" rx="11" ry="5" fill="#FFFFFF" opacity="0.6" transform="rotate(-20 40 30)" />

            {/* Golden Reflective Visor with Cute Eyes behind it */}
            <ellipse cx="50" cy="46" rx="20" ry="15" fill="url(#miniVisor)" stroke="#D97706" strokeWidth="2.5" />
            <ellipse cx="44" cy="40" rx="9" ry="3.5" fill="#FFFFFF" opacity="0.75" />

            {/* Friendly Little Eyes visible in visor */}
            <circle cx="43" cy="47" r="3" fill="#451A03" />
            <circle cx="42" cy="46" r="1.2" fill="#FFFFFF" />
            <circle cx="57" cy="47" r="3" fill="#451A03" />
            <circle cx="56" cy="46" r="1.2" fill="#FFFFFF" />

            {/* Visor Antenna */}
            <line x1="50" y1="18" x2="50" y2="6" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="6" r="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />

            {/* Accessory */}
            {renderAccessoryOverlay()}
          </svg>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${animClass} ${className}`}>
      {/* Golden Aura on Celebration or Cheer */}
      {showAura && (
        <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-md animate-pulse pointer-events-none" />
      )}
      {renderCharacterBase()}
    </div>
  );
};
