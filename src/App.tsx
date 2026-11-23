import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { parlorAudio } from './audio/parlorAudio';
import { AchievementsModal } from './components/AchievementsModal';
import { GameTile } from './components/GameTile';
import { HudBar } from './components/HudBar';
import { PauseModal, VictoryModal } from './components/Modals';
import { SettingsModal } from './components/SettingsModal';
import { TitleScreen } from './components/TitleScreen';
import { AchievementDef, evaluateAchievements } from './game/achievements';
import {
  calculateAccuracy,
  calculateStars,
  canFlipTile,
  computeMatchScore,
  createDeck,
  DIFFICULTIES,
  evaluatePair,
  findHintPair,
} from './game/memoryEngine';
import { isValidTileBack } from './game/tileThemes';
import {
  BestRecord,
  BoardTile,
  DeckMode,
  DifficultyId,
  GamePhase,
  RoundSummary,
  TileBackId,
} from './game/types';

const STORAGE_KEY = 'sunlit_parlor_best_v1';
const ACHIEVEMENTS_KEY = 'sunlit_parlor_achievements_v1';
const TILE_BACK_KEY = 'sunlit_parlor_tile_back_v1';

function loadTileBack(): TileBackId {
  try {
    const raw = localStorage.getItem(TILE_BACK_KEY);
    return isValidTileBack(raw) ? raw : 'denim-parlor';
  } catch {
    return 'denim-parlor';
  }
}

function saveTileBack(id: TileBackId): void {
  try {
    localStorage.setItem(TILE_BACK_KEY, id);
  } catch {
    // Ignore storage quota errors
  }
}

function loadUnlockedAchievements(): Record<string, string> {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveUnlockedAchievements(unlocked: Record<string, string>): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
  } catch {
    // Ignore storage quota errors
  }
}

function loadBestRecord(): BestRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bestScore: 0, bestAccuracy: 0, gamesWon: 0 };
    const parsed = JSON.parse(raw) as Partial<BestRecord>;
    return {
      bestScore: typeof parsed.bestScore === 'number' ? parsed.bestScore : 0,
      bestAccuracy: typeof parsed.bestAccuracy === 'number' ? parsed.bestAccuracy : 0,
      gamesWon: typeof parsed.gamesWon === 'number' ? parsed.gamesWon : 0,
    };
  } catch {
    return { bestScore: 0, bestAccuracy: 0, gamesWon: 0 };
  }
}

function saveBestRecord(record: BestRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage quota errors
  }
}

function getInitialQueryConfig(): { autostart: boolean; difficulty: DifficultyId } {
  if (typeof window === 'undefined') {
    return { autostart: false, difficulty: 'medium' };
  }
  const params = new URLSearchParams(window.location.search);
  const autostart = params.get('autostart') === '1';
  const rawDiff = params.get('difficulty');
  const difficulty: DifficultyId =
    rawDiff === 'relaxed' || rawDiff === 'medium' || rawDiff === 'sharp'
      ? rawDiff
      : 'medium';
  return { autostart, difficulty };
}

export default function App() {
  const initialQuery = useMemo(() => getInitialQueryConfig(), []);

  const [deckMode, setDeckMode] = useState<DeckMode>('mixed');
  const [difficulty, setDifficulty] = useState<DifficultyId>(initialQuery.difficulty);
  const [phase, setPhase] = useState<GamePhase>(initialQuery.autostart ? 'preview' : 'title');
  const [tiles, setTiles] = useState<BoardTile[]>(() =>
    initialQuery.autostart ? createDeck(initialQuery.difficulty, 'mixed', Math.random, true) : []
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(DIFFICULTIES[initialQuery.difficulty].hintsAllowed);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [previewSecondsLeft, setPreviewSecondsLeft] = useState(
    DIFFICULTIES[initialQuery.difficulty].previewSeconds
  );
  const [calloutText, setCalloutText] = useState('Find matching pairs of Mahjong & Rummy-O tiles');
  const [bestRecord, setBestRecord] = useState<BestRecord>(() => loadBestRecord());
  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, string>>(() =>
    loadUnlockedAchievements()
  );
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementDef[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tileBack, setTileBack] = useState<TileBackId>(() => loadTileBack());
  const [roundSummary, setRoundSummary] = useState<RoundSummary | null>(null);

  const mismatchTimerRef = useRef<number | null>(null);
  const hintTimerRef = useRef<number | null>(null);
  const victoryTimerRef = useRef<number | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeConfig = DIFFICULTIES[difficulty];

  const clearPendingTimers = useCallback(() => {
    if (mismatchTimerRef.current !== null) {
      window.clearTimeout(mismatchTimerRef.current);
      mismatchTimerRef.current = null;
    }
    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    if (victoryTimerRef.current !== null) {
      window.clearTimeout(victoryTimerRef.current);
      victoryTimerRef.current = null;
    }
  }, []);

  // Mirror game state onto document.body.dataset.state
  useEffect(() => {
    const bodyState = phase === 'preview' ? 'playing' : phase;
    document.body.dataset.state = bodyState;
  }, [phase]);

  // Clean up timers & music on unmount
  useEffect(() => {
    return () => {
      clearPendingTimers();
      parlorAudio.stopMusic();
    };
  }, [clearPendingTimers]);

  // Keep parlor music synced with game phase
  useEffect(() => {
    if (phase === 'paused') {
      parlorAudio.pauseMusic();
    } else if (phase === 'playing' || phase === 'preview') {
      parlorAudio.resumeMusic();
    }
  }, [phase]);

  const startRound = useCallback(
    (targetDiff: DifficultyId = difficulty, targetMode: DeckMode = deckMode) => {
      clearPendingTimers();
      const cfg = DIFFICULTIES[targetDiff];
      const freshTiles = createDeck(targetDiff, targetMode, Math.random, true);
      tileRefs.current = [];
      setTiles(freshTiles);
      setSelectedIds([]);
      setIsResolving(false);
      setMoves(0);
      setMatchedPairs(0);
      setStreak(0);
      setBestStreak(0);
      setScore(0);
      setElapsedSeconds(0);
      setHintsLeft(cfg.hintsAllowed);
      setHintsUsed(0);
      setPreviewSecondsLeft(cfg.previewSeconds);
      setRoundSummary(null);
      setNewlyUnlocked([]);
      setShowAchievements(false);
      setShowSettings(false);
      setCalloutText('Find matching pairs of Mahjong & Rummy-O tiles');
      setPhase('preview');
      parlorAudio.startMusic();

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    },
    [clearPendingTimers, deckMode, difficulty]
  );

  const finishPreviewNow = useCallback(() => {
    setTiles((prev) => prev.map((t) => ({ ...t, isFlipped: false })));
    setPreviewSecondsLeft(0);
    setPhase('playing');
    parlorAudio.playFlip();
  }, []);

  // Preview countdown timer
  useEffect(() => {
    if (phase !== 'preview') return;

    const interval = window.setInterval(() => {
      setPreviewSecondsLeft((prev) => {
        if (prev <= 0.5) {
          window.clearInterval(interval);
          setTiles((curr) => curr.map((t) => ({ ...t, isFlipped: false })));
          setPhase('playing');
          return 0;
        }
        return Number((prev - 0.5).toFixed(1));
      });
    }, 500);

    return () => window.clearInterval(interval);
  }, [phase]);

  // Active gameplay elapsed clock (pauses while viewing Achievements or Settings)
  useEffect(() => {
    if (phase !== 'playing' || showAchievements || showSettings) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, showAchievements, showSettings]);

  const handleSelectTileBack = useCallback((id: TileBackId) => {
    setTileBack(id);
    saveTileBack(id);
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      parlorAudio.setMuted(next);
      return next;
    });
  }, []);

  const handleToggleMusic = useCallback(() => {
    setMusicEnabled((prev) => {
      const next = !prev;
      parlorAudio.setMusicEnabled(next);
      if (next) {
        parlorAudio.startMusic();
      }
      return next;
    });
  }, []);

  const handleHint = useCallback(() => {
    if (phase !== 'playing' || hintsLeft <= 0) return;
    const pair = findHintPair(tiles);
    if (!pair) return;

    parlorAudio.playHint();
    setHintsLeft((prev) => prev - 1);
    setHintsUsed((prev) => prev + 1);

    const hintSet = new Set(pair);
    setTiles((prev) =>
      prev.map((t) => (hintSet.has(t.id) ? { ...t, isHinted: true } : { ...t, isHinted: false }))
    );
    setCalloutText('Hint: Look closely at the glowing golden pair');

    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
    }
    hintTimerRef.current = window.setTimeout(() => {
      setTiles((prev) => prev.map((t) => (t.isHinted ? { ...t, isHinted: false } : t)));
      hintTimerRef.current = null;
    }, 1800);
  }, [hintsLeft, phase, tiles]);

  const handlePauseToggle = useCallback(() => {
    if (phase === 'playing') {
      setPhase('paused');
    } else if (phase === 'paused') {
      setPhase('playing');
    }
  }, [phase]);

  const handleFlipTile = useCallback(
    (tileId: string) => {
      if (isResolving) return;
      if (!canFlipTile(tiles, tileId, selectedIds, phase)) return;

      parlorAudio.playFlip();

      const nextSelected = [...selectedIds, tileId];
      setTiles((prev) =>
        prev.map((t) =>
          t.id === tileId ? { ...t, isFlipped: true, isHinted: false } : t
        )
      );
      setSelectedIds(nextSelected);

      if (nextSelected.length < 2) return;

      const [firstId, secondId] = nextSelected;
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      setIsResolving(true);

      const { isMatch, pairDef } = evaluatePair(tiles, firstId, secondId);

      if (isMatch && pairDef) {
        const nextStreak = streak + 1;
        const nextBestStreak = Math.max(bestStreak, nextStreak);
        const pointsEarned = computeMatchScore(nextStreak);
        const nextScore = score + pointsEarned;
        const nextMatchedPairs = matchedPairs + 1;

        parlorAudio.playMatch(nextStreak);

        setStreak(nextStreak);
        setBestStreak(nextBestStreak);
        setScore(nextScore);
        setMatchedPairs(nextMatchedPairs);
        setCalloutText(
          nextStreak >= 2
            ? `Streak ×${nextStreak}! ${pairDef.funFact} (+${pointsEarned})`
            : `Matched: ${pairDef.funFact} (+${pointsEarned})`
        );

        setTiles((prev) =>
          prev.map((t) =>
            t.id === firstId || t.id === secondId
              ? { ...t, isFlipped: true, isMatched: true, isHinted: false }
              : t
          )
        );
        setSelectedIds([]);
        setIsResolving(false);

        if (nextMatchedPairs >= activeConfig.pairs) {
          const accuracy = calculateAccuracy(nextMatchedPairs, nextMoves);
          const stars = calculateStars(accuracy, hintsUsed);
          const isNewBest = nextScore > bestRecord.bestScore;
          const updatedBest: BestRecord = {
            bestScore: Math.max(bestRecord.bestScore, nextScore),
            bestAccuracy: Math.max(bestRecord.bestAccuracy, accuracy),
            gamesWon: bestRecord.gamesWon + 1,
          };
          setBestRecord(updatedBest);
          saveBestRecord(updatedBest);

          const earned = evaluateAchievements(
            {
              hintsUsed,
              elapsedSeconds,
              bestStreak: nextBestStreak,
              accuracy,
              totalGamesWon: updatedBest.gamesWon,
            },
            unlockedAchievements
          );

          if (earned.length > 0) {
            const today = new Date().toISOString().slice(0, 10);
            const nextMap = { ...unlockedAchievements };
            for (const item of earned) {
              nextMap[item.id] = today;
            }
            setUnlockedAchievements(nextMap);
            saveUnlockedAchievements(nextMap);
          }

          const summary: RoundSummary = {
            score: nextScore,
            bestScore: updatedBest.bestScore,
            isNewBest,
            moves: nextMoves,
            matchedPairs: nextMatchedPairs,
            totalPairs: activeConfig.pairs,
            accuracy,
            bestStreak: nextBestStreak,
            elapsedSeconds,
            hintsUsed,
            stars,
          };

          victoryTimerRef.current = window.setTimeout(() => {
            parlorAudio.playVictory();
            setNewlyUnlocked(earned);
            setRoundSummary(summary);
            setPhase('gameover');
            victoryTimerRef.current = null;
          }, 420);
        }
      } else {
        setStreak(0);
        setCalloutText('Not a match yet — keep those tile spots in mind');

        mismatchTimerRef.current = window.setTimeout(() => {
          parlorAudio.playMismatch();
          setTiles((prev) =>
            prev.map((t) =>
              t.id === firstId || t.id === secondId
                ? { ...t, isFlipped: false }
                : t
            )
          );
          setSelectedIds([]);
          setIsResolving(false);
          mismatchTimerRef.current = null;
        }, 780);
      }
    },
    [
      activeConfig.pairs,
      bestRecord.bestAccuracy,
      bestRecord.bestScore,
      bestRecord.gamesWon,
      bestStreak,
      elapsedSeconds,
      hintsUsed,
      isResolving,
      matchedPairs,
      moves,
      phase,
      score,
      selectedIds,
      streak,
      tiles,
      unlockedAchievements,
    ]
  );

  // Keyboard shortcuts across Title / Preview / Playing / Paused
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isButtonFocused = target?.tagName === 'BUTTON';

      if (phase === 'title') {
        if ((e.key === 'Enter' || e.key === ' ') && !isButtonFocused) {
          e.preventDefault();
          startRound();
        }
        return;
      }

      if (phase === 'preview') {
        if ((e.key === 'Enter' || e.key === ' ') && !isButtonFocused) {
          e.preventDefault();
          finishPreviewNow();
        }
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (phase === 'playing' || phase === 'paused') {
          e.preventDefault();
          handlePauseToggle();
        }
        return;
      }

      if (phase === 'playing') {
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          handleHint();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          startRound();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [finishPreviewNow, handleHint, handlePauseToggle, handleToggleMute, phase, startRound]);

  const handleArrowNav = useCallback(
    (index: number, key: string) => {
      const cols = window.innerWidth < 640 ? 4 : activeConfig.cols;
      let nextIdx = index;
      if (key === 'ArrowRight') nextIdx = Math.min(tiles.length - 1, index + 1);
      if (key === 'ArrowLeft') nextIdx = Math.max(0, index - 1);
      if (key === 'ArrowDown') nextIdx = Math.min(tiles.length - 1, index + cols);
      if (key === 'ArrowUp') nextIdx = Math.max(0, index - cols);
      tileRefs.current[nextIdx]?.focus();
    },
    [activeConfig.cols, tiles.length]
  );

  const unlockedCount = Object.keys(unlockedAchievements).length;

  if (phase === 'title') {
    return (
      <>
        <TitleScreen
          deckMode={deckMode}
          difficulty={difficulty}
          bestRecord={bestRecord}
          unlockedCount={unlockedCount}
          onSelectDeckMode={setDeckMode}
          onSelectDifficulty={setDifficulty}
          onOpenSettings={() => setShowSettings(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onStart={() => startRound(difficulty, deckMode)}
        />
        {showAchievements && (
          <AchievementsModal
            unlockedMap={unlockedAchievements}
            onClose={() => setShowAchievements(false)}
          />
        )}
        {showSettings && (
          <SettingsModal
            tileBack={tileBack}
            musicEnabled={musicEnabled}
            muted={muted}
            onSelectTileBack={handleSelectTileBack}
            onToggleMusic={handleToggleMusic}
            onToggleMute={handleToggleMute}
            onClose={() => setShowSettings(false)}
          />
        )}
      </>
    );
  }

  // Responsive grid columns & board container sizing so all rows fit comfortably in desktop viewport
  const gridColsClass =
    activeConfig.cols === 4
      ? 'grid-cols-4 max-w-[540px]'
      : activeConfig.cols === 5
        ? 'grid-cols-4 sm:grid-cols-5 max-w-[680px]'
        : 'grid-cols-4 sm:grid-cols-6 max-w-[810px]';

  return (
    <div className="min-h-screen w-full bg-[#1B6E67] flex flex-col justify-between select-none">
      {/* Top Perimeter HUD */}
      <HudBar
        phase={phase}
        matchedPairs={matchedPairs}
        totalPairs={activeConfig.pairs}
        moves={moves}
        streak={streak}
        score={score}
        elapsedSeconds={elapsedSeconds}
        hintsLeft={hintsLeft}
        muted={muted}
        musicEnabled={musicEnabled}
        unlockedCount={unlockedCount}
        previewSecondsLeft={previewSecondsLeft}
        calloutText={calloutText}
        onFinishPreviewEarly={finishPreviewNow}
        onHint={handleHint}
        onToggleMusic={handleToggleMusic}
        onToggleMute={handleToggleMute}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenSettings={() => setShowSettings(true)}
        onPause={handlePauseToggle}
        onRestart={() => startRound(difficulty, deckMode)}
        onReturnTitle={() => {
          clearPendingTimers();
          parlorAudio.stopMusic();
          setPhase('title');
        }}
      />

      {/* Sunlit Turquoise Parlor Playfield */}
      <main
        className="relative flex-1 w-full flex flex-col items-center justify-center px-3 sm:px-6 py-4 sm:py-6"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, #39A99E 0%, #1B6E67 65%, #124C47 100%)',
        }}
      >
        <div
          className={`w-full mx-auto grid ${gridColsClass} gap-2.5 sm:gap-3.5`}
          data-testid="game-board"
        >
          {tiles.map((tile, idx) => (
            <GameTile
              key={tile.id}
              tile={tile}
              tileBack={tileBack}
              disabled={phase !== 'playing' || isResolving}
              onFlip={handleFlipTile}
              buttonRef={(el) => {
                tileRefs.current[idx] = el;
              }}
              onArrowNav={handleArrowNav}
            />
          ))}
        </div>
      </main>

      {/* Quiet Bottom Hint Strip */}
      <footer className="w-full px-4 py-2 text-center bg-[#124C47] border-t border-[#247A73]">
        <p className="text-xs font-medium text-[#AEE3DC]">
          {activeConfig.label} ({activeConfig.tag}) · Match identical Mahjong or Rummy-O tiles · Press H for Hint · P to Pause
        </p>
      </footer>

      {phase === 'paused' && (
        <PauseModal
          onResume={() => setPhase('playing')}
          onRestart={() => startRound(difficulty, deckMode)}
          onTitle={() => {
            clearPendingTimers();
            parlorAudio.stopMusic();
            setPhase('title');
          }}
        />
      )}

      {phase === 'gameover' && roundSummary && (
        <VictoryModal
          summary={roundSummary}
          difficulty={difficulty}
          newlyUnlocked={newlyUnlocked}
          onPlayAgain={() => startRound(difficulty, deckMode)}
          onNextDifficulty={
            difficulty === 'relaxed'
              ? () => {
                  setDifficulty('medium');
                  startRound('medium', deckMode);
                }
              : difficulty === 'medium'
                ? () => {
                    setDifficulty('sharp');
                    startRound('sharp', deckMode);
                  }
                : undefined
          }
          onOpenAchievements={() => setShowAchievements(true)}
          onTitle={() => {
            clearPendingTimers();
            parlorAudio.stopMusic();
            setPhase('title');
          }}
        />
      )}

      {showAchievements && (
        <AchievementsModal
          unlockedMap={unlockedAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          tileBack={tileBack}
          musicEnabled={musicEnabled}
          muted={muted}
          onSelectTileBack={handleSelectTileBack}
          onToggleMusic={handleToggleMusic}
          onToggleMute={handleToggleMute}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
