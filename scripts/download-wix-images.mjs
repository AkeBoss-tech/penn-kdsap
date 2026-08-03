import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const sourceDirectory = join(root, 'site-html-archive/pages');
const outputDirectory = join(root, 'public/images/wix');
const mediaNames = new Set();

for (const file of (await readdir(sourceDirectory)).filter((name) => name.endsWith('.html'))) {
  const html = await readFile(join(sourceDirectory, file), 'utf8');
  for (const match of html.matchAll(/https:\/\/static\.wixstatic\.com\/media\/([^\/?"')]+)/g)) {
    mediaNames.add(decodeURIComponent(match[1]));
  }
}

await mkdir(outputDirectory, { recursive: true });
const failures = [];
await Promise.all([...mediaNames].map(async (name) => {
  const urlName = encodeURIComponent(name).replace(/%2F/g, '/');
  const response = await fetch(`https://static.wixstatic.com/media/${urlName}`);
  if (!response.ok) {
    failures.push(`${name} (${response.status})`);
    return;
  }
  await writeFile(join(outputDirectory, name), Buffer.from(await response.arrayBuffer()));
}));

if (failures.length) throw new Error(`Could not download ${failures.length} Wix image(s): ${failures.join(', ')}`);
console.log(`Downloaded ${mediaNames.size} original Wix images to public/images/wix.`);
