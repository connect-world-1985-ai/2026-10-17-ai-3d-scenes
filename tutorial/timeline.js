window.TIMELINE = {
  "duration": 2156.448,
  "voice": "en-US-AndrewNeural",
  "chapters": [
    {
      "title": "Opening",
      "start": 0.0,
      "end": 59.04
    },
    {
      "title": "Where pixels come from",
      "start": 59.04,
      "end": 257.832
    },
    {
      "title": "Inside one frame",
      "start": 257.832,
      "end": 627.624
    },
    {
      "title": "Light, shaders, cost",
      "start": 627.624,
      "end": 983.136
    },
    {
      "title": "Two recipes",
      "start": 983.136,
      "end": 1272.488
    },
    {
      "title": "The agent",
      "start": 1272.488,
      "end": 1710.12
    },
    {
      "title": "One prompt",
      "start": 1710.12,
      "end": 1858.08
    },
    {
      "title": "Your first scene",
      "start": 1858.08,
      "end": 2156.448
    }
  ],
  "scenes": [
    {
      "id": "title",
      "chapter": "Opening",
      "visual": "title",
      "title": "How an agent actually builds a 3D scene",
      "subtitle": "A lesson from the field guide, taught from the pixels inward",
      "start": 0.0,
      "end": 28.968,
      "lines": [
        {
          "say": "This lesson is about the three dimensional clips you keep seeing an agent make.",
          "show": "This lesson is about the 3D clips you keep seeing an agent make.",
          "beat": "open",
          "start": 1.0,
          "end": 5.752
        },
        {
          "say": "A city at night. An ocean under a low sun. Someone walking a street.",
          "show": "A city at night. An ocean under a low sun. A walk down a street.",
          "beat": "clips",
          "start": 6.072,
          "end": 10.992
        },
        {
          "say": "The caption usually says it came from one short prompt.",
          "show": "The caption usually says: one short prompt.",
          "beat": "claim",
          "start": 11.312,
          "end": 14.72
        },
        {
          "say": "By the end, you will be able to watch a clip like that and explain it from the inside out.",
          "show": "By the end you can explain a clip like that from the inside out.",
          "beat": "promise",
          "start": 15.04,
          "end": 20.44
        },
        {
          "say": "Where the pixels come from. What the agent actually wrote. What the graphics card is doing. And which part of the story is marketing.",
          "show": "Pixels, the code, the graphics card, and the marketing.",
          "beat": "promise",
          "start": 20.76,
          "end": 28.248
        }
      ]
    },
    {
      "id": "hook",
      "chapter": "Opening",
      "visual": "clips",
      "title": "Three clips can share a thumbnail and share nothing else",
      "subtitle": "Same mood. Completely different machines.",
      "start": 28.968,
      "end": 59.04,
      "lines": [
        {
          "say": "Those three clips can look identical in a social media post, and share nothing underneath.",
          "show": "The same thumbnail can hide completely different machines.",
          "beat": "all",
          "start": 28.968,
          "end": 34.632
        },
        {
          "say": "One of them is a few hundred lines of JavaScript. The agent wrote ordinary code, and the browser draws it live.",
          "show": "One is a few hundred lines of JavaScript, drawn live.",
          "beat": "code",
          "start": 34.952,
          "end": 42.272
        },
        {
          "say": "Another is a scan of a real city. The agent may only have written the camera path. The buildings belong to the map company.",
          "show": "One is a scan of a real city. The agent wrote the camera path.",
          "beat": "scan",
          "start": 42.592,
          "end": 50.248
        },
        {
          "say": "A third is not three dimensional at all. It is a generated video. There is nothing to walk around, and nothing to export.",
          "show": "One is generated video. Nothing to walk around. Nothing to export.",
          "beat": "video",
          "start": 50.568,
          "end": 58.32
        }
      ]
    },
    {
      "id": "question",
      "chapter": "Where pixels come from",
      "visual": "question",
      "title": "Where do the pixels come from?",
      "subtitle": "Ask this before you ask which model.",
      "start": 59.04,
      "end": 83.928,
      "lines": [
        {
          "say": "So the useful first question is not which model wrote it.",
          "show": "The useful first question is not which model.",
          "beat": "q",
          "start": 59.04,
          "end": 62.544
        },
        {
          "say": "The useful first question is: where do the pixels come from?",
          "show": "Where do the pixels come from?",
          "beat": "q",
          "start": 62.864,
          "end": 66.536
        },
        {
          "say": "Every frame is a grid of colors. Something has to choose the color of each pixel.",
          "show": "Every frame is a grid of colors. Something chooses each one.",
          "beat": "grid",
          "start": 66.856,
          "end": 72.16
        },
        {
          "say": "If the picture is interactive, it has to do that about sixty times a second. Call it a budget of seventeen milliseconds per frame. Miss the budget, and the picture stutters.",
          "show": "Interactive means about 60 times a second. A 17 millisecond budget.",
          "beat": "budget",
          "start": 72.48,
          "end": 83.208
        }
      ]
    },
    {
      "id": "families",
      "chapter": "Where pixels come from",
      "visual": "cards",
      "title": "Four families of answers",
      "subtitle": "Code, capture, a generated asset, or no geometry at all.",
      "start": 83.928,
      "end": 174.352,
      "lines": [
        {
          "say": "There are four families of answers. Learn to tell them apart, and the rest of the lesson has a place to sit.",
          "show": "Four families. Everything else in this lesson sits inside one of them.",
          "beat": "0",
          "start": 83.928,
          "end": 90.216
        },
        {
          "say": "Family one. The agent writes geometry as code. The graphics card draws triangles, or it walks rays through a mathematical surface. A browser scene, a shader, a game engine, or a Blender script. You can edit it, and you can move the camera yourself.",
          "show": "Family 1: the agent writes geometry. You can edit it and move the camera.",
          "beat": "0",
          "start": 90.536,
          "end": 107.336
        },
        {
          "say": "Family two. The geometry was measured in the real world. Google's photorealistic three dimensional tiles. A photogrammetry mesh. A cloud of Gaussians, called a splat. The realism belongs to the capture. Lighting is often baked in, so a time of day slider does nothing.",
          "show": "Family 2: measured geometry. The realism belongs to the capture, and the light is often baked in.",
          "beat": "1",
          "start": 107.656,
          "end": 125.992
        },
        {
          "say": "Family three. A neural model invents an asset. Meshy, Tripo, or Trellis returns a mesh. Marble returns a world you can export. You can drop that asset into a scene. You do not control its taste frame by frame.",
          "show": "Family 3: a model invents a mesh or a world. You place it. You do not direct every pixel.",
          "beat": "2",
          "start": 126.312,
          "end": 140.784
        },
        {
          "say": "Family four. There is no geometry. Genie, Veo, Kling, Runway paint pixels directly. Windows and signs change between shots. Text mutates. You have a film, not a scene.",
          "show": "Family 4: no geometry. If signs change between shots, you are watching a film.",
          "beat": "3",
          "start": 141.104,
          "end": 154.688
        },
        {
          "say": "The strongest real demos are hybrids. An agent written browser scene, plus a public domain sky, plus a few downloaded props. Or the same scene, with a real city streamed in behind it. The agent did not make every pixel. It assembled sources that already knew how to look good.",
          "show": "The strongest demos are hybrids. The agent assembles sources that already know how to look good.",
          "beat": "all",
          "start": 155.008,
          "end": 173.632
        }
      ],
      "cards": [
        {
          "h": "1 · Code",
          "p": "The agent writes geometry. The GPU draws triangles, or walks rays through math."
        },
        {
          "h": "2 · Capture",
          "p": "The world was measured. Tiles, photogrammetry, Gaussian splats. Lighting is often baked in."
        },
        {
          "h": "3 · Generated asset",
          "p": "A network invents a mesh or a world. You place it. You do not repaint each frame."
        },
        {
          "h": "4 · No geometry",
          "p": "A network paints pixels. Genie, Veo, Kling, Runway. A film, not a scene."
        }
      ]
    },
    {
      "id": "spotting",
      "chapter": "Where pixels come from",
      "visual": "checks",
      "title": "A checklist for the next clip",
      "subtitle": "Run it in order. Stop at the first yes.",
      "start": 174.352,
      "end": 257.832,
      "lines": [
        {
          "say": "Here is a checklist you can run on the next clip. Go in order, and stop at the first clear yes.",
          "show": "Run this in order. Stop at the first clear yes.",
          "beat": "0",
          "start": 174.352,
          "end": 180.304
        },
        {
          "say": "Can the viewer move freely? If the camera only follows a fixed path, it could be anything, including a video. Ask for a live link before you believe the caption.",
          "show": "Free camera, or a fixed path? A fixed path could be a video. Ask for a live link.",
          "beat": "0",
          "start": 180.624,
          "end": 190.824
        },
        {
          "say": "Is there a logo or a credits line? Google Maps, Open Street Map, Cesium. Then the city is data, not a model the agent invented.",
          "show": "A Google, OpenStreetMap, or Cesium credit means the city is data.",
          "beat": "1",
          "start": 191.144,
          "end": 200.36
        },
        {
          "say": "Do the edges look soft, with haze and little floaters near the camera? That is usually a Gaussian splat. A person took the photographs. The agent may only have built the viewer.",
          "show": "Soft edges and floaters: usually a Gaussian splat. Someone took the photos.",
          "beat": "2",
          "start": 200.68,
          "end": 211.792
        },
        {
          "say": "Do details change between shots, or does the clip cut every few seconds? Generated video. There is no scene behind the cut.",
          "show": "Changing details, or a cut every few seconds: generated video.",
          "beat": "3",
          "start": 212.112,
          "end": 220.608
        },
        {
          "say": "Do the buildings repeat, with the same shapes and windows painted by a shader? That is procedural code. This is the family we are about to open up, because it is the one you can learn, line by line.",
          "show": "Repeated buildings and shader windows: procedural code. We open this one up.",
          "beat": "4",
          "start": 220.928,
          "end": 233.24
        },
        {
          "say": "Dense photoreal foliage, and an editor on screen, means Unreal, Unity, or a similar engine. The agent is driving systems that already exist. It is not modeling every leaf.",
          "show": "Dense foliage plus an editor: the agent is driving an engine, not modeling leaves.",
          "beat": "5",
          "start": 233.56,
          "end": 245.872
        },
        {
          "say": "For learning, start with the browser. It is free. It is text in and text out. A headless browser can screenshot it, which, as you will see, is the whole game.",
          "show": "Start with the browser. Text in, text out, and a screenshot the agent can see.",
          "beat": "6",
          "start": 246.192,
          "end": 257.112
        }
      ],
      "checks": [
        "Can you move freely, or only along a path?",
        "Is there a logo or a credits line?",
        "Soft edges, haze, floaters near the camera?",
        "Cuts every few seconds, or details that change?",
        "Repeated buildings, windows drawn by a shader?",
        "Film-grade foliage and an editor on screen?",
        "A public repository, with the prompts?"
      ]
    },
    {
      "id": "skeleton",
      "chapter": "Inside one frame",
      "visual": "code",
      "title": "Most impressive browser demos are ordinary code",
      "subtitle": "Six things, always in the same order.",
      "start": 257.832,
      "end": 362.952,
      "lines": [
        {
          "say": "Most of the impressive browser demos are ordinary code. The agent is not inventing a renderer. It is assembling techniques it has already seen thousands of times.",
          "show": "Most impressive browser demos are ordinary code. The agent assembles known techniques.",
          "beat": "renderer",
          "start": 257.832,
          "end": 268.272
        },
        {
          "say": "The usual library is Three J S. This field guide pins release one eighty six, package version zero point one eight six point one. M I T licensed. On the seventeenth of October twenty twenty six, about one hundred sixteen thousand GitHub stars, and on the order of twenty one million downloads a week.",
          "show": "Three.js r186, package 0.186.1. MIT. About 116,000 stars on 17 Oct 2026.",
          "beat": "renderer",
          "start": 268.592,
          "end": 289.064
        },
        {
          "say": "The guide pins the Web G L renderer on purpose. In that version, the Web G P U renderer still cannot run the usual custom shader materials, or the bloom composer people use for night cities. If an agent switches you over, the pretty parts go missing.",
          "show": "Stay on the WebGL renderer. This version's WebGPU path drops custom shaders and bloom.",
          "beat": "renderer",
          "start": 289.384,
          "end": 305.728
        },
        {
          "say": "Here is how to read one of those files in half a minute. Six stops, always in the same places.",
          "show": "Read any agent file in half a minute. Six stops, always in the same places.",
          "beat": "renderer",
          "start": 306.048,
          "end": 312.168
        },
        {
          "say": "First, the renderer. Tone mapping, the pixel ratio, and whether shadows are on. This is the camera body, before you look at the lens.",
          "show": "1. Renderer: tone mapping, pixel ratio, shadows.",
          "beat": "renderer",
          "start": 312.488,
          "end": 321.56
        },
        {
          "say": "Second, the camera. Field of view, and the near and far clipping distances. We will open those up in a moment.",
          "show": "2. Camera: field of view, near clip, far clip.",
          "beat": "camera",
          "start": 321.88,
          "end": 329.392
        },
        {
          "say": "Third, the lights, or the environment map. If this line is missing, physically based materials render black. Remember that symptom. You will meet it again.",
          "show": "3. Lights or scene.environment. Missing this, PBR materials turn black.",
          "beat": "env",
          "start": 329.712,
          "end": 339.84
        },
        {
          "say": "Fourth, the meshes. Each one is a shape plus a material.",
          "show": "4. Meshes: a shape plus a material.",
          "beat": "mesh",
          "start": 340.16,
          "end": 344.576
        },
        {
          "say": "Fifth, the animation loop. This is the only place the world is allowed to change.",
          "show": "5. The animation loop. The only place the world changes.",
          "beat": "loop",
          "start": 344.896,
          "end": 350.488
        },
        {
          "say": "Sixth, the resize handler. Forget it, and the picture stretches the moment the window changes. It looks like a bug in the model. It is a missing assignment to camera dot aspect.",
          "show": "6. Resize. A stretched picture is a missing camera.aspect update.",
          "beat": "resize",
          "start": 350.808,
          "end": 362.232
        }
      ],
      "code": [
        [
          "renderer",
          "renderer = new WebGLRenderer()"
        ],
        [
          "renderer",
          "renderer.toneMapping = ACESFilmic"
        ],
        [
          "renderer",
          "renderer.setPixelRatio(min(dpr, 1.5))"
        ],
        [
          "camera",
          "camera = PerspectiveCamera(50, w/h, 0.1, 2000)"
        ],
        [
          "env",
          "scene.environment = pmrem.fromScene(sky)"
        ],
        [
          "mesh",
          "mesh = new Mesh(geometry, material)"
        ],
        [
          "loop",
          "renderer.setAnimationLoop((dt) => {"
        ],
        [
          "loop",
          "  boat.position.x += 4 * dt"
        ],
        [
          "loop",
          "  renderer.render(scene, camera)"
        ],
        [
          "loop",
          "})"
        ],
        [
          "resize",
          "addEventListener('resize', updateAspect)"
        ]
      ]
    },
    {
      "id": "loop",
      "chapter": "Inside one frame",
      "visual": "pipeline",
      "title": "One frame is a loop, not a painting",
      "subtitle": "Input, update, draw. Then do it again.",
      "start": 362.952,
      "end": 456.792,
      "lines": [
        {
          "say": "Now the inside of a single frame. This is the machine all of those files are driving.",
          "show": "The inside of one frame. This is the machine the file is driving.",
          "beat": "0",
          "start": 362.952,
          "end": 368.184
        },
        {
          "say": "The browser calls your function. You read the input. Keys, the mouse, the sliders.",
          "show": "The browser calls you. You read keys, mouse, and sliders.",
          "beat": "0",
          "start": 368.504,
          "end": 374.624
        },
        {
          "say": "You update the world. A boat moves four meters per second, times delta t, the seconds since the last frame. Forget that multiply, and the boat runs twice as fast on a high refresh screen.",
          "show": "Move by meters per second, times dt. Forget dt, and speed depends on the monitor.",
          "beat": "1",
          "start": 374.944,
          "end": 387.76
        },
        {
          "say": "Then the processor sends draw calls to the graphics card. A vertex shader runs per corner, and moves that corner onto the screen. The card fills the triangles. A fragment shader runs once per pixel, and returns a color.",
          "show": "A vertex shader moves corners. A fragment shader colors each pixel.",
          "beat": "2",
          "start": 388.08,
          "end": 402.312
        },
        {
          "say": "Then you do it again. Sixty times a second is about sixteen point seven milliseconds. Nothing was pre rendered. Move the camera, and the next frame is a new picture. That is why you can pause, orbit, and drag a slider. The scene is a program, not a film strip.",
          "show": "60 frames a second is a 16.7 ms budget. The next frame is computed, not played back.",
          "beat": "3",
          "start": 402.632,
          "end": 420.032
        },
        {
          "say": "Hold that against a Blender still. Cycles traces light paths. One frame can take seconds or minutes. It can be more physically honest. The camera only moves if you render another frame. Beautiful, and not a world you can walk.",
          "show": "A Cycles still can be more honest, and it is not a world you can walk.",
          "beat": "3",
          "start": 420.352,
          "end": 435.184
        },
        {
          "say": "One hidden cost sits in the renderer you just learned to look for. Pixel ratio. A screen with three device pixels per C S S pixel shades nine times as many pixels. The guide caps it, around one point five or two. An agent that sets it to the device maximum will melt a laptop and then blame the shader.",
          "show": "Pixel ratio 3 shades 9× the pixels. Cap it. An uncapped agent melts the laptop.",
          "beat": "3",
          "start": 435.504,
          "end": 456.072
        }
      ],
      "steps": [
        {
          "h": "Input",
          "p": "Keys, mouse, sliders"
        },
        {
          "h": "Update",
          "p": "Move the world by dt"
        },
        {
          "h": "Draw calls",
          "p": "CPU tells the GPU what to draw"
        },
        {
          "h": "GPU",
          "p": "Vertex shader, then fragment shader"
        }
      ]
    },
    {
      "id": "graph",
      "chapter": "Inside one frame",
      "visual": "graph",
      "title": "The world is a tree of matrices",
      "subtitle": "Children inherit the parent's motion. That is the scene graph.",
      "start": 456.792,
      "end": 543.696,
      "lines": [
        {
          "say": "The objects live in a tree. Three J S calls it a scene graph. This is the part agents mess up quietly, because the code still runs.",
          "show": "Objects live in a tree: the scene graph. The code can run and still be wrong.",
          "beat": "tree",
          "start": 456.792,
          "end": 465.48
        },
        {
          "say": "Every object has a position, a rotation, and a scale, relative to its parent. Not relative to the world.",
          "show": "Position, rotation, and scale are relative to the parent, not the world.",
          "beat": "tree",
          "start": 465.8,
          "end": 473.36
        },
        {
          "say": "Put a moon inside a planet, and the planet inside an invisible group that spins. You never write the moon's orbit. The group spins. The planet carries the moon. The moon can still spin on its own axis.",
          "show": "A spinning group carries the planet. The planet carries the moon. No orbit equation.",
          "beat": "orbit",
          "start": 473.68,
          "end": 487.432
        },
        {
          "say": "Under the hood, each node is a four by four matrix. The graphics card receives the product from the root down to that node. That product is the world matrix.",
          "show": "Each node is a 4×4 matrix. The world matrix is the product from the root down.",
          "beat": "matrix",
          "start": 487.752,
          "end": 498.024
        },
        {
          "say": "When an agent confuses local and world coordinates, the symptom is specific. The object sits in the right place, until its parent moves. Then it drifts. The fix is to ask for the world position, not to nudge the local one and hope.",
          "show": "Symptom: correct until the parent moves, then it drifts.",
          "beat": "matrix",
          "start": 498.344,
          "end": 513.824
        },
        {
          "say": "Units are part of the same idea. Three J S is right handed, Y up, and by convention one unit is one meter. A person is about one point seven meters. One floor of a building is about three meters. A city block is eighty to two hundred meters.",
          "show": "Y up, one unit = one meter. A person is 1.7 m. A storey is about 3 m.",
          "beat": "units",
          "start": 514.144,
          "end": 531.112
        },
        {
          "say": "Blender is Z up. Unreal uses centimeters. If a downloaded human is the size of a tower, you have a units bug, not a lighting bug. Fix the scale before you touch the sun.",
          "show": "A giant human is a units bug. Blender is Z up. Unreal uses centimeters.",
          "beat": "units",
          "start": 531.432,
          "end": 542.976
        }
      ]
    },
    {
      "id": "camera",
      "chapter": "Inside one frame",
      "visual": "frustum",
      "title": "The camera is a pyramid",
      "subtitle": "Four numbers. Anything outside the pyramid is not drawn.",
      "start": 543.696,
      "end": 627.624,
      "lines": [
        {
          "say": "The camera is a truncated pyramid. The technical name is a frustum. Anything outside it is not drawn. There is no 'off screen but still simulated' unless you wrote that yourself.",
          "show": "A frustum is a truncated pyramid. Outside it, nothing is drawn.",
          "beat": "wide",
          "start": 543.696,
          "end": 555.264
        },
        {
          "say": "Four numbers define a perspective camera. Vertical field of view. Aspect ratio, width divided by height. A near clip. A far clip.",
          "show": "Field of view. Aspect. Near. Far.",
          "beat": "wide",
          "start": 555.584,
          "end": 564.872
        },
        {
          "say": "Field of view is the lens. Fifty to seventy five degrees feels like standing there. Twenty to thirty five degrees is a telephoto from a drone. The city compresses, and it looks cinematic. Past ninety degrees, you are in a fisheye.",
          "show": "50–75° feels present. 20–35° is a cinematic drone. Past 90° is a fisheye.",
          "beat": "tele",
          "start": 565.192,
          "end": 580.408
        },
        {
          "say": "Near and far decide what is too close or too far to exist. They also spend the precision of the depth buffer.",
          "show": "Near and far also spend the depth buffer's precision.",
          "beat": "clip",
          "start": 580.728,
          "end": 588.024
        },
        {
          "say": "That buffer has a limited number of bits, spread unevenly, with more precision up close. If near is a millimeter and far is a hundred kilometers, distant walls flicker through each other. The name for that flicker is z-fighting.",
          "show": "Near at a millimeter and far at 100 km: distant surfaces flicker. That is z-fighting.",
          "beat": "zfight",
          "start": 588.344,
          "end": 603.536
        },
        {
          "say": "For a walk, push the near plane out. A tenth of a meter. A meter, if you can stand it. Do not leave it at a thousandth, which is what a lot of sample code does, and what agents copy.",
          "show": "For a walk, push near out to 0.1 m or 1 m. Do not leave it at 0.001.",
          "beat": "zfight",
          "start": 603.856,
          "end": 615.016
        },
        {
          "say": "This is the same resize bug as before, seen from the camera side. Aspect must be updated when the canvas changes, or the pyramid is the wrong shape and the picture looks squashed.",
          "show": "Wrong aspect means the pyramid itself is the wrong shape.",
          "beat": "wide",
          "start": 615.336,
          "end": 626.904
        }
      ]
    },
    {
      "id": "pbr",
      "chapter": "Light, shaders, cost",
      "visual": "pbr",
      "title": "Materials answer two questions",
      "subtitle": "Metal or not. Rough or smooth. And they need a world to reflect.",
      "start": 627.624,
      "end": 730.088,
      "lines": [
        {
          "say": "A mesh with no light is a black silhouette. That one sentence explains a huge share of failed agent demos. The shape is fine. The material has nothing to reflect.",
          "show": "No light, no environment: a black silhouette. The shape can still be correct.",
          "beat": "black",
          "start": 627.624,
          "end": 638.52
        },
        {
          "say": "The materials you want are called P B R, physically based rendering. They answer two questions, and then they stop improvising.",
          "show": "PBR, physically based rendering, answers two questions.",
          "beat": "plastic",
          "start": 638.84,
          "end": 646.664
        },
        {
          "say": "How metallic is the surface? Metal reflects the world. Plastic reflects a dim, tinted version of it. The color of a metal is the color of the reflection. The color of a plastic is the color of the plastic itself.",
          "show": "Metal reflects the world. Plastic shows its own color, plus a dim reflection.",
          "beat": "metal",
          "start": 646.984,
          "end": 660.76
        },
        {
          "say": "How rough is the surface? Rough scatters. Smooth behaves like a mirror. A chrome sphere and a clay sphere are the same geometry. Only those two numbers changed.",
          "show": "Rough scatters. Smooth mirrors. Same sphere, two numbers.",
          "beat": "rough",
          "start": 661.08,
          "end": 671.904
        },
        {
          "say": "The environment is a picture of the surroundings, wrapped around the scene. Image based lighting uses that picture as the light. In Three J S, you set scene dot environment.",
          "show": "scene.environment is a picture of the world, used as the light.",
          "beat": "env",
          "start": 672.224,
          "end": 683.192
        },
        {
          "say": "That single assignment is why one demo looks like a product photograph and the next looks like a student exercise. Connect it back to the file tour. Stop three was this line. Skip it, and every metal goes black.",
          "show": "This is stop 3 from the file tour. Skip it, and every metal goes black.",
          "beat": "env",
          "start": 683.512,
          "end": 696.904
        },
        {
          "say": "Tone mapping then squeezes a high dynamic range into what a monitor can show. Aces filmic, or the A G X tone map, keeps a low sun from clipping the sky to pure white. Without it, the pretty part of the sky is a hole.",
          "show": "Tone mapping keeps the sun from clipping the sky to white.",
          "beat": "env",
          "start": 697.224,
          "end": 712.2
        },
        {
          "say": "Shadows are a second render of the scene, from the light's point of view. They cost real time. A night street wants a few real lights near the player. The rest should be glowing materials, not more shadow casting lamps. We will spend that budget on the city, not on a dozen streetlights.",
          "show": "Shadows are a second render. A few real lights near the player. The rest can glow.",
          "beat": "env",
          "start": 712.52,
          "end": 729.368
        }
      ]
    },
    {
      "id": "shader",
      "chapter": "Light, shaders, cost",
      "visual": "shader",
      "title": "A shader is a small program per pixel",
      "subtitle": "The extreme version has no meshes. The scene is a distance.",
      "start": 730.088,
      "end": 822.0,
      "lines": [
        {
          "say": "When boxes are not enough, the agent writes a shader. You already met the two programs. The vertex shader moves points. The fragment shader colors pixels. Every built in material is just a pair of these that Three J S wrote for you.",
          "show": "Every built-in material is a vertex shader plus a fragment shader.",
          "beat": "pair",
          "start": 730.088,
          "end": 745.184
        },
        {
          "say": "The extreme version has no meshes at all. The scene is a signed distance function. For any point in space, the function returns how far you are from the surface. Negative means you are inside the solid.",
          "show": "A signed distance function: how far is this point from the surface? Negative means inside.",
          "beat": "sdf",
          "start": 745.504,
          "end": 758.176
        },
        {
          "say": "The card shoots a ray from the camera and steps forward by that distance, until the distance falls to nothing. That is raymarching. The step can be large in empty space, because the function promises there is no surface closer than that.",
          "show": "Raymarching steps forward by the distance to the surface, until it hits.",
          "beat": "march",
          "start": 758.496,
          "end": 773.088
        },
        {
          "say": "Repeat one building across space, and you have an infinite city from a few lines. A smooth minimum melts two shapes into one blob. Soft shadows fall out of the same function, by asking how close the ray toward the light passed to something solid.",
          "show": "Repeat one building, and you have an infinite city. Soft shadows come from the same function.",
          "beat": "city",
          "start": 773.408,
          "end": 789.368
        },
        {
          "say": "You can spot this family in a clip. Impossible smoothness. Perfect repetition. Fly far away, and the pattern never ends. There is no model to open. The picture is the formula.",
          "show": "Spot it: impossible smoothness, perfect repetition, a pattern that never ends.",
          "beat": "city",
          "start": 789.688,
          "end": 801.616
        },
        {
          "say": "A license trap, if the agent pastes a classic from Shadertoy. The default license there is Creative Commons, non commercial, share alike, unless the author says otherwise. The famous Seascape is a noise height field, not the Gerstner ocean we are about to build, and it is not a free asset for a product.",
          "show": "Shadertoy's default license is non-commercial, share-alike. Seascape is not a free product asset.",
          "beat": "license",
          "start": 801.936,
          "end": 821.28
        }
      ]
    },
    {
      "id": "instances",
      "chapter": "Light, shaders, cost",
      "visual": "calls",
      "title": "Draw calls are the budget you can see",
      "subtitle": "Thirty thousand meshes, or one mesh drawn thirty thousand times.",
      "start": 822.0,
      "end": 902.224,
      "lines": [
        {
          "say": "Different problem. Not how a pixel is colored. How many times you ask the card to start a draw.",
          "show": "A different budget: how many times you ask the GPU to start drawing.",
          "beat": "many",
          "start": 822.0,
          "end": 827.664
        },
        {
          "say": "Thirty thousand buildings, stored as thirty thousand separate meshes, means thirty thousand draw calls. The card spends the frame on overhead, not on shading. The scene is not even complicated. It is just chatty.",
          "show": "30,000 meshes means 30,000 draw calls. The frame is spent on overhead.",
          "beat": "many",
          "start": 827.984,
          "end": 841.784
        },
        {
          "say": "Instancing says: one mesh, one material, and a buffer of thirty thousand positions. One draw call, or a handful. The buildings can still differ in height, color, and which windows are lit. That data lives in the buffer, not in extra objects.",
          "show": "One mesh, one material, a buffer of positions. Differences live in the buffer.",
          "beat": "one",
          "start": 842.104,
          "end": 859.432
        },
        {
          "say": "The procedural city in this guide is built that way on purpose. One instanced mesh per material, so every building in the city stays inside a few calls.",
          "show": "The guide's city is one instanced mesh per material.",
          "beat": "one",
          "start": 859.752,
          "end": 869.832
        },
        {
          "say": "Put frames per second, and the draw call count, on a heads up display in the corner. Every screenshot the agent takes then carries the number. If the readout says eight hundred calls, the fix is instancing. A smarter language model will not guess that from the source. The picture has to say it.",
          "show": "A HUD of frames per second and draw calls. The screenshot has to carry the number.",
          "beat": "hud",
          "start": 870.152,
          "end": 888.944
        },
        {
          "say": "This connects forward. The screenshot loop you will meet later only works if the picture contains the evidence. A pretty frame with a hidden stall is how an agent declares victory and hands you a slideshow.",
          "show": "The later screenshot loop only works if the picture contains the evidence.",
          "beat": "hud",
          "start": 889.264,
          "end": 901.504
        }
      ]
    },
    {
      "id": "walk",
      "chapter": "Light, shaders, cost",
      "visual": "walk",
      "title": "A flyover is a curve. A walk is a body.",
      "subtitle": "Numbers belong in the prompt, or the agent will invent a feel.",
      "start": 902.224,
      "end": 983.136,
      "lines": [
        {
          "say": "A flyover and a walk are different machines, even when the street underneath is the same.",
          "show": "Same street. Two different machines.",
          "beat": "fly",
          "start": 902.224,
          "end": 908.08
        },
        {
          "say": "A flyover sticks the camera to a spline, a smooth curve, and moves it through time. It is easy to test, and easy to record. Keep the camera at least a building's width away from the towers, or it will fly through a wall. That clip through a tower is the near plane and the path, not a mystery.",
          "show": "A flyover is a camera on a spline. Keep it out of the towers.",
          "beat": "fly",
          "start": 908.4,
          "end": 927.072
        },
        {
          "say": "A walk is a body. The eye sits about one point seven meters up, the person from the units discussion. In the night street brief, walking speed is one point four meters per second. Running is a little over three. Put the numbers in the prompt. Otherwise the agent invents a slide that feels like a game from nineteen ninety eight.",
          "show": "Eye height 1.7 m. Walk 1.4 m/s. Put the numbers in the prompt.",
          "beat": "body",
          "start": 927.392,
          "end": 947.336
        },
        {
          "say": "Pointer lock hides the mouse cursor. W, A, S, and D move a capsule. Gravity pulls the capsule down. A collision octree, a tree of boxes built from the static world, answers whether the capsule hit a wall.",
          "show": "Pointer lock, a capsule, gravity, and an octree of the static world.",
          "beat": "body",
          "start": 947.656,
          "end": 962.488
        },
        {
          "say": "Pointer lock needs a real click. A headless browser cannot walk for you. So add a scripted path, and a parameter such as cam equals street. The test moves the player with no human in the chair. This is the same idea as the flyover. Anything you want an agent to verify needs a camera it can set from the outside.",
          "show": "Pointer lock needs a click. Add a scripted path, and a cam parameter, so a test can walk.",
          "beat": "script",
          "start": 962.808,
          "end": 982.416
        }
      ]
    },
    {
      "id": "ocean",
      "chapter": "Two recipes",
      "visual": "ocean",
      "title": "An ocean is a stack of cheap ideas",
      "subtitle": "Fresnel, then a normal map, then waves that actually move.",
      "start": 983.136,
      "end": 1135.144,
      "lines": [
        {
          "say": "An ocean looks expensive because several cheap ideas stack. Here is the ladder, from a flat lie to something that reads as water. Each rung uses the frame loop, the camera, and the lighting you already have.",
          "show": "An ocean is a ladder. Each rung reuses the frame, the camera, and the light.",
          "beat": "flat",
          "start": 983.136,
          "end": 996.216
        },
        {
          "say": "Rung one. A flat plane. The color mixes the sky with a deep blue, depending on the viewing angle. That mix is called Fresnel. Look across the water, toward the horizon, and you see a mirror. Look down at your feet, and you see the water's own color. Your eye already believes this. A shader that skips it looks like blue plastic.",
          "show": "Fresnel: a mirror at the horizon, the water's own color at your feet.",
          "beat": "fresnel",
          "start": 996.536,
          "end": 1017.536
        },
        {
          "say": "Rung two. Scroll a normal map across that plane. The lighting wiggles, so it feels wet, but the silhouette is dead flat. A buoy cannot bob, because there is no height to sample. This is what the usual Three J S water example is doing. It photographs well from above, and it fails at the horizon, where a real wave would break the line.",
          "show": "A scrolling normal map wiggles the light. The silhouette stays flat. A buoy cannot bob.",
          "beat": "normal",
          "start": 1017.856,
          "end": 1040.152
        },
        {
          "say": "Rung three. Move the vertices. A sum of sine waves goes up and down, and the crests stay round. People call these jelly waves. You can see it. The water looks like a math demo.",
          "show": "Sine waves go up and down. Crests stay round. They read as jelly.",
          "beat": "sine",
          "start": 1040.472,
          "end": 1052.592
        },
        {
          "say": "Gerstner waves also push the water sideways, toward the crest. Crests sharpen. Troughs widen. That is the shape of a real deep water wave. The water on screen right now is doing that.",
          "show": "Gerstner waves also push sideways. Crests sharpen. Troughs widen.",
          "beat": "gerstner",
          "start": 1052.912,
          "end": 1064.912
        },
        {
          "say": "Long waves have to travel faster than short ones, or the sea still looks like a screensaver. Deep water dispersion says the angular frequency, squared, equals gravity times the wave number. One square root. A handful of waves starts to read as a sea, because the long swell outruns the chop.",
          "show": "Deep-water dispersion: frequency squared = gravity × wave number. Long waves outrun short ones.",
          "beat": "gerstner",
          "start": 1065.232,
          "end": 1085.632
        },
        {
          "say": "Foam is the surface folding over itself. Where that sideways push compresses the surface past a limit, paint white. It is a geometric event, not a noise texture someone hoped would look foamy.",
          "show": "Foam is the surface folding, a geometric event. Not a noise sticker.",
          "beat": "foam",
          "start": 1085.952,
          "end": 1098.456
        },
        {
          "say": "Then the sun. Put it about four degrees above the horizon. Feed that same direction to the sky and to the water. Match the fog color to the horizon. When the sun moves, regenerate the environment map, or the reflections will be a different time of day than the sky. That mismatch is the black metal bug, in a nicer suit.",
          "show": "One sun direction for the sky and the water. Regenerating the environment keeps the day consistent.",
          "beat": "sun",
          "start": 1098.776,
          "end": 1119.68
        },
        {
          "say": "The film version sums hundreds of thousands of waves with a Fourier transform. That is the Tessendorf ocean. You do not need it for a first scene. You need Fresnel, a few Gerstner waves, one sun, and a horizon that matches.",
          "show": "A Fourier ocean can wait. Fresnel, a few Gerstner waves, one sun, a matched horizon.",
          "beat": "sun",
          "start": 1120.0,
          "end": 1134.424
        }
      ]
    },
    {
      "id": "city",
      "chapter": "Two recipes",
      "visual": "city",
      "title": "A city is a recipe, not a scan of downtown",
      "subtitle": "Grid, seed, instances, shader windows, a little bloom.",
      "start": 1135.144,
      "end": 1272.488,
      "lines": [
        {
          "say": "A procedural city is a recipe. It is not a model of a real downtown, and it should not pretend to be. If you needed the real downtown, you would be in family two, streaming tiles, and showing the logo.",
          "show": "A procedural city is a recipe. A real downtown is streamed data, with a logo.",
          "beat": "grid",
          "start": 1135.144,
          "end": 1148.248
        },
        {
          "say": "Lay a grid. The gaps are the streets. A solid starter size, from the hands on page of the guide: twelve by twelve blocks, about ninety meters, streets about eighteen meters wide.",
          "show": "12 by 12 blocks, about 90 m, streets about 18 m wide.",
          "beat": "grid",
          "start": 1148.568,
          "end": 1160.64
        },
        {
          "say": "Heights come from seeded noise, taller toward the center, so the skyline has a downtown. The seed is a number in the address. Same seed, same city, same screenshot. Reproducible pictures are how an agent stops lying to itself.",
          "show": "Seeded noise, taller in the center. Same seed, same city, same screenshot.",
          "beat": "heights",
          "start": 1160.96,
          "end": 1177.016
        },
        {
          "say": "The buildings are boxes, and they must be instanced. One mesh per material. This is the draw call lesson, spent on a skyline. Windows are not textures. A shader draws a grid on the face, hashes each cell, and lights some of them. At night, those windows are the picture.",
          "show": "Instanced boxes. Windows are a shader: a grid, a hash, some cells lit.",
          "beat": "windows",
          "start": 1177.336,
          "end": 1194.928
        },
        {
          "say": "Cars are another instanced mesh. Small glowing boxes in the lanes. Headlights one color, tail lights another. You do not simulate traffic. You move points along a loop.",
          "show": "Cars are another instanced mesh. Points moving on a loop, not a traffic simulation.",
          "beat": "cars",
          "start": 1195.248,
          "end": 1206.288
        },
        {
          "say": "Bloom spreads bright pixels into a glow. It is also how you ruin the frame. Too much strength, and the screenshot goes white. That happened while this guide's own city demo was being built. The code looked fine. The screenshot did not. Nobody can see bloom whiteout by reading a constant named strength.",
          "show": "Bloom makes the lights glow. Too much of it whites the frame out. The code will not tell you.",
          "beat": "bloom",
          "start": 1206.608,
          "end": 1226.024
        },
        {
          "say": "The camera rides the spline from the walk lesson, for about a minute, and stays at least fifteen meters from any building. Near clip, far clip, and a path that respects both.",
          "show": "The camera rides a spline for about a minute, at least 15 m from any building.",
          "beat": "path",
          "start": 1226.344,
          "end": 1237.36
        },
        {
          "say": "Time has to be an input to the draw, not the wall clock. A function of t. Then you can render frame zero, frame one, frame two, and encode a smooth video even when the machine is slow. A headless browser is often slow. The video does not have to be.",
          "show": "render(t), not the wall clock. Then a slow machine can still encode a smooth video.",
          "beat": "time",
          "start": 1237.68,
          "end": 1254.744
        },
        {
          "say": "The same pieces scale past the city. Fog hides the far plane and saves you from z-fighting at the horizon. A day and night cycle is the sun angle you already used on the ocean. Trees, crowds, and traffic are more instances, not more draw calls.",
          "show": "Fog hides the far plane. Day and night is the sun angle. Crowds are more instances.",
          "beat": "scale",
          "start": 1255.064,
          "end": 1271.768
        }
      ]
    },
    {
      "id": "assets",
      "chapter": "The agent",
      "visual": "ledger",
      "title": "The model is a poor modeler",
      "subtitle": "The look comes from assets and from settings, plus a license you can explain.",
      "start": 1272.488,
      "end": 1369.832,
      "lines": [
        {
          "say": "Here is the connecting fact that should change how you prompt.",
          "show": "This fact should change how you write the prompt.",
          "beat": "fact",
          "start": 1272.488,
          "end": 1276.112
        },
        {
          "say": "The language model is a poor modeler of geometry. The impressive look comes from assets, and from the renderer settings you already saw. Environment, tone mapping, bloom kept on a leash. Not from the model inventing a beautiful building out of triangles.",
          "show": "The look comes from assets and renderer settings, not from invented triangles.",
          "beat": "fact",
          "start": 1276.432,
          "end": 1292.968
        },
        {
          "say": "Use public domain sources, and write them down. Poly Haven for skies and textures. ambient C G for materials. Kenney for kits of buildings and roads. Every U R L and every license goes into a ledger, a file named ASSETS dot M D.",
          "show": "Poly Haven, ambientCG, Kenney. Every URL and license goes in ASSETS.md.",
          "beat": "cc0",
          "start": 1293.288,
          "end": 1310.184
        },
        {
          "say": "A random website that says free is how an agent creates a legal problem you will not notice until you ship. The ledger is the fix. If it is not in the ledger, it is not in the scene.",
          "show": "If it is not in the ledger, it is not in the scene.",
          "beat": "cc0",
          "start": 1310.504,
          "end": 1321.712
        },
        {
          "say": "Measured cities have terms, because they are family two. Google's photorealistic tiles give you about one thousand root requests a month on the free tier. You must show the logo and the credits. You may not cache the tiles. A promotional video is limited to thirty seconds.",
          "show": "Google 3D tiles: show the logo and credits, do not cache, promo video at most 30 seconds.",
          "beat": "google",
          "start": 1322.032,
          "end": 1339.384
        },
        {
          "say": "The original Inria code for Gaussian splats is research, and non commercial. Commercial work uses a different trainer. Downloading the famous repository is not the same as having a license.",
          "show": "The original Inria splat code is non-commercial. Famous is not the same as licensed.",
          "beat": "inria",
          "start": 1339.704,
          "end": 1352.376
        },
        {
          "say": "Some generative models add territory limits. The guide notes that Hunyuan 3 D's license excludes the European Union, the United Kingdom, and South Korea. Check the license of the file the agent just saved. Do not treat a successful download as permission.",
          "show": "Hunyuan3D's license excludes the EU, the UK, and South Korea. A download is not permission.",
          "beat": "hunyuan",
          "start": 1352.696,
          "end": 1369.112
        }
      ]
    },
    {
      "id": "blind",
      "chapter": "The agent",
      "visual": "agentloop",
      "title": "The agent is blind until you show it the frame",
      "subtitle": "Write, run, read the console, screenshot, judge, repeat.",
      "start": 1369.832,
      "end": 1461.024,
      "lines": [
        {
          "say": "A language model writing Three J S is working blind, unless you show it the picture. This is the center of the whole lesson.",
          "show": "A model writing Three.js is blind, unless you show it the picture.",
          "beat": "0",
          "start": 1369.832,
          "end": 1377.656
        },
        {
          "say": "It cannot predict pixels. Fog that does not match the sky. A shader that is too hot. A camera sitting inside a tower. Bloom that has washed the night out to white. None of that is visible in the source. You already saw each of those failures as a visual fact. The agent has not.",
          "show": "Fog, hot shaders, a camera inside a tower, bloom whiteout. None of that is in the source.",
          "beat": "0",
          "start": 1377.976,
          "end": 1395.568
        },
        {
          "say": "The loop that fixes it is short. Write. Run the page in a headless browser. Read the console, because errors are text, cheap and exact. Screenshot a few fixed cameras. Read the heads up display. Judge the picture against the brief. Repeat.",
          "show": "Write. Run headless. Read the console. Screenshot fixed cameras. Judge the picture.",
          "beat": "2",
          "start": 1395.888,
          "end": 1412.064
        },
        {
          "say": "Console first, before the pictures. In the night street project, the whole audio system was silent from the day it was written. A node in the audio graph threw. The exception sat in the page console the entire time. Nobody had looked. The renders could still have been lovely.",
          "show": "Night-street's audio was silent from day one. The exception sat in the console.",
          "beat": "2",
          "start": 1412.384,
          "end": 1428.968
        },
        {
          "say": "Make the shots reproducible, or the loop is theater. A camera parameter. A time parameter. A seed. A freeze switch. The test script does not have to be clever. It has to be the same every time, including the time of day.",
          "show": "Camera, time, seed, freeze. The same shot every time, or the loop is theater.",
          "beat": "3",
          "start": 1429.288,
          "end": 1444.312
        },
        {
          "say": "One warning about that headless browser. It often has no real graphics card. Frame rates measured there belong to a software renderer. Log the renderer name next to the number. Do not celebrate sixty frames a second until you know which chip drew them.",
          "show": "Headless frame rates are often a software renderer. Log the chip next to the number.",
          "beat": "4",
          "start": 1444.632,
          "end": 1460.304
        }
      ],
      "steps": [
        {
          "h": "Write",
          "p": "Edit the page and the shaders"
        },
        {
          "h": "Run",
          "p": "Open it headless, from a local server"
        },
        {
          "h": "Console",
          "p": "Errors are text. Cheap and exact."
        },
        {
          "h": "Shots",
          "p": "Fixed cameras, fixed time, fixed seed"
        },
        {
          "h": "Judge",
          "p": "The picture against the brief, not the code"
        }
      ]
    },
    {
      "id": "aa3d",
      "chapter": "The agent",
      "visual": "stats",
      "title": "The benchmark says: look early",
      "subtitle": "AA-3D, 12 October 2026. Correlations, not a law of nature.",
      "start": 1461.024,
      "end": 1587.928,
      "lines": [
        {
          "say": "The fairest evidence for that loop is a benchmark, not a launch video. Launch videos are family D. We will get to them. Benchmarks publish the prompt and the rules.",
          "show": "Trust a benchmark before a launch video. The prompt and the rules are public.",
          "beat": "0",
          "start": 1461.024,
          "end": 1471.176
        },
        {
          "say": "A A 3 D, published on the twelfth of October twenty twenty six, gave agents fifty five briefs. Each agent could run for up to three hours, or two hundred fifty turns. People voted blind. More than ten thousand votes. The models received an Elo rating.",
          "show": "AA-3D, 12 Oct 2026. 55 briefs. Up to 3 hours or 250 turns. Blind votes.",
          "beat": "0",
          "start": 1471.496,
          "end": 1489.328
        },
        {
          "say": "The top five models first looked at a picture of their own scene after a median of ten to thirteen turns. Models near the bottom waited until somewhere between turn fifteen and turn forty.",
          "show": "Top models first looked at turn 10 to 13. Weaker ones waited until turn 15 to 40.",
          "beat": "1",
          "start": 1489.648,
          "end": 1501.36
        },
        {
          "say": "Looking early tracked rank. The Spearman correlation was zero point eight two. How often they looked mattered less than when they first looked. A late first glance does not get its points back.",
          "show": "Spearman 0.82 between looking early and rank. When, more than how often.",
          "beat": "1",
          "start": 1501.68,
          "end": 1513.272
        },
        {
          "say": "Eighty two percent of tool time was spent testing the page in a browser. Writing code was six percent of tool time. The work is looking. The typing is the small part. That matches the ocean hour you will spend on exposure and fog, not on the idea of water.",
          "show": "82% of tool time was browser testing. Writing code was 6%.",
          "beat": "2",
          "start": 1513.592,
          "end": 1529.744
        },
        {
          "say": "Output tokens, and the number of turns, did not predict quality. The number of interactive controls did, with a Pearson correlation of zero point nine zero. Sliders mean a person, or a voter, can see the picture respond. A scene you cannot poke is a scene you cannot judge.",
          "show": "Tokens did not predict quality. Interactive controls did. Pearson 0.90.",
          "beat": "3",
          "start": 1530.064,
          "end": 1548.568
        },
        {
          "say": "Two models that cannot see images still finished every scene. The one that fell furthest below the score its general ability would predict had a sibling that can see. That sibling scored one hundred forty nine Elo higher.",
          "show": "A model that can see scored 149 Elo above its text-only sibling.",
          "beat": "1",
          "start": 1548.888,
          "end": 1562.4
        },
        {
          "say": "These are correlations from one benchmark. They are not a proof that looking causes the score. They are the strongest public hint you have. Give the agent eyes on the first turns, not on turn forty.",
          "show": "One benchmark, a correlation, not a proof. Still: give the agent eyes early.",
          "beat": "1",
          "start": 1562.72,
          "end": 1574.36
        },
        {
          "say": "Cost, in that same run, sat between twenty cents and about thirty two dollars a scene. The top four models were statistically tied. You are not waiting for a single magic model. You are setting up the loop.",
          "show": "About $0.20 to $32 per scene. The top four models were statistically tied.",
          "beat": "2",
          "start": 1574.68,
          "end": 1587.208
        }
      ],
      "stats": [
        {
          "n": "10–13",
          "l": "Median turn of the first look, top five models"
        },
        {
          "n": "0.82",
          "l": "Spearman: looking early against rank"
        },
        {
          "n": "82%",
          "l": "Of tool time spent testing in a browser"
        },
        {
          "n": "6%",
          "l": "Of tool time spent writing code"
        }
      ]
    },
    {
      "id": "failures",
      "chapter": "The agent",
      "visual": "versions",
      "title": "The model remembers every era of the library at once",
      "subtitle": "Pin the version in the first prompt. Ban the dead names.",
      "start": 1587.928,
      "end": 1710.12,
      "lines": [
        {
          "say": "The version problem is concrete. Three J S removed or renamed A P I names across a decade, and the model remembers all of the eras at once. It will mix them in one file, confidently.",
          "show": "The model mixes a decade of Three.js in one file, confidently.",
          "beat": "0",
          "start": 1587.928,
          "end": 1601.056
        },
        {
          "say": "Release one twenty five removed the old Geometry class. The agent writes it. The page throws. Geometry is not a constructor.",
          "show": "r125 removed Geometry. The page throws: not a constructor.",
          "beat": "0",
          "start": 1601.376,
          "end": 1610.688
        },
        {
          "say": "Release one fifty two replaced output encoding with color space. Old code fails silently. The colors are simply wrong. This one is nasty, because the console is clean and the picture is a little off, which looks like taste.",
          "show": "r152: color space. The console is clean. The colors are wrong. It looks like taste.",
          "beat": "1",
          "start": 1611.008,
          "end": 1625.648
        },
        {
          "say": "Release one fifty five changed light intensities. The scene is mysteriously dark, or blown out. Easy to misread as a tone mapping problem. Check the era of the lighting code first.",
          "show": "r155 changed light intensity. Dark or blown out, and easy to blame on tone mapping.",
          "beat": "2",
          "start": 1625.968,
          "end": 1638.352
        },
        {
          "say": "Release one sixty one removed the global script build. The agent writes a script tag pointing at three dot min dot J S. The screen stays black. Three is not defined. There is no global anymore. You load it as a module, through an import map, and you load the examples from that same version.",
          "show": "r161 removed the global build. A script tag for three.min.js stays black.",
          "beat": "3",
          "start": 1638.672,
          "end": 1657.872
        },
        {
          "say": "Two copies is its own failure. Core from one version, examples from another. The warning says multiple instances of Three J S. Often, nothing draws. Pin both to zero point one eight six point one.",
          "show": "Two copies: core and examples from different versions. Often nothing draws.",
          "beat": "4",
          "start": 1658.192,
          "end": 1672.352
        },
        {
          "say": "The fix is a rules file in the first prompt, not a longer chat after the damage. Pin the version. Use an import map. Ban the old names. Always set the environment. Screenshot from the first turns. That file is the lesson, compressed into instructions the agent cannot forget.",
          "show": "A rules file in the first prompt. Pin, ban, environment, screenshot early.",
          "beat": "4",
          "start": 1672.672,
          "end": 1690.96
        },
        {
          "say": "Skill packs that catalog A P I names do not choose the numbers. The night street author called the ones he tried flat catalogues. Useful for a name. No help deciding a value. A short rules file, plus comments from a previous project, did more for the picture than a long pack of tips.",
          "show": "API catalogues do not choose numbers. A short rules file did more than a skill pack.",
          "beat": "4",
          "start": 1691.28,
          "end": 1709.4
        }
      ],
      "versions": [
        {
          "v": "r125",
          "p": "Geometry removed. The page throws."
        },
        {
          "v": "r152",
          "p": "outputEncoding became colorSpace. Colors go quietly wrong."
        },
        {
          "v": "r155",
          "p": "Light intensities changed. Too dark, or blown out."
        },
        {
          "v": "r161",
          "p": "The global script build disappeared. THREE is not defined."
        },
        {
          "v": "r186",
          "p": "Pin this one. Import map. One copy of the library."
        }
      ]
    },
    {
      "id": "oneprompt",
      "chapter": "One prompt",
      "visual": "meanings",
      "title": "“One prompt” is four different stories",
      "subtitle": "The clips depend on you mixing them up.",
      "start": 1710.12,
      "end": 1858.08,
      "lines": [
        {
          "say": "One prompt means four different things. The clips depend on you confusing them.",
          "show": "Four meanings. The clips depend on you mixing them up.",
          "beat": "0",
          "start": 1710.12,
          "end": 1714.536
        },
        {
          "say": "Meaning A. A short first message, then a long chat. A human keeps steering. The flight simulator at fly dot pieter dot com started from a short sentence, built live, after many questions and comments. The opening line was one prompt. The process was a conversation.",
          "show": "A: a short first line, then a human in the loop. fly.pieter.com was this.",
          "beat": "0",
          "start": 1714.856,
          "end": 1732.28
        },
        {
          "say": "Meaning B. A long brief, then hours of the agent looking at screenshots. This is how the verified, impressive scenes were actually made. Numbers in the brief. A build order. A critic. Notes that survive into the next session.",
          "show": "B: a long brief, hours of screenshots, notes that survive the session.",
          "beat": "1",
          "start": 1732.6,
          "end": 1747.552
        },
        {
          "say": "Meaning C. Truly one file from one prompt. This is real, and it is usually a toy. A small ocean. A voxel sketch. A camera and a light. Delightful. Not a walkable district.",
          "show": "C: truly one file. Real, and usually a toy.",
          "beat": "2",
          "start": 1747.872,
          "end": 1761.048
        },
        {
          "say": "Meaning D. A marketing clip. No prompt, no code, no repository. You cannot check it. Treat it as an advertisement for the model, not as a result.",
          "show": "D: no prompt, no code. An advertisement, not a result.",
          "beat": "3",
          "start": 1761.368,
          "end": 1772.168
        },
        {
          "say": "Where the files are public, the pattern repeats. Night street published the code, under an M I T license, and five prompts. The first brief defines eight numbered systems, a strict build order, and a blind critic. That critic sees only the renders, not the code, and judges them against real photographs. The back half of the work was art direction against screenshots.",
          "show": "night-street: five published prompts, a build order, a critic that sees only renders.",
          "beat": "1",
          "start": 1772.488,
          "end": 1797.16
        },
        {
          "say": "Honest limit, from that same project. The first frame took about thirty five to thirty nine seconds on an R T X forty sixty, and almost all of that was the shaders compiling. The clip you saw was not the first frame a viewer gets.",
          "show": "First frame: about 35–39 seconds on an RTX 4060, mostly shader compile.",
          "beat": "1",
          "start": 1797.48,
          "end": 1811.88
        },
        {
          "say": "The Laas world demo is a procedural world, four by four kilometers. The author calls it roughly ninety nine percent model work, across many sessions, with a status file acting as memory. Not one sitting. A project.",
          "show": "LAAS: a 4×4 km world, many sessions, a status file as memory.",
          "beat": "1",
          "start": 1812.2,
          "end": 1826.864
        },
        {
          "say": "Git City is about twenty one thousand lines, produced in four days, and the author lists where a human had to step in. Architecture. The interface. Performance. The model typed. The person held the structure.",
          "show": "Git City: about 21,000 lines in four days. A human held architecture, UI, and performance.",
          "beat": "1",
          "start": 1827.184,
          "end": 1841.464
        },
        {
          "say": "So, with a current model that can see, one short prompt gets you a decent small scene in minutes. An ocean. A low poly city. The impressive level, in every verified case, took a long brief, the screenshot loop, and hours.",
          "show": "One short prompt: a decent small scene. The impressive level took a brief, a loop, and hours.",
          "beat": "2",
          "start": 1841.784,
          "end": 1857.36
        }
      ],
      "cards": [
        {
          "h": "A · Short, then a long chat",
          "p": "One sentence, then a human steers for a long time."
        },
        {
          "h": "B · Long brief, long run",
          "p": "A structured spec. Hours. Screenshots. Notes between sessions."
        },
        {
          "h": "C · Truly one shot",
          "p": "One file, one prompt. Real, and usually a toy."
        },
        {
          "h": "D · A marketing clip",
          "p": "No prompt. No code. Nothing you can rerun."
        }
      ]
    },
    {
      "id": "choose",
      "chapter": "Your first scene",
      "visual": "routes",
      "title": "Pick the route from the constraint",
      "subtitle": "Not from the trailer.",
      "start": 1858.08,
      "end": 1936.184,
      "lines": [
        {
          "say": "When you close this lesson and someone asks you to make the clip, pick the route from the constraint. Not from the trailer that impressed them.",
          "show": "Pick from the constraint, not from the trailer.",
          "beat": "0",
          "start": 1858.08,
          "end": 1865.592
        },
        {
          "say": "If you want to understand the picture, and you want the agent to check itself, use the browser and Three J S, and build the ocean. You now know every layer that ocean is made of.",
          "show": "To learn: the browser, Three.js, the ocean. You know every layer of it.",
          "beat": "0",
          "start": 1865.912,
          "end": 1876.424
        },
        {
          "say": "If you need a real city this week, and you are allowed to show a logo, stream the photorealistic tiles. Do not pretend the agent modeled Manhattan. Keep any promo clip at thirty seconds or under. That is family two, with a camera path. Say so.",
          "show": "A real city this week: stream tiles, show the logo, keep the promo clip within 30 seconds.",
          "beat": "1",
          "start": 1876.744,
          "end": 1893.184
        },
        {
          "say": "If you need a film still, not a world, drive Blender headless. The agent writes Python, renders a PNG, and looks at the PNG. You do not need a live editor plug in. That also keeps it safer. Several of those plug ins run whatever code the model emits, inside an application that has your files.",
          "show": "A still: Blender headless, then look at the PNG. An editor plug-in that runs model code is a security boundary.",
          "beat": "2",
          "start": 1893.504,
          "end": 1913.328
        },
        {
          "say": "If you need a game you can ship, with foliage and a physics engine, then it is Unreal, Unity, or Godot. The agent should orchestrate systems that already exist. Procedural graphs, asset libraries, not individual leaves. Budget a real graphics card. And treat a plug in that executes code as a boundary. Localhost is not a lock.",
          "show": "A shippable game: an engine, existing systems, a real GPU. Localhost is not a lock.",
          "beat": "3",
          "start": 1913.648,
          "end": 1935.464
        }
      ],
      "cards": [
        {
          "h": "Learn it",
          "p": "Browser. Three.js. The ocean. The agent can see the page."
        },
        {
          "h": "A real city, this week",
          "p": "Stream tiles. Show the logo. Promo video ≤ 30 seconds."
        },
        {
          "h": "A film still",
          "p": "Blender, headless, Cycles. Read the PNG. No editor plug-in."
        },
        {
          "h": "A game you can ship",
          "p": "An engine, driving systems that exist. A real GPU. A security boundary."
        }
      ]
    },
    {
      "id": "monday",
      "chapter": "Your first scene",
      "visual": "steps",
      "title": "The order of work, the first time",
      "subtitle": "Rules, then the test, then the ocean. Not the other way around.",
      "start": 1936.184,
      "end": 2052.504,
      "lines": [
        {
          "say": "Here is the order of work, the first time you do this yourself. The order is the lesson. Scene last, not scene first.",
          "show": "Scene last. Rules and the test come first.",
          "beat": "0",
          "start": 1936.184,
          "end": 1943.576
        },
        {
          "say": "Step zero. An empty folder, and a rules file the agent has to read before it writes. Pin Three J S to the version we named. Ban the dead A P I names. Require the heads up display. Require parameters for camera, time, and seed. Public domain assets only, with the ledger. And tell it never to delete a feature in order to make a bug disappear. Agents will do that. They will remove the buoy to fix the buoy.",
          "show": "Rules file first. Pin, ban, HUD, parameters, ledger. Never delete a feature to silence a bug.",
          "beat": "0",
          "start": 1943.896,
          "end": 1972.36
        },
        {
          "say": "Step one. Write the test before the scene. A small script starts a local server, opens each camera preset, fails on any console error, and saves the screenshots. Use a local server, not a file U R L, once you are loading models and textures. Some of those loads, and Web G P U where you do use it, behave differently from a file on disk.",
          "show": "The test before the scene. A local server, not a file URL, once assets are involved.",
          "beat": "1",
          "start": 1972.68,
          "end": 1995.6
        },
        {
          "say": "Step two. The ocean at golden hour. Sun four degrees up. The same sun vector drives the sky and the water. When the sun moves, rebuild the environment. Orbit controls, clamped so the camera cannot go under the sea. Four presets. Horizon. Low, about two meters up. High. And sunset, at one degree.",
          "show": "Sun at 4°, one vector for sky and water. Presets: horizon, low, high, sunset.",
          "beat": "2",
          "start": 1995.92,
          "end": 2017.976
        },
        {
          "say": "You are done when the console is clean, and the horizon shot looks like a photograph. No tiling along the horizon. A path of sun on the water. Sky and water the same time of day. The buoy, if you add one, has to sample the wave height. A normal map cannot hold it up.",
          "show": "Done: a clean console, no horizon tiling, one time of day, a buoy that samples the wave.",
          "beat": "3",
          "start": 2018.296,
          "end": 2035.648
        },
        {
          "say": "Expect the hour to disappear into the normal map path, the exposure, and the fog at the horizon. Not into the idea of an ocean. The idea was the easy part. That split, between the idea and the picture, is the entire lesson.",
          "show": "The hour goes into exposure, the normal map, and horizon fog. The idea was the easy part.",
          "beat": "3",
          "start": 2035.968,
          "end": 2051.784
        }
      ],
      "steps": [
        {
          "h": "0 · Rules",
          "p": "Pin the library. Ban dead APIs. Require a HUD, URL parameters, and a ledger."
        },
        {
          "h": "1 · The test",
          "p": "A local server. Fail on any console error. Save the camera presets."
        },
        {
          "h": "2 · The ocean",
          "p": "Sun at 4°. One direction for sky and water. Four shots."
        },
        {
          "h": "Done",
          "p": "Clean console. The horizon looks like a photograph of the same hour."
        }
      ]
    },
    {
      "id": "close",
      "chapter": "Your first scene",
      "visual": "map",
      "title": "The map, in one picture",
      "subtitle": "Then go move the sliders.",
      "start": 2052.504,
      "end": 2156.448,
      "lines": [
        {
          "say": "Let us put the map back together, once, so you can carry it.",
          "show": "The map, once, so you can carry it.",
          "beat": "all",
          "start": 2052.504,
          "end": 2056.704
        },
        {
          "say": "Pixels come from code, from a capture of the world, from a generated asset, or from a video network that has no geometry. Hybrids wear a costume made of several of these. The costume is not the machine.",
          "show": "Code, capture, a generated asset, or video. A hybrid wears a costume. The costume is not the machine.",
          "beat": "families",
          "start": 2057.024,
          "end": 2070.536
        },
        {
          "say": "Inside the code path, a frame is a loop with a seventeen millisecond budget. The world is a tree of matrices, in meters. The camera is a pyramid. Materials answer metal and roughness, and they need an environment or they are black. Shaders are small programs. Draw calls are the other budget, and instancing is how a city fits inside it.",
          "show": "Loop, tree, pyramid, metal and roughness, shaders, draw calls.",
          "beat": "inside",
          "start": 2070.856,
          "end": 2093.632
        },
        {
          "say": "The ocean and the city are recipes on top of those pieces. Fresnel, Gerstner, one sun. A grid, a seed, shader windows, bloom on a leash.",
          "show": "Ocean: Fresnel, Gerstner, one sun. City: grid, seed, shader windows, bloom on a leash.",
          "beat": "recipes",
          "start": 2093.952,
          "end": 2105.112
        },
        {
          "say": "The agent is a fast writer with no eyes, until the screenshot loop. Looking early is the habit the benchmark could measure. One prompt is the start of that loop. It is not the whole story. If there is no prompt and no code, you are watching an ad.",
          "show": "The agent is blind until the loop. One prompt starts the loop. No code means an ad.",
          "beat": "agent",
          "start": 2105.432,
          "end": 2120.96
        },
        {
          "say": "The field guide in this repository has the live toys, the sources, and the starter prompts, including the rules file to copy. Open it when you want to drag the sliders yourself. The research snapshot is the seventeenth of October twenty twenty six. The mechanisms will age slower than the star counts.",
          "show": "The field guide has the live toys and the prompts. Snapshot: 17 October 2026.",
          "beat": "guide",
          "start": 2121.28,
          "end": 2139.808
        },
        {
          "say": "Then build the ocean. If that ocean gets good, the guide's last page is the next conversation. Push the water until it is actually impressive, and keep the screenshot harness, because the harness is the part that made it true.",
          "show": "Build the ocean. Keep the screenshot harness. That is the part that makes it true.",
          "beat": "guide",
          "start": 2140.128,
          "end": 2154.048
        }
      ]
    }
  ]
};
