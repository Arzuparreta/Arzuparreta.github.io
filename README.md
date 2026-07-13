# Rubén Peña — arzuparreta.github.io

Web personal pensada como un **GitHub para gente normal**: un atajo a mis proyectos, mi trabajo y lo que estoy escuchando ahora. Más útil que una página de GitHub para familiares, amigos o cualquiera que quiera ver qué estoy haciendo sin entender repos ni commits.

## Stack

HTML, CSS y JavaScript vanilla. Sin build. Sin dependencias. Despliegue automático con GitHub Pages al hacer push a `main`.

## Cómo funciona

- **Proyectos** se cargan en tiempo real desde la API pública de GitHub (`/users/Arzuparreta/repos`).
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
    enrichments.js  — descripciones humanas opcionales por repo
server/  publish.sh · *.service/.timer  (alimenta nowplaying/system; no se sirve)
```

## Desarrollo

```bash
python3 -m http.server 8000
```

## Despliegue

GitHub Pages desde la raíz de `main`. Sin Actions ni build.

## Nota para ti

Si un proyecto no muestra el botón **Visitar**, ve a su configuración en GitHub y añade una URL en el campo **Website** (o activa GitHub Pages). El sitio la detecta automáticamente.
