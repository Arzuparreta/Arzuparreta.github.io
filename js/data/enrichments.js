// js/data/enrichments.js — red de seguridad: descripciones escritas a mano para
// repos que no tienen ninguna en GitHub.
// La descripción del repo en GitHub siempre tiene prioridad (ver projects.js);
// esto solo entra cuando el campo "Description" del repo está vacío. Lo suyo es
// escribirla en GitHub y que aquí no haga falta nada.

const ENRICHMENTS = {
  "espana-transparente": {
    es: "Un buscador para navegar contratos y subvenciones públicas en España.",
    en: "A search engine to browse Spanish public contracts and subsidies.",
  },
  spaintransparencia: {
    es: "Un buscador para navegar contratos y subvenciones públicas en España.",
    en: "A search engine to browse Spanish public contracts and subsidies.",
  },
  "spaintransparencia.info": {
    es: "Un buscador para navegar contratos y subvenciones públicas en España.",
    en: "A search engine to browse Spanish public contracts and subsidies.",
  },
  escenas: {
    es: "Buscador de escenas de cine. Escribe una frase y salta al momento exacto.",
    en: "A film scene search engine. Type a line and jump to the exact moment.",
  },
  archivoescenas: {
    es: "Buscador de escenas de cine. Escribe una frase y salta al momento exacto.",
    en: "A film scene search engine. Type a line and jump to the exact moment.",
  },
  "escenas-stdb": {
    es: "Buscador de escenas de cine. Escribe una frase y salta al momento exacto.",
    en: "A film scene search engine. Type a line and jump to the exact moment.",
  },
  "stdb-kit": {
    es: "Indexa subtítulos para buscar diálogos y saltar al timestamp.",
    en: "Indexes subtitles to search dialogue and jump to timestamps.",
  },
  soundsible: {
    es: "Streaming musical self-hosteado: tu propio Spotify en casa.",
    en: "Self-hosted music streaming: your own Spotify at home.",
  },
  "synesthetic-visualizer": {
    es: "Visualiza armonía musical como color a través del Tonnetz.",
    en: "Visualizes musical harmony as color through the Tonnetz.",
  },
  "remove-multi-titles-yt": {
    es: "Neutraliza el A/B testing de títulos de YouTube.",
    en: "Neutralizes YouTube title A/B testing.",
  },
};

export function enrich(repo) {
  if (!repo) return null;
  return ENRICHMENTS[repo.name?.toLowerCase?.()] ?? null;
}
