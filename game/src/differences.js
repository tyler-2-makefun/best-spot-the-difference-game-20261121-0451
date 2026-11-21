// differences.js — data perbedaan tiap scene.
// Koordinat dalam ruang scene 600x440 (sama untuk panel kiri dan kanan).
// Setiap perbedaan punya id, posisi, radius klik, dan label yang ramah dibaca.

export const DIFFERENCES = {
  market: [
    { id: 'moon', x: 520, y: 62, r: 30, label: 'Bulan sabit' },
    { id: 'lantern', x: 318, y: 168, r: 22, label: 'Warna lampion' },
    { id: 'basket', x: 118, y: 316, r: 26, label: 'Keranjang jeruk' },
    { id: 'awning', x: 486, y: 138, r: 24, label: 'Garis tenda' },
    { id: 'hat', x: 152, y: 196, r: 22, label: 'Warna topi pedagang' },
    { id: 'star', x: 92, y: 74, r: 16, label: 'Bintang ekstra' },
    { id: 'cat', x: 528, y: 344, r: 24, label: 'Ekor kucing' },
  ],
  park: [
    { id: 'sunrays', x: 82, y: 72, r: 32, label: 'Sinar matahari' },
    { id: 'flower', x: 152, y: 372, r: 20, label: 'Warna tulip' },
    { id: 'bird', x: 300, y: 148, r: 20, label: 'Burung di air mancur' },
    { id: 'bench', x: 438, y: 330, r: 24, label: 'Papan bangku' },
    { id: 'apple', x: 478, y: 128, r: 20, label: 'Apel di pohon' },
    { id: 'dogspot', x: 212, y: 362, r: 22, label: 'Bercak anjing' },
    { id: 'cloud', x: 452, y: 62, r: 26, label: 'Bentuk awan' },
  ],
  beach: [
    { id: 'sail', x: 152, y: 178, r: 28, label: 'Warna layar' },
    { id: 'umbrella', x: 432, y: 208, r: 28, label: 'Garis payung' },
    { id: 'shell', x: 252, y: 388, r: 18, label: 'Kerang di pasir' },
    { id: 'coconut', x: 522, y: 122, r: 20, label: 'Kelapa di palem' },
    { id: 'wave', x: 332, y: 282, r: 24, label: 'Ombak ekstra' },
    { id: 'starfish', x: 122, y: 396, r: 20, label: 'Bintang laut' },
    { id: 'flag', x: 382, y: 336, r: 20, label: 'Warna bendera' },
  ],
};

/** Semua id perbedaan untuk satu scene, sebagai Set (dipakai panel kanan). */
export function allDiffIds(sceneId) {
  return new Set(DIFFERENCES[sceneId].map((d) => d.id));
}

/** Perbedaan yang belum ketemu di (x, y) ruang scene, atau null. */
export function diffAt(sceneId, x, y, foundIds) {
  for (const d of DIFFERENCES[sceneId]) {
    if (foundIds.has(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return d;
  }
  return null;
}
