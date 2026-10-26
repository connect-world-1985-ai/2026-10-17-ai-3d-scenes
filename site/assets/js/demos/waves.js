/* Wave toy — sum of sines vs Gerstner waves in a vertex shader, Fresnel water in a fragment shader.
   Raw WebGL1, no library, no textures, works offline. */
(function () {
  'use strict';
  var stage = document.getElementById('wvStage');
  if (!stage) return;
  var canvas = stage.querySelector('canvas');
  var gl = canvas.getContext('webgl', { antialias: true });
  if (!gl) { Demo.noWebGL(stage); return; }

  var MAXW = 8;
  var SKY_FN = 'vec3 sky(vec3 rd){ vec3 col = mix(vec3(0.62, 0.74, 0.88), vec3(0.10, 0.28, 0.66), clamp(rd.y * 1.6, 0.0, 1.0)); float s = max(dot(rd, uSun), 0.0); col += vec3(1.0, 0.85, 0.6) * (pow(s, 900.0) * 8.0 + pow(s, 10.0) * 0.3); return col; }';
  var VS = [
    'precision highp float;',
    'attribute vec2 aGrid;',
    'uniform mat4 uProj; uniform mat4 uView; uniform float uTime; uniform int uN; uniform float uChop; uniform float uGerstner;',
    'uniform vec4 uWave[' + MAXW + '];', // dir.x, dir.z, k, amplitude
    'varying vec3 vPos; varying vec3 vNrm; varying float vH; varying float vFold;',
    'void main(){',
    '  vec2 g = aGrid; vec2 p0 = sign(g) * g * g * 220.0;', // denser near the camera
    '  vec3 p = vec3(p0.x, 0.0, p0.y); vec3 n = vec3(0.0, 1.0, 0.0); float jac = 1.0;',
    '  float nw = float(uN);',
    '  for (int i = 0; i < ' + MAXW + '; i++){',
    '    if (i >= uN) break;',
    '    vec4 w = uWave[i]; vec2 d = w.xy; float k = w.z; float A = w.w;',
    '    float om = sqrt(9.81 * k);',                    // deep-water dispersion: omega^2 = g k
    '    float Q = uGerstner * uChop / (k * A * nw);',     // steepness; > 1/(kA N) makes crests loop
    '    float f = k * dot(d, p0) - om * uTime;',
    '    float S = sin(f), C = cos(f);',
    '    p.x += Q * A * d.x * C; p.z += Q * A * d.y * C; p.y += A * S;',
    '    float WA = k * A;',
    '    n.x -= d.x * WA * C; n.z -= d.y * WA * C; n.y -= Q * WA * S;',
    '    jac -= Q * WA * S;',
    '  }',
    '  vPos = p; vNrm = normalize(n); vH = p.y; vFold = jac;',
    '  gl_Position = uProj * uView * vec4(p, 1.0);',
    '}'
  ].join('\n');
  var FS = [
    'precision highp float;',
    'uniform vec3 uEye; uniform vec3 uSun; uniform int uShade; uniform float uFoam;',
    'varying vec3 vPos; varying vec3 vNrm; varying float vH; varying float vFold;',
    SKY_FN,
    'void main(){',
    '  vec3 n = normalize(vNrm); vec3 v = normalize(uEye - vPos);',
    '  if (uShade == 1) { gl_FragColor = vec4(0.5 + 0.5 * n, 1.0); return; }',
    '  if (uShade == 2) { gl_FragColor = vec4(vec3(0.5 + vH * 0.4), 1.0); return; }',
    '  float cosT = max(dot(n, v), 0.0);',
    '  float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);',                      // Schlick Fresnel, water F0 ~ 0.02
    '  vec3 r = reflect(-v, n); r.y = abs(r.y);',
    '  vec3 refl = sky(r);',
    '  vec3 deep = vec3(0.0, 0.07, 0.12); vec3 shallow = vec3(0.0, 0.32, 0.36);',
    '  vec3 refr = mix(deep, shallow, clamp(vH * 0.5 + 0.35, 0.0, 1.0) * max(dot(n, uSun), 0.0));',
    '  vec3 h = normalize(uSun + v); float spec = pow(max(dot(n, h), 0.0), 420.0) * 6.0;',
    '  vec3 col = mix(refr, refl, F) + vec3(1.0, 0.9, 0.7) * spec;',
    '  float foam = uFoam * smoothstep(0.3, -0.15, vFold) * 0.85;',          // folding surface (Jacobian -> 0) = breaking crest
    '  col = mix(col, vec3(0.92), clamp(foam, 0.0, 1.0));',
    '  float dist = length(vPos.xz - uEye.xz);',
    '  vec3 hz = -v; hz.y = max(hz.y, 0.0);',
    '  col = mix(col, sky(normalize(hz)), smoothstep(70.0, 215.0, dist));',
    '  col = 1.0 - exp(-col * 1.7); col = pow(col, vec3(1.0 / 2.2));',     // exposure tone curve, then gamma
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  // full-screen sky pass drawn first (same sky function, so the horizon matches)
  var SKY_VS = 'attribute vec2 a; varying vec2 vUv; void main(){ vUv = a; gl_Position = vec4(a, 0.9999, 1.0); }';
  var SKY_FS = [
    'precision highp float; varying vec2 vUv;',
    'uniform vec3 uU; uniform vec3 uV; uniform vec3 uW; uniform vec2 uTan; uniform vec3 uSun;',
    SKY_FN,
    'void main(){ vec3 rd = normalize(uW + vUv.x * uTan.x * uU + vUv.y * uTan.y * uV); rd.y = max(rd.y, 0.0);',
    '  vec3 col = sky(normalize(rd)); col = 1.0 - exp(-col * 1.7); gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0); }'
  ].join('\n');

  var prog, skyProg;
  try { prog = GLMini.program(gl, VS, FS); skyProg = GLMini.program(gl, SKY_VS, SKY_FS); } catch (e) { Demo.fail(stage, 'Shader failed to compile', String(e.message)); return; }
  var U = GLMini.uniforms(gl, prog), SU = GLMini.uniforms(gl, skyProg);
  var tri = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, tri); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var skyLoc = gl.getAttribLocation(skyProg, 'a');

  // grid mesh
  var N = 200, verts = new Float32Array((N + 1) * (N + 1) * 2), idx = new Uint16Array(N * N * 6), o = 0;
  for (var j = 0; j <= N; j++) for (var i = 0; i <= N; i++) { verts[o++] = i / N * 2 - 1; verts[o++] = j / N * 2 - 1; }
  o = 0;
  for (j = 0; j < N; j++) for (i = 0; i < N; i++) {
    var a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
    idx[o++] = a; idx[o++] = c; idx[o++] = b; idx[o++] = b; idx[o++] = c; idx[o++] = d;
  }
  var vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  var ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  var aLoc = gl.getAttribLocation(prog, 'aGrid');

  var cam = { yaw: 0.4, pitch: 0.18, dist: 26 };
  GLMini.orbit(canvas, cam, { minPitch: 0.03, maxPitch: 1.2, minDist: 6, maxDist: 90 });

  var nW = Demo.slider('wvN');
  var amp = Demo.slider('wvA', function (v) { return v.toFixed(2) + ' m'; });
  var len = Demo.slider('wvL', function (v) { return v + ' m'; });
  var chop = Demo.slider('wvQ', function (v) { return v.toFixed(2); });
  var wind = Demo.slider('wvDir', function (v) { return v + '°'; });
  var spread = Demo.slider('wvSpread', function (v) { return v + '°'; });
  var sunA = Demo.slider('wvSun', function (v) { return v + '°'; });
  var model = document.getElementById('wvModel');
  var shade = document.getElementById('wvShade');
  var foam = document.getElementById('wvFoam');
  var hud = stage.querySelector('.hud');
  var fps = Demo.fpsMeter();

  // deterministic pseudo-random per wave so the pattern is stable while you drag sliders
  function rnd(i) { var x = Math.sin(i * 91.7 + 13.3) * 43758.5453; return x - Math.floor(x); }
  var waves = new Float32Array(MAXW * 4);
  function buildWaves() {
    var n = nW(), base = wind() * Math.PI / 180, sp = spread() * Math.PI / 180;
    for (var i = 0; i < MAXW; i++) {
      var L = len() * Math.pow(0.62, i);                   // each extra wave is shorter...
      var A = amp() * Math.pow(0.62, i);                   // ...and smaller (roughly constant steepness)
      var ang = base + (rnd(i) * 2 - 1) * sp;
      waves[i * 4] = Math.cos(ang); waves[i * 4 + 1] = Math.sin(ang); waves[i * 4 + 2] = 2 * Math.PI / L; waves[i * 4 + 3] = A;
    }
    return n;
  }

  var raf = 0, t0 = performance.now();
  gl.enable(gl.DEPTH_TEST);
  function frame(now) {
    raf = requestAnimationFrame(frame);
    GLMini.fit(gl, canvas, 1.5);
    var n = buildWaves();
    var t = (now - t0) / 1000;
    var eye = [Math.sin(cam.yaw) * Math.cos(cam.pitch) * cam.dist, Math.sin(cam.pitch) * cam.dist + 2, Math.cos(cam.yaw) * Math.cos(cam.pitch) * cam.dist];
    var a = sunA() * Math.PI / 180; var sun = [Math.cos(a) * 0.7, Math.sin(a), -0.7]; var l = Math.hypot(sun[0], sun[1], sun[2]); sun = sun.map(function (x) { return x / l; });
    gl.clearColor(0.7, 0.8, 0.9, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // sky pass
    var w = [-eye[0], -eye[1], -eye[2]], wl = Math.hypot(w[0], w[1], w[2]); w = w.map(function (x) { return x / wl; });
    var u = [-w[2], 0, w[0]], ul = Math.hypot(u[0], u[2]); u = [u[0] / ul, 0, u[2] / ul];
    var v = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    var th = Math.tan(55 * Math.PI / 360);
    gl.disable(gl.DEPTH_TEST);
    gl.useProgram(skyProg);
    gl.bindBuffer(gl.ARRAY_BUFFER, tri); gl.enableVertexAttribArray(skyLoc); gl.vertexAttribPointer(skyLoc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3fv(SU.uU, u); gl.uniform3fv(SU.uV, v); gl.uniform3fv(SU.uW, w);
    gl.uniform2f(SU.uTan, th * canvas.width / canvas.height, th); gl.uniform3fv(SU.uSun, sun);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.enableVertexAttribArray(aLoc); gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(U.uProj, false, GLMini.perspective(55 * Math.PI / 180, canvas.width / canvas.height, 0.1, 1000));
    gl.uniformMatrix4fv(U.uView, false, GLMini.lookAt(eye, [0, 0, 0], [0, 1, 0]));
    gl.uniform1f(U.uTime, t);
    gl.uniform1i(U.uN, n);
    gl.uniform1f(U.uChop, chop());
    gl.uniform1f(U.uGerstner, model.value === 'gerstner' ? 1 : 0);
    gl.uniform4fv(U.uWave, waves);
    gl.uniform3fv(U.uEye, eye);
    gl.uniform3fv(U.uSun, sun);
    gl.uniform1i(U.uShade, +shade.value);
    gl.uniform1f(U.uFoam, foam.checked ? 1 : 0);
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    var f = fps(now);
    hud.textContent = (model.value === 'gerstner' ? 'Gerstner' : 'sum of sines') + ' · ' + n + ' wave' + (n > 1 ? 's' : '') + ' · ' + (N * N * 2 / 1000).toFixed(0) + 'k triangles · ' + (f ? f + ' fps' : '…');
  }
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); cancelAnimationFrame(raf); Demo.fail(stage, 'GPU context lost', 'The browser reset the GPU context. Reload the page.'); });
  Demo.whenVisible(stage, function () { raf = requestAnimationFrame(frame); }, function () { cancelAnimationFrame(raf); });
})();
