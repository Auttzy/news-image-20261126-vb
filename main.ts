// The Thursday Ledger, version B — "THE WORLD IN ONE DAY" edition.
// A news-image entry (Node 22, standard library only). The image is the
// entry.png beside this file: one 1024x1024 broadsheet summing up Thursday
// 26 November 2026 in 36 dated stories across 7 regions. This program
// validates the PNG and copies it, byte for byte, to /output/entry.png.
// It uses no network and is deterministic: every run writes the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1_048_576; // the gate allows at most 1 MiB

// CRC-32 (IEEE 802.3, polynomial 0xEDB88320), the checksum PNG chunks use.
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buf) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// Walk every PNG chunk, checking each stored CRC, and return the IHDR size.
function validatePng(png: Buffer): { width: number; height: number } {
  if (png.length < 8 || !png.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('entry.png is not a PNG: bad signature');
  }
  if (png.length > MAX_BYTES) {
    throw new Error(`entry.png is ${png.length} bytes, over the 1 MiB limit`);
  }
  let offset = 8;
  let width = 0;
  let height = 0;
  let seenIhdr = false;
  while (offset + 8 <= png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.subarray(offset + 4, offset + 8).toString('latin1');
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const crcStart = dataEnd;
    if (dataEnd + 4 > png.length) throw new Error(`PNG chunk ${type} is truncated`);
    const storedCrc = png.readUInt32BE(crcStart);
    const actualCrc = crc32(png.subarray(offset + 4, dataEnd));
    if (storedCrc !== actualCrc) {
      throw new Error(`PNG chunk ${type} has a bad CRC (stored ${storedCrc}, computed ${actualCrc})`);
    }
    if (type === 'IHDR') {
      seenIhdr = true;
      width = png.readUInt32BE(dataStart);
      height = png.readUInt32BE(dataStart + 4);
      if (width > 1024 || height > 1024) {
        throw new Error(`image is ${width}x${height}, over the 1024x1024 limit`);
      }
    }
    if (type === 'IEND') {
      if (!seenIhdr) throw new Error('PNG has an IEND chunk but no IHDR chunk');
      // IEND trailer guard: the file must end exactly on the IEND chunk —
      // 12 bytes: length 0, type "IEND", CRC 0xAE426082. Anything after it
      // (or a short file) means trailing garbage the gate would reject.
      const trailer = png.subarray(png.length - 12);
      const iendCrc = crc32(Buffer.from('IEND', 'latin1'));
      if (
        crcStart + 4 !== png.length ||
        trailer.readUInt32BE(0) !== 0 ||
        trailer.subarray(4, 8).toString('latin1') !== 'IEND' ||
        trailer.readUInt32BE(8) !== iendCrc
      ) {
        throw new Error('PNG does not end exactly on its IEND trailer chunk');
      }
      return { width, height };
    }
    offset = crcStart + 4;
  }
  throw new Error('PNG ends without an IEND chunk');
}

const repoDir = dirname(fileURLToPath(import.meta.url));
const source = join(repoDir, 'entry.png');
const png = readFileSync(source);
const { width, height } = validatePng(png);
const sha256 = createHash('sha256').update(png).digest('hex');

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.png');
writeFileSync(outPath, png);

console.log(`entry.png: ${width}x${height}, ${png.length} bytes, sha256 ${sha256} -> ${outPath}`);
