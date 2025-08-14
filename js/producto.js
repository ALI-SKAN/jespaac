// js/producto.js
(async function () {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const root = document.getElementById("detalle");

  if (!id) {
    root.innerHTML = "<p>No se proporcionó un ID de producto.</p>";
    return;
  }

  try {
    const res = await fetch("./js/productos.json");
    const productos = await res.json();
    const p = productos.find((x) => x.id === id);

    if (!p) {
      root.innerHTML = "<p>Producto no encontrado.</p>";
      return;
    }

    // Opcionales
    const descripcion = p.descripcion || "";
    const especificaciones = p.especificaciones || null;
    const conectividad = Array.isArray(p.conectividad) ? p.conectividad : null;

    // Título del documento
    document.title = `${p.titulo} | JESPAAC`;

    // Render del detalle
    root.innerHTML = `
      <div>
        <img class="detalle-img" src="${p.imagen}" alt="${p.titulo}">
      </div>

      <div>
        <h1>${p.titulo}</h1>
        <div class="precio">S/${p.precio}</div>

        ${descripcion ? `<p>${descripcion}</p>` : ""}

        ${
          conectividad
            ? `<p><strong>Conectividad:</strong> ${conectividad.join(" / ")}</p>`
            : ""
        }

        ${
          especificaciones
            ? `<h2>Especificaciones</h2>
               <ul class="specs">
                 ${Object.entries(especificaciones)
                   .map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`)
                   .join("")}
               </ul>`
            : ""
        }

        <div class="acciones">
          <button id="btnAgregar" class="btn">Agregar al carrito</button>
        </div>
      </div>
    `;

    // --------- Lógica de carrito reutilizable ---------
    function agregarAlCarrito() {
      const ls = localStorage.getItem("productos-en-carrito");
      let carrito = ls ? JSON.parse(ls) : [];
      const idx = carrito.findIndex((x) => x.id === p.id);

      if (idx >= 0) carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
      else carrito.push({ ...p, cantidad: 1 });

      localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));

      showToast(`🛒 Agregado: ${p.titulo}`, {
        actionText: "Ver carrito",
        action: () => (location.href = "carrito.html"),
        timeout: 5000 // <- cámbialo si quieres que dure más/menos
      });
    }

    // Botón dentro de la tarjeta
    document.getElementById("btnAgregar").addEventListener("click", agregarAlCarrito);

    // --------- Barra móvil inferior ---------
    const cta = document.getElementById("cta-mobile");
    const ctaPrecio = document.getElementById("cta-precio");
    const ctaAgregar = document.getElementById("cta-agregar");

    if (cta && window.matchMedia("(max-width: 900px)").matches) {
      ctaPrecio.textContent = p.precio;
      cta.classList.remove("hidden");
      document.body.classList.add("has-cta");
      if (ctaAgregar) ctaAgregar.addEventListener("click", agregarAlCarrito);
    }
  } catch (err) {
    console.error(err);
    root.innerHTML = "<p>Error cargando el producto.</p>";
  }
})();

/* ========= Toast helpers (requiere el HTML del toast) ========= */
const toastEl = document.getElementById("toast");
const toastText = document.getElementById("toast-text");
const toastAction = document.getElementById("toast-action");
const toastClose = document.getElementById("toast-close");
let toastTimer;

function showToast(
  message,
  { actionText = "Ver carrito", action = null, timeout = 3000 } = {}
) {
  if (!toastEl) return;

  toastText.textContent = message;
  toastEl.classList.remove("hidden");

  if (toastAction) {
    toastAction.textContent = actionText;
    toastAction.onclick = typeof action === "function" ? action : null;
    toastAction.style.display = action ? "inline-flex" : "none";
  }
  if (toastClose) toastClose.onclick = hideToast;

  requestAnimationFrame(() => toastEl.classList.add("show"));

  clearTimeout(toastTimer);
  if (timeout && timeout > 0) {
    toastTimer = setTimeout(hideToast, timeout);
  }
}

function hideToast() {
  if (!toastEl) return;
  toastEl.classList.remove("show");
  setTimeout(() => toastEl.classList.add("hidden"), 250);
}


