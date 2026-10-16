# Proyectos y capturas de la landing

## Organización

`index.html` es la fuente de verdad. No hay generación de contenido ni manifiesto externo.
El `<nav class="projects">` contiene dos grupos sin encabezados visibles:

1. Soundsible y Fly Browser, en ese orden, visibles desde el inicio.
2. España Transparente y Remove Multi Titles YT dentro de `<details class="more-projects">`,
   cerrado inicialmente. El `<summary>` muestra «Más proyectos» / «Ocultar proyectos» (More projects / Hide projects en inglés).
   Es un control de texto centrado con un chevrón y espacio superior, separado visualmente de Fly; sin píldora ni borde.

Cada proyecto tiene un contenedor `.project-item`, un enlace `.project` a su web
(o al repositorio si no tiene web) y un enlace hermano `.project-repo` con el texto
«Github», situado a la derecha del nombre en la cabecera. No anidar enlaces. Los principales añaden `.project-featured`, un
`.project-icon` decorativo y una `.project-screenshot` con texto alternativo.

Las capturas están en botones `.screenshot-trigger`, hermanos del enlace principal.
Abren el `<dialog>` nativo `#image-viewer`: imagen completa ajustada a pantalla,
zoom al tocarla y desplazamiento para leer detalles, enlaces a web y código en el pie.
Escape, el botón de cierre o el fondo cierran el visor y devuelven el foco al disparador.
`data-web` del disparador define la web; el enlace al código se toma de `.project-repo`.

Conservar la apertura nativa de `<details>`: teclado, estado accesible y funcionamiento
sin JavaScript. No guardar la expansión entre visitas. Las traducciones de los textos
se definen en `data-en`, como en el resto de la página.

## Petición: «actualiza las fotos de los proyectos principales»

Se refiere a las capturas de la aplicación de Soundsible y Fly Browser, no al avatar
personal. Hacer la actualización completa para ambos, conservando orden, enlaces y textos.

1. Consultar la tabla de recursos de `assets/projects/README.md`.
2. Localizar el repositorio de cada aplicación. En esta máquina suelen estar como
   repositorios hermanos, `../soundsible` y `../fly-browser`. Comprobar su remoto.
   Si no están, consultar o clonar el repositorio oficial indicado en la tabla.
3. Actualizar la referencia remota de la rama principal con `git fetch origin`.
   Verificar cuál es su rama por defecto; las rutas documentadas parten de `main`.
   Leer archivos desde la referencia remota, sin cambiar de rama ni tocar el trabajo
   local de esos repositorios. No utilizar archivos de PR abiertos o cambios sin integrar.
4. Buscar las capturas actuales en documentación, README y carpetas de imágenes de
   esa rama. Las rutas de la tabla son puntos de partida, no rutas inmutables.
   Comparar el historial de las capturas candidatas y su uso en la documentación actual;
   no elegir por la fecha de modificación del checkout ni por capturas de pruebas.
5. Preferir una captura oficial de escritorio que muestre la aplicación real:
   biblioteca de Soundsible y nueva pestaña de Fly son las vistas actuales.
   Si hay varias, priorizar la más reciente y representativa, con texto legible y
   sin información privada. Inspeccionar visualmente el archivo antes de incorporarlo.
   No sustituirla por un social card, una web promocional o una imagen generada.
6. Copiar el recurso a `assets/projects/soundsible.webp` o `fly.webp`. Para extraer
   exactamente el archivo integrado se puede usar, desde el repositorio de origen:
   `git show origin/main:ruta/del/recurso.webp > /ruta/a/esta/landing/assets/projects/destino.webp`.
   Mantener el formato real del archivo; si cambia, actualizar extensión y `src`.
   Revisar también el icono oficial y renovarlo si ha cambiado.
7. Medir las dimensiones reales y actualizar `width` y `height` del `<img>` en
   `index.html`. Conservar la proporción completa, sin recortar la interfaz.
   Ajustar el texto alternativo si cambia la vista representada.
8. Actualizar la tabla de procedencia: ruta original, commit completo de origen,
   fecha de revisión y dimensiones. Así se podrá saber si una futura copia es nueva.
9. Ejecutar `git diff --check` y verificar que las imágenes cargan por HTTP en la
   landing local. Comprobar el orden, «Más» / «Menos», tema claro/oscuro y ancho móvil
   cuando se modifique el diseño. No hace falta un build.

Si la rama principal contiene los mismos recursos, informar de que ya están al día.
Si no hay capturas oficiales utilizables, indicarlo: no inventar una captura ni arrancar
las aplicaciones para crear otras sin que se haya solicitado. Esta instrucción autoriza
renovar archivos locales, no publicar. No hacer push a `main` sin autorización.
