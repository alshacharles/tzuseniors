export type GamePhase = 'title' | 'preview' | 'playing' | 'paused' | 'gameover';

export type DeckMode = 'mixed' | 'mahjong' | 'rummy';

export type DifficultyId = 'relaxed' | 'medium' | 'sharp';

export type TileBackId = 'denim-parlor' | 'classic-wood' | 'royal-velvet' | 'vintage-slate';

export type TileFamily = 'mahjong' | 'rummy';

export type MahjongKind =
  | 'bamboo-1'
  | 'bamboo-2'
  | 'bamboo-5'
  | 'bamboo-7'
  | 'bamboo-8'
  | 'circle-2'
  | 'circle-5'
  | 'circle-8'
  | 'char-1'
  | 'char-9'
  | 'dragon-red'
  | 'dragon-green'
  | 'wind-east'
  | 'flower-plum';

export type RummySuit = 'red' | 'blue' | 'amber' | 'black' | 'joker';

export interface TileDefinition {
  pairKey: string;
  family: TileFamily;
  label: string;
  funFact: string;
  mahjongKind?: MahjongKind;
  rummySuit?: RummySuit;
  rummyValue?: number;
}

export interface BoardTile {
  id: string;
  index: number;
  def: TileDefinition;
  isFlipped: boolean;
  isMatched: boolean;
  isHinted: boolean;
}

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  tag: string;
  cols: number;
  rows: number;
  pairs: number;
  previewSeconds: number;
  hintsAllowed: number;
}

export interface BestRecord {
  bestScore: number;
  bestAccuracy: number;
  gamesWon: number;
}

export interface RoundSummary {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  accuracy: number;
  bestStreak: number;
  elapsedSeconds: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
}
