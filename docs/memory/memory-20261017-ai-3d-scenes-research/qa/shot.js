// Quick check: open one page via file:// in headless Edge, print console errors, take screenshots of each demo stage.
// usage: node shot.js <page.html> [--offline] [--width=390]
const { chromium } = require('playwright-core');
const path = require('path');
const SITE = path.resolve(__dirname, '../../../../site');
(async () => {
  const page_ = process.argv[2] || 'index.html';
  const offline = process.argv.includes('--offline');
  const wArg = process.argv.find(a => a.startsWith('--width='));
  const width = wArg ? +wArg.split('=')[1] : 1400;
  const nogl = process.argv.includes('--nogl');
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: nogl ? ['--disable-webgl', '--disable-webgl2'] : ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, offline });
  const page = await ctx.newPage();
  const errs = [];
  let noise = 0;
  page.on('console', m => {
    if (m.type() !== 'error' && m.type() !== 'warning') return;
    // D3D HLSL compiler precision warnings (X4122) surfaced by ANGLE: harmless driver noise
    if (/X4122/.test(m.text()) && !/error/i.test(m.text().replace(/X4122/g, ''))) { noise++; return; }
    errs.push(m.type() + ': ' + m.text());
  });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('requestfailed', r => errs.push('requestfailed: ' + r.url() + ' ' + (r.failure() || {}).errorText));
  const url = 'file:///' + path.join(SITE, page_).replace(/\\/g, '/');
  await page.goto(url);
  // --set=id:value,id:value  sets inputs (checkbox: true/false) after load, firing input+change
  const sArg = process.argv.find(a => a.startsWith('--set='));
  if (sArg) {
    await page.waitForTimeout(4000);
    await page.evaluate(spec => spec.split(',').forEach(kv => {
      const [id, v] = kv.split(':'); const el = document.getElementById(id); if (!el) return;
      if (el.type === 'checkbox') el.checked = v === 'true'; else el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
    }), sArg.slice(6));
  }
  const tag = sArg ? '-' + sArg.slice(6).replace(/[^a-z0-9]+/gi, '_').slice(0, 40) : '';
  const stages = await page.$$('.demo-stage');
  for (let i = 0; i < stages.length; i++) {
    await stages[i].scrollIntoViewIfNeeded();
    const t0 = Date.now();
    while (Date.now() - t0 < 25000) {
      const ok = await stages[i].evaluate(s => /fps|demo-msg/.test(s.innerHTML) && !/…$/.test((s.querySelector('.hud') || {}).textContent || ''));
      if (ok) break;
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(1500);
    await stages[i].screenshot({ path: path.join(__dirname, 'shots', page_.replace('.html', '') + (offline ? '-offline' : '') + (nogl ? '-nogl' : '') + tag + '-' + i + '.png') });
    const hud = await stages[i].evaluate(s => [...s.querySelectorAll('.hud,.demo-msg')].map(x => x.textContent).join(' | '));
    console.log('stage', i, hud);
  }
  // --sel=CSS  screenshots every matching element (e.g. --sel=.figure or --sel=#probeOut)
  const selArg = process.argv.find(a => a.startsWith('--sel='));
  if (selArg) {
    await page.waitForTimeout(1500);
    const els = await page.$$(selArg.slice(6));
    for (let i = 0; i < els.length; i++) {
      await els[i].scrollIntoViewIfNeeded();
      await els[i].screenshot({ path: path.join(__dirname, 'shots', page_.replace('.html', '') + '-sel' + (width < 600 ? '-w' + width : '') + '-' + i + '.png') });
    }
    console.log('sel', selArg.slice(6), els.length, 'element(s)');
  }
  if (process.argv.includes('--full')) await page.screenshot({ path: path.join(__dirname, 'shots', page_.replace('.html', '') + '-w' + width + '.png'), fullPage: false });
  const ov = await page.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll('main *')].filter(e => {
      const r = e.getBoundingClientRect(); if (r.right <= W + 1) return false;
      for (let p = e.parentElement; p; p = p.parentElement) { const ox = getComputedStyle(p).overflowX; if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return false; }
      return true;
    }).slice(0, 5).map(e => e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ')[0] : '') + ' ' + Math.round(e.getBoundingClientRect().right));
    return { sw: document.documentElement.scrollWidth, W, wide };
  });
  if (ov.sw > ov.W + 1 || ov.wide.length) console.log('OVERFLOW-X: scrollWidth', ov.sw, '> viewport', ov.W, ov.wide.join(', '));
  console.log('ERRORS:', errs.length ? '\n' + errs.join('\n') : 'none', noise ? '(ignored ' + noise + ' D3D X4122 shader warnings)' : '');
  await browser.close();
})();
