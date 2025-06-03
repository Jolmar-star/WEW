// Navegación entre apartados
function mostrarApartado(id) {
    document.querySelectorAll('.apartado').forEach(el => el.classList.remove('activo'));
    document.getElementById(id).classList.add('activo');
}
window.onload = () => mostrarApartado('productos');

// Variables globales
let productos = [];
let carrito = [];
let direccionGuardada = "";
let pagoExitoso = false;
let datosPago = {};
const productosGrid = document.querySelector(".productos-grid");
const carritoContenido = document.getElementById("carrito-contenido");
const resumenCompra = document.getElementById("resumen-compra");
const domicilioForm = document.getElementById("domicilio-form");
const direccionInput = document.getElementById("direccion");
const direccionMsg = document.getElementById("direccion-guardada");
const pagoForm = document.getElementById("pago-form");
const pagoExito = document.getElementById("pago-exito");
const botonPDF = document.getElementById("generar-pdf");

// Cargar productos desde productos.json
fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productos = data;
    renderizarProductos();
  });

function renderizarProductos() {
    productosGrid.innerHTML = "";
    productos.forEach((producto, idx) => {
        const productoHTML = `
            <div class="producto" data-index="${idx}">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3 class="info-rosa">${producto.nombre}</h3>
                <p class="info-rosa">Precio: $${producto.precio}</p>
                <button class="agregar-carrito">Agregar al carrito</button>
            </div>
        `;
        productosGrid.innerHTML += productoHTML;
    });
    // Agregar evento a los botones
    document.querySelectorAll(".agregar-carrito").forEach((button, idx) => {
        button.addEventListener("click", () => {
            const producto = productos[idx];
            const itemEnCarrito = carrito.find(p => p.nombre === producto.nombre);
            if (itemEnCarrito) {
                itemEnCarrito.cantidad += 1;
            } else {
                carrito.push({...producto, cantidad: 1});
            }
            actualizarCarrito();
        });
    });
}

function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoContenido.innerHTML = "<p class='info-rosa'>El carrito está vacío.</p>";
        resumenCompra.style.display = "none";
        domicilioForm.style.display = "none";
        pagoForm.style.display = "none";
        botonPDF.style.display = "none";
        return;
    }
    carritoContenido.innerHTML = carrito.map(item => `
        <div>
            ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}
            <button class="eliminar" data-producto="${item.nombre}">Eliminar</button>
        </div>
    `).join("");
    document.querySelectorAll(".eliminar").forEach(b => {
        b.addEventListener("click", e => {
            const nombre = e.target.getAttribute("data-producto");
            carrito = carrito.filter(item => item.nombre !== nombre);
            actualizarCarrito();
        });
    });
    mostrarResumenCompra();
    domicilioForm.style.display = "block";
    pagoForm.style.display = direccionGuardada ? "block" : "none";
    botonPDF.style.display = "none";
    pagoExito.textContent = "";
}

function mostrarResumenCompra() {
    let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    resumenCompra.innerHTML = "<h3>Resumen de compra</h3>" +
        carrito.map(item => `<div>${item.nombre} x${item.cantidad} = $${item.precio * item.cantidad}</div>`).join("") +
        `<hr><strong>Total: $${total}</strong>`;
    resumenCompra.style.display = "block";
}

domicilioForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const direccion = direccionInput.value.trim();
    if (direccion.length > 0) {
        direccionGuardada = direccion;
        direccionMsg.textContent = "¡Dirección guardada!";
        pagoForm.style.display = "block";
    }
});

pagoForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre-tarjeta").value.trim();
    const numero = document.getElementById("numero-tarjeta").value.trim();
    const fecha = document.getElementById("fecha-exp").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    if (nombre && numero.length >= 16 && fecha && cvv.length >= 3) {
        datosPago = {
            nombre,
            numero: "**** **** **** " + numero.slice(-4),
            fecha,
        };
        pagoExito.textContent = "¡Pago realizado con éxito!";
        pagoExitoso = true;
        botonPDF.style.display = "inline-block";
    } else {
        pagoExito.textContent = "Datos incorrectos. Revisa los campos.";
    }
});

botonPDF.addEventListener("click", () => {
    if(!pagoExitoso || !direccionGuardada) {
        alert("Primero paga y pon tu dirección.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(14);
    doc.text("Ticket de compra JOLMAR", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("Fecha: " + new Date().toLocaleString(), 10, y);
    y += 10;
    doc.text("Dirección de envío:", 10, y);
    y += 8;
    doc.text(direccionGuardada, 10, y);
    y += 10;
    doc.text("Productos:", 10, y);
    y += 8;
    let total = 0;
    carrito.forEach(item => {
        doc.text(`${item.nombre} x${item.cantidad} = $${item.precio * item.cantidad}`, 12, y);
        y += 8;
        total += item.precio * item.cantidad;
    });
    y += 5;
    doc.text(`Total: $${total}`, 10, y);
    y += 10;
    doc.text("Pago realizado con:", 10, y);
    y += 8;
    doc.text(`Titular: ${datosPago.nombre || ""}`, 10, y);
    y += 7;
    doc.text(`Tarjeta: ${datosPago.numero || ""}`, 10, y);
    y += 7;
    doc.text(`Expira: ${datosPago.fecha || ""}`, 10, y);
    doc.save("ticket-jolmar.pdf");
});

// Comentarios usando JSONPlaceholder
const comentarios = [];
const formulario = document.getElementById("comentarios-formulario");
const comentariosLista = document.getElementById("comentarios-lista");

formulario.addEventListener("submit", function(e) {
    e.preventDefault();
    const texto = formulario.comentario.value.trim();
    if (texto) {
        fetch('https://jsonplaceholder.typicode.com/comments', {
            method: 'POST',
            body: JSON.stringify({
                body: texto,
                postId: 1
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => response.json())
        .then(json => {
            comentarios.push(json.body);
            mostrarComentarios();
            formulario.reset();
        })
        .catch(() => {
            alert("Hubo un error al enviar el comentario.");
        });
    }
});

function mostrarComentarios() {
    if (comentarios.length === 0) {
        comentariosLista.innerHTML = "<h3 class='info-rosa'>Comentarios enviados:</h3><p class='info-rosa'>No hay comentarios aún.</p>";
        return;
    }
    comentariosLista.innerHTML = "<h3 class='info-rosa'>Comentarios enviados:</h3>" +
        comentarios.map(c => `<div class="comentario info-rosa">${c}</div>`).join("");
}
mostrarComentarios();