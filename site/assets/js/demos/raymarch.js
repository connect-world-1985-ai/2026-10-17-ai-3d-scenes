/* Raymarching SDF toy — one fragment shader draws the whole scene. Raw WebGL1, no library, works offline. */
(function () {
  'use strict';
  var stage = document.getElementById('rmStage');
  if (!stage) return;
  var canvas = stage.querySelector('canvas');
  var gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: false });
  if (!gl) { Demo.noWebGL(stage); return; }

  var VS = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }';
  var FS = [
    'precision highp float;',
    'uniform vec2 uRes; uniform float uTime; uniform vec3 uRo; uniform vec3 uTa; uniform vec3 uSun;',
    'uniform int uSteps; uniform float uK; uniform float uHeight; uniform int uView; uniform float uShadow; uniform float uFog;',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float sdBox(vec3 p, vec3 b){ vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }',
    'float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }',
    // returns distance; material id via out param
    'float map(vec3 p, out float m){',
    '  float ground = p.y;',
    '  vec3 c = vec3(0.0, 1.6 + 0.9 * sin(uTime * 0.9), 0.0);',
    '  float blob = length(p - c) - 1.4;',
    '  float d = smin(ground, blob, uK); m = (blob < ground + 0.3) ? 2.0 : 0.0;',
    '  vec2 cell = floor(p.xz / 4.0); vec2 lp = mod(p.xz, 4.0) - 2.0;',
    '  float plaza = step(2.0, max(abs(cell.x + 0.5), abs(cell.y + 0.5)));',
    '  float h = (0.4 + 2.6 * hash(cell) * hash(cell + 7.0)) * uHeight * plaza + 0.001;',
    '  float b = sdBox(vec3(lp.x, p.y - h, lp.y), vec3(1.15, h, 1.15)) - 0.05;',
    '  if (b < d) { d = b; m = 1.0; }',
    '  return d;',
    '}',
    'float mapD(vec3 p){ float m; return map(p, m); }',
    'vec3 normal(vec3 p){ vec2 e = vec2(0.002, 0.0); return normalize(vec3(mapD(p + e.xyy) - mapD(p - e.xyy), mapD(p + e.yxy) - mapD(p - e.yxy), mapD(p + e.yyx) - mapD(p - e.yyx))); }',
    'float softShadow(vec3 ro, vec3 rd){ float r = 1.0; float t = 0.05; for (int i = 0; i < 48; i++){ float h = mapD(ro + rd * t); r = min(r, 8.0 * h / t); t += clamp(h, 0.05, 0.6); if (r < 0.001 || t > 30.0) break; } return clamp(r, 0.0, 1.0); }',
    'vec3 sky(vec3 rd){ vec3 col = mix(vec3(0.72, 0.82, 0.95), vec3(0.25, 0.45, 0.85), clamp(rd.y * 1.6, 0.0, 1.0)); float s = max(dot(rd, uSun), 0.0); col += vec3(1.0, 0.85, 0.6) * (pow(s, 600.0) * 6.0 + pow(s, 12.0) * 0.25); return col; }',
    'vec3 heat(float x){ return clamp(vec3(1.5 * x, 1.5 * x - 0.5, 4.0 * x * (1.0 - x)), 0.0, 1.0); }',
    'void main(){',
    '  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.y;',
    '  vec3 ww = normalize(uTa - uRo); vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0))); vec3 vv = cross(uu, ww);',
    '  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.6 * ww);',
    '  float t = 0.0; float m = -1.0; int used = 0; bool hit = false;',
    '  for (int i = 0; i < 256; i++){',
    '    if (i >= uSteps) break;',
    '    used = i;',
    '    vec3 p = uRo + rd * t; float mm; float d = map(p, mm);',
    '    if (d < 0.0008 * t) { hit = true; m = mm; break; }',
    '    t += d * 0.85;',
    '    if (t > 140.0) break;',
    '  }',
    '  vec3 col;',
    '  if (uView == 2) { gl_FragColor = vec4(heat(float(used) / float(uSteps)), 1.0); return; }',
    '  if (!hit) { col = sky(rd); }',
    '  else {',
    '    vec3 p = uRo + rd * t; vec3 n = normal(p);',
    '    if (uView == 1) { gl_FragColor = vec4(0.5 + 0.5 * n, 1.0); return; }',
    '    vec3 alb = vec3(0.45);',
    '    if (m < 0.5) { vec2 lp = abs(mod(p.xz, 4.0) - 2.0); alb = (max(lp.x, lp.y) > 1.45) ? vec3(0.16) : vec3(0.55, 0.53, 0.5); }',
    '    else if (m < 1.5) { vec2 cell = floor(p.xz / 4.0); alb = mix(vec3(0.55, 0.5, 0.45), vec3(0.75, 0.78, 0.82), hash(cell + 3.0));',
    '      float wy = step(0.45, fract(p.y * 1.6)); float wx = step(0.35, fract((abs(n.x) > 0.5 ? p.z : p.x) * 1.6)); if (abs(n.y) < 0.5) alb *= 1.0 - 0.55 * wy * wx; }',
    '    else { alb = vec3(0.95, 0.45, 0.15); }',
    '    float dif = max(dot(n, uSun), 0.0);',
    '    float sh = (uShadow > 0.5 && dif > 0.0) ? softShadow(p + n * 0.01, uSun) : 1.0;',
    '    float amb = 0.5 + 0.5 * n.y;',
    '    col = alb * (vec3(1.0, 0.92, 0.8) * 1.6 * dif * sh + vec3(0.45, 0.6, 0.9) * 0.45 * amb);',
    '    col = mix(col, sky(rd), 1.0 - exp(-uFog * t * t * 0.0004));',
    '  }',
    '  col = col / (1.0 + col);',               // simple Reinhard tone map
    '  col = pow(col, vec3(1.0 / 2.2));',       // linear -> sRGB-ish
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var prog;
  try { prog = GLMini.program(gl, VS, FS); } catch (e) { Demo.fail(stage, 'Shader failed to compile', String(e.message)); return; }
  var U = GLMini.uniforms(gl, prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'a');

  var cam = { yaw: 0.6, pitch: 0.35, dist: 22 };
  GLMini.orbit(canvas, cam, { minPitch: 0.05, maxPitch: 1.4, minDist: 6, maxDist: 60 });

  var steps = Demo.slider('rmSteps');
  var k = Demo.slider('rmK', function (v) { return v.toFixed(2); });
  var hgt = Demo.slider('rmH', function (v) { return v.toFixed(2); });
  var sunA = Demo.slider('rmSun', function (v) { return v + '°'; });
  var fog = Demo.slider('rmFog', function (v) { return v.toFixed(1); });
  var res = document.getElementById('rmRes');
  var view = document.getElementById('rmView');
  var shadow = document.getElementById('rmShadow');
  var spin = document.getElementById('rmSpin');
  var hud = stage.querySelector('.hud');
  var fps = Demo.fpsMeter();
  var raf = 0, t0 = performance.now();

  function frame(now) {
    raf = requestAnimationFrame(frame);
    var scale = +res.value;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5) * scale;
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    if (spin.checked) cam.yaw += 0.0015;
    var ro = [Math.sin(cam.yaw) * Math.cos(cam.pitch) * cam.dist, Math.sin(cam.pitch) * cam.dist + 1.0, Math.cos(cam.yaw) * Math.cos(cam.pitch) * cam.dist];
    var a = sunA() * Math.PI / 180;
    var sun = [Math.cos(a) * 0.8, Math.sin(a), 0.45]; var l = Math.hypot(sun[0], sun[1], sun[2]); sun = sun.map(function (x) { return x / l; });
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(U.uRes, w, h);
    gl.uniform1f(U.uTime, (now - t0) / 1000);
    gl.uniform3fv(U.uRo, ro);
    gl.uniform3f(U.uTa, 0, 1.5, 0);
    gl.uniform3fv(U.uSun, sun);
    gl.uniform1i(U.uSteps, steps());
    gl.uniform1f(U.uK, k());
    gl.uniform1f(U.uHeight, hgt());
    gl.uniform1i(U.uView, +view.value);
    gl.uniform1f(U.uShadow, shadow.checked ? 1 : 0);
    gl.uniform1f(U.uFog, fog());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    var f = fps(now);
    hud.textContent = 'raw WebGL · 1 draw call · ' + w + '×' + h + ' px · ' + (f ? f + ' fps' : '…');
  }
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); cancelAnimationFrame(raf); Demo.fail(stage, 'GPU context lost', 'The browser reset the GPU context (driver hiccup or too heavy a setting). Reload the page.'); });
  Demo.whenVisible(stage, function () { raf = requestAnimationFrame(frame); }, function () { cancelAnimationFrame(raf); });
})();
