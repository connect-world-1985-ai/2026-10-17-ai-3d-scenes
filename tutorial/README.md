# How an agent actually builds a 3D scene

A narrated lesson on the field guide in `site/`. It is meant to be watched: the mechanisms in order, with the pictures that make them concrete.

On the published site:

- the recording is `watch.html` (the file is `how_an_agent_builds_a_3d_scene.mp4`, about 36 minutes)
- the same lesson drawn live is `film.html`

Open `film.html` through a local server and press play. The chapter bar seeks. Left and right arrows move five seconds. The page is drawn at 1920×1080 and scaled to the window. A recording pass (`?record=1`) keeps the exact pixel size.

```bash
cd tutorial
python3 -m http.server 8765
```

Then visit `http://127.0.0.1:8765/film.html`.

The recording is produced with `node record.mjs` after `python3 build_audio.py`. Narration is generated, not read from the HTML pages. The numbers match the guide’s 17 October 2026 snapshot. The finished lesson is about 36 minutes.

`record.mjs` captures with Playwright. That capture stamps frames on a 25 fps clock that runs ahead of the page, and not at a steady rate, so a single speed change only lines the ending up with the narration. The picture in the middle can still sit about fifteen seconds off the voice. The shipped lesson was retimed from the clock in the corner so the captions meet the narration.

Rebuild the voice and the timeline with `python3 build_audio.py`. That rewrites `timeline.js` and `audio/narration.m4a`. Do not loudness-normalize the track: a filter that changes duration will desync the captions.
