# R4 — Real-world geodata, captured reality, generative 3D, world models, AI video

Research date: **2026-10-17** (every number, price, star count and version below is as of this date unless another date is given).
Format: `- fact [source URL] — TAG`. Tags: **Verified** (read on primary source / API today), **Practice** (common industry knowledge or secondary/third-party report, not primary), **Inference** (my deduction from verified facts), **Unverified** (could not confirm; treat as a lead).
Star counts / licences / versions come from `gh api repos/...` on 2026-10-17 unless stated. GitHub's licence detector says `NOASSERTION` for several repos; the real licence text was read where noted.

Audience: experienced software engineer, new to 3D. The "Demo-spotting cues" at the end (section 7) are the practical payoff.

---

## 1. Real-world geodata (globe / city scenes)

### 1.1 Renderers

- **CesiumJS**: Apache-2.0, 15,846 stars, latest release `1.146` published 2026-10-01. [https://github.com/CesiumGS/cesium] — Verified
- **3d-tiles-renderer (NASA-AMMOS/3DTilesRendererJS)**: Apache-2.0, 2,498 stars, latest release `v0.5.3`, last push 2026-10-16. Renders OGC 3D Tiles in **three.js, Babylon.js and react-three-fiber**. [https://github.com/NASA-AMMOS/3DTilesRendererJS] — Verified
- Its README ships demos for Google Photorealistic Tiles (three.js `googleMapsAerial`, Babylon.js `googleMapsAerial`), Google Globe tiles and Cesium ion tilesets; Google tiles need a Google Tiles API key or a Cesium ion key. [https://github.com/NASA-AMMOS/3DTilesRendererJS] — Verified
- **So yes: Google Photorealistic 3D Tiles can be used in three.js** (via 3DTilesRendererJS). Google's own doc says to pass the root tileset URL "to a 3D Tiles renderer of your choice"; the renderer must support copyright attribution. [https://developers.google.com/maps/documentation/tile/3d-tiles] — Verified
- **deck.gl**: MIT, 14,678 stars. `Tile3DLayer` (in `@deck.gl/geo-layers`) loads 3D Tiles and Esri I3S, and the docs include a "Load 3D Tiles from Google Maps" example using header `X-GOOG-API-KEY` against `https://tile.googleapis.com/v1/3dtiles/root.json`. [https://github.com/visgl/deck.gl] [https://deck.gl/docs/api-reference/geo-layers/tile-3d-layer] — Verified
- **Babylon.js** (26,175 stars, Apache-2.0, release 9.30.0) recommends 3DTilesRendererJS for 3D Tiles; needs `scene.useRightHandedSystem = true` and `useLargeWorldRendering` for globe-scale data like Google tiles. [https://doc.babylonjs.com/features/featuresDeepDive/geospatial/loading3dTiles/] — Verified
- **MapLibre GL JS**: BSD-3-Clause (GitHub API shows `NOASSERTION`; `LICENSE.txt` text is the 3-clause BSD), 11,880 stars, latest `v6.14.0` (2026-10-11). Forked from mapbox-gl-js 1.x "before their switch to a non-OSS license in December 2020". [https://github.com/maplibre/maplibre-gl-js] [https://raw.githubusercontent.com/maplibre/maplibre-gl-js/main/LICENSE.txt] — Verified
- MapLibre has a `fill-extrusion` layer type (extruded 3D polygons; paint props `fill-extrusion-height`, `-base`, `-color`, `-opacity`...), supported since GL JS 0.27.0; this is the "extruded boxes from OSM building footprints" look. [https://maplibre.org/maplibre-style-spec/layers/] — Verified
- **Mapbox GL JS**: 12,443 stars, latest `v3.33.0` (2026-10-13). Licence is **proprietary** since v2.0 ("licensed under the Mapbox TOS for use only with the relevant Mapbox product(s)"); v1.13 and earlier are BSD-3-Clause. [https://raw.githubusercontent.com/mapbox/mapbox-gl-js/main/LICENSE.txt] — Verified
- **Mapbox pricing (web)**: GL JS is billed per **map load**; one load = unlimited interaction + tile requests for up to 12 hours. Official doc confirms the model. [https://docs.mapbox.com/mapbox-gl-js/guides/pricing/] — Verified
- Free tier 50,000 map loads/month; then $5.00/1k (50,001–100k), $4.00 (100k–200k), $3.00 (200k–1M), $2.50 (1M–5M), contact sales above. Taken from secondary pages because mapbox.com/pricing renders numbers client-side; a pricing-tracker page independently reports the $3.00 and $2.50 tiers added in May 2026. [https://storerocket.io/learn/mapbox-pricing] [https://pricingsaas.com/companies/mapbox/diffs/2026W20] — Practice
- Mapbox says customers may not use licensed map content "in any printed or video media" without purchasing print/video rights. Relevant for screen-recorded fly-overs. [https://www.mapbox.com/pricing] — Verified

### 1.2 Cesium ion (hosted tiles, terrain, OSM buildings, Google tiles broker)

- Plans (USD, 2026-10-17): **Community free** (personal/non-commercial/evaluation), **Commercial** $149/mo individual or $524/mo team, **Premium** $499/mo individual or $874/mo team, **Custom** (sales). [https://cesium.com/platform/cesium-ion/pricing/] — Verified
- Community quotas: 10 GB storage, 15 GB/month streaming, Google Photorealistic 3D Tiles **1,000 root tiles/month**, Global Imagery 1,000 sessions/month. Commercial: 100 GB / 150 GB / 5,000 root tiles. Premium: 500 GB / 500 GB / 10,000 root tiles. [https://cesium.com/platform/cesium-ion/pricing/] — Verified
- A paid commercial account is needed if the company has >$50K annual gross revenue or has raised >$50K, or for government projects, funded educational research, or if limits are exceeded. [https://cesium.com/platform/cesium-ion/pricing/] — Verified
- **Cesium OSM Buildings**: global 3D Tiles layer derived from OpenStreetMap, "over 350 million buildings" with per-building metadata; you must show "© OpenStreetMap contributors" (Cesium software adds it automatically). [https://cesium.com/platform/cesium-ion/content/cesium-osm-buildings] — Verified
- Cesium's third-party terms say Cesium OSM Buildings "may include OpenStreetMap data" under the ODbL. [https://cesium.com/legal/third-party-terms/] — Verified
- If you render ion assets to static images/video, the attribution must be visible (a static "Data attribution" link is insufficient; list it in a caption or at the end of a video). [https://cesium.com/learn/ion/content-usage-and-attribution-guide/] — Verified

### 1.3 Google Photorealistic 3D Tiles (Map Tiles API)

- It is an **Enterprise-category SKU** ("Map Tiles API: Photorealistic 3D Tiles"); Enterprise SKUs have a **free cap of 1,000 requests/month** (2D/Street View tile SKUs have 100,000). [https://developers.google.com/maps/billing-and-pricing/pricing-categories] — Verified
- Billing unit = **root tileset request**, not individual tile fetches. One root request lets the renderer fetch tiles for **at least 3 hours** (timed session); after that a new root request (new charge) is needed. Reloading the page starts a new root request. [https://developers.google.com/maps/documentation/tile/3d-tiles] [https://developers.google.com/maps/documentation/tile/usage-and-billing] — Verified
- Price above free cap: **$6.00 per 1,000 root requests**, falling to $5.10 / $4.20 / $3.30 / $2.40 at volume bands (100k, 500k, 1M, 5M). Source is a third-party blog quoting the official table; the official pricing page was not machine-readable. [https://blog.afi.io/blog/what-is-the-google-photorealistic-3d-tiles-api/] — Practice
- Default quotas: max **10,000 root tileset requests/day/project**; unlimited renderer tile requests; 12,000 queries/min rate limit for the tile renderer. [https://developers.google.com/maps/documentation/tile/usage-and-billing] — Verified
- The old "$200 monthly credit" was only valid "until February 28, 2025"; do not quote it as current. [https://developers.google.com/maps/documentation/tile/usage-and-billing] — Verified
- **Restrictions (Map Tiles API Policies)**: must not "pre-fetch, index, store, or cache" content beyond HTTP `Cache-Control`/`ETag` semantics; no non-visualization use: image analysis, machine interpretation, object detection, geodata extraction/resale, **offline uses**. [https://developers.google.com/maps/documentation/tile/policies] — Verified
- **Attribution**: show the Google Maps logo (16–19 dp height, unmodified, not overlapped by the renderer's logo) AND aggregate/display the per-tile `asset.copyright` strings in a line (e.g. "Data SIO, NOAA, U.S. Navy, NGA, GEBCO; Landsat / Copernicus"). New implementations should say "Google Maps"; old "Google" is tolerated for now. In CesiumJS set `showCreditsOnScreen: true`. [https://developers.google.com/maps/documentation/tile/policies] — Verified
- You may overlay your own 3D objects on the tiles if they are not "extracted, traced, or otherwise derived by hand or machine" from the tiles; mixed scenes must make clear which part is Google data. [https://developers.google.com/maps/documentation/tile/policies] — Verified
- **Promotional videos** using the tiles: allowed only if ≤30 seconds, no Street View, about your app's capabilities, marked "for promotional purposes only", with attribution, not resold; takedown requests must be honoured. [https://developers.google.com/maps/documentation/tile/policies] — Verified
- Inference: a long, monetised cinematic fly-over video rendered from Google tiles (as AI agents often demo) would fall outside the ≤30 s promo-video allowance; check your Google agreement. EEA billing addresses fall under different terms. [https://developers.google.com/maps/documentation/tile/policies] — Inference
- Practice: because the tiles are photogrammetry meshes, "melted" buildings, smeared trees and flat textured cars/signs are normal (see section 7).

### 1.4 OpenStreetMap and derivatives

- OSM data licence: **ODbL 1.0** (attribution + share-alike on derivative databases). Credit "OpenStreetMap" and make clear the data is under ODbL (e.g. link to openstreetmap.org/copyright); "© OpenStreetMap contributors" is acceptable. [https://www.openstreetmap.org/copyright] [https://wiki.osmfoundation.org/wiki/Licence/Attribution_Guidelines] — Verified
- OSMF safe-harbour attribution: visible without interaction, in a map corner (may fade after interaction or 5 s if licence info remains reachable); for video: end credits or description with the copyright URL; for games: splash screen, credits or menu. Static images of <10,000 m² or <100 features need no attribution. [https://wiki.osmfoundation.org/wiki/Licence/Attribution_Guidelines] — Verified
- Rendered maps/3D scenes are "Produced Works" (attribution, no share-alike) unless used to extract substantial OSM data (then a Derivative Database). [https://wiki.osmfoundation.org/wiki/Licence/Attribution_Guidelines] — Verified
- **Overture Maps Buildings** theme is under **ODbL** (it includes OSM data; other sources must be ODbL-compatible, e.g. CC BY 4.0: Esri Community Maps, Microsoft ML footprints [ODbL], Google Open Buildings [CC BY 4.0]). Places theme is CDLA-Permissive-2.0/Apache-2.0 (no OSM data). Latest release `2026-09-23.1` (2026-09-25); next scheduled `2026-10-21.0`; monthly cadence; GeoParquet on S3/Azure. [https://docs.overturemaps.org/guides/buildings/] [https://docs.overturemaps.org/attribution/] [https://docs.overturemaps.org/release-calendar/] — Verified
- So "Overture buildings are permissively licensed" is **wrong**; only some other themes are CDLA-Permissive. [https://docs.overturemaps.org/guides/buildings/] — Verified
- **OSM2World** (tordanik/OSM2World): converts OSM data to 3D models (glTF/OBJ); 791 stars, MIT licence per repo today (a 2022 issue called it LGPL, so it was relicensed; see Conflicts). Author said outputs are not subject to code-licence restrictions, but OSM-derived outputs must follow ODbL "produced work" rules. [https://github.com/tordanik/OSM2World] [https://github.com/tordanik/OSM2World/issues/189] — Verified
- **OSM Buildings** (OSMBuildings/OSMBuildings): 1,007 stars, last push 2021-04-29 (dormant); licence file mixes MIT and GPL-3.0 text. Its data uses OSM geometry under ODbL. [https://github.com/OSMBuildings/OSMBuildings] [https://osmbuildings.org/copyright/] — Verified
- Typical "AI agent builds a city" recipe (no Google involved): OSM/Overture footprints → extruded polygons in MapLibre `fill-extrusion`, deck.gl, three.js or OSM2World → flat-coloured boxes without facades. [https://maplibre.org/maplibre-style-spec/layers/] — Practice

---

## 2. Captured reality (photogrammetry, NeRF, Gaussian splatting)

### 2.1 Photogrammetry

- **RealityScan** (formerly RealityCapture, Epic Games): **free** for individuals/companies with <$1M annual gross revenue, students, educators and non-commercial use; otherwise **$1,250 per seat per year** (or $1,850/seat/year as part of the Unreal Subscription incl. Unreal Engine + Twinmotion). Revenue test is group-wide and counts funds raised. [https://www.realityscan.com/license] [https://www.realityscan.com/eula] [https://dev.epicgames.com/community/learning/tutorials/bOV0/realityscan-buy-and-manage-realitycapture-seats-on-the-developer-portal] — Verified
- Legacy RealityCapture licence server shut down **2026-08-03** (update to RealityScan 1.4+/2.0+; 2.0+ needs the new EULA and Epic launcher/portal download). [https://www.realityscan.com/news/the-realitycapture-legacy-licensing-server-will-close-down-on-august-3] — Verified
- **Meshroom** (AliceVision front end): 13,016 stars, MPL-2.0 (`LICENSE-MPL2.md`); **AliceVision** core library: 3,515 stars, MPL-2.0 plus an MIT-licensed libmv file. [https://github.com/alicevision/Meshroom] [https://github.com/alicevision/AliceVision] — Verified
- **COLMAP** (SfM + MVS, also the standard camera-pose step before splat training): 12,974 stars, "new BSD" licence, latest `4.2.1`. [https://github.com/colmap/colmap] [https://raw.githubusercontent.com/colmap/colmap/main/LICENSE] — Verified
- **OpenDroneMap**: 6,535 stars, AGPL-3.0 (aerial photogrammetry). [https://github.com/OpenDroneMap/OpenDroneMap] — Verified
- Output of photogrammetry = textured triangle mesh (millions of tris, baked photo texture, no real materials); Google's 3D Tiles are the same kind of asset at planetary scale. [https://developers.google.com/maps/documentation/tile/3d-tiles] — Practice

### 2.2 NeRF and 3D Gaussian Splatting

- **NeRF**: Mildenhall, Srinivasan, Tancik, Barron, Ramamoorthi, Ng; arXiv 2003.08934 (2020; published at ECCV 2020). A fully-connected network maps a 5D coordinate (x,y,z,θ,φ) to density + view-dependent radiance; render by volume ray-marching. [https://arxiv.org/abs/2003.08934] — Verified (arXiv); ECCV venue — Practice
- Reference NeRF code `bmild/nerf`: 10,950 stars, MIT, last push 2025-04-12. **nerfstudio**: 12,079 stars, Apache-2.0, latest `v1.1.5`, last push 2025-07-29. [https://github.com/bmild/nerf] [https://github.com/nerfstudio-project/nerfstudio] — Verified
- **3D Gaussian Splatting (3DGS)**: Kerbl, Kopanas, Leimkühler, Drettakis, "3D Gaussian Splatting for Real-Time Radiance Field Rendering", ACM Transactions on Graphics vol. 42 no. 4 (SIGGRAPH 2023), DOI 10.1145/3592433, arXiv 2308.04079. Scene = millions of anisotropic 3D Gaussians with colour/opacity, rasterised in real time; trains in minutes to ~an hour. [https://arxiv.org/abs/2308.04079] — Verified
- **Reference implementation licence is NOT open source**: repo `graphdeco-inria/gaussian-splatting` (24,233 stars, last push 2025-10-17) uses the "Gaussian-Splatting License" from Inria + MPII: rights granted "for research purposes… The Software may be used 'non-commercially', i.e., for research and/or evaluation purposes only." Commercial use needs a separate licence from the owners. [https://raw.githubusercontent.com/graphdeco-inria/gaussian-splatting/main/LICENSE.md] — Verified
- Inference: this is why commercial tools (Postshot, Polycam, Scaniverse, KIRI, Luma) and many viewers use independent re-implementations, and why "just run the INRIA trainer" is not a safe commercial recipe. [https://raw.githubusercontent.com/graphdeco-inria/gaussian-splatting/main/LICENSE.md] — Inference
- Unlike a mesh, a splat scene has **no surfaces, UVs or PBR materials**; lighting is baked in (view-dependent colour via spherical harmonics). Marble's own docs warn meshes derived from splats show "uneven geometry, holes, and blobby or 'floater' surfaces". [https://docs.worldlabs.ai/marble/export/mesh] — Verified (Marble statement); general claim — Practice

### 2.3 Capture apps and trainers (splat creation)

- **Postshot (Jawset)**: Windows-only, needs NVIDIA GPU compute capability ≥7.5 (RTX 2060+). Free plan = non-commercial, watermarked renders, 4K SDR max; **Indie** adds commercial use, no watermark, **PLY and SPZ export**; **Studio** adds CLI, HDR/RAW. Pricing: Indie €26/month or €204/year; Studio €59/month or €468/year (CG Channel, 2026-08-23; Jawset's store page itself displays €0.00 placeholders). [https://www.jawset.com/shop/pricing/] [https://www.cgchannel.com/2026/08/new-cg-software-you-may-have-missed-23-august-2026/] — Verified (tiers); prices — Practice
- **Polycam**: free plan exports **glTF only**; Basic $30/month adds OBJ/FBX/DAE/USDZ/STL/PLY etc. and unlimited object captures + Gaussian splats; Business $400/year/user (point clouds, geo-referenced LAS); Enterprise custom. [https://poly.cam/pricing] [https://learn.poly.cam/hc/en-us/articles/27756102599572-What-File-Types-Can-Polycam-Export] — Verified
- **Scaniverse** (owned by Niantic Spatial): classic on-device mode free with unlimited splats, exports PLY/SPZ; newer Plus $20/mo and Pro $50/mo add cloud processing/360-camera splats/commercial rights. Pricing from a third-party comparison, not Scaniverse's own page. [https://www.skyebrowse.com/news/posts/polycam-vs-scaniverse] [https://dev.scaniverse.com/news/creating-splats-which-app-to-choose] — Practice
- **KIRI Engine**: mobile app free but Gaussian splatting needs a paid plan: $17.99/month (Scaniverse blog, undated). A "$79.99/year" figure appeared in one summary but not in a source I could open. [https://dev.scaniverse.com/news/creating-splats-which-app-to-choose] — Practice; $79.99/yr — Unverified
- **Luma AI**: the Luma Genie text-to-3D product was **sunset 2026-01-01** (App Store release notes; content still exportable). The Capture (NeRF/splat) service was put in "maintenance mode" (Luma Discord quote relayed on Reddit; "100% focused on Dream Machine"); users in 2026-03/05 report uploads stuck "processing" and the Android app no longer downloadable. The iOS app is still listed. [https://apps.apple.com/us/app/luma-3d-capture/id1615849914] [https://www.reddit.com/r/GaussianSplatting/comments/1ght6d1/is_gs_processing_dead_on_lumaai/] [https://www.reddit.com/r/GaussianSplatting/comments/1s5tubm/scan_done_through_3d_capture_from_luma_labs_ai/] — Genie sunset Verified; Capture status Practice (user reports, no official shutdown notice found)
- Other trainers: **nerfstudio** (Apache-2.0, includes `splatfacto`) as above; COLMAP for poses. [https://github.com/nerfstudio-project/nerfstudio] — Verified

### 2.4 Web splat viewers

| Viewer | Stars | Licence | Version / last push | Notes |
|---|---|---|---|---|
| Spark (World Labs, `sparkjsdev/spark`) | 3,750 | MIT | `v2.3.1`, push 2026-10-16 | three.js renderer; formats ply, sogs, spz, splat, ksplat; 2.0 (2026-04-14) added streamable LOD |
| PlayCanvas SuperSplat (`playcanvas/supersplat`) | 10,406 | MIT | `v3.5.2`, push 2026-10-05 | browser editor/publisher; PlayCanvas engine 17,076 stars MIT `v2.23.3` |
| PlayCanvas splat-transform | 1,383 | MIT | push 2026-10-09 | CLI to convert/compress PLY↔SOG↔SPZ, build LOD bundles |
| mkkellogg/GaussianSplats3D | 2,915 | MIT | last push 2025-10-19 | three.js viewer; appears no longer actively developed (Inference from push date) |
| antimatter15/splat | 3,074 | MIT | last push 2025-11-16 | original minimal WebGL viewer; origin of `.splat` |
| Babylon.js | 26,175 | Apache-2.0 | `9.30.0` | loads .ply/.splat/.compressed.ply/.spz/.sog; `GaussianSplattingStream` streams SOG LODs |
| three.js | 116,535 | MIT | `r186` | no built-in splat renderer (Practice); use Spark or GaussianSplats3D |

[https://github.com/sparkjsdev/spark] [https://sparkjs.dev/] [https://github.com/playcanvas/supersplat] [https://github.com/mkkellogg/GaussianSplats3D] [https://github.com/antimatter15/splat] [https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting] [https://github.com/mrdoob/three.js] — Verified (stars/licence/format lists); "no built-in splat renderer in three.js" — Practice; Spark 2.0 date from a secondary page [https://radiancefields.com/platforms/world-labs] — Practice

### 2.5 File formats and sizes

- **.ply**: uncompressed, lossless, universal "source/interchange" format; "anything up to several GB". Measured: INRIA 3DGS output of 5,000,000 splats = 1,240,001,532 bytes (**248 B/splat**). [https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/] [https://ai.thesatyajit.com/articles/sog-splat-format] — Verified (PlayCanvas doc); measurement — Practice (third-party)
- **.splat**: antimatter15's "JavaScript typed-array serialized version of .PLY data" (compact, simple, no spherical-harmonic detail per Babylon docs wording). [https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting] — Verified
- **.spz** (Niantic, `nianticlabs/spz`: MIT, 935 stars): quantised attributes in ZSTD streams, "roughly 10× smaller than the PLY equivalent"; native format of Scaniverse; PlayCanvas supports only SPZ v4. [https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/spz/] [https://github.com/nianticlabs/spz] — Verified
- **.sog** (PlayCanvas "Spatially Ordered Gaussians", open spec since 2025-09-17): `meta.json` + WebP images, or a single `.sog`; lossy; "15–20× smaller than PLY"; example 4 M-splat scene 1 GB PLY → 42 MB (~95% reduction). Independent measurement: 5 M splats 1.18 GB → 65 MB (18.2×, ~13.6 B/splat). [https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/sog/] [https://github.com/playcanvas/blog/blob/main/blog/2025-09-17-playcanvas-open-sources-sog-format-for-gaussian-splatting.md] [https://ai.thesatyajit.com/articles/sog-splat-format] — Verified / Practice
- Naming trap: Babylon.js docs call ".SOG/SOGS" "Self-Organizing Gaussians" (Fraunhofer HHI research format, ancestor of PlayCanvas's SOGS), while PlayCanvas's current `.sog` stands for "Spatially Ordered Gaussians"; Babylon also streams PlayCanvas-style SOG LOD bundles. Check which one a file really is. [https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting] [https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/sog/] — Verified (both statements)
- Practical ranges: a scanned room is typically 1–6 M splats → ~250 MB–1.5 GB PLY vs tens of MB as SOG/SPZ; Marble exports are ~2 M splats (full) or ~500 k (low-res). [https://docs.worldlabs.ai/marble/export/specs] — Inference (from per-splat byte counts above + Marble spec)

---

## 3. Generative 3D (text / image → mesh)

### 3.1 Services and models (all prices 2026-10-17 unless stated)

| Name | Access | Price (2026-10-17) | Output licence | Notes |
|---|---|---|---|---|
| **Meshy** (`meshy-7.1`, `meshy-6`, `meshy-t2.5`) | Web app + REST API (API needs Pro or higher) | Free $0 = 100 credits/mo; Pro $20 = 1,000; Premium $40 = 3,000; Ultra $100 = 8,000 credits/mo. API: image→3D mesh-only 20 credits, with 2K/4K textures 30, 8K 35; `meshy-6-lite`/`t2`/`t2.5` 5/15/20 | Free: **CC BY 4.0** (commercial OK with attribution to Meshy); paid: private, user owns output | Text-to-3D not supported on Meshy 7 (only Meshy 6); free plan cannot download Meshy 6/7 models; remesh/rigging 0 credits; `lowpoly` mode retires 2026-10-30 |
| **Tripo** (H2/H3/P1 models) | Web "Studio" + OpenAPI | API prepaid: **$1 = 100 credits**; H2/H3 text→model 10 (no texture) / 20 (textured); image→model 20 / 30; P1 image 40 / 50; add-ons: detailed texture +20, extreme +30, quad +5, low-poly +10, parts +20. Studio: free 200 credits/mo (public, non-commercial); ~$20/mo billed annually = 3,000 credits, private + commercial | API terms: outputs usable for lawful commercial/non-commercial purposes; may not be used to build competing models; non-refundable credits | Failed tasks not charged; plan names on page not legible (Unverified) |
| **Rodin / Hyper3D** (Deemos; Gen-2, Gen-2.5) | Web + API (API only on Business plan) | Gen-2 API base **0.5 credits** per generation; direct credits **$1.50 each** (so ≈ $0.75 base generation, Inference); Business $120/mo or $96/mo annual ($1,152/yr), 120–240 RPM | Paid plans include commercial licence; free-tier commercial terms not stated on pricing page | Accepts 1–5 images + prompt; `quality`, `mesh_mode`, HD 4K texture add-ons; always send `tier=Gen-2` or it silently falls back to Gen-1/1.5 |
| **Tencent Hunyuan3D / "HY 3D Global"** (3.0, 3.1 hosted) | Tencent Cloud API + web platform + Replicate/fal; **3.0/3.1 have no open weights** | Postpaid **$0.02/credit**; prepaid $15 per 1,000 credits down to $1,350 per 100,000; free quota 200 credits/user; Professional job reported at 25 credits base (Geometry 15, LowPoly 30, +10 each for PBR/multiview/custom face count) ≈ $0.50 base | Hosted: Tencent claims no rights in Outputs; open 2.x models: see 3.2 (territory restriction) | 3.1 adds multi-view inputs (up to 8 views) but no LowPoly/Sketch; default 3 concurrent tasks; credit table partly read via search summary (Practice) |
| **Luma Genie** | **Discontinued 2026-01-01** | n/a | n/a | Content exportable only |
| **CSM (Common Sense Machines, "Cube")** | Web + API on mid/upper tiers | Not publicly rate-carded; third-party listing of $20 and $60/seat/month is unverified | Unverified | Treat as Unverified [https://apis.io/plans/csm/csm-plans-pricing/] |
| **Sloyd** | Web + API (separate products) | API prepaid **$1 = 75 credits**, min $12 = 900; text→3D 25 credits (≈$0.33), image→3D base 10 (+10 texture, +5 quads, +10 for ≥500k tris); web Plus $15/mo, Pro $50/mo | Commercial use listed on paid web plans (layout ambiguous) | Exports GLB/OBJ/FBX |
| **Stability Stable Fast 3D (SF3D) / SPAR3D** | Open weights (HF + GitHub) and Stability API | Free for research/non-commercial and commercial **below US$1M annual revenue**; above → Enterprise licence | Stability AI Community License; you own outputs | Single image → UV-unwrapped, textured mesh in <1 s; 512×512 input; predicts roughness/metallic; SPAR3D adds point-cloud editing; repos stale (pushes 2025-01 / 2025-05) |
| **Microsoft TRELLIS / TRELLIS.2** | Open weights + HF space (self-host) | Free; TRELLIS.2-4B needs Linux + NVIDIA ≥24 GB VRAM (per search summary) | **MIT** (code and model) | TRELLIS 13,982 stars; TRELLIS.2 12,076 stars; 4 B params, image→mesh with full PBR incl. opacity, 512³–1536³ voxels, ~3 s / 17 s / 60 s on H100 |
| **TripoSR / TripoSG / UniRig (VAST-AI)** | Open weights | Free | MIT (TripoSR 7,097 stars; TripoSG 1,839; UniRig 1,842) | Older/faster image→mesh; TripoSR last push 2026-06-04 |

Sources per row: Meshy [https://docs.meshy.ai/en/api/pricing] [https://help.meshy.ai/en/articles/15696428-what-is-included-on-the-free-plan] [https://docs.meshy.ai/en/webapp/pricing] — Verified. Tripo [https://docs.tripo3d.ai/get-started/pricing.html] [https://www.tripo3d.ai/pricing] [https://developers.tripo3d.ai/en/terms] — Verified. Rodin [https://docs.hyper3d.ai/en/api-specification/rodin-gen2] [https://hyper3d.ai/pricing] — Verified; derived $/gen — Inference. Tencent API [https://www.tencentcloud.com/document/product/1284/75281] [https://www.tencentcloud.com/document/product/1284/75540] — Verified (rates/models), per-job credit table — Practice; 3.x closed [https://triposr.org/blog/hunyuan3d-versions] — Practice. Luma Genie [https://apps.apple.com/us/app/luma-3d-capture/id1615849914] — Verified. Sloyd [https://www.sloyd.ai/api/pricing] [https://www.sloyd.ai/pricing] — Verified. Stability [https://huggingface.co/stabilityai/stable-fast-3d] [https://stability.ai/license] [https://raw.githubusercontent.com/Stability-AI/stable-point-aware-3d/main/LICENSE.md] — Verified. TRELLIS [https://github.com/microsoft/TRELLIS.2] [https://huggingface.co/microsoft/TRELLIS.2-4B] — Verified (licence, speed); VRAM figure — Practice. TripoSR etc. via GitHub API — Verified.

### 3.2 Hunyuan3D open weights: licence has territory exclusions

- Open-weight line: Hunyuan3D-1, -2, -2mini/mv, **-2.1** (June 2025; Shape 3.3 B + Paint 2 B, PBR, training code released), plus -Omni/-Part. Stars: Hunyuan3D-2 15,142; -2.1 4,210; -Omni 643. [https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1] [https://huggingface.co/collections/tencent/hunyuan3d] — Verified
- "TENCENT HUNYUAN 3D 2.1 COMMUNITY LICENSE AGREEMENT … DOES NOT APPLY IN THE EUROPEAN UNION, UNITED KINGDOM AND SOUTH KOREA"; Territory = worldwide excluding EU, UK, South Korea. [https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/LICENSE] — Verified
- Further terms: if the licensee's products had >1 M monthly active users in the month before release you must ask Tencent for a licence; you may not use the Works or Outputs to improve any other AI model; and §5(c) "Rules of Use" says you "must not use, reproduce, modify, distribute, or display the … Works, Output or results … outside the Territory". Same pattern in Hunyuan3D 2.0, HunyuanWorld-1.0 and HY-World 2.0 licences. [https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/LICENSE] [https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/LICENSE] [https://github.com/Tencent-Hunyuan/HY-World-2.0/blob/main/License.txt] — Verified
- Same licence also states "Tencent claims no rights in Outputs" and that Outputs alone are not Model Derivatives — i.e. ownership is yours, but geography and anti-distillation limits still bind. [https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/LICENSE] — Verified
- Hunyuan3D 3.0 (announced 2025-09-16) and 3.1 (2026-01/02) have no GitHub repo or HF weights; no 2.5 weights either. Newest open = 2.1. [https://triposr.org/blog/hunyuan3d-versions] [https://www.wireflow.ai/blog/best-hunyuan3d-v3-tools-in-2026] — Practice (third-party blogs; GitHub/HF checked for 2.x only)
- Tencent says the hosted platform grew into "HY 3D Studio" (topology, UV, texturing, rigging) in 2026, and offers ~20 free generations/day on the global platform. [https://www.wireflow.ai/blog/best-hunyuan3d-v3-tools-in-2026] — Practice

### 3.3 Typical quality (what to expect from any of them)

- Output is a triangle mesh (usually GLB) with UVs and baked/PBR textures; Marble's mesh docs and Meshy/Tripo options (remesh, quad, smart low-poly) show "raw" results are not production topology. [https://docs.meshy.ai/en/api/pricing] [https://docs.tripo3d.ai/get-started/pricing.html] — Verified (options exist)
- The existence of paid "Smart Topology", "Remesh", "quad=true", "Smart Low-Poly" and "UV Unfold" endpoints implies default topology is dense/triangulated and not animation-ready. [https://www.tencentcloud.com/document/product/1284/75281] [https://docs.tripo3d.ai/get-started/pricing.html] — Inference
- Speed: SF3D <1 s on GPU; TRELLIS.2 3–60 s on H100 by resolution; hosted services typically seconds to a few minutes (Meshy publishes a Processing Times page but I did not capture numbers). [https://huggingface.co/stabilityai/stable-fast-3d] [https://github.com/microsoft/TRELLIS.2] — Verified (open models); hosted — Unverified
- Practice: single-view back sides are hallucinated; text on objects, thin structures and hands are error-prone; scale/orientation are arbitrary (you set them).

---

## 4. World models / explorable worlds

- **World Labs Marble** (product; models `marble-1.0`, `1.1`, `1.1-plus`): text, single image, multi-image, video, 360 pano or 3D layout → a persistent world; exportable as **Gaussian splats, collider mesh, HQ textured mesh, 360 pano, or rendered video**. [https://docs.worldlabs.ai/marble/support/account-billing] [https://docs.worldlabs.ai/marble/export/gaussian-splat] — Verified
- Marble plans (checked by a third party 2026-08-28; consistent with official docs): Free ($0; up to 4 generations; can create but **cannot export**), Standard $20/mo (20,000 credits, ~12 generations; SPZ/PLY splats, pano, low-res collider mesh), Pro $35/mo (40,000 credits, ~25 gens; HQ textured GLB, enhanced video, **commercial rights**), Max $95/mo (120,000 credits, ~75 gens). [https://www.therundown.ai/tools/marble] [https://docs.worldlabs.ai/marble/export/gaussian-splat/index] [https://radiancefields.com/platforms/world-labs] — Practice (prices) / Verified (feature gating per docs)
- Marble API: credits **$1.00 = 1,250 credits**, min $5 purchase, credits don't expire; world generation 1,500 credits (**$1.20**), draft 150 ($0.12), pano from text/non-pano image 80, HQ mesh export 3,500 credits (**$2.80**), **PLY splat export free**; `marble-1.1-plus` may add up to 1,500 credits for larger worlds. [https://docs.worldlabs.ai/api/pricing] — Verified (credits); $ conversions — Inference
- Export specs: pano 2560×1280 PNG; SPZ/PLY ≈2 M splats (low-res ≈500 k); collider mesh 100–200 k triangles; HQ mesh = one GLB ≈600 k tris with texture + one ≈1 M tris with vertex colours; takes up to an hour; rate-limited 4/hour/user; only for worlds you own; default coordinates are OpenCV (+y down, +z forward), so flip Y and Z for OpenGL tools. [https://docs.worldlabs.ai/marble/export/specs] — Verified
- Licence of outputs: ToS — Free accounts: World Labs retains rights, you get a revocable personal non-commercial licence; **Paid accounts and API own the Output and may use it commercially**. The billing doc, however, says commercial rights start at Pro (not Standard). See Conflicts. [https://www.worldlabs.ai/terms-of-service] [https://docs.worldlabs.ai/marble/support/account-billing] — Verified (both texts); interaction — conflict
- Spark (MIT) renders Marble splats in a browser (three.js); renderer licence says nothing about commercial rights to the world. [https://docs.worldlabs.ai/marble/export/gaussian-splat] [https://aiproplaybook.com/tools/marble] — Verified / Practice
- **Google DeepMind Genie 3 / Project Genie**: real-time, text/image-conditioned world model generating frames at **24 fps, 720p**, "consistent for a few minutes" with visual memory ~1 minute; interaction limited to a few minutes. Output is **pixels (video frames), not a 3D asset** — DeepMind notes NeRFs/splats need an explicit 3D representation whereas Genie creates worlds "frame by frame". [https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/] — Verified
- Availability: "Project Genie" (Google Labs prototype powered by Genie 3) opened to **Google AI Ultra** subscribers (18+) in the US on 2026-01-29; gradually rolling out globally to the $200 Ultra tier from 2026-05-19, with Street View-grounded worlds initially US-only; capacity "not guaranteed"; not for Ultra-for-Business. No developer API or export route is documented in the sources I read. [https://blog.google/innovation-and-ai/models-and-research/google-deepmind/project-genie/] [https://blog.google/innovation-and-ai/models-and-research/google-deepmind/project-genie-expands/] [https://support.google.com/labs/answer/16875695?hl=en] — Verified (availability); "no export/API" — Unverified (absence of evidence)
- Known issues listed by Google: control latency, streams get darker over time, world may not match input image. [https://support.google.com/labs/answer/16875695?hl=en] — Verified
- **Tencent HY-World 2.0** (released 2026-04-15): text / single image / multi-view / video → persistent **meshes, 3DGS and point clouds** importable into Blender/Unity/Unreal/Isaac; pipeline Panorama → WorldNav → WorldStereo 2.0 → WorldMirror 2.0 + 3DGS training. 2,745 stars; Tencent community licence (territory excludes EU/UK/South Korea, >1 M MAU needs approval). [https://github.com/tencent-hunyuan/hy-world-2.0] [https://github.com/Tencent-Hunyuan/HY-World-2.0/blob/main/License.txt] — Verified
- **HY-World 1.5 / WorldPlay** (open, 2025-12-17): real-time interactive **streaming video** at 24 FPS with long-term geometric consistency (HunyuanVideo-8B backbone) — video-only, no mesh/splat output; 1,618 stars. [https://github.com/Tencent-Hunyuan/HY-WorldPlay/] — Verified
- **HunyuanWorld-1.0** (July 2025; 2,951 stars) mesh-based world generator; **HunyuanWorld-Mirror / WorldMirror** (ICML 2026; 1,215 stars) feed-forward image/video → point clouds, depth, normals, camera poses and 3DGS, exportable to COLMAP format. [https://github.com/Tencent-Hunyuan/HunyuanWorld-1.0] [https://github.com/Tencent-Hunyuan/HunyuanWorld-Mirror] — Verified
- **Odyssey** (Odyssey-2 Pro): developer API (`@odysseyml/odyssey` JS, Python SDK) with **real-time interactive video streams over WebRTC** (`startStream` + `interact(prompt)`; optional broadcast) and async scripted "simulations" that return recordings; output is video, not geometry. Idle connections auto-cleared after 15 min; concurrent session limits apply. [https://documentation.api.odyssey.ml/sdk/javascript/introduction] [https://documentation.api.odyssey.ml/sdk/javascript/simulations] [https://documentation.api.odyssey.ml/api-quick-start] — Verified
- **Decart**: *Mirage / Lucy* = real-time video restyling and editing via API (a live camera stream is transformed, not a 3D world); *Oasis 3* = interactive multi-view world model aimed at physical-AI/robotics, "under 200 ms latency, 22 FPS" (vendor claim), API-accessible. [https://mirage.decart.ai/] [https://decart.ai/oasis] — Verified (what vendor says); performance numbers — Practice (vendor claim)
- **Dynamics Lab Mirage / Mirage 2**: browser-playable generative world; no public API documented in the results I saw. [search result summary; no primary page opened] — Unverified
- Rule of thumb for outputs: **Marble, HY-World 2.0, WorldMirror → splats/meshes (exportable, persistent)**; **Genie 3, HY-World 1.5, Odyssey, Oasis, Mirage → video frames (interactive but nothing to export)**. [https://github.com/tencent-hunyuan/hy-world-2.0] [https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/] — Inference

---

## 5. AI video that looks like a walkthrough

- **Veo 3.1** (Google): clips of 4, 6 or 8 s (longer lengths need 1080p+/reference images), 24 fps, 720p/1080p/4k; extension adds 7 s up to 20 times, **max ≈148 s total**; extension only for Veo-generated videos; generated videos stored 2 days. [https://aistudio.google.com/models/veo-3] [https://ai.google.dev/gemini-api/docs/veo] — Verified
- **Runway Gen-4.5**: 2–10 s per clip. **Kling 3.0**: 3–15 s, multi-shot prompting, native audio. **Luma Ray3.2**: up to 20 s at 1080p. [https://dev.runway.com/models/catalog] [https://www.dreamdrive.ai/learn/cross-platform/text-to-video-which-platform-for-what/] — Verified (Runway/Kling catalog); Luma — Practice
- Longer single generations "have more room to drift"; commercial tools therefore stitch short shots. [https://www.dreamdrive.ai/learn/cross-platform/text-to-video-which-platform-for-what/] — Practice
- How to tell video from real-time 3D: (a) fixed short duration, usually cuts every 4–15 s; (b) no interactivity — can't orbit, pause-and-look-around or change time of day; (c) temporal inconsistency (buildings change windows/count between shots, text mutates, loops don't close); (d) no consistent scale or parallax errors; (e) 24 fps cinematic motion blur and film grade rather than a UI/HUD, devtools or frame-rate counter; (f) camera paths too perfect/smooth through impossible spaces. — Practice / Inference
- Real-time world models (Genie 3, Odyssey) *are* interactive but still pixel-generated: expect control latency, slow drift/darkening, memory lapses (things change when you look away for >~1 min), and short sessions (few minutes). [https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/] [https://support.google.com/labs/answer/16875695?hl=en] — Verified

---

## 6. Licensing / terms quick-matrix for "can I ship the demo?"

| Asset | Can you ship it commercially? | Key gotcha |
|---|---|---|
| Google Photorealistic 3D Tiles | Yes, via live API; no caching/offline/ML extraction | Logo + data attribution; ≤30 s promo videos; EEA terms differ |
| Cesium ion Google tiles | Within plan quotas (1k/5k/10k root tiles/mo) | Commercial account if company >$50K revenue |
| OSM / Cesium OSM Buildings / Overture Buildings | Yes | ODbL attribution; share-alike only if you redistribute a derivative database |
| 3DGS reference trainer (INRIA) | **No** (research/non-commercial) | Use commercial trainer (Postshot Indie, etc.) |
| RealityScan | Free <$1M revenue; $1,250/seat/yr above | Group-wide revenue test |
| Meshy free-tier output | Yes with CC BY 4.0 attribution | Free plan can't download Meshy 6/7 models, no API |
| Tripo free-tier output | No (public, non-commercial) | Paid plan needed |
| Hunyuan3D 2.1 open weights | Only outside EU/UK/South Korea, <1 M MAU, no model-improvement use | Output use outside territory also barred |
| SF3D / SPAR3D | Free <$1M revenue; register | Enterprise licence above |
| TRELLIS.2 | MIT | Check bundled nvdiffrast/nvdiffrec licences |
| Marble worlds | Pro+ (docs) vs any paid (ToS) | See Conflicts |

[sources as cited in sections above] — Verified (rows individually tagged above); TRELLIS dependency licences — Unverified

---

## 7. How to tell from watching a demo (cues by category)

1. **Google Photorealistic 3D Tiles (photogrammetry mesh)**
   - Google Maps logo bottom-left and a line of tiny credits ("Data SIO, NOAA… Landsat/Copernicus") at the bottom — required by policy. [https://developers.google.com/maps/documentation/tile/policies] — Verified
   - Melted/drooping buildings, smeared trees, bridges that sag to the river, textures stretched on vertical walls, flat cars and signage, hard LOD "pops" as tiles refine; very close views turn to mush; works best in big cities. — Practice
   - Whole-earth scale: smooth zoom from orbit to street. Coverage ends at borders of surveyed cities. — Practice
2. **OSM/Overture extruded buildings (MapLibre, deck.gl, OSM2World, Cesium OSM Buildings)**
   - Untextured grey/pastel boxes with flat or simple roofs, heights from `height`/`levels` tags, "© OpenStreetMap contributors" in a corner. — Verified (attribution), Practice (look)
3. **Photogrammetry meshes (RealityScan/Meshroom)**
   - Noisy, lumpy surfaces with baked-in shadows, holes under overhangs, texture smear, no clean edges. — Practice
4. **Gaussian splats (Marble, Polycam, Scaniverse, Postshot, SuperSplat)**
   - Soft/fuzzy edges, translucent "floaters" and haze near the camera path, blurry or streaky regions off the capture path, view-dependent shimmer, reflections that look "painted"; scene falls apart if the camera leaves the trained cameras. Marble's own docs list "blobby or 'floater' surfaces" and holes where input views were missing. [https://docs.worldlabs.ai/marble/export/mesh] — Verified (docs) / Practice
   - Viewer chrome: Spark/SuperSplat/PlayCanvas UI, loading bar for a 20–400 MB `.spz/.sog` file. [https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/] — Inference
   - Splat lighting is baked: moving a light or time-of-day slider does nothing. — Practice
5. **Generative meshes (Meshy, Tripo, Rodin, Hunyuan3D, TRELLIS)**
   - Single-object hero assets on a turntable; blobby/overly smooth or melted shapes, weird thin parts, text gibberish, symmetrical-but-wrong backs, wireframe view showing dense irregular triangles (not quads), baked highlights in textures. — Practice / Inference
   - Often sold with a wireframe/UV view only when the vendor has remeshed (quad/low-poly options cost extra). [https://docs.tripo3d.ai/get-started/pricing.html] — Inference
6. **World-model "worlds" (Genie 3, Odyssey, HY-World 1.5, Oasis, Mirage)**
   - WASD or prompt-driven movement but with latency; scene morphs when revisited; image darkens/drifts over minutes; no export; sessions last a few minutes; HUD/credit-based sessions. [https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/] [https://support.google.com/labs/answer/16875695?hl=en] — Verified
7. **AI video fly-throughs (Veo, Kling, Runway, Luma)**
   - 4–15 s clips, cuts or "extend" seams, geometry inconsistency across shots, no interaction, cinematic grading, sometimes synthetic audio. [https://ai.google.dev/gemini-api/docs/veo] [https://dev.runway.com/models/catalog] — Verified (durations) / Practice (cues)
8. **Real-time hand-built 3D scene (three.js etc.)**
   - You can pause and orbit freely; consistent geometry from every angle; hard-edged primitives or glTF assets; FPS counter/dev-tools; shadows move correctly when lights move. — Practice

---

## Conflicts & gaps

- **Marble commercial rights**: World Labs ToS (paid-accounts clause) says *Paid Account Users* own Outputs and may exploit them "for any purpose, including Commercial Purposes", while the billing page, export doc and third-party summaries say commercial rights come with **Pro ($35)** and not Standard ($20). Treat Pro as the safe threshold until World Labs clarifies. [https://www.worldlabs.ai/terms-of-service] [https://docs.worldlabs.ai/marble/support/account-billing] [https://aiproplaybook.com/tools/marble]
- **Google 3D Tiles price**: free cap (1,000/month) is verified on Google's page; the $6.00/1k and volume bands come from a third-party blog (`afi.io`, date unknown). Confirm on https://mapsplatform.google.com/pricing/ before quoting. Also note Cesium ion lists the same 1,000 root-tile figure for its free plan.
- **Mapbox GL pricing**: mapbox.com/pricing renders numbers client-side (not extractable); tiers come from `storerocket.io` + `pricingsaas.com` (May 2026 change). Mapbox's `LICENSE.txt` is dated "Updated 2023-01" for the TOS wording; v2.0 (Dec 2020) is when OSS ended.
- **OSM2World licence**: repo says MIT today (791 stars) but 2022 maintainer comment calls it LGPL → licence was changed; read the current `LICENSE.txt` before reuse. **OSM Buildings**: GitHub API says `NOASSERTION`; file mixes MIT and GPL-3.0 text; project dormant since 2021-04-29.
- **Polycam pricing**: current page shows Basic $30/month and Business $400/year; older comparisons cite "Pro $26.99/month". **Scaniverse** Plus/Pro prices ($20/$50) come from a third-party comparison. **KIRI** ($17.99/mo) comes from an undated Scaniverse blog.
- **Luma Capture** shutdown is *not* officially announced; it rests on a Discord quote relayed on Reddit and user reports. Genie sunset *is* official (App Store notes).
- **Spark version**: radiancefields.com says npm v2.3.0 (2026-09-30); GitHub latest release is `v2.3.1` — GitHub wins (newer).
- **Postshot prices**: Jawset store shows €0.00 placeholders (client-rendered); Indie €26/mo and Studio €59/mo come from CG Channel (2026-08-23).
- **"SOG"**: Babylon.js calls it "Self-Organizing Gaussians" (Fraunhofer); PlayCanvas defines "Spatially Ordered Gaussians". Related but different specs; verify what a `.sog`/`.sogs` file actually contains.
- **Hunyuan3D credits**: the per-job credit table (25/15/30 + 10 add-ons) was read via a search summary; the page snippet itself was truncated. Hunyuan3D 3.x "no open weights" is from third-party blogs (I verified only that 2.x repos/HF models exist).
- **Not verified / gaps**: Genie 3 export/API (none found); Dynamics Lab Mirage 2 details; Meshy/Tripo/Rodin real-world processing times and topology quality (no primary benchmark read); CSM price list; TRELLIS.2 bundled nvdiffrast/nvdiffrec licences (separate, may be non-commercial); Overture/Google tile coverage dates; Hunyuan3D "20 free generations/day"; whether Project Genie lets users record/export clips; Sloyd per-plan commercial-use rights (page text ambiguous); GitHub star counts are as of 2026-10-17 and change daily.
- **Out of scope here** (other fact sheets): three.js/WebGL/WebGPU basics, glTF format details, AI-agent tooling (Cursor/Claude MCP for Blender etc.).
