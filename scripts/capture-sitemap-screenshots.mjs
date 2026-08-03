#!/usr/bin/env node

/**
 * Capture full-page PNGs for each URL listed in a site's XML sitemap.
 *
 * Usage:
 *   npm run screenshots
 *   node scripts/capture-sitemap-screenshots.mjs --sitemap https://example.com/sitemap.xml --output screenshots
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const defaults = {
  sitemap: 'https://www.pennkdsap.org/pages-sitemap.xml',
  output: 'screenshots',
  width: 1440,
  height: 1000,
  timeout: 60_000,
};

function option(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1] ?? fallback;
}

const settings = {
  sitemap: option('sitemap', defaults.sitemap),
  output: resolve(option('output', defaults.output)),
  width: Number(option('width', defaults.width)),
  height: Number(option('height', defaults.height)),
  timeout: Number(option('timeout', defaults.timeout)),
};

function urlsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim());
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; PennKDSAP-screenshot/1.0)' },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function sitemapUrls(sitemapUrl, visited = new Set()) {
  if (visited.has(sitemapUrl)) return [];
  visited.add(sitemapUrl);

  const xml = await fetchText(sitemapUrl);
  const locations = urlsFromSitemap(xml);
  if (/<sitemapindex[\s>]/i.test(xml)) {
    return (await Promise.all(locations.map((url) => sitemapUrls(url, visited)))).flat();
  }
  return locations;
}

function filenameFor(url, index) {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/^\/+|\/+$/g, '') || 'home';
  const safePath = path.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'page';
  return `${String(index + 1).padStart(3, '0')}-${safePath}.png`;
}

await mkdir(settings.output, { recursive: true });
const urls = [...new Set(await sitemapUrls(settings.sitemap))];
if (!urls.length) throw new Error(`No page URLs found in ${settings.sitemap}`);

console.log(`Found ${urls.length} page(s) in ${settings.sitemap}`);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: settings.width, height: settings.height } });
const results = [];

try {
  for (const [index, url] of urls.entries()) {
    const filename = filenameFor(url, index);
    console.log(`[${index + 1}/${urls.length}] ${url}`);
    try {
      // Wix keeps some background requests open indefinitely, so waiting for
      // `networkidle` would delay each capture until the navigation timeout.
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: settings.timeout });
      await page.waitForLoadState('load', { timeout: 15_000 }).catch(() => {});
      await page.waitForTimeout(2_000);
      await page.screenshot({ path: resolve(settings.output, filename), fullPage: true });
      results.push({ url, filename, status: 'captured' });
    } catch (error) {
      console.error(`  Failed: ${error.message}`);
      results.push({ url, filename, status: 'failed', error: error.message });
    }
  }
} finally {
  await browser.close();
}

await writeFile(resolve(settings.output, 'manifest.json'), `${JSON.stringify({
  sitemap: settings.sitemap,
  capturedAt: new Date().toISOString(),
  results,
}, null, 2)}\n`);

const failures = results.filter((result) => result.status === 'failed');
console.log(`Captured ${results.length - failures.length}/${results.length} page(s) to ${settings.output}`);
if (failures.length) process.exitCode = 1;
