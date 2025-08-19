let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

const contenedorCarritoVacio     = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones  = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado  = document.querySelector("#carrito-comprado");
const botonVaciar                = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal            = document.querySelector("#Total");
const botonComprar               = document.querySelector("#carrito-acciones-comprar");

let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

function guardarLS() {
  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function cargarProductosCarrito () {
  if (productosEnCarrito && productosEnCarrito.length > 0) {
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    contenedorCarritoProductos.innerHTML = "";

    productosEnCarrito.forEach(producto => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
        <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="carrito-producto-titulo">
          <small>Título</small>
          <h3>${producto.titulo}</h3>
        </div>

        <div class="carrito-producto-cantidad">
          <small>Cantidad</small>
          <div class="carrito-cantidad">
            <button class="qty-btn qty-minus" data-id="${producto.id}" aria-label="Restar">−</button>
            <span class="qty-num">${producto.cantidad}</span>
            <button class="qty-btn qty-plus" data-id="${producto.id}" aria-label="Sumar">+</button>
          </div>
        </div>

        <div class="carrito-producto-precio">
          <small>Precio</small>
          <p>S/${producto.precio}</p>
        </div>

        <div class="carrito-producto-subtotal">
          <small>Subtotal</small>
          <p>S/${(producto.precio * producto.cantidad).toFixed(2)}</p>
        </div>

        <button class="carrito-producto-eliminar" data-id="${producto.id}">
          <i class="bi bi-trash-fill"></i>
        </button>
      `;
      contenedorCarritoProductos.append(div);
    });

  } else {
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
  }

  actualizarBotonesEliminar();
  actualizarTotal();
}

cargarProductosCarrito();

/* === Eliminar producto con ícono de basurero === */
function actualizarBotonesEliminar () {
  botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
  botonesEliminar.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id || e.currentTarget.id;
      const index = productosEnCarrito.findIndex(p => String(p.id) === String(id));
      if (index !== -1) {
        productosEnCarrito.splice(index, 1);
        guardarLS();
        cargarProductosCarrito();
      }
    });
  });
}

/* === Vaciar carrito === */
botonVaciar?.addEventListener("click", vaciarCarrito);
function vaciarCarrito(){
  productosEnCarrito.length = 0;
  guardarLS();
  cargarProductosCarrito();
}

/* === Total === */
function actualizarTotal(){
  const totalCalculado = productosEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  if (contenedorTotal) contenedorTotal.innerText = `S/${totalCalculado.toFixed(2)}`;
}

/* === Comprar (WhatsApp) === */
botonComprar?.addEventListener("click", comprarCarrito);
function comprarCarrito() {
  if (productosEnCarrito.length === 0) return;

  let mensaje = "Hola, quiero realizar el siguiente pedido:\n";
  productosEnCarrito.forEach(p => {
    mensaje += `🛒 ${p.titulo} - Cantidad: ${p.cantidad} - Precio: S/${p.precio}\n`;
  });
  const total = productosEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  mensaje += `\n💵 Total: S/${total.toFixed(2)}`;

  const numeroWhatsApp = "51952015666"; // tu número
  window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, "_blank");

  productosEnCarrito.length = 0;
  guardarLS();

  contenedorCarritoVacio.classList.add("disabled");
  contenedorCarritoProductos.classList.add("disabled");
  contenedorCarritoAcciones.classList.add("disabled");
  contenedorCarritoComprado.classList.remove("disabled");
}

/* === (+) y (−) en Cantidad === */
/* Delegación de eventos en el contenedor del carrito */
contenedorCarritoProductos?.addEventListener("click", (e) => {
  const btnMas   = e.target.closest(".qty-plus");
  const btnMenos = e.target.closest(".qty-minus");
  if (!btnMas && !btnMenos) return;

  const id = (btnMas || btnMenos).dataset.id;
  const idx = productosEnCarrito.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return;

  if (btnMas) {
    productosEnCarrito[idx].cantidad += 1;
    guardarLS();
    cargarProductosCarrito();
    return;
  }

  // btnMenos
  if (productosEnCarrito[idx].cantidad === 1) {
    // ➜ Si está en 1 y presiona "–": vacía TODO el carrito (tal como pediste)
    vaciarCarrito();
  } else {
    productosEnCarrito[idx].cantidad -= 1;
    guardarLS();
    cargarProductosCarrito();
  }
});

