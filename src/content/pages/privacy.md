---
title: Privacy
description: What CTRL+Z sends over the network, what it stores on your PC, and what this website does not do.
---

CTRL+Z is local-first. There is no account, no telemetry, no analytics, no crash reporting and no
cloud service. Your app list and browser archives stay on your machine unless you move them
yourself.

## What the app sends over the network

The app only makes a request when it is doing something you asked for.

| When                                            | Where                                                     | Why                                                |
| ----------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------- |
| You scan or install a winget app                | Microsoft's winget sources and the vendor's download host | winget resolves and downloads the package          |
| winget is missing or outdated                   | `aka.ms` and Microsoft's App Installer download           | bootstrap App Installer so winget can run          |
| You add or install an app from a GitHub release | `api.github.com` and `github.com`                         | resolve the latest release asset, then download it |
| You refresh the app catalogue                   | `raw.githubusercontent.com`                               | fetch the public WinUtil catalogue                 |
| You add an app with a direct URL                | The host you entered                                      | download the installer                             |
| An installer you run downloads its own updates  | The vendor's servers                                      | that is the installer, not CTRL+Z                  |

CTRL+Z does not check for its own updates, so it does not contact this website or any update server.
Anonymous GitHub API requests are limited to 60 per hour per IP address; setting a `GITHUB_TOKEN`
environment variable raises that limit if you use GitHub sources heavily.

## What is stored on your PC

- Profile JSON files, wherever you save them.
- Install state, logs and settings under `%LOCALAPPDATA%\CTRL+Z` — or beside the exe in `Data\` when
  `portable.flag` is present.
- Browser archives, as ZIP files, optionally encrypted with AES-256.

Logs record app names, installer commands and errors. They do not record credentials, and the app
excludes password and cookie stores from archives by design. You can open the log folder from
Settings and delete anything you like.

## What this website does

- No cookies, no analytics, no tracking pixels, no third-party scripts.
- Fonts are served from this domain, not a font CDN.
- The download page asks `api.github.com` for the latest release so it can show a newer version.
  That request comes from your browser, is the same anonymous request anyone can make, and is
  skipped if it fails.
- This site is hosted on Cloudflare Pages, which keeps standard request logs for security and
  operations, as any web host does.

## If a Pro tier ever exists

There is no paid tier today. If one is introduced, this page will list exactly what a licence check
sends, to which service, and how often — before any build that includes it ships.
