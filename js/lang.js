// Toggle ES/EN. El español vive en el HTML; el inglés en data-en / data-en-aria.
(function () {
  "use strict";

  var KEY = "lang";
  var btn = document.getElementById("lang-toggle");
  var texts = document.querySelectorAll("[data-en]");
  var labels = document.querySelectorAll("[data-en-aria]");

  // Guarda el español original antes de tocar nada.
  texts.forEach(function (el) { el.dataset.es = el.textContent; });
  labels.forEach(function (el) { el.dataset.esAria = el.getAttribute("aria-label"); });

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* modo privado */ }
  }

  function apply(lang) {
    var en = lang === "en";
    texts.forEach(function (el) {
      el.textContent = en ? el.dataset.en : el.dataset.es;
    });
    labels.forEach(function (el) {
      el.setAttribute("aria-label", en ? el.dataset.enAria : el.dataset.esAria);
    });
    document.documentElement.lang = lang;
    btn.textContent = en ? "ES" : "EN";
    btn.setAttribute("aria-label", en ? "Cambiar a español" : "Switch to English");
  }

  apply(read() === "en" ? "en" : "es");
  btn.hidden = false;

  btn.addEventListener("click", function () {
    var next = document.documentElement.lang === "en" ? "es" : "en";
    apply(next);
    save(next);
  });
})();
