import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const sourceDirectory = join(root, 'site-html-archive/pages');
const outputDirectory = join(root, 'dist');
const deploymentBase = '/penn-kdsap';
const publicSiteUrl = 'https://akashdubey.me';
const ogImageUrl = 'https://akashdubey.me/penn-kdsap/images/penn-kdsap-og.png';
const pages = (await readdir(sourceDirectory)).filter((file) => file.endsWith('.html'));
const galleryImageDirectory = join(root, 'public/images/gallery');
const galleryImageFiles = (await readdir(galleryImageDirectory)).filter((file) => /\.jpe?g$/i.test(file)).sort();
const galleryTemplate = await readFile(join(root, 'content/gallery-page.html'), 'utf8');
const galleryImages = galleryImageFiles.map((file, index) => {
  const alt = `Penn KDSAP event photo ${index + 1}`;
  const image = `../images/gallery/${file}`;
  return `<a href="${image}" target="_blank" rel="noopener" aria-label="Open full-size photo ${index + 1}"><img src="${image}" alt="${alt}" loading="${index < 4 ? 'eager' : 'lazy'}" decoding="async"></a>`;
}).join('\n        ');
const localizeWixMedia = (html) => html
  .replace(/https:\/\/static\.wixstatic\.com\/media\/([^\/"')?]+)(?:\/v1\/[^"')?\s<]+)?/g, (_, name) => `${deploymentBase}/images/wix/${decodeURIComponent(name)}`)
  .replace(/https:\\\/\\\/static\.wixstatic\.com\\\/media\\\/([^\\\/"')?]+)(?:\\\/v1\\\/[^\\"')?\s<]+)?/g, (_, name) => `${deploymentBase}/images/wix/${decodeURIComponent(name)}`);
const setShareImage = (html) => html
  .replace(/(<meta property="og:image" content=")[^"]+("\/>)/g, `$1${ogImageUrl}$2`)
  .replace(/(<meta property="og:image:width" content=")[^"]+("\/>)/g, (_, start, end) => `${start}1200${end}`)
  .replace(/(<meta property="og:image:height" content=")[^"]+("\/>)/g, (_, start, end) => `${start}630${end}`)
  .replace(/(<meta name="twitter:image" content=")[^"]+("\/>)/g, `$1${ogImageUrl}$2`);
const setSeoUrls = (html, pagePath) => {
  const canonicalUrl = `${publicSiteUrl}${deploymentBase}${pagePath}`;
  const canonical = `<link rel="canonical" href="${canonicalUrl}"/>`;
  const openGraphUrl = `<meta property="og:url" content="${canonicalUrl}"/>`;
  const hasCanonical = /<link rel="canonical"/i.test(html);
  const hasOpenGraphUrl = /<meta property="og:url"/i.test(html);

  return html
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?\s*>/i, canonical)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?\s*>/i, openGraphUrl)
    .replace('</head>', `${hasOpenGraphUrl ? '' : openGraphUrl}<meta name="robots" content="index,follow"/>${hasCanonical ? '' : canonical}</head>`);
};
const configureContactForm = (html) => html
  .replace(
    '<form id="comp-keelgap4" class="AYCJGp comp-keelgap4 wixui-form">',
    '<form id="comp-keelgap4" class="AYCJGp comp-keelgap4 wixui-form" action="https://formsubmit.co/pennkdsap@gmail.com" method="POST">',
  )
  .replace('name="name-*"', 'name="name"')
  .replace(
    '<textarea id="textarea_comp-keelgar2"',
    '<textarea name="message" id="textarea_comp-keelgar2"',
  )
  .replace(
    '</form><!--/$-->',
    '<input type="hidden" name="_subject" value="New Penn KDSAP contact-form submission" /><input type="text" name="_honey" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true" /></form><!--/$-->',
  );
const contactFormSubmissionScript = `<script>
  // Prevent archived Wix code from intercepting the hosted form submission.
  document.addEventListener('submit', (event) => {
    if (event.target instanceof HTMLFormElement && event.target.id === 'comp-keelgap4') {
      event.stopImmediatePropagation();
    }
  }, true);
</script>`;

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const page of pages) {
  let html = page === 'gallery.html'
    ? galleryTemplate.replace('{{GALLERY_IMAGES}}', galleryImages)
    : await readFile(join(sourceDirectory, page), 'utf8');
  // Preserve navigation within the GitHub Pages copy instead of returning to
  // the source Wix site. Links to other hosts are intentionally unchanged.
  html = html
    .replaceAll('https://www.pennkdsap.org/', `${deploymentBase}/`)
    .replaceAll('https://www.pennkdsap.org', deploymentBase);
  html = localizeWixMedia(html);
  html = setShareImage(html);
  const pagePath = page === 'index.html' ? '/' : `/${page.slice(0, -5)}/`;
  html = setSeoUrls(html, pagePath);
  if (page === 'contact-us.html') {
    html = configureContactForm(html);
    html = html.replace('</body>', `${contactFormSubmissionScript}</body>`);
  }
  const staticLayoutScript = page === 'gallery.html'
    ? ''
    : page === 'index.html'
    ? '<script src="js/complete-static-layout.js"></script>'
    : '<script src="../js/complete-static-layout.js"></script>';
  const mobileStylesheet = page === 'index.html'
    ? '<link rel="stylesheet" href="css/mobile.css">'
    : '<link rel="stylesheet" href="../css/mobile.css">';
  html = html.replace('</head>', `${mobileStylesheet}</head>`);
  html = html.replace('</body>', `${staticLayoutScript}</body>`);
  if (page === 'index.html') {
    html = html.replace('</body>', '<script src="js/home-carousel.js"></script></body>');
  }
  const destination = page === 'index.html'
    ? join(outputDirectory, 'index.html')
    : join(outputDirectory, page.slice(0, -5), 'index.html');
  await mkdir(join(destination, '..'), { recursive: true });
  await writeFile(destination, html);
}

await cp(join(root, 'public'), outputDirectory, { recursive: true });
await cp(join(root, 'content'), join(outputDirectory, 'content'), { recursive: true });
const sitemapUrls = pages
  .sort()
  .map((page) => page === 'index.html' ? `${publicSiteUrl}${deploymentBase}/` : `${publicSiteUrl}${deploymentBase}/${page.slice(0, -5)}/`)
  .map((url) => `  <url><loc>${url}</loc></url>`)
  .join('\n');
await writeFile(join(outputDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);
await writeFile(join(outputDirectory, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${publicSiteUrl}${deploymentBase}/sitemap.xml\n`);
await writeFile(join(outputDirectory, '.nojekyll'), '');
console.log(`Published ${pages.length} captured pages.`);
