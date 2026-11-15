# Third-party notices

Everything this website uses that was not written for it, with its licence. There is no
third-party code with a licence incompatible with publishing this source under the PolyForm
Noncommercial License 1.0.0.

## Fonts (self-hosted, latin subset)

| Font                              | Licence                   | Source                                           |
| --------------------------------- | ------------------------- | ------------------------------------------------ |
| Inter (variable)                  | SIL Open Font License 1.1 | <https://github.com/rsms/inter>                  |
| Instrument Serif (roman + italic) | SIL Open Font License 1.1 | <https://github.com/Instrument/instrument-serif> |
| JetBrains Mono (400, 500)         | SIL Open Font License 1.1 | <https://github.com/JetBrains/JetBrainsMono>     |

Files live in `public/fonts/` and are served from this domain. No font requests go to a third
party. The OFL permits bundling and redistribution; the fonts are unmodified subsets.

## Runtime dependencies

| Package                                                | Version | Licence |
| ------------------------------------------------------ | ------- | ------- |
| [astro](https://astro.build)                           | 7.4.12  | MIT     |
| [@astrojs/sitemap](https://github.com/withastro/astro) | 3.7.5   | MIT     |
| [lenis](https://github.com/darkroomengineering/lenis)  | 1.3.27  | MIT     |
| [marked](https://github.com/markedjs/marked)           | 18.2.0  | MIT     |

`marked` is used at build time only, to turn GitHub release notes into HTML.

## Build and development dependencies

| Package                                                                     | Version | Licence    |
| --------------------------------------------------------------------------- | ------- | ---------- |
| [@astrojs/check](https://github.com/withastro/astro)                        | 0.9.12  | MIT        |
| [@tailwindcss/vite](https://github.com/tailwindlabs/tailwindcss)            | 4.3.5   | MIT        |
| [tailwindcss](https://github.com/tailwindlabs/tailwindcss)                  | 4.3.5   | MIT        |
| [typescript](https://github.com/microsoft/TypeScript)                       | 5.9.3   | Apache-2.0 |
| [vitest](https://github.com/vitest-dev/vitest)                              | 5.1.0   | MIT        |
| [prettier](https://github.com/prettier/prettier)                            | 3.10.1  | MIT        |
| [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro) | 1.1.2   | MIT        |
| [sharp](https://github.com/lovell/sharp)                                    | 0.35.5  | Apache-2.0 |

`sharp` links against libvips, which is licensed LGPL-3.0. It is used to generate the favicon set
and to optimise images at build time; it is not shipped to the browser.

## Assets

- The CTRL+Z logo and app icon belong to the CTRL+Z project. They are used on this site with the
  project owner's permission and are not covered by this repository's licence.
- The Open Graph image is generated from this repository's own markup and assets
  (`scripts/og-template.html`).

No per-file licence headers are added; the licence for the whole source tree is in `LICENSE`.
