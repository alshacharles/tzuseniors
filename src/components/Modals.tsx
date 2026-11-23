import React from 'react';
import { Award, Home, Play, RotateCcw, Star, Trophy } from 'lucide-react';
import { AchievementDef } from '../game/achievements';
import { formatClock } from '../game/memoryEngine';
import { DifficultyId, RoundSummary } from '../game/types';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onTitle,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-[#072623]/75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#FAF5E8] text-[#0F2926] border-2 border-[#D9C38A] border-b-[6px] border-b-[#BCA264] shadow-2xl p-7 animate-gentle-pop flex flex-col gap-5">
        <div className="flex flex-col gap-1 text-center">
          <h2 id="pause-modal-title" className="font-display text-3xl font-bold">
            Table Paused
          </h2>
          <p className="text-sm font-medium text-[#3B625D]">
            Take a breather whenever you like. Your tiles are right where you left them.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <button
            type="button"
            onClick={onResume}
            className="min-h-[48px] w-full px-5 py-3 rounded-xl bg-[#16615B] hover:bg-[#1E7A73] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Resume Game</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="min-h-[48px] w-full px-5 py-3 rounded-xl bg-[#EFE6CE] hover:bg-[#E5D8B6] text-[#0F2926] font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Restart Table</span>
          </button>

          <button
            type="button"
            onClick={onTitle}
            className="min-h-[48px] w-full px-5 py-3 rounded-xl border border-[#D4C295] hover:bg-[#F2EAD5] text-[#284D48] font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Title Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface VictoryModalProps {
  summary: RoundSummary;
  difficulty: DifficultyId;
  newlyUnlocked: AchievementDef[];
  onPlayAgain: () => void;
  onNextDifficulty?: () => void;
  onOpenAchievements: () => void;
  onTitle: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  summary,
  difficulty,
  newlyUnlocked,
  onPlayAgain,
  onNextDifficulty,
  onOpenAchievements,
  onTitle,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-[#072623]/75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#FAF5E8] text-[#0F2926] border-2 border-[#D9C38A] border-b-[6px] border-b-[#BCA264] shadow-2xl p-7 animate-gentle-pop flex flex-col gap-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2" aria-label={`${summary.stars} out of 3 stars`}>
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-9 h-9 ${
                  s <= summary.stars
                    ? 'fill-[#F59E0B] text-[#D97706]'
                    : 'fill-[#E7DEC4] text-[#CBBF9B]'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>

          <h2 id="victory-modal-title" className="font-display text-3xl sm:text-4xl font-bold">
            Table Cleared!
          </h2>

          <p className="text-sm sm:text-base font-medium text-[#3B625D]">
            {summary.isNewBest
              ? 'New personal high score! Sharp eyes and steady recall.'
              : 'Lovely round! Every pair of Mahjong and Rummy-O tiles matched.'}
          </p>
        </div>

        {/* 3 Tabular Mastery Tiles */}
        <div className="grid grid-cols-3 gap-3 tabular-nums">
          <div className="rounded-xl bg-[#F2E9D0] border border-[#E0CFA4] p-3.5 text-center flex flex-col gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6E69]">
              Score
            </span>
            <span className="text-2xl font-extrabold text-[#0F2926]">
              {summary.score.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl bg-[#F2E9D0] border border-[#E0CFA4] p-3.5 text-center flex flex-col gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6E69]">
              Accuracy
            </span>
            <span className="text-2xl font-extrabold text-[#15803D]">
              {summary.accuracy}%
            </span>
          </div>

          <div className="rounded-xl bg-[#F2E9D0] border border-[#E0CFA4] p-3.5 text-center flex flex-col gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6E69]">
              Time
            </span>
            <span className="text-2xl font-extrabold text-[#0F2926]">
              {formatClock(summary.elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Secondary Unboxed Stat Line */}
        <div className="text-sm font-semibold text-[#3B625D] tabular-nums flex flex-wrap items-center justify-center gap-2">
          <Award className="w-4 h-4 text-[#D97706]" aria-hidden="true" />
          <span>Moves: {summary.moves}</span>
          <span aria-hidden="true">·</span>
          <span>Best Streak: ×{summary.bestStreak}</span>
          <span aria-hidden="true">·</span>
          <span>Best Score: {summary.bestScore.toLocaleString()}</span>
        </div>

        {/* Newly Unlocked Milestones Banner */}
        {newlyUnlocked.length > 0 && (
          <div className="rounded-xl bg-[#FEF3C7] border border-[#F59E0B]/60 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Trophy className="w-5 h-5 text-[#B45309] shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
                  Milestone Unlocked
                </p>
                <p className="text-sm font-extrabold text-[#0F2926] truncate">
                  {newlyUnlocked.map((a) => a.title).join(' · ')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAchievements}
              className="px-3 py-1.5 rounded-lg bg-[#0F2926] hover:bg-[#1B433F] text-[#FAF5E8] text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shrink-0"
            >
              View All
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="flex-1 min-h-[50px] px-5 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F2926] font-extrabold text-base border-b-4 border-[#B45309] flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Play Again</span>
          </button>

          {onNextDifficulty && difficulty !== 'sharp' && (
            <button
              type="button"
              onClick={onNextDifficulty}
              className="flex-1 min-h-[50px] px-5 py-3 rounded-xl bg-[#16615B] hover:bg-[#1E7A73] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>{difficulty === 'relaxed' ? 'Try Medium 50+' : 'Try Sharp Mind'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onTitle}
            className="min-h-[50px] px-4 py-3 rounded-xl border border-[#D4C295] hover:bg-[#F2EAD5] text-[#284D48] font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
