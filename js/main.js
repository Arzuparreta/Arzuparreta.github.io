// js/main.js — orquestación del sitio, i18n, feeds y render.

import * as i18n from "./i18n.js";
import * as feeds from "./feeds.js";
import * as now from "./now.js";
import * as projects from "./projects.js";
import { IDENTITY, LINKS } from "./data/curated.js";

const ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.215 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.545 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
};

const LABELS = {
  github: { es: "GitHub", en: "GitHub" },
  linkedin: { es: "LinkedIn", en: "LinkedIn" },
  youtube: { es: "YouTube", en: "YouTube" },
  email: { es: "Email", en: "Email" },
};

function init() {
  i18n.init();
  renderIdentity();
  renderConnect();
  updateFooter();

  i18n.addListener((lang) => {
    renderIdentity();
    renderConnect();
    refreshNow(lang);
    projects.setLanguage(lang);
    updateFooter();
  });

  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => i18n.toggle());
  }

  projects.init();
  refreshAll();

  setInterval(() => refreshNow(i18n.getLang()), 15_000);
  setInterval(() => refreshProjects(), 10 * 60 * 1000);
  setInterval(updateFooter, 60_000);

  window.addEventListener("online", updateNetStatus);
  window.addEventListener("offline", updateNetStatus);
  updateNetStatus();

  document.documentElement.classList.add("ready");
}

function renderIdentity() {
  const lang = i18n.getLang();
  const roleEl = document.getElementById("role");
  if (roleEl) roleEl.textContent = IDENTITY.role[lang];
}

function renderConnect() {
  const lang = i18n.getLang();
  const g = document.getElementById("connect-grid");
  if (!g) return;
  g.innerHTML = "";

  for (const key of Object.keys(LINKS)) {
    const url = LINKS[key];
    if (!url) continue;
    const label = LABELS[key]?.[lang] ?? key;
    const icon = ICONS[key] ?? ICONS.email;

    const card = document.createElement("a");
    card.href = url;
    card.className = "connect-card";
    card.target = key === "email" ? "_self" : "_blank";
    card.rel = "noopener";
    card.innerHTML = `
      <span class="connect-icon">${icon}</span>
      <span class="connect-meta">
        <span class="connect-name">${escHtml(label)}</span>
        <span class="connect-url">${escHtml(hostOf(url))}</span>
      </span>
    `;
    g.appendChild(card);
  }
}

async function refreshAll() {
  const lang = i18n.getLang();
  const [np, gh] = await Promise.all([feeds.fetchNowplaying(), feeds.fetchGitHub()]);
  now.render(np, gh, lang);
  projects.setRepos(gh.repos, lang);
}

async function refreshNow(lang) {
  const np = await feeds.fetchNowplaying();
  const gh = await feeds.fetchGitHub();
  now.render(np, gh, lang || i18n.getLang());
}

async function refreshProjects() {
  const lang = i18n.getLang();
  const gh = await feeds.fetchGitHub();
  projects.setRepos(gh.repos, lang);
}

function updateFooter() {
  const time = document.getElementById("footer-time");
  if (time) {
    const locale = i18n.getLang() === "es" ? "es-ES" : "en-US";
    time.textContent = new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  updateNetStatus();
}

function updateNetStatus() {
  const dot = document.querySelector(".live-dot");
  if (dot) dot.classList.toggle("offline", !navigator.onLine);
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
