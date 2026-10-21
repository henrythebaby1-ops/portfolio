// Portfolio server: node serve.mjs → http://localhost:5500
// Also starts the chess game (:3000), Localhoster (:4000) and Fileupdater (:8790) so every project can be playtested,
// and forwards /ollama to a local Ollama so OpenCode can chat.
import http from 'node:http';
import net from 'node:net';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5500;
const OLLAMA = new URL(process.env.OLLAMA_HOST || 'http://127.0.0.1:11434');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.woff2': 'font/woff2' };

const APPS = [
  { name: 'chess', port: 3000, file: path.resolve(ROOT, '../../chess-clean 3/server.js') },
  { name: 'localhoster', port: 4000, file: path.resolve(ROOT, '../localhoster/server.mjs') },
  { name: 'fileupdater', port: 8790, file: path.resolve(ROOT, '../../FOD (Folder of Doom)/Fileupdater/server/server.js'), cwd: path.resolve(ROOT, '../../FOD (Folder of Doom)/Fileupdater') }
];

const portFree = port => new Promise(resolve => {
  const probe = net.createServer().once('error', () => resolve(false)).once('listening', () => probe.close(() => resolve(true)));
  probe.listen(port);
});

const children = [];
for (const app of APPS) {
  if (!(await portFree(app.port))) { console.log(`${app.name} already running on :${app.port}`); continue; }
  try { await fs.access(app.file); } catch { console.log(`${app.name} not found at ${app.file}`); continue; }
  const child = spawn(process.execPath, [app.file], { cwd: app.cwd || path.dirname(app.file), env: { ...process.env, PORT: String(app.port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  const tag = data => process.stdout.write(String(data).replace(/^(?=.)/gm, `[${app.name}] `));
  child.stdout.on('data', tag);
  child.stderr.on('data', tag);
  children.push(child);
}
const stopAll = () => { children.forEach(c => c.kill()); process.exit(); };
process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);

const proxyOllama = (req, res) => {
  const upstream = http.request({
    hostname: OLLAMA.hostname, port: OLLAMA.port, method: req.method,
    path: req.url.replace(/^\/ollama/, '') || '/', headers: { ...req.headers, host: OLLAMA.host }
  }, up => { res.writeHead(up.statusCode, up.headers); up.pipe(res); });
  upstream.on('error', () => { res.writeHead(502, { 'Content-Type': 'application/json' }).end('{"error":"Ollama is not running"}'); });
  req.pipe(upstream);
};

const send = async (res, file) => {
  const body = await fs.readFile(file);
  res.writeHead(200, { 'Content-Type': (TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream') + '; charset=utf-8' });
  res.end(body);
};

http.createServer(async (req, res) => {
  if (req.url.startsWith('/ollama/')) return proxyOllama(req, res);
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }
  try {
    await send(res, file);
  } catch {
    // OpenCode's build asks for /assets/... from the site root
    try { if (rel.startsWith('/assets/')) return await send(res, path.join(ROOT, 'games/opencode', rel)); } catch {}
    res.writeHead(404).end('Not found');
  }
}).listen(PORT, () => console.log(`Portfolio running on http://localhost:${PORT}`));
