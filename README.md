# Cari Bedanya — Spot the Difference

[![make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/badge.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun entries](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/entries.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun pool](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/pool.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

[View the bounty on make.fun](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Game spot-the-difference orisinal: dua gambar nyaris identik berdampingan,
temukan 7 perbedaannya di tiap level. Tiga scene orisinal yang digambar
prosedural dengan canvas 2D — **Pasar Malam**, **Taman Kota**, dan
**Pantai Senja** — tanpa library, tanpa network, main offline dari file statis.

## Cara main

Buka `game/index.html` di desktop browser, lalu:

- **Klik** perbedaan di gambar A atau B — ketemu: +100 poin, lingkaran hijau.
- Klik salah: waktu −5 detik.
- **H** = petunjuk (lingkaran kuning, −10 detik, cooldown 8 detik).
- **N** = level berikut (setelah level selesai), **R** = mulai dari awal.

Tiap level punya batas waktu sendiri (90 / 75 / 60 detik) dan makin ketat.
Selesaikan ketiga level untuk menang.

## Mode screenshot (deterministik)

- `?shot=start` — layar judul, level 1.
- `?shot=play` — tengah permainan level 1: 3 dari 7 perbedaan sudah ketemu.
- `?shot=end` — layar menang, semua level selesai.

## Struktur

- `game/index.html` — halaman permainan (canvas 1280×720).
- `game/src/main.js` — loop permainan dan mesin state.
- `game/src/scenes.js` — tiga scene orisinal, gambar prosedural.
- `game/src/differences.js` — data 7 perbedaan per scene.
- `game/src/render.js` — HUD, dua panel, marker, overlay.
- `game/src/input.js` — klik mouse + keyboard.
- `game/src/audio.js` — efek suara WebAudio (tanpa file aset).
- `game/src/timer.js` — hitung mundur per level.
- `game/src/shots.js` — mode deterministik untuk screenshot.
- `game/src/config.js` — konstanta tata letak, waktu, dan skor.
- `main.ts` — menyerahkan entry: menyalin `game/` + `screenshots/` dan
  menulis `dossier.json` via `vendor/makefun-game.ts`.
