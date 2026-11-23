import React from 'react';
import { Play, Settings, Trophy } from 'lucide-react';
import { ACHIEVEMENTS } from '../game/achievements';
import { DIFFICULTIES } from '../game/memoryEngine';
import { BestRecord, DeckMode, DifficultyId } from '../game/types';
import { MahjongTileArt } from './MahjongTileArt';
import { RummyTileArt } from './RummyTileArt';

interface TitleScreenProps {
  deckMode: DeckMode;
  difficulty: DifficultyId;
  bestRecord: BestRecord;
  unlockedCount: number;
  onSelectDeckMode: (mode: DeckMode) => void;
  onSelectDifficulty: (diff: DifficultyId) => void;
  onOpenSettings: () => void;
  onOpenAchievements: () => void;
  onStart: () => void;
}

const DECK_OPTIONS: { id: DeckMode; label: string }[] = [
  { id: 'mixed', label: 'Mixed Parlor' },
  { id: 'mahjong', label: 'Mahjong' },
  { id: 'rummy', label: 'Rummy-O' },
];

const DIFF_ORDER: DifficultyId[] = ['relaxed', 'medium', 'sharp'];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  deckMode,
  difficulty,
  bestRecord,
  unlockedCount,
  onSelectDeckMode,
  onSelectDifficulty,
  onOpenSettings,
  onOpenAchievements,
  onStart,
}) => {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#16615B] text-[#FAF5E8] flex flex-col justify-between">
      {/* Warm sunlit turquoise tabletop radial depth */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 72% 45%, rgba(77, 182, 172, 0.35) 0%, rgba(20, 83, 78, 0.92) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Main Split Stage */}
      <div className="relative z-10 flex-1 w-full max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Region: Calm Negative Space + Title Lockup + Controls */}
        <section className="lg:col-span-6 flex flex-col items-start gap-6">
          {/* Bespoke Inline SVG Title Lockup */}
          <div className="flex flex-col gap-3">
            <svg
              viewBox="0 0 420 94"
              className="w-full max-w-[390px] h-auto"
              role="img"
              aria-label="Sunlit Parlor"
            >
              {/* Emblem Twin Tiles */}
              <g transform="translate(4, 10)">
                <g transform="rotate(-8 18 29)">
                  <rect
                    x="0"
                    y="6"
                    width="36"
                    height="46"
                    rx="6"
                    fill="#FDF6E2"
                    stroke="#D9C38A"
                    strokeWidth="2"
                  />
                  <text
                    x="18"
                    y="36"
                    textAnchor="middle"
                    fontSize="20"
                    fontWeight="800"
                    fill="#15803D"
                    fontFamily="serif"
                  >
                    發
                  </text>
                </g>
                <g transform="rotate(6 42 33)">
                  <rect
                    x="24"
                    y="10"
                    width="36"
                    height="46"
                    rx="6"
                    fill="#FFFDF7"
                    stroke="#D9C38A"
                    strokeWidth="2"
                  />
                  <text
                    x="42"
                    y="42"
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="800"
                    fill="#C81E1E"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    7
                  </text>
                </g>
              </g>

              {/* Title Wordmark */}
              <text
                x="78"
                y="48"
                fontSize="44"
                fontWeight="700"
                fill="#FFFDF5"
                fontFamily="Fraunces, Georgia, serif"
                letterSpacing="-0.5"
              >
                Sunlit Parlor
              </text>
              <line
                x1="80"
                y1="62"
                x2="346"
                y2="62"
                stroke="#FCD34D"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <text
                x="80"
                y="82"
                fontSize="14.5"
                fontWeight="700"
                fill="#D4F0EC"
                fontFamily="Plus Jakarta Sans, sans-serif"
                letterSpacing="1.6"
              >
                MAHJONG &amp; RUMMY-O MEMORY
              </text>
            </svg>

            <p className="text-base sm:text-lg text-[#E2F5F2] max-w-md leading-relaxed">
              Peek at the sunlit tiles, remember their spots, and pair classic Mahjong carvings with crisp Rummy-O numbers at your own pace.
            </p>
          </div>

          {/* Setup Controls */}
          <div className="w-full max-w-md flex flex-col gap-4 pt-1">
            {/* Tile Set Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B6E6DF]">
                Tile Set
              </span>
              <div
                className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-[#0E433F] border border-[#247A73]"
                role="group"
                aria-label="Tile Set"
              >
                {DECK_OPTIONS.map((opt) => {
                  const active = deckMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onSelectDeckMode(opt.id)}
                      aria-pressed={active}
                      className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                        active
                          ? 'bg-[#FDF6E2] text-[#0F2926] shadow-sm'
                          : 'text-[#D4F0EC] hover:bg-[#165953]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B6E6DF]">
                Difficulty
              </span>
              <div
                className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-[#0E433F] border border-[#247A73]"
                role="group"
                aria-label="Difficulty"
              >
                {DIFF_ORDER.map((id) => {
                  const cfg = DIFFICULTIES[id];
                  const active = difficulty === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onSelectDifficulty(id)}
                      aria-pressed={active}
                      className={`min-h-[52px] px-2.5 py-2 rounded-lg flex flex-col items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                        active
                          ? 'bg-[#FDF6E2] text-[#0F2926] shadow-sm'
                          : 'text-[#D4F0EC] hover:bg-[#165953]'
                      }`}
                    >
                      <span className="text-sm font-extrabold whitespace-nowrap">
                        {cfg.label}
                      </span>
                      <span
                        className={`text-[11px] font-semibold whitespace-nowrap ${
                          active ? 'text-[#285E57]' : 'text-[#9AD8D0]'
                        }`}
                      >
                        {cfg.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Start CTA & Secondary Actions (3 menu actions max) */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                data-start="true"
                onClick={onStart}
                className="min-h-[54px] px-7 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] active:translate-y-0.5 text-[#0F2926] text-lg font-extrabold tracking-tight shadow-lg border-b-4 border-[#B45309] flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
              >
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                <span>Start Game</span>
              </button>

              <button
                type="button"
                onClick={onOpenAchievements}
                className="min-h-[54px] px-4 py-3 rounded-xl bg-[#0E433F] hover:bg-[#165953] border border-[#2C887F] text-[#FAF5E8] text-sm sm:text-base font-bold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Trophy className="w-4 h-4 text-amber-300" aria-hidden="true" />
                <span className="tabular-nums">
                  Achievements ({unlockedCount}/{ACHIEVEMENTS.length})
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                aria-label="Table Settings"
                className="min-h-[54px] px-4 py-3 rounded-xl bg-[#0E433F] hover:bg-[#165953] border border-[#2C887F] text-[#FAF5E8] text-sm sm:text-base font-bold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Settings className="w-4 h-4 text-amber-300" aria-hidden="true" />
                <span>Settings</span>
              </button>
            </div>

            {/* Quiet Unboxed Personal Best Metadata */}
            {bestRecord.gamesWon > 0 && (
              <div className="text-sm font-semibold text-[#C8EFEA] tabular-nums flex flex-wrap items-center gap-2 pt-1">
                <span>Best Score: {bestRecord.bestScore.toLocaleString()}</span>
                <span aria-hidden="true">·</span>
                <span>Best Accuracy: {bestRecord.bestAccuracy}%</span>
                <span aria-hidden="true">·</span>
                <span>
                  {bestRecord.gamesWon} {bestRecord.gamesWon === 1 ? 'Table' : 'Tables'} Won
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Right Region: User's Reference Tabletop Photo + Interactive Specimen Tiles */}
        <section
          className="lg:col-span-6 relative flex items-center justify-center"
          aria-label="Mahjong and Rummy-O Tile Preview"
        >
          <div className="relative w-full max-w-[600px] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#3C9E95] shadow-2xl bg-[#104A45]">
            <img
              src="/assets/aistudio/images_5d244121.jpg"
              alt="Classic ivory Mahjong tiles on a sunlit turquoise parlor table"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0D3D39]/80 via-transparent to-transparent"
              aria-hidden="true"
            />

            {/* Specimen Fanned Tiles showing both Mahjong & Rummy-O styles */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div className="flex items-end gap-2.5">
                <div className="w-16 sm:w-20 aspect-[4/5] rounded-lg bg-[#FDF6E2] border-2 border-[#E6D5A7] border-b-4 border-b-[#CDB67E] shadow-xl p-0.5 -rotate-3">
                  <MahjongTileArt kind="bamboo-1" />
                </div>
                <div className="w-16 sm:w-20 aspect-[4/5] rounded-lg bg-[#FDF6E2] border-2 border-[#E6D5A7] border-b-4 border-b-[#CDB67E] shadow-xl p-0.5 rotate-2">
                  <RummyTileArt suit="red" value={7} />
                </div>
                <div className="w-16 sm:w-20 aspect-[4/5] rounded-lg bg-[#FDF6E2] border-2 border-[#E6D5A7] border-b-4 border-b-[#CDB67E] shadow-xl p-0.5 -rotate-2 hidden sm:block">
                  <MahjongTileArt kind="circle-8" />
                </div>
                <div className="w-16 sm:w-20 aspect-[4/5] rounded-lg bg-[#FDF6E2] border-2 border-[#E6D5A7] border-b-4 border-b-[#CDB67E] shadow-xl p-0.5 rotate-3">
                  <RummyTileArt suit="joker" />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#F5EFE0] tracking-wide text-right">
                {DIFFICULTIES[difficulty].pairs} Pairs · {DIFFICULTIES[difficulty].previewSeconds}s Peek
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Single Flat Control Hint Line */}
      <footer className="relative z-10 w-full px-6 pb-4 pt-1 text-center">
        <p className="text-xs sm:text-sm font-medium text-[#AEE3DC]">
          Click or Tap Tiles to Match · Arrow Keys + Enter · H Hint · P Pause · M Sound
        </p>
      </footer>
    </main>
  );
};
