/* Procedural city toy — street grid, lots, InstancedMesh buildings, shader-drawn windows,
   day/night, street lights, traffic, spline fly-over, optional bloom. No asset files. Three.js from CDN. */
(function () {
  'use strict';
  Demo.runThree('cityStage', ['controls/OrbitControls.js', 'postprocessing/EffectComposer.js', 'postprocessing/RenderPass.js', 'postprocessing/UnrealBloomPass.js', 'postprocessing/OutputPass.js'],
    function (stage, THREE, OC, EC, RP, UB, OP) {
      var S = Demo.threeStage(THREE, stage);
      var renderer = S.renderer;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.shadowMap.enabled = true;
      var scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x8fb8de, 0.0032);
      var camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.5, 2500);
      var controls = new OC.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.48; controls.enabled = false;

      var composer = new EC.EffectComposer(renderer);
      composer.addPass(new RP.RenderPass(scene, camera));
      var bloom = new UB.UnrealBloomPass(new THREE.Vector2(640, 360), 0.5, 0.35, 0.92);
      renderer.info.autoReset = false;                                   // composer renders several passes; count the whole frame
      composer.addPass(bloom);
      composer.addPass(new OP.OutputPass());
      S.resize(function (w, h) { camera.aspect = w / h; camera.updateProjectionMatrix(); composer.setSize(w, h); });

      var hemi = new THREE.HemisphereLight(0xcfe3ff, 0x3a3128, 1.0); scene.add(hemi);
      var sun = new THREE.DirectionalLight(0xffffff, 2.5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006;
      scene.add(sun); scene.add(sun.target);

      // --- building material: MeshStandardMaterial + injected GLSL that draws windows from world position ---
      var U = { uNight: { value: 0 }, uLit: { value: 0.45 } };
      var bMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0.05 });
      bMat.onBeforeCompile = function (sh) {
        sh.uniforms.uNight = U.uNight; sh.uniforms.uLit = U.uLit;
        sh.vertexShader = 'varying vec3 vWorldP;\nvarying vec3 vObjN;\n' + sh.vertexShader.replace('#include <begin_vertex>',
          '#include <begin_vertex>\n#ifdef USE_INSTANCING\n vWorldP = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;\n#else\n vWorldP = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#endif\n vObjN = normal;');
        sh.fragmentShader = 'uniform float uNight;\nuniform float uLit;\nvarying vec3 vWorldP;\nvarying vec3 vObjN;\nfloat h21(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }\n' +
          sh.fragmentShader.replace('#include <emissivemap_fragment>', [
            '#include <emissivemap_fragment>',
            '{',
            '  vec3 n = normalize(vObjN);',
            '  if (abs(n.y) < 0.5 && vWorldP.y > 3.4) {',
            '    float along = abs(n.x) > 0.5 ? vWorldP.z : vWorldP.x;',
            '    float fl = floor(vWorldP.y / 3.2); float co = floor(along / 2.2);',
            '    vec2 f = vec2(fract(along / 2.2), fract(vWorldP.y / 3.2));',
            '    float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.3, f.y) * step(f.y, 0.85);',
            '    float face = n.x + n.z * 3.0;',
            '    float lit = step(1.0 - uLit, h21(vec2(co + face * 131.0, fl)));',
            '    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.06, 0.08, 0.11), win * 0.8);',
            '    vec3 wc = mix(vec3(1.0, 0.72, 0.4), vec3(0.7, 0.82, 1.0), h21(vec2(fl * 7.0, co)));',
            '    totalEmissiveRadiance += wc * win * lit * uNight * 1.25;',
            '  }',
            '}'].join('\n'));
      };
      var unitBox = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
      var slabMat = new THREE.MeshStandardMaterial({ color: 0x8e8b86, roughness: 0.95 });
      var lampMat = new THREE.MeshBasicMaterial({ color: 0xffd28a });
      var carMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var ground = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.MeshStandardMaterial({ color: 0x2b2d31, roughness: 1 }));
      ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

      var city = new THREE.Group(); scene.add(city);
      var buildings, slabs, lamps, cars, carState = [], L = 100, P = 32, nStreets = 0, nBuildings = 0;
      var fly, street;
      var $ = function (id) { return document.getElementById(id); };
      var blocks = Demo.slider('cityBlocks', function (v) { return v + ' × ' + v; });
      var maxH = Demo.slider('cityH', function (v) { return v + ' m'; });
      var dens = Demo.slider('cityDens', function (v) { return Math.round(v * 100) + '%'; });
      var seedS = Demo.slider('citySeed');
      var tod = Demo.slider('cityTime', function (v) { var h = Math.floor(v), m = Math.round((v - h) * 60); return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; });
      var litS = Demo.slider('cityLit', function (v) { return Math.round(v * 100) + '%'; });
      var nCars = Demo.slider('cityCars');

      function rng(seed) { var s = seed * 9301 + 49297; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

      function build() {
        city.children.slice().forEach(function (c) { city.remove(c); if (c.dispose) c.dispose(); });
        var N = blocks(), B = 24, W = 8; P = B + W; L = N * P / 2;
        var r = rng(seedS() + 1), H = maxH(), D = dens();
        var mats = [], cols = [], m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
        var slabList = [];
        for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
          var cx = (i - (N - 1) / 2) * P, cz = (j - (N - 1) / 2) * P;
          slabList.push([cx, cz]);
          var dist = Math.hypot(cx, cz) / (L * 1.1), centre = Math.max(0, 1 - dist);
          if (r() < 0.06 && Math.abs(i - N / 2) > 1) continue;            // a few parks / empty lots
          var g = r() < 0.5 ? 2 : 3, lot = B / g;
          for (var a = 0; a < g; a++) for (var b = 0; b < g; b++) {
            if (r() > D) continue;
            var w = lot - 1.5 - r() * 2.5, d = lot - 1.5 - r() * 2.5;
            var h = 6 + r() * 10 + Math.pow(centre, 1.6) * H * (0.35 + 0.65 * r());
            if (r() < 0.03 * centre) h *= 1.6;                                  // occasional tower
            v.set(cx - B / 2 + (a + 0.5) * lot, 0.2, cz - B / 2 + (b + 0.5) * lot); s.set(w, h, d);
            m4.compose(v, q, s); mats.push(m4.clone());
            c.setHSL(0.06 + r() * 0.08, 0.06 + r() * 0.16, 0.42 + r() * 0.32); cols.push(c.clone());
          }
        }
        nBuildings = mats.length;
        buildings = new THREE.InstancedMesh(unitBox, bMat, Math.max(1, mats.length));
        mats.forEach(function (m, k) { buildings.setMatrixAt(k, m); buildings.setColorAt(k, cols[k]); });
        buildings.count = mats.length; buildings.castShadow = true; buildings.receiveShadow = true;
        city.add(buildings);
        slabs = new THREE.InstancedMesh(unitBox, slabMat, slabList.length);
        slabList.forEach(function (p, k) { slabs.setMatrixAt(k, m4.compose(v.set(p[0], 0, p[1]), q, s.set(B + 1, 0.2, B + 1))); });
        slabs.receiveShadow = true; city.add(slabs);
        // street lamps at block corners
        var lampPos = [];
        for (i = 0; i <= N; i++) for (j = 0; j <= N; j++) {
          var x = (i - N / 2) * P, z = (j - N / 2) * P;
          [[-1, -1], [1, 1]].forEach(function (o) { lampPos.push([x + o[0] * (W / 2 + 0.3), z + o[1] * (W / 2 + 0.3)]); });
        }
        lamps = new THREE.InstancedMesh(new THREE.SphereGeometry(0.35, 8, 6), lampMat, lampPos.length);
        lampPos.forEach(function (p, k) { lamps.setMatrixAt(k, m4.compose(v.set(p[0], 5, p[1]), q, s.set(1, 1, 1))); });
        city.add(lamps);
        // traffic: each car lives on one street line, moving along x or z, in one of two lanes
        nStreets = N + 1; carState = [];
        var CN = nCars();
        // each "car" is only its light bar (headlights or tail lights): at night that is all you see
        cars = new THREE.InstancedMesh(new THREE.BoxGeometry(1.6, 0.28, 0.5).translate(0, 0.7, 0), carMat, Math.max(1, CN));
        for (var k = 0; k < CN; k++) {
          var dirn = r() < 0.5 ? 1 : -1;
          carState.push({ axis: r() < 0.5 ? 0 : 1, line: (Math.floor(r() * nStreets) - N / 2) * P, lane: dirn * 1.9, dir: dirn, s: (r() * 2 - 1) * L, v: 9 + r() * 7 });
          cars.setColorAt(k, c.set(dirn > 0 ? 0xfff2d0 : 0xff3b2f));
        }
        cars.count = CN; city.add(cars);
        // camera paths
        var pts = [];
        for (k = 0; k < 10; k++) { var ang = k / 10 * Math.PI * 2, rad = L * (0.55 + 0.25 * Math.sin(k * 1.7)); pts.push(new THREE.Vector3(Math.cos(ang) * rad, 30 + 35 * Math.abs(Math.sin(k * 0.9)) + H * 0.6, Math.sin(ang) * rad)); }
        fly = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
        var zLine = ((N % 2) ? P / 2 : 0) + 3.3;                           // a street near the centre, at the kerb beside the outer lane
        street = new THREE.CatmullRomCurve3([new THREE.Vector3(-L, 1.7, zLine), new THREE.Vector3(L, 1.7, zLine)]);
        // sun shadow covers the whole city
        var sc = sun.shadow.camera; sc.left = -L * 1.1; sc.right = L * 1.1; sc.top = L * 1.1; sc.bottom = -L * 1.1; sc.near = 1; sc.far = L * 6; sc.updateProjectionMatrix();
        camera.far = L * 8; camera.updateProjectionMatrix();
        controls.target.set(0, 10, 0);
        if (!controls.enabled) camera.position.set(L, L * 0.6, L);
      }
      var tmr = 0;
      ['cityBlocks', 'cityH', 'cityDens', 'citySeed', 'cityCars'].forEach(function (id) { $(id).addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(build, 200); }); });
      build();

      var day = new THREE.Color(0x8fb8de), dusk = new THREE.Color(0xe59a6a), night = new THREE.Color(0x070b16), sky = new THREE.Color();
      function lighting() {
        var t = tod(), el = Math.sin((t - 6) / 12 * Math.PI);                // sun elevation proxy: +1 noon, -1 midnight
        var dayK = THREE.MathUtils.smoothstep(el, -0.08, 0.3), duskK = Math.exp(-Math.pow(el / 0.18, 2));
        sky.copy(night).lerp(day, dayK).lerp(dusk, duskK * 0.65);
        scene.background = sky; scene.fog.color.copy(sky);
        var az = (t - 6) / 12 * Math.PI;
        sun.position.set(Math.cos(az) * L * 2, Math.max(0.05, el) * L * 2.5, L * 0.8); sun.target.position.set(0, 0, 0);
        sun.intensity = 3 * dayK; sun.color.setHSL(0.09, 0.6 * (1 - dayK) + 0.2, 0.75);
        hemi.intensity = 0.12 + 1.1 * dayK;
        var nightK = 1 - THREE.MathUtils.smoothstep(el, -0.12, 0.12);
        U.uNight.value = nightK; U.uLit.value = litS();
        lampMat.color.setScalar(0.25 + 1.0 * nightK).multiply(new THREE.Color(0xffd28a)).multiplyScalar(1 + nightK * 2);
        carMat.color.setScalar(0.35 + 1.3 * nightK);
        renderer.toneMappingExposure = 0.9 - nightK * 0.1;
        bloom.strength = 0.08 + nightK * 0.5;
        return nightK;
      }

      var hud = stage.querySelector('.hud'), fps = Demo.fpsMeter(), u = 0, m4c = new THREE.Matrix4(), qc = new THREE.Quaternion(), vc = new THREE.Vector3(), sc1 = new THREE.Vector3(1, 1, 1), yaw = new THREE.Euler();
      var camSel = $('cityCam');
      camSel.addEventListener('change', function () {
        controls.enabled = camSel.value === 'orbit';
        if (controls.enabled) { camera.position.set(L * 0.8, L * 0.5, L * 0.8); controls.target.set(0, 10, 0); }
      });

      S.start(function (now, dt) {
        renderer.info.reset();
        lighting();
        // traffic update (CPU writes instance matrices each frame)
        if ($('cityTraffic').checked) {
          for (var k = 0; k < carState.length; k++) {
            var cs = carState[k]; cs.s += cs.dir * cs.v * dt; if (cs.s > L) cs.s = -L; if (cs.s < -L) cs.s = L;
            if (cs.axis === 0) { vc.set(cs.s, 0, cs.line + cs.lane); yaw.set(0, Math.PI / 2, 0); } else { vc.set(cs.line + cs.lane, 0, cs.s); yaw.set(0, 0, 0); }
            qc.setFromEuler(yaw); cars.setMatrixAt(k, m4c.compose(vc, qc, sc1));
          }
          cars.instanceMatrix.needsUpdate = true;
        }
        cars.visible = $('cityTraffic').checked;
        var mode = camSel.value, sp = +$('citySpeed').value;
        if (mode === 'fly') {
          u = (u + dt * 0.012 * sp) % 1;
          camera.position.copy(fly.getPointAt(u));
          var ahead = fly.getPointAt((u + 0.03) % 1); ahead.y -= 14; ahead.lerp(new THREE.Vector3(0, 10, 0), 0.2);
          camera.lookAt(ahead);
        } else if (mode === 'street') {
          u = (u + dt * 0.01 * sp) % 1;
          camera.position.copy(street.getPointAt(u));
          camera.lookAt(street.getPointAt(Math.min(1, u + 0.02)).add(new THREE.Vector3(0, 0.6, -0.8)));
        } else controls.update();
        if ($('cityBloom').checked) composer.render(); else renderer.render(scene, camera);
        var f = fps(now);
        hud.textContent = nBuildings.toLocaleString() + ' buildings in 1 InstancedMesh · ' + carState.length + ' cars\n' +
          'draw calls ' + renderer.info.render.calls + ' · ' + (renderer.info.render.triangles / 1000).toFixed(0) + 'k tris · ' + (f ? f + ' fps' : '…');
      });
    });
})();
