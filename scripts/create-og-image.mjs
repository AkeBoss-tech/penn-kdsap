import sharp from 'sharp';

const input = 'public/images/wix/0f663e_8cfd19385f1445a3af00a3acac184e1e~mv2.png';
const output = 'public/images/penn-kdsap-og.png';
const logo = await sharp(input)
  .resize({ width: 1100, height: 500, fit: 'inside', withoutEnlargement: true })
  .flatten({ background: '#ffffff' })
  .png()
  .toBuffer();

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: '#ffffff' },
})
  .composite([{ input: logo, gravity: 'center' }])
  .removeAlpha()
  .png()
  .toFile(output);

console.log(`Created ${output} with an opaque white background.`);
