// js/feeds.js — fetchers para datos reales.
//   nowplaying  → Supabase observatorio_state (alimentada por server/publish.sh).
//   github      → repos desde js/data/repos.json (snapshot que GitHub Actions
//                 regenera cada 2 días) + actividad en vivo desde la API.
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

async function fetchJSON(url, { headers = {}, cache = "no-store" } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CONFIG.fetchTimeoutMs);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal, cache });
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

// Snapshot estático servido desde este mismo origen. Lo regenera
// .github/workflows/sync-repos.yml cada 2 días, así que la lista de proyectos y
// sus descripciones vienen de GitHub sin pedirle nada a la API en cada visita.
const REPOS_URL = new URL("./data/repos.json", import.meta.url).href;
let reposPromise = null;

function fetchRepos() {
  reposPromise ??= fetchJSON(REPOS_URL, { cache: "default" })
    .then((data) => (Array.isArray(data?.repos) ? data.repos : []))
    .catch(() => {
      reposPromise = null; // que un fallo puntual no queme el snapshot para toda la sesión
      return [];
    });
  return reposPromise;
}

export async function fetchGitHub() {
  const cached = cacheGet("arzuparreta:github");
  if (cached) return { ...cached, cached: true };

  // La actividad sí va en vivo: alimenta la frase "Ahora", que pierde sentido si
  // llega con dos días de retraso.
  const user = CONFIG.githubUser;
  const [repos, activity] = await Promise.all([
    fetchRepos(),
    fetchJSON(`https://api.github.com/users/${user}/events/public?per_page=100`)
      .then((events) => ({ events: Array.isArray(events) ? events : [], live: true }))
      .catch((err) => ({ events: [], live: false, error: err.message || "error" })),
  ]);

  const result = {
    repos,
    events: activity.events,
    live: activity.live,
    cached: false,
    ...(activity.error ? { error: activity.error } : {}),
  };
  if (repos.length) cacheSet("arzuparreta:github", result);
  return result;
}
