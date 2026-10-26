/* On-screen half of the lesson. Classic script, no imports. */
(function () {
  'use strict';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function mount(root, scene, mode) {
    clear(root);
    var wrap = el('div', 'scene ' + (mode || 'split'));
    var copy = el('div', 'copy');
    copy.appendChild(el('div', 'kicker', scene.chapter));
    copy.appendChild(el('h1', null, scene.title));
    if (scene.subtitle) copy.appendChild(el('p', 'sub', scene.subtitle));
    var extra = el('div', 'extra');
    copy.appendChild(extra);
    var viz = el('div', 'viz');
    if (mode === 'hero') {
      wrap.appendChild(viz);
      wrap.appendChild(copy);
    } else {
      wrap.appendChild(copy);
      wrap.appendChild(viz);
    }
    root.appendChild(wrap);
    return { wrap: wrap, extra: extra, viz: viz };
  }

  function fit(canvas) {
    var w = canvas.clientWidth || canvas.parentElement.clientWidth || 640;
    var h = canvas.clientHeight || canvas.parentElement.clientHeight || 640;
    var dpr = 1;
    var W = Math.max(2, Math.floor(w * dpr));
    var H = Math.max(2, Math.floor(h * dpr));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    return { w: W, h: H };
  }

  function glProgram(gl, vs, fs) {
    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(s);
        gl.deleteShader(s);
        throw new Error(log);
      }
      return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  function lose(gl) {
    var ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
  }

  function perspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ]);
  }

  function lookAt(eye, at) {
    var zx = eye[0] - at[0], zy = eye[1] - at[1], zz = eye[2] - at[2];
    var L = Math.hypot(zx, zy, zz) || 1;
    zx /= L; zy /= L; zz /= L;
    var xx = zz, xy = 0, xz = -zx;
    L = Math.hypot(xx, xy, xz) || 1;
    xx /= L; xy /= L; xz /= L;
    var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    return new Float32Array([
      xx, yx, zx, 0,
      xy, yy, zy, 0,
      xz, yz, zz, 0,
      -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
      -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
      -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
      1
    ]);
  }

  function beatIndex(beat, list) {
    var i = list.indexOf(String(beat));
    return i < 0 ? 0 : i;
  }

  function highlightCards(viz, beat) {
    var cards = viz.querySelectorAll('.card, .check, .stat, .ver, .row, .cell, .clip, .step');
    var all = beat === 'all';
    var idx = parseInt(beat, 10);
    cards.forEach(function (card, i) {
      var on = all || beat == null || (isNaN(idx) ? card.dataset.beat === beat : i <= idx);
      card.classList.toggle('on', on && (all || beat != null));
    });
  }

  var Visuals = {};

  Visuals.title = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      m.extra.appendChild(el('div', 'stack',
        '<div class="step" data-beat="clips"><div class="num">01</div><div><h3>The clip</h3><p>City, ocean, street. Same thumbnail, different machines.</p></div></div>' +
        '<div class="step" data-beat="claim"><div class="num">02</div><div><h3>The claim</h3><p>One short prompt. Often the opening line, not the work.</p></div></div>' +
        '<div class="step" data-beat="promise"><div class="num">03</div><div><h3>The inside</h3><p>Pixels, code, the graphics card, and the marketing.</p></div></div>'));
      m.viz.classList.add('flat');
      m.viz.appendChild(el('div', 'map',
        '<div class="cell"><h3>Code</h3><p>Triangles or math, redrawn every frame.</p></div>' +
        '<div class="cell"><h3>Capture</h3><p>A measured city. The agent wrote a camera.</p></div>' +
        '<div class="cell"><h3>Generated asset</h3><p>A mesh or a world from a network.</p></div>' +
        '<div class="cell"><h3>No geometry</h3><p>A video. Nothing to export.</p></div>'));
    },
    tick: function (root, ctx) {
      var steps = root.querySelectorAll('.stack .step');
      var b = ctx.beat;
      steps.forEach(function (s) {
        s.classList.toggle('on', b === 'promise' || s.dataset.beat === b || (b === 'open' && s.dataset.beat === 'clips'));
      });
    }
  };

  Visuals.clips = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      m.viz.classList.add('flat');
      m.viz.innerHTML = '<div class="clips">' +
        '<div class="clip" data-beat="code"><canvas id="cCode"></canvas><span>Code · live triangles</span></div>' +
        '<div class="clip" data-beat="scan"><canvas id="cScan"></canvas><span>Capture · someone else’s mesh</span></div>' +
        '<div class="clip" data-beat="video"><canvas id="cVid"></canvas><span>Video · pixels, no scene</span></div>' +
        '</div>';
    },
    tick: function (root, ctx) {
      var clips = root.querySelectorAll('.clip');
      clips.forEach(function (c) {
        c.classList.toggle('on', ctx.beat === 'all' || c.dataset.beat === ctx.beat);
      });
      drawClipCode(root.querySelector('#cCode'), ctx.local);
      drawClipScan(root.querySelector('#cScan'), ctx.local);
      drawClipVideo(root.querySelector('#cVid'), ctx.local);
    }
  };

  function drawClipCode(canvas, t) {
    if (!canvas) return;
    var s = fit(canvas), ctx = canvas.getContext('2d'), w = s.w, h = s.h;
    ctx.fillStyle = '#0e1624'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#142033'; ctx.fillRect(0, h * 0.72, w, h);
    for (var i = 0; i < 18; i++) {
      var x = (i / 18) * w + 8;
      var bh = h * (0.18 + ((i * 37) % 10) / 28);
      ctx.fillStyle = '#1d3a5c';
      ctx.fillRect(x, h * 0.72 - bh, w / 22, bh);
      ctx.fillStyle = 'rgba(232,176,96,' + (0.3 + 0.4 * Math.abs(Math.sin(t + i))) + ')';
      for (var k = 0; k < 4; k++) ctx.fillRect(x + 3, h * 0.72 - bh + 6 + k * 10, 6, 4);
    }
  }
  function drawClipScan(canvas, t) {
    if (!canvas) return;
    var s = fit(canvas), ctx = canvas.getContext('2d'), w = s.w, h = s.h;
    ctx.fillStyle = '#243044'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#8ea0b5';
    for (var i = 0; i < 12; i++) {
      var x = 10 + (i % 6) * (w / 6.4);
      var y = h * 0.28 + Math.floor(i / 6) * h * 0.22;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(x, y + Math.sin(t + i) * 2, w / 8, h * 0.16);
    }
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#d5dde6';
    ctx.fillRect(0, h * 0.2, w, 18);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#d7e2c8';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('logo  ·  data credits', 8, h - 10);
  }
  function drawClipVideo(canvas, t) {
    if (!canvas) return;
    var s = fit(canvas), ctx = canvas.getContext('2d'), w = s.w, h = s.h;
    var shift = Math.floor(t * 0.8) % 2;
    ctx.fillStyle = shift ? '#2a2033' : '#1b2430';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#c9a27a';
    ctx.fillRect(w * 0.2, h * 0.35, w * 0.5, h * 0.28);
    ctx.fillStyle = shift ? '#9bd0ff' : '#f2d48a';
    ctx.fillRect(w * 0.32, h * 0.42, w * 0.12, h * 0.1);
    ctx.strokeStyle = '#e8eef5';
    ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.font = '13px Inter, sans-serif';
    ctx.fillStyle = '#e8eef5';
    ctx.fillText(shift ? 'shot B · sign changed' : 'shot A · 4 seconds', 14, 26);
  }

  Visuals.question = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      m.extra.innerHTML = '<p class="sub" style="margin-top:8px">A frame is not a file on disk. It is a decision, repeated.</p>';
      var c = document.createElement('canvas');
      m.viz.appendChild(c);
      m.viz._canvas = c;
    },
    tick: function (root, ctx) {
      var canvas = root.querySelector('canvas');
      if (!canvas) return;
      var s = fit(canvas), g = canvas.getContext('2d'), w = s.w, h = s.h;
      g.fillStyle = '#141a22'; g.fillRect(0, 0, w, h);
      var cols = 24, rows = 12;
      var cw = w / cols, ch = (h * 0.62) / rows;
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var k = (x * 13 + y * 7) % 17 / 17;
          var lit = ctx.beat === 'grid' || ctx.beat === 'budget' || ((x + y) / (cols + rows)) < (ctx.local % 3) / 3;
          g.fillStyle = lit ? 'rgb(' + (40 + k * 180) + ',' + (70 + k * 80) + ',' + (90 + k * 40) + ')' : '#222a34';
          g.fillRect(x * cw + 1, 16 + y * ch + 1, cw - 2, ch - 2);
        }
      }
      g.fillStyle = '#9aa7b5';
      g.font = '16px Inter, sans-serif';
      g.fillText('one frame  ·  each cell is a color someone had to choose', 16, h * 0.70);
      var budget = ctx.beat === 'budget' ? Math.min(1, (ctx.local % 2) / 1.4) : 0.35;
      g.fillStyle = '#283140';
      g.fillRect(16, h * 0.78, w - 32, 18);
      g.fillStyle = budget > 0.92 ? '#e09a8e' : '#e4a15a';
      g.fillRect(16, h * 0.78, (w - 32) * budget, 18);
      g.fillStyle = '#eef2f6';
      g.fillText('17 ms budget', 16, h * 0.78 - 8);
    }
  };

  Visuals.cards = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      var cards = scene.cards || [];
      var cls = 'cards n' + (cards.length === 4 ? '4' : '3');
      var html = cards.map(function (c, i) {
        return '<div class="card" data-i="' + i + '"><h3>' + c.h + '</h3><p>' + c.p + '</p></div>';
      }).join('');
      m.viz.classList.add('flat');
      m.viz.appendChild(el('div', cls, html));
    },
    tick: function (root, ctx) { highlightCards(root.querySelector('.viz'), ctx.beat); }
  };
  Visuals.meanings = Visuals.cards;
  Visuals.routes = Visuals.cards;

  Visuals.checks = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      var html = (scene.checks || []).map(function (c, i) {
        return '<div class="check" data-i="' + i + '"><i></i><span>' + c + '</span></div>';
      }).join('');
      m.viz.classList.add('flat');
      m.viz.appendChild(el('div', 'checks', html));
    },
    tick: function (root, ctx) {
      var idx = parseInt(ctx.beat, 10);
      root.querySelectorAll('.check').forEach(function (n, i) {
        n.classList.toggle('on', !isNaN(idx) && i <= idx);
      });
    }
  };

  Visuals.code = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      var html = (scene.code || []).map(function (row) {
        return '<span class="ln" data-beat="' + row[0] + '">  ' + escapeHtml(row[1]) + '</span>';
      }).join('');
      m.viz.appendChild(el('div', 'editor', html));
      m.extra.innerHTML = '<div class="chip" id="here">renderer</div><p class="sub">The file is a tour. The picture is what the tour is for.</p>';
    },
    tick: function (root, ctx) {
      var beat = ctx.beat || 'renderer';
      root.querySelectorAll('.ln').forEach(function (n) {
        n.classList.toggle('on', n.dataset.beat === beat);
      });
      var here = root.querySelector('#here');
      if (here) here.textContent = 'you are here · ' + beat;
    }
  };

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function mountSteps(root, scene, vertical) {
    var m = mount(root, scene, 'split');
    var steps = scene.steps || [];
    var html = steps.map(function (s, i) {
      return '<div class="step"><div class="' + (vertical ? 'num' : 'n') + '">' + (vertical ? String(i).padStart(2, '0') : String(i + 1).padStart(2, '0')) + '</div>' +
        (vertical ? '<div>' : '') +
        '<h3>' + s.h + '</h3><p>' + s.p + '</p>' +
        (vertical ? '</div>' : '<i class="token" hidden></i>') +
        '</div>';
    }).join('');
    m.viz.classList.add('flat');
    m.viz.appendChild(el('div', vertical ? 'stack' : 'rail', html));
  }

  Visuals.pipeline = {
    enter: function (root, scene) { mountSteps(root, scene, false); },
    tick: function (root, ctx) {
      var idx = parseInt(ctx.beat, 10);
      if (isNaN(idx)) idx = 0;
      root.querySelectorAll('.step').forEach(function (n, i) {
        n.classList.toggle('on', i <= idx);
        var token = n.querySelector('.token');
        if (token) token.hidden = i !== idx;
      });
    }
  };

  Visuals.agentloop = {
    enter: function (root, scene) { mountSteps(root, scene, false); },
    tick: Visuals.pipeline.tick
  };

  Visuals.steps = {
    enter: function (root, scene) { mountSteps(root, scene, true); },
    tick: function (root, ctx) {
      var idx = parseInt(ctx.beat, 10);
      if (isNaN(idx)) idx = 0;
      root.querySelectorAll('.step').forEach(function (n, i) {
        n.classList.toggle('on', i <= idx);
      });
    }
  };

  Visuals.graph = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      m.extra.innerHTML =
        '<div class="stack">' +
        '<div class="step on"><div class="num">scene</div><div><h3>orbit group, spinning</h3><p>An empty parent. Its only job is to rotate.</p></div></div>' +
        '<div class="step on"><div class="num">child</div><div><h3>planet</h3><p>Carried by the group. Spins on its own axis.</p></div></div>' +
        '<div class="step on"><div class="num">child</div><div><h3>moon</h3><p>Local offset. The world position is the product.</p></div></div>' +
        '</div>';
      var c = document.createElement('canvas');
      m.viz.appendChild(c);
    },
    tick: function (root, ctx) {
      var canvas = root.querySelector('canvas');
      if (!canvas) return;
      var s = fit(canvas), g = canvas.getContext('2d'), w = s.w, h = s.h;
      g.fillStyle = '#141a22'; g.fillRect(0, 0, w, h);
      var cx = w * 0.48, cy = h * 0.52, R = Math.min(w, h) * 0.30;
      g.strokeStyle = '#3c4a5c'; g.lineWidth = 1.5;
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#e4a15a'; g.beginPath(); g.arc(cx, cy, 16, 0, Math.PI * 2); g.fill();
      var a = ctx.local * 0.55;
      var px = cx + Math.cos(a) * R, py = cy + Math.sin(a) * R;
      g.fillStyle = '#7dcec4'; g.beginPath(); g.arc(px, py, 22, 0, Math.PI * 2); g.fill();
      var spin = ctx.local * 1.4;
      g.strokeStyle = '#10312e'; g.beginPath();
      g.moveTo(px, py); g.lineTo(px + Math.cos(spin) * 22, py + Math.sin(spin) * 22); g.stroke();
      var mx = px + Math.cos(a * 2.2) * 48, my = py + Math.sin(a * 2.2) * 48;
      g.fillStyle = '#e8eef5'; g.beginPath(); g.arc(mx, my, 8, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#9aa7b5'; g.font = '16px Inter, sans-serif';
      g.fillText('group rotation', cx - 40, cy - R - 12);
      g.fillText('moon’s local offset', mx + 12, my);
      if (ctx.beat === 'units') {
        g.fillStyle = '#e4a15a';
        g.fillText('1 unit = 1 meter   ·   person 1.7   ·   floor ~3', 20, h - 24);
      } else if (ctx.beat === 'matrix') {
        g.fillStyle = '#e4a15a';
        g.fillText('world = scene × group × planet × moon', 20, h - 24);
      }
    }
  };

  Visuals.frustum = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      m.extra.innerHTML = '<div class="chip" id="lens">field of view</div><p class="note" id="warn" hidden>Distant surfaces start to share the same depth. That flicker is z-fighting.</p>';
      var c = document.createElement('canvas');
      m.viz.appendChild(c);
    },
    tick: function (root, ctx) {
      var canvas = root.querySelector('canvas');
      if (!canvas) return;
      var s = fit(canvas), g = canvas.getContext('2d'), w = s.w, h = s.h;
      var tele = ctx.beat === 'tele';
      var zf = ctx.beat === 'zfight';
      var fov = tele ? 26 : 68;
      var near = zf ? 18 : 70;
      var far = zf ? w - 30 : w - 80;
      g.fillStyle = '#141a22'; g.fillRect(0, 0, w, h);
      var eyeX = 50, eyeY = h * 0.55;
      var half = Math.tan((fov * Math.PI / 180) / 2) * (far - eyeX) * 0.55;
      var halfN = half * ((near - eyeX) / (far - eyeX));
      g.fillStyle = 'rgba(228,161,90,0.18)';
      g.beginPath();
      g.moveTo(eyeX, eyeY);
      g.lineTo(far, eyeY - half);
      g.lineTo(far, eyeY + half);
      g.closePath();
      g.fill();
      g.strokeStyle = '#e4a15a'; g.lineWidth = 2; g.stroke();
      g.strokeStyle = '#7dcec4';
      g.beginPath();
      g.moveTo(near, eyeY - halfN); g.lineTo(near, eyeY + halfN); g.stroke();
      g.fillStyle = '#9aa7b5'; g.font = '15px Inter, sans-serif';
      g.fillText('near', near - 16, eyeY - halfN - 8);
      g.fillText('far', far - 20, eyeY - half - 8);
      g.fillStyle = '#eef2f6'; g.font = '18px Inter, sans-serif';
      g.fillText(fov.toFixed(0) + '°  vertical field of view', 20, 32);
      for (var i = 0; i < 5; i++) {
        var x = near + 30 + i * ((far - near - 50) / 5);
        var flicker = zf && i > 2 && Math.floor(ctx.local * 6) % 2 === 0;
        g.fillStyle = flicker ? '#e09a8e' : '#8eb4e8';
        g.fillRect(x, eyeY - 16 - i * 4, 18, 28 + i * 6);
      }
      var lens = root.querySelector('#lens');
      var warn = root.querySelector('#warn');
      if (lens) lens.textContent = tele ? 'telephoto  ·  the city compresses' : (zf ? 'near too close, far too far' : 'a walkable lens');
      if (warn) warn.hidden = !zf;
    }
  };

  Visuals.stats = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      var html = (scene.stats || []).map(function (s, i) {
        return '<div class="stat" data-i="' + i + '"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div></div>';
      }).join('');
      m.viz.classList.add('flat');
      m.viz.appendChild(el('div', 'stats', html));
      m.extra.innerHTML = '<p class="note">Correlations from one benchmark. Not a proof of cause. The hint is still the best public one: look early.</p>';
    },
    tick: function (root, ctx) {
      var idx = parseInt(ctx.beat, 10);
      root.querySelectorAll('.stat').forEach(function (n, i) {
        n.classList.toggle('on', isNaN(idx) || i <= idx);
      });
    }
  };

  Visuals.versions = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      var html = (scene.versions || []).map(function (v) {
        return '<div class="ver"><b>' + v.v + '</b><div><div class="bar"></div><div style="margin-top:6px">' + v.p + '</div></div></div>';
      }).join('');
      m.viz.classList.add('flat');
      m.viz.appendChild(el('div', 'versions', html));
    },
    tick: function (root, ctx) {
      var idx = parseInt(ctx.beat, 10);
      if (isNaN(idx)) idx = 0;
      root.querySelectorAll('.ver').forEach(function (n, i) { n.classList.toggle('on', i <= idx); });
    }
  };

  Visuals.ledger = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      m.viz.classList.add('flat');
      m.viz.innerHTML = '<div class="ledger">' +
        '<div class="row" data-beat="fact"><b>Geometry</b><span>The model is a poor modeler. Settings carry the look.</span></div>' +
        '<div class="row" data-beat="cc0"><b>CC0 ledger</b><span>Poly Haven · ambientCG · Kenney. If it is not listed, it is not in the scene.</span></div>' +
        '<div class="row" data-beat="google"><b>Google tiles</b><span>Logo and credits. No cache. Promo video ≤ 30 seconds.</span></div>' +
        '<div class="row" data-beat="inria"><b>Inria splats</b><span>Research license. Non-commercial. A famous repo is not permission.</span></div>' +
        '<div class="row" data-beat="hunyuan"><b>Hunyuan3D</b><span>License excludes the EU, the UK, and South Korea.</span></div>' +
        '</div>';
    },
    tick: function (root, ctx) {
      var order = ['fact', 'cc0', 'google', 'inria', 'hunyuan'];
      var idx = order.indexOf(ctx.beat);
      if (idx < 0) idx = 0;
      root.querySelectorAll('.row').forEach(function (n, i) { n.classList.toggle('on', i <= idx); });
    }
  };

  Visuals.map = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      m.viz.classList.add('flat');
      m.viz.innerHTML = '<div class="map">' +
        '<div class="cell" data-beat="families"><h3>Four families</h3><p>Code, capture, a generated asset, or a video with nothing behind it.</p></div>' +
        '<div class="cell" data-beat="inside"><h3>Inside a frame</h3><p>Loop, tree of matrices, camera pyramid, metal and roughness, draw calls.</p></div>' +
        '<div class="cell" data-beat="recipes"><h3>Two recipes</h3><p>Fresnel and Gerstner. A grid, a seed, shader windows, bloom on a leash.</p></div>' +
        '<div class="cell" data-beat="agent"><h3>Eyes</h3><p>The screenshot loop. One prompt starts it. No code means an ad.</p></div>' +
        '</div>';
    },
    tick: function (root, ctx) {
      var order = ['families', 'inside', 'recipes', 'agent', 'guide'];
      var idx = order.indexOf(ctx.beat);
      var all = ctx.beat === 'all' || ctx.beat === 'guide' || idx < 0;
      root.querySelectorAll('.cell').forEach(function (n, i) {
        n.classList.toggle('on', all || i <= idx);
      });
    }
  };

  Visuals.calls = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      m.viz.classList.add('flat');
      m.viz.innerHTML = '<div class="meters">' +
        '<div class="meter" id="mMany"><h3>One mesh per building</h3><div class="big">30,000</div><p>draw calls. The frame is spent starting work, not shading it.</p><div class="barline"><i></i></div></div>' +
        '<div class="meter good" id="mOne"><h3>One instanced mesh</h3><div class="big">3</div><p>draw calls. Heights and lit windows live in a buffer, not in extra objects.</p><div class="barline"><i></i></div></div>' +
        '</div>';
      m.extra.innerHTML = '<div class="chip" id="hud">HUD  ·  60 fps  ·  — calls</div><p class="sub">The screenshot has to carry the number. The source will not confess a stall.</p>';
    },
    tick: function (root, ctx) {
      var many = ctx.beat === 'many';
      root.querySelector('#mMany').classList.toggle('on', many || ctx.beat == null);
      root.querySelector('#mOne').classList.toggle('on', !many);
      var hud = root.querySelector('#hud');
      if (hud) hud.textContent = many ? 'HUD  ·  12 fps  ·  30000 calls' : 'HUD  ·  60 fps  ·  3 calls';
    }
  };

  Visuals.walk = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      var c = document.createElement('canvas');
      m.viz.appendChild(c);
      m.extra.innerHTML = '<div class="chip" id="mode">flyover</div>';
    },
    tick: function (root, ctx) {
      var canvas = root.querySelector('canvas');
      if (!canvas) return;
      var s = fit(canvas), g = canvas.getContext('2d'), w = s.w, h = s.h;
      g.fillStyle = '#141a22'; g.fillRect(0, 0, w, h);
      var ground = h * 0.72;
      g.fillStyle = '#1e2833'; g.fillRect(0, ground, w, h - ground);
      g.fillStyle = '#2a3848';
      for (var i = 0; i < 6; i++) g.fillRect(40 + i * (w / 6.5), ground - 40 - ((i * 29) % 50), w / 10, 40 + ((i * 29) % 50));
      var walk = ctx.beat === 'body' || ctx.beat === 'script';
      var x = walk ? (80 + (ctx.local * 46) % (w - 160)) : w * 0.25 + Math.sin(ctx.local * 0.4) * 20;
      if (!walk) {
        g.strokeStyle = '#e4a15a'; g.lineWidth = 2; g.beginPath();
        for (var k = 0; k <= 40; k++) {
          var u = k / 40;
          var px = 40 + u * (w - 80);
          var py = ground - 120 - Math.sin(u * Math.PI) * 80;
          if (k === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.stroke();
        x = 40 + ((ctx.local * 0.08) % 1) * (w - 80);
        var u2 = (x - 40) / (w - 80);
        var y = ground - 120 - Math.sin(u2 * Math.PI) * 80;
        g.fillStyle = '#e4a15a'; g.beginPath(); g.arc(x, y, 7, 0, Math.PI * 2); g.fill();
      } else {
        g.strokeStyle = '#7dcec4'; g.lineWidth = 2;
        g.strokeRect(x - 14, ground - 78, 28, 52);
        g.beginPath(); g.arc(x, ground - 78, 14, Math.PI, 0); g.stroke();
        g.fillStyle = '#e09a8e'; g.beginPath(); g.arc(x + 18, ground - 64, 3, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#9aa7b5'; g.font = '14px Inter, sans-serif';
        g.fillText('eye 1.7 m', x + 24, ground - 64);
        g.fillText('1.4 m/s', x - 16, ground + 22);
      }
      if (ctx.beat === 'script') {
        g.setLineDash([6, 5]); g.strokeStyle = '#e4a15a';
        g.beginPath(); g.moveTo(60, ground - 8); g.lineTo(w - 40, ground - 8); g.stroke();
        g.setLineDash([]);
        g.fillStyle = '#e4a15a'; g.font = '16px JetBrains Mono, monospace';
        g.fillText('?cam=street   ?t=12   ?seed=3', 24, 36);
      }
      var mode = root.querySelector('#mode');
      if (mode) mode.textContent = walk ? (ctx.beat === 'script' ? 'scripted walk · a test can drive it' : 'a body · capsule, gravity, octree') : 'flyover · camera on a spline';
    }
  };

  /* ---------- PBR spheres ---------- */
  var PBR_FS = [
    'precision highp float;',
    'uniform vec2 uRes; uniform float uTime; uniform float uEnv;',
    'vec3 sky(vec3 r){',
    '  vec3 col = mix(vec3(0.08,0.09,0.11), vec3(0.62,0.72,0.82), smoothstep(-0.15,0.55,r.y));',
    '  float sun = pow(max(dot(r, normalize(vec3(0.4,0.25,0.2))), 0.0), 50.0);',
    '  return col + vec3(1.0,0.85,0.55) * sun;',
    '}',
    'vec3 shade(vec3 n, vec3 v, float metal, float rough, vec3 albedo){',
    '  vec3 l = normalize(vec3(0.45, 0.85, 0.35));',
    '  vec3 halfv = normalize(l + v);',
    '  float ndl = max(dot(n, l), 0.0);',
    '  float specP = mix(8.0, 220.0, 1.0 - rough);',
    '  vec3 F0 = mix(vec3(0.04), albedo, metal);',
    '  vec3 spec = F0 * pow(max(dot(n, halfv), 0.0), specP) * ndl;',
    '  vec3 diff = albedo * (1.0 - metal) * (0.15 + 0.85 * ndl);',
    '  vec3 r = reflect(-v, n);',
    '  float fres = pow(1.0 - max(dot(n, v), 0.0), 5.0);',
    '  vec3 env = sky(r) * mix(F0, vec3(1.0), fres);',
    '  env = mix(env, env * 0.25, rough);',
    '  return diff * max(uEnv, 0.15) + spec + env * uEnv;',
    '}',
    'float hit(vec3 ro, vec3 rd, vec3 c, float rad, out vec3 n, out vec3 p){',
    '  vec3 oc = ro - c; float b = dot(oc, rd); float h = b*b - (dot(oc,oc) - rad*rad);',
    '  if (h < 0.0) return -1.0;',
    '  float t = -b - sqrt(h);',
    '  if (t < 0.0) return -1.0;',
    '  p = ro + rd * t; n = normalize(p - c); return t;',
    '}',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy / uRes) * 2.0 - 1.0; uv.x *= uRes.x / uRes.y;',
    '  vec3 ro = vec3(0.0, 0.2, 4.6);',
    '  vec3 rd = normalize(vec3(uv * 0.72, -1.35));',
    '  vec3 col = sky(rd) * 0.45;',
    '  vec3 n; vec3 p; float t;',
    '  t = hit(ro, rd, vec3(-1.65, 0.0, 0.0), 0.42, n, p);',
    '  if (t > 0.0) col = shade(n, normalize(ro - p), 0.0, 0.72, vec3(0.20, 0.34, 0.62));',
    '  t = hit(ro, rd, vec3(-0.55, 0.0, 0.0), 0.42, n, p);',
    '  if (t > 0.0) col = shade(n, normalize(ro - p), 0.0, 0.06, vec3(0.20, 0.34, 0.62));',
    '  t = hit(ro, rd, vec3(0.55, 0.0, 0.0), 0.42, n, p);',
    '  if (t > 0.0) col = shade(n, normalize(ro - p), 1.0, 0.42, vec3(0.96, 0.74, 0.45));',
    '  t = hit(ro, rd, vec3(1.65, 0.0, 0.0), 0.42, n, p);',
    '  if (t > 0.0) col = shade(n, normalize(ro - p), 1.0, 0.04, vec3(0.96, 0.74, 0.45));',
    '  gl_FragColor = vec4(pow(col, vec3(0.92)), 1.0);',
    '}'
  ].join('\n');

  Visuals.pbr = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'hero');
      var canvas = document.createElement('canvas');
      m.viz.appendChild(canvas);
      m.viz.insertAdjacentHTML('beforeend',
        '<div class="labels"><div><b>Rough plastic</b>scattered</div><div><b>Smooth plastic</b>dim reflection</div><div><b>Rough metal</b>blurred world</div><div><b>Smooth metal</b>the world, tinted</div></div>');
      var gl = canvas.getContext('webgl', { antialias: false, alpha: false });
      if (!gl) { m.viz.appendChild(el('p', 'sub', 'WebGL unavailable')); return; }
      try {
        var prog = glProgram(gl, 'attribute vec2 a; void main(){ gl_Position = vec4(a,0.0,1.0); }', PBR_FS);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        var loc = gl.getAttribLocation(prog, 'a');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        root._gl = { gl: gl, prog: prog, canvas: canvas };
        root._cleanup = function () { lose(gl); };
      } catch (err) {
        m.viz.appendChild(el('p', 'sub', 'Shader: ' + err.message));
      }
    },
    tick: function (root, ctx) {
      var st = root._gl;
      if (!st) return;
      var gl = st.gl;
      fit(st.canvas);
      gl.viewport(0, 0, st.canvas.width, st.canvas.height);
      gl.useProgram(st.prog);
      gl.uniform2f(gl.getUniformLocation(st.prog, 'uRes'), st.canvas.width, st.canvas.height);
      gl.uniform1f(gl.getUniformLocation(st.prog, 'uTime'), ctx.local);
      var env = ctx.beat === 'black' ? 0.0 : 1.0;
      gl.uniform1f(gl.getUniformLocation(st.prog, 'uEnv'), env);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  };

  /* ---------- raymarch inset ---------- */
  var MARCH_FS = [
    'precision highp float;',
    'uniform vec2 uRes; uniform float uTime;',
    'float sdBox(vec3 p, vec3 b){ vec3 q = abs(p)-b; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0); }',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }',
    'float map(vec3 p){',
    '  vec2 id = floor((p.xz + vec2(1.2)) / 2.4);',
    '  vec3 q = p; q.xz = mod(q.xz + 1.2, 2.4) - 1.2;',
    '  float h = 0.25 + 1.3 * hash(id);',
    '  return sdBox(q - vec3(0.0, h*0.5 - 0.2, 0.0), vec3(0.55, h*0.5, 0.55));',
    '}',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy / uRes) * 2.0 - 1.0; uv.x *= uRes.x/uRes.y;',
    '  vec3 ro = vec3(sin(uTime*0.15)*2.0, 1.3, 3.2);',
    '  vec3 ww = normalize(vec3(0.0,0.4,0.0) - ro);',
    '  vec3 uu = normalize(cross(vec3(0,1,0), ww));',
    '  vec3 vv = cross(ww, uu);',
    '  vec3 rd = normalize(uv.x*uu + uv.y*vv + 1.6*ww);',
    '  float t = 0.0; float hit = 0.0;',
    '  for (int i = 0; i < 40; i++) {',
    '    float d = map(ro + rd * t);',
    '    if (d < 0.01) { hit = 1.0; break; }',
    '    t += d;',
    '    if (t > 24.0) break;',
    '  }',
    '  vec3 col = mix(vec3(0.55,0.68,0.82), vec3(0.08,0.10,0.14), smoothstep(0.0,0.7,rd.y));',
    '  if (hit > 0.5) {',
    '    vec3 p = ro + rd * t;',
    '    vec2 e = vec2(0.02, 0.0);',
    '    vec3 n = normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx)));',
    '    float diff = 0.35 + 0.65 * max(dot(n, normalize(vec3(0.4,0.8,0.3))), 0.0);',
    '    float win = step(0.62, hash(floor(p.xy * 6.0))) * step(0.15, n.z*n.z + n.x*n.x);',
    '    vec3 base = vec3(0.16,0.18,0.22) * diff;',
    '    col = mix(base, vec3(0.95,0.78,0.45), win * 0.85);',
    '  }',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  Visuals.shader = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'split');
      m.extra.innerHTML = '<div class="chip" id="sh">vertex + fragment</div><p class="sub" id="shNote">Built-in materials are these two programs, written for you.</p>';
      var canvas = document.createElement('canvas');
      m.viz.appendChild(canvas);
      var gl = canvas.getContext('webgl', { antialias: false, alpha: false });
      if (!gl) return;
      try {
        var prog = glProgram(gl, 'attribute vec2 a; void main(){ gl_Position = vec4(a,0.0,1.0); }', MARCH_FS);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        var loc = gl.getAttribLocation(prog, 'a');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        root._gl = { gl: gl, prog: prog, canvas: canvas };
        root._cleanup = function () { lose(gl); };
      } catch (err) {
        m.extra.insertAdjacentHTML('beforeend', '<p class="note">' + err.message + '</p>');
      }
    },
    tick: function (root, ctx) {
      var note = root.querySelector('#sh');
      var copy = {
        pair: ['vertex + fragment', 'Every material is a pair of small programs.'],
        sdf: ['signed distance', 'One number: how far is this point from the surface?'],
        march: ['raymarch', 'Step forward by that distance until you hit.'],
        city: ['repeat the box', 'One building, repeated, is a city. The pattern never ends.'],
        license: ['license', 'A pasted Shadertoy classic is not a free product asset.']
      };
      var pair = copy[ctx.beat] || copy.pair;
      if (note) note.textContent = pair[0];
      var shNote = root.querySelector('#shNote');
      if (shNote) shNote.textContent = pair[1];
      var st = root._gl;
      if (!st) return;
      var gl = st.gl;
      if (!st.sized && st.canvas.clientWidth > 0) {
        st.canvas.width = Math.max(2, Math.floor(st.canvas.clientWidth / 2));
        st.canvas.height = Math.max(2, Math.floor(st.canvas.clientHeight / 2));
        st.sized = true;
      }
      var W = st.canvas.width, H = st.canvas.height;
      gl.viewport(0, 0, W, H);
      gl.useProgram(st.prog);
      gl.uniform2f(gl.getUniformLocation(st.prog, 'uRes'), W, H);
      gl.uniform1f(gl.getUniformLocation(st.prog, 'uTime'), ctx.local);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  };

  /* ---------- ocean ---------- */
  var SKY_FN = [
    'vec3 skyCol(vec3 rd){',
    '  vec3 hor = vec3(0.86,0.62,0.42);',
    '  vec3 zen = vec3(0.18,0.32,0.58);',
    '  vec3 col = mix(hor, zen, clamp(rd.y * 1.4, 0.0, 1.0));',
    '  vec3 sun = normalize(vec3(0.15, 0.08, -1.0));',
    '  float s = max(dot(rd, sun), 0.0);',
    '  col += vec3(1.0,0.78,0.45) * (pow(s, 900.0) * 6.0 + pow(s, 8.0) * 0.35);',
    '  return col;',
    '}'
  ].join('\n');

  var OCEAN_VS = [
    'precision highp float;',
    'attribute vec2 aGrid;',
    'uniform mat4 uProj; uniform mat4 uView; uniform float uTime; uniform float uGerstner; uniform float uAmp;',
    'varying vec3 vPos; varying vec3 vN; varying float vFold;',
    'void wave(inout vec3 p, inout vec3 n, inout float fold, vec2 p0, vec2 dir, float k, float A){',
    '  float omega = sqrt(9.81 * k);',
    '  float Q = uGerstner * 0.45 / (k * A * 4.0);',
    '  float f = k * dot(dir, p0) - omega * uTime;',
    '  float S = sin(f); float C = cos(f);',
    '  p.x += Q * A * dir.x * C; p.z += Q * A * dir.y * C; p.y += A * S;',
    '  float WA = k * A;',
    '  n.x -= dir.x * WA * C; n.z -= dir.y * WA * C; n.y -= Q * WA * S;',
    '  fold -= Q * WA * S;',
    '}',
    'void main(){',
    '  vec2 p0 = aGrid * vec2(70.0, 90.0);',
    '  vec3 p = vec3(p0.x, 0.0, p0.y);',
    '  vec3 n = vec3(0.0, 1.0, 0.0);',
    '  float fold = 1.0;',
    '  wave(p,n,fold,p0, normalize(vec2(1.0,0.3)), 0.18, 0.55 * uAmp);',
    '  wave(p,n,fold,p0, normalize(vec2(-0.4,1.0)), 0.27, 0.38 * uAmp);',
    '  wave(p,n,fold,p0, normalize(vec2(0.2,-1.0)), 0.41, 0.22 * uAmp);',
    '  wave(p,n,fold,p0, normalize(vec2(1.0,-0.2)), 0.73, 0.12 * uAmp);',
    '  vPos = p; vN = normalize(n); vFold = fold;',
    '  gl_Position = uProj * uView * vec4(p, 1.0);',
    '}'
  ].join('\n');

  var OCEAN_FS = [
    'precision highp float;',
    'uniform vec3 uEye; uniform float uFlatN; uniform float uFoam;',
    'varying vec3 vPos; varying vec3 vN; varying float vFold;',
    SKY_FN,
    'void main(){',
    '  vec3 n = normalize(mix(vN, vec3(0.0,1.0,0.0), uFlatN));',
    '  if (uFlatN > 0.5) {',
    '    float rip = sin(vPos.x * 0.8 + vPos.z * 0.5) * 0.08;',
    '    n = normalize(vec3(rip, 1.0, rip * 0.6));',
    '  }',
    '  vec3 v = normalize(uEye - vPos);',
    '  float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, v), 0.0), 5.0);',
    '  vec3 r = reflect(-v, n); r.y = abs(r.y);',
    '  vec3 deep = vec3(0.02, 0.08, 0.10);',
    '  vec3 col = mix(deep, skyCol(r), fres);',
    '  vec3 sun = normalize(vec3(0.15, 0.08, -1.0));',
    '  vec3 h = normalize(sun + v);',
    '  col += vec3(1.0, 0.85, 0.6) * pow(max(dot(n, h), 0.0), 350.0) * 4.0;',
    '  if (uFoam > 0.5) {',
    '    float foam = smoothstep(0.55, 0.05, vFold);',
    '    col = mix(col, vec3(0.92, 0.93, 0.9), foam * 0.75);',
    '  }',
    '  float dist = length(vPos.xz - uEye.xz);',
    '  vec3 hz = vec3(0.0, 0.02, -1.0);',
    '  col = mix(col, skyCol(normalize(hz)), smoothstep(35.0, 120.0, dist));',
    '  col = 1.0 - exp(-col * 1.35);',
    '  col = pow(max(col, 0.0), vec3(1.0/2.2));',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var SKY_VS = 'attribute vec2 a; varying vec2 vUv; void main(){ vUv = a; gl_Position = vec4(a, 0.999, 1.0); }';
  var SKY_FS = [
    'precision highp float; varying vec2 vUv;',
    'uniform vec3 uU; uniform vec3 uV; uniform vec3 uW; uniform vec2 uTan;',
    SKY_FN,
    'void main(){',
    '  vec3 rd = normalize(uW + vUv.x * uTan.x * uU + vUv.y * uTan.y * uV);',
    '  rd.y = max(rd.y, 0.0);',
    '  vec3 col = skyCol(normalize(rd));',
    '  col = 1.0 - exp(-col * 1.35);',
    '  gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), 1.0);',
    '}'
  ].join('\n');

  function oceanGrid() {
    var N = 56;
    var pos = new Float32Array(N * N * 2);
    var idx = new Uint16Array((N - 1) * (N - 1) * 6);
    var p = 0;
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        pos[p++] = (x / (N - 1)) * 2 - 1;
        pos[p++] = (y / (N - 1)) * 2 - 1;
      }
    }
    var k = 0;
    for (y = 0; y < N - 1; y++) {
      for (x = 0; x < N - 1; x++) {
        var i = y * N + x;
        idx[k++] = i; idx[k++] = i + 1; idx[k++] = i + N;
        idx[k++] = i + 1; idx[k++] = i + N + 1; idx[k++] = i + N;
      }
    }
    return { pos: pos, idx: idx, count: k };
  }

  Visuals.ocean = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'hero');
      var canvas = document.createElement('canvas');
      m.viz.appendChild(canvas);
      m.extra.innerHTML = '<div class="chip" id="rung">rung</div>';
      var gl = canvas.getContext('webgl', { antialias: true, alpha: false });
      if (!gl) return;
      try {
        var prog = glProgram(gl, OCEAN_VS, OCEAN_FS);
        var sky = glProgram(gl, SKY_VS, SKY_FS);
        var grid = oceanGrid();
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, grid.pos, gl.STATIC_DRAW);
        var ib = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, grid.idx, gl.STATIC_DRAW);
        var tri = gl.createBuffer();
        root._ocean = { gl: gl, prog: prog, sky: sky, canvas: canvas, count: grid.count, buf: buf, ib: ib, tri: tri };
        root._cleanup = function () { lose(gl); };
        gl.bindBuffer(gl.ARRAY_BUFFER, tri);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      } catch (err) {
        m.extra.insertAdjacentHTML('beforeend', '<p class="note">' + String(err.message).slice(0, 280) + '</p>');
      }
    },
    tick: function (root, ctx) {
      var names = {
        flat: 'rung 1 · flat water, Fresnel still applies',
        fresnel: 'Fresnel · mirror at the horizon, color at your feet',
        normal: 'rung 2 · a normal map. The silhouette is still flat.',
        sine: 'sines · up and down only. Jelly crests.',
        gerstner: 'Gerstner · sideways push. Crests sharpen.',
        foam: 'foam · the surface folding, not a sticker',
        sun: 'one sun for the sky and the water'
      };
      var chip = root.querySelector('#rung');
      if (chip) chip.textContent = names[ctx.beat] || names.flat;
      var st = root._ocean;
      if (!st) return;
      var gl = st.gl;
      var box = fit(st.canvas);
      gl.viewport(0, 0, box.w, box.h);
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0.55, 0.62, 0.75, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      var eye, at;
      if (ctx.beat === 'flat' || ctx.beat === 'fresnel' || ctx.beat === 'normal') {
        eye = [0, 6, 22]; at = [0, 1.2, -10];
      } else {
        var a = ctx.local * 0.12;
        eye = [Math.sin(a) * 16, 5.5, 18 + Math.cos(a) * 4];
        at = [0, 0.4, -6];
      }
      var proj = perspective(48 * Math.PI / 180, box.w / box.h, 0.2, 250);
      var view = lookAt(eye, at);
      gl.disable(gl.DEPTH_TEST);
      gl.useProgram(st.sky);
      gl.bindBuffer(gl.ARRAY_BUFFER, st.tri);
      var sl = gl.getAttribLocation(st.sky, 'a');
      gl.enableVertexAttribArray(sl);
      gl.vertexAttribPointer(sl, 2, gl.FLOAT, false, 0, 0);
      var right = [view[0], view[4], view[8]];
      var up = [view[1], view[5], view[9]];
      var back = [view[2], view[6], view[10]];
      var tanY = Math.tan(48 * Math.PI / 360);
      gl.useProgram(st.sky);
      gl.uniform3f(gl.getUniformLocation(st.sky, 'uU'), right[0], right[1], right[2]);
      gl.uniform3f(gl.getUniformLocation(st.sky, 'uV'), up[0], up[1], up[2]);
      gl.uniform3f(gl.getUniformLocation(st.sky, 'uW'), -back[0], -back[1], -back[2]);
      gl.uniform2f(gl.getUniformLocation(st.sky, 'uTan'), tanY * box.w / box.h, tanY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.enable(gl.DEPTH_TEST);
      gl.useProgram(st.prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, st.buf);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, st.ib);
      var loc = gl.getAttribLocation(st.prog, 'aGrid');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(gl.getUniformLocation(st.prog, 'uProj'), false, proj);
      gl.uniformMatrix4fv(gl.getUniformLocation(st.prog, 'uView'), false, view);
      gl.uniform1f(gl.getUniformLocation(st.prog, 'uTime'), ctx.local);
      var amp = (ctx.beat === 'flat' || ctx.beat === 'fresnel' || ctx.beat === 'normal') ? 0.02 : 1.0;
      var ger = ctx.beat === 'sine' ? 0.0 : 1.0;
      var flatN = (ctx.beat === 'normal') ? 1.0 : 0.0;
      var foam = (ctx.beat === 'foam' || ctx.beat === 'sun' || ctx.beat === 'gerstner') ? 1.0 : 0.0;
      gl.uniform1f(gl.getUniformLocation(st.prog, 'uAmp'), amp);
      gl.uniform1f(gl.getUniformLocation(st.prog, 'uGerstner'), ger);
      gl.uniform1f(gl.getUniformLocation(st.prog, 'uFlatN'), flatN);
      gl.uniform1f(gl.getUniformLocation(st.prog, 'uFoam'), foam);
      gl.uniform3f(gl.getUniformLocation(st.prog, 'uEye'), eye[0], eye[1], eye[2]);
      gl.drawElements(gl.TRIANGLES, st.count, gl.UNSIGNED_SHORT, 0);
    }
  };

  /* ---------- procedural city ---------- */
  function camBasis(eye, target) {
    var zx = eye.x - target.x, zy = eye.y - target.y, zz = eye.z - target.z;
    var L = Math.hypot(zx, zy, zz) || 1;
    zx /= L; zy /= L; zz /= L;
    var rx = zz, ry = 0, rz = -zx;
    L = Math.hypot(rx, ry, rz) || 1;
    rx /= L; ry /= L; rz /= L;
    var ux = zy * rz - zz * ry, uy = zz * rx - zx * rz, uz = zx * ry - zy * rx;
    return {
      eye: eye, rx: rx, ry: ry, rz: rz, ux: ux, uy: uy, uz: uz,
      fx: -zx, fy: -zy, fz: -zz
    };
  }
  function project(p, cam, w, h) {
    var dx = p.x - cam.eye.x, dy = p.y - cam.eye.y, dz = p.z - cam.eye.z;
    var x = dx * cam.rx + dy * cam.ry + dz * cam.rz;
    var y = dx * cam.ux + dy * cam.uy + dz * cam.uz;
    var z = dx * cam.fx + dy * cam.fy + dz * cam.fz;
    if (z < 0.35) return null;
    var s = (h * 0.95) / z;
    return { x: w / 2 + x * s, y: h * 0.58 - y * s, z: z };
  }
  function hash2(i, j) {
    var n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }

  Visuals.city = {
    enter: function (root, scene) {
      var m = mount(root, scene, 'hero');
      var canvas = document.createElement('canvas');
      m.viz.appendChild(canvas);
      m.extra.innerHTML = '<div class="chip" id="cityBeat">grid</div>';
    },
    tick: function (root, ctx) {
      var order = ['grid', 'heights', 'windows', 'cars', 'bloom', 'path', 'time', 'scale'];
      var idx = order.indexOf(ctx.beat);
      if (idx < 0) idx = 0;
      var chip = root.querySelector('#cityBeat');
      if (chip) chip.textContent = order[idx];
      var canvas = root.querySelector('canvas');
      if (!canvas) return;
      var size = fit(canvas), g = canvas.getContext('2d'), w = size.w, h = size.h;
      var sky = g.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#141822');
      sky.addColorStop(1, '#3a2a28');
      g.fillStyle = sky; g.fillRect(0, 0, w, h);
      var ang = ctx.local * 0.18;
      var eye = { x: Math.sin(ang) * 34, y: 16, z: Math.cos(ang) * 34 };
      var cam = camBasis(eye, { x: 0, y: 2, z: 0 });
      var N = 8, gap = 4.2, street = 1.5;
      var faces = [];
      for (var j = 0; j < N; j++) {
        for (var i = 0; i < N; i++) {
          var d = Math.hypot(i - 3.5, j - 3.5);
          var ht = (0.35 + hash2(i, j) * 0.9) * (2.2 - d * 0.22) * 4.2;
          if (idx === 0) ht = 0.45;
          var x0 = (i - N / 2) * gap;
          var z0 = (j - N / 2) * gap;
          var hw = (gap - street) / 2;
          function corner(x, y, z) { return project({ x: x, y: y, z: z }, cam, w, h); }
          var pts = [
            corner(x0 - hw, 0, z0 - hw), corner(x0 + hw, 0, z0 - hw),
            corner(x0 + hw, ht, z0 - hw), corner(x0 - hw, ht, z0 - hw),
            corner(x0 - hw, 0, z0 + hw), corner(x0 + hw, 0, z0 + hw),
            corner(x0 + hw, ht, z0 + hw), corner(x0 - hw, ht, z0 + hw)
          ];
          if (pts.some(function (p) { return !p; })) continue;
          function quad(a, b, c, d, shade, wall) {
            var z = (a.z + b.z + c.z + d.z) / 4;
            faces.push({ z: z, pts: [a, b, c, d], shade: shade, wall: wall, seed: i * 17 + j });
          }
          quad(pts[0], pts[1], pts[2], pts[3], '#2c3542', true);
          quad(pts[1], pts[5], pts[6], pts[2], '#242c38', true);
          quad(pts[5], pts[4], pts[7], pts[6], '#1c242e', true);
          quad(pts[4], pts[0], pts[3], pts[7], '#303a48', true);
          quad(pts[3], pts[2], pts[6], pts[7], '#3a4452', false);
        }
      }
      faces.sort(function (a, b) { return b.z - a.z; });
      faces.forEach(function (f) {
        g.beginPath();
        g.moveTo(f.pts[0].x, f.pts[0].y);
        for (var k = 1; k < 4; k++) g.lineTo(f.pts[k].x, f.pts[k].y);
        g.closePath();
        g.fillStyle = f.shade;
        g.fill();
        if (f.wall && idx >= 2) {
          g.save();
          g.clip();
          var minX = Math.min.apply(null, f.pts.map(function (p) { return p.x; }));
          var maxX = Math.max.apply(null, f.pts.map(function (p) { return p.x; }));
          var minY = Math.min.apply(null, f.pts.map(function (p) { return p.y; }));
          var maxY = Math.max.apply(null, f.pts.map(function (p) { return p.y; }));
          var ww = maxX - minX, hh = maxY - minY;
          if (ww > 8 && hh > 12) {
            var cols = Math.max(2, Math.floor(ww / 7));
            var rows = Math.max(2, Math.floor(hh / 9));
            for (var r = 0; r < rows; r++) {
              for (var c = 0; c < cols; c++) {
                var lit = hash2(f.seed + c * 3, r * 5) > 0.62;
                g.fillStyle = lit ? 'rgba(242,196,120,0.9)' : 'rgba(8,10,14,0.45)';
                g.fillRect(minX + 2 + c * (ww / cols), minY + 2 + r * (hh / rows), Math.max(1, ww / cols - 3), Math.max(1, hh / rows - 3));
              }
            }
          }
          g.restore();
        }
      });
      if (idx >= 3) {
        g.fillStyle = '#f4e2b0';
        for (var c = 0; c < 10; c++) {
          var u = (ctx.local * 0.15 + c / 10) % 1;
          var x = -16 + u * 32;
          var z = -14 + (c % 5) * 7;
          var p = project({ x: x, y: 0.3, z: z }, cam, w, h);
          if (!p) continue;
          g.fillRect(p.x, p.y, 4, 2);
          g.fillStyle = c % 2 ? '#f4e2b0' : '#e07a6a';
        }
      }
      if (idx === 4) {
        var wash = 0.25 + 0.25 * (0.5 + 0.5 * Math.sin(ctx.local * 2));
        g.fillStyle = 'rgba(255,244,230,' + wash.toFixed(3) + ')';
        g.fillRect(0, 0, w, h);
        g.fillStyle = '#1a1208';
        g.font = '20px Inter, sans-serif';
        g.fillText('bloom too high  ·  the frame washes out', 20, h - 24);
      }
      if (idx >= 5) {
        g.strokeStyle = '#e4a15a'; g.lineWidth = 2; g.beginPath();
        for (var k = 0; k <= 30; k++) {
          var u = k / 30;
          var p = project({ x: Math.sin(u * 6.28) * 12, y: 6 + Math.sin(u * 3.14) * 2, z: Math.cos(u * 6.28) * 12 }, cam, w, h);
          if (!p) continue;
          if (k === 0) g.moveTo(p.x, p.y); else g.lineTo(p.x, p.y);
        }
        g.stroke();
      }
      if (idx >= 6) {
        g.fillStyle = '#e4a15a';
        g.font = '16px JetBrains Mono, monospace';
        g.fillText('t = ' + ctx.local.toFixed(2) + '   seed = 3', 16, 28);
      }
      if (idx >= 7) {
        g.fillStyle = 'rgba(90,70,64,0.35)';
        g.fillRect(0, h * 0.45, w, h * 0.2);
      }
    }
  };

  window.Visuals = Visuals;
})();
