// config.js — konstanta permainan Cari Bedanya.
// Satu-satunya sumber angka-angka tata letak, waktu, dan skor.

export const CANVAS = { w: 1280, h: 720 };

export const PANEL = {
  w: 600,
  h: 440,
  y: 140,
  leftX: 20,
  rightX: 660,
};

export const HUD = {
  titleY: 52,
  metaY: 92,
  bottomY: 604,
};

export const LEVELS = [
  { scene: 'market', name: 'Pasar Malam', time: 90 },
  { scene: 'park', name: 'Taman Kota', time: 75 },
  { scene: 'beach', name: 'Pantai Senja', time: 60 },
];

export const SCORE = {
  found: 100,
  levelClearBonus: 250,
  hintCost: 50,
};

export const PENALTY = {
  wrongClickSeconds: 5,
  hintSeconds: 10,
};

export const HINT_COOLDOWN_MS = 8000;
export const HINT_SHOW_MS = 2500;

export const COLORS = {
  page: '#14101f',
  frame: '#2c2440',
  panelBorder: '#f5c542',
  title: '#ffd94d',
  text: '#f2ead8',
  muted: '#b8aed0',
  found: '#3ddc5f',
  hint: '#ffd94d',
  wrong: '#ff4d4d',
  timerGood: '#3ddc5f',
  timerWarn: '#ffb020',
  timerBad: '#ff4d4d',
};
