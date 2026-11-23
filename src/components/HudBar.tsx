import React from 'react';
import {
  Home,
  Lightbulb,
  Music,
  Pause,
  RotateCcw,
  Settings,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { formatClock } from '../game/memoryEngine';
import { GamePhase } from '../game/types';

interface HudBarProps {
  phase: GamePhase;
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  streak: number;
  score: number;
  elapsedSeconds: number;
  hintsLeft: number;
  muted: boolean;
  musicEnabled: boolean;
  unlockedCount: number;
  previewSecondsLeft: number;
  calloutText: string;
  onFinishPreviewEarly: () => void;
  onHint: () => void;
  onToggleMusic: () => void;
  onToggleMute: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onPause: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const HudBar: React.FC<HudBarProps> = ({
  phase,
  matchedPairs,
  totalPairs,
  moves,
  streak,
  score,
  elapsedSeconds,
  hintsLeft,
  muted,
  musicEnabled,
  unlockedCount,
  previewSecondsLeft,
  calloutText,
  onFinishPreviewEarly,
  onHint,
  onToggleMusic,
  onToggleMute,
  onOpenAchievements,
  onOpenSettings,
  onPause,
  onRestart,
  onReturnTitle,
}) => {
  return (
    <header className="w-full bg-[#0D3D39] border-b border-[#257B73] text-[#FAF5E8] px-3 sm:px-6 py-2 sm:py-2.5 shadow-md">
      <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Left Zone: Home + Live Callout / Preview Prompt */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onReturnTitle();
            }}
            aria-label="Back to Title Menu"
            title="Title Menu"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#165752] hover:bg-[#1E6D66] border border-[#2C887F] flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
          </button>

          {phase === 'preview' ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-base font-bold text-amber-300 tabular-nums whitespace-nowrap">
                Memorize · {Math.ceil(previewSecondsLeft)}s
              </span>
              <button
                type="button"
                onClick={onFinishPreviewEarly}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F2926] text-xs sm:text-sm font-extrabold whitespace-nowrap cursor-pointer transition-colors"
              >
                Begin Now
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex min-w-0 flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#95D6CE]">
                Sunlit Parlor
              </span>
              <span className="text-sm sm:text-base font-bold text-[#FAF5E8] truncate max-w-[340px]">
                {calloutText}
              </span>
            </div>
          )}
        </div>

        {/* Center/Right Zone: Tabular Readouts */}
        <div className="flex items-center gap-3 sm:gap-6 tabular-nums">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#95D6CE]">
              Pairs
            </span>
            <span className="text-base sm:text-xl font-extrabold leading-tight" data-testid="hud-pairs">
              {matchedPairs}/{totalPairs}
            </span>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#95D6CE]">
              Moves
            </span>
            <span className="text-base sm:text-xl font-extrabold leading-tight" data-testid="hud-moves">
              {moves}
            </span>
          </div>

          <div className="hidden sm:flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#95D6CE]">
              Streak
            </span>
            <span
              className={`text-lg sm:text-xl font-extrabold leading-tight ${
                streak >= 2 ? 'text-amber-300' : 'text-[#FAF5E8]'
              }`}
              data-testid="hud-streak"
            >
              ×{Math.max(1, streak)}
            </span>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#95D6CE]">
              Score
            </span>
            <span className="text-base sm:text-xl font-extrabold leading-tight text-amber-300" data-testid="hud-score">
              {score}
            </span>
          </div>

          <div className="hidden sm:flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#95D6CE]">
              Time
            </span>
            <span className="text-lg sm:text-xl font-extrabold leading-tight" data-testid="hud-time">
              {formatClock(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Far Right Zone: Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            disabled={phase !== 'playing' || hintsLeft <= 0}
            onClick={(e) => {
              e.currentTarget.blur();
              onHint();
            }}
            aria-label={`Show Hint (${hintsLeft} left)`}
            title="Show Hint [H]"
            className="min-h-[34px] sm:min-h-[40px] px-2 sm:px-3 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] disabled:opacity-45 disabled:hover:bg-[#F59E0B] text-[#0F2926] font-extrabold text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          >
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap tabular-nums">Hint ({hintsLeft})</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenAchievements();
            }}
            aria-label={`Achievements (${unlockedCount} unlocked)`}
            title="Achievements"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#165752] hover:bg-[#1E6D66] border border-[#2C887F] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Trophy className="w-4 h-4 text-amber-300" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenSettings();
            }}
            aria-label="Settings"
            title="Settings"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#165752] hover:bg-[#1E6D66] border border-[#2C887F] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMusic();
            }}
            aria-pressed={musicEnabled}
            aria-label={musicEnabled ? 'Turn Music Off' : 'Turn Music On'}
            title={musicEnabled ? 'Music On' : 'Music Off'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#165752] hover:bg-[#1E6D66] border border-[#2C887F] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Music
              className={`w-4 h-4 ${musicEnabled && !muted ? 'text-amber-300' : 'text-[#84BFB8]'}`}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            aria-label={muted ? 'Unmute Sound' : 'Mute Sound'}
            title={muted ? 'Unmute [M]' : 'Mute [M]'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#165752] hover:bg-[#1E6D66] border border-[#2C887F] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-amber-300" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            disabled={phase === 'preview'}
            onClick={(e) => {
              e.currentTarget.blur();
              onPause();
            }}
            aria-label="Pause Game"
            title="Pause [P]"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#165752] hover:bg-[#1E6D66] disabled:opacity-45 border border-[#2C887F] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Pause className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onRestart();
            }}
            aria-label="Restart Table"
            title="Restart [R]"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#165752] hover:bg-[#1E6D66] border border-[#2C887F] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
