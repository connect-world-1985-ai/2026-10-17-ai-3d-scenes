/* PBR toy — MeshPhysicalMaterial, a key light, image-based lighting, tone mapping. Three.js from CDN. */
(function () {
  'use strict';
  Demo.runThree('pbrStage', ['controls/OrbitControls.js', 'environments/RoomEnvironment.js'], function (stage, THREE, OC, RE) {
    var S = Demo.threeStage(THREE, stage);
    var renderer = S.renderer;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap was removed in recent releases

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 100);
    camera.position.set(0, 1.6, 6.5);
    var controls = new OC.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.9, 0); controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.49;
    S.resize(function (w, h) { camera.aspect = w / h; camera.updateProjectionMatrix(); });

    // environments for image-based lighting (IBL), all generated in code: no HDR files needed
    var pmrem = new THREE.PMREMGenerator(renderer);
    var envRoom = pmrem.fromScene(new RE.RoomEnvironment(), 0.04).texture;
    var envSunset = (function () {
      var c = document.createElement('canvas'); c.width = 512; c.height = 256;
      var g = c.getContext('2d');
      var grd = g.createLinearGradient(0, 0, 0, 256);
      grd.addColorStop(0, '#1b2a55'); grd.addColorStop(0.42, '#f08a4b'); grd.addColorStop(0.5, '#ffd9a0'); grd.addColorStop(0.52, '#3a3530'); grd.addColorStop(1, '#151210');
      g.fillStyle = grd; g.fillRect(0, 0, 512, 256);
      g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(380, 118, 10, 0, Math.PI * 2); g.fill();
      var t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
      return pmrem.fromEquirectangular(t).texture;
    })();

    var mat = new THREE.MeshPhysicalMaterial({ color: 0xc8a165, metalness: 1, roughness: 0.3 });
    var knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.62, 0.22, 220, 32), mat);
    knot.position.set(-1.3, 1.05, 0); knot.castShadow = true;
    var ball = new THREE.Mesh(new THREE.SphereGeometry(0.75, 96, 64), mat);
    ball.position.set(1.2, 0.75, 0); ball.castShadow = true;
    var floor = new THREE.Mesh(new THREE.CircleGeometry(6, 64), new THREE.MeshStandardMaterial({ color: 0x8a8f96, roughness: 0.85 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    scene.add(knot, ball, floor);

    var key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
    var sc = key.shadow.camera; sc.left = -4; sc.right = 4; sc.top = 4; sc.bottom = -4; sc.near = 0.5; sc.far = 20;
    key.shadow.radius = 4; key.shadow.bias = -0.0005;
    scene.add(key);
    var hemi = new THREE.HemisphereLight(0xbfd4ff, 0x40362c, 0.2);
    scene.add(hemi);

    var $ = function (id) { return document.getElementById(id); };
    var metal = Demo.slider('pbrMetal', function (v) { return v.toFixed(2); });
    var rough = Demo.slider('pbrRough', function (v) { return v.toFixed(2); });
    var coat = Demo.slider('pbrCoat', function (v) { return v.toFixed(2); });
    var keyI = Demo.slider('pbrKey', function (v) { return v.toFixed(1); });
    var keyA = Demo.slider('pbrKeyA', function (v) { return v + '°'; });
    var envI = Demo.slider('pbrEnvI', function (v) { return v.toFixed(2); });
    var expo = Demo.slider('pbrExpo', function (v) { return v.toFixed(2); });
    var TM = { none: THREE.NoToneMapping, linear: THREE.LinearToneMapping, reinhard: THREE.ReinhardToneMapping, aces: THREE.ACESFilmicToneMapping, agx: THREE.AgXToneMapping, neutral: THREE.NeutralToneMapping };
    var lastTM = null, lastEnv = null;
    var hud = stage.querySelector('.hud') || stage.appendChild(Object.assign(document.createElement('div'), { className: 'hud' }));
    var fps = Demo.fpsMeter();

    function apply() {
      mat.metalness = metal(); mat.roughness = rough(); mat.clearcoat = coat();
      mat.color.set($('pbrColor').value);
      key.intensity = keyI();
      var a = keyA() * Math.PI / 180; key.position.set(Math.cos(a) * 5, 4.5, Math.sin(a) * 5);
      var envName = $('pbrEnv').value;
      if (envName !== lastEnv) {
        var env = envName === 'room' ? envRoom : envName === 'sunset' ? envSunset : null;
        scene.environment = env;
        scene.background = env || new THREE.Color(0x202328);
        scene.backgroundBlurriness = 0.35;
        lastEnv = envName;
      }
      scene.environmentIntensity = envI();
      scene.backgroundIntensity = Math.min(1, envI());
      var tm = TM[$('pbrTM').value];
      if (tm !== lastTM) { renderer.toneMapping = tm; lastTM = tm; [mat, floor.material].forEach(function (m) { m.needsUpdate = true; }); }
      renderer.toneMappingExposure = expo();
      renderer.shadowMap.enabled = $('pbrShadow').checked;
      key.castShadow = $('pbrShadow').checked;
    }

    S.start(function (now, dt) {
      apply();
      if ($('pbrSpin').checked) { knot.rotation.y += dt * 0.5; knot.rotation.x += dt * 0.2; }
      controls.update();
      renderer.render(scene, camera);
      var f = fps(now);
      hud.textContent = 'Three.js r' + THREE.REVISION + ' · ' + renderer.info.render.calls + ' draw calls · ' + (renderer.info.render.triangles / 1000).toFixed(0) + 'k tris · ' + (f ? f + ' fps' : '…');
    });
  });
})();
