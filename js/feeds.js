// =============================================================================
// feeds.js — datos reales.
//   github / transparencia → APIs públicas (GitHub, Supabase de Esp. Transp.)
//   nowplaying / system    → tabla pública `observatorio_state` que alimenta
//                            el publisher local (server/publish.sh) cada ~10s.
// Si un feed real no responde: github/transparencia tienen baseline; nowplaying
// y system muestran estado HONESTO (nada sonando / sin conexión), nunca inventan.
// =============================================================================

import { CONFIG, SIM } from "./data/curated.js";

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

const SUPA = CONFIG.supabaseUrl.replace(/\/$/, "") + "/rest/v1";
const supaHeaders = { apikey: CONFIG.supabaseKey, Authorization: `Bearer ${CONFIG.supabaseKey}` };
const FRESH_MS = 90 * 1000; // un feed está "vivo" si el publisher actualizó hace <90s

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
        latest: newest ? { repo: newest.name, when: relTime(newest.pushed_at) } : SIM.github.latest,
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
// El número es real (cambia a diario); no lo inflamos artificialmente.
// ============================================================================
export const transparencia = {
  data: { ...SIM.transparencia },
  live: false,

  async refresh() {
    const headers = supaHeaders;
    try {
      const rows = await fetchJSON(
        `${SUPA}/section_index_cache?select=section_key,record_count,latest_date`, { headers });
      const by = Object.fromEntries(rows.map((r) => [r.section_key, r]));
      const contratos = by.contratos?.record_count ?? SIM.transparencia.contratos;

      let top = SIM.transparencia.top;
      try {
        const from = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
        const c = await fetchJSON(
          `${SUPA}/contracts?select=amount,contractor,title&date=gte.${from}` +
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
      this.live = true;
    } catch {
      this.live = false;
    }
  },
};

// ============================================================================
// NOW PLAYING — tabla observatorio_state (key=nowplaying), alimentada por el
// publisher local que lee tu Soundsible. Si no suena nada → honesto.
// ============================================================================
export const nowplaying = {
  data: { isPlaying: false, title: null, artist: null, album: null, position: 0, duration: 0, cover: null },
  live: false,
  _pos: 0,
  _lastTitle: null,
  _onChange: null,

  init() {},
  onChange(fn) { this._onChange = fn; },

  async refresh() {
    try {
      const rows = await fetchJSON(
        `${SUPA}/observatorio_state?select=value,updated_at&key=eq.nowplaying`, { headers: supaHeaders });
      const row = rows?.[0];
      const v = row?.value || {};
      const fresh = row?.updated_at ? Date.now() - Date.parse(row.updated_at) < FRESH_MS : false;
      const playing = !!v.is_playing && !!v.title;
      this.data = {
        isPlaying: playing,
        title: v.title || null,
        artist: v.artist || null,
        album: v.album || null,
        position: v.position_sec || 0,
        duration: v.duration_sec || 0,
        cover: v.cover_url || null,
      };
      this._pos = this.data.position;
      this.live = fresh;
      if (playing && v.title !== this._lastTitle && this._onChange) this._onChange();
      this._lastTitle = playing ? v.title : null;
    } catch {
      this.live = false;
    }
  },

  tick(dt) {
    // avanza la posición localmente entre refrescos, solo si suena de verdad
    if (this.live && this.data.isPlaying && this.data.duration) {
      this._pos = Math.min(this.data.duration, this._pos + dt);
      this.data.position = this._pos;
    }
  },
};

// ============================================================================
// SYSTEM — tabla observatorio_state (key=system) del publisher local.
// Valores reales; el uptime avanza suave entre refrescos.
// ============================================================================
export const system = {
  data: { uptimeSec: 0, load: 0, memPct: 0, services: [] },
  live: false,
  _base: 0,
  _baseAt: 0,

  async refresh() {
    try {
      const rows = await fetchJSON(
        `${SUPA}/observatorio_state?select=value,updated_at&key=eq.system`, { headers: supaHeaders });
      const row = rows?.[0];
      const v = row?.value || {};
      const fresh = row?.updated_at ? Date.now() - Date.parse(row.updated_at) < FRESH_MS : false;
      this.data = {
        uptimeSec: v.uptime_sec || 0,
        load: v.load ?? 0,
        memPct: v.mem_pct ?? 0,
        services: Array.isArray(v.services) ? v.services : [],
      };
      this._base = this.data.uptimeSec;
      this._baseAt = Date.now();
      this.live = fresh;
    } catch {
      this.live = false;
    }
  },

  tick() {
    if (this.live && this._baseAt) {
      this.data.uptimeSec = this._base + Math.floor((Date.now() - this._baseAt) / 1000);
    }
  },
};

// ============================================================================
// ESCENAS — API pública real de archivoescenas.xyz (/api/feed). La "escena del
// día" se fija con seed=fecha (estable todo el día, cambia mañana). El link va
// al clip de YouTube en su timestamp (lo mismo que reproduce el modal del sitio).
// ============================================================================
export const escenas = {
  data: null,
  live: false,

  async refresh() {
    try {
      const seed = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const r = await fetchJSON(`https://archivoescenas.xyz/api/feed?seed=${seed}&limit=1`);
      const it = r?.items?.[0];
      if (!it) { this.live = false; return; }
      const start = Math.floor(it.playback_start_sec || 0);
      const title = it.scene_label || it.film_title || it.title || "escena";
      // deep-link al propio archivoescenas (se reproduce en su modal, no en YouTube)
      const clip = it.youtube_id
        ? `https://archivoescenas.xyz/?v=${it.youtube_id}${start > 0 ? `&t=${start}` : ""}&title=${encodeURIComponent(title)}`
        : "https://archivoescenas.xyz";
      this.data = {
        title,
        meta: [it.director, it.year].filter(Boolean).join(" · "),
        thumb: it.thumbnail_url ||
          (it.youtube_id ? `https://img.youtube.com/vi/${it.youtube_id}/hqdefault.jpg` : null),
        clip,
      };
      this.live = true;
    } catch {
      this.live = false;
    }
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
