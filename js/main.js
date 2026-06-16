// =============================================================================
// main.js — arranque (boot), orquestación de feeds, loop de actualización.
// =============================================================================

import { IDENTITY } from "./data/curated.js";
import * as feeds from "./feeds.js";
import * as panels from "./panels.js";
import { initBackground } from "./background.js";
import { initTerminal } from "./terminal.js";

const $ = (id) => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- temas ------------------------------------------------------------------
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}
function applyTheme(t) {
  const s = document.documentElement.style;
  const rgb = hexToRgb(t.accent);
  s.setProperty("--accent", t.accent);
  s.setProperty("--accent-2", t.accent2);
  s.setProperty("--accent-dim", `rgba(${rgb},0.42)`);
  s.setProperty("--accent-ghost", `rgba(${rgb},0.08)`);
  s.setProperty("--panel-border", `rgba(${rgb},0.16)`);
  s.setProperty("--panel-border-hover", `rgba(${rgb},0.40)`);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#0a0a0a");
  if (bg) bg.setColor();
}

// --- render helpers ---------------------------------------------------------
const drawGithub = () => panels.renderGithub(feeds.github.data, feeds.github.live);
const drawTrans  = () => panels.renderTransparencia(feeds.transparencia.data, feeds.transparencia.live);
const drawNow    = () => panels.renderNowPlaying(feeds.nowplaying.data, feeds.nowplaying.live);
const drawSys    = () => panels.renderSystem(feeds.system.data, feeds.system.live);
const drawEscena = () => panels.renderEscena(feeds.escenas.data, feeds.escenas.live);

// --- inicialización ---------------------------------------------------------
const bg = initBackground();
feeds.nowplaying.init();
feeds.nowplaying.onChange(() => bg.pulse());

const term = initTerminal({
  nowplaying: feeds.nowplaying,
  system: feeds.system,
  escenas: feeds.escenas,
  background: bg,
  applyTheme,
  flashPanel: panels.flashPanel,
});

// pintado inicial (se sustituye al llegar los datos reales)
drawGithub(); drawTrans(); drawNow(); drawSys();

// --- reloj ------------------------------------------------------------------
function updateClock() {
  $("clock").textContent = new Date().toLocaleTimeString("es-ES", { hour12: false });
}
updateClock();

// --- estado de red ----------------------------------------------------------
function setNet(online) {
  const el = $("net-status");
  el.classList.toggle("offline", !online);
  el.lastChild.textContent = online ? "online" : "offline";
}
window.addEventListener("online", () => setNet(true));
window.addEventListener("offline", () => setNet(false));
setNet(navigator.onLine);

// --- refrescos reales -------------------------------------------------------
function refreshGithub() { feeds.github.refresh().then(drawGithub); }
function refreshTrans()  { feeds.transparencia.refresh().then(drawTrans); }
function refreshNow()    { feeds.nowplaying.refresh().then(drawNow); }
function refreshSys()    { feeds.system.refresh().then(drawSys); }
function refreshEscena() { feeds.escenas.refresh().then(drawEscena); }

refreshGithub(); refreshTrans(); refreshNow(); refreshSys(); refreshEscena();
setInterval(refreshGithub, 10 * 60 * 1000);
setInterval(refreshTrans, 60 * 1000);
setInterval(refreshEscena, 30 * 60 * 1000);
setInterval(() => { refreshNow(); refreshSys(); }, 12 * 1000);

// --- loop de 1s (cosas que viven cada segundo) ------------------------------
setInterval(() => {
  updateClock();
  feeds.nowplaying.tick(1);
  feeds.system.tick(1);
  drawNow(); drawSys();
}, 1000);

// --- boot -------------------------------------------------------------------
function runBoot() {
  return new Promise((resolve) => {
    const bootEl = $("boot");
    const log = $("boot-log");

    const finishNow = () => { bootEl.classList.add("hidden"); setTimeout(resolve, 380); };

    if (sessionStorage.getItem("obs:booted") || reduce) {
      log.innerHTML = `<span class="who">arzuparreta@observatorio</span> · ready.`;
      finishNow();
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return; done = true;
      sessionStorage.setItem("obs:booted", "1");
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
      finishNow();
    };
    const onSkip = () => finish();
    window.addEventListener("keydown", onSkip);
    window.addEventListener("pointerdown", onSkip);

    const seq = [
      ["arzuparreta BIOS · observatorio v1", 320],
      ["inicializando subsistemas…", 360],
      ['  mount /github ............... <span class="ok">ok</span>', 140],
      ['  mount /transparencia ........ <span class="ok">ok</span>', 140],
      ['  mount /nowplaying ........... <span class="ok">ok</span>', 140],
      ['  mount /system ............... <span class="ok">ok</span>', 140],
      ['  mount /escenas .............. <span class="ok">ok</span>', 220],
      [`whoami: <span class="who">${IDENTITY.name}</span> — ${IDENTITY.role}`, 260],
      ['<span class="ok">ready.</span>', 300],
    ];
    let i = 0;
    (function step() {
      if (done) return;
      if (i >= seq.length) { setTimeout(finish, 480); return; }
      const [html, delay] = seq[i++];
      log.innerHTML += (log.innerHTML ? "\n" : "") + html;
      setTimeout(step, delay);
    })();
  });
}

// --- reveal -----------------------------------------------------------------
runBoot().then(() => {
  const app = $("app");
  app.classList.add("ready");
  app.setAttribute("aria-hidden", "false");
  panels.initPanelLinks();
  term.greet();
  term.focus();
});
