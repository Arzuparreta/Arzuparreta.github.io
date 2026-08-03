// js/now.js — pill de estado "Trabajando"/"Parece que no estoy" + sección de música

import { CONFIG } from "./data/curated.js";
import { resolveLiveUrl } from "./utils.js";
import { t, formatTimeAgo } from "./i18n.js";

// --- helpers ---

function lastEvent(events) {
  if (!Array.isArray(events)) return null;
  // Prefer PushEvent, fallback to any event type
  for (const ev of events) {
    if (ev?.type === "PushEvent" && ev?.created_at) return ev;
  }
  for (const ev of events) {
    if (ev?.created_at) return ev;
  }
  return null;
}

function repoNameFromEvent(ev) {
  const full = ev?.repo?.name || "";
  return full.split("/").pop() || full;
}

function findRepo(name, repos) {
  return repos?.find((r) => r.name === name || r.full_name?.endsWith(`/${name}`));
}

// --- pill de estado (solo trabajo) ---

export function render(np, gh, lang) {
  renderStatusPill(gh, lang);
  renderMusic(np, lang);
}

function renderStatusPill(gh, lang) {
  const line = document.querySelector(".now-line");
  const text = document.getElementById("now-text");
  if (!text) return;

  const events = gh?.events || [];
  const repos = gh?.repos || [];

  // Cualquier evento de GitHub → trabajando; sin eventos → away
  const hasActivity = events.length > 0;
  const status = hasActivity ? "status_working" : "status_away";

  const ev = lastEvent(events);
  const work = ev ? formatWorkPart(ev, repos, lang) : null;

  const parts = [statusDot(hasActivity) + " " + esc(t(status, {}, lang))];
  if (work) {
    parts.push(`<span class="now-sep">${esc(t("and", {}, lang))}</span> ` + work);
  }
  text.innerHTML = parts.join("");

  if (line) {
    line.classList.toggle("live", hasActivity);
    line.classList.toggle("offline", !hasActivity);
  }
}

function statusDot(live) {
  return `<span class="dot ${live ? "live" : ""}" aria-hidden="true"></span>`;
}

function formatWorkPart(ev, repos, lang) {
  if (!ev) return null;
  const name = repoNameFromEvent(ev);
  const repo = findRepo(name, repos);
  const url = resolveLiveUrl(repo) || `https://github.com/${CONFIG.githubUser}/${name}`;
  const ago = formatTimeAgo(ev.created_at, lang);
  const link = `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}</a>`;
  return t("last_change", { repo: link, ago }, lang);
}

// --- sección de música (SoundSible) ---

function renderMusic(np, lang) {
  const section = document.getElementById("music-section");
  const text = document.getElementById("music-text");
  const cover = document.getElementById("music-cover");
  if (!section) return;

  const isPlaying = np?.live && np?.isPlaying && np?.title;

  if (isPlaying) {
    section.classList.remove("hidden");
    const track = np.artist ? `${np.title} · ${np.artist}` : np.title;
    if (text) text.innerHTML = `${esc(t("listening", {}, lang))} ${esc(track)}`;
    if (cover) {
      cover.src = np.cover || "";
      cover.alt = track;
    }
  } else {
    section.classList.add("hidden");
    if (cover) cover.src = "";
  }
}

// --- util ---

function esc(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
