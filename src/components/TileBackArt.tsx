import React from 'react';
import { getTileBackTheme } from '../game/tileThemes';
import { TileBackId } from '../game/types';

interface TileBackArtProps {
  themeId: TileBackId;
}

export const TileBackArt: React.FC<TileBackArtProps> = ({ themeId }) => {
  const theme = getTileBackTheme(themeId);

  return (
    <svg
      viewBox="0 0 60 76"
      className="w-4/5 h-4/5"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="52"
        height="68"
        rx="5"
        fill="none"
        stroke={theme.patternColor}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {themeId === 'denim-parlor' && (
        <g>
          <polygon
            points="30,17 45,38 30,59 15,38"
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="2"
            opacity="0.82"
          />
          <circle cx="30" cy="38" r="5" fill={theme.accentColor} opacity="0.88" />
        </g>
      )}

      {themeId === 'classic-wood' && (
        <g>
          {/* Subtle woodgrain lines */}
          <path d="M 10 14 Q 30 19 50 14" stroke={theme.patternColor} strokeWidth="1.1" fill="none" opacity="0.45" />
          <path d="M 10 62 Q 30 57 50 62" stroke={theme.patternColor} strokeWidth="1.1" fill="none" opacity="0.45" />
          {/* Inlaid brass rosette */}
          <circle cx="30" cy="38" r="14" fill="none" stroke={theme.accentColor} strokeWidth="1.8" opacity="0.8" />
          <circle cx="30" cy="38" r="8" fill="none" stroke={theme.accentColor} strokeWidth="1.2" opacity="0.65" />
          <circle cx="30" cy="38" r="3.2" fill={theme.accentColor} opacity="0.9" />
        </g>
      )}

      {themeId === 'royal-velvet' && (
        <g>
          {/* Ornate gilt corner brackets & center crown quatrefoil */}
          <path d="M 11 16 L 11 10 L 17 10" stroke={theme.accentColor} strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M 49 16 L 49 10 L 43 10" stroke={theme.accentColor} strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M 11 60 L 11 66 L 17 66" stroke={theme.accentColor} strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M 49 60 L 49 66 L 43 66" stroke={theme.accentColor} strokeWidth="1.5" fill="none" opacity="0.7" />
          <circle cx="30" cy="31" r="6" fill="none" stroke={theme.accentColor} strokeWidth="1.6" opacity="0.85" />
          <circle cx="30" cy="45" r="6" fill="none" stroke={theme.accentColor} strokeWidth="1.6" opacity="0.85" />
          <circle cx="23" cy="38" r="6" fill="none" stroke={theme.accentColor} strokeWidth="1.6" opacity="0.85" />
          <circle cx="37" cy="38" r="6" fill="none" stroke={theme.accentColor} strokeWidth="1.6" opacity="0.85" />
          <circle cx="30" cy="38" r="3" fill={theme.accentColor} opacity="0.95" />
        </g>
      )}

      {themeId === 'vintage-slate' && (
        <g>
          {/* Art-deco geometric frame */}
          <rect
            x="10"
            y="10"
            width="40"
            height="56"
            rx="2"
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="1.2"
            opacity="0.55"
          />
          <polygon
            points="30,16 42,38 30,60 18,38"
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="1.8"
            opacity="0.8"
          />
          <line x1="18" y1="38" x2="42" y2="38" stroke={theme.accentColor} strokeWidth="1.3" opacity="0.65" />
          <line x1="30" y1="16" x2="30" y2="60" stroke={theme.accentColor} strokeWidth="1.3" opacity="0.65" />
        </g>
      )}
    </svg>
  );
};
