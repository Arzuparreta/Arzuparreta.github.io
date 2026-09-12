# Rubén Peña — arzuparreta.github.io

Hub personal: mi foto, mi nombre y enlaces grandes a todos mis proyectos. Nada más. Pensado para que cualquiera —familia, amigos, alguien que llega desde LinkedIn— encuentre en dos segundos la web del proyecto que busca, sin entender repos ni commits.

## Stack

HTML, CSS y JavaScript vanilla. Sin build. Sin dependencias. Sin peticiones de red en runtime salvo la fuente y la foto de perfil. Despliegue automático con GitHub Pages al hacer push a `main`.

## Cómo funciona

- **Los proyectos son HTML estático.** La lista vive tal cual en `index.html`; se edita a mano. La página pinta completa sin JavaScript.
- **La foto** se sirve desde `https://github.com/Arzuparreta.png` — cambia sola al cambiarla en GitHub.
- **ES / EN**: el español está en el HTML, el inglés en los atributos `data-en` (texto) y `data-en-aria` (aria-label). `js/lang.js` intercambia unos por otros y recuerda la elección en `localStorage`.
- **Claro y oscuro** siguen al sistema del visitante (`prefers-color-scheme`). Los colores son seis variables al principio de `styles.css`.

## Estructura

```
index.html        · toda la página: identidad, proyectos, pie
styles.css        · tokens de color arriba, luego cada sección
js/lang.js        · el único JS: toggle ES/EN
assets/favicon.svg
server/           · publish.sh · *.service/.timer  (no se sirve; alimenta otro pipeline)
```

## Añadir o cambiar un proyecto

Copia un bloque `<a class="project">` en `index.html` y ajusta cuatro cosas:

```html
<a class="project" href="URL">
  <span class="project-name">Nombre</span>
  <span class="project-desc" data-en="One line in English">Una línea en español</span>
  <span class="project-tag" data-en="code">código</span>
</a>
```

`href` apunta a la web del proyecto si existe (`web`) y, si no, a su repo (`código`). El orden de la lista es el orden del HTML: lo que tiene web va primero.

## Desarrollo

```bash
python3 -m http.server 8000
```

## Despliegue

GitHub Pages desde la raíz de `main`. Sin build, sin Actions.
