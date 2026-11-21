// shots.js — mode deterministik untuk screenshot.
// ?shot=start  : layar judul, level 1, belum ada yang ketemu.
// ?shot=play   : sedang main level 1, 3 dari 7 perbedaan sudah ketemu (Sisa: 4).
// ?shot=end    : layar menang, semua level selesai, skor penuh.
// Di mode shot, timer dibekukan dan waktu render dipatok supaya tiap run sama.

import { LEVELS, SCORE } from './config.js';
import { DIFFERENCES } from './differences.js';
import { LevelTimer } from './timer.js';

export function isShotMode() {
  return new URLSearchParams(window.location.search).has('shot');
}

export function shotName() {
  return new URLSearchParams(window.location.search).get('shot') || '';
}

/** Level dari param `scene` (?shot=play&scene=park), atau 0 bila tidak ada. */
export function shotLevel() {
  const scene = new URLSearchParams(window.location.search).get('scene') || '';
  const idx = LEVELS.findIndex((l) => l.scene === scene);
  return idx >= 0 ? idx : 0;
}

/** Terapkan satu shot ke state baru. Mengembalikan state yang siap dirender. */
export function applyShot(shot) {
  const level = shotLevel();
  if (shot === 'start') {
    return {
      screen: 'title',
      level,
      found: new Set(),
      score: 0,
      timer: new LevelTimer(LEVELS[level].time),
      hintDiff: null,
      hintUntil: 0,
      wrongAt: null,
      message: 'Selamat datang di Cari Bedanya!',
      frozen: true,
    };
  }
  if (shot === 'end') {
    return {
      screen: 'win',
      level: 2,
      found: new Set(DIFFERENCES.beach.map((d) => d.id)),
      score: 7 * SCORE.found * 3 + SCORE.levelClearBonus * 3,
      timer: new LevelTimer(LEVELS[2].time),
      hintDiff: null,
      hintUntil: 0,
      wrongAt: null,
      message: 'Semua perbedaan ketemu!',
      frozen: true,
    };
  }
  // Default: 'play' — tengah permainan, 3 ketemu, 4 tersisa.
  // Scene mengikuti param `scene` (?shot=play&scene=park), default market.
  const sceneId = LEVELS[level].scene;
  const found = new Set(DIFFERENCES[sceneId].slice(0, 3).map((d) => d.id));
  const timer = new LevelTimer(LEVELS[level].time);
  timer.left = 62;
  return {
    screen: 'play',
    level,
    found,
    score: 3 * SCORE.found,
    timer,
    hintDiff: null,
    hintUntil: 0,
    wrongAt: null,
    message: 'Bagus! 3 ketemu — masih ada 4 lagi. Cari yang tersembunyi!',
    frozen: true,
  };
}
