import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAccuracy,
  calculateStars,
  canFlipTile,
  computeMatchScore,
  createDeck,
  DIFFICULTIES,
  evaluatePair,
  findHintPair,
  formatClock,
} from './memoryEngine';

function createDeterministicRng(seed = 42): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

test('createDeck generates exact tile counts for all difficulty tiers', () => {
  const relaxed = createDeck('relaxed', 'mixed', createDeterministicRng(1));
  const medium = createDeck('medium', 'mixed', createDeterministicRng(2));
  const sharp = createDeck('sharp', 'mixed', createDeterministicRng(3));

  assert.equal(relaxed.length, DIFFICULTIES.relaxed.pairs * 2);
  assert.equal(medium.length, DIFFICULTIES.medium.pairs * 2);
  assert.equal(sharp.length, DIFFICULTIES.sharp.pairs * 2);
  assert.equal(medium.length, 20);
});

test('mixed mode balances Mahjong and Rummy-O tiles cleanly', () => {
  const medium = createDeck('medium', 'mixed', createDeterministicRng(7));
  const mjCount = medium.filter((t) => t.def.family === 'mahjong').length;
  const rmCount = medium.filter((t) => t.def.family === 'rummy').length;

  assert.equal(mjCount, 10);
  assert.equal(rmCount, 10);
});

test('mahjong-only and rummy-only decks contain only their respective families', () => {
  const mjDeck = createDeck('medium', 'mahjong', createDeterministicRng(9));
  const rmDeck = createDeck('medium', 'rummy', createDeterministicRng(9));

  assert.equal(mjDeck.every((t) => t.def.family === 'mahjong'), true);
  assert.equal(rmDeck.every((t) => t.def.family === 'rummy'), true);
});

test('canFlipTile enforces game phase, selection limit, and matched state', () => {
  const deck = createDeck('relaxed', 'mixed', createDeterministicRng(5), false);
  const first = deck[0];
  const second = deck[1];
  const third = deck[2];

  assert.equal(canFlipTile(deck, first.id, [], 'preview'), false);
  assert.equal(canFlipTile(deck, first.id, [], 'paused'), false);
  assert.equal(canFlipTile(deck, first.id, [], 'playing'), true);
  assert.equal(canFlipTile(deck, first.id, [first.id], 'playing'), false);
  assert.equal(canFlipTile(deck, third.id, [first.id, second.id], 'playing'), false);

  deck[0].isMatched = true;
  assert.equal(canFlipTile(deck, first.id, [], 'playing'), false);
});

test('evaluatePair identifies matching vs non-matching tiles', () => {
  const deck = createDeck('relaxed', 'mixed', createDeterministicRng(11), false);
  const target = deck[0];
  const twin = deck.find((t) => t.id !== target.id && t.def.pairKey === target.def.pairKey)!;
  const nonTwin = deck.find((t) => t.def.pairKey !== target.def.pairKey)!;

  const matchRes = evaluatePair(deck, target.id, twin.id);
  assert.equal(matchRes.isMatch, true);
  assert.equal(matchRes.pairDef?.pairKey, target.def.pairKey);

  const missRes = evaluatePair(deck, target.id, nonTwin.id);
  assert.equal(missRes.isMatch, false);
  assert.equal(missRes.pairDef, null);
});

test('computeMatchScore scales positively with consecutive streak', () => {
  assert.equal(computeMatchScore(1), 100);
  assert.equal(computeMatchScore(2), 135);
  assert.equal(computeMatchScore(3), 170);
});

test('findHintPair returns two unmatched hidden tiles of the same pairKey', () => {
  const deck = createDeck('relaxed', 'mixed', createDeterministicRng(15), false);
  const hint = findHintPair(deck);
  assert.ok(hint !== null);
  const t1 = deck.find((t) => t.id === hint![0])!;
  const t2 = deck.find((t) => t.id === hint![1])!;
  assert.notEqual(t1.id, t2.id);
  assert.equal(t1.def.pairKey, t2.def.pairKey);

  // When all tiles are matched, findHintPair returns null
  for (const t of deck) t.isMatched = true;
  assert.equal(findHintPair(deck), null);
});

test('accuracy, star ratings, and clock formatting produce clean numbers', () => {
  assert.equal(calculateAccuracy(10, 12), 83);
  assert.equal(calculateAccuracy(0, 5), 0);
  assert.equal(calculateStars(83, 1), 3);
  assert.equal(calculateStars(83, 2), 2);
  assert.equal(calculateStars(60, 0), 2);
  assert.equal(calculateStars(40, 0), 1);
  assert.equal(formatClock(0), '0:00');
  assert.equal(formatClock(65), '1:05');
});
