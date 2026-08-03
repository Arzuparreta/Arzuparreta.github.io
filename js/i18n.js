const DEFAULT_LANG = "es";
const STORAGE_KEY = "arzuparreta:lang";
let current = DEFAULT_LANG;

const STRINGS = {
  es: {
    role: "Construyo cosas en internet",
    now: "Ahora",
    work: "Lo que hago",
    connect: "Conecta",
    loading: "conectando…",
    status_here: "Aquí",
    status_working: "Trabajando",
    status_away: "Parece que no estoy",
    status_offline: "Sin conexión",
    listening: "escuchando",
    and: "·",
    pushed_to: "hace {ago} subí cambios a {repo}",
    last_change: "último cambio en {repo} hace {ago}",
    ago_min: "{n}m",
    ago_hour: "{n}h",
    ago_day: "{n}d",
    just_now: "ahora mismo",
    nothing_playing: "nada sonando",
    sort_recent: "Recientes",
    sort_stars: "Más estrellas",
    sort_live: "Con web en vivo",
    visit: "Visitar →",
    code: "Código",
    live: "en vivo",
    archived: "archivado",
    no_desc: "Sin descripción.",
    footer_by: "hecho por mí",
    lang_label: "ES / EN",
    live_session: "Sesión en vivo",
    no_projects: "No hay proyectos por aquí todavía.",
  },
  en: {
    role: "I build things on the internet",
    now: "Now",
    work: "What I do",
    connect: "Connect",
    loading: "connecting…",
    status_here: "Here",
    status_working: "Working",
    status_away: "Looks like I'm away",
    status_offline: "Offline — back soon",
    listening: "listening to",
    and: "·",
    pushed_to: "pushed to {repo} {ago}",
    last_change: "last change on {repo} {ago}",
    ago_min: "{n}m ago",
    ago_hour: "{n}h ago",
    ago_day: "{n}d ago",
    just_now: "just now",
    nothing_playing: "nothing playing",
    sort_recent: "Recent",
    sort_stars: "Most stars",
    sort_live: "With live site",
    visit: "Visit →",
    code: "Code",
    live: "live",
    archived: "archived",
    no_desc: "No description.",
    footer_by: "made by me",
    lang_label: "EN / ES",
    live_session: "Live session",
    no_projects: "No projects here yet.",
  },
};

const LISTENERS = new Set();
const KNOWN = new Set(["es", "en"]);

export function init() {
  current = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_LANG;
  if (!KNOWN.has(current)) current = DEFAULT_LANG;
  applyHTMLLang();
  refreshStatic();
}

export function getLang() {
  return current;
}

export function toggle() {
  current = current === "es" ? "en" : "es";
  localStorage.setItem(STORAGE_KEY, current);
  applyHTMLLang();
  refreshStatic();
  for (const fn of LISTENERS) fn(current);
}

export function addListener(fn) {
  LISTENERS.add(fn);
}

export function t(key, vars = {}, lang = current) {
  const s = STRINGS[lang]?.[key] ?? STRINGS[DEFAULT_LANG]?.[key] ?? key;
  return String(s).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

export function formatTimeAgo(iso, lang = current) {
  if (!iso) return t("just_now", {}, lang);
  const ts = Date.parse(iso);
  if (!ts || ts < 0) return t("just_now", {}, lang);
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return t("just_now", {}, lang);
  const m = Math.floor(s / 60);
  if (m < 60) return t("ago_min", { n: m }, lang);
  const h = Math.floor(m / 60);
  if (h < 24) return t("ago_hour", { n: h }, lang);
  const d = Math.floor(h / 24);
  return t("ago_day", { n: d }, lang);
}

function refreshStatic() {
  for (const el of document.querySelectorAll("[data-i18n]")) {
    const key = el.dataset.i18n;
    if (!key) continue;
    el.textContent = t(key);
  }
}

function applyHTMLLang() {
  document.documentElement.lang = current;
}
