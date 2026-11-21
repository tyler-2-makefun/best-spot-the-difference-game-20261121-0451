// timer.js — hitung mundur per level.
// Berjalan dari detik, dikurangi lewat tick(dt) tiap frame dan penalti.

export class LevelTimer {
  constructor(seconds) {
    this.total = seconds;
    this.left = seconds;
  }

  tick(dtSeconds) {
    this.left = Math.max(0, this.left - dtSeconds);
  }

  penalize(seconds) {
    this.left = Math.max(0, this.left - seconds);
  }

  get done() {
    return this.left <= 0;
  }

  /** 0..1, sisa waktu terhadap total. */
  get fraction() {
    return this.total > 0 ? this.left / this.total : 0;
  }

  /** "M:SS" untuk HUD. */
  get text() {
    const s = Math.ceil(this.left);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }
}
