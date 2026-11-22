/** Questions and answers. Plain text; links are written as Markdown-free strings. */

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: 'Is CTRL+Z really free?',
    answer:
      'Yes. The app is licensed under AGPL-3.0 (releases up to v1.1.3 were MIT), there is no paid tier today, no account is required, and nothing is metered. The website you are reading has its own licence, but the app is free to use, change and share.',
  },
  {
    question: 'Does it back up my saved passwords?',
    answer:
      'No, and it is not an oversight. Chromium and Firefox password stores, cookies and other credential files are deliberately excluded, because they are tied to the Windows account that created them and do not restore safely under another one. You will sign in to sites again.',
  },
  {
    question: 'Which browsers are supported?',
    answer:
      'Chromium: Chrome, Edge, Brave, Vivaldi, Opera and Opera GX, Helium, Chromium, Thorium, Yandex, Comet, Arc and Whale. Firefox family: Firefox and ESR, Zen, LibreWolf, Waterfox, Floorp, Mullvad Browser and Tor Browser. Custom profile folders work for any fork.',
  },
  {
    question: 'Does it need administrator rights?',
    answer:
      'The app starts without them. It asks for elevation to install apps silently and to use Volume Shadow Copy when a browser file is locked by a running process. You can decline and still scan, export and plan.',
  },
  {
    question: 'What happens when an app fails to install?',
    answer:
      'The failure is isolated so the rest of the queue keeps going. Each app keeps its own status and log, and you can retry it on its own. If an installer needs a restart, the queue resumes at the next unfinished app after the reboot.',
  },
  {
    question: 'Why does Windows SmartScreen warn me?',
    answer:
      'The builds are not code-signed yet, so Windows shows an unknown-publisher prompt for a new binary. The SHA-256 checksums on the download page let you confirm the file GitHub served you. If you would rather not trust a binary, the source is on GitHub and builds with the .NET 8 SDK.',
  },
  {
    question: 'Does the app send anything home?',
    answer:
      'There is no telemetry and no analytics. It contacts winget, GitHub and the vendors whose installers you asked for, and only when you ask it to install or refresh something. The privacy page lists every request.',
  },
];
