// Checagens leves, sem dependências: links/imagens locais, âncoras, alt em imagens,
// sitemap e placeholders esquecidos. Uso: node scripts/check-site.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const pages = readdirSync(root).filter((f) => f.endsWith('.html'));
const errors = [];
const idsCache = new Map();

const read = (p) => readFileSync(p, 'utf8');
const idsOf = (file) => {
  if (!idsCache.has(file)) idsCache.set(file, new Set([...read(file).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return idsCache.get(file);
};

for (const page of pages) {
  const file = join(root, page);
  const html = read(file);

  if (html.includes('CONTATO_EMAIL')) errors.push(`${page}: troque CONTATO_EMAIL pelo seu e-mail de contato público`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page}: sem <title>`);
  if (!/<html[^>]*\slang=/.test(html)) errors.push(`${page}: sem lang no <html>`);

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=/.test(m[0])) errors.push(`${page}: <img> sem alt → ${m[0].slice(0, 80)}`);
  }

  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(url)) continue;
    const [pathPart, hash] = url.split('#');
    const clean = pathPart.split('?')[0];
    const target = clean === '' ? file : resolve(dirname(file), clean);
    if (clean.startsWith('/')) continue; // caminhos absolutos dependem do domínio
    if (!existsSync(target)) { errors.push(`${page}: arquivo não encontrado → ${url}`); continue; }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) errors.push(`${page}: âncora inexistente → ${url}`);
  }
}

// caminhos de assets citados em JS/CSS também precisam existir
for (const dir of ['js', 'css']) {
  for (const f of readdirSync(join(root, dir)).filter((x) => /\.(js|css)$/.test(x))) {
    const text = read(join(root, dir, f));
    for (const m of text.matchAll(/['"(]((?:\.\.\/)?assets\/[\w./-]+\.(?:webp|png|jpg|svg|woff2))/g)) {
      const rel = m[1].replace(/^\.\.\//, '');
      if (!existsSync(join(root, rel))) errors.push(`${dir}/${f}: asset inexistente → ${rel}`);
    }
  }
}

// sitemap só pode listar páginas que existem
const sitemap = existsSync(join(root, 'sitemap.xml')) ? read(join(root, 'sitemap.xml')) : '';
for (const m of sitemap.matchAll(/<loc>https?:\/\/[^/]+\/([^<]*)<\/loc>/g)) {
  const p = m[1] === '' ? 'index.html' : m[1];
  if (!existsSync(join(root, p))) errors.push(`sitemap.xml: página inexistente → ${p}`);
}

if (errors.length) {
  console.error(`✖ ${errors.length} problema(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✔ ${pages.length} páginas checadas: links, âncoras, imagens com alt, sitemap e placeholders OK`);
