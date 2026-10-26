# R3 — Game engines & offline rendering driven by AI agents (incl. MCP servers)

Research date: **2026-10-17** (all numbers below are as of this date unless stated). Audience: experienced software engineer, Windows 11, Claude Code / Codex / Cursor, new to 3D.
Tags: **Verified** = read in a primary/vendor source or API today · **Practice** = commonly reported usage/experience · **Inference** = my reasoning from facts · **Unverified** = could not confirm.
GitHub numbers come from the GitHub REST API (`/repos/...` or `/search/repositories`) fetched 2026-10-17. Note: `WebFetch` of github.com pages returns "0 stars" – ignore that; API numbers are used.

---

## 0. Summary table (stars/licence as of 2026-10-17)

| Tool | Licence | Stars (2026-10-17) | What the agent can control | Sees result how |
|---|---|---|---|---|
| **Unreal MCP (Epic, built into UE 5.8, Experimental)** | Part of UE (UE EULA) | n/a (in-engine plugin) | Actors, Blueprints, materials, Niagara, Sequencer, PCG, tests, Python (`execute_tool_script`) via Toolset Registry | `EditorAppToolset.CaptureViewport` (third-party harness), log tools, automation test results |
| EpicGames/unreal-engine-skills-for-claude-code-plugin | MIT | 550 | Skill/hook pack that teaches Claude Code to use Epic's Unreal MCP | "Editor – screenshots, camera control, log inspection" (README) |
| chongdashu/unreal-mcp | None in API (README badge says MIT) | 2,097 (last push 2025-04-22 → stale) | Actors, Blueprints, node graph, viewport focus | Viewport focus only; no screenshot tool listed in README |
| ChiR24/Unreal_mcp | MIT | 957 (push 2026-10-17) | 23 tools: actors, editor, PIE, UBT, tests, Python exec | `control_editor` incl. screenshots; logs via `system_control` |
| flopperam/unreal-engine-mcp | None in API | 1,101 (push 2026-06-26) | Local OSS server = basic; 50+ tools only in hosted paid product | Not verified |
| **Unity CLI MCP mode (official)** | Free to use (proprietary) | n/a | Editor via Unity Pipeline package (HTTP/REST) | Console, scene info; screenshots Unverified for official |
| Unity AI Assistant MCP (`com.unity.ai.assistant`) | Proprietary | n/a | Editor – **deprecated** in favour of Unity CLI | – |
| CoplayDev/unity-mcp ("MCP for Unity") | MIT | 15,045 (push 2026-10-08) | 48 tool entrypoints: scenes, GameObjects, scripts, assets, tests, build | `camera screenshot` (game_view / scene_view, multi-view batches, base64) |
| IvanMurzak/Unity-MCP ("AI Game Developer") | Apache-2.0 | 4,486 (push 2026-10-17) | Editor **and runtime**; custom tools | `screenshot-game-view` (needs open Game View) |
| CoderGamester/mcp-unity | MIT | 1,935 (push 2026-10-11) | Unity editor | Not checked |
| Godot (engine) | MIT | 118,548 | `--headless --script`, export, Movie Maker | Movie Maker AVI/PNG, stdout |
| Coding-Solo/godot-mcp | MIT | 6,130 (push 2026-04-16) | Launch editor, run project, debug output, scene ops | Console/debug output (no screenshot) |
| hi-godot/godot-ai | MIT | 3,032 (push 2026-10-17) | 46 tools / 120+ ops: scenes, nodes, scripts, UI, materials, cameras | Editor-connected; screenshot tool not verified |
| ee0pdt/Godot-MCP | MIT | 620 (push 2025-03-19 → stale) | Godot editor | Not verified |
| Blender (app) | GPL-2.0-or-later (Cycles Apache-2.0) | 20,989 (GitHub shows NOASSERTION) | Everything via Python (`bpy`) | Rendered image / viewport screenshot |
| **ahujasid/mcp-for-blender** (formerly `blender-mcp`) | MIT | **31,338** (push 2026-10-06) | `execute_blender_code`, scene info, Poly Haven/Sketchfab/Poly Pizza, Tripo/Hunyuan3D/Rodin | `look` tool (viewport/camera/multi-angle/wireframe/xray/render) |
| **Blender official MCP (`lab/blender_mcp`)** | Unverified (repo on projects.blender.org) | n/a (not on GitHub) | Natural-language access to bpy, docs, scene inspection; Blender ≥ 5.1 | Scene inspection; screenshot Unverified |
| edg-l/blendbridge | None | 2 | `execute_script`, `render`, `export_model` (GLB) | `screenshot`, `set_viewport`, `render` |
| BlenderGIS | GPL-3.0 | 9,488 (push 2025-12-20) | OSM/DEM import (human add-on; scriptable) | n/a |
| vvoovv/blosm (Blosm / Blender-OSM) | None in API | 2,137 (push 2026-09-08) | OSM, terrain, Google 3D tiles import | n/a |
| NVIDIA Omniverse Kit/Isaac MCP (kit-usd-agents) | Unverified | n/a | *Knowledge* servers (docs/code search), not scene control | n/a |

---

## 1. Unreal Engine 5

### 1.1 Version, status
- Latest released UE5 is **5.8.3 (hotfix, 2026-09-22)**; 5.8.0 shipped 2026-06 (Epic page dated June 23, 2026; patchbot lists 5.8 as Jun 17); 5.8.4 is a hotfix *candidate* (no tag yet). [https://patchbot.io/games/unreal-engine/articles/1517-583-hotfix-released] [https://speedrun.ci/en/blog/last-week-in-unreal-oct-5-11-2026] — Verified (third-party tracker; release date mismatch Jun 17 vs Jun 23 noted in §10)
- Epic says 5.8 is "the last planned major Unreal Engine 5 release … as we ramp up work on UE6", may add a 5.9 "if circumstances warrant". [https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available] — Verified
- Previous: 5.7 released 2025-11-12. [https://patchbot.io/games/unreal-engine/articles/1517-583-hotfix-released] — Verified
- Rendering: 5.8 – Lumen "lightweight dynamic GI" for 60 fps on Switch 2/PC; MegaLights, Iris, Movie Render Graph now Production Ready; new Experimental "Mesh Terrain". [https://www.unrealengine.com/news/state-of-unreal-2026-top-news-from-the-show] — Verified
- Nanite/Lumen basics (Nanite = virtualised geometry; Lumen = dynamic GI) are used by City Sample. [https://www.unrealengine.com/marketplace/en-US/product/city-sample] — Verified (listing names Nanite, Lumen, World Partition, Mass AI, MetaHumans)

### 1.2 Licence / pricing (verify-before-publish: Epic's own pages disagree, see §10)
- Free for students, educators, hobbyists and companies under **$1M annual gross revenue**. [https://www.unrealengine.com/en-US/license] — Verified
- **Royalty**: games / apps that use engine code at runtime and are licensed to third-party end users pay **5% of lifetime gross revenue above $1M per product**; Epic Games Store revenue is royalty-free. [https://www.unrealengine.com/en-US/license] [https://www.unrealengine.com/en-US/faq?active=source] — Verified
- **Seat-based** (non-game commercial use, company revenue > $1M in past 12 months): **$1,850 per seat per year**. [https://www.unrealengine.com/en-US/license] — Verified
- The $1M royalty threshold is *per product, lifetime*; the seat threshold is *company, trailing 12 months*. [https://www.unrealengine.com/en-US/faq?active=source] — Verified
- Implication for a tutorial that only produces a rendered video/screenshots by a small creator: under $1M company revenue → free. — Inference
- Royalty payments due 45 days after quarter end with per-product report (EULA/FAQ). [https://www.unrealengine.com/en-US/faq?active=source] — Verified

### 1.3 Scripting & automation surface
- **Python Editor scripting**: run headless-ish via `UnrealEditor.exe "<proj>.uproject" -run=pythonscript -script="<file>.py"` (example in 5.8 release notes; the PythonScript commandlet). [https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes?lang=en-US] — Verified
- **Remote Control API**: web server inside the engine (HTTP + WebSocket, REST-like); can read/write any Blueprint/Python-exposed property and call any exposed function; **disabled by default in packaged/`-game`**, enable with `-RCWebControlEnable -RCWebInterfaceEnable`. [https://dev.epicgames.com/documentation/en-us/unreal-engine/remote-control-for-unreal-engine] (5.7 doc) — Verified
- **PCG (Procedural Content Generation) framework**: `UPCGGraph` can be "standalone" and executed outside a world with an editor execution source; 5.8 docs exist; PCG Python Data Processor node noted in release notes. [https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/PCG/UPCGGraph] [https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes?lang=en-US] — Verified
- **Movie Render Graph** is Production Ready in 5.8 (offline/high-quality render path from the editor). [https://www.unrealengine.com/news/state-of-unreal-2026-top-news-from-the-show] — Verified

### 1.4 Official Epic AI/MCP (new in 2026)
- **UE 5.8 ships an Experimental "Unreal MCP" plugin**: an MCP server embedded in the editor process, HTTP at `http://127.0.0.1:8000/mcp`, for "Claude Code, Cursor, MCP Inspector…". [https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor?lang=en-US] — Verified
- Tools come from the **Toolset Registry**; you must also enable the **AllToolsets** plugin or the server exposes no tools. Console: `ModelContextProtocol.StartServer [port]`, `ModelContextProtocol.GenerateClientConfig <ClaudeCode|Cursor|VSCode|Gemini|Codex|All>` writes `.mcp.json`. [same] — Verified
- Default "tool search" mode exposes 3 meta-tools: `list_toolsets`, `describe_toolset`, `call_tool`. [same] [https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin] — Verified
- Toolsets can be authored in Python (`unreal.ToolsetDefinition` + `@toolset_registry.tool_call`) or C++ (`UFUNCTION(meta=(AICallable))`); a native `UAgentSkill` class implements the open Agent Skills standard (Unreal Fest talk). [same] [https://www.youtube.com/watch?v=lDf_y-YPELo] — Verified
- Epic's official Claude Code plugin: `EpicGames/unreal-engine-skills-for-claude-code-plugin`, **MIT, 550 stars (2026-10-17, push 2026-09-17)**; "hundreds of tools across 30+ toolsets: actors, blueprints, materials, Niagara, Control Rigs, Sequencer, State Trees, widgets, GAS, automation testing"; published in Anthropic's `claude-plugins-official` marketplace. [https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin] — Verified (stars: GitHub search API)
- Epic's release notes: "new experimental MCP plugin … enables agentic AI systems to connect to the Unreal Editor"; also an in-editor "AI assistant" tab appears in release-note fixes. [https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes?lang=en-US] — Verified
- **City Sample updated for 5.8 (2026-08-27)**: city rebuilt *inside* UE using PCG (new PCG Primitives plugin) "with assistance from the LLM" — Epic states "we used Claude"; ships `CitySamplePCG_demo` plugin, two new PCG levels (full city + simple), Megaplants vegetation, shape-grammar assets; original Houdini-built level kept. [https://www.unrealengine.com/learning/city-sample-gets-a-major-update-with-pcg-and-unreal-mcp-workflows] — Verified (primary, Epic)
- Same page: "LLMs can use PCG as their spatial language" (Unreal Fest Chicago 2026 talk); relies on Experimental/Beta features not enabled by default. [same] — Verified

### 1.5 Community Unreal MCP servers (pre-date or complement Epic's)
- chongdashu/unreal-mcp: **2,097 stars**, licence field **None** (README badge "MIT", no LICENSE file found → raw 404 on LICENSE/LICENSE.md/LICENSE.txt), last push **2025-04-22**; self-described EXPERIMENTAL; UE 5.5+, Python 3.12+, C++ plugin TCP port 55557 + FastMCP. [https://github.com/chongdashu/unreal-mcp] — Verified
- flopperam/unreal-engine-mcp: **1,101 stars**, licence None, push 2026-06-26; README banner says Flopperam **acquired by Aura**; local OSS server = "basic toolset", the "50+ tools" server is hosted/paid (FlopAI plugin + API key). [https://github.com/flopperam/unreal-engine-mcp] — Verified
- ChiR24/Unreal_mcp: **957 stars, MIT**, push 2026-10-17; 23 tools, `execute_python`, screenshots via `control_editor`, loopback-only bind by default, optional capability-token auth; prebuilt binaries tied to one UE version. [https://github.com/ChiR24/Unreal_mcp] — Verified
- Others (stars 2026-10-17): kvick-games/UnrealMCP 614 (None); winyunq/UnrealMotionGraphicsMCP 216 (MIT); GenOrca/unreal-mcp 145 (Apache-2.0); runreal/unreal-mcp 116 (MIT, push 2025-06-06). [GitHub search API] — Verified
- Practical reading: with Epic's official server in 5.8, the older community servers (esp. those with last push in 2025) are mostly relevant for UE 5.5–5.7. — Inference

### 1.6 Content & licensing for demos
- **The Matrix Awakens** (Dec 2021 tech demo) → **City Sample** free project; original contained buildings/vehicles/MetaHuman crowds and used Houdini + Houdini Engine for generation (SideFX licence needed for the generator). [https://dev.epicgames.com/documentation/unreal-engine/city-sample-project-unreal-engine-demonstration?lang=en-US] — Verified
- City Sample content is "UE-Only Content – licensed for use only with Unreal Engine-based products" (commercial OK, can't take into Unity). [https://www.unrealengine.com/marketplace/en-US/product/city-sample] [https://www.cgchannel.com/2022/04/download-epic-games-free-city-sample-assets-for-ue5/1000/] — Verified
- Old marketplace listing says supported 5.0–5.4; the 5.8 refresh is separate (§1.4). Installed size reportedly ≈ 90 GB (third-party harness doc). [https://github.com/per-simmons/unreal-agent-harness/blob/master/docs/00-GETTING-STARTED.md] — Practice
- **MetaHumans** (incl. those in the sample) are licensed for use in Unreal Engine projects. [https://marketplacehelp.epicgames.com/s/article/Can-I-sell-characters-created-with-Metahuman-on-the-UE-Marketpalce?language=en_US] — Verified. MetaHuman Creator pricing today — Unverified.
- Unreal 5.8 new character samples/tools: Zebra sample, MetaHuman Devkit, Markerless mocap plugin. [https://www.unrealengine.com/news/state-of-unreal-2026-top-news-from-the-show] — Verified

### 1.7 Hardware (Windows 11)
- Epic recommended: **Windows 11, quad-core 2.5 GHz+, 32 GB RAM, DX12 GPU with ≥ 8 GB VRAM**. Epic's own workstation example: Threadripper PRO 7985WX, 256 GB RAM, RTX 4080 16 GB, 2 TB + 4 TB NVMe. [https://dev.epicgames.com/documentation/unreal-engine/hardware-and-software-specifications-for-unreal-engine?lang=en-US] — Verified
- C++ on Windows: Visual Studio 2026 recommended; VS 2022 17.14+ supported (third-party summary of Epic docs). [https://box.co.uk/blog/unreal-engine-development-pc-specs] — Practice
- Epic community guidance: "2 GB RAM per thread", editor "loves VRAM". [https://dev.epicgames.com/community/learning/tutorials/orWB/unreal-engine-hardware-and-software-recommendations] — Verified
- For this tutorial: expect 32 GB RAM / 8–16 GB VRAM GPU as practical floor; a demo-quality City Sample on a laptop will be slow. — Inference

---

## 2. Unity 6

### 2.1 Versions
- Current: **6000.6.6f1 (Unity 6.6), released 2026-10-15**; a "Supported" (not LTS) release until 6.7 arrives. 6.5 is end-of-life. [https://unity.com/releases/editor/archive] [https://discussions.unity.com/t/unity-6-6-is-now-available/1735357] — Verified
- LTS: **Unity 6.3 LTS** supported until Dec 2027; **Unity 6.0 LTS support ends Oct 2026**. [https://unity.com/releases/unity-6] — Verified
- Unity 6.6 post calls it the "final supported release of the Unity 6 family" leading to **6.7 LTS** and CoreCLR foundations for "Unity 7"; docs for 6000.7 already exist. [https://discussions.unity.com/t/unity-6-6-is-now-available/1735357] [https://docs.unity.com/en-us/engine/6000.7/manual/unity-editor/command-line-arguments] — Verified

### 2.2 Pricing
- **Personal: free** under **$200K** revenue+funding in prior 12 months (threshold since Unity 6, 2024-10-17). [https://unity.com/products/pricing-updates] — Verified
- **Pro: $2,310 / seat / year prepaid, or $210 / seat / month** (5% increase effective 2026-01-12); required above $200K; **Enterprise** required above $25M. [https://unity.com/products/pricing-updates] [https://unity.com/products] — Verified
- Non-game sectors (auto, AEC, etc.): Pro/Enterprise only if total finances ≤ $1M; above that → **Unity Industry**. [https://unity.com/products/unity-pro] — Verified
- **Runtime Fee cancelled**: "no runtime fee associated with games created with Unity 6"; Editor terms grant royalty-free runtime for Unity 6 and prior versions. [https://unity.com/releases/unity-6] [https://unity.com/legal/editor-terms-of-service/software] — Verified
- Havok Physics removed from Pro/Enterprise/Industry on 6.0 LTS plans (2026 change). [https://unity.com/products/pricing-updates] — Verified

### 2.3 Unity AI (Muse is gone) and official MCP
- Unity AI replaces Muse/Sentis (Muse sunset after 6.2) — per search synthesis; primary page not re-opened. — Unverified (secondary)
- **Unity AI (in-editor Assistant + generators)** beta needs Unity 6.3+; Personal: 14-day trial with 1,000 credits, then **$10/month for 1,000 credits**; Pro/Enterprise/Industry include credits (plans page shows monthly allowances of 1,000 / 2,000 / 3,000 across tiers; exact tier mapping not captured). [https://discussions.unity.com/t/unity-ai-s-open-beta-now-live-for-unity-6/1718560] [https://unity.com/products] — Verified (tier mapping Unverified)
- **Official MCP server in `com.unity.ai.assistant` is DEPRECATED**; replaced by the **Unity CLI** (`unity mcp`, `unity command`, `unity eval`) running on the **Unity Pipeline package** (`com.unity.pipeline`, HTTP/REST inside the Editor, resilient to domain reloads). Unity CLI MCP mode "remains fully supported". Running Editor control needs Unity 6.0 LTS+. [https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli] [https://unity.com/resources/a-beginners-guide-to-unity-cli-and-the-pipeline-package] — Verified
- `unity mcp configure <client>` writes Claude/Cursor/VS Code/Windsurf config. [same] — Verified
- Unity says MCP server/CLI/official plugin are **free, no concurrency limits, no credits needed**; official plugin for Claude Code, Codex, Grok exists. [https://unity.com/features/ai] [https://unity.com/onboardingsuccess/unity-ai] — Verified
- Deprecation does **not** affect third-party MCP packages from GitHub. [https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli] — Verified
- No `Unity-Technologies/unity-mcp` repo exists (GitHub API 404) — official bits ship as packages, not a public repo at that name. — Verified (negative result)

### 2.4 Community Unity MCP servers
- **CoplayDev/unity-mcp ("MCP for Unity")**: **15,045 stars, MIT**, push 2026-10-08, v10.0.0 (2026-06-30); 48 tool entrypoints; Unity 2021.3 LTS → 6.x; Python 3.10+ via `uv`; sponsored/maintained by Aura. [https://github.com/CoplayDev/unity-mcp] — Verified
- **justinpbarnett/unity-mcp**: GitHub API returns **301 Moved Permanently**; CoplayDev README cites "Wu & Barnett, MCP-Unity (2025)" → it is almost certainly the same project, now under CoplayDev. [GitHub API; https://github.com/CoplayDev/unity-mcp] — Inference (redirect target not printed by API)
- **IvanMurzak/Unity-MCP ("AI Game Developer")**: **4,486 stars, Apache-2.0**, push 2026-10-17; Editor **and runtime (in-game)**; npm `unity-mcp-cli`; auto-generated skills. [https://github.com/IvanMurzak/Unity-MCP] — Verified
- CoderGamester/mcp-unity 1,935 (MIT, push 2026-10-11); AnkleBreaker-Studio/unity-mcp-server 513 (NOASSERTION); FunplayAI/funplay-unity-mcp 265 (MIT). [GitHub search API] — Verified

### 2.5 Batchmode CLI and web export
- Headless build/automation: `Unity.exe -batchmode -projectPath <p> -executeMethod Class.Method -quit`; method must be `static` in an `Editor` folder; non-zero exit via exception or `EditorApplication.Exit`. [https://docs.unity3d.com/6000.2/Documentation/Manual/EditorCommandLineArguments.html] — Verified
- Practice: `-nographics` skips GPU, so it can't render screenshots; rendering needs a GPU context. — Inference
- **WebGPU is out of experimental in Unity 6.6** (fully supported); not default – add to Graphics APIs, keep WebGL2 as fallback; WebGPU needs HTTPS/localhost. Default filter: Chromium ≥146, Firefox ≥152, Safari ≥26. [https://discussions.unity.com/t/webgpu-out-of-experimental-in-unity-6-6/1734694] [https://docs.unity.com/en-us/engine/6000.7/manual/platform-specific/webgl/develop/graphics/web-gpu/enable] — Verified
- WebGPU limitations list includes global illumination, compute shaders, GPU readback. [https://docs.unity.com/en-us/engine/6000.6/manual/platform-specific/webgl/develop/graphics/web-gpu/limitations] — Verified (headings only)

---

## 3. Godot 4.x

- Latest stable: **Godot 4.7 (2026-06-18)**. 4.7.x patch status — Unverified. [https://github.com/godotengine/godot/releases/tag/4.7-stable] — Verified
- Licence **MIT**; `godotengine/godot` **118,548 stars**, push 2026-10-16. [GitHub API] — Verified
- Languages: GDScript (Python-like), C# (.NET 8+). [https://docs.godotengine.org/en/4.7/about/list_of_features.html] — Verified
- **Headless**: `godot --headless --path <proj> --script res://x.gd` (script must extend `SceneTree`/`MainLoop`); `--headless` = `--display-driver headless --audio-driver Dummy`; export: `godot --headless --export-release <preset> out`. [https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html] — Verified
- **Offline video**: Movie Maker: `godot --path <proj> --write-movie out.avi --fixed-fps 30 --quit-after 900` (relative output path is relative to the *project folder*; AVI/PNG/OGV). [https://docs.godotengine.org/en/4.7/tutorials/animation/creating_movies.html] — Verified. Combining with `--headless` produces no rendering (headless uses a dummy display driver). — Inference
- **Web export**: single-threaded export since 4.3 (no SharedArrayBuffer/COOP-COEP needed); thread support optional and requires cross-origin isolation headers (or PWA service-worker workaround; still secure context). [https://docs.godotengine.org/en/4.7/tutorials/export/exporting_for_web.html] — Verified
- **C# projects cannot be exported to Web in Godot 4** (incl. 4.7); use Godot 3 or GDScript. [same] [https://docs.godotengine.org/en/4.7/tutorials/scripting/c_sharp/c_sharp_basics.html] — Verified
- 3D quality ceiling is lower than UE5 (no Nanite equivalent) — widely held but not verified here. — Unverified

### Godot MCP servers (stars 2026-10-17)
- **Coding-Solo/godot-mcp: 6,130 stars, MIT**, push 2026-04-16 — launch editor, run project, capture debug output, stop, get version, scene ops; CLI-driven (npx `@coding-solo/godot-mcp`, needs `GODOT_PATH`). [https://github.com/Coding-Solo/godot-mcp] — Verified
- **hi-godot/godot-ai: 3,032 stars, MIT**, push 2026-10-17 — 46 tools/120+ ops, Godot 4.7+, authenticated HTTP + WebSocket (capability tokens), GDScript fully supported, **C# text-only**; telemetry on by default (opt-out env var). [https://raw.githubusercontent.com/hi-godot/godot-ai/main/README.md] — Verified
- ee0pdt/Godot-MCP **620 stars, MIT**, push 2025-03-19 (stale). bradypp/godot-mcp 90 (MIT). yurineko73/Godot-MCP-Native 855 (MIT). tomyud1/godot-mcp 436 (MIT). IvanMurzak/Godot-MCP 291 (Apache-2.0). [GitHub search API] — Verified
- Note: CoplayDev README advertises godot-ai as "from the makers of MCP for Unity". [https://github.com/CoplayDev/unity-mcp] — Verified

---

## 4. Blender

### 4.1 Version / licence
- Latest stable: **Blender 5.2.2 LTS (2026-09-15)**; 5.2 LTS first released 2026-07-14, supported until July 2028; **5.2.3 RC, release planned 2026-10-20**; 5.3 beta planned release 2026-11-10; 4.5.x LTS still receiving RCs (4.5.15 RC). [https://www.blender.org/download/] [https://projects.blender.org/blender/blender/milestones?sort=furthestduedate] [https://builder.blender.org/download/daily/] — Verified
- Licence: **GPL v2-or-later** (all components compatible with GPLv3+; **Cycles is Apache-2.0**). **Output (images, .blend, scenes) is yours.** `blender/blender` on GitHub: 20,989 stars (licence field "NOASSERTION" because of mixed licences). [https://www.blender.org/about/license/] [GitHub API] — Verified
- 5.2 highlights: experimental Geometry-Nodes physics (XPBD solver; hair/cloth), Cycles texture cache + Thin Wall, EEVEE fixes (up to 2× faster instance-heavy scenes), remote asset libraries. [https://www.blender.org/press/blender-5-2-lts-release/] [https://www.blender.org/download/releases/5-2/] — Verified

### 4.2 Headless CLI
- `blender --background scene.blend --render-output //out_ --engine CYCLES --render-frame 1` (also `-a` animation, `-P file.py` / `--python-expr`, Cycles device after `--`: `-- --cycles-device OPTIX|CUDA|HIP|ONEAPI|METAL|CPU`). **Arguments run in order** — set output *after* loading the .blend and *before* `--render-frame`. [https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html] — Verified
- Agents therefore can run an *entire* pipeline with no MCP: write `build_scene.py` → `blender -b --python build_scene.py` → render PNG → read PNG. [per-simmons guide uses exactly "Blender headless `bpy` (`--background --python`)"] [https://github.com/per-simmons/unreal-agent-harness/blob/master/AGENTIC-GAMEDEV-GUIDE.md] — Verified (usage exists); generality — Inference
- `blender -c <command>` runs sub-commands (implies `--background`). [same manual] — Verified

### 4.3 Cycles vs EEVEE; rough render times
- **Cycles** = path tracer (physically accurate, slow); **EEVEE** = rasteriser-based real-time engine (fast, approximate). [https://blenderartists.org/t/how-fast-is-eevee-really/1355233] — Practice
- One user test (Blender 4.2, simple arch-viz scene): Cycles 512 samples + OIDN denoise **1:14–1:26 per frame** vs EEVEE 128 samples **6 s**. [https://blenderartists.org/t/cycles-vs-eevee-next-comparison/1540799] — Practice
- Other reports: EEVEE-Next slower than Cycles on a trivial scene (1:17 vs 0:35, Dec 2023 build); EEVEE 10–30 s/frame on GTX 1060. [https://devtalk.blender.org/t/blender-4-2-eevee-next-feedback/31813/195] [https://blenderartists.org/t/how-fast-is-eevee-really/1355233] — Practice
- Techgage: Blender 3.5 hair demo took close to **3 minutes on an RTX 4090**; OptiX not always faster than CUDA. [https://techgage.com/article/blender-3-5-performance-deep-dive-cycles-eevee-viewport/] — Practice
- Rule of thumb for the tutorial: EEVEE seconds/frame; Cycles tens of seconds to minutes per 1080p frame on a modern GPU; a 10 s 30 fps Cycles animation = hours. — Inference (not a measured benchmark)

### 4.4 Blender MCP servers
- **`ahujasid/blender-mcp` was renamed `ahujasid/mcp-for-blender`** (issue #366 "blender-mcp is now mcp-for-blender", 2026-09-16); PyPI `blender-mcp` v2.0.0 is now a compatibility wrapper depending on `mcp-for-blender`; `uvx mcp-for-blender`; Blender addon and Python import path (`blender_mcp`) unchanged. GitHub API for the old URL → **301 Moved Permanently**. [https://github.com/ahujasid/mcp-for-blender] [https://pypi.org/project/blender-mcp/] [https://github.com/ahujasid/mcp-for-blender/issues] — Verified
- **Stars: 31,338, licence MIT**, push 2026-10-06 (GitHub search API, `ahujasid/mcp-for-blender`). Community plugin, "not affiliated with the Blender Foundation". — Verified
- Architecture: Blender addon (`addon.py`) opens a **socket server** inside Blender (default `localhost:9876`, host configurable via `BLENDER_HOST`) + separate MCP server process (stdio). — Verified (README + security issue #261)
- Current tool set (README, nine tools): `execute_blender_code`, **`look`** (viewport / camera / auto-framed multi-angle sheet / animation strip; shading solid/material/rendered/wireframe/xray; or show a render/image file), `get_scene_info`, `generate_3d` (Tripo, Hunyuan3D, Hyper3D Rodin), `search_assets`/`import_asset` (Poly Haven, Sketchfab, Poly Pizza), `get_addon_status`, telemetry controls. [https://github.com/ahujasid/mcp-for-blender] — Verified
- Integrations: **Poly Haven** (~2,400 HDRIs/textures/models, all CC0), **Sketchfab** (API key), **Poly Pizza** (low-poly; CC-BY credit lines stored as custom props), **Hyper3D Rodin**, **Hunyuan3D** (Tencent Cloud), **Tripo**; "Premium" tier exists for keyless AI generation. [same] — Verified
- Poly Haven downloads run on Blender's main thread → UI freezes; file size ~4× per resolution step (README troubleshooting). — Verified
- Telemetry: opt-in for prompts/code/screenshots/trajectories; basic non-content telemetry details in README. [same] — Verified (I did not audit the exact default)
- Look-alikes to avoid confusing: anujasid/blender-ai-mcp-addon (451★, MIT, push 2026-10-17); VxASI/blender-mcp-vxai (300★); bpy-dev/blender-mcp (98★, GPL-3.0). [GitHub search API] — Verified (existence); relation to ahujasid — Unverified
- **Blender's official MCP server**: "Blender Lab" project `lab/blender_mcp` on projects.blender.org; **requires Blender 5.1+**, add-on + separate MCP server (`blender-mcp` entry point, stdio or `--transport http --port 9191`), TCP bridge, releases from 2026-03-24 (v0.1.0) to **v1.0.3** (MCPB, ~Sep 2026), v1.0.0 stable 2026-04-27. "Blender does not have any built-in functionality for connecting to LLMs." Licence — Unverified. [https://www.blender.org/lab/mcp-server/] [https://projects.blender.org/lab/blender_mcp/releases] [https://projects.blender.org/lab/blender_mcp/wiki/Setup] — Verified
- Official server is "deliberately small … no more than necessary"; tools are modules auto-discovered; focus on Python API access, docs and scene exploration — **not** asset-generation integrations. [https://projects.blender.org/lab/blender_mcp] — Verified
- **Anthropic "Blender connector"** (Claude Desktop) built on Blender's MCP; works with Claude Code via the MCP server docs. [https://academy.claude.com/tutorials/using-the-blender-connector-in-claude] — Verified
- edg-l/blendbridge (2★): `execute_script`, `screenshot`, `set_viewport`, `render`, `get_scene_info`, `export_model` (GLB for Godot/Bevy), Blender 5.0. [https://github.com/edg-l/blendbridge] — Verified

### 4.5 Procedural city & world add-ons (human- and agent-usable via bpy)
- **BlenderGIS**: 9,488★, **GPL-3.0**, last push 2025-12-20; imports OSM, DEM, geo-rasters. [GitHub API; https://github.com/domlysz/BlenderGIS] — Verified
- **Blosm (ex Blender-OSM)** by Prochitecture: `vvoovv/blosm` 2,137★ (licence field None), push 2026-09-08. Base version **free ($0+)**: OSM roads/buildings/water/forest, 30 m terrain, **Google 3D cities** import, geometry-nodes hook for buildings; **Pro** adds textured buildings, forests, satellite imagery, 3D-tile baking. [https://prochitecture.gumroad.com/l/blender-osm?a=436890451] [https://prochitecture.gumroad.com/l/blosm] — Verified (Pro price 2026 — Unverified; 2022 article said $17.80)
- **Buildify** (Pavel Oliva): Geometry-Nodes procedural buildings with Blosm integration; free (voluntary donation) on Gumroad; v1.0 for Blender 3.2 (2022); GPL claim only from a blog comment; no current 5.x compatibility data found. [https://www.cgchannel.com/2022/07/download-free-blender-3d-building-generator-buildify/] — Verified (2022); current status — Unverified
- **SceneCity** (Arnaud Couturier): paid add-on **$39**, roads + mass building placement, v2 "procedural buildings" documented as "in development"; Blender 3.4+. [http://www.cgchan.com/store/scenecity] — Verified (page date unknown)
- **Geometry Nodes** (procedural modelling graph) is the idiomatic way to make cities/forests inside Blender; agents typically drive it via bpy node-tree APIs. — Inference
- Real-world meshes: Cesium for Unreal (Apache) officially supports UE 5.5–5.7 not 5.8 (per a community guide, as of Jun 2026). [https://github.com/per-simmons/unreal-agent-harness/blob/master/AGENTIC-GAMEDEV-GUIDE.md] — Practice

---

## 5. Others (brief)

- **NVIDIA Omniverse / Isaac Sim**: NVIDIA ships **MCP servers that give coding agents *knowledge*** (semantic search over extensions/code/settings): Isaac Sim MCP (5 tools), USD Code MCP (7 tools), under `NVIDIA-Omniverse/kit-usd-agents`; plus `usd-content-agents` (VLM-driven material/physics/texture/validation on USD). Repos: `kit-app-template` 1,119★ (NOASSERTION), `isaac-sim/IsaacSim` 4,286★ (NOASSERTION). [https://docs.isaacsim.omniverse.nvidia.com/latest/development_tools/isaac_sim_mcp.html] [https://github.com/NVIDIA-Omniverse/kit-usd-agents/blob/main/source/mcp/usd_code_mcp/README.md] [https://github.com/NVIDIA-Omniverse/usd-content-agents] — Verified. Relevance to a "beautiful scene" tutorial is low (robotics/industrial focus). — Inference
- **Houdini**: Indie **$299/yr (or $449/2 yr)**, full Houdini FX features, for businesses < $100K revenue and < $1M funding; one SideFX page snippet still shows $269 (older). **Houdini Engine Indie free** (works with Unity/Unreal plugins and batch mode, Indie assets only); commercial Houdini Engine $525/yr per workstation (another source says $499). City Sample's original generator needs a Houdini licence. [https://shade.inc/blog/sidefx-houdini-pricing] [https://www.sidefx.com/faq/houdini-engine-faq/] [https://www.sidefx.com/buy/] — Verified with conflicts (§10)
- **Roblox and others**: not researched; no notable agent tooling verified. — Unverified
- **Aura** (tryaura.dev): sponsors/maintains CoplayDev MCP for Unity, acquired Flopperam; sells a premium Unity/Unreal assistant. [https://github.com/CoplayDev/unity-mcp] [https://github.com/flopperam/unreal-engine-mcp] — Verified

---

## 6. How an agent "sees" engine output

Core loop used everywhere: **act → capture image → model reads image → correct**. — Verified in practice (see §8)

| Engine | Visual feedback mechanism | Source | Tag |
|---|---|---|---|
| Unreal (Epic MCP) | `EditorAppToolset.CaptureViewport` with `captureTransform` (shoot from a pose without moving user camera), `annotations` (coordinate grid + actor labels), `bShowUI:false`; returns large base64 PNG that floods context | per-simmons harness | Practice |
| Unreal (Epic plugin README) | "Editor – screenshots, camera control, … log inspection"; `LogModelContextProtocol` category; automation tests | [https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin] | Verified |
| Unreal (community) | `CaptureEditorImage` in PIE then self-correct (rioX432 playground) | [https://github.com/rioX432/ue-mcp-playground] | Practice |
| Unity (CoplayDev) | `camera screenshot` / `screenshot-multiview` (`surround` 6 angles, `orbit` grid), `--capture-source game_view|scene_view`, `--include-image` base64, default inline max 640 px | [https://coplaydev.github.io/unity-mcp/guides/cli] | Verified |
| Unity (IvanMurzak) | `screenshot-game-view` reads Game View render texture; needs an open Game View | [https://github.com/IvanMurzak/Unity-MCP/blob/main/Unity-MCP-Plugin/.claude/skills/screenshot-game-view/SKILL.md] | Verified |
| Unity (others) | Nexonium bridge: screenshot tiers ~500 / ~1,200 / ~2,700+ tokens; akiojin: game/scene/explorer modes | [https://github.com/Nexonium/unity-mcp-bridge] [https://github.com/akiojin/unity-mcp-server/blob/main/.claude-plugin/plugins/unity-mcp-server/commands/unity-screenshot.md] | Verified |
| Blender (mcp-for-blender) | `look` tool: viewport/camera/multi-angle sheet/wireframe/x-ray/animation strip, or a render file | [https://github.com/ahujasid/mcp-for-blender] | Verified |
| Blender (blog) | Older API names `execute_blender_code` + `get_viewport_screenshot`; agent compares top-down render to floor plan | [https://www.sidharthsatapathy.com/blog/claude-blender-mcp-floor-plan-to-3d-house/] | Practice |
| Godot (Coding-Solo) | Console/debug output only | [https://github.com/Coding-Solo/godot-mcp] | Verified |
| Godot (headless) | `--write-movie` frames/AVI then read PNG | [https://docs.godotengine.org/en/4.7/tutorials/animation/creating_movies.html] | Verified |
| Any | stdout/logs, compile errors, scene-graph queries (`get_scene_info`, `find_actors(bounds)`, hierarchy) — "eyes" are partially text | various | Practice |

- Token cost of images matters: a Unity bridge documents ~500–2,700+ tokens per screenshot; Unreal viewport capture PNGs can be multi-MB base64, so harnesses decode to small PNG + JSON (camera pose, labelled actors). [https://github.com/Nexonium/unity-mcp-bridge] [https://github.com/per-simmons/unreal-agent-harness] — Verified/Practice
- Multi-angle verification (front/side/top/back, 8 angles) is the recurring best practice. [https://github.com/jithinolickal/blender] [https://pavankumart18.github.io/ai-blender-design-journey/index.html] — Practice

---

## 7. Known limitations & risks

### 7.1 Security (arbitrary code execution is by design)
- **Blender MCP `execute_blender_code`** runs LLM-supplied Python via `exec()` inside Blender with full builtins (`exec(code, {"bpy": bpy})` does not sandbox); multiple public issues (#201, #207, #261). Tracked as **CVE-2026-10688** (published 2026-06-02; CVSS v3 5.5; "no patched version identified, rolling release"; maintainer reportedly had not responded then). README itself warns: "ALWAYS save your work before using it". [https://github.com/ahujasid/blender-mcp/issues/201] [https://www.tenable.com/cve/CVE-2026-10688] [https://github.com/ahujasid/mcp-for-blender] — Verified. Whether the 2026-09 rename/v2.0 fixed it — Unverified.
- Socket default `localhost:9876`; `BLENDER_HOST` configurable (e.g., Docker `host.docker.internal`) → widens exposure. [issue #261] — Verified
- **Epic Unreal MCP**: loopback only, validates `Origin`, **no authentication**; `ProgrammaticToolset.execute_tool_script` runs arbitrary Python in the editor; "localhost is not a trust boundary" — any same-user process can connect; with `--dangerously-skip-permissions` there is no per-tool gate; commit/shelve before sessions. [https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin] [https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor?lang=en-US] — Verified
- ChiR24: non-loopback bind opt-in; capability token optional. hi-godot/godot-ai v4: authenticated HTTP+WebSocket with rotating capabilities, but "does not protect against a compromised same-user process", and on Windows "does not claim isolation from other local accounts". [READMEs] — Verified
- Indirect prompt injection: any content the agent reads (asset descriptions, tool descriptions, web pages) can steer code execution; an issue reports tool descriptions containing hidden instructions. [search result summary of ahujasid issues] — Unverified detail; general risk — Inference
- Mitigations: throwaway project, VCS commit, no secrets in env, run in VM/container where feasible, require per-call approval. — Practice

### 7.2 Version drift / maintenance
- Many community MCP servers are stale: chongdashu/unreal-mcp (last push 2025-04-22), ee0pdt/Godot-MCP (2025-03-19), runreal/unreal-mcp (2025-06-06). [GitHub API] — Verified
- Unity: Unity's own in-editor MCP deprecated → CLI; docs mention conflicts fixed in assistant package ≥ 2.13. [https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli] — Verified
- Epic's server is **Experimental**; "use caution when shipping". ChiR24: prebuilt binaries tied to a specific UE minor version. [https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor?lang=en-US] [https://github.com/ChiR24/Unreal_mcp] — Verified
- Cesium for Unreal not yet supporting UE 5.8 as of Jun 2026 (community guide). — Practice
- Blender official MCP needs ≥ 5.1; mcp-for-blender renamed 2026-09 (config still works). — Verified
- Blender argument order and Unity domain reloads cause confusing failures (see manual / Unity blog). — Verified

### 7.3 Windows quirks
- Blender MCP: after changing config, **quit the AI app from the system tray** and reopen; `uv`/`uvx` must be on PATH; wrap as `"command":"cmd","args":["/c","uvx","mcp-for-blender"]` if needed; Docker uses `host.docker.internal`. [https://github.com/ahujasid/mcp-for-blender] — Verified
- Epic's Claude Code plugin `SessionStart` hook needs `bash` on PATH → **Git Bash or WSL** on Windows (tools still work without it). [https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin] — Verified
- Unreal: the plugin is per-project; `bAutoStartServer` defaults false; port 8000 conflicts happen (a demo had to move to 8123). [https://github.com/per-simmons/unreal-agent-harness/blob/master/AGENTIC-GAMEDEV-GUIDE.md] [https://www.youtube.com/watch?v=uPmy2ERmkVU] — Practice
- Godot AI: `GODOT_AI_CAPABILITY_DIR` override not supported on Windows. [https://raw.githubusercontent.com/hi-godot/godot-ai/main/README.md] — Verified
- Unity relay binary installs under `~/.unity/relay/`; first client connection requires approval (old assistant MCP). [https://docs.unity3d.com/Packages/com.unity.ai.assistant%402.20/manual/integration/unity-mcp-get-started.html] — Verified
- Disk/VRAM heavy: City Sample ≈ 90 GB (third-party). — Practice

### 7.4 Quality limitations
- Agents are strong at layout/scripts/materials and weaker at fine aesthetic judgement; results improve with specific prompts, reference images, constraints (e.g., 3 ft walkways) and human review. [https://www.sidharthsatapathy.com/blog/claude-blender-mcp-floor-plan-to-3d-house/] [https://www.top3d.ai/learn/claude-code-unreal-engine] — Practice
- One Blender demo notes an agent abandoned incremental fixes, deleted and rebuilt a facade parametrically after 10 defects found over 8 viewing angles. [https://pavankumart18.github.io/ai-blender-design-journey/index.html] — Practice (single-author demo)
- Impressive city scenes in UE come from **PCG + store assets (Megaplants, Fab packs) driven by the agent**, not agent-modelled geometry. — Inference (supported by Epic City Sample page and harness)

---

## 8. Documented examples of agents building scenes

| # | Example | What / evidence | Class |
|---|---|---|---|
| 1 | **Epic: City Sample 5.8 rebuilt with PCG + Unreal MCP, "we used Claude"** — [https://www.unrealengine.com/learning/city-sample-gets-a-major-update-with-pcg-and-unreal-mcp-workflows] | Downloadable project with PCG graphs/plugin; Unreal Fest 2026 talk; exact prompts not published on the page | **Verified** (project public; prompts not) |
| 2 | **Epic Dev Community tutorial (UE 5.8 + Claude Code + Fab "Stylized Autumn Forest")**, 6-minute; prompt: "Create a large terrain and place the cabin within the scene. Be creative. Use the asset pack…" — [https://dev.epicgames.com/community/learning/tutorials/bnJ0/build-a-playable-unreal-engine-5-level-with-ai-mcp-claude-code] | Prompt text public; result shown in video | **Verified** (prompt) / Plausible (quality) |
| 3 | per-simmons/unreal-agent-harness (199★): agents build glass city, Paris, Art-Deco, Chrysler, real NYC via Cesium; PCG city "builds itself live"; custom Blender facade kits — [https://github.com/per-simmons/unreal-agent-harness] [https://www.youtube.com/watch?v=uPmy2ERmkVU] | Repo has docs/recipes/scripts; video linked; some results promo-styled | **Verified** (harness source) / Promotional (outcome) |
| 4 | rioX432/ue-mcp-playground (1★): agent built playable wave-survival shooter in UE 5.8 via MCP loop (C++ edits, build, PIE, screenshot, self-correct) — [https://github.com/rioX432/ue-mcp-playground] | Repo with design docs/backlog | **Verified** (public source), small repo |
| 5 | Top3D.ai: UnrealClaude + VibeUE → endless runner — [https://www.top3d.ai/learn/claude-code-unreal-engine] | Blog review; vendor/aggregator site | Plausible / Promotional |
| 6 | "Floor plan → furnished rendered 3D house" with Claude + Blender MCP — [https://www.sidharthsatapathy.com/blog/claude-blender-mcp-floor-plan-to-3d-house/] | Narrative blog; renders deliberately generic; no prompts repo | Plausible |
| 7 | "AI-driven 3D architecture" Blender MCP demo (tech-park from one prompt, ~15 MCP calls) — [https://pavankumart18.github.io/ai-blender-design-journey/index.html] | Self-published demo page | Plausible / Promotional |
| 8 | ahujasid README demo prompts: "low poly dungeon with dragon guarding gold", "beach vibe with Poly Haven", reference image → scene (videos linked) — [https://github.com/ahujasid/mcp-for-blender] | Prompts public in README; videos on README | **Verified** (prompts) / Promotional (outcome) |
| 9 | jithinolickal/blender: agent skill for Blender MCP (multi-angle screenshot verification, milestones) — [https://github.com/jithinolickal/blender] | Skill source public | **Verified** (source) |
| 10 | Unity: AI Game Developer (IvanMurzak) walkthrough — empty folder → playable physics toy game with parallel agents, voice commands — [https://ai-game.dev/blog/build-game-with-ai-claude-code] | Vendor's own blog | Promotional |
| 11 | CoplayDev README GIF "MCP for Unity building a scene"; godot-ai README "block-world game in ~2 hours, no hand-written code" — [https://github.com/CoplayDev/unity-mcp] [https://raw.githubusercontent.com/hi-godot/godot-ai/main/README.md] | Project self-promotion | Promotional |

- Classification key: Verified = public source and/or prompts you can reproduce; Plausible = consistent with documented capabilities but not reproducible from the source alone; Promotional = vendor/self-marketing. — Practice (my classification)

---

## 9. Practical takeaways for the tutorial author (Inference)

- Two distinct paths: (A) **headless/offline** — agent writes a script (`blender -b --python`, `godot --headless --script`, `UnrealEditor -run=pythonscript`, `Unity -batchmode -executeMethod`) and you read output PNG/video; (B) **live editor over MCP** — agent drives an open editor and screenshots the viewport. A needs no MCP and is easier to secure and reproduce.
- Blender is the only fully free, GPL, scriptable path to *offline path-traced stills/video*; Unreal gives the most "impressive" real-time look but is heavy (32 GB RAM, ≥ 8 GB VRAM, ~90 GB for City Sample) and the official MCP is Experimental.
- The most credible *primary-source* "impressive" example in 2026 is Epic's own City Sample 5.8 page (Claude + PCG).

---

## 10. Conflicts & gaps

1. **UE 5.8 release date**: Epic's blog page is dated **June 23, 2026**; the PatchBot feed lists the "Unreal Engine 5.8 is now available" post on **Jun 17, 2026**. Treat as "June 2026". — Conflict (minor)
2. **Unreal subscription contents/price**: license page lists UE, Twinmotion and RealityScan as separate **$1,850/seat/yr** items; the FAQ says one **$1,850** "Unreal Subscription" includes UE + Twinmotion + RealityCapture; an Epic blog banner says "Beginning May 27, 2026, Unreal Subscriptions no longer include Twinmotion and RealityScan" yet the same article body is the 2024 UE 5.4 announcement. The headline numbers (5% over $1M lifetime; $1,850/seat for non-game > $1M company revenue) agree everywhere. — Conflict (bundle details)
3. **Chinese-language Epic spec page** still says Windows 10 build requirements while the English page says Windows 11 recommended. Used English. — Conflict (minor)
4. **Moved repos**: `ahujasid/blender-mcp` → `ahujasid/mcp-for-blender` (verified via README + PyPI + issue #366); `justinpbarnett/unity-mcp` → 301 (target inferred = `CoplayDev/unity-mcp`). GitHub API for the old URLs returned only "Moved Permanently" without printing the target. Stars quoted for new names.
5. **Licence field mismatch**: `chongdashu/unreal-mcp` README badge says MIT but GitHub API licence = none and no LICENSE file was found at root (raw 404); same "None" for flopperam, kvick-games, vvoovv/blosm, per-simmons harness. Treat as "licence unclear — check before reuse". `blender/blender` and NVIDIA repos show NOASSERTION (mixed licences).
6. **Houdini Indie price**: $299/yr (and $449/2 yr) in a 2026 third-party review vs **$269** on a SideFX industry page snippet (probably older). Houdini Engine: $525 (SideFX FAQ) vs $499 (third-party). SideFX says "With Houdini 21, Indie prices have been adjusted". Confirm on sidefx.com/buy before publishing.
7. **Unity**: Unity AI plan credit tiers (1,000 / 2,000 / 3,000 per month) are shown on the plans page but the mapping to Personal/Pro/Enterprise is not clear in snippets. Unity 6.7 docs already exist while 6.6 is the "current" download; 6.6 post calls itself the final Unity-6-family supported release. Whether the Unity CLI MCP offers official screenshot tools — not verified.
8. **CVE-2026-10688**: published 2026-06-02; status after the 2026-09 mcp-for-blender 2.0 rename not checked. GitHub rate-limited unauthenticated calls (60/h) after the first ~25 requests, so stars for a few small repos came from the search API (separate limit) — numbers are consistent but not cross-checked.
9. **Not researched / gaps**: Godot 4.7.x patch version; Godot MCP servers' screenshot tools; official Blender MCP licence and exact tool list; Roblox agent tooling; MetaHuman Creator current price; Lumen/Nanite hardware min-spec (DX12 SM6, etc.); exact Cycles/EEVEE render times on a specific current GPU (all timing numbers above are old, community, scene-specific); Buildify Blender 5.x compatibility; SceneCity v2 release status; Unity batchmode with GPU screenshot behaviour.
10. **Secondary-source dependence**: several facts (Unity AI replaces Muse; Unity Pro credit tiers; Houdini Engine price) come from search-engine synthesis or third-party sites and are tagged accordingly.
