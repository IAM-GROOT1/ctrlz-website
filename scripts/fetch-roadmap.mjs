#!/usr/bin/env node
/**
 * Fetches ROADMAP.md from the app repository at build time and caches the parsed source in
 * src/data/roadmap.json.
 *
 * - Never fails the build: on any error the previously cached file is kept, so the site keeps
 *   showing the last successful copy.
 * - If there is no cache at all, it writes an empty document and the page renders an empty state.
 * - No secrets are involved or written to disk.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const REPO = 'IAM-GROOT1/ctrlz';
const BRANCH = 'main';
const SOURCE_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/ROADMAP.md`;
const OUT_FILE = fileURLToPath(new URL('../src/data/roadmap.json', import.meta.url));
const TIMEOUT_MS = 10_000;
const ATTEMPTS = 3;

/** Matches the section lines the app repository writes, e.g. `- [x] **1. Title** - done`. */
const SECTION_LINE = /^-\s+\[[ xX]\]\s+\*\*\d+\.\s*[^*]+?\*\*/;

async function readCache() {
  try {
    const raw = await readFile(OUT_FILE, 'utf8');
    // A byte-order mark makes JSON.parse throw, which would silently discard a good cache. Strip it
    // so an editor that adds one cannot break the fallback.
    const parsed = JSON.parse(raw.replace(/^\uFEFF/, ''));
    if (typeof parsed?.markdown === 'string') return parsed;
    return null;
  } catch {
    return null;
  }
}

async function fetchMarkdown(attempt = 1) {
  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        Accept: 'text/plain',
        'User-Agent': 'ctrlz.download build',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const markdown = await response.text();
    if (!markdown.trim()) throw new Error('empty response');

    // Guard against a valid HTTP response that is not the roadmap (for example an error page):
    // only replace the cache when the document really contains section lines.
    if (!markdown.split(/\r?\n/).some((line) => SECTION_LINE.test(line.trim()))) {
      throw new Error('no roadmap sections found');
    }

    return markdown;
  } catch (error) {
    if (attempt < ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      return fetchMarkdown(attempt + 1);
    }
    throw error;
  }
}

async function main() {
  const cache = await readCache();

  try {
    const markdown = await fetchMarkdown();
    await writeFile(
      OUT_FILE,
      `${JSON.stringify({ source: 'github', fetchedAt: new Date().toISOString(), markdown }, null, 2)}\n`,
      'utf8',
    );
    console.log(`Fetched ROADMAP.md from ${REPO}@${BRANCH}.`);
    return;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    if (cache) {
      console.warn(`Roadmap fetch failed (${reason}); keeping the cached copy.`);
      return;
    }

    // Nothing cached yet: write an empty document so the page can render its empty state.
    await writeFile(
      OUT_FILE,
      `${JSON.stringify({ source: 'empty', fetchedAt: null, markdown: '' }, null, 2)}\n`,
      'utf8',
    );
    console.warn(`Roadmap fetch failed (${reason}) and no cache exists; writing an empty roadmap.`);
  }
}

await main();
