/* Draw-call toy — N objects as separate Meshes vs one InstancedMesh. Three.js from CDN. */
(function () {
  'use strict';
  Demo.runThree('instStage', ['controls/OrbitControls.js'], function (stage, THREE, OC) {
    var S = Demo.threeStage(THREE, stage);
    var renderer = S.renderer;
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101318);
    scene.fog = new THREE.Fog(0x101318, 60, 160);
    scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x2a2018, 1.4));
    var dl = new THREE.DirectionalLight(0xffffff, 1.6); dl.position.set(30, 50, 20); scene.add(dl);
    var camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.5, 400);
    camera.position.set(70, 45, 70);
    var controls = new OC.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.autoRotate = true; controls.autoRotateSpeed = 0.6;
    S.resize(function (w, h) { camera.aspect = w / h; camera.updateProjectionMatrix(); });

    var geos = { box: new THREE.BoxGeometry(1, 1, 1), sphere: new THREE.IcosahedronGeometry(0.6, 3) };
    var mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    var holder = new THREE.Group(); scene.add(holder);
    var count = Demo.slider('instN', function (v) { return v.toLocaleString(); });
    var mode = document.getElementById('instMode'), geoSel = document.getElementById('instGeo');
    var hud = stage.querySelector('.hud');
    var built = '', pending = 0;
    var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();

    function rebuild() {
      holder.children.slice().forEach(function (ch) { holder.remove(ch); if (ch.isInstancedMesh) ch.dispose(); else if (ch.material !== mat) ch.material.dispose(); });
      var n = count(), geo = geos[geoSel.value], side = Math.ceil(Math.cbrt(n)), sp = 2.2;
      function place(i) {
        var x = i % side, y = Math.floor(i / side) % side, z = Math.floor(i / (side * side));
        p.set((x - side / 2) * sp, (y - side / 2) * sp + side, (z - side / 2) * sp);
        q.setFromEuler(new THREE.Euler(i * 0.37, i * 0.71, 0));
        var k = 0.6 + ((i * 2654435761) % 1000) / 2500; s.set(k, k, k);
        m4.compose(p, q, s);
        c.setHSL((x + z) / (2 * side) * 0.7, 0.6, 0.55);
      }
      if (mode.value === 'instanced') {
        var im = new THREE.InstancedMesh(geo, mat, n);
        for (var i = 0; i < n; i++) { place(i); im.setMatrixAt(i, m4); im.setColorAt(i, c); }
        holder.add(im);
      } else {
        for (var j = 0; j < n; j++) {
          place(j);
          var mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: c.clone(), roughness: 0.6 }));
          mesh.matrixAutoUpdate = false; mesh.matrix.copy(m4);
          holder.add(mesh);
        }
      }
      controls.target.set(0, side - sp / 2, 0);
      built = mode.value + n + geoSel.value;
    }
    function schedule() { clearTimeout(pending); pending = setTimeout(rebuild, 250); }
    document.getElementById('instN').addEventListener('input', schedule);
    mode.addEventListener('change', rebuild); geoSel.addEventListener('change', rebuild);
    rebuild();

    var acc = 0, frames = 0, shownFps = 0, cpu = 0;
    S.start(function (now, dt) {
      var t = performance.now();
      controls.update();
      renderer.render(scene, camera);
      cpu = cpu * 0.9 + (performance.now() - t) * 0.1;
      acc += dt; frames++; if (acc > 0.5) { shownFps = Math.round(frames / acc); acc = 0; frames = 0; }
      hud.textContent = (mode.value === 'instanced' ? 'InstancedMesh' : 'separate Mesh objects') + ' · ' + count().toLocaleString() + ' objects\n' +
        'draw calls: ' + renderer.info.render.calls + ' · triangles: ' + (renderer.info.render.triangles / 1000).toFixed(0) + 'k\n' +
        'CPU time in render(): ' + cpu.toFixed(1) + ' ms · ' + (shownFps ? shownFps + ' fps' : '…');
    });
  });
})();
