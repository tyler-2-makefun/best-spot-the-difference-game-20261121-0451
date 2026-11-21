// input.js — klik mouse di kedua panel + keyboard.
// Mengubah klik layar menjadi koordinat scene (600x440) per panel.

import { PANEL } from './config.js';

/** Panel mana yang kena klik: 'left' | 'right' | null, plus koordinat scene. */
export function panelHit(canvasX, canvasY) {
  if (canvasY < PANEL.y || canvasY > PANEL.y + PANEL.h) return null;
  if (canvasX >= PANEL.leftX && canvasX <= PANEL.leftX + PANEL.w) {
    return { side: 'left', x: canvasX - PANEL.leftX, y: canvasY - PANEL.y };
  }
  if (canvasX >= PANEL.rightX && canvasX <= PANEL.rightX + PANEL.w) {
    return { side: 'right', x: canvasX - PANEL.rightX, y: canvasY - PANEL.y };
  }
  return null;
}

export class Input {
  constructor(canvas, handlers) {
    this.canvas = canvas;
    this.handlers = handlers;
    canvas.addEventListener('pointerdown', (e) => this.onPointer(e));
    window.addEventListener('keydown', (e) => this.onKey(e));
  }

  onPointer(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * this.canvas.height;
    this.handlers.click(x, y);
  }

  onKey(e) {
    const k = e.key.toLowerCase();
    if (k === 'h') this.handlers.hint();
    else if (k === 'n') this.handlers.next();
    else if (k === 'r') this.handlers.restart();
    else if (k === 'm') this.handlers.mute();
  }
}
