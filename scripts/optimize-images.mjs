// One-off asset optimizer: converts large PNGs in public/ to WebP and
// generates public/og-cover.jpg from docs/screenshot.png for social cards.
// Usage:  node scripts/optimize-images.mjs
import { glob, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function toWebp(file, { width = 1600, quality = 80 } = {}) {
  const out = file.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  const info = await sharp(file)
    .rotate()
    .resize({ width: Math.min(width, 1920), withoutEnlargement: true })
    .webp({ quality })
    .toFile(out)
  const kb = (n) => `${(n / 1024).toFixed(0)} KB`
  console.log(`${path.basename(file)} -> ${path.basename(out)}  ${kb(info.size)}`)
  if (path.resolve(out).toLowerCase() !== path.resolve(file).toLowerCase()) {
    await unlink(file)
  }
}

for await (const f of glob('public/projects/*.png', { cwd: root })) {
  await toWebp(path.join(root, f))
}
for await (const f of glob('public/certificates/*.{png,jpg,jpeg}', { cwd: root })) {
  await toWebp(path.join(root, f), { quality: 82 })
}

// 1200x630 social cover crop from the README screenshot
await sharp(path.join(root, 'docs/screenshot.png'))
  .resize(1200, 630, { fit: 'cover', position: 'top' })
  .jpeg({ quality: 82 })
  .toFile(path.join(root, 'public/og-cover.jpg'))
console.log('og-cover.jpg written')
