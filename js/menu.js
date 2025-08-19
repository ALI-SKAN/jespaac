// === Referencias ===
const openBtn  = document.getElementById("open-menu");
const closeBtn = document.getElementById("close-menu");
const aside    = document.querySelector("aside");
const buscador = document.getElementById("buscador");

// === Abrir / cerrar (exacto como antes) ===
function abrir()  { aside.classList.add("aside-visible"); }
function cerrar() { aside.classList.remove("aside-visible"); }

openBtn?.addEventListener("click", (e) => {
  e.stopPropagation();      // evita que el click-bubbling lo cierre
  abrir();
});

closeBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  cerrar();
});

// Cerrar al pulsar un botón de categoría (igual que antes)
document.querySelectorAll(".boton-categoria").forEach(boton => {
  boton.addEventListener("click", cerrar);
});

// === 1) Cerrar al presionar Enter en el buscador ===
buscador?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();     // evita recarga si no hay <form>
    cerrar();
    buscador.blur();
    // Si tu búsqueda va por submit:
    const form = buscador.form;
    if (form && typeof form.requestSubmit === "function") form.requestSubmit();
  }
});

// === 2) Cerrar al hacer clic FUERA del menú ===
// (sin overlay, no interfiere con tu menú)
window.addEventListener("click", (e) => {
  if (!aside.classList.contains("aside-visible")) return;

  const clicDentroAside = e.target.closest("aside");
  const clicEnAbrir     = e.target.closest("#open-menu");

  if (!clicDentroAside && !clicEnAbrir) {
    cerrar();
  }
});

