# R5 — Where 3D assets come from: free libraries, licences, AI textures, file formats

Fact sheet for the "How AI coding agents make impressive 3D scenes" tutorial.
Research date: **2026-10-17** (all prices / counts / stars below are as seen on that date unless stated otherwise).
Not legal advice. Always re-read the licence of the *specific* asset you ship.

Tag legend: **Verified** = read on the primary page this session; **Practice** = widely used workflow / recommendation, not a primary-source claim;
**Inference** = my reasoning from verified facts; **Unverified** = secondary/search-snippet only, or not checked.
"Search-synth" = text came from a web-search result excerpt of the cited page, not a full page fetch (still tagged Verified where the excerpt quotes the page, but lower confidence is noted).

---

## 0. TL;DR for the tutorial

- The "impressive visuals" in AI-agent 3D demos mostly do NOT come from the LLM: they come from (a) CC0 photo-scanned HDRIs/PBR textures (Poly Haven, ambientCG), (b) CC0 low-poly packs (Kenney, Quaternius, KayKit), and (c) the renderer (PBR + environment lighting + tone mapping + shadows). [Inference, based on the facts below]
- At least two asset providers now publish agent-oriented docs (Poly Haven `llms.txt`; Poly Pizza API skill/MCP wrappers by third parties). [Verified, see §1]
- Safest legal path for a public demo: **CC0 only** (Poly Haven, ambientCG, Kenney, Quaternius, KayKit, Smithsonian CC0). [Practice]

---

## 1. Free / paid asset sources

### 1.1 Poly Haven (polyhaven.com)
- All assets (HDRIs, textures, 3D models) are CC0; commercial use OK, no attribution needed, redistribution allowed. [https://polyhaven.com/license] **Verified**
- Website ToS forbids "web scraping or data mining without express permission"; use the API instead. [https://polyhaven.com/license] **Verified**
- Site declares "no generative AI" in the library ("all CC0 and all made by people"). [https://polyhaven.com/llms.txt] **Verified**
- Public API `https://api.polyhaven.com` is free for any purpose incl. commercial, no key, no signup. [https://polyhaven.com/our-api ; https://github.com/Poly-Haven/Public-API/blob/master/ToS.md] **Verified**
- API terms: (2.4) every call needs a **unique User-Agent or Referer** naming your app; (2.5) if you surface live-API content inside your software/site/service you must show a lightweight credit (e.g. menu label naming Poly Haven or "Powered by Poly Haven"); this credit applies to the live API only, **not** to downloaded CC0 assets. [https://github.com/Poly-Haven/Public-API/blob/master/ToS.md] **Verified**
- API may return HTTP 429 (per-IP limit) with `Retry-After`; endpoints may change; API code is AGPL-3.0. [https://github.com/Poly-Haven/Public-API/blob/master/swagger.yml ; GitHub repo page] **Verified**
- Endpoints (from `llms.txt`): `/assets?type=hdris|textures|models|all`, `/search?q=`, `/info/{slug}`, `/files/{slug}`, `/taxonomy`, `/types`; OpenAPI at `/api-docs/swagger.json`; there is a "short guide for agents and LLM tools" at `polyhaven.com/llms.txt`. [https://polyhaven.com/llms.txt ; https://api.polyhaven.com/] **Verified**
- Live calls on 2026-10-17 (with a custom User-Agent): `/assets?t=hdris` → 997 entries; `textures` → 869; `models` → 521. [https://api.polyhaven.com/assets?t=hdris etc., my own curl] **Verified** (counts change daily)
- `/files/{slug}` returned, for a texture (`brown_planks_03`): keys `Diffuse, nor_dx, nor_gl, blend, gltf, Bump, arm, AO, Displacement, Rough, spec, mtlx`; for an HDRI (`kloofendal_48d_partly_cloudy_puresky`): `hdri` at 1k/2k/4k/8k/16k each in `hdr` and `exr`, plus `tonemapped`; for a model (`WoodenTable_01`): `gltf, usd, fbx, blend, arm, Diffuse, nor_gl, Rough…` at 1k/2k/4k. [https://api.polyhaven.com/files/<slug>, my own curl] **Verified**
- Older API terms may have had a commercial restriction; the current page says "now free for everyone — including commercial use". I did not verify the older wording. [https://polyhaven.com/our-api] **Unverified (history)**
- Practice for agents: `arm` = AO/Roughness/Metal packed texture, `nor_gl` = OpenGL normal map (what three.js expects, +Y up). [Practice; consistent with Khronos guideline "OpenGL convention normal maps for glTF" https://www.khronos.org/assets/uploads/apis/3DCommerce-Realtime-sset-Creation-Guidelines_Jul20.pdf]

### 1.2 ambientCG (ambientcg.com)
- All assets (files and preview renders) are CC0 1.0; credit not required; suggested credit text provided. [https://docs.ambientcg.com/license/] **Verified**
- API v2: `https://ambientcg.com/api/v2/full_json` (search + download links); params `q, type (3DModel, Atlas, Brush, Decal, HDRI, Material, PlainTexture, Substance, Terrain), method, sort, id, date, limit (1–250), offset, include (downloadData, mapData, usdData …)`. [https://docs.ambientcg.com/api/v2/full_json/] **Verified**
- API docs warn that the site is run by **one person** and API "is potentially not as reliable or stable as needed for an enterprise-level application". [https://docs.ambientcg.com/api/] **Verified**
- Live call `GET /api/v2/full_json?limit=1` on 2026-10-17: `numberOfResults = 2908` (all types). No key needed for that call. [my own curl] **Verified**
- I did not find an explicit User-Agent / rate-limit / attribution rule for the API in the pages read. [https://docs.ambientcg.com/api/] **Unverified (no rule found ≠ no rule)**

### 1.3 Kenney (kenney.nl)
- All game assets are public domain CC0, commercial OK, attribution not required (credit "Kenney" optional; do not use the logo). [https://kenney.nl/support] **Verified**
- City Kit series exists: Roads, Industrial, Commercial (v2.1: "Completely remade" in 2.0; 1.0 released 2021), Suburban (v2.0). [https://kenney.nl/assets/city-kit-commercial ; https://kenney.nl/assets/series:City] **Verified**
- City Kit (Suburban): CC0; ~35–40 low-poly models (itch page says "over 35", OGA says 40); formats OBJ, FBX, DAE, STL, glTF (distributed as GLB). [https://kenney-assets.itch.io/city-kit-suburban ; https://opengameart.org/content/city-kit-suburban] **Verified** (count differs between pages)
- Kenney's own advice: avoid OBJ; FBX and GLB have equal features, GLB is smaller; glTF is distributed as GLB. [https://kenney.nl/knowledge-base/game-assets-3d/importing-3d-models-into-game-engines] **Verified**
- Exact formats/count for City Kit (Commercial) not captured (page content truncated). [https://kenney.nl/assets/city-kit-commercial] **Unverified**
- No official Kenney download API found. [—] **Unverified**

### 1.4 Quaternius (quaternius.com)
- Creator states everything is released under CC0, usable commercially without credit; "70 packs and 2500+ models" (undated Patreon text). [https://www.patreon.com/quaternius/about] **Verified** (count undated)
- Example: Ultimate RPG Pack — 106 models, FBX/OBJ/Blend, CC0 (Aug 2019). [https://quaternius.com/packs/ultimaterpg.html] **Verified**; Ultimate Platformer Pack on itch: CC0, "No generative AI was used". [https://quaternius.itch.io/ultimate-platformer-pack] **Verified**
- Per-pack formats vary; older packs lacked glTF (my read of one pack only). Check each pack. [https://quaternius.com/packs/ultimaterpg.html] **Unverified (generalisation)**
- No official API found; distribution via website / Google Drive / itch. [https://www.patreon.com/quaternius/posts/ultimate-rpg-29434139] **Verified (for that pack)**

### 1.5 KayKit (Kay Lousberg)
- City Builder Bits: 32+ low-poly models, single 1024×1024 gradient-atlas texture, CC0, OBJ/FBX/GLTF; paid "EXTRA" ($3.95+) and "SOURCE" ($5.95+, .blend) tiers. [https://kaylousberg.itch.io/city-builder-bits ; https://www.kaylousberg.com/game-assets/city-builder-bits] **Verified**
- Adventurers character pack: 5 free rigged+animated characters (+3 in $7.95 EXTRA tier), FBX/GLTF, CC0. [https://kaylousberg.itch.io/kaykit-adventurers ; https://kaylousberg.com/game-assets/characters-adventurers] **Verified**
- Author asks: do not resell unmodified copies or claim as your own (a request layered on CC0, not a licence term). [https://kaylousberg.itch.io/city-builder-bits] **Verified**
- Both itch pages state "No generative AI was used". [same] **Verified**

### 1.6 Sketchfab
- **Ownership changed**: Sketchfab and ArtStation became part of **KitBash** (announced 2026-08-10); an Epic SVP is quoted in the release. "Owned by Epic" is therefore outdated as of 2026-10-17. [https://sketchfab.com/blogs/community/kitbash-acquires-sketchfab-and-artstation/] **Verified** (Epic acquired Sketchfab in 2021 — from my background knowledge, not re-verified: **Unverified**)
- Same post: "You can continue to share and download models on Sketchfab like you have before"; no pricing/plan changes. [same] **Verified**
- Store closure: the Sketchfab Store closed when Fab launched (Oct 2024); paid products are view-only unless migrated to Fab; free/view-only content stayed. [https://sketchfab.com/blogs/community/sketchfab-update-what-you-need-to-know-now-that-fabs-live/ ; https://sketchfab.com/blogs/community/fab-publishing-portal-open-for-sketchfab-migration/] **Verified** (closure month: search-synth)
- Epic's 2024–25 plan was to eventually remove licensing from Sketchfab so everything becomes "view-only"; no end date announced; post-KitBash notice says downloads continue. No evidence found of that removal having happened. [https://forums.unrealengine.com/t/what-will-happen-to-free-downloadable-sketchfab-assets/2039791 ; KitBash post above] **Verified (plan) / Unverified (current internal roadmap)**
- Migration to Fab: only CC BY (→ Fab "Creative Commons") and paid types map; **CC0, CC BY-SA, CC BY-NC, CC BY-ND did not migrate**. [https://dev.epicgames.com/documentation/en-us/fab/migrating-assets-to-fab] **Verified**
- Download API still documented: requires an authenticated Sketchfab user (OAuth); `GET /v3/models/{UID}/download` returns a short-lived URL to a zip with glTF/GLB/USDZ (no FBX/OBJ). [https://sketchfab.com/developers/download-api ; https://sketchfab.com/developers/download-api/downloading-models/javascript] **Verified**
- Download API guidelines: apps must display licence + author attribution, credit Sketchfab, and attribution must follow the asset everywhere it is used. [https://sketchfab.com/developers/download-api/guidelines] **Verified**
- Licences on free downloads: CC0, CC BY (always the base), CC BY-NC, CC BY-ND, CC BY-SA. Download popup supplies copy-paste attribution text. [https://sketchfab.com/blogs/community/refine-downloadable-model-searches-with-new-license-filters/ ; https://sketchfab.com/blogs/community/an-introduction-to-creative-commons-licenses/] **Verified**
- Sketchfab Standard licence terms include an "Editorial" class (no commercial/promotional use; only to comment on or criticise subject; cannot be altered beyond technical crop). Applies to paid-licence "Licensed Material" tagged Editorial. [https://sketchfab.com/licenses] **Verified** (page read via file; applies to store-era licences)
- Practical gotcha for agents: a public download needs a user token, so a headless "agent fetches Sketchfab models" flow needs the human's `SKETCHFAB_API_TOKEN` (third-party MCP confirms this pattern). [https://github.com/jonit-dev/threenative-asset-mcp ; Sketchfab docs above] **Verified (docs) / Inference (agent flow)**

### 1.7 Fab (fab.com, Epic)
- Licence types: **CC-BY (free)** and **Standard (free or paid)**; Standard has Personal vs Professional tiers split at **$100,000 USD gross revenue in last 12 months**. [https://dev.epicgames.com/documentation/en-us/fab/licenses-and-pricing-in-fab] **Verified**
- Fab Standard Licence: commercial/private use, modify, ship in your Projects, **use with any compatible tool (not limited to Unreal Engine)**, share with collaborators on the project; **may not resell or redistribute the asset standalone** (even free); no credit required. [https://www.fab.com/eula] **Verified**
- Inference: pushing Standard-licence asset files into a **public** git repo/demo-source ZIP may count as standalone redistribution; ship only inside the built project, or prefer CC0. [Inference from https://www.fab.com/eula wording]
- Fab "NoAI" tag: asset must not be used for generative-AI data collection; only allowed with Standard licence. [https://dev.epicgames.com/documentation/en-us/fab/licenses-and-pricing-in-fab] **Verified**
- Megascans: free Megascans on Fab ended 2024-12-31; from 2025-01-01 Epic offers "a selection of 1500+" free Megascans under the Fab Standard Licence; legacy Quixel/Bridge library not free to newly claim after 2024-12-31 (previously claimed assets remain, under the *Epic Content License*). [https://forums.unrealengine.com/t/reminder-free-megascans-ends-soon/2203090] **Verified**
- Non-Unreal use of *Fab-acquired* Megascans: allowed (Fab Standard is tool-agnostic). Whether the legacy Epic Content License restricts non-Unreal use was not read. [https://www.fab.com/eula ; forum post above] **Verified (Fab) / Unverified (legacy licence scope)**
- No official, documented public Fab download API found; third-party tools use undocumented launcher endpoints. Sketchfab had said (2024) it planned a public Fab download API in 2025. [https://dev.epicgames.com/documentation/en-us/fab/purchasing-and-downloading-assets-in-fab ; https://docs.rs/egs-api/latest/src/egs_api/api/fab.rs.html ; https://sketchfab.com/blogs/community/sketchfab-update-what-you-need-to-know-now-that-fabs-live/] **Verified (absence in docs read) / Unverified (whether it quietly launched)**

### 1.8 Smithsonian 3D (3d.si.edu)
- "Open Access" objects tagged **CC0** can be downloaded, transformed, shared for any purpose; some items carry "usage conditions apply". [https://3d.si.edu/collections/openaccesshighlights ; https://3d.si.edu/explore?page=1] **Verified**
- Explore page snapshot (cache date unknown): 3,994 results, 3,581 CC0, 413 "usage conditions apply". [https://3d.si.edu/explore?page=1] **Verified (undated snapshot)**
- 3D API v1.0 ("should be considered alpha"): `https://3d-api.si.edu/api/v1.0/content/file/search?model_type=gltf&file_type=glb` returns direct GLB URIs, some `draco_compressed`. [https://3d-api.si.edu/api-docs/] **Verified**
- Separate Smithsonian Open Access API (metadata, 3D too) needs an api.data.gov key. [https://raw.githubusercontent.com/api-evangelist/smithsonian/refs/heads/main/openapi/smithsonian-content-api-openapi.yml] **Verified (third-party OpenAPI description)**

### 1.9 NASA 3D Resources
- Models/textures "free to download and use … without copyright"; hub mirrored on GitHub (`nasa/NASA-3D-Resources`). ISS model offered as .glb/.usdz. [https://www.nasa.gov/3d-resources/ ; http://nasa3d.arc.nasa.gov/detail/icesat] **Verified**
- NASA Media Guidelines: 3D model content (polygon data, textures) "generally not subject to copyright in the US"; **acknowledge NASA as source**; NASA insignia/logotype/identifiers are NOT public domain; no implied endorsement. [https://www.nasa.gov/nasa-brand-center/images-and-media/] **Verified**
- NASA repo maintainers answered the licence question as "no need to [state one]" but a commenter flagged apparent tension with guidelines. [https://github.com/nasa/NASA-3D-Resources/issues/17] **Verified**
- Third-party content on NASA sites can be copyright-protected and is marked. [https://www.nasa.gov/nasa-brand-center/images-and-media/] **Verified**

### 1.10 Khronos glTF-Sample-Assets
- Curated models showing glTF features; **licence differs per model** (see each model's README); repo text © Khronos CC-BY 4.0; showcase example is CC BY 4.0 (Wayfair). Assets without suitable licences were removed. [https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/README.md] **Verified**
- Repo: 1,114 GitHub stars, last push 2026-10-02 (GitHub API, 2026-10-17). [`gh api repos/KhronosGroup/glTF-Sample-Assets`] **Verified**
- README also points to Kenney, Poly Haven, Sketchfab, Smithsonian as sources. [same README] **Verified**

### 1.11 three.js examples models (what many agent demos load)
- Directory `examples/models/gltf` has `Soldier.glb, Michelle.glb, Flamingo.glb, Parrot.glb, Stork.glb, Horse.glb, LittlestTokyo.glb, RobotExpressive/, DamagedHelmet/, Xbot.blend` etc. No single per-folder licence file listed. [https://github.com/mrdoob/three.js/tree/master/examples/models/gltf] **Verified**
- DamagedHelmet README: by theblueturtle_, **Creative Commons Attribution-NonCommercial** (Sketchfab origin). [https://github.com/mrdoob/three.js/tree/master/examples/models/gltf/DamagedHelmet] **Verified**
- Soldier/Michelle/Xbot are Mixamo characters per a third-party licence audit (not three.js docs). Mixamo bars standalone redistribution of raw files. [https://github.com/pyhuanglaw/Lawstudent/blob/main/LICENSES.md ; Mixamo FAQ §1.12] **Unverified (secondary source)**
- Inference: three.js being MIT does **not** relicense these bundled models; copy-pasting `Soldier.glb` or `DamagedHelmet.glb` into a commercial product is risky. [Inference]
- three.js manual says "Public-domain glTF files are available on sites like Sketchfab" — loose wording; most Sketchfab downloads are CC BY(-xx), not public domain. [https://threejs.org/manual/pages/loading-3d-models.html ; §1.6] **Verified (wording) / Inference (it is misleading)**

### 1.12 Mixamo (Adobe)
- Free with Adobe ID; characters and animations royalty-free for personal, commercial, non-profit projects (games, films, illustration, 3D print). Humanoid biped only. [https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html] **Verified** (FAQ page "Last updated Sep 14, 2021")
- Cannot distribute raw character/animation files standalone (asset packs, stores, DLC); team sharing OK; credit not required. [https://community.adobe.com/questions-696/mixamo-faq-licensing-royalties-ownership-eula-and-tos-589400] **Verified** (search-synth)
- **AI/ML restriction**: Mixamo Additional Terms (effective 2021-06-23) forbid using the service or its content/output to create, train, test or improve ML/AI systems. [https://wwwimages2.adobe.com/content/dam/cc/en/legal/servicetou/Mixamo-Addl-Terms-en_US-20210623.pdf] **Verified**
- Inference: using Mixamo clips as part of a normal game/demo is fine; feeding them into model training is not. A commercial multi-agent pipeline that *trains* on Mixamo would breach terms. [Inference]
- No public API; login required. [—] **Unverified (not checked, widely known)**

### 1.13 Textures.com (paid)
- Content usable personally/commercially incl. games (free/paid; PC, console, mobile) without attribution; modification allowed. [https://www.textures.com/faq-license ; https://www.textures.com/about/terms-of-use] **Verified**
- **Redistribution not allowed**; cannot release under open-source licences (even if modified); Regular Photos may be bundled in sold/distributed 3D models with required notice; "Special Content" (PBR materials, HDR skydomes, 3D scans, .sbsar …) cannot be bundled. [same] **Verified**
- Licence tiers by revenue/funding: Indie < $150k, Studio $150k–$10M, Corporate > $10M; credits don't roll over for Indie. [https://www.textures.com/faq-premium-access] **Verified**
- Free tier status unclear: one blog says 15 free daily credits ended in 2024; the licence FAQ still mentions a "Free account" and "Free Samples". Prices not captured. [https://little-movie.com/texture-com/ ; https://www.textures.com/faq-license] **Unverified (conflict)**
- Inference: incompatible with a public open-source demo repo that includes the texture files. [Inference]

### 1.14 BlenderKit → "Blendkit" (blendkit.com)
- Only two licences: **Royalty Free** (commercial use, no credit, cannot re-sell the asset itself even if modified) and **CC0**. [https://www.blendkit.com/docs/licenses/] **Verified**
- Plans 2026-10-17: Free $0 (23,703 models, 42,455 materials, 5,094 HDRIs …), Full $9.90/mo (82,718 models, 15,185 HDRIs…), Business $29/mo. [https://www.blendkit.com/plans/pricing/] **Verified**
- Licence is concluded per download with the creator, not with Blendkit. [https://www.blendkit.com/terms-and-conditions-2026/] **Verified**
- Primarily a Blender add-on; not an agent-friendly HTTP API in the docs read. [—] **Unverified**

### 1.15 OpenGameArt (opengameart.org)
- Licences accepted include CC0, CC-BY 3.0/4.0, CC-BY-SA, GPL; per-asset; suggested credit format `"[asset name]" by [author] licensed [license]: [url]`; CC-BY works can't be used on DRM platforms. [https://opengameart.org/content/faq] **Verified**
- Mixed quality; licence is the *uploader's* claim. [Practice]

### 1.16 Poly Pizza (poly.pizza) and Google Poly
- Poly Pizza: "10,700+ free models"; CC0 and CC-BY (one third-party MCP wrapper lists more licence enums); attribution format for CC-BY: `"Title" by Username (profile URL) CC-BY 4.0`. [https://poly.pizza/ ; https://github.com/jasonkneen/tiny-world-builder/blob/main/.agents/skills/poly-pizza-api/SKILL.md ; https://github.com/MatthewHallCom/Poly-Pizza-MCP] **Verified** (counts/attribution via third-party skill)
- API: `https://api.poly.pizza/v1/search/{query}` with `X-Auth-Token` (free key at poly.pizza/settings/api); press page says free for hobby use and pay-as-you-go for commercial (older text). [same + https://poly.pizza/docs/press] **Verified** (press text is dated)
- Google Poly: read-only 2021-04-30, shut down 2021-06-30; Poly Pizza launched June 2021 as a replacement; CC-BY archives exist (polygone.art, Icosa). [https://wiki.archiveteam.org/index.php/Google_Poly ; https://poly.pizza/docs/press ; https://github.com/arodic/polygone.art] **Verified**

### 1.17 Summary table

| Source | Asset types | Licence | API? | Attribution needed | Notes |
|---|---|---|---|---|---|
| Poly Haven | HDRI, PBR textures, models | CC0 | Yes, free, no key; UA required | Assets: no. Live API UI: lightweight "Powered by Poly Haven" | ~997 HDRI / 869 tex / 521 models (2026-10-17); no gen-AI; best fit for agents (`llms.txt`) |
| ambientCG | PBR materials, HDRI, decals, some 3D, Substance | CC0 | Yes (`api/v2/full_json`), no key seen | No (credit text suggested) | 2,908 results; API by a single maintainer — expect instability |
| Kenney | Low-poly 3D/2D/audio packs (City Kit etc.) | CC0 | No official API found | No (credit "Kenney" optional) | GLB recommended by Kenney; logo not usable |
| Quaternius | Low-poly 3D packs, characters, nature, vehicles | CC0 | No | No | Formats vary per pack (FBX/OBJ/Blend; some glTF) |
| KayKit | Low-poly buildings, characters | CC0 | No | No | Please don't resell unmodified copies; free tier + $ extras |
| Sketchfab | User-uploaded models | CC0/CC BY/-NC/-ND/-SA per model (+ paid/ editorial legacy) | Yes (OAuth user token) | CC BY family: **yes**, author + link + licence | Now owned by KitBash (2026-08-10); store closed 2024; free downloads still working per KitBash post |
| Fab | Models, textures, UE content, Megascans | Fab Standard (any tool) or CC-BY | No official public API found | Standard: no; CC-BY: yes | Don't redistribute assets standalone; ~1500 free Megascans |
| Smithsonian 3D | Museum scans | CC0 (most); some "usage conditions" | Yes (3d-api.si.edu, alpha) | No (but credit courteous) | Heavy meshes; check per-item tag |
| NASA 3D Resources | Spacecraft, planets, textures | Generally no US copyright | No | Acknowledge NASA; no logos | Insignia & implied endorsement restricted |
| Khronos glTF-Sample-Assets | Test/showcase glTF | Varies per model (many CC BY 4.0) | GitHub raw | Per model | Great for testing, check each README |
| three.js example models | Demo models | Mixed; DamagedHelmet = CC BY-NC | GitHub raw | Per model | Do not assume MIT |
| Mixamo | Humanoid rigs + animations | Adobe ToS: royalty-free use, no standalone redistribution, **no AI/ML training** | No public API | No | Adobe ID needed |
| Textures.com | Photos, PBR, scans | Proprietary, paid credits | No | No (games) | No redistribution / no open-source release of the files |
| Blendkit (BlenderKit) | Models, materials, HDRI, scenes | Royalty Free or CC0 per asset | Blender add-on | No | Free plan subset; Full $9.90/mo |
| OpenGameArt | 2D/3D/audio | CC0, CC-BY, CC-BY-SA, GPL… per asset | No | Per licence | Credit format given in FAQ |
| Poly Pizza | Low-poly models | CC0 + CC-BY | Yes (key, X-Auth-Token) | CC-BY: yes | Google Poly successor |
| Google Poly | (shut down 2021-06-30) | CC-BY / CC0 historically | Gone | CC-BY: yes | Archives only |

---

## 2. File formats and tooling for the web

- **glTF 2.0** is Khronos' royalty-free runtime delivery format and **ISO/IEC 12113:2022**; `.gltf` = JSON + external buffers/images, `.glb` = single binary container (media types `model/gltf+json`, `model/gltf-binary`). [https://www.khronos.org/gltf/ ; https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html ; https://www.iso.org/standard/83990.html] **Verified**
- three.js manual recommends glTF/GLB as the primary format ("compact to transmit and fast to load"). [https://threejs.org/manual/pages/loading-3d-models.html] **Verified**
- three.js `GLTFLoader` supports (among others) `KHR_draco_mesh_compression`, `KHR_meshopt_compression`/`EXT_meshopt_compression`, `KHR_texture_basisu`, `KHR_materials_clearcoat/transmission/volume/iridescence/anisotropy/dispersion`, `KHR_lights_punctual`, `EXT_mesh_gpu_instancing`, `EXT_texture_webp/avif`. [https://threejs.org/docs/pages/GLTFLoader.html] **Verified**
- Decoders are opt-in: `setDRACOLoader(...)` for Draco, `setKTX2Loader(...)` (call `detectSupport(renderer)` first) for KTX2/Basis, `setMeshoptDecoder(...)` for meshopt. [https://threejs.org/docs/pages/GLTFLoader.html ; https://threejs.org/docs/pages/KTX2Loader.html] **Verified**
- **Draco** (geometry compression): google/draco, Apache-2.0, 7,515 ★ (2026-10-17, GitHub API). **Verified** [`gh api repos/google/draco`]
- **meshoptimizer** (meshopt compression, simplification): zeux/meshoptimizer, MIT, 8,581 ★. It ships **gltfpack** (CLI that optimises glTF; pre-built binaries or npm package; native binaries recommended for texture compression). [https://raw.githubusercontent.com/zeux/meshoptimizer/master/README.md ; `gh api`] **Verified**
- **glTF-Transform**: donmccurdy/glTF-Transform, MIT, 1,988 ★, last push 2026-10-16; JS/TS SDK + CLI (`gltf-transform optimize in.glb out.glb --texture-compress webp`, `draco`, `meshopt`, `resize`, `webp`, `uastc`, `etc1s`); README says it can also "build a model procedurally". [https://raw.githubusercontent.com/donmccurdy/glTF-Transform/main/README.md ; `gh api`] **Verified**
- **KTX 2.0 / Basis Universal**: KHR KTX-Software repo 1,387 ★ (licence reported as NOASSERTION by GitHub — mixed licences; not read). three.js KTX2Loader transcodes Basis to the GPU format the device supports; needs WASM transcoder files. [`gh api repos/KhronosGroup/KTX-Software` ; https://threejs.org/docs/pages/KTX2Loader.html] **Verified (stars/loader) / Unverified (exact licence)**
- Rationale for KTX2 over PNG/JPG: GPU-compressed textures reduce VRAM; JPG/PNG are decoded to full RGBA in VRAM. [Practice; consistent with glTF-Transform README "improve VRAM usage and performance with KTX2"]
- **HDR/EXR environment maps**: Poly Haven serves HDRIs as `.hdr` and `.exr` 1k–16k (see §1.1); in three.js use `RGBELoader`/`HDRLoader` or `EXRLoader` then `PMREMGenerator`. [Poly Haven API call above] **Verified (sources) / Practice (loader names changed across three.js versions — check docs)**
- **FBX/OBJ**: not delivery formats for web; Kenney says avoid OBJ and prefer GLB; convert with Blender (glTF exporter), FBX2glTF, or `gltf-transform` after import. [https://kenney.nl/knowledge-base/game-assets-3d/importing-3d-models-into-game-engines] **Verified (Kenney advice) / Practice (converter names)**
- **USD / USDZ**: Pixar-originated; USDZ is Apple's AR Quick Look container (WWDC 2018); OpenUSD now under Alliance for OpenUSD; Poly Haven and NASA/Sketchfab expose USD/USDZ too. glTF ↔ USDZ conversion can lose features. [https://poly.cam/blog/obj-vs-fbx-vs-glb-which-3d-scan-format-should-you-export ; https://www.khronos.org/assets/uploads/apis/3DCommerce-Realtime-sset-Creation-Guidelines_Jul20.pdf] **Verified** (Polycam blog is secondary)
- Conventions from Khronos guidelines (glTF and USDZ): right-handed, +Y up, front +Z, 1 unit = 1 m, sRGB for base colour/emissive, linear for others, OpenGL-convention normals. [https://www.khronos.org/assets/uploads/apis/3DCommerce-Realtime-sset-Creation-Guidelines_Jul20.pdf] **Verified** — useful for "why the agent's imported model is 100× too big/dark".

---

## 3. AI-generated textures / materials / skyboxes

### 3.1 Cloud tools
- **Adobe Substance 3D Sampler — Text-to-Texture**: Firefly-powered, introduced as **beta in Sampler 4.4** (also Text-to-Pattern, Image-to-Texture); not available in the Steam edition (needs Adobe account). [https://helpx.adobe.com/substance-3d-sampler/release-notes/version-4-4---substance-3d-sampler.html ; https://blog.adobe.com/en/publish/2024/03/18/adobe-announces-firefly-powered-features-substance-3d-apps] **Verified**
- Adobe says Firefly outputs can be used commercially (beta features too unless the product says otherwise); Firefly trained on Adobe Stock, openly licensed and public-domain content. Output indemnification only for eligible Creative Cloud Teams/Enterprise plans. Submitting Output to Adobe-hosted galleries grants Adobe a broad licence. [https://helpx.adobe.com/firefly/get-set-up/learn-the-basics/adobe-firefly-faq.html ; https://www.adobe.com/cc-shared/assets/pdf/legal/servicetou/adobe-generative-ai-product-specific-terms-en-us-20260423.pdf] **Verified** (search-synth for terms PDF)
- Sampler price/plan not captured. [—] **Unverified**
- **Polycam AI Texture Generator**: text → up to 4 seamless tileable textures; downloads need a paid plan (Basic $30/mo or $150/yr; Business $400/user/yr; Enterprise $1,200/user/yr, 3-seat min; Free = preview only; "Pro" retired → Legacy Pro). Generator available on web only. [https://poly.cam/pricing ; https://aitoolcompass.net/tools/3d-textures-by-polycam ; https://learn.poly.cam/hc/en-us/articles/27426153753364-Using-Polycam-s-2D-Texture-Generator] **Verified** (prices from pricing page + secondary summary)
- Polycam licence: ToS says commercial use of generated content is allowed, with attribution to Polycam for public displays (search-synth); a secondary site claims "no attribution required". Polycam ToS also grants Polycam a broad licence to Your Content unless private. [https://poly.cam/legal/terms-of-service ; https://aitoolcompass.net/tools/3d-textures-by-polycam] **Unverified (conflict)**
- **Meshy** (text/image→3D + Text-to-Texture/retexture): Free $0 with 100 credits/month; Pro $20, Premium $40, Ultra $100 per month; 2K texture = 10 credits (free plan), 4K = 10 credits and 8K = 15 credits (paid only); full Meshy 6 generation = 30 credits. [https://help.meshy.ai/en/articles/12062933-which-meshy-plan-is-right-for-you-free-vs-pro-vs-premium-vs-ultra ; https://www.meshy.ai/tutorials/meshy-credits-guide ; https://www.meshy.ai/tutorials/pbr-texturing-with-meshy] **Verified**
- Meshy licence: Free-plan outputs are **CC BY 4.0** (commercial use OK, **must credit Meshy**); paid plans: you own outputs, no attribution; anything published to Meshy's community page is CC0. [https://help.meshy.ai/en/articles/15696428-what-is-included-on-the-free-plan ; https://www.meshy.ai/pricing] **Verified**
- Conflict: one help page says free subscribers cannot download generated models unless generated on a paid plan; the free-plan article says free plan has CC BY licence and "downloads (allowances vary)". Which applies today is unclear. [https://help.meshy.ai/en/articles/12062933-… vs …/15696428-…] **Unverified (conflict)**
- Meshy upload formats for texturing: fbx, obj, stl, gltf, glb (100 MB web limit); downloads include fbx, obj, usdz, glb, stl, blend. [https://www.meshy.ai/pricing] **Verified**
- **Blockade Labs Skybox AI** (360° skyboxes): API `POST https://backend.blockadelabs.com/api/v1/skybox` with `skybox_style_id` + prompt; key in `x-api-key` header (don't expose in frontend). Model 3 = 1 credit; Model 4 Standard = 3, Enhanced = 6 credits; Model 4 requires Standard or Business plan. [https://api-documentation.blockadelabs.com/ ; https://api-documentation.blockadelabs.com/api/skybox.html] **Verified**
- Blockade plans page (2026-10-17) lists: Essential $20 (100 credits, 4K), Standard $48 (300 credits, 8K, latest model, batch, **API key access**), top tier $112 (500 credits, 16K, **HDRI exports**, prepaid wallet, IP protection, **Commercial licensing**, 2 concurrent). The page also shows a second set ($24 Essential / $140 top tier) — probably monthly vs annual toggle, not confirmed. [https://skybox.blockadelabs.com/plans] **Verified (page) / Unverified (which set is monthly)**
- Blockade licence claims: marketing says "Full commercial licensing with clear IP ownership"; blog says paid plans add commercial licensing; plans page only lists "Commercial licensing" at the top tier. Free tier: preview/limited (export unclear). [https://www.blockadelabs.com/ ; https://www.blockadelabs.com/post/how-to-make-a-skybox-with-ai-complete-guide-2026 ; plans page] **Unverified (conflict on which tier carries a commercial licence)**
- Blockade says it has an MCP integration and Blender/Unreal/Unity plugins. [https://www.blockadelabs.com/] **Verified (claim on vendor page)**
- Poly Haven explicitly has **no** AI-generated textures (policy statement in `llms.txt`). [https://polyhaven.com/llms.txt] **Verified**

### 3.2 Open research models for PBR materials
- **MatFuse** (CVPR 2024): diffusion model producing tileable SVBRDF maps (diffuse, normal, roughness, specular) from text, image, sketch, palette; code + weights under **MIT**; inference needs ≥ 12 GB VRAM; `matfuse-full.ckpt` is 4.64 GB. [https://github.com/giuvecchio/matfuse ; https://huggingface.co/gvecchio/MatFuse] **Verified**
- **Material Palette**: extracts albedo/normal/roughness from one real photo; MIT; trained with ambientCG + a synthetic "TexSD" dataset and builds on Stable-Diffusion v1.5-class weights. [https://github.com/astra-vision/materialpalette] **Verified** (SD base-weights licence implications: **Unverified**)
- **ControlMat**: not researched in this pass. [—] **Unverified**
- Training-data provenance of MatFuse weights vs output copyright not examined. [—] **Unverified**
- Inference: the realistic agent workflow for materials in 2026 is "download CC0 PBR maps from Poly Haven/ambientCG", with AI-generated textures as a niche option needing a GPU or paid API.

### 3.3 Legal caveats for AI output
- Outputs from vendor tools are governed by *vendor* terms (see above), not by CC0. [Inference from the above terms]
- Whether AI-generated textures are copyrightable at all differs by jurisdiction and is not covered here. [—] **Unverified (out of scope)**
- Asset marketplaces increasingly flag "no generative AI" (Poly Haven, itch pages by Kenney/Quaternius/KayKit) and "NoAI" (Fab). [sources above] **Verified**

---

## 4. What a language model can produce without external tools (no downloads)

All items in this section: **Inference/Practice** (no primary source needed; these are properties of text generation).

- **Code**: three.js/Babylon/WebGPU scene setup, camera, lights, animation loops, controls, post-processing. LLMs are strong here. [Practice]
- **Procedural geometry**: parametric meshes (extrusions, lathes, instanced boxes for buildings/trees, terrain via noise, L-systems). Emitted as code or JSON arrays of numbers, not as authored meshes. [Practice]
- **Shaders (GLSL/WGSL/TSL)**: procedural materials, sky gradients, water, toon/outline, fog, noise-based terrain colouring. Quality depends on iteration with screenshots. [Practice]
- **Textures via code**: Canvas 2D / `OffscreenCanvas` / DataTexture noise, gradients, tiled patterns, normal maps generated from height fields; can write PNG via Node canvas. Simple style (low-poly, flat colour, stylised) works; photoreal PBR scans do not. [Practice]
- **SVG**: icons, decals, UI, simple diagram textures. [Practice]
- **JSON scene descriptions**: positions, colours, light rigs, `glTF` JSON (`.gltf` with embedded base64) for tiny meshes; `glTF-Transform` can create glTF programmatically from JS. [Practice; glTF-Transform README: "build a model procedurally" https://raw.githubusercontent.com/donmccurdy/glTF-Transform/main/README.md]
- **What an LLM cannot reasonably produce**: high-quality binary meshes (organic characters, detailed props), UV-unwrapped hand-painted textures, photoscans, rigs/animation clips, HDRI photographs. Hand-writing vertex lists works only for primitives or very small shapes. [Inference]
- **Consequence for the tutorial**: "impressive" scenes by agents = LLM code + downloaded CC0 assets + good lighting/post-processing; "assets from nothing" scenes look stylised/low-poly or abstract. [Inference]
- **Agent ecosystem evidence** (third-party, not endorsements): MCP/skill wrappers exist for Poly Pizza (two repos), and a "threenative-asset-mcp" covering Fab, Poly Haven, ambientCG, Smithsonian, Sketchfab, Kenney, Blendkit; it warns Fab `/i/*` routes are undocumented and licence must be checked per asset. [https://github.com/MatthewHallCom/Poly-Pizza-MCP ; https://github.com/dcc-mcp/dcc-asset-poly-pizza ; https://github.com/jonit-dev/threenative-asset-mcp] **Verified (repos exist and describe this)**
- Practice: an agent that downloads assets should record licence, author, URL, and file hash per asset (the dcc-mcp Poly Pizza skill does this via `.receipt.json`). [https://github.com/dcc-mcp/dcc-asset-poly-pizza/tree/main] **Verified (tool behaviour) / Practice (recommendation)**

---

## 5. Practical licence guidance

### 5.1 Licence cheat-sheet (CC definitions from Creative Commons)
- **CC0**: no rights reserved; use, modify, redistribute, even commercially, no credit required. [https://polyhaven.com/license quoting CC0 FAQ ; https://docs.ambientcg.com/license/] **Verified**
- **CC BY**: reuse incl. commercial, **credit required**. [https://creativecommons.org/cc-licenses/] **Verified**
- **CC BY-SA**: as BY, and adaptations must be under the same/compatible licence. [same] **Verified**
- **CC BY-ND**: copy/distribute only unadapted, credit required, commercial allowed. [same] **Verified**
- **CC BY-NC**: noncommercial only ("not primarily intended for or directed towards commercial advantage or monetary compensation"), credit required. [same] **Verified**
- **Editorial-only** (e.g. Sketchfab/stock "Editorial" class): no commercial/promotional use, no alteration beyond crop. [https://sketchfab.com/licenses] **Verified**
- **Royalty-free (proprietary)**: Blendkit RF, Textures.com, Mixamo — use in projects OK, but **no standalone redistribution** (and Mixamo no AI/ML use). [sources in §1] **Verified**

### 5.2 Hobbyist sharing a demo publicly (free, non-monetised)
- Safest: **CC0 only** (Poly Haven, ambientCG, Kenney, Quaternius, KayKit, Smithsonian CC0). You may even commit the raw asset files to a public repo. [Practice, per licence pages above]
- CC BY assets are fine; add a credits list in the README and on an in-app "Credits" screen (see patterns in §5.4). [Practice]
- CC BY-NC is OK for a clearly non-commercial hobby demo, but becomes risky if you add ads, donation links, a paid tier, or later turn the demo into a product; CC's NC definition hinges on "primarily intended for commercial advantage". [Practice/Inference; definition https://creativecommons.org/cc-licenses/]
- CC BY-SA: derivatives (e.g., a scene file embedding a modified mesh) must be shared under SA; mixing with proprietary code is a grey area — avoid unless you accept SA. [Practice]
- Fab Standard / Textures.com / Mixamo assets: OK inside your built demo, but **don't commit the raw asset files** to a public repo (standalone redistribution). [Inference from https://www.fab.com/eula, https://www.textures.com/faq-license, Mixamo FAQ]
- Don't copy three.js example models into your repo without reading each one's licence (DamagedHelmet is CC BY-NC). [https://github.com/mrdoob/three.js/tree/master/examples/models/gltf/DamagedHelmet] **Verified**
- NASA content: acknowledge NASA, avoid NASA logos/insignia, avoid implying endorsement. [https://www.nasa.gov/nasa-brand-center/images-and-media/] **Verified**

### 5.3 Commercial use (products, ads, paid access)
- CC0 and Fab Standard/Textures.com/Blendkit RF/Mixamo: allowed (read each ToS; Fab Personal vs Professional split at $100k revenue; Textures.com Indie < $150k). [Fab docs; Textures.com FAQ] **Verified**
- CC BY: allowed with credit. CC BY-NC: **not allowed**. Editorial: **not allowed** for commercial/promo use. [CC + Sketchfab licences] **Verified**
- AI-tool outputs: Meshy free plan = CC BY 4.0 (credit Meshy); paid = owned. Polycam needs paid plan for downloads. Blockade commercial licence tier unclear — check before shipping. Adobe Firefly outputs commercially usable, indemnity only on enterprise plans. [sources in §3.1] **Verified / Unverified (conflicts noted)**
- Keep a manifest (asset, source URL, author, licence, version/date, modified?) in the repo. [Practice]

### 5.4 Attribution patterns
- Generic (OpenGameArt style): `"[asset name]" by [author] licensed [license]: [url]`. [https://opengameart.org/content/faq] **Verified**
- Poly Pizza CC-BY: `"Title" by Username (https://poly.pizza/u/username) CC-BY 4.0`. [https://github.com/jasonkneen/tiny-world-builder/blob/main/.agents/skills/poly-pizza-api/SKILL.md] **Verified (third-party doc)**
- ambientCG suggested text: `Created using <asset name> from ambientCG.com, licensed under the Creative Commons CC0 1.0 Universal License.` [https://docs.ambientcg.com/license/] **Verified**
- Sketchfab: creator username + link to model + licence; attribution must stay accessible to end users of derived experiences. [https://sketchfab.com/developers/download-api/guidelines] **Verified**
- Poly Haven live API users: "Powered by Poly Haven" credit near the content or label naming Poly Haven. [https://github.com/Poly-Haven/Public-API/blob/master/ToS.md] **Verified**
- Meshy free plan: credit Meshy in the description of the commercial page. [https://www.meshy.ai/pricing] **Verified**
- Placement: README "Credits" section + in-app credits screen/overlay + `CREDITS.md`/`assets-manifest.json`; keep the licence text/link, not just the name. [Practice]

---

## 6. Conflicts & gaps

**Conflicts / things that changed vs the brief**
1. **Sketchfab is no longer "owned by Epic"**: KitBash acquired Sketchfab + ArtStation, announced 2026-08-10 (with an Epic exec quoted). [https://sketchfab.com/blogs/community/kitbash-acquires-sketchfab-and-artstation/]
2. Sketchfab's own pages disagree on catalogue size: Download API landing says "over 1 million free models", guidelines page says "more than 700,000" (likely stale vs current). [https://sketchfab.com/developers/download-api ; https://sketchfab.com/developers/download-api/guidelines]
3. Sketchfab/Epic 2024 messaging said free downloads would end ("everything becomes view-only") once Fab had a free-content flow + API; the KitBash post (2026-08) says downloading continues unchanged. No end date found. Treat as risky long-term.
4. Fab has **no** CC0/BY-SA/BY-NC licences; Sketchfab CC0/NC/SA models therefore cannot be mirrored on Fab.
5. Meshy: free-plan licence/download story is inconsistent between help pages (see §3.1).
6. Polycam: attribution requirement differs between ToS excerpt and a secondary site.
7. Blockade Labs: two price sets on one page; commercial-licence tier differs between marketing copy and the plans page.
8. Kenney City Kit (Suburban) model count: "over 35" (itch) vs "40" (OGA).
9. Textures.com: free-credit status (blog says ended 2024; licence FAQ still references free accounts).
10. Poly Haven API terms: current page says free incl. commercial; I did not retrieve older versions, so any earlier restriction is unconfirmed.
11. three.js manual line "public-domain glTF on sites like Sketchfab" vs Sketchfab's CC BY base licence.

**Gaps (not verified in this pass)**
- ambientCG API rate limits/User-Agent/attribution rules for the API.
- Kenney City Kit (Commercial) exact contents/format list; any Kenney API.
- Quaternius per-pack glTF availability; "Ultimate" pack list beyond RPG/Platformer.
- Legacy Megascans (Epic Content License) scope for non-Unreal use; whether Fab has since launched an official public API.
- Mixamo: current Adobe general terms text (only the 2021 additional terms + FAQ read); API/automation stance.
- ControlMat; training-data/licence of MatFuse & Material Palette weights; SD v1.5 base licence implications.
- Sampler pricing; Substance Sampler availability beyond Adobe-account edition.
- KTX-Software exact licence (GitHub shows NOASSERTION).
- GitHub star counts for glTF-Transform / meshoptimizer / Draco / KTX-Software / glTF-Sample-Assets come from `gh api` on 2026-10-17; WebFetch GitHub summaries showed "0 stars" and are **not** reliable.
- Legal status of copyright in AI-generated textures (jurisdiction-dependent) — out of scope.

---

## 7. Source list (primary pages read this session, 2026-10-17)
- Poly Haven: https://polyhaven.com/license ; https://polyhaven.com/our-api ; https://polyhaven.com/llms.txt ; https://github.com/Poly-Haven/Public-API ; https://api.polyhaven.com/
- ambientCG: https://docs.ambientcg.com/license/ ; https://docs.ambientcg.com/api/ ; https://docs.ambientcg.com/api/v2/full_json/
- Kenney: https://kenney.nl/support ; https://kenney.nl/knowledge-base/game-assets-3d/importing-3d-models-into-game-engines ; https://kenney.nl/assets/series:City
- Quaternius: https://www.patreon.com/quaternius/about ; https://quaternius.com/packs/ultimaterpg.html
- KayKit: https://kaylousberg.itch.io/city-builder-bits ; https://kaylousberg.itch.io/kaykit-adventurers
- Sketchfab: https://sketchfab.com/blogs/community/kitbash-acquires-sketchfab-and-artstation/ ; https://sketchfab.com/developers/download-api ; https://sketchfab.com/developers/download-api/guidelines ; https://sketchfab.com/licenses
- Fab: https://www.fab.com/eula ; https://dev.epicgames.com/documentation/en-us/fab/licenses-and-pricing-in-fab ; https://dev.epicgames.com/documentation/en-us/fab/migrating-assets-to-fab ; https://forums.unrealengine.com/t/reminder-free-megascans-ends-soon/2203090
- Smithsonian: https://3d.si.edu/open-source-resources ; https://3d-api.si.edu/api-docs/
- NASA: https://www.nasa.gov/3d-resources/ ; https://www.nasa.gov/nasa-brand-center/images-and-media/
- Mixamo: https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html ; https://wwwimages2.adobe.com/content/dam/cc/en/legal/servicetou/Mixamo-Addl-Terms-en_US-20210623.pdf
- Textures.com: https://www.textures.com/faq-license ; https://www.textures.com/about/terms-of-use ; https://www.textures.com/faq-premium-access
- Blendkit: https://www.blendkit.com/docs/licenses/ ; https://www.blendkit.com/plans/pricing/
- OpenGameArt: https://opengameart.org/content/faq ; Poly Pizza: https://poly.pizza/docs/press
- Formats/tools: https://www.khronos.org/gltf/ ; https://www.iso.org/standard/83990.html ; https://threejs.org/docs/pages/GLTFLoader.html ; https://threejs.org/docs/pages/KTX2Loader.html ; https://github.com/donmccurdy/glTF-Transform ; https://github.com/zeux/meshoptimizer
- AI: https://skybox.blockadelabs.com/plans ; https://api-documentation.blockadelabs.com/ ; https://www.meshy.ai/pricing ; https://poly.cam/pricing ; https://helpx.adobe.com/substance-3d-sampler/release-notes/version-4-4---substance-3d-sampler.html ; https://huggingface.co/gvecchio/MatFuse
