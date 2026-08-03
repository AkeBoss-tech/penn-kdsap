import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const sourceDirectory = join(root, 'site-html-archive/pages');
const outputDirectory = join(root, 'dist');
const pages = (await readdir(sourceDirectory)).filter((file) => file.endsWith('.html'));

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const page of pages) {
  let html = await readFile(join(sourceDirectory, page), 'utf8');
  const staticLayoutScript = page === 'index.html'
    ? '<script src="js/complete-static-layout.js"></script>'
    : '<script src="../js/complete-static-layout.js"></script>';
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
await writeFile(join(outputDirectory, '.nojekyll'), '');
console.log(`Published ${pages.length} captured pages.`);
