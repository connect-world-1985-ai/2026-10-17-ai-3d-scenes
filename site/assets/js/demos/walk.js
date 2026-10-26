/* First-person walk toy — pointer-lock mouse look, WASD, gravity, capsule-vs-octree collision
   (the same approach as the official three.js games_fps example). Three.js from CDN. */
(function () {
  'use strict';
  Demo.runThree('walkStage', ['math/Octree.js', 'math/Capsule.js', 'helpers/OctreeHelper.js'], function (stage, THREE, OT, CP, OH) {
    var S = Demo.threeStage(THREE, stage);
    var renderer = S.renderer;
    renderer.shadowMap.enabled = true;
    var scene = new THREE.Scene();
    var skyCol = new THREE.Color(0x9cc3e6);
    scene.background = skyCol; scene.fog = new THREE.Fog(skyCol, 20, 90);
    scene.add(new THREE.HemisphereLight(0xdfeaff, 0x5a4a3a, 1.3));
    var sun = new THREE.DirectionalLight(0xfff1dd, 2.2);
    sun.position.set(-25, 40, 15); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    var sc = sun.shadow.camera; sc.left = -45; sc.right = 45; sc.top = 45; sc.bottom = -45; sc.far = 120; sun.shadow.bias = -0.0004;
    scene.add(sun);
    var camera = new THREE.PerspectiveCamera(70, 16 / 9, 0.05, 200);
    camera.rotation.order = 'YXZ';
    S.resize(function (w, h) { camera.aspect = w / h; camera.updateProjectionMatrix(); });

    // ---- world: a small street grid built from boxes (everything here is collidable) ----
    var world = new THREE.Group(); scene.add(world);
    function box(w, h, d, x, y, z, color, rotX) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: color, roughness: 0.85 }));
      m.position.set(x, y, z); if (rotX) m.rotation.x = rotX;
      m.castShadow = true; m.receiveShadow = true; world.add(m); return m;
    }
    box(120, 1, 120, 0, -0.5, 0, 0x3b3e43);                      // asphalt
    var rnd = (function (s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; })(7);
    var BLOCK = 18, STREET = 8;
    for (var bx = -2; bx <= 2; bx++) for (var bz = -2; bz <= 2; bz++) {
      var cx = bx * (BLOCK + STREET), cz = bz * (BLOCK + STREET);
      box(BLOCK + 3, 0.18, BLOCK + 3, cx, 0.09, cz, 0x9a968f);   // sidewalk slab (0.18 m kerb)
      if (bx === 0 && bz === 0) continue;                         // central plaza
      for (var i = 0; i < 2; i++) for (var k = 0; k < 2; k++) {
        var h = 6 + rnd() * 22, w = BLOCK / 2 - 1;
        box(w, h, w, cx + (i - 0.5) * BLOCK / 2, h / 2 + 0.18, cz + (k - 0.5) * BLOCK / 2, new THREE.Color().setHSL(0.07 + rnd() * 0.08, 0.15 + rnd() * 0.2, 0.45 + rnd() * 0.25));
      }
    }
    // plaza props: stairs, a ramp, crates, lamp posts
    for (var st = 0; st < 8; st++) box(4, 0.2 * (st + 1), 0.6, -4, 0.1 * (st + 1) + 0.18, -3 + st * 0.6, 0xb8b2a6);
    box(4, 1.6, 4.8, -4, 0.8 + 0.18, 3.0, 0xb8b2a6);              // landing on top of stairs
    var ramp = box(3, 0.3, 9, 4, 0.9, 1, 0x8f6e4a, -0.2);
    box(1.2, 1.2, 1.2, 1, 0.78, -5, 0xa47a3c); box(1.2, 1.2, 1.2, 2.3, 0.78, -5.2, 0xa47a3c); box(1.2, 1.2, 1.2, 1.6, 1.98, -5.1, 0xa47a3c);
    for (var lp = -1; lp <= 1; lp += 2) for (var lq = -1; lq <= 1; lq += 2) box(0.2, 4, 0.2, lp * 9.5, 2.18, lq * 9.5, 0x2c2f33);

    var octree = new OT.Octree();
    octree.fromGraphNode(world);
    var helper = new OH.OctreeHelper(octree); helper.visible = false; scene.add(helper);

    // ---- player ----
    var GRAVITY = 25, EYE = 1.65, RADIUS = 0.35;
    var collider = new CP.Capsule(new THREE.Vector3(0, RADIUS + 0.2, 8), new THREE.Vector3(0, EYE + 0.2, 8), RADIUS);
    var vel = new THREE.Vector3(), dir = new THREE.Vector3(), onFloor = false;
    var keys = {};
    var colChk = document.getElementById('walkCollide'), octChk = document.getElementById('walkOctree');
    var hud = stage.querySelector('.hud');
    var fps = Demo.fpsMeter();
    stage.tabIndex = 0;

    function active() { return document.pointerLockElement === renderer.domElement || document.activeElement === stage; }
    document.addEventListener('keydown', function (e) {
      if (!active()) return;
      keys[e.code] = true;
      if (/^(Arrow|Space)/.test(e.code)) e.preventDefault();
    });
    document.addEventListener('keyup', function (e) { keys[e.code] = false; });
    stage.addEventListener('blur', function () { keys = {}; });

    // mouse look: pointer lock on desktop; drag-to-look fallback (also touch)
    var lockBtn = document.createElement('button');
    lockBtn.className = 'overlay-btn'; lockBtn.textContent = 'Click to walk — WASD + mouse, Space jumps, Esc releases';
    stage.appendChild(lockBtn);
    lockBtn.addEventListener('click', function () {
      stage.focus();
      if (renderer.domElement.requestPointerLock && matchMedia('(pointer: fine)').matches) {
        try { var r = renderer.domElement.requestPointerLock(); if (r && r.catch) r.catch(function () {}); } catch (e) {}
      }
      lockBtn.style.display = 'none';
    });
    document.addEventListener('pointerlockchange', function () { if (!document.pointerLockElement) lockBtn.style.display = ''; });
    document.addEventListener('mousemove', function (e) {
      if (document.pointerLockElement !== renderer.domElement) return;
      camera.rotation.y -= e.movementX / 500; camera.rotation.x = Math.max(-1.5, Math.min(1.5, camera.rotation.x - e.movementY / 500));
    });
    var drag = null;
    renderer.domElement.addEventListener('pointerdown', function (e) { if (document.pointerLockElement) return; drag = { x: e.clientX, y: e.clientY }; stage.focus(); lockBtn.style.display = 'none'; });
    window.addEventListener('pointerup', function () { drag = null; });
    renderer.domElement.addEventListener('pointermove', function (e) {
      if (!drag) return;
      camera.rotation.y -= (e.clientX - drag.x) / 250; camera.rotation.x = Math.max(-1.5, Math.min(1.5, camera.rotation.x - (e.clientY - drag.y) / 250));
      drag = { x: e.clientX, y: e.clientY };
    });
    // touch buttons
    [['walkFwd', 'KeyW'], ['walkBack', 'KeyS'], ['walkJump', 'Space']].forEach(function (pair) {
      var b = document.getElementById(pair[0]); if (!b) return;
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); keys[pair[1]] = true; lockBtn.style.display = 'none'; });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, function () { keys[pair[1]] = false; }); });
    });

    function forward() { camera.getWorldDirection(dir); dir.y = 0; return dir.normalize(); }
    function side() { camera.getWorldDirection(dir); dir.y = 0; dir.normalize(); return dir.cross(camera.up); }
    function collide() {
      var r = octree.capsuleIntersect(collider);
      onFloor = false;
      if (r) {
        onFloor = r.normal.y > 0;
        if (!onFloor) vel.addScaledVector(r.normal, -r.normal.dot(vel));
        if (r.depth >= 1e-10) collider.translate(r.normal.multiplyScalar(r.depth));
      }
    }
    function step(dt) {
      var collisions = colChk.checked;
      var accel = dt * (onFloor || !collisions ? 25 : 8);
      if (keys.KeyW || keys.ArrowUp) vel.add(forward().multiplyScalar(accel));
      if (keys.KeyS || keys.ArrowDown) vel.add(forward().multiplyScalar(-accel));
      if (keys.KeyA || keys.ArrowLeft) vel.add(side().multiplyScalar(-accel));
      if (keys.KeyD || keys.ArrowRight) vel.add(side().multiplyScalar(accel));
      if (onFloor && keys.Space) vel.y = 8;
      var damping = Math.exp(-4 * dt) - 1;
      if (collisions) {
        if (!onFloor) { vel.y -= GRAVITY * dt; damping *= 0.1; }
      } else { vel.y = 0; onFloor = false; }
      vel.addScaledVector(vel, damping);
      collider.translate(vel.clone().multiplyScalar(dt));
      if (collisions) collide();
      if (collider.end.y < -20) { collider.start.set(0, RADIUS + 0.2, 8); collider.end.set(0, EYE + 0.2, 8); vel.set(0, 0, 0); }
    }

    S.start(function (now, dt) {
      var STEPS = 5;
      for (var i = 0; i < STEPS; i++) step(dt / STEPS);   // sub-steps prevent tunnelling through thin walls
      camera.position.copy(collider.end);
      helper.visible = octChk.checked;
      renderer.render(scene, camera);
      var f = fps(now), p = collider.end;
      hud.textContent = 'pos ' + p.x.toFixed(1) + ', ' + (p.y - EYE).toFixed(2) + ', ' + p.z.toFixed(1) + ' · ' + (colChk.checked ? (onFloor ? 'on ground' : 'in air') : 'collision OFF (ghost)') + ' · ' + renderer.info.render.calls + ' draw calls · ' + (f ? f + ' fps' : '…');
    });
  });
})();
