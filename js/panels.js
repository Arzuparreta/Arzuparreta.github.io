// =============================================================================
// panels.js — pinta y refresca cada panel a partir de los snapshots de feeds.
// =============================================================================

import { pickByDay, SCENES } from "./data/curated.js";

const $ = (id) => document.getElementById(id);
const nf = new Intl.NumberFormat("es-ES");

function fmtTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
function fmtUptime(sec) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}
function fmtEur(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2).replace(".", ",") + " mil M€";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(".", ",") + "M€";
  if (n >= 1e3) return Math.round(n / 1e3) + "k€";
  return nf.format(n) + "€";
}

// marca el panel como live (●) o simulado (○)
function setSrc(panel, live) {
  const tag = document.querySelector(`.panel--${panel} .panel-tag[data-src]`);
  if (!tag) return;
  tag.classList.toggle("live", !!live);
  tag.classList.toggle("sim", !live);
  tag.textContent = live ? "live" : "sim";
}

// --- contador con count-up suave -------------------------------------------
let _trCur = 0, _trRaf = null;
function setCounter(target) {
  const el = $("tr-counter");
  const start = _trCur || 0;
  if (Math.abs(target - start) <= 3) { _trCur = target; el.textContent = nf.format(target); return; }
  const t0 = performance.now();
  const dur = start === 0 ? 1400 : 700;
  cancelAnimationFrame(_trRaf);
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
    const v = Math.round(start + (target - start) * e);
    el.textContent = nf.format(v);
    if (p < 1) _trRaf = requestAnimationFrame(step);
    else _trCur = target;
  };
  _trRaf = requestAnimationFrame(step);
}

// --- GitHub -----------------------------------------------------------------
export function renderGithub(d, live) {
  setSrc("github", live);
  $("gh-repos").textContent = d.repos;
  $("gh-followers").textContent = d.followers;
  $("gh-stars").textContent = d.stars;

  const max = Math.max(1, ...d.spark);
  $("gh-spark").innerHTML = d.spark
    .map((v) => `<i style="height:${Math.max(8, (v / max) * 100)}%"></i>`).join("");

  $("gh-langs").innerHTML = d.langs
    .map((l) => `<span class="lang-chip">${l}</span>`).join("");

  $("gh-latest").innerHTML =
    `último push · <span class="repo">${d.latest.repo}</span> · ${d.latest.when}`;
}

// --- Transparencia ----------------------------------------------------------
export function renderTransparencia(d, live) {
  setSrc("transparencia", live);
  setCounter(d.contratos);
  $("tr-sub").innerHTML =
    `${nf.format(d.subvenciones)} subvenciones · ${d.diputados} diputados · act. ${d.latestDate}`;
  if (d.top) {
    $("tr-ticker").innerHTML =
      `mayor contrato (${d.top.windowDays}d): <b>${fmtEur(d.top.amount)}</b> → ${d.top.contractor}`;
  }
}

// --- Now playing ------------------------------------------------------------
export function renderNowPlaying(d, live) {
  setSrc("nowplaying", live);
  $("np-title").textContent = d.title;
  $("np-artist").textContent = d.artist;
  $("np-album").textContent = d.album;
  const pct = d.duration ? Math.min(100, (d.position / d.duration) * 100) : 0;
  $("np-fill").style.width = pct + "%";
  $("np-pos").textContent = fmtTime(d.position);
  $("np-dur").textContent = fmtTime(d.duration);
  $("np-eq").classList.toggle("paused", !d.isPlaying);
}

// --- System -----------------------------------------------------------------
export function renderSystem(d, live) {
  setSrc("system", live);
  $("sys-uptime").textContent = fmtUptime(d.uptimeSec);
  $("sys-load").textContent = d.load.toFixed(2);
  $("sys-mem").style.width = d.memPct.toFixed(0) + "%";
  $("sys-services").innerHTML = d.services
    .map((s) => `<span class="svc ${s.up ? "" : "down"}"><i class="led"></i>${s.name}</span>`)
    .join("");
}

// --- Escena del día ---------------------------------------------------------
export function renderEscena() {
  const s = pickByDay(SCENES);
  $("esc-quote").textContent = s.quote;
  $("esc-film").textContent = s.film;
}

// efecto: parpadeo de un panel (lo usa la terminal)
export function flashPanel(name) {
  const el = document.querySelector(`.panel--${name}`);
  if (!el) return;
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}
