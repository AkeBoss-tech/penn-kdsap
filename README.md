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

## Editing content with Pages CMS

The homepage and Gallery introduction are managed in `content/`. Editors can use [Pages CMS](https://app.pagescms.org/) instead of editing files: sign in with GitHub, install the Pages CMS GitHub App for the [Penn KDSAP repository](https://github.com/AkeBoss-tech/penn-kdsap), and select **Website pages**. Saving changes commits them to `main`, which automatically publishes the update through GitHub Pages.

The CMS controls the homepage carousel, newsletter, recap, introductory copy, and Gallery title/introduction. To access it, the repository owner must complete the one-time Pages CMS GitHub App installation. Editors can either sign in with GitHub and receive repository access, or be invited by email from Pages CMS to edit content and media without a GitHub account.

Images uploaded through Pages CMS are stored in `public/images`.

The remaining archived pages are intentionally not exposed as raw HTML in the CMS: editing that markup could break their layout. Adding safe editing controls for them requires migrating each page's content into structured `content/` files. See [AI_EDITING.md](AI_EDITING.md) for the collaboration and review workflow, including how to use ChatGPT or Claude safely.
