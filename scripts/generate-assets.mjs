#!/usr/bin/env node
/**
 * Generates the favicon set from the app's brand mark.
 * Run with: pnpm assets
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const SOURCE = 'src/assets/brand/mark-1024.png';
const OUTPUT = 'public';

const png = (size) =>
  sharp(SOURCE)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({
      compressionLevel: 9,
      palette: size <= 64,
    });

/** Windows .ico containing PNG-compressed frames (supported since Vista). */
function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + frames.length * 16;
  const entries = frames.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...frames.map((frame) => frame.data)]);
}

await mkdir(OUTPUT, { recursive: true });

const targets = [
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
];

for (const [size, name] of targets) {
  await png(size).toFile(`${OUTPUT}/${name}`);
  console.log(`wrote ${OUTPUT}/${name}`);
}

const frames = await Promise.all(
  [32, 48].map(async (size) => ({ size, data: await png(size).toBuffer() })),
);
await writeFile(`${OUTPUT}/favicon.ico`, buildIco(frames));
console.log(`wrote ${OUTPUT}/favicon.ico`);
