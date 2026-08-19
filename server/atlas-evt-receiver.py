#!/usr/bin/env python3
"""Atlas Analytics receiver (Python port, deployed on www.f8w.com).

Contract identical to server/atlas-evt-receiver.js:
- POST /api/atlas/evt  {aid, t, name, payload}
- CORS: only https://www.f8w.com / https://atlas.f8w.com, NO credentials
- body limit 1KB, strict event/field whitelists, strings > 60 chars or
  arrays > 30 items invalidate the whole event (Prompt text can never pass)
- appends one JSON line per day: data/atlas-events-YYYY-MM-DD.jsonl

Run:  /usr/bin/python3 /opt/atlas/atlas-evt-receiver.py   (PORT env, default 8901)
"""
import json
import os
import re
import threading
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

PORT = int(os.environ.get('PORT', '8901'))
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
ALLOWED_ORIGINS = ('https://www.f8w.com', 'https://atlas.f8w.com')
MAX_BODY = 1024
MAX_STR = 60
MAX_ARRAY = 30

EVENT_FIELDS = {
    'page_view': ('path', 'ref', 'lang'),
    'check_started': ('mode', 'model', 'scene', 'promptLength'),
    'check_completed': ('foundAtoms', 'controlLevel', 'coverage', 'invalidCount'),
    'evidence_viewed': ('atomId', 'kind'),
    'recommendation_applied': ('atomId', 'slot', 'source'),
    'export_clicked': ('kind', 'atomsCount'),
    'share_created': ('kind', 'score'),
    'feedback_vote': ('atomId', 'vote'),
}
EXPORT_KINDS = ('prompt', 'optimized_prompt', 'recipe', 'storyboard')
SHARE_KINDS = ('check_report', 'recipe_card', 'atom_card', 'storyboard_card')
AID_RE = re.compile(r'^[A-Za-z0-9-]{8,64}$')

_write_lock = threading.Lock()


def filter_event(name, payload):
    fields = EVENT_FIELDS.get(name)
    if fields is None:
        return None
    out = {}
    for k in fields:
        v = payload.get(k) if isinstance(payload, dict) else None
        if v is None:
            continue
        if isinstance(v, str):
            if not v or len(v) > MAX_STR:
                return None
            out[k] = v
        elif isinstance(v, bool):
            continue
        elif isinstance(v, (int, float)):
            if v != v or v in (float('inf'), float('-inf')):  # NaN/inf guard
                return None
            out[k] = v
        elif isinstance(v, list):
            if not v or len(v) > MAX_ARRAY:
                return None
            if any(not isinstance(x, str) or not x or len(x) > MAX_STR for x in v):
                return None
            out[k] = v
    if name == 'export_clicked' and out.get('kind') not in EXPORT_KINDS:
        return None
    if name == 'share_created' and out.get('kind') not in SHARE_KINDS:
        return None
    return out


def append_event(record):
    os.makedirs(DATA_DIR, exist_ok=True)
    day = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    path = os.path.join(DATA_DIR, 'atlas-events-%s.jsonl' % day)
    with _write_lock:
        with open(path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(record, ensure_ascii=False, separators=(',', ':')) + '\n')


class Handler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def _cors(self):
        origin = self.headers.get('Origin')
        if origin in ALLOWED_ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Vary', 'Origin')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # deliberately NO Access-Control-Allow-Credentials

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_POST(self):
        if urlsplit(self.path).path != '/api/atlas/evt':
            self._reply(404, b'not found')
            return
        length = int(self.headers.get('Content-Length') or 0)
        if length > MAX_BODY:
            self._reply(400, b'too large')
            return
        body = self.rfile.read(length) if length else b''
        try:
            json_body = json.loads(body.decode('utf-8'))
        except Exception:
            self._reply(400, b'bad request')
            return
        if (not isinstance(json_body, dict)
                or not isinstance(json_body.get('aid'), str)
                or not AID_RE.match(json_body['aid'])
                or not isinstance(json_body.get('name'), str)
                or not isinstance(json_body.get('payload'), dict)):
            self._reply(400, b'bad request')
            return
        filtered = filter_event(json_body['name'], json_body['payload'])
        if filtered is None:
            self._reply(422, b'invalid event')
            return
        t = json_body.get('t')
        if not isinstance(t, (int, float)) or isinstance(t, bool):
            t = None
        record = {
            'aid': json_body['aid'],
            't': t if t is not None else int(datetime.now(timezone.utc).timestamp() * 1000),
            'name': json_body['name'],
            'payload': filtered,
            'recvAt': datetime.now(timezone.utc).isoformat(),
        }
        try:
            append_event(record)
        except Exception:
            self._reply(500, b'storage error')
            return
        self.send_response(204)
        self._cors()
        self.send_header('Content-Length', '0')
        self.end_headers()

    def _reply(self, code, msg):
        self.send_response(code)
        self._cors()
        self.send_header('Content-Type', 'text/plain')
        body = msg + b'\n'
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass  # keep journald quiet per request


if __name__ == '__main__':
    server = ThreadingHTTPServer(('127.0.0.1', PORT), Handler)
    print('atlas-evt-receiver (py) listening on 127.0.0.1:%d (POST /api/atlas/evt)' % PORT, flush=True)
    server.serve_forever()
