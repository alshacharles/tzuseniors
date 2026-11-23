export type AchievementId =
  | 'first-win'
  | 'perfect-game'
  | 'speedster'
  | 'streak-master'
  | 'eagle-eye'
  | 'grand-parlor';

export interface AchievementDef {
  id: AchievementId;
  title: string;
  description: string;
}

export interface AchievementProgress {
  unlocked: Record<string, string>;
}

export interface RoundEvaluationInput {
  hintsUsed: number;
  elapsedSeconds: number;
  bestStreak: number;
  accuracy: number;
  totalGamesWon: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-win',
    title: 'First Table Won',
    description: 'Clear your very first Mahjong & Rummy-O table.',
  },
  {
    id: 'perfect-game',
    title: 'Perfect Game',
    description: 'Clear a table without using any hints (0 hints).',
  },
  {
    id: 'speedster',
    title: 'Speedster',
    description: 'Clear a full table in under 60 seconds.',
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Match 5 or more pairs in a row without a miss.',
  },
  {
    id: 'eagle-eye',
    title: 'Eagle Eye',
    description: 'Finish a table with 85% or higher matching accuracy.',
  },
  {
    id: 'grand-parlor',
    title: 'Grand Parlor',
    description: 'Win 5 tables across any difficulty.',
  },
];

export function evaluateAchievements(
  input: RoundEvaluationInput,
  alreadyUnlocked: Record<string, string>
): AchievementDef[] {
  const earnedIds: AchievementId[] = ['first-win'];

  if (input.hintsUsed === 0) {
    earnedIds.push('perfect-game');
  }
  if (input.elapsedSeconds < 60) {
    earnedIds.push('speedster');
  }
  if (input.bestStreak >= 5) {
    earnedIds.push('streak-master');
  }
  if (input.accuracy >= 85) {
    earnedIds.push('eagle-eye');
  }
  if (input.totalGamesWon >= 5) {
    earnedIds.push('grand-parlor');
  }

  return ACHIEVEMENTS.filter(
    (def) => earnedIds.includes(def.id) && !alreadyUnlocked[def.id]
  );
}
