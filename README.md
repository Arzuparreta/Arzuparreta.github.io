# Rubén Peña — arzuparreta.github.io

Web personal pensada como un **GitHub para gente normal**: un atajo a mis proyectos, mi trabajo y lo que estoy escuchando ahora. Más útil que una página de GitHub para familiares, amigos o cualquiera que quiera ver qué estoy haciendo sin entender repos ni commits.

## Stack

HTML, CSS y JavaScript vanilla. Sin build. Sin dependencias. Despliegue automático con GitHub Pages al hacer push a `main`.

## Cómo funciona

- **Proyectos** salen de `js/data/repos.json`, un snapshot de la API de GitHub que un workflow regenera **cada 2 días**. La tarjeta usa el campo **Description** del repo tal cual: para cambiar un texto de la web, se edita la descripción en GitHub.
- Cada proyecto muestra primero su **web en producción** usando el campo `homepage` de GitHub o GitHub Pages; el repositorio es el enlace secundario.
- **Ahora** combina la música que suena en mi casa (vía `server/publish.sh` → Supabase) con mi actividad reciente de GitHub en una sola frase legible.
- El sitio funciona en **español e inglés** (toggle en la esquina superior).

## Estructura

```
index.html · styles.css
js/
  main.js      — orquestación e i18n
  feeds.js     — GitHub API + nowplaying vía Supabase
  now.js       — frase de estado "Ahora"
  projects.js  — grid de proyectos
  i18n.js      — ES/EN
  data/
    curated.js      — identidad, config, enlaces
    repos.json      — snapshot de GitHub (generado, no editar a mano)
    enrichments.js  — descripción de reserva si un repo no tiene ninguna en GitHub
scripts/ sync-repos.mjs  — regenera repos.json
.github/workflows/sync-repos.yml  — lo ejecuta cada 2 días
server/  publish.sh · *.service/.timer  (alimenta nowplaying/system; no se sirve)
```

## Desarrollo

```bash
python3 -m http.server 8000
```

## Despliegue

GitHub Pages desde la raíz de `main`. Sin build.

La única Action es `sync-repos`: cada 2 días regenera `js/data/repos.json` y hace commit si algo cambió. Corre en los runners de GitHub, nunca en local. Para forzarla: pestaña **Actions → sync repos → Run workflow**, o `node scripts/sync-repos.mjs` y commit a mano.

## Notas para ti

- La descripción de cada tarjeta es la **Description** del repo en GitHub. Cámbiala ahí y la web se pone al día en la siguiente sincronización (máximo 2 días).
- Si un proyecto no muestra el botón **Visitar**, ve a su configuración en GitHub y añade una URL en el campo **Website** (o activa GitHub Pages). El sitio la detecta automáticamente.
- GitHub desactiva los workflows programados si el repo pasa 60 días sin actividad. Si ves que las descripciones se congelan, entra en Actions y reactívalo.
