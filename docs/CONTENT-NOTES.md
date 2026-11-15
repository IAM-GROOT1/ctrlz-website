# Content notes

Every claim on this site was checked against the app repository
([IAM-GROOT1/ctrlz](https://github.com/IAM-GROOT1/ctrlz)) — its README, its source tree and its
published releases. This page records what was used, and what was left out on purpose.

## Deliberately not claimed

| Requested                                  | Why it is not on the site                                                                                                                                                                                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **“In-app updates”** as a feature          | The app has no update service: `src/CtrlZ.Core/Services/` has no updater, and the app README lists _“Optional code signing / auto-update”_ under **Roadmap**. Advertising it would be false. If it ships, add a feature block next to _Resumable installs_. |
| **A winget install command**               | `winget search ctrlz` returns no package. Per the brief, the command is omitted, and the download page says plainly that there is no package yet.                                                                                                           |
| **Update checks** on the privacy page      | There are none, so the privacy page says the app does not check for its own updates rather than inventing a check.                                                                                                                                          |
| **Statistics, testimonials, “trusted by”** | None exist. The site uses no numbers that cannot be read off GitHub or the release assets.                                                                                                                                                                  |

## Claims that are used, and their source

- winget, registry and Microsoft Store scanning; conservative matching; unmatched grouping —
  app README, _Rebuild apps_.
- Direct URL, GitHub release and local installer sources; installer-type detection for Inno
  Setup, NSIS, MSI, InstallShield, Squirrel, WiX Burn, MSIX — app README.
- Chris Titus WinUtil catalogue with an embedded snapshot and cached refresh — app README and
  `WinUtilCatalogService.cs`.
- Resumable installs, per-app status and logs, restart handling — app README, `InstallStateStore`
  and `InstallEngine`.
- Chromium and Firefox profile backup, tabs, history, bookmarks, extensions, preferences, search
  engines, site permissions — app README, _Chromium and Firefox browser backup_.
- Passwords and cookies excluded by design — app README and `BrowserDataRules.cs`.
- Unsigned binaries and the SmartScreen warning — app README and every release note.
- MIT licence for the app — app `LICENSE`.
- No telemetry or account — app README, _Everything else_.

## Where the words live

- `src/data/home.ts` — home page copy, in one typed object per section.
- `src/data/faq.ts` — the FAQ.
- `src/data/site.ts` — navigation, links, metadata, footnotes.
- `src/content/docs/*.md` — the docs page.
- `src/content/pages/privacy.md` — the privacy page.

Nothing in `src/pages` or `src/components` needs editing to change copy, except headings that are
part of the design.
