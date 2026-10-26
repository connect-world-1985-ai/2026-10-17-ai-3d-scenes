/* Camera & scene-graph toy — an overview camera looks at a "subject" camera whose frustum you edit;
   the inset shows what the subject camera sees. Three.js from CDN. */
(function () {
  'use strict';
  Demo.runThree('camStage', ['controls/OrbitControls.js'], function (stage, THREE, OC) {
    var S = Demo.threeStage(THREE, stage);
    var renderer = S.renderer;
    renderer.setScissorTest(true);

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14171c);
    scene.add(new THREE.HemisphereLight(0xdde6ff, 0x30281e, 1.2));
    var sun = new THREE.DirectionalLight(0xffffff, 2); sun.position.set(4, 8, 3); scene.add(sun);
    scene.add(new THREE.GridHelper(20, 20, 0x3a4250, 0x262b33));

    // scene graph: Scene > orbit (Group) > planet (Mesh) > moon (Mesh)
    var orbit = new THREE.Group(); orbit.name = 'orbit'; scene.add(orbit);
    var star = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 16), new THREE.MeshStandardMaterial({ color: 0xffb347, emissive: 0x8a4a00 }));
    star.position.y = 1; scene.add(star);
    var planet = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 16), new THREE.MeshStandardMaterial({ color: 0x4d8cff, roughness: 0.6 }));
    planet.position.set(3, 1, 0); orbit.add(planet);
    var moon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 8), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    moon.position.set(0.85, 0, 0); planet.add(moon);
    // a row of boxes at known distances to show near/far clipping
    for (var i = 0; i < 8; i++) {
      var b = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6 + i * 0.25, 0.6), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(i / 8, 0.55, 0.55) }));
      b.position.set(-3.2, (0.6 + i * 0.25) / 2, 4 - i * 2.2); scene.add(b);
    }

    var subject = new THREE.PerspectiveCamera(50, 16 / 9, 0.5, 14);
    var subjectO = new THREE.OrthographicCamera(-4, 4, 2.25, -2.25, 0.5, 14);
    [subject, subjectO].forEach(function (c) { c.position.set(1.5, 2.2, 9); c.lookAt(0, 1, 0); });
    var helperP = new THREE.CameraHelper(subject), helperO = new THREE.CameraHelper(subjectO);
    scene.add(helperP, helperO);
    var camBody = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.5), new THREE.MeshStandardMaterial({ color: 0xe11d48 }));
    camBody.position.copy(subject.position); camBody.lookAt(0, 1, 0); scene.add(camBody);

    var overview = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 200);
    overview.position.set(14, 11, 14);
    var controls = new OC.OrbitControls(overview, renderer.domElement);
    controls.target.set(0, 1, 2); controls.enableDamping = true;

    var W = 640, H = 360;
    S.resize(function (w, h) { W = w; H = h; overview.aspect = w / h; overview.updateProjectionMatrix(); });

    var fov = Demo.slider('camFov', function (v) { return v + '°'; });
    var near = Demo.slider('camNear', function (v) { return v.toFixed(1); });
    var far = Demo.slider('camFar', function (v) { return v.toFixed(0); });
    var speed = Demo.slider('camSpeed', function (v) { return v.toFixed(1) + '×'; });
    var proj = document.getElementById('camProj');
    var showH = document.getElementById('camHelper');
    var hud = stage.querySelector('.hud');
    var fps = Demo.fpsMeter();
    var angle = 0;

    S.start(function (now, dt) {
      angle += dt * speed();
      orbit.rotation.y = angle;              // rotating the parent moves every child with it
      planet.rotation.y = angle * 3;         // the moon orbits the planet because it is the planet's child
      var ortho = proj.value === 'ortho';
      var cam = ortho ? subjectO : subject;
      var aspect = 16 / 9;
      subject.fov = fov(); subject.aspect = aspect;
      var hh = Math.tan(fov() * Math.PI / 360) * 9; subjectO.top = hh; subjectO.bottom = -hh; subjectO.left = -hh * aspect; subjectO.right = hh * aspect;
      [subject, subjectO].forEach(function (c) { c.near = near(); c.far = Math.max(near() + 0.5, far()); c.updateProjectionMatrix(); });
      helperP.visible = showH.checked && !ortho; helperO.visible = showH.checked && ortho;
      helperP.update(); helperO.update();
      controls.update();

      // 1) overview, full canvas
      renderer.setViewport(0, 0, W, H); renderer.setScissor(0, 0, W, H);
      renderer.render(scene, overview);
      // 2) inset: what the subject camera sees (helpers hidden so it does not see itself)
      var iw = Math.round(Math.min(W * 0.36, 360)), ih = Math.round(iw / aspect), m = 10;
      renderer.setScissor(W - iw - m - 2, m - 2, iw + 4, ih + 4); renderer.setClearColor(0xe11d48); renderer.clear();
      renderer.setViewport(W - iw - m, m, iw, ih); renderer.setScissor(W - iw - m, m, iw, ih); renderer.setClearColor(0x000000);
      var hp = helperP.visible, ho = helperO.visible; helperP.visible = helperO.visible = false; camBody.visible = false;
      renderer.render(scene, cam);
      helperP.visible = hp; helperO.visible = ho; camBody.visible = true;
      var f = fps(now);
      hud.textContent = 'Scene › orbit (Group) › planet › moon\n' + (ortho ? 'orthographic' : 'perspective fov ' + fov() + '°') + ' · near ' + near().toFixed(1) + ' · far ' + far().toFixed(0) + ' · ' + (f ? f + ' fps' : '…') + '\nred-framed inset = what the red camera sees';
    });
  });
})();
