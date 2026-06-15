// =============================================================================
// background.js — retícula tipo Tonnetz que respira lento. Guiño al lado
// músico/sinestésico, sin distraer del dato. Barato y considerado:
//  · pausa cuando la pestaña está oculta
//  · respeta prefers-reduced-motion (dibuja una sola vez, estático)
//  · DPR limitado, nodos limitados
// =============================================================================

export function initBackground() {
  const canvas = document.getElementById("bg");
  if (!canvas) return { pulse() {}, setColor() {} };
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1;
  let nodes = [];
  let accent = getAccent();
  let pulseT = 0;

  function getAccent() {
    const c = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    return c || "#00ff9c";
  }

  function build() {
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    W = canvas.clientWidth = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // retícula triangular (Tonnetz): filas desfasadas media celda
    const gap = Math.max(86, Math.min(W, H) / 8);
    const rh = gap * 0.866; // altura de triángulo equilátero
    nodes = [];
    let row = 0;
    for (let y = -rh; y < H + rh; y += rh, row++) {
      const off = row % 2 ? gap / 2 : 0;
      for (let x = -gap; x < W + gap; x += gap) {
        nodes.push({
          x: x + off, y,
          bx: x + off, by: y,
          ph: Math.random() * Math.PI * 2,
          sp: 0.15 + Math.random() * 0.25,
          amp: 4 + Math.random() * 7,
        });
      }
    }
    maxD = gap * 1.06;
  }

  let maxD = 120;

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const pulse = pulseT > 0 ? pulseT : 0;
    const baseAlpha = 0.05 + pulse * 0.10;

    // mueve nodos
    if (!reduce) {
      for (const n of nodes) {
        n.x = n.bx + Math.cos(t * 0.0004 * n.sp + n.ph) * n.amp;
        n.y = n.by + Math.sin(t * 0.0004 * n.sp + n.ph * 1.3) * n.amp;
      }
    }

    // aristas
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD * maxD) {
          const d = Math.sqrt(d2);
          const al = baseAlpha * (1 - d / maxD);
          ctx.strokeStyle = withAlpha(accent, al);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // nodos
    ctx.fillStyle = withAlpha(accent, 0.22 + pulse * 0.4);
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (pulseT > 0) pulseT = Math.max(0, pulseT - 0.012);
  }

  let raf = null;
  function loop(t) {
    draw(t);
    raf = requestAnimationFrame(loop);
  }
  function start() { if (!raf && !reduce) raf = requestAnimationFrame(loop); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  build();
  if (reduce) draw(0);
  else start();

  window.addEventListener("resize", () => { build(); if (reduce) draw(0); }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  return {
    pulse() { pulseT = 1; },                 // latido al cambiar de pista
    setColor() { accent = getAccent(); if (reduce) draw(0); }, // tras `theme`
  };
}

function withAlpha(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}
