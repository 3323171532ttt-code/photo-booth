/**
 * Subtle tactile camera sound synthesis using Web Audio API.
 * Keeps app lightweight, 100% offline, and low-latency.
 */

class RetroSoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Mechanical shutter sound: spring tension release + double aperture blade click.
   */
  playShutter() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. First blade click
    this.createClick(now, 1200, 0.025, 0.25);
    // 2. Spring vibration / release
    this.createSpringThump(now + 0.015, 140, 0.08, 0.3);
    // 3. Second blade closure
    this.createClick(now + 0.085, 950, 0.03, 0.22);
  }

  /**
   * Instant camera film ejection motor hum / whirr (subtle, 1.2s)
   */
  playMotorEject() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Motor sound: low square/sawtooth with slight pitch drop
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(105, now + 1.2);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(380, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  /**
   * Countdown beep for 3, 2, 1
   */
  playCountdownBeep(isFinal: boolean = false) {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const freq = isFinal ? 1320 : 880;
    const duration = isFinal ? 0.25 : 0.08;

    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  /**
   * Tactile button switch click
   */
  playTap() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    this.createClick(ctx.currentTime, 750, 0.015, 0.08);
  }

  private createClick(time: number, freq: number, duration: number, volume: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(120, time + duration);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  private createSpringThump(time: number, freq: number, duration: number, volume: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + duration);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }
}

export const soundFX = new RetroSoundFX();
