# AI 3D scenes — a field guide

A research snapshot from 17 October 2026 of how coding agents produce interactive 3D scenes, and a narrated lesson that teaches the same material from the pixels inward. You can watch it. You do not have to read every page first.

## Watch and read

The published site is [AI 3D scenes](https://connect-world-1985-ai.github.io/2026-10-17-ai-3d-scenes/).

| | What you get |
| --- | --- |
| [Watch the recording](https://connect-world-1985-ai.github.io/2026-10-17-ai-3d-scenes/tutorial/watch.html) | The 36-minute lesson, with chapter jumps. The file is `tutorial/how_an_agent_builds_a_3d_scene.mp4`. |
| [Open the live lesson](https://connect-world-1985-ai.github.io/2026-10-17-ai-3d-scenes/tutorial/film.html) | The same narration, drawn in the browser. Pause on a diagram or a shader. |
| [Read the field guide](https://connect-world-1985-ai.github.io/2026-10-17-ai-3d-scenes/site/) | Sixteen pages, live demos, sources, and starter prompts. |

## What is in this repository

- `site/` is the field guide: taxonomy, rendering, two full recipes (ocean and city), agent workflow, and the limits of a “one prompt” demo.
- `tutorial/` is the lesson. `film.html` plays the narration against live pictures. `watch.html` plays the finished recording. `script.py` is the spoken script.
- `docs/memory/` holds the research notes the guide was written from.

The lesson adds the connecting explanation that the pages assume: where a pixel can come from, what one frame has to do, how light and shaders spend the frame budget, then the ocean and the city, then the agent loop, then what “one prompt” actually was.

## Run it on your machine

No build step. From the repository root:

```bash
python3 -m http.server 8765
```

Then open:

- http://127.0.0.1:8765/ — this front door
- http://127.0.0.1:8765/tutorial/watch.html — the recording
- http://127.0.0.1:8765/tutorial/film.html — the live lesson
- http://127.0.0.1:8765/site/ — the field guide

Several demos load Three.js `0.186.1` from unpkg. The raymarched city and the wave toy are raw WebGL and run offline.

Rebuilding the narration or the recording is described in [`tutorial/README.md`](tutorial/README.md).

## If the site link does not open

The pages are the files at the root of `main` (`.nojekyll` is there so GitHub serves them as they are). In the repository settings, open **Pages** and choose **Deploy from a branch**, branch **main**, folder **/ (root)**.

This repository is private. On a free GitHub plan, Pages is only offered for public repositories, so the published address stays dark until the plan allows it or the repository is public. The video and the HTML are in the repository either way, and the local server above plays both.
