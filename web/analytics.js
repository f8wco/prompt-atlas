/* ============================================================
   Atlas Analytics (P0-002) — consent-gated, minimal, Prompt-safe.
   - opt-in ONLY: nothing is stored or sent before explicit consent.
   - pseudonymous random analysis id ("atlas-aid"), 90-day rolling.
   - strict event whitelist + payload filter: unknown fields dropped,
     any string > 60 chars or array > 30 items invalidates the event.
     Prompt text can therefore never enter analytics.
   - export_clicked and share_created kinds are strictly separated:
     a share is never counted as an export (North Star hygiene).
   UMD-lite: browser -> window.AtlasAnalytics, node -> module.exports
   ============================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.AtlasAnalytics = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ENDPOINT = 'https://www.f8w.com/api/atlas/evt';
  var CONSENT_KEY = 'atlas-consent'; // 'granted' | 'local' | absent
  var AID_KEY = 'atlas-aid';
  var AID_EXP_KEY = 'atlas-aid-exp';
  var AID_MS = 90 * 24 * 3600 * 1000; // 90-day rolling retention
  var MAX_STR = 60;
  var MAX_ARRAY = 30;

  var EVENT_FIELDS = {
    page_view: ['path', 'ref', 'lang'],
    check_started: ['mode', 'model', 'scene', 'promptLength'],
    check_completed: ['foundAtoms', 'controlLevel', 'coverage', 'invalidCount'],
    evidence_viewed: ['atomId', 'kind'],
    recommendation_applied: ['atomId', 'slot', 'source'],
    export_clicked: ['kind', 'atomsCount'],
    share_created: ['kind', 'score'],
    feedback_vote: ['atomId', 'vote']
  };
  var EXPORT_KINDS = ['prompt', 'optimized_prompt', 'recipe', 'storyboard'];
  var SHARE_KINDS = ['check_report', 'recipe_card', 'atom_card', 'storyboard_card'];

  function filterEvent(name, payload) {
    var fields = EVENT_FIELDS[name];
    if (!fields) return null; // unknown event kind -> reject whole event
    var out = {};
    for (var i = 0; i < fields.length; i++) {
      var k = fields[i];
      var v = payload ? payload[k] : undefined;
      if (v === undefined || v === null) continue;
      if (typeof v === 'string') {
        if (!v || v.length > MAX_STR) return null;
        out[k] = v;
      } else if (typeof v === 'number' && isFinite(v)) {
        out[k] = v;
      } else if (Array.isArray(v)) {
        if (v.length === 0 || v.length > MAX_ARRAY) return null;
        var arr = [];
        for (var j = 0; j < v.length; j++) {
          var x = v[j];
          if (typeof x !== 'string' || !x || x.length > MAX_STR) return null;
          arr.push(x);
        }
        out[k] = arr;
      }
      // other types (objects/booleans) are silently dropped
    }
    if (name === 'export_clicked' && EXPORT_KINDS.indexOf(out.kind) === -1) return null;
    if (name === 'share_created' && SHARE_KINDS.indexOf(out.kind) === -1) return null;
    return out;
  }

  var storage = null; // injectable for tests
  var network = true; // set false in tests to disable sending
  function get(k) { try { return storage ? storage.getItem(k) : null; } catch (e) { return null; } }
  function set(k, v) { try { if (storage) storage.setItem(k, v); } catch (e) { /* private mode etc. */ } }
  function del(k) { try { if (storage) storage.removeItem(k); } catch (e) { /* ignore */ } }

  function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'a-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function consentState() { return get(CONSENT_KEY) || null; }
  function setConsent(value) {
    if (value !== 'granted' && value !== 'local') return;
    set(CONSENT_KEY, value);
    if (value === 'local') clearLocalId(); // leaving consent -> remove the id immediately
  }
  function clearLocalId() { del(AID_KEY); del(AID_EXP_KEY); }

  function ensureAid() {
    var now = Date.now();
    var exp = Number(get(AID_EXP_KEY)) || 0;
    var aid = get(AID_KEY);
    if (!aid || exp < now) { // absent or past rolling window -> new id
      aid = uuid();
      set(AID_KEY, aid);
    }
    set(AID_EXP_KEY, now + AID_MS);
    return aid;
  }

  function enabled() { return consentState() === 'granted'; }

  function send(envelope) {
    if (!network) return true; // test mode
    try {
      var body = JSON.stringify(envelope);
      // NOTE: send the body as a plain string (Content-Type: text/plain) — a
      // CORS-safelisted type that skips preflight entirely. A JSON Blob would
      // trigger an OPTIONS preflight that beacons cannot complete reliably.
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        if (navigator.sendBeacon(ENDPOINT, body)) return true;
      }
      if (typeof fetch === 'function') {
        fetch(ENDPOINT, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: body }).catch(function () { /* fire and forget */ });
        return true;
      }
    } catch (e) { /* never break the page for analytics */ }
    return false;
  }

  function track(name, payload) {
    if (!enabled()) return false;
    var filtered = filterEvent(name, payload);
    if (!filtered) return false;
    return send({ aid: ensureAid(), t: Date.now(), name: name, payload: filtered });
  }

  function init(opts) {
    opts = opts || {};
    if (opts.storage !== undefined) storage = opts.storage;
    else if (typeof localStorage !== 'undefined') storage = localStorage;
    if (opts.send === false) network = false;
    return api;
  }

  var api = {
    ENDPOINT: ENDPOINT,
    EVENT_FIELDS: EVENT_FIELDS,
    EXPORT_KINDS: EXPORT_KINDS,
    SHARE_KINDS: SHARE_KINDS,
    filterEvent: filterEvent,
    init: init,
    consentState: consentState,
    setConsent: setConsent,
    clearLocalId: clearLocalId,
    enabled: enabled,
    track: track,
    pageView: function (path, ref, lang) { return track('page_view', { path: path, ref: ref, lang: lang }); }
  };
  init();
  return api;
}));
