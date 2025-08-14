let productos = [];
let productosEnCarrito;
let categoriaActiva = "todos";

// === Fetch inicial ===
fetch("./js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    cargarProductos(productos);
    aplicarFiltros(); // por si el input ya tiene algo (autofill)
  });

// === Referencias DOM ===
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// Abrir detalle en la MISMA pestaña
contenedorProductos.addEventListener("click", (e) => {
  const clickable = e.target.closest(".producto-imagen, .producto-titulo");
  if (!clickable) return;

  const id = clickable.dataset.id;
  if (!id) return;

  // Navega en la misma pestaña
  window.location.href = `producto.html?id=${encodeURIComponent(id)}`;
  // (equivalente: location.assign(`producto.html?id=${encodeURIComponent(id)}`))
});

// Buscador (agrega el HTML del buscador debajo de JESPAAC en el aside)
const inputBuscador = document.getElementById("buscador");
const btnLimpiar = document.getElementById("btn-limpiar");



// Cerrar aside en móvil al elegir categoría (usa la var aside que manejas en menu.js)
botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", () => {
    if (typeof aside !== "undefined" && aside) {
      aside.classList.remove("aside-visible");
    }
  })
);

// === Helpers ===
function normalizar(str = "") {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";

  productosElegidos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img class="producto-imagen" data-id="${producto.id}" src="${producto.imagen}" alt="${producto.titulo}" style="cursor:pointer;">
      <div class="producto-detalles">
          <h3 class="producto-titulo" data-id="${producto.id}" style="cursor:pointer;">${producto.titulo}</h3>
          <p class="producto-precio">S/${producto.precio}</p>
          <button class="producto-agregar boton-agregar" id="${producto.id}">Agregar</button>
      </div>
    `;
    contenedorProductos.append(div);
  });

  actualizarBotonesAgregar();
}

function mostrarSinResultados(q) {
  contenedorProductos.innerHTML = `
    <div class="sin-resultados">
      <div class="emoji">🔎</div>
      <h3>No se encontraron resultados</h3>
      <p>Tu búsqueda <strong>“${q}”</strong> no coincide con ningún producto.</p>
    </div>
  `;
}

function productosFiltradosPorCategoria(catId) {
  if (!catId || catId === "todos") return productos.slice();
  return productos.filter((p) => p.categoria && p.categoria.id === catId);
}

function productosFiltradosPorTexto(lista, q) {
  const nq = normalizar(q);
  if (!nq) return lista;

  return lista.filter((p) => {
    const titulo = normalizar(p.titulo || p.nombre || "");
    const categoria = normalizar(
      (p.categoria && (p.categoria.nombre || p.categoria)) || ""
    );
    const descripcion = normalizar(p.descripcion || "");
    return (
      titulo.includes(nq) || categoria.includes(nq) || descripcion.includes(nq)
    );
  });
}

// Aplica categoría + texto de búsqueda
function aplicarFiltros() {
  const query = inputBuscador ? inputBuscador.value : "";
  let lista = productosFiltradosPorCategoria(categoriaActiva);
  lista = productosFiltradosPorTexto(lista, query);

  if (query && query.trim().length > 0) {
    tituloPrincipal.textContent = `Resultados para “${query}”`;
  } else if (categoriaActiva !== "todos") {
    const cat = productos.find((p) => p.categoria.id === categoriaActiva);
    tituloPrincipal.textContent = cat?.categoria?.nombre || "Productos";
  } else {
    tituloPrincipal.textContent = "Todos los produtos";
  }

  if (lista.length > 0) {
    cargarProductos(lista);
  } else {
    mostrarSinResultados(query || "—");
  }
}

// === Categorías ===
botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((b) => b.classList.remove("active"));
    e.currentTarget.classList.add("active");

    categoriaActiva = e.currentTarget.id || "todos";
    aplicarFiltros();
  });
});

// === Agregar al carrito ===
function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

function agregarAlCarrito(e) {
  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find((producto) => producto.id === idBoton);

  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    const index = productosEnCarrito.findIndex(
      (producto) => producto.id === idBoton
    );
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  actualizarNumerito();
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );

  // Mostrar alerta flotante
  mostrarToast(productoAgregado);
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;
}

// === Toast ===
const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");
const toastVerCarrito = document.getElementById("toast-ver-carrito");

toastVerCarrito.addEventListener("click", () => {
  window.location.href = "carrito.html";
});

function mostrarToast(producto) {
  toastText.textContent = `🛒 Añadido: ${producto.titulo}`;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 4000);
}

// === Buscador: eventos ===
if (inputBuscador) {
  inputBuscador.addEventListener("input", (e) => aplicarFiltros());
  inputBuscador.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
}

if (btnLimpiar) {
  btnLimpiar.addEventListener("click", () => {
    inputBuscador.value = "";
    aplicarFiltros();
    inputBuscador.focus();
  });
}

