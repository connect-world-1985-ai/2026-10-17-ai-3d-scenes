# Tracker — AI 3D scenes research site

Status legend: [ ] todo · [~] in progress · [x] done

## Phase A — Setup
- [x] A1 Create folder, memory file, tracker
- [x] A2 Dispatch research subagents r1–r6 (Sonnet, background)

## Phase B — Research notes (`research-notes/`) — all 6 written 2026-10-17 22:30–22:37
- [x] r1 Browser real-time stack
- [x] r2 Shader art & recipes
- [x] r3 Game engines + MCP
- [x] r4 Geodata, captured reality, generative 3D/world models
- [x] r5 Asset sources & licences
- [x] r6 Agent workflows & one-prompt demos
- [x] B7 verified: 25 repos via `gh api` (match notes ±5 stars); AA-3D article (re-read in full while writing p11); night-street README+PROMPTS; Epic City Sample "we used Claude"; Google Map Tiles policies + 3D Tiles page (re-fetched during QA)
- [x] Demos written + tested on file:// (Edge headless). CDN = unpkg (jsDelivr connection reset from this network). PCFSoftShadowMap removed in r186.

## Phase C — Site skeleton
- [x] C1 site.css · [x] C2 site.js · [x] C3 index.html

## Phase D — Pages (write) + demos
- [x] 01–09 (demos: camera, pbr, raymarch, instancing, walk, waves, ocean3, city)
- [x] 10-assets · [x] 11-agent-workflow · [x] 12-one-prompt-truth
- [x] 13-practical (+ live device probe `assets/js/demos/probe.js`, no network)
- [x] 14-decision · [x] 15-hands-on · [x] 16-next-directions · [x] glossary · [x] sources (#method, #evidence-tags, #gaps)

## Phase E — QA (all 2026-10-17, Edge 154 headless, file://)
- [x] E1 0 console/page errors on all 19 pages (`node shot.js <page>`)
- [x] E2 Internal links: 951 links, 0 broken pages/anchors (`node links.js`)
- [x] E3 Demos render (HUDs read) · offline: Three.js demos show fallback, raw-WebGL demos run · `--nogl`: WebGL-missing message on all demos
- [x] E4 Mobile 390px: no horizontal overflow (fixed prompt-box wrap on p15; diagrams scroll sideways below 600px)
- [x] E5 grep: no fetch/XHR/local module imports in site/
- [x] E6 External URLs: 146/178 HTTP 200 · 1 real 404 fixed (threejs `webgl_water` → `webgpu_water`) · 16 × 403 bot-blocking (ShaderToy, DOI, Fab, Epic, arena.ai, si.edu) · 15 unreachable from this network (Google/YouTube/itch/note.com/meshy/tripo/blockade); two Google pages re-checked via WebFetch OK
- [x] `_test.html` deleted
- [x] Final report to user; review gate offered (user: browse first); memory updated
- [x] Commit + push on user request (`[NO-TASK] docs: add AI 3D scenes field guide site`)
