import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, 'out');
const types = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.json': 'application/json'
};

function serve(port) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const path = join(root, decodeURIComponent(url.pathname));
    if (!path.startsWith(root)) { res.writeHead(403); res.end(); return; }
    const stream = createReadStream(path);
    stream.on('error', () => { res.writeHead(404); res.end(); });
    stream.on('open', () => {
      res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
      stream.pipe(res);
    });
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'inherit'] });
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error('ffmpeg ' + code)));
  });
}

function ffprobe(args) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffprobe', args, { stdio: ['ignore', 'pipe', 'inherit'] });
    let data = '';
    p.stdout.on('data', (d) => { data += d; });
    p.on('exit', (code) => code === 0 ? resolve(data) : reject(new Error('ffprobe ' + code)));
  });
}

async function slateEnd(video) {
  const raw = await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', [
      '-ss', '0', '-t', '3', '-i', video,
      '-vf', 'fps=20,scale=64:36', '-f', 'rawvideo', '-pix_fmt', 'rgb24', 'pipe:1'
    ], { stdio: ['ignore', 'pipe', 'ignore'] });
    const chunks = [];
    p.stdout.on('data', (d) => chunks.push(d));
    p.on('exit', (code) => code === 0 ? resolve(Buffer.concat(chunks)) : reject(new Error('slate scan ' + code)));
  });
  const frame = 64 * 36 * 3;
  const n = Math.floor(raw.length / frame);
  let last = -1;
  for (let i = 0; i < n; i++) {
    const o = i * frame + (18 * 64 + 32) * 3;
    const r = raw[o], g = raw[o + 1], b = raw[o + 2];
    if (r > 180 && g < 80 && b > 180) last = i;
  }
  if (last < 0) return 0;
  return (last + 1) / 20;
}

const port = 8765;
await mkdir(outDir, { recursive: true });
const server = await serve(port);
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: [
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--ignore-gpu-blocklist',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--hide-scrollbars'
  ]
});
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } }
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(String(err)));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.goto('http://127.0.0.1:' + port + '/film.html?record=1', { waitUntil: 'load' });
await page.waitForFunction(() => window.__armed === true);
const duration = await page.evaluate(() => window.TIMELINE.duration);
console.log('lesson duration', duration);
await page.evaluate(() => window.__start());
const timer = setInterval(async () => {
  try {
    const t = await page.evaluate(() => document.getElementById('clock').textContent + ' done=' + window.__done);
    console.log('progress', t);
  } catch (err) { console.log('progress unreadable', String(err)); }
}, 60000);
try {
  await page.waitForFunction(() => window.__done === true, null, { timeout: (duration + 45) * 1000 });
} finally {
  clearInterval(timer);
}
await page.waitForTimeout(400);
const video = page.video();
await context.close();
await browser.close();
server.close();
const webm = await video.path();
console.log('raw video', webm, 'errors', errors.length);
if (errors.length) console.log(errors.slice(0, 12).join('\n'));

const slate = await slateEnd(webm);
console.log('slate ends at', slate);
if (slate <= 0) throw new Error('sync slate not found in the recording');
const timelineSrc = await readFile(join(root, 'timeline.js'), 'utf8');
const timeline = JSON.parse(timelineSrc.replace(/^window\.TIMELINE\s*=\s*/, '').replace(/;\s*$/, ''));
let meta = ';FFMETADATA1\n';
for (const ch of timeline.chapters) {
  const start = Math.max(0, Math.round((ch.start) * 1000));
  const end = Math.max(start + 1, Math.round(ch.end * 1000));
  meta += `[CHAPTER]\nTIMEBASE=1/1000\nSTART=${start}\nEND=${end}\ntitle=${ch.title}\n`;
}
const metaPath = join(outDir, 'chapters.txt');
await writeFile(metaPath, meta);
const webmDur = parseFloat(await ffprobe([
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nokey=1:noprint_wrappers=1', webm
]));
// Playwright stamps frames on a 25 fps clock that runs ahead of the page clock,
// and the lead is not steady, so this lines the ending up with the narration.
// Check the burned-in clock in the middle; a second pass may still be needed.
const ratio = (webmDur - slate) / timeline.duration;
console.log('speed correction', ratio.toFixed(6), 'webm', webmDur.toFixed(3), 'lesson', timeline.duration);
if (!(ratio > 0.5 && ratio < 2)) throw new Error('implausible speed ratio ' + ratio);
const mp4 = join(outDir, 'how_an_agent_builds_a_3d_scene.mp4');
await ffmpeg([
  '-y', '-i', webm, '-i', join(root, 'audio', 'narration.wav'), '-f', 'ffmetadata', '-i', metaPath,
  '-filter_complex', `[0:v]trim=start=${slate.toFixed(3)},setpts=(PTS-STARTPTS)/${ratio.toFixed(6)}[v]`,
  '-map', '[v]', '-map', '1:a', '-map_metadata', '2',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'fast',
  '-c:a', 'aac', '-b:a', '160k', '-ar', '48000',
  '-movflags', '+faststart', '-shortest', mp4
]);
const probed = await ffprobe(['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nokey=1:noprint_wrappers=1', mp4]);
console.log('mp4', mp4, 'duration', probed.trim());
