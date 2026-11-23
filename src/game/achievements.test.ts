import test from 'node:test';
import assert from 'node:assert/strict';
import { ACHIEVEMENTS, evaluateAchievements } from './achievements';

test('achievement catalog includes requested milestones', () => {
  const ids = ACHIEVEMENTS.map((a) => a.id);
  assert.equal(ids.includes('perfect-game'), true);
  assert.equal(ids.includes('speedster'), true);
  assert.equal(ids.includes('streak-master'), true);
});

test('evaluateAchievements unlocks Perfect Game, Speedster, Streak Master, and Eagle Eye when criteria are met', () => {
  const unlocked = evaluateAchievements(
    {
      hintsUsed: 0,
      elapsedSeconds: 42,
      bestStreak: 6,
      accuracy: 91,
      totalGamesWon: 1,
    },
    {}
  );

  const ids = unlocked.map((a) => a.id);
  assert.deepEqual(ids, [
    'first-win',
    'perfect-game',
    'speedster',
    'streak-master',
    'eagle-eye',
  ]);
});

test('evaluateAchievements respects boundary thresholds and skips already unlocked milestones', () => {
  const unlocked = evaluateAchievements(
    {
      hintsUsed: 1,
      elapsedSeconds: 60,
      bestStreak: 4,
      accuracy: 84,
      totalGamesWon: 5,
    },
    { 'first-win': '2026-11-22' }
  );

  const ids = unlocked.map((a) => a.id);
  assert.deepEqual(ids, ['grand-parlor']);
});
