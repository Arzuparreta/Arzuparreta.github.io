// =============================================================================
// feeds.js — cada feed intenta el dato real (timeout corto) y, si falla,
// cae a un estado simulado que deriva en el tiempo. El observatorio nunca
// se ve roto; se vuelve real en cuanto el feed existe.
// =============================================================================

import { CONFIG, SIM, PLAYLIST } from "./data/curated.js";

// --- helpers ----------------------------------------------------------------
async function fetchJSON(url, { headers } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), CONFIG.fetchTimeoutMs);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (Date.now() - t > CONFIG.cacheTtlMs) return null;
    return v;
  } catch { return null; }
}
function cacheSet(key, v) {
  try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch {}
}

const jitter = (base, amp) => base + (Math.random() * 2 - 1) * amp;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// ============================================================================
// GITHUB — real vía api.github.com (público, CORS). Cacheado 10 min.
// ============================================================================
export const github = {
  data: { ...SIM.github },
  live: false,

  async refresh() {
    const cached = cacheGet("obs:gh");
    if (cached) { this.data = cached; this.live = true; return; }

    const u = CONFIG.githubUser;
    try {
      const [user, repos, events] = await Promise.all([
        fetchJSON(`https://api.github.com/users/${u}`),
        fetchJSON(`https://api.github.com/users/${u}/repos?per_page=100&sort=pushed`),
        fetchJSON(`https://api.github.com/users/${u}/events/public?per_page=100`).catch(() => []),
      ]);

      const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      const langCount = {};
      for (const r of repos) if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
      const langs = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 4).map((x) => x[0]);

      // sparkline: eventos por día (últimos 14 días)
      const days = 14;
      const buckets = new Array(days).fill(0);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      for (const ev of events) {
        const d = new Date(ev.created_at); d.setHours(0, 0, 0, 0);
        const idx = days - 1 - Math.round((today - d) / 86400000);
        if (idx >= 0 && idx < days) {
          const n = ev.type === "PushEvent" ? (ev.payload?.commits?.length || 1) : 1;
          buckets[idx] += n;
        }
      }
      const spark = buckets.some((x) => x > 0) ? buckets : SIM.github.spark;

      const newest = repos.filter((r) => !r.fork).sort(
        (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0];

      this.data = {
        repos: user.public_repos ?? repos.length,
        followers: user.followers ?? SIM.github.followers,
        stars,
        langs: langs.length ? langs : SIM.github.langs,
        spark,
        latest: newest
          ? { repo: newest.name, when: relTime(newest.pushed_at) }
          : SIM.github.latest,
      };
      this.live = true;
      cacheSet("obs:gh", this.data);
    } catch {
      this.data = { ...SIM.github };
      this.live = false;
    }
  },
};

// ============================================================================
// TRANSPARENCIA — Supabase REST público + ticker de mayor contrato.
// ============================================================================
export const transparencia = {
  data: { ...SIM.transparencia },
  live: false,
  _drift: 0,

  async refresh() {
    const base = CONFIG.supabaseUrl.replace(/\/$/, "") + "/rest/v1";
    const headers = { apikey: CONFIG.supabaseKey, Authorization: `Bearer ${CONFIG.supabaseKey}` };
    try {
      const rows = await fetchJSON(
        `${base}/section_index_cache?select=section_key,record_count,latest_date`, { headers });
      const by = Object.fromEntries(rows.map((r) => [r.section_key, r]));
      const serverC = by.contratos?.record_count ?? SIM.transparencia.contratos;
      // monotónico: el server es la verdad diaria; el tick simula el intradía
      const contratos = Math.max(serverC, this.data.contratos || 0);

      // ticker: mayor contrato de los últimos 90 días (puede fallar → fallback)
      let top = SIM.transparencia.top;
      try {
        const from = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
        const c = await fetchJSON(
          `${base}/contracts?select=amount,contractor,title&date=gte.${from}` +
          `&order=amount.desc.nullslast&limit=1`, { headers });
        if (c && c[0]) top = { amount: c[0].amount, contractor: c[0].contractor || c[0].title, windowDays: 90 };
      } catch {}

      this.data = {
        contratos,
        subvenciones: by.subvenciones?.record_count ?? SIM.transparencia.subvenciones,
        diputados: by.diputados?.record_count ?? SIM.transparencia.diputados,
        latestDate: by.contratos?.latest_date || SIM.transparencia.latestDate,
        top,
      };
      this._drift = 0;
      this.live = true;
    } catch {
      this.live = false; // mantiene baseline y sigue derivando en tick()
    }
  },

  tick(dt) {
    // sube el contador despacio para que se sienta vivo (real o simulado)
    this._drift += dt;
    if (this._drift > 4 + Math.random() * 6) {
      this._drift = 0;
      this.data.contratos += 1 + Math.floor(Math.random() * 3);
    }
  },
};

// ============================================================================
// NOW PLAYING — JSON publicado por el server (sanitizado) o playlist curada.
// ============================================================================
export const nowplaying = {
  data: null,
  live: false,
  _i: 0,
  _pos: 0,

  _fromPlaylist(i, pos = 0) {
    const t = PLAYLIST[i % PLAYLIST.length];
    return { title: t.title, artist: t.artist, album: t.album,
             position: pos, duration: t.dur, isPlaying: true };
  },

  init() {
    this._i = Math.floor(Math.random() * PLAYLIST.length);
    this._pos = Math.floor(Math.random() * 40);
    this.data = this._fromPlaylist(this._i, this._pos);
  },

  async refresh() {
    if (!CONFIG.nowPlayingUrl) { this.live = false; return; }
    try {
      const j = await fetchJSON(CONFIG.nowPlayingUrl);
      this.data = {
        title: j.title || "—", artist: j.artist || "", album: j.album || "",
        position: j.position_sec ?? 0, duration: j.duration_sec ?? 0,
        isPlaying: j.is_playing !== false,
      };
      this._pos = this.data.position;
      this.live = true;
    } catch { this.live = false; }
  },

  tick(dt) {
    if (this.live) return; // el server manda la posición
    if (!this.data.isPlaying) return;
    this._pos += dt;
    if (this._pos >= this.data.duration) {
      this._i = (this._i + 1) % PLAYLIST.length;
      this._pos = 0;
      this.data = this._fromPlaylist(this._i, 0);
      if (this._onChange) this._onChange();
    } else {
      this.data.position = this._pos;
    }
  },

  toggle() { if (!this.live) this.data.isPlaying = !this.data.isPlaying; return this.data.isPlaying; },
  next() {
    if (this.live) return;
    this._i = (this._i + 1) % PLAYLIST.length; this._pos = 0;
    this.data = this._fromPlaylist(this._i, 0);
    if (this._onChange) this._onChange();
  },
  onChange(fn) { this._onChange = fn; },
};

// ============================================================================
// SYSTEM — JSON publicado por el server o simulación viva.
// ============================================================================
export const system = {
  data: JSON.parse(JSON.stringify(SIM.system)),
  live: false,

  async refresh() {
    if (!CONFIG.statsUrl) { this.live = false; return; }
    try {
      const j = await fetchJSON(CONFIG.statsUrl);
      this.data = {
        uptimeSec: j.uptime_sec ?? this.data.uptimeSec,
        load: j.load ?? this.data.load,
        memPct: j.mem_pct ?? this.data.memPct,
        services: Array.isArray(j.services) ? j.services : this.data.services,
      };
      this.live = true;
    } catch { this.live = false; }
  },

  tick(dt) {
    this.data.uptimeSec += dt;
    if (this.live) return;
    this.data.load = clamp(jitter(this.data.load, 0.015), 0.02, 0.9);
    this.data.memPct = clamp(jitter(this.data.memPct, 0.4), 22, 71);
  },
};

// --- util de tiempo relativo (es) ------------------------------------------
function relTime(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return `hace ${Math.max(1, Math.round(s / 60))} min`;
  if (s < 86400) return `hace ${Math.round(s / 3600)} h`;
  const d = Math.round(s / 86400);
  return d <= 1 ? "ayer" : `hace ${d} días`;
}
