# ctrlz.download

The marketing and download site for **CTRL+Z**, a free, open-source Windows app that rebuilds a
PC after a clean install: it reinstalls your apps and restores your Chromium and Firefox profiles.

- Live site: <https://ctrlz.download>
- App source: <https://github.com/IAM-GROOT1/ctrlz>
- Screenshots still needed: [`docs/SCREENSHOTS.md`](docs/SCREENSHOTS.md)

## Stack

- [Astro](https://astro.build) 7 with TypeScript, fully static output
- [Tailwind CSS](https://tailwindcss.com) 4 (CSS-first tokens, no config file)
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- [pnpm](https://pnpm.io) 11, Node from `.nvmrc`
- Self-hosted Inter, Instrument Serif and JetBrains Mono — no third-party requests at runtime
- No analytics, no cookies, no tracking scripts

## Local development

```sh
corepack enable
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
pnpm preview    # serve the built site
pnpm test       # unit tests for the release parsing
pnpm check      # TypeScript and Astro diagnostics
pnpm lint       # Prettier check
pnpm check:links # internal link check (run after build)
```

## Editing content

Copy lives in data and Markdown files so components rarely need touching:

| What                                   | Where                                                        |
| -------------------------------------- | ------------------------------------------------------------ |
| Home page sections                     | `src/data/home.ts`                                           |
| FAQ                                    | `src/data/faq.ts`                                            |
| Navigation, links, metadata, footnotes | `src/data/site.ts`                                           |
| Docs page sections                     | `src/content/docs/*.md` (frontmatter `order` controls order) |
| Privacy page                           | `src/content/pages/privacy.md`                               |
| Design tokens (colour, type, spacing)  | `src/styles/global.css`                                      |

## Release data

The download page and changelog never hardcode a version.

- `scripts/fetch-releases.mjs` runs before `dev` and `build`, calls the GitHub Releases API, and
  writes `src/data/releases.json`.
- If the API fails or is rate limited, the existing cache is kept, so the build still succeeds.
- `src/lib/release-parse.ts` holds the pure parsing logic and is covered by `tests/`.
- The download page re-checks the latest release in the browser and updates versions, sizes,
  links and checksums; if that request fails, the build-time data stands and the GitHub releases
  page is always linked.

Set `GITHUB_TOKEN` (read-only) in CI or Cloudflare to raise the anonymous rate limit.

## Screenshots

Four placeholder slots are waiting for real captures. See
[`docs/SCREENSHOTS.md`](docs/SCREENSHOTS.md) for exact sizes, themes and capture guidance. Drop a
file into `src/assets/screenshots/<name>.png` and the placeholder disappears.

## Deployment (Cloudflare Pages)

Full detail, including DNS and deploy hooks, is in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

1. **Connect the repo.** Cloudflare dashboard → _Workers & Pages_ → _Create_ → _Pages_ →
   _Connect to Git_ → pick `IAM-GROOT1/ctrlz-website`. Preset **Astro**, build command
   `pnpm build`, output directory `dist`, root `/`. Node comes from `.nvmrc`.
2. **Production and previews.** _Settings → Builds & deployments_: production branch `main`;
   preview deployments are on for every other branch and pull request by default. Because `main`
   is production, never push directly to it — merge through pull requests.
3. **Custom domain.** Add `ctrlz.download` as a zone in Cloudflare, change the domain's
   nameservers at the registrar to the ones Cloudflare shows, wait for the zone to become active,
   then add `ctrlz.download` (and `www`) under the Pages project's _Custom domains_. Add a redirect
   rule from `www` to the apex.
4. **Environment variables.** None are required. Optionally set a secret `GITHUB_TOKEN` for
   Production and Preview under _Settings → Variables and Secrets_. Never commit secrets — `.env*`
   is ignored.
5. **Rebuild on a new app release.** Create a **deploy hook** in Cloudflare, store its URL as the
   `CTRLZ_SITE_DEPLOY_HOOK` secret **in the app repository**, and copy
   [`docs/app-repo-release-hook.yml`](docs/app-repo-release-hook.yml) there as
   `.github/workflows/rebuild-site.yml`. As a fallback, this repository's
   `.github/workflows/scheduled-rebuild.yml` calls a hook daily using the
   `CLOUDFLARE_DEPLOY_HOOK_URL` secret. The hook URL is never written into the repository.

## CI

`.github/workflows/ci.yml` runs on pull requests and on `main`: Prettier check, `astro check`,
unit tests, a production build, and an internal link check over `dist/`.

## Privacy

The site sets no cookies and loads no analytics. The download page makes one anonymous request to
`api.github.com` to show the latest release. The app's own network behaviour is documented at
<https://ctrlz.download/privacy>.

## License

The website source code is licensed under the **PolyForm Noncommercial License 1.0.0**
(see [LICENSE](LICENSE)). You may read it and learn from it, but not use it for commercial
purposes.

The CTRL+Z name, logo, screenshots, and website copy are **not** covered by this license and may
not be reused without permission.

Third-party dependencies and fonts, with their licenses, are listed in
[THIRD_PARTY.md](THIRD_PARTY.md).
