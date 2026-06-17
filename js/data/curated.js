// =============================================================================
// curated.js — configuración + datos curados / simulados (fallback creíble)
// =============================================================================

// --- Configuración de feeds reales -----------------------------------------
export const CONFIG = {
  githubUser: "Arzuparreta",

  // España Transparente — Supabase REST público (RLS solo-lectura sobre conteos).
  // La anon key ya es pública por diseño (está en el bundle de producción).
  supabaseUrl: "https://desktop-ruben.taileed0d5.ts.net",
  supabaseKey: "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH",

  // now-playing y system se leen de la tabla pública `observatorio_state` del
  // mismo Supabase (la alimenta server/publish.sh en desktop-ruben).
  fetchTimeoutMs: 2200,
  cacheTtlMs: 10 * 60 * 1000, // 10 min para GitHub (límite anónimo 60/h)
};

// --- Identidad --------------------------------------------------------------
export const IDENTITY = {
  name: "Rubén Peña",
  handle: "arzuparreta",
  role: "ingeniero de sistemas / músico",
  tagline: "formado como músico clásico, pero prefiero las teclas mecánicas",
  bio: [
    "Diseño y mantengo infraestructura que ahorra dinero y hace trabajo de verdad.",
    "Construyo buscadores sobre mundos desordenados: el Estado, el cine, la música.",
    "Linux, self-hosting, datos. Y, cuando nadie mira, contrapunto.",
  ],
};

export const LINKS = {
  github: "https://github.com/Arzuparreta",
  linkedin: "https://www.linkedin.com/in/rub%C3%A9n-pe%C3%B1a-432953378/",
  youtube: "https://youtube.com/@Arzuparreta",
};

// --- Proyectos (para `ls` / `open`) ----------------------------------------
export const PROJECTS = [
  { name: "espana-transparente", lang: "TypeScript", url: "https://spaintransparencia.info",
    desc: "buscador sobre 950k+ contratos públicos y 33 fuentes oficiales" },
  { name: "escenas", lang: "TypeScript", url: "https://archivoescenas.xyz",
    desc: "archivo de cine — busca una frase, navega escena a escena" },
  { name: "stdb-kit", lang: "Python", url: "https://github.com/Arzuparreta/stdbKit",
    desc: "indexa subtítulos con búsqueda enlazada al timestamp (el motor)" },
  { name: "soundsible", lang: "Python", url: "https://github.com/Arzuparreta/soundsible",
    desc: "streaming musical self-hosted — tu propio Spotify, en tu casa" },
  { name: "synesthetic-visualizer", lang: "Rust", url: "https://github.com/Arzuparreta/synesthetic-visualizer",
    desc: "visualizador de audio: armonía → color vía mapa de Tonnetz" },
  { name: "remove-multi-titles-yt", lang: "JavaScript", url: "https://github.com/Arzuparreta/remove-multi-titles-yt",
    desc: "neutraliza el A/B testing de títulos de YouTube" },
];

// Búsquedas reales (refuerzan: 'él construye buscadores').
// `escenas` se resuelve aparte en la terminal contra la API (salta al clip).
export const SEARCH_TARGETS = {
  transparencia: (q) => `https://spaintransparencia.info/buscar?q=${encodeURIComponent(q)}`,
};

// --- Baselines de simulación ------------------------------------------------
export const SIM = {
  transparencia: {
    contratos: 953561,
    subvenciones: 1245803,
    diputados: 350,
    latestDate: "hoy",
  },
  github: {
    repos: 15, followers: 5, stars: 18,
    langs: ["TypeScript", "Python", "Rust", "JavaScript"],
    spark: [2, 1, 4, 3, 6, 2, 5, 8, 3, 4, 7, 5, 9, 4],
    latest: { repo: "escenas", when: "hace 2 días" },
  },
};

// Paletas para el comando `theme`
export const THEMES = [
  { name: "fósforo", accent: "#00ff9c", accent2: "#00d27f" },
  { name: "ámbar", accent: "#ffb000", accent2: "#d99200" },
  { name: "cian", accent: "#22d3ee", accent2: "#0bb6d4" },
  { name: "magenta", accent: "#ff4fd8", accent2: "#d63bb5" },
  { name: "hueso", accent: "#ececec", accent2: "#b9b9b9" },
];
