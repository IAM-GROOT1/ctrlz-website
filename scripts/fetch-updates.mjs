#!/usr/bin/env node
/**
 * Lists the changes merged into the app's main branch since its latest release, for the
 * "In progress" part of the changelog, and caches them in src/data/updates.json.
 *
 * - Runs after fetch-releases.mjs and reads the latest release from its cache.
 * - Never fails the build: on any error the previous cache is kept (marked as cached).
 * - Only public data: pull request numbers, titles, links and merge dates.
 * - Set GITHUB_TOKEN in CI to avoid the 60 requests/hour anonymous limit.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'IAM-GROOT1/ctrlz';
const OUT_FILE = fileURLToPath(new URL('../src/data/updates.json', import.meta.url));
const RELEASES_FILE = fileURLToPath(new URL('../src/data/releases.json', import.meta.url));
const EMPTY = { source: 'empty', fetchedAt: null, since: null, mainSha: null, items: [] };

const headers = () => {
  const result = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ctrlz.download build',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) result.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return result;
};

async function getJson(url) {
  const response = await fetch(url, { headers: headers(), signal: AbortSignal.timeout(12_000) });
  if (!response.ok)
    throw new Error(`GitHub API responded ${response.status} ${response.statusText}`);
  return response.json();
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return null;
  }
}

async function write(data) {
  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function main() {
  const cached = await readJson(OUT_FILE);
  const releases = (await readJson(RELEASES_FILE))?.releases ?? [];
  const latest = releases.find((release) => !release.prerelease && !release.draft) ?? null;

  try {
    const main = await getJson(`https://api.github.com/repos/${REPO}/commits/main`);
    const pulls = await getJson(
      `https://api.github.com/repos/${REPO}/pulls?state=closed&base=main&sort=updated&direction=desc&per_page=50`,
    );
    const since = latest?.publishedAt ? Date.parse(latest.publishedAt) : 0;
    const items = pulls
      .filter((pull) => pull.merged_at && Date.parse(pull.merged_at) > since)
      .sort((a, b) => Date.parse(b.merged_at) - Date.parse(a.merged_at))
      .map((pull) => ({
        number: Number(pull.number),
        title: String(pull.title ?? '').slice(0, 200),
        url: String(pull.html_url ?? ''),
        mergedAt: pull.merged_at,
      }));

    await write({
      source: 'github',
      fetchedAt: new Date().toISOString(),
      since: latest ? { tag: latest.tag, publishedAt: latest.publishedAt } : null,
      mainSha: String(main.sha ?? ''),
      items,
    });
    console.log(`[updates] ${items.length} change(s) merged since ${latest?.tag ?? 'the start'}.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (cached && Array.isArray(cached.items)) {
      console.warn(`[updates] ${message} — keeping cached data from ${cached.fetchedAt}.`);
      if (cached.source !== 'cache') await write({ ...cached, source: 'cache' });
      return;
    }
    console.warn(`[updates] ${message} — no cache; the changelog shows releases only.`);
    await write(EMPTY);
  }
}

await main();
