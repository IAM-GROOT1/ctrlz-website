#!/usr/bin/env node
/**
 * Checks the built site for broken internal links, missing assets and dead
 * in-page anchors. External URLs are skipped so CI never fails on someone
 * else's downtime.
 *
 * Run after `pnpm build`: node scripts/check-links.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, posix, relative } from 'node:path';

const DIST = 'dist';
const failures = [];
let checkedLinks = 0;

const isFile = (path) => {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
};

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const toRoute = (file) =>
  `/${relative(DIST, file).replace(/\\/g, '/')}`.replace(/index\.html$/, '').replace(/\/$/, '') ||
  '/';

if (!existsSync(DIST)) {
  console.error('dist/ is missing — run `pnpm build` first.');
  process.exit(1);
}

const pages = await walk(DIST);

/** Route -> set of element ids on that page. */
const idsByRoute = new Map();
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  idsByRoute.set(
    toRoute(page),
    new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])),
  );
}

function resolveRoute(pathname) {
  const clean = decodeURI(pathname).replace(/\/+$/, '') || '/';
  const candidates =
    clean === '/'
      ? [join(DIST, 'index.html')]
      : [join(DIST, clean), join(DIST, `${clean}.html`), join(DIST, clean, 'index.html')];

  for (const candidate of candidates) {
    if (isFile(candidate)) {
      return { file: candidate, route: toRoute(candidate) };
    }
  }
  return null;
}

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const pageRoute = toRoute(page);

  const attributes = [...html.matchAll(/\shref="([^"]+)"/g), ...html.matchAll(/\ssrc="([^"]+)"/g)];

  for (const match of attributes) {
    const raw = match[1].trim();
    if (
      !raw ||
      raw.startsWith('http://') ||
      raw.startsWith('https://') ||
      raw.startsWith('mailto:') ||
      raw.startsWith('data:') ||
      raw.startsWith('//')
    ) {
      continue;
    }

    checkedLinks += 1;
    const pathname = raw.startsWith('#')
      ? `${pageRoute}${raw}`
      : raw.startsWith('/')
        ? raw
        : posix.join(posix.dirname(pageRoute), raw);
    const [path, hash] = pathname.split('#');

    const resolved = resolveRoute(path.split('?')[0]);
    if (!resolved) {
      failures.push(`${pageRoute} → ${raw} (no such file)`);
      continue;
    }

    if (hash) {
      const ids = idsByRoute.get(resolved.route);
      if (ids && !ids.has(decodeURIComponent(hash))) {
        failures.push(`${pageRoute} → ${raw} (missing anchor #${hash})`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} broken link(s) out of ${checkedLinks} checked:\n`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`All ${checkedLinks} internal links resolve (${pages.length} pages).`);
