# Screenshots

The site ships with **real captures of the app**, taken from the app repository's
`docs/screenshots/` folder (the same images the app's README uses). They are 1180 × 760 and live in
`src/assets/screenshots/`:

| File                  | Used on                            | Shows                                                                  |
| --------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `myapps.png`          | Home hero                          | My Apps: the scanned app list, matched packages and install methods    |
| `add-app.png`         | Home, “If it can install silently” | Add app: direct link, GitHub release, local file, silent-install panel |
| `catalog.png`         | Home, catalogue                    | Catalog: recommended WinUtil apps by category, with winget ids         |
| `browser-restore.png` | Home, browser backup               | Browsers → Restore: archive, profiles inside, target browser           |

The build converts each to AVIF and WebP at several widths; nothing is served at its full size.
Never upscale a replacement — supply at least 1180 px wide.

## Replacing or adding a capture

1. Save a PNG/WebP/AVIF into `src/assets/screenshots/`.
2. Name it to match the slot (`myapps`, `add-app`, `browser-restore`), or pass a new `name` to the
   `Screenshot` component.
3. If the aspect ratio changes, update the `width`/`height` values in `src/data/home.ts` — they
   only size the placeholder, but keeping them honest keeps the docs honest.

The component picks up any file whose base name matches, so a placeholder disappears the moment a
real image exists.

## Optional future captures

These would make good additions, not fixes:

- **Install queue during a run** — per-app status, progress bar and live log. The resumable-installs
  section currently carries no image because no public capture of that screen exists.
- **Light-theme variants** — the shipped captures are dark; they sit inside the light theme
  perfectly well, but a light set would match the app's light mode.

## Capture guidance, if you shoot new ones

- Use a VM or test Windows account. No personal bookmarks, names, paths, emails or product keys.
- Window only — no desktop wallpaper, taskbar or browser chrome.
- 100% display scaling for crisp pixels; at 200%, capture double resolution.
- Match the app theme to the Windows theme you are shooting in, so the title bar matches.
- PNG for UI; optimisation happens at build time.
