# R6 — How AI agents build 3D scenes in practice (fact sheet)

Date of research: **2026-10-17**. Every count/price/star number below is "as of 2026-10-17" unless another date is given.
Tags: **Verified** = read in a primary source this session; **Practice** = widely repeated engineering practice / secondary source; **Inference** = my reasoning from facts; **Unverified** = not confirmed, treat as a lead.
Classification of demos (section 1): **Verified** = prompt AND code public (so a reader *can* try to reproduce; I did NOT re-run any of them), **Plausible** = partly public / credible but incomplete, **Promotional** = marketing or social-media claim without reproducible artefacts.
Model names (e.g. "Claude Fable 5", "GPT-6 Astra", "Opus 5.5") are quoted as they appear in the sources; I did not independently verify the models.

---

## 0. One-paragraph takeaway

"One short prompt" demos split into four very different things: (a) a genuinely short prompt plus a human chatting through many follow-ups (fly.pieter.com), (b) a *long, structured brief* (hundreds of words, hard floors, banned outcomes) executed by an agent for hours with self-screenshots (night-street, LAAS, AA-3D), (c) a single self-contained HTML file from one prompt in a chat/AI-Studio box (Gemini voxel/spaceship, GPT-5 launch) — usually a *toy-sized* scene, and (d) marketing clips with no prompt/code. Where prompts and repos are public, they show many agent turns, a screenshot feedback loop, and big token budgets — not "one sentence → AAA city".

---

## 1. Examples with public prompts and/or code

### 1.1 Table (name | date | model/agent | prompt public? | code public? | iteration documented | classification | URL)

| # | Name | Date | Model / agent | Prompt public? | Code public? | Iteration documented | Classification | URL |
|---|---|---|---|---|---|---|---|---|
| 1 | fly.pieter.com flight sim (Pieter Levels) | 2025-02-22 build start | Cursor + three.js; Grok 3 reportedly wrote the WebSocket server | First prompt public ("make a 3d flying game in browser with skyscrapers") | Not found open-source (game is live, JS is viewable in browser) — Unverified for a repo | Yes, heavily: "after many questions and comments from me", built live on X | Plausible (honest about iteration; commercial site, no repo) | https://levels.io/fly-pieter-com-vibecoded-flight-simulator ; https://www.unrollnow.com/status/1893350391158292550 ; https://fly.pieter.com/ |
| 2 | Gemini 3 "voxel eagle" / voxel_toy_box | 2025-11 (Gemini 3 launch; exact date Unverified) | Gemini 3, AI Studio | Yes (4 prompts in video description) | AI Studio bundled app (viewable); no standalone repo | Follow-up prompts are shown (dismantle → rebuild cat/rabbit) | Plausible (prompts public; app is a Google-built bundled template, see §2) | https://www.youtube.com/watch?v=3I4Te_ZSgqY |
| 3 | Gemini 3 "retro 3D spaceship game with a single prompt" | 2025-11 | Gemini 3, AI Studio | Yes — full multi-section spec, CDN/import-map/UnrealBloom instructions | AI Studio app `synthwave_space` | Not documented (single output shown) | Plausible (prompt is long and technical, not "short") | https://www.youtube.com/watch?v=qOL49DYWr7s |
| 4 | Gemini CLI "Golden Gate Bridge voxel" prompt | 2025-11 | Gemini 3 Pro in Gemini CLI | Yes (long structured brief: InstancedMesh cars, import map, no build step) | Output not published by Google in that post | No | Plausible (prompt public, result not reproducible from post) | https://developers.googleblog.com/5-things-to-try-with-gemini-3-pro-in-gemini-cli/ |
| 5 | GPT-5 launch "castle" demo | 2025-08 launch livestream | GPT-5 in Cursor | Prompt read out on stream ("create a beautiful castle…"); written launch page lists only a 2D "Jumping Ball Runner" prompt | Not public | Demo was "already generated to save time" per the presenter | Promotional (prompt paraphrased on stream, code not public) | https://www.youtube.com/watch?v=0Uu_VJeVVfo ; https://openai.com/index/introducing-gpt-5/ |
| 6 | OpenAI showcase "Glass Towers" | 2026 (date Unverified) | GPT-5.6 Ultra per page | Yes — initial prompt + later passes published | Standalone build published; repo Unverified | Yes: initial prompt, then "repeated passes", "intensive polish pass" | Plausible → near Verified (process shown by vendor; code not confirmed) | https://developers.openai.com/showcase/glass-towers |
| 7 | night-street (first-person walkable photoreal street) | 2026-08-10/11 | Claude (per Reddit post; exact model Unverified), Playwright, ffmpeg | **Yes — 5 key prompts verbatim in PROMPTS.md** (+ omitted "keep cooking" turns) | **Yes**, MIT, 129★ | **Yes, extensively** (blind-critic subagent loop, NOTES.md, bug list) | **Verified** (artefacts public; not re-run by me) | https://github.com/StarKnightt/night-street ; https://www.reddit.com/r/TopologyAI/comments/1vobf1y/an_llm_generated_this_complete_3d_scene_in_the/ |
| 8 | LAAS — 4×4 km procedural world (Claude Fable 5) | repo 2026-06-12 → last push 2026-07-25 | Claude Fable 5, Playwright+Chromium WebGPU | Brief `PROJECT_LAAS_v2.md` public (human-written, long) | **Yes**, MIT, 725★ | Yes (STATUS.md = agent memory, regression probes) | **Verified** (brief + code public) | https://github.com/Braffolk/fable5-world-demo |
| 9 | fable51-worlds ("a prompt in, a world you can walk out") | 2026-09-02 → 09-09 | Claude Fable 5.1 agent swarms; GPT-6 Astra comparison | Briefs per world in repo (per README); full set Unverified | **Yes**, MIT, 523★ | Pipeline described (recon→assets→runtime) | Plausible (swarms ≠ "one short prompt"; side-by-side with GPT-6 Astra is the author's own) | https://github.com/PhiloLabs/fable51-worlds |
| 10 | Claudepunk2077 (first-person cyberpunk district) | 2026-07-26 | Claude (per repo name; model Unverified) | **PROMPT.md public** | Yes, 3★, no licence listed | Some profiling data; 3 areas still "stub" | Verified-but-incomplete (honest "stub" status) | https://github.com/kalaanakonda/Claudepunk2077/ |
| 11 | Hajime Tsui "real-time coastal simulator" (Opus 5 vs GPT-5.6 Sol, same prompt) | 2026-07-26 / 07-29 / 08-05 | Claude Code Opus 5 Ultra/Max; ChatGPT Work GPT-5.6 Sol Max | **Yes** (shared on X + note.com, in Japanese) | Code shared? Unverified | Author says 2 prompt inputs for Opus; GPT run "one prompt, AI ran several hours" | Plausible (prompt public; "hours of agent time" disclosed) | https://note.com/hajimetwi3/n/n855b983143da?hl=en |
| 12 | WaterThreeJS (ocean above/below surface) | 2026-07-21 → 07-23 | Model not stated in README I read | Prompt not found | Yes, MIT, 100★; Gerstner waves, WebGL2, no WebGPU | No | Plausible (code public, provenance "AI-made" not confirmed — Unverified) | https://github.com/achrefelouafi/WaterThreeJS |
| 13 | Karpathy: Opus 5 renders opening of Lord of the Rings in three.js | 2026-08-02 | Claude Opus 5, 1M-token budget (~$10 est.), ~2 h, ~5,500 lines | One-sentence setup (via secondary source) | Not confirmed | Agent had to take screenshots at several points; jank admitted | Plausible (secondary blog only; primary post not read) | https://www.developersdigest.tech/blog/karpathy-opus-5-1m-token-lotr-threejs |
| 14 | Claude Fable 5 launch "photoreal forest" clip + X posts ("two prompts → Titanic game") | 2026-06-09 launch; posts 06-11 | Claude Fable 5 | No (asked "what's the prompt?" in replies, unanswered in snippet) | No | One reply says "I ran the prompt 'make it faster, without losing quality'" | **Promotional** | https://www.anthropic.com/news/claude-fable-5-mythos-5 ; https://digg.com/ai/bts64g87 ; https://twitterviewer.net/undefined/status/2065108290242052595 |
| 15 | Git City (every GitHub dev is a building) | 2026-02-20 repo; Reddit post 2026-02-24 | Claude | Not published (it is a 21k-line, 4-day project, not one prompt) | Yes, AGPL-3.0, 5,814★ | Author lists "where I had to step in" (architecture, UX, perf debugging) | Verified code / not "one prompt" | https://github.com/srizzon/git-city ; https://www.reddit.com/r/vibecoding/comments/1rdw12q/i_vibe_coded_a_3d_city_with_21000_lines_in_4_days/ |
| 16 | overdrive-city (open-world driving sandbox, no build, three r160 vendored) | 2026-07-17 | Model not stated | Not found | Yes, MIT, 2★ | No | Plausible | https://github.com/appleweiping/overdrive-city |
| 17 | Simon Willison "pelican riding a bicycle" (SVG analog) | 2024-10-25 → ongoing | many LLMs via `llm` CLI | **Yes** (one-line prompt) | Yes (script + outputs repo, 210★) | Follow-ups ("do better", "now animate it") shown in talk | **Verified** (as a text-to-SVG probe; not 3D) | https://simonwillison.net/2024/Oct/25/pelicans-on-a-bicycle/ ; https://github.com/simonw/pelican-bicycle |

### 1.2 Benchmarks that run fixed prompts across models (best evidence for "what one prompt really yields")

- **AA-3D (Artificial Analysis)**, launch article 2026-10-12: 55 tasks / 7 domains; each model is an *agent* in an offline sandbox (Blender, Rapier physics, Python, headless browser, CC0 asset library); stops at 3 h or 250 turns; output is one `index.html`; ranked by Elo from blind human pairwise votes (>10K panel votes). [https://artificialanalysis.ai/articles/aa-3d] **Verified**
  - Mean cost per scene ranges **$0.20 to $32.08** across models; input tokens ≈ 97–99 % of all tokens (agents resend context each turn). [same] **Verified**
  - Top five models first *look at an image of their own scene* after a median of 10–13 turns; looking early correlates with Elo (Spearman 0.82, across 19 image-capable models). Text-only models (GLM-5.3, Nemotron 3 Ultra) built scenes without seeing them. [same] **Verified**
  - Agents spend 82 % of tool time testing the page in a browser (screenshots / error checks). [same] **Verified**
  - Top-five Elo are statistically tied (95 % intervals overlap): Claude Sonnet 5.5 1194 headline vs 1197 on the evaluation page (two numbers on two pages, same date — see Conflicts). [https://artificialanalysis.ai/evaluations/aa-3d] **Verified**
  - Runs on Stirrup, an open-source agent harness (per article). **Verified** (harness repo not inspected)
- **threejseval.com**: 16 fixed scene prompts (Eiffel Tower, Forest, Sailboat, Chess, 747, Robot Arm, …); blind pairwise votes → Elo; cost/eval shown. Example: Opus 5.5 High mean Elo 2065 / $2.67 per eval / 1,261,569 tokens vs GPT-6.1 Sol High 1980 / $0.22 / 79,596 tokens (battles 1106 vs 491). [https://threejseval.com/models] **Verified** (page read 2026-10-17; "Last updated" field was blank in the capture)
- **TODO for AI "3DBench / ThreeJSBench"**: one-line design prompt → single-file three.js page; pins **three@0.182**, 1280×800, **headless Chrome**; publishes raw outputs, cost, time, fps; "Reproducible from the benchmarks repo". Lava Lamp run on 2026-10-06: 7 models, fps reported 28 / 26 / 7 / 2 / 13 / 21, one model timed out at 20 min with no index.html. [https://todofor.ai/bench/threejs-bench] **Verified**. *Inference:* fps in headless Chrome without a GPU may reflect software rendering, not the scene's real cost (see §3).
- **DaBench "Boat game, built by 7 models"**: same prompt ("ultra realistic water in three.js with a boat… single HTML file") run on 7 models, hosted via Claude Code / Codex CLI / OpenCode, costs shown. [https://dabench.ai/showcase/boat-game] **Verified** (page exists; I did not run the builds)
- **WebDev Arena / Arena (LMArena)**: users submit any web-app prompt; two models answer; vote; Bradley–Terry ratings; React/TypeScript/Tailwind system prompt + structured JSON output; E2B sandboxes; 10K-battle preference dataset on Hugging Face (10,501 rows, 149 MB). Launched Dec 2024; >80,000 votes at time of blog. **It is not a three.js-specific test.** [https://arena.ai/blog/webdev-arena ; https://huggingface.co/datasets/lmarena-ai/webdev-arena-preference-10k] **Verified**. Dataset card: Webdev Arena data on arena.ai starts 2025-11-12 for the newer `webdev` (Code Arena) subset. [https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset] **Verified**
- **Design Arena** has a `3d` category (Elo/Bradley–Terry; models with <15 votes dropped as of 2025-10-12; API arena=models&category=3d). [https://notes.designarena.ai/methodology/ ; https://docs.designarena.ai/api-reference/leaderboard] **Verified**
- **MC-Bench (Minecraft builds)**: models write JavaScript that builds a prompted structure inside Minecraft; users blind-vote; started by high-schooler Adi Singh (TechCrunch 2025-03-20); backend repo `mc-bench/mc-bench-backend` 36★, licence "NOASSERTION". [https://techcrunch.com/2025/03/20/a-high-schooler-built-a-website-that-lets-you-challenge-ai-models-to-a-minecraft-build-off/ ; https://github.com/mc-bench/mc-bench-backend] **Verified**
- **Pelican on a bicycle** (analog): Willison says he set it up "as a joke" and "should not be treated as a serious benchmark"; a Hugging Face OpenEnv doc says the canonical task is "saturated" (136 of 139 samples scored 1.000 on the structural layer) and quotes him that the correlation with real model quality "has been mostly severed now". [https://news.ycombinator.com/item?id=47880939 ; https://github.com/huggingface/openenv/blob/main/docs/source/environments/pelican_svg.md] **Verified**
- **Name clash warning:** "3D Arena" (Hugging Face) is, to my knowledge, about *text/image-to-3D-asset generators*, not LLM-written three.js. I did not verify it this session. **Unverified** — don't mix it up with the benchmarks above.
- **Sulat "Gemini 3.8 Flash one-shot demos"**: catalogue of 195 one-shot demos with prompts per demo (voxel airport, voxel kart, …). [https://gemini-3-8-flash.demos.sulat.com/] **Verified** (index page only; prompt quality/quantity per demo not audited)

---

## 2. Cherry-picking and hidden iteration

- fly.pieter.com: the creator's own words — "after many questions and comments from me I now have the official … Flight Simulator" and "This took 30 minutes" (first tweet); a news write-up says "three hours to a working prototype" for a different milestone. The widely told "one prompt" story is really *one first prompt + a long conversation*. [https://www.unrollnow.com/status/1893350391158292550 ; https://www.indiehackers.com/post/tech/pieter-levels-used-ai-to-build-a-viral-flight-simulator-in-3-hours-with-no-background-in-game-development-7CPfMr1yRLEwH6cC8xhE] **Verified**
- night-street PROMPTS.md: "five prompts that matter"; the rest ("keep cooking", "how much time left") omitted as noise; first brief defines 8 numbered systems, strict build order, and a *separate blind-critic sub-agent* that sees only renders. The "one prompt" in the title is a multi-paragraph brief and the back half of the build "was art direction against screenshots". [https://github.com/StarKnightt/night-street] **Verified**
- LAAS: "built roughly 99% by the model, with minimal human steering", but a human partially wrote a long brief document with hard floors and banned outcomes; agent keeps STATUS.md as durable memory between sessions (i.e., many sessions). [https://github.com/Braffolk/fable5-world-demo] **Verified**
- Token cost of "one prompt" (social post, unaudited): a comparison tweet lists "GPT-Sol Ultra: 35,192,545 tokens; Opus 5.0 Ultracode: 1,171,676,041 tokens; Fable 5.1 Ultracode: 127,366,207 tokens" for a single prompt, and says Fable's output ran at 5 fps and had to be sped up for the video. [https://www.24vids.com/video/same-prompt-gpt56-sol-vs-opus-5-all-in-threejsopus-produced-the-better-raw-p-tw-2091797484515323970] **Unverified** (social post, but consistent in order of magnitude with AA-3D's mean cost range above)
- Same source: "Opus produced the better raw visuals … cost ~10x more … needed an extra prompt just to fix the camera controls"; Sol "close on the first attempt, much faster and far cheaper". **Unverified** (anonymous video repost).
- Hajime Tsui: "It reached this level after just two prompt inputs"; GPT run "AI ran for several hours". "One prompt" hides hours of autonomous agent work. [https://note.com/hajimetwi3/n/n855b983143da?hl=en] **Verified** (author statement)
- Karpathy LOTR experiment (secondary): ~2 h agent run, 5,500 lines; model "could not watch its own render" well — screenshots at several points, slow, with retries. [https://www.developersdigest.tech/blog/karpathy-opus-5-1m-token-lotr-threejs] **Unverified** (secondary)
- Vendor templates: Google's "voxel_toy_box" and "synthwave_space" are *bundled AI Studio apps* (https://aistudio.google.com/apps/bundled/…) — i.e., curated showcase apps; the prompt shown in the video may be only part of the app's scaffolding/system prompt. **Inference** (I could not open AI Studio to inspect the app's system prompt). [https://www.youtube.com/watch?v=3I4Te_ZSgqY]
- OpenAI's own Glass Towers page shows the *initial prompt* then "repeated passes" and a "polish pass" — a vendor admitting the final look is not the first output. [https://developers.openai.com/showcase/glass-towers] **Verified**
- Launch-demo precedent: GPT-5 stream presenter, "I've already generated [it] just to save some time". [https://www.youtube.com/watch?v=0Uu_VJeVVfo] **Verified**
- Benchmarks reduce cherry-picking: AA-3D lists 55 tasks and blind votes, but note "top four statistically tied" and per-cell sample sizes of 2–10 scenes. [https://artificialanalysis.ai/articles/aa-3d] **Verified**

### Checklist to evaluate a "one prompt" 3D claim (my synthesis — **Inference**)
1. Is the *exact* prompt published (text, not a screenshot)? Is it short (<~100 words) or a multi-page brief?
2. Is the code in a public repo you can run (`git clone`, pinned `three` version, no private assets)?
3. Are *all* turns shown (chat export, commit history, PROMPTS.md)? "Two prompts" ≠ one.
4. Wall-clock and token/cost budget stated? (AA-3D: up to 3 h / 250 turns; costs $0.20–$32 per scene.)
5. Was it recorded on the creator's GPU in a video (editing, sped-up, 4K screen capture) and is the live build available to run on *your* machine?
6. Is the scene built on a vendor template (AI Studio bundled app) or on prior scaffolding from earlier sessions (e.g., night-street reused code comments from a previous project "jungle-trail")?
7. Does a neutral benchmark (AA-3D, threejseval, DaBench) show similar quality for the same model under fixed prompts?

---

## 3. How agents see their own output

### 3.1 Headless Chromium and WebGL
- Chromium docs: automatic SwiftShader fallback for WebGL is **deprecated**; context creation "will soon fail instead of falling back"; to opt in for testing use `--enable-unsafe-swiftshader`; "Chromium and other browsers do not guarantee WebGL availability. Please test and handle WebGL context creation failure". [https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md] **Verified**
- Documented switches in that doc: (1) `--use-gl=angle --use-angle=swiftshader` (SwANGLE as GL driver); (2) `--use-gl=angle --use-angle=swiftshader-webgl --enable-unsafe-swiftshader` (WebGL fallback); (3) `--use-vulkan`. [same] **Verified**
- Blink-dev "Intent to Remove: SwiftShader Fallback": warning in DevTools since Chrome 130; "Shipping on Desktop 137" estimated; Finch experiments from Chrome 139 (remove SwiftShader on macOS/Linux, replace with **WARP on Windows**); an enterprise policy to re-enable SwiftShader was added (2025-07-09); a poster notes no WebGL2 software fallback plans (2025-08-14: "No plans, unfortunately"). [https://groups.google.com/a/chromium.org/g/blink-dev/c/yhFguWS_3pM] **Verified**
- Chromium commit "Flip SwiftShader deprecation to launched" (AllowSwiftShaderFallback→disabled, AllowD3D11WarpFallback→enabled), Gerrit CL 7017458; commit date not shown on the page I fetched. [https://chromium.googlesource.com/chromium/src.git/+/e326b700b5131f328d262f596c58dcad20f7bb3c] **Verified** (existence); the claim "disabled by default from Chrome 141" appeared in a search-engine summary only — **Unverified**.
- Practical rule for agent harnesses: pass `--use-angle=swiftshader` (or the swiftshader-webgl form + `--enable-unsafe-swiftshader`) when no GPU is present, and *log* `renderer.getContext()`/`WEBGL_debug_renderer_info` so frame times are interpreted correctly. **Practice**
- Puppeteer and WebGL: a 2026 blog reports Puppeteer silently injects `--use-angle=swiftshader-webgl`, overriding a user's `--use-angle=vulkan`, fix = `ignoreDefaultArgs`. [https://tigerabrodi.blog/how-to-get-webgpu-in-headless-chrome-on-cloud-gpus] **Unverified** (single blog; check your Puppeteer version)
- *Consequence for benchmarks:* fps numbers measured in headless software rendering (e.g., ThreeJSBench's 2–28 fps) mean "CPU rasteriser speed", not "scene performance on your GPU". AA-3D instead reports **GPU time per frame on a test machine** (<1.3 ms median for every model). **Inference** from [https://todofor.ai/bench/threejs-bench] + [https://artificialanalysis.ai/articles/aa-3d]

### 3.2 Headless WebGPU
- Chrome for Developers blog (Puppeteer): headless Chrome disables GPU by default; on Linux use `--headless=new --use-angle=vulkan --enable-features=Vulkan --disable-vulkan-surface --enable-unsafe-webgpu` (+ `--no-sandbox` in containers). [https://developer.chrome.com/blog/supercharge-web-ai-testing] **Verified**
- Playwright users: WebGPU runs only in full Chromium (`channel: 'chromium'`), not default `headless_shell`; example flags include `--enable-unsafe-webgpu --enable-features=Vulkan,WebGPU --enable-unsafe-swiftshader --use-vulkan=swiftshader --use-angle=swiftshader` (software Vulkan when no GPU). [https://github.com/filipkunc/FilipKuncCom/blob/main/playwright.config.ts] **Practice** (one repo's config)
- WebGPU needs a **secure context**: `about:blank` fails, `http://localhost` works. [https://tigerabrodi.blog/how-to-get-webgpu-in-headless-chrome-on-cloud-gpus ; https://developer.chrome.com/docs/web-platform/webgpu/troubleshooting-tips] **Practice**
- LAAS README: WebGPU-only (no WebGL fallback), QA via Playwright driving Chromium **with a WebGPU/Metal adapter** (i.e., a real GPU on macOS), frame-aligned determinism. [https://github.com/Braffolk/fable5-world-demo] **Verified**
- Headless WebGPU on a GPU-less CI box is the weakest link: state depends on Chrome version/OS flags. **Inference**; always probe `await navigator.gpu.requestAdapter()` and fail loudly.

### 3.3 Tools agents use
- **microsoft/playwright-mcp** — 38,276★, Apache-2.0, last push 2026-10-16. README: "Uses Playwright's accessibility tree, not pixel-based input … No vision models needed"; tools include `browser_take_screenshot`, `browser_console_messages`, `browser_evaluate`, `browser_network_requests`; options `--headless`, `--isolated`, `--caps vision|pdf|devtools`; also says coding agents may prefer the **Playwright CLI + SKILLS** because CLI calls are more token-efficient. [https://github.com/microsoft/playwright-mcp ; stats via GitHub API 2026-10-17] **Verified**
- **ChromeDevTools/chrome-devtools-mcp** — 53,708★, Apache-2.0, last push 2026-10-16. README: performance traces/insights, network, **screenshots, console messages with source-mapped stack traces**; `--headless`, `--isolated`, `--slim`; **usage statistics collection is on by default** (opt out `--no-usage-statistics`); performance tools may send trace URLs to the CrUX API unless `--no-performance-crux`. [https://github.com/ChromeDevTools/chrome-devtools-mcp] **Verified**
- **anthropics/skills `webapp-testing`**: "Toolkit for interacting with and testing local web applications using Playwright … capturing browser screenshots, and viewing browser logs", with a `with_server.py` helper. [https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md] **Verified**
- **Anthropic computer use**: current toolset `computer_toolset_20260801` — one entry in `tools` gives 17 member tools (`screenshot`, `left_click`, `type`, `zoom`, …); no beta header; your app runs every call; model returns `tool_use` blocks with `toolset_name:"computer"`; earlier dated versions (`computer_20241022` … `computer_20251124`) used one `computer` tool + `action`. [https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool ; https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/README.md] **Verified**. Claude Code CLI has a built-in `computer-use` MCP server (off by default; docs describe macOS CLI; Desktop app on macOS/Windows). [https://code.claude.com/docs/en/computer-use] **Verified**
- Computer use is *overkill* for a WebGL page you can open headless; screenshots via Playwright are cheaper. **Inference**
- **Cursor IDE browser tool** (this environment): `browser_take_screenshot`, `browser_cdp` (Runtime.evaluate etc.) — fine for a local check; **Practice**.
- **Console error capture**: Playwright `page.on('console'|'pageerror')`, Playwright MCP `browser_console_messages`, DevTools MCP console messages. night-street found the entire audio system had been silent "from the day it was written" because a `ConvolverNode` threw and "the error was in the page console the whole time". [https://github.com/StarKnightt/night-street] **Verified**
- **FPS / cost measurement**:
  - `stats.js` (mrdoob): 9,151★, MIT, last push 2024-10-11 (stable, not maintained actively). [GitHub API 2026-10-17] **Verified**
  - `renderer.info` (draw calls, triangles) is the standard three.js counter — **Unverified** this session (docs page not fetched).
  - night-street measures frame cost with a **one-pixel `readPixels`**, not `glFinish`, because Chromium runs WebGL through a command buffer to a separate GPU process and `finish` returns early; Claudepunk2077 reports "median 2.6 ms, p95 6.1 ms" with `gl.finish()` around render. [https://github.com/StarKnightt/night-street ; https://github.com/kalaanakonda/Claudepunk2077/] **Verified** (author claims; I did not re-measure). Note the two repos disagree about the right fencing method — see Conflicts.
  - Concurrency pollutes measurements: two headless Chromium instances on one GPU "each run at half speed" (night-street `.capture.lock`). **Verified**
- **Vision-model review of screenshots**: AA-3D correlation of early self-viewing with rank (above); night-street's blind-critic sub-agent that sees *only* renders and judges against real photography; LAAS pixel sampling + frame diffs against baselines. **Verified**
- Limits: Karpathy-run reports agents "could not watch" animations efficiently — they sample stills. **Unverified** (secondary). *Inference:* screenshots can't judge motion smoothness, input latency, or shader aliasing; add scripted camera paths (`?cam=` URLs, `?freeze=1` like LAAS) so stills are reproducible.

---

## 4. Typical failure modes of LLM-written three.js code

Current three.js release: **r186**, published 2026-09-24; migration guide top section is r186→r187. three.js repo 116,535★, MIT. [GitHub API 2026-10-17; https://github.com/mrdoob/three.js/wiki/Migration-Guide] **Verified**

| Failure | Cause / what the docs say | Visible symptom | Source | Tag |
|---|---|---|---|---|
| `THREE.Geometry` | "`Geometry` has been removed from the core" at r125 (moved to `examples/jsm/deprecated/Geometry.js`); the deprecated file deleted in r141 | `TypeError: THREE.Geometry is not a constructor` | Migration guide (r124→r125, 140→141); https://discourse.threejs.org/t/three-geometry-is-out-of-date-any-new-one/39816 | Verified |
| `renderer.outputEncoding`, `THREE.sRGBEncoding`, `texture.encoding` | r152: replaced by `outputColorSpace`, `SRGBColorSpace`, `Texture.colorSpace`; `ColorManagement.enabled` true by default | Silent wrong colours; `texture.encoding = THREE.sRGBEncoding` just adds an unused property in r186 | Migration guide (151→152); https://gamesbyai.win/guides/threejs-with-ai-agents/ | Verified (guide) / Practice (symptom) |
| `physicallyCorrectLights` / legacy lights | r155: `useLegacyLights` defaults to `false` and is deprecated; earlier `physicallyCorrectLights = true` ≈ `useLegacyLights = false` | Wrong light intensities when old numbers are copied | Migration guide (154→155 section; "Updates to lighting in three.js r155" thread linked there) | Verified |
| `new THREE.Clock()` | Deprecated (replaced by `Timer` in r183, per one guide) | Compiles but deprecation warning | https://gamesbyai.win/guides/threejs-with-ai-agents/ | Practice |
| Old script tags / CDN paths | `three.min.js` global-script builds removed r161 (per guide); addons now via `three/addons/…` import map (import map required for bare `three`); official `llms.txt` marks cdnjs r128 pattern as "WRONG" | Black screen with module resolution error | https://threejs.org/docs/llms.txt ; https://threejs.org/manual/pages/installation.html ; gamesbyai guide | Verified (llms.txt/manual) |
| `three` and `three/addons/` version mismatch | Loads two copies of three; console: "Multiple instances of Three.js being imported" | Nothing renders, looks like a no-op | https://webcodingcenter.com/three-js/getting-started-with-three-js--an-import-map-from-jsdelivr-for-script-tag-projects.html ; https://agentgames.dev/blog/how-to-make-a-3d-game-with-ai | Practice |
| CDN availability | A forum report says unpkg stopped working for r175+ (CORS) and was slow; users moved to jsDelivr | All demos on the page break | https://discourse.threejs.org/t/is-the-usage-of-content-delivery-networks-cdn-for-deployment-recommended-discouraged/79586 | Practice / Unverified (forum anecdote) |
| `MeshStandardMaterial` with no lights | PBR needs light/environment | Fully black meshes; swap to `MeshBasicMaterial` to test | https://agentgames.dev/blog/how-to-make-a-3d-game-with-ai | Practice |
| Camera inside the object / missing near-far | Wrong position, near/far; forum answer: "Also need add camera near and far" and PerspectiveCamera args in the wrong order (fov, aspect, near, far) | Black/blank screen | https://discourse.threejs.org/t/three-geometry-is-out-of-date-any-new-one/39816 ; agentgames guide | Practice |
| Too many individual meshes | One mesh per object ⇒ many draw calls; use `InstancedMesh` (one geometry) or `BatchedMesh` (many geometries); BatchedMesh multi-draw slower than instancing beyond ~100k instances per one dev | Low fps despite small scene | https://discourse.threejs.org/t/how-to-choose-between-instancedmesh-and-batchedmesh/81221 ; https://github.com/mrdoob/three.js/issues/31935 | Practice |
| Mobile texture limits | `MAX_TEXTURE_SIZE` can be 4096 on phones; iOS may report 16k but crash with 8k RGBA | Missing textures/crash | https://github.com/KhronosGroup/WebGL/issues/3700 ; https://github.com/mrdoob/three.js/issues/27330 | Verified (Khronos issue reply) |
| Wrong scale / unit confusion, z-fighting, shadow acne | General 3D practice; not sourced this session | Flicker, tiny/huge objects | — | Unverified (no source fetched) |
| WebGPURenderer API drift | Imports moved to `three/webgpu` and `three/tsl`; `renderAsync` deprecated; init required; `colorBufferType`→`outputBufferType` | Import/runtime errors | Migration guide (WebGPURenderer entries) | Verified |

- Official mitigation: three.js publishes `https://threejs.org/docs/llms.txt` and `llms-full.txt` telling LLMs to use import maps and pin the latest version. [https://threejs.org/docs/llms.txt] **Verified**
- Migration-guide hygiene: "update in increments of 10; deprecation warnings last for 10 releases" — models trained on old code often straddle removed APIs. [https://github.com/mrdoob/three.js/wiki/Migration-Guide] **Verified**
- Mitigation checklist for the first prompt: pin the version, forbid listed APIs, require a local HTTP server, run a smoke test that fails on any console error. **Practice**
- In AA-3D, 23 scenes of 1,008 "break on the voting page" (excluded) and 22 % of the most-detailed fifth of screenshots are empty vs 60 % for the least-detailed fifth — blank/broken pages are common at the weak end. [https://artificialanalysis.ai/articles/aa-3d] **Verified**

---

## 5. Agent skills / rules for 3D

| Repo | Stars (2026-10-17) | Licence | Last push | What it is | Source |
|---|---|---|---|---|---|
| anthropics/skills | 181,708 | not detected by API (README: mix of Apache-2.0 and source-available doc skills) | 2026-10-09 | Official skills examples; **no three.js/R3F/Blender skill** in `skills/`; relevant: `webapp-testing`, `web-artifacts-builder`, `frontend-design`, `algorithmic-art`, `canvas-design` | https://github.com/anthropics/skills |
| CloudAI-X/threejs-skills | 3,588 | none listed | 2026-07-09 | 10 three.js skill files (fundamentals, geometry, materials, lighting, textures, animation, loaders, shaders, postprocessing, interaction); "audited against official docs (r160+)" | https://github.com/cloudai-x/threejs-skills |
| dgreenheck/webgpu-claude-skill | 1,252 | not stated in snippet | 2026-04-10 | WebGPU + TSL skill; Claude skill + `.cursor/rules/*.mdc` shims | https://github.com/dgreenheck/webgpu-claude-skill |
| scottstts/Threejs-Awesome-Graphics-Agent-Skills | 908 (search snapshot; API timed out) | MIT | created 2026-06-19 | skill router, camera direction, procedural materials, spectral ocean…; installs for codex/claude-code/cursor/windsurf etc. | https://github.com/scottstts/Threejs-Awesome-Graphics-Agent-Skills |
| EnzeD/r3f-skills | 129 | n/a | 2026-08-31 | 11 R3F skills (Claude Code, Codex, OpenCode, Cursor) | https://github.com/enzed/r3f-skills |
| emalorenzo/three-agent-skills | 62 | n/a | 2026-01-28 | `three-best-practices` (100+ rules), `r3f-best-practices` (60+ rules) | https://github.com/emalorenzo/three-agent-skills/ |
| ahujasid/blender-mcp | 31,338 | MIT | 2026-10-06 | Blender ↔ LLM bridge (MCP); referenced by otra.city for GLB building | https://github.com/ahujasid/blender-mcp ; https://www.reddit.com/r/ClaudeCode/comments/1w62rv5/i_built_a_3d_city_where_ai_agents_build/ |

- All above: **Verified** for existence/stars/licence via GitHub API or repo page on 2026-10-17 (except scottstts stars).
- **Evidence on usefulness is thin and mixed.** night-street's own survey (docs/TECHNIQUE.md): the installed `threejs-*` skills (cloudai-x package) are "flat API catalogues with no measurement … several recommendations actively wrong here"; skills "tell an agent what an API is" but were "no help … with what number to put in it"; the most useful source was the *previous project's code comments*. [https://github.com/StarKnightt/night-street] **Verified** (author's opinion, one project)
- No controlled study of skill vs no-skill on three.js found. **Unverified / gap.**
- Claude skills location (`.claude/skills`), Cursor rules (`.cursor/rules/*.mdc`) per repo READMEs. **Verified**

---

## 6. Real-time scene → video

### 6.1 MediaRecorder + `canvas.captureStream`
- MDN example: `canvas.captureStream(25)` → `new MediaRecorder(stream, {mimeType: "video/webm; codecs=vp9"})`; use `MediaRecorder.isTypeSupported()` to check codecs. [https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API] **Verified**
- Real-time only: frames are captured as the browser renders, so dropped/late frames are baked in; WebM is inherently variable-frame-rate. Mozilla bug 1231848 documents `captureStream(0)+requestFrame()` still producing constant 30 fps WebM in Firefox (VFR expectation not met); a reviewer notes "WebM is inherently variable framerate". [https://bugzilla.mozilla.org/show_bug.cgi?id=1231848] **Verified** (Firefox, older bug)
- Chrome: from **Chrome 140**, non-chunked recordings have WebM `Duration`; chunked/`requestData()` recordings don't; `Cues` never present → slow seeking; Chrome also offers MP4 container but MP4 from Chrome/Safari "lack immediately available duration metadata". Fix by remux (no re-encode): `ffmpeg -i recording.webm -c copy -cues_to_front 1 fixed.webm`; for MP4: `ffmpeg -i recording.webm -c:v libx264 -crf 23 -c:a aac -movflags +faststart recording.mp4`. [https://blog.addpipe.com/duration-in-webm-videos-produced-by-chrome/ ; https://www.ffmpeg-micro.com/blog/mediarecorder-webm-isn-t-broken-convert-it-to-mp4-server-side] **Verified** (blogs; Chromium issue 40482588 cited as open)
- `fix-webm-duration`: 306★, MIT, last push 2024-07-11 — patches duration only, no Cues. [GitHub API] **Verified**
- Don't force `-r 30` on a variable-frame-rate screen recording: "introduces drift". [ffmpeg-micro blog above] **Practice**

### 6.2 CCapture.js
- `spite/ccapture.js`: **3,777★, MIT**, last push 2026-07-27. The README in the repo now describes a **ground-up rewrite** (ES modules, WebCodecs, GPU motion blur, async/await), `new CCapture({ format: "mp4", framerate: 60, timeLimit: 5 })`, with a virtual clock (`TimeWarp`) that hooks `performance.now`, `requestAnimationFrame`, timers, `Date`, media `currentTime`. Commit history shows `Co-Authored-By: Claude Opus 4.8` on a 2026-07-27 commit. [https://github.com/spite/ccapture.js ; GitHub API] **Verified**
- *Conflict with older knowledge:* the classic CCapture (2015–) used WebM/PNG/gif workers; blog posts and AI training data describe that older API. Check the README version before copying snippets. **Inference**
- "hookDate trade-off" and browser caveats are documented in the README (not read in full). **Unverified detail**

### 6.3 WebCodecs + muxers
- **mediabunny** (Vanilagy): 7,319★, MPL-2.0, last push 2026-10-16; pure TypeScript, zero dependencies, "hardware-accelerated decoding & encoding (via the WebCodecs API)", writes mp4/webm/mkv etc.; successor of `mp4-muxer`/`webm-muxer` ("you should migrate to Mediabunny"). Server-side via `@mediabunny/server`. [https://mediabunny.dev/guide/introduction ; GitHub API] **Verified**
- `mp4-muxer`: 616★, MIT, last push 2025-09-21 (superseded). [GitHub API] **Verified**
- Pattern: render frame *i* at fixed time `i/fps` → `new VideoFrame(canvas, {timestamp})` → `VideoEncoder.encode` → muxer. Deterministic because you control time, not wall clock. **Inference** (from WebCodecs/mediabunny design; no tutorial fetched)
- The `preserveDrawingBuffer` / read-back timing details for WebGL → `VideoFrame` — **Unverified**; test that canvas is rendered before `new VideoFrame`.

### 6.4 Deterministic capture with Puppeteer
- `puppeteer-capture` (alexey-pelykh): 22★, MIT, last push 2026-10-17. Uses CDP `HeadlessExperimental.beginFrame` + `--deterministic-mode` + `--enable-begin-frame-control`; overrides `performance.now`, `Date`, `requestAnimationFrame`, `setTimeout`/`setInterval`; encodes with ffmpeg; `recorder.waitForTimeout()` advances *page time*; per search summary requires **chrome-headless-shell**, not `--headless=new`. [https://github.com/alexey-pelykh/puppeteer-capture ; https://www.npmjs.com/package/puppeteer-capture] **Verified** (README); chrome-headless-shell requirement **Unverified** (summary only)
- `timecut`/`timesnap`/`timeweb` (tungs): 654★ / 240★, BSD-3-Clause, last push 2023-07 / 2024-01. Virtualises time; `--canvas-capture-mode` (experimental) reads canvas pixels; `immediate:png` mode sometimes needed for WebGL. [https://github.com/tungs/timecut/blob/main/README.md ; GitHub API] **Verified**; unmaintained since 2023–24 → **Practice**: still works for simple canvases, risky on current Chrome.
- WebGL+deterministic+headless GPU: you still need real GPU or SwiftShader (§3) — software rendering makes frame capture slow but deterministic. **Inference**
- night-street's `tools/reel.mjs` drives real input (`KeyW` keydown) and Playwright captures, ffmpeg encodes/measures — a working example of agent-made video from a first-person walk. [https://github.com/StarKnightt/night-street] **Verified** (README)
- LAAS provides `?cam=`, `?shot=`, `?freeze=1`, `?T=hours` URL parameters and a scripted 90-second flythrough (key F) — a pattern to copy so a headless script can reproduce shots. [https://github.com/Braffolk/fable5-world-demo] **Verified**

### 6.5 ffmpeg and OBS
- ffmpeg assembly of PNG frames (`-framerate 60 -i frame_%05d.png -c:v libx264 -pix_fmt yuv420p`) — standard practice, **Practice** (no source fetched).
- OBS Studio (window/display capture): real-time capture on your GPU; subject to dropped frames; no source fetched. **Unverified**
- Decision rule (**Inference**): for a polished fly-through video, prefer deterministic fixed-timestep rendering (CCapture/puppeteer-capture/WebCodecs) over real-time recording; use OBS/MediaRecorder only to show true real-time behaviour.

---

## 7. Hosting and sharing (all limits read 2026-10-17)

| Host | Free-tier facts (relevant to a static three.js scene) | Source | Tag |
|---|---|---|---|
| GitHub Pages | Published site ≤ **1 GB**; source repo recommended ≤ 1 GB; **soft bandwidth 100 GB/month**; soft 10 builds/hour (not with custom Actions workflow); deploy timeout 10 min. Git blocks files **> 100 MiB** (warning > 50 MiB); use Git LFS or Releases. | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits ; https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github | Verified |
| Cloudflare Pages (Free) | **20,000 files** per site; **25 MiB** max single asset; drag-and-drop upload: 1,000 files; paid plans up to 100,000 files (changelog 2026-01-23); larger files → R2 | https://developers.cloudflare.com/pages/platform/limits/ ; https://developers.cloudflare.com/pages/get-started/direct-upload/ ; https://developers.cloudflare.com/changelog/post/2026-01-23-pages-file-limit-increase/ | Verified |
| Netlify (Free, credit-based) | 300 credits/month, **hard limit** (projects pause when exhausted); bandwidth 20 credits/GB (≈ 15 GB if only bandwidth); production deploy 15 credits; 2 credits per 10k requests; credit rates changed 2026-04-14 (bandwidth was 10 credits/GB) | https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ ; https://www.netlify.com/changelog/2026-04-14-pricing-updates-april-2026/ | Verified |
| Vercel (Hobby) | 100 GB Fast Data Transfer, 1,000,000 CDN requests, 10 GB Fast Origin Transfer per month; **non-commercial personal use only**; exceed → pause until 30 days pass | https://vercel.com/docs/plans/hobby ; https://vercel.com/docs/limits/fair-use-guidelines | Verified |
| itch.io (HTML5) | ZIP with `index.html`; ≤ **1,000 files** extracted; path ≤ 240 chars; ≤ **500 MB** total extracted; ≤ **200 MB** per file; case-sensitive names; optional "SharedArrayBuffer support" checkbox | https://itch.io/docs/creators/html5 ; https://itch.io/t/2025776/experimental-sharedarraybuffer-support | Verified |
| CodePen / JSFiddle | Limits not researched (single-file demos, external imports via import map) — pin versions per §4 | — | Unverified |

- File-size rule of thumb (**Inference**): AI-generated *procedural* scenes (night-street, overdrive-city, Claudepunk2077: "no external assets") are typically a few hundred KB–MB of JS, so hosting limits are irrelevant; limits bite once you add GLB/HDR/textures (Cloudflare 25 MiB per file is the tightest here; three core alone is ~2.1 MB raw / ~400 KB Brotli per one guide [https://webcodingcenter.com/...]).
- **COOP/COEP & SharedArrayBuffer**: SAB requires cross-origin isolation (COOP `same-origin` + COEP `require-corp`/`credentialless`). Plain three.js does **not** need SAB; Wasm threads / some physics builds / ffmpeg.wasm do. **Practice**
  - GitHub Pages cannot set custom headers; workaround `coi-serviceworker` (585★, MIT, last push 2023-12) — must be same-origin file (not CDN), HTTPS/localhost only, reloads page once on first load. [https://github.com/gzuidhof/coi-serviceworker ; https://docs.wasmer.io/sdk/wasmer-js/how-to/coop-coep-headers/] **Verified**
  - Cloudflare Pages: add a `_headers` file (applies to static assets; not to Pages Functions responses). [https://developers.cloudflare.com/pages/configuration/headers/] **Verified**
  - itch.io: opt-in SAB checkbox uses a secondary CDN domain (`html.itch.zone`) and COEP `credentialless` on the embedding page; Safari lacks `credentialless`; embedding your itch game in your own iframe requires your page to send compatible headers. [https://itch.io/t/2025776/... ; https://itch.io/t/3288882/...] **Verified**
  - Netlify/Vercel: custom headers via `_headers` / `vercel.json` — **Unverified** this session (not fetched).
- Tip: check `window.crossOriginIsolated === true` in console. **Practice**

---

## 8. GPUs, laptops, Windows flags

- On Windows hybrid-graphics laptops, Chrome may run on the power-saving integrated GPU. Practical fix: Settings → System → Display → Graphics → add `chrome.exe` → Options → **High performance**, restart Chrome, confirm in `chrome://gpu`. [https://help.propelleraero.com/hc/en-us/articles/33509635813015-Optimizing-Platform-Performance-on-Windows-Laptops ; https://support.google.com/chrome/thread/364184564/chrome-not-utilising-full-120hz-on-windows-11?hl=en] **Practice** (vendor help / community)
- WebGL `powerPreference` doesn't reliably select the GPU on Windows: Chrome team member said (2019, Khronos list) "On Windows, Chrome and ANGLE don't currently have the ability to select a particular GPU … The first device enumerated by the driver … is the one that will be used". Chrome 80 changed WebGL default `powerPreference` from high-performance to low-power. A later mailing-list answer suggests `--force_high_performance_gpu` or Windows DXGI preference. [https://www.khronos.org/webgl/public-mailing-list/public_webgl/1912/msg00003.php ; https://groups.google.com/g/webgl-dev-list/c/gf0NHCFQkMM] **Verified** (2019–2020 statements; current state **Unverified**)
- Chrome on Windows uses **ANGLE with the D3D11 backend** by default; `chrome://flags` "Choose ANGLE graphics backend" offers D3D11/D3D11on12/OpenGL (community troubleshooting). [Chrome support thread above] **Practice**
- Verify the unmasked renderer via `WEBGL_debug_renderer_info`. [webgl-dev-list thread above] **Verified**
- night-street's measurements: RTX 4060 laptop(?) through ANGLE on D3D11 (README says "RTX 4060 through ANGLE on D3D11"; laptop/desktop not stated); 69 draw calls, ~1,034,000 triangles; vsync-capped 60 fps; first-frame cost dominated by shader compilation (ANGLE HLSL translation in the GPU process). [https://github.com/StarKnightt/night-street] **Verified** (author's measurement)
- Mobile: draw-call budget guidance 50–100 draw calls and 50k–100k triangles per frame (Oculus Quest guidelines quoted by a forum regular, "just a guess"); 2K PNG ≈ 22 MB VRAM with mips; use KTX2/compressed textures. [https://discourse.threejs.org/t/three-scene-optimization-texture-size-calculation-in-gpu-compression-merge-meshes-what-the-limits/23972] **Practice**
- Mobile `MAX_TEXTURE_SIZE` may be 4096 (Khronos issue). [https://github.com/KhronosGroup/WebGL/issues/3700] **Verified**
- AA-3D says every model's median frame is < 1.3 ms GPU time "on our test machine" — so "AI scenes run fast" is not evidence about *your* integrated GPU or phone. **Inference** [https://artificialanalysis.ai/articles/aa-3d]
- Integrated-GPU vs discrete numbers/benchmarks: not researched. **Unverified**

---

## 9. Conflicts & gaps

**Conflicts**
1. *AA-3D headline:* article says Claude Sonnet 5.5 "first at 1194"; evaluation page says 1197±33 — both dated 2026-10-12; likely rounding/update drift. Use ranges not points (top 4 tied). [https://artificialanalysis.ai/articles/aa-3d vs https://artificialanalysis.ai/evaluations/aa-3d]
2. *"One prompt" vs reality:* headlines (Anthropic launch tweets, Vibin, Misbah Syed "two prompts") vs repos (night-street five prompts + critic loop; LAAS long brief + multi-session STATUS.md; Hajime "several hours").
3. *Glass Towers model name* in the search summary ("GPT-5.6 Ultra" vs "GPT-5 launch") — the page itself says GPT-5.6 Ultra; the GPT-5 launch page lists a 2D game, not this one.
4. *SwiftShader state:* blink-dev says "Shipping on Desktop 137"/Finch experiment from 139; a search summary says "disabled by default in Chrome 141+". I could not confirm 141. Treat Chrome version of full removal as **Unverified**; the opt-in flags are stable.
5. *Frame timing method:* night-street says `glFinish` doesn't wait for GPU in Chromium (use `readPixels`); Claudepunk2077 reports numbers measured with `gl.finish()`. Not reconciled.
6. *Skill usefulness:* repo READMEs claim audits against docs (r160+); night-street author found them "actively wrong" for high-end rendering. Different goals (API correctness vs. visual quality) — not directly contradictory.
7. *CCapture:* classic fame/knowledge vs 2026 rewrite README (WebCodecs, mp4). Docs and AI memory about CCapture may be outdated.
8. *Playwright MCP stars:* WebFetch of the GitHub page showed "0 stars" (scrape artefact); GitHub API shows 38,276. API value used.
9. *GitHub star numbers* for skill repos differ slightly between search snapshot and API (e.g., EnzeD 93 vs 129, dgreenheck 1,249 vs 1,252) — API (2026-10-17) used.

**Gaps (not done / not verified)**
- I did not **run or reproduce** any demo (the "Verified" class means artefacts are public, not that results were reproduced).
- fly.pieter.com: no public repo found; exact models per milestone beyond "Cursor + Grok 3 server code" not confirmed.
- Google AI Studio bundled-app system prompts not inspectable; Gemini 3 launch dates not confirmed to the day.
- No primary-source read of: Karpathy's post, Claude Fable 5 launch video details beyond text, OpenAI GPT-6 launch demos, r/threejs threads, X posts (only mirrors/summaries).
- `renderer.info`, stats.js usage docs, three.js manual on disposing/perf: not fetched. OBS and plain ffmpeg image-sequence recipe: no source fetched.
- WebCodecs `VideoEncoder` codec support matrix (Chrome/Edge/Safari/Firefox) not researched.
- CodePen/JSFiddle limits, Netlify/Vercel header config for COOP/COEP not researched.
- Real numbers for integrated GPU vs discrete vs mobile fps with a given scene: none found.
- No controlled study that skills/rules improve three.js output; only anecdote (night-street).
- Whether `chrome-headless-shell` vs `--headless=new` is required for `puppeteer-capture` in current versions: summary-level only.
- "3D Arena" (Hugging Face) not verified; avoid conflation.
