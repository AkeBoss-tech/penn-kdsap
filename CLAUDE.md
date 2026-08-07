# Penn KDSAP contributor instructions

This repository publishes a static site to GitHub Pages from `main`.

## Before changing code

1. Work on a branch; never push directly to `main`.
2. Read the relevant page/template and preserve unrelated working changes.
3. Keep all internal links relative to the deployed base path: `/penn-kdsap/`.

## Architecture

- `site-html-archive/pages/` contains captured Wix pages. Treat them as source
  reference, not ordinary hand-edited page templates.
- `scripts/build-mirror.mjs` builds `dist/` and maps each archive page to its
  GitHub Pages route.
- `content/` contains safe, editable content inputs. Homepage content comes
  from `content/home.json`; the native Gallery page uses
  `content/gallery-page.html` and `content/gallery.json`.
- `public/` contains CSS, JavaScript, and local images copied into `dist/`.
- `dist/` is generated. Do not commit it.

## Adding pages or features

For a new page, use a native template in `content/` or a dedicated component in
`public/`, then register its route in `scripts/build-mirror.mjs`. Do not copy a
new external site into the project or reintroduce links to `www.pennkdsap.org`.

Make new UI responsive at 390px and desktop widths, keyboard accessible, and
use meaningful image alt text. Do not add medical advice or unverified health
claims.

## Required verification

Run these before opening a pull request:

```sh
npm ci
npm run verify:site
```

Do not change `.github/workflows/`, `.pages.yml`, deployment settings,
third-party form destinations, or credentials unless the task explicitly asks
for it. Explain any such change clearly in the pull request.
