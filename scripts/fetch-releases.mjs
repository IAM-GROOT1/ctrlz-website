#!/usr/bin/env node
/**
 * Fetches the CTRL+Z release list at build time and caches it in
 * src/data/releases.json.
 *
 * - Never fails the build: if the API is down or rate limited, the previously
 *   cached file is kept.
 * - Set GITHUB_TOKEN in CI to avoid the 60 requests/hour anonymous limit.
 * - No secrets are written to disk.
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'IAM-GROOT1/ctrlz';
const API = `https://api.github.com/repos/${REPO}/releases?per_page=30`;
const OUT_FILE = fileURLToPath(new URL('../src/data/releases.json', import.meta.url));

const EMPTY = { source: 'empty', fetchedAt: null, repo: REPO, releases: [] };

const assetShape = (asset) => ({
  name: String(asset.name ?? ''),
  size: Number(asset.size ?? 0),
  digest: typeof asset.digest === 'string' ? asset.digest : null,
  downloadUrl: String(asset.browser_download_url ?? ''),
  contentType: asset.content_type ?? null,
  downloadCount: Number(asset.download_count ?? 0),
});

const releaseShape = (release) => ({
  tag: String(release.tag_name ?? ''),
  name: String(release.name ?? release.tag_name ?? ''),
  body: String(release.body ?? ''),
  publishedAt: release.published_at ?? release.created_at ?? null,
  url: String(release.html_url ?? ''),
  prerelease: Boolean(release.prerelease),
  draft: Boolean(release.draft),
  assets: Array.isArray(release.assets) ? release.assets.map(assetShape) : [],
});

async function readCache() {
  try {
    const raw = await readFile(OUT_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.releases) ? parsed : null;
  } catch {
    return null;
  }
}

async function fetchReleases(attempt = 1) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ctrlz.download build',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(API, {
      headers,
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) {
      throw new Error(`GitHub API responded ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    if (!Array.isArray(json)) throw new Error('Unexpected GitHub API payload');
    return json;
  } catch (error) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
      return fetchReleases(attempt + 1);
    }
    throw error;
  }
}

async function main() {
  const cached = await readCache();
  let payload;

  try {
    payload = await fetchReleases();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (cached && cached.releases.length > 0) {
      console.warn(`[releases] ${message} — keeping cached data from ${cached.fetchedAt}.`);
      return;
    }
    console.warn(`[releases] ${message} — no cache available; the site will point to GitHub.`);
    await mkdir(dirname(OUT_FILE), { recursive: true });
    await writeFile(OUT_FILE, `${JSON.stringify(EMPTY, null, 2)}\n`, 'utf8');
    return;
  }

  const releases = payload
    .map(releaseShape)
    .filter((release) => !release.draft)
    .filter((release) => release.tag && release.publishedAt);

  if (releases.length === 0) {
    if (cached && cached.releases.length > 0) {
      console.warn('[releases] API returned no releases — keeping cached data.');
      return;
    }
    await mkdir(dirname(OUT_FILE), { recursive: true });
    await writeFile(OUT_FILE, `${JSON.stringify(EMPTY, null, 2)}\n`, 'utf8');
    return;
  }

  const data = {
    source: 'github',
    fetchedAt: new Date().toISOString(),
    repo: REPO,
    releases,
  };

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`[releases] cached ${releases.length} release(s); latest ${releases[0].tag}.`);
}

await main();
