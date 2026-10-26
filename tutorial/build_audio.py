#!/usr/bin/env python3
"""Synthesize narration and write timeline.js + audio/narration.m4a.

Rerun from tutorial/:  python3 build_audio.py
"""
from __future__ import annotations

import asyncio
import json
import subprocess
import sys
from pathlib import Path

import edge_tts

from script import GAP_LINE, GAP_SCENE, LEAD, RATE, SCENES, TAIL, VOICE

ROOT = Path(__file__).resolve().parent
AUDIO = ROOT / "audio"
LINES = AUDIO / "lines"
SR = 24000


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def wav_seconds(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=nokey=1:noprint_wrappers=1", str(path),
        ],
        text=True,
    ).strip()
    return float(out)


def silence(path: Path, seconds: float) -> None:
    run(
        [
            "ffmpeg", "-y", "-f", "lavfi", "-i",
            f"anullsrc=r={SR}:cl=mono", "-t", f"{seconds:.3f}",
            "-c:a", "pcm_s16le", str(path),
        ]
    )


async def synth_all(jobs: list[tuple[str, Path]]) -> None:
    sem = asyncio.Semaphore(5)

    async def one(text: str, dest: Path) -> None:
        last = None
        for attempt in range(4):
            try:
                async with sem:
                    comm = edge_tts.Communicate(text, VOICE, rate=RATE)
                    mp3 = dest.with_suffix(".mp3")
                    await comm.save(str(mp3))
                if mp3.stat().st_size < 400:
                    raise RuntimeError(f"tiny mp3 for {dest.name}")
                run(
                    [
                        "ffmpeg", "-y", "-i", str(mp3), "-ar", str(SR),
                        "-ac", "1", "-c:a", "pcm_s16le", str(dest),
                    ]
                )
                mp3.unlink(missing_ok=True)
                return
            except Exception as exc:  # network blips
                last = exc
                await asyncio.sleep(1.5 * (attempt + 1))
        raise RuntimeError(f"TTS failed for {dest.name}: {last}")

    await asyncio.gather(*(one(text, dest) for text, dest in jobs))


def main() -> None:
    LINES.mkdir(parents=True, exist_ok=True)
    jobs = []
    for si, scene in enumerate(SCENES):
        for li, line in enumerate(scene["lines"]):
            dest = LINES / f"s{si:02d}l{li:02d}.wav"
            jobs.append((line["say"], dest))
    print(f"synthesizing {len(jobs)} lines", flush=True)
    asyncio.run(synth_all(jobs))

    pieces: list[Path] = []
    cursor = 0.0
    chapters: list[dict] = []
    chapter_name = None

    lead = LINES / "_lead.wav"
    tail = LINES / "_tail.wav"
    gap_l = LINES / "_gap_line.wav"
    gap_s = LINES / "_gap_scene.wav"
    silence(lead, LEAD)
    silence(tail, TAIL)
    silence(gap_l, GAP_LINE)
    silence(gap_s, GAP_SCENE)

    scenes_out = []
    for si, scene in enumerate(SCENES):
        if scene["chapter"] != chapter_name:
            chapter_name = scene["chapter"]
            chapters.append({"title": chapter_name, "start": cursor})
        scene_start = cursor
        lines_out = []
        if si == 0:
            pieces.append(lead)
            cursor += LEAD
        for li, line in enumerate(scene["lines"]):
            if li > 0:
                pieces.append(gap_l)
                cursor += GAP_LINE
            wav = LINES / f"s{si:02d}l{li:02d}.wav"
            dur = wav_seconds(wav)
            lines_out.append({
                "say": line["say"],
                "show": line["show"],
                "beat": line["beat"],
                "start": round(cursor, 3),
                "end": round(cursor + dur, 3),
            })
            pieces.append(wav)
            cursor += dur
        if si < len(SCENES) - 1:
            pieces.append(gap_s)
            cursor += GAP_SCENE
        else:
            pieces.append(tail)
            cursor += TAIL
        scene_end = cursor
        payload = {
            "id": scene["id"],
            "chapter": scene["chapter"],
            "visual": scene["visual"],
            "title": scene["title"],
            "subtitle": scene.get("subtitle", ""),
            "start": round(scene_start, 3),
            "end": round(scene_end, 3),
            "lines": lines_out,
        }
        for key in ("cards", "checks", "code", "steps", "stats", "versions"):
            if key in scene:
                payload[key] = scene[key]
        scenes_out.append(payload)

    for i, ch in enumerate(chapters):
        nxt = chapters[i + 1]["start"] if i + 1 < len(chapters) else cursor
        ch["end"] = round(nxt, 3)
        ch["start"] = round(ch["start"], 3)

    concat = AUDIO / "concat.txt"
    concat.write_text("".join(f"file '{p.as_posix()}'\n" for p in pieces), encoding="utf-8")
    master = AUDIO / "narration.wav"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat), "-c", "copy", str(master)])
    measured = wav_seconds(master)
    m4a = AUDIO / "narration.m4a"
    run(
        [
            "ffmpeg", "-y", "-i", str(master),
            "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
            str(m4a),
        ]
    )
    timeline = {
        "duration": round(measured, 3),
        "voice": VOICE,
        "chapters": chapters,
        "scenes": scenes_out,
    }
    (ROOT / "timeline.js").write_text(
        "window.TIMELINE = " + json.dumps(timeline, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"duration {measured:.1f}s  ({measured/60:.1f} min)  lines {len(jobs)}", flush=True)
    if abs(measured - cursor) > 0.25:
        print(f"WARNING timeline sum {cursor:.3f} vs wav {measured:.3f}", file=sys.stderr)


if __name__ == "__main__":
    main()
