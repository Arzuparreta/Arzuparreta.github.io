// js/feeds.js — fetchers para datos reales.
//   nowplaying  → Supabase observatorio_state (alimentada por server/publish.sh).
//   github      → API pública de GitHub (repos + actividad), cacheado 10 min.
// Si algo falla, se devuelve un estado honesto; nunca se inventa.

import { CONFIG } from "./data/curated.js";

const SUPABASE = CONFIG.supabaseUrl.replace(/\/$/, "") + "/rest/v1";
const SUPA_HEADERS = {
  apikey: CONFIG.supabaseKey,
  Authorization: `Bearer ${CONFIG.supabaseKey}`,
};
const NOW_FRESH_MS = 90 * 1000;

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (Date.now() - t > CONFIG.cacheTtlMs) return null;
    return v;
  } catch {
    return null;
  }
}

function cacheSet(key, v) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
  } catch {}
}

async function fetchJSON(url, { headers = {} } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CONFIG.fetchTimeoutMs);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchNowplaying() {
  const empty = {
    isPlaying: false,
    title: null,
    artist: null,
    album: null,
    cover: null,
    updatedAt: 0,
    live: false,
  };
  try {
    const rows = await fetchJSON(
      `${SUPABASE}/observatorio_state?select=value,updated_at&key=eq.nowplaying`,
      { headers: SUPA_HEADERS }
    );
    const row = rows?.[0];
    const v = row?.value || {};
    const updatedAt = row?.updated_at ? Date.parse(row.updated_at) : 0;
    const fresh = updatedAt && Date.now() - updatedAt < NOW_FRESH_MS;
    return {
      isPlaying: fresh && !!v.is_playing && !!v.title,
      title: v.title || null,
      artist: v.artist || null,
      album: v.album || null,
      cover: v.cover_url || null,
      updatedAt,
      live: fresh,
    };
  } catch {
    return { ...empty, error: true };
  }
}

export async function fetchGitHub() {
  const cached = cacheGet("arzuparreta:github");
  if (cached) return { ...cached, live: true, cached: true };

  try {
    const user = CONFIG.githubUser;
    const [repos, events] = await Promise.all([
      fetchJSON(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`),
      fetchJSON(`https://api.github.com/users/${user}/events/public?per_page=100`).catch(() => []),
    ]);
    const result = {
      repos: Array.isArray(repos) ? repos : [],
      events: Array.isArray(events) ? events : [],
      live: true,
      cached: false,
    };
    cacheSet("arzuparreta:github", result);
    return result;
  } catch (err) {
    return { repos: [], events: [], live: false, cached: false, error: err.message || "error" };
  }
}
