// =============================================================================
// terminal.js — REPL de verdad. Cada comando revela una capa de Rubén.
// Wow para todos (el panel vive solo); profundidad para el curioso (esto).
// =============================================================================

import {
  IDENTITY, LINKS, PROJECTS, SEARCH_TARGETS, THEMES, pickByDay, SCENES,
} from "./data/curated.js";

const esc = (s) => String(s).replace(/[&<>"]/g,
  (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function initTerminal(ctx) {
  const input = document.getElementById("cmdline");
  const mirror = document.getElementById("prompt-mirror");
  const promptLine = document.getElementById("prompt-line");
  const scroll = document.getElementById("scrollback");

  const history = [];
  let hi = 0;

  // --- salida ---------------------------------------------------------------
  function print(html, cls = "out") {
    const div = document.createElement("div");
    div.className = "line " + cls;
    div.innerHTML = html;
    scroll.appendChild(div);
    scroll.scrollTop = scroll.scrollHeight;
  }
  const lines = (arr, cls) => arr.forEach((l) => print(l, cls));
  function echo(str) {
    print(`<span class="accent">arzuparreta</span><span class="dim">:~$</span> ${esc(str)}`, "cmd-echo");
  }

  // --- tokenizer (respeta "comillas") --------------------------------------
  function tokenize(s) {
    const out = [];
    const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let m;
    while ((m = re.exec(s))) out.push(m[1] ?? m[2] ?? m[3]);
    return out;
  }

  // --- comandos -------------------------------------------------------------
  const commands = {
    help: { desc: "esta lista de comandos", run: () => {
      print("comandos disponibles:", "out-dim");
      const order = ["whoami", "about", "ls", "open", "now", "play",
        "search", "links", "escena", "theme", "github", "date", "clear"];
      for (const k of order) {
        if (commands[k]) print(`  <span class="out-accent">${k.padEnd(9)}</span> ${esc(commands[k].desc)}`, "out");
      }
      print("  <span class=\"out-dim\">…y alguna sorpresa para los curiosos.</span>", "out");
    }},

    whoami: { desc: "quién soy (·· --full para más)", run: (a) => {
      if (a[0] === "--full" || a[0] === "-f") return commands.about.run();
      print(`${esc(IDENTITY.name)} — <span class="out-accent">${esc(IDENTITY.role)}</span>`, "out");
      print(esc(IDENTITY.tagline), "out-dim");
    }},

    about: { desc: "la versión larga (sin tono de CV)", run: () => {
      print(`${esc(IDENTITY.name)} · @${esc(IDENTITY.handle)}`, "out-accent");
      lines(IDENTITY.bio.map(esc), "out");
      print(`prueba <span class="out-accent">ls proyectos</span> o <span class="out-accent">links</span>.`, "out-dim");
    }},

    ls: { desc: "lista proyectos | links", run: (a) => {
      const what = (a[0] || "proyectos").toLowerCase();
      if (what.startsWith("link")) return commands.links.run();
      for (const p of PROJECTS) {
        print(`  <span class="out-accent">${esc(p.name.padEnd(22))}</span>` +
              `<span class="out-dim">${esc(p.lang.padEnd(12))}</span>${esc(p.desc)}`, "out");
      }
      print(`<span class="out-dim">→ <span class="out-accent">open ${esc(PROJECTS[0].name)}</span> para abrir uno.</span>`, "out");
    }},

    open: { desc: "abre un proyecto o perfil (open <nombre>)", run: (a) => {
      const q = (a.join(" ") || "").toLowerCase().trim();
      if (!q) return print("uso: <span class=\"out-accent\">open &lt;nombre&gt;</span> · ej: open escenas, open github", "out-warn");
      const extra = { github: LINKS.github, linkedin: LINKS.linkedin, youtube: LINKS.youtube };
      let url = extra[q];
      let label = q;
      if (!url) {
        const p = PROJECTS.find((p) => p.name === q) ||
                  PROJECTS.find((p) => p.name.includes(q)) ||
                  PROJECTS.find((p) => p.desc.toLowerCase().includes(q));
        if (p) { url = p.url; label = p.name; }
      }
      if (!url) return print(`no encuentro "${esc(q)}". prueba <span class="out-accent">ls</span>.`, "out-warn");
      print(`abriendo <span class="out-accent">${esc(label)}</span> → ${esc(url)}`, "out");
      window.open(url, "_blank", "noopener");
    }},

    now: { desc: "qué suena ahora en mi Soundsible", run: () => {
      const np = ctx.nowplaying, d = np.data;
      if (np.live && d.isPlaying && d.title) {
        print(`♪ <span class="out-accent">${esc(d.title)}</span> — ${esc(d.artist || "")}`, "out");
        if (d.album) print(`  <span class="out-dim">${esc(d.album)}</span>`, "out");
      } else if (np.live) {
        print("ahora mismo no suena nada en mi Soundsible.", "out-dim");
      } else {
        print("now-playing sin conexión (el publisher no responde).", "out-warn");
      }
    }},
    play: { desc: "(la música es mi Soundsible real)", run: () => {
      print("esto es mi Soundsible de verdad — no se controla desde la web 🙂", "out-dim");
      print('mira con <span class="out-accent">now</span> qué estoy escuchando.', "out-dim");
    }},
    pause: { desc: null, run: () => commands.play.run() },
    next: { desc: null, run: () => commands.play.run() },

    search: { desc: 'busca en mis índices: search escenas "frase"', run: (a) => {
      const target = (a[0] || "").toLowerCase();
      const query = a.slice(1).join(" ");
      const fn = SEARCH_TARGETS[target];
      if (!fn) return print('uso: <span class="out-accent">search transparencia "…"</span> o <span class="out-accent">search escenas "…"</span>', "out-warn");
      if (!query) return print(`¿qué busco en ${esc(target)}? ej: search ${esc(target)} "corrupción"`, "out-warn");
      const url = fn(query);
      print(`buscando <span class="out-accent">"${esc(query)}"</span> en ${esc(target)} → ${esc(url)}`, "out");
      window.open(url, "_blank", "noopener");
    }},

    links: { desc: "dónde encontrarme", run: () => {
      const row = (k, v) => print(`  <span class="out-accent">${k.padEnd(9)}</span><a href="${v}" target="_blank" rel="noopener">${esc(v)}</a>`, "out");
      row("github", LINKS.github);
      row("linkedin", LINKS.linkedin);
      row("youtube", LINKS.youtube);
    }},
    contact: { desc: "cómo contactarme", run: () => commands.links.run() },

    escena: { desc: "la escena de cine del día", run: () => {
      const s = pickByDay(SCENES);
      print(`“<span class="out-accent">${esc(s.quote)}</span>” — ${esc(s.film)}`, "out");
      print('<span class="out-dim">archivo completo → <span class="out-accent">open escenas</span></span>', "out");
    }},

    theme: { desc: "cambia el color de acento (theme | theme ámbar)", run: (a) => {
      let next;
      if (a[0]) next = THEMES.find((t) => t.name.toLowerCase().startsWith(a[0].toLowerCase()));
      if (!next) {
        const cur = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim().toLowerCase();
        const idx = THEMES.findIndex((t) => t.accent.toLowerCase() === cur);
        next = THEMES[(idx + 1) % THEMES.length];
      }
      ctx.applyTheme(next);
      print(`tema → <span class="out-accent">${esc(next.name)}</span> ${esc(next.accent)}`, "out-accent");
    }},

    github: { desc: "abre mi github", run: () => commands.open.run(["github"]) },
    gh: { desc: "alias de github", run: () => commands.open.run(["github"]) },

    date: { desc: "fecha y hora del sistema", run: () =>
      print(esc(new Date().toString()), "out") },

    clear: { desc: "limpia la consola", run: () => { scroll.innerHTML = ""; } },

    // --- easter eggs --------------------------------------------------------
    sudo: { desc: null, run: () =>
      print("este sistema no admite <b>sudo</b>. admite <span class=\"out-accent\">curiosidad</span>.", "out-warn") },
    htop: { desc: null, run: () => {
      print("  PID  CPU%  MEM   PROCESS", "out-dim");
      const rows = [
        ["1337", "0.4", "82M", "espana-transparente.etl"],
        ["1984", "0.1", "44M", "soundsible.daemon"],
        ["3001", "0.0", "12M", "stdb-kit.indexer"],
        ["0042", "0.7", "—",   "ruben.curiosity (no se puede matar)"],
      ];
      rows.forEach((r) => print(`  ${r[0]}  ${r[1].padStart(4)}  ${String(r[2]).padStart(4)}  <span class="out-accent">${esc(r[3])}</span>`, "out"));
    }},
    top: { desc: null, run: () => commands.htop.run() },
    vim: { desc: null, run: () =>
      print("estás dentro de vim ahora. (es broma. <span class=\"out-accent\">:q!</span> y sales)", "out-warn") },
    ":q": { desc: null, run: () => print("has salido de vim. enhorabuena, poca gente lo logra.", "out") },
    ":q!": { desc: null, run: () => print("has salido de vim. enhorabuena, poca gente lo logra.", "out") },
    exit: { desc: null, run: () => print("no se sale del observatorio. solo se mira más.", "out-dim") },
    matrix: { desc: null, run: () => { for (let i = 0; i < 4; i++) ctx.background.pulse(); print("wake up, Neo…", "out-accent"); } },
    echo: { desc: null, run: (a) => print(esc(a.join(" ")), "out") },
  };

  // --- ejecución ------------------------------------------------------------
  function run(raw) {
    const str = (raw || "").trim();
    if (!str) return;
    echo(str);
    history.push(str); hi = history.length;
    const tokens = tokenize(str);
    const name = tokens[0].toLowerCase();
    const cmd = commands[name];
    if (cmd) {
      try { cmd.run(tokens.slice(1), str); }
      catch { print("algo ha fallado ejecutando eso.", "out-warn"); }
    } else {
      print(`comando no encontrado: <b>${esc(tokens[0])}</b> — prueba <span class="out-accent">help</span>`, "out-warn");
    }
  }

  // --- input ----------------------------------------------------------------
  function sync() { mirror.textContent = input.value; }
  input.addEventListener("input", sync);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input.value);
      input.value = ""; sync();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) { hi = Math.max(0, hi - 1); input.value = history[hi] || ""; sync(); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      hi = Math.min(history.length, hi + 1);
      input.value = history[hi] || ""; sync();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cur = input.value.trim().toLowerCase();
      if (!cur) return;
      const pool = Object.keys(commands).filter((k) => commands[k].desc !== null);
      const matches = pool.filter((k) => k.startsWith(cur));
      if (matches.length === 1) { input.value = matches[0] + " "; sync(); }
      else if (matches.length > 1) print(matches.join("   "), "out-dim");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault(); scroll.innerHTML = "";
    }
  });

  // mantener foco (sin robar selección de texto ni clicks útiles)
  promptLine.addEventListener("mousedown", () => setTimeout(() => input.focus(), 0));
  document.addEventListener("keydown", (e) => {
    if (document.activeElement !== input && !e.metaKey && !e.ctrlKey && !e.altKey &&
        e.key.length === 1 && !window.getSelection().toString()) {
      input.focus();
    }
  });

  function greet() {
    print(`bienvenido al <span class="out-accent">observatorio</span> de ${esc(IDENTITY.name)}.`, "out");
  }

  return { run, print, focus: () => input.focus(), greet, sync };
}
