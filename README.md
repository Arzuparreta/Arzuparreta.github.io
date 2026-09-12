# Rubén Peña — arzuparreta.github.io

Hub personal: mi foto, mi nombre y enlaces grandes a todos mis proyectos. Nada más. Pensado para que cualquiera —familia, amigos, alguien que llega desde LinkedIn— encuentre en dos segundos la web del proyecto que busca, sin entender repos ni commits.

## Stack

HTML, CSS y JavaScript vanilla. Sin build. Sin dependencias. Sin peticiones de red en runtime salvo la fuente y la foto de perfil. Despliegue automático con GitHub Pages al hacer push a `main`.

## Cómo funciona

- **Los proyectos son HTML estático.** La lista vive tal cual en `index.html`; se edita a mano. La página pinta completa sin JavaScript.
- **La foto y el favicon** se sirven desde `https://github.com/Arzuparreta.png` — cambian solos al cambiar el avatar en GitHub (unos minutos, el destino lleva `max-age=300`).
- **ES / EN**: el español está en el HTML, el inglés en los atributos `data-en` (texto) y `data-en-aria` (aria-label). `js/ui.js` intercambia unos por otros y recuerda la elección en `localStorage`.
- **Claro y oscuro** siguen al sistema del visitante, y el botón de la esquina permite forzar uno u otro (se guarda en `localStorage` y se aplica en un script inline del `<head>` para que no haya destello al cargar). Los colores son cinco variables al principio de `styles.css`.

## Estructura

```
index.html        · toda la página: identidad, proyectos, pie
styles.css        · tokens de color arriba, luego cada sección
js/ui.js          · el único JS: botones de tema e idioma
server/           · publish.sh · *.service/.timer  (no se sirve; alimenta otro pipeline)
```

## Añadir o cambiar un proyecto

Copia un bloque `<a class="project">` en `index.html` y ajusta tres cosas:

```html
<a class="project" href="URL">
  <span class="project-name">Nombre</span>
  <span class="project-desc" data-en="One line in English">Una línea en español</span>
  <span class="project-arrow" aria-hidden="true">→</span>
</a>
```

`href` apunta a la web del proyecto si existe y, si no, a su repo. El orden de la lista es el orden del HTML: lo que tiene web va primero.

La descripción dice en una línea qué hace el proyecto, en concreto y sin metáforas. Las dos versiones tienen que decir lo mismo: el inglés no es una traducción literal del español, sino la misma frase escrita como la escribiría un nativo.

## Desarrollo

```bash
python3 -m http.server 8000
```

## Despliegue

GitHub Pages desde la raíz de `main`. Sin build, sin Actions.
