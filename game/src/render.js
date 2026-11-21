// render.js — menggambar seluruh layar: HUD, dua panel, marker, overlay.
// Semua gambar lewat canvas 2D; tidak ada aset luar.

import { CANVAS, COLORS, HUD, LEVELS, PANEL } from './config.js';
import { DIFFERENCES } from './differences.js';
import { SCENE_NAMES, drawScene } from './scenes.js';

function text(ctx, s, x, y, size, color, align = 'left', weight = 'bold') {
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

function panelFrame(ctx, x, label) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x - 4, PANEL.y - 4, PANEL.w + 8, PANEL.h + 8, 10);
  ctx.fillStyle = COLORS.frame;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLORS.panelBorder;
  ctx.stroke();
  ctx.restore();
  text(ctx, label, x + 10, PANEL.y - 22, 18, COLORS.muted, 'left');
}

function foundMarker(ctx, x, y, r, t) {
  const pulse = 1 + 0.12 * Math.sin(t / 180);
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.found;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(61, 220, 95, 0.25)';
  ctx.fill();
  // Centang.
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y);
  ctx.lineTo(x - r * 0.1, y + r * 0.35);
  ctx.lineTo(x + r * 0.5, y - r * 0.35);
  ctx.strokeStyle = COLORS.found;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

function hintMarker(ctx, x, y, r, t) {
  const pulse = 1 + 0.25 * Math.sin(t / 120);
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.hint;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}

function wrongMark(ctx, x, y, ageMs) {
  const alpha = Math.max(0, 1 - ageMs / 600);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 14);
  ctx.lineTo(x + 14, y + 14);
  ctx.moveTo(x + 14, y - 14);
  ctx.lineTo(x - 14, y + 14);
  ctx.strokeStyle = COLORS.wrong;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

function overlay(ctx, title, lines, accent) {
  ctx.save();
  ctx.fillStyle = 'rgba(10, 8, 18, 0.72)';
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
  text(ctx, title, CANVAS.w / 2, 280, 54, accent, 'center');
  let y = 350;
  for (const ln of lines) {
    text(ctx, ln, CANVAS.w / 2, y, 22, COLORS.text, 'center', 'normal');
    y += 36;
  }
  ctx.restore();
}

/** Gambar seluruh state ke canvas. `now` dalam ms (untuk animasi pulse). */
export function render(ctx, state, now) {
  const level = LEVELS[state.level];
  const sceneId = level.scene;
  const diffs = DIFFERENCES[sceneId];
  const remaining = diffs.length - state.found.size;

  // Latar.
  ctx.fillStyle = COLORS.page;
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);

  // HUD atas.
  text(ctx, 'CARI BEDANYA', 20, HUD.titleY, 34, COLORS.title);
  text(ctx, `Level ${state.level + 1}/3 — ${SCENE_NAMES[sceneId]}`, 20, HUD.metaY, 20, COLORS.muted, 'left', 'normal');
  text(ctx, `Sisa: ${remaining}`, 660, HUD.titleY, 30, remaining === 0 ? COLORS.found : COLORS.text, 'left');
  text(ctx, `Skor: ${state.score}`, 900, HUD.titleY, 26, COLORS.text, 'left');
  text(ctx, `Waktu: ${state.timer.text}`, 1080, HUD.titleY, 26, state.timer.fraction > 0.5 ? COLORS.timerGood : state.timer.fraction > 0.25 ? COLORS.timerWarn : COLORS.timerBad, 'left');
  // Bar waktu.
  ctx.fillStyle = '#332a4a';
  ctx.fillRect(660, 78, 600, 10);
  ctx.fillStyle = state.timer.fraction > 0.5 ? COLORS.timerGood : state.timer.fraction > 0.25 ? COLORS.timerWarn : COLORS.timerBad;
  ctx.fillRect(660, 78, 600 * state.timer.fraction, 10);

  // Dua panel.
  panelFrame(ctx, PANEL.leftX, 'A — gambar asli');
  panelFrame(ctx, PANEL.rightX, 'B — ada 7 perbedaan');

  ctx.save();
  ctx.beginPath();
  ctx.rect(PANEL.leftX, PANEL.y, PANEL.w, PANEL.h);
  ctx.clip();
  ctx.translate(PANEL.leftX, PANEL.y);
  drawScene(ctx, sceneId, new Set());
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(PANEL.rightX, PANEL.y, PANEL.w, PANEL.h);
  ctx.clip();
  ctx.translate(PANEL.rightX, PANEL.y);
  drawScene(ctx, sceneId, new Set(diffs.map((d) => d.id)));
  ctx.restore();

  // Marker perbedaan yang sudah ketemu — di kedua panel.
  for (const d of diffs) {
    if (!state.found.has(d.id)) continue;
    foundMarker(ctx, PANEL.leftX + d.x, PANEL.y + d.y, d.r + 4, now);
    foundMarker(ctx, PANEL.rightX + d.x, PANEL.y + d.y, d.r + 4, now);
  }

  // Marker hint (sementara) — di kedua panel.
  if (state.hintDiff && now < state.hintUntil) {
    hintMarker(ctx, PANEL.leftX + state.hintDiff.x, PANEL.y + state.hintDiff.y, state.hintDiff.r + 8, now);
    hintMarker(ctx, PANEL.rightX + state.hintDiff.x, PANEL.y + state.hintDiff.y, state.hintDiff.r + 8, now);
  }

  // Tanda X klik salah.
  if (state.wrongAt) {
    wrongMark(ctx, state.wrongAt.x, state.wrongAt.y, now - state.wrongAt.t);
  }

  // Bar bawah: pesan + bantuan tombol.
  text(ctx, state.message, 20, HUD.bottomY, 22, COLORS.text, 'left', 'normal');
  text(ctx, 'Klik perbedaan  •  H = petunjuk (−10 dtk)  •  R = ulang  •  N = level berikut', 20, HUD.bottomY + 34, 17, COLORS.muted, 'left', 'normal');
  const dots = diffs.map((d) => (state.found.has(d.id) ? '●' : '○')).join(' ');
  text(ctx, dots, 1260, HUD.bottomY, 22, COLORS.found, 'right');
  text(ctx, `Level ${state.level + 1}/3`, 1260, HUD.bottomY + 34, 17, COLORS.muted, 'right', 'normal');

  // Overlay sesuai layar.
  if (state.screen === 'title') {
    overlay(ctx, 'CARI BEDANYA', [
      'Dua gambar nyaris sama — temukan 7 perbedaannya!',
      'Klik perbedaannya di gambar A atau B. Klik salah: −5 detik.',
      'Tiga level: Pasar Malam, Taman Kota, Pantai Senja.',
      '',
      'Klik di mana saja untuk mulai  •  H = petunjuk',
    ], COLORS.title);
  } else if (state.screen === 'clear') {
    overlay(ctx, 'LEVEL SELESAI!', [
      `Semua 7 perbedaan ketemu. Bonus +${250}.`,
      'Tekan N atau klik untuk level berikut.',
    ], COLORS.found);
  } else if (state.screen === 'win') {
    overlay(ctx, 'KAMU MENANG!', [
      `Semua 21 perbedaan ketemu. Skor akhir: ${state.score}.`,
      'Tekan R untuk main lagi.',
    ], COLORS.title);
  } else if (state.screen === 'over') {
    overlay(ctx, 'WAKTU HABIS', [
      `Kamu menemukan ${state.found.size} dari 7 perbedaan di level ini.`,
      'Tekan R untuk coba lagi.',
    ], COLORS.wrong);
  }
}
