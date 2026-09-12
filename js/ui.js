// Los dos controles de la esquina: tema e idioma.
// El español vive en el HTML; el inglés en data-en / data-en-aria.
(function () {
  "use strict";

  var root = document.documentElement;
  var controls = document.getElementById("controls");
  var langBtn = document.getElementById("lang-toggle");
  var themeBtn = document.getElementById("theme-toggle");
  var texts = document.querySelectorAll("[data-en]");
  var labels = document.querySelectorAll("[data-en-aria]");

  // Guarda el español original antes de tocar nada.
  texts.forEach(function (el) { el.dataset.es = el.textContent; });
  labels.forEach(function (el) { el.dataset.esAria = el.getAttribute("aria-label"); });

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* modo privado */ }
  }

  // ── Idioma ────────────────────────────────────────────────────────────

  var LANG = {
    es: { theme_to_dark: "Cambiar a tema oscuro", theme_to_light: "Cambiar a tema claro", lang: "Switch to English" },
    en: { theme_to_dark: "Switch to dark theme", theme_to_light: "Switch to light theme", lang: "Cambiar a español" }
  };

  function lang() { return root.lang === "en" ? "en" : "es"; }

  function applyLang(next) {
    var en = next === "en";
    texts.forEach(function (el) {
      el.textContent = en ? el.dataset.en : el.dataset.es;
    });
    labels.forEach(function (el) {
      el.setAttribute("aria-label", en ? el.dataset.enAria : el.dataset.esAria);
    });
    root.lang = next;
    langBtn.textContent = en ? "ES" : "EN";
    langBtn.setAttribute("aria-label", LANG[next].lang);
    labelTheme();
  }

  // ── Tema ──────────────────────────────────────────────────────────────

  function isDark() {
    var set = root.dataset.theme;
    if (set) return set === "dark";
    return matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // El botón siempre anuncia a dónde lleva, no dónde estás.
  function labelTheme() {
    themeBtn.setAttribute("aria-label",
      LANG[lang()][isDark() ? "theme_to_light" : "theme_to_dark"]);
  }

  // ── Arranque ──────────────────────────────────────────────────────────

  applyLang(read("lang") === "en" ? "en" : "es");
  controls.hidden = false;

  langBtn.addEventListener("click", function () {
    var next = lang() === "en" ? "es" : "en";
    applyLang(next);
    save("lang", next);
  });

  themeBtn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    save("theme", next);
    labelTheme();
  });

  // Sin elección manual, el sitio sigue al sistema aunque cambie en caliente.
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", labelTheme);

  // ── Favicon circular ──────────────────────────────────────────────────

  // El <link> del HTML ya pinta el avatar cuadrado sin depender de esto;
  // aquí sólo se recorta en círculo y se sustituye.
  //
  // Hace falta la URL directa de avatars.githubusercontent.com: el 302 de
  // github.com no lleva cabeceras CORS, así que por esa vía la imagen
  // contamina el canvas y toDataURL falla. El número es el id de la cuenta,
  // que es estable aunque cambie el nombre de usuario.
  (function roundFavicon() {
    var link = document.querySelector('link[rel="icon"]');
    if (!link || !document.createElement("canvas").getContext) return;

    var img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      try {
        var size = 128;
        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;

        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);

        link.href = canvas.toDataURL("image/png");
      } catch (e) { /* se queda el cuadrado */ }
    };

    img.src = "https://avatars.githubusercontent.com/u/125204298?s=128";
  })();
})();
