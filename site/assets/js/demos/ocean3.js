/* Ocean level 2 — three.js Water (planar reflection + scrolling normal maps) and Sky (Preetham-style analytic sky).
   The normal map is generated in code (tileable sine noise), so no texture files are needed. Three.js from CDN. */
(function () {
  'use strict';
  Demo.runThree('oc3Stage', ['controls/OrbitControls.js', 'objects/Water.js', 'objects/Sky.js'], function (stage, THREE, OC, WA, SK) {
    var S = Demo.threeStage(THREE, stage);
    var renderer = S.renderer;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, 16 / 9, 1, 20000);
    camera.position.set(30, 30, 100);
    var controls = new OC.OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495; controls.target.set(0, 10, 0); controls.minDistance = 40; controls.maxDistance = 200; controls.enableDamping = true;
    S.resize(function (w, h) { camera.aspect = w / h; camera.updateProjectionMatrix(); });

    // procedural, seamlessly tiling normal map: height = sum of sines with integer frequencies
    function normalMap(size) {
      var c = document.createElement('canvas'); c.width = c.height = size;
      var g = c.getContext('2d'), img = g.createImageData(size, size), H = new Float32Array(size * size);
      var waves = [];
      for (var i = 0; i < 24; i++) {
        var fx = Math.round((Math.random() * 2 - 1) * (2 + i)), fy = Math.round((Math.random() * 2 - 1) * (2 + i));
        if (!fx && !fy) fx = 1;
        waves.push([fx, fy, Math.random() * 6.283, 1 / (1 + i * 0.6)]);
      }
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
        var h = 0;
        for (var k = 0; k < waves.length; k++) { var w = waves[k]; h += w[3] * Math.sin(6.2832 * (w[0] * x + w[1] * y) / size + w[2]); }
        H[y * size + x] = h;
      }
      for (y = 0; y < size; y++) for (x = 0; x < size; x++) {
        var dx = H[y * size + (x + 1) % size] - H[y * size + (x - 1 + size) % size];
        var dy = H[((y + 1) % size) * size + x] - H[((y - 1 + size) % size) * size + x];
        var nx = -dx * 2.2, ny = -dy * 2.2, nz = 1, l = Math.hypot(nx, ny, nz), o = (y * size + x) * 4;
        img.data[o] = (nx / l * 0.5 + 0.5) * 255; img.data[o + 1] = (ny / l * 0.5 + 0.5) * 255; img.data[o + 2] = (nz / l * 0.5 + 0.5) * 255; img.data[o + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    }

    var water = new WA.Water(new THREE.PlaneGeometry(10000, 10000), {
      textureWidth: 512, textureHeight: 512,
      waterNormals: normalMap(256),
      sunDirection: new THREE.Vector3(), sunColor: 0xffffff, waterColor: 0x001e0f, distortionScale: 3.7, fog: false
    });
    water.rotation.x = -Math.PI / 2; scene.add(water);
    var sky = new SK.Sky(); sky.scale.setScalar(10000); scene.add(sky);
    var buoy = new THREE.Mesh(new THREE.BoxGeometry(14, 14, 14), new THREE.MeshStandardMaterial({ roughness: 0.3, color: 0xd9d4c7 }));
    scene.add(buoy);

    var pmrem = new THREE.PMREMGenerator(renderer), envRT = null, sunV = new THREE.Vector3();
    var elev = Demo.slider('oc3Elev', function (v) { return v.toFixed(1) + '°'; });
    var azim = Demo.slider('oc3Azim', function (v) { return v + '°'; });
    var dist = Demo.slider('oc3Dist', function (v) { return v.toFixed(1); });
    var turb = Demo.slider('oc3Turb', function (v) { return v.toFixed(1); });
    var rayl = Demo.slider('oc3Rayl', function (v) { return v.toFixed(2); });
    var size = Demo.slider('oc3Size', function (v) { return v.toFixed(1); });
    var key = '';
    function updateSun() {
      var k = [elev(), azim(), turb(), rayl()].join();
      if (k === key) return; key = k;
      sunV.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev()), THREE.MathUtils.degToRad(azim()));
      var u = sky.material.uniforms;
      u.sunPosition.value.copy(sunV); u.turbidity.value = turb(); u.rayleigh.value = rayl(); u.mieCoefficient.value = 0.005; u.mieDirectionalG.value = 0.8;
      water.material.uniforms.sunDirection.value.copy(sunV).normalize();
      // re-bake the sky into an environment map so the buoy is lit by the same sky (image-based lighting)
      if (envRT) envRT.dispose();
      var tmp = new THREE.Scene(); tmp.add(sky);
      envRT = pmrem.fromScene(tmp); scene.add(sky);
      scene.environment = envRT.texture;
    }
    var hud = stage.querySelector('.hud'), fps = Demo.fpsMeter();
    S.start(function (now, dt) {
      updateSun();
      var t = now / 1000;
      water.material.uniforms.time.value += dt;
      water.material.uniforms.distortionScale.value = dist();
      water.material.uniforms.size.value = size();
      buoy.position.y = Math.sin(t) * 5 + 3; buoy.rotation.x = t * 0.25; buoy.rotation.z = t * 0.13;
      controls.update();
      renderer.render(scene, camera);
      var f = fps(now);
      hud.textContent = 'three.js Water + Sky addons · reflection = 2nd render pass · ' + renderer.info.render.calls + ' draw calls · ' + (f ? f + ' fps' : '…');
    });
  });
})();
