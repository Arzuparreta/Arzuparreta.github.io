export const CONFIG = {
  githubUser: "Arzuparreta",

  // Supabase REST pública (anon key intencionalmente pública, RLS solo lectura).
  // Esta URL alimenta el estado 'nowplaying' desde server/publish.sh.
  supabaseUrl: "https://desktop-ruben.taileed0d5.ts.net",
  supabaseKey: "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH",

  fetchTimeoutMs: 2200,
  cacheTtlMs: 10 * 60 * 1000, // 10 min para el límite anónimo de GitHub (60/h)
};

export const IDENTITY = {
  name: "Rubén Peña",
  handle: "arzuparreta",
  location: { es: "España", en: "Spain" },
  role: {
    es: "Construyo cosas en internet",
    en: "I build things on the internet",
  },
};

export const LINKS = {
  github: "https://github.com/Arzuparreta",
  linkedin: "https://www.linkedin.com/in/rub%C3%A9n-pe%C3%B1a-432953378/",
  youtube: "https://youtube.com/@Arzuparreta",
  email: null, // ej. "mailto:ruben@example.com"
};
