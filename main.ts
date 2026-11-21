// main.ts — menyerahkan entry ke make.fun.
// Menyalin game/ dan screenshots/ dari repo ke direktori output, lalu menulis
// /output/dossier.json lewat buildDossier dari vendor/makefun-game.ts.
// Node 22, standard library saja, tanpa network. Deterministik: dua run
// berturut-turut menghasilkan byte yang sama.

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

console.log(`wrote ${join(outDir, 'dossier.json')} (${dossier.length} bytes)`);
