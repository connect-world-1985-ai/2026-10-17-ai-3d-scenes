/* Tiny raw-WebGL helpers for the offline demos (no library). Classic script -> window.GLMini. */
(function () {
  'use strict';
  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('Shader compile failed: ' + log);
    }
    return s;
  }
  function program(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Program link failed: ' + gl.getProgramInfoLog(p));
    return p;
  }
  function uniforms(gl, p) {
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var info = gl.getActiveUniform(p, i); var name = info.name.replace(/\[0\]$/, ''); u[name] = gl.getUniformLocation(p, info.name); }
    return u;
  }
  // column-major 4x4 matrices
  function perspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  }
  function lookAt(e, c, up) {
    var zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2];
    var l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
    var xx = up[1] * zz - up[2] * zy, xy = up[2] * zx - up[0] * zz, xz = up[0] * zy - up[1] * zx;
    l = Math.hypot(xx, xy, xz); xx /= l; xy /= l; xz /= l;
    var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    return new Float32Array([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
      -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1]);
  }
  /** Mouse/touch drag -> yaw/pitch; wheel/pinch -> distance. */
  function orbit(canvas, state, opts) {
    opts = opts || {};
    var down = false, lx = 0, ly = 0, pinch = 0;
    canvas.addEventListener('pointerdown', function (e) { down = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointerup', function () { down = false; });
    canvas.addEventListener('pointercancel', function () { down = false; });
    canvas.addEventListener('pointermove', function (e) {
      if (!down) return;
      state.yaw -= (e.clientX - lx) * 0.006;
      state.pitch = Math.max(opts.minPitch != null ? opts.minPitch : -1.4, Math.min(opts.maxPitch != null ? opts.maxPitch : 1.4, state.pitch + (e.clientY - ly) * 0.006));
      lx = e.clientX; ly = e.clientY;
    });
    canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      state.dist = Math.max(opts.minDist || 1, Math.min(opts.maxDist || 100, state.dist * (1 + Math.sign(e.deltaY) * 0.08)));
    }, { passive: false });
    canvas.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2) {
        var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        if (pinch) state.dist = Math.max(opts.minDist || 1, Math.min(opts.maxDist || 100, state.dist * pinch / d));
        pinch = d;
      }
    }, { passive: true });
    canvas.addEventListener('touchend', function () { pinch = 0; });
  }
  /** Resize drawing buffer to CSS size * dpr (capped). Returns true if changed. */
  function fit(gl, canvas, maxDpr) {
    var dpr = Math.min(window.devicePixelRatio || 1, maxDpr || 1.5);
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); return true; }
    return false;
  }
  window.GLMini = { program: program, uniforms: uniforms, perspective: perspective, lookAt: lookAt, orbit: orbit, fit: fit };
})();
