# Deploying ctrlz.download

The site is a fully static Astro build. Cloudflare Pages serves `dist/` and rebuilds on every
push. Nothing here needs a server, a database or a runtime environment.

## What Cloudflare Pages needs

| Setting          | Value                          |
| ---------------- | ------------------------------ |
| Framework preset | Astro                          |
| Build command    | `pnpm build`                   |
| Output directory | `dist`                         |
| Root directory   | `/` (default)                  |
| Node version     | read from `.nvmrc` (`24.21.0`) |

`pnpm build` runs `scripts/fetch-releases.mjs` first, which refreshes the cached release data
from the GitHub API. If the API is unreachable or rate limited, the committed
`src/data/releases.json` is used and the build continues.

There is deliberately **no `wrangler.toml`**. Pages Git integration does not need one. If you
would rather deploy from the command line, `wrangler pages deploy dist --project-name ctrlz-website`
works with the same build output.

## 1. Connect the repository

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub if prompted, then pick **IAM-GROOT1/ctrlz-website**.
3. Choose the **Astro** preset. Confirm build command `pnpm build`, output directory `dist`.
4. Under _Environment variables_, leave everything empty for now (see step 4).
5. **Save and deploy**. The first build finishes in about a minute.

## 2. Production and preview deploys

- **Production** deploys come from the production branch. Set it to `main` under
  _Settings → Builds & deployments → Production branch_.
- **Preview** deploys are on by default for every non-production branch, including pull
  request branches. Each preview gets its own `*.pages.dev` URL, which appears on the pull
  request as a deployment status.
- Branch names containing slashes (`feature/initial-site`) work; Cloudflare converts them into
  a safe preview alias.

Because `main` is production, every push to `main` publishes. Work on branches and merge
through pull requests.

## 3. Custom domain: ctrlz.download

Cloudflare needs to manage the domain's DNS, otherwise it cannot issue the certificate or point
the apex record.

1. **Add the zone**: dashboard → **Add a site** → `ctrlz.download` → choose a plan (Free is fine).
2. **Change nameservers at your registrar** to the two Cloudflare nameservers shown
   (for example `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`). This is done at the
   registrar where the domain was bought, not in Cloudflare. Propagation is usually minutes,
   occasionally a few hours.
3. Wait until Cloudflare reports the zone as **Active**.
4. **Attach the domain**: Workers & Pages → `ctrlz-website` → **Custom domains** →
   **Set up a domain** → `ctrlz.download`. Cloudflare creates the DNS record and certificate.
5. Add `www.ctrlz.download` the same way, then create a redirect from `www` to the apex under
   **Rules → Redirect Rules** (or **Bulk Redirects**) so both spellings resolve to one canonical
   URL. The site's canonical tags always point at `https://ctrlz.download`.

TLS certificates are issued automatically. Keep **Always Use HTTPS** enabled.

## 4. Environment variables

The site needs **no environment variables** to build or run.

Optional:

| Name           | Environments           | Type   | Why                                                                                                           |
| -------------- | ---------------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN` | Production and Preview | Secret | Raises the GitHub API rate limit used by the build-time release fetch. A read-only, no-scope token is enough. |

Set them in **Workers & Pages → ctrlz-website → Settings → Variables and Secrets**, per
environment. Never put values in the repository; `.env*` files are git-ignored.

## 5. Rebuild when the app releases

**Automatic (no secrets):** `.github/workflows/sync-releases.yml` checks the app repository every
15 minutes and commits a refreshed `src/data/releases.json` to `main` when a release is new or its
notes changed; Cloudflare then builds that push. The options below only make it faster.

The download page and changelog read GitHub Releases at build time, so they need a new build
after a release. Choose one of these.

### Option A — deploy hook called from the app repository (recommended)

1. In Cloudflare: `ctrlz-website` → **Settings** → **Builds & deployments** →
   **Deploy hooks** → **Add deploy hook**. Name it `app release`, branch `main`, copy the URL.
2. In the **app** repository (`IAM-GROOT1/ctrlz`): **Settings → Secrets and variables → Actions
   → New repository secret**, name `CTRLZ_SITE_DEPLOY_HOOK`, value = the hook URL.
3. Copy [`docs/app-repo-release-hook.yml`](app-repo-release-hook.yml) into that repository as
   `.github/workflows/rebuild-site.yml` and commit it.

Publishing a release then triggers a production build within a minute.

### Option B — scheduled rebuild in this repository (fallback)

`.github/workflows/scheduled-rebuild.yml` runs daily at 06:00 UTC and calls a deploy hook.

1. Create a second deploy hook in Cloudflare (same place as above).
2. In **this** repository: **Settings → Secrets and variables → Actions → New repository
   secret**, name `CLOUDFLARE_DEPLOY_HOOK_URL`.
3. Nothing else to do. Without the secret the workflow exits cleanly.

You can also run it by hand from the **Actions** tab (`workflow_dispatch`).

### Option C — manual

Trigger a build from the Pages dashboard, or make any commit to `main`.

**Never commit a deploy hook URL.** Treat it as a password: anyone with it can start builds.
If one leaks, delete the hook in Cloudflare and create a new one.

## 6. Headers and caching

`public/_headers` is copied into the build and applied by Cloudflare Pages:

- security headers (`nosniff`, frame denial, a Content Security Policy that allows
  `api.github.com` for the download-page refresh)
- one-year immutable caching for `/_astro/*` and `/fonts/*`

The CSP allows `'unsafe-inline'` for scripts and styles because Astro inlines small scripts;
there are no third-party scripts to allow.

## 7. Rollbacks

Every deployment is kept. **Deployments** → pick a previous production build → **Rollback**.
Nothing else needs to change.

## Optional: cookieless analytics

The site ships with **no analytics at all**. If you later want traffic numbers without cookies or a
consent banner, Cloudflare Web Analytics is the natural fit because the site is already on
Cloudflare:

1. Dashboard → **Analytics & Logs → Web Analytics → Add a site**, and pick the Pages project.
2. If the dashboard offers automatic injection for Pages projects in your account, enable it and
   there is nothing to deploy.
3. If it gives you a beacon snippet instead, add it to `src/layouts/Base.astro` and allow it in
   `public/_headers`: add `https://static.cloudflareinsights.com` to `script-src` and
   `https://cloudflareinsights.com` to `connect-src`.
4. Say so on the privacy page — it currently states that there are no analytics.

It sets no cookies and does not fingerprint visitors, so no cookie banner is needed. Any other
analytics product would need a privacy review and likely a banner; the site is designed to work
without one.
