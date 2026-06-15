# arzuparreta@observatorio

Web personal de **Rubén Peña** — no es un CV, es un panel de control vivo.
Entras por el dato (transparencia pública, qué suena, código, sistemas) y, al
mirarlo y teclear en la terminal, conoces a quien lo construye.

**Estética:** terminal mono-minimal · fósforo verde sobre negro.
**Stack:** HTML/CSS/JS vanilla, sin build, sin dependencias. Una sola pantalla.

## Cómo se ve en vivo

Cada panel intenta el dato **real** y, si falla, cae a uno **simulado** creíble —
nunca se ve roto, y se vuelve real en cuanto el feed existe (`● live` / `○ sim`):

| Panel | Fuente | Real ya |
|---|---|---|
| github | `api.github.com` (público) | ✅ |
| transparencia | Supabase REST de [spaintransparencia.info](https://spaintransparencia.info) | ✅ |
| now playing | Soundsible (vía publisher local sanitizado) | tras `server/` |
| system | stats del homelab (vía publisher) | tras `server/` |
| escena del día | [archivoescenas.xyz](https://archivoescenas.xyz) | curado |

## Terminal

Es una terminal de verdad. Prueba: `help`, `whoami`, `ls proyectos`,
`open escenas`, `play`, `search escenas "..."`, `theme`. Hay alguna sorpresa.

## Desarrollo

```bash
python3 -m http.server 8000   # y abre http://localhost:8000
```

Sin build. Para activar now-playing/system reales, ver [`server/README.md`](server/README.md).

## Estructura

```
index.html · styles.css
js/  main.js · terminal.js · panels.js · feeds.js · background.js · data/curated.js
server/  publish.sh · *.service/.timer  (opcional, no se sirve)
```

## Despliegue

GitHub Pages desde la raíz de `main` (es un user-site). Sin Actions ni build.
