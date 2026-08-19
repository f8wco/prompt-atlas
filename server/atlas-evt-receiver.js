'use strict';
/* Atlas Analytics receiver (P0-004) — zero-dependency Node HTTP endpoint.
   POST /api/atlas/evt  { aid, t, name, payload }

   Contract (mirrors web/analytics.js):
   - CORS: only https://www.f8w.com and https://atlas.f8w.com, no credentials
   - body limit 1KB, strict event-name whitelist, field whitelist + length caps
   - appends one JSON line per day file: data/atlas-events-YYYY-MM-DD.jsonl
   - never stores anything beyond the filtered envelope (Prompt text cannot
     pass the filters even if a buggy client tried to send it)

   Run:  node server/atlas-evt-receiver.js            (default port 8901)
         PORT=8901 node server/atlas-evt-receiver.js
   Production: put behind nginx (TLS termination) — see server/README.md */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8901;
const ALLOWED_ORIGINS = ['https://www.f8w.com', 'https://atlas.f8w.com'];
const MAX_BODY = 1024;
const MAX_STR = 60;
const MAX_ARRAY = 30;

const EVENT_FIELDS = {
  page_view: ['path', 'ref', 'lang'],
  check_started: ['mode', 'model', 'scene', 'promptLength'],
  check_completed: ['foundAtoms', 'controlLevel', 'coverage', 'invalidCount'],
  evidence_viewed: ['atomId', 'kind'],
  recommendation_applied: ['atomId', 'slot', 'source'],
  export_clicked: ['kind', 'atomsCount'],
  share_created: ['kind', 'score'],
  feedback_vote: ['atomId', 'vote']
};
const EXPORT_KINDS = ['prompt', 'optimized_prompt', 'recipe', 'storyboard'];
const SHARE_KINDS = ['check_report', 'recipe_card', 'atom_card', 'storyboard_card'];

const AID_RE = /^[A-Za-z0-9-]{8,64}$/;

function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.indexOf(origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // deliberately NO Access-Control-Allow-Credentials
}

function filterEvent(name, payload) {
  const fields = EVENT_FIELDS[name];
  if (!fields) return null;
  const out = {};
  for (const k of fields) {
    const v = payload ? payload[k] : undefined;
    if (v === undefined || v === null) continue;
    if (typeof v === 'string') {
      if (!v || v.length > MAX_STR) return null;
      out[k] = v;
    } else if (typeof v === 'number' && isFinite(v)) {
      out[k] = v;
    } else if (Array.isArray(v)) {
      if (!v.length || v.length > MAX_ARRAY) return null;
      if (v.some(x => typeof x !== 'string' || !x || x.length > MAX_STR)) return null;
      out[k] = v;
    }
  }
  if (name === 'export_clicked' && !EXPORT_KINDS.includes(out.kind)) return null;
  if (name === 'share_created' && !SHARE_KINDS.includes(out.kind)) return null;
  return out;
}

function appendEvent(line) {
  const dir = path.join(__dirname, 'data');
  fs.mkdirSync(dir, { recursive: true });
  const day = new Date().toISOString().slice(0, 10);
  fs.appendFileSync(path.join(dir, 'atlas-events-' + day + '.jsonl'), line + '\n');
}

const server = http.createServer(function (req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method !== 'POST' || req.url.split('?')[0] !== '/api/atlas/evt') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
    return;
  }
  let body = '';
  let tooLarge = false;
  req.on('data', function (chunk) {
    body += chunk;
    if (body.length > MAX_BODY) { tooLarge = true; req.destroy(); }
  });
  req.on('end', function () {
    if (tooLarge) return; // connection already torn down
    let json = null;
    try { json = JSON.parse(body); } catch (e) { /* fallthrough */ }
    if (!json || typeof json !== 'object'
      || typeof json.aid !== 'string' || !AID_RE.test(json.aid)
      || typeof json.name !== 'string'
      || !json.payload || typeof json.payload !== 'object') {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('bad request');
      return;
    }
    const filtered = filterEvent(json.name, json.payload);
    if (!filtered) {
      res.writeHead(422, { 'Content-Type': 'text/plain' });
      res.end('invalid event');
      return;
    }
    const record = {
      aid: json.aid,
      t: typeof json.t === 'number' && isFinite(json.t) ? json.t : Date.now(),
      name: json.name,
      payload: filtered,
      recvAt: new Date().toISOString()
    };
    try {
      appendEvent(JSON.stringify(record));
      res.writeHead(204);
      res.end();
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('storage error');
    }
  });
});

server.listen(PORT, function () {
  console.log('atlas-evt-receiver listening on :' + PORT + ' (POST /api/atlas/evt)');
});
