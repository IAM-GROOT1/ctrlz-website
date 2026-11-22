/**
 * Home page copy. Every claim here is traceable to the app's README or source:
 * https://github.com/IAM-GROOT1/ctrlz
 */

export const hero = {
  eyebrow: 'Windows 10 & 11 · x64',
  titleLead: 'Undo a',
  titleEmphasis: 'clean install',
  lede: 'CTRL+Z remembers the apps and browser profiles on this PC, then puts them back after you reinstall Windows.',
  primaryCta: 'Download for Windows',
  secondaryCta: { label: 'See how it works', href: '#how' },
  facts: ['Free and open source', 'AGPL-3.0-only licensed', 'No account', 'No telemetry'],
} as const;

export const howItWorks = {
  eyebrow: 'How it works',
  title: 'Scan the PC you have. Restore it after the reinstall.',
  intro:
    'Everything runs on your machine. There is no account and no server in the middle — just a profile file you keep.',
  steps: [
    {
      number: '01',
      title: 'Scan',
      body: 'CTRL+Z reads what is installed from winget, the Windows registry, and the Microsoft Store, then matches each name to a package it can reinstall.',
    },
    {
      number: '02',
      title: 'Choose',
      body: 'Untick what you no longer use. Add the rest from a winget id, a GitHub release, a direct download, or an installer on a USB stick.',
    },
    {
      number: '03',
      title: 'Back up',
      body: 'Keep the app list as readable JSON, and export Chromium or Firefox profiles — tabs, history, bookmarks, extensions — to encrypted ZIPs.',
    },
    {
      number: '04',
      title: 'Restore',
      body: 'After Windows is back, import the profile and press install. Restarts and failed apps do not reset the queue.',
    },
  ],
} as const;

export const apps = {
  eyebrow: 'App reinstall',
  title: 'If it can install silently, it comes back.',
  body: 'winget covers most of a modern desktop. For the rest, CTRL+Z takes a direct URL, a GitHub release, or an installer you already have on disk — and works out the silent switches itself.',
  points: [
    {
      title: 'winget',
      body: 'Matched package ids, installed in your order, with per-app status and a live log.',
    },
    {
      title: 'GitHub releases',
      body: 'The latest asset is resolved again at install time, so a new release is picked up without editing the profile.',
    },
    {
      title: 'Direct downloads and local files',
      body: 'Inno Setup, NSIS, MSI, InstallShield, Squirrel, WiX Burn and MSIX are detected, with a command preview before anything runs.',
    },
  ],
  screenshot: {
    name: 'add-app',
    label: 'Add app — direct URL, GitHub release, local installer',
    width: 1180,
    height: 760,
    theme: 'App capture',
    alt: 'The CTRL+Z Add app screen, with direct link, GitHub release and local file sources and a silent install panel.',
  },
} as const;

export const catalog = {
  eyebrow: 'Catalogue',
  title: 'The Chris Titus app catalogue is built in.',
  body: 'Browse and add what Chris Titus Tech’s WinUtil recommends. An offline snapshot ships with the app, and the catalogue refreshes from the public repository when you ask it to.',
  link: { label: 'How the catalogue works', href: '/docs#catalogue' },
  screenshot: {
    name: 'catalog',
    label: 'Catalog — recommended WinUtil apps',
    width: 1180,
    height: 760,
    theme: 'App capture',
    alt: 'The CTRL+Z catalog listing recommended apps with their winget package ids and categories.',
  },
} as const;

export const browsers = {
  eyebrow: 'Browser backup',
  title: 'Browsers come back too.',
  body: 'Chromium and Firefox profiles, restored into the browser you actually use — including forks that have no sync. Pick individual profiles and restore them as new ones, so nothing on the target machine is overwritten.',
  points: [
    'Tabs and sessions',
    'History and bookmarks',
    'Extensions and their data',
    'Preferences, search engines, site permissions',
  ],
  exclusions: {
    title: 'Passwords and cookies are not included.',
    body: 'Those stores are tied to the Windows account that created them and do not restore cleanly elsewhere. CTRL+Z leaves them out, so you will sign in again — and no credentials end up in a backup file.',
  },
  screenshot: {
    name: 'browser-restore',
    label: 'Browser restore — archive, profiles, target browser',
    width: 1180,
    height: 760,
    theme: 'App capture',
    alt: 'The CTRL+Z browser restore screen, listing an archive’s profiles and asking for a target browser.',
  },
} as const;

export const resumable = {
  eyebrow: 'Resumable installs',
  title: 'A reboot shouldn’t restart the queue.',
  body: 'Progress is written as it happens. If an installer asks for a restart, or one app fails, CTRL+Z isolates it and carries on — then resumes at the next unfinished app when you come back.',
} as const;

export const portableProfiles = {
  eyebrow: 'Profiles',
  title: 'The backup you can read.',
  body: 'A profile is a JSON file, not a database. Keep one per machine, export it, edit a package id by hand, or leave it on the USB stick next to the installer.',
  snippet: `{
  "name": "Work PC",
  "apps": [
    {
      "name": "7-Zip",
      "source": "winget",
      "packageId": "7zip.7zip"
    },
    {
      "name": "Obsidian",
      "source": "github",
      "gitHubRepo": "obsidianmd/obsidian-releases"
    }
  ]
}`,
} as const;

export const openSource = {
  eyebrow: 'Open source',
  title: 'The whole thing is on GitHub.',
  body: 'AGPL-3.0-only licensed. No account, no telemetry, no cloud service. The app checks GitHub for its own updates, and talks to Microsoft’s winget and to GitHub when you ask it to install something.',
  repo: 'IAM-GROOT1/ctrlz',
} as const;

export const faqHeading = {
  eyebrow: 'Questions',
  title: 'The honest answers.',
} as const;

export const screenshotSlots = [
  {
    name: 'myapps',
    label: 'App list — the hero shot',
    width: 1180,
    height: 760,
    theme: 'App capture',
    alt: 'The CTRL+Z app list showing installed apps matched to winget packages.',
  },
] as const;
