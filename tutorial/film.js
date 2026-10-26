(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var RECORD = params.get('record') === '1';
  var preview = params.has('t') ? parseFloat(params.get('t')) : null;
  if (RECORD) document.body.classList.add('record');

  var stage = document.getElementById('stage');
  var caption = document.getElementById('caption');
  var chapterLabel = document.getElementById('chapterLabel');
  var clock = document.getElementById('clock');
  var progress = document.getElementById('progress');

  if (!window.TIMELINE) {
    caption.textContent = 'Narration is not built yet. Run python3 build_audio.py in the tutorial folder.';
    return;
  }

  var TL = window.TIMELINE;
  var currentId = null;
  var playing = false;
  var origin = 0;
  var audio = null;
  var scrubbing = false;

  TL.chapters.forEach(function (ch, i) {
    var b = document.createElement('b');
    b.title = ch.title;
    b.dataset.i = String(i);
    if (!RECORD) {
      b.classList.add('hit');
      b.addEventListener('click', function () { seek(ch.start + 0.01); });
    }
    progress.appendChild(b);
  });

  function fmt(t) {
    t = Math.max(0, t);
    var s = Math.floor(t);
    var m = Math.floor(s / 60);
    return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function findScene(t) {
    var scenes = TL.scenes;
    for (var i = 0; i < scenes.length; i++) {
      if (t >= scenes[i].start && t < scenes[i].end) return scenes[i];
    }
    return scenes[scenes.length - 1];
  }

  function activeLine(scene, t) {
    var cur = null;
    for (var i = 0; i < scene.lines.length; i++) {
      if (scene.lines[i].start <= t + 0.03) cur = scene.lines[i];
    }
    return cur;
  }

  function render(t) {
    if (t < 0) t = 0;
    if (t > TL.duration) t = TL.duration;
    var scene = findScene(t);
    var line = activeLine(scene, t);
    if (scene.id !== currentId) {
      currentId = scene.id;
      if (stage._cleanup) { stage._cleanup(); stage._cleanup = null; }
      var vis = window.Visuals[scene.visual] || window.Visuals.cards;
      vis.enter(stage, scene);
    }
    var beat = line ? line.beat : null;
    var visTick = window.Visuals[scene.visual] || window.Visuals.cards;
    if (visTick.tick) visTick.tick(stage, { scene: scene, line: line, beat: beat, local: t - scene.start, t: t });
    caption.textContent = line ? line.show : '';
    chapterLabel.textContent = scene.chapter;
    clock.textContent = fmt(t);
    var bars = progress.children;
    for (var i = 0; i < TL.chapters.length; i++) {
      var ch = TL.chapters[i];
      bars[i].classList.toggle('done', t >= ch.end);
      bars[i].classList.toggle('on', t >= ch.start && t < ch.end);
    }
    if (playing && t >= TL.duration - 0.04) {
      playing = false;
      window.__done = true;
    }
  }

  function now() {
    if (preview != null && !playing) return Math.min(TL.duration, Math.max(0, preview));
    if (audio && !scrubbing) return audio.currentTime;
    if (!playing) return preview != null ? preview : 0;
    return (performance.now() - origin) / 1000;
  }

  function frame() {
    render(now());
    if (RECORD || playing || preview == null) requestAnimationFrame(frame);
  }

  function seek(t) {
    t = Math.max(0, Math.min(TL.duration - 0.05, t));
    if (audio) {
      audio.currentTime = t;
    } else {
      origin = performance.now() - t * 1000;
      preview = t;
    }
    render(t);
  }

  window.__renderAt = function (t) { preview = t; playing = false; render(t); };
  window.__armed = false;
  window.__done = false;

  window.__start = function () {
    document.body.classList.add('sync');
    var t0 = performance.now();
    function hold() {
      if (performance.now() - t0 < 450) { requestAnimationFrame(hold); return; }
      document.body.classList.remove('sync');
      origin = performance.now();
      playing = true;
      preview = null;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(hold);
  };

  if (RECORD) {
    window.__armed = true;
    render(0);
  } else if (preview != null) {
    render(preview);
  } else {
    render(0);
    var gate = document.createElement('div');
    gate.className = 'gate';
    var mins = Math.max(1, Math.round(TL.duration / 60));
    gate.innerHTML =
      '<div class="panel"><div class="kicker">A spoken lesson</div>' +
      '<h1>How an agent actually builds a 3D scene</h1>' +
      '<p class="sub">About ' + mins + ' minutes, with the words on screen. ' +
      'The same film as the recording. Drag the chapter bar to move.</p>' +
      '<button type="button" id="playBtn">Play the lesson</button></div>';
    document.body.appendChild(gate);
    document.getElementById('playBtn').addEventListener('click', function () {
      audio = new Audio('audio/narration.m4a');
      audio.play().then(function () {
        gate.remove();
        playing = true;
        requestAnimationFrame(frame);
      });
    });
  }

  if (!RECORD) {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var base = audio ? audio.currentTime : now();
      seek(base + (e.key === 'ArrowRight' ? 5 : -5));
    });
  }
})();
