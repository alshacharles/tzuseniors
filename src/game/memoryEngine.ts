import { MAHJONG_TILES, RUMMY_TILES } from './catalog';
import {
  BoardTile,
  DeckMode,
  DifficultyConfig,
  DifficultyId,
  GamePhase,
  TileDefinition,
} from './types';

export const DIFFICULTIES: Record<DifficultyId, DifficultyConfig> = {
  relaxed: {
    id: 'relaxed',
    label: 'Relaxed',
    tag: '4×4 · 8 Pairs',
    cols: 4,
    rows: 4,
    pairs: 8,
    previewSeconds: 5,
    hintsAllowed: 3,
  },
  medium: {
    id: 'medium',
    label: 'Medium 50+',
    tag: '5×4 · 10 Pairs',
    cols: 5,
    rows: 4,
    pairs: 10,
    previewSeconds: 3.5,
    hintsAllowed: 3,
  },
  sharp: {
    id: 'sharp',
    label: 'Sharp Mind',
    tag: '6×4 · 12 Pairs',
    cols: 6,
    rows: 4,
    pairs: 12,
    previewSeconds: 2.5,
    hintsAllowed: 2,
  },
};

export function shuffleArray<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function selectPairDefinitions(
  pairCount: number,
  deckMode: DeckMode,
  rng: () => number = Math.random
): TileDefinition[] {
  if (deckMode === 'mahjong') {
    return shuffleArray(MAHJONG_TILES, rng).slice(0, pairCount);
  }
  if (deckMode === 'rummy') {
    return shuffleArray(RUMMY_TILES, rng).slice(0, pairCount);
  }

  // Mixed mode: balanced split of Mahjong and Rummy-O tiles
  const mahjongCount = Math.ceil(pairCount / 2);
  const rummyCount = pairCount - mahjongCount;
  const mjPick = shuffleArray(MAHJONG_TILES, rng).slice(0, mahjongCount);
  const rmPick = shuffleArray(RUMMY_TILES, rng).slice(0, rummyCount);
  return shuffleArray([...mjPick, ...rmPick], rng);
}

export function createDeck(
  difficultyId: DifficultyId,
  deckMode: DeckMode,
  rng: () => number = Math.random,
  startFaceUp: boolean = true
): BoardTile[] {
  const config = DIFFICULTIES[difficultyId];
  const defs = selectPairDefinitions(config.pairs, deckMode, rng);
  const rawPairs: TileDefinition[] = [];

  for (const def of defs) {
    rawPairs.push(def, def);
  }

  const shuffled = shuffleArray(rawPairs, rng);
  return shuffled.map((def, index) => ({
    id: `tile-${index}-${def.pairKey}`,
    index,
    def,
    isFlipped: startFaceUp,
    isMatched: false,
    isHinted: false,
  }));
}

export function canFlipTile(
  tiles: BoardTile[],
  tileId: string,
  selectedIds: string[],
  phase: GamePhase
): boolean {
  if (phase !== 'playing') return false;
  if (selectedIds.length >= 2) return false;
  const target = tiles.find((t) => t.id === tileId);
  if (!target) return false;
  if (target.isMatched || target.isFlipped) return false;
  if (selectedIds.includes(tileId)) return false;
  return true;
}

export function evaluatePair(
  tiles: BoardTile[],
  firstId: string,
  secondId: string
): { isMatch: boolean; pairDef: TileDefinition | null } {
  const first = tiles.find((t) => t.id === firstId);
  const second = tiles.find((t) => t.id === secondId);
  if (!first || !second || first.id === second.id) {
    return { isMatch: false, pairDef: null };
  }
  const isMatch = first.def.pairKey === second.def.pairKey;
  return {
    isMatch,
    pairDef: isMatch ? first.def : null,
  };
}

export function computeMatchScore(newStreak: number): number {
  const safeStreak = Math.max(1, newStreak);
  return 100 + (safeStreak - 1) * 35;
}

export function findHintPair(tiles: BoardTile[]): [string, string] | null {
  const byPair = new Map<string, BoardTile[]>();
  for (const tile of tiles) {
    if (tile.isMatched || tile.isFlipped) continue;
    const list = byPair.get(tile.def.pairKey) ?? [];
    list.push(tile);
    byPair.set(tile.def.pairKey, list);
  }

  for (const pair of byPair.values()) {
    if (pair.length === 2) {
      return [pair[0].id, pair[1].id];
    }
  }
  return null;
}

export function calculateAccuracy(matchedPairs: number, moves: number): number {
  if (moves <= 0 || matchedPairs <= 0) return 0;
  return Math.min(100, Math.round((matchedPairs / moves) * 100));
}

export function calculateStars(accuracy: number, hintsUsed: number): 1 | 2 | 3 {
  if (accuracy >= 75 && hintsUsed <= 1) return 3;
  if (accuracy >= 55) return 2;
  return 1;
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
