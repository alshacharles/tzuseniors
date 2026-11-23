import React, { useEffect } from 'react';
import { Check, Music, Settings, Volume2, VolumeX, X } from 'lucide-react';
import { TILE_BACK_LIST } from '../game/tileThemes';
import { TileBackId } from '../game/types';
import { TileBackArt } from './TileBackArt';

interface SettingsModalProps {
  tileBack: TileBackId;
  musicEnabled: boolean;
  muted: boolean;
  onSelectTileBack: (id: TileBackId) => void;
  onToggleMusic: () => void;
  onToggleMute: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  tileBack,
  musicEnabled,
  muted,
  onSelectTileBack,
  onToggleMusic,
  onToggleMute,
  onClose,
}) => {
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
      aria-labelledby="settings-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-2xl bg-[#FAF5E8] text-[#0F2926] border-2 border-[#D9C38A] border-b-[6px] border-b-[#BCA264] shadow-2xl p-6 sm:p-7 animate-gentle-pop flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EFE6CE] border border-[#D4C295] flex items-center justify-center shrink-0">
              <Settings className="w-6 h-6 text-[#16615B]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                Table Settings
              </h2>
              <p className="text-sm font-semibold text-[#3B625D]">
                Customize your tile back design and parlor audio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className="w-10 h-10 rounded-xl border border-[#D4C295] hover:bg-[#EFE6CE] flex items-center justify-center shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <X className="w-5 h-5 text-[#284D48]" aria-hidden="true" />
          </button>
        </div>

        {/* Tile Back Design Picker */}
        <section className="flex flex-col gap-2.5" aria-labelledby="tile-back-heading">
          <h3
            id="tile-back-heading"
            className="text-xs font-bold uppercase tracking-wider text-[#496964]"
          >
            Tile Back Design
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-labelledby="tile-back-heading">
            {TILE_BACK_LIST.map((theme) => {
              const selected = tileBack === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  data-testid={`tile-back-option-${theme.id}`}
                  onClick={() => onSelectTileBack(theme.id)}
                  className={`rounded-xl p-3.5 border-2 text-left flex items-center gap-3.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 ${
                    selected
                      ? 'bg-[#FDFBF4] border-[#16615B] shadow-md'
                      : 'bg-[#F2E9D0]/80 border-[#DFCFA7] hover:bg-[#F7F0DC]'
                  }`}
                >
                  {/* Live miniature tile back specimen */}
                  <div
                    className="w-12 aspect-[4/5] rounded-lg border-2 border-b-4 shadow-sm flex items-center justify-center p-1 shrink-0"
                    style={{
                      backgroundColor: theme.outerBg,
                      borderColor: theme.border,
                      borderBottomColor: theme.bottomLip,
                    }}
                    aria-hidden="true"
                  >
                    <div
                      className="w-full h-full rounded border flex items-center justify-center"
                      style={{
                        backgroundColor: theme.innerBg,
                        borderColor: theme.innerBorder,
                      }}
                    >
                      <TileBackArt themeId={theme.id} />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-extrabold text-[#0F2926]">
                        {theme.name}
                      </span>
                      {selected && (
                        <span className="w-5 h-5 rounded-full bg-[#16615B] text-white flex items-center justify-center shrink-0" aria-hidden="true">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-[#3B625D] leading-snug">
                      {theme.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Audio Toggles */}
        <section className="flex flex-col gap-2.5" aria-labelledby="audio-prefs-heading">
          <h3
            id="audio-prefs-heading"
            className="text-xs font-bold uppercase tracking-wider text-[#496964]"
          >
            Parlor Audio
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onToggleMusic}
              aria-pressed={musicEnabled}
              className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#F2E9D0] hover:bg-[#EADEC0] border border-[#DFCFA7] flex items-center justify-between gap-3 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-[#0F2926]">
                <Music className="w-4 h-4 text-[#16615B]" aria-hidden="true" />
                <span>Background Music</span>
              </span>
              <span
                className={`text-xs font-extrabold uppercase tracking-wider ${
                  musicEnabled ? 'text-[#15803D]' : 'text-[#6D6249]'
                }`}
              >
                {musicEnabled ? 'On' : 'Off'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              aria-pressed={!muted}
              className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#F2E9D0] hover:bg-[#EADEC0] border border-[#DFCFA7] flex items-center justify-between gap-3 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-[#0F2926]">
                {muted ? (
                  <VolumeX className="w-4 h-4 text-[#B45309]" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#16615B]" aria-hidden="true" />
                )}
                <span>Master Sound</span>
              </span>
              <span
                className={`text-xs font-extrabold uppercase tracking-wider ${
                  !muted ? 'text-[#15803D]' : 'text-[#B45309]'
                }`}
              >
                {!muted ? 'On' : 'Muted'}
              </span>
            </button>
          </div>
        </section>

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
