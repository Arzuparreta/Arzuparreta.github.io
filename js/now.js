// js/now.js — la frase de estado "Ahora": combina música + actividad de GitHub
// en una sola línea legible para cualquiera.

import { CONFIG } from "./data/curated.js";
import { resolveLiveUrl } from "./utils.js";
import { t, formatTimeAgo } from "./i18n.js";

const ACTIVE_MINUTES = 30;

function lastEvent(events) {
  if (!Array.isArray(events)) return null;
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

export function render(np, gh, lang) {
  const line = document.querySelector(".now-line");
  const text = document.getElementById("now-text");
  const coverWrap = document.getElementById("now-playing");
  const coverImg = document.getElementById("now-cover");
  if (!text) return;

  const events = gh?.events || [];
  const repos = gh?.repos || [];
  const ev = lastEvent(events);
  const now = Date.now();

  const present = np?.live && np?.isPlaying;
  const lastActiveDelta = ev ? now - new Date(ev.created_at).getTime() : Infinity;
  const isRecentlyActive = lastActiveDelta < ACTIVE_MINUTES * 60 * 1000;

  let status = "status_away";
  if (!np?.live && !events.length && !gh?.live) status = "status_offline";
  else if (present) status = "status_here";
  else if (isRecentlyActive) status = "status_working";

  const body = [esc(t(status, {}, lang))];

  const music = formatMusicPart(np, lang);
  if (music) body.push(music);

  const work = formatWorkPart(ev, repos, lang, isRecentlyActive);
  if (work) body.push(work);

  const sep = ` <span class="now-sep">${esc(t("and", {}, lang))}</span> `;
  text.innerHTML = statusDot(status) + " " + body.join(sep);

  if (line) {
    line.classList.toggle("live", status === "status_here" || status === "status_working");
    line.classList.toggle("offline", status === "status_offline" || status === "status_away");
  }

  if (coverImg) {
    if (np?.cover) {
      coverImg.src = np.cover;
      coverImg.alt = `${np.title || ""} · ${np.artist || ""}`;
      coverWrap?.classList.remove("hidden");
    } else {
      coverWrap?.classList.add("hidden");
      coverImg.src = "";
    }
  }
}

function statusDot(status) {
  const live = status === "status_here" || status === "status_working";
  return `<span class="dot ${live ? "live" : ""}" aria-hidden="true"></span>`;
}

function formatMusicPart(np, lang) {
  if (!np?.title) return null;
  const track = np.artist ? `${np.title} · ${np.artist}` : np.title;
  return `${esc(t("listening", {}, lang))} ${esc(track)}`;
}

function formatWorkPart(ev, repos, lang, recent) {
  if (!ev) return null;
  const name = repoNameFromEvent(ev);
  const repo = findRepo(name, repos);
  const url = resolveLiveUrl(repo) || `https://github.com/${CONFIG.githubUser}/${name}`;
  const ago = formatTimeAgo(ev.created_at, lang);
  const link = `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}</a>`;
  const tpl = recent ? "pushed_to" : "last_change";
  return t(tpl, { repo: link, ago }, lang);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
