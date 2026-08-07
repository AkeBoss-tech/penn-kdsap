import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const outputDirectory = join(root, 'dist');
const sourceDirectory = join(root, 'site-html-archive/pages');
const deploymentBase = '/penn-kdsap';
const publicSiteUrl = 'https://akashdubey.me';
const pages = (await readdir(sourceDirectory)).filter((file) => file.endsWith('.html')).sort();
const contentTypes = {
  '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml',
};

function relativeFile(pathname) {
  const path = decodeURIComponent(pathname).replace(/^\/+/, '');
  if (!path) return 'index.html';
  return extname(path) ? path : join(path, 'index.html');
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relative = relativeFile(pathname);
  const file = normalize(join(outputDirectory, relative));
  if (!file.startsWith(`${outputDirectory}/`) && file !== join(outputDirectory, 'index.html')) {
    response.writeHead(403).end();
    return;
  }
  try {
    const data = await readFile(file);
    response.writeHead(200, { 'content-type': contentTypes[extname(file)] ?? 'application/octet-stream' }).end(data);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const localBase = `http://127.0.0.1:${port}`;
const issues = [];

try {
  for (const file of pages) {
    const route = file === 'index.html' ? '/' : `/${file.slice(0, -5)}/`;
    const htmlFile = route === '/'
      ? join(outputDirectory, 'index.html')
      : join(outputDirectory, route, 'index.html');
    const html = await readFile(htmlFile, 'utf8');
    const canonical = `${publicSiteUrl}${deploymentBase}${route}`;
    if ((html.match(/<link rel="canonical"/g) ?? []).length !== 1 || !html.includes(`href="${canonical}"`)) {
      issues.push(`${route}: canonical URL is missing or incorrect`);
    }
    if (html.includes('href="https://www.pennkdsap.org')) {
      issues.push(`${route}: still links to the source site`);
    }
  }

  const browser = await chromium.launch({ headless: true });
  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.name === 'mobile' });
    for (const file of pages) {
      const route = file === 'index.html' ? '/' : `/${file.slice(0, -5)}/`;
      const response = await page.goto(`${localBase}${route}`, { waitUntil: 'load' });
      await page.waitForTimeout(750);
      const result = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        height: document.body.scrollHeight,
        needsMobileMenu: Boolean(document.querySelector('#comp-j91nuigk')),
        mobileMenu: Boolean(document.querySelector('.mobile-menu-toggle')),
        loginVisible: [...document.querySelectorAll('button')].some((element) => element.textContent?.includes('Log In') && element.getClientRects().length > 0),
      }));
      if (response?.status() !== 200 || result.height < 1) issues.push(`${viewport.name} ${route}: page did not render`);
      if (viewport.name === 'mobile' && (result.scrollWidth > result.width || (result.needsMobileMenu && !result.mobileMenu) || result.loginVisible)) {
        issues.push(`${viewport.name} ${route}: responsive navigation or layout failed`);
      }
    }
    await page.close();
  }
  await browser.close();
} finally {
  server.close();
}

if (issues.length) {
  console.error(`Site verification failed:\n${issues.map((issue) => `- ${issue}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${pages.length} routes at desktop and mobile viewports.`);
}
