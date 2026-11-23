// Gentle C-major / A-minor pentatonic parlor progression (Hz)
const MELODY_PATTERN: (number | null)[] = [
  523.25, 659.25, 783.99, 659.25, 587.33, 659.25, null, 523.25,
  440.0, 523.25, 659.25, 523.25, 587.33, 523.25, 440.0, null,
  349.23, 440.0, 523.25, 659.25, 587.33, 523.25, 440.0, null,
  392.0, 493.88, 587.33, 659.25, 587.33, 493.88, 392.0, null,
];

const BASS_PATTERN: (number | null)[] = [
  261.63, null, null, null, null, null, null, null,
  220.0, null, null, null, null, null, null, null,
  174.61, null, null, null, null, null, null, null,
  196.0, null, null, null, null, null, null, null,
];

class ParlorAudio {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private musicEnabled: boolean = true;
  private musicActive: boolean = false;
  private musicTimer: number | null = null;
  private stepIndex: number = 0;

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopMusicLoop();
    } else if (this.musicActive && this.musicEnabled) {
      this.startMusicLoop();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusicLoop();
    } else if (this.musicActive && !this.muted) {
      this.startMusicLoop();
    }
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public startMusic() {
    this.musicActive = true;
    if (!this.muted && this.musicEnabled) {
      this.startMusicLoop();
    }
  }

  public pauseMusic() {
    this.stopMusicLoop();
  }

  public resumeMusic() {
    if (this.musicActive && this.musicEnabled && !this.muted) {
      this.startMusicLoop();
    }
  }

  public stopMusic() {
    this.musicActive = false;
    this.stopMusicLoop();
  }

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private startMusicLoop() {
    if (this.musicTimer !== null || typeof window === 'undefined') return;
    this.ensureContext();
    this.tickMusicStep();
    this.musicTimer = window.setInterval(() => {
      this.tickMusicStep();
    }, 440);
  }

  private stopMusicLoop() {
    if (this.musicTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private tickMusicStep() {
    if (this.muted || !this.musicEnabled || !this.musicActive) return;
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running') return;

    const idx = this.stepIndex % MELODY_PATTERN.length;
    this.stepIndex += 1;

    const melodyFreq = MELODY_PATTERN[idx];
    const bassFreq = BASS_PATTERN[idx];

    if (melodyFreq) {
      this.playTone(melodyFreq, 0.42, 'sine', 0.028);
    }
    if (bassFreq) {
      this.playTone(bassFreq, 1.65, 'triangle', 0.02);
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    delay: number = 0
  ) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playFlip() {
    const pitchJitter = 0.94 + Math.random() * 0.12;
    this.playTone(460 * pitchJitter, 0.075, 'triangle', 0.12);
    this.playTone(230 * pitchJitter, 0.045, 'sine', 0.08, 0.01);
  }

  public playMatch(streak: number) {
    const semitoneOffset = Math.min(streak - 1, 5);
    const ratio = Math.pow(2, semitoneOffset / 12);
    this.playTone(523.25 * ratio, 0.16, 'sine', 0.15, 0);
    this.playTone(659.25 * ratio, 0.24, 'triangle', 0.16, 0.075);
  }

  public playMismatch() {
    this.playTone(240, 0.12, 'sine', 0.08, 0);
    this.playTone(196, 0.14, 'sine', 0.07, 0.06);
  }

  public playHint() {
    this.playTone(783.99, 0.16, 'sine', 0.1, 0);
    this.playTone(987.77, 0.22, 'sine', 0.1, 0.08);
  }

  public playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      this.playTone(freq, 0.34, 'triangle', 0.14, i * 0.09);
    });
  }
}

export const parlorAudio = new ParlorAudio();
