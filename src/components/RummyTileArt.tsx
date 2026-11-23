import React from 'react';
import { RummySuit } from '../game/types';

interface RummyTileArtProps {
  suit: RummySuit;
  value?: number;
}

const SUIT_META: Record<Exclude<RummySuit, 'joker'>, { color: string; bgWell: string; name: string }> = {
  red: { color: '#C81E1E', bgWell: '#FEE2E2', name: 'RED' },
  blue: { color: '#1D4ED8', bgWell: '#DBEAFE', name: 'BLUE' },
  amber: { color: '#B45309', bgWell: '#FEF3C7', name: 'GOLD' },
  black: { color: '#1E293B', bgWell: '#E2E8F0', name: 'DARK' },
};

const SuitPip: React.FC<{ suit: Exclude<RummySuit, 'joker'>; x: number; y: number; size: number; color: string }> = ({
  suit,
  x,
  y,
  size,
  color,
}) => {
  if (suit === 'red') {
    return <circle cx={x} cy={y} r={size * 0.45} fill={color} />;
  }
  if (suit === 'blue') {
    const h = size * 0.48;
    return <polygon points={`${x},${y - h} ${x + h},${y + h * 0.8} ${x - h},${y + h * 0.8}`} fill={color} />;
  }
  if (suit === 'amber') {
    const half = size * 0.42;
    return <rect x={x - half} y={y - half} width={half * 2} height={half * 2} rx="1.5" fill={color} />;
  }
  // black diamond
  const d = size * 0.52;
  return <polygon points={`${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}`} fill={color} />;
};

export const RummyTileArt: React.FC<RummyTileArtProps> = ({ suit, value }) => {
  if (suit === 'joker') {
    return (
      <svg viewBox="0 0 100 124" className="w-full h-full select-none" aria-hidden="true">
        <rect
          x="7"
          y="7"
          width="86"
          height="110"
          rx="8"
          fill="none"
          stroke="#E4D2A0"
          strokeWidth="1.5"
        />
        {/* Recessed parlor well */}
        <circle cx="50" cy="58" r="31" fill="#F3EAD0" stroke="#E4D2A0" strokeWidth="1.5" />

        {/* Classic Rummy-O Joker Jester Hat & Smiling Face */}
        <path
          d="M 27 48 C 25 32 36 22 44 33 L 50 20 L 56 33 C 64 22 75 32 73 48 Z"
          fill="#C81E1E"
        />
        <circle cx="27" cy="44" r="3.5" fill="#D97706" />
        <circle cx="50" cy="20" r="3.8" fill="#D97706" />
        <circle cx="73" cy="44" r="3.5" fill="#D97706" />

        {/* Face */}
        <circle cx="50" cy="60" r="19" fill="#FFFDF7" stroke="#1E293B" strokeWidth="2.4" />
        <circle cx="43" cy="56" r="2.7" fill="#1E293B" />
        <circle cx="57" cy="56" r="2.7" fill="#1E293B" />
        <path d="M 41 66 Q 50 75 59 66" stroke="#C81E1E" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Star mark */}
        <text x="15" y="25" fontSize="14" fontWeight="800" fill="#C81E1E">★</text>
        <text
          x="50"
          y="108"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          letterSpacing="0.8"
          fill="#1E293B"
        >
          JOKER
        </text>
      </svg>
    );
  }

  const meta = SUIT_META[suit];
  const displayNumber = value ?? 1;

  return (
    <svg viewBox="0 0 100 124" className="w-full h-full select-none" aria-hidden="true">
      {/* Subtle carved inner frame */}
      <rect
        x="7"
        y="7"
        width="86"
        height="110"
        rx="8"
        fill="none"
        stroke="#E4D2A0"
        strokeWidth="1.5"
      />

      {/* Embossed circular recess */}
      <circle cx="50" cy="58" r="29" fill={meta.bgWell} stroke="#E4D2A0" strokeWidth="1.2" />

      {/* Top-left & bottom-right color-blind accessible suit pips */}
      <SuitPip suit={suit} x={19} y={21} size={11} color={meta.color} />
      <SuitPip suit={suit} x={81} y={96} size={11} color={meta.color} />

      {/* Crisp, bold high-contrast Rummy-O number */}
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontSize={displayNumber >= 10 ? '38' : '44'}
        fontWeight="800"
        fill={meta.color}
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {displayNumber}
      </text>

      {/* Bottom suite tag */}
      <text
        x="50"
        y="112"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="800"
        letterSpacing="0.8"
        fill={meta.color}
      >
        RUMMY-O
      </text>
    </svg>
  );
};
