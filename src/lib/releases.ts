import releaseDataJson from '../data/releases.json';
import {
  assetChecksum,
  findAsset,
  formatBytes,
  formatDate,
  getLatestStable,
  hasReleases,
  parseVersion,
  sortReleases,
  type Release,
  type ReleaseAsset,
  type ReleaseData,
} from './release-parse';

export const releaseData = releaseDataJson as unknown as ReleaseData;

export const releases: Release[] = hasReleases(releaseData)
  ? sortReleases(releaseData.releases)
  : [];

export const latest: Release | null = getLatestStable(releases);

export const hasReleaseData = Boolean(latest);

export interface DownloadLink {
  kind: 'installer' | 'portable';
  label: string;
  description: string;
  url: string;
  fileName: string;
  size: string;
  checksum: string | null;
}

export const downloads: DownloadLink[] = latest
  ? (
      [
        {
          kind: 'installer',
          label: 'Installer',
          description: 'Per-user install, Start Menu shortcut, uninstaller.',
        },
        {
          kind: 'portable',
          label: 'Portable',
          description: 'One self-contained .exe. Run it from anywhere.',
        },
      ] as const
    ).flatMap((entry) => {
      const asset: ReleaseAsset | null = findAsset(latest, entry.kind);
      if (!asset) return [];
      return [
        {
          kind: entry.kind,
          label: entry.label,
          description: entry.description,
          url: asset.downloadUrl,
          fileName: asset.name,
          size: formatBytes(asset.size),
          checksum: assetChecksum(asset),
        },
      ];
    })
  : [];

export const checksumsAsset = latest ? findAsset(latest, 'checksums') : null;

export interface VersionSummary {
  version: string;
  tag: string;
  name: string;
  publishedAt: string | null;
  publishedLabel: string;
  url: string;
  installer: DownloadLink | null;
  portable: DownloadLink | null;
}

export const version: VersionSummary | null = latest
  ? {
      version: parseVersion(latest.tag),
      tag: latest.tag,
      name: latest.name,
      publishedAt: latest.publishedAt,
      publishedLabel: formatDate(latest.publishedAt),
      url: latest.url,
      installer: downloads.find((download) => download.kind === 'installer') ?? null,
      portable: downloads.find((download) => download.kind === 'portable') ?? null,
    }
  : null;

/** e.g. "65.1 MB" for the installer, used on the home page CTA. */
export const installerSize = version?.installer?.size ?? null;

export const fetchedLabel = formatDate(releaseData?.fetchedAt ?? null);
