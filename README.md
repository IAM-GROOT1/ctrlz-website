# ctrlz.download

The marketing and download site for **CTRL+Z** — a free, open-source Windows app that
rebuilds a PC after a clean install. It reinstalls your apps and restores your Chromium
and Firefox profiles.

- App source: <https://github.com/IAM-GROOT1/ctrlz>
- Site: <https://ctrlz.download>

This repository contains the website only. The app lives in the repository linked above.

## Stack

- [Astro](https://astro.build) with TypeScript, fully static output
- [Tailwind CSS](https://tailwindcss.com)
- [pnpm](https://pnpm.io) as the package manager
- Self-hosted fonts, no third-party requests at runtime

## Local development

Node 22.16 or newer is required (see `.nvmrc`).

```sh
corepack enable
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
pnpm preview    # serve the built site
pnpm test       # unit tests
pnpm check      # TypeScript / Astro diagnostics
pnpm lint       # formatting and lint checks
```

Release data is fetched from the GitHub Releases API at build time and cached in
`src/data/releases.json`. If the API is unavailable, the build uses the cached copy.

## Editing content

Copy, FAQ entries, and page text live in `src/content` and `src/data` so they can be
changed without touching components:

- `src/data/site.ts` — navigation, links, metadata
- `src/data/home.ts` — home page copy
- `src/content/docs/` — Markdown pages (how it works, contributing, privacy)
- `src/data/releases.json` — cached release data (generated; do not hand-edit)

## Deployment

The site is published with Cloudflare Pages from `main`. Build command `pnpm build`,
output directory `dist`, Node version from `.nvmrc`. Full setup instructions, including the
custom domain and the rebuild hook for new app releases, are in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## License

The website source code is licensed under the **PolyForm Noncommercial License 1.0.0**
(see [LICENSE](LICENSE)). You may read it and learn from it, but not use it for commercial
purposes.

The CTRL+Z name, logo, screenshots, and website copy are **not** covered by this license
and may not be reused without permission.

Third-party dependencies and fonts, with their licenses, are listed in
[THIRD_PARTY.md](THIRD_PARTY.md).
