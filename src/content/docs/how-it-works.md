---
title: How it works
summary: What CTRL+Z reads, what it writes, and what it deliberately leaves alone.
order: 1
---

### Scan

CTRL+Z reads installed software from three places: the winget package list, the Windows registry
Uninstall keys, and Microsoft Store (Appx) packages. It then matches each name to a winget package
id using a conservative matcher. When a name cannot be matched confidently it is left as unmatched
and grouped for you to fix by hand, with a winget search dialog.

### Profiles are JSON

A profile is a small JSON document (`schemaVersion: 1`) with a name and a list of apps. Apps record
where they come from: `winget` with a `packageId`; `github` with a repository and asset preference;
`directUrl` with a download URL and silent arguments; or a local installer path. Paths for local
installers are absolute by design, so reconnect the same USB drive or edit the path.

Profiles are portable: export one to a file, keep it next to the installer, import it after a
reinstall. Keep several — `Work PC`, `Gaming PC` — if you set up machines differently.

### Install

Installs run in the order you set, one at a time. Each app has its own status, progress and log.
A failed app is isolated so the rest of the queue continues, and a restart request is recorded so
the queue resumes at the next unfinished app. If CTRL+Z is not elevated it asks to relaunch itself
so silent installers can run.

For sources that need it, the app detects the installer type — Inno Setup, NSIS, MSI, InstallShield,
Squirrel, WiX Burn, MSIX — and previews the command before running it. Downloads verify a supplied
SHA-256 when one exists; winget verifies its own manifests; GitHub release digests are used when the
API provides them.

### Catalogue

The Chris Titus Tech WinUtil catalogue is embedded as an offline snapshot and can be refreshed from
the public repository. Adding an app from it writes a normal app entry into your profile, so nothing
depends on the catalogue being reachable later.

### Browsers

Browser backup is whitelist-based. Chromium browsers are detected from their `Local State` and
profiles; Firefox-family browsers from `profiles.ini`. A backup writes one ZIP per browser with a
manifest of what it contains, what it excluded, the engine, the browser version and the profiles.

Chromium archives include tabs and session files, history, bookmarks, extension code and storage,
preferences, sanitised search engines, and site permissions. Firefox archives include `prefs.js`,
`places.sqlite`, session store files, extensions and their storage, search engines, permissions,
bookmark backups and `chrome/` customisations.

Saved passwords and cookies are never included. Chromium `Login Data`, cookie stores and the
DPAPI-bound `os_crypt` key are stripped; Firefox `logins.json`, `key4.db` and `cookies.sqlite` are
excluded. Caches, crash dumps, service-worker caches and thumbnails are skipped too, and the app
shows you the estimated size before it starts.

If a browser is running, CTRL+Z offers to close it. When a file stays locked and the app is
elevated, it can fall back to Volume Shadow Copy.

Archives can be encrypted with AES-256 and a password. The password is never stored, and an
encrypted archive cannot be opened by Windows Explorer — restore it with CTRL+Z.

### Restoring

Restore inspects the archive first, shows you the profiles inside, and asks for a target browser of
the same engine. Restoring as a new profile is the recommended path: new Firefox profiles are
registered in `profiles.ini`, new Chromium profiles in `Local State`, and existing cookies and
passwords on the target are left untouched. Merging into an existing profile is available with a
warning and a small safety copy of the files it will write.

### What is not backed up

- Saved passwords, cookies and other credential stores.
- General AppData and application settings — this is a planned module, not a current feature.
- Anything outside the browser profile roots.
