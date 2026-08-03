# Penn KDSAP website

A static Astro rebuild of Penn KDSAP's public pages, designed for GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

`site-html-archive/pages` is the source snapshot for every public page. The Astro route generates a static page for each archived URL while retaining the existing public content and imagery. Page metadata, Open Graph cards, Twitter cards, canonical URLs, and the site favicon are set in the Astro template.
