# Penn KDSAP website

A static Astro rebuild of Penn KDSAP's public pages, designed for GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

## Full-page sitemap screenshots

Install the Chromium browser once, then capture every page in the live site's sitemap:

```sh
npx playwright install chromium
npm run screenshots
```

PNGs and a `manifest.json` report are written to `screenshots/`. The script accepts
`--sitemap`, `--output`, `--width`, `--height`, and `--timeout` options; for example:

```sh
npm run screenshots -- --output site-screenshots --width 1280
```

`site-html-archive/pages` is the source snapshot for every public page. The build copies each complete captured page response to the matching GitHub Pages route, preserving the original page markup, styling, assets, navigation, and interactive behavior.

## Editing content

The homepage is managed in `content/home.json`. Editors can use [Pages CMS](https://app.pagescms.org/) instead of editing files: sign in with GitHub, install the Pages CMS GitHub App for the [Penn KDSAP repository](https://github.com/AkeBoss-tech/penn-kdsap), and select **Homepage**. Saving changes commits them to `main`, which automatically publishes the update through GitHub Pages.

The CMS controls the homepage carousel, newsletter, recap, and introductory copy. To access it, the repository owner must complete the one-time Pages CMS GitHub App installation; editors then sign in with their own GitHub accounts and are granted repository access.

Images uploaded through Pages CMS are stored in `public/images`.
