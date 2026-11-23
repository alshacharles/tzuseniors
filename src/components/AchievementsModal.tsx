import React, { useEffect } from 'react';
import { Check, Lock, Trophy, X } from 'lucide-react';
import { ACHIEVEMENTS } from '../game/achievements';

interface AchievementsModalProps {
  unlockedMap: Record<string, string>;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedMap,
  onClose,
}) => {
  const unlockedCount = ACHIEVEMENTS.filter((a) => Boolean(unlockedMap[a.id])).length;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#072623]/75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-2xl bg-[#FAF5E8] text-[#0F2926] border-2 border-[#D9C38A] border-b-[6px] border-b-[#BCA264] shadow-2xl p-6 sm:p-7 animate-gentle-pop flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FDE68A] border border-[#E5B84B] flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-[#92400E]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="achievements-modal-title" className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                Parlor Achievements
              </h2>
              <p className="text-sm font-semibold text-[#3B625D] tabular-nums">
                {unlockedCount} of {ACHIEVEMENTS.length} Milestones Unlocked
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Achievements"
            className="w-10 h-10 rounded-xl border border-[#D4C295] hover:bg-[#EFE6CE] flex items-center justify-center shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <X className="w-5 h-5 text-[#284D48]" aria-hidden="true" />
          </button>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Achievement milestones">
          {ACHIEVEMENTS.map((item) => {
            const isUnlocked = Boolean(unlockedMap[item.id]);
            return (
              <li
                key={item.id}
                data-achievement={item.id}
                data-unlocked={isUnlocked ? 'true' : 'false'}
                className={`rounded-xl p-4 border flex items-start gap-3 transition-colors ${
                  isUnlocked
                    ? 'bg-[#FDFBF4] border-[#15803D]/50 shadow-sm'
                    : 'bg-[#F2E9D0]/70 border-[#DFCFA7] opacity-85'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isUnlocked
                      ? 'bg-[#15803D] text-white'
                      : 'bg-[#E2D5B3] text-[#6B5E42]'
                  }`}
                  aria-hidden="true"
                >
                  {isUnlocked ? (
                    <Check className="w-5 h-5 stroke-[2.8]" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-extrabold text-[#0F2926]">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#3B625D] leading-snug">
                    {item.description}
                  </p>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider pt-0.5 ${
                      isUnlocked ? 'text-[#15803D]' : 'text-[#6D6249]'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#16615B] hover:bg-[#1E7A73] text-white font-bold text-base cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
