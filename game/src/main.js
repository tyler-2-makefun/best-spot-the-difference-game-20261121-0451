// main.js — loop permainan dan mesin state.
// Layar: title → play → clear → (level berikut) → win | over.
// Klik benar +100, klik salah −5 detik, petunjuk (H) −10 detik + cooldown.

import { CANVAS, HINT_COOLDOWN_MS, HINT_SHOW_MS, LEVELS, PENALTY, SCORE } from './config.js';
import { DIFFERENCES, diffAt } from './differences.js';
import { SoundFX } from './audio.js';
import { Input, panelHit } from './input.js';
import { render } from './render.js';
import { applyShot, isShotMode, shotName } from './shots.js';
import { LevelTimer } from './timer.js';

const canvas = document.getElementById('game');
canvas.width = CANVAS.w;
canvas.height = CANVAS.h;
const ctx = canvas.getContext('2d');
const sfx = new SoundFX();

function freshState(level = 0) {
  return {
    screen: 'title',
    level,
    found: new Set(),
    score: 0,
    timer: new LevelTimer(LEVELS[level].time),
    hintDiff: null,
    hintUntil: 0,
    wrongAt: null,
    message: 'Temukan 7 perbedaan di antara gambar A dan B!',
    frozen: false,
    // Detik terakhir yang sudah dibunyikan peringatan kritisnya (0 = belum ada).
    lastWarnSecond: 0,
    // Hint langsung bisa dipakai: -cooldown supaya (now - lastHintAt) >= cooldown.
    lastHintAt: -HINT_COOLDOWN_MS,
  };
}

let state = freshState(0);

function startLevel(level, keepScore = 0) {
  state = freshState(level);
  state.screen = 'play';
  state.score = keepScore;
  state.message = `Level ${level + 1}: ${LEVELS[level].name} — cari 7 perbedaan!`;
}

function onClick(x, y) {
  sfx.ensure();
  if (state.screen === 'title') {
    startLevel(0);
    sfx.click();
    return;
  }
  if (state.screen === 'clear') {
    advance();
    return;
  }
  if (state.screen === 'win' || state.screen === 'over') return;
  const hit = panelHit(x, y);
  if (!hit) return;
  const sceneId = LEVELS[state.level].scene;
  const found = diffAt(sceneId, hit.x, hit.y, state.found);
  if (found) {
    state.found.add(found.id);
    state.score += SCORE.found;
    state.wrongAt = null;
    const remaining = DIFFERENCES[sceneId].length - state.found.size;
    state.message = remaining > 0
      ? `Ketemu: ${found.label}! Sisa ${remaining} lagi.`
      : 'Semua ketemu! Hebat!';
    sfx.ding();
    if (remaining === 0) {
      state.score += SCORE.levelClearBonus;
      if (state.level >= LEVELS.length - 1) {
        state.screen = 'win';
        sfx.win();
      } else {
        state.screen = 'clear';
        sfx.win();
      }
    }
  } else {
    state.timer.penalize(PENALTY.wrongClickSeconds);
    state.wrongAt = { x, y, t: performance.now() };
    state.message = `Bukan di sana — waktu −${PENALTY.wrongClickSeconds} detik!`;
    sfx.buzz();
  }
}

function onHint(now) {
  if (state.screen !== 'play') return;
  if (now - state.lastHintAt < HINT_COOLDOWN_MS) {
    state.message = 'Petunjuk masih cooldown, tunggu sebentar.';
    return;
  }
  const sceneId = LEVELS[state.level].scene;
  const rest = DIFFERENCES[sceneId].filter((d) => !state.found.has(d.id));
  if (rest.length === 0) return;
  state.hintDiff = rest[Math.floor(Math.random() * rest.length)];
  state.hintUntil = now + HINT_SHOW_MS;
  state.lastHintAt = now;
  state.timer.penalize(PENALTY.hintSeconds);
  state.score = Math.max(0, state.score - SCORE.hintCost);
  state.message = `Petunjuk: cari di sekitar lingkaran kuning (−${PENALTY.hintSeconds} dtk).`;
  sfx.hint();
}

function advance() {
  if (state.screen !== 'clear') return;
  startLevel(state.level + 1, state.score);
  sfx.click();
}

function restart() {
  startLevel(0);
  sfx.click();
}

new Input(canvas, {
  click: onClick,
  hint: () => onHint(performance.now()),
  next: advance,
  restart,
  mute: () => {
    sfx.muted = !sfx.muted;
  },
});

// ---- loop ------------------------------------------------------------------

let last = performance.now();

function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (state.screen === 'play' && !state.frozen) {
    state.timer.tick(dt);
    if (state.timer.done) {
      state.screen = 'over';
      sfx.buzz();
    }
  }
  // Peringatan waktu kritis (sisa ≤10 detik): bingkai merah berdenyut di
  // sekeliling canvas + bunyi tik tiap detik, supaya pemain sadar waktu
  // hampir habis. Sebelumnya timer hanya berubah warna mengikuti fraksi
  // (di level pendek, 10 detik terakhir masih hijau) tanpa bunyi atau
  // sinyal lain, jadi waktu habis terasa datang tiba-tiba.
  const critical = state.screen === 'play' && !state.frozen && state.timer.left <= 10 && state.timer.left > 0;
  if (critical) {
    const sec = Math.ceil(state.timer.left);
    if (sec !== state.lastWarnSecond) {
      state.lastWarnSecond = sec;
      sfx.tone(1175, 0.09, 'square', 0.12);
    }
    const pulse = 0.45 + 0.35 * Math.sin(now / 160);
    // `outline` + offset negatif: outline digambar DI ATAS isi canvas.
    // (box-shadow luar terpotong viewport karena canvas memenuhi layar,
    // dan inset box-shadow justru tertutup bitmap canvas.)
    canvas.style.outline = `6px solid rgba(255, 77, 77, ${pulse.toFixed(3)})`;
    canvas.style.outlineOffset = '-6px';
  } else {
    state.lastWarnSecond = 0;
    canvas.style.outline = '';
    canvas.style.outlineOffset = '';
  }
  if (state.hintDiff && now > state.hintUntil) state.hintDiff = null;
  if (state.wrongAt && now - state.wrongAt.t > 600) state.wrongAt = null;
  render(ctx, state, now);
  if (!state.frozen) requestAnimationFrame(frame);
}

// Mode screenshot: render sekali dengan waktu tetap, tanpa loop.
if (isShotMode()) {
  state = applyShot(shotName());
  render(ctx, state, 1000);
  document.title = `shot:${shotName()}`;
} else {
  requestAnimationFrame(frame);
}
