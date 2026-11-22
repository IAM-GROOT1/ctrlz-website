import { describe, expect, it } from 'vitest';
import {
  assetChecksum,
  classifyAsset,
  compareVersions,
  findAsset,
  formatBytes,
  formatDate,
  getLatestStable,
  hasReleases,
  isLastKnownRelease,
  parseVersion,
  sortReleases,
  type Release,
  type ReleaseAsset,
} from '../src/lib/release-parse';

const asset = (name: string, overrides: Partial<ReleaseAsset> = {}): ReleaseAsset => ({
  name,
  size: 1_000,
  digest: null,
  downloadUrl: `https://example.com/${name}`,
  ...overrides,
});

const release = (tag: string, publishedAt: string, extra: Partial<Release> = {}): Release => ({
  tag,
  name: `CTRL+Z ${tag}`,
  body: '',
  publishedAt,
  url: `https://github.com/IAM-GROOT1/ctrlz/releases/tag/${tag}`,
  prerelease: false,
  assets: [],
  ...extra,
});

describe('parseVersion', () => {
  it('strips a leading v', () => {
    expect(parseVersion('v1.1.3')).toBe('1.1.3');
    expect(parseVersion('V2.0.0')).toBe('2.0.0');
  });

  it('leaves a bare version alone', () => {
    expect(parseVersion(' 1.1.3 ')).toBe('1.1.3');
  });
});

describe('compareVersions', () => {
  it('compares numerically, not lexically', () => {
    expect(compareVersions('1.1.10', '1.1.3')).toBe(1);
    expect(compareVersions('1.1.3', '1.1.10')).toBe(-1);
  });

  it('handles leading v and different lengths', () => {
    expect(compareVersions('v1.2', '1.2.0')).toBe(0);
    expect(compareVersions('v1.2.1', '1.2')).toBe(1);
  });

  it('sorts a prerelease before the plain version', () => {
    expect(compareVersions('1.2.0-beta.1', '1.2.0')).toBe(-1);
    expect(compareVersions('1.2.0', '1.2.0-beta.1')).toBe(1);
  });
});

describe('sortReleases', () => {
  it('puts the newest release first', () => {
    const sorted = sortReleases([
      release('v1.0.0', '2026-01-01T00:00:00Z'),
      release('v1.2.0', '2026-03-01T00:00:00Z'),
      release('v1.1.0', '2026-02-01T00:00:00Z'),
    ]);
    expect(sorted.map((item) => item.tag)).toEqual(['v1.2.0', 'v1.1.0', 'v1.0.0']);
  });

  it('falls back to version order when dates match', () => {
    const sorted = sortReleases([
      release('v1.1.0', '2026-02-01T00:00:00Z'),
      release('v1.2.0', '2026-02-01T00:00:00Z'),
    ]);
    expect(sorted.map((item) => item.tag)).toEqual(['v1.2.0', 'v1.1.0']);
  });

  it('does not mutate the input', () => {
    const input = [
      release('v1.0.0', '2026-01-01T00:00:00Z'),
      release('v1.1.0', '2026-02-01T00:00:00Z'),
    ];
    sortReleases(input);
    expect(input.map((item) => item.tag)).toEqual(['v1.0.0', 'v1.1.0']);
  });
});

describe('getLatestStable', () => {
  it('skips prereleases when a stable one exists', () => {
    const latest = getLatestStable([
      release('v2.0.0-beta.1', '2026-04-01T00:00:00Z', { prerelease: true }),
      release('v1.1.3', '2026-03-01T00:00:00Z'),
      release('v1.1.2', '2026-02-01T00:00:00Z'),
    ]);
    expect(latest?.tag).toBe('v1.1.3');
  });

  it('falls back to the newest prerelease if that is all there is', () => {
    const latest = getLatestStable([
      release('v2.0.0-beta.1', '2026-04-01T00:00:00Z', { prerelease: true }),
    ]);
    expect(latest?.tag).toBe('v2.0.0-beta.1');
  });

  it('returns null for an empty list', () => {
    expect(getLatestStable([])).toBeNull();
  });
});

describe('classifyAsset', () => {
  it('classifies the real release asset names', () => {
    expect(classifyAsset('CTRL+Z-Setup-1.1.3.exe')).toBe('installer');
    expect(classifyAsset('CTRL+Z-Portable-1.1.3.exe')).toBe('portable');
    expect(classifyAsset('SHA256SUMS.txt')).toBe('checksums');
    expect(classifyAsset('BUILD-INFO.txt')).toBe('other');
  });

  it('is case insensitive', () => {
    expect(classifyAsset('ctrlz-portable-1.0.0.EXE')).toBe('portable');
  });
});

describe('findAsset', () => {
  it('finds installer and portable assets', () => {
    const target = release('v1.1.3', '2026-03-01T00:00:00Z', {
      assets: [
        asset('SHA256SUMS.txt'),
        asset('CTRL+Z-Setup-1.1.3.exe'),
        asset('CTRL+Z-Portable-1.1.3.exe'),
      ],
    });
    expect(findAsset(target, 'installer')?.name).toBe('CTRL+Z-Setup-1.1.3.exe');
    expect(findAsset(target, 'portable')?.name).toBe('CTRL+Z-Portable-1.1.3.exe');
    expect(findAsset(target, 'checksums')?.name).toBe('SHA256SUMS.txt');
  });

  it('returns null when the asset is missing', () => {
    expect(findAsset(release('v1.0.0', '2026-01-01T00:00:00Z'), 'portable')).toBeNull();
  });
});

describe('assetChecksum', () => {
  const hash = 'e0f3426197b466cf45cea36ef0d774d68cb91f00e7a32a529f1798069c48ac67';

  it('extracts and upper-cases a sha256 digest', () => {
    expect(assetChecksum(asset('a.exe', { digest: `sha256:${hash}` }))).toBe(hash.toUpperCase());
  });

  it('returns null for missing or malformed digests', () => {
    expect(assetChecksum(asset('a.exe'))).toBeNull();
    expect(assetChecksum(asset('a.exe', { digest: 'sha512:abc' }))).toBeNull();
    expect(assetChecksum(null)).toBeNull();
  });
});

describe('formatBytes', () => {
  it('formats with binary units', () => {
    expect(formatBytes(68_213_274)).toBe('65.1 MB');
    expect(formatBytes(182)).toBe('182 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
  });

  it('is defensive about bad input', () => {
    expect(formatBytes(0)).toBe('—');
    expect(formatBytes(Number.NaN)).toBe('—');
  });
});

describe('formatDate', () => {
  it('formats deterministically in UTC', () => {
    expect(formatDate('2026-11-15T03:52:04Z')).toBe('15 Nov 2026');
  });

  it('handles missing dates', () => {
    expect(formatDate(null)).toBe('Unknown date');
    expect(formatDate('not-a-date')).toBe('Unknown date');
  });
});

describe('hasReleases', () => {
  it('detects usable data', () => {
    expect(hasReleases(null)).toBe(false);
    expect(hasReleases({ source: 'x', fetchedAt: null, repo: 'r', releases: [] })).toBe(false);
    expect(
      hasReleases({
        source: 'x',
        fetchedAt: null,
        repo: 'r',
        releases: [release('v1.0.0', '2026-01-01T00:00:00Z')],
      }),
    ).toBe(true);
  });
});

describe('isLastKnownRelease', () => {
  const data = (source: string, count = 1) => ({
    source,
    fetchedAt: '2026-11-22T00:00:00Z',
    repo: 'IAM-GROOT1/ctrlz',
    releases: Array.from({ length: count }, () => ({}) as Release),
  });

  it('is true only for cached data that still has releases', () => {
    expect(isLastKnownRelease(data('cache'))).toBe(true);
    expect(isLastKnownRelease(data('github'))).toBe(false);
    expect(isLastKnownRelease(data('cache', 0))).toBe(false);
    expect(isLastKnownRelease(null)).toBe(false);
  });
});
