// =============================================================================
// panels.js — pinta y refresca cada panel a partir de los snapshots de feeds.
// =============================================================================

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

// marca el panel como live (●) o no (○ con etiqueta honesta)
function setSrc(panel, live, offLabel = "sim") {
  const tag = document.querySelector(`.panel--${panel} .panel-tag[data-src]`);
  if (!tag) return;
  tag.classList.toggle("live", !!live);
  tag.classList.toggle("sim", !live);
  tag.textContent = live ? "live" : offLabel;
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

// --- Now playing (honesto: nada sonando / sin conexión, nunca inventado) -----
export function renderNowPlaying(d, live) {
  setSrc("nowplaying", live, "offline");
  const playing = live && d.isPlaying && d.title;
  if (!live) {
    $("np-title").textContent = "— sin conexión —";
    $("np-artist").textContent = "el publisher no responde";
    $("np-album").textContent = "";
  } else if (!playing) {
    $("np-title").textContent = "— nada sonando —";
    $("np-artist").textContent = "Soundsible en silencio";
    $("np-album").textContent = "";
  } else {
    $("np-title").textContent = d.title;
    $("np-artist").textContent = d.artist || "";
    $("np-album").textContent = d.album || "";
  }
  const pct = playing && d.duration ? Math.min(100, (d.position / d.duration) * 100) : 0;
  $("np-fill").style.width = pct + "%";
  $("np-pos").textContent = fmtTime(playing ? d.position : 0);
  $("np-dur").textContent = fmtTime(playing ? d.duration : 0);

  // carátula (cae a glifo si no hay o si la imagen falla)
  const art = $("np-art"), img = $("np-cover");
  img.onerror = () => art.classList.remove("has-cover");
  if (playing && d.cover) {
    if (img.getAttribute("src") !== d.cover) img.setAttribute("src", d.cover);
    art.classList.add("has-cover");
  } else {
    art.classList.remove("has-cover");
    img.removeAttribute("src");
  }
  art.classList.toggle("idle", !playing);
  $("np-eq").classList.toggle("paused", !playing);
}

// --- System (real; honesto si el publisher no responde) ----------------------
export function renderSystem(d, live) {
  setSrc("system", live, "offline");
  if (!live) {
    $("sys-uptime").textContent = "—";
    $("sys-load").textContent = "—";
    $("sys-mem").style.width = "0%";
    $("sys-services").innerHTML = '<span class="dim">publisher sin conexión</span>';
    return;
  }
  $("sys-uptime").textContent = fmtUptime(d.uptimeSec);
  $("sys-load").textContent = d.load.toFixed(2);
  $("sys-mem").style.width = d.memPct.toFixed(0) + "%";
  $("sys-services").innerHTML = d.services
    .map((s) => `<span class="svc ${s.up ? "" : "down"}"><i class="led"></i>${s.name}</span>`)
    .join("");
}

// --- Escena del día (real, desde archivoescenas; honesto si la API cae) ------
export function renderEscena(d, live) {
  const link = $("esc-link"), img = $("esc-img");
  if (!live || !d) {
    $("esc-quote").textContent = "— archivo sin conexión —";
    $("esc-film").textContent = "";
    link.classList.remove("has-img");
    img.removeAttribute("src");
    link.setAttribute("href", "https://archivoescenas.xyz");
    return;
  }
  $("esc-quote").textContent = d.title;
  $("esc-film").textContent = d.meta || "";
  link.setAttribute("href", d.clip);
  if (d.thumb) {
    img.onerror = () => link.classList.remove("has-img");
    if (img.getAttribute("src") !== d.thumb) img.setAttribute("src", d.thumb);
    link.classList.add("has-img");
  } else {
    link.classList.remove("has-img");
    img.removeAttribute("src");
  }
}

// efecto: parpadeo de un panel (lo usa la terminal)
export function flashPanel(name) {
  const el = document.querySelector(`.panel--${name}`);
  if (!el) return;
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}
