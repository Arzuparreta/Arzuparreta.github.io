# Guía para agentes

Esta landing es HTML/CSS/JavaScript estático, sin build ni `portfolio.json`.
La fuente es `index.html`, `styles.css` y `js/ui.js`.

Antes de cambiar proyectos o actualizar sus fotos, lee
[docs/projects.md](docs/projects.md) y [assets/projects/README.md](assets/projects/README.md).

- Los principales son Soundsible y Fly Browser, en ese orden. Siempre llevan icono y captura.
- Los demás empiezan ocultos dentro de «Más». No mostrar títulos como «principales» o «secundarios».
- «Actualiza las fotos de los proyectos principales» significa localizar las capturas oficiales
  más recientes en la rama principal actualizada de cada proyecto y refrescar las copias locales;
  no generar imágenes ni capturar la landing del proyecto como si fuera la aplicación.
- Conserva los cambios ajenos. No uses PR abiertos como fuente de verdad.
- Verifica imágenes, dimensiones y `git diff --check`. No hay un build que ejecutar.
- Hacer push a `main` publica en GitHub Pages: no publicar sin autorización.
