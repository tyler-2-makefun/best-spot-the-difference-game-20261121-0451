// scenes.js — tiga scene orisinal, digambar prosedural dengan canvas 2D.
// Tiap scene digambar dua kali: panel kiri tanpa perbedaan, panel kanan dengan
// semua perbedaan aktif. `diffs` adalah Set id perbedaan yang sedang aktif.
// Ruang gambar tiap scene: 600x440.

export const SCENE_NAMES = {
  market: 'Pasar Malam',
  park: 'Taman Kota',
  beach: 'Pantai Senja',
};

// ---- util gambar -----------------------------------------------------------

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function rr(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function star4(ctx, x, y, r, fill) {
  poly(ctx, [
    [x, y - r],
    [x + r * 0.28, y - r * 0.28],
    [x + r, y],
    [x + r * 0.28, y + r * 0.28],
    [x, y + r],
    [x - r * 0.28, y + r * 0.28],
    [x - r, y],
    [x - r * 0.28, y - r * 0.28],
  ], fill);
}

function skyGradient(ctx, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, 440);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 440);
}

function starField(ctx, seed, n, yMax) {
  const rnd = mulberry32(seed);
  for (let i = 0; i < n; i++) {
    const x = 10 + rnd() * 580;
    const y = 8 + rnd() * yMax;
    const r = 0.8 + rnd() * 1.6;
    ctx.globalAlpha = 0.4 + rnd() * 0.6;
    circle(ctx, x, y, r, '#ffffff');
  }
  ctx.globalAlpha = 1;
}

// ---- scene 1: Pasar Malam --------------------------------------------------

function drawMarket(ctx, diffs) {
  skyGradient(ctx, [[0, '#171744'], [0.6, '#3c2560'], [1, '#5b2f6e']]);
  starField(ctx, 11, 46, 190);

  // Bulan: purnama di kiri, sabit di kanan (perbedaan 'moon').
  circle(ctx, 520, 62, 30, '#ffeeb0');
  circle(ctx, 512, 58, 8, '#f5d97e');
  circle(ctx, 530, 70, 5, '#f5d97e');
  if (diffs.has('moon')) circle(ctx, 534, 50, 26, '#3c2560');

  // Bintang ekstra (perbedaan 'star'): hanya di panel kanan.
  if (diffs.has('star')) {
    star4(ctx, 92, 74, 13, '#ffe066');
    circle(ctx, 92, 74, 3, '#fff7cc');
  }

  // Lampu gantung dua baris.
  for (const [y0, sag] of [[18, 26], [52, 22]]) {
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.quadraticCurveTo(300, y0 + sag, 600, y0);
    ctx.strokeStyle = '#241a33';
    ctx.lineWidth = 2;
    ctx.stroke();
    const bulbColors = ['#ffd94d', '#ff7b7b', '#7be0a3', '#7bb8ff'];
    for (let i = 0; i < 11; i++) {
      const x = 28 + i * 55;
      const t = x / 600;
      const y = y0 + 2 * sag * t * (1 - t) + 6;
      circle(ctx, x, y, 6, bulbColors[i % 4]);
      circle(ctx, x, y, 9, bulbColors[i % 4]);
      ctx.globalAlpha = 0.18;
      ctx.globalAlpha = 1;
    }
  }

  // Jalan.
  rect(ctx, 0, 348, 600, 92, '#241f2e');
  const rnd = mulberry32(7);
  for (let i = 0; i < 26; i++) {
    circle(ctx, rnd() * 600, 356 + rnd() * 76, 2, '#3a3247');
  }

  // ---- Los kiri: buah-buahan, pedagang bertopi.
  rect(ctx, 44, 150, 8, 200, '#5a3a22');
  rect(ctx, 208, 150, 8, 200, '#5a3a22');
  // Tenda garis merah-putih.
  for (let i = 0; i < 5; i++) {
    poly(ctx, [[44 + i * 36, 150], [80 + i * 36, 150], [72 + i * 36, 178], [52 + i * 36, 178]], i % 2 === 0 ? '#d33f3f' : '#f2ead8');
  }
  rect(ctx, 40, 178, 180, 8, '#7a4a2a');
  // Meja + keranjang apel.
  rr(ctx, 52, 300, 156, 48, 6, '#8a5a32');
  rr(ctx, 60, 282, 62, 24, 8, '#a06a3a');
  for (const [ax, ay] of [[72, 276], [86, 270], [100, 276], [79, 282], [93, 282]]) circle(ctx, ax, ay, 7, '#e04040');
  // Keranjang jeruk (perbedaan 'basket'): hilang di panel kanan.
  if (!diffs.has('basket')) {
    rr(ctx, 140, 282, 62, 24, 8, '#a06a3a');
    for (const [ox, oy] of [[152, 276], [166, 270], [180, 276], [159, 282], [173, 282]]) circle(ctx, ox, oy, 7, '#ff8c1a');
  }
  // Pedagang.
  circle(ctx, 152, 218, 20, '#f2c89b');
  rect(ctx, 132, 238, 40, 62, '#3f7d5a');
  // Topi (perbedaan 'hat'): biru di kiri, kuning di kanan.
  poly(ctx, [[128, 202], [176, 202], [164, 182], [140, 182]], diffs.has('hat') ? '#ffd94d' : '#3a6fd8');
  rect(ctx, 124, 198, 56, 6, diffs.has('hat') ? '#e0a92a' : '#2a55a8');

  // ---- Los tengah: lampion dan guci.
  rect(ctx, 258, 160, 8, 190, '#5a3a22');
  rect(ctx, 388, 160, 8, 190, '#5a3a22');
  for (let i = 0; i < 5; i++) {
    poly(ctx, [[258 + i * 28, 160], [286 + i * 28, 160], [280 + i * 28, 184], [264 + i * 28, 184]], i % 2 === 0 ? '#e0a92a' : '#f2ead8');
  }
  rect(ctx, 254, 184, 142, 8, '#7a4a2a');
  rr(ctx, 266, 300, 118, 48, 6, '#8a5a32');
  // Tiga lampion gantung; yang tengah berubah warna (perbedaan 'lantern').
  for (const [lx, col] of [[288, '#ff5a5a'], [318, diffs.has('lantern') ? '#3ddc5f' : '#ff5a5a'], [352, '#ff8c1a']]) {
    line(ctx, lx, 192, lx, 210, '#241a33', 2);
    ellipse(ctx, lx, 224, 12, 16, col);
    rect(ctx, lx - 5, 206, 10, 5, '#e0a92a');
    rect(ctx, lx - 5, 238, 10, 5, '#e0a92a');
  }
  // Guci di meja.
  ellipse(ctx, 292, 288, 12, 16, '#7bb8ff');
  ellipse(ctx, 340, 288, 12, 16, '#b07be0');

  // ---- Los kanan: bunga dan kucing di peti.
  rect(ctx, 436, 150, 8, 200, '#5a3a22');
  rect(ctx, 576, 150, 8, 200, '#5a3a22');
  // Tenda hijau-putih (perbedaan 'awning'): 5 garis di kiri, 4 di kanan.
  const stripes = diffs.has('awning') ? 4 : 5;
  for (let i = 0; i < stripes; i++) {
    const w = 148 / stripes;
    poly(ctx, [[436 + i * w, 150], [436 + (i + 1) * w, 150], [436 + (i + 1) * w - 6, 178], [436 + i * w + 6, 178]], i % 2 === 0 ? '#3f9e5a' : '#f2ead8');
  }
  rect(ctx, 432, 178, 152, 8, '#7a4a2a');
  rr(ctx, 444, 300, 140, 48, 6, '#8a5a32');
  // Pot bunga.
  for (const [px, col] of [[462, '#ff7bb8'], [500, '#ffd94d'], [538, '#ff8c1a']]) {
    poly(ctx, [[px - 10, 296], [px + 10, 296], [px + 7, 312], [px - 7, 312]], '#b05a2a');
    circle(ctx, px, 286, 8, col);
    circle(ctx, px - 7, 290, 6, col);
    circle(ctx, px + 7, 290, 6, col);
  }
  // Kucing di atas peti (perbedaan 'cat'): ekor ke atas / ke bawah.
  rr(ctx, 500, 336, 62, 16, 4, '#7a5a3a');
  ellipse(ctx, 528, 322, 20, 12, '#f2a541');
  circle(ctx, 512, 310, 10, '#f2a541');
  poly(ctx, [[506, 302], [510, 290], [514, 301]], '#f2a541');
  poly(ctx, [[516, 301], [520, 290], [524, 302]], '#f2a541');
  ctx.beginPath();
  if (diffs.has('cat')) {
    ctx.moveTo(546, 322);
    ctx.quadraticCurveTo(560, 330, 556, 344);
  } else {
    ctx.moveTo(546, 318);
    ctx.quadraticCurveTo(560, 306, 566, 296);
  }
  ctx.strokeStyle = '#f2a541';
  ctx.lineWidth = 5;
  ctx.stroke();
}

// ---- scene 2: Taman Kota ----------------------------------------------------

function drawPark(ctx, diffs) {
  skyGradient(ctx, [[0, '#8ec9ee'], [0.6, '#cfeefb'], [1, '#e8f7d8']]);
  // Matahari (perbedaan 'sunrays'): 8 sinar di kiri, 5 di kanan.
  const rays = diffs.has('sunrays') ? 5 : 8;
  ctx.save();
  ctx.translate(82, 72);
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    line(ctx, Math.cos(a) * 34, Math.sin(a) * 34, Math.cos(a) * 48, Math.sin(a) * 48, '#f5b81e', 4);
  }
  ctx.restore();
  circle(ctx, 82, 72, 30, '#ffd94d');
  circle(ctx, 74, 66, 6, '#f5b81e');
  circle(ctx, 90, 78, 5, '#f5b81e');

  // Awan (perbedaan 'cloud'): gumpalan ekstra di awan kanan.
  const cloud = (x, y, extra) => {
    ellipse(ctx, x, y, 34, 16, '#ffffff');
    ellipse(ctx, x - 22, y + 4, 22, 12, '#ffffff');
    ellipse(ctx, x + 22, y + 4, 22, 12, '#ffffff');
    if (extra) ellipse(ctx, x + 40, y - 6, 16, 10, '#ffffff');
  };
  cloud(250, 58, false);
  cloud(452, 62, diffs.has('cloud'));

  // Burung di langit.
  ctx.strokeStyle = '#3a4a5a';
  ctx.lineWidth = 2;
  for (const [bx, by] of [[180, 110], [210, 96], [520, 150]]) {
    ctx.beginPath();
    ctx.arc(bx - 6, by, 6, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(bx + 6, by, 6, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // Rumput dan jalan setapak.
  rect(ctx, 0, 300, 600, 140, '#5da24a');
  const rnd = mulberry32(23);
  for (let i = 0; i < 30; i++) {
    line(ctx, rnd() * 600, 306 + rnd() * 128, rnd() * 600 + 4, 300 + rnd() * 134, '#4a8a3c', 2);
  }
  ctx.beginPath();
  ctx.moveTo(270, 440);
  ctx.quadraticCurveTo(300, 360, 330, 300);
  ctx.lineTo(370, 300);
  ctx.quadraticCurveTo(340, 370, 330, 440);
  ctx.closePath();
  ctx.fillStyle = '#d8cbb0';
  ctx.fill();

  // Pohon besar kiri dengan apel (perbedaan 'apple'): 4 vs 3.
  rect(ctx, 108, 210, 22, 96, '#7a4a2a');
  circle(ctx, 118, 170, 62, '#3f8a3c');
  circle(ctx, 78, 196, 42, '#4a9a44');
  circle(ctx, 160, 196, 42, '#4a9a44');
  const apples = diffs.has('apple')
    ? [[96, 168], [140, 150], [158, 190]]
    : [[96, 168], [140, 150], [158, 190], [120, 196]];
  for (const [ax, ay] of apples) circle(ctx, ax, ay, 7, '#e04040');

  // Pohon kecil kanan.
  rect(ctx, 478, 220, 18, 86, '#7a4a2a');
  circle(ctx, 486, 186, 48, '#4a9a44');
  circle(ctx, 452, 210, 30, '#3f8a3c');

  // Air mancur tengah.
  ellipse(ctx, 300, 330, 86, 26, '#b8d8e8');
  ellipse(ctx, 300, 326, 72, 20, '#7bb8dd');
  rect(ctx, 292, 250, 16, 70, '#c8c0b0');
  ellipse(ctx, 300, 246, 26, 10, '#c8c0b0');
  ctx.strokeStyle = '#9fd4ef';
  ctx.lineWidth = 4;
  for (const dx of [-30, -12, 12, 30]) {
    ctx.beginPath();
    ctx.moveTo(300, 244);
    ctx.quadraticCurveTo(300 + dx, 200, 300 + dx * 1.4, 170 + Math.abs(dx) * 0.4);
    ctx.stroke();
  }
  // Burung di bibir air mancur (perbedaan 'bird'): ada / hilang.
  if (!diffs.has('bird')) {
    ellipse(ctx, 300, 138, 12, 8, '#5a7a9a');
    circle(ctx, 310, 132, 6, '#5a7a9a');
    poly(ctx, [[314, 130], [320, 132], [314, 134]], '#e0a92a');
    line(ctx, 296, 146, 296, 152, '#5a7a9a', 2);
    line(ctx, 304, 146, 304, 152, '#5a7a9a', 2);
  }

  // Bangku (perbedaan 'bench'): 3 papan di kiri, 2 di kanan.
  rect(ctx, 420, 320, 8, 46, '#5a3a22');
  rect(ctx, 508, 320, 8, 46, '#5a3a22');
  const slats = diffs.has('bench') ? [322, 344] : [318, 334, 350];
  for (const sy of slats) rect(ctx, 414, sy, 108, 10, '#8a5a32');
  rect(ctx, 414, 358, 108, 8, '#8a5a32');

  // Petak tulip (perbedaan 'flower'): satu tulip merah / ungu.
  for (const [fx, col] of [[120, '#ff5a7a'], [152, diffs.has('flower') ? '#9a5ae0' : '#e04040'], [184, '#ff8c1a'], [216, '#ff5a7a']]) {
    line(ctx, fx, 372, fx, 398, '#3f8a3c', 3);
    ellipse(ctx, fx, 364, 8, 11, col);
  }

  // Anjing (perbedaan 'dogspot'): bercak di badan ada / hilang.
  ellipse(ctx, 212, 362, 30, 18, '#c89a6a');
  circle(ctx, 238, 348, 13, '#c89a6a');
  poly(ctx, [[232, 338], [236, 326], [242, 338]], '#a87a4a');
  circle(ctx, 242, 344, 2, '#241a33');
  if (!diffs.has('dogspot')) ellipse(ctx, 206, 358, 12, 8, '#7a4a2a');
  line(ctx, 190, 376, 190, 388, '#c89a6a', 5);
  line(ctx, 232, 376, 232, 388, '#c89a6a', 5);
  ctx.beginPath();
  ctx.moveTo(184, 356);
  ctx.quadraticCurveTo(172, 348, 174, 336);
  ctx.strokeStyle = '#c89a6a';
  ctx.lineWidth = 5;
  ctx.stroke();
}

// ---- scene 3: Pantai Senja --------------------------------------------------

function drawBeach(ctx, diffs) {
  skyGradient(ctx, [[0, '#ff9a5a'], [0.45, '#ff7b8a'], [0.75, '#b06ab0'], [1, '#6a4a9a']]);
  // Matahari terbenam.
  circle(ctx, 300, 150, 44, '#ffd94d');
  circle(ctx, 300, 150, 56, '#ffd94d');
  ctx.globalAlpha = 0.25;
  ctx.globalAlpha = 1;
  // Burung jauh.
  ctx.strokeStyle = '#5a3a5a';
  ctx.lineWidth = 2;
  for (const [bx, by] of [[120, 90], [150, 76], [470, 100]]) {
    ctx.beginPath();
    ctx.arc(bx - 6, by, 6, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(bx + 6, by, 6, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // Laut.
  rect(ctx, 0, 200, 600, 130, '#4a6ab0');
  rect(ctx, 0, 200, 600, 10, '#7a9ad8');
  // Pantulan matahari.
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 5; i++) {
    rect(ctx, 280 + i * 4, 210 + i * 18, 40 - i * 6, 6, '#ffd94d');
  }
  ctx.globalAlpha = 1;
  // Ombak (perbedaan 'wave'): garis ekstra di kanan.
  ctx.strokeStyle = '#d8e8ff';
  ctx.lineWidth = 3;
  for (const [wx, wy, wl] of [[60, 250, 90], [400, 240, 110], [180, 300, 100], [450, 300, 90]]) {
    ctx.beginPath();
    ctx.arc(wx, wy, wl / 2, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  if (diffs.has('wave')) {
    ctx.beginPath();
    ctx.arc(332, 282, 34, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // Pasir.
  rect(ctx, 0, 330, 600, 110, '#e8c88a');
  const rnd = mulberry32(41);
  for (let i = 0; i < 24; i++) {
    circle(ctx, rnd() * 600, 340 + rnd() * 90, 2, '#d8b87a');
  }

  // Perahu (perbedaan 'sail'): layar putih / kuning.
  poly(ctx, [[120, 210], [190, 210], [176, 226], [134, 226]], '#8a4a2a');
  line(ctx, 152, 210, 152, 150, '#5a3a22', 4);
  poly(ctx, [[152, 152], [152, 206], [196, 206]], diffs.has('sail') ? '#ffd94d' : '#f2ead8');
  poly(ctx, [[148, 160], [148, 206], [118, 206]], '#e07b5a');

  // Payung pantai (perbedaan 'umbrella'): 6 garis / 5 garis.
  line(ctx, 432, 208, 432, 320, '#7a5a3a', 5);
  const ustripes = diffs.has('umbrella') ? 5 : 6;
  for (let i = 0; i < ustripes; i++) {
    const a0 = Math.PI + (i / ustripes) * Math.PI;
    const a1 = Math.PI + ((i + 1) / ustripes) * Math.PI;
    ctx.beginPath();
    ctx.moveTo(432, 208);
    ctx.arc(432, 208, 62, a0, a1);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? '#e04040' : '#f2ead8';
    ctx.fill();
  }
  circle(ctx, 432, 208, 5, '#e0a92a');
  // Handuk di bawah payung.
  rr(ctx, 396, 330, 74, 16, 4, '#7bb8ff');
  line(ctx, 410, 330, 410, 346, '#ffffff', 3);
  line(ctx, 448, 330, 448, 346, '#ffffff', 3);

  // Istana pasir + bendera (perbedaan 'flag'): merah / biru.
  rr(ctx, 352, 356, 60, 42, 4, '#e8c88a');
  rr(ctx, 344, 372, 18, 26, 4, '#e8c88a');
  rr(ctx, 402, 372, 18, 26, 4, '#e8c88a');
  poly(ctx, [[352, 356], [382, 330], [412, 356]], '#d8b87a');
  line(ctx, 382, 330, 382, 306, '#5a3a22', 3);
  poly(ctx, [[382, 306], [402, 312], [382, 318]], diffs.has('flag') ? '#3a6fd8' : '#e04040');

  // Palem (perbedaan 'coconut'): 3 kelapa / 2 kelapa.
  ctx.beginPath();
  ctx.moveTo(522, 330);
  ctx.quadraticCurveTo(512, 220, 530, 140);
  ctx.strokeStyle = '#7a5a3a';
  ctx.lineWidth = 12;
  ctx.stroke();
  ctx.strokeStyle = '#3f8a3c';
  ctx.lineWidth = 8;
  for (const [fx, fy, tx, ty] of [[530, 140, 470, 110], [530, 140, 590, 110], [530, 140, 480, 160], [530, 140, 580, 160], [530, 140, 530, 96]]) {
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.quadraticCurveTo((fx + tx) / 2, fy - 14, tx, ty);
    ctx.stroke();
  }
  const nuts = diffs.has('coconut') ? [[524, 148], [540, 150]] : [[524, 148], [540, 150], [532, 158]];
  for (const [nx, ny] of nuts) circle(ctx, nx, ny, 7, '#6a4a2a');

  // Kerang (perbedaan 'shell'): ada / hilang.
  if (!diffs.has('shell')) {
    ctx.beginPath();
    ctx.arc(252, 388, 12, Math.PI, 0);
    ctx.closePath();
    ctx.fillStyle = '#ff9ac0';
    ctx.fill();
    line(ctx, 244, 388, 244, 380, '#e07ba0', 2);
    line(ctx, 252, 388, 252, 378, '#e07ba0', 2);
    line(ctx, 260, 388, 260, 380, '#e07ba0', 2);
  }

  // Bintang laut (perbedaan 'starfish'): ada / hilang.
  if (!diffs.has('starfish')) {
    star4(ctx, 122, 396, 14, '#ff7b5a');
    circle(ctx, 122, 396, 4, '#e05a3a');
  }

  // Ember dan sekop.
  poly(ctx, [[90, 350], [110, 350], [106, 372], [94, 372]], '#e04040');
  line(ctx, 96, 350, 104, 338, '#8a4a2a', 3);
}

// ---- dispatcher --------------------------------------------------------------

/** Gambar satu scene ke ctx pada (0,0)-(600,440). */
export function drawScene(ctx, sceneId, diffs) {
  ctx.save();
  if (sceneId === 'market') drawMarket(ctx, diffs);
  else if (sceneId === 'park') drawPark(ctx, diffs);
  else drawBeach(ctx, diffs);
  ctx.restore();
}
