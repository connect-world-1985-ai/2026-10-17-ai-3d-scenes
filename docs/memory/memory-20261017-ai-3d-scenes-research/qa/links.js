// Internal link + anchor checker. Loads every site page via file:// (so site.js auto-slugged IDs exist),
// collects element IDs and internal hrefs, reports missing pages/anchors. Also lists external URLs.
// usage: node links.js [--external]   (writes qa/external-urls.txt)
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const SITE = path.resolve(__dirname, '../../../../site');
(async () => {
  const pages = fs.readdirSync(SITE).filter(f => f.endsWith('.html') && !f.startsWith('_'));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const ctx = await browser.newContext({ offline: true });
  const ids = {}, links = [], ext = new Set();
  for (const p of pages) {
    const page = await ctx.newPage();
    await page.goto('file:///' + path.join(SITE, p).replace(/\\/g, '/'));
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({
      ids: [...document.querySelectorAll('[id]')].map(e => e.id),
      hrefs: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))
    }));
    ids[p] = new Set(r.ids);
    r.hrefs.forEach(h => {
      if (/^(https?:)?\/\//.test(h)) ext.add(h);
      else if (!/^(mailto:|javascript:)/.test(h)) links.push([p, h]);
    });
    await page.close();
  }
  const bad = [];
  for (const [from, h] of links) {
    const [file, anchor] = h.split('#');
    const target = file === '' ? from : file;
    if (!ids[target]) { bad.push(from + ' -> ' + h + '  (missing page)'); continue; }
    if (anchor && !ids[target].has(anchor)) bad.push(from + ' -> ' + h + '  (missing anchor)');
  }
  console.log('pages', pages.length, 'internal links', links.length, 'external', ext.size);
  console.log(bad.length ? 'BROKEN:\n' + bad.join('\n') : 'BROKEN: none');
  fs.writeFileSync(path.join(__dirname, 'external-urls.txt'), [...ext].sort().join('\n') + '\n');
  await browser.close();
})();
