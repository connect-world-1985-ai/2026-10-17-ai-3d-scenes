# Memory: AI-made interactive 3D scenes — research tutorial site

**Generated**: 2026-10-17 22:30
**Last updated**: 2026-10-17 23:35 (site complete, QA passed, committed + pushed)
**Project**: D:\git\scratches\2026.10\AI-3D-scenes
**Focus**: Research how coding agents produce impressive interactive 3D demos (city fly-over, ocean, street walkthrough) and teach it through a local static tutorial website with live demos.

---

## Goal & Scope (required)

Raymond (experienced software engineer, Windows 11, uses Claude Code / Codex / Cursor daily, new to 3D graphics) wants to understand completely how agent-made 3D demos are produced — what the agent writes, which libraries/engines/assets, where visuals come from — before building his own. Independent, evidence-based, vendor-neutral, fresh web sources.

Brief sections to cover: (1) taxonomy of production routes (browser real-time, shader art, game engines via agent, offline Blender, geodata, captured reality, generative 3D/world models, hybrids) incl. how to spot each; (2) fundamentals for beginners with diagrams + toys; (3) recipes: ocean, procedural city, terrain/fog/atmosphere/day-night/vegetation/crowds/traffic, camera paths vs walking; (4) asset sources + licences, AI 3D services, map data terms, what an LLM can produce itself; (5) how the agent works (one-shot vs iteration, seeing results, failures, MCP servers for Blender/Unity/Godot/Unreal); (6) truth behind "one prompt" demos — classified verified/plausible/promotional; (7) practical (GPU, WebGPU, mobile, hosting, recording video); (8) decision framework, stacks, costs; (9) 3–5 hands-on starter projects with prompt, iteration loop, pitfalls.

Deliverable: multi-page static site in `AI-3D-scenes/site/`, opens from file:// (double-click index.html). Required pages: glossary, sources-and-method, final "3–5 directions for our next discussion".

---

## Key Decisions (required)

1. **Folder**: everything under `D:\git\scratches\2026.10\AI-3D-scenes\` (user instruction).
2. **Started fresh** (no memory loaded). Reuse the *architecture pattern* of the sibling `AI-video-generation-techniques/site` (hand-written HTML + shared site.css + site.js that builds nav from a page list; data in `data-*.js` globals), but write fresh CSS/JS adapted for demos.
3. **Demo approach (approved, option 1 "mixed")**: wave toy + raymarching toy in **raw WebGL, classic scripts, no library** (work offline/file://). PBR toy, procedural city, first-person walk, camera/projection toy, instancing, ocean3 use **Three.js 0.186.1 from unpkg**: `site.js` injects the import map; demos are classic scripts calling `Demo.runThree(stageId, addons, fn)` (dynamic `import()` of CDN URLs only); each shows a fallback box when the CDN or WebGL is missing.
4. **Rejected: all demos via CDN** (all dark offline, hides raw WebGL). **Rejected: vendoring Three.js r149 UMD** (outdated API, misleading).
5. **Diagrams inline SVG**; evidence badges Verified / Practice / Inference / Unverified / Experimental.
6. **Research split**: 6 Sonnet subagents (normal speed) write sourced fact sheets to the companion `research-notes/`; main agent verifies key claims (GitHub API stars/licences, primary pages), judges, writes every page.
7. **Approved: execute directly**; the tracker is the plan.

---

## Confirmed Assumptions (required)

- Research date baseline 2026-10-17. Every price / star count / benchmark carries a date; never invent numbers; state source conflicts.
- No long install guides; short illustrative snippets OK.
- Pinned CDN libraries are acceptable for demos.
- No git commit unless user asks (commit format `[TASK-ID] type: description`; ask for task id; sibling project used `[NO-TASK]`).
- Response language: English.

---

## Constraints & Non-Goals

- No ES-module imports of local files; no fetch/XHR of local files. Classic `<script>` for local JS.
- Checks before done: no JS errors on any page, no broken internal links, demos run + fail gracefully offline, mobile width works, works from file://.
- Final report must list known gaps honestly.

---

## Key Discoveries (required)

- **Agents that look early win**: AA-3D (2026-10-12) top-5 first view their own scene at median turn 10–13; early looking tracks Elo (Spearman 0.82); 82% of tool time is browser testing; UI control count tracks Elo (Pearson 0.90); output tokens/turns do not. Cost $0.20–$32.08 per scene; top 4 statistically tied.
- **"One prompt" demos** with public artefacts (night-street, LAAS, Git City) are long briefs + screenshot/critic loops + hours/days. Promotional clips (launch videos) have no prompt/code.
- **LLM three.js failures** are mostly version drift (Geometry r125, colorSpace r152, lights r155, UMD r161, PCFSoftShadowMap r186) and blind tuning (bloom white-out, camera clipping) — both seen and fixed while building this site's demos.
- **Visual quality comes from** CC0 HDRIs/PBR/kit assets + renderer settings, not from LLM-modelled geometry. Google 3D Tiles: no caching/offline, logo + per-tile credits, promo video ≤ 30 s.
- **WebGL2 is the baseline** (97.13% caniuse) vs WebGPU 87.82%; `WebGPURenderer` lacks ShaderMaterial/onBeforeCompile/EffectComposer.
- **Engine MCP**: Epic Unreal MCP experimental, no auth; Blender MCP arbitrary Python (CVE-2026-10688). Headless scripts are the safer automation path.
- **Skill packs**: no controlled evidence they help; one detailed author found them unhelpful for visual quality.
- QA tooling note: headless Edge on this machine got the real Intel UHD GPU (D3D11) and WebGPU adapter; unpkg works from this network, jsDelivr resets; Google/YouTube domains time out from curl.

---

## Current State (required)

- **Working**: all 19 pages + 9 demos (incl. device probe) written and QA'd 2026-10-17 (0 JS errors, 0 broken internal links/anchors, offline + no-WebGL fallbacks, 390px no overflow, no local module/fetch). `_test.html` deleted.
- **Known limits**: city street view hazy at night; ocean buoy dark when backlit; 3D demos need unpkg; tested in Chromium only; ~31 external URLs not checkable from this network (403 bot-blocking or timeouts).
- **Committed and pushed** 2026-10-17 23:3x on `master` of `shx99717/scratches` as `[NO-TASK] docs: add AI 3D scenes field guide site` (user asked; `[NO-TASK]` follows the repo's existing convention). `qa/node_modules/` and `qa/shots/` are git-ignored (regenerate with `npm install` + `node shot.js`).
- **Pending**: user review of the site (user chose "browse first"); optional code review.
- **Blocked**: none.

Live checklist: `./memory-20261017-ai-3d-scenes-research/tracker.md`

---

## Next Steps (required)

1. [ ] User reviews the site (open `site/index.html`).
2. [ ] Optional: review gate (`requesting-code-review`) on demos + site.js.
3. [ ] Pick one of the directions on `16-next-directions.html` (recommended: 1 + 3, ocean to "impressive" + reusable screenshot harness).
4. [x] Commit + push (done on user request).

---

## Notes for Next Session

- Resume: read this file → tracker.md → research-notes → continue first unchecked tracker item.
- Sibling project with the same site pattern: `D:\git\scratches\2026.10\AI-video-generation-techniques\site` (QA there was done via a local preview server because the in-app browser could not load relative CSS from file://).

---

## References (required)

- `site/` — deliverable website
- `./memory-20261017-ai-3d-scenes-research/tracker.md` — tracker / plan
- `./memory-20261017-ai-3d-scenes-research/research-notes/` — sourced fact sheets (r1–r6)
- `./memory-20261017-ai-3d-scenes-research/qa/` — `shot.js` (flags `--offline --nogl --width= --full --set= --sel=`), `links.js`, `external-status.txt`, `shots/`

---

**Confirmed at**: 2026-10-17 22:30
