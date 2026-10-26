/* Device capability probe: WebGL2, WebGPU, GPU name, limits. Classic script, no network. */
(function () {
  var out = document.getElementById('probeOut');
  if (!out) return;
  var rows = [];
  function add(k, v, cls) { rows.push([k, v, cls || '']); }

  var c = document.createElement('canvas');
  var gl = null;
  try { gl = c.getContext('webgl2'); } catch (e) { gl = null; }
  if (gl) {
    add('WebGL2', 'yes', 'good');
    var ext = gl.getExtension('WEBGL_debug_renderer_info');
    add('GPU (renderer string)', ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    var r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    if (/swiftshader|warp|llvmpipe|software|basic render/i.test(r)) add('Note', 'software renderer: performance here is not representative', 'warn');
    add('MAX_TEXTURE_SIZE', gl.getParameter(gl.MAX_TEXTURE_SIZE));
    add('MAX_SAMPLES (MSAA)', gl.getParameter(gl.MAX_SAMPLES));
    add('Float render targets', gl.getExtension('EXT_color_buffer_float') ? 'yes' : 'no');
    var lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
  } else {
    add('WebGL2', 'no: 3D demos on this site will show a fallback message', 'warn');
  }
  add('devicePixelRatio', String(window.devicePixelRatio || 1));
  add('Screen (CSS px)', screen.width + ' × ' + screen.height);
  add('hardwareConcurrency (CPU threads)', String(navigator.hardwareConcurrency || 'unknown'));
  add('Secure context', String(window.isSecureContext));
  add('crossOriginIsolated (needed for SharedArrayBuffer)', String(!!window.crossOriginIsolated));

  function render() {
    var h = '<table><tbody>';
    rows.forEach(function (r) {
      var v = String(r[1]).replace(/&/g, '&amp;').replace(/</g, '&lt;');
      h += '<tr><th scope="row">' + r[0] + '</th><td' + (r[2] ? ' class="probe-' + r[2] + '"' : '') + '>' + v + '</td></tr>';
    });
    out.innerHTML = h + '</tbody></table>';
  }

  if (!('gpu' in navigator)) {
    add('WebGPU', 'navigator.gpu missing (browser or flag)', 'warn');
    render();
    return;
  }
  add('WebGPU', 'checking adapter…');
  render();
  var idx = rows.length - 1;
  var t = setTimeout(function () { rows[idx] = ['WebGPU', 'requestAdapter() timed out', 'warn']; render(); }, 4000);
  navigator.gpu.requestAdapter().then(function (a) {
    clearTimeout(t);
    if (!a) { rows[idx] = ['WebGPU', 'API present, but no adapter (blocked GPU or headless)', 'warn']; render(); return; }
    var info = a.info || {};
    var name = [info.vendor, info.architecture, info.description].filter(Boolean).join(' ');
    rows[idx] = ['WebGPU', 'yes' + (name ? ' (' + name + ')' : ''), 'good'];
    if (a.limits) rows.push(['WebGPU maxTextureDimension2D', a.limits.maxTextureDimension2D, '']);
    render();
  }).catch(function (e) {
    clearTimeout(t);
    rows[idx] = ['WebGPU', 'error: ' + (e && e.message || e), 'warn']; render();
  });
})();
