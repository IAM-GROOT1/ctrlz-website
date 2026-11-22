/**
 * When this build ran. Static sites bake their content at build time, so the page can honestly say
 * how fresh it is. Cloudflare Pages rebuilds on every push to this repository and whenever the app
 * repository calls the deploy hook, so this timestamp moves with them.
 */

const builtAt = new Date();

export const buildIso = builtAt.toISOString();

/** e.g. "21 Nov 2026, 21:40 UTC". */
export const buildLabel = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
}).format(builtAt);
