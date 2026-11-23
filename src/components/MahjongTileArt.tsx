import React from 'react';
import { MahjongKind } from '../game/types';

interface MahjongTileArtProps {
  kind: MahjongKind;
}

const BambooStalk: React.FC<{
  x: number;
  y: number;
  h?: number;
  color?: string;
}> = ({ x, y, h = 28, color = '#15803D' }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-3.5" y="0" width="7" height={h} rx="3" fill={color} />
    <line x1="-5" y1="2" x2="5" y2="2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="-5" y1={h * 0.5} x2="5" y2={h * 0.5} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="-5" y1={h - 2} x2="5" y2={h - 2} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="0" y1="4" x2="0" y2={h - 4} stroke="#FDF6E2" strokeWidth="1.2" opacity="0.65" />
  </g>
);

const DotMandala: React.FC<{
  cx: number;
  cy: number;
  r: number;
  ringColor: string;
  centerColor: string;
}> = ({ cx, cy, r, ringColor, centerColor }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="#FDF6E2" stroke={ringColor} strokeWidth="2.4" />
    <circle cx={cx} cy={cy} r={r * 0.68} fill="none" stroke={ringColor} strokeWidth="1.4" strokeDasharray="2.5 2" />
    <circle cx={cx} cy={cy} r={r * 0.34} fill={centerColor} />
  </g>
);

function getCornerIndex(kind: MahjongKind): { text: string; color: string } {
  switch (kind) {
    case 'bamboo-1': return { text: '1', color: '#C81E1E' };
    case 'bamboo-2': return { text: '2', color: '#15803D' };
    case 'bamboo-5': return { text: '5', color: '#15803D' };
    case 'bamboo-7': return { text: '7', color: '#C81E1E' };
    case 'bamboo-8': return { text: '8', color: '#15803D' };
    case 'circle-2': return { text: '2', color: '#1E3A5F' };
    case 'circle-5': return { text: '5', color: '#1E3A5F' };
    case 'circle-8': return { text: '8', color: '#1E3A5F' };
    case 'char-1': return { text: '1', color: '#1E3A5F' };
    case 'char-9': return { text: '9', color: '#C81E1E' };
    case 'dragon-red': return { text: '中', color: '#C81E1E' };
    case 'dragon-green': return { text: '發', color: '#15803D' };
    case 'wind-east': return { text: '東', color: '#1E3A5F' };
    case 'flower-plum': return { text: '花', color: '#B45309' };
  }
}

export const MahjongTileArt: React.FC<MahjongTileArtProps> = ({ kind }) => {
  const index = getCornerIndex(kind);

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

      {/* Top-left corner index for instant senior legibility */}
      <text
        x="14"
        y="25"
        fontSize="15"
        fontWeight="800"
        fill={index.color}
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {index.text}
      </text>

      {kind === 'bamboo-1' && (
        <g transform="translate(50, 64)">
          {/* Traditional 1-Bamboo Red Shoot & Leafy Perch inspired by photo */}
          <path d="M -22 24 Q 0 16 24 22" stroke="#1E3A5F" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M -18 28 Q 2 22 20 28" stroke="#15803D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M -11 18 C -14 -4 -4 -24 2 -32 C 8 -22 14 -2 10 18 Z" fill="#C81E1E" />
          <path d="M -6 14 C -4 0 0 -14 2 -22 C 5 -14 7 0 5 14 Z" fill="#F59E0B" opacity="0.45" />
          <path d="M -15 8 Q -24 -2 -12 -10 Q -8 0 -11 12 Z" fill="#15803D" />
          <path d="M 12 6 Q 24 -4 14 -14 Q 8 -2 10 10 Z" fill="#15803D" />
          <circle cx="0" cy="-12" r="2.2" fill="#FDF6E2" />
        </g>
      )}

      {kind === 'bamboo-2' && (
        <g>
          <BambooStalk x={50} y={24} h={34} color="#1E3A5F" />
          <BambooStalk x={50} y={66} h={34} color="#15803D" />
        </g>
      )}

      {kind === 'bamboo-5' && (
        <g>
          <BambooStalk x={32} y={24} h={32} color="#15803D" />
          <BambooStalk x={68} y={24} h={32} color="#15803D" />
          <BambooStalk x={50} y={46} h={32} color="#C81E1E" />
          <BambooStalk x={32} y={68} h={32} color="#15803D" />
          <BambooStalk x={68} y={68} h={32} color="#15803D" />
        </g>
      )}

      {kind === 'bamboo-7' && (
        <g>
          <BambooStalk x={50} y={17} h={22} color="#C81E1E" />
          <BambooStalk x={30} y={45} h={24} color="#15803D" />
          <BambooStalk x={50} y={45} h={24} color="#1E3A5F" />
          <BambooStalk x={70} y={45} h={24} color="#15803D" />
          <BambooStalk x={30} y={74} h={24} color="#15803D" />
          <BambooStalk x={50} y={74} h={24} color="#1E3A5F" />
          <BambooStalk x={70} y={74} h={24} color="#15803D" />
        </g>
      )}

      {kind === 'bamboo-8' && (
        <g>
          <BambooStalk x={28} y={18} h={28} color="#15803D" />
          <BambooStalk x={50} y={18} h={28} color="#15803D" />
          <BambooStalk x={72} y={18} h={28} color="#15803D" />
          <path d="M 32 49 L 50 38 L 68 49" stroke="#1E3A5F" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M 32 63 L 50 74 L 68 63" stroke="#C81E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <BambooStalk x={28} y={67} h={28} color="#15803D" />
          <BambooStalk x={50} y={67} h={28} color="#15803D" />
          <BambooStalk x={72} y={67} h={28} color="#15803D" />
        </g>
      )}

      {kind === 'circle-2' && (
        <g>
          <DotMandala cx={50} cy={40} r={17} ringColor="#15803D" centerColor="#C81E1E" />
          <DotMandala cx={50} cy={81} r={17} ringColor="#1E3A5F" centerColor="#15803D" />
        </g>
      )}

      {kind === 'circle-5' && (
        <g>
          <DotMandala cx={32} cy={35} r={12.5} ringColor="#15803D" centerColor="#1E3A5F" />
          <DotMandala cx={68} cy={35} r={12.5} ringColor="#1E3A5F" centerColor="#15803D" />
          <DotMandala cx={50} cy={61} r={13.5} ringColor="#C81E1E" centerColor="#C81E1E" />
          <DotMandala cx={32} cy={87} r={12.5} ringColor="#1E3A5F" centerColor="#15803D" />
          <DotMandala cx={68} cy={87} r={12.5} ringColor="#15803D" centerColor="#1E3A5F" />
        </g>
      )}

      {kind === 'circle-8' && (
        <g>
          {[24, 44.5, 65, 85.5].map((cy, idx) => (
            <React.Fragment key={cy}>
              <DotMandala
                cx={36}
                cy={cy}
                r={9.2}
                ringColor={idx % 2 === 0 ? '#1E3A5F' : '#15803D'}
                centerColor="#1E3A5F"
              />
              <DotMandala
                cx={64}
                cy={cy}
                r={9.2}
                ringColor={idx % 2 === 0 ? '#15803D' : '#1E3A5F'}
                centerColor="#15803D"
              />
            </React.Fragment>
          ))}
        </g>
      )}

      {kind === 'char-1' && (
        <g textAnchor="middle" fontFamily="serif">
          <text x="50" y="51" fontSize="33" fontWeight="800" fill="#1E3A5F">一</text>
          <text x="50" y="90" fontSize="33" fontWeight="800" fill="#C81E1E">萬</text>
        </g>
      )}

      {kind === 'char-9' && (
        <g textAnchor="middle" fontFamily="serif">
          <text x="50" y="51" fontSize="33" fontWeight="800" fill="#1E3A5F">九</text>
          <text x="50" y="90" fontSize="33" fontWeight="800" fill="#C81E1E">萬</text>
        </g>
      )}

      {kind === 'dragon-red' && (
        <g textAnchor="middle">
          <text x="50" y="79" fontSize="52" fontWeight="800" fill="#C81E1E" fontFamily="serif">
            中
          </text>
        </g>
      )}

      {kind === 'dragon-green' && (
        <g textAnchor="middle">
          <text x="50" y="78" fontSize="48" fontWeight="800" fill="#15803D" fontFamily="serif">
            發
          </text>
        </g>
      )}

      {kind === 'wind-east' && (
        <g textAnchor="middle">
          <text x="50" y="79" fontSize="50" fontWeight="800" fill="#1E3A5F" fontFamily="serif">
            東
          </text>
        </g>
      )}

      {kind === 'flower-plum' && (
        <g transform="translate(50, 61)">
          <circle cx="0" cy="-18" r="10" fill="#DB2777" opacity="0.85" />
          <circle cx="17" cy="-5" r="10" fill="#DB2777" opacity="0.85" />
          <circle cx="11" cy="15" r="10" fill="#DB2777" opacity="0.85" />
          <circle cx="-11" cy="15" r="10" fill="#DB2777" opacity="0.85" />
          <circle cx="-17" cy="-5" r="10" fill="#DB2777" opacity="0.85" />
          <circle cx="0" cy="0" r="8" fill="#F59E0B" />
          <path d="M 0 18 L 0 34" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {/* Subtle suite tag at bottom */}
      <text
        x="50"
        y="112"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        letterSpacing="0.8"
        fill="#786A4A"
      >
        MAHJONG
      </text>
    </svg>
  );
};
