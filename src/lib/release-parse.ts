/**
 * Pure helpers for turning GitHub release payloads into things the site can
 * render. Kept free of Astro and network access so they can be unit tested.
 */

export interface ReleaseAsset {
  name: string;
  size: number;
  digest: string | null;
  downloadUrl: string;
  contentType?: string | null;
  downloadCount?: number;
}

export interface Release {
  tag: string;
  name: string;
  body: string;
  publishedAt: string | null;
  url: string;
  prerelease: boolean;
  draft?: boolean;
  assets: ReleaseAsset[];
}

export interface ReleaseData {
  source: string;
  fetchedAt: string | null;
  repo: string;
  releases: Release[];
}

export type DownloadKind = 'installer' | 'portable' | 'checksums' | 'other';

/** "v1.1.3" -> "1.1.3"; anything else is returned trimmed. */
export function parseVersion(tag: string): string {
  return tag.trim().replace(/^v/i, '');
}

/**
 * Numeric, dot-separated version comparison. Handles 1.1.10 > 1.1.3 and
 * ignores a leading "v". Prerelease suffixes sort before the plain version.
 */
export function compareVersions(a: string, b: string): number {
  const split = (value: string) => {
    const clean = parseVersion(value);
    const [core, pre = ''] = clean.split('-', 2);
    const numbers = core.split('.').map((part) => Number.parseInt(part, 10) || 0);
    return { numbers, pre };
  };

  const left = split(a);
  const right = split(b);
  const length = Math.max(left.numbers.length, right.numbers.length);

  for (let index = 0; index < length; index += 1) {
    const diff = (left.numbers[index] ?? 0) - (right.numbers[index] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }

  if (left.pre === right.pre) return 0;
  if (!left.pre) return 1;
  if (!right.pre) return -1;
  return left.pre > right.pre ? 1 : -1;
}

/** Newest first. Falls back to tag order when dates are missing. */
export function sortReleases(releases: Release[]): Release[] {
  return [...releases].sort((a, b) => {
    if (a.publishedAt && b.publishedAt) {
      const byDate = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
      if (byDate !== 0) return byDate;
    }
    return compareVersions(b.tag, a.tag);
  });
}

/** Latest non-prerelease release, or the newest release if all are prereleases. */
export function getLatestStable(releases: Release[]): Release | null {
  const sorted = sortReleases(releases);
  return sorted.find((release) => !release.prerelease) ?? sorted[0] ?? null;
}

export function classifyAsset(name: string): DownloadKind {
  const lower = name.toLowerCase();
  if (/sha256|checksum/.test(lower)) return 'checksums';
  if (/setup|installer/.test(lower)) return 'installer';
  if (/portable/.test(lower)) return 'portable';
  return 'other';
}

export function findAsset(release: Release, kind: DownloadKind): ReleaseAsset | null {
  return release.assets.find((asset) => classifyAsset(asset.name) === kind) ?? null;
}

/**
 * The SHA-256 from an asset digest ("sha256:abc…"), upper-cased for display.
 * Returns null when GitHub did not report one.
 */
export function assetChecksum(asset: ReleaseAsset | null): string | null {
  if (!asset?.digest) return null;
  const match = /^sha256:([a-f0-9]{64})$/i.exec(asset.digest.trim());
  if (!match) return null;
  return match[1].toUpperCase();
}

/** 68213274 -> "65.1 MB" (binary units, the way Windows reports file sizes). */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  const digits = exponent === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[exponent]}`;
}

/** Deterministic date formatting in UTC so build output never shifts by timezone. */
export function formatDate(iso: string | null): string {
  if (!iso) return 'Unknown date';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** True when the cache holds at least one usable release. */
export function hasReleases(data: ReleaseData | null | undefined): boolean {
  return Boolean(data && Array.isArray(data.releases) && data.releases.length > 0);
}

/**
 * True when this build could not refresh the release list and shows the copy cached at an earlier
 * build. The page then says "last known release" with that date instead of presenting it as current.
 */
export function isLastKnownRelease(data: ReleaseData | null | undefined): boolean {
  return Boolean(data && data.source === 'cache' && data.releases.length > 0);
}
