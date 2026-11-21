// audio.js — efek suara via WebAudio oscillator, tanpa file aset.
// Semua bunyi disintesis saat dipanggil; aman bila AudioContext tidak tersedia.

export class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    } catch {
      this.ctx = null;
    }
  }

  tone(freq, dur, type, vol, when = 0) {
    if (!this.ctx || this.muted) return;
    try {
      const t0 = this.ctx.currentTime + when;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch {
      // Suara gagal tidak boleh mematikan permainan.
    }
  }

  click() {
    this.ensure();
    this.tone(660, 0.06, 'triangle', 0.08);
  }

  ding() {
    this.ensure();
    this.tone(880, 0.18, 'sine', 0.16);
    this.tone(1318, 0.28, 'sine', 0.12, 0.09);
  }

  buzz() {
    this.ensure();
    this.tone(140, 0.22, 'sawtooth', 0.1);
  }

  hint() {
    this.ensure();
    this.tone(520, 0.12, 'sine', 0.1);
    this.tone(780, 0.16, 'sine', 0.1, 0.1);
  }

  win() {
    this.ensure();
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.14, i * 0.12));
  }
}
