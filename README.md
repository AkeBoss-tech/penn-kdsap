# Penn KDSAP website

A static Astro rebuild of Penn KDSAP's public pages, designed for GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

`site-html-archive/pages` is the source snapshot for every public page. The Astro route generates a static page for each archived URL while retaining the existing public content and imagery. Page metadata, Open Graph cards, Twitter cards, canonical URLs, and the site favicon are set in the Astro template.

## Editing content

The homepage is managed in `content/home.json`. Editors can use [Pages CMS](https://app.pagescms.org/) instead of editing files: sign in with GitHub, install the Pages CMS GitHub App for this repository, and select **Homepage**. Saving changes commits them to `main`, which automatically publishes the update through GitHub Pages.

Images uploaded through Pages CMS are stored in `public/images`.
