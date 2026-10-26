/* AI 3D Scenes field guide — shared script (classic script, no modules, works from file://).
   Load in <head> WITHOUT defer: it sets the theme and the Three.js import map before any module loads. */
(function () {
  'use strict';

  var PAGES = [
    { f: 'index.html', t: 'Start here', g: 'Start' },
    { f: '01-taxonomy.html', n: '01', t: 'Eight ways a 3D demo gets made', g: 'Part I — The landscape' },
    { f: '02-rendering-basics.html', n: '02', t: 'Render loop, scene graph, camera', g: 'Part II — Fundamentals' },
    { f: '03-materials-light.html', n: '03', t: 'Meshes, PBR materials and light', g: 'Part II — Fundamentals' },
    { f: '04-shaders-sdf.html', n: '04', t: 'Shaders, noise and SDF raymarching', g: 'Part II — Fundamentals' },
    { f: '05-performance.html', n: '05', t: 'Performance: draw calls, instancing, LOD', g: 'Part II — Fundamentals' },
    { f: '06-controls-collision.html', n: '06', t: 'First-person controls and collision', g: 'Part II — Fundamentals' },
    { f: '07-ocean.html', n: '07', t: 'Recipe: ocean, sky and sun', g: 'Part III — Recipes' },
    { f: '08-city.html', n: '08', t: 'Recipe: procedural city', g: 'Part III — Recipes' },
    { f: '09-world-recipes.html', n: '09', t: 'Terrain, atmosphere, life, camera paths', g: 'Part III — Recipes' },
    { f: '10-assets.html', n: '10', t: 'Where the assets come from', g: 'Part IV — Assets and agents' },
    { f: '11-agent-workflow.html', n: '11', t: 'How the agent actually works', g: 'Part IV — Assets and agents' },
    { f: '12-one-prompt-truth.html', n: '12', t: 'The truth behind “one prompt” demos', g: 'Part IV — Assets and agents' },
    { f: '13-practical.html', n: '13', t: 'GPUs, hosting and recording video', g: 'Part V — Doing it' },
    { f: '14-decision.html', n: '14', t: 'Decision framework, stacks, costs', g: 'Part V — Doing it' },
    { f: '15-hands-on.html', n: '15', t: 'Hands-on starter projects', g: 'Part V — Doing it' },
    { f: '16-next-directions.html', n: '16', t: 'Directions for our next discussion', g: 'Part V — Doing it' },
    { f: 'glossary.html', t: 'Glossary', g: 'Reference' },
    { f: 'sources.html', t: 'Sources and method', g: 'Reference' }
  ];

  // ---------- theme (runs immediately) ----------
  var THEME_KEY = 'ai3d-theme';
  function storedTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); }
  var initial = storedTheme() || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initial);

  // ---------- Three.js import map (runs immediately, before any module) ----------
  var THREE_VERSION = '0.186.1';
  var THREE_CDN = 'https://unpkg.com/three@' + THREE_VERSION + '/';
  try {
    var im = document.createElement('script');
    im.type = 'importmap';
    im.textContent = JSON.stringify({ imports: {
      'three': THREE_CDN + 'build/three.module.js',
      'three/addons/': THREE_CDN + 'examples/jsm/'
    } });
    document.currentScript.parentNode.insertBefore(im, document.currentScript.nextSibling);
  } catch (e) { /* very old browser: demos will show their fallback */ }

  // ---------- helpers ----------
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'class') n.className = attrs[k]; else n.setAttribute(k, attrs[k]); }
    if (html != null) n.innerHTML = html;
    return n;
  }
  function currentFile() {
    var p = location.pathname.split('/').pop() || 'index.html';
    return decodeURIComponent(p);
  }
  function slug(s) {
    return s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';
  }

  function buildChrome() {
    var main = document.querySelector('main');
    if (!main) return;
    var file = currentFile();
    var idx = -1;
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].f === file) idx = i;

    // top bar
    var top = el('header', { class: 'topbar' });
    top.innerHTML =
      '<button class="icon-btn" id="navToggle" aria-label="Open navigation">☰</button>' +
      '<a class="brand" href="index.html">AI <span>3D scenes</span> — a field guide</a>' +
      '<div class="spacer"></div>' +
      '<button class="icon-btn" id="themeBtn" aria-label="Toggle theme" title="Toggle light/dark"></button>';

    // sidebar
    var side = el('nav', { class: 'sidebar', 'aria-label': 'Site' });
    var lastG = '';
    PAGES.forEach(function (p, i) {
      if (p.g !== lastG) { side.appendChild(el('div', { class: 'group' }, p.g)); lastG = p.g; }
      var a = el('a', { href: p.f }, (p.n ? '<span class="num">' + p.n + '</span>' : '') + p.t);
      if (i === idx) a.className = 'active';
      side.appendChild(a);
    });

    // layout
    var layout = el('div', { class: 'layout' });
    var wrap = el('div', { class: 'main-wrap' });
    var toc = el('aside', { class: 'toc', 'aria-label': 'On this page' });
    main.parentNode.insertBefore(top, main);
    main.parentNode.insertBefore(layout, main);
    layout.appendChild(side);
    layout.appendChild(wrap);
    wrap.appendChild(main);
    wrap.appendChild(toc);
    document.body.appendChild(el('div', { class: 'scrim' }));

    // headings -> ids + TOC
    var heads = main.querySelectorAll('h2, h3');
    var used = {};
    var tocHtml = '', inl = '';
    heads.forEach(function (h) {
      if (!h.id) { var s = slug(h.textContent); var base = s, k = 2; while (used[s] || document.getElementById(s)) s = base + '-' + (k++); h.id = s; }
      used[h.id] = 1;
      var text = h.textContent.replace(/#$/, '').trim();
      h.appendChild(el('a', { class: 'anchor', href: '#' + h.id, 'aria-hidden': 'true' }, '#'));
      tocHtml += '<a href="#' + h.id + '" class="' + (h.tagName === 'H3' ? 'lvl3' : 'lvl2') + '">' + text + '</a>';
      if (h.tagName === 'H2') inl += '<li><a href="#' + h.id + '">' + text + '</a></li>';
    });
    if (tocHtml) {
      toc.innerHTML = '<div class="toc-title">On this page</div>' + tocHtml;
      var h1 = main.querySelector('h1');
      var lead = main.querySelector('.lead');
      var anchorNode = lead || h1;
      if (anchorNode && inl) {
        var box = el('nav', { class: 'toc-inline', 'aria-label': 'On this page' }, '<div class="toc-title">On this page</div><ol>' + inl + '</ol>');
        anchorNode.parentNode.insertBefore(box, anchorNode.nextSibling);
      }
      // scroll spy
      if ('IntersectionObserver' in window) {
        var links = toc.querySelectorAll('a');
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
            }
          });
        }, { rootMargin: '-70px 0px -70% 0px' });
        heads.forEach(function (h) { obs.observe(h); });
      }
    }

    // prev / next
    if (idx >= 0) {
      var pager = el('nav', { class: 'pager', 'aria-label': 'Previous and next page' });
      if (idx > 0) pager.appendChild(el('a', { class: 'prev', href: PAGES[idx - 1].f }, '<small>← Previous</small>' + PAGES[idx - 1].t));
      if (idx < PAGES.length - 1) pager.appendChild(el('a', { class: 'next', href: PAGES[idx + 1].f }, '<small>Next →</small>' + PAGES[idx + 1].t));
      main.appendChild(pager);
    }
    main.appendChild(el('div', { class: 'page-foot' }, 'Research snapshot dated 2026-10-17. Numbers age fast — check the linked source before relying on them. Evidence tags: ' +
      '<span class="tag verified">Verified</span><span class="tag practice">Practice</span><span class="tag inference">Inference</span><span class="tag unverified">Unverified</span><span class="tag experimental">Experimental</span> — see <a href="sources.html#evidence-tags">what they mean</a>.'));

    // theme button
    var tb = document.getElementById('themeBtn');
    function label() { tb.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀ Light' : '☾ Dark'; }
    label();
    tb.addEventListener('click', function () {
      var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(t); try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
      label();
      document.dispatchEvent(new CustomEvent('themechange', { detail: t }));
    });

    // mobile nav
    document.getElementById('navToggle').addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
    document.querySelector('.scrim').addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    side.addEventListener('click', function (e) { if (e.target.closest('a')) document.body.classList.remove('nav-open'); });

    // copy buttons on prompt boxes
    main.querySelectorAll('.prompt-box').forEach(function (box) {
      var b = el('button', { class: 'icon-btn copy-btn', type: 'button' }, 'Copy');
      b.addEventListener('click', function () {
        var text = box.innerText.replace(/^Copy\s*/, '').replace(/\s*Copy(ied)?$/, '');
        var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1500); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(box.getAttribute('data-text') || text).then(done, function () { b.textContent = 'Select & Ctrl+C'; });
        else b.textContent = 'Select & Ctrl+C';
      });
      box.setAttribute('data-text', box.textContent.trim());
      box.appendChild(b);
    });

    // glossary filter
    var gs = document.getElementById('glossSearch');
    if (gs) gs.addEventListener('input', function () {
      var q = gs.value.toLowerCase();
      document.querySelectorAll('dl.gloss dt').forEach(function (dt) {
        var dd = dt.nextElementSibling;
        var hit = !q || (dt.textContent + ' ' + (dd ? dd.textContent : '')).toLowerCase().indexOf(q) >= 0;
        dt.style.display = hit ? '' : 'none'; if (dd) dd.style.display = hit ? '' : 'none';
      });
    });
  }

  // ---------- demo helpers (global: Demo) ----------
  var Demo = {
    THREE_VERSION: THREE_VERSION,
    THREE_CDN: THREE_CDN,
    hasWebGL: function (v2) {
      try {
        var c = document.createElement('canvas');
        var gl = v2 ? c.getContext('webgl2') : (c.getContext('webgl2') || c.getContext('webgl'));
        return !!gl;
      } catch (e) { return false; }
    },
    /** Show a clear failure message inside a demo stage. */
    fail: function (stage, title, detail) {
      if (typeof stage === 'string') stage = document.getElementById(stage);
      if (!stage) return;
      var old = stage.querySelector('.demo-msg'); if (old) old.remove();
      var m = el('div', { class: 'demo-msg', role: 'status' });
      m.innerHTML = '<div><strong>' + title + '</strong>' + detail + '</div>';
      stage.appendChild(m);
    },
    noWebGL: function (stage) {
      Demo.fail(stage, 'WebGL is not available',
        'Your browser or GPU driver did not give this page a WebGL context, so the live demo cannot run. ' +
        'Try an up-to-date Chrome, Edge, Firefox or Safari, check that hardware acceleration is enabled (Chrome/Edge: <code>chrome://gpu</code>), ' +
        'and read the text — every demo is also explained in prose.');
    },
    /** Load Three.js plus addons from the pinned CDN via the import map. Resolves to [THREE, addon1, addon2, ...]. */
    three: function (addons) {
      addons = addons || [];
      var all = [import('three')].concat(addons.map(function (a) { return import('three/addons/' + a); }));
      var timeout = new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout after 20 s')); }, 20000); });
      return Promise.race([Promise.all(all), timeout]);
    },
    /** Check WebGL, load Three.js + addons, then call fn(THREE, addonModules...). Every failure ends in a visible message. */
    runThree: function (stageId, addons, fn) {
      var stage = document.getElementById(stageId);
      if (!stage) return;
      if (!Demo.hasWebGL()) { Demo.noWebGL(stage); return; }
      var loading = document.createElement('div');
      loading.className = 'hud'; loading.textContent = 'loading Three.js r' + THREE_VERSION.split('.')[1] + ' from CDN…';
      stage.appendChild(loading);
      Demo.three(addons).then(function (mods) {
        loading.remove();
        Demo.guard(stage, function () { fn.apply(null, [stage].concat(mods)); });
      }, function (err) { loading.remove(); Demo.cdnFail(stage, err); });
    },
    cdnFail: function (stage, err) {
      Demo.fail(stage, 'Could not load the 3D library',
        'This demo loads Three.js r' + THREE_VERSION.split('.')[1] + ' from <code>unpkg.com</code>. You seem to be offline, or the CDN is blocked on this network' +
        (err && err.message ? ' (<code>' + String(err.message).replace(/</g, '&lt;').slice(0, 140) + '</code>)' : '') +
        '. The raw-WebGL demos on the <a href="04-shaders-sdf.html">shader</a> and <a href="07-ocean.html">ocean</a> pages work offline.');
    },
    /** Run start()/stop() when the element scrolls in/out of view (saves GPU and battery). */
    whenVisible: function (node, start, stop) {
      if (!('IntersectionObserver' in window)) { start(); return; }
      var on = false;
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !on) { on = true; start(); }
          else if (!e.isIntersecting && on) { on = false; stop(); }
        });
      }, { threshold: 0.05 }).observe(node);
    },
    /** Bind a range input to a label showing its value; returns a getter. */
    slider: function (id, fmt, onChange) {
      var input = document.getElementById(id);
      var out = document.getElementById(id + 'V');
      function upd() { if (out) out.textContent = fmt ? fmt(+input.value) : input.value; if (onChange) onChange(+input.value); }
      input.addEventListener('input', upd); upd();
      return function () { return +input.value; };
    },
    /** Simple FPS meter: call tick(now) each frame; returns the smoothed fps. */
    fpsMeter: function () {
      var last = 0, acc = 0, n = 0, fps = 0;
      return function (now) {
        if (last) { acc += now - last; n++; if (acc > 500) { fps = Math.round(1000 * n / acc); acc = 0; n = 0; } }
        last = now; return fps;
      };
    },
    /** Common Three.js setup: renderer in the stage, resize handling, visibility-paused loop.
        Returns { renderer, start(loopFn), resize(cb) }. loopFn(now, dt) is called each frame while visible. */
    threeStage: function (THREE, stage, opts) {
      opts = opts || {};
      var canvas = stage.querySelector('canvas') || stage.appendChild(document.createElement('canvas'));
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: opts.antialias !== false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxDpr || 1.5));
      var cbs = [];
      function size() {
        var w = stage.clientWidth || 640, h = stage.clientHeight || 360;
        renderer.setSize(w, h, false);
        cbs.forEach(function (cb) { cb(w, h); });
      }
      if ('ResizeObserver' in window) new ResizeObserver(size).observe(stage); else window.addEventListener('resize', size);
      canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); Demo.fail(stage, 'GPU context lost', 'The browser reset the GPU context (driver hiccup or too heavy a setting). Reload the page.'); });
      var api = {
        renderer: renderer, canvas: canvas,
        resize: function (cb) { cbs.push(cb); cb(stage.clientWidth || 640, stage.clientHeight || 360); },
        start: function (loop) {
          var last = 0;
          Demo.whenVisible(stage, function () {
            last = 0;
            renderer.setAnimationLoop(function (now) {
              var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
              try { loop(now, dt); } catch (e) { renderer.setAnimationLoop(null); console.warn(e); Demo.fail(stage, 'The demo hit an error', String(e && e.message || e)); }
            });
          }, function () { renderer.setAnimationLoop(null); });
        }
      };
      size();
      return api;
    },
    /** Window-level error -> visible message in the demo (instead of a silent black box). */
    guard: function (stage, fn) {
      try { return fn(); } catch (e) { console.warn(e); Demo.fail(stage, 'The demo hit an error', String(e && e.message || e)); }
    }
  };
  window.Demo = Demo;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildChrome);
  else buildChrome();
})();
