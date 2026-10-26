# R2 — Shader art and scene recipes (ocean, city, terrain, atmosphere)

Research date: **2026-10-17**. All counts (stars, versions) are as read on 2026-10-17 unless stated otherwise.
Tags: **Verified** = read in primary source this session; **Practice** = widely used engineering practice / stated by a tool's own docs or source; **Inference** = my deduction from verified facts; **Unverified** = not confirmed.

---

## 0. Orientation: three families of "impressive 3D scene"

- A "scene" can be produced by three different pipelines, and AI agents tend to pick based on the prompt's wording. (a) **Fragment-shader-only** (ShaderToy style): one full-screen quad, everything is math per pixel (raymarching, SDF, noise). (b) **Mesh + shader** (three.js/Unity/Unreal style): real triangles (a displaced water grid, instanced buildings) plus a few custom shaders. (c) **Hybrid** (iq's "Elevated"): rasteriser finds the surface, shaders do deferred texturing/shading. [https://iquilezles.org/articles/function2009/function2009.pdf] **Verified** (slide text: "like traditional raymarching, but with primary ray intersections computed by the rasterizer and the zbuffer").
- Inference: a tutorial for a software engineer should say that family (a) is *code golf for the GPU* — spectacular but tied to one pixel shader, hard to integrate with gameplay/physics/collision; family (b) is what interactive city/ocean web demos use. **Inference**
- three.js latest release at research date: **r186 (0.186.0), published 2026-09-24**; repo 116,534 stars, MIT licence, last push 2026-10-17. [https://github.com/mrdoob/three.js] [https://api.github.com/repos/mrdoob/three.js/releases/latest] **Verified**

---

## 1. Shader art

### 1.1 ShaderToy
- Shadertoy is a browser site where each "shader" is a single fragment-shader function `mainImage(out vec4 fragColor, in vec2 fragCoord)` run per pixel, with inputs `iResolution`, `iTime`, `iMouse`, `iChannel0..3`, `iFrame`, etc. Language shown on-site: WebGL 2.0. [https://www.shadertoy.com/view/Ms2SD1 (help panel)] **Verified**
- **Licence default**: authors own their shaders and choose a licence; "if you don't place a license on a shader, it will be protected by our default license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported". Shadertoy additionally gets a licence to host/display. [https://www.shadertoy.com/terms] **Verified**
- Consequence: copying a ShaderToy shader into a commercial product without checking its header is a licence risk; CC BY-NC-SA 3.0 forbids commercial use and requires share-alike. An AI agent that "ports" Seascape/Elevated verbatim inherits that. [https://godotshaders.com/shader/seascape-shader/ (community note on ports); https://www.shadertoy.com/terms] **Verified** (terms) / **Inference** (consequence for agent output)
- iq's own site: "all technical code snippets you'll find are under the MIT license so you can easily reuse them, but the mathematical/shader art is protected and requires a license for use." So iquilezles.org *articles' snippets* (e.g. SDF primitives) are MIT, while his ShaderToy *scenes* are not freely reusable. [https://iquilezles.org/articles/] **Verified**
- Exact URLs (existence checked via search; page bodies are JS-rendered so contents not readable by fetch):
  - "Seascape" — Alexander Alekseev aka TDM, 2014: https://www.shadertoy.com/view/Ms2SD1 — source mirror with header: https://github.com/tdmaav/shadertoy/blob/master/Seascape.shader — licence line in source: "Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License". **Verified**
  - "Elevated" — iq: https://www.shadertoy.com/view/MdX3Rr **Verified** (URL), authorship per iq's own article pages [https://iquilezles.org/articles/fbm/ links "Rainforest" 4ttSWf as iq's].
  - "Rainforest" — iq, 2016: https://www.shadertoy.com/view/4ttSWf — iq states fBM there generated "the terrain, the clouds, the tree distribution, their color variations, and the canopy details". [https://iquilezles.org/articles/fbm/] **Verified**
  - "[SH17C] Raymarching tutorial" (task brief example): URL **not verified** — I did not locate it. **Unverified**
  - Famous procedural-city ShaderToys: none verified in this session; do not cite specific IDs. **Unverified**

### 1.2 Raymarching / sphere tracing / SDF
- **Sphere tracing**: Hart, J.C., "Sphere tracing: a geometric method for the antialiased ray tracing of implicit surfaces", *The Visual Computer* 12(10):527–545, Dec 1996, DOI 10.1007/s003710050084. Core claim: march along the ray "in steps guaranteed not to penetrate the implicit surface"; needs only a bound (Lipschitz) on the function's derivative. [https://doi.org/10.1007/s003710050084] [https://experts.illinois.edu/en/publications/sphere-tracing-a-geometric-method-for-the-antialiased-ray-tracing/] **Verified**
- An SDF (signed distance function) returns the distance to the nearest surface from any point; the raymarch loop `t += sdf(ro+rd*t)` exploits that. iq's 2008 slides: "The trick is to be able to compute or estimate (a lower bound of) the distance to the closest surface at any point in space. This allows for marching in large steps along the ray." [https://iquilezles.org/articles/nvscene2008/rwwtt.pdf] **Verified**
- iq article index lists, under "SDFs & Raymarching": Raymarching SDFs, **Smooth minimum for SDFs**, Domain Repetition, Soft Shadows, Numerical normals, Raymarching terrains, FBM detail in SDFs, etc. [https://iquilezles.org/articles/] **Verified**
  - Distance functions (3D SDF primitives + ops): https://iquilezles.org/articles/distfunctions/ **Verified** (page fetched)
  - Smooth min: https://iquilezles.org/articles/smin/ **Verified** (page fetched)
  - Raymarching terrains (heightfield, not SDF): https://iquilezles.org/articles/terrainmarching/ **Verified**
  - fBM: https://iquilezles.org/articles/fbm/ **Verified**
  - Domain warping: listed on article index; URL pattern https://iquilezles.org/articles/warp/ — **Unverified** (not fetched).
- **Heightfield raymarch ≠ SDF raymarch**: iq's terrain article marches fixed steps and checks `p.y < f(p.x,p.z)`, then improves with linear interpolation and `dt` proportional to distance ("accuracy proportional to the distance dt = 0.01*t"). [https://iquilezles.org/articles/terrainmarching/] **Verified**
- Seascape (verified from source): 32 march steps (`NUM_STEPS = 32`), 3 octaves for geometry and 5 for fragment normals, ocean as a *heightfield* of sine-based octaves (`1.0-abs(sin(uv))` with domain distortion by value noise), traced with bisection (`mix(tm,tx,hm/(hm-hx))`), Fresnel as `(1-dot(n,-eye))^3` capped at 0.5, sky is a cheap gradient function (not an atmosphere model). So Seascape is **not** Gerstner or FFT; it is a stylised sine/noise heightfield. [https://raw.githubusercontent.com/tdmaav/shadertoy/master/Seascape.shader] **Verified**
- "Elevated" nuance: the 2009 4 KB intro (rgba & TBC, Breakpoint 2009) used a **rasterised low-density displaced grid** + deferred procedural shading, not pure two-triangle raymarching; the ShaderToy version at MdX3Rr is a later port. [https://iquilezles.org/articles/function2009/function2009.pdf] [https://www.pouet.net/prod_nfo.php?which=52938] **Verified** (intro structure); that the ShaderToy version raymarches a heightfield is **Unverified** (page body unreadable; a Japanese memo says it exists as ShaderToy port [https://hanecci.hatenadiary.org/entry/20150313/p1]).
- Original: "Rendering Worlds with Two Triangles with raytracing on the GPU in 4096 bytes" (NVScene 2008) — draw two triangles covering the screen, pixel shader makes the image. [https://iquilezles.org/articles/nvscene2008/rwwtt.pdf] **Verified**
- Book of Shaders (Patricio Gonzalez Vivo & Jen Lowe): free fragment-shader tutorial; chapters Random, Noise, Cellular noise, fBM, Fractals, Image processing. [https://thebookofshaders.com/] [https://thebookofshaders.com/13/] **Verified**

### 1.3 Noise family (what makes terrain/clouds/water "organic")
- **Perlin 1985**: Ken Perlin, "An image synthesizer", SIGGRAPH '85 (Computer Graphics 19(3):287–296), introduced `Noise()` and "solid texture"; used for clouds, fire, water, marble, rock. [https://dl.acm.org/doi/10.1145/325165.325247] **Verified**
- **Improved noise 2002**: Perlin, "Improving noise", SIGGRAPH 2002; fixes "second order interpolation discontinuity and unoptimal gradient computation" (quintic fade curve 6t⁵−15t⁴+10t³ replaces cubic 3t²−2t³). [https://doi.org/10.1145/566570.566636] [https://thebookofshaders.com/11/] **Verified**
- **Simplex noise**: Perlin 2001 course notes; practical explanation in Gustavson, "Simplex noise demystified" (2005-03-22). [https://cgvr.cs.uni-bremen.de/teaching/cg_literatur/simplexnoise.pdf] **Verified**. Note: Book of Shaders text conflates "improved noise" with "Simplex Noise" in one paragraph — minor doc inaccuracy (**Inference**).
- **Value noise** = interpolated random lattice values (blocky); **gradient noise** = interpolated random gradients (Perlin). [https://thebookofshaders.com/11/] **Verified**
- **Worley / cellular noise**: Worley 1996 SIGGRAPH "A Cellular Texture Basis Function" (feature-point cells; stone, ice, crust, craters). [https://cedric.cnam.fr/~cubaud/PROCEDURAL/worley.pdf] **Verified**
- **fBM** = sum of octaves, frequency ×2 (lacunarity), amplitude ×G (gain). iq: `G = 2^-H`; G=0.5 (H=1) is the common default and, in his (self-described non-rigorous) photo measurement, matches mountain profiles (−9 dB/octave). [https://iquilezles.org/articles/fbm/] **Verified**. Tip from iq: detune octaves (2.01, 1.99) or rotate the 2D domain per octave to avoid aligned peaks. **Verified** (same page)
- **Domain warping**: feed fBM output back into the input coordinates of another fBM (iq article "Domain warping" in index). Technique exists; details **Unverified** this session (page not fetched).

---

## 2. Ocean

### 2.1 Wave models (from cheapest to most physical)
- **Sum of sines** + sharpening: GPU Gems 1, ch.1 "Effective Water Simulation from Physical Models", Mark Finch (Cyan Worlds; used in *Uru: Ages Beyond Myst*). Vertex shader sums sines for the mesh; a second sum of waves is rendered into a 256×256 render target as a dynamic normal map ("about 15 waves … two to four passes"). Raising a shifted sine to a power `k` gives sharper crests/wider troughs. [https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models] **Verified**
- **Gerstner (trochoidal) waves**: same chapter; a wave's steepness parameter Qᵢ: 0 = sine, `Qᵢ = 1/(wᵢAᵢ)` = sharp crest, larger values form loops; vertices also move horizontally toward crests, putting vertex density where detail is sharpest. [same URL] **Verified**
- Shipped in engines: Unreal's Water system ships **Gerstner** as its (only built-in) wave model, configurable via Water Waves Asset (Num Waves, Seed, wavelength/amplitude ranges, wind angle). [https://docs.unrealengine.com/4.27/en-US/BuildingWorlds/Water/WaterWaveAsset/] **Verified** (UE 4.27 docs). In UE 5.7 the experimental `WaterAdvanced` plugin lists `UFFTOceanPatchSubsystem` (FFT ocean patch) and Niagara shallow-water classes. [https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/WaterAdvanced] **Verified** (class names only; capabilities beyond names **Unverified**).
- **FFT ocean (Tessendorf)**: J. Tessendorf, "Simulating Ocean Water" (SIGGRAPH course notes 1999–2004). Wave height field built from random Fourier amplitudes with a statistical spectrum, then inverse FFT on a periodic tileable grid; Phillips spectrum `Pₕ(k) = A·exp(−1/(kL)²)/k⁴ · |k̂·ŵ|²`, `L = V²/g`; suppress tiny waves with `exp(−k²ℓ²)`; JONSWAP also presented in his slides. [https://jtessen.people.clemson.edu/reports/papers_files/coursenotes2004.pdf] [https://jtessen.people.clemson.edu/reports/papers_files/waterslides2001.pdf] **Verified** (2002/2004 notes also hosted at …/coursenotes2002.pdf). Slides: "Real-time capable for games", "Used a lot in professional productions." **Verified**
- **Foam from Jacobian folding**: Tessendorf proposal as summarised in NVIDIA CGDC 2015 slides: Jacobian of the flat→displaced mapping: J>1 stretched, J<1 squeezed, J<0 overlap = "Wave breaks!"; they threshold at `J < M` with M≈0.3–0.5 and accumulate foam as turbulent energy over time. [https://developer.download.nvidia.com/assets/gameworks/downloads/regular/events/cgdc15/CGDC2015_ocean_simulation_en.pdf] **Verified**
- **Cascades**: split the spectrum into several non-overlapping bands (NVIDIA: 4 cascades) to avoid visible tiling. abyssal-ocean (single HTML file, WebGL2 + three.js, MIT, 55 stars, last push 2026-08-18): JONSWAP+TMA, **3 cascades (768 m / 121 m / 19 m tiles), 512² inverse FFT per cascade per frame**, foam via Jacobian in a ping-pong buffer. [https://github.com/squall01337/abyssal-ocean] **Verified** (README claims; I did not run it).
- **Sea of Thieves** (Rare, SIGGRAPH 2018 talk): ocean is the Tessendorf FFT technique with stylisation — water colour blends deep vs sub-surface by view angle, sun direction and a wave-peak mask from FFT choppiness; foam from peaks plus depth-buffer intersection foam, blurred with feedback, blended with artist textures; area specular highlight for low sun; Snell's window when underwater. Authors Ang, Catling, Ciardi, Kozin. [https://dl.acm.org/doi/pdf/10.1145/3214745.3214820] **Verified**. (Not Gerstner. Correct common misconception.)

### 2.2 Implementations an agent can imitate
- **Jump Trajectory** "Ocean waves simulation with Fast Fourier transform" (YouTube, published 2020-06-28 per search summary): https://www.youtube.com/watch?v=kGEqaX4Y4bQ ; code: https://github.com/gasgiant/FFT-Ocean (Unity, C# + ShaderLab, MIT, **808 stars**, last push 2022-07-07, README: "This is a prototype. Not recommended for real projects."; successor https://github.com/gasgiant/Ocean-URP, MIT, 252 stars, unfinished). The video itself notes Crest "don't use FFT … relying instead on … scrolling textures, calculating waves in several levels of detail". [video description text + repos] **Verified** (repo facts); publication date **Unverified** beyond a search summary.
- **Acerola** (Garrett Gunnell), "I Tried Simulating The Entire Ocean": https://www.youtube.com/watch?v=yPfagLeUa7k — Fourier-based waves; transcript says a normal sum-of-waves approach hit its limit at ~650 waves before FPS < 60 on his GPU, whereas the FFT version shows "4.2 million waves at 150 fps". Publication date 2023-08-31 and length 22:52 come from a search summary only. [video transcript via search tool] **Verified** (transcript quote) / date **Unverified**
- Godot port citing Acerola/Jump Trajectory: https://github.com/2Retr0/GodotOceanWaves (MIT, 3,320 stars, last push 2025-04-29). **Verified** (repo stats). Its README says it was "essentially" FFT ocean in Godot (description). **Verified**
- **Crest** (Unity): https://github.com/wave-harmonic/crest — MIT, **3,922 stars**, last push 2026-06-18; the repo is "Crest Water 4" for the built-in renderer and its README says "Crest Water 5 is now available" as a separate Unity Asset Store product (licence/price of Water 5 **Unverified**). [https://raw.githubusercontent.com/wave-harmonic/crest/master/README.md] **Verified**
- **three.js addons** (read from source on `dev`, r186):
  - `Water` (WebGL) / `WaterMesh` (WebGPU): "A basic flat, reflective water effect"; planar mirror render target + scrolling normal map `waternormals.jpg` + sun specular + `distortionScale`. Lineage credited in source: Slayvin's flat mirror, Stemkoski, 29a.ch WebGL water slides. [https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/objects/Water.js] **Verified**
  - `Water2` / `Water2Mesh`: "An advanced water effect that supports reflections, refractions and flow maps" via `Reflector` + `Refractor`. [https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/objects/Water2.js] **Verified**
  - Example `webgl_shaders_ocean.html` = `Water` + `Sky` + `UnrealBloomPass` + `ACESFilmicToneMapping` with `toneMappingExposure = 0.1`, sky `turbidity=10, rayleigh=2, mieCoefficient=0.005, mieDirectionalG=0.8`, `distortionScale: 3.7`, sun lighting via `PMREMGenerator` environment map. [https://github.com/mrdoob/three.js/blob/dev/examples/webgl_shaders_ocean.html] **Verified**. That is almost certainly the template an AI agent copies for "realistic ocean with sky/sun/reflections" in three.js. **Inference**
  - Other official examples present on `dev` at 2026-10-17: `webgpu_ocean.html`, `webgpu_water.html`, `webgpu_compute_water.html` (128×128 height grid, ping-pong buffers), `webgpu_tsl_raging_sea.html` (per search summary), `webgl_gpgpu_water.html`. [https://threejs.org/examples/webgpu_ocean.html] [https://threejs.org/examples/webgpu_compute_water.html] **Verified** (existence); internals of `webgpu_ocean` **Unverified**.
  - Older: jbouny/ocean "Realistic water shader for Three.js" (MIT, 804 stars, last push 2017-10-18, targets three.js r71). [https://github.com/jbouny/ocean] **Verified** — historically influential, now stale.

### 2.3 Shading: reflection, refraction, Fresnel, SSS, foam
- **Fresnel**: water reflects more at grazing angles. Seascape uses cheap `fresnel = clamp(1-dot(n,-eye))^3` capped at 0.5 to mix refracted base colour vs reflected sky. [Seascape source above] **Verified**. Schlick's approximation is the usual realistic variant. **Practice** (Schlick 1994; not re-fetched this session).
- **Planar reflection** (render scene a second time mirrored; three.js `Reflector`/`Water`): exact for flat water, cost = extra scene render. **Screen-space reflections** (SSR; three.js `SSRPass`, TSL `SSRNode`): cheap, but only reflects what is on screen, so sky/off-screen objects vanish at edges. Both module families exist in r186. [three.js `examples/jsm/postprocessing/SSRPass.js`, `examples/jsm/tsl/display/SSRNode.js`; listing from GitHub contents API 2026-10-17] **Verified** (existence) / trade-off statement **Practice**.
- **Refraction + depth fade**: `Refractor` (Water2) renders the scene behind the water to a texture and distorts it. [Water2.js source] **Verified**
- **SSS approximation**: Sea of Thieves blends deep/subsurface colour by view angle, sun direction and wave-peak mask (thin crests transmit more light). DanielAskerov/URP-Ocean-System lists "Subsurface scattering approximation" among features. [SoT paper above; https://github.com/danielaskerov/urp-ocean-system (17 stars, no licence file detected)] **Verified**
- Foam: see Jacobian above; artist-texture foam masks (SoT) for stylised look. **Verified**

### 2.4 Quality ladder — OCEAN (simple → advanced)
1. **Flat blue plane** + Fresnel colour mix with sky gradient. (Seascape's `getSeaColor` core.) **Verified**
2. **Scrolling normal map + sun specular + planar mirror** — three.js `Water`. [Water.js] **Verified**
3. **Sum of 3–8 sines/Gerstner in vertex shader** (+ normal-map ripples, ~15 waves per Finch). [GPU Gems ch.1] **Verified**
4. **Noise-sine heightfield raymarched in fragment shader** (Seascape: 32 steps, 3/5 octaves). **Verified**
5. **Refraction, depth-based colour, shoreline/intersection foam** (`Water2`, SoT intersection foam). **Verified**
6. **FFT spectrum (JONSWAP/Phillips), single tile** with displacement + derivatives. **Verified**
7. **FFT with 3–4 cascades + Jacobian foam accumulation + choppiness** (Jump Trajectory, Acerola, NVIDIA, abyssal-ocean). **Verified**
8. **Add physically-based sky (Hillaire/Bruneton), underwater caustics/Snell window, buoyancy physics, wakes, SSS** (Crest, SoT, Unreal WaterAdvanced). **Verified** in parts
- Inference: most AI-generated "ocean" demos land on rungs 2–3; rung 7 requires compute/FFT code that is still bespoke and error-prone. **Inference**

---

## 3. Sky and atmosphere

- **Preetham 1999**: Preetham, Shirley, Smits, "A Practical Analytic Model for Daylight", SIGGRAPH '99, pp.91–100, DOI 10.1145/311535.311545 — analytic sky luminance from turbidity + sun position. [https://doi.org/10.1145/311535.311545] **Verified**
- **three.js `Sky` (WebGL) and `SkyMesh` (WebGPU/TSL)** are based on "A Practical Analytic Model for Daylight aka The Preetham Model" per their JSDoc; uniforms `turbidity`, `rayleigh`, `mieCoefficient`, `mieDirectionalG`, `sunPosition`, plus cloud uniforms (`cloudCoverage`, `cloudDensity`, `cloudElevation`, `cloudScale`, `cloudSpeed`) and `showSunDisc`. **Verified** (Sky.js source header, SkyMesh docs). [https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/objects/Sky.js] [https://threejs.org/docs/pages/SkyMesh.html] — **confirms user's hypothesis: Preetham-based, not Hosek-Wilkie.**
- **Hosek–Wilkie 2012**: "An Analytic Model for Full Spectral Sky-Dome Radiance", ACM TOG 31(4), art. 95, DOI 10.1145/2185520.2185591 — improves sunsets and high turbidity, adds ground albedo, "drop-in replacement of the Preetham model". Reference code with `arhosekskymodelstate_alloc_init(turbidity, albedo, solar_elevation)`. [https://doi.org/10.1145/2185520.2185591] [https://github.com/ebruneton/clear-sky-models/blob/master/atmosphere/model/hosek/ArHosekSkyModel.h] **Verified**
- **Bruneton & Neyret 2008**: "Precomputed Atmospheric Scattering", Computer Graphics Forum 27(4):1079–1086 (EGSR 2008); multiple Rayleigh+Mie scattering precomputed into tables, constant-time lookup at runtime, ground-to-space views. [https://inria.hal.science/inria-00288758] **Verified**. Author's 2017 clean reimplementation: https://github.com/ebruneton/precomputed_atmospheric_scattering — BSD-3-Clause, **1,071 stars**, last push 2025-10-05, has an online demo. **Verified**
- **Hillaire 2020**: "A Scalable and Production Ready Sky and Atmosphere Rendering Technique", CGF 39(4):13–22 (EGSR 2020), DOI 10.1111/cgf.14050 — no high-dimensional LUTs; new real-time multiple-scattering approximation; scales mobile → PC. Reference code https://github.com/sebh/UnrealEngineSkyAtmosphere — MIT, **860 stars**, last push 2022-09-11. [https://doi.org/10.1111/cgf.14050] [https://sebh.github.io/publications/] **Verified**
- Inference: for a browser demo, Preetham (three.js Sky) is the "free" option; Hillaire/Bruneton need LUT passes (compute or multi-pass), so agents rarely generate them unprompted. **Inference**
- Environment lighting trick used by the official examples: render the sky into a `PMREMGenerator` environment map so the water/buildings reflect it (hide sun disc while generating, per three.js docs `showSunDisc`). [https://threejs.org/docs/pages/Sky.html] [webgl_shaders_ocean.html] **Verified**

---

## 4. Procedural city

### 4.1 Research lineage
- **Parish & Müller 2001**, "Procedural Modeling of Cities", SIGGRAPH 2001 (DOI 10.1145/383259.383292): extended **L-systems** driven by image maps (land/water, population density) generate highways/streets, lots, and buildings; buildings via parametric stochastic L-system from lot plans; facades tiled into nested grid cells with procedural textures. [https://doi.org/10.1145/383259.383292] [https://people.eecs.berkeley.edu/~sequin/CS285/PAPERS/Parish_Muller01.pdf] **Verified**
- **Müller, Wonka, Haegler, Ulmer, Van Gool 2006**, "Procedural Modeling of Buildings" (SIGGRAPH 2006, DOI 10.1145/1179352.1141931): **CGA shape** grammar — sequential, context-sensitive shape rules (split, repeat-split, component split) for building shells; used for virtual Pompeii; basis of CityEngine (the product link is **Practice**, not verified here). [https://doi.org/10.1145/1179352.1141931] [https://peterwonka.net/Publications/pdfs/2006.SG.Mueller.ProceduralModelingOfBuildings.final.pdf] **Verified** (paper). The paper contrasts "parallel grammars like L-systems" vs its "sequential grammar".
- **Interior Mapping**: Joost van Dongen, "Interior Mapping: A new technique for rendering realistic buildings", CGI 2008 (Istanbul). Raycast in the pixel shader against regularly spaced virtual floors/walls/ceilings behind window pixels; cost "constant in the number of rooms"; no interior geometry stored. [https://proun-game.com/Oogst3D/CODING/InteriorMapping/InteriorMapping.pdf] [https://cgi-conf.org/accepted_papers.html] **Verified**
- **Wave Function Collapse** (WFC): mxgmn/WaveFunctionCollapse — **25,402 stars**, last push 2026-10-15, "Bitmap & tilemap generation from a single example"; licence is MIT with the addition "Provided image samples and tiles are not part of WaveFunctionCollapse software" (GitHub API shows `NOASSERTION` because of that extra line). [https://github.com/mxgmn/WaveFunctionCollapse] [https://raw.githubusercontent.com/mxgmn/WaveFunctionCollapse/master/LICENSE] **Verified**
- **Townscaper** (Oskar Stålberg): irregular quad grid built by subdividing a hex grid into quads and relaxing points; square tiles are deformed to fit; WFC resolves tile adjacency; predecessor Brick Block used regular grid + marching-cubes-style meshing; "Bad North" used a different WFC variant. [https://www.gamedeveloper.com/game-platforms/how-townscaper-works-a-story-four-games-in-the-making] [https://mcvuk.com/business-news/when-we-made-townscaper/] **Verified**. The 380,000 Steam copies figure appears in an MCV headline (date of figure **Unverified**).
- Windows in Townscaper are cut with a stencil-buffer technique per Stålberg's Konsoll 2021 talk (speaker's own statement via transcript). [https://www.youtube.com/watch?v=5xrRTOikBBg] **Verified** (transcript; wording imprecise)

### 4.2 Web-scale recipes (what an agent will produce)
- **mrdoob "City" (v0.1)** — a flight/walk demo in about 100 lines of three.js: reddit post dated **2013-06-30** (not 2012 as the task brief supposed) linking http://www.mrdoob.com/lab/javascript/webgl/city/01/ ; a later refactor repo notes the original was announced on Twitter and was not in a GitHub repo. [https://www.reddit.com/r/threejs/comments/1hctq8/city_01/] [https://github.com/tibbon/better_3d_prodecural_city_js] **Verified** — **conflict with brief: date is 2013.**
- **Jerome Etienne "How to Do a Procedural City in 100 Lines"** (learningthreejs, **2013-08-02**): ~**20,000** randomly sized/placed cubes merged into one mesh; buildings may intersect, no street spaces (as noted in DZone summary). [http://learningthreejs.com/blog/2013/08/02/how-to-do-a-procedural-city-in-100lines/ (fetch timed out; date from URL; content via https://dzone.com/articles/prodecedural-city-100-lines)] **Verified** (via secondary). Repo https://github.com/jeromeetienne/threex.proceduralcity: MIT, **145 stars**, last push 2014-01-25; usage `new THREEx.ProceduralCity()` returns a `THREE.Mesh`. **Verified**
- **Pixel City** — Shamus Young, Twenty Sided, 13-part series starting 2009-04-13; goal "nighttime cityscape mostly made of lights and suggestions"; **no textures/models/art assets** — everything built at startup; vanilla OpenGL (no shaders), Windows; ~"50 hours of coding" per his YouTube description; video published 2009-05-01. Source mirror https://github.com/skeeto/pixelcity — **362 stars, no licence file detected**, last push 2021-01-14 (so reuse rights unclear). [http://www.shamusyoung.com/twentysidedtale/?p=2940] [https://www.shamusyoung.com/twentysidedtale/?p=3237] [https://www.youtube.com/watch?v=-d2-PtK4F6Y] **Verified**. Buildings: cylinder-derived and tiered shapes plus plain cubes; procedurally generated window textures. [https://www.shamusyoung.com/twentysidedtale/?p=2968] **Verified**
- **three.js official `CityGenerator` addon** (new; on `dev` at 2026-10-17): `examples/jsm/generators/CityGenerator.js` (678 lines) lays out a grid of blocks, fills each lot with a seeded `SkyscraperGenerator` tower, optional curb slabs, plus street furniture generators (streetlight, traffic light, bench, hydrant, street tree, car, person). Example `webgpu_generator_city.html`: WebGPURenderer, `SkyMesh`, `FirstPersonControls`, TSL `bloom` at quarter resolution, `ACESFilmicToneMapping` exposure 0.13, `LightProbeGrid` irradiance probes. Buildings/roads use TSL procedural materials (noise, hash, fract-based windows). [https://github.com/mrdoob/three.js/blob/dev/examples/jsm/generators/CityGenerator.js] [https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_generator_city.html] **Verified**. This is the strongest "first-person street walk" template in the library itself. **Inference** (that agents will find/copy it).
- Also on `dev`: `webgpu_lights_clustered_city.html` (many-light night city) — existence verified, contents **Unverified**.
- **Instancing**: `InstancedMesh` draws N copies in one call; `CityGenerator` imports it. Official examples `webgl_instancing_*`, `webgpu_instance_*`. **Verified** (names/imports). Why it matters: thousands of buildings/lights/cars in one draw call. **Practice**
- **Night lights / windows in the fragment shader**: Pixel City draws lit windows into generated textures; CityGenerator's TSL material uses `hash`, `fract`, `step`, `smoothstep` (from import list) for per-window variation. **Verified** (imports) / mechanism details **Unverified**.

### 4.3 Quality ladder — CITY (simple → advanced)
1. **20k random boxes merged** (mrdoob/Etienne 2013) — no roads, overlaps. **Verified**
2. **Grid of blocks + roads + varied heights** (CityGenerator layout; Pixel City). **Verified**
3. **Procedural window textures + emissive night lights + fog** (Pixel City, Etienne demo adds fog + first-person controls). **Verified**
4. **Instanced / merged geometry, LOD, frustum culling** for 10⁴–10⁵ objects (Practice).
5. **Street furniture, cars, pedestrians, sidewalks** (CityGenerator generators). **Verified**
6. **PBR materials + physically-based sky + tone mapping + bloom + probes** (`webgpu_generator_city.html`). **Verified**
7. **Interior mapping for windows** (van Dongen 2008) — fake rooms behind glass, no extra geometry. **Verified** (technique)
8. **Grammar-based buildings (CGA/L-system roads)** or **WFC tile cities** (Parish–Müller, Müller 2006, Townscaper). **Verified** (papers/articles)
9. **Real geodata (OSM/photogrammetry)** — out of scope here; not researched. **Unverified**
- Inference: most "impressive" AI city fly-overs are rung 2–3 + a good sky + bloom/fog/tone mapping; the visual gain is more from lighting/post than from building geometry. **Inference**

---

## 5. Terrain, fog, day/night, vegetation, crowds, camera

### 5.1 Terrain and fog
- Terrain = heightfield `y = f(x,z)` (fBM of noise) rendered either as a displaced mesh (three.js `webgl_geometry_terrain.html`, `webgpu_tsl_procedural_terrain.html`) or raymarched (iq). iq's colouring advice: shade by altitude **and slope** (normal.y), randomise thresholds with noise, apply fog by distance. [https://iquilezles.org/articles/terrainmarching/] **Verified**; three.js example names **Verified** (existence).
- iq's lighting recipe in that article: yellowish directional "sun" + dimmer bluish "sky" fill; soft shadows by depth-into-terrain of shadow ray. **Verified**
- Fog in three.js: scene `Fog`/`FogExp2` and TSL examples `webgpu_custom_fog*.html`, `webgpu_fog_height.html`, `webgpu_postprocessing_fog.html`. **Verified** (existence); formulas **Practice** (exponential extinction `exp(-d·density)`).
- iq also lists "Better fog" and "Outdoors lighting" in his index. [https://iquilezles.org/articles/] **Verified** (titles only)

### 5.2 Day/night
- three.js: move `sky.sunPosition` / `sunLight` by elevation/azimuth and regenerate the PMREM env map (see `webgl_shaders_ocean.html` `updateSun()` using `phi = degToRad(90 - elevation)`). [source above] **Verified**. Night = lower exposure + emissive windows/streetlights + bloom. **Practice**

### 5.3 Vegetation (grass)
- Ghost of Tsushima, Eric Wohllaib, GDC 2021 "Procedural Grass in 'Ghost of Tsushima'": compute shaders generate per-blade instance data, indirect draw; each blade a **cubic Bézier** (position and derivative cheap; control points reshape blade); **15 vertices** high LOD / **7** low LOD; short grass can fold vertices into two blades; scene had >1,000,000 blades with ~83,000 rendered (Chinese write-up of talk) and ~100,000 Bézier blades drawn per summary; wind from scrolling noise (summary). [https://www.youtube.com/watch?v=Ibe1JBF5i5Y] [https://archive.thedatadungeon.com/ghost_of_tsushima_2020/documents/gdc_2021/gdc_2021_procedural_grass_in_got.pdf] [http://www.gamelook.com.cn/2023/06/520095/] **Verified** (15/7 vertices, Bézier, compute+indirect); blade counts are from secondary summaries → treat as **Unverified** precisely.
- Web version: instanced blades in `InstancedMesh` with vertex-shader wind (three.js `webgl_instancing_scatter.html` exists). **Practice**

### 5.4 Crowds and traffic
- **Reynolds 1987** "Flocks, Herds, and Schools: A Distributed Behavioral Model", SIGGRAPH '87, Computer Graphics 21(4):25–34, DOI 10.1145/37402.37406 — boids as particles with local behaviours; **Reynolds 1999** GDC "Steering Behaviors For Autonomous Characters": seek, flee, pursue, evade, wander, arrival, obstacle avoidance, path following, **flow-field following**, queuing, flocking = separation + alignment + cohesion. [https://www.red3d.com/cwr/papers/1987/boids.html] [http://www.red3d.com/cwr/steer/index.html] **Verified**. OpenSteer is a C++ implementation (prototype v0.7). **Verified**
- three.js has GPU boids: `webgl_gpgpu_birds.html`, `webgpu_compute_birds.html` (existence only). **Verified**
- Traffic cars for cities: path following along lane splines is the usual recipe (**Practice**); CityGenerator ships a `CarGenerator`/`PersonGenerator` (static meshes; motion not verified). **Verified** (imports) / **Unverified** (motion).

### 5.5 Camera: cinematic path vs free walk
- `CatmullRomCurve3` in three.js: **centripetal** Catmull–Rom is the default (`curve.type` accepts centripetal (default), chordal, catmullrom; `tension` for catmullrom default 0.5), chosen to avoid cusps/self-intersections. [https://raw.githubusercontent.com/mrdoob/three.js/dev/src/extras/curves/CatmullRomCurve3.js] **Verified**. Justification: Yuksel, Schaefer, Keyser (2011, Computer-Aided Design 43(7):747–755) prove centripetal (α=½) is the only one in the family guaranteed to avoid cusps/self-intersections within a segment. [https://doi.org/10.1016/j.cad.2010.08.008] **Verified**
- Fly-over pattern: `t` advances with time, `camera.position = curve.getPointAt(t)`, `lookAt(curve.getPointAt(t+δ))`. **Practice** (not verified in a specific demo).
- Free walk: `FirstPersonControls` (used by `webgpu_generator_city.html`) or pointer-lock controls; also `misc_controls_fly.html`. **Verified** (existence). A first-person walk needs ground clamping/collision, which a path camera does not. **Inference**
- iq's Elevated even computed camera path and terrain collision in shaders because the displacement function was shared. [function2009.pdf] **Verified**

---

## 6. Post-processing and tone mapping ("impressive look")

- **Why**: HDR linear light must be mapped to display range. three.js constants: `NoToneMapping, Linear, Reinhard, Cineon, ACESFilmic, Custom, AgX, Neutral`. Default `NoToneMapping`. [https://raw.githubusercontent.com/mrdoob/three.js/dev/src/constants.js] [https://threejs.org/docs/pages/Renderer.html] **Verified**
- **ACES Filmic in three.js**: uses the Stephen Hill RRT/ODT polynomial fit (`RRTAndODTFit`) with ACES input/output matrices and a **subjective `1/0.6` exposure scale** "modified to accommodate a brighter viewing environment". [tonemapping_pars_fragment.glsl.js source] **Verified**. That is why official demos use tiny exposures (0.1 ocean, 0.13 city): scene lights are in physical-ish units. **Inference**
- **AgX**: three.js implementation "based on Filament, which in turn is based on Blender's"; encodes exposure range −12.47393 … +4.026069 EV (≈16.5 stops, with 0.18 middle gray). Blender 4.0 made AgX the default view transform ("bright colors go towards white, similar to real cameras"). [source above] [https://developer.blender.org/docs/release_notes/4.0/color_management/] [https://github.com/EaryChow/AgX] **Verified**. Original AgX by Troy Sobotka (https://github.com/sobotka/AgX). **Verified** (credit line in config).
- **Khronos PBR Neutral**: released 2024-05-16; designed for colour accuracy in product viewing (eCommerce/CAD); params F90=0.04, Ks=0.8−F90, Kd=0.15; analytically invertible; three.js `NeutralToneMapping` follows it. [https://github.com/KhronosGroup/ToneMapping/blob/main/PBR_Neutral/README.md] [https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products] **Verified**. Repo: Apache-2.0, 118 stars, last push 2026-10-06. **Verified**
- Practice guidance (Inference): ACES = punchy/filmic, desaturates/shifts bright hues; AgX = more natural highlight roll-off; Neutral = faithful product colours, little drama → bad for sunsets. **Inference** (consistent with the sources' stated design goals).
- **Bloom**: three.js `UnrealBloomPass` (WebGL) and TSL `BloomNode` (WebGPU; used at quarter-res scale in the city demo with params `(0.05, 0, 0)`). Jimenez (Activision) SIGGRAPH 2014 "Next Generation Post Processing in Call of Duty: Advanced Warfare": bloom via a **mip pyramid** — 13-tap downsample, 9-tap tent upsample; in PBR "you don't need to threshold"; blur layer mixed at a low value (~0.04). [https://www.iryoku.com/next-generation-post-processing-in-call-of-duty-advanced-warfare/] **Verified**. Whether three.js's bloom uses this exact filter: **Unverified** (UnrealBloomPass is a Gaussian-mip design from Unreal; not verified here).
- **SSAO**: Mittring, "Finding Next Gen — CryEngine 2", SIGGRAPH 2007 course; full-screen pass samples neighbours using the z-buffer, applies to **ambient only**, per-pixel randomised sample reflections. three.js ships `SSAOPass`, `SAOPass`, `GTAOPass`, TSL `SSAONode`/`GTAONode`/`SSGINode`. [https://advances.realtimerendering.com/s2007/Mittring-Finding_NextGen_CryEngine2(Siggraph07%20Course%20Notes).pdf] [GitHub listing 2026-10-17] **Verified**
- **Depth of field**: `BokehPass` (WebGL), `DepthOfFieldNode` (TSL), examples `webgl_postprocessing_dof*.html`, `webgpu_postprocessing_dof*.html`. **Verified** (existence)
- **Film grain / grading**: `FilmPass`, TSL `FilmNode`, `Lut3DNode`, `LensflareNode`, `MotionBlur`, `ChromaticAberrationNode`, `GodraysNode`, `SSSNode`, `TRAANode`/`SMAANode`/`FXAANode` (antialiasing) exist under `examples/jsm/tsl/display/`. [GitHub contents listing 2026-10-17] **Verified**
- Inference: WebGL `EffectComposer` passes and WebGPU TSL nodes are two parallel API generations in the same repo; an agent must match renderer type (e.g. `Sky` vs `SkyMesh`, `Water` vs `WaterMesh`) — the docs explicitly say "can only be used with WebGLRenderer / WebGPURenderer". **Verified** (docs) / **Inference** (agent pitfall)

---

## 7. Conflicts & gaps

**Conflicts / corrections**
1. **mrdoob "City" date**: task brief said 2012; evidence says **2013** (reddit 2013-06-30; Etienne post 2013-08-02). [reddit link above] — resolved to 2013.
2. **"Elevated" on ShaderToy vs the original**: original is a mesh/rasteriser hybrid in 4 KB; a ShaderToy port (MdX3Rr) exists. Do not describe the original as pure raymarching. (ShaderToy internals unread.)
3. **Sea of Thieves ocean**: often assumed Gerstner; Rare's paper says Tessendorf **FFT**. Resolved by primary source.
4. **three.js `Sky`**: Preetham (not Hosek-Wilkie); a web-search summary initially hedged this, source code/docs confirm Preetham.
5. **WFC licence**: GitHub API reports `NOASSERTION`; actual LICENSE text is MIT + a carve-out that sample images/tiles are not covered. Be precise: code MIT; samples not licensed by that file.
6. **Star counts for gasgiant/FFT-Ocean**: search-tool snapshot gave 796 earlier, `gh api` gave 808 later the same day; I report 808 (authoritative API read).
7. Book of Shaders' wording mixes "improved noise" and "simplex noise" in one passage; the quintic interpolant is from *improved noise* (Perlin 2002), not simplex noise per se. (Inference from the papers.)

**Gaps (not verified; do not state as fact in the tutorial)**
- Exact content of ShaderToy page bodies (JS-rendered): view counts, likes, creation dates, whether Elevated/Rainforest carry explicit licence headers. Check each shader's header before reuse.
- "[SH17C] Raymarching tutorial" and "famous city shaders" URLs — not found.
- iq article URLs for domain warping (`/articles/warp/`) and others not fetched.
- Whether `UnrealBloomPass`/`BloomNode` use Jimenez's filter; internals of `webgpu_ocean.html`, `webgpu_water.html`.
- Crest Water 5 licence/price; Unreal `WaterAdvanced` FFT ocean maturity (class name only).
- Real performance numbers (fps/ms) for any ocean/city on target hardware — none measured; only quoted claims (Acerola 150 fps/4.2M waves on his GPU; Etienne 20,000 cubes; SoT/NVIDIA cascade counts).
- Real-geodata cities, volumetric clouds (Sea of Thieves mentions its cloud system but details not read), caustics, rain/wetness, traffic AI details.
- Not checked: Schlick 1994 primary source, Karis 2013 area-light (cited inside SoT), Outerra grass blog, GPU Gems 2 chapter on SDF displacement (Donnelly 2005, cited in iq slides).

**Stats table (2026-10-17)**

| Repo | Stars | Licence | Last push |
|---|---|---|---|
| mrdoob/three.js | 116,534 | MIT | 2026-10-17 |
| mxgmn/WaveFunctionCollapse | 25,402 | MIT + sample carve-out (API: NOASSERTION) | 2026-10-15 |
| BabylonJS/Babylon.js | 26,175 | Apache-2.0 | 2026-10-16 |
| wave-harmonic/crest | 3,922 | MIT | 2026-06-18 |
| 2Retr0/GodotOceanWaves | 3,320 | MIT | 2025-04-29 |
| ebruneton/precomputed_atmospheric_scattering | 1,071 | BSD-3-Clause | 2025-10-05 |
| sebh/UnrealEngineSkyAtmosphere | 860 | MIT | 2022-09-11 |
| gasgiant/FFT-Ocean | 808 | MIT | 2022-07-07 |
| jbouny/ocean | 804 | MIT | 2017-10-18 |
| skeeto/pixelcity | 362 | none detected | 2021-01-14 |
| gasgiant/Ocean-URP | 252 | MIT | 2023-11-04 |
| jeromeetienne/threex.proceduralcity | 145 | MIT | 2014-01-25 |
| KhronosGroup/ToneMapping | 118 | Apache-2.0 | 2026-10-06 |
| squall01337/abyssal-ocean | 55 | MIT | 2026-08-18 |
| DanielAskerov/URP-Ocean-System | 17 | none detected | 2023-10-30 |

Sources for table: `curl https://api.github.com/repos/…` and `gh api repos/…`, read 2026-10-17. **Verified**
