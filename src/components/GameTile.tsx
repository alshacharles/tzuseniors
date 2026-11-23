import React from 'react';
import { Check } from 'lucide-react';
import { getTileBackTheme } from '../game/tileThemes';
import { BoardTile, TileBackId } from '../game/types';
import { MahjongTileArt } from './MahjongTileArt';
import { RummyTileArt } from './RummyTileArt';
import { TileBackArt } from './TileBackArt';

interface GameTileProps {
  tile: BoardTile;
  tileBack?: TileBackId;
  disabled: boolean;
  onFlip: (tileId: string) => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
  onArrowNav?: (index: number, key: string) => void;
}

export const GameTile: React.FC<GameTileProps> = ({
  tile,
  tileBack = 'denim-parlor',
  disabled,
  onFlip,
  buttonRef,
  onArrowNav,
}) => {
  const isRevealed = tile.isFlipped || tile.isMatched;
  const backTheme = getTileBackTheme(tileBack);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (
      e.key === 'ArrowRight' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown'
    ) {
      e.preventDefault();
      onArrowNav?.(tile.index, e.key);
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      data-testid={`tile-${tile.index}`}
      data-pair={tile.def.pairKey}
      data-tile-back={tileBack}
      data-revealed={isRevealed ? 'true' : 'false'}
      data-matched={tile.isMatched ? 'true' : 'false'}
      disabled={disabled && !isRevealed}
      onClick={() => onFlip(tile.id)}
      onKeyDown={handleKeyDown}
      aria-label={
        tile.isMatched
          ? `${tile.def.label}, matched`
          : isRevealed
            ? `${tile.def.label}, face up`
            : `Tile ${tile.index + 1}, face down`
      }
      className={`group relative w-full aspect-[4/5] min-h-[72px] tile-perspective rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
        tile.isMatched
          ? 'cursor-default'
          : isRevealed
            ? 'cursor-default'
            : 'cursor-pointer transition-transform duration-150 ease-out hover:z-10 focus-visible:z-10 hover:-translate-y-1 hover:scale-[1.045] focus-visible:-translate-y-1 focus-visible:scale-[1.045] active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:focus-visible:translate-y-0 motion-reduce:focus-visible:scale-100'
      }`}
    >
      <div
        className={`tile-inner ${isRevealed ? 'is-flipped' : ''} ${
          tile.isMatched ? 'is-matched-pop' : ''
        }`}
      >
        {/* BACK FACE (Themed parlor tile back) */}
        <div
          className={`tile-face rounded-xl border-2 border-b-[5px] shadow-md group-hover:shadow-xl group-focus-visible:shadow-xl flex items-center justify-center p-2 transition-shadow duration-150 ${
            tile.isHinted
              ? 'ring-4 ring-amber-300/80 shadow-[0_0_18px_rgba(252,211,77,0.7)]'
              : ''
          }`}
          style={{
            backgroundColor: backTheme.outerBg,
            borderColor: tile.isHinted ? '#FCD34D' : backTheme.border,
            borderBottomColor: backTheme.bottomLip,
          }}
        >
          <div
            className="w-full h-full rounded-lg border flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: backTheme.innerBg,
              borderColor: backTheme.innerBorder,
            }}
          >
            <TileBackArt themeId={tileBack} />
          </div>
        </div>

        {/* FRONT FACE (Warm carved bone-ivory tile) */}
        <div
          className={`tile-face tile-face-front rounded-xl bg-[#FDF6E2] border-2 ${
            tile.isMatched
              ? 'border-emerald-500 ring-2 ring-emerald-400/70'
              : 'border-[#E6D5A7]'
          } border-b-[5px] border-b-[#CDB67E] shadow-md overflow-hidden flex items-center justify-center p-1`}
        >
          {tile.def.family === 'mahjong' && tile.def.mahjongKind ? (
            <MahjongTileArt kind={tile.def.mahjongKind} />
          ) : (
            <RummyTileArt
              suit={tile.def.rummySuit ?? 'red'}
              value={tile.def.rummyValue}
            />
          )}

          {tile.isMatched && (
            <span
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm"
              aria-hidden="true"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
