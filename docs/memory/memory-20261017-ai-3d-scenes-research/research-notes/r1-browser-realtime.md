# R1 — Real-time 3D in the browser (fact sheet)

Compiled: 2026-10-17. Audience: experienced software engineer, new to 3D. Purpose: evidence base for a tutorial on how AI coding agents build interactive 3D scenes (city fly-over, ocean, first-person street walk).

Tags: **Verified** = read/measured in a primary source on 2026-10-17. **Practice** = community/vendor guidance, not a spec. **Inference** = my reasoning from verified facts. **Unverified** = could not confirm.
Every number is as of 2026-10-17 unless another date is written next to it.

Method note: GitHub stars / licence / pushed_at came from `api.github.com/repos/<owner>/<repo>` (before the unauthenticated rate limit of 60/h was hit). Versions and weekly downloads came from `registry.npmjs.org` / `api.npmjs.org`. The one empirical test (file:// import) was run on this machine with headless Edge 154.0.4258.62.

---

## 0. Ten-line cheat sheet (read this first)

- Three.js is at release **r186** (npm `three@0.186.1`), MIT, ~116.5k GitHub stars (2026-10-17). It is by far the dominant library: ~21.4M npm downloads/week (2026-10-06..12), ~3.4x the next one (react-three-fiber, 6.2M).
- `WebGPURenderer` (import from `three/webgpu`) auto-falls back to WebGL2, but the official manual still calls it "experimental" while saying maturity "has been greatly improved" (see conflicts).
- WebGPU is now in every major browser engine on at least some platforms (Chrome 113+, Safari 26+, Firefox 141+ Windows / 147+ Apple-Silicon macOS). Firefox Linux/Android and Chrome-on-Linux (non-Intel/NVIDIA) are still partial. WebGL2 is ~97% global (caniuse).
- A single-file HTML demo works from `file://` **if** everything is loaded from an https CDN via import map (empirically verified on Edge 154). Relative `import './x.js'` from `file://` fails.
- UMD builds (`build/three.js`, `three.min.js`) were removed in **r161**, not r160 as announced. Only ES modules remain, so import maps are mandatory for CDN use.
- Official examples already cover our three use cases: ocean (`webgl_shaders_ocean`, `webgpu_ocean`, `webgpu_tsl_raging_sea`), city (`webgpu_generator_city` + `CityGenerator` addon), first-person (`games_fps`, `misc_controls_pointerlock`).
- Water/Sky have two variants: WebGL `Water.js`/`Sky.js` and WebGPU `WaterMesh.js`/`SkyMesh.js`. Mixing them with the wrong renderer is a likely LLM failure mode.
- `ShaderMaterial`, `onBeforeCompile` and `EffectComposer` are **not** supported by `WebGPURenderer` (official manual). LLM-written code mostly uses exactly those.
- Draw-call budget folklore: ~50-100/frame for mobile (Don McCurdy, 2021), 100-200 for low-end mobile (PlayCanvas docs); desktops handle thousands. Use `InstancedMesh`/`BatchedMesh`.
- three.js frustum culling is on by default per object (`Object3D.frustumCulled = true`); `InstancedMesh` culls as one object via one bounding sphere.

---

## 1. Libraries and engines

### 1.1 Three.js

- Repo `mrdoob/three.js`: MIT, 116,534 stars, pushed_at 2026-10-17T14:09:40Z (2026-10-17). [https://api.github.com/repos/mrdoob/three.js] **Verified**
- Latest GitHub release: **r186**, published 2026-09-24T14:35:44Z; previous r185 2026-07-01, r184 2026-04-16, r183 2026-02-20, r182 2025-12-10, r181 2025-11-19. Cadence is roughly one release every 2-3 months. [https://github.com/mrdoob/three.js/releases] **Verified**
- npm `three` latest = **0.186.1** (dist-tag `latest`, 2026-10-17); registry time map: `0.186.0` = 2026-09-08, `0.186.1` = 2026-09-24 (npm timestamps precede the GitHub "r186" release date of 2026-09-24; same pattern for 0.185.0 = 2026-06-25 vs r185 release 2026-07-01). License MIT. [https://registry.npmjs.org/three , https://registry.npmjs.org/three/latest] **Verified** (the reason for the gap is **Unverified**)
- Next dev version is already r187 (the Migration Guide has a "186 → 187" section on 2026-10-17). So "current release" = r186; `dev` branch = r187 in progress. [https://github.com/mrdoob/three.js/wiki/Migration-Guide] **Verified**
- Migration advice from the project: update old projects in increments of 10 releases because deprecation warnings last 10 releases. [https://github.com/mrdoob/three.js/wiki/Migration-Guide] **Verified**
- Weekly npm downloads for `three`: 21,426,650 (week 2026-10-06 to 2026-10-12). [https://api.npmjs.org/downloads/point/last-week/three] **Verified**
- Stack Overflow tag `three.js`: 20,864 questions (2026-10-17). [https://api.stackexchange.com/2.3/tags/three.js/info?site=stackoverflow] **Verified**
- README: "current builds only include WebGL and WebGPU renderers"; SVG and CSS3D renderers are addons. [https://raw.githubusercontent.com/mrdoob/three.js/dev/README.md] **Verified**
- Typical use: general-purpose scene-graph library (Scene/Camera/Mesh/Material/Light/Renderer) — it is a library, not an engine (no physics, no editor, no ECS built in). **Practice**

**WebGPURenderer + TSL status**

- `WebGPURenderer` = "the modern alternative to the long-standing `WebGLRenderer`"; targets WebGPU, **automatically falls back to a WebGL 2 backend**; `forceWebGL: true` forces WebGL2. [https://threejs.org/manual/pages/webgpurenderer] **Verified**
- Import path: `import * as THREE from 'three/webgpu'`; TSL from `three/tsl`. Import-map entries recommended by the manual: `three` and `three/webgpu` → `three.webgpu.js`, `three/tsl` → `three.tsl.js`, `three/addons/` → `jsm/`. [https://threejs.org/manual/pages/webgpurenderer] **Verified**
- Since r171 the imports for WebGPU were split (`three/webgpu`, `three/tsl`). [Migration Guide "170 → 171"] **Verified**
- Initialisation is async: use `renderer.setAnimationLoop(fn)` (auto-waits for init) or `await renderer.init()`. [https://threejs.org/manual/pages/webgpurenderer] **Verified**
- Default `antialias` = false, `alpha` = true, `outputBufferType` = HalfFloat for WebGPURenderer. [https://threejs.org/docs/pages/WebGPURenderer.html] **Verified**
- **TSL** = "three.js shading language": shaders written in JavaScript, transpiled to WGSL or GLSL depending on backend. Brings node materials (`MeshStandardNodeMaterial` etc.) and a node-based post-processing stack with MRT. [https://threejs.org/manual/pages/webgpurenderer] **Verified**
- **Not supported in WebGPURenderer** (official manual): `ShaderMaterial`, `RawShaderMaterial`, `onBeforeCompile()` modifications, and `EffectComposer` + effect passes (replaced by TSL post-processing). [https://threejs.org/manual/pages/webgpurenderer] **Verified**
- Official wording on maturity: "The renderer itself is still in an experimental state although its maturity level has been greatly improved in the last years" — depending on scene "you will encounter missing features or a better performance with WebGLRenderer". [https://threejs.org/manual/pages/webgpurenderer] **Verified**
- `WebGLRenderer` is "still maintained and the recommended choice for pure WebGL 2 applications", but "no plans to add larger new features" — project focus is WebGPURenderer. [https://threejs.org/manual/pages/webgpurenderer] **Verified**
- Recent WebGPU-side activity in r186 notes (examples): `compileComputeAsync()`, WebXR+WebGPU fixes, `SunLight` with cascaded shadow maps, `PCFSoftShadowMap` removed for WebGPU (use `PCFShadowMap`, now soft), `Sky`/`SkyMesh` lost the `up` uniform (+Y always up). [https://github.com/mrdoob/three.js/releases/tag/r186 and Migration Guide "185 → 186"] **Verified**
- Real-world signal: Bruno Simon's 2026 portfolio says TSL "enabl[es] the use of both WebGL and WebGPU, making this portfolio possible". [https://bruno-simon.com/] **Verified**
- Inference: for an AI-agent tutorial, the safest default is `WebGLRenderer` + classic GLSL/`Water.js`; WebGPURenderer is the "modern" path with a WebGL2 fallback, but code must be TSL/node-material based.  **Inference**

**Addons relevant to us** (all present in npm `three@0.186.1`, checked via jsDelivr file listing 2026-10-17) [https://data.jsdelivr.com/v1/packages/npm/three@0.186.1?structure=flat] **Verified**:

| Need | Path under `three/addons/` (= `examples/jsm/`) | Notes |
|---|---|---|
| Ocean (WebGL) | `objects/Water.js` (`Water`), `objects/Water2.js` | used by `webgl_shaders_ocean` |
| Ocean (WebGPU) | `objects/WaterMesh.js`, `objects/Water2Mesh.js` | used by `webgpu_ocean` |
| Sky (WebGL) | `objects/Sky.js` | atmospheric scattering sky |
| Sky (WebGPU) | `objects/SkyMesh.js` | |
| Orbit camera | `controls/OrbitControls.js` | |
| First-person look | `controls/PointerLockControls.js`, `controls/FirstPersonControls.js`, `controls/FlyControls.js` | `FirstPersonControls` got a new interaction model in r184 |
| Collision | `math/Octree.js`, `math/Capsule.js`, `helpers/OctreeHelper.js` | used by `games_fps` |
| Environment lighting | `environments/RoomEnvironment.js` | |
| Post (WebGL) | `postprocessing/EffectComposer.js`, `UnrealBloomPass.js` | |
| Post (WebGPU) | `tsl/display/BloomNode.js` etc. | |
| Procedural city | `generators/CityGenerator.js` + `generators/city/{Skyscraper,Sidewalk,Streetlight,Trafficlight,Car,Person,...}Generator.js`; also `generators/{Terrain,Tree,Forest}Generator.js` | **new**; WebGPU/TSL-based (imports `three/webgpu`, `three/tsl`) |
| Debug | `libs/stats.module.js`, `libs/lil-gui.module.min.js`, `inspector/Inspector.js` | |

- Instancing/batching are core (not addons): `InstancedMesh`, `BatchedMesh` (+ `utils/SortUtils.js` radixSort used by the batch demo). [§5] **Verified**
- Fact: `build/` in npm 0.186.1 contains only `three.cjs, three.core.js, three.module.js, three.tsl.js, three.webgpu.js, three.webgpu.nodes.js` (no `*.min.js`); versions 0.171-0.185 still shipped `*.min.js`. `three.core.js` first appears in 0.171.0. [jsDelivr listing] **Verified**
- Water.js/Sky.js wrongly mixed with `three/webgpu` is a likely failure; the examples keep distinct classes per renderer (see example imports in §4). **Inference**

**LLM familiarity (inference)**

- Three.js dominates web-3D training data: highest npm downloads (21.4M/wk vs 6.2M R3F, 0.40M Babylon, 0.13M PlayCanvas, 0.03M A-Frame; week 2026-10-06..12), largest Stack Overflow tag (20,864 vs 465 `babylonjs`, 19 `playcanvas`, 2,873 `aframe`, 1,021 `react-three-fiber` — 2026-10-17), 15 years of examples. [npm/StackExchange APIs] counts **Verified**; the conclusion about training data is **Inference**.
- Typical LLM error modes (inference from the facts above): (a) UMD `<script src=".../three.min.js">` or `three@r128`-era APIs that no longer exist; (b) `THREE.Geometry`, `uv2`, `PCFSoftShadowMap`, `Clock` (deprecated in r183+ per A-Frame changelog) usage; (c) importing `OrbitControls` from the wrong path; (d) WebGL-style `ShaderMaterial` code under `WebGPURenderer`. Pin an exact version in the import map to reduce drift. **Inference**
- Three.js APIs change fast (10-release deprecation window; examples above removed APIs in r161/r171/r182/r185/r186). Recommend pinning `three@0.186.1`. **Inference**

### 1.2 React Three Fiber (R3F) + drei

- `pmndrs/react-three-fiber`: MIT, 33,031 stars, pushed 2026-10-17T01:54Z. npm `@react-three/fiber` **9.8.2** (published 2026-10-14/15), MIT, peers `react >=19 <19.4`, `three >=0.156`. Weekly downloads 6,241,878 (2026-10-06..12). [GitHub API, npm] **Verified**
- What it is: "A React renderer for Threejs" — declarative JSX for three.js objects; not a separate engine. [https://registry.npmjs.org/@react-three/fiber/latest] **Verified**
- WebGPU: v9 `Canvas` `gl` prop accepts an async factory that returns `new WebGPURenderer(props)` after `await renderer.init()`; objects from `three/webgpu` registered with `extend(THREE)`. [https://r3f.docs.pmnd.rs/api/canvas , https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide] **Verified**
- `pmndrs/drei`: MIT, 9,971 stars; npm `@react-three/drei` **10.7.9**, peers `react ^19`, `three >=0.159`, `@react-three/fiber ^9`. Weekly downloads 4,415,079. [GitHub API, npm] **Verified**
- drei helpers relevant to us (README index): `Sky`, `Environment`, `Cloud`, `Sparkles`, `Instances`, `PointerLockControls`, `KeyboardControls`, `CameraControls`, `MeshReflectorMaterial`, `Billboard`, `Stats`. [https://raw.githubusercontent.com/pmndrs/drei/master/README.md] **Verified**
- Other pmndrs packages: `@react-three/rapier` 2.2.0 (physics; licence field empty in npm metadata), `@react-three/postprocessing` 3.2.0 MIT, `postprocessing` 6.39.5 (Zlib, 2,887 stars). [npm, GitHub API] **Verified**
- Typical use: React apps / product configurators / portfolio sites. Needs a bundler (Vite etc.) in practice; **not** a single-file HTML workflow unless you hand-roll import maps + JSX transpile. **Inference**
- LLM familiarity: very high (second most common 3D-on-web stack; `drei` snippets are everywhere), but R3F v8→v9 changes (React 19, `gl` callback signature, colour management of textures) mean older snippets break. [https://github.com/pmndrs/react-three-fiber/releases/tag/v9.0.0] break list **Verified**; "LLMs know it well" **Inference**.
- Official demos: https://r3f.docs.pmnd.rs , https://drei.docs.pmnd.rs (both HTTP 200 on 2026-10-17); pmndrs's public examples include water/sky/physics sandboxes. **Verified** (links alive) / contents **Unverified**.

### 1.3 Babylon.js

- `BabylonJS/Babylon.js`: Apache-2.0, 26,175 stars, pushed 2026-10-16T13:08Z. GitHub latest release **9.30.0** (2026-10-08); npm `@babylonjs/core` latest **9.31.0** (published 2026-10-15). 9.0.0 was released 2026-03-26. Weekly downloads 403,145 (2026-10-06..12). [GitHub API, npm] **Verified**
- What it is: a full game/3D *engine* (Microsoft-originated, open source): scene, PBR, physics integration, GUI, Inspector, Node Material Editor, Playground, Sandbox, Viewer. [https://doc.babylonjs.com] **Practice**
- 9.0 headline features: clustered lighting, volumetric lighting, Frame Graph, Inspector v2, geospatial camera + 3D Tiles, "Physically Based Atmosphere", Large World Rendering, Gaussian-splat upgrades, Babylon.js Editor. [https://github.com/BabylonJS/Babylon.js/releases/tag/9.0.0 , https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/] **Verified**
- WebGPU: "Since the Babylon.js 5.0 release in May 2022, WebGPU support has been available and backward compatible with WebGL"; the status page says implementation "is complete and, besides a few exceptions, all features are available both in WebGPU and WebGL"; WebGL and WebGPU "maintained side by side for the foreseeable future". Init: `new WebGPUEngine(canvas); await engine.initAsync()`. [https://doc.babylonjs.com/setup/support/webGPU , https://doc.babylonjs.com/setup/support/webGPU/webGPUStatus/] **Verified**
- Ocean-relevant: built-in `WaterMaterial` (materials library; needs a bump texture, `addToRenderList` for reflection/refraction) [https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/waterMat/] **Verified**; FFT ocean demo `Popov72/OceanDemo` (WebGPU, WGSL, MIT, 142 stars) with a Playground port at https://playground.babylonjs.com/#YX6IB8#758 [https://github.com/Popov72/OceanDemo] **Verified**; "Babylon Lite" demos page lists a WebGPU compute spectral ocean (302.7 KB / 114.3 KB gzip, requires WebGPU) [https://babylonjs.com/lite-demos/] **Verified** — Babylon Lite is described as "a WebGPU-exclusive, fully tree-shakable rendering engine"; its maturity/versioning **Unverified**.
- First-person/city: community "Virtual Street Experience" (Babylon.js + Vue 3 + Cannon.js; RTS camera outdoors, first-person indoors) [https://public.works.onix.team/project-details/virtual-street-experience] **Verified**. Babylon has built-in `UniversalCamera`/`FreeCamera` WASD + gravity/collision (`checkCollisions`, `applyGravity`) — **Practice**, not re-verified today.
- LLM familiarity: moderate (465 SO questions for `babylonjs`; ~0.4M npm/wk). Models know the classic `BABYLON.*` global/CDN API well but v8/v9 ESM tree-shaking imports (`@babylonjs/core/...`) less so. **Inference**
- Single-file use: official CDN `https://cdn.babylonjs.com/babylon.js` global build exists (docs warn the CDN "should not be used in production"). [waterMat doc page] CDN statement **Verified**.

### 1.4 PlayCanvas (engine + Editor)

- `playcanvas/engine`: MIT, 17,076 stars, pushed 2026-10-17T02:19Z. GitHub release **v2.23.3** (2026-10-15); npm `playcanvas` 2.23.3, MIT. Weekly downloads 133,434. [GitHub API, npm] **Verified**
- `playcanvas/editor` repo: MIT, 1,345 stars (the web-based Editor front-end is open source). The hosted cloud Editor is a paid/free SaaS: Free $0/mo (unlimited public projects, 1 GB, free hosting, REST API), Personal $15/mo (10 GB, private projects), Organization $50/seat/mo (50 GB). [https://playcanvas.com/plans] **Verified**
- Engine v2: supports WebGL2 **and WebGPU** (automatic fallback to WebGL2; request WebGPU via `createGraphicsDevice`); WebGL1 dropped in v2. Cloud Editor has run Engine v2 by default since 2025-01-20. [https://developer.playcanvas.com/user-manual/editor/engine-compatibility/ , https://developer.playcanvas.com/user-manual/engine/supported-browsers/ , https://forum.playcanvas.com/t/engine-v2-editor-support-beta-ended/38823] **Verified**
- Docs quote: "100-200 draw calls is a rough target for low end mobile devices. High end desktop machines on the other hand can process thousands every frame and still maintain 60fps." [https://developer.playcanvas.com/user-manual/optimization/guidelines/] **Verified**
- Typical use: browser games / ads / configurators; entity-component system; scripts + editor-driven workflow. LLM familiarity: low-moderate (19 SO questions for `playcanvas`; 0.13M npm/wk) — an agent can write engine-only code (`new pc.Application`) but not the Editor's GUI workflow. **Inference**
- Showcase: https://playcanvas.com/explore (HTTP 200); specific titles **Unverified**.

### 1.5 A-Frame

- `aframevr/aframe`: MIT, 17,665 stars, last push 2026-07-13. Latest **1.8.0** (released 2026-06-23/24; blog 2026-06-27), updates three.js to **r184**. Weekly downloads 32,580. [GitHub API, https://github.com/aframevr/aframe/releases/tag/v1.8.0 , https://aframe.io/blog/aframe-v1.8.0/] **Verified**
- What it is: declarative HTML entity-component framework on top of three.js, aimed at WebXR (`<a-scene><a-box>…`). [https://aframe.io] **Practice**
- 1.7.0 (2025) added ES modules + import-map support, experimental post-processing, "initial" WebGPU/TSL support; WebXR with WebGPU was not supported at that time (r173). [https://github.com/aframevr/aframe/blob/master/CHANGELOG.md , PR #5655] **Verified**; whether XR+WebGPU works as of 1.8.0 is **Unverified**.
- Pinned to an older three.js (r184 vs r186 current) and the single `three` it bundles can clash with a separately imported three — **Inference**.
- Use: quick VR/AR demos, teaching. First-person walking is available via built-in `wasd-controls`/`look-controls` **Practice** (not re-verified). Large procedural cities/oceans are not its focus.

### 1.6 Raw WebGL2

- WebGL2 (OpenGL ES 3.0 API): global usage 97.13% (caniuse, 2026-10-17); supported Chrome 56+, Edge 79+, Safari 15+ (macOS+iOS), Firefox 51+, Chrome Android, Firefox Android, Samsung 7.2+. [https://caniuse.com/webgl2] **Verified**
- Typical use: shader-only art, GPGPU tricks, libraries. Raw WebGL is verbose (programs, buffers, VAOs, uniforms); minimal helper ≈ 6 kB / 2.7 kB gzip vs three ≈ 454 kB / 116 kB gzip per one third-party comparison (date of measurement unknown). [https://github.com/jsulpis/webgl-libs-comparison] **Practice**
- LLMs are strong at WebGL2 + GLSL ES 3.00 shaders (ShaderToy-style) — **Inference**.

### 1.7 WebGPU (the API)

- Chrome shipped it in 113 (Windows/D3D12, macOS, ChromeOS/Vulkan); Android in 121 (Android 12+, Qualcomm/ARM GPUs). MDN: the whole API is **secure-context only (HTTPS)**. In my §3 test, a `file://` page in Edge 154 reported `isSecureContext = true` and had `navigator.gpu`, so local files are fine in Chromium. [https://developer.chrome.com/docs/web-platform/webgpu/overview , https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API] **Verified**
- WGSL shaders, compute shaders, storage buffers. Raw WebGPU is far more verbose than WebGL; agents typically use it via three.js/Babylon/PlayCanvas rather than raw. **Inference**
- Safari's WWDC25 talk: "WebGPU can do everything WebGL can when it comes to 3D graphics, but with far greater performance and flexibility"; showcased a three.js WebGPU jellyfish demo. [https://developer.apple.com/videos/play/wwdc2025/236/] **Verified** (vendor claim).

### 1.8 Other notable

- **Needle Engine**: web engine built on three.js + glTF with Unity and Blender integrations, Rapier physics, WebXR, multiplayer. npm `@needle-tools/engine` latest = `6.0.0-alpha.7` (2026-10-12; a pre-release as the `latest` tag!). Licence: free for non-commercial (watermark), commercial needs Pro; pricing page shows "€49" with "€67 / user / month billed annually" in the same card — ambiguous, treat price as **Unverified**. npm licence field `None`. Repo `needle-tools/needle-engine-support` 609 stars (docs/support repo, not the engine source). [https://engine.needle.tools/docs/api/index.html , https://needle.tools/pricing/ , https://needle.tools/eula/] **Verified** (existence/licence model) / price **Unverified**
- **Threlte** (Svelte + three.js): `threlte/threlte` MIT, 3,351 stars; npm `@threlte/core` **8.6.1**; 69,925 downloads/wk. https://threlte.xyz (200). [GitHub API, npm] **Verified**
- **OGL** ("Minimal WebGL library", ES modules, zero deps, API similar to three.js): `oframe/ogl` 4,675 stars, last push 2025-04-13 (i.e. ~18 months stale on 2026-10-17); npm `ogl` 1.0.11 licence `Unlicense` (GitHub API returned no licence field — conflict, see §7); 29 kB minzipped total per README; 726,482 downloads/wk. [https://github.com/oframe/ogl , npm] **Verified**
- **regl** ("Fast functional WebGL"): `regl-project/regl` MIT, 5,587 stars; npm 2.1.1; 974,769 downloads/wk; no scene graph. Comparison repo says it is "seems a bit outdated … too heavy for simple use cases" (opinion). [GitHub API, npm, https://regl-project.github.io/regl/ , https://github.com/jsulpis/webgl-libs-comparison] **Verified**/**Practice**
- **three-mesh-bvh** (`gkjohnson/three-mesh-bvh`): MIT, 3,518 stars, npm 0.9.16; BVH raycasts/collision for three.js; used in official `webgl_batch_lod_bvh` example family. [GitHub API, npm] **Verified**
- Other engines not researched: Cesium, deck.gl/MapLibre (3D city/terrain tiles), Unity/Godot web export. **Unverified** (out of scope).

---

## 2. WebGPU and WebGL2 browser support as of 2026-10

### 2.1 caniuse snapshot (2026-10-17)

- Global usage **87.82%** = 85.8% full + 2.02% partial. [https://caniuse.com/webgpu] **Verified** (see conflict: this looks high versus platform caveats below; treat as caniuse-reported share, not a measurement of "usable by LLM-generated demo").
- Chrome 113-157 supported, Edge 113-154, Opera 99-135, Samsung Internet 24-30, Chrome Android 154 supported, Opera Mobile 80. [https://caniuse.com/webgpu] **Verified**
- Safari macOS 26.0-27.x: **partial support** (caniuse); Safari iOS 26.0-27.2: **supported**. [https://caniuse.com/webgpu] **Verified**
- Firefox 63-161: "Disabled by default" in caniuse; Firefox Android 157 "Disabled by default"; Android Browser 154: not supported. [https://caniuse.com/webgpu] **Verified** (but contradicts Mozilla — see below).

### 2.2 Vendor/primary sources

- **Chrome/Edge**: WebGPU shipped in Chrome 113 on ChromeOS (Vulkan), Windows (D3D12), macOS. Android: Chrome 121, Android 12+, Qualcomm/ARM GPUs. [https://developer.chrome.com/docs/web-platform/webgpu/overview , https://developer.chrome.com/blog/new-in-webgpu-121] **Verified**
- **Chrome Linux**: shipped in Chrome 144 (stable 2026-01-13) for Intel Gen12+ GPUs; NVIDIA (driver 535.183.01+) on Wayland in 147; other Linux GPUs behind a flag. [https://developer.chrome.com/blog/new-in-webgpu-144 , https://developer.chrome.com/release-notes/144 , https://github.com/gpuweb/gpuweb/wiki/Implementation-Status] **Verified**
- **Chrome Windows-on-ARM64**: behind flag `chrome://flags/#enable-unsafe-webgpu`; Android Imagination GPUs Android 16+ from Chrome 139; Samsung Xclipse and others TBD. [gpuweb wiki Implementation Status] **Verified**
- **Firefox**: shipped in **141 on Windows** (Mozilla blog, per gpuweb wiki); **Apple-Silicon macOS: 145 on macOS 26+, 147 (released 2026-01-13) on all supported macOS versions**; Intel/other Macs, **Linux** = Nightly only ("Mozilla expects to ship on Linux in 2026"); **Android** = behind flag (`gfx.webgpu.ignore-blocklist`), "expects to do work on Android in 2026". Firefox 157 (released 2026-09-29) added `TRANSIENT_ATTACHMENT` usage but the release notes do not say Linux/Android shipped. [https://github.com/gpuweb/gpuweb/wiki/Implementation-Status , https://www.firefox.com/en-US/firefox/147.0/releasenotes/ , https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/157] **Verified**
- **Safari**: Safari 26.0 "adds support for WebGPU" on macOS 26 (Tahoe), iOS 26, iPadOS 26, visionOS 26 (macOS Sequoia/Sonoma get Safari 26 too, but the gpuweb wiki lists "✅ 26" only for macOS 26 — whether older macOS gets WebGPU is **Unverified**). Enabled by default. WebKit blog: "WebGPU supersedes WebGL on macOS, iOS, iPadOS, and visionOS and is preferred for new sites and web apps". Safari 26.1 fixed WebGPU issues incl. video textures in three.js panoramas. [https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ , https://webkit.org/blog/17541/webkit-features-for-safari-26-1/ , gpuweb wiki] **Verified**
- PlayCanvas docs list (consistent): Chrome 113+ Win/macOS/ChromeOS, 121+ Android, 144+ Linux Intel Gen12+; Edge same; Safari 26+; Firefox 141+ Windows and 147+ macOS Apple silicon; Opera 99+. [https://developer.playcanvas.com/user-manual/engine/supported-browsers/] **Verified**
- Local browser versions on the research machine: Edge 154.0.4258.62, Chrome 155.0.8059.40 (caniuse's Chrome column lists 154 as current and 155-157 as upcoming). Channel of the installed Chrome (stable vs beta) **Unverified**. **Verified** (local versions)

### 2.3 WebGL2

- 97.13% global (caniuse 2026-10-17); Firefox 51+, Chrome 56+, Safari 15+. PlayCanvas engine v2 *requires* WebGL2 (drops WebGL1). [https://caniuse.com/webgl2 , PlayCanvas supported-browsers page] **Verified**
- Implication: WebGL2 is the safe baseline; WebGPU is an enhancement unless you accept ~Chromium/Safari-26/Firefox-Windows-Mac users. **Inference**

### 2.4 Practical takeaways

- Feature-detect: `navigator.gpu` and `await navigator.gpu.requestAdapter()`; a three.js `WebGPURenderer` will do this internally and fall back to WebGL2 (or `forceWebGL`). [manual + MDN] **Verified**
- Secure context: WebGPU requires HTTPS or localhost; `file://` is treated as secure in Chromium (measured). **Verified**/(Firefox/Safari **Unverified**)

---

## 3. Single-file HTML demo pattern

### 3.1 Import map + CDN

- Canonical pattern (also the maintainers' advice): an `importmap` that maps `three` and `three/addons/` to a CDN at one pinned version; addons contain bare `import … from 'three'` which only an import map can resolve. [https://discourse.threejs.org/t/importing-addons-without-npm/44471 (Don McCurdy: "See 'Install from CDN or static hosting', under the Installation guide"), https://discourse.threejs.org/t/is-the-usage-of-content-delivery-networks-cdn-for-deployment-recommended-discouraged/79586] **Verified** (quoted); I could not retrieve the official Installation page text today (its URLs 404) — **Unverified** for the exact manual wording.
- Verified-working snippet (executed today, resolves `three` and `three/addons/objects/Water.js` from jsDelivr; `THREE.REVISION` printed 186):

```html
<script type="importmap">
{"imports":{
  "three":"https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js",
  "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.186.1/examples/jsm/"
}}
</script>
<script type="module">
  import * as THREE from 'three';
  import { Water } from 'three/addons/objects/Water.js';
</script>
```
  [empirical test, headless Edge 154.0.4258.62, page opened as `file://`] **Verified**
- WebGPU variant: map `three` and `three/webgpu` → `build/three.webgpu.js`, `three/tsl` → `build/three.tsl.js` (manual). [https://threejs.org/manual/pages/webgpurenderer] **Verified**
- Because `three.module.js` imports `three.core.js` by relative URL (file exists from 0.171.0), only the `three` entry needs mapping — consistent with my test succeeding with just those two entries. **Verified** (behaviour) / exact import line **Unverified** (CDN fetch failed in last check).
- CDN CORS headers (2026-10-17, `Origin: null`): jsDelivr `access-control-allow-origin: *`, unpkg `Access-Control-Allow-Origin: *`, esm.sh `Access-Control-Allow-Origin: *`; all returned HTTP 200 for `three@0.186.1`. [curl -I against `cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js`, `unpkg.com/three@0.186.1/...`, `esm.sh/three@0.186.1`] **Verified**
- Reliability: forum reports of unpkg outages ("not responding", and "starting with r175, unpkg.com no longer appears to be working (CORS errors)"); one user recommends jsDelivr. My 2026-10-17 curl shows unpkg responding with CORS headers, so those reports are historical/anecdotal. [https://discourse.threejs.org/t/is-the-usage-of-content-delivery-networks-cdn-for-deployment-recommended-discouraged/79586] **Practice** (conflict noted §7)
- Pitfalls: unpinned `@latest` + addon paths break when files move (e.g. `Water.js` vs `WaterMesh.js`); `esm.sh` re-bundles and can produce a *second* copy of three if addons are imported via different URLs (duplicate-instance risk) — **Inference**/Practice, not tested.
- Library files an LLM might hotlink: `lil-gui.module.min.js` and `stats.module.js` live in `three/addons/libs/`. [r186 example imports] **Verified**

### 3.2 UMD removal

- Deprecated in r150 ("will be removed with r160"), actually **removed in r161**: "The build files `build/three.js` and `build/three.min.js` have been removed. Please use ES Modules or alternatives." [Migration Guide sections "149 → 150" and "r160 → r161"] **Verified**
- Confirmed via file listings: `three@0.160.0/build` still contains `three.js` and `three.min.js`; `three@0.161.0/build` does not. [https://data.jsdelivr.com/v1/packages/npm/three@0.160.0?structure=flat and @0.161.0] **Verified**
- So the announced version (r160) conflicts with reality (r161); both are in the same Migration Guide. Consequence: any `<script src="…/three.min.js">` in LLM output pinned to ≥0.161 404s, and the old global `THREE.*` style is gone; `three@0.160` and older still work via classic scripts. **Verified**/**Inference**
- Import maps became required for ES-module use on the web (Migration Guide: "The ES6 import of `three.js` and `examples/jsm` modules in web sites now requires the usage of an import map", from the older release it was introduced). [Migration Guide] **Verified** (release number not captured)
- `cjs` build remains (`three.cjs`) for Node/CommonJS. **Verified**

### 3.3 file:// behaviour

- **Inline `<script type="module">` that imports from https CDN URLs (via import map) works from a `file://` page** — tested: headless Edge 154.0.4258.62 loaded `three@0.186.1` + `Water.js` from jsDelivr; page reported `location.origin = "file://"`, `isSecureContext = true`, `navigator.gpu` present, WebGL2 context created (software GL). [empirical, 2026-10-17] **Verified** (Chromium only; Firefox/Safari **Unverified**)
- Why: CDNs reply `Access-Control-Allow-Origin: *`, so the opaque/`null` origin of a file page is allowed. **Inference**, consistent with the header test above.
- **Relative module imports from file:// fail** in Chromium: `await import('./x.js')` from a `file://` page → "Failed to fetch dynamically imported module: file:///…/x.js" (empirical, same Edge). Matches the widely cited error "Access to script at 'file:///…' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, brave, chrome-untrusted, https". [https://stackoverflow.com/questions/73169903/how-to-test-locally-in-a-browser-using-import-and-export , https://stackoverflow.com/questions/52919331/access-to-script-at-from-origin-null-has-been-blocked-by-cors-policy] **Verified** (test) / SO answers **Practice**
- Workarounds for local assets (textures, glTF): run `python -m http.server`, or launch Chromium with `--allow-file-access-from-files` (insecure), or embed assets as data URIs/base64. [same SO threads] **Practice**
- `fetch('./model.glb')`/`TextureLoader` of local files from `file://` fail for the same reason. **Inference** (same rule; not separately tested)
- Single-file deliverable recommendation: one `.html` with import map to a pinned jsDelivr URL, all geometry/textures procedural (no external assets) → opens by double-click; offline use requires vendoring three into the file or a local server. **Inference**

---

## 4. Official Three.js examples (exact URLs)

All below returned HTTP 200 on 2026-10-17 (`curl -s -o /dev/null -w "%{http_code}"`), and exist in the `examples/files.json` index (https://threejs.org/examples/files.json). **Verified**

Ocean / water / sky
- https://threejs.org/examples/webgl_shaders_ocean.html — imports `Water`, `Sky`, `OrbitControls`, `UnrealBloomPass` (WebGLRenderer). **Verified**
- https://threejs.org/examples/webgpu_ocean.html — imports `three/webgpu`, `pass` from `three/tsl`, `bloom` from `tsl/display/BloomNode.js`, `WaterMesh`, `SkyMesh`, `OrbitControls`, `Inspector`. **Verified**
- https://threejs.org/examples/webgpu_tsl_raging_sea.html — TSL procedural wave displacement (`mx_noise_float`, `Loop`, `positionLocal`), mirrors Bruno Simon's "raging sea" lesson topic. **Verified**
- https://threejs.org/examples/webgpu_water.html , https://threejs.org/examples/webgpu_backdrop_water.html , https://threejs.org/examples/webgpu_compute_water.html (listed in index; only `webgpu_water` HTTP-checked) **Verified**/partly
- https://threejs.org/examples/webgl_gpgpu_water.html (GPGPU heightfield) — listed in index (HTTP check timed out) **Verified** (index) / **Unverified** (page load)
- https://threejs.org/examples/webgl_shaders_sky.html , https://threejs.org/examples/webgpu_sky.html — sky scattering. **Verified** (webgpu_sky 200; webgl_shaders_sky in index)
- https://threejs.org/examples/webgl_lights_sunlight.html , https://threejs.org/examples/webgpu_lights_sunlight.html — `SunLight` with cascaded shadow maps (new in r186). **Verified** (index + 200 for webgpu variant)
- https://threejs.org/examples/webgpu_volume_cloud.html — volumetric clouds. **Verified**

City / instancing / LOD
- https://threejs.org/examples/webgpu_generator_city.html — "city generator": `CityGenerator`, `createBuildingMaterial`, `createRoadMaterial`, `FirstPersonControls`, `SkyMesh`, `bloom`, `LightProbeGrid`. Note: the dev-branch example imports `three/addons/generators/CityGenerator.js` and `LightProbeGrid` from `three/addons/lighting/`; `CityGenerator.js` and `generators/city/*` are in npm `three@0.186.1`, but `lighting/LightProbeGrid.js` exact presence in r186 is **Unverified**; the r186 migration notes mention `LightProbeGrid` renamed to `LightProbeGridWebGL` there. **Verified** (example/addons) / partial
- https://threejs.org/examples/webgl_instancing_performance.html , https://threejs.org/examples/webgl_instancing_dynamic.html , https://threejs.org/examples/webgl_instancing_scatter.html , https://threejs.org/examples/webgl_instancing_raycast.html — `InstancedMesh`. **Verified** (index; `webgl_instancing_performance` = 200)
- https://threejs.org/examples/webgl_mesh_batch.html , https://threejs.org/examples/webgpu_mesh_batch.html , https://threejs.org/examples/webgl_batch_lod_bvh.html — `BatchedMesh` (+ BVH LOD). **Verified** (200 for webgl_mesh_batch, webgl_batch_lod_bvh)
- https://threejs.org/examples/webgl_lod.html — classic `LOD` with `FlyControls`. **Verified** (200)
- https://threejs.org/examples/webgl_geometry_terrain.html , https://threejs.org/examples/webgpu_tsl_procedural_terrain.html — terrain. **Verified** (index; procedural_terrain = 200)
- https://threejs.org/examples/webgl_loader_gltf_progressive_lod.html — progressive glTF LOD. **Verified** (index)

First-person / controls / physics
- https://threejs.org/examples/games_fps.html — page title "three.js - misc - octree collisions": `GLTFLoader` + `Octree` + `Capsule` collision, WASD + mouse look, throwing balls. **Verified**
- https://threejs.org/examples/misc_controls_pointerlock.html — `PointerLockControls` + raycast floor. **Verified**
- https://threejs.org/examples/physics_rapier_instancing.html , https://threejs.org/examples/physics_jolt_instancing.html — physics engines with instancing. **Verified** (index)

Post-processing
- https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html (200) — `EffectComposer` + `UnrealBloomPass`; WebGPU equivalent https://threejs.org/examples/webgpu_postprocessing_bloom.html (200) with TSL `bloom`. **Verified**
- https://threejs.org/examples/webgl_postprocessing_ssr.html , https://threejs.org/examples/webgpu_postprocessing_ssgi.html , https://threejs.org/examples/webgpu_postprocessing_ssr.html — screen-space reflections / GI. **Verified** (index)

Other index
- Full list: https://threejs.org/examples/ (200) and `files.json`. Example source is under `https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/<name>.html` (readable; I used it for the import lists above). **Verified**

---

## 5. Performance facts

### 5.1 Draw calls

- A "draw call" = one command to the GPU to render a mesh/material pair; each costs CPU time, so counts matter far more than triangle counts for typical scenes. (General graphics fact.) **Practice**
- Don McCurdy (three.js maintainer) 2021-04-09: "The Oculus Quest guidelines are 50-100 draw calls per frame, 50,000-100,000 triangles or vertices per frame. I tend to use those as a rule of thumb for what can be rendered at 60-90fps on mobile devices, but it's just a guess." Also: the only "hard limit" is GPU memory; one 2K PNG/JPEG ≈ 22 MB with mips (`2048*2048*4*4/3`); KTX textures use 4-8x less GPU memory. [https://discourse.threejs.org/t/three-scene-optimization-texture-size-calculation-in-gpu-compression-merge-meshes-what-the-limits/23972/10] **Verified** (as a quote), **Practice** (as guidance; dated 2021)
- PlayCanvas docs: 100-200 draw calls is a rough target for low-end mobile; high-end desktops handle thousands per frame at 60 fps. [https://developer.playcanvas.com/user-manual/optimization/guidelines/] **Verified**
- Consultancy blog: 50-100 draw calls/frame safe ceiling for mobile WebGL; >200 unusable on mid-range phones. [https://ximmersion.dev/blogs/webgl-on-mobile-performance-budget] **Practice** (marketing blog; weaker source)
- A WebGPU game repo used ≤100 draw calls/frame as an *operational* target citing per-draw uniform overhead in three.js WebGPU (issue #30560); it explicitly says 100 is not a hard threshold from that issue. [https://github.com/pwretmo/deep-underworld/issues/281] **Practice** (weak, secondary)
- Measuring: WebGPURenderer `renderer.info.render.drawCalls` = draw calls per frame; `renderer.info.render.calls` counts render passes since app start (by default +2/frame), and `autoReset` only affects per-frame metrics. [https://github.com/mrdoob/three.js/issues/31072] **Verified**
- WebGLRenderer docs: `renderer.info` holds statistics (memory/render); set `renderer.info.autoReset = false` and call `renderer.info.reset()` per frame for multi-pass accounting. [https://threejs.org/docs/pages/WebGLRenderer.html] **Verified**
- There is **no official hard number** from three.js for "max draw calls"; desktop budgets of low thousands are community folklore. **Unverified** (no primary source found)

### 5.2 InstancedMesh

- Official description: "Use this class if you have to render a large number of objects with the same geometry and material(s) but with different world transformations. The usage of `InstancedMesh` will help you to reduce the number of draw calls." Constructor `new InstancedMesh(geometry, material, count)`. [https://threejs.org/docs/pages/InstancedMesh.html] **Verified**
- `boundingSphere` is automatically computed when needed (raycast, frustum culling); recompute via `computeBoundingSphere()` if instances move via `setMatrixAt` — i.e. culling treats the whole instanced mesh as one object. [same page] **Verified** (the "one-object" interpretation is **Inference**)
- Fits city scenes (windows, trees, lampposts, cars) and vegetation. **Practice**

### 5.3 BatchedMesh

- Official description: "A special version of a mesh with multi draw batch rendering support. Use this class if you have to render a large number of objects with the same material but with different geometries or world transformations." Constructor `new BatchedMesh(maxInstanceCount, maxVertexCount, maxIndexCount, material)`; `addGeometry`, `addInstance`, `setMatrixAt`, `setVisibleAt`, `setColorAt`, `optimize()`. [https://threejs.org/docs/pages/BatchedMesh.html] **Verified**
- `perObjectFrustumCulled` default **true** (individual objects of a batch are culled); `sortObjects` default **true** (front-to-back for opaque; back-to-front if material.transparent); `setMatrixAt` does not support negatively scaled matrices; bounding boxes/spheres are not computed by default. [same page] **Verified**
- Fits "many different building shapes, one material → one draw call". The r186 notes mention BatchedMesh fixes (visibility dirty flag, WebGPU draw offsets). **Practice**/**Verified** (fix list)
- Inference: for AI-generated city scenes, `BatchedMesh` (many unique buildings, one material) and `InstancedMesh` (repeated props) are the two levers that keep draw calls near tens, not thousands. **Inference**

### 5.4 LOD

- `THREE.LOD`: "basic Level of Detail mechanism"; `addLevel(object, distance, hysteresis)` switches rendering between child objects by distance; hysteresis is a fraction of distance to avoid flicker at boundaries. [https://threejs.org/docs/pages/LOD.html] **Verified**
- Examples: `webgl_lod`, `webgl_batch_lod_bvh`, `webgl_loader_gltf_progressive_lod`. **Verified**

### 5.5 Frustum culling

- `Object3D.frustumCulled`: "When set to true, the 3D object is honored by view frustum culling. Default is true." [https://threejs.org/docs/pages/Object3D.html] **Verified**
- Gotchas (known community knowledge): vertex-shader-displaced geometry (oceans, skinned meshes, GPU particles) can be wrongly culled because the CPU-side bounding sphere does not reflect displaced vertices; fix by enlarging bounds or setting `frustumCulled = false`. **Practice** (not verified in a primary source today)
- r186 added `Object3D.intersectsFrustum()`; r186 also changed behaviour so that `Object3D.updateWorldMatrix()` honors `matrixWorldNeedsUpdate` (since r185) — relevant if agents set `matrixAutoUpdate = false`. [Migration Guide] **Verified**
- Occlusion culling is not a default feature; WebGPU backend has occlusion-query support work in r186 notes (fixes), but no automatic scene occlusion. **Inference**

### 5.6 Other perf levers

- GPU memory (textures) is the practical hard limit; use compressed textures (KTX2), merge ORM maps (Don McCurdy quote above). **Verified**/Practice
- Pixel ratio capping (`renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`) is a common fix for hi-DPI laptops/phones. **Practice** (not sourced today)
- WebGPURenderer: `antialias` default false (MSAA opt-in), HalfFloat output default (docs) — memory/bandwidth trade-off (`outputBufferType: UnsignedByteType`). [https://threejs.org/docs/pages/WebGPURenderer.html] **Verified**

---

## 6. Showcase sites and demos

- Bruno Simon portfolio (drive a car around a 3D world; built with three.js, TSL, WebGL+WebGPU): https://bruno-simon.com/ (HTTP 200; text read 2026-10-17). **Verified**
- Three.js Journey (course by Bruno Simon): https://threejs-journey.com/ — 51,002 students enrolled, "116 hours of video", $120 for both courses (three.js $95 + WebGPU/TSL $45 add-on, 21 WebGPU/TSL lessons; 66 lessons / 93 h in the older three.js course tier) as shown on 2026-10-17. Includes raging-sea, galaxy, particles, physics (Cannon.js) lessons. [https://www.threejs-journey.com/ , https://www.threejs-journey.com/join?courses=threejs-journey] **Verified** (numbers differ between pages, see §7)
- Official three.js examples (above) — best "known-good" references; r186 dev adds a city generator and WebGPU ocean. https://threejs.org/examples/ **Verified**
- Babylon.js Community Demos: https://babylonjs.com/community/ (Sponza VR, Singapore Underwater by The Straits Times, Babylon Voxel.js, Maps 3d, …). **Verified** (listing read via search tool)
- Babylon Playground: https://playground.babylonjs.com (200); FFT ocean: https://playground.babylonjs.com/#YX6IB8#758 and https://popov72.github.io/OceanDemo/dist/index.html. **Verified** (links from repo README; live page not loaded)
- Babylon Lite demos (WebGPU-only): https://babylonjs.com/lite-demos/ — Ocean, LibreQuake E1M1, Freeciv isometric map; sizes shown per card. **Verified**
- PlayCanvas explore: https://playcanvas.com/explore (200). **Verified** (alive) / contents **Unverified**
- A-Frame examples: https://aframe.io/examples/ (200). **Verified** (alive)
- OGL examples: https://oframe.github.io/ogl/examples/ (200). **Verified** (alive)
- Needle Engine: https://engine.needle.tools (200). **Verified** (alive)
- `www.babylonjs.com/demos/` returns **404** (2026-10-17) — old URL; use `/community/`. **Verified**

---

## 7. Conflicts and gaps

Conflicts between sources

1. **UMD removal version**: announced "will be removed with r160" (Migration Guide, r150 section) vs actually removed in **r161** (Migration Guide r160→r161 section; jsDelivr listing shows files still in 0.160.0, gone in 0.161.0). Use r161.
2. **WebGPURenderer maturity**: manual says "still in an experimental state" (page read 2026-10-17), while Bruno Simon's portfolio and `three/webgpu` examples (ocean, city generator) ship on it, and A-Frame/Babylon docs/WWDC25 treat WebGPU as production-ready on their side. Interpretation: the *API* is shipped; three.js's *renderer* is feature-incomplete vs `WebGLRenderer` (no `ShaderMaterial`, `onBeforeCompile`, `EffectComposer`).
3. **Firefox WebGPU**: caniuse shows Firefox 63-161 "Disabled by default" (and Firefox Android 157 disabled) vs Mozilla/gpuweb wiki and Firefox 147 release notes: shipped on Windows (141) and Apple-Silicon macOS (145/147). caniuse appears not to reflect platform-partial shipping; trust Mozilla.
4. **Safari WebGPU**: caniuse shows macOS Safari 26+ as "partial support" but iOS Safari 26+ as "supported"; WebKit blog says shipping in macOS/iOS/iPadOS/visionOS 26 with no caveat. gpuweb wiki lists "macOS ✅ 26" — whether Sequoia/Sonoma Macs (which get Safari 26 but not macOS 26) have WebGPU is **Unverified**.
5. **caniuse WebGPU global 87.82%** looks high versus per-platform gaps (Firefox Linux/Android, Linux Chrome partial, Android WebView/Browser). Possibly because caniuse counts desktop+mobile Chromium/Safari 26. Do not quote as "share of users who can run our demo" without caveat.
6. **unpkg CORS reliability**: forum posts claim unpkg stopped working (CORS errors) from r175 / has outages; my curl on 2026-10-17 returned 200 with `Access-Control-Allow-Origin: *`. Likely transient/historical. Recommend jsDelivr for the tutorial regardless.
7. **OGL licence**: GitHub API returned no licence object; npm `ogl@1.0.11` says `Unlicense`.
8. **Three.js Journey numbers**: homepage says 116 hours total, `$120` bundle, 21 WebGPU lessons + 87 Three.js lessons; the `join` page says Three.js course "$95 … 66 lessons · 93 hours"; an older Gumroad page says "66 lessons / 91 hours". Likely different snapshot dates; irrelevant to the tutorial except as a "scale of learning" fact.
9. **Needle price**: pricing card shows "€49" and "€67 / user / month billed annually" together; search synthesis claimed €588/yr (=€49×12). Ambiguous.

Gaps (could not verify / not done)

- Official three.js "Installation" manual text (its URLs returned 404 via fetch; the manual is a JS shell at https://threejs.org/manual/). Import-map pattern was verified empirically and via forum.
- `file://` import behaviour in **Firefox and Safari** (only headless Edge/Chromium tested). Firefox historically differs (same-directory relative imports); **Unverified**.
- Whether `three/addons/lighting/LightProbeGrid.js` exists in the **r186 npm package** (the city example on `dev` imports it; I only confirmed `generators/CityGenerator.js` and `generators/city/*`).
- Real FPS numbers for any demo on any GPU (no benchmarks run). No primary source for a "draw calls budget" on desktop.
- LLM-training-data share is **inferred** from downloads/SO counts; no direct measurement of model familiarity.
- Babylon-specific built-in first-person camera/collision API details and A-Frame `wasd-controls` were not re-read today (**Practice** only).
- Babylon Lite and Needle Engine 6 (alpha) maturity unknown.
- WebGPU on Android (non-Chrome), Samsung Internet 24-30 behaviour, and WebView were not investigated beyond caniuse.
- Frustum-culling gotcha for vertex-displaced geometry is community knowledge; no primary doc cited.

Temp artefacts: a throw-away test page for the file:// experiment was created under `%TEMP%\r1test` and deleted; no other files were written besides this one.
