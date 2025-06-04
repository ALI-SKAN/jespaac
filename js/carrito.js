let productosEnCarrito = (localStorage.getItem("productos-en-carrito"));
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll (".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#Total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


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
                 <p>${producto.cantidad}</p>
             </div>
             <div class="carrito-producto-precio">
                 <small>Precio</small>
                 <p>S/${producto.precio}</p>
             </div>
             <div class="carrito-producto-subtotal">
                 <small>Subtotal</small>
                 <p>S/${producto.precio * producto.cantidad}</p>
             </div>
             <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
             `;
    
             contenedorCarritoProductos.append(div);
        })
        
    
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



function actualizarBotonesEliminar () {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito (e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito(){

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}

function actualizarTotal(){
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    Total.innerText = `S/${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    if (productosEnCarrito.length === 0) return;

    let mensaje = "Hola, quiero realizar el siguiente pedido:\n";

    productosEnCarrito.forEach(producto => {
        mensaje += `🛒 ${producto.titulo} - Cantidad: ${producto.cantidad} - Precio: S/${producto.precio}\n`;
    });

    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    mensaje += `\n💵 Total: S/${totalCalculado}`;

    const numeroWhatsApp = "51952015666"; // Reemplaza con tu número real
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp en otra pestaña
    window.open(url, "_blank");

    // Limpiar carrito después de enviar
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}
