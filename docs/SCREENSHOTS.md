# Screenshots I still need

The site already renders clearly labelled placeholder slots. Drop a real capture at the file
path below and it replaces the placeholder automatically — no component changes. The `Screenshot`
component checks `src/assets/screenshots/<name>.<ext>` (`.png`, `.jpg`, `.webp` or `.avif`).

| #   | File                                          | Size            | Theme                                                                   | What it should show                                                                                                                                                              |
| --- | --------------------------------------------- | --------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/assets/screenshots/myapps.png`           | **1600 × 1000** | Light (primary). A dark variant is welcome but the hero uses one image. | **My Apps** after a scan: the app list with matched and unmatched entries, the toolbar, and the status strip. This is the hero image, so make it the most representative screen. |
| 2   | `src/assets/screenshots/add-app.png`          | **1280 × 860**  | Light and dark both welcome; one file is used.                          | The **Add App** dialog with the source choices visible (winget, GitHub release, direct URL, local installer) and the silent-switch preview.                                      |
| 3   | `src/assets/screenshots/browser-restore.png`  | **1440 × 900**  | Light and dark both welcome; one file is used.                          | **Browsers → Restore**: an inspected archive with its profiles listed and the target-browser choice.                                                                             |
| 4   | `src/assets/screenshots/install-progress.png` | **1280 × 800**  | Light and dark both welcome; one file is used.                          | **Install** during a run: per-app status, the progress bar and the live log visible.                                                                                             |

## How to capture them well

- Use a VM or a test Windows account with neutral app data. No personal bookmarks, names, file
  paths, emails or product keys anywhere in frame.
- Capture the app window only — no desktop wallpaper, no taskbar, no browser chrome.
- Set display scaling to **100%** so the UI is crisp at the pixel sizes above. If you capture at
  200%, supply double resolution (for example 3200 × 2000 for the hero) and the image will be
  downscaled cleanly.
- Take light-theme captures on a light Windows theme and dark on a dark one, so window chrome
  matches the app.
- PNG is best for UI. Optimisation to AVIF/WebP happens at build time.
- Keep the app at its default window size; don't stretch it to fill 1600 px if that adds empty
  space. A slightly narrower capture is fine — the frame is not pixel-exact.

## Files you do not need to provide

- Logo and app icon: taken from the app repository's `branding/` folder.
- Open Graph image: generated from `scripts/og-template.html` into `public/og.png`.
- Favicons: generated from the same mark by `pnpm assets`.
