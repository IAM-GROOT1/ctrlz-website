/**
 * Site-wide constants and navigation. Edit here once; every page picks it up.
 */

export const site = {
  name: 'CTRL+Z',
  domain: 'ctrlz.download',
  url: 'https://ctrlz.download',
  title: 'CTRL+Z — rebuild a Windows PC after a clean install',
  description:
    'CTRL+Z is a free, open-source Windows app that reinstalls your apps and restores your Chromium and Firefox browser profiles after a clean install.',
  tagline: 'Undo a clean install.',
  repo: 'https://github.com/IAM-GROOT1/ctrlz',
  repoName: 'IAM-GROOT1/ctrlz',
  releases: 'https://github.com/IAM-GROOT1/ctrlz/releases',
  releasesApi: 'https://api.github.com/repos/IAM-GROOT1/ctrlz/releases/latest',
  issues: 'https://github.com/IAM-GROOT1/ctrlz/issues',
  license: 'https://github.com/IAM-GROOT1/ctrlz/blob/main/LICENSE',
  appLicenseName: 'MIT',
  author: 'IAM-GROOT1',
} as const;

export const nav = [
  { href: '/download', label: 'Download' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/docs', label: 'Docs' },
] as const;

export const footerNav = [
  {
    title: 'Product',
    links: [
      { href: '/download', label: 'Download' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/docs', label: 'Docs' },
    ],
  },
  {
    title: 'Project',
    links: [
      { href: site.repo, label: 'Source code', external: true },
      { href: site.releases, label: 'All releases', external: true },
      { href: site.issues, label: 'Issues', external: true },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
] as const;

/** Small print that should stay in one place. */
export const footnote = {
  independent:
    'CTRL+Z is an independent project. It is not affiliated with Microsoft, winget, or any browser vendor.',
  websiteLicense: 'Website source is licensed under PolyForm Noncommercial 1.0.0.',
} as const;
