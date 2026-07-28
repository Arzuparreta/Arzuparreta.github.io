// js/projects.js — grid de proyectos, extraídos en vivo desde GitHub.
// Cada tarjeta prioriza el enlace a la web en producción; el repo es secundario.

import { enrich } from "./data/enrichments.js";
import { CONFIG } from "./data/curated.js";
import { resolveLiveUrl, projectUrl, escHtml } from "./utils.js";
import { t, formatTimeAgo } from "./i18n.js";

const LANGUAGE_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#bfa230",
  Python: "#3572A5",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Java: "#b07219",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
};

let state = { repos: [], sort: "recent", showForks: false, lang: "es" };
let inited = false;

function grid() {
  return document.getElementById("work-grid");
}

function sortGroup() {
  return document.getElementById("work-sort");
}

export function init() {
  if (inited) return;
  inited = true;
  const g = sortGroup();
  if (!g) return;
  g.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-sort]");
    if (!btn) return;
    setSort(btn.dataset.sort);
  });
}

export function setSort(sort) {
  state.sort = sort;
  const g = sortGroup();
  for (const b of g?.querySelectorAll("button[data-sort]") || []) {
    b.classList.toggle("active", b.dataset.sort === sort);
  }
  render();
}

export function setLanguage(lang) {
  state.lang = lang;
  render();
}

export function setRepos(repos, lang) {
  state.repos = Array.isArray(repos) ? repos : [];
  state.lang = lang || state.lang;
  render();
}

function render() {
  const list = filterAndSort();
  const g = grid();
  if (!g) return;
  g.innerHTML = "";
  if (!list.length) {
    g.innerHTML = `<p class="empty">${escHtml(t("no_projects", {}, state.lang))}</p>`;
    return;
  }
  const frag = document.createDocumentFragment();
  for (const r of list) frag.appendChild(card(r));
  g.appendChild(frag);
}

function filterAndSort() {
  const handle = CONFIG.githubUser.toLowerCase();
  let list = [...state.repos];
  list = list.filter((r) => {
    const name = r.name?.toLowerCase?.();
    // Exclude the profile repo and any GitHub Pages repos (<name>.github.io).
    return name !== handle && !name?.endsWith(".github.io");
  });
  if (!state.showForks) list = list.filter((r) => !r.fork);
  switch (state.sort) {
    case "stars":
      list.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
      break;
    case "live":
      list = list.filter((r) => resolveLiveUrl(r));
      list.sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0));
      break;
    default:
      list.sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0));
  }
  return list;
}

function card(r) {
  const liveUrl = resolveLiveUrl(r);
  const repoUrl = projectUrl(r);
  // Manda la descripción real del repo en GitHub; las escritas a mano solo
  // rellenan los huecos de los repos que no tienen ninguna.
  const enr = enrich(r);
  const desc = (r.description || enr?.[state.lang] || "").trim() || t("no_desc", {}, state.lang);
  const archived = !!r.archived;

  const article = document.createElement("article");
  article.className = "project-card" + (archived ? " archived" : "");

  const header = document.createElement("div");
  header.className = "project-header";

  const title = document.createElement("h3");
  title.className = "project-name";
  title.textContent = r.name;
  header.appendChild(title);

  if (liveUrl) {
    const badge = document.createElement("span");
    badge.className = "live-badge";
    badge.textContent = t("live", {}, state.lang);
    header.appendChild(badge);
  }
  if (archived) {
    const badge = document.createElement("span");
    badge.className = "archived-badge";
    badge.textContent = t("archived", {}, state.lang);
    header.appendChild(badge);
  }

  const p = document.createElement("p");
  p.className = "project-desc";
  p.textContent = desc;

  const meta = document.createElement("div");
  meta.className = "project-meta";
  if (r.language) {
    meta.appendChild(chip(languageDot(r.language) + escHtml(r.language)));
  }
  if (r.stargazers_count) {
    meta.appendChild(chip(`★ ${r.stargazers_count}`));
  }
  meta.appendChild(chip(formatTimeAgo(r.pushed_at, state.lang)));

  const actions = document.createElement("div");
  actions.className = "project-actions";
  if (liveUrl) {
    actions.appendChild(linkBtn(liveUrl, t("visit", {}, state.lang), "primary"));
  }
  actions.appendChild(linkBtn(repoUrl, t("code", {}, state.lang), "secondary"));

  article.append(header, p, meta, actions);
  return article;
}

function chip(html) {
  const s = document.createElement("span");
  s.className = "meta-chip";
  s.innerHTML = html;
  return s;
}

function linkBtn(href, text, kind) {
  const a = document.createElement("a");
  a.href = href;
  a.className = `btn-${kind}`;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = text;
  return a;
}

function languageDot(lang) {
  const color = LANGUAGE_COLORS[lang] || "#9ca3af";
  return `<span class="lang-dot" style="background:${escHtml(color)}" aria-hidden="true"></span>`;
}
